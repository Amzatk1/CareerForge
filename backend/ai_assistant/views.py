from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils import timezone
from django.db import models
import openai
import json
import logging
import time
from typing import Dict, List, Any
from .models import ChatConversation, ChatMessage, AIInsight, UserAIPreferences

logger = logging.getLogger(__name__)

class CareerAIAssistant:
    """AI-powered career assistant using OpenAI GPT-4"""
    
    def __init__(self):
        try:
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        except Exception as e:
            logger.warning(f"Failed to initialize OpenAI client: {str(e)}. Using fallback responses.")
            self.client = None
    
    def get_system_prompt(self, user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> str:
        """Generate system prompt based on user profile and preferences"""
        tone = preferences.get('preferred_tone', 'friendly')
        detail_level = preferences.get('detail_level', 'moderate')
        
        tone_instructions = {
            'professional': "Maintain a professional, business-like tone. Be formal and precise.",
            'friendly': "Be warm, approachable, and encouraging. Use a conversational tone.",
            'casual': "Be relaxed and informal. Use everyday language and be personable.",
            'motivational': "Be inspiring and energetic. Focus on motivation and positive reinforcement."
        }
        
        detail_instructions = {
            'brief': "Keep responses concise and to the point. Provide key information only.",
            'moderate': "Provide balanced responses with good detail but not overwhelming.",
            'detailed': "Give comprehensive, thorough responses with examples and explanations."
        }
        
        return f"""
        You are CareerForge AI, an expert career counselor and mentor with deep knowledge of:
        - Career development and planning
        - Job market trends and opportunities
        - Resume optimization and interview preparation
        - Skill development and learning paths
        - Salary negotiation and career advancement
        - Industry insights and networking strategies

        User Profile:
        - Skills: {user_profile.get('skills', [])}
        - Experience Level: {user_profile.get('experience_level', 'entry')}
        - Career Interests: {user_profile.get('career_interests', [])}
        - Education: {user_profile.get('education_level', 'bachelor')}
        - Target Role: {user_profile.get('target_role', '')}
        - Current Role: {user_profile.get('current_role', '')}
        - Goals: {user_profile.get('goals', '')}

        Communication Style:
        - Tone: {tone_instructions.get(tone, tone_instructions['friendly'])}
        - Detail Level: {detail_instructions.get(detail_level, detail_instructions['moderate'])}

        Guidelines:
        1. Always provide actionable, practical advice
        2. Be encouraging and supportive
        3. Ask clarifying questions when needed
        4. Reference current industry trends when relevant
        5. Suggest specific resources, tools, or next steps
        6. Be honest about challenges while remaining optimistic
        7. Personalize advice based on the user's profile
        8. If you don't know something, admit it and suggest how to find the answer

        Remember: You're helping someone build their career and achieve their professional goals.
        """
    
    def generate_response(self, user_message: str, conversation_history: List[Dict], user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI response to user message"""
        try:
            start_time = time.time()
            
            # Check if OpenAI API key is available or client failed to initialize
            if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == 'your-openai-api-key-here' or self.client is None:
                # Fallback to intelligent mock responses
                mock_responses = {
                    'hello': "Hello! I'm excited to help you with your career journey. What specific area would you like to focus on today?",
                    'career': "Great question about career development! Based on your profile, I'd recommend focusing on building skills in your areas of interest. What specific career goals are you working towards?",
                    'skills': "Skill development is crucial for career growth! Looking at your background, I'd suggest focusing on both technical and soft skills. What skills are you most interested in developing?",
                    'job': "Job searching can be challenging, but with the right strategy, you can find great opportunities! Tell me more about what type of role you're looking for.",
                    'resume': "A strong resume is key to landing interviews! I can help you optimize your resume to highlight your strengths and achievements. What specific areas of your resume would you like to improve?",
                    'interview': "Interview preparation is so important! I can help you practice common questions and develop compelling stories about your experience. What type of interview are you preparing for?",
                    'roadmap': f"I'd love to help you create a personalized learning roadmap! Based on your interests in {', '.join(user_profile.get('career_interests', ['technology']))}, I can suggest a structured path with specific skills, projects, and timelines. What's your main career goal?",
                    'default': "That's a great question! I'm here to help you with all aspects of your career development. Could you tell me more about what you're looking to achieve?"
                }
                
                # Simple keyword matching for demo
                user_lower = user_message.lower()
                response_content = mock_responses['default']
                
                for keyword, response in mock_responses.items():
                    if keyword in user_lower:
                        response_content = response
                        break
                
                response_time = time.time() - start_time
                
                return {
                    'content': response_content,
                    'tokens_used': 50,  # Mock token count
                    'response_time': response_time,
                    'model': 'mock-gpt-4'
                }
            
            # Use actual OpenAI API
            # Build conversation context
            messages = [
                {
                    "role": "system",
                    "content": self.get_system_prompt(user_profile, preferences)
                }
            ]
            
            # Add conversation history (last 10 messages for context)
            for msg in conversation_history[-10:]:
                messages.append({
                    "role": "user" if msg['message_type'] == 'user' else "assistant",
                    "content": msg['content']
                })
            
            # Add current user message
            messages.append({
                "role": "user",
                "content": user_message
            })
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=1500,
                temperature=0.7,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            response_time = time.time() - start_time
            response_content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if hasattr(response, 'usage') else 0
            
            return {
                'content': response_content,
                'tokens_used': tokens_used,
                'response_time': response_time,
                'model': 'gpt-4'
            }
            
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            return {
                'content': "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or feel free to rephrase your question.",
                'tokens_used': 0,
                'response_time': 0.0,
                'model': 'fallback'
            }
    
    def generate_daily_insight(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate daily career insight for user"""
        try:
            prompt = f"""
            Generate a personalized daily career insight for this user:

            User Profile:
            - Skills: {user_profile.get('skills', [])}
            - Experience Level: {user_profile.get('experience_level', 'entry')}
            - Career Interests: {user_profile.get('career_interests', [])}
            - Target Role: {user_profile.get('target_role', '')}
            - Goals: {user_profile.get('goals', '')}

            Create a helpful, actionable insight in JSON format:
            {{
                "insight_type": "career_advice|skill_recommendation|job_market_trend|learning_path|resume_tip|interview_prep|networking_tip|salary_insight",
                "title": "Brief, engaging title",
                "content": "Detailed, actionable content (2-3 paragraphs)",
                "priority": "low|medium|high",
                "is_actionable": true,
                "confidence": 0.85
            }}

            Focus on something timely, relevant, and actionable for their career stage and goals.
            """
            
            if not self.client:
                return self._get_fallback_insight()
                
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a career expert generating personalized daily insights. Be practical and actionable."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=800,
                temperature=0.8
            )
            
            response_text = response.choices[0].message.content
            
            # Extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                insight_data = json.loads(json_str)
                return insight_data
            else:
                return self._get_fallback_insight()
                
        except Exception as e:
            logger.error(f"Error generating daily insight: {str(e)}")
            return self._get_fallback_insight()
    
    def _get_fallback_insight(self) -> Dict[str, Any]:
        """Provide fallback insight when AI fails"""
        return {
            "insight_type": "career_advice",
            "title": "Keep Learning and Growing",
            "content": "Continuous learning is key to career success. Take time today to identify one new skill you'd like to develop and find a resource to start learning it. Even 15 minutes of focused learning can compound into significant growth over time.",
            "priority": "medium",
            "is_actionable": True,
            "confidence": 0.9
        }
    
    def generate_career_roadmap(self, user_profile: Dict[str, Any], goal: str, timeframe: str = "6 months") -> Dict[str, Any]:
        """Generate a personalized career roadmap using GPT"""
        try:
            prompt = f"""
            Create a detailed {timeframe} career roadmap for someone who wants to become a {goal}.

            User Background:
            - Current Skills: {', '.join(user_profile.get('skills', []))}
            - Experience Level: {user_profile.get('experience_level', 'entry')}
            - Career Interests: {', '.join(user_profile.get('career_interests', []))}
            - Education: {user_profile.get('education_level', 'bachelor')}
            - Current Role: {user_profile.get('current_role', 'Not specified')}

            Please provide a structured roadmap in JSON format with the following structure:
            {{
                "title": "Career Roadmap Title",
                "goal": "{goal}",
                "timeframe": "{timeframe}",
                "difficulty": "beginner|intermediate|advanced",
                "phases": [
                    {{
                        "phase_number": 1,
                        "title": "Foundation Phase",
                        "duration": "2 months",
                        "description": "Build core fundamentals",
                        "skills": ["skill1", "skill2", "skill3"],
                        "projects": [
                            {{
                                "name": "Project Name",
                                "description": "Brief description",
                                "estimated_hours": 20
                            }}
                        ],
                        "resources": [
                            {{
                                "name": "Resource Name",
                                "type": "course|book|tutorial|certification",
                                "url": "optional",
                                "description": "Why this resource"
                            }}
                        ]
                    }}
                ],
                "milestones": [
                    {{
                        "title": "Milestone Name",
                        "description": "What you'll achieve",
                        "target_month": 2
                    }}
                ],
                "estimated_total_hours": 200,
                "success_metrics": ["metric1", "metric2"],
                "next_steps": "What to do after completing this roadmap"
            }}

            Make it specific, actionable, and tailored to their background. Include real resources and practical projects.
            """
            
            if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == 'your-openai-api-key-here' or not self.client:
                # Fallback roadmap for demo
                return self._get_fallback_roadmap(goal, timeframe, user_profile)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career counselor and learning path designer. Create detailed, practical roadmaps that help people achieve their career goals."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content
            
            # Extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                roadmap_data = json.loads(json_str)
                return roadmap_data
            else:
                return self._get_fallback_roadmap(goal, timeframe, user_profile)
                
        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            return self._get_fallback_roadmap(goal, timeframe, user_profile)
    
    def _get_fallback_roadmap(self, goal: str, timeframe: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Provide fallback roadmap when GPT fails"""
        return {
            "title": f"{goal} Learning Path",
            "goal": goal,
            "timeframe": timeframe,
            "difficulty": "intermediate",
            "phases": [
                {
                    "phase_number": 1,
                    "title": "Foundation Phase",
                    "duration": "2 months",
                    "description": "Build core fundamentals and essential skills",
                    "skills": ["Problem Solving", "Communication", "Technical Basics"],
                    "projects": [
                        {
                            "name": "Portfolio Website",
                            "description": "Create a personal portfolio to showcase your work",
                            "estimated_hours": 30
                        }
                    ],
                    "resources": [
                        {
                            "name": "Online Learning Platform",
                            "type": "course",
                            "description": "Start with beginner-friendly courses in your field"
                        }
                    ]
                }
            ],
            "milestones": [
                {
                    "title": "Complete Foundation Skills",
                    "description": "Master the basic concepts and tools",
                    "target_month": 2
                }
            ],
            "estimated_total_hours": 150,
            "success_metrics": ["Complete all projects", "Build portfolio", "Network with professionals"],
            "next_steps": "Continue with advanced topics and specialize in your area of interest"
        }
    
    def analyze_resume(self, resume_text: str, target_role: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze resume and provide improvement suggestions"""
        try:
            prompt = f"""
            Analyze this resume for a {target_role} position and provide specific improvement suggestions.

            Resume Content:
            {resume_text}

            Target Role: {target_role}
            User's Career Interests: {', '.join(user_profile.get('career_interests', []))}
            Experience Level: {user_profile.get('experience_level', 'entry')}

            Provide analysis in JSON format:
            {{
                "overall_score": 75,
                "strengths": ["strength1", "strength2"],
                "weaknesses": ["weakness1", "weakness2"],
                "suggestions": [
                    {{
                        "category": "formatting|content|keywords|achievements",
                        "priority": "high|medium|low",
                        "suggestion": "Specific improvement suggestion",
                        "example": "Example of how to implement this"
                    }}
                ],
                "missing_keywords": ["keyword1", "keyword2"],
                "recommended_sections": ["section1", "section2"],
                "ats_score": 80,
                "next_steps": "What to focus on first"
            }}
            """
            
            if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == 'your-openai-api-key-here' or not self.client:
                return self._get_fallback_resume_analysis(target_role)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert resume reviewer and career counselor. Provide detailed, actionable feedback to help people improve their resumes."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content
            
            # Extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                analysis_data = json.loads(json_str)
                return analysis_data
            else:
                return self._get_fallback_resume_analysis(target_role)
                
        except Exception as e:
            logger.error(f"Error analyzing resume: {str(e)}")
            return self._get_fallback_resume_analysis(target_role)
    
    def _get_fallback_resume_analysis(self, target_role: str) -> Dict[str, Any]:
        """Provide fallback resume analysis"""
        return {
            "overall_score": 75,
            "strengths": ["Clear formatting", "Relevant experience"],
            "weaknesses": ["Missing keywords", "Could use more metrics"],
            "suggestions": [
                {
                    "category": "content",
                    "priority": "high",
                    "suggestion": "Add quantifiable achievements with specific numbers and results",
                    "example": "Instead of 'Improved sales', write 'Increased sales by 25% over 6 months'"
                },
                {
                    "category": "keywords",
                    "priority": "medium",
                    "suggestion": f"Include more {target_role}-specific keywords throughout your resume",
                    "example": "Research job postings for common terms and incorporate them naturally"
                }
            ],
            "missing_keywords": ["leadership", "project management", "data analysis"],
            "recommended_sections": ["Skills", "Achievements", "Certifications"],
            "ats_score": 70,
            "next_steps": "Focus on adding quantifiable achievements and relevant keywords first"
        }


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def chat_conversations(request):
    """List user's chat conversations or create a new one"""
    user = request.user
    
    if request.method == 'GET':
        conversations = ChatConversation.objects.filter(user=user, is_active=True)
        conversation_data = []
        
        for conv in conversations:
            last_message = conv.messages.last()
            conversation_data.append({
                'id': conv.id,
                'title': conv.title,
                'created_at': conv.created_at,
                'updated_at': conv.updated_at,
                'last_message_at': conv.last_message_at,
                'message_count': conv.messages.count(),
                'last_message': {
                    'content': last_message.content[:100] + "..." if last_message and len(last_message.content) > 100 else last_message.content if last_message else "",
                    'message_type': last_message.message_type if last_message else ""
                }
            })
        
        return Response({
            'conversations': conversation_data,
            'count': len(conversation_data)
        })
    
    elif request.method == 'POST':
        title = request.data.get('title', 'Career Chat')
        
        conversation = ChatConversation.objects.create(
            user=user,
            title=title
        )
        
        # Only add welcome message for first-time users (no previous conversations)
        is_first_conversation = not ChatConversation.objects.filter(
            user=user, 
            is_active=True
        ).exclude(id=conversation.id).exists()
        
        if is_first_conversation:
            welcome_message = "Welcome to CareerForge AI! 🚀\n\nI'm your personal AI career assistant, and I'm excited to help you build an amazing career! I can assist you with:\n\n• Career planning and goal setting\n• Job search strategies and opportunities\n• Resume optimization and feedback\n• Skill development recommendations\n• Interview preparation tips\n• Salary negotiation advice\n• Industry insights and trends\n\nWhat would you like to work on today? Feel free to ask me anything about your career journey!"
        else:
            welcome_message = "Hello again! I'm ready to continue helping you with your career goals. What can I assist you with today?"
        
        ChatMessage.objects.create(
            conversation=conversation,
            message_type='assistant',
            content=welcome_message,
            ai_model='system'
        )
        
        return Response({
            'message': 'Conversation created successfully',
            'conversation': {
                'id': conversation.id,
                'title': conversation.title,
                'created_at': conversation.created_at
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def chat_conversation_detail(request, conversation_id):
    """Get conversation messages, send new message, or delete conversation"""
    user = request.user
    conversation = get_object_or_404(ChatConversation, id=conversation_id, user=user)
    
    if request.method == 'GET':
        messages = conversation.messages.all()
        message_data = []
        
        for msg in messages:
            message_data.append({
                'id': msg.id,
                'message_type': msg.message_type,
                'content': msg.content,
                'created_at': msg.created_at,
                'ai_model': msg.ai_model,
                'tokens_used': msg.tokens_used,
                'response_time': msg.response_time
            })
        
        return Response({
            'conversation': {
                'id': conversation.id,
                'title': conversation.title,
                'created_at': conversation.created_at,
                'updated_at': conversation.updated_at
            },
            'messages': message_data,
            'message_count': len(message_data)
        })
    
    elif request.method == 'POST':
        user_message = request.data.get('message', '').strip()
        
        if not user_message:
            return Response({
                'error': 'Message content is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save user message
        user_msg = ChatMessage.objects.create(
            conversation=conversation,
            message_type='user',
            content=user_message
        )
        
        # Get user profile and preferences
        user_profile = {
            'skills': user.profile.skills or [],
            'experience_level': user.profile.experience_level,
            'career_interests': user.profile.career_interests or [],
            'education_level': user.profile.education_level,
            'target_role': user.profile.target_role,
            'current_role': user.profile.current_role,
            'goals': user.profile.goals
        }
        
        # Get AI preferences
        ai_prefs, created = UserAIPreferences.objects.get_or_create(user=user)
        preferences = {
            'preferred_tone': ai_prefs.preferred_tone,
            'detail_level': ai_prefs.detail_level
        }
        
        # Get conversation history
        history = list(conversation.messages.values('message_type', 'content'))
        
        # Generate AI response
        assistant = CareerAIAssistant()
        ai_response = assistant.generate_response(user_message, history, user_profile, preferences)
        
        # Save AI response
        ai_msg = ChatMessage.objects.create(
            conversation=conversation,
            message_type='assistant',
            content=ai_response['content'],
            ai_model=ai_response['model'],
            tokens_used=ai_response['tokens_used'],
            response_time=ai_response['response_time']
        )
        
        # Update conversation timestamp
        conversation.last_message_at = timezone.now()
        conversation.save()
        
        return Response({
            'user_message': {
                'id': user_msg.id,
                'content': user_msg.content,
                'created_at': user_msg.created_at
            },
            'ai_response': {
                'id': ai_msg.id,
                'content': ai_msg.content,
                'created_at': ai_msg.created_at,
                'tokens_used': ai_msg.tokens_used,
                'response_time': ai_msg.response_time
            }
        }, status=status.HTTP_201_CREATED)
    
    elif request.method == 'DELETE':
        conversation.delete()
        return Response({
            'message': 'Conversation deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def ai_insights(request):
    """Get AI-generated insights for the user"""
    user = request.user
    insight_type = request.query_params.get('type', None)
    unread_only = request.query_params.get('unread', '').lower() == 'true'
    
    queryset = AIInsight.objects.filter(user=user)
    
    if insight_type:
        queryset = queryset.filter(insight_type=insight_type)
    
    if unread_only:
        queryset = queryset.filter(is_read=False)
    
    # Filter out expired insights
    queryset = queryset.filter(
        models.Q(expires_at__isnull=True) | models.Q(expires_at__gt=timezone.now())
    )
    
    insights = queryset[:20]  # Limit to 20 insights
    insight_data = []
    
    for insight in insights:
        insight_data.append({
            'id': insight.id,
            'insight_type': insight.insight_type,
            'title': insight.title,
            'content': insight.content,
            'priority': insight.priority,
            'is_read': insight.is_read,
            'is_actionable': insight.is_actionable,
            'ai_confidence': insight.ai_confidence,
            'created_at': insight.created_at,
            'expires_at': insight.expires_at
        })
    
    return Response({
        'insights': insight_data,
        'count': len(insight_data),
        'unread_count': AIInsight.objects.filter(user=user, is_read=False).count()
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_daily_insight(request):
    """Generate a new daily insight for the user"""
    user = request.user
    
    # Check if user already has a recent insight (within 24 hours)
    recent_insight = AIInsight.objects.filter(
        user=user,
        created_at__gte=timezone.now() - timezone.timedelta(hours=24)
    ).first()
    
    if recent_insight:
        return Response({
            'message': 'You already have a recent insight',
            'insight': {
                'id': recent_insight.id,
                'title': recent_insight.title,
                'content': recent_insight.content,
                'created_at': recent_insight.created_at
            }
        })
    
    # Get user profile
    user_profile = {
        'skills': user.profile.skills or [],
        'experience_level': user.profile.experience_level,
        'career_interests': user.profile.career_interests or [],
        'education_level': user.profile.education_level,
        'target_role': user.profile.target_role,
        'current_role': user.profile.current_role,
        'goals': user.profile.goals
    }
    
    # Generate insight
    assistant = CareerAIAssistant()
    insight_data = assistant.generate_daily_insight(user_profile)
    
    # Create insight record
    insight = AIInsight.objects.create(
        user=user,
        insight_type=insight_data.get('insight_type', 'career_advice'),
        title=insight_data.get('title', 'Daily Career Insight'),
        content=insight_data.get('content', ''),
        priority=insight_data.get('priority', 'medium'),
        is_actionable=insight_data.get('is_actionable', True),
        ai_confidence=insight_data.get('confidence', 0.8),
        generated_from=user_profile
    )
    
    return Response({
        'message': 'Daily insight generated successfully',
        'insight': {
            'id': insight.id,
            'insight_type': insight.insight_type,
            'title': insight.title,
            'content': insight.content,
            'priority': insight.priority,
            'is_actionable': insight.is_actionable,
            'created_at': insight.created_at
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_insight_read(request, insight_id):
    """Mark an insight as read"""
    user = request.user
    insight = get_object_or_404(AIInsight, id=insight_id, user=user)
    
    insight.is_read = True
    insight.save()
    
    return Response({
        'message': 'Insight marked as read',
        'insight_id': insight.id
    })


@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def ai_preferences(request):
    """Get or update user's AI preferences"""
    user = request.user
    prefs, created = UserAIPreferences.objects.get_or_create(user=user)
    
    if request.method == 'GET':
        return Response({
            'preferred_tone': prefs.preferred_tone,
            'detail_level': prefs.detail_level,
            'enable_proactive_insights': prefs.enable_proactive_insights,
            'enable_daily_tips': prefs.enable_daily_tips,
            'enable_job_alerts': prefs.enable_job_alerts,
            'enable_skill_recommendations': prefs.enable_skill_recommendations,
            'insight_frequency': prefs.insight_frequency,
            'created_at': prefs.created_at,
            'updated_at': prefs.updated_at
        })
    
    elif request.method == 'PUT':
        # Update preferences
        prefs.preferred_tone = request.data.get('preferred_tone', prefs.preferred_tone)
        prefs.detail_level = request.data.get('detail_level', prefs.detail_level)
        prefs.enable_proactive_insights = request.data.get('enable_proactive_insights', prefs.enable_proactive_insights)
        prefs.enable_daily_tips = request.data.get('enable_daily_tips', prefs.enable_daily_tips)
        prefs.enable_job_alerts = request.data.get('enable_job_alerts', prefs.enable_job_alerts)
        prefs.enable_skill_recommendations = request.data.get('enable_skill_recommendations', prefs.enable_skill_recommendations)
        prefs.insight_frequency = request.data.get('insight_frequency', prefs.insight_frequency)
        
        prefs.save()
        
        return Response({
            'message': 'AI preferences updated successfully',
            'preferences': {
                'preferred_tone': prefs.preferred_tone,
                'detail_level': prefs.detail_level,
                'enable_proactive_insights': prefs.enable_proactive_insights,
                'enable_daily_tips': prefs.enable_daily_tips,
                'enable_job_alerts': prefs.enable_job_alerts,
                'enable_skill_recommendations': prefs.enable_skill_recommendations,
                'insight_frequency': prefs.insight_frequency
            }
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def quick_career_question(request):
    """Handle quick career questions without creating a full conversation"""
    user = request.user
    question = request.data.get('question', '').strip()
    
    if not question:
        return Response({
            'error': 'Question is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get user profile and preferences
    user_profile = {
        'skills': user.profile.skills or [],
        'experience_level': user.profile.experience_level,
        'career_interests': user.profile.career_interests or [],
        'education_level': user.profile.education_level,
        'target_role': user.profile.target_role,
        'current_role': user.profile.current_role,
        'goals': user.profile.goals
    }
    
    ai_prefs, created = UserAIPreferences.objects.get_or_create(user=user)
    preferences = {
        'preferred_tone': ai_prefs.preferred_tone,
        'detail_level': ai_prefs.detail_level
    }
    
    # Generate AI response
    assistant = CareerAIAssistant()
    ai_response = assistant.generate_response(question, [], user_profile, preferences)
    
    return Response({
        'question': question,
        'answer': ai_response['content'],
        'response_time': ai_response['response_time'],
        'tokens_used': ai_response['tokens_used']
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_career_roadmap(request):
    """Generate a personalized career roadmap using GPT"""
    user = request.user
    goal = request.data.get('goal', '').strip()
    timeframe = request.data.get('timeframe', '6 months')
    
    if not goal:
        return Response({
            'error': 'Career goal is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get user profile
    user_profile = {
        'skills': user.profile.skills or [],
        'experience_level': user.profile.experience_level,
        'career_interests': user.profile.career_interests or [],
        'education_level': user.profile.education_level,
        'target_role': user.profile.target_role,
        'current_role': user.profile.current_role,
        'goals': user.profile.goals
    }
    
    # Generate roadmap
    assistant = CareerAIAssistant()
    roadmap = assistant.generate_career_roadmap(user_profile, goal, timeframe)
    
    return Response({
        'message': 'Roadmap generated successfully',
        'roadmap': roadmap
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyze_resume(request):
    """Analyze resume and provide improvement suggestions"""
    user = request.user
    resume_text = request.data.get('resume_text', '').strip()
    target_role = request.data.get('target_role', user.profile.target_role or 'Software Developer')
    
    if not resume_text:
        return Response({
            'error': 'Resume text is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get user profile
    user_profile = {
        'skills': user.profile.skills or [],
        'experience_level': user.profile.experience_level,
        'career_interests': user.profile.career_interests or [],
        'education_level': user.profile.education_level,
        'target_role': user.profile.target_role,
        'current_role': user.profile.current_role,
        'goals': user.profile.goals
    }
    
    # Analyze resume
    assistant = CareerAIAssistant()
    analysis = assistant.analyze_resume(resume_text, target_role, user_profile)
    
    return Response({
        'message': 'Resume analyzed successfully',
        'analysis': analysis
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def career_quiz_recommendation(request):
    """Provide career recommendations based on quiz answers"""
    user = request.user
    quiz_answers = request.data.get('answers', {})
    
    if not quiz_answers:
        return Response({
            'error': 'Quiz answers are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get user profile
    user_profile = {
        'skills': user.profile.skills or [],
        'experience_level': user.profile.experience_level,
        'career_interests': user.profile.career_interests or [],
        'education_level': user.profile.education_level,
        'target_role': user.profile.target_role,
        'current_role': user.profile.current_role,
        'goals': user.profile.goals
    }
    
    # Generate career recommendations
    assistant = CareerAIAssistant()
    
    try:
        prompt = f"""
        Based on these career quiz answers and user profile, suggest 3-5 suitable tech career paths.

        Quiz Answers: {json.dumps(quiz_answers)}
        User Profile: {json.dumps(user_profile)}

        Provide recommendations in JSON format:
        {{
            "recommendations": [
                {{
                    "title": "Career Title",
                    "match_percentage": 85,
                    "difficulty": "beginner|intermediate|advanced",
                    "description": "Brief description of the role",
                    "key_skills": ["skill1", "skill2", "skill3"],
                    "salary_range": "$50k - $80k",
                    "growth_potential": "high|medium|low",
                    "why_good_fit": "Explanation of why this matches their profile"
                }}
            ],
            "next_steps": "What they should do next",
            "learning_priority": "What to focus on first"
        }}
        """
        
        if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == 'your-openai-api-key-here' or not assistant.client:
            # Fallback recommendations
            recommendations = {
                "recommendations": [
                    {
                        "title": "Full-Stack Developer",
                        "match_percentage": 90,
                        "difficulty": "intermediate",
                        "description": "Build complete web applications from front-end to back-end",
                        "key_skills": ["JavaScript", "React", "Node.js", "Databases"],
                        "salary_range": "$60k - $120k",
                        "growth_potential": "high",
                        "why_good_fit": "Great for people who like variety and problem-solving"
                    },
                    {
                        "title": "Data Analyst",
                        "match_percentage": 75,
                        "difficulty": "beginner",
                        "description": "Analyze data to help businesses make informed decisions",
                        "key_skills": ["SQL", "Python", "Excel", "Data Visualization"],
                        "salary_range": "$50k - $85k",
                        "growth_potential": "high",
                        "why_good_fit": "Perfect for analytical minds who like finding patterns"
                    }
                ],
                "next_steps": "Start with online courses in your top choice and build a portfolio project",
                "learning_priority": "Focus on foundational programming skills first"
            }
        else:
            response = assistant.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a career counselor specializing in tech careers. Provide personalized, realistic recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                recommendations = json.loads(json_str)
            else:
                recommendations = {
                    "recommendations": [],
                    "next_steps": "Continue exploring your interests",
                    "learning_priority": "Start with basics"
                }
        
        return Response({
            'message': 'Career recommendations generated successfully',
            'recommendations': recommendations
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error generating career recommendations: {str(e)}")
        return Response({
            'error': 'Failed to generate recommendations'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
