import { Stack } from 'expo-router';
import { theme } from '../../utils/theme';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="job-preferences" 
        options={{ 
          title: 'Job Preferences',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="career-settings" 
        options={{ 
          title: 'Career Settings',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="privacy-settings" 
        options={{ 
          title: 'Privacy Settings',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="learning-goals" 
        options={{ 
          title: 'Learning Goals',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="help" 
        options={{ 
          title: 'Help & Support',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          title: 'About',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="contact-support" 
        options={{ 
          title: 'Contact Support',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="privacy-policy" 
        options={{ 
          title: 'Privacy Policy',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="terms-of-service" 
        options={{ 
          title: 'Terms of Service',
          headerBackTitle: 'Settings'
        }} 
      />
      <Stack.Screen 
        name="licenses" 
        options={{ 
          title: 'Licenses',
          headerBackTitle: 'Settings'
        }} 
      />
    </Stack>
  );
} 