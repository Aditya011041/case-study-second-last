from django.contrib import admin
from django.urls import path
from projects import views

urlpatterns = [
    path('projects/', views.ProjectCreateView.as_view()),
    path('projects/<int:pk>/', views.EmpProject.as_view()),
]
