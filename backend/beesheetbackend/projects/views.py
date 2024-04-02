from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer
from employees.models import Employee
from projectmanager.models import ProjManager

class ProjectCreateView(APIView):
    def post(self, request, format=None):
        serializer = ProjectSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the project
            project = serializer.save()

            # Extract assigned_to and managers IDs from request data
            assigned_to_ids = request.data.get('assigned_to', [])
            manager_ids = request.data.get('managers', [])

            try:
                # Get assigned_to and managers objects from database
                assigned_to_objects = Employee.objects.filter(id__in=assigned_to_ids)
                manager_objects = ProjManager.objects.filter(id__in=manager_ids)

                # Update assigned_to and managers fields
                project.assigned_to.set(assigned_to_objects)
                project.managers.set(manager_objects)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Employee.DoesNotExist:
                return Response({"error": "One or more employee IDs are invalid"}, status=status.HTTP_400_BAD_REQUEST)
            except ProjManager.DoesNotExist:
                return Response({"error": "One or more manager IDs are invalid"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmpProject(APIView):
    def get(self, request, pk, format=None):
        try:
            employee = Employee.objects.filter(pk=pk)
            project = Project.objects.get(assigned_to=employee)
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({"error": "Project does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        
class AllProject(APIView):
    def get(self, request, format=None):
        try:
            projects = Project.objects.all()
            serializer = ProjectSerializer(projects, many=True)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({"error": "Project does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        
class EmployeeProjectDetails(APIView):
    def get(self, request, employee_id, format=None):
        try:
            # Get the employee object
            employee = Employee.objects.get(pk=employee_id)
            
            # Get all projects assigned to the employee
            projects = Project.objects.filter(assigned_to=employee)
            
            # Serialize the projects data
            serializer = ProjectSerializer(projects, many=True)
            
            # Get all managers related to the employee's projects
            manager_ids = ProjManager.objects.filter(projects__in=projects).values_list('id', flat=True)
            managers = ProjManager.objects.filter(id__in=manager_ids)
            
            # Return the projects and managers data
            return Response({
                'projects': serializer.data,
                'managers': [{'id': manager.id, 'name': manager.name} for manager in managers]
            })
        except Employee.DoesNotExist:
            return Response({"error": "Employee does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        


class ProjectUpdateAPIView(APIView):
    def patch(self, request, pk=None):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({"message": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectSerializer(project, data=request.data, partial=True)
        
        if serializer.is_valid():
            try:
                serializer.save()
                # Update assigned employees and managers if provided in the request
                assigned_employees = request.data.get('assignedEmployees', [])
                assigned_managers = request.data.get('assignedManagers', [])

                # Assuming Project model has many-to-many fields for assigned employees and managers
                if assigned_employees:
                    project.assigned_to.set(assigned_employees)
                if assigned_managers:
                    project.managers.set(assigned_managers)
                return Response(serializer.data)
            except Exception as e:
                return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDeleteAPIView(APIView):
    def delete(self, request, pk, employee_id=None):
        try:
            if employee_id:
                project = Project.objects.get(pk=pk)
                employee = Employee.objects.get(pk=employee_id)
                project.assigned_to.remove(employee)
                message = "Employee removed from project successfully"
            else:
                return Response({"message": "Entity does not exist"}, status=status.HTTP_404_NOT_FOUND)
            
            # You may need to handle other operations like saving the project
            return Response({"message": message})
        except Project.DoesNotExist:
            return Response({"message": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Employee.DoesNotExist:
            return Response({"message": "Employee does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
class ProjectManagerDeleteAPIView(APIView):
    def delete(self, request, pk, manager_id=None):
        try:
            if manager_id:
                project = Project.objects.get(pk=pk)
                manager = ProjManager.objects.get(pk=manager_id)
                project.managers.remove(manager)
                message = "Manager removed from project successfully"
            else:
                return Response({"message": "Manager ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            # You may need to handle other operations like saving the project
            return Response({"message": message})
        except Project.DoesNotExist:
            return Response({"message": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except ProjManager.DoesNotExist:
            return Response({"message": "Manager does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)      
    
class AssignedEmployeesAndManagersAPIView(APIView):
    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            assigned_employees = project.assigned_to.all()
            assigned_managers = project.managers.all()

            assigned_employees_data = [{'id': employee.id, 'name': employee.name} for employee in assigned_employees]
            assigned_managers_data = [{'id': manager.id, 'name': manager.name} for manager in assigned_managers]

            # Get all employees and managers
            all_employees = [{'id': employee.id, 'name': employee.name} for employee in Employee.objects.all()]
            all_managers = [{'id': manager.id, 'name': manager.name} for manager in ProjManager.objects.all()]

            return Response({
                'assigned_employees': assigned_employees_data,
                'assigned_managers': assigned_managers_data,
                'all_employees': all_employees,
                'all_managers': all_managers
            })
        except Project.DoesNotExist:
            return Response({"message": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)