from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
import openai
import json
import logging
import requests
from typing import Dict, List, Any
from .models import JobListing, JobApplication

logger = logging.getLogger(__name__)

class JobMatcher:
    """AI-powered job matching engine using OpenAI GPT-4"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def calculate_job_match(self, user_profile: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate match percentage between user profile and job"""
        try:
            prompt = f"""
            Analyze the match between this user profile and job posting. Calculate a match percentage and provide detailed analysis.

            User Profile:
            - Skills: {user_profile.get('skills', [])}
            - Experience Level: {user_profile.get('experience_level', 'entry')}
            - Career Interests: {user_profile.get('career_interests', [])}
            - Education: {user_profile.get('education_level', 'bachelor')}
            - Target Role: {user_profile.get('target_role', '')}
            - Experience Years: {user_profile.get('experience_years', 0)}
            - Location Preference: {user_profile.get('location', '')}
            - Remote Work Preference: {user_profile.get('remote_work_preference', True)}

            Job Posting:
            - Title: {job_data.get('title', '')}
            - Company: {job_data.get('company', '')}
            - Description: {job_data.get('description', '')}
            - Required Skills: {job_data.get('required_skills', [])}
            - Experience Required: {job_data.get('experience_required', '')}
            - Location: {job_data.get('location', '')}
            - Remote: {job_data.get('is_remote', False)}
            - Salary Range: {job_data.get('salary_range', '')}

            Provide analysis in JSON format:
            {{
                "match_percentage": 85,
                "match_level": "High",
                "skill_match": {{
                    "matching_skills": ["Python", "React"],
                    "missing_skills": ["Docker", "AWS"],
                    "skill_match_percentage": 75
                }},
                "experience_match": {{
                    "meets_requirements": true,
                    "experience_gap": 0,
                    "experience_feedback": "Good match for experience level"
                }},
                "location_match": {{
                    "location_compatible": true,
                    "remote_compatible": true,
                    "location_feedback": "Remote work available"
                }},
                "strengths": [
                    "Strong technical skills match",
                    "Experience level aligns well"
                ],
                "concerns": [
                    "Missing some preferred skills",
                    "Salary range not specified"
                ],
                "recommendations": [
                    "Highlight your Python and React experience",
                    "Consider learning Docker before applying"
                ],
                "application_tips": [
                    "Emphasize relevant project experience",
                    "Mention willingness to learn new technologies"
                ],
                "fit_score": {{
                    "technical_fit": 80,
                    "cultural_fit": 75,
                    "growth_potential": 85,
                    "overall_fit": 80
                }}
            }}

            Be realistic and helpful in your assessment.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career counselor and recruiter with deep knowledge of job matching and hiring practices."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.5
            )
            
            response_text = response.choices[0].message.content
            
            # Extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                match_analysis = json.loads(json_str)
                return match_analysis
            else:
                return self._get_fallback_match(user_profile, job_data)
                
        except Exception as e:
            logger.error(f"Error calculating job match: {str(e)}")
            return self._get_fallback_match(user_profile, job_data)
    
    def _get_fallback_match(self, user_profile: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Provide fallback match calculation when AI fails"""
        user_skills = set(skill.lower() for skill in user_profile.get('skills', []))
        job_skills = set(skill.lower() for skill in job_data.get('required_skills', []))
        
        # Simple skill matching
        matching_skills = user_skills.intersection(job_skills)
        skill_match_percentage = (len(matching_skills) / len(job_skills)) * 100 if job_skills else 50
        
        # Basic match calculation
        base_match = min(skill_match_percentage, 100)
        
        return {
            "match_percentage": int(base_match),
            "match_level": "Medium" if base_match >= 60 else "Low",
            "skill_match": {
                "matching_skills": list(matching_skills),
                "missing_skills": list(job_skills - user_skills),
                "skill_match_percentage": int(skill_match_percentage)
            },
            "experience_match": {
                "meets_requirements": True,
                "experience_gap": 0,
                "experience_feedback": "Experience assessment unavailable"
            },
            "location_match": {
                "location_compatible": True,
                "remote_compatible": job_data.get('is_remote', False),
                "location_feedback": "Location compatibility unknown"
            },
            "strengths": ["Basic skill matching completed"],
            "concerns": ["Detailed analysis unavailable"],
            "recommendations": ["Review job requirements carefully"],
            "application_tips": ["Highlight relevant experience"],
            "fit_score": {
                "technical_fit": int(base_match),
                "cultural_fit": 70,
                "growth_potential": 75,
                "overall_fit": int(base_match)
            }
        }
    
    def generate_job_recommendations(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate AI-powered job recommendations based on user profile"""
        try:
            prompt = f"""
            Based on this user profile, suggest 5-8 realistic job opportunities that would be a good match:

            User Profile:
            - Skills: {user_profile.get('skills', [])}
            - Experience Level: {user_profile.get('experience_level', 'entry')}
            - Career Interests: {user_profile.get('career_interests', [])}
            - Education: {user_profile.get('education_level', 'bachelor')}
            - Target Role: {user_profile.get('target_role', '')}
            - Experience Years: {user_profile.get('experience_years', 0)}
            - Remote Work Preference: {user_profile.get('remote_work_preference', True)}

            Generate job recommendations in JSON format:
            [
                {{
                    "title": "Software Developer",
                    "company": "TechCorp Inc",
                    "location": "San Francisco, CA",
                    "is_remote": true,
                    "salary_range": "$80,000 - $120,000",
                    "experience_required": "2-4 years",
                    "required_skills": ["Python", "React", "SQL"],
                    "description": "Join our team to build innovative web applications...",
                    "match_percentage": 85,
                    "why_good_match": "Strong alignment with your Python and React skills",
                    "application_deadline": "2024-02-15",
                    "company_size": "50-200 employees",
                    "industry": "Technology"
                }}
            ]

            Make the recommendations realistic and diverse, covering different companies and slightly different roles within the user's interests.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career counselor who knows the current job market well. Generate realistic job recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=3000,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content
            
            # Extract JSON from response
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                recommendations = json.loads(json_str)
                return recommendations
            else:
                return self._get_fallback_recommendations(user_profile)
                
        except Exception as e:
            logger.error(f"Error generating job recommendations: {str(e)}")
            return self._get_fallback_recommendations(user_profile)
    
    def _get_fallback_recommendations(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Provide fallback job recommendations when AI fails"""
        skills = user_profile.get('skills', [])
        experience_level = user_profile.get('experience_level', 'entry')
        
        # Basic recommendations based on common roles
        base_recommendations = [
            {
                "title": "Software Developer",
                "company": "Tech Solutions Inc",
                "location": "Remote",
                "is_remote": True,
                "salary_range": "$70,000 - $100,000",
                "experience_required": f"{experience_level} level",
                "required_skills": skills[:3] if skills else ["Programming", "Problem Solving"],
                "description": "Join our development team to build innovative solutions.",
                "match_percentage": 75,
                "why_good_match": "Good match for your technical background",
                "application_deadline": "2024-03-01",
                "company_size": "50-200 employees",
                "industry": "Technology"
            },
            {
                "title": "Frontend Developer",
                "company": "Digital Agency",
                "location": "New York, NY",
                "is_remote": False,
                "salary_range": "$65,000 - $95,000",
                "experience_required": f"{experience_level} level",
                "required_skills": ["HTML", "CSS", "JavaScript"],
                "description": "Create beautiful user interfaces for web applications.",
                "match_percentage": 70,
                "why_good_match": "Matches your frontend interests",
                "application_deadline": "2024-02-28",
                "company_size": "10-50 employees",
                "industry": "Digital Marketing"
            }
        ]
        
        return base_recommendations


class JobListView(generics.ListAPIView):
    """List available jobs with AI-powered matching"""
    permission_classes = [permissions.IsAuthenticated]
    queryset = JobListing.objects.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        user = request.user
        
        # Get user profile data
        user_profile = {
            'skills': user.profile.skills or [],
            'experience_level': user.profile.experience_level,
            'career_interests': user.profile.career_interests or [],
            'education_level': user.profile.education_level,
            'target_role': user.profile.target_role,
            'experience_years': 0,  # Could be calculated from resume
            'location': user.profile.location,
            'remote_work_preference': user.profile.remote_work_preference
        }
        
        # Get job recommendations using AI
        matcher = JobMatcher()
        recommendations = matcher.generate_job_recommendations(user_profile)
        
        # Get existing job listings
        queryset = self.get_queryset()
        job_listings = []
        
        for job in queryset:
            job_data = {
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'is_remote': job.is_remote,
                'salary_range': f"${job.salary_min} - ${job.salary_max}" if job.salary_min else "",
                'required_skills': job.required_skills or [],
                'description': job.description
            }
            
            # Calculate match for existing jobs
            match_analysis = matcher.calculate_job_match(user_profile, job_data)
            
            job_listings.append({
                'id': job.id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'is_remote': job.is_remote,
                'salary_range': job_data['salary_range'],
                'required_skills': job.required_skills,
                'description': job.description,
                'match_percentage': match_analysis.get('match_percentage', 0),
                'match_analysis': match_analysis,
                'posted_date': job.created_at,
                'application_deadline': job.application_deadline
            })
        
        # Combine AI recommendations with existing listings
        all_jobs = recommendations + job_listings
        
        # Sort by match percentage
        all_jobs.sort(key=lambda x: x.get('match_percentage', 0), reverse=True)
        
        return Response({
            'jobs': all_jobs,
            'ai_recommendations_count': len(recommendations),
            'database_jobs_count': len(job_listings),
            'total_count': len(all_jobs)
        })


class JobDetailView(generics.RetrieveAPIView):
    """Get job details with AI-powered match analysis"""
    permission_classes = [permissions.IsAuthenticated]
    queryset = JobListing.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        job = self.get_object()
        user = request.user
        
        # Get user profile data
        user_profile = {
            'skills': user.profile.skills or [],
            'experience_level': user.profile.experience_level,
            'career_interests': user.profile.career_interests or [],
            'education_level': user.profile.education_level,
            'target_role': user.profile.target_role,
            'experience_years': 0,
            'location': user.profile.location,
            'remote_work_preference': user.profile.remote_work_preference
        }
        
        job_data = {
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'is_remote': job.is_remote,
            'salary_range': f"${job.salary_min} - ${job.salary_max}" if job.salary_min else "",
            'required_skills': job.required_skills or [],
            'description': job.description
        }
        
        # Calculate detailed match analysis
        matcher = JobMatcher()
        match_analysis = matcher.calculate_job_match(user_profile, job_data)
        
        return Response({
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'is_remote': job.is_remote,
            'salary_min': job.salary_min,
            'salary_max': job.salary_max,
            'required_skills': job.required_skills,
            'preferred_skills': job.preferred_skills,
            'description': job.description,
            'requirements': job.requirements,
            'benefits': job.benefits,
            'company_description': job.company_description,
            'application_deadline': job.application_deadline,
            'created_at': job.created_at,
            'match_analysis': match_analysis,
            'has_applied': JobApplication.objects.filter(user=user, job=job).exists()
        })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_jobs(request):
    """Search jobs with AI-powered filtering and matching"""
    user = request.user
    query = request.query_params.get('q', '')
    location = request.query_params.get('location', '')
    remote_only = request.query_params.get('remote', '').lower() == 'true'
    min_salary = request.query_params.get('min_salary', '')
    skills = request.query_params.get('skills', '').split(',') if request.query_params.get('skills') else []
    
    # Get user profile
    user_profile = {
        'skills': user.profile.skills or [],
        'experience_level': user.profile.experience_level,
        'career_interests': user.profile.career_interests or [],
        'education_level': user.profile.education_level,
        'target_role': user.profile.target_role,
        'experience_years': 0,
        'location': user.profile.location,
        'remote_work_preference': user.profile.remote_work_preference
    }
    
    # Start with base queryset
    queryset = JobListing.objects.filter(is_active=True)
    
    # Apply filters
    if query:
        queryset = queryset.filter(title__icontains=query) | queryset.filter(description__icontains=query)
    
    if location:
        queryset = queryset.filter(location__icontains=location)
    
    if remote_only:
        queryset = queryset.filter(is_remote=True)
    
    if min_salary:
        try:
            min_sal = int(min_salary)
            queryset = queryset.filter(salary_min__gte=min_sal)
        except ValueError:
            pass
    
    # Process results with AI matching
    matcher = JobMatcher()
    results = []
    
    for job in queryset[:20]:  # Limit to 20 results for performance
        job_data = {
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'is_remote': job.is_remote,
            'salary_range': f"${job.salary_min} - ${job.salary_max}" if job.salary_min else "",
            'required_skills': job.required_skills or [],
            'description': job.description
        }
        
        match_analysis = matcher.calculate_job_match(user_profile, job_data)
        
        results.append({
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'is_remote': job.is_remote,
            'salary_range': job_data['salary_range'],
            'required_skills': job.required_skills,
            'description': job.description[:200] + "..." if len(job.description) > 200 else job.description,
            'match_percentage': match_analysis.get('match_percentage', 0),
            'match_level': match_analysis.get('match_level', 'Low'),
            'posted_date': job.created_at
        })
    
    # Sort by match percentage
    results.sort(key=lambda x: x['match_percentage'], reverse=True)
    
    return Response({
        'results': results,
        'count': len(results),
        'query': query,
        'filters_applied': {
            'location': location,
            'remote_only': remote_only,
            'min_salary': min_salary,
            'skills': skills
        }
    })


class ApplicationListView(generics.ListAPIView):
    """List user's job applications"""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        applications = self.get_queryset()
        application_data = []
        
        for app in applications:
            application_data.append({
                'id': app.id,
                'job_title': app.job.title,
                'company': app.job.company,
                'applied_date': app.applied_date,
                'status': app.status,
                'cover_letter': app.cover_letter,
                'notes': app.notes,
                'job_id': app.job.id
            })
        
        return Response({
            'applications': application_data,
            'count': len(application_data)
        })


class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    """Get or update application details"""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        application = self.get_object()
        
        return Response({
            'id': application.id,
            'job': {
                'id': application.job.id,
                'title': application.job.title,
                'company': application.job.company,
                'location': application.job.location
            },
            'applied_date': application.applied_date,
            'status': application.status,
            'cover_letter': application.cover_letter,
            'notes': application.notes,
            'resume_used': application.resume.title if application.resume else None
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def apply_to_job(request, job_id):
    """Apply to a job with AI-generated application insights"""
    try:
        job = get_object_or_404(JobListing, id=job_id, is_active=True)
        user = request.user
        
        # Check if already applied
        if JobApplication.objects.filter(user=user, job=job).exists():
            return Response({
                'error': 'You have already applied to this job'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cover_letter = request.data.get('cover_letter', '')
        resume_id = request.data.get('resume_id', None)
        
        # Create application
        application = JobApplication.objects.create(
            user=user,
            job=job,
            cover_letter=cover_letter,
            resume_id=resume_id if resume_id else None
        )
        
        return Response({
            'message': 'Application submitted successfully',
            'application_id': application.id,
            'job_title': job.title,
            'company': job.company
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error applying to job: {str(e)}")
        return Response({
            'error': 'Failed to submit application. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 