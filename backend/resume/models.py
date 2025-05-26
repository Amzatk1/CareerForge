from django.db import models
from django.utils import timezone
from django.conf import settings


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=200, default='My Resume')
    file = models.FileField(upload_to='resumes/')
    
    # Parsed content
    raw_text = models.TextField(blank=True)
    parsed_data = models.JSONField(default=dict)
    
    # Analysis results
    skills_extracted = models.JSONField(default=list)
    experience_years = models.PositiveIntegerField(default=0)
    education_level = models.CharField(max_length=50, blank=True)
    job_titles = models.JSONField(default=list)
    
    # AI feedback
    ai_feedback = models.JSONField(default=dict)
    match_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.full_name} - {self.title}"


class ResumeAnalysis(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='analysis')
    target_role = models.CharField(max_length=200, blank=True)
    
    # AI Analysis Data
    analysis_data = models.JSONField(default=dict)  # Complete AI analysis response
    
    # Key Metrics
    overall_score = models.PositiveIntegerField(default=0)  # 0-100
    
    # Analysis Results
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)
    suggestions = models.JSONField(default=list)
    missing_sections = models.JSONField(default=list)
    
    # Content analysis
    word_count = models.PositiveIntegerField(default=0)
    section_count = models.PositiveIntegerField(default=0)
    has_contact_info = models.BooleanField(default=False)
    has_summary = models.BooleanField(default=False)
    has_experience = models.BooleanField(default=False)
    has_education = models.BooleanField(default=False)
    has_skills = models.BooleanField(default=False)
    
    # Quality scores (0-100)
    formatting_score = models.PositiveIntegerField(default=0)
    content_score = models.PositiveIntegerField(default=0)
    keyword_score = models.PositiveIntegerField(default=0)
    ats_score = models.PositiveIntegerField(default=0)
    
    # Keyword Analysis
    current_keywords = models.JSONField(default=list)
    suggested_keywords = models.JSONField(default=list)
    keyword_recommendations = models.JSONField(default=list)
    
    # Experience Analysis
    career_progression_score = models.PositiveIntegerField(default=0)
    experience_gaps = models.TextField(blank=True)
    skill_level_assessment = models.CharField(max_length=50, blank=True)
    
    # Next Steps
    next_steps = models.JSONField(default=list)
    formatting_feedback = models.JSONField(default=list)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Analysis for {self.resume.title} - Score: {self.overall_score}%" 