"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar, Clock, ImageIcon, Mail, Phone, MapPin, 
  FileText, AlertCircle, CheckCircle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { useGetAppointmentByIdQuery, useDeleteAppointmentMutation } from "@/lib/redux/services/appointmentApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { ConvertedDialog } from "@/components/converted/ConvertedDialog";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Helper function to get the appropriate color for a status badge
const getStatusColor = (status: string) => {
  status = status.toLowerCase();
  
  if (status.includes('complete') || status.includes('done') || status.includes('convert')) {
    return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800";
  }
  
  if (status.includes('cancel') || status.includes('decline') || status.includes('reject')) {
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800";
  }
  
  if (status.includes('schedule') || status.includes('confirm') || status.includes('upcoming')) {
    return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800";
  }
  
  if (status.includes('pending') || status.includes('wait')) {
    return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800";
  }
  
  // Default color
  return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-800";
};

// Helper function to get an icon for the source
const getSourceIcon = (source: string) => {
  switch (source?.toLowerCase()) {
    case 'website':
      return <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M12 3a15 15 0 014 10 15 15 0 01-4 10z"/></svg>;
    case 'whatsapp':
      return <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
    case 'phone':
    case 'direct_call':
      return <Phone className="h-4 w-4 text-gray-400" />;
    case 'email':
      return <Mail className="h-4 w-4 text-gray-400" />;
    case 'facebook':
      return <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    case 'instagram':
      return <svg className="h-4 w-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'referral':
      return <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
    case 'walk_in':
      return <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>;
    default:
      return <FileText className="h-4 w-4 text-gray-400" />;
  }
};

// Format date for display
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export default function ConvertedDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // API requests
  const { data, isLoading, error } = useGetAppointmentByIdQuery(appointmentId);
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();
  
  const converted = data?.appointment;

  // Handle navigation to patient page
  const handlePatientClick = () => {
    if (converted?.patient?.id) {
      router.push(`/admin/patients/${converted.patient.id}`);
    }
  };

  // Handle going back to the converted list
  const handleBack = () => {
    router.push('/admin/converted');
  };
  
  // Handle opening the edit dialog
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  // Handle converted record deletion
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await deleteAppointment(appointmentId).unwrap();
      toast.success("Converted record deleted successfully");
      router.push('/admin/converted');
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to delete converted record");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    if (!converted?.patient?.phoneNumber) {
      toast.error("No phone number available");
      return;
    }
    
    // Format phone number
    let phoneNumber = converted.patient.phoneNumber.replace(/[^\d+]/g, '');
    
    // Add country code if needed
    if (!phoneNumber.startsWith('+')) {
      if (phoneNumber.length === 10) {
        phoneNumber = '+91' + phoneNumber;
      } else if (phoneNumber.length > 10) {
        phoneNumber = '+' + phoneNumber;
      } else {
        phoneNumber = '+91' + phoneNumber;
      }
    }
    
    // Create message
    const message = `Hello ${converted.patient?.name || 'there'}! I'm reaching out regarding your treatment for ${converted.service || 'our services'}.`;
    
    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Extract time from ISO date string
  const appointmentTime = converted?.date 
    ? format(new Date(converted.date), "h:mm a") 
    : "N/A";
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Error Loading Converted Record</h2>
        <p className="text-gray-500 mb-4">
          {getErrorMessage(error) || "There was an error loading the converted record details."}
        </p>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Converted Records
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="mb-6">
        <Button
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Converted Records
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold flex items-center">
              {converted?.service || 'Treatment'} for {converted?.patient?.name || 'Unknown Patient'}
              <Badge 
                variant="outline" 
                className={`ml-3 ${getStatusColor(converted?.status || 'unknown')} border`}
              >
                {converted?.status || 'Unknown Status'}
              </Badge>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {converted?.date ? `Treatment date: ${formatDate(converted.date)}` : 'Date not specified'} • 
              {converted?.createdAt ? ` Created on ${formatDate(converted.createdAt)}` : ' Creation date unknown'}
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Converted Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Converted Record Details</CardTitle>
              <CardDescription>
                Basic information about this treatment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</p>
                      <p className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        {converted?.service || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-base">
                        <Badge
                          variant="outline" 
                          className={`${getStatusColor(converted?.status || 'unknown')} border`}
                        >
                          {converted?.status || 'Unknown'}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                      <p className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {converted?.date ? formatDate(converted.date) : 'Not available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                      <p className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {appointmentTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</p>
                      <p className="text-base flex items-center gap-2">
                        <span>{getSourceIcon(converted?.source || '')}</span>
                        <span>{converted?.source || 'Not specified'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                      <p className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {converted?.createdAt ? formatDate(converted.createdAt) : 'Not available'}
                      </p>
                    </div>
                  </div>
                  
                  {converted?.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{converted.notes}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" onClick={handleEdit} disabled={isLoading}>
                Edit Record
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isLoading}
              >
                Delete Record
              </Button>
            </CardFooter>
          </Card>
          
          {/* Treatment Images */}
          {(converted?.beforeImages && converted.beforeImages.length > 0) || 
           (converted?.afterImages && converted.afterImages.length > 0) ? (
            <Card>
              <CardHeader>
                <CardTitle>Treatment Images</CardTitle>
                <CardDescription>
                  Before and after treatment images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {converted?.beforeImages && converted.beforeImages.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-md font-medium flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Before Treatment
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {converted.beforeImages.map((image: string, index: number) => (
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

                {converted?.afterImages && converted.afterImages.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-md font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      After Treatment
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {converted.afterImages.map((image: string, index: number) => (
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
              </CardContent>
            </Card>
          ) : null}
        </div>
        
        {/* Patient Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Contact details for the patient
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 bg-gray-100 dark:bg-gray-800">
                      <AvatarFallback className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {converted?.patient?.name ? converted.patient.name.charAt(0) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p 
                        className="font-medium hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                        onClick={handlePatientClick}
                      >
                        {converted?.patient?.name || 'Unknown Patient'}
                      </p>
                      {converted?.patient?.city && (
                        <p className="text-sm text-gray-500">{converted.patient.city}</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    {converted?.patient?.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <a href={`mailto:${converted.patient.email}`} className="text-sm text-blue-600 hover:underline">
                          {converted.patient.email}
                        </a>
                      </div>
                    )}
                    
                    {converted?.patient?.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <a href={`tel:${converted.patient.phoneNumber}`} className="text-sm">
                          {converted.patient.phoneNumber}
                        </a>
                      </div>
                    )}
                    
                    {(converted?.patient?.city || converted?.patient?.country) && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">
                          {[
                            converted.patient?.city,
                            converted.patient?.country
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full space-y-2">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={handleWhatsAppClick}
                  disabled={isLoading || !converted?.patient?.phoneNumber}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    className="h-4 w-4 fill-current mr-2"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact via WhatsApp
                </Button>
                {converted?.patient?.email && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = `mailto:${converted.patient?.email}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <ConvertedDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        convertedData={converted ? {
          id: converted.id,
          patient: converted.patient ? {
            id: converted.patient.id,
            name: converted.patient.name,
            email: converted.patient.email,
            phoneNumber: converted.patient.phoneNumber,
            city: converted.patient.city || undefined,
            country: converted.patient.country || undefined
          } : undefined,
          patientId: converted.patientId,
          date: converted.date,
          time: converted.time,
          status: converted.status,
          notes: converted.notes,
          service: converted.service,
          source: converted.source,
          createdAt: converted.createdAt,
          beforeImages: converted.beforeImages,
          afterImages: converted.afterImages
        } : undefined}
        onSave={() => {
          toast.success("Converted record updated successfully");
          setIsEditDialogOpen(false);
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this converted record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-[80vh]">
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2 text-white z-10 bg-black bg-opacity-50 hover:bg-opacity-70"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <Image
              src={selectedImage}
              alt="Preview"
              fill={true}
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
} 