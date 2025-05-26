import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Avatar, TextInput } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import apiClient from '../../utils/api';
import Toast from 'react-native-toast-message';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await apiClient.get('/auth/profile/detail/');
      setFormData({
        firstName: data.user?.first_name || '',
        lastName: data.user?.last_name || '',
        email: data.user?.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        location: data.location || '',
        website: data.website || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Load Failed',
        text2: 'Could not load profile data.',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await apiClient.put('/auth/profile/update/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      });

      // Update user context if available
      if (updateUser) {
        updateUser({
          ...user,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        });
      }
      
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
      });
      router.back();
    } catch (error) {
      console.error('Profile update error:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      let fieldErrors = {};
      
      if (error.message && error.message.includes('{')) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.email) {
            fieldErrors.email = 'This email is already in use';
            errorMessage = 'Email address is already registered.';
          } else if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors[0];
          }
        } catch (e) {
          // Use default error message
        }
      }
      
      setErrors(fieldErrors);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    return `${formData.firstName?.charAt(0) || ''}${formData.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Paragraph>Loading profile...</Paragraph>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Profile Picture Section */}
          <Card style={styles.avatarCard}>
            <Card.Content style={styles.avatarContent}>
              <Avatar.Text 
                size={80} 
                label={getInitials()}
                style={styles.avatar}
              />
              <Paragraph style={styles.avatarText}>
                Profile picture coming soon
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Personal Information */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Personal Information</Title>
              
              <TextInput
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.firstName}
                disabled={loading}
              />
              {errors.firstName && (
                <Paragraph style={styles.errorText}>{errors.firstName}</Paragraph>
              )}

              <TextInput
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.lastName}
                disabled={loading}
              />
              {errors.lastName && (
                <Paragraph style={styles.errorText}>{errors.lastName}</Paragraph>
              )}

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <Paragraph style={styles.errorText}>{errors.email}</Paragraph>
              )}

              <TextInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                error={!!errors.phone}
                disabled={loading}
              />
              {errors.phone && (
                <Paragraph style={styles.errorText}>{errors.phone}</Paragraph>
              )}
            </Card.Content>
          </Card>

          {/* Additional Information */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Additional Information</Title>
              
              <TextInput
                label="Location"
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                mode="outlined"
                style={styles.input}
                disabled={loading}
              />

              <TextInput
                label="Website"
                value={formData.website}
                onChangeText={(value) => handleInputChange('website', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="url"
                autoCapitalize="none"
                error={!!errors.website}
                disabled={loading}
              />
              {errors.website && (
                <Paragraph style={styles.errorText}>{errors.website}</Paragraph>
              )}

              <TextInput
                label="Bio"
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={4}
                disabled={loading}
              />
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
            Save Changes
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Avatar Section
  avatarCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: theme.roundness,
  },
  avatarContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginBottom: 12,
  },
  avatarText: {
    color: theme.colors.outline,
    fontSize: 14,
  },
  
  // Form Cards
  formCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: theme.roundness,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  
  // Save Button
  saveButton: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: theme.colors.primary,
  },
}); 