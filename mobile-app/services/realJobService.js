import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, DEMO_MODE } from '../config/apiKeys';

// Cache management
const CACHE_PREFIX = 'job_cache_';
const RATE_LIMIT_PREFIX = 'rate_limit_';

class RealJobService {
  constructor() {
    this.cache = new Map();
    this.rateLimits = new Map();
  }

  // Main function to fetch real jobs with fallbacks
  async fetchRealJobs(userProfile) {
    try {
      console.log('🔍 Fetching real jobs for profile:', userProfile?.career_interests);
      
      // Check if in demo mode
      if (DEMO_MODE.ENABLED) {
        console.log('📝 Demo mode enabled, using static data');
        return this.getFallbackJobs(userProfile);
      }

      // Generate search parameters from user profile
      const searchParams = this.generateSearchParams(userProfile);
      
      // Try to get from cache first
      const cachedJobs = await this.getCachedJobs(searchParams);
      if (cachedJobs && cachedJobs.length > 0) {
        console.log('💾 Using cached jobs:', cachedJobs.length);
        return this.processJobs(cachedJobs, userProfile);
      }

      // Fetch from multiple APIs with rate limiting
      const jobResults = await this.fetchFromMultipleAPIs(searchParams);
      
      if (jobResults.length > 0) {
        // Cache the results
        await this.setCachedJobs(searchParams, jobResults);
        console.log('✅ Fetched real jobs:', jobResults.length);
        return this.processJobs(jobResults, userProfile);
      }

      // Fallback to static data if no results
      console.log('⚠️ No real jobs found, using fallback data');
      return this.getFallbackJobs(userProfile);

    } catch (error) {
      console.error('❌ Error fetching real jobs:', error);
      return this.getFallbackJobs(userProfile);
    }
  }

  // Generate search parameters from user profile
  generateSearchParams(userProfile) {
    const interests = userProfile?.career_interests || [];
    const skills = userProfile?.skills || [];
    const location = userProfile?.location || 'remote';
    
    // Map career interests to job search terms
    const keywordMap = {
      'Software Development': ['software engineer', 'developer', 'programmer', 'frontend', 'backend'],
      'Data Science': ['data scientist', 'data analyst', 'machine learning', 'data engineer'],
      'UI/UX Design': ['ux designer', 'ui designer', 'product designer', 'graphic designer'],
      'Digital Marketing': ['digital marketing', 'marketing manager', 'seo specialist', 'content marketing'],
      'Product Management': ['product manager', 'product owner', 'project manager'],
      'Sales & Business Development': ['sales manager', 'business development', 'account manager'],
    };
    
    let keywords = [];
    interests.forEach(interest => {
      if (keywordMap[interest]) {
        keywords.push(...keywordMap[interest]);
      }
    });
    
    // Add user skills as keywords
    keywords.push(...skills.slice(0, 3));
    
    // If no keywords, use general terms
    if (keywords.length === 0) {
      keywords = ['software', 'marketing', 'manager', 'analyst'];
    }

    return {
      keywords: keywords.slice(0, 5).join(' OR '), // Limit to 5 keywords
      location: location,
      experience: userProfile?.experience_level || 'mid',
      remote: userProfile?.remote_work_preference || false
    };
  }

  // Fetch from multiple APIs with intelligent fallbacks
  async fetchFromMultipleAPIs(searchParams) {
    const allJobs = [];
    
    // Try Adzuna first (most reliable)
    try {
      if (await this.checkRateLimit('adzuna')) {
        const adzunaJobs = await this.fetchFromAdzuna(searchParams);
        allJobs.push(...adzunaJobs);
        await this.updateRateLimit('adzuna');
      }
    } catch (error) {
      console.warn('Adzuna API failed:', error.message);
    }

    // Try Jooble if we need more jobs
    if (allJobs.length < 10) {
      try {
        if (await this.checkRateLimit('jooble')) {
          const joobleJobs = await this.fetchFromJooble(searchParams);
          allJobs.push(...joobleJobs);
          await this.updateRateLimit('jooble');
        }
      } catch (error) {
        console.warn('Jooble API failed:', error.message);
      }
    }

    // Try CareerJet if we still need more jobs
    if (allJobs.length < 10) {
      try {
        if (await this.checkRateLimit('careerjet')) {
          const careerjetJobs = await this.fetchFromCareerJet(searchParams);
          allJobs.push(...careerjetJobs);
          await this.updateRateLimit('careerjet');
        }
      } catch (error) {
        console.warn('CareerJet API failed:', error.message);
      }
    }

    // Deduplicate jobs by title and company
    return this.deduplicateJobs(allJobs);
  }

  // Fetch jobs from Adzuna API
  async fetchFromAdzuna(searchParams) {
    const { ADZUNA } = API_CONFIG;
    const url = `${ADZUNA.BASE_URL}/${ADZUNA.COUNTRY}/search/1?` +
      `app_id=${ADZUNA.APP_ID}&app_key=${ADZUNA.APP_KEY}&` +
      `what=${encodeURIComponent(searchParams.keywords)}&` +
      `where=${encodeURIComponent(searchParams.location)}&` +
      `results_per_page=20&sort_by=relevance`;

    console.log('🔍 Fetching from Adzuna:', url.replace(ADZUNA.APP_KEY, '***'));
    
    const response = await fetch(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CareerForge-Mobile-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.results || []).map(job => ({
      id: `adzuna_${job.id}`,
      title: job.title,
      company: job.company?.display_name || 'Company Name',
      location: job.location?.display_name || searchParams.location,
      salary: this.formatSalary(job.salary_min, job.salary_max),
      type: job.contract_type || 'Full-time',
      description: job.description || '',
      apply_url: job.redirect_url,
      posted: this.formatDate(job.created),
      skills: this.extractSkillsFromDescription(job.description || ''),
      source: 'adzuna',
      logo: job.company?.display_name?.charAt(0) || 'C'
    }));
  }

  // Fetch jobs from Jooble API
  async fetchFromJooble(searchParams) {
    const { JOOBLE } = API_CONFIG;
    const url = `${JOOBLE.BASE_URL}/${JOOBLE.API_KEY}`;

    const requestBody = {
      keywords: searchParams.keywords,
      location: searchParams.location,
      page: 1
    };

    console.log('🔍 Fetching from Jooble');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CareerForge-Mobile-App/1.0'
      },
      body: JSON.stringify(requestBody),
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Jooble API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.jobs || []).map(job => ({
      id: `jooble_${job.id || Math.random()}`,
      title: job.title,
      company: job.company || 'Company Name',
      location: job.location || searchParams.location,
      salary: job.salary || 'Salary not specified',
      type: job.type || 'Full-time',
      description: job.snippet || '',
      apply_url: job.link,
      posted: this.formatDate(job.updated),
      skills: this.extractSkillsFromDescription(job.snippet || ''),
      source: 'jooble',
      logo: job.company?.charAt(0) || 'C'
    }));
  }

  // Fetch jobs from CareerJet API
  async fetchFromCareerJet(searchParams) {
    const { CAREERJET } = API_CONFIG;
    const url = `${CAREERJET.BASE_URL}?` +
      `affid=${CAREERJET.AFFILIATE_ID}&` +
      `keywords=${encodeURIComponent(searchParams.keywords)}&` +
      `location=${encodeURIComponent(searchParams.location)}&` +
      `pagesize=20&page=1&sort=relevance&contracttype=p`;

    console.log('🔍 Fetching from CareerJet');
    
    const response = await fetch(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CareerForge-Mobile-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`CareerJet API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.jobs || []).map(job => ({
      id: `careerjet_${job.jobid}`,
      title: job.jobtitle,
      company: job.company || 'Company Name',
      location: job.locations || searchParams.location,
      salary: job.salary || 'Salary not specified',
      type: job.contracttype || 'Full-time',
      description: job.jobdescription || '',
      apply_url: job.url,
      posted: this.formatDate(job.date),
      skills: this.extractSkillsFromDescription(job.jobdescription || ''),
      source: 'careerjet',
      logo: job.company?.charAt(0) || 'C'
    }));
  }

  // Process and score jobs based on user profile
  processJobs(jobs, userProfile) {
    return jobs
      .map(job => ({
        ...job,
        match: this.calculateJobMatch(job, userProfile)
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 10); // Return top 10 matches
  }

  // Calculate job match score
  calculateJobMatch(job, userProfile) {
    if (!userProfile) return 75;
    
    let score = 50; // Base score
    
    // Skills match (10 points each, max 40 points)
    const userSkills = userProfile.skills || [];
    const jobSkills = job.skills || [];
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    
    let skillMatches = 0;
    userSkills.forEach(userSkill => {
      const skillLower = userSkill.toLowerCase();
      if (jobText.includes(skillLower) || 
          jobSkills.some(jobSkill => jobSkill.toLowerCase().includes(skillLower))) {
        skillMatches++;
        score += 10;
      }
    });
    
    // Cap skill bonus at 40 points
    score = Math.min(score, 90);
    
    // Experience level match (15 points)
    const userExperience = userProfile.experience_level || 'mid';
    const jobTitle = job.title.toLowerCase();
    
    if (userExperience === 'entry' && (jobTitle.includes('junior') || jobTitle.includes('entry'))) {
      score += 15;
    } else if (userExperience === 'mid' && !jobTitle.includes('senior') && !jobTitle.includes('junior')) {
      score += 15;
    } else if (userExperience === 'senior' && jobTitle.includes('senior')) {
      score += 15;
    } else if (userExperience === 'mid' && jobTitle.includes('junior')) {
      score += 10; // Partial match for overqualified
    }
    
    // Remote work preference (5 points)
    if (userProfile.remote_work_preference && 
        (job.location?.toLowerCase().includes('remote') || 
         job.description?.toLowerCase().includes('remote'))) {
      score += 5;
    }
    
    // Source quality bonus
    if (job.source === 'adzuna') score += 2;
    if (job.source === 'jooble') score += 1;
    
    return Math.min(score, 100);
  }

  // Extract skills from job description
  extractSkillsFromDescription(description) {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
      'TypeScript', 'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'Redis',
      'Kubernetes', 'Git', 'HTML', 'CSS', 'Figma', 'Sketch', 'Adobe XD',
      'Photoshop', 'Illustrator', 'SEO', 'Google Analytics', 'Facebook Ads',
      'Content Marketing', 'Social Media', 'Email Marketing', 'Salesforce',
      'HubSpot', 'Tableau', 'Power BI', 'Excel', 'R', 'TensorFlow', 'PyTorch'
    ];
    
    const foundSkills = [];
    const descLower = description.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return foundSkills.slice(0, 5); // Return max 5 skills
  }

  // Format salary range
  formatSalary(min, max) {
    if (!min && !max) return 'Salary not specified';
    if (min && max) {
      return `$${Math.round(min/1000)}k - $${Math.round(max/1000)}k`;
    }
    if (min) return `$${Math.round(min/1000)}k+`;
    if (max) return `Up to $${Math.round(max/1000)}k`;
    return 'Salary not specified';
  }

  // Format date
  formatDate(dateString) {
    if (!dateString) return 'Recently posted';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 14) return '1 week ago';
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently posted';
    }
  }

  // Deduplicate jobs by title and company
  deduplicateJobs(jobs) {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}_${job.company.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Cache management
  async getCachedJobs(searchParams) {
    try {
      const cacheKey = this.generateCacheKey(searchParams);
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < API_CONFIG.CACHE.DURATION) {
          return data;
        }
        // Remove expired cache
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${cacheKey}`);
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  async setCachedJobs(searchParams, jobs) {
    try {
      const cacheKey = this.generateCacheKey(searchParams);
      const cacheData = {
        data: jobs,
        timestamp: Date.now()
      };
      
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${cacheKey}`, 
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  generateCacheKey(searchParams) {
    return `${searchParams.keywords}_${searchParams.location}_${searchParams.experience}`;
  }

  // Rate limiting
  async checkRateLimit(apiName) {
    try {
      const today = new Date().toDateString();
      const key = `${RATE_LIMIT_PREFIX}${apiName}_${today}`;
      const count = await AsyncStorage.getItem(key);
      const currentCount = count ? parseInt(count) : 0;
      
      const limits = {
        adzuna: API_CONFIG.RATE_LIMITS.ADZUNA_DAILY,
        jooble: API_CONFIG.RATE_LIMITS.JOOBLE_DAILY,
        careerjet: API_CONFIG.RATE_LIMITS.CAREERJET_DAILY
      };
      
      return currentCount < limits[apiName];
    } catch {
      return true; // Allow if can't check
    }
  }

  async updateRateLimit(apiName) {
    try {
      const today = new Date().toDateString();
      const key = `${RATE_LIMIT_PREFIX}${apiName}_${today}`;
      const count = await AsyncStorage.getItem(key);
      const currentCount = count ? parseInt(count) : 0;
      
      await AsyncStorage.setItem(key, (currentCount + 1).toString());
    } catch (error) {
      console.warn('Rate limit update error:', error);
    }
  }

  // Fallback to static data (from existing opportunities.js)
  getFallbackJobs(userProfile) {
    try {
      // Use the global function if available
      if (typeof window !== 'undefined' && window.generatePersonalizedOpportunities) {
        return window.generatePersonalizedOpportunities(userProfile).jobs || [];
      }
      
      // Fallback to basic static jobs if function not available
      return this.getBasicFallbackJobs(userProfile);
    } catch (error) {
      console.warn('Error getting fallback jobs:', error);
      return this.getBasicFallbackJobs(userProfile);
    }
  }

  // Basic fallback jobs when main fallback fails
  getBasicFallbackJobs(userProfile) {
    const interests = userProfile?.career_interests || ['Software Development'];
    const experience = userProfile?.experience_level || 'mid';
    
    return [
      {
        id: 'fallback_1',
        title: `${experience === 'entry' ? 'Junior' : experience === 'senior' ? 'Senior' : ''} Software Engineer`,
        company: 'Tech Company',
        location: 'Remote',
        salary: experience === 'entry' ? '$70k - $90k' : experience === 'senior' ? '$120k - $160k' : '$90k - $120k',
        type: 'Full-time',
        description: 'Join our team to build amazing software products.',
        apply_url: 'https://careers.google.com/',
        posted: '2 days ago',
        skills: ['JavaScript', 'React', 'Node.js'],
        source: 'fallback',
        logo: 'T',
        match: 85
      },
      {
        id: 'fallback_2',
        title: 'Product Manager',
        company: 'Innovation Corp',
        location: 'San Francisco, CA',
        salary: '$100k - $140k',
        type: 'Full-time',
        description: 'Lead product development and strategy.',
        apply_url: 'https://jobs.apple.com/',
        posted: '1 week ago',
        skills: ['Product Strategy', 'Analytics', 'Leadership'],
        source: 'fallback',
        logo: 'I',
        match: 80
      }
    ];
  }

  // Clear cache (for debugging/maintenance)
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('Cache cleared');
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
}

// Export singleton instance
export const realJobService = new RealJobService();
export default realJobService; 