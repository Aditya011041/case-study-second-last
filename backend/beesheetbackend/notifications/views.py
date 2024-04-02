from rest_framework.views import APIView
from rest_framework.response import Response
from leave_management.models import LeaveApplication
from projectmanager.models import ProjManager
from employees.models import Employee
from .serializers import NotificationSerializer
from .models import LeaveNotification, ManagerToEmployeeNotification
from django.shortcuts import get_object_or_404
from rest_framework import status


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
            notifications = LeaveNotification.objects.filter(recipient=manager_id)
            notifications.delete()
            return Response({'message': 'Notifications deleted successfully'})
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

import traceback
import logging

logger = logging.getLogger(__name__)

class EmployeeNotification(APIView):
    def get(self, request, employee_id, format=None):
        try:
            # Get employee object
            try:
                employee = Employee.objects.get(id=employee_id)
            except Employee.DoesNotExist:
                logger.error(f"No Employee found with id={employee_id}")
                return Response({'error': 'Invalid employee ID'}, status=status.HTTP_404_NOT_FOUND)

            # Fetch notifications for the employee
            notifications = ManagerToEmployeeNotification.objects.filter(employee=employee)
            print(notifications)

            # Serialize notifications
            notification_data = [
                {
                    'sender_name': notification.manager.name,
                    'message': notification.message,
                    'created_at': notification.created_at,
                    'notification_read_status': notification.notification_read_status
                }
                for notification in notifications
            ]

            return Response(notification_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"An error occurred in EmployeeNotification: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, employee_id, format=None):
        try:
            # Get employee object
            try:
                employee = Employee.objects.get(id=employee_id)
            except Employee.DoesNotExist:
                logger.error(f"No Employee found with id={employee_id}")
                return Response({'error': 'Invalid employee ID'}, status=status.HTTP_404_NOT_FOUND)

            # Delete notifications for the employee
            ManagerToEmployeeNotification.objects.filter(employee=employee).delete()

            return Response({'message': 'Notifications deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            logger.error(f"An error occurred in deleting notifications: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
import traceback
import logging
logger = logging.getLogger(__name__)


logger = logging.getLogger(__name__)

class LeaveActionNotification(APIView):
    def post(self, request, format=None):
        try:
            # Get data from request
            manager_id = request.data.get('manager_id')
            leave_application_id = request.data.get('leave_application_id')
            action = request.data.get('action')
            print(action)

            # Log the received data for debugging
            logger.info(f"Received data: manager_id={manager_id}, leave_application_id={leave_application_id}, action={action}")

            # Check if leave_application_id is provided
            if not leave_application_id:
                logger.error("Missing leave_application_id in the request data")
                return Response({'error': 'Missing leave_application_id'}, status=400)

            # Try to get the leave application object
            try:
                leave_application = LeaveApplication.objects.get(id=leave_application_id)
            except LeaveApplication.DoesNotExist:
                logger.error(f"No LeaveApplication found with id={leave_application_id}")
                return Response({'error': 'Invalid leave_application_id'}, status=400)

            # Get the manager object
            manager = get_object_or_404(ProjManager, id=manager_id)

            # Get the employee from the leave application
            employee = leave_application.employee

            # Create notification message based on action
            action_message = {
                'approve': 'approved',
                'reject': 'rejected',
                'pending': 'marked pending'
            }.get(action ,  f'took {action} on')
            message = f"{manager.name} {action_message} your leave application."


            # Create a notification for the employee
            notification = ManagerToEmployeeNotification.objects.create(
                manager=manager,
                employee=employee,
                message=message
            )

            return Response({'detail': 'Notification sent successfully'}, status=201)

        except Exception as e:
            logger.error(f"An error occurred in LeaveActionNotification: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({'error': 'Something went wrong'}, status=500)