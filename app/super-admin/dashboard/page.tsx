"use client";

import { Users, Building, Layers, DollarSign, Activity } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { EventsCard } from '@/components/dashboard/EventsCard';
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Calendar, TrendingUp, BarChart2 } from "lucide-react";

const statsCards = [
  {
    title: "Total Clinics",
    value: "250",
    icon: Building,
    details: [
      { label: "Active", value: "200" },
      { label: "Inactive", value: "50" }
    ],
    colorScheme: {
      bg: "bg-blue-200 dark:bg-blue-950/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    href: "/clinics"
  },
  {
    title: "Total Users",
    value: "12,450",
    icon: Users,
    details: [
      { label: "Clinic Owners", value: "1,250" },
      { label: "Staff", value: "11,200" }
    ],
    colorScheme: {
      bg: "bg-green-200 dark:bg-green-950/30",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400"
    },
    href: "/users"
  },
  {
    title: "Revenue",
    value: "₹50,00,000",
    icon: DollarSign,
    details: [
      { label: "This Month", value: "₹10,00,000" },
      { label: "This Year", value: "₹50,00,000" }
    ],
    colorScheme: {
      bg: "bg-yellow-200 dark:bg-yellow-950/30",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    href: "/revenue"
  },
  {
    title: "System Activity",
    value: "99.99%",
    icon: Activity,
    details: [
      { label: "Incidents", value: "2" },
      { label: "Resolved", value: "2" }
    ],
    colorScheme: {
      bg: "bg-red-200 dark:bg-red-950/30",
      iconBg: "bg-red-100 dark:bg-red-900/50",
      iconColor: "text-red-600 dark:text-red-400"
    },
    href: "/activity"
  }
];

// Update the analytics data structure to match expected type
const analyticsData = [
  { month: "Jan", appointments: 60, enquiries: 25 },
  { month: "Feb", appointments: 75, enquiries: 30 },
  { month: "Mar", appointments: 65, enquiries: 28 },
  { month: "Apr", appointments: 90, enquiries: 40 },
  { month: "May", appointments: 85, enquiries: 38 },
  { month: "Jun", appointments: 110, enquiries: 45 },
];

// Add dummy data for upcoming appointments
const dummyAppointments = [
  {
    id: "1",
    date: "2023-09-15T10:00:00Z",
    service: "Dental Checkup",
    patient: {
      name: "John Smith",
      email: "john@example.com",
      phoneNumber: "+1234567890"
    }
  },
  {
    id: "2",
    date: "2023-09-16T14:30:00Z",
    service: "Root Canal",
    patient: {
      name: "Emily Johnson",
      email: "emily@example.com",
      phoneNumber: "+9876543210"
    }
  },
  {
    id: "3",
    date: "2023-09-17T11:15:00Z",
    service: "Teeth Whitening",
    patient: {
      name: "Michael Brown",
      email: "michael@example.com",
      phoneNumber: "+5551234567"
    }
  }
];

export default function SuperAdminDashboard() {
  const [timeRange, setTimeRange] = useState<string>("month");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Super Admin Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage the entire SaaS Clinic Management System</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Super Admin Dashboard
          </h1>
          <div className="w-full max-w-[200px]">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard key={index} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <AnalyticsCard 
            title="Total Appointments" 
            value="12,328" 
            trend="+12%" 
            icon={Calendar} 
            trendIsUp={true} 
          />
          <AnalyticsCard 
            title="Total Patients" 
            value="5,483" 
            trend="+8%" 
            icon={Users} 
            trendIsUp={true} 
          />
          <AnalyticsCard 
            title="Revenue" 
            value="₹45,28,900" 
            trend="+22%" 
            icon={TrendingUp} 
            trendIsUp={true} 
          />
          <AnalyticsCard 
            title="Conversion Rate" 
            value="68.3%" 
            trend="+5%" 
            icon={BarChart2} 
            trendIsUp={true} 
          />
        </div>

        {/* Analytics and Events - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <AnalyticsChart data={analyticsData} />
          </div>
          <EventsCard upcomingAppointments={dummyAppointments} />
        </div>
      </div>
    </div>
  );
}
