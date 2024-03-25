from django.urls import path
from . views import *

urlpatterns = [
    path('manager-notifications/<int:manager_id>' , NotificationView.as_view()),
    path('manager-read-all/<int:manager_id>' , ReadAllNotifications.as_view()),
]