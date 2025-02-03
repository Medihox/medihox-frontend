export type UserType = 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  clinicId?: string; // Only for ADMIN
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  subscription: {
    plan: 'FREE' | 'BASIC' | 'PRO';
    status: 'ACTIVE' | 'EXPIRED';
    expiresAt: string;
  };
  stats: {
    totalPatients: number;
    totalAppointments: number;
    totalRevenue: number;
  };
}

export interface DashboardStats {
  totalClinics?: number; // Only for SUPER_ADMIN
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
  recentAppointments: Array<{
    id: string;
    patientName: string;
    date: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  }>;
}