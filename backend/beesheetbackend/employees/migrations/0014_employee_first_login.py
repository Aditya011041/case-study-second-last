# Generated by Django 5.0.2 on 2024-03-28 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0013_alter_employee_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='first_login',
            field=models.BooleanField(default=True),
        ),
    ]
