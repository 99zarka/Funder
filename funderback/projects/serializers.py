from rest_framework import serializers
from django.db import models
from .models import Project, Contribution

class ContributionSerializer(serializers.ModelSerializer):
    contributor_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Contribution
        fields = ["id", "project", "contributor", "contributor_full_name", "amount", "timestamp"]
        read_only_fields = ["project", "contributor", "contributor_full_name", "timestamp"]

    def get_contributor_full_name(self, obj):
        return f"{obj.contributor.first_name} {obj.contributor.last_name}"

class ProjectSerializer(serializers.ModelSerializer):
    owner_full_name = serializers.SerializerMethodField()
    contributions = ContributionSerializer(many=True, read_only=True)
    current_funding = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["id", "title", "details", "total_target", "start_time", "end_time", "owner_full_name", "contributions", "current_funding"]
        read_only_fields = ["owner_full_name", "contributions", "current_funding"]

    def get_owner_full_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}"

    def get_current_funding(self, obj):
        return obj.contributions.aggregate(total=models.Sum('amount'))['total'] or 0

    def validate(self, data):
        if 'start_time' in data and 'end_time' in data:
            if data['end_time'] < data['start_time']:
                raise serializers.ValidationError({"end_time": "End Date cannot be before Start Date."})
        return data
