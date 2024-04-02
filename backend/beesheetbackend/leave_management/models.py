from django.db import models
from employees.models import Employee
from projectmanager.models import ProjManager
from datetime import datetime, timedelta , date
from django.dispatch import receiver

#model for types of leaves : --------------------------------
class LeaveType(models.Model):
    # CASUAL = 'Casual'
    # SICK = 'Sick'
    # EMERGENCY = 'Emergency'
    # WFH = 'Work from Home'

    # LEAVE_TYPE_CHOICES = [
    #     (CASUAL, 'Casual'),
    #     (SICK, 'Sick'),
    #     (EMERGENCY, 'Emergency'),
    #     (WFH, 'Work from Home'),
    # ]

    name = models.CharField(max_length=100)
    days_allocated = models.PositiveIntegerField()


    def __str__(self):
        return self.name
 
#model for leave application : --------------------------------    
class LeaveApplication(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(default='PENDING', max_length=20)
    managers = models.ManyToManyField(ProjManager, blank=True)
    superuser_changed_status = models.BooleanField(default=False)
    reason = models.TextField(blank=True)
    final_rejection_manager = models.ForeignKey(ProjManager, related_name='final_rejected_leaves', null=True, blank=True, on_delete=models.SET_NULL)
    employee_view_status = models.CharField(max_length=20, default='PENDING')
    manager_statuses = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.employee.name} - {self.leave_type.name}"
    def calculate_leave_days(self, start_date, end_date):
        total_days = (end_date - start_date).days + 1
        leave_days = sum(1 for day in range(total_days) if (datetime(start_date.year, start_date.month, start_date.day) + timedelta(days=day)).weekday() < 5)
        return leave_days
    
class ManagerLeaveApplication(models.Model):
    manager = models.ForeignKey(ProjManager , on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(default='PENDING', max_length=20)
    superuser_changed_status = models.BooleanField(default=False)
    reason = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.manager.name} - {self.leave_type.name}"
    

#model for summary of leaves : --------------------------------
class LeaveSummary(models.Model):
    employee = models.ManyToManyField(Employee)
    total_available = models.PositiveIntegerField(default=0)
    total_used = models.PositiveIntegerField(default=0)
    leave_type = models.ForeignKey(LeaveType  , on_delete = models.CASCADE , null=True)



class ManagerLeaveAction(models.Model):
    manager = models.ForeignKey(ProjManager, on_delete=models.CASCADE)
    leave_application = models.ForeignKey(LeaveApplication, on_delete=models.CASCADE)
    action = models.CharField(max_length=20)  # Action taken by the manager (e.g., 'APPROVE', 'REJECT', 'PENDING')
    timestamp = models.DateTimeField(default=datetime.now)  # Timestamp when the action was taken

    def __str__(self):
        return f"{self.manager.name} - {self.leave_application.employee.name} - {self.leave_application.leave_type.name}"