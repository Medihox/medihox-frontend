import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Inquiry interface
export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  organizationName: string;
  notes: string;
  requestFor: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

// Create inquiry request interface
export interface CreateInquiryRequest {
  name: string;
  phone: string;
  email: string;
  organizationName: string;
  notes: string;
  requestFor: string;
}

// Update inquiry request interface
export interface UpdateInquiryRequest {
  status?: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';
  notes?: string;
}

// Get inquiries params
export interface GetInquiriesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  timeRange?: 'all' | 'today' | 'week' | 'month';
  status?: 'all' | 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';
}

// Inquiries response
export interface InquiriesResponse {
  data: Inquiry[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Get the base URL from environment or default to localhost
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create the API
export const formInquiryApi = createApi({
  reducerPath: 'formInquiryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.accessToken;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    // Handle specific response errors
    responseHandler: async (response) => {
      // For non-JSON responses, just return the response
      if (!response.headers.get('content-type')?.includes('application/json')) {
        return response.text();
      }
      
      // For JSON responses, parse the JSON
      return response.json();
    },
  }),
  tagTypes: ['Inquiry'],
  endpoints: (builder) => ({
    // Get all inquiries
    getInquiries: builder.query<InquiriesResponse, GetInquiriesParams>({
      query: (params) => ({
        url: '/inquiries',
        method: 'GET',
        params,
      }),
      providesTags: ['Inquiry'],
    }),
    
    // Get inquiry by ID
    getInquiryById: builder.query<Inquiry, string>({
      query: (id) => `/inquiries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Inquiry', id }],
    }),
    
    // Create inquiry
    createInquiry: builder.mutation<Inquiry, CreateInquiryRequest>({
      query: (body) => ({
        url: '/inquiries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Inquiry'],
    }),
    
    // Update inquiry
    updateInquiry: builder.mutation<Inquiry, { id: string; body: UpdateInquiryRequest }>({
      query: ({ id, body }) => ({
        url: `/inquiries/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inquiry', id }],
    }),
    
    // Delete inquiry
    deleteInquiry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inquiries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inquiry'],
    }),
  }),
});

// Export hooks
export const {
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useCreateInquiryMutation,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = formInquiryApi; 