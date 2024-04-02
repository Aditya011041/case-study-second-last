from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Employee(models.Model):
    id = models.IntegerField(primary_key=True , blank=True)
    name = models.CharField(max_length=120 , null=False)
    email = models.EmailField(max_length=60, null=False)
    department = models.CharField(max_length=50)
    position = models.CharField(max_length=100) 
    payment = models.IntegerField(max_length=140 , null=True)
    is_manager = models.BooleanField(default=False)
    password = models.CharField(max_length=128 , null = False)
    first_login = models.BooleanField(default=True)

    # def save(self, *args, **kwargs):
    #     # Hash the password before saving
    #     if self.password:
    #         self.password = make_password(self.password)
    #     super().save(*args, **kwargs)

    def __str__(self): 
        return self.name


