import { Appointment } from '@/app/types';
import { Clinic, DashboardStats, User } from './types';

export const dummyUser: User = {
  id: '1',
  email: 'admin@clinic.com',
  name: 'Admin',
  userType: 'ADMIN',
  clinicId: '1',
};

export const dummySuperAdmin: User = {
  id: '2',
  email: 'super@clinic.com',
  name: 'Super Admin',
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

export const dummyAppointments: Appointment[] = [
  {
    "id": "1",
    "patient": {
      "id": "p1",
      "name": "Amit Sharma",
      "email": "amit.sharma@example.com",
      "phoneNumber": "9876543210",
      "converted": false,
      "createdAt": "2023-01-01T00:00:00Z",
      createdById: {
        id: 'S1',
        name: 'Dr. Talwar',
        email: 'dr.talwar@example.com',
        role: 'doctor',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z'
      },
    },
    "appointmentDate": "2024-02-15",
    "appointmentTime": "09:30",
    "service": "General Checkup",
    "status": "Scheduled",
    "source": "Website",
    "createdBy": {
      "id": "S1",
      "name": "Dr. Talwar",
      "email": "dr.talwar@example.com",
      "role": "doctor",
      "status": "active",
      "createdAt": "2023-01-01T00:00:00Z"
    },
    "createdAt": "2024-02-10T09:00:00Z",
    "notes": ""
  },
  {
    "id": "2",
    "patient": {
      "id": "p2",
      "name": "Priya Verma",
      "email": "priya.verma@example.com",
      "phoneNumber": "8765432109",
      "converted": true,
      "createdAt": "2023-01-01T00:00:00Z",
      createdById: {
        id: 'S1',
        name: 'Dr. Talwar',
        email: 'dr.talwar@example.com',
        role: 'doctor',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z'
      },
    },
    "appointmentDate": "2024-02-16",
    "appointmentTime": "11:00",
    "service": "Dental Cleaning",
    "status": "Completed",
    "source": "Walk-in",
    "createdAt": "2023-01-01T00:00:00Z",
    "createdBy": {
      id: 'S1',
      name: 'Dr. Talwar',
      email: 'dr.talwar@example.com',
      role: 'doctor',
      status: 'active',
      createdAt: '2023-01-01T00:00:00Z'
    },
    "notes": ""
  }
]
