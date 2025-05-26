from django.db import models
from django.utils import timezone
from django.conf import settings


class ChatConversation(models.Model):
    """Chat conversation between user and AI assistant"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_conversations')
    title = models.CharField(max_length=200, default='Career Chat')
    
    # Conversation metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-last_message_at']

    def __str__(self):
        return f"{self.user.full_name} - {self.title}"


class ChatMessage(models.Model):
    """Individual message in a chat conversation"""
    MESSAGE_TYPES = [
        ('user', 'User Message'),
        ('assistant', 'AI Assistant'),
        ('system', 'System Message'),
    ]

    conversation = models.ForeignKey(ChatConversation, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES)
    content = models.TextField()
    
    # AI-specific fields
    ai_model = models.CharField(max_length=50, blank=True)  # e.g., 'gpt-4'
    tokens_used = models.PositiveIntegerField(default=0)
    response_time = models.FloatField(default=0.0)  # in seconds
    
    # Message metadata
    is_edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.message_type}: {self.content[:50]}..."


class AIInsight(models.Model):
    """AI-generated insights and recommendations for users"""
    INSIGHT_TYPES = [
        ('career_advice', 'Career Advice'),
        ('skill_recommendation', 'Skill Recommendation'),
        ('job_market_trend', 'Job Market Trend'),
        ('learning_path', 'Learning Path'),
        ('resume_tip', 'Resume Tip'),
        ('interview_prep', 'Interview Preparation'),
        ('networking_tip', 'Networking Tip'),
        ('salary_insight', 'Salary Insight'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_insights')
    insight_type = models.CharField(max_length=30, choices=INSIGHT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    # Insight metadata
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ], default='medium')
    
    is_read = models.BooleanField(default=False)
    is_actionable = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # AI generation data
    ai_confidence = models.FloatField(default=0.0)  # 0.0 to 1.0
    generated_from = models.JSONField(default=dict)  # Context used for generation
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.insight_type}: {self.title}"


class UserAIPreferences(models.Model):
    """User preferences for AI interactions"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_preferences')
    
    # Communication preferences
    preferred_tone = models.CharField(max_length=20, choices=[
        ('professional', 'Professional'),
        ('friendly', 'Friendly'),
        ('casual', 'Casual'),
        ('motivational', 'Motivational'),
    ], default='friendly')
    
    detail_level = models.CharField(max_length=20, choices=[
        ('brief', 'Brief'),
        ('moderate', 'Moderate'),
        ('detailed', 'Detailed'),
    ], default='moderate')
    
    # Feature preferences
    enable_proactive_insights = models.BooleanField(default=True)
    enable_daily_tips = models.BooleanField(default=True)
    enable_job_alerts = models.BooleanField(default=True)
    enable_skill_recommendations = models.BooleanField(default=True)
    
    # Notification preferences
    insight_frequency = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('never', 'Never'),
    ], default='weekly')
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Preferences for {self.user.full_name}"
