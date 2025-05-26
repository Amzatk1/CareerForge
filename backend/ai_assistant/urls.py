from django.urls import path
from . import views

urlpatterns = [
    # Chat functionality
    path('chat/conversations/', views.chat_conversations, name='chat_conversations'),
    path('chat/conversations/<int:conversation_id>/', views.chat_conversation_detail, name='chat_conversation_detail'),
    
    # AI Insights
    path('insights/', views.ai_insights, name='ai_insights'),
    path('insights/generate/', views.generate_daily_insight, name='generate_daily_insight'),
    path('insights/<int:insight_id>/read/', views.mark_insight_read, name='mark_insight_read'),
    
    # AI Preferences
    path('preferences/', views.ai_preferences, name='ai_preferences'),
    
    # Quick questions
    path('ask/', views.quick_career_question, name='quick_career_question'),
    
    # GPT-powered features
    path('generate-roadmap/', views.generate_career_roadmap, name='generate_career_roadmap'),
    path('analyze-resume/', views.analyze_resume, name='analyze_resume'),
    path('career-quiz/', views.career_quiz_recommendation, name='career_quiz_recommendation'),
] 