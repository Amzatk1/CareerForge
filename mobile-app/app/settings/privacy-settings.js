import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Switch, List, Divider, Text } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import Toast from 'react-native-toast-message';

export default function PrivacySettingsScreen() {
  const { tokens } = useAuth();
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowJobRecommendations: true,
    allowSkillAnalysis: true,
    shareProgressData: false,
    allowMentorshipRequests: true,
    showOnlineStatus: true,
    allowDirectMessages: true,
    dataCollection: true,
    analyticsTracking: false,
    marketingEmails: false,
    thirdPartySharing: false,
    publicProfile: true,
    searchableProfile: true,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      const response = await fetch('http://10.77.108.42:8000/api/auth/privacy-settings/', {
        headers: {
          'Authorization': `Bearer ${tokens?.access}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.77.108.42:8000/api/auth/privacy-settings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Settings Saved',
          text2: 'Your privacy settings have been updated successfully.',
        });
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Save Failed',
          text2: 'Failed to save settings. Please try again.',
        });
      }
    } catch (error) {
      console.error('Privacy settings save error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataDownload = () => {
    Toast.show({
      type: 'info',
      text1: 'Data Export Requested',
      text2: 'We\'ll email you a copy of your data within 24 hours.',
    });
  };

  const handleAccountDeletion = () => {
    Toast.show({
      type: 'info',
      text1: 'Account Deletion',
      text2: 'Please contact support to delete your account.',
    });
  };

  if (initialLoading) {
    return (
          <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Paragraph>Loading settings...</Paragraph>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="shield-account" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Title style={styles.headerTitle}>Privacy Settings</Title>
            <Paragraph style={styles.headerDescription}>
              Control how your information is shared and used
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Profile Visibility */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-eye" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Profile Visibility</Title>
            </View>
            
            <List.Item
              title="Public Profile"
              description="Allow others to find and view your profile"
              left={props => <List.Icon {...props} icon="earth" />}
              right={() => (
                <Switch
                  value={settings.publicProfile}
                  onValueChange={(value) => handleSettingChange('publicProfile', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Searchable Profile"
              description="Include your profile in search results"
              left={props => <List.Icon {...props} icon="magnify" />}
              right={() => (
                <Switch
                  value={settings.searchableProfile}
                  onValueChange={(value) => handleSettingChange('searchableProfile', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Show Email Address"
              description="Display your email on your public profile"
              left={props => <List.Icon {...props} icon="email" />}
              right={() => (
                <Switch
                  value={settings.showEmail}
                  onValueChange={(value) => handleSettingChange('showEmail', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Show Phone Number"
              description="Display your phone number on your profile"
              left={props => <List.Icon {...props} icon="phone" />}
              right={() => (
                <Switch
                  value={settings.showPhone}
                  onValueChange={(value) => handleSettingChange('showPhone', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Show Location"
              description="Display your location on your profile"
              left={props => <List.Icon {...props} icon="map-marker" />}
              right={() => (
                <Switch
                  value={settings.showLocation}
                  onValueChange={(value) => handleSettingChange('showLocation', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Communication Preferences */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="message" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Communication</Title>
            </View>
            
            <List.Item
              title="Allow Direct Messages"
              description="Let other users send you direct messages"
              left={props => <List.Icon {...props} icon="message-text" />}
              right={() => (
                <Switch
                  value={settings.allowDirectMessages}
                  onValueChange={(value) => handleSettingChange('allowDirectMessages', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Allow Mentorship Requests"
              description="Receive requests for mentorship opportunities"
              left={props => <List.Icon {...props} icon="account-tie" />}
              right={() => (
                <Switch
                  value={settings.allowMentorshipRequests}
                  onValueChange={(value) => handleSettingChange('allowMentorshipRequests', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Show Online Status"
              description="Display when you're active on the platform"
              left={props => <List.Icon {...props} icon="circle" />}
              right={() => (
                <Switch
                  value={settings.showOnlineStatus}
                  onValueChange={(value) => handleSettingChange('showOnlineStatus', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* AI and Recommendations */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="robot" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>AI & Recommendations</Title>
            </View>
            
            <List.Item
              title="Job Recommendations"
              description="Allow AI to suggest job opportunities based on your profile"
              left={props => <List.Icon {...props} icon="briefcase-search" />}
              right={() => (
                <Switch
                  value={settings.allowJobRecommendations}
                  onValueChange={(value) => handleSettingChange('allowJobRecommendations', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Skill Analysis"
              description="Enable AI analysis of your skills and career progress"
              left={props => <List.Icon {...props} icon="chart-line" />}
              right={() => (
                <Switch
                  value={settings.allowSkillAnalysis}
                  onValueChange={(value) => handleSettingChange('allowSkillAnalysis', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Share Progress Data"
              description="Use your progress data to improve AI recommendations"
              left={props => <List.Icon {...props} icon="trending-up" />}
              right={() => (
                <Switch
                  value={settings.shareProgressData}
                  onValueChange={(value) => handleSettingChange('shareProgressData', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Data Collection */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="database" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Data Collection</Title>
            </View>
            
            <List.Item
              title="Usage Analytics"
              description="Collect anonymous usage data to improve the app"
              left={props => <List.Icon {...props} icon="chart-box" />}
              right={() => (
                <Switch
                  value={settings.analyticsTracking}
                  onValueChange={(value) => handleSettingChange('analyticsTracking', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Marketing Communications"
              description="Receive promotional emails and updates"
              left={props => <List.Icon {...props} icon="email-newsletter" />}
              right={() => (
                <Switch
                  value={settings.marketingEmails}
                  onValueChange={(value) => handleSettingChange('marketingEmails', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Third-Party Sharing"
              description="Share anonymized data with trusted partners"
              left={props => <List.Icon {...props} icon="share-variant" />}
              right={() => (
                <Switch
                  value={settings.thirdPartySharing}
                  onValueChange={(value) => handleSettingChange('thirdPartySharing', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Data Rights */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="gavel" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Your Data Rights</Title>
            </View>
            <Paragraph style={styles.sectionDescription}>
              You have the right to access, correct, or delete your personal data.
            </Paragraph>
            
            <Button
              mode="outlined"
              onPress={handleDataDownload}
              style={styles.dataButton}
              icon="download"
            >
              Download My Data
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => router.push('/settings/privacy-policy')}
              style={styles.dataButton}
              icon="file-document"
            >
              View Privacy Policy
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleAccountDeletion}
              style={[styles.dataButton, styles.dangerButton]}
              icon="delete"
              textColor={theme.colors.error}
            >
              Request Account Deletion
            </Button>
          </Card.Content>
        </Card>

        {/* Security Notice */}
        <Card style={styles.noticeCard}>
          <Card.Content>
            <View style={styles.noticeHeader}>
              <MaterialCommunityIcons name="information" size={20} color={theme.colors.accent} />
              <Title style={styles.noticeTitle}>Security Notice</Title>
            </View>
            <Paragraph style={styles.noticeText}>
              Your privacy is important to us. We use industry-standard encryption and security measures to protect your data. Changes to these settings take effect immediately.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
          icon="content-save"
        >
          Save Privacy Settings
        </Button>
      </ScrollView>
    </View>
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
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  headerCard: {
    elevation: 4,
    borderRadius: theme.roundness,
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDescription: {
    textAlign: 'center',
    color: theme.colors.outline,
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
    marginBottom: 16,
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
    lineHeight: 20,
  },
  
  // Data Rights
  dataButton: {
    marginBottom: 12,
    borderColor: theme.colors.primary,
  },
  dangerButton: {
    borderColor: theme.colors.error,
  },
  
  // Notice
  noticeCard: {
    elevation: 1,
    borderRadius: theme.roundness,
    marginBottom: 16,
    backgroundColor: theme.colors.surfaceVariant,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: theme.colors.accent,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  
  // Save Button
  saveButton: {
    paddingVertical: 8,
    marginBottom: 32,
  },
}); 