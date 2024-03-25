from rest_framework import serializers
from notifications.models import LeaveNotification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveNotification
        fields = '__all__'
