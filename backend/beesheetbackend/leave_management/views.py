from rest_framework.views import APIView
from employees.serializers import EmployeeSerializer
from employees.models import Employee
from projectmanager.models import ProjManager
from leave_management.serializers import LeaveApplicationSerializer, LeaveSummarySerializer , LeaveTypeSerializer, ManagerLeaveApplicationSerializer
from leave_management.models import LeaveApplication, LeaveSummary , LeaveType, ManagerLeaveAction, ManagerLeaveApplication
from rest_framework.response import Response
from django.http import Http404
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta , date


# Create your views here. 

class LeaveApplicationAll(APIView):
    def get(self, request, format=None):
        leave_applications = LeaveApplication.objects.all()
        serializer = LeaveApplicationSerializer(leave_applications, many=True)
        return Response(serializer.data)
from django.db.models import Q
#leave application api methods here for mananger's ui
class LeaveApplicationList(APIView):
    def get(self, request, pk, format=None):
        leave_application = LeaveApplication.objects.get(pk=pk)
        serializer = LeaveApplicationSerializer(leave_application)

        # Response data
        response_data = serializer.data

        # Include manager names, IDs, decisions/actions, and statuses
        manager_decisions = {}
        
        if leave_application.manager_statuses:
            for manager_id, action in leave_application.manager_statuses.items():
                try:
                    manager = ProjManager.objects.get(pk=int(manager_id))
                    manager_decisions[manager.manager_name] = {
                        'id': manager.id,
                        'action': action,
                        'status': 'APPROVED' if action.upper() == 'APPROVE' else 'REJECTED' if action.upper() == 'REJECT' else 'PENDING'
                    }
                except ProjManager.DoesNotExist:
                    manager_decisions['Unknown Manager'] = {
                        'id': manager_id,
                        'action': action,
                        'status': 'APPROVED' if action.upper() == 'APPROVE' else 'REJECTED' if action.upper() == 'REJECT' else 'PENDING'
                    }

        response_data['manager_decisions'] = manager_decisions

        return Response(response_data)
    
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
        try:
            leave_application = LeaveApplication.objects.get(pk=leave_app_id)
            manager = ProjManager.objects.get(pk=managerId)
            action = request.data.get('action')
            is_ui_decision = request.data.get('is_ui_decision', False)
            is_superuser = request.user.is_superuser

            if leave_application.end_date < date.today():
                return Response({'error': 'End date of leave application has passed. Status cannot be changed.'}, status=status.HTTP_400_BAD_REQUEST)

            if action == 'reject':
                leave_application.status = 'REJECTED'
            elif action == 'pending':
                leave_application.status = 'PENDING'
            elif action == 'approve':
                # Add manager to the list of managers who approved
                leave_application.managers.add(manager)
                leave_application.status = 'APPROVED'

            # Update manager-specific status
            if leave_application.manager_statuses is None:
                leave_application.manager_statuses = {}
            leave_application.manager_statuses[str(manager.id)] = action.upper()

            # Update employee view status if any manager has approved
            if any(manager_status == 'APPROVE' for manager_status in leave_application.manager_statuses.values()):
                leave_application.employee_view_status = 'Approved'

            # Save the leave application
            leave_application.save()

            # Create ManagerLeaveAction instance for the current manager's action
            ManagerLeaveAction.objects.create(manager=manager, leave_application=leave_application, action=action.upper())

            # Serialize the leave application
            serializer = LeaveApplicationSerializer(leave_application)

            # Response data to be sent to UI
            response_data = {'leave_application': serializer.data}
            if is_ui_decision:
                return Response(response_data)

            return Response(response_data)

        except LeaveApplication.DoesNotExist:
            raise Http404("Leave application not found")
        


class SuperuserStatusChangeView(APIView):
    def patch(self, request, leave_app_id):
        leave_application = LeaveApplication.objects.get(pk=leave_app_id)
        action = request.data.get('action')
        
        # Check if the end date of the leave application has passed
        if leave_application.end_date < datetime.date.today():
            return Response({'error': 'End date of leave application has passed. Status cannot be changed.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Reset the status to None before updating
        leave_application.status = None

        # Apply the action requested by the superuser
        if action == 'approve':
            leave_application.status = 'APPROVED'
        elif action == 'reject':
            leave_application.status = 'REJECTED'            
        elif action == 'pending':
            leave_application.status = 'PENDING'
        
        # Allow superuser to override their previous decision
        leave_application.superuser_changed_status = True

        # Save the updated leave application
        leave_application.save()

        # Serialize and return the updated leave application
        serializer = LeaveApplicationSerializer(leave_application)
        print(serializer)
        return Response(serializer.data)
#cancel leave and delete application and summary
class CancelLeaveApplication(APIView):
    def patch(self, request, empId, leave_app_id):
        try:
            leave_application = LeaveApplication.objects.get(pk=leave_app_id)

            # Check if the leave application status is not 'APPROVED'
            if leave_application.status == 'APPROVED':
                return Response({"error": "Leave application cannot be canceled as it has already been approved."})

            # Check if the employee ID matches the leave application's employee ID
            if leave_application.employee_id != empId:
                return Response({"error": "Unauthorized"})

            # Update the status to 'CANCELLED'
            leave_application.status = 'CANCELLED'
            leave_application.save()

            return Response({'message': 'Leave application cancelled successfully', 'status': leave_application.status})
        except LeaveApplication.DoesNotExist:
            raise Http404("Leave application not found")


  

class LeaveSummaryDetail(APIView):
    def get(self, request, pk):
        try:
            leave_summary = LeaveSummary.objects.get(pk=pk)
            serializer = LeaveSummarySerializer(leave_summary)
            return Response(serializer.data)
        except LeaveSummary.DoesNotExist:
            return Response({'error': 'Leave summary not found'}, status=404)
    
    
#api for types of leaves for leaveapplication form   
class LeaveTypeDetail(APIView):
    def get(self, request):
        leave_types = LeaveType.objects.all()
        serializer = LeaveTypeSerializer(leave_types, many=True)
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

def calculate_leave_days(start_date, end_date, status):
    print("Calculate leave days function called.")
    if status != 'APPROVED':
        print("Leave application is not approved. Total used days calculation skipped.")
        return 0
    total_days = (end_date - start_date).days + 1
    # Exclude Saturdays and Sundays
    leave_days = sum(1 for day in range(total_days) if (datetime(start_date.year, start_date.month, start_date.day) + timedelta(days=day)).weekday() < 5)
    print(f"Total used days calculated: {leave_days}")
    return leave_days


@receiver(post_save, sender=LeaveApplication)
def create_leave_report(sender, instance, created, **kwargs):
    if created and instance.status == 'APPROVED':
        employee = instance.employee
        leave_type_id = instance.leave_type_id
        total_allocated_days = instance.leave_type.days_allocated

        # Try to fetch the existing LeaveSummary instance
        leave_summary_qs = LeaveSummary.objects.filter(employee=employee, leave_type_id=leave_type_id)
        if leave_summary_qs.exists():
            leave_summary = leave_summary_qs.first()
            total_used = leave_summary.total_used
            total_available = leave_summary.total_available
        else:
            total_used = 0
            total_available = total_allocated_days

        LeaveSummary.objects.create(
            total_available=total_available,
            total_used=total_used,
            leave_type_id=leave_type_id,
            employee=employee
        )
        

@receiver(post_save, sender=LeaveApplication)
def update_leave_report(sender, instance, created, **kwargs):
    if instance.status == 'APPROVED' and created:
        employee = instance.employee
        leave_type_id = instance.leave_type_id

        # Check if the leave application is approved before calculating total used days
        if instance.status == 'APPROVED':
            total_used_days = calculate_leave_days(instance.start_date, instance.end_date, instance.status)
        else:
            total_used_days = 0

        # Fetch the existing leave report for the employee and leave type
        leave_report_qs = LeaveSummary.objects.filter(employee=employee, leave_type_id=leave_type_id)
        if leave_report_qs.exists():
            leave_report = leave_report_qs.first()
            # Update total used days and total available days
            leave_report.total_used += total_used_days
            leave_report.total_available -= total_used_days
            leave_report.save()
        else:
            LeaveSummary.objects.create(
                total_available=0,  # Assuming initial total available days is 0
                total_used=total_used_days,
                leave_type_id=leave_type_id,
                employee=employee
            )
            
from datetime import datetime, timedelta
#Count of leaves
class LeaveSummaryData(APIView):
    def get(self, request, emp_id):
        try:
            employee = Employee.objects.get(pk=emp_id)
            leave_applications = LeaveApplication.objects.filter(employee=employee)
            leave_types = LeaveType.objects.all()

            leave_type_data = {}
            total_leave_count = 0

            for leave_type in leave_types:
                leave_type_data[leave_type.id] = {
                    'name': leave_type.name,
                    'days_allocated': leave_type.days_allocated,
                    'total_available': leave_type.days_allocated,  # Initialize total available days with allocated days
                    'total_used': 0
                }

            for leave_application in leave_applications:
                leave_type = leave_application.leave_type
                leave_summary = LeaveSummary.objects.filter(employee=employee, leave_type=leave_type).first()
                total_available = leave_summary.total_available if leave_summary else leave_type.days_allocated

                if leave_application.status == 'APPROVED':
                    total_used = self.calculate_leave_days(leave_application.start_date, leave_application.end_date)
                    leave_type_data[leave_type.id]['total_used'] += total_used
                    total_leave_count += total_used

                    # Subtract approved leave days from total available days
                    leave_type_data[leave_type.id]['total_available'] -= total_used

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
        leave_days = sum(1 for day in range(total_days) if (start_date + timedelta(days=day)).weekday() < 5)
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
import logging

# Create a logger instance
logger = logging.getLogger(__name__)

class ManagerLeaveApplicationCreate(APIView):
    
    def get(self, request):
        try:
            leaves = ManagerLeaveApplication.objects.all()
            serializer = ManagerLeaveApplicationSerializer(leaves, many=True)
            data = serializer.data

            # Add leave type name to each serialized object
            for entry in data:
                leave_type_id = entry['leave_type']
                leave_type_name = LeaveType.objects.get(pk=leave_type_id).name
                entry['leave_type_name'] = leave_type_name

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log the exception
            logger.error(f"An error occurred while fetching leave applications: {str(e)}")
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, manager_Id):
        try:
            # Retrieve the ProjManager instance
            manager_instance = ProjManager.objects.get(pk=manager_Id)
        except ProjManager.DoesNotExist:
            # Log the error
            logger.error(f"Manager with ID {manager_Id} not found")
            return Response({'error': 'Manager not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Assuming you have already validated and authenticated the manager
            serializer = ManagerLeaveApplicationSerializer(data=request.data)
            if serializer.is_valid():
                print(100)
                print(serializer)
                    
                # Set the manager instance
                serializer.validated_data['manager'] = manager_instance
                # Save the leave application
                leave_application = serializer.save()
                return Response(ManagerLeaveApplicationSerializer(leave_application).data, status=status.HTTP_201_CREATED)
            # Log the validation errors
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log any other exceptions
            logger.error(f"An error occurred while creating leave application: {str(e)}")
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import datetime
        
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
    
    
class ManagerLeaveSummaryData(APIView):
    def get(self, request, manager_id):
        try:
            manager = ProjManager.objects.get(pk=manager_id)
            manager_projects = manager.projects.all()
            employees_in_manager_projects = Employee.objects.filter(project__in=manager_projects)
            
            leave_types = LeaveType.objects.all()
            leave_type_data = {}
            total_leave_count = 0

            for leave_type in leave_types:
                leave_type_data[leave_type.id] = {
                    'name': leave_type.name,
                    'days_allocated': leave_type.days_allocated,
                    'total_available': leave_type.days_allocated,  # Initialize total available days with allocated days
                    'total_used': 0
                }

            for employee in employees_in_manager_projects:
                leave_applications = LeaveApplication.objects.filter(employee=employee)
                for leave_application in leave_applications:
                    leave_type = leave_application.leave_type
                    total_used = self.calculate_leave_days(leave_application.start_date, leave_application.end_date)
                    leave_type_data[leave_type.id]['total_used'] += total_used
                    total_leave_count += total_used

                    # Subtract approved leave days from total available days
                    leave_type_data[leave_type.id]['total_available'] -= total_used

            response_data = {
                'leave_types': leave_type_data,
                'total_leave_count': total_leave_count
            }

            return Response(response_data)
        except ProjManager.DoesNotExist:
            return Response({'error': 'Manager not found'})

    def calculate_leave_days(self, start_date, end_date):
        total_days = (end_date - start_date).days + 1
        # Exclude Saturdays and Sundays
        leave_days = sum(1 for day in range(total_days) if (start_date + timedelta(days=day)).weekday() < 5)
        return leave_days
