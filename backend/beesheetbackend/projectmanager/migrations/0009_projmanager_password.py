# Generated by Django 5.0.2 on 2024-03-20 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projectmanager', '0008_alter_projmanager_employees'),
    ]

    operations = [
        migrations.AddField(
            model_name='projmanager',
            name='password',
            field=models.IntegerField(default=0, max_length=128),
            preserve_default=False,
        ),
    ]
