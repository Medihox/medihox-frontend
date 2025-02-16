"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ImageIcon, User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";

interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  converted: boolean;
  createdAt: string;
}

interface Appointment {
  id: string;
  patient: Patient;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status: string;
  beforeTreatmentImages?: string[];
  afterTreatmentImages?: string[];
  notes?: string;
  createdAt: string;
}

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAppointment: Appointment = {
      id: params.id as string,
      patient: {
        id: "p1",
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "+1234567890",
        address: "123 Main St",
        city: "New York",
        converted: true,
        createdAt: "2024-01-15T10:00:00Z"
      },
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
      notes: "Regular checkup completed successfully. Patient showing good progress.",
      createdAt: "2024-04-15T10:00:00Z"
    };

    setAppointment(mockAppointment);
    setLoading(false);
  }, [params.id]);

  const handlePatientClick = () => {
    if (appointment?.patient.id) {
      router.push(`/admin/patients/${appointment.patient.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="text-red-500">Appointment not found</div>
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
          Back
        </Button>

        <div className="grid gap-6">
          {/* Patient Information Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span 
                      className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                      onClick={handlePatientClick}
                    >
                      {appointment.patient.name}
                    </span>
                    <Badge 
                      className={`ml-2 ${appointment.patient.converted ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {appointment.patient.converted ? "Converted" : "Not Converted"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{appointment.patient.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{appointment.patient.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{appointment.patient.address}, {appointment.patient.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {appointment.service}
                  </h1>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Appointment Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {format(new Date(appointment.appointmentDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Notes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Treatment Images */}
          {(appointment.beforeTreatmentImages || appointment.afterTreatmentImages) && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="p-6">
                {appointment.beforeTreatmentImages && (
                  <div className="space-y-4 mb-8">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Before Treatment Images
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {appointment.beforeTreatmentImages.map((image, index) => (
                        <div
                          key={`before-${index}`}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <Image
                            src={image}
                            alt={`Before treatment ${index + 1}`}
                            fill={true}
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {appointment.afterTreatmentImages && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      After Treatment Images
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {appointment.afterTreatmentImages.map((image, index) => (
                        <div
                          key={`after-${index}`}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <Image
                            src={image}
                            alt={`After treatment ${index + 1}`}
                            fill={true}
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-[80vh]">
            <Image
              src={selectedImage}
              alt="Preview"
              fill={true}
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
} 