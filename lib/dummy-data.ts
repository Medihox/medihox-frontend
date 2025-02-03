import { Clinic, DashboardStats, User } from './types';

export const dummyUser: User = {
  id: '1',
  email: 'admin@clinic.com',
  name: 'John Doe',
  userType: 'ADMIN',
  clinicId: '1',
};

export const dummySuperAdmin: User = {
  id: '2',
  email: 'super@clinic.com',
  name: 'Jane Smith',
  userType: 'SUPER_ADMIN',
};

export const dummyClinics: Clinic[] = [
  {
    id: '1',
    name: 'Main Street Clinic',
    address: '123 Main St, City',
    subscription: {
      plan: 'PRO',
      status: 'ACTIVE',
      expiresAt: '2024-12-31',
    },
    stats: {
      totalPatients: 1200,
      totalAppointments: 3500,
      totalRevenue: 150000,
    },
  },
  {
    id: '2',
    name: 'Central Healthcare',
    address: '456 Oak Ave, Town',
    subscription: {
      plan: 'BASIC',
      status: 'ACTIVE',
      expiresAt: '2024-10-15',
    },
    stats: {
      totalPatients: 800,
      totalAppointments: 2200,
      totalRevenue: 95000,
    },
  },
];

export const dummyStats: DashboardStats = {
  totalClinics: 25,
  totalPatients: 15000,
  totalAppointments: 45000,
  totalRevenue: 2500000,
  recentAppointments: [
    {
      id: '1',
      patientName: 'Alice Johnson',
      date: '2024-03-20T10:00:00',
      status: 'SCHEDULED',
    },
    {
      id: '2',
      patientName: 'Bob Wilson',
      date: '2024-03-19T14:30:00',
      status: 'COMPLETED',
    },
    {
      id: '3',
      patientName: 'Carol Brown',
      date: '2024-03-19T09:15:00',
      status: 'CANCELLED',
    },
  ],
};