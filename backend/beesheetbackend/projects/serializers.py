from rest_framework import serializers
from employees.models import Employee
from projectmanager.models import ProjManager
from employees.serializers import EmployeeSerializer
from projectmanager.serializers import ProjManagerSerializer
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    managers = serializers.PrimaryKeyRelatedField(queryset=ProjManager.objects.all(), many=True)
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), many=True)
    assigned_to_names = serializers.SerializerMethodField()  # Custom method field for names
    manager_names = serializers.SerializerMethodField() # Custom method field for names
    
    class Meta:
        model = Project
        fields = '__all__'

    def get_assigned_to_names(self, obj):
        return [employee.name for employee in obj.assigned_to.all()]
    
    def get_manager_names(self, obj):
        return [employee.name for employee in obj.managers.all()]
