from rest_framework import serializers
from employees.models import Employee
from projectmanager.models import ProjManager
from employees.serializers import EmployeeSerializer
from projectmanager.serializers import ProjManagerSerializer
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    managers = serializers.PrimaryKeyRelatedField(queryset=ProjManager.objects.all(), many=True)
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), many=True)
    
    class Meta:
        model = Project
        fields = '__all__'

