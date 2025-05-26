// Job Service for integrating with various job board APIs
// This service provides a unified interface for fetching job listings

const JOB_APIS = {
  ADZUNA: {
    name: 'Adzuna',
    baseUrl: 'https://api.adzuna.com/v1/api/jobs',
    requiresAuth: true,
    countries: ['us', 'gb', 'ca', 'au', 'de', 'fr'],
    rateLimit: 1000, // requests per month for free tier
  },
  JOOBLE: {
    name: 'Jooble',
    baseUrl: 'https://jooble.org/api',
    requiresAuth: true,
    countries: ['us', 'gb', 'ca', 'au'],
    rateLimit: 500, // requests per day for free tier
  },
  CAREERJET: {
    name: 'CareerJet',
    baseUrl: 'https://public-api.careerjet.com/search',
    requiresAuth: false,
    countries: ['us', 'gb', 'ca', 'au'],
    rateLimit: 1000, // requests per day
  }
};

class JobService {
  constructor() {
    // Configure your API credentials here
    this.credentials = {
      adzuna: {
        app_id: process.env.ADZUNA_APP_ID || 'your_adzuna_app_id',
        app_key: process.env.ADZUNA_APP_KEY || 'your_adzuna_app_key',
      },
      jooble: {
        api_key: process.env.JOOBLE_API_KEY || 'your_jooble_api_key',
      }
    };
    
    this.defaultCountry = 'us';
    this.defaultResultsPerPage = 20;
  }

  /**
   * Fetch jobs from Adzuna API
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} Array of job listings
   */
  async fetchFromAdzuna(params = {}) {
    const {
      keywords = 'software developer',
      location = '',
      country = this.defaultCountry,
      page = 1,
      resultsPerPage = this.defaultResultsPerPage,
      salaryMin = null,
      salaryMax = null,
      contractType = null, // 'permanent', 'contract', 'part_time'
      sortBy = 'relevance' // 'relevance', 'date', 'salary'
    } = params;

    try {
      const baseUrl = `${JOB_APIS.ADZUNA.baseUrl}/${country}/search/${page}`;
      const queryParams = new URLSearchParams({
        app_id: this.credentials.adzuna.app_id,
        app_key: this.credentials.adzuna.app_key,
        results_per_page: resultsPerPage,
        what: keywords,
        sort_by: sortBy,
      });

      if (location) queryParams.append('where', location);
      if (salaryMin) queryParams.append('salary_min', salaryMin);
      if (salaryMax) queryParams.append('salary_max', salaryMax);
      if (contractType) queryParams.append('contract_type', contractType);

      const response = await fetch(`${baseUrl}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Adzuna API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformAdzunaResponse(data);
    } catch (error) {
      console.error('Error fetching from Adzuna:', error);
      throw error;
    }
  }

  /**
   * Fetch jobs from Jooble API
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} Array of job listings
   */
  async fetchFromJooble(params = {}) {
    const {
      keywords = 'software developer',
      location = '',
      page = 1,
      resultsPerPage = this.defaultResultsPerPage,
    } = params;

    try {
      const response = await fetch(`${JOB_APIS.JOOBLE.baseUrl}/${this.credentials.jooble.api_key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords,
          location,
          radius: 25,
          page: page - 1, // Jooble uses 0-based pagination
          count: resultsPerPage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Jooble API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformJoobleResponse(data);
    } catch (error) {
      console.error('Error fetching from Jooble:', error);
      throw error;
    }
  }

  /**
   * Fetch jobs from CareerJet API
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} Array of job listings
   */
  async fetchFromCareerJet(params = {}) {
    const {
      keywords = 'software developer',
      location = '',
      country = this.defaultCountry,
      page = 1,
      resultsPerPage = this.defaultResultsPerPage,
    } = params;

    try {
      const queryParams = new URLSearchParams({
        keywords,
        location,
        affid: 'your_affiliate_id', // Register for affiliate ID
        user_ip: '127.0.0.1', // Required parameter
        user_agent: 'CareerForge/1.0',
        locale_code: country === 'us' ? 'en_US' : 'en_GB',
        pagesize: resultsPerPage,
        page: page - 1, // CareerJet uses 0-based pagination
      });

      const response = await fetch(`${JOB_APIS.CAREERJET.baseUrl}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`CareerJet API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformCareerJetResponse(data);
    } catch (error) {
      console.error('Error fetching from CareerJet:', error);
      throw error;
    }
  }

  /**
   * Aggregate jobs from multiple sources
   * @param {Object} params - Search parameters
   * @param {Array} sources - Array of API sources to use
   * @returns {Promise<Array>} Combined array of job listings
   */
  async fetchJobsFromMultipleSources(params = {}, sources = ['adzuna']) {
    const jobPromises = [];
    const results = [];

    for (const source of sources) {
      try {
        switch (source.toLowerCase()) {
          case 'adzuna':
            jobPromises.push(this.fetchFromAdzuna(params));
            break;
          case 'jooble':
            jobPromises.push(this.fetchFromJooble(params));
            break;
          case 'careerjet':
            jobPromises.push(this.fetchFromCareerJet(params));
            break;
          default:
            console.warn(`Unknown job source: ${source}`);
        }
      } catch (error) {
        console.error(`Error with ${source}:`, error);
      }
    }

    try {
      const responses = await Promise.allSettled(jobPromises);
      
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          results.push(...response.value);
        } else {
          console.error(`Failed to fetch from ${sources[index]}:`, response.reason);
        }
      });

      // Remove duplicates based on title and company
      return this.removeDuplicateJobs(results);
    } catch (error) {
      console.error('Error aggregating jobs:', error);
      return [];
    }
  }

  /**
   * Transform Adzuna API response to standard format
   */
  transformAdzunaResponse(data) {
    if (!data.results) return [];

    return data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || 'Company not specified',
      location: job.location?.display_name || 'Location not specified',
      salary: this.formatSalary(job.salary_min, job.salary_max),
      type: this.formatContractType(job.contract_type),
      description: job.description || '',
      apply_url: job.redirect_url,
      posted: this.formatDate(job.created),
      logo: job.company?.display_name?.charAt(0) || '?',
      source: 'Adzuna',
      skills: this.extractSkillsFromDescription(job.description || ''),
    }));
  }

  /**
   * Transform Jooble API response to standard format
   */
  transformJoobleResponse(data) {
    if (!data.jobs) return [];

    return data.jobs.map(job => ({
      id: job.id || Math.random().toString(36).substr(2, 9),
      title: job.title,
      company: job.company || 'Company not specified',
      location: job.location || 'Location not specified',
      salary: job.salary || 'Salary not specified',
      type: job.type || 'Full-time',
      description: job.snippet || '',
      apply_url: job.link,
      posted: this.formatDate(job.updated),
      logo: job.company?.charAt(0) || '?',
      source: 'Jooble',
      skills: this.extractSkillsFromDescription(job.snippet || ''),
    }));
  }

  /**
   * Transform CareerJet API response to standard format
   */
  transformCareerJetResponse(data) {
    if (!data.jobs) return [];

    return data.jobs.map(job => ({
      id: job.jobid || Math.random().toString(36).substr(2, 9),
      title: job.jobtitle,
      company: job.company || 'Company not specified',
      location: job.locations || 'Location not specified',
      salary: job.salary || 'Salary not specified',
      type: 'Full-time', // CareerJet doesn't provide contract type
      description: job.jobdescription || '',
      apply_url: job.url,
      posted: this.formatDate(job.date),
      logo: job.company?.charAt(0) || '?',
      source: 'CareerJet',
      skills: this.extractSkillsFromDescription(job.jobdescription || ''),
    }));
  }

  /**
   * Extract skills from job description
   */
  extractSkillsFromDescription(description) {
    const commonSkills = [
      'React', 'React Native', 'JavaScript', 'TypeScript', 'Node.js', 'Python',
      'Java', 'Swift', 'Kotlin', 'Flutter', 'AWS', 'Docker', 'Git', 'SQL',
      'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Agile',
      'Scrum', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Express', 'Django',
      'Flask', 'Spring', 'Kubernetes', 'Jenkins', 'CI/CD', 'Linux', 'Azure',
      'GCP', 'Terraform', 'Ansible', 'Microservices', 'Machine Learning',
      'AI', 'Data Science', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch'
    ];

    const foundSkills = [];
    const lowerDescription = description.toLowerCase();

    commonSkills.forEach(skill => {
      if (lowerDescription.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return foundSkills.slice(0, 4); // Limit to 4 skills for display
  }

  /**
   * Format salary range
   */
  formatSalary(min, max) {
    if (!min && !max) return 'Salary not specified';
    if (min && max) {
      return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    }
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return 'Salary not specified';
  }

  /**
   * Format contract type
   */
  formatContractType(type) {
    const typeMap = {
      'permanent': 'Full-time',
      'contract': 'Contract',
      'part_time': 'Part-time',
      'temporary': 'Temporary',
      'internship': 'Internship',
    };
    return typeMap[type] || 'Full-time';
  }

  /**
   * Format date to relative time
   */
  formatDate(dateString) {
    if (!dateString) return 'Recently posted';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  /**
   * Remove duplicate jobs based on title and company
   */
  removeDuplicateJobs(jobs) {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Calculate job match score based on user profile
   */
  calculateJobMatch(job, userProfile) {
    if (!userProfile) return 75; // Default match score

    let score = 50; // Base score

    // Check skills match
    const userSkills = userProfile.skills || [];
    const jobTitle = job.title.toLowerCase();
    const jobDescription = job.description?.toLowerCase() || '';

    userSkills.forEach(skill => {
      if (jobTitle.includes(skill.toLowerCase()) || jobDescription.includes(skill.toLowerCase())) {
        score += 10;
      }
    });

    // Check career interests match
    const careerInterests = userProfile.career_interests || [];
    const careerKeywords = {
      'Software Development': ['software', 'developer', 'programmer', 'engineer'],
      'Data Science': ['data', 'scientist', 'analyst', 'machine learning'],
      'UI/UX Design': ['designer', 'ui', 'ux', 'design'],
      'Digital Marketing': ['marketing', 'digital', 'seo', 'social media'],
      'Product Management': ['product', 'manager', 'owner'],
      'DevOps Engineering': ['devops', 'cloud', 'infrastructure'],
      'Cybersecurity': ['security', 'cybersecurity', 'information security'],
      'Mobile Development': ['mobile', 'ios', 'android', 'app'],
    };

    careerInterests.forEach(interest => {
      const keywords = careerKeywords[interest] || [];
      keywords.forEach(keyword => {
        if (jobTitle.includes(keyword.toLowerCase())) {
          score += 15;
        }
      });
    });

    // Experience level match
    const experienceLevel = userProfile.experience_level || 'entry';
    if (experienceLevel === 'entry' && (jobTitle.includes('junior') || jobTitle.includes('entry'))) {
      score += 10;
    } else if (experienceLevel === 'mid' && (jobTitle.includes('mid') || jobTitle.includes('intermediate'))) {
      score += 10;
    } else if (experienceLevel === 'senior' && jobTitle.includes('senior')) {
      score += 10;
    }

    // Location preference
    if (userProfile.remote_work_preference && job.location?.toLowerCase().includes('remote')) {
      score += 5;
    }

    return Math.min(score, 100); // Cap at 100%
  }

  /**
   * Get personalized job recommendations
   */
  async getPersonalizedJobs(userProfile, options = {}) {
    const {
      sources = ['adzuna'],
      maxResults = 20,
      location = '',
      salaryMin = null,
      salaryMax = null,
    } = options;

    try {
      // Generate search keywords based on user's career interests
      const keywords = this.generateSearchKeywords(userProfile);
      
      const searchParams = {
        keywords: keywords[0], // Use primary keyword
        location,
        resultsPerPage: maxResults,
        salaryMin,
        salaryMax,
      };

      // Fetch jobs from multiple sources
      const jobs = await this.fetchJobsFromMultipleSources(searchParams, sources);

      // Calculate match scores and sort by relevance
      const jobsWithScores = jobs.map(job => ({
        ...job,
        match: this.calculateJobMatch(job, userProfile),
      }));

      // Sort by match score (highest first)
      return jobsWithScores.sort((a, b) => b.match - a.match);
    } catch (error) {
      console.error('Error getting personalized jobs:', error);
      return [];
    }
  }

  /**
   * Generate search keywords based on user profile
   */
  generateSearchKeywords(userProfile) {
    const careerInterests = userProfile?.career_interests || [];
    const skills = userProfile?.skills || [];
    
    const keywordMap = {
      'Software Development': ['software developer', 'programmer', 'software engineer'],
      'Data Science': ['data scientist', 'data analyst', 'machine learning engineer'],
      'UI/UX Design': ['ui designer', 'ux designer', 'product designer'],
      'Digital Marketing': ['digital marketing manager', 'marketing specialist', 'seo specialist'],
      'Product Management': ['product manager', 'product owner', 'business analyst'],
      'DevOps Engineering': ['devops engineer', 'cloud engineer', 'infrastructure engineer'],
      'Cybersecurity': ['cybersecurity analyst', 'security engineer', 'information security'],
      'Mobile Development': ['mobile developer', 'ios developer', 'android developer'],
    };

    const keywords = [];
    
    // Add keywords from career interests
    careerInterests.forEach(interest => {
      const mappedKeywords = keywordMap[interest];
      if (mappedKeywords) {
        keywords.push(...mappedKeywords);
      }
    });

    // Add skills as keywords
    keywords.push(...skills.slice(0, 3)); // Limit to top 3 skills

    return keywords.length > 0 ? keywords : ['software developer'];
  }
}

export default new JobService(); 