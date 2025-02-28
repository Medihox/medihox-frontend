"use client";

import { Users, CalendarDays, UserCheck, FileSpreadsheet } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { EventsCard } from '@/components/dashboard/EventsCard';
import { useGetDashboardStatsQuery } from '@/lib/redux/services/dashboardApi';
import { Card } from '@/components/ui/card';

// Skeleton components
const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
      <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
    </div>
  </div>
);

const AnalyticsChartSkeleton = () => (
  <Card className="col-span-2 p-6 border-none bg-white dark:bg-gray-900">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
  </Card>
);

const EventsCardSkeleton = () => (
  <Card className="p-6 bg-purple-200/70 dark:bg-purple-950/30 border-none animate-pulse">
    <div className="h-6 w-48 bg-purple-300 dark:bg-purple-800/50 rounded mb-6"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-purple-300/60 dark:bg-purple-900/40 p-4 rounded-lg">
          <div className="flex gap-4">
            <div className="w-16">
              <div className="h-6 w-10 mx-auto bg-purple-400/70 dark:bg-purple-800/60 rounded mb-1"></div>
              <div className="h-4 w-14 mx-auto bg-purple-400/50 dark:bg-purple-800/40 rounded"></div>
            </div>
            <div className="flex-grow">
              <div className="h-5 w-3/4 bg-purple-400/70 dark:bg-purple-800/60 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-purple-400/50 dark:bg-purple-800/40 rounded"></div>
            </div>
          </div>
        </div>
      ))}
      <div className="h-4 w-24 bg-purple-400/70 dark:bg-purple-800/60 rounded mt-4"></div>
    </div>
  </Card>
);

export default function AdminDashboard() {
  // Fetch dashboard data from API
  const { data: dashboardData, isLoading, error } = useGetDashboardStatsQuery();
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-red-500 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  // Prepare the data for display when loaded
  const statsCards = !isLoading ? [
    {
      title: "Total Staff",
      value: dashboardData?.totalEmployees.toString() || "0",
      icon: Users,
      details: [
        { label: "Medical", value: "0" },
        { label: "Non-Medical", value: "0" }
      ],
      colorScheme: {
        bg: "bg-purple-200 dark:bg-purple-950/30",
        iconBg: "bg-purple-100 dark:bg-purple-900/50",
        iconColor: "text-purple-600 dark:text-purple-400"
      },
      href: "/admin/users"
    },
    {
      title: "Total Patients",
      value: dashboardData?.totalPatients.toString() || "0",
      icon: UserCheck,
      details: [
        { label: "New", value: "0" },
        { label: "Converted", value: "0" }
      ],
      colorScheme: {
        bg: "bg-green-200 dark:bg-green-950/30",
        iconBg: "bg-green-100 dark:bg-green-900/50",
        iconColor: "text-green-600 dark:text-green-400"
      },
      href: "/admin/patients"
    },
    {
      title: "Total Enquiries",
      value: dashboardData?.totalEnquiries.toString() || "0",
      icon: FileSpreadsheet,
      details: [
        { label: "This week", value: "0" },
        { label: "This month", value: "0" }
      ],
      colorScheme: {
        bg: "bg-yellow-200 dark:bg-yellow-950/30",
        iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
        iconColor: "text-yellow-600 dark:text-yellow-400"
      },
      href: "/admin/inquiries"
    },
    {
      title: "Total Appointments",
      value: dashboardData?.totalAppointments.toString() || "0",
      icon: CalendarDays,
      details: [
        { label: "Upcoming", value: dashboardData?.upcomingAppointments.length.toString() || "0" },
        { label: "This month", value: "0" }
      ],
      colorScheme: {
        bg: "bg-red-200 dark:bg-red-950/30",
        iconBg: "bg-red-100 dark:bg-red-900/50",
        iconColor: "text-red-600 dark:text-red-400"
      },
      href: "/admin/appointments"
    }
  ] : [];

  // Get data for charts when loaded
  const monthlyData = dashboardData?.lastEightMonthsData || [];
  const upcomingAppointments = dashboardData?.upcomingAppointments || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to MediCare Plus</p>
        </div>

        {/* Stats Cards with Skeleton Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Show skeletons when loading
            [...Array(4)].map((_, index) => (
              <StatCardSkeleton key={index} />
            ))
          ) : (
            // Show actual data when loaded
            <>
              <StatsCard
                title="Total Staff"
                value={dashboardData?.totalEmployees.toString() || "0"}
                icon={Users}
                details={[
                  { label: "Medical", value: "0" },
                  { label: "Non-Medical", value: "0" }
                ]}
                colorScheme={{
                  bg: "bg-purple-200 dark:bg-purple-950/30",
                  iconBg: "bg-purple-100 dark:bg-purple-900/50",
                  iconColor: "text-purple-600 dark:text-purple-400"
                }}
                href="/admin/users"
              />
              <StatsCard
                title="Total Patients"
                value={dashboardData?.totalPatients.toString() || "0"}
                icon={UserCheck}
                details={[
                  { label: "New", value: "0" },
                  { label: "Converted", value: "0" }
                ]}
                colorScheme={{
                  bg: "bg-green-200 dark:bg-green-950/30",
                  iconBg: "bg-green-100 dark:bg-green-900/50",
                  iconColor: "text-green-600 dark:text-green-400"
                }}
                href="/admin/patients"
              />
              <StatsCard
                title="Total Enquiries"
                value={dashboardData?.totalEnquiries.toString() || "0"}
                icon={FileSpreadsheet}
                details={[
                  { label: "This week", value: "0" },
                  { label: "This month", value: "0" }
                ]}
                colorScheme={{
                  bg: "bg-yellow-200 dark:bg-yellow-950/30",
                  iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
                  iconColor: "text-yellow-600 dark:text-yellow-400"
                }}
                href="/admin/inquiries"
              />
              <StatsCard
                title="Total Appointments"
                value={dashboardData?.totalAppointments.toString() || "0"}
                icon={CalendarDays}
                details={[
                  { label: "Upcoming", value: dashboardData?.upcomingAppointments.length.toString() || "0" },
                  { label: "This month", value: "0" }
                ]}
                colorScheme={{
                  bg: "bg-red-200 dark:bg-red-950/30",
                  iconBg: "bg-red-100 dark:bg-red-900/50",
                  iconColor: "text-red-600 dark:text-red-400"
                }}
                href="/admin/appointments"
              />
            </>
          )}
        </div>

        {/* Analytics and Events with Skeleton Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            {isLoading ? (
              <AnalyticsChartSkeleton />
            ) : (
              <AnalyticsChart data={monthlyData} />
            )}
          </div>
          {isLoading ? (
            <EventsCardSkeleton />
          ) : (
            <EventsCard upcomingAppointments={upcomingAppointments} />
          )}
        </div>
      </div>
    </div>
  );
}
