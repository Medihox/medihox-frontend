"use client";

import { Users, CalendarDays, UserCheck, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { EventsCard } from '@/components/dashboard/EventsCard';

const statsCards = [
  {
    title: "Total Staff",
    value: "100",
    icon: Users,
    details: [
      { label: "Medical", value: "60" },
      { label: "Non-Medical", value: "40" }
    ],
    colorScheme: {
      bg: "bg-purple-200 dark:bg-purple-950/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  },
  {
    title: "Active Patients",
    value: "7,658",
    icon: UserCheck,
    details: [
      { label: "Left", value: "21" },
      { label: "New", value: "54" }
    ],
    colorScheme: {
      bg: "bg-green-200 dark:bg-green-950/30",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400"
    }
  },
  {
    title: "Collection",
    value: "₹1,00,000",
    icon: DollarSign,
    details: [
      { label: "This month", value: "₹60,000" },
      { label: "This session", value: "₹40,000" }
    ],
    colorScheme: {
      bg: "bg-yellow-200 dark:bg-yellow-950/30",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    }
  },
  {
    title: "Patient Attendance",
    value: "20",
    icon: CalendarDays,
    details: [
      { label: "Present", value: "6" },
      { label: "Absent", value: "14" }
    ],
    colorScheme: {
      bg: "bg-red-200 dark:bg-red-950/30",
      iconBg: "bg-red-100 dark:bg-red-900/50",
      iconColor: "text-red-600 dark:text-red-400"
    }
  }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to MediCare Plus</p>
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
