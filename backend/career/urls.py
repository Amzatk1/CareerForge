from django.urls import path
from . import views

urlpatterns = [
    # Roadmap management
    path('roadmaps/', views.RoadmapListView.as_view(), name='roadmap_list'),
    path('roadmaps/<int:pk>/', views.RoadmapDetailView.as_view(), name='roadmap_detail'),
    path('roadmaps/generate/', views.generate_roadmap, name='generate_roadmap'),
    path('roadmaps/<int:roadmap_id>/tasks/', views.roadmap_tasks, name='roadmap_tasks'),
    
    # Task management
    path('tasks/weekly/', views.weekly_tasks, name='weekly_tasks'),
    path('tasks/<int:task_id>/update/', views.update_task_status, name='update_task_status'),
    
    # Learning resources
    path('resources/', views.LearningResourceListView.as_view(), name='learning_resources'),
    path('resources/suggest/', views.suggest_resources, name='suggest_resources'),
    
    # Progress tracking
    path('progress/', views.UserProgressView.as_view(), name='user_progress'),
    path('dashboard/', views.dashboard_stats, name='dashboard_stats'),
] 