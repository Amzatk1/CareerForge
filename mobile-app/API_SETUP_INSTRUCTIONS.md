# 🚀 Real Job API Setup Instructions

## 📋 Overview

CareerForge now supports real-time job listings from major job websites! Follow these steps to configure API access and get live job data.

## 🔧 Quick Setup (5 minutes)

### Step 1: Configure API Keys

1. **Open the configuration file:**
   ```
   mobile-app/config/apiKeys.js
   ```

2. **Replace the placeholder values with your actual API credentials:**
   ```javascript
   export const API_CONFIG = {
     ADZUNA: {
       APP_ID: 'your_actual_adzuna_app_id',     // ← Replace this
       APP_KEY: 'your_actual_adzuna_app_key',   // ← Replace this
       // ... rest stays the same
     },
     // ... other APIs
   };
   ```

### Step 2: Get API Credentials (Choose one or more)

## 🥇 **Option 1: Adzuna API (Recommended - Easiest)**

**Why Adzuna?**
- ✅ 1000 free requests/month
- ✅ Easy registration
- ✅ Good documentation
- ✅ Global job coverage

**Setup Steps:**

1. **Register:** Go to https://developer.adzuna.com/
2. **Sign up** for a free developer account
3. **Create an app** and get your credentials:
   - App ID (e.g., `12345678`)
   - App Key (e.g., `abcdef1234567890abcdef1234567890`)
4. **Update config:**
   ```javascript
   ADZUNA: {
     APP_ID: '12345678',                           // Your App ID
     APP_KEY: 'abcdef1234567890abcdef1234567890',  // Your App Key
     BASE_URL: 'https://api.adzuna.com/v1/api/jobs',
     COUNTRY: 'us', // or 'uk', 'ca', 'au', etc.
   }
   ```

## 🥈 **Option 2: Jooble API (Good Free Tier)**

**Benefits:**
- ✅ 500 free requests/day
- ✅ Global job aggregator
- ✅ Simple integration

**Setup Steps:**

1. **Register:** Go to https://jooble.org/api/about
2. **Fill out the form** with your app details
3. **Get your API key** (e.g., `abc123def456`)
4. **Update config:**
   ```javascript
   JOOBLE: {
     API_KEY: 'abc123def456',  // Your API Key
     BASE_URL: 'https://jooble.org/api',
   }
   ```

## 🥉 **Option 3: CareerJet API (Generous Free Tier)**

**Benefits:**
- ✅ 1000 free requests/day
- ✅ Global coverage
- ✅ No approval required

**Setup Steps:**

1. **Register:** Go to https://www.careerjet.com/partners/api/
2. **Sign up** and get your affiliate ID
3. **Get your affiliate ID** (e.g., `123456789`)
4. **Update config:**
   ```javascript
   CAREERJET: {
     AFFILIATE_ID: '123456789',  // Your Affiliate ID
     BASE_URL: 'https://public-api.careerjet.com/search',
   }
   ```

## 🚀 **Step 3: Test Your Setup**

1. **Restart your app:**
   ```bash
   cd mobile-app
   npx expo start --clear
   ```

2. **Check the console logs:**
   - Look for: `🔍 Fetching real jobs for profile:`
   - Success: `✅ Fetched real jobs: X`
   - Demo mode: `📝 Demo mode enabled, using static data`

3. **Verify in the app:**
   - Open the Opportunities tab
   - Look for "Real-time opportunities" in the header
   - Jobs should show source badges (Adzuna, Jooble, etc.)

## 📊 **API Usage Monitoring**

### Free Tier Limits
- **Adzuna:** 1000 requests/month (~33/day)
- **Jooble:** 500 requests/day
- **CareerJet:** 1000 requests/day

### Smart Usage Features
- ✅ **Intelligent caching** (1-hour cache)
- ✅ **Rate limiting** (automatic)
- ✅ **Fallback system** (static data if APIs fail)
- ✅ **Multi-API aggregation** (combines results)

## 🔍 **Troubleshooting**

### Issue: Still seeing "Demo Mode"
**Solution:** Check that your API keys are correctly set in `config/apiKeys.js`

### Issue: No job results
**Possible causes:**
1. **Invalid API credentials** - Double-check your keys
2. **Rate limit exceeded** - Wait 24 hours or use multiple APIs
3. **Network issues** - Check internet connection
4. **API service down** - App will fallback to static data

### Issue: API errors in console
**Check:**
1. **API key format** - Ensure no extra spaces or quotes
2. **Account status** - Verify your API account is active
3. **Request limits** - Check if you've exceeded daily limits

## 📈 **Scaling to Production**

### For Higher Volume (1000+ users)

1. **Upgrade API plans:**
   - Adzuna Pro: $50/month (10,000 requests)
   - Consider Indeed Partner Program
   - LinkedIn Jobs API (enterprise)

2. **Implement backend caching:**
   - Cache popular searches
   - Reduce redundant API calls
   - Implement job database

3. **Add more APIs:**
   - Indeed (requires partnership)
   - LinkedIn (premium)
   - Glassdoor (enterprise)

## 🎯 **Expected Results**

### With APIs Configured:
- ✅ Real job listings from major companies
- ✅ Up-to-date salary information
- ✅ Working application links
- ✅ Location-based filtering
- ✅ Skill-based matching

### Demo Mode (No APIs):
- ✅ Curated static job listings
- ✅ Real company career page links
- ✅ All features work normally
- ✅ Perfect for development/testing

## 🔐 **Security Notes**

1. **Never commit API keys** to version control
2. **Use environment variables** in production
3. **Rotate keys regularly**
4. **Monitor usage** for unusual activity

## 📞 **Support**

### API Provider Support:
- **Adzuna:** https://developer.adzuna.com/docs
- **Jooble:** https://jooble.org/api/about
- **CareerJet:** https://www.careerjet.com/partners/api/

### Common Issues:
- **Rate limiting:** Implement delays between requests
- **Data quality:** Use multiple APIs for better coverage
- **Caching:** Reduce API calls with smart caching

---

## 🎉 **You're All Set!**

Your CareerForge app now has access to real-time job listings from major job websites. Users will see fresh, relevant opportunities that match their career interests and skills.

**Next Steps:**
1. Monitor API usage in your dashboards
2. Consider adding more APIs for better coverage
3. Implement analytics to track user engagement
4. Scale up API plans as your user base grows 