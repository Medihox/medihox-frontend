"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useGetPatientByIdQuery,
  useDeletePatientMutation 
} from "@/lib/redux/services/patientApi";
import { 
  Phone, Mail, MapPin, Calendar, User, 
  Check, X, ArrowLeft, Trash2, Pencil, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusColor = (status: string) => {
  switch(status) {
    case 'CONVERTED':
      return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
    case 'ACTIVE':
      return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    case 'INACTIVE':
      return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
    case 'DELETED':
      return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    default:
      return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
  }
};

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const { data: patient, isLoading, error } = useGetPatientByIdQuery(patientId);
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (error) {
      showErrorToast("Error loading patient details");
      router.push("/admin/patients");
    }
  }, [error, router]);

  const handleEdit = () => {
    router.push(`/admin/patients/edit/${patientId}`);
  };

  const confirmDelete = async () => {
    try {
      await deletePatient(patientId).unwrap();
      showSuccessToast("Patient deleted successfully");
      router.push("/admin/patients");
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to delete patient");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-36 mb-4" />
          
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex-1">
                  <Skeleton className="h-7 w-64 mb-2" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-32" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-48" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-64" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-80" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-gray-700 dark:text-gray-300 mb-4">Patient not found</div>
        <Button onClick={() => router.push("/admin/patients")}>
          Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 dark:text-gray-300 mb-4"
          onClick={() => router.push("/admin/patients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Patient Details
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2" 
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {patient.name}
                </h2>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>{patient.phoneNumber}</span>
              </div>
              
              {patient.whatsappNumber && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span>WhatsApp: {patient.whatsappNumber}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>{patient.email}</span>
              </div>
              
              {patient.address && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Patient Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created By
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {patient.createdBy?.name || 'Unknown'}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created At
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatDate(patient.createdAt)}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatDate(patient.updatedAt)}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </div>
                <div className="flex items-center gap-2">
                  {patient.status === "CONVERTED" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : patient.status === "ACTIVE" ? (
                    <Check className="h-5 w-5 text-blue-500" />
                  ) : patient.status === "INACTIVE" ? (
                    <X className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {patient.name}'s
              record and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 