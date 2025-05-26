from django.urls import path
from . import views

urlpatterns = [
    # Job listings
    path('', views.JobListView.as_view(), name='job_list'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job_detail'),
    path('search/', views.search_jobs, name='search_jobs'),
    
    # Job applications
    path('applications/', views.ApplicationListView.as_view(), name='application_list'),
    path('applications/<int:pk>/', views.ApplicationDetailView.as_view(), name='application_detail'),
    path('<int:job_id>/apply/', views.apply_to_job, name='apply_to_job'),
] 