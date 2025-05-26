from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model"""
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_verified', 'is_active', 'created_at')
    list_filter = ('is_verified', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('is_verified', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for UserProfile model"""
    list_display = ('user', 'current_role', 'target_role', 'experience_level', 'location', 'created_at')
    list_filter = ('experience_level', 'education_level', 'remote_work_preference', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'current_role', 'target_role')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Basic Information', {
            'fields': ('bio', 'location', 'phone')
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'github_url', 'portfolio_url')
        }),
        ('Career Information', {
            'fields': ('current_role', 'target_role', 'experience_level', 'education_level')
        }),
        ('Interests & Skills', {
            'fields': ('career_interests', 'skills', 'goals')
        }),
        ('Preferences', {
            'fields': ('remote_work_preference', 'salary_expectation')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at') 