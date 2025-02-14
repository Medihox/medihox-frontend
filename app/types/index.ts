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
  patient: Patient;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status:  'Scheduled' | 'Enquiry' | 'Completed' | 'Cancelled';
  source: string;
  createdBy: User;
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
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Patient {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  city?: string;
  country?: string;
  converted?: boolean;
  createdById: User;
  createdAt: string;
};