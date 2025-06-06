import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../services/authApi';
import { RootState } from '../store';

// Interfaces
export interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  converted: boolean;
  createdAt: string;
}

export interface AppointmentStatus {
  id: string;
  name: string;
  color: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  status: string;
  statusObj?: AppointmentStatus;
  service: string;
  serviceObj?: Service;
  source: string;
  date: string;
  time?: string;
  notes?: string;
  beforeImages?: string[];
  afterImages?: string[];
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateAppointmentRequest {
  patientId?: string;
  patient?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  status: string;
  service: string;
  source: string;
  date: string;
  time?: string;
  notes?: string;
  beforeImages?: string[];
  afterImages?: string[];
}

export interface BulkCreateAppointmentRequest {
  data: CreateAppointmentRequest[];
  isBulk: true;
}

export interface UpdateAppointmentRequest {
  patientId?: string;
  status?: string;
  service?: string;
  source?: string;
  date?: string;
  time?: string;
  notes?: string;
  beforeImages?: string[];
  afterImages?: string[];
}

// Filter types
export interface AppointmentFilters {
  timeRange?: 'all' | 'today' | 'week' | 'month';
  status?: string;
  service?: string;
  source?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
  isEnquiry?: boolean;
}

// Add a paginated response interface
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getAppointments: builder.query<PaginatedResponse<Appointment>, AppointmentFilters | void>({
      query: (filters?: AppointmentFilters) => {
        // Build a request object with both URL and params
        const request: any = {
          url: 'appointments',
          method: 'GET',
          params: {} // Use params object instead of building URL manually
        };
        
        if (filters) {
          // Add each filter to the params object directly
          if (filters.search) request.params.search = filters.search;
          if (filters.timeRange && filters.timeRange !== 'all') request.params.timeRange = filters.timeRange;
          if (filters.status && filters.status !== 'all') request.params.status = filters.status;
          if (filters.service) request.params.service = filters.service;
          if (filters.source) request.params.source = filters.source;
          if (filters.fromDate && filters.fromDate.trim() !== '') request.params.fromDate = filters.fromDate;
          if (filters.toDate && filters.toDate.trim() !== '') request.params.toDate = filters.toDate;
          if (typeof filters.page === 'number') request.params.page = filters.page;
          if (typeof filters.pageSize === 'number') request.params.pageSize = filters.pageSize;
          if (filters.isEnquiry) request.params.isEnquiry = filters.isEnquiry;
          
          console.log('Request params:', request.params);
        }
        
        return request;
      },
      transformResponse: (response: unknown) => {
        if (!response || typeof response !== 'object') {
          return { 
            data: [], 
            pagination: { 
              currentPage: 1, 
              pageSize: 10, 
              totalItems: 0, 
              totalPages: 0, 
              hasNextPage: false, 
              hasPreviousPage: false 
            }
          };
        }
        
        return response as PaginatedResponse<Appointment>;
      },
      providesTags: (result: PaginatedResponse<Appointment> | undefined) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Appointment' as const, id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    
    getInquiries: builder.query<PaginatedResponse<Appointment>, AppointmentFilters | void>({
      query: (filters?: AppointmentFilters) => {
        // Build a request object with both URL and params
        const request: any = {
          url: 'inquiries',
          method: 'GET',
          params: {} // Use params object instead of building URL manually
        };
        
        if (filters) {
          // Add each filter to the params object directly
          if (filters.search) request.params.search = filters.search;
          if (filters.timeRange && filters.timeRange !== 'all') request.params.timeRange = filters.timeRange;
          if (filters.status && filters.status !== 'all') request.params.status = filters.status;
          if (filters.service) request.params.service = filters.service;
          if (filters.source) request.params.source = filters.source;
          if (filters.fromDate && filters.fromDate.trim() !== '') request.params.fromDate = filters.fromDate;
          if (filters.toDate && filters.toDate.trim() !== '') request.params.toDate = filters.toDate;
          if (typeof filters.page === 'number') request.params.page = filters.page;
          if (typeof filters.pageSize === 'number') request.params.pageSize = filters.pageSize;
          
          console.log('Inquiry request params:', request.params);
        }
        
        return request;
      },
      transformResponse: (response: unknown) => {
        if (!response || typeof response !== 'object') {
          return { 
            data: [], 
            pagination: { 
              currentPage: 1, 
              pageSize: 10, 
              totalItems: 0, 
              totalPages: 0, 
              hasNextPage: false, 
              hasPreviousPage: false 
            }
          };
        }
        
        return response as PaginatedResponse<Appointment>;
      },
      providesTags: (result: PaginatedResponse<Appointment> | undefined) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Appointment' as const, id })),
              { type: 'Appointment', id: 'INQUIRIES' },
            ]
          : [{ type: 'Appointment', id: 'INQUIRIES' }],
    }),
    
    getAppointmentById: builder.query<{ appointment: Appointment }, string>({
      query: (id: string) => `appointments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Appointment', id }],
    }),
    
    createAppointment: builder.mutation<Appointment | Appointment[], CreateAppointmentRequest | CreateAppointmentRequest[]>({
      query: (request) => ({
        url: 'appointments',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    
    updateAppointment: builder.mutation<Appointment, { id: string; appointment: UpdateAppointmentRequest }>({
      query: ({ id, appointment }) => ({
        url: `appointments/${id}`,
        method: 'PUT',
        body: appointment,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    
    deleteAppointment: builder.mutation<void, string>({
      query: (id) => ({
        url: `appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetInquiriesQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentApi; 