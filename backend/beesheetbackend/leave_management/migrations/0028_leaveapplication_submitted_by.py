# Generated by Django 5.0.2 on 2024-03-24 09:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leave_management', '0027_alter_leavetype_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='leaveapplication',
            name='submitted_by',
            field=models.CharField(default='employee', max_length=20),
        ),
    ]
