import { store } from '@/lib/redux/store';
import { updateAccessToken } from '@/lib/redux/slices/authSlice';
import { authApi } from '@/lib/redux/services/authApi';

// Utility function to get cookie value
const getCookieValue = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined; // Server-side guard
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
};

// Function to refresh token
export const refreshAccessToken = async () => {
  try {
    // Get the refresh token from cookie
    const refreshToken = getCookieValue('refreshToken');
    
    // If no refresh token in cookies, try localStorage as fallback
    const storedRefreshToken = refreshToken || 
      (typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null);
    
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }
    
    const refreshResponse = await store.dispatch(
      authApi.endpoints.refreshToken.initiate({ refreshToken: storedRefreshToken })
    ).unwrap();
    
    // Update the token in the Redux store
    store.dispatch(updateAccessToken(refreshResponse.accessToken));
    
    return refreshResponse.accessToken;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

// Utility to handle unauthorized errors
export const handleAuthError = async (error: any) => {
  if (error?.status === 401) {
    try {
      await refreshAccessToken();
      return true; // Token refreshed successfully
    } catch (refreshError) {
      // Clear auth state or redirect to login
      return false;
    }
  }
  return false;
}; 