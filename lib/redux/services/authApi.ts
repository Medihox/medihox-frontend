import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { setCredentials, logout } from '../slices/authSlice';
import { Mutex } from 'async-mutex';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
  organizationName?: string;
  organizationLogo?: string;
  phone?: string;
  messageCount?: {
    whatsapp: number;
    email: number;
    textMessage: number;
  };
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OtpRequest {
  email: string;
  password?: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifySecretKeyRequest {
  secretKey: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CompleteOnboardingRequest {
  email: string;
  organizationName: string;
}

export interface BasicResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface OnboardingOtpRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  organizationName?: string;
  phone?: string;
}

// Create a mutex to prevent multiple refresh token requests
const mutex = new Mutex();

// Base query with authorization headers
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/proxy',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Enhanced query with automatic token refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Wait if there's another request already refreshing the token
  await mutex.waitForUnlock();
  
  let result = await baseQuery(args, api, extraOptions);

  // If the request failed with 401 Unauthorized
  if (result.error && result.error.status === 401) {
    // Check if we already have a refresh process and if not, start one
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      
      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth?.refreshToken;
        
        if (!refreshToken) {
          // No refresh token - user needs to log in again
          api.dispatch(logout());
          return result;
        }
        
        // Try to get a new token
        const refreshResult = await baseQuery(
          { 
            url: '/auth/refresh-token', 
            method: 'POST',
            body: { refreshToken } 
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Store the new token
          const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as { 
            accessToken: string;
            refreshToken: string;
          };
          
          api.dispatch(
            setCredentials({ 
              accessToken, 
              refreshToken: newRefreshToken 
            })
          );
          
          // Retry the original query with new access token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, user needs to log in again
          api.dispatch(logout());
        }
      } finally {
        // Release the mutex so other requests can proceed
        release();
      }
    } else {
      // If mutex is locked (another request is refreshing the token) - wait and retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<User, RegisterRequest>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
    }),

    refreshToken: builder.mutation<{ accessToken: string }, void | { refreshToken?: string }>({
      query: (data) => ({
        url: 'auth/refresh',
        method: 'POST',
        body: data || {}
      }),
    }),

    sendOtp: builder.mutation<BasicResponse, OtpRequest>({
      query: (data) => ({
        url: 'auth/send-otp',
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<BasicResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: 'auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),

    sendOnboardingOtp: builder.mutation<BasicResponse, OnboardingOtpRequest>({
      query: (data) => ({
        url: 'auth/send-onboarding-otp',
        method: 'POST',
        body: data,
      }),
    }),

    completeOnboarding: builder.mutation<BasicResponse, CompleteOnboardingRequest>({
      query: (data) => ({
        url: 'auth/complete-onboarding',
        method: 'POST',
        body: data,
      }),
    }),

    verifySecretKey: builder.mutation<BasicResponse, VerifySecretKeyRequest>({
      query: (data) => ({
        url: 'auth/verify-secret-key',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<BasicResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: 'auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
    }),

    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (data) => ({
        url: '/profile',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useSendOtpMutation,
  useVerifyEmailMutation,
  useSendOnboardingOtpMutation,
  useCompleteOnboardingMutation,
  useVerifySecretKeyMutation,
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} = authApi;

// Add this export to make baseQueryWithReauth available to other files
export { baseQueryWithReauth }; 