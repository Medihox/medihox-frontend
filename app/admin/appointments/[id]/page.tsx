"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ImageIcon, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { useGetAppointmentByIdQuery } from "@/lib/redux/services/appointmentApi";

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data, isLoading, error } = useGetAppointmentByIdQuery(appointmentId);
  const appointment = data?.appointment;

  const handlePatientClick = () => {
    if (appointment?.patient?.id) {
      router.push(`/admin/patients/${appointment.patient.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="animate-pulse">Loading appointment details...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="text-red-500">Appointment not found or error loading data</div>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Extract time from ISO date string
  const appointmentTime = appointment?.date 
    ? format(new Date(appointment.date), "h:mm a") 
    : "N/A";
  
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
                      {appointment.patient?.name}
                    </span>
                    <Badge 
                      className={`ml-2 ${appointment.patient?.converted ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {appointment.patient?.converted ? "Converted" : "Not Converted"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{appointment.patient?.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{appointment.patient?.phoneNumber}</span>
                    </div>
                    {(appointment.patient?.city || appointment.patient?.country) && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {[
                            appointment.patient?.city,
                            appointment.patient?.country
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
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
                        {appointment.date && format(new Date(appointment.date), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appointmentTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="font-medium mr-2">Source:</span>
                      <span>{appointment.source}</span>
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

          {/* Before Images */}
          {appointment.beforeImages && appointment.beforeImages.length > 0 && (
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Before Treatment Images
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {appointment.beforeImages.map((image: string, index: number) => (
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

          {/* After Images */}
          {appointment.afterImages && appointment.afterImages.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                After Treatment Images
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {appointment.afterImages.map((image: string, index: number) => (
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