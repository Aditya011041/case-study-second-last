# Generated by Django 5.0.2 on 2024-03-29 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leave_management', '0034_managerleaveaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='leavesummary',
            name='previous_state_available',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='leavesummary',
            name='previous_state_used',
            field=models.IntegerField(default=0),
        ),
    ]