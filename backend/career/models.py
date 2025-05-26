from django.db import models
from django.utils import timezone
from django.conf import settings


class CareerRoadmap(models.Model):
    """AI-generated career roadmap for users"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('archived', 'Archived'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='roadmaps')
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_role = models.CharField(max_length=100)
    current_level = models.CharField(max_length=50)
    target_level = models.CharField(max_length=50)
    duration_months = models.PositiveIntegerField(default=6)
    
    # AI-generated content
    skills_to_learn = models.JSONField(default=list)  # List of skills
    tools_to_master = models.JSONField(default=list)  # List of tools
    certifications = models.JSONField(default=list)  # List of certifications
    projects = models.JSONField(default=list)  # List of project ideas
    learning_resources = models.JSONField(default=list)  # List of resources
    
    # Progress tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    progress_percentage = models.PositiveIntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Career Roadmap"
        verbose_name_plural = "Career Roadmaps"

    def __str__(self):
        return f"{self.user.full_name} - {self.title}"

    def update_progress(self):
        """Calculate and update progress based on completed tasks"""
        total_tasks = self.tasks.count()
        if total_tasks == 0:
            self.progress_percentage = 0
        else:
            completed_tasks = self.tasks.filter(status='completed').count()
            self.progress_percentage = int((completed_tasks / total_tasks) * 100)
        
        if self.progress_percentage == 100 and self.status == 'active':
            self.status = 'completed'
            self.completed_at = timezone.now()
        
        self.save()


class RoadmapTask(models.Model):
    """Individual tasks within a career roadmap"""
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('skipped', 'Skipped'),
    ]

    TASK_TYPE_CHOICES = [
        ('skill', 'Skill Learning'),
        ('project', 'Project'),
        ('certification', 'Certification'),
        ('reading', 'Reading/Research'),
        ('practice', 'Practice'),
        ('networking', 'Networking'),
    ]

    roadmap = models.ForeignKey(CareerRoadmap, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    task_type = models.CharField(max_length=20, choices=TASK_TYPE_CHOICES, default='skill')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Time management
    estimated_hours = models.PositiveIntegerField(default=1)
    actual_hours = models.PositiveIntegerField(default=0)
    due_date = models.DateField(null=True, blank=True)
    
    # Resources and links
    resources = models.JSONField(default=list)  # List of helpful resources
    notes = models.TextField(blank=True)
    
    # Progress tracking
    week_number = models.PositiveIntegerField(default=1)  # Which week of the roadmap
    order = models.PositiveIntegerField(default=0)  # Order within the week
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['week_number', 'order']
        verbose_name = "Roadmap Task"
        verbose_name_plural = "Roadmap Tasks"

    def __str__(self):
        return f"{self.roadmap.title} - Week {self.week_number}: {self.title}"

    def mark_completed(self):
        """Mark task as completed and update roadmap progress"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()
        self.roadmap.update_progress()


class LearningResource(models.Model):
    """Curated learning resources for different skills and topics"""
    RESOURCE_TYPE_CHOICES = [
        ('course', 'Online Course'),
        ('book', 'Book'),
        ('article', 'Article'),
        ('video', 'Video'),
        ('tutorial', 'Tutorial'),
        ('documentation', 'Documentation'),
        ('tool', 'Tool/Software'),
        ('certification', 'Certification'),
    ]

    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    
    # Categorization
    skills = models.JSONField(default=list)  # Related skills
    tags = models.JSONField(default=list)  # Tags for filtering
    
    # Metadata
    provider = models.CharField(max_length=100, blank=True)  # Udemy, Coursera, etc.
    duration_hours = models.PositiveIntegerField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_free = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'title']
        verbose_name = "Learning Resource"
        verbose_name_plural = "Learning Resources"

    def __str__(self):
        return f"{self.title} ({self.resource_type})"


class UserProgress(models.Model):
    """Track user's overall progress and achievements"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    
    # Overall statistics
    total_roadmaps = models.PositiveIntegerField(default=0)
    completed_roadmaps = models.PositiveIntegerField(default=0)
    total_tasks = models.PositiveIntegerField(default=0)
    completed_tasks = models.PositiveIntegerField(default=0)
    total_hours_logged = models.PositiveIntegerField(default=0)
    
    # Skills and achievements
    skills_learned = models.JSONField(default=list)
    certifications_earned = models.JSONField(default=list)
    projects_completed = models.JSONField(default=list)
    
    # Streaks and motivation
    current_streak = models.PositiveIntegerField(default=0)  # Days
    longest_streak = models.PositiveIntegerField(default=0)  # Days
    last_activity_date = models.DateField(null=True, blank=True)
    
    # Preferences
    weekly_goal_hours = models.PositiveIntegerField(default=10)
    preferred_learning_style = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Progress"
        verbose_name_plural = "User Progress"

    def __str__(self):
        return f"{self.user.full_name}'s Progress"

    def update_streak(self):
        """Update learning streak based on activity"""
        today = timezone.now().date()
        
        if self.last_activity_date:
            days_diff = (today - self.last_activity_date).days
            
            if days_diff == 1:
                # Consecutive day
                self.current_streak += 1
                if self.current_streak > self.longest_streak:
                    self.longest_streak = self.current_streak
            elif days_diff > 1:
                # Streak broken
                self.current_streak = 1
            # If days_diff == 0, same day, no change needed
        else:
            # First activity
            self.current_streak = 1
            self.longest_streak = 1
        
        self.last_activity_date = today
        self.save() 