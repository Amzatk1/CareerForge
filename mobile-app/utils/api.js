import AsyncStorage from '@react-native-async-storage/async-storage';

// Try multiple possible backend URLs
const POSSIBLE_BACKEND_URLS = [
  'http://10.77.108.42:8000/api',
  'http://localhost:8000/api',
  'http://127.0.0.1:8000/api',
  'http://192.168.1.100:8000/api', // Common local network IP
];

const API_BASE_URL = POSSIBLE_BACKEND_URLS[0]; // Default to the first one

// Endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/auth/login/',
  '/auth/register/',
  '/auth/token/refresh/',
];

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  isPublicEndpoint(endpoint) {
    return PUBLIC_ENDPOINTS.some(publicEndpoint => endpoint.includes(publicEndpoint));
  }

  async getAuthHeaders(endpoint) {
    // Don't add auth headers for public endpoints
    if (this.isPublicEndpoint(endpoint)) {
      console.log('Public endpoint detected, not adding auth headers:', endpoint);
      return {
        'Content-Type': 'application/json',
      };
    }

    try {
      const tokens = await AsyncStorage.getItem('tokens');
      if (tokens) {
        const { access } = JSON.parse(tokens);
        if (access) {
          console.log('Adding auth headers for protected endpoint:', endpoint);
          return {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
          };
        }
      }
    } catch (error) {
      console.error('Error getting auth headers:', error);
    }
    
    console.log('No valid tokens found, using basic headers for:', endpoint);
    return {
      'Content-Type': 'application/json',
    };
  }

  async refreshToken() {
    try {
      const tokens = await AsyncStorage.getItem('tokens');
      if (!tokens) {
        throw new Error('No refresh token available');
      }

      const { refresh } = JSON.parse(tokens);
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newTokens = {
        access: data.access,
        refresh: refresh, // Keep the same refresh token
      };

      await AsyncStorage.setItem('tokens', JSON.stringify(newTokens));
      return newTokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear invalid tokens
      await AsyncStorage.multiRemove(['tokens', 'user']);
      throw error;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    let headers = await this.getAuthHeaders(endpoint);

    const config = {
      headers,
      ...options,
    };

    console.log('Making API request to:', url);
    console.log('Request config:', { ...config, body: config.body ? 'BODY_PRESENT' : 'NO_BODY' });

    try {
      let response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      
      // If we get a 401 and it's not a public endpoint, try to refresh the token
      if (response.status === 401 && !this.isPublicEndpoint(endpoint)) {
        console.log('Token expired, attempting refresh...');
        try {
          await this.refreshToken();
          // Retry the request with new token
          headers = await this.getAuthHeaders(endpoint);
          config.headers = headers;
          response = await fetch(url, config);
          console.log('Retry response status:', response.status);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Redirect to login will be handled by the auth context
          throw new Error('Authentication failed. Please log in again.');
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(JSON.stringify(errorData) || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('API response success');
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Error details:', {
        message: error.message,
        url,
        endpoint,
        options: { ...options, body: options.body ? 'BODY_PRESENT' : 'NO_BODY' }
      });
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient; 