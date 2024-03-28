from rest_framework.views import APIView
from rest_framework.response import Response
from employees.models import Employee
from employees.serializers import EmployeeSerializer
from projectmanager.models import ProjManager
from projectmanager.serializers import ProjManagerSerializer
from projects.models import Project
from projects.serializers import ProjectSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404

class EmployeeId(APIView):
    def get(self, request):
        employees = Employee.objects.all()
        employee_serializer = EmployeeSerializer(employees, many=True)
        return Response(employee_serializer.data)
    
    def post(self, request, format=None):
        is_manager = request.data.get('is_manager', False)  # Check if the request includes is_manager field
        if is_manager:
            serializer = ProjManagerSerializer(data=request.data)
        else:
            serializer = EmployeeSerializer(data=request.data)

        if serializer.is_valid():
            # Hash the password before saving
            hashed_password = make_password(request.data['password'])
            serializer.validated_data['password'] = hashed_password
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, pk):
        try:
            employee = Employee.objects.get(pk=pk)
            serializer = EmployeeSerializer(employee, data=request.data , partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class EmpList(APIView):
    def get(self, request, pk, format=None):
        try:
            employee = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        employee_serializer = EmployeeSerializer(employee)
        
        # Order projects by some field (e.g., id) to ensure consistent pagination
        projects = Project.objects.filter(assigned_to=employee).order_by('id')
        
        project_name = request.query_params.get('project_name', '')
        if project_name:
            projects = projects.filter(title__icontains=project_name)
        
        
        paginator = PageNumberPagination()
        paginated_projects = paginator.paginate_queryset(projects, request)
        project_serializer = ProjectSerializer(paginated_projects, many=True)
        
        projectsMan = ProjManager.objects.filter(projects__in=projects).distinct()
        projectMan_serializer = ProjManagerSerializer(projectsMan, many=True)
        
        data = {
            'employee': employee_serializer.data,
            'managers': projectMan_serializer.data,
            'projects': project_serializer.data,
            'pagination': {
                'total_pages': paginator.page.paginator.num_pages,
                'next': paginator.get_next_link(),
                'previous': paginator.get_previous_link(),
            }
        }
        return Response(data)
    
    def post(self, request, format=None):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Login(APIView):
    
    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')
        # Attempt authentication for Default User
        default_user = User.objects.filter(email=email).first()
        if default_user and default_user.check_password(password):
            token = AccessToken.for_user(default_user)
            return JsonResponse({'token': str(token), 'emp_id': default_user.id, 'is_manager': False, 'manager_Id': None, 'message': 'Welcome to Beehyv admin' , 'superuser': True})
        user = authenticate(request, email=email , password=password)
        # Attempt authentication for Employee
        if user is not None:
            is_manager = isinstance(user, ProjManager)
            manager_ki_id = None
            if is_manager:
                manager_ki_id = user.id
#jwt token generating using from rest_framework_simplejwt.tokens import AccessToken
            token = AccessToken.for_user(user)
       

            return JsonResponse({'token': str(token), 'emp_id': user.id, 'is_manager': is_manager, 'manager_Id': manager_ki_id , 'message' : 'Welcome to Beehyv' })
        else:
            return JsonResponse({'error': 'Wrong credentials'}, status=400)
    
    
    