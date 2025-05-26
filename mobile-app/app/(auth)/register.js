import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare data for API
    const registrationData = {
      email: formData.email,
      username: formData.username,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      password_confirm: formData.confirmPassword,
    };
    
    const result = await register(registrationData);
    if (result.success) {
      // Redirect to onboarding for new users
      router.replace('/(auth)/onboarding');
    } else if (result.error) {
      // Handle API errors
      if (typeof result.error === 'object') {
        setErrors(result.error);
      }
    }
  };

  const isFormValid = () => {
    return formData.email && 
           formData.username && 
           formData.firstName && 
           formData.lastName && 
           formData.password && 
           formData.confirmPassword &&
           formData.password === formData.confirmPassword;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons 
                name="trending-up" 
                size={48} 
                color={theme.colors.primary} 
                style={styles.logoIcon}
              />
              <Title style={styles.brandTitle}>CareerForge AI</Title>
            </View>
            <Title style={styles.title}>Join CareerForge</Title>
            <Paragraph style={styles.subtitle}>
              Start your AI-powered career journey today with personalized roadmaps
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.nameRow}>
                              <TextInput
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                error={!!errors.firstName}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
                <TextInput
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  error={!!errors.lastName}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
                error={!!errors.email}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Username"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                mode="outlined"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
                error={!!errors.username}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!errors.password}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TextInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock-check" />}
                error={!!errors.confirmPassword || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              {!errors.confirmPassword && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading || !isFormValid()}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
              >
                Create Account
              </Button>

              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  Already have an account?{' '}
                  <Link href="/(auth)/login" style={styles.link}>
                    Sign In
                  </Link>
                </Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: theme.roundness,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linkContainer: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
}); 