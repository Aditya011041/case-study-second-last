# Generated by Django 5.0.1 on 2024-03-06 03:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_employee_salary_alter_employee_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='salary',
            field=models.IntegerField(max_length=130, null=True),
        ),
    ]