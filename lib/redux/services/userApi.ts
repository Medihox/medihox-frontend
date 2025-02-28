import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

// User interface based on API response
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'EMPLOYEE';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  lastLogin?: string;
}

// Request types
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'EMPLOYEE';
  status?: 'ACTIVE' | 'INACTIVE';
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'EMPLOYEE';
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  timeRange?: 'all' | 'today' | 'week' | 'month';
  status?: 'all' | 'ACTIVE' | 'INACTIVE';
  role?: 'all' | 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'EMPLOYEE';
}

// Response structure
export interface UsersResponse {
  data: User[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, GetUsersParams>({
      query: (params) => {
        // Build query string from params
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.timeRange && params.timeRange !== 'all') queryParams.append('timeRange', params.timeRange);
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.role && params.role !== 'all') queryParams.append('role', params.role);
        
        return `admin/employee?${queryParams.toString()}`;
      },
      transformResponse: (response: User[] | UsersResponse) => {
        // Handle array response by converting to expected format
        if (Array.isArray(response)) {
          return {
            data: response,
            pagination: {
              currentPage: 1,
              pageSize: response.length,
              totalItems: response.length,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false
            }
          };
        }
        return response as UsersResponse;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' }
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    
    getUserById: builder.query<User, string>({
      query: (id) => `admin/employee/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (user) => {
        console.log("Creating user:", user);
        
        return {
          url: 'admin/employee',
          method: 'POST',
          body: user,
          credentials: 'include',
        };
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    
    updateUser: builder.mutation<User, { id: string; user: UpdateUserRequest }>({
      query: ({ id, user }) => {
        console.log("Updating user:", user);
        
        return {
          url: `admin/employee/${id}`,
          method: 'PUT',
          body: user,
          credentials: 'include',
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `admin/employee/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi; 