from rest_framework import serializers
from .models import ProjManager

class ProjManagerSerializer(serializers.ModelSerializer):
    # projects = ProjectSerializer(many=True)
    class Meta:
        model = ProjManager
        fields = '__all__'