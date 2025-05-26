from rest_framework import serializers
from .models import CareerRoadmap, RoadmapTask, LearningResource, UserProgress


class RoadmapTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapTask
        fields = '__all__'
        read_only_fields = ('roadmap', 'created_at', 'updated_at', 'completed_at')


class CareerRoadmapSerializer(serializers.ModelSerializer):
    tasks = RoadmapTaskSerializer(many=True, read_only=True)
    tasks_count = serializers.SerializerMethodField()
    completed_tasks_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CareerRoadmap
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at', 'completed_at', 'progress_percentage')

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def get_completed_tasks_count(self, obj):
        return obj.tasks.filter(status='completed').count()


class CareerRoadmapCreateSerializer(serializers.Serializer):
    target_role = serializers.CharField(max_length=100)
    duration_months = serializers.IntegerField(min_value=1, max_value=24, default=6)
    current_role = serializers.CharField(max_length=100, required=False)
    goals = serializers.CharField(required=False)
    skills = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        default=list
    )
    career_interests = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        default=list
    )


class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at') 