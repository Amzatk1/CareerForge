import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // CareerForge AI Brand Colors - matching the logo
    primary: '#1e293b',        // Dark navy from logo
    primaryContainer: '#e2e8f0',
    secondary: '#334155',      // Lighter navy
    secondaryContainer: '#f1f5f9',
    tertiary: '#0ea5e9',       // Professional blue accent
    tertiaryContainer: '#e0f2fe',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#f1f5f9',     // Light blue-gray background
    error: '#dc2626',
    errorContainer: '#fef2f2',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1e293b',      // Dark navy text
    onBackground: '#1e293b',
    outline: '#64748b',        // Medium gray
    
    // Additional CareerForge brand colors
    accent: '#0ea5e9',         // Bright blue for highlights
    chart: '#1e293b',          // Dark navy for chart elements
    success: '#059669',
    warning: '#d97706',
    info: '#0284c7',
  },
  roundness: 16,  // More modern rounded corners to match logo style
}; 