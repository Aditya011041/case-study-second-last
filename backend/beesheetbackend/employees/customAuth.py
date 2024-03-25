from django.contrib.auth.backends import ModelBackend
from employees.models import Employee
from projectmanager.models import ProjManager
from django.contrib.auth.hashers import check_password

class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        user = None
        print('in custom auth:' ,email)
        print('in custom auth :' ,password)

        if (email and password):
            employee = Employee.objects.filter(email=email).first()
            if employee and check_password(password, employee.password):
                user = employee
            else:
                manager = ProjManager.objects.filter(email=email).first()
                print(manager)
                if manager and check_password(password, manager.password):
                    user = manager

        return user
