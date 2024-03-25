from django.contrib import admin
from . models import ProjManager

# Register your models here.

# class ProjManagerAdmin(admin.ModelAdmin):
#     filter_horizontal = ('employees' , )
#  , ProjManagerAdmin

admin.site.register(ProjManager )
