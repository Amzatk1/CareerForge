from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.conf import settings
import openai
import PyPDF2
import docx
import json
import logging
import re
from typing import Dict, List, Any
from .models import Resume, ResumeAnalysis

logger = logging.getLogger(__name__)

class ResumeAnalyzer:
    """AI-powered resume analyzer using OpenAI GPT-4"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text.strip()
        except Exception as e:
            logger.error(f"Error extracting PDF text: {str(e)}")
            return ""
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting DOCX text: {str(e)}")
            return ""
    
    def parse_resume_content(self, text: str) -> Dict[str, Any]:
        """Parse resume content using AI to extract structured data"""
        try:
            prompt = f"""
            Analyze the following resume text and extract structured information in JSON format:

            Resume Text:
            {text}

            Please extract and return the following information in JSON format:
            {{
                "personal_info": {{
                    "name": "Full Name",
                    "email": "email@example.com",
                    "phone": "phone number",
                    "location": "city, state/country",
                    "linkedin": "linkedin profile url",
                    "portfolio": "portfolio/website url"
                }},
                "summary": "Professional summary or objective",
                "experience": [
                    {{
                        "title": "Job Title",
                        "company": "Company Name",
                        "duration": "Start Date - End Date",
                        "description": "Job description and achievements",
                        "years": 2.5
                    }}
                ],
                "education": [
                    {{
                        "degree": "Degree Type",
                        "institution": "School Name",
                        "year": "Graduation Year",
                        "gpa": "GPA if mentioned"
                    }}
                ],
                "skills": [
                    "skill1", "skill2", "skill3"
                ],
                "certifications": [
                    "certification1", "certification2"
                ],
                "projects": [
                    {{
                        "name": "Project Name",
                        "description": "Project description",
                        "technologies": ["tech1", "tech2"]
                    }}
                ],
                "languages": ["English", "Spanish"],
                "total_experience_years": 5.5
            }}

            Only return valid JSON. If information is not available, use empty strings or arrays.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert resume parser. Extract structured information from resumes and return only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.3
            )
            
            response_text = response.choices[0].message.content
            
            # Extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                parsed_data = json.loads(json_str)
                return parsed_data
            else:
                return self._extract_basic_info(text)
                
        except Exception as e:
            logger.error(f"Error parsing resume with AI: {str(e)}")
            return self._extract_basic_info(text)
    
    def _extract_basic_info(self, text: str) -> Dict[str, Any]:
        """Fallback method to extract basic info using regex"""
        # Basic email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        
        # Basic phone extraction
        phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, text)
        
        # Basic skills extraction (common tech skills)
        common_skills = [
            'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
            'Git', 'Docker', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'Django', 'Flask'
        ]
        found_skills = [skill for skill in common_skills if skill.lower() in text.lower()]
        
        return {
            "personal_info": {
                "email": emails[0] if emails else "",
                "phone": ''.join(phones[0]) if phones else "",
                "name": "",
                "location": "",
                "linkedin": "",
                "portfolio": ""
            },
            "summary": "",
            "experience": [],
            "education": [],
            "skills": found_skills,
            "certifications": [],
            "projects": [],
            "languages": [],
            "total_experience_years": 0
        }
    
    def analyze_resume(self, parsed_data: Dict[str, Any], target_role: str = "") -> Dict[str, Any]:
        """Analyze resume and provide AI-powered feedback"""
        try:
            prompt = f"""
            Analyze this resume data and provide comprehensive feedback for improvement:

            Resume Data:
            {json.dumps(parsed_data, indent=2)}

            Target Role: {target_role if target_role else "General career advancement"}

            Please provide analysis in the following JSON format:
            {{
                "overall_score": 85,
                "strengths": [
                    "Strong technical skills in relevant technologies",
                    "Good project experience"
                ],
                "weaknesses": [
                    "Missing specific achievements with metrics",
                    "Could improve summary section"
                ],
                "suggestions": [
                    "Add quantifiable achievements (e.g., 'Increased efficiency by 30%')",
                    "Include more relevant keywords for ATS optimization"
                ],
                "missing_sections": [
                    "Professional summary",
                    "Certifications"
                ],
                "keyword_optimization": {{
                    "current_keywords": ["Python", "React", "SQL"],
                    "suggested_keywords": ["Machine Learning", "Cloud Computing", "Agile"],
                    "ats_score": 75
                }},
                "formatting_feedback": [
                    "Use consistent date formatting",
                    "Add more white space for readability"
                ],
                "experience_analysis": {{
                    "total_years": 3.5,
                    "career_progression": "Good upward trajectory",
                    "gaps": "No significant gaps detected"
                }},
                "skill_match": {{
                    "relevant_skills": ["Python", "React"],
                    "missing_skills": ["Docker", "Kubernetes"],
                    "skill_level": "Intermediate"
                }},
                "next_steps": [
                    "Add portfolio projects showcasing recent work",
                    "Get AWS certification to strengthen cloud skills"
                ]
            }}

            Focus on actionable, specific feedback that will help improve the resume's effectiveness.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career counselor and resume reviewer with deep knowledge of hiring practices and ATS systems."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2500,
                temperature=0.5
            )
            
            response_text = response.choices[0].message.content
            
            # Extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                analysis = json.loads(json_str)
                return analysis
            else:
                return self._get_fallback_analysis()
                
        except Exception as e:
            logger.error(f"Error analyzing resume with AI: {str(e)}")
            return self._get_fallback_analysis()
    
    def _get_fallback_analysis(self) -> Dict[str, Any]:
        """Provide fallback analysis when AI fails"""
        return {
            "overall_score": 70,
            "strengths": [
                "Resume uploaded successfully",
                "Basic information detected"
            ],
            "weaknesses": [
                "Unable to perform detailed analysis",
                "May need manual review"
            ],
            "suggestions": [
                "Ensure resume is in a clear, readable format",
                "Include quantifiable achievements",
                "Use relevant keywords for your target role"
            ],
            "missing_sections": [],
            "keyword_optimization": {
                "current_keywords": [],
                "suggested_keywords": [],
                "ats_score": 60
            },
            "formatting_feedback": [
                "Use a clean, professional format",
                "Ensure consistent formatting throughout"
            ],
            "experience_analysis": {
                "total_years": 0,
                "career_progression": "Unable to analyze",
                "gaps": "Unable to detect"
            },
            "skill_match": {
                "relevant_skills": [],
                "missing_skills": [],
                "skill_level": "Unknown"
            },
            "next_steps": [
                "Review resume format and try uploading again",
                "Consider professional resume review"
            ]
        }


class ResumeListView(generics.ListAPIView):
    """List user's resumes"""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        resumes = self.get_queryset()
        resume_data = []
        
        for resume in resumes:
            resume_data.append({
                'id': resume.id,
                'title': resume.title,
                'created_at': resume.created_at,
                'updated_at': resume.updated_at,
                'match_score': float(resume.match_score),
                'skills_extracted': resume.skills_extracted,
                'experience_years': resume.experience_years,
                'has_analysis': bool(resume.ai_feedback)
            })
        
        return Response({
            'resumes': resume_data,
            'count': len(resume_data)
        })


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific resume"""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        resume = self.get_object()
        
        return Response({
            'id': resume.id,
            'title': resume.title,
            'created_at': resume.created_at,
            'updated_at': resume.updated_at,
            'raw_text': resume.raw_text,
            'parsed_data': resume.parsed_data,
            'skills_extracted': resume.skills_extracted,
            'experience_years': resume.experience_years,
            'education_level': resume.education_level,
            'job_titles': resume.job_titles,
            'ai_feedback': resume.ai_feedback,
            'match_score': float(resume.match_score),
            'file_url': resume.file.url if resume.file else None
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_resume(request):
    """Upload and parse a resume"""
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    title = request.data.get('title', f'Resume - {file.name}')
    
    # Validate file type
    allowed_extensions = ['.pdf', '.docx', '.doc']
    file_extension = file.name.lower().split('.')[-1]
    if f'.{file_extension}' not in allowed_extensions:
        return Response({
            'error': 'Invalid file type. Please upload PDF or DOCX files only.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create resume instance
        resume = Resume.objects.create(
            user=request.user,
            title=title,
            file=file
        )
        
        # Extract text from file
        analyzer = ResumeAnalyzer()
        file_path = resume.file.path
        
        if file_extension == 'pdf':
            text = analyzer.extract_text_from_pdf(file_path)
        elif file_extension in ['docx', 'doc']:
            text = analyzer.extract_text_from_docx(file_path)
        else:
            text = ""
        
        resume.raw_text = text
        
        # Parse resume content
        if text:
            parsed_data = analyzer.parse_resume_content(text)
            resume.parsed_data = parsed_data
            
            # Extract key information
            resume.skills_extracted = parsed_data.get('skills', [])
            resume.experience_years = parsed_data.get('total_experience_years', 0)
            
            # Extract education level
            education = parsed_data.get('education', [])
            if education:
                degrees = [edu.get('degree', '').lower() for edu in education]
                if any('phd' in degree or 'doctorate' in degree for degree in degrees):
                    resume.education_level = 'doctorate'
                elif any('master' in degree or 'mba' in degree for degree in degrees):
                    resume.education_level = 'masters'
                elif any('bachelor' in degree for degree in degrees):
                    resume.education_level = 'bachelors'
                else:
                    resume.education_level = 'other'
            
            # Extract job titles
            experience = parsed_data.get('experience', [])
            resume.job_titles = [exp.get('title', '') for exp in experience if exp.get('title')]
        
        resume.save()
        
        return Response({
            'message': 'Resume uploaded and parsed successfully',
            'resume': {
                'id': resume.id,
                'title': resume.title,
                'skills_extracted': resume.skills_extracted,
                'experience_years': resume.experience_years,
                'education_level': resume.education_level,
                'job_titles': resume.job_titles
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error uploading resume: {str(e)}")
        return Response({
            'error': 'Failed to process resume. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyze_resume(request, pk):
    """Analyze a resume and provide feedback"""
    try:
        resume = get_object_or_404(Resume, pk=pk, user=request.user)
        target_role = request.data.get('target_role', '')
        
        if not resume.parsed_data:
            return Response({
                'error': 'Resume has not been parsed yet. Please upload the resume first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Analyze resume using AI
        analyzer = ResumeAnalyzer()
        analysis = analyzer.analyze_resume(resume.parsed_data, target_role)
        
        # Save analysis results
        resume.ai_feedback = analysis
        resume.match_score = analysis.get('overall_score', 0)
        resume.save()
        
        # Create or update ResumeAnalysis record
        analysis_obj, created = ResumeAnalysis.objects.get_or_create(
            resume=resume,
            defaults={
                'analysis_data': analysis,
                'target_role': target_role,
                'overall_score': analysis.get('overall_score', 0),
                'strengths': analysis.get('strengths', []),
                'weaknesses': analysis.get('weaknesses', []),
                'suggestions': analysis.get('suggestions', [])
            }
        )
        
        if not created:
            analysis_obj.analysis_data = analysis
            analysis_obj.target_role = target_role
            analysis_obj.overall_score = analysis.get('overall_score', 0)
            analysis_obj.strengths = analysis.get('strengths', [])
            analysis_obj.weaknesses = analysis.get('weaknesses', [])
            analysis_obj.suggestions = analysis.get('suggestions', [])
            analysis_obj.save()
        
        return Response({
            'message': 'Resume analyzed successfully',
            'analysis': analysis,
            'resume_id': resume.id
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return Response({
            'error': 'Failed to analyze resume. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 