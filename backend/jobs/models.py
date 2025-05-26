from django.db import models
from django.utils import timezone
from django.conf import settings


class JobListing(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField()
    location = models.CharField(max_length=100)
    is_remote = models.BooleanField(default=False)
    salary_min = models.PositiveIntegerField(null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    
    # Job details
    employment_type = models.CharField(max_length=50, default='full-time')
    experience_level = models.CharField(max_length=50)
    skills_required = models.JSONField(default=list)
    
    # External data
    external_id = models.CharField(max_length=100, unique=True)
    source = models.CharField(max_length=50)  # API source
    apply_url = models.URLField()
    
    # Metadata
    posted_date = models.DateTimeField()
    expires_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-posted_date']

    def __str__(self):
        return f"{self.title} at {self.company}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('saved', 'Saved'),
        ('applied', 'Applied'),
        ('interviewing', 'Interviewing'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='saved')
    
    # Application details
    cover_letter = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    match_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Timeline
    applied_date = models.DateTimeField(null=True, blank=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    response_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'job']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.full_name} - {self.job.title}" 