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