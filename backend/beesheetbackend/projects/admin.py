from django.contrib import admin
from .models import Project

class ProjectAdmin(admin.ModelAdmin):
    filter_horizontal = ('assigned_to', 'managers')
    list_display = ['title' , 'description']

admin.site.register(Project, ProjectAdmin)
