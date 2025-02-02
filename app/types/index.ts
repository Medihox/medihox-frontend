export interface Inquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  source: 'WhatsApp' | 'Phone' | 'Facebook' | 'Website';
  comments: string;
  services: string;
  status: 'Active' | 'Inactive' | 'Following';
  createdAt: string;
}

export type InquiryCSV = Omit<Inquiry, 'id'>;

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientMobile: string;
  appointmentDate: string;
  appointmentTime: string;
  doctor: string;
  service: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  notes: string;
  createdAt: string;
}

export interface DashboardStats {
  totalInquiries: number;
  activeInquiries: number;
  totalAppointments: number;
  upcomingAppointments: number;
  conversionRate: number;
  sourceDistribution: {
    WhatsApp: number;
    Phone: number;
    Facebook: number;
    Website: number;
  };
}

export type Role = 'admin' | 'doctor' | 'receptionist' | 'staff';

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Permissions {
  users: Permission;
  appointments: Permission;
  inquiries: Permission;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permissions;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permissions;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}