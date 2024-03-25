from rest_framework.views import APIView
from employees.serializers import EmployeeSerializer
from employees.models import Employee
from projectmanager.models import ProjManager
from leave_management.serializers import LeaveApplicationSerializer, LeaveSummarySerializer , LeaveTypeSerializer, ManagerLeaveApplicationSerializer
from leave_management.models import LeaveApplication, LeaveSummary , LeaveType, ManagerLeaveApplication
from rest_framework.response import Response
from django.http import Http404
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
import datetime


# Create your views here. 

class LeaveApplicationAll(APIView):
    def get(self, request, format=None):
        leave_applications = LeaveApplication.objects.all()
        serializer = LeaveApplicationSerializer(leave_applications, many=True)
        return Response(serializer.data)
from django.db.models import Q
#leave application api methods here for mananger's ui
class LeaveApplicationList(APIView):
    def get(self, request,pk, format=None):
        leave_applications = LeaveApplication.objects.get(pk=pk)
        serializer = LeaveApplicationSerializer(leave_applications, many=True)
        return Response(serializer.data)
    
    def post(self, request, pk):
        employee_instance = Employee.objects.get(pk=pk)
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        print(start_date)
        print(end_date)
        overlapping_leave_applications = LeaveApplication.objects.filter(
            Q(employee=employee_instance) &
            (
                (Q(start_date__lte=start_date) & Q(end_date__gte=start_date)) |  # Check if new start date falls within an existing range
                (Q(start_date__lte=end_date) & Q(end_date__gte=end_date)) |      # Check if new end date falls within an existing range
                (Q(start_date__gte=start_date) & Q(end_date__lte=end_date))      # Check if new range completely overlaps an existing range
            )
        )
        print(overlapping_leave_applications)

        if overlapping_leave_applications.exists():
            return Response({'error': 'Leave application cannot be applied as it overlaps with existing leave applications.'}, status=400)
        
        request.data['employee'] = employee_instance.id 
        serializer = LeaveApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def delete(self,request , pk):
        leave_application = LeaveApplication.objects.get(pk=pk)
        leave_application.delete()
        return Response(status=204)

    def patch(self, request, managerId, leave_app_id):
        leave_application = LeaveApplication.objects.get(pk=leave_app_id)
        manager = ProjManager.objects.get(pk=managerId)
        action = request.data.get('action')
        
        if leave_application.end_date < datetime.date.today():
            return Response({'error': 'End date of leave application has passed. Status cannot be changed.'}, status=400)
        
        if leave_application.status == 'REJECTED':
            return Response({'error': 'Leave application has been rejected. Further changes denied.'}, status=400)
        
        if leave_application.superuser_changed_status:
            return Response({'error': 'Status changed by admin. Further changes denied.', 'superuser_changed_status': True}, status=404)
        
        if action in ['approve', 'reject', 'pending']:
            leave_application.status = None

        if action == 'approve':
            leave_application.managers.add(manager)
            leave_application.status = 'APPROVED'
        elif action == 'reject':
            leave_application.status = 'REJECTED'
        elif action == 'pending':
            leave_application.status = 'PENDING'

        leave_application.save()

        serializer = LeaveApplicationSerializer(leave_application)
        manager_decision = {
            'manager_id': manager.id,
            'decision': action  # This could be 'approve', 'reject', or 'pending'
        }
        return Response({'leave_application': serializer.data, 'manager_decision': manager_decision})


class SuperuserStatusChangeView(APIView):
    def patch(self, request, leave_app_id):
        leave_application = LeaveApplication.objects.get(pk=leave_app_id)
        action = request.data.get('action')
        
        if leave_application.end_date < datetime.date.today():
            return Response({'error': 'End date of leave application has passed. Status cannot be changed.'}, status=400)
        
        if action in ['approve', 'reject', 'pending']:
            leave_application.status = None

        if action == 'approve':
            leave_application.status = 'APPROVED'
        elif action == 'reject':
            leave_application.status = 'REJECTED'            
        elif action == 'pending':
            leave_application.status = 'PENDING'
            
        if leave_application.superuser_changed_status:
            return Response({'message': 'Status already changed by admin. Further changes denied.'})
        
        leave_application.superuser_changed_status = True

        leave_application.save()

        serializer = LeaveApplicationSerializer(leave_application)
        return Response(serializer.data)

#cancel leave and delete application and summary
class CancelLeaveApplication(APIView):
    def delete(self, request, empId, leave_app_id):
        try:
            leave_application = LeaveApplication.objects.get(pk=leave_app_id)
            
            # Check if the leave application status is not 'APPROVED'
            if leave_application.status == 'APPROVED':
                return Response({"error": "Leave application cannot be canceled as it has already been approved."})
            if leave_application.status == 'REJECTED':
                return Response({"error": "Leave application cannot be canceled as it has already been approved."})
            
            
            # Check if the employee ID matches the leave application's employee ID
            if leave_application.employee_id != empId:
                return Response({"error": "Unauthorized"})
            
            leave_summary = LeaveSummary.objects.filter(employee=leave_application.employee).first()

            if leave_summary:
                leave_summary.delete()

            leave_application.delete()
            
            update_leave_report(None, leave_application, None)

            return Response({'message': 'Leave application removed successfully'})
        except LeaveApplication.DoesNotExist:
            raise Http404("Leave application not found")


  

class LeaveSummaryDetail(APIView):
    def get(self,request,pk):
        brief = LeaveSummary.objects.get(pk=pk)
        serializer = LeaveSummarySerializer(brief)
        return Response(serializer.data)
    
    
#api for types of leaves for leaveapplication form   
class LeaveTypeDetail(APIView):
    
    # def get_permissions(self):
    #     if self.request.method in ['POST', 'PATCH']:
    #         self.permission_classes = [IsAdminUser]
    #     return super().get_permissions()
    def get(self, request):
        leave_types = LeaveType.objects.all()
        serializer = LeaveTypeSerializer(leave_types, many=True)
        # Assuming you have a user object available in the request
        # is_admin = request.user.is_staff  # Check if the user is an admin
        # data = {
        #     'leave_types': serializer.data,
        #     'isAdmin': is_admin
        # }
        return Response(serializer.data)
    def post(self, request):
        serializer = LeaveTypeSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,)
        return Response(serializer.errors)

    def patch(self, request, pk):
        leave_type = get_object_or_404(LeaveType, pk=pk)
        serializer = LeaveTypeSerializer(leave_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

        



@receiver(post_save, sender=LeaveApplication)
def create_leave_report(sender, instance, created, **kwargs):
    if instance.status == 'APPROVED':
        employee = instance.employee
        leave_type_id = instance.leave_type_id 
        total_allocated_days = instance.leave_type.days_allocated
        total_used_days = calculate_leave_days(instance.start_date, instance.end_date)
        total_available_days = total_allocated_days - total_used_days
        leave_report = LeaveSummary.objects.create(
            total_available=total_available_days,
            total_used=total_used_days,
            leave_type_id=leave_type_id 
        )
        leave_report.employee.set([employee])

@receiver(post_save, sender=LeaveApplication)
def update_leave_report(sender, instance, created, **kwargs):
    if instance.status == 'REJECTED':
        employee = instance.employee
        leave_type_id = instance.leave_type_id 
        total_allocated_days = instance.leave_type.days_allocated
        
        leave_report_qs = LeaveSummary.objects.filter(employee=employee, leave_type_id=leave_type_id)
        if leave_report_qs.exists():
            leave_report = leave_report_qs.first()
            total_used = calculate_leave_days(instance.start_date, instance.end_date)
            total_available_days = leave_report.total_available + total_used
            total_used_days = 0
            leave_report.total_available = total_available_days
            leave_report.total_used = total_used_days
            leave_report.save()
        else:
            leave_report = LeaveSummary.objects.create(
                total_available=total_allocated_days,
                total_used=0,
                leave_type_id=leave_type_id
            )
            leave_report.employee.set([employee])

def calculate_leave_days(start_date, end_date):
    total_days = (end_date - start_date).days + 1
    # Exclude Saturdays and Sundays
    leave_days = sum(1 for day in range(total_days) if (start_date + datetime.timedelta(days=day)).weekday() < 5)
    return leave_days




#Count of leaves
class LeaveSummaryData(APIView):
    def get(self, request, emp_id):
        try:
            employee = Employee.objects.get(pk=emp_id)
            leave_applications = LeaveApplication.objects.filter(employee=employee)
            leave_types = LeaveType.objects.all()

            leave_type_data = {}

            total_leave_count = 0

            if leave_applications.exists():
                for leave_application in leave_applications:
                    leave_type = leave_application.leave_type
                    # Fetch total_available from LeaveSummary instead of LeaveApplication
                    leave_summary = LeaveSummary.objects.filter(employee=employee, leave_type=leave_type).first()
                    total_available = leave_summary.total_available if leave_summary else leave_type.days_allocated
                    leave_type_data[leave_type.id] = {
                        'name': leave_type.name,
                        'days_allocated': leave_type.days_allocated,
                        'total_available': total_available,
                        'total_used': self.calculate_leave_days(leave_application.start_date, leave_application.end_date)
                    }
                    total_leave_count += leave_type_data[leave_type.id]['total_used']
            else:
                for leave_type in leave_types:
                    leave_type_data[leave_type.id] = {
                        'name': leave_type.name,
                        'days_allocated': leave_type.days_allocated,
                        'total_available': leave_type.days_allocated,
                        'total_used': 0
                    }

            response_data = {
                'leave_types': leave_type_data,
                'total_leave_count': total_leave_count
            }

            return Response(response_data)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'})

    def calculate_leave_days(self, start_date, end_date):
        total_days = (end_date - start_date).days + 1
        # Exclude Saturdays and Sundays
        leave_days = sum(1 for day in range(total_days) if (start_date + datetime.timedelta(days=day)).weekday() < 5)
        return leave_days


#to fetch leave application in manager's ui 
class ManagerLeaveApplicationList(APIView):
    serializer_class = LeaveApplicationSerializer

    def get_queryset(self):
        manager_Id = self.kwargs['manager_Id']

        manager = ProjManager.objects.get(id=manager_Id)

        manager_projects = manager.projects.all()

        employees_in_manager_projects = Employee.objects.filter(project__in=manager_projects)

        queryset = LeaveApplication.objects.filter(employee__in=employees_in_manager_projects)
        
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
#to fetch leave application in employee's ui    
class EmployeeApplicationList(APIView):
    serializer_class = LeaveApplicationSerializer
    
    def get_queryset(self):
        emp_id = self.kwargs['emp_id']

        employee = Employee.objects.get(id=emp_id)

        queryset = LeaveApplication.objects.filter(employee = employee)
        
        return queryset
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class ViewDetails(APIView):
    def get(self,request,pk , format=None):
        try:
            employee = Employee.objects.get(pk=pk)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(status='not found')

from rest_framework import status
class ManagerLeaveApplicationCreate(APIView):
    
    def get (self, request):
        leaves = ManagerLeaveApplication.objects.all()
        serializer = ManagerLeaveApplicationSerializer(leaves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, manager_Id):
        try:
            # Retrieve the ProjManager instance
            manager_instance = ProjManager.objects.get(pk=manager_Id)
        except ProjManager.DoesNotExist:
            return Response({'error': 'Manager not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Assuming you have already validated and authenticated the manager
            serializer = ManagerLeaveApplicationSerializer(data=request.data)
            if serializer.is_valid():
                # Set the manager instance
                serializer.validated_data['manager'] = manager_instance
                # Save the leave application
                leave_application = serializer.save()
                return Response(ManagerLeaveApplicationSerializer(leave_application).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class SuperuserManagerLeave(APIView):
    def patch(self, request, leave_app_id):
        leave_application = ManagerLeaveApplication.objects.get(pk=leave_app_id)
        action = request.data.get('action')
        
        if leave_application.end_date < datetime.date.today():
            return Response({'error': 'End date of leave application has passed. Status cannot be changed.'}, status=400)
        
        
        
        if action in ['approve', 'reject', 'pending']:
            leave_application.status = None

        if action == 'approve':
            leave_application.status = 'APPROVED'
        elif action == 'reject':
            leave_application.status = 'REJECTED'            
        elif action == 'pending':
            leave_application.status = 'PENDING'
            
        

        leave_application.save()

        serializer = ManagerLeaveApplicationSerializer(leave_application)
        return Response(serializer.data)
    
class ManagerLeave(APIView):
    def get(self, request, manager_Id, format=None):
        leave_applications = ManagerLeaveApplication.objects.filter(manager_id=manager_Id)
        serializer = ManagerLeaveApplicationSerializer(leave_applications, many=True)
        return Response(serializer.data)