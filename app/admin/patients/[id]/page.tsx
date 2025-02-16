"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status: string;
  beforeTreatmentImages?: string[];
  afterTreatmentImages?: string[];
  notes?: string;
  createdAt: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  converted: boolean;
  appointments: Appointment[];
  createdById: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
  createdAt: string;
}

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is mock data - replace with actual API call
    const mockPatient: Patient = {
      id: params.id as string,
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      address: "123 Main St, New York, USA",
      converted: params.id === "2",
      appointments: [
        {
          id: "a1",
          appointmentDate: "2024-04-15",
          appointmentTime: "10:00",
          service: "Dental Checkup",
          status: "Completed",
          beforeTreatmentImages: [
            "https://picsum.photos/seed/before1/400/400",
            "https://picsum.photos/seed/before2/400/400"
          ],
          afterTreatmentImages: [
            "https://picsum.photos/seed/after1/400/400",
            "https://picsum.photos/seed/after2/400/400"
          ],
          notes: "Regular checkup completed",
          createdAt: "2024-04-15T10:00:00Z"
        },
        {
          id: "a2",
          appointmentDate: "2024-04-20",
          appointmentTime: "14:30",
          service: "Follow-up",
          status: "Scheduled",
          notes: "Follow-up appointment",
          createdAt: "2024-04-15T11:00:00Z"
        }
      ],
      createdById: {
        id: "u1",
        name: "Dr. Smith",
        email: "dr.smith@example.com",
        role: "doctor",
        status: "active",
        createdAt: "2024-01-01T10:00:00Z",
      },
      createdAt: "2024-01-20T10:00:00Z",
    };

    setPatient(mockPatient);
    setLoading(false);
  }, [params.id]);

  const handleAppointmentClick = (appointmentId: string) => {
    router.push(`/admin/appointments/${appointmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="text-red-500">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>

        <div className="grid gap-6">
          {/* Patient Information Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {patient.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Patient ID: {patient.id}
                  </p>
                </div>
                <Badge className={patient.converted ? "bg-green-500" : "bg-red-500"}>
                  {patient.converted ? "Converted" : "Not Converted"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{patient.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{patient.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Additional Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Created on{" "}
                        {format(new Date(patient.createdAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Created By:</span>{" "}
                      {patient.createdById.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments List Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Appointment History
              </h2>
              <div className="space-y-4">
                {patient.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => handleAppointmentClick(appointment.id)}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                          {appointment.service}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(appointment.appointmentDate), "MMMM d, yyyy")}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.appointmentTime}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          appointment.status === "Completed"
                            ? "bg-green-500"
                            : appointment.status === "Scheduled"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 