import { Card } from "@/components/ui/card";
import Link from "next/link";

const upcomingAppointments = [
  {
    date: "15",
    month: "Feb",
    patientName: "John Doe",
    time: "10:30 AM",
    doctor: "Dr. Smith",
  },
  {
    date: "16",
    month: "Feb",
    patientName: "Jane Doe",
    time: "2:00 PM",
    doctor: "Dr. Emily Johnson",
  },
];

export function EventsCard() {
  return (
    <Card className="p-6 bg-purple-200 dark:bg-purple-950/30 border-none transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Appointments</h3>
      <div className="space-y-4">
        {upcomingAppointments.map((appointment, index) => (
          <Link
            key={index}
            href={`/admin/appointments`}
            className="block"
          >
            <div className="bg-purple-300/60 dark:bg-purple-950/50 p-4 rounded-lg shadow-sm cursor-pointer transition hover:bg-opacity-80">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {appointment.date}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.month}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">{appointment.patientName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.time} • {appointment.doctor}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        <Link
          href="/appointments"
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mt-2 block"
        >
          View more →
        </Link>
      </div>
    </Card>
  );
}
