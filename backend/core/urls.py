from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('profile/detail/', views.UserProfileDetailView.as_view(), name='user_profile_detail'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/notifications/', views.update_notifications, name='update_notifications'),
    path('onboarding/', views.complete_onboarding, name='complete_onboarding'),
    path('change-password/', views.change_password, name='change_password'),
    path('delete-account/', views.delete_account, name='delete_account'),
    path('stats/', views.user_stats, name='user_stats'),
] 