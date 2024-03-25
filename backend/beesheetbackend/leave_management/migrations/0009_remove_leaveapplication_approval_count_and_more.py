# Generated by Django 5.0.2 on 2024-03-10 13:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leave_management', '0008_alter_managerapproval_decision'),
        ('projectmanager', '0008_alter_projmanager_employees'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leaveapplication',
            name='approval_count',
        ),
        migrations.RemoveField(
            model_name='leaveapplication',
            name='managers',
        ),
        migrations.RemoveField(
            model_name='leaveapplication',
            name='rejection_count',
        ),
        migrations.CreateModel(
            name='LeaveApproval',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending', max_length=30)),
                ('comments', models.TextField(blank=True)),
                ('leave_application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leave_management.leaveapplication')),
                ('manager', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projectmanager.projmanager')),
            ],
        ),
        migrations.DeleteModel(
            name='ManagerApproval',
        ),
    ]
