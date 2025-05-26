# Job Board API Integration Guide

This guide explains how to integrate real job listings from various job board APIs into the CareerForge AI mobile app.

## 🚀 Quick Start

The opportunities page now supports real-time job listings with the following features:
- **Personalized job matching** based on user profile (skills, career interests, experience level)
- **External application links** that redirect to job posting websites
- **Multiple job board API support** (Adzuna, Jooble, CareerJet)
- **Smart filtering and search** functionality
- **Match scoring algorithm** to rank jobs by relevance

## 📋 Current Implementation

### Mock Data (Default)
Currently, the app uses mock job data that simulates real API responses. This allows you to test the functionality without API keys.

### Real API Integration
To use real job data, follow the setup instructions below.

## 🔧 API Setup Instructions

### 1. Adzuna API (Recommended)
Adzuna provides comprehensive job listings across multiple countries.

**Setup Steps:**
1. Visit [Adzuna Developer Portal](https://developer.adzuna.com/)
2. Create a free account
3. Register your application
4. Get your `app_id` and `app_key`
5. Update the configuration in `services/jobService.js`:

```javascript
this.credentials = {
  adzuna: {
    app_id: 'your_actual_adzuna_app_id',
    app_key: 'your_actual_adzuna_app_key',
  }
};
```

**Free Tier Limits:**
- 1,000 requests per month
- Rate limit: 1 request per second
- Supports: US, UK, Canada, Australia, Germany, France

### 2. Jooble API (Optional)
Jooble aggregates job postings from various sources worldwide.

**Setup Steps:**
1. Visit [Jooble API](https://jooble.org/api/about)
2. Request API access
3. Get your API key
4. Update the configuration:

```javascript
this.credentials = {
  jooble: {
    api_key: 'your_jooble_api_key',
  }
};
```

**Free Tier Limits:**
- 500 requests per day
- Supports: US, UK, Canada, Australia

### 3. CareerJet API (Optional)
CareerJet provides job listings from numerous websites globally.

**Setup Steps:**
1. Visit [CareerJet API](https://www.careerjet.com/partners/api/)
2. Register for an affiliate ID
3. Update the configuration:

```javascript
// In fetchFromCareerJet method
affid: 'your_careerjet_affiliate_id',
```

**Free Tier Limits:**
- 1,000 requests per day
- No authentication required for basic usage

## 🔄 Switching to Real APIs

### Option 1: Update the fetchRealJobs function
Replace the mock data in `mobile-app/app/(main)/opportunities.js`:

```javascript
const fetchRealJobs = async () => {
  try {
    // Import the job service
    const jobService = require('../../services/jobService').default;
    
    // Get personalized jobs based on user profile
    const realJobs = await jobService.getPersonalizedJobs(userProfile, {
      sources: ['adzuna'], // Add more sources: ['adzuna', 'jooble', 'careerjet']
      maxResults: 20,
      location: userProfile?.location || '',
    });
    
    return realJobs;
  } catch (error) {
    console.error('Error fetching real jobs:', error);
    // Fallback to mock data
    return getMockJobs();
  }
};
```

### Option 2: Environment Variables (Recommended)
Create a `.env` file in the mobile-app directory:

```env
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
JOOBLE_API_KEY=your_jooble_api_key
```

Then update the job service to use environment variables:

```javascript
this.credentials = {
  adzuna: {
    app_id: process.env.ADZUNA_APP_ID || 'your_adzuna_app_id',
    app_key: process.env.ADZUNA_APP_KEY || 'your_adzuna_app_key',
  },
  jooble: {
    api_key: process.env.JOOBLE_API_KEY || 'your_jooble_api_key',
  }
};
```

## 🎯 Job Matching Algorithm

The app uses an intelligent matching algorithm that considers:

### Scoring Factors:
- **Skills Match (10 points each)**: User skills found in job title/description
- **Career Interest Match (15 points each)**: Career interests aligned with job keywords
- **Experience Level Match (10 points)**: Job level matches user experience
- **Location Preference (5 points)**: Remote work preference alignment
- **Base Score (50 points)**: Starting score for all jobs

### Match Score Ranges:
- **90-100%**: Excellent match (green)
- **80-89%**: Good match (blue)
- **70-79%**: Fair match (orange)
- **Below 70%**: Poor match (gray)

## 📱 User Experience Features

### Personalized Job Recommendations
- Jobs are filtered based on user's career interests from onboarding
- Skills from user profile are used for keyword matching
- Experience level affects job ranking
- Remote work preference influences scoring

### External Application Links
- "Apply Now" button opens job posting in external browser
- Supports major job sites: Indeed, LinkedIn, Glassdoor, Monster, etc.
- Error handling for invalid or broken links
- Fallback messages for jobs without application links

### Smart Search and Filtering
- Search by job title, company name, or skills
- Category filtering (All, Jobs, Courses, Events, Mentorship)
- Real-time search results
- Skill-based job recommendations

## 🔍 Testing the Integration

### 1. Test with Mock Data
The current implementation uses realistic mock data that simulates API responses.

### 2. Test API Connectivity
```javascript
// Test Adzuna API connection
const jobService = require('./services/jobService').default;

jobService.fetchFromAdzuna({
  keywords: 'software developer',
  location: 'San Francisco',
  resultsPerPage: 5
}).then(jobs => {
  console.log('API Test Success:', jobs.length, 'jobs found');
}).catch(error => {
  console.error('API Test Failed:', error);
});
```

### 3. Test Job Matching
```javascript
const userProfile = {
  skills: ['JavaScript', 'React', 'Node.js'],
  career_interests: ['Software Development'],
  experience_level: 'mid',
  remote_work_preference: true
};

const matchScore = jobService.calculateJobMatch(job, userProfile);
console.log('Match Score:', matchScore);
```

## 🚨 Error Handling

The app includes comprehensive error handling:

### API Failures
- Graceful fallback to mock data
- User-friendly error messages
- Retry mechanisms for temporary failures
- Rate limit handling

### Network Issues
- Offline detection
- Cached job listings
- Progressive loading
- Refresh functionality

### Invalid Links
- Link validation before opening
- Error alerts for broken URLs
- Fallback to job search on company website

## 📊 Performance Optimization

### Caching Strategy
- Cache job listings for 30 minutes
- Store user preferences locally
- Implement pagination for large result sets
- Lazy loading for job details

### API Rate Limiting
- Respect API rate limits
- Implement request queuing
- Use multiple API sources for redundancy
- Monitor usage quotas

## 🔐 Security Considerations

### API Key Protection
- Store API keys securely
- Use environment variables
- Implement key rotation
- Monitor API usage

### User Data Privacy
- Don't send sensitive user data to job APIs
- Anonymize search queries
- Respect user privacy preferences
- Comply with data protection regulations

## 🛠️ Troubleshooting

### Common Issues

**1. No jobs loading**
- Check API credentials
- Verify network connectivity
- Check API rate limits
- Review console logs for errors

**2. Poor job matches**
- Update user profile with more skills
- Add career interests in onboarding
- Check keyword mapping in job service
- Verify matching algorithm parameters

**3. Application links not working**
- Check URL format in API response
- Verify Linking permissions
- Test with different job sources
- Check for URL encoding issues

### Debug Mode
Enable debug logging in the job service:

```javascript
// Add to jobService.js
const DEBUG = true;

if (DEBUG) {
  console.log('Job search params:', searchParams);
  console.log('API response:', data);
  console.log('Transformed jobs:', transformedJobs);
}
```

## 📈 Future Enhancements

### Planned Features
- **Job alerts**: Push notifications for new matching jobs
- **Application tracking**: Track applied jobs and responses
- **Salary insights**: Salary range analysis and trends
- **Company reviews**: Integration with Glassdoor reviews
- **Interview preparation**: AI-powered interview tips for specific jobs

### Additional APIs
- **LinkedIn Jobs API**: Premium job listings
- **Indeed API**: Direct integration with Indeed
- **AngelList API**: Startup job opportunities
- **GitHub Jobs**: Developer-focused positions

## 📞 Support

For issues with job API integration:

1. Check the troubleshooting section above
2. Review API documentation for your chosen provider
3. Test with mock data first
4. Check network connectivity and API keys
5. Review console logs for detailed error messages

## 📄 API Documentation Links

- [Adzuna API Docs](https://developer.adzuna.com/docs/search)
- [Jooble API Docs](https://jooble.org/api/about)
- [CareerJet API Docs](https://www.careerjet.com/partners/api/)

---

**Note**: The current implementation uses mock data by default. Follow the setup instructions above to integrate with real job APIs. Always test thoroughly before deploying to production. 