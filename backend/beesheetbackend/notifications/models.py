from django.db import models
from projects.models import Project
from employees.models import Employee
from projectmanager.models import ProjManager
from leave_management.models import LeaveApplication
from django.db.models.signals import post_save
from django.dispatch import receiver

class LeaveNotification(models.Model):
    sender = models.ForeignKey(Employee , related_name = 'sender' , on_delete = models.CASCADE , null=True)
    recipient = models.ForeignKey(ProjManager, related_name ='recipient', on_delete = models.CASCADE , null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True,)
    notification_read_status  = models.BooleanField(default=False)

#create a default notification message after creation of the leave application
@receiver(post_save, sender=LeaveApplication)
def trigger_notification(sender, instance, created, **kwargs):
    if created:
        employee = instance.employee

        employee_projects = Project.objects.filter(assigned_to=employee)

        managers = ProjManager.objects.filter(projects__in=employee_projects).distinct()
        for manager in managers:
            message = f"Leave application from {employee.name} for {instance.leave_type} submitted."
            LeaveNotification.objects.create(sender=employee, recipient=manager, message=message)
