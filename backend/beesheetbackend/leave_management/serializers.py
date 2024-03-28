from rest_framework import serializers

from leave_management.models import ManagerLeaveApplication
from projectmanager.models import ProjManager
from .models import LeaveApplication, LeaveSummary , LeaveType, ManagerLeaveAction


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = '__all__'

class LeaveApplicationSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_email = serializers.SerializerMethodField()
    leave_type_name = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    manager_statuses = serializers.SerializerMethodField()

    class Meta:
        model = LeaveApplication
        fields = '__all__'

    def get_employee_name(self, obj):
        return obj.employee.name if obj.employee else None

    def get_employee_email(self, obj):
        return obj.employee.email if obj.employee else None

    def get_leave_type_name(self, obj):
        return obj.leave_type.name if obj.leave_type else None
    
    def get_manager_name(self, obj):
        return [manager.name for manager in obj.managers.all()] if obj.managers.exists() else None
    
    def get_manager_statuses(self, obj):
        manager_statuses = obj.manager_statuses
        manager_decisions = []

        if manager_statuses:
            for manager_id, status in manager_statuses.items():
                manager_info = ProjManager.objects.filter(pk=manager_id).values('id', 'name').first()
                if manager_info:
                    manager_decisions.append({'id': manager_info['id'], 'name': manager_info['name'], 'action': status})
                else:
                    manager_decisions.append({'id': manager_id, 'name': 'Unknown', 'action': 'waiting'}) 
        return manager_decisions





class ManagerLeaveApplicationSerializer(serializers.ModelSerializer):
    manager_name = serializers.SerializerMethodField()
    manager_email = serializers.SerializerMethodField()
    leave_type = serializers.SerializerMethodField()

    class Meta:
        model = ManagerLeaveApplication
        fields = '__all__'

    def get_manager_name(self, obj):
        return obj.manager.name if obj.manager else None
    
    def get_manager_email(self, obj):
        return obj.manager.email if obj.manager else None
    
    def get_leave_type(self, obj):
        return obj.leave_type.name if obj.leave_type else None
        
    # def get_manager_name(self, obj):
    #     return obj.manager.name if obj.manager else None

    # def get_manager_email(self, obj):
    #     return obj.manager.email if obj.manager else None
    


class LeaveSummarySerializer(serializers.ModelSerializer):
    leave_type = LeaveTypeSerializer() 
    class Meta:
        model = LeaveSummary
        fields = '__all__'
      
class ManagerLeaveActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerLeaveAction
        fields = '__all__'


