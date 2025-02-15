"use client";

import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

const appointments = [
  {
    service: "General Checkup",
    total: 174890,
    scheduled: 21060,
    completed: 174680,
  },
  {
    service: "Dental Care",
    total: 174890,
    scheduled: 21060,
    completed: 174680,
  },
  {
    service: "Eye Care",
    total: 174890,
    scheduled: 21060,
    completed: 174680,
  },
  {
    service: "Cardiology",
    total: 174890,
    scheduled: 21060,
    completed: 174680,
  },
  {
    service: "Orthopedics",
    total: 174890,
    scheduled: 21060,
    completed: 174680,
  },
];

export function AppointmentTable() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-900 border-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service-wise Appointments</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Service</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Total</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Completed</th>
              <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Details</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-purple-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{appointment.service}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-sm text-gray-900 dark:text-white">
                  ₹{appointment.total.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-sm text-gray-900 dark:text-white">
                  ₹{appointment.scheduled.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-sm text-gray-900 dark:text-white">
                  ₹{appointment.completed.toLocaleString()}
                </td>
                <td className="text-center py-4 px-4">
                  <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}