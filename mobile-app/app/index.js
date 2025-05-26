import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/(main)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, loading]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.colors.background 
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
} 