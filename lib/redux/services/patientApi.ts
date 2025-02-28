import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';
import { RootState } from '../store';

// Interfaces based on actual API response
export interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  address?: string | null;
  status: "ACTIVE" | "INACTIVE" | "CONVERTED" | "DELETED";
  createdById: string;
  updatedById?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  // Optional fields that might be added later
  city?: string;
  country?: string;
  beforeTreatmentImages?: string[];
  afterTreatmentImages?: string[];
}

// Request types
export interface CreatePatientRequest {
  name: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  address?: string;
  status?: "ACTIVE" | "INACTIVE" | "CONVERTED" | "DELETED";
  city?: string;
  country?: string;
  beforeTreatmentImages?: File[];
  afterTreatmentImages?: File[];
}

export interface UpdatePatientRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: "ACTIVE" | "INACTIVE" | "CONVERTED" | "DELETED";
  beforeTreatmentImages?: File[];
  afterTreatmentImages?: File[];
}

export interface GetPatientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  timeRange?: 'all' | 'today' | 'week' | 'month';
  status?: 'all' | 'ACTIVE' | 'INACTIVE' | 'CONVERTED' | 'DELETED';
  city?: string;
  country?: string;
  createdBy?: string;
}

// Updated to match the actual API response structure
export interface PatientsResponse {
  data: Patient[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const patientApi = createApi({
  reducerPath: 'patientApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Patient'],
  endpoints: (builder) => ({
    getPatients: builder.query<PatientsResponse, GetPatientsParams>({
      query: (params) => {
        // Build query string from params
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.timeRange && params.timeRange !== 'all') queryParams.append('timeRange', params.timeRange);
        if (params.status && params.status !== 'all') {
          queryParams.append('status', params.status);
        }
        if (params.city) queryParams.append('city', params.city);
        if (params.country) queryParams.append('country', params.country);
        if (params.createdBy) queryParams.append('createdBy', params.createdBy);
        
        return `patients?${queryParams.toString()}`;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Patient' as const, id })),
              { type: 'Patient', id: 'LIST' }
            ]
          : [{ type: 'Patient', id: 'LIST' }],
    }),
    
    getPatientById: builder.query<Patient, string>({
      query: (id) => `patients/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),
    
    createPatient: builder.mutation<Patient, CreatePatientRequest>({
      query: (patient) => {
        // For debugging - log the data being sent
        console.log("Create patient data:", patient);
        
        // Use JSON instead of FormData to be consistent with the update method
        // Only use FormData if actually uploading files
        if (patient.beforeTreatmentImages?.length || patient.afterTreatmentImages?.length) {
          // If we have images, use FormData
          const formData = new FormData();
          
          // Add all patient data fields to formData
          Object.entries(patient).forEach(([key, value]) => {
            if (key !== 'beforeTreatmentImages' && key !== 'afterTreatmentImages') {
              formData.append(key, value !== undefined ? value.toString() : '');
            }
          });
          
          // Add image files if present
          if (patient.beforeTreatmentImages?.length) {
            Array.from(patient.beforeTreatmentImages).forEach((file) => {
              formData.append(`beforeTreatmentImages`, file);
            });
          }
          
          if (patient.afterTreatmentImages?.length) {
            Array.from(patient.afterTreatmentImages).forEach((file) => {
              formData.append(`afterTreatmentImages`, file);
            });
          }
          
          return {
            url: 'patients',
            method: 'POST',
            body: formData,
            formData: true,
          };
        } else {
          // If no images, use regular JSON
          return {
            url: 'patients',
            method: 'POST',
            body: patient,
          };
        }
      },
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),
    
    updatePatient: builder.mutation<Patient, { id: string; patient: UpdatePatientRequest }>({
      query: ({ id, patient }) => {
        // For debugging - log the data being sent
        console.log("Update patient data:", patient);
        
        // Use JSON instead of FormData
        return {
          url: `patients/${id}`,
          method: 'PUT',
          body: patient, // Send as JSON directly
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
      ],
    }),
    
    deletePatient: builder.mutation<void, string>({
      query: (id) => ({
        url: `patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi; 