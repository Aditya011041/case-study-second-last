from django.urls import path
from .views import ManagerView , OneManagerView , ManagerEmployees

urlpatterns = [
    path('manager/' , ManagerView.as_view()),
    path('manager/<int:pk>/' , OneManagerView.as_view())
]
