from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import NotificationSerializer
from .models import LeaveNotification


class NotificationView(APIView):
    def get(self, request, manager_id, format=None):
        notifications = LeaveNotification.objects.filter(recipient = manager_id)
        serializer = NotificationSerializer(notifications, many=True)
        notifications.update(notification_read_status=True)
        return Response(serializer.data )
    
    
# api related to notifications ----------------------------------    
class ReadAllNotifications(APIView):
    def get(self, request , manager_id, format=None):
        notifications = LeaveNotification.objects.filter(recipient = manager_id)
        serializer = NotificationSerializer(notifications, many=True)
        notifications.update(notification_read_status=True)
        return Response(serializer.data )
    def delete(self, request, manager_id, format=None):
        try:
            # Get all notifications for the given manager ID
            notifications = LeaveNotification.objects.filter(recipient=manager_id)
            notifications.delete()
            return Response(status='deleted successfully')
        except Exception as e:
            return Response( status='something went wrong')
