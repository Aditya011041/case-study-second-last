# Generated by Django 5.0.2 on 2024-03-24 18:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leave_management', '0028_leaveapplication_submitted_by'),
        ('projectmanager', '0011_alter_projmanager_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leaveapplication',
            name='submitted_by',
        ),
        migrations.CreateModel(
            name='ManagerLeaveApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('status', models.CharField(default='PENDING', max_length=20)),
                ('superuser_changed_status', models.BooleanField(default=False)),
                ('reason', models.TextField(blank=True)),
                ('leave_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leave_management.leavetype')),
                ('manager', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projectmanager.projmanager')),
            ],
        ),
    ]
