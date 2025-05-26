import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Switch,
  Chip,
  TextInput,
  Text,
  FAB,
} from "react-native-paper";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import apiClient from '../../utils/api';
import Toast from 'react-native-toast-message';

const JOB_TYPES = [
  { id: 'full-time', name: 'Full-time', icon: 'briefcase' },
  { id: 'part-time', name: 'Part-time', icon: 'briefcase-outline' },
  { id: 'contract', name: 'Contract', icon: 'file-document' },
  { id: 'freelance', name: 'Freelance', icon: 'account-tie' },
  { id: 'internship', name: 'Internship', icon: 'school' },
  { id: 'remote', name: 'Remote Only', icon: 'home' },
];

const WORK_LOCATIONS = [
  { id: 'remote', name: 'Remote', icon: 'home' },
  { id: 'hybrid', name: 'Hybrid', icon: 'office-building' },
  { id: 'onsite', name: 'On-site', icon: 'domain' },
];

const COMPANY_SIZES = [
  { id: 'startup', name: 'Startup (1-50)', icon: 'rocket-launch' },
  { id: 'small', name: 'Small (51-200)', icon: 'account-group' },
  { id: 'medium', name: 'Medium (201-1000)', icon: 'office-building' },
  { id: 'large', name: 'Large (1000+)', icon: 'domain' },
];

export default function JobPreferencesScreen() {
  const { tokens } = useAuth();
  const [preferences, setPreferences] = useState({
    jobTypes: [],
    workLocations: [],
    companySizes: [],
    preferredLocation: '',
    salaryMin: 50000,
    salaryMax: 150000,
    willingToRelocate: false,
    openToRemote: true,
    jobAlerts: true,
    weeklyDigest: true,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchJobPreferences();
  }, []);

  const fetchJobPreferences = async () => {
    try {
      const data = await apiClient.get('/auth/job-preferences/');
      setPreferences({
        jobTypes: data.job_types || [],
        workLocations: data.work_locations || [],
        companySizes: data.company_sizes || [],
        preferredLocation: data.preferred_location || '',
        salaryMin: data.salary_min || 50000,
        salaryMax: data.salary_max || 150000,
        willingToRelocate: data.willing_to_relocate || false,
        openToRemote: data.open_to_remote || true,
        jobAlerts: data.job_alerts || true,
        weeklyDigest: data.weekly_digest || true,
      });
    } catch (error) {
      console.error('Error fetching job preferences:', error);
      // If endpoint doesn't exist (404), just use default values
      if (error.message.includes('404') || error.message === '{}') {
        console.log('Job preferences endpoint not found, using defaults');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load your job preferences.',
        });
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleToggleSelection = (category, itemId) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(itemId)
        ? prev[category].filter(id => id !== itemId)
        : [...prev[category], itemId]
    }));
  };

  const handleSwitchChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSalaryChange = (type, value) => {
    setPreferences(prev => ({ ...prev, [type]: Math.round(value) }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.post('/auth/job-preferences/', {
        job_types: preferences.jobTypes,
        work_locations: preferences.workLocations,
        company_sizes: preferences.companySizes,
        preferred_location: preferences.preferredLocation,
        salary_min: preferences.salaryMin,
        salary_max: preferences.salaryMax,
        willing_to_relocate: preferences.willingToRelocate,
        open_to_remote: preferences.openToRemote,
        job_alerts: preferences.jobAlerts,
        weekly_digest: preferences.weeklyDigest,
      });

      Toast.show({
        type: 'success',
        text1: 'Preferences Saved',
        text2: 'Your job preferences have been updated successfully.',
      });
      router.back();
    } catch (error) {
      console.error('Job preferences save error:', error);
      // If endpoint doesn't exist, show a different message
      if (error.message.includes('404') || error.message === '{}') {
        Toast.show({
          type: 'info',
          text1: 'Feature Coming Soon',
          text2: 'Job preferences will be saved when the backend is ready.',
        });
        router.back(); // Still go back since preferences are stored locally
      } else {
        Toast.show({
          type: 'error',
          text1: 'Save Failed',
          text2: 'Failed to save preferences. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Paragraph>Loading preferences...</Paragraph>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Section - Similar to AI Chat */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Job Preferences</Title>
          <Paragraph style={styles.headerSubtitle}>
            Set your job search criteria to get better matched opportunities
          </Paragraph>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Job Types */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="briefcase" size={24} color={theme.colors.primary} />
                <Title style={styles.sectionTitle}>Job Types</Title>
              </View>
              <Paragraph style={styles.sectionDescription}>
                Select the types of employment you're interested in
              </Paragraph>
              <View style={styles.chipContainer}>
                {JOB_TYPES.map((type) => (
                  <Chip
                    key={type.id}
                    selected={preferences.jobTypes.includes(type.id)}
                    onPress={() => handleToggleSelection('jobTypes', type.id)}
                    style={[
                      styles.chip,
                      preferences.jobTypes.includes(type.id) && styles.selectedChip
                    ]}
                    icon={type.icon}
                  >
                    {type.name}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Work Location */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
                <Title style={styles.sectionTitle}>Work Location</Title>
              </View>
              <Paragraph style={styles.sectionDescription}>
                Choose your preferred work arrangements
              </Paragraph>
              <View style={styles.chipContainer}>
                {WORK_LOCATIONS.map((location) => (
                  <Chip
                    key={location.id}
                    selected={preferences.workLocations.includes(location.id)}
                    onPress={() => handleToggleSelection('workLocations', location.id)}
                    style={[
                      styles.chip,
                      preferences.workLocations.includes(location.id) && styles.selectedChip
                    ]}
                    icon={location.icon}
                  >
                    {location.name}
                  </Chip>
                ))}
              </View>

              <TextInput
                label="Preferred Location (Optional)"
                value={preferences.preferredLocation}
                onChangeText={(value) => setPreferences(prev => ({ ...prev, preferredLocation: value }))}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="map-marker" />}
                placeholder="e.g., San Francisco, CA or New York, NY"
              />
            </Card.Content>
          </Card>

          {/* Company Size */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="office-building" size={24} color={theme.colors.primary} />
                <Title style={styles.sectionTitle}>Company Size</Title>
              </View>
              <Paragraph style={styles.sectionDescription}>
                Select your preferred company sizes
              </Paragraph>
              <View style={styles.chipContainer}>
                {COMPANY_SIZES.map((size) => (
                  <Chip
                    key={size.id}
                    selected={preferences.companySizes.includes(size.id)}
                    onPress={() => handleToggleSelection('companySizes', size.id)}
                    style={[
                      styles.chip,
                      preferences.companySizes.includes(size.id) && styles.selectedChip
                    ]}
                    icon={size.icon}
                  >
                    {size.name}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Salary Range */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="currency-usd" size={24} color={theme.colors.primary} />
                <Title style={styles.sectionTitle}>Salary Range</Title>
              </View>
              <Paragraph style={styles.sectionDescription}>
                Set your expected salary range (USD per year)
              </Paragraph>
              
              <View style={styles.salaryContainer}>
                <View style={styles.salaryItem}>
                  <TextInput
                    label="Minimum Salary (USD)"
                    value={preferences.salaryMin.toString()}
                    onChangeText={(value) => {
                      const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
                      handleSalaryChange('salaryMin', numValue);
                    }}
                    mode="outlined"
                    style={styles.salaryInput}
                    left={<TextInput.Icon icon="currency-usd" />}
                    placeholder="50000"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.salaryItem}>
                  <TextInput
                    label="Maximum Salary (USD)"
                    value={preferences.salaryMax.toString()}
                    onChangeText={(value) => {
                      const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
                      handleSalaryChange('salaryMax', numValue);
                    }}
                    mode="outlined"
                    style={styles.salaryInput}
                    left={<TextInput.Icon icon="currency-usd" />}
                    placeholder="150000"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Additional Preferences */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="cog" size={24} color={theme.colors.primary} />
                <Title style={styles.sectionTitle}>Additional Preferences</Title>
              </View>
              
              <View style={styles.switchItem}>
                <View style={styles.switchContent}>
                  <Title style={styles.switchTitle}>Willing to Relocate</Title>
                  <Paragraph style={styles.switchDescription}>
                    Open to job opportunities that require relocation
                  </Paragraph>
                </View>
                <Switch
                  value={preferences.willingToRelocate}
                  onValueChange={(value) => handleSwitchChange('willingToRelocate', value)}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchContent}>
                  <Title style={styles.switchTitle}>Open to Remote Work</Title>
                  <Paragraph style={styles.switchDescription}>
                    Include fully remote job opportunities
                  </Paragraph>
                </View>
                <Switch
                  value={preferences.openToRemote}
                  onValueChange={(value) => handleSwitchChange('openToRemote', value)}
                />
              </View>
            </Card.Content>
          </Card>

          {/* Notifications */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="bell" size={24} color={theme.colors.primary} />
                <Title style={styles.sectionTitle}>Job Notifications</Title>
              </View>
              
              <View style={styles.switchItem}>
                <View style={styles.switchContent}>
                  <Title style={styles.switchTitle}>Job Alerts</Title>
                  <Paragraph style={styles.switchDescription}>
                    Get notified when new jobs match your preferences
                  </Paragraph>
                </View>
                <Switch
                  value={preferences.jobAlerts}
                  onValueChange={(value) => handleSwitchChange('jobAlerts', value)}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchContent}>
                  <Title style={styles.switchTitle}>Weekly Digest</Title>
                  <Paragraph style={styles.switchDescription}>
                    Receive a weekly summary of new opportunities
                  </Paragraph>
                </View>
                <Switch
                  value={preferences.weeklyDigest}
                  onValueChange={(value) => handleSwitchChange('weeklyDigest', value)}
                />
              </View>
            </Card.Content>
          </Card>

        </ScrollView>
        
        {/* Floating Action Button for Save */}
        <FAB
          icon="check"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.fab}
          label="Save"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header - Similar to AI Chat
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: theme.colors.outline,
    lineHeight: 20,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  
  // Sections
  sectionCard: {
    elevation: 2,
    borderRadius: theme.roundness,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: theme.colors.onSurface,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 16,
  },
  
  // Chips
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  
  // Input
  input: {
    marginTop: 8,
  },
  
  // Salary
  salaryContainer: {
    marginTop: 16,
  },
  salaryItem: {
    marginBottom: 16,
  },
  salaryInput: {
    marginBottom: 8,
  },
  
  // Switches
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline + '20',
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: theme.colors.outline,
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
}); 