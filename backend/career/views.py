from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CareerRoadmap, RoadmapTask, LearningResource, UserProgress
from .serializers import (
    CareerRoadmapSerializer, 
    CareerRoadmapCreateSerializer,
    RoadmapTaskSerializer,
    LearningResourceSerializer,
    UserProgressSerializer
)
from .roadmap_generator import RoadmapGenerator


@api_view(['POST'])
def generate_roadmap(request):
    """Generate AI-powered career roadmap"""
    serializer = CareerRoadmapCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        
        # Prepare user profile data
        user_profile = {
            'current_role': serializer.validated_data.get('current_role', user.profile.current_role),
            'target_role': serializer.validated_data['target_role'],
            'experience_level': user.profile.experience_level,
            'education_level': user.profile.education_level,
            'skills': serializer.validated_data.get('skills', user.profile.skills),
            'career_interests': serializer.validated_data.get('career_interests', user.profile.career_interests),
            'goals': serializer.validated_data.get('goals', user.profile.goals),
            'duration_months': serializer.validated_data['duration_months']
        }
        
        # Generate roadmap using AI
        generator = RoadmapGenerator()
        roadmap_data = generator.generate_roadmap(user_profile)
        
        # Create roadmap in database
        roadmap = generator.create_roadmap_from_data(user, roadmap_data)
        
        # Update user progress
        progress, created = UserProgress.objects.get_or_create(user=user)
        progress.total_roadmaps += 1
        progress.save()
        
        return Response({
            'message': 'Roadmap generated successfully',
            'roadmap': CareerRoadmapSerializer(roadmap).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoadmapListView(generics.ListAPIView):
    """List user's roadmaps"""
    serializer_class = CareerRoadmapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CareerRoadmap.objects.filter(user=self.request.user)


class RoadmapDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific roadmap"""
    serializer_class = CareerRoadmapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CareerRoadmap.objects.filter(user=self.request.user)


@api_view(['GET'])
def roadmap_tasks(request, roadmap_id):
    """Get tasks for a specific roadmap"""
    roadmap = get_object_or_404(CareerRoadmap, id=roadmap_id, user=request.user)
    tasks = roadmap.tasks.all()
    
    # Group tasks by week
    weeks = {}
    for task in tasks:
        week = task.week_number
        if week not in weeks:
            weeks[week] = []
        weeks[week].append(task)
    
    # Format response
    weekly_tasks = []
    for week_num in sorted(weeks.keys()):
        weekly_tasks.append({
            'week_number': week_num,
            'tasks': RoadmapTaskSerializer(weeks[week_num], many=True).data
        })
    
    return Response(weekly_tasks, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_task_status(request, task_id):
    """Update task status and progress"""
    task = get_object_or_404(RoadmapTask, id=task_id, roadmap__user=request.user)
    
    old_status = task.status
    serializer = RoadmapTaskSerializer(task, data=request.data, partial=True)
    
    if serializer.is_valid():
        task = serializer.save()
        
        # If task was completed, update progress
        if task.status == 'completed' and old_status != 'completed':
            task.mark_completed()
            
            # Update user progress
            progress, created = UserProgress.objects.get_or_create(user=request.user)
            progress.completed_tasks += 1
            progress.total_hours_logged += task.actual_hours or task.estimated_hours
            progress.update_streak()
            progress.save()
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def weekly_tasks(request):
    """Get current week's tasks across all active roadmaps"""
    import datetime
    
    # Get current week number (simplified - you might want more sophisticated logic)
    current_week = datetime.datetime.now().isocalendar()[1] % 52
    
    # Get all active roadmaps for user
    roadmaps = CareerRoadmap.objects.filter(user=request.user, status='active')
    
    # Get tasks for current week
    tasks = RoadmapTask.objects.filter(
        roadmap__in=roadmaps,
        week_number__lte=current_week + 1,  # Current and next week
        status__in=['pending', 'in_progress']
    ).order_by('priority', 'due_date')
    
    serializer = RoadmapTaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class LearningResourceListView(generics.ListAPIView):
    """List learning resources with filtering"""
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LearningResource.objects.all()
        
        # Filter by skills
        skills = self.request.query_params.get('skills', None)
        if skills:
            skill_list = skills.split(',')
            queryset = queryset.filter(skills__overlap=skill_list)
        
        # Filter by resource type
        resource_type = self.request.query_params.get('type', None)
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)
        
        # Filter by free resources
        is_free = self.request.query_params.get('free', None)
        if is_free and is_free.lower() == 'true':
            queryset = queryset.filter(is_free=True)
        
        return queryset


@api_view(['GET'])
def suggest_resources(request):
    """Get AI-suggested resources for user's skills"""
    user = request.user
    skills = request.query_params.get('skills', None)
    
    if skills:
        skill_list = skills.split(',')
    else:
        # Use user's profile skills
        skill_list = user.profile.skills or []
    
    if not skill_list:
        return Response({'error': 'No skills provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate suggestions using AI
    generator = RoadmapGenerator()
    suggestions = generator.suggest_learning_resources(skill_list)
    
    return Response(suggestions, status=status.HTTP_200_OK)


class UserProgressView(generics.RetrieveAPIView):
    """Get user's progress and statistics"""
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        progress, created = UserProgress.objects.get_or_create(user=self.request.user)
        return progress


@api_view(['GET'])
def dashboard_stats(request):
    """Get dashboard statistics for user"""
    user = request.user
    
    # Get or create progress
    progress, created = UserProgress.objects.get_or_create(user=user)
    
    # Get active roadmaps
    active_roadmaps = CareerRoadmap.objects.filter(user=user, status='active')
    
    # Get pending tasks
    pending_tasks = RoadmapTask.objects.filter(
        roadmap__user=user,
        roadmap__status='active',
        status__in=['pending', 'in_progress']
    ).count()
    
    # Calculate average progress
    total_progress = sum(roadmap.progress_percentage for roadmap in active_roadmaps)
    avg_progress = total_progress / len(active_roadmaps) if active_roadmaps else 0
    
    stats = {
        'active_roadmaps': len(active_roadmaps),
        'pending_tasks': pending_tasks,
        'current_streak': progress.current_streak,
        'longest_streak': progress.longest_streak,
        'total_hours_logged': progress.total_hours_logged,
        'completed_roadmaps': progress.completed_roadmaps,
        'average_progress': round(avg_progress, 1),
        'skills_learned': len(progress.skills_learned),
        'certifications_earned': len(progress.certifications_earned)
    }
    
    return Response(stats, status=status.HTTP_200_OK) 