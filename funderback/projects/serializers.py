from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    owner_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["id", "title", "details", "total_target", "start_time", "end_time", "owner_full_name"]
        read_only_fields = ["owner_full_name"]

    def get_owner_full_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}"
