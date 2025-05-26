import openai
import json
import logging
from django.conf import settings
from typing import Dict, List, Any
from .models import CareerRoadmap, RoadmapTask, LearningResource

logger = logging.getLogger(__name__)

# Set OpenAI API key
openai.api_key = settings.OPENAI_API_KEY


class RoadmapGenerator:
    """AI-powered career roadmap generator using OpenAI GPT-4"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def generate_roadmap(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a comprehensive career roadmap based on user profile
        
        Args:
            user_profile: Dictionary containing user's career information
            
        Returns:
            Dictionary containing the generated roadmap data
        """
        try:
            prompt = self._create_roadmap_prompt(user_profile)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career counselor and mentor with deep knowledge of various industries, skills, and career paths. Generate detailed, actionable career roadmaps."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=3000,
                temperature=0.7
            )
            
            roadmap_text = response.choices[0].message.content
            roadmap_data = self._parse_roadmap_response(roadmap_text)
            
            return roadmap_data
            
        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            return self._get_fallback_roadmap(user_profile)
    
    def _create_roadmap_prompt(self, user_profile: Dict[str, Any]) -> str:
        """Create a detailed prompt for GPT-4 based on user profile"""
        
        current_role = user_profile.get('current_role', 'Entry Level')
        target_role = user_profile.get('target_role', 'Software Developer')
        experience_level = user_profile.get('experience_level', 'entry')
        education_level = user_profile.get('education_level', 'bachelor')
        skills = user_profile.get('skills', [])
        interests = user_profile.get('career_interests', [])
        goals = user_profile.get('goals', '')
        duration_months = user_profile.get('duration_months', 6)
        
        prompt = f"""
        Create a detailed {duration_months}-month career roadmap for someone transitioning from "{current_role}" to "{target_role}".

        User Profile:
        - Current Role: {current_role}
        - Target Role: {target_role}
        - Experience Level: {experience_level}
        - Education: {education_level}
        - Current Skills: {', '.join(skills) if skills else 'None specified'}
        - Career Interests: {', '.join(interests) if interests else 'None specified'}
        - Goals: {goals if goals else 'Career advancement'}

        Please provide a comprehensive roadmap in the following JSON format:
        {{
            "title": "Career Roadmap Title",
            "description": "Brief description of the roadmap",
            "duration_months": {duration_months},
            "skills_to_learn": ["skill1", "skill2", "skill3"],
            "tools_to_master": ["tool1", "tool2", "tool3"],
            "certifications": ["cert1", "cert2"],
            "projects": [
                {{
                    "title": "Project Title",
                    "description": "Project description",
                    "skills_used": ["skill1", "skill2"],
                    "estimated_weeks": 2
                }}
            ],
            "learning_resources": [
                {{
                    "title": "Resource Title",
                    "type": "course|book|article|video",
                    "url": "https://example.com",
                    "description": "Resource description",
                    "difficulty": "beginner|intermediate|advanced"
                }}
            ],
            "weekly_tasks": [
                {{
                    "week": 1,
                    "tasks": [
                        {{
                            "title": "Task Title",
                            "description": "Task description",
                            "type": "skill|project|certification|reading|practice",
                            "estimated_hours": 5,
                            "priority": "low|medium|high|critical"
                        }}
                    ]
                }}
            ]
        }}

        Focus on:
        1. Practical, actionable steps
        2. Industry-relevant skills and tools
        3. Progressive difficulty
        4. Real-world projects
        5. Networking opportunities
        6. Portfolio building
        7. Interview preparation

        Make sure the roadmap is realistic and achievable within the specified timeframe.
        """
        
        return prompt
    
    def _parse_roadmap_response(self, response_text: str) -> Dict[str, Any]:
        """Parse the GPT-4 response and extract roadmap data"""
        try:
            # Try to extract JSON from the response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                roadmap_data = json.loads(json_str)
                return roadmap_data
            else:
                # If no JSON found, create structured data from text
                return self._extract_data_from_text(response_text)
                
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON from GPT response, extracting from text")
            return self._extract_data_from_text(response_text)
    
    def _extract_data_from_text(self, text: str) -> Dict[str, Any]:
        """Extract roadmap data from unstructured text response"""
        # This is a fallback method to extract data when JSON parsing fails
        lines = text.split('\n')
        
        roadmap_data = {
            "title": "AI-Generated Career Roadmap",
            "description": "Personalized career development plan",
            "duration_months": 6,
            "skills_to_learn": [],
            "tools_to_master": [],
            "certifications": [],
            "projects": [],
            "learning_resources": [],
            "weekly_tasks": []
        }
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Identify sections
            if 'skills' in line.lower() and 'learn' in line.lower():
                current_section = 'skills'
            elif 'tools' in line.lower():
                current_section = 'tools'
            elif 'certification' in line.lower():
                current_section = 'certifications'
            elif 'project' in line.lower():
                current_section = 'projects'
            elif line.startswith('- ') or line.startswith('• '):
                # Extract list items
                item = line[2:].strip()
                if current_section == 'skills':
                    roadmap_data['skills_to_learn'].append(item)
                elif current_section == 'tools':
                    roadmap_data['tools_to_master'].append(item)
                elif current_section == 'certifications':
                    roadmap_data['certifications'].append(item)
        
        return roadmap_data
    
    def _get_fallback_roadmap(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Provide a fallback roadmap when AI generation fails"""
        target_role = user_profile.get('target_role', 'Software Developer')
        
        return {
            "title": f"Career Path to {target_role}",
            "description": "A structured approach to advancing your career",
            "duration_months": 6,
            "skills_to_learn": [
                "Problem Solving",
                "Communication",
                "Technical Skills",
                "Project Management"
            ],
            "tools_to_master": [
                "Industry-standard software",
                "Collaboration tools",
                "Project management tools"
            ],
            "certifications": [
                "Relevant industry certifications"
            ],
            "projects": [
                {
                    "title": "Portfolio Project",
                    "description": "Build a project showcasing your skills",
                    "skills_used": ["Technical Skills", "Problem Solving"],
                    "estimated_weeks": 4
                }
            ],
            "learning_resources": [
                {
                    "title": "Industry Fundamentals Course",
                    "type": "course",
                    "url": "https://example.com",
                    "description": "Learn the basics of your target field",
                    "difficulty": "beginner"
                }
            ],
            "weekly_tasks": [
                {
                    "week": 1,
                    "tasks": [
                        {
                            "title": "Research Industry Trends",
                            "description": "Study current trends in your target field",
                            "type": "reading",
                            "estimated_hours": 5,
                            "priority": "high"
                        }
                    ]
                }
            ]
        }
    
    def create_roadmap_from_data(self, user, roadmap_data: Dict[str, Any]) -> CareerRoadmap:
        """Create a CareerRoadmap instance from generated data"""
        
        # Create the main roadmap
        roadmap = CareerRoadmap.objects.create(
            user=user,
            title=roadmap_data.get('title', 'AI-Generated Career Roadmap'),
            description=roadmap_data.get('description', ''),
            target_role=roadmap_data.get('target_role', user.profile.target_role),
            current_level=user.profile.experience_level,
            target_level='advanced',
            duration_months=roadmap_data.get('duration_months', 6),
            skills_to_learn=roadmap_data.get('skills_to_learn', []),
            tools_to_master=roadmap_data.get('tools_to_master', []),
            certifications=roadmap_data.get('certifications', []),
            projects=roadmap_data.get('projects', []),
            learning_resources=roadmap_data.get('learning_resources', [])
        )
        
        # Create tasks from weekly_tasks
        weekly_tasks = roadmap_data.get('weekly_tasks', [])
        for week_data in weekly_tasks:
            week_number = week_data.get('week', 1)
            tasks = week_data.get('tasks', [])
            
            for i, task_data in enumerate(tasks):
                RoadmapTask.objects.create(
                    roadmap=roadmap,
                    title=task_data.get('title', 'Task'),
                    description=task_data.get('description', ''),
                    task_type=task_data.get('type', 'skill'),
                    priority=task_data.get('priority', 'medium'),
                    estimated_hours=task_data.get('estimated_hours', 1),
                    week_number=week_number,
                    order=i
                )
        
        return roadmap
    
    def suggest_learning_resources(self, skills: List[str]) -> List[Dict[str, Any]]:
        """Suggest learning resources for specific skills"""
        try:
            skills_str = ', '.join(skills)
            prompt = f"""
            Suggest 5-10 high-quality learning resources for these skills: {skills_str}
            
            For each resource, provide:
            - Title
            - Type (course, book, article, video, tutorial)
            - URL (if available)
            - Description
            - Difficulty level (beginner, intermediate, advanced)
            - Provider (if applicable)
            
            Focus on free and popular resources when possible.
            Format as JSON array.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a learning resource curator."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.5
            )
            
            resources_text = response.choices[0].message.content
            
            # Try to parse JSON response
            try:
                start_idx = resources_text.find('[')
                end_idx = resources_text.rfind(']') + 1
                if start_idx != -1 and end_idx != -1:
                    json_str = resources_text[start_idx:end_idx]
                    resources = json.loads(json_str)
                    return resources
            except:
                pass
            
            return []
            
        except Exception as e:
            logger.error(f"Error suggesting resources: {str(e)}")
            return [] 