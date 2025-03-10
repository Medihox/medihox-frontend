"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Calendar, Clock, User, Phone, Mail, FileText, 
  Clipboard, Tag, MessageCircle, Edit, Trash2, AlertCircle,
  ExternalLink
} from "lucide-react";
import { useGetAppointmentByIdQuery, useUpdateAppointmentMutation, useDeleteAppointmentMutation } from "@/lib/redux/services/appointmentApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { InquiryDialog } from "@/components/inquiries/InquiryDialog";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to get status color based on status name
const getStatusColor = (status: string) => {
  // Convert to lowercase for easier matching
  const statusLower = status.toLowerCase();
  
  // Handle common status types by keywords in their names
  if (statusLower.includes('complete') || statusLower.includes('done') || statusLower.includes('finish')) {
    return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20";
  }
  
  if (statusLower.includes('cancel') || statusLower.includes('reject') || statusLower.includes('decline')) {
    return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
  }
  
  if (statusLower.includes('enquir') || statusLower.includes('inquiry') || statusLower.includes('enquiry')) {
    return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20";
  }
  
  if (statusLower.includes('follow') || statusLower.includes('pending')) {
    return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
  }
  
  if (statusLower.includes('schedul') || statusLower.includes('book') || statusLower.includes('confirm')) {
    return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
  }
  
  if (statusLower.includes('cost') || statusLower.includes('issue') || statusLower.includes('problem')) {
    return "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20";
  }
  
  // If no specific match, use a neutral color based on the first character of the status
  const charCode = status.charCodeAt(0) % 6;
  
  switch (charCode) {
    case 0: return "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20";
    case 1: return "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20";
    case 2: return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    case 3: return "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 border-violet-200 dark:border-violet-500/20";
    case 4: return "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20";
    case 5: return "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
    default: return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-500/20";
  }
};

// Helper function to get source icon
const getSourceIcon = (source: string) => {
  switch (source) {
    case "WEBSITE":
      return "🌐";
    case "DIRECT_CALL":
      return "📞";
    case "FACEBOOK":
      return "👤";
    case "INSTAGRAM":
      return "📸";
    case "REFERRAL":
      return "👥";
    case "WALK_IN":
      return "🚶";
    default:
      return "📱";
  }
};

export default function InquiryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch inquiry details using the appointment endpoint
  // Note: We're using the shared endpoint to get the full details, as the data structure is the same
  const { data, isLoading, error } = useGetAppointmentByIdQuery(inquiryId);
  const inquiry = data?.appointment;
  
  // API mutations
  const [updateInquiry] = useUpdateAppointmentMutation();
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteAppointmentMutation();
  
  // Handle going back to the inquiries list
  const handleBack = () => {
    router.push('/admin/inquiries');
  };
  
  // Handle opening the edit dialog
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  // Handle inquiry deletion
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await deleteInquiry(inquiryId).unwrap();
      toast.success("Inquiry deleted successfully");
      router.push('/admin/inquiries');
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to delete inquiry");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    if (!inquiry?.patient?.phoneNumber) {
      toast.error("No phone number available");
      return;
    }
    
    // Format phone number
    let phoneNumber = inquiry.patient.phoneNumber.replace(/[^\d+]/g, '');
    
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
    const message = `Hello ${inquiry.patient?.name || 'there'}! I'm reaching out regarding your inquiry about ${inquiry.service || 'our services'}.`;
    
    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Error Loading Inquiry</h2>
        <p className="text-gray-500 mb-4">
          {getErrorMessage(error) || "There was an error loading the inquiry details."}
        </p>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inquiries
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
          Back to Inquiries
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold flex items-center">
              Inquiry from {inquiry?.patient?.name || 'Unknown Patient'}
              <Badge 
                variant="outline" 
                className={`ml-3 ${getStatusColor(inquiry?.status || 'unknown')} border`}
              >
                {inquiry?.status || 'Unknown Status'}
              </Badge>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {inquiry?.service ? `Inquiry about ${inquiry.service}` : 'Service not specified'} • 
              {inquiry?.createdAt ? ` Created on ${formatDate(inquiry.createdAt)}` : ' Creation date unknown'}
            </p>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inquiry Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Details</CardTitle>
              <CardDescription>
                Basic information about this inquiry
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
                        {inquiry?.service || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-base">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(inquiry?.status || 'unknown')} border`}
                        >
                          {inquiry?.status || 'Unknown'}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</p>
                      <p className="text-base flex items-center gap-2">
                        <span>{getSourceIcon(inquiry?.source || '')}</span>
                        <span>{inquiry?.source || 'Not specified'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                      <p className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {inquiry?.createdAt ? formatDate(inquiry.createdAt) : 'Not available'}
                      </p>
                    </div>
                  </div>
                  
                  {inquiry?.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{inquiry.notes}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div>
                {inquiry?.date && (
                  <span className="text-xs text-gray-500">
                    Last updated: {formatDate(inquiry.date)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading || isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Sidebar / Patient Info */}
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
                        {inquiry?.patient?.name ? inquiry.patient.name.charAt(0) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{inquiry?.patient?.name || 'Unknown Patient'}</p>
                      {inquiry?.patient?.city && (
                        <p className="text-sm text-gray-500">{inquiry.patient.city}</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    {inquiry?.patient?.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <a href={`mailto:${inquiry.patient.email}`} className="text-sm text-blue-600 hover:underline">
                          {inquiry.patient.email}
                        </a>
                      </div>
                    )}
                    
                    {inquiry?.patient?.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <a href={`tel:${inquiry.patient.phoneNumber}`} className="text-sm">
                          {inquiry.patient.phoneNumber}
                        </a>
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
                  disabled={isLoading || !inquiry?.patient?.phoneNumber}
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
                {inquiry?.patient?.email && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = `mailto:${inquiry.patient?.email}`}
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
      <InquiryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={inquiry}
        inquiryId={inquiryId}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this inquiry. This action cannot be undone.
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
    </div>
  );
} 