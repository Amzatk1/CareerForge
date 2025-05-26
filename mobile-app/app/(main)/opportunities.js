import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Button, Chip, Searchbar, FAB, Text, Avatar, ActivityIndicator, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import apiClient from '../../utils/api';
import realJobService from '../../services/realJobService';
import { DEMO_MODE } from '../../config/apiKeys';
import JobAPIDebugPanel from '../../components/JobAPIDebugPanel';
import { CAREER_CATEGORIES, ALL_CAREER_JOBS } from '../../data/careerData';

const OPPORTUNITY_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'view-grid' },
  { id: 'jobs', name: 'Jobs', icon: 'briefcase' },
  { id: 'courses', name: 'Courses', icon: 'school' },
  { id: 'events', name: 'Events', icon: 'calendar' },
  { id: 'mentorship', name: 'Mentorship', icon: 'account-group' },
];

// Career-specific job database
const CAREER_SPECIFIC_JOBS = {
  'Software Development': [
    {
      id: 'sd1',
      title: 'Senior React Native Developer',
      company: 'Meta',
      location: 'Remote',
      salary_min: 140000,
      salary_max: 180000,
      type: 'Full-time',
      description: 'Build next-generation mobile experiences for billions of users. Work with React Native, JavaScript, and cutting-edge mobile technologies.',
      apply_url: 'https://www.metacareers.com/jobs/',
      skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux'],
      experience_level: 'senior'
    },
    {
      id: 'sd2',
      title: 'Full Stack Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary_min: 130000,
      salary_max: 170000,
      type: 'Full-time',
      description: 'Design and implement scalable web applications using React, Node.js, and Google Cloud Platform.',
      apply_url: 'https://careers.google.com/jobs/',
      skills: ['React', 'Node.js', 'JavaScript', 'GCP'],
      experience_level: 'mid'
    },
    {
      id: 'sd3',
      title: 'Frontend Developer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      salary_min: 110000,
      salary_max: 150000,
      type: 'Full-time',
      description: 'Create engaging user experiences for our global streaming platform using React and TypeScript.',
      apply_url: 'https://jobs.netflix.com/',
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
      experience_level: 'mid'
    },
    {
      id: 'sd4',
      title: 'Junior Software Developer',
      company: 'Shopify',
      location: 'Remote',
      salary_min: 75000,
      salary_max: 95000,
      type: 'Full-time',
      description: 'Join our team to build e-commerce solutions that power millions of businesses worldwide.',
      apply_url: 'https://www.shopify.com/careers',
      skills: ['JavaScript', 'Ruby', 'React', 'Git'],
      experience_level: 'entry'
    },
    {
      id: 'sd5',
      title: 'Cloud Software Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary_min: 125000,
      salary_max: 165000,
      type: 'Full-time',
      description: 'Build scalable cloud solutions using AWS services and microservices architecture.',
      apply_url: 'https://amazon.jobs/',
      skills: ['AWS', 'Python', 'Java', 'Docker'],
      experience_level: 'mid'
    }
  ],
  'Data Science': [
    {
      id: 'ds1',
      title: 'Senior Data Scientist',
      company: 'Microsoft',
      location: 'Redmond, WA',
      salary_min: 140000,
      salary_max: 180000,
      type: 'Full-time',
      description: 'Lead AI and machine learning projects using Python, R, and Azure ML to drive business insights.',
      apply_url: 'https://careers.microsoft.com/',
      skills: ['Python', 'Machine Learning', 'R', 'Azure ML'],
      experience_level: 'senior'
    },
    {
      id: 'ds2',
      title: 'Data Analyst',
      company: 'Spotify',
      location: 'New York, NY',
      salary_min: 85000,
      salary_max: 115000,
      type: 'Full-time',
      description: 'Analyze user behavior and music streaming patterns to improve our recommendation algorithms.',
      apply_url: 'https://www.lifeatspotify.com/jobs',
      skills: ['SQL', 'Python', 'Tableau', 'Statistics'],
      experience_level: 'mid'
    },
    {
      id: 'ds3',
      title: 'Machine Learning Engineer',
      company: 'Tesla',
      location: 'Palo Alto, CA',
      salary_min: 130000,
      salary_max: 170000,
      type: 'Full-time',
      description: 'Develop ML models for autonomous driving and energy systems.',
      apply_url: 'https://www.tesla.com/careers',
      skills: ['TensorFlow', 'Python', 'PyTorch', 'Computer Vision'],
      experience_level: 'mid'
    },
    {
      id: 'ds4',
      title: 'Junior Data Scientist',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      salary_min: 95000,
      salary_max: 125000,
      type: 'Full-time',
      description: 'Support data-driven decision making for our global marketplace platform.',
      apply_url: 'https://careers.airbnb.com/',
      skills: ['Python', 'SQL', 'Pandas', 'Jupyter'],
      experience_level: 'entry'
    }
  ],
  'UI/UX Design': [
    {
      id: 'ux1',
      title: 'Senior UX Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      salary_min: 130000,
      salary_max: 170000,
      type: 'Full-time',
      description: 'Design intuitive user experiences for iOS and macOS applications used by millions worldwide.',
      apply_url: 'https://jobs.apple.com/',
      skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
      experience_level: 'senior'
    },
    {
      id: 'ux2',
      title: 'Product Designer',
      company: 'Slack',
      location: 'San Francisco, CA',
      salary_min: 110000,
      salary_max: 145000,
      type: 'Full-time',
      description: 'Create seamless collaboration experiences for teams worldwide.',
      apply_url: 'https://slack.com/careers',
      skills: ['Figma', 'Design Systems', 'User Testing', 'Wireframing'],
      experience_level: 'mid'
    },
    {
      id: 'ux3',
      title: 'UI Designer',
      company: 'Adobe',
      location: 'Remote',
      salary_min: 85000,
      salary_max: 115000,
      type: 'Full-time',
      description: 'Design beautiful interfaces for creative software used by millions of artists and designers.',
      apply_url: 'https://adobe.wd5.myworkdayjobs.com/external_experienced',
      skills: ['Adobe XD', 'Photoshop', 'Illustrator', 'UI Design'],
      experience_level: 'mid'
    }
  ],
  'Digital Marketing': [
    {
      id: 'dm1',
      title: 'Digital Marketing Manager',
      company: 'HubSpot',
      location: 'Boston, MA',
      salary_min: 85000,
      salary_max: 115000,
      type: 'Full-time',
      description: 'Lead digital marketing campaigns and growth strategies for our marketing platform.',
      apply_url: 'https://www.hubspot.com/careers',
      skills: ['SEO', 'Google Analytics', 'Content Marketing', 'PPC'],
      experience_level: 'mid'
    },
    {
      id: 'dm2',
      title: 'Social Media Specialist',
      company: 'Buffer',
      location: 'Remote',
      salary_min: 55000,
      salary_max: 75000,
      type: 'Full-time',
      description: 'Manage social media presence and create engaging content for our social media management platform.',
      apply_url: 'https://buffer.com/journey',
      skills: ['Social Media', 'Content Creation', 'Analytics', 'Copywriting'],
      experience_level: 'entry'
    }
  ],
  'Product Management': [
    {
      id: 'pm1',
      title: 'Senior Product Manager',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      salary_min: 150000,
      salary_max: 190000,
      type: 'Full-time',
      description: 'Drive product strategy and execution for our global marketplace platform.',
      apply_url: 'https://careers.airbnb.com/',
      skills: ['Product Strategy', 'Analytics', 'User Research', 'Roadmapping'],
      experience_level: 'senior'
    },
    {
      id: 'pm2',
      title: 'Product Manager',
      company: 'Zoom',
      location: 'San Jose, CA',
      salary_min: 120000,
      salary_max: 155000,
      type: 'Full-time',
      description: 'Shape the future of video communications and collaboration tools.',
      apply_url: 'https://zoom.wd5.myworkdayjobs.com/Zoom',
      skills: ['Product Management', 'Agile', 'Data Analysis', 'User Stories'],
      experience_level: 'mid'
    }
  ]
};

// Career-specific courses
const CAREER_SPECIFIC_COURSES = {
  'Software Development': [
    {
      id: 'sdc1',
      title: 'Complete React Native Developer Course',
      provider: 'Udemy',
      duration: '40 hours',
      price: '$89.99',
      rating: 4.6,
      students: '45,230',
      level: 'Beginner to Advanced',
      skills: ['React Native', 'Redux', 'Firebase', 'Navigation'],
      url: 'https://www.udemy.com/course/the-complete-react-native-and-redux-course/'
    },
    {
      id: 'sdc2',
      title: 'Full Stack Web Development Bootcamp',
      provider: 'freeCodeCamp',
      duration: '300 hours',
      price: 'Free',
      rating: 4.9,
      students: '400,000+',
      level: 'Beginner to Advanced',
      skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
      url: 'https://www.freecodecamp.org/learn/responsive-web-design/'
    },
    {
      id: 'sdc3',
      title: 'Advanced JavaScript Concepts',
      provider: 'Pluralsight',
      duration: '25 hours',
      price: '$29/month',
      rating: 4.7,
      students: '85,000+',
      level: 'Advanced',
      skills: ['JavaScript', 'ES6+', 'Async Programming', 'Design Patterns'],
      url: 'https://www.pluralsight.com/courses/advanced-javascript'
    }
  ],
  'Data Science': [
    {
      id: 'dsc1',
      title: 'Machine Learning Specialization',
      provider: 'Coursera (Stanford)',
      duration: '3 months',
      price: '$79/month',
      rating: 4.9,
      students: '85,000+',
      level: 'Intermediate',
      skills: ['Python', 'TensorFlow', 'Machine Learning', 'Neural Networks'],
      url: 'https://www.coursera.org/specializations/machine-learning-introduction'
    },
    {
      id: 'dsc2',
      title: 'Data Science with Python',
      provider: 'DataCamp',
      duration: '50 hours',
      price: '$35/month',
      rating: 4.6,
      students: '120,000+',
      level: 'Beginner to Intermediate',
      skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
      url: 'https://www.datacamp.com/tracks/data-scientist-with-python'
    }
  ],
  'UI/UX Design': [
    {
      id: 'uxc1',
      title: 'Google UX Design Professional Certificate',
      provider: 'Coursera',
      duration: '6 months',
      price: '$49/month',
      rating: 4.8,
      students: '180,000+',
      level: 'Beginner',
      skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing'],
      url: 'https://www.coursera.org/professional-certificates/google-ux-design'
    },
    {
      id: 'uxc2',
      title: 'UI/UX Design Masterclass',
      provider: 'Udemy',
      duration: '30 hours',
      price: '$94.99',
      rating: 4.7,
      students: '65,000+',
      level: 'Intermediate',
      skills: ['Adobe XD', 'Figma', 'Design Thinking', 'User Testing'],
      url: 'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/'
    }
  ],
  'Digital Marketing': [
    {
      id: 'dmc1',
      title: 'Google Digital Marketing Course',
      provider: 'Google Skillshop',
      duration: '40 hours',
      price: 'Free',
      rating: 4.5,
      students: '500,000+',
      level: 'Beginner to Intermediate',
      skills: ['Google Ads', 'Analytics', 'SEO', 'Social Media'],
      url: 'https://skillshop.withgoogle.com/'
    },
    {
      id: 'dmc2',
      title: 'Facebook Social Media Marketing',
      provider: 'Coursera',
      duration: '5 months',
      price: '$49/month',
      rating: 4.6,
      students: '95,000+',
      level: 'Beginner',
      skills: ['Facebook Ads', 'Instagram Marketing', 'Content Strategy', 'Analytics'],
      url: 'https://www.coursera.org/professional-certificates/facebook-social-media-marketing'
    }
  ]
};

// Career-specific events
const CAREER_SPECIFIC_EVENTS = {
  'Software Development': [
    {
      id: 'sde1',
      title: 'React Conf 2024',
      organizer: 'Meta',
      date: 'May 15-16, 2024',
      location: 'Henderson, NV',
      price: 'Free (Virtual)',
      attendees: '10,000+',
      type: 'Conference',
      url: 'https://conf.react.dev/'
    },
    {
      id: 'sde2',
      title: 'GitHub Universe 2024',
      organizer: 'GitHub',
      date: 'October 29-30, 2024',
      location: 'San Francisco, CA',
      price: 'Free',
      attendees: '12,000+',
      type: 'Conference',
      url: 'https://githubuniverse.com/'
    }
  ],
  'Data Science': [
    {
      id: 'dse1',
      title: 'Strata Data Conference',
      organizer: "O'Reilly",
      date: 'March 20-23, 2024',
      location: 'San Jose, CA',
      price: '$2,095',
      attendees: '3,000+',
      type: 'Conference',
      url: 'https://conferences.oreilly.com/strata'
    },
    {
      id: 'dse2',
      title: 'PyData Global 2024',
      organizer: 'NumFOCUS',
      date: 'December 3-5, 2024',
      location: 'Virtual',
      price: 'Free',
      attendees: '5,000+',
      type: 'Conference',
      url: 'https://pydata.org/global2024/'
    }
  ],
  'UI/UX Design': [
    {
      id: 'uxe1',
      title: 'Design+Research 2024',
      organizer: 'IDEO',
      date: 'June 12-14, 2024',
      location: 'Chicago, IL',
      price: '$1,295',
      attendees: '1,500+',
      type: 'Conference',
      url: 'https://www.ideo.com/events'
    },
    {
      id: 'uxe2',
      title: 'Figma Config 2024',
      organizer: 'Figma',
      date: 'June 26-27, 2024',
      location: 'San Francisco, CA',
      price: 'Free',
      attendees: '8,000+',
      type: 'Conference',
      url: 'https://config.figma.com/'
    }
  ],
  'Digital Marketing': [
    {
      id: 'dme1',
      title: 'Content Marketing World',
      organizer: 'Content Marketing Institute',
      date: 'September 10-12, 2024',
      location: 'Cleveland, OH',
      price: '$1,695',
      attendees: '4,000+',
      type: 'Conference',
      url: 'https://www.contentmarketingworld.com/'
    },
    {
      id: 'dme2',
      title: 'Social Media Marketing World',
      organizer: 'Social Media Examiner',
      date: 'February 26-28, 2024',
      location: 'San Diego, CA',
      price: '$997',
      attendees: '3,000+',
      type: 'Conference',
      url: 'https://www.socialmediaexaminer.com/smmworld/'
    }
  ]
};

export default function OpportunitiesScreen() {
  const { user, tokens } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [opportunities, setOpportunities] = useState({ jobs: [], courses: [], events: [], mentorship: [] });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchOpportunities();
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const profile = await apiClient.get('/auth/profile/detail/');
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarkedJobs');
      if (bookmarks) {
        setBookmarkedJobs(JSON.parse(bookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const saveBookmarks = async (bookmarks) => {
    try {
      await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarks));
      setBookmarkedJobs(bookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const toggleBookmark = async (job) => {
    const isBookmarked = bookmarkedJobs.some(bookmark => bookmark.id === job.id);
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarkedJobs.filter(bookmark => bookmark.id !== job.id);
    } else {
      newBookmarks = [...bookmarkedJobs, job];
    }
    
    await saveBookmarks(newBookmarks);
  };

  const generatePersonalizedOpportunities = (profile) => {
    if (!profile?.careers && !profile?.career_interests) {
      return {
        jobs: [],
        courses: [],
        events: []
      };
    }

    // Support both new career structure (from onboarding) and legacy career_interests
    const userCareers = profile.careers || [];
    const userInterests = profile.career_interests || [];
    const userExperience = profile.experience_level || 'entry';
    const userSkills = profile.skills || [];

    // Generate personalized jobs from shared career data
    let personalizedJobs = [];
    
    // Use new career structure if available
    if (userCareers.length > 0) {
      userCareers.forEach(career => {
        // Find matching jobs from shared data
        const matchingJobs = ALL_CAREER_JOBS.filter(job => 
          job.id === career.id || 
          job.name.toLowerCase().includes(career.name.toLowerCase()) ||
          career.name.toLowerCase().includes(job.name.toLowerCase())
        );
        
        // Create sample job postings based on career data
        matchingJobs.forEach(job => {
          const sampleJob = {
            id: `${job.id}_sample`,
            title: job.name,
            company: 'Various Companies',
            location: 'Remote/Hybrid',
            salary_min: userExperience === 'entry' ? 60000 : userExperience === 'mid' ? 90000 : 120000,
            salary_max: userExperience === 'entry' ? 80000 : userExperience === 'mid' ? 120000 : 160000,
            type: 'Full-time',
            description: `Join our team as a ${job.name}. Work with cutting-edge technologies and grow your career.`,
            apply_url: 'https://careers.example.com/',
            skills: job.skills || [],
            experience_level: userExperience,
            category: job.category,
            categoryId: job.categoryId
          };
          personalizedJobs.push(sampleJob);
        });
      });
    } else {
      // Fallback to legacy career_interests with static data
      userInterests.forEach(interest => {
        const careerJobs = CAREER_SPECIFIC_JOBS[interest] || [];
        const filteredJobs = careerJobs.filter(job => {
          // Filter by experience level
          if (userExperience === 'entry' && job.experience_level === 'senior') return false;
          if (userExperience === 'senior' && job.experience_level === 'entry') return false;
          return true;
        });
        personalizedJobs.push(...filteredJobs);
      });
    }

    // Generate personalized courses
    let personalizedCourses = [];
    userInterests.forEach(interest => {
      const careerCourses = CAREER_SPECIFIC_COURSES[interest] || [];
      personalizedCourses.push(...careerCourses);
    });

    // Generate personalized events
    let personalizedEvents = [];
    userInterests.forEach(interest => {
      const careerEvents = CAREER_SPECIFIC_EVENTS[interest] || [];
      personalizedEvents.push(...careerEvents);
    });

    // Add match scores and format data
    const jobsWithMatch = personalizedJobs.map(job => ({
      ...job,
      posted: getTimeAgo(new Date().toISOString()),
      logo: job.company.charAt(0),
      match: calculateJobMatch(job, profile),
      salary: job.salary_min && job.salary_max 
        ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
        : 'Salary not specified',
    }));

    // Sort by match score and limit results
    jobsWithMatch.sort((a, b) => b.match - a.match);

    return {
      jobs: jobsWithMatch.slice(0, 10),
      courses: personalizedCourses.slice(0, 8),
      events: personalizedEvents.slice(0, 6)
    };
  };

  // Export for use in realJobService fallback
  window.generatePersonalizedOpportunities = generatePersonalizedOpportunities;

  const calculateJobMatch = (job, profile) => {
    if (!profile) return 75;
    
    let score = 50; // Base score
    
    // Skills match (10 points each)
    const userSkills = profile.skills || [];
    const jobSkills = job.skills || [];
    
    userSkills.forEach(userSkill => {
      jobSkills.forEach(jobSkill => {
        if (userSkill.toLowerCase().includes(jobSkill.toLowerCase()) || 
            jobSkill.toLowerCase().includes(userSkill.toLowerCase())) {
          score += 10;
        }
      });
    });
    
    // Experience level match (15 points)
    const userExperience = profile.experience_level || 'entry';
    if (userExperience === job.experience_level) {
      score += 15;
    } else if (
      (userExperience === 'mid' && job.experience_level === 'entry') ||
      (userExperience === 'senior' && job.experience_level === 'mid')
    ) {
      score += 10; // Partial match for higher experience
    }
    
    // Remote work preference (5 points)
    if (profile.remote_work_preference && job.location?.toLowerCase().includes('remote')) {
      score += 5;
    }
    
    return Math.min(score, 100);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      
      // Fetch real jobs from APIs with fallback to static data
      const realJobs = await realJobService.fetchRealJobs(userProfile);
      
      // Generate other opportunities (courses, events, mentorship)
      const personalizedData = generatePersonalizedOpportunities(userProfile);
      
      setOpportunities({
        jobs: realJobs, // Real API data with intelligent fallbacks
        courses: personalizedData.courses,
        events: personalizedData.events,
        mentorship: [
          {
            id: 1,
            name: 'Sarah Johnson',
            title: 'Senior Software Engineer at Google',
            expertise: ['React Native', 'Career Growth', 'Technical Leadership'],
            experience: '8 years',
            rating: 4.9,
            sessions: '120+',
            price: '$80/hour',
            url: 'https://www.codementor.io/'
          },
          {
            id: 2,
            name: 'Michael Chen',
            title: 'Product Manager at Meta',
            expertise: ['Product Strategy', 'Mobile Apps', 'Team Management'],
            experience: '6 years',
            rating: 4.8,
            sessions: '95+',
            price: '$70/hour',
            url: 'https://www.adplist.org/'
          },
          {
            id: 3,
            name: 'Emily Rodriguez',
            title: 'UX Designer at Apple',
            expertise: ['UI/UX Design', 'Design Systems', 'User Research'],
            experience: '5 years',
            rating: 4.9,
            sessions: '80+',
            price: '$65/hour',
            url: 'https://mentorcruise.com/'
          },
          {
            id: 4,
            name: 'David Kim',
            title: 'DevOps Engineer at Netflix',
            expertise: ['AWS', 'Kubernetes', 'CI/CD', 'Infrastructure'],
            experience: '7 years',
            rating: 4.8,
            sessions: '85+',
            price: '$75/hour',
            url: 'https://www.toptal.com/mentors'
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      // Fallback to static data on error
      const fallbackData = generatePersonalizedOpportunities(userProfile);
      setOpportunities({
        jobs: fallbackData.jobs,
        courses: fallbackData.courses,
        events: fallbackData.events,
        mentorship: []
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOpportunities();
    setRefreshing(false);
  };

  const handleApplyToJob = async (job) => {
    try {
      if (job.apply_url) {
        const supported = await Linking.canOpenURL(job.apply_url);
        if (supported) {
          await Linking.openURL(job.apply_url);
        } else {
          Alert.alert('Error', 'Cannot open this job application link');
        }
      } else {
        Alert.alert('No Application Link', 'This job does not have an application link available');
      }
    } catch (error) {
      console.error('Error opening job application:', error);
      Alert.alert('Error', 'Failed to open job application');
    }
  };

  const handleExternalLink = async (url) => {
    try {
      if (url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open this link');
        }
      }
    } catch (error) {
      console.error('Error opening external link:', error);
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const getFilteredOpportunities = () => {
    let filtered = opportunities;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = {
        jobs: opportunities.jobs.filter(job => 
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query))
        ),
        courses: opportunities.courses.filter(course =>
          course.title.toLowerCase().includes(query) ||
          course.provider.toLowerCase().includes(query) ||
          course.skills.some(skill => skill.toLowerCase().includes(query))
        ),
        events: opportunities.events.filter(event =>
          event.title.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query)
        ),
        mentorship: opportunities.mentorship.filter(mentor =>
          mentor.name.toLowerCase().includes(query) ||
          mentor.title.toLowerCase().includes(query) ||
          mentor.expertise.some(skill => skill.toLowerCase().includes(query))
        )
      };
    }
    
    if (selectedCategory === 'all') {
      return {
        jobs: filtered.jobs.slice(0, 5),
        courses: filtered.courses.slice(0, 3),
        events: filtered.events.slice(0, 3),
        mentorship: filtered.mentorship.slice(0, 3),
      };
    }
    return { [selectedCategory]: filtered[selectedCategory] };
  };

  const getMatchColor = (match) => {
    if (match >= 90) return theme.colors.success || '#4caf50';
    if (match >= 80) return theme.colors.primary;
    if (match >= 70) return theme.colors.accent || '#ff9800';
    return theme.colors.outline;
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'adzuna': return '#2196F3'; // Blue
      case 'jooble': return '#4CAF50'; // Green
      case 'careerjet': return '#FF9800'; // Orange
      default: return theme.colors.outline;
    }
  };

  const renderJobCard = (job) => {
    const isBookmarked = bookmarkedJobs.some(bookmark => bookmark.id === job.id);
    
    return (
      <Card key={job.id} style={styles.opportunityCard}>
        <Card.Content>
          <View style={styles.jobHeader}>
            <Avatar.Text 
              size={40} 
              label={job.logo} 
              style={[styles.companyLogo, { backgroundColor: theme.colors.primary }]}
            />
            <View style={styles.jobInfo}>
              <Title style={styles.jobTitle}>{job.title}</Title>
              <Text style={styles.companyName}>{job.company}</Text>
              <View style={styles.jobDetails}>
                <Chip icon="map-marker" style={[styles.detailChip, styles.locationChip]} textStyle={styles.detailChipText}>
                  {job.location}
                </Chip>
                <Chip icon="currency-usd" style={[styles.detailChip, styles.salaryChip]} textStyle={styles.detailChipText}>
                  {job.salary}
                </Chip>
                <Chip style={[styles.detailChip, styles.typeChip]} textStyle={styles.detailChipText}>
                  {job.type}
                </Chip>
              </View>
            </View>
            <View style={styles.jobActions}>
              <View style={styles.matchContainer}>
                <Text style={[styles.matchText, { color: getMatchColor(job.match) }]}>
                  {job.match}% match
                </Text>
              </View>
              <IconButton
                icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                iconColor={isBookmarked ? theme.colors.primary : theme.colors.outline}
                size={20}
                onPress={() => toggleBookmark(job)}
              />
            </View>
          </View>
          
          <View style={styles.skillsContainer}>
            {job.skills.map((skill, index) => (
              <Chip key={index} style={styles.skillChip} textStyle={styles.skillChipText}>
                {skill}
              </Chip>
            ))}
            {job.source && (
              <Chip 
                icon="api" 
                style={[styles.sourceChip, { backgroundColor: getSourceColor(job.source) }]} 
                textStyle={styles.sourceChipText}
              >
                {job.source.toUpperCase()}
              </Chip>
            )}
          </View>
          
          <View style={styles.cardFooter}>
            <Text style={styles.postedTime}>{job.posted}</Text>
            <Button 
              mode="contained" 
              style={styles.applyButton}
              onPress={() => handleApplyToJob(job)}
            >
              Apply Now
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderCourseCard = (course) => (
    <Card key={course.id} style={styles.opportunityCard}>
      <Card.Content>
        <View style={styles.courseHeader}>
          <View style={styles.courseInfo}>
            <Title style={styles.courseTitle}>{course.title}</Title>
            <Text style={styles.providerName}>{course.provider}</Text>
            <View style={styles.courseDetails}>
              <Chip icon="clock" style={[styles.detailChip, styles.durationChip]} textStyle={styles.detailChipText}>
                {course.duration}
              </Chip>
              <Chip icon="star" style={[styles.detailChip, styles.ratingChip]} textStyle={styles.detailChipText}>
                {course.rating} ({course.students})
              </Chip>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{course.price}</Text>
            <Chip style={styles.levelChip} textStyle={styles.levelChipText}>
              {course.level}
            </Chip>
          </View>
        </View>
        
        <View style={styles.skillsContainer}>
          {course.skills.map((skill, index) => (
            <Chip key={index} style={styles.skillChip} textStyle={styles.skillChipText}>
              {skill}
            </Chip>
          ))}
        </View>
        
        <Button 
          mode="contained" 
          style={styles.enrollButton}
          onPress={() => handleExternalLink(course.url)}
        >
          Enroll Now
        </Button>
      </Card.Content>
    </Card>
  );

  const renderEventCard = (event) => (
    <Card key={event.id} style={styles.opportunityCard}>
      <Card.Content>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <Title style={styles.eventTitle}>{event.title}</Title>
            <Text style={styles.organizerName}>{event.organizer}</Text>
            <View style={styles.eventDetails}>
              <Chip icon="calendar" style={[styles.detailChip, styles.dateChip]} textStyle={styles.detailChipText}>
                {event.date}
              </Chip>
              <Chip icon="map-marker" style={[styles.detailChip, styles.locationChip]} textStyle={styles.detailChipText}>
                {event.location}
              </Chip>
            </View>
          </View>
          <View style={styles.eventMeta}>
            <Text style={styles.priceText}>{event.price}</Text>
            <Text style={styles.attendeesText}>{event.attendees} attending</Text>
          </View>
        </View>
        
        <Button 
          mode="contained" 
          style={styles.registerButton}
          onPress={() => handleExternalLink(event.url)}
        >
          Register
        </Button>
      </Card.Content>
    </Card>
  );

  const renderMentorCard = (mentor) => (
    <Card key={mentor.id} style={styles.opportunityCard}>
      <Card.Content>
        <View style={styles.mentorHeader}>
          <Avatar.Text 
            size={50} 
            label={mentor.name.split(' ').map(n => n[0]).join('')} 
            style={[styles.mentorAvatar, { backgroundColor: theme.colors.accent || '#ff9800' }]}
          />
          <View style={styles.mentorInfo}>
            <Title style={styles.mentorName}>{mentor.name}</Title>
            <Text style={styles.mentorTitle}>{mentor.title}</Text>
            <View style={styles.mentorStats}>
              <Chip icon="star" style={[styles.detailChip, styles.ratingChip]} textStyle={styles.detailChipText}>
                {mentor.rating} ({mentor.sessions})
              </Chip>
              <Chip icon="clock" style={[styles.detailChip, styles.experienceChip]} textStyle={styles.detailChipText}>
                {mentor.experience}
              </Chip>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{mentor.price}</Text>
          </View>
        </View>
        
        <View style={styles.skillsContainer}>
          {mentor.expertise.map((skill, index) => (
            <Chip key={index} style={styles.skillChip} textStyle={styles.skillChipText}>
              {skill}
            </Chip>
          ))}
        </View>
        
        <Button 
          mode="contained" 
          style={styles.bookButton}
          onPress={() => handleExternalLink(mentor.url)}
        >
          Book Session
        </Button>
      </Card.Content>
    </Card>
  );

  const renderOpportunitySection = (type, items, title) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>{title}</Title>
          {selectedCategory === 'all' && (
            <Button 
              mode="text" 
              onPress={() => setSelectedCategory(type)}
              textColor={theme.colors.primary}
            >
              View All
            </Button>
          )}
        </View>
        {items.map(item => {
          switch (type) {
            case 'jobs': return renderJobCard(item);
            case 'courses': return renderCourseCard(item);
            case 'events': return renderEventCard(item);
            case 'mentorship': return renderMentorCard(item);
            default: return null;
          }
        })}
      </View>
    );
  };

  const filteredOpportunities = getFilteredOpportunities();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Opportunities</Title>
          <Paragraph style={styles.headerSubtitle}>
            {DEMO_MODE.ENABLED 
              ? 'Demo: Configure API keys for real job listings' 
              : 'Real-time opportunities from LinkedIn, Indeed, and more'}
          </Paragraph>
          <View style={styles.headerActions}>
            {DEMO_MODE.ENABLED && (
              <Chip 
                icon="information" 
                style={styles.demoChip}
                textStyle={styles.demoChipText}
              >
                Demo Mode
              </Chip>
            )}
            <IconButton
              icon="cog"
              size={20}
              onPress={() => setShowDebugPanel(true)}
              style={styles.debugButton}
            />
          </View>
        </View>

        {/* Search */}
        <Searchbar
          placeholder="Search opportunities..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {OPPORTUNITY_CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.selectedCategoryChipText
              ]}
              icon={category.icon}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>

        {/* Opportunities */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>
                {DEMO_MODE.ENABLED 
                  ? 'Loading demo opportunities...' 
                  : 'Fetching real-time job listings...'}
              </Text>
            </View>
          ) : (
            <>
              {renderOpportunitySection('jobs', filteredOpportunities.jobs, 'Job Opportunities')}
              {renderOpportunitySection('courses', filteredOpportunities.courses, 'Learning Courses')}
              {renderOpportunitySection('events', filteredOpportunities.events, 'Events & Networking')}
              {renderOpportunitySection('mentorship', filteredOpportunities.mentorship, 'Mentorship')}
            </>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => router.push('/screens/create-opportunity')}
      />

      {/* Debug Panel Modal */}
      {showDebugPanel && (
        <View style={styles.debugModal}>
          <JobAPIDebugPanel 
            userProfile={userProfile}
            onClose={() => setShowDebugPanel(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.outline,
    marginTop: 4,
  },
  searchBar: {
    margin: 12,
    marginTop: 6,
    elevation: 2,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    gap: 6,
  },
  categoryChip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primary,
  },
  categoryChipText: {
    color: theme.colors.onSurface,
  },
  selectedCategoryChipText: {
    color: theme.colors.surface,
  },
  content: {
    padding: 12,
    paddingTop: 0,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  opportunityCard: {
    marginBottom: 12,
    elevation: 3,
    borderRadius: theme.roundness,
  },
  
  // Job Cards
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogo: {
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 8,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  matchContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  matchText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  salaryChip: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  typeChip: {
    backgroundColor: theme.colors.tertiaryContainer,
  },
  
  // Course Cards
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  durationChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  ratingChip: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  levelChip: {
    backgroundColor: theme.colors.primaryContainer,
    height: 24,
  },
  levelChipText: {
    fontSize: 10,
    color: theme.colors.primary,
  },
  
  // Event Cards
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  organizerName: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dateChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  eventMeta: {
    alignItems: 'flex-end',
  },
  attendeesText: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  
  // Mentor Cards
  mentorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mentorAvatar: {
    marginRight: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mentorTitle: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 8,
  },
  mentorStats: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  experienceChip: {
    backgroundColor: theme.colors.tertiaryContainer,
  },
  
  // Common Elements
  detailChip: {
    backgroundColor: theme.colors.surfaceVariant,
    height: 32,
    marginVertical: 2,
  },
  detailChipText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: theme.colors.primaryContainer,
    height: 28,
  },
  skillChipText: {
    fontSize: 11,
    color: theme.colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedTime: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  
  // Buttons
  applyButton: {
    paddingHorizontal: 16,
  },
  enrollButton: {
    marginTop: 4,
  },
  registerButton: {
    marginTop: 4,
  },
  bookButton: {
    marginTop: 4,
  },
  
  // FAB
  fab: {
    position: 'absolute',
    margin: 12,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  
  // Demo mode styles
  demoChip: {
    backgroundColor: theme.colors.secondaryContainer,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  demoChipText: {
    color: theme.colors.secondary,
    fontSize: 12,
  },
  
  // Source chip styles
  sourceChip: {
    height: 24,
    marginLeft: 8,
  },
  sourceChipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Header actions
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  debugButton: {
    marginLeft: 8,
  },
  
  // Debug modal
  debugModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
}); 