"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface UpcomingAppointment {
  id: string;
  date: string;
  service: string;
  patient?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

interface EventsCardProps {
  upcomingAppointments: UpcomingAppointment[];
}

export function EventsCard({ upcomingAppointments }: EventsCardProps) {
  return (
    <Card className="p-6 bg-purple-200 dark:bg-purple-950/30 border-none transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Appointments</h3>
      <div className="space-y-4">
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No upcoming appointments scheduled.
          </p>
        ) : (
          upcomingAppointments.map((appointment) => (
            <Link
              key={appointment.id}
              href={`/admin/appointments/${appointment.id}`}
              className="block"
            >
              <div className="bg-purple-300/60 dark:bg-purple-950/50 p-4 rounded-lg shadow-sm cursor-pointer transition hover:bg-opacity-80">
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {format(new Date(appointment.date), "MMMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {appointment.patient?.name || "Unknown Patient"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.service}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
        <Link
          href="/admin/appointments"
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mt-2 block"
          onClick={(e) => {
            // You can add analytics tracking or any other functionality here
            console.log("Navigating to appointments page");
          }}
        >
          View more →
        </Link>
      </div>
    </Card>
  );
}
