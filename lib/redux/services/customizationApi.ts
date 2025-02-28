import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

// Entity interfaces
export interface StatusEntity {
  id: string;
  name: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceEntity {
  id: string;
  name: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateEntityRequest {
  name: string;
}

export interface UpdateEntityRequest {
  name: string;
}

export const customizationApi = createApi({
  reducerPath: 'customizationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Status', 'Service'],
  endpoints: (builder) => ({
    // Status endpoints
    getAllStatus: builder.query<StatusEntity[], void>({
      query: () => 'custom-settings/status',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Status' as const, id })),
              { type: 'Status', id: 'LIST' }
            ]
          : [{ type: 'Status', id: 'LIST' }],
    }),
    
    getStatusById: builder.query<StatusEntity, string>({
      query: (id) => `custom-settings/status/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Status', id }],
    }),
    
    createStatus: builder.mutation<StatusEntity, CreateEntityRequest>({
      query: (status) => ({
        url: 'custom-settings/status',
        method: 'POST',
        body: status,
      }),
      invalidatesTags: [{ type: 'Status', id: 'LIST' }],
    }),
    
    updateStatus: builder.mutation<StatusEntity, { id: string; status: UpdateEntityRequest }>({
      query: ({ id, status }) => ({
        url: `custom-settings/status/${id}`,
        method: 'PUT',
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Status', id },
        { type: 'Status', id: 'LIST' },
      ],
    }),
    
    deleteStatus: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `custom-settings/status/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Status', id: 'LIST' }],
    }),
    
    // Service endpoints
    getAllServices: builder.query<ServiceEntity[], void>({
      query: () => 'custom-settings/service',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Service' as const, id })),
              { type: 'Service', id: 'LIST' }
            ]
          : [{ type: 'Service', id: 'LIST' }],
    }),
    
    getServiceById: builder.query<ServiceEntity, string>({
      query: (id) => `custom-settings/service/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Service', id }],
    }),
    
    createService: builder.mutation<ServiceEntity, CreateEntityRequest>({
      query: (service) => ({
        url: 'custom-settings/service',
        method: 'POST',
        body: service,
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    
    updateService: builder.mutation<ServiceEntity, { id: string; service: UpdateEntityRequest }>({
      query: ({ id, service }) => ({
        url: `custom-settings/service/${id}`,
        method: 'PUT',
        body: service,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),
    
    deleteService: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `custom-settings/service/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllStatusQuery,
  useGetStatusByIdQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = customizationApi; 