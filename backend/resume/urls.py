from django.urls import path
from . import views

urlpatterns = [
    # Resume management
    path('', views.ResumeListView.as_view(), name='resume_list'),
    path('upload/', views.upload_resume, name='upload_resume'),
    path('<int:pk>/', views.ResumeDetailView.as_view(), name='resume_detail'),
    path('<int:pk>/analyze/', views.analyze_resume, name='analyze_resume'),
] 