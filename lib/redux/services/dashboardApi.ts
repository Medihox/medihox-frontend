import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

// Interfaces for the dashboard API response
export interface DashboardStats {
  totalEmployees: number;
  totalPatients: number;
  totalEnquiries: number;
  totalAppointments: number;
  upcomingAppointments: UpcomingAppointment[];
  lastEightMonthsData: MonthlyData[];
}

export interface UpcomingAppointment {
  id: string;
  patientId: string;
  source: string;
  notes: string;
  date: string;
  beforeImages: string[];
  afterImages: string[];
  createdById: string;
  updatedById: string;
  status: string;
  service: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export interface MonthlyData {
  month: string;
  appointments: number;
  enquiries: number;
}

// Create the API with endpoints
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard',
    }),
  }),
});

// Export hooks for using the API
export const { useGetDashboardStatsQuery } = dashboardApi; 