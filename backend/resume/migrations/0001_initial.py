# Generated by Django 4.2.7 on 2025-05-25 12:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='My Resume', max_length=200)),
                ('file', models.FileField(upload_to='resumes/')),
                ('raw_text', models.TextField(blank=True)),
                ('parsed_data', models.JSONField(default=dict)),
                ('skills_extracted', models.JSONField(default=list)),
                ('experience_years', models.PositiveIntegerField(default=0)),
                ('education_level', models.CharField(blank=True, max_length=50)),
                ('job_titles', models.JSONField(default=list)),
                ('ai_feedback', models.JSONField(default=dict)),
                ('match_score', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resumes', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ResumeAnalysis',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word_count', models.PositiveIntegerField(default=0)),
                ('section_count', models.PositiveIntegerField(default=0)),
                ('has_contact_info', models.BooleanField(default=False)),
                ('has_summary', models.BooleanField(default=False)),
                ('has_experience', models.BooleanField(default=False)),
                ('has_education', models.BooleanField(default=False)),
                ('has_skills', models.BooleanField(default=False)),
                ('formatting_score', models.PositiveIntegerField(default=0)),
                ('content_score', models.PositiveIntegerField(default=0)),
                ('keyword_score', models.PositiveIntegerField(default=0)),
                ('overall_score', models.PositiveIntegerField(default=0)),
                ('suggestions', models.JSONField(default=list)),
                ('missing_sections', models.JSONField(default=list)),
                ('keyword_recommendations', models.JSONField(default=list)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('resume', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='analysis', to='resume.resume')),
            ],
        ),
    ]
