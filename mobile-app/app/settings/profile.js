import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, List, Avatar, Text, Chip, TextInput, Modal, Portal, Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import apiClient from '../../utils/api';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [showDetails, setShowDetails] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);


  
  // Individual field editing state
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || '',
    careerLevel: user?.profile?.career_level || '',
    industry: user?.profile?.industry || '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Dropdown state
  const [dropdownVisible, setDropdownVisible] = useState({
    careerLevel: false,
    industry: false,
  });

  // Preset options
  const careerLevelOptions = [
    'Entry Level',
    'Junior Level',
    'Mid Level',
    'Senior Level',
    'Lead Level',
    'Manager Level',
    'Director Level',
    'VP Level',
    'C-Level',
    'Intern',
    'Freelancer',
    'Consultant',
  ];

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Media & Entertainment',
    'Real Estate',
    'Transportation',
    'Energy',
    'Government',
    'Non-Profit',
    'Agriculture',
    'Construction',
    'Hospitality',
    'Legal',
    'Marketing & Advertising',
    'Telecommunications',
    'Automotive',
    'Aerospace',
    'Biotechnology',
    'Fashion',
    'Food & Beverage',
    'Insurance',
    'Pharmaceuticals',
    'Sports & Recreation',
    'Travel & Tourism',
    'Other',
  ];

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Password change functions
  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    try {
      await apiClient.post('/auth/change-password/', {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      Toast.show({
        type: 'success',
        text1: 'Password Changed',
        text2: 'Your password has been updated successfully.',
      });
      
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    } catch (error) {
      console.error('Password change error:', error);
      
      let errorMessage = 'Failed to change password. Please try again.';
      let fieldErrors = {};
      
      if (error.message && error.message.includes('{')) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.old_password) {
            fieldErrors.currentPassword = 'Current password is incorrect';
            errorMessage = 'Current password is incorrect.';
          } else if (errorData.new_password) {
            fieldErrors.newPassword = errorData.new_password[0] || 'Invalid new password';
            errorMessage = 'Please check your new password requirements.';
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // Use default error message
        }
      }
      
      setPasswordErrors(fieldErrors);
      Toast.show({
        type: 'error',
        text1: 'Password Change Failed',
        text2: errorMessage,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const isPasswordFormValid = () => {
    return passwordData.currentPassword && 
           passwordData.newPassword && 
           passwordData.confirmPassword &&
           passwordData.newPassword === passwordData.confirmPassword &&
           passwordData.currentPassword !== passwordData.newPassword;
  };



  // Individual field editing functions
  const handleFieldEdit = (fieldName) => {
    setEditingField(fieldName);
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: getCurrentFieldValue(fieldName)
    }));
  };

  const getCurrentFieldValue = (fieldName) => {
    switch (fieldName) {
      case 'firstName':
        return user?.first_name || '';
      case 'lastName':
        return user?.last_name || '';
      case 'email':
        return user?.email || '';
      case 'username':
        return user?.username || '';
      case 'careerLevel':
        return user?.profile?.career_level || '';
      case 'industry':
        return user?.profile?.industry || '';
      default:
        return '';
    }
  };

  const handleFieldSave = async (fieldName) => {
    const value = fieldValues[fieldName];
    
    // Validate field
    if (!value.trim()) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: 'This field is required'
      }));
      return;
    }

    if (fieldName === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: 'Please enter a valid email address'
      }));
      return;
    }

    try {
      let updateData = {};
      let endpoint = '/auth/profile/detail/';

      // Determine which endpoint and data to use
      if (fieldName === 'careerLevel' || fieldName === 'industry') {
        endpoint = '/auth/profile/';
        updateData = {
          career_level: fieldName === 'careerLevel' ? value : user?.profile?.career_level,
          industry: fieldName === 'industry' ? value : user?.profile?.industry,
        };
      } else {
        updateData = {
          first_name: fieldName === 'firstName' ? value : user?.first_name,
          last_name: fieldName === 'lastName' ? value : user?.last_name,
          email: fieldName === 'email' ? value : user?.email,
          username: fieldName === 'username' ? value : user?.username,
        };
      }

      await apiClient.patch(endpoint, updateData);

      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: `${getFieldDisplayName(fieldName)} has been updated successfully.`,
      });

      setEditingField(null);
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
      
      // Reset dropdown visibility
      setDropdownVisible(prev => ({
        ...prev,
        [fieldName]: false
      }));
      
      // Refresh user data to reflect changes
      if (refreshUser) {
        await refreshUser();
      }
      
    } catch (error) {
      console.error('Field update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: `Failed to update ${getFieldDisplayName(fieldName).toLowerCase()}. Please try again.`,
      });
    }
  };

  const handleFieldCancel = (fieldName) => {
    setEditingField(null);
    setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: getCurrentFieldValue(fieldName)
    }));
    // Reset dropdown visibility
    setDropdownVisible(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  const getFieldDisplayName = (fieldName) => {
    switch (fieldName) {
      case 'firstName':
        return 'First Name';
      case 'lastName':
        return 'Last Name';
      case 'email':
        return 'Email Address';
      case 'username':
        return 'Username';
      case 'careerLevel':
        return 'Career Level';
      case 'industry':
        return 'Industry';
      default:
        return 'Field';
    }
  };

  // Dropdown helper functions
  const toggleDropdown = (fieldName) => {
    setDropdownVisible(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const selectDropdownOption = (fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
    setDropdownVisible(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  const getDropdownOptions = (fieldName) => {
    switch (fieldName) {
      case 'careerLevel':
        return careerLevelOptions;
      case 'industry':
        return industryOptions;
      default:
        return [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Header Card */}
          <Card style={styles.headerCard}>
            <Card.Content style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <Avatar.Text 
                  size={80} 
                  label={getInitials(user?.first_name, user?.last_name)}
                  style={styles.avatar}
                />
                <View style={styles.statusBadge}>
                  <MaterialCommunityIcons 
                    name="trending-up" 
                    size={16} 
                    color={theme.colors.success} 
                  />
                </View>
              </View>
              <Title style={styles.title}>
                {user ? `${user.first_name} ${user.last_name}` : 'User Profile'}
              </Title>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>@{user?.username}</Text>
                <Chip icon="check-circle" style={styles.verifiedChip} textStyle={styles.verifiedText}>
                  Verified
                </Chip>
              </View>
              <Paragraph style={styles.email}>
                {user?.email}
              </Paragraph>
              <Text style={styles.joinDate}>
                Member since {formatJoinDate(user?.date_joined)}
              </Text>
            </Card.Content>
          </Card>

          {/* Profile Details Card */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>Profile Details</Title>
                <Button 
                  mode="text" 
                  onPress={() => setShowDetails(!showDetails)}
                  icon={showDetails ? "chevron-up" : "chevron-down"}
                >
                  {showDetails ? 'Hide' : 'Show'}
                </Button>
              </View>
              
              {showDetails && (
                <View style={styles.detailsList}>
                  {/* First Name */}
                  {editingField === 'firstName' ? (
                    <View style={styles.editingField}>
                      <TextInput
                        label="First Name"
                        value={fieldValues.firstName}
                        onChangeText={(value) => setFieldValues(prev => ({ ...prev, firstName: value }))}
                        mode="outlined"
                        style={styles.editInput}
                        error={!!fieldErrors.firstName}
                        autoFocus
                      />
                      {fieldErrors.firstName && (
                        <Text style={styles.fieldErrorText}>{fieldErrors.firstName}</Text>
                      )}
                      <View style={styles.editActions}>
                        <Button mode="outlined" onPress={() => handleFieldCancel('firstName')} style={styles.editButton}>
                          Cancel
                        </Button>
                        <Button mode="contained" onPress={() => handleFieldSave('firstName')} style={styles.editButton}>
                          Save
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <List.Item
                      title="First Name"
                      description={user?.first_name || 'Not set'}
                      left={props => <List.Icon {...props} icon="account" />}
                      right={props => <List.Icon {...props} icon="pencil" />}
                      onPress={() => handleFieldEdit('firstName')}
                      style={styles.listItem}
                    />
                  )}
                  <Divider />

                  {/* Last Name */}
                  {editingField === 'lastName' ? (
                    <View style={styles.editingField}>
                      <TextInput
                        label="Last Name"
                        value={fieldValues.lastName}
                        onChangeText={(value) => setFieldValues(prev => ({ ...prev, lastName: value }))}
                        mode="outlined"
                        style={styles.editInput}
                        error={!!fieldErrors.lastName}
                        autoFocus
                      />
                      {fieldErrors.lastName && (
                        <Text style={styles.fieldErrorText}>{fieldErrors.lastName}</Text>
                      )}
                      <View style={styles.editActions}>
                        <Button mode="outlined" onPress={() => handleFieldCancel('lastName')} style={styles.editButton}>
                          Cancel
                        </Button>
                        <Button mode="contained" onPress={() => handleFieldSave('lastName')} style={styles.editButton}>
                          Save
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <List.Item
                      title="Last Name"
                      description={user?.last_name || 'Not set'}
                      left={props => <List.Icon {...props} icon="account" />}
                      right={props => <List.Icon {...props} icon="pencil" />}
                      onPress={() => handleFieldEdit('lastName')}
                      style={styles.listItem}
                    />
                  )}
                  <Divider />

                  {/* Username */}
                  {editingField === 'username' ? (
                    <View style={styles.editingField}>
                      <TextInput
                        label="Username"
                        value={fieldValues.username}
                        onChangeText={(value) => setFieldValues(prev => ({ ...prev, username: value }))}
                        mode="outlined"
                        style={styles.editInput}
                        error={!!fieldErrors.username}
                        autoFocus
                        autoCapitalize="none"
                      />
                      {fieldErrors.username && (
                        <Text style={styles.fieldErrorText}>{fieldErrors.username}</Text>
                      )}
                      <View style={styles.editActions}>
                        <Button mode="outlined" onPress={() => handleFieldCancel('username')} style={styles.editButton}>
                          Cancel
                        </Button>
                        <Button mode="contained" onPress={() => handleFieldSave('username')} style={styles.editButton}>
                          Save
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <List.Item
                      title="Username"
                      description={user?.username || 'Not set'}
                      left={props => <List.Icon {...props} icon="at" />}
                      right={props => <List.Icon {...props} icon="pencil" />}
                      onPress={() => handleFieldEdit('username')}
                      style={styles.listItem}
                    />
                  )}
                  <Divider />

                  {/* Email Address */}
                  {editingField === 'email' ? (
                    <View style={styles.editingField}>
                      <TextInput
                        label="Email Address"
                        value={fieldValues.email}
                        onChangeText={(value) => setFieldValues(prev => ({ ...prev, email: value }))}
                        mode="outlined"
                        style={styles.editInput}
                        error={!!fieldErrors.email}
                        autoFocus
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      {fieldErrors.email && (
                        <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>
                      )}
                      <View style={styles.editActions}>
                        <Button mode="outlined" onPress={() => handleFieldCancel('email')} style={styles.editButton}>
                          Cancel
                        </Button>
                        <Button mode="contained" onPress={() => handleFieldSave('email')} style={styles.editButton}>
                          Save
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <List.Item
                      title="Email Address"
                      description={user?.email || 'Not set'}
                      left={props => <List.Icon {...props} icon="email" />}
                      right={props => <List.Icon {...props} icon="pencil" />}
                      onPress={() => handleFieldEdit('email')}
                      style={styles.listItem}
                    />
                  )}
                  <Divider />

                  {/* Account Status - Not editable */}
                  <List.Item
                    title="Account Status"
                    description={user?.is_active ? 'Active' : 'Inactive'}
                    left={props => <List.Icon {...props} icon="check-circle" />}
                    style={styles.listItem}
                  />
                  <Divider />

                  {/* Career Level */}
                  {editingField === 'careerLevel' ? (
                    <View style={styles.editingField}>
                      <Menu
                        visible={dropdownVisible.careerLevel}
                        onDismiss={() => toggleDropdown('careerLevel')}
                        anchor={
                          <Button
                            mode="outlined"
                            onPress={() => toggleDropdown('careerLevel')}
                            style={styles.dropdownButton}
                            contentStyle={styles.dropdownButtonContent}
                            icon="chevron-down"
                          >
                            {fieldValues.careerLevel || 'Select Career Level'}
                          </Button>
                        }
                        contentStyle={styles.menuContent}
                      >
                        {careerLevelOptions.map((option) => (
                          <Menu.Item
                            key={option}
                            onPress={() => selectDropdownOption('careerLevel', option)}
                            title={option}
                            titleStyle={fieldValues.careerLevel === option ? styles.selectedOption : null}
                          />
                        ))}
                      </Menu>
                      {fieldErrors.careerLevel && (
                        <Text style={styles.fieldErrorText}>{fieldErrors.careerLevel}</Text>
                      )}
                      <View style={styles.editActions}>
                        <Button mode="outlined" onPress={() => handleFieldCancel('careerLevel')} style={styles.editButton}>
                          Cancel
                        </Button>
                        <Button mode="contained" onPress={() => handleFieldSave('careerLevel')} style={styles.editButton}>
                          Save
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <List.Item
                      title="Career Level"
                      description={user?.profile?.career_level || 'Not specified'}
                      left={props => <List.Icon {...props} icon="trending-up" />}
                      right={props => <List.Icon {...props} icon="pencil" />}
                      onPress={() => handleFieldEdit('careerLevel')}
                      style={styles.listItem}
                    />
                  )}
                  <Divider />

                  {/* Industry */}
                  {editingField === 'industry' ? (
                    <View style={styles.editingField}>
                      <Menu
                        visible={dropdownVisible.industry}
                        onDismiss={() => toggleDropdown('industry')}
                        anchor={
                          <Button
                            mode="outlined"
                            onPress={() => toggleDropdown('industry')}
                            style={styles.dropdownButton}
                            contentStyle={styles.dropdownButtonContent}
                            icon="chevron-down"
                          >
                            {fieldValues.industry || 'Select Industry'}
                          </Button>
                        }
                        contentStyle={styles.menuContent}
                      >
                        {industryOptions.map((option) => (
                          <Menu.Item
                            key={option}
                            onPress={() => selectDropdownOption('industry', option)}
                            title={option}
                            titleStyle={fieldValues.industry === option ? styles.selectedOption : null}
                          />
                        ))}
                      </Menu>
                      {fieldErrors.industry && (
                        <Text style={styles.fieldErrorText}>{fieldErrors.industry}</Text>
                      )}
                      <View style={styles.editActions}>
                        <Button mode="outlined" onPress={() => handleFieldCancel('industry')} style={styles.editButton}>
                          Cancel
                        </Button>
                        <Button mode="contained" onPress={() => handleFieldSave('industry')} style={styles.editButton}>
                          Save
                        </Button>
                      </View>
                    </View>
                  ) : (
                    <List.Item
                      title="Industry"
                      description={user?.profile?.industry || 'Not specified'}
                      left={props => <List.Icon {...props} icon="domain" />}
                      right={props => <List.Icon {...props} icon="pencil" />}
                      onPress={() => handleFieldEdit('industry')}
                      style={styles.listItem}
                    />
                  )}
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Quick Actions Card */}
          <Card style={styles.actionsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Quick Actions</Title>
              <Button 
                mode="outlined" 
                style={styles.button}
                onPress={() => setShowPasswordModal(true)}
                icon="lock-reset"
              >
                Change Password
              </Button>
              <Button 
                mode="outlined" 
                style={styles.button}
                onPress={() => router.push('/settings/privacy-settings')}
                icon="shield-account"
              >
                Privacy & Security
              </Button>
              <Divider style={styles.divider} />
              <Button 
                mode="outlined" 
                style={styles.logoutButton}
                onPress={logout}
                icon="logout"
                buttonColor={theme.colors.errorContainer}
                textColor={theme.colors.error}
              >
                Sign Out
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>



      {/* Change Password Modal */}
      <Portal>
        <Modal 
          visible={showPasswordModal} 
          onDismiss={() => setShowPasswordModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <Card.Content>
              <View style={styles.modalHeader}>
                <MaterialCommunityIcons 
                  name="lock-reset" 
                  size={48} 
                  color={theme.colors.primary} 
                />
                <Title style={styles.modalTitle}>Change Password</Title>
                <Paragraph style={styles.modalDescription}>
                  Enter your current password and choose a new secure password
                </Paragraph>
              </View>

              <View style={styles.form}>
                <TextInput
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChangeText={(value) => handlePasswordInputChange('currentPassword', value)}
                  mode="outlined"
                  secureTextEntry={!showPasswords.current}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPasswords.current ? "eye-off" : "eye"}
                      onPress={() => togglePasswordVisibility('current')}
                    />
                  }
                  error={!!passwordErrors.currentPassword}
                  disabled={passwordLoading}
                />
                {passwordErrors.currentPassword && (
                  <Paragraph style={styles.errorText}>{passwordErrors.currentPassword}</Paragraph>
                )}

                <TextInput
                  label="New Password"
                  value={passwordData.newPassword}
                  onChangeText={(value) => handlePasswordInputChange('newPassword', value)}
                  mode="outlined"
                  secureTextEntry={!showPasswords.new}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock-plus" />}
                  right={
                    <TextInput.Icon
                      icon={showPasswords.new ? "eye-off" : "eye"}
                      onPress={() => togglePasswordVisibility('new')}
                    />
                  }
                  error={!!passwordErrors.newPassword}
                  disabled={passwordLoading}
                />
                {passwordErrors.newPassword && (
                  <Paragraph style={styles.errorText}>{passwordErrors.newPassword}</Paragraph>
                )}

                <TextInput
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChangeText={(value) => handlePasswordInputChange('confirmPassword', value)}
                  mode="outlined"
                  secureTextEntry={!showPasswords.confirm}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showPasswords.confirm ? "eye-off" : "eye"}
                      onPress={() => togglePasswordVisibility('confirm')}
                    />
                  }
                  error={!!passwordErrors.confirmPassword}
                  disabled={passwordLoading}
                />
                {passwordErrors.confirmPassword && (
                  <Paragraph style={styles.errorText}>{passwordErrors.confirmPassword}</Paragraph>
                )}

                {/* Password Requirements */}
                <Card style={styles.requirementsCard}>
                  <Card.Content>
                    <Title style={styles.requirementsTitle}>Password Requirements</Title>
                    <View style={styles.requirement}>
                      <MaterialCommunityIcons 
                        name={passwordData.newPassword.length >= 8 ? "check-circle" : "circle-outline"} 
                        size={16} 
                        color={passwordData.newPassword.length >= 8 ? theme.colors.success : theme.colors.outline} 
                      />
                      <Paragraph style={styles.requirementText}>At least 8 characters</Paragraph>
                    </View>
                    <View style={styles.requirement}>
                      <MaterialCommunityIcons 
                        name={/(?=.*[a-z])/.test(passwordData.newPassword) ? "check-circle" : "circle-outline"} 
                        size={16} 
                        color={/(?=.*[a-z])/.test(passwordData.newPassword) ? theme.colors.success : theme.colors.outline} 
                      />
                      <Paragraph style={styles.requirementText}>One lowercase letter</Paragraph>
                    </View>
                    <View style={styles.requirement}>
                      <MaterialCommunityIcons 
                        name={/(?=.*[A-Z])/.test(passwordData.newPassword) ? "check-circle" : "circle-outline"} 
                        size={16} 
                        color={/(?=.*[A-Z])/.test(passwordData.newPassword) ? theme.colors.success : theme.colors.outline} 
                      />
                      <Paragraph style={styles.requirementText}>One uppercase letter</Paragraph>
                    </View>
                    <View style={styles.requirement}>
                      <MaterialCommunityIcons 
                        name={/(?=.*\d)/.test(passwordData.newPassword) ? "check-circle" : "circle-outline"} 
                        size={16} 
                        color={/(?=.*\d)/.test(passwordData.newPassword) ? theme.colors.success : theme.colors.outline} 
                      />
                      <Paragraph style={styles.requirementText}>One number</Paragraph>
                    </View>
                  </Card.Content>
                </Card>

                <View style={styles.modalActions}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowPasswordModal(false)}
                    style={styles.modalButton}
                    disabled={passwordLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleChangePassword}
                    loading={passwordLoading}
                    disabled={passwordLoading || !isPasswordFormValid()}
                    style={styles.modalButton}
                    icon="lock-reset"
                  >
                    Change Password
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
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
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 12,
  },
  headerCard: {
    elevation: 4,
    marginBottom: 12,
    borderRadius: theme.roundness,
  },
  headerContent: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  username: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  verifiedChip: {
    backgroundColor: theme.colors.success,
    height: 24,
  },
  verifiedText: {
    fontSize: 10,
    color: theme.colors.surface,
  },
  email: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.outline,
    fontSize: 14,
  },
  joinDate: {
    textAlign: 'center',
    color: theme.colors.outline,
    fontSize: 12,
  },
  detailsCard: {
    elevation: 2,
    marginBottom: 12,
    borderRadius: theme.roundness,
  },
  actionsCard: {
    elevation: 2,
    marginBottom: 12,
    borderRadius: theme.roundness,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailsList: {
    marginTop: 8,
  },
  listItem: {
    paddingVertical: 8,
  },
  button: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  logoutButton: {
    marginTop: 8,
  },
  modalContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  modalCard: {
    maxHeight: '90%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    textAlign: 'center',
    color: theme.colors.outline,
    lineHeight: 20,
  },
  form: {
    gap: 16,
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
  requirementsCard: {
    backgroundColor: theme.colors.surfaceVariant,
    elevation: 1,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
  // Inline editing styles
  editingField: {
    padding: 16,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    marginVertical: 4,
  },
  editInput: {
    marginBottom: 8,
  },
  fieldErrorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  editButton: {
    minWidth: 80,
  },
  // Dropdown styles
  dropdownButton: {
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  dropdownButtonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  menuContent: {
    maxHeight: 300,
    backgroundColor: theme.colors.surface,
  },
  selectedOption: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },

}); 