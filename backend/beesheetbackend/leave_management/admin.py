from django.contrib import admin
from .models import LeaveApplication , LeaveSummary , LeaveType, ManagerLeaveApplication  

admin.site.register(LeaveApplication)
admin.site.register(LeaveSummary)
admin.site.register(LeaveType)
admin.site.register(ManagerLeaveApplication)