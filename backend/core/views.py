from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from .models import User, UserProfile
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer, 
    UserProfileSerializer,
    PasswordChangeSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User created successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """User logout endpoint"""
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    """Get and update detailed user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_onboarding(request):
    """Complete user onboarding with career interests and skills"""
    user = request.user
    data = request.data
    
    # Get or create user profile
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    # Extract onboarding data
    careers = data.get('careers', [])
    experience_level = data.get('experienceLevel', '')
    skills = data.get('skills', [])
    
    # Process career interests - extract names from career objects
    career_interests = []
    if careers:
        career_interests = [career.get('name', '') for career in careers if career.get('name')]
    
    # Update profile with onboarding data
    profile.career_interests = career_interests
    profile.skills = skills
    if experience_level:
        profile.experience_level = experience_level
    
    profile.save()
    
    return Response({
        'message': 'Onboarding completed successfully',
        'profile': UserProfileSerializer(profile).data
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_account(request):
    """Delete user account"""
    user = request.user
    user.delete()
    return Response({'message': 'Account deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics"""
    user = request.user
    
    # Import here to avoid circular imports
    from career.models import CareerRoadmap
    from resume.models import Resume
    from jobs.models import JobApplication
    
    stats = {
        'roadmaps_created': CareerRoadmap.objects.filter(user=user).count(),
        'resumes_uploaded': Resume.objects.filter(user=user).count(),
        'jobs_applied': JobApplication.objects.filter(user=user).count(),
        'profile_completion': calculate_profile_completion(user),
    }
    
    return Response(stats, status=status.HTTP_200_OK)


def calculate_profile_completion(user):
    """Calculate profile completion percentage"""
    profile = getattr(user, 'profile', None)
    if not profile:
        return 0
    
    fields_to_check = [
        'bio', 'location', 'current_role', 'target_role', 
        'career_interests', 'skills', 'goals'
    ]
    
    completed_fields = 0
    total_fields = len(fields_to_check)
    
    for field in fields_to_check:
        value = getattr(profile, field, None)
        if value:
            if isinstance(value, list) and len(value) > 0:
                completed_fields += 1
            elif isinstance(value, str) and value.strip():
                completed_fields += 1
    
    return int((completed_fields / total_fields) * 100)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """Update user profile information"""
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    # Update user fields
    user_fields = ['first_name', 'last_name', 'email']
    for field in user_fields:
        if field in request.data:
            setattr(user, field, request.data[field])
    
    # Update profile fields
    profile_fields = ['phone', 'bio', 'location', 'website']
    for field in profile_fields:
        if field in request.data:
            setattr(profile, field, request.data[field])
    
    try:
        user.save()
        profile.save()
        
        return Response({
            'message': 'Profile updated successfully',
            'user': UserSerializer(user).data,
            'profile': UserProfileSerializer(profile).data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Failed to update profile',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_notifications(request):
    """Update user notification preferences"""
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    # Get current notification preferences or set defaults
    notifications = getattr(profile, 'notification_preferences', {}) or {}
    
    # Update with new preferences
    notifications.update(request.data)
    
    # Save to profile (you might want to add a notification_preferences field to UserProfile model)
    profile.notification_preferences = notifications
    profile.save()
    
    return Response({
        'message': 'Notification preferences updated successfully',
        'notifications': notifications
    }, status=status.HTTP_200_OK) 