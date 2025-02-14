"use client";

import { Users, Building, Layers, DollarSign, Activity } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { EventsCard } from '@/components/dashboard/EventsCard';

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
    }
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
    }
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
    }
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
    }
  }
];

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Super Admin Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage the entire SaaS Clinic Management System</p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard key={index} {...card} />
          ))}
        </div>

        {/* Analytics and Events - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
          <EventsCard />
        </div>
      </div>
    </div>
  );
}
