from django.contrib import admin
from django.urls import path
from employees import views

urlpatterns = [
    path('emp/<int:pk>/', views.EmpList.as_view()),
    path('emp/', views.EmployeeId.as_view()),
    path('employee/<int:pk>/', views.EmployeeId.as_view()),
    path('login' , views.Login.as_view()),
]
