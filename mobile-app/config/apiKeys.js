// API Configuration
// Replace these with your actual API credentials
export const API_CONFIG = {
  // Adzuna API (Register at: https://developer.adzuna.com/)
  ADZUNA: {
    APP_ID: 'your_adzuna_app_id', // Replace with your Adzuna App ID
    APP_KEY: 'your_adzuna_app_key', // Replace with your Adzuna App Key
    BASE_URL: 'https://api.adzuna.com/v1/api/jobs',
    COUNTRY: 'us', // Change to your target country
  },
  
  // Jooble API (Register at: https://jooble.org/api/about)
  JOOBLE: {
    API_KEY: 'your_jooble_api_key', // Replace with your Jooble API Key
    BASE_URL: 'https://jooble.org/api',
  },
  
  // CareerJet API (Register at: https://www.careerjet.com/partners/api/)
  CAREERJET: {
    AFFILIATE_ID: 'your_careerjet_affiliate_id', // Replace with your CareerJet Affiliate ID
    BASE_URL: 'https://public-api.careerjet.com/search',
  },
  
  // Rate limiting configuration
  RATE_LIMITS: {
    ADZUNA_DAILY: 33, // 1000 requests/month = ~33/day
    JOOBLE_DAILY: 500,
    CAREERJET_DAILY: 1000,
  },
  
  // Cache configuration
  CACHE: {
    DURATION: 60 * 60 * 1000, // 1 hour in milliseconds
    MAX_ENTRIES: 100,
  }
};

// Demo mode configuration (uses static data when API keys are not configured)
export const DEMO_MODE = {
  ENABLED: API_CONFIG.ADZUNA.APP_ID === 'your_adzuna_app_id',
  MESSAGE: 'Using demo data. Configure API keys in config/apiKeys.js for real job listings.'
}; 