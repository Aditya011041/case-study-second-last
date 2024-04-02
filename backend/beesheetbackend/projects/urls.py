from django.contrib import admin
from django.urls import path
from projects import views

urlpatterns = [
    path('projects/', views.ProjectCreateView.as_view()),
    path('projects/<int:pk>/', views.EmpProject.as_view()),
    path('all-project/' , views.AllProject.as_view()),
    path('employee-projects/<int:employee_id>/', views.EmployeeProjectDetails.as_view()),
    path('edit-projects/<int:pk>/', views.ProjectUpdateAPIView.as_view(), name='project-update'),
    path('assigned-employees-and-managers/<int:pk>/', views.AssignedEmployeesAndManagersAPIView.as_view(), name='project_assigned_employees_managers'),
    path('delete-projects/<int:pk>/<int:employee_id>/', views.ProjectDeleteAPIView.as_view(), name='project-delete'),
    path('manager-delete-projects/<int:pk>/<int:manager_id>/', views.ProjectManagerDeleteAPIView.as_view(), name='project-delete')


    
    
]
