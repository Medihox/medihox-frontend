"use client";

import { Card } from "@/components/ui/card";

interface AppointmentStatsProps {
  stats: {
    totalAppointments: number;
    scheduledAppointments: number;
    completedAppointments: number;
    conversionRate: number;
    sourceDistribution: {
      WhatsApp: number;
      Phone: number;
      Facebook: number;
      Website: number;
    };
  };
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="p-6 bg-purple-50 dark:bg-purple-950/30 border-none">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-purple-500 dark:border-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{stats.totalAppointments.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-green-50 dark:bg-green-950/30 border-none">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-green-500 dark:border-green-400 border-l-transparent rotate-45" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{stats.scheduledAppointments.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-red-50 dark:bg-red-950/30 border-none">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-red-500 dark:border-red-400 border-l-transparent" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{stats.completedAppointments.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}