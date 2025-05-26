import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Chip, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import realJobService from '../services/realJobService';
import { API_CONFIG, DEMO_MODE } from '../config/apiKeys';
import { theme } from '../utils/theme';

export default function JobAPIDebugPanel({ userProfile, onClose }) {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [rateLimits, setRateLimits] = useState({});

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      // Get rate limit info
      const today = new Date().toDateString();
      const adzunaCount = await AsyncStorage.getItem(`rate_limit_adzuna_${today}`) || '0';
      const joobleCount = await AsyncStorage.getItem(`rate_limit_jooble_${today}`) || '0';
      const careerjetCount = await AsyncStorage.getItem(`rate_limit_careerjet_${today}`) || '0';

      setRateLimits({
        adzuna: { used: parseInt(adzunaCount), limit: API_CONFIG.RATE_LIMITS.ADZUNA_DAILY },
        jooble: { used: parseInt(joobleCount), limit: API_CONFIG.RATE_LIMITS.JOOBLE_DAILY },
        careerjet: { used: parseInt(careerjetCount), limit: API_CONFIG.RATE_LIMITS.CAREERJET_DAILY }
      });

      // Get cache info
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('job_cache_'));
      
      setDebugInfo({
        demoMode: DEMO_MODE.ENABLED,
        cacheEntries: cacheKeys.length,
        apiKeysConfigured: {
          adzuna: API_CONFIG.ADZUNA.APP_ID !== 'your_adzuna_app_id',
          jooble: API_CONFIG.JOOBLE.API_KEY !== 'your_jooble_api_key',
          careerjet: API_CONFIG.CAREERJET.AFFILIATE_ID !== 'your_careerjet_affiliate_id'
        }
      });
    } catch (error) {
      console.error('Error loading debug info:', error);
    }
  };

  const testAPI = async (apiName) => {
    setLoading(true);
    try {
      console.log(`🧪 Testing ${apiName} API...`);
      const testProfile = {
        career_interests: ['Software Development'],
        skills: ['JavaScript', 'React'],
        location: 'San Francisco',
        experience_level: 'mid'
      };
      
      const jobs = await realJobService.fetchRealJobs(testProfile);
      console.log(`✅ Test successful: ${jobs.length} jobs found`);
      alert(`${apiName} Test Successful!\nFound ${jobs.length} jobs`);
    } catch (error) {
      console.error(`❌ ${apiName} test failed:`, error);
      alert(`${apiName} Test Failed:\n${error.message}`);
    } finally {
      setLoading(false);
      loadDebugInfo(); // Refresh info
    }
  };

  const clearCache = async () => {
    try {
      await realJobService.clearCache();
      alert('Cache cleared successfully!');
      loadDebugInfo();
    } catch (error) {
      alert('Error clearing cache: ' + error.message);
    }
  };

  const getRateLimitColor = (used, limit) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return '#f44336'; // Red
    if (percentage >= 70) return '#ff9800'; // Orange
    return '#4caf50'; // Green
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Job API Debug Panel</Title>
          
          {/* Configuration Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuration Status</Text>
            <View style={styles.chipContainer}>
              <Chip 
                icon={debugInfo.demoMode ? 'alert' : 'check'} 
                style={[styles.statusChip, { 
                  backgroundColor: debugInfo.demoMode ? '#ff9800' : '#4caf50' 
                }]}
                textStyle={styles.statusChipText}
              >
                {debugInfo.demoMode ? 'Demo Mode' : 'Live APIs'}
              </Chip>
            </View>
            
            <Text style={styles.label}>API Keys Configured:</Text>
            <View style={styles.chipContainer}>
              {Object.entries(debugInfo.apiKeysConfigured || {}).map(([api, configured]) => (
                <Chip 
                  key={api}
                  icon={configured ? 'check' : 'close'}
                  style={[styles.apiChip, { 
                    backgroundColor: configured ? '#4caf50' : '#f44336' 
                  }]}
                  textStyle={styles.apiChipText}
                >
                  {api.toUpperCase()}
                </Chip>
              ))}
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Rate Limits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate Limits (Today)</Text>
            {Object.entries(rateLimits).map(([api, info]) => (
              <View key={api} style={styles.rateLimitRow}>
                <Text style={styles.apiName}>{api.toUpperCase()}</Text>
                <View style={styles.rateLimitBar}>
                  <View 
                    style={[
                      styles.rateLimitFill, 
                      { 
                        width: `${(info.used / info.limit) * 100}%`,
                        backgroundColor: getRateLimitColor(info.used, info.limit)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.rateLimitText}>
                  {info.used}/{info.limit}
                </Text>
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />

          {/* Cache Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cache Status</Text>
            <Text style={styles.infoText}>
              Cached Searches: {debugInfo.cacheEntries || 0}
            </Text>
            <Text style={styles.infoText}>
              Cache Duration: 1 hour
            </Text>
          </View>

          <Divider style={styles.divider} />

          {/* Test Buttons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>API Testing</Text>
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={() => testAPI('All APIs')}
                loading={loading}
                disabled={loading}
                style={styles.testButton}
              >
                Test All APIs
              </Button>
              <Button 
                mode="outlined" 
                onPress={clearCache}
                style={styles.testButton}
              >
                Clear Cache
              </Button>
            </View>
          </View>

          {/* User Profile Info */}
          {userProfile && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current User Profile</Text>
                <Text style={styles.infoText}>
                  Interests: {userProfile.career_interests?.join(', ') || 'None'}
                </Text>
                <Text style={styles.infoText}>
                  Skills: {userProfile.skills?.join(', ') || 'None'}
                </Text>
                <Text style={styles.infoText}>
                  Experience: {userProfile.experience_level || 'Not set'}
                </Text>
                <Text style={styles.infoText}>
                  Location: {userProfile.location || 'Not set'}
                </Text>
                <Text style={styles.infoText}>
                  Remote: {userProfile.remote_work_preference ? 'Yes' : 'No'}
                </Text>
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button mode="text" onPress={onClose}>
              Close
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  statusChip: {
    height: 32,
  },
  statusChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  apiChip: {
    height: 28,
  },
  apiChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  rateLimitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  apiName: {
    width: 80,
    fontSize: 12,
    fontWeight: 'bold',
  },
  rateLimitBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  rateLimitFill: {
    height: '100%',
    borderRadius: 4,
  },
  rateLimitText: {
    fontSize: 12,
    width: 50,
    textAlign: 'right',
  },
  infoText: {
    fontSize: 14,
    marginVertical: 2,
    color: theme.colors.onSurface,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  testButton: {
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
});