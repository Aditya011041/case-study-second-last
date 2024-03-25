from django.db import models
from employees.models import Employee
from projectmanager.models import ProjManager


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

    def __str__(self):
        return f"{self.employee.name} - {self.leave_type.name}"
    
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

    

