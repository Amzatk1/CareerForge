from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom User model with additional fields for CareerForge AI"""
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class UserProfile(models.Model):
    """Extended user profile with career-specific information"""
    EXPERIENCE_CHOICES = [
        ('entry', 'Entry Level (0-2 years)'),
        ('mid', 'Mid Level (3-5 years)'),
        ('senior', 'Senior Level (6-10 years)'),
        ('expert', 'Expert Level (10+ years)'),
    ]

    EDUCATION_CHOICES = [
        ('high_school', 'High School'),
        ('associate', 'Associate Degree'),
        ('bachelor', 'Bachelor\'s Degree'),
        ('master', 'Master\'s Degree'),
        ('phd', 'PhD'),
        ('bootcamp', 'Bootcamp/Certificate'),
        ('self_taught', 'Self-taught'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    
    # Career information
    current_role = models.CharField(max_length=100, blank=True)
    target_role = models.CharField(max_length=100, blank=True)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='entry')
    education_level = models.CharField(max_length=20, choices=EDUCATION_CHOICES, default='bachelor')
    
    # Interests and goals
    career_interests = models.JSONField(default=list, blank=True)  # List of interests
    skills = models.JSONField(default=list, blank=True)  # List of current skills
    goals = models.TextField(blank=True)
    
    # Preferences
    remote_work_preference = models.BooleanField(default=True)
    salary_expectation = models.PositiveIntegerField(null=True, blank=True)
    notification_preferences = models.JSONField(default=dict, blank=True)  # Notification settings
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name}'s Profile"

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles" 