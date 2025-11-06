from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Project
        fields = ["id", "title", "details", "total_target", "start_time", "end_time", "owner", "owner_username"]
        read_only_fields = ["owner"]
