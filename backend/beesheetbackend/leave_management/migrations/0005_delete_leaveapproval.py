# Generated by Django 5.0.2 on 2024-03-10 12:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leave_management', '0004_leaveapplication_managers_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='LeaveApproval',
        ),
    ]
