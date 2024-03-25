from rest_framework import serializers

from leave_management.models import ManagerLeaveApplication
from projectmanager.models import ProjManager
from .models import LeaveApplication, LeaveSummary , LeaveType


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = '__all__'

class LeaveApplicationSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_email = serializers.SerializerMethodField()
    leave_type_name = serializers.SerializerMethodField()
   

    class Meta:
        model = LeaveApplication
        fields = '__all__'
# getting some attributes of Employee and Leave type models for leaveapplication object
    def get_employee_name(self, obj):
        return obj.employee.name if obj.employee else None

    def get_employee_email(self, obj):
        return obj.employee.email if obj.employee else None

    def get_leave_type_name(self, obj):
        return obj.leave_type.name if obj.leave_type else None

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
      



