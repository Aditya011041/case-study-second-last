from django.urls import path
from . views import *

urlpatterns = [
    path('manager-notifications/<int:manager_id>' , NotificationView.as_view()),
    path('manager-read-all/<int:manager_id>' , ReadAllNotifications.as_view()),
     path('leave-action-notification/', LeaveActionNotification.as_view(), name='leave_action_notification'),
    path('employee-notification/<int:employee_id>/', EmployeeNotification.as_view(), name='employee_notification'),
]