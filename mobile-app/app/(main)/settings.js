import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider, Switch, Avatar, Text, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import apiClient from '../../utils/api';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
  const { user, tokens, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    roadmapUpdates: true,
    skillRecommendations: true,
    weeklyProgress: true,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await apiClient.get('/auth/profile/detail/');
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't show error toast for profile fetch failure
      // as it's not critical for settings page functionality
    } finally {
      setLoading(false);
    }
  };

  const handleCareerSettingsPress = () => {
    router.push('/settings/career-settings');
  };

  const handleNotificationToggle = async (key) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({
      ...prev,
      [key]: newValue
    }));

    try {
      // Save notification preferences to backend
      await apiClient.patch('/auth/profile/notifications/', {
        [key]: newValue
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Revert the change if API call fails
      setNotifications(prev => ({
        ...prev,
        [key]: !newValue
      }));
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not update notification preferences.',
      });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete('/auth/delete-account/');
              Toast.show({
                type: 'success',
                text1: 'Account Deleted',
                text2: 'Your account has been successfully deleted.',
              });
              logout();
            } catch (error) {
              console.error('Error deleting account:', error);
              Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: 'Could not delete account. Please try again.',
              });
            }
          }
        }
      ]
    );
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Summary */}
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text 
                size={60} 
                label={getInitials(user?.first_name, user?.last_name)}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Title style={styles.profileName}>
                  {user?.first_name} {user?.last_name}
                </Title>
                <Paragraph style={styles.profileEmail}>{user?.email}</Paragraph>
                <View style={styles.profileStats}>
                  <Chip icon="briefcase" style={styles.statChip} textStyle={styles.statChipText}>
                    {profile?.experience_level || 'Not set'}
                  </Chip>
                  <Chip icon="star" style={styles.statChip} textStyle={styles.statChipText}>
                    {profile?.skills?.length || 0} skills
                  </Chip>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Career Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="briefcase-edit" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Career Settings</Title>
            </View>
            
            <List.Item
              title="Career Interests & Skills"
              description="Update your career fields, skills, and experience level"
              left={props => <List.Icon {...props} icon="school" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleCareerSettingsPress}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Job Preferences"
              description="Remote work, salary expectations, location preferences"
              left={props => <List.Icon {...props} icon="map-marker" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/settings/job-preferences')}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Learning Goals"
              description="Set and manage your professional development goals"
              left={props => <List.Icon {...props} icon="target" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/settings/learning-goals')}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Notifications */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="bell" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Notifications</Title>
            </View>
            
            <List.Item
              title="Job Alerts"
              description="Get notified about new job opportunities"
              left={props => <List.Icon {...props} icon="briefcase-search" />}
              right={() => (
                <Switch
                  value={notifications.jobAlerts}
                  onValueChange={() => handleNotificationToggle('jobAlerts')}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Roadmap Updates"
              description="Updates on your career roadmap progress"
              left={props => <List.Icon {...props} icon="map-marker-path" />}
              right={() => (
                <Switch
                  value={notifications.roadmapUpdates}
                  onValueChange={() => handleNotificationToggle('roadmapUpdates')}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Skill Recommendations"
              description="AI-powered skill and course suggestions"
              left={props => <List.Icon {...props} icon="robot" />}
              right={() => (
                <Switch
                  value={notifications.skillRecommendations}
                  onValueChange={() => handleNotificationToggle('skillRecommendations')}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Weekly Progress"
              description="Weekly summary of your career progress"
              left={props => <List.Icon {...props} icon="chart-line" />}
              right={() => (
                <Switch
                  value={notifications.weeklyProgress}
                  onValueChange={() => handleNotificationToggle('weeklyProgress')}
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Account Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-cog" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Account</Title>
            </View>
            
            <List.Item
              title="Profile"
              description="View and edit your personal information"
              left={props => <List.Icon {...props} icon="account-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/settings/profile')}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Privacy & Security"
              description="Manage your privacy settings"
              left={props => <List.Icon {...props} icon="shield-check" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/settings/privacy-settings')}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Support & About */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="help-circle" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Support & About</Title>
            </View>
            
            <List.Item
              title="Help Center"
              description="Get help and find answers to common questions"
              left={props => <List.Icon {...props} icon="help-circle-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/settings/help')}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Contact Support"
              description="Get in touch with our support team"
              left={props => <List.Icon {...props} icon="email" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/settings/contact-support')}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="About CareerForge AI"
              description="Learn more about our app and mission"
              left={props => <List.Icon {...props} icon="information" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/settings/about')}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.sectionCard, styles.dangerCard]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="alert" size={24} color={theme.colors.error} />
              <Title style={[styles.sectionTitle, { color: theme.colors.error }]}>Danger Zone</Title>
            </View>
            
            <Button
              mode="outlined"
              onPress={logout}
              style={styles.logoutButton}
              textColor={theme.colors.error}
              icon="logout"
            >
              Sign Out
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleDeleteAccount}
              style={[styles.logoutButton, { marginTop: 12 }]}
              textColor={theme.colors.error}
              icon="delete"
            >
              Delete Account
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
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
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Profile Card
  profileCard: {
    marginBottom: 12,
    elevation: 4,
    borderRadius: theme.roundness,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: theme.colors.outline,
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    backgroundColor: theme.colors.primaryContainer,
    height: 28,
  },
  statChipText: {
    fontSize: 11,
    color: theme.colors.primary,
  },
  
  // Section Cards
  sectionCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: theme.roundness,
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
  listItem: {
    paddingVertical: 8,
  },
  
  // Danger Zone
  dangerCard: {
    borderColor: theme.colors.error,
    borderWidth: 1,
    marginBottom: 24,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
}); 