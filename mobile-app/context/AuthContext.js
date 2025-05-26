import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import apiClient from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedTokens = await AsyncStorage.getItem('tokens');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedTokens && storedUser) {
        const parsedTokens = JSON.parse(storedTokens);
        const parsedUser = JSON.parse(storedUser);
        
        // Check if token is expired (basic check)
        try {
          const tokenPayload = JSON.parse(atob(parsedTokens.access.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenPayload.exp < currentTime) {
            console.log('Token expired, attempting refresh...');
            try {
              await apiClient.refreshToken();
              const newTokens = await AsyncStorage.getItem('tokens');
              if (newTokens) {
                setTokens(JSON.parse(newTokens));
                setUser(parsedUser);
              }
            } catch (refreshError) {
              console.log('Token refresh failed, clearing auth state');
              await clearAuthState();
            }
          } else {
            setTokens(parsedTokens);
            setUser(parsedUser);
          }
        } catch (tokenError) {
          console.log('Token validation error, clearing auth state');
          await clearAuthState();
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthState = async () => {
    try {
      await AsyncStorage.multiRemove(['tokens', 'user']);
      setTokens(null);
      setUser(null);
      console.log('Auth state cleared successfully');
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  const forceLogout = async () => {
    try {
      await clearAuthState();
      router.replace('/(auth)/login');
      console.log('Force logout completed');
    } catch (error) {
      console.error('Force logout error:', error);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Clear any existing auth state first
      await clearAuthState();
      
      // Make API call to backend using apiClient
      const data = await apiClient.post('/auth/login/', { email, password });
      const { tokens: newTokens, user: userData } = data;
      
      await AsyncStorage.setItem('tokens', JSON.stringify(newTokens));
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setTokens(newTokens);
      setUser(userData);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully logged in.',
      });
      
      // Check if user needs onboarding
      if (!userData.profile?.career_interests || userData.profile?.career_interests.length === 0) {
        router.replace('/(auth)/onboarding');
      } else {
        router.replace('/(main)/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Please check your credentials.';
      let errorData = error.message;
      
      // If it's an API error with validation details
      if (error.message && error.message.includes('{')) {
        try {
          errorData = JSON.parse(error.message);
          // Handle specific error types
          if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors[0] || 'Invalid credentials';
            errorData = { general: errorMessage };
          } else if (errorData.email) {
            errorMessage = 'No account found with this email address. Please check your email or sign up for a new account.';
            errorData = { email: errorData.email };
          } else if (errorData.password) {
            errorMessage = 'Incorrect password. Please try again.';
            errorData = { password: errorData.password };
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
            errorData = { general: errorMessage };
          } else {
            errorMessage = 'Please check the form for errors.';
          }
        } catch (e) {
          errorData = error.message;
        }
      }
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Clear any existing auth state first - this is critical for registration
      await clearAuthState();
      
      // Make API call to backend using apiClient
      const data = await apiClient.post('/auth/register/', userData);
      const { tokens: newTokens, user: newUser } = data;
      
      await AsyncStorage.setItem('tokens', JSON.stringify(newTokens));
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      setTokens(newTokens);
      setUser(newUser);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Your account has been created successfully.',
      });
      
      // New users always need onboarding
      router.replace('/(auth)/onboarding');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Please try again.';
      let errorData = error.message;
      
      // If it's an API error with validation details
      if (error.message && error.message.includes('{')) {
        try {
          errorData = JSON.parse(error.message);
          errorMessage = 'Please check the form for errors.';
          
          // Handle specific validation errors
          if (errorData.email) {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          } else if (errorData.username) {
            errorMessage = 'This username is already taken. Please choose a different username.';
          } else if (errorData.password) {
            errorMessage = 'Password does not meet requirements. Please check the password criteria.';
          }
        } catch (e) {
          errorData = error.message;
        }
      }
      
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const updatedUser = { ...user, ...updatedUserData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await apiClient.get('/auth/profile/detail/');
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await clearAuthState();
      router.replace('/(auth)/login');
      
      Toast.show({
        type: 'info',
        text1: 'Logged out',
        text2: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    clearAuthState,
    forceLogout,
    isAuthenticated: !!user && !!tokens,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 