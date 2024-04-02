from django.shortcuts import render
from rest_framework.views import APIView
from employees.customAuth import EmailOrUsernameModelBackend
from projects.serializers import ProjectSerializer
from projectmanager.models import ProjManager
from projects.models import Project
from projectmanager.serializers import ProjManagerSerializer
from rest_framework.response import Response
from employees.models import Employee
from employees.serializers import EmployeeSerializer
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated

class ManagerView(APIView):
    
    def get(self, request,  format=None):
        managers = ProjManager.objects.all()
        serializer  = ProjManagerSerializer(managers , many=True)
        return Response(serializer.data)
    
    
#getting information about a project manager ----------------------
class OneManagerView(APIView):
    pagination_class = PageNumberPagination
    pagination_class.page_size = 2  # Set the number of items per page to 2

    def get(self, request, pk, format=None):
        try:
            manager = ProjManager.objects.get(pk=pk)
        except ProjManager.DoesNotExist:
            return Response({"error": "Manager does not exist"})

        manager_serializer = ProjManagerSerializer(manager)

        # Get all projects managed by this manager
        projects = Project.objects.filter(managers=manager)
        projects_serializer = ProjectSerializer(projects, many=True)

        # Get all employees related to this manager
        employees = Employee.objects.filter(project__in=projects).distinct().order_by('id')
        
        employee_name = request.query_params.get('employee_name', '')
        if employee_name:
            employees = employees.filter(name__icontains=employee_name)
            employee_name = request.query_params.get('employee_name', '')

        
        paginator = PageNumberPagination()
        employees_page = paginator.paginate_queryset(employees, request)
        employees_serializer = EmployeeSerializer(employees_page, many=True)

        # Get individual projects of the employees
        individual_projects = []
        for employee in employees_page:
            employee_projects = Project.objects.filter(assigned_to=employee)
            employee_projects_serializer = ProjectSerializer(employee_projects, many=True)
            for project_data in employee_projects_serializer.data:
                # Process individual project data
                project_assigned_to = project_data.get('assigned_to', [])
                assigned_to_details = []
                for assigned_to_id in project_assigned_to:
                    try:
                        assigned_to_employee = Employee.objects.get(pk=assigned_to_id)
                        assigned_to_details.append({'id': assigned_to_id, 'name': assigned_to_employee.name})
                    except Employee.DoesNotExist:
                        pass
                project_data['assigned_to'] = assigned_to_details
                
                project_managers = project_data.get('managers', [])
                manager_details = []
                for manager_id in project_managers:
                    try:
                        manager = ProjManager.objects.get(pk=manager_id)
                        manager_details.append({'id': manager_id, 'name': manager.name})
                    except ProjManager.DoesNotExist:
                        pass
                project_data['managers'] = manager_details

            individual_projects.append({
                'employee_id': employee.id,
                'projects': employee_projects_serializer.data
            })

        # Modify the projects_under_manager data to include names and ids for assigned_to and managers
        projects_under_manager_data = []
        for project_data in projects_serializer.data:
            project_assigned_to = project_data.get('assigned_to', [])
            assigned_to_details = []
            for assigned_to_id in project_assigned_to:
                try:
                    assigned_to_employee = Employee.objects.get(pk=assigned_to_id)
                    assigned_to_details.append({'id': assigned_to_id, 'name': assigned_to_employee.name})
                except Employee.DoesNotExist:
                    pass
            project_data['assigned_to'] = assigned_to_details
            
            project_managers = project_data.get('managers', [])
            manager_details = []
            for manager_id in project_managers:
                try:
                    manager = ProjManager.objects.get(pk=manager_id)
                    manager_details.append({'id': manager_id, 'name': manager.name})
                except ProjManager.DoesNotExist:
                    pass
            project_data['managers'] = manager_details
            
            projects_under_manager_data.append(project_data)

        response_data = {
            'manager': manager_serializer.data,
            'projects_under_manager': projects_under_manager_data,
            'employees': employees_serializer.data,
            'individual_projects': individual_projects,
            'pagination': {
                'total_pages': paginator.page.paginator.num_pages,
                'next': paginator.get_next_link(),
                'previous': paginator.get_previous_link(),
            }
        }
        
        return Response(response_data)


class ManagerEmployees(APIView):
    def get(self, request, pk, format=None):
        try:
            manager = ProjManager.objects.get(pk=pk)
        except ProjManager.DoesNotExist:
            return Response({"error": "Manager does not exist"})

        employees = Employee.objects.filter(project__managers=manager)
        paginator = PageNumberPagination()
        employees_page = paginator.paginate_queryset(employees, request)
        employees_serializer = EmployeeSerializer(employees_page, many=True)

        response_data = {
            'employees': employees_serializer.data,
            'pagination': {
                'total_pages': paginator.page.paginator.num_pages,
                'next': paginator.get_next_link(),
                'previous': paginator.get_previous_link(),
            }
        }
        
        return Response(response_data)