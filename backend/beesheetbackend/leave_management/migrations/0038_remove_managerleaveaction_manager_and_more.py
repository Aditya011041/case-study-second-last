# Generated by Django 5.0.2 on 2024-04-02 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leave_management', '0037_managerleavesummary'),
        ('projectmanager', '0013_projmanager_first_login'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='managerleaveaction',
            name='manager',
        ),
        migrations.AddField(
            model_name='managerleaveaction',
            name='manager',
            field=models.ManyToManyField(to='projectmanager.projmanager'),
        ),
    ]
