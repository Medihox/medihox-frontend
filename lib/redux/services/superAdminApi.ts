import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

// Interface for user data
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  emailVerified?: boolean;
  organizationName?: string;
  organizationLogo?: string;
  createdAt: string;
  subscriptionSecretKey?: string;
  subscriptionStatus?: string;
  subscriptionExpiresAt?: string;
}

// Response interface
export interface AdminUsersResponse {
  data: AdminUser[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Add this interface for the renewal request
export interface RenewSubscriptionRequest {
  expiryDate?: string; // Optional new expiry date
  subscriptionStatus?: string; // Optional status update
}

// Add this interface for the suspension request
export interface SuspendSubscriptionRequest {
  reason?: string;
  suspendedAt?: string;
}

// Create super admin API
export const superAdminApi = createApi({
  reducerPath: 'superAdminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['SuperAdminUsers'],
  endpoints: (builder) => ({
    getSuperAdminUsers: builder.query<AdminUsersResponse, void>({
      query: () => `super-admin/admins`,
      providesTags: ['SuperAdminUsers'],
    }),
    
    getSuperAdminUserById: builder.query<AdminUser, string>({
      query: (id) => `super-admin/admins/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SuperAdminUsers', id }],
    }),
    
    updateSuperAdminUser: builder.mutation<AdminUser, { id: string; user: Partial<AdminUser> }>({
      query: ({ id, user }) => ({
        url: `super-admin/admins/${id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SuperAdminUsers', id },
        'SuperAdminUsers',
      ],
    }),
    
    deleteSuperAdminUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `super-admin/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SuperAdminUsers'],
    }),
    
    renewSubscription: builder.mutation<AdminUser, { id: string, data: RenewSubscriptionRequest }>({
      query: ({ id, data }) => ({
        url: `/super-admin/admins/${id}/renew-subscription`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SuperAdminUsers', id }],
    }),
    
    suspendSubscription: builder.mutation<AdminUser, { id: string, data: SuspendSubscriptionRequest }>({
      query: ({ id, data }) => ({
        url: `/super-admin/admins/${id}/suspend-subscription`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SuperAdminUsers', id }],
    }),
  }),
});

export const {
  useGetSuperAdminUsersQuery,
  useGetSuperAdminUserByIdQuery,
  useUpdateSuperAdminUserMutation,
  useDeleteSuperAdminUserMutation,
  useRenewSubscriptionMutation,
  useSuspendSubscriptionMutation,
} = superAdminApi; 