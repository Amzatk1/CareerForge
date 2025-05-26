import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loading, clearAuthState } = useAuth();

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const result = await login(email, password);
    if (!result.success && result.error) {
      // Handle API errors
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        setErrors({ general: result.error });
      }
    }
  };

  const handleClearData = async () => {
    try {
      await AsyncStorage.clear();
      await clearAuthState();
      console.log('All data cleared');
      alert('All authentication data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
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
            <Title style={styles.title}>Welcome Back</Title>
            <Paragraph style={styles.subtitle}>
              Sign in to continue your career journey with AI-powered insights
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
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
                label="Password"
                value={password}
                onChangeText={setPassword}
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
              {errors.general && (
                <Text style={styles.errorText}>{errors.general}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading || !email || !password}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                Sign In
              </Button>

              {/* Debug button - remove in production */}
              <Button
                mode="outlined"
                onPress={handleClearData}
                style={styles.debugButton}
                textColor={theme.colors.error}
              >
                Clear All Data (Debug)
              </Button>

              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  Don't have an account?{' '}
                  <Link href="/(auth)/register" style={styles.link}>
                    Sign Up
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
  input: {
    marginBottom: 16,
  },
  loginButton: {
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
  debugButton: {
    marginTop: 8,
    marginBottom: 16,
  },
}); 