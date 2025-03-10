"use client";

import { useState } from "react";
import { Download, FileText, MoreVertical, Pencil, Trash2, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FilterTimeRange, AppointmentStatus } from "@/app/admin/appointments/page";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AppointmentDialog } from "./AppointmentDialog";
import { useGetAppointmentsQuery, useUpdateAppointmentMutation, useDeleteAppointmentMutation } from "@/lib/redux/services/appointmentApi";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import React from "react";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Appointment {
  id: string;
  patient?: {
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
  };
  date: string;
  time?: string;
  service: string;
  status: string;
  source: string;
  notes?: string;
  createdAt: string;
}

// Mock data based on the Appointment interface
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patient: {
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+1234567890",
      city: "New York"
    },
    date: "2024-04-28",
    time: "10:00",
    service: "General Checkup",
    status: "Scheduled",
    source: "Website",
    notes: "Regular checkup",
    createdAt: "2024-04-25T10:00:00Z"
  },
  {
    id: "2",
    patient: {
      name: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "+1234567891",
      city: "Los Angeles"
    },
    date: "2024-04-28",
    time: "11:30",
    service: "Dental Care",
    status: "Completed",
    source: "WhatsApp",
    notes: "Follow-up appointment",
    createdAt: "2024-04-25T11:00:00Z"
  },
  {
    id: "3",
    patient: {
      name: "Alice Johnson",
      email: "alice@example.com",
      phoneNumber: "+1234567892",
      city: "San Francisco"
    },
    date: "2024-04-28",
    time: "14:00",
    service: "Eye Checkup",
    status: "Cancelled",
    source: "Phone",
    notes: "Emergency visit",
    createdAt: "2024-04-25T14:00:00Z"
  },
  {
    id: "4",
    patient: {
      name: "Bob Williams",
      email: "bob@example.com",
      phoneNumber: "+1234567893",
      city: "Chicago"
    },
    date: "2024-04-28",
    time: "15:00",
    service: "Gynecological Checkup",
    status: "Enquired",
    source: "Email",
    notes: "Follow-up visit",
    createdAt: "2024-04-25T15:00:00Z"
  }
];

interface AppointmentsListProps {
  searchQuery: string;
  timeRange: FilterTimeRange;
  statusFilter: AppointmentStatus | "all";
  fromDate?: string;
  toDate?: string;
  showOnlyEnquiries?: boolean;
  onEdit: (appointment: Appointment) => void;
}

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
  
  if (statusLower.includes('wait') || statusLower.includes('processing')) {
    return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20";
  }
  
  if (statusLower.includes('arrived') || statusLower.includes('present')) {
    return "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20";
  }
  
  // If no specific match, use a neutral color based on the first character of the status
  // This creates a semi-random but consistent color for each unique status
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

const getSourceIcon = (source: string) => {
  switch (source) {
    case "WhatsApp":
      return "🟢";
    case "Phone":
      return "📞";
    case "Facebook":
      return "👤";
    case "Website":
      return "🌐";
    default:
      return "📱";
  }
};

export function AppointmentsList({ 
  searchQuery, 
  timeRange, 
  statusFilter,
  fromDate,
  toDate,
  showOnlyEnquiries = false,
  onEdit
}: AppointmentsListProps) {
  const router = useRouter();
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add API hooks
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();
  
  // Directly create API parameters object, bypassing the filters object to simplify
  const apiParams = {
    page,
    pageSize,
    search: searchQuery && searchQuery.trim() !== '' ? searchQuery.trim() : undefined,
    timeRange: timeRange !== 'all' ? timeRange : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    // Only include date parameters when they actually have values
    ...(fromDate && fromDate.trim() !== '' ? { fromDate } : {}),
    ...(toDate && toDate.trim() !== '' ? { toDate } : {}),
    isEnquiry: showOnlyEnquiries || undefined,
  };

  // Add debugging to see what's being sent
  console.log('Sending filters to API:', apiParams);
  
  const { data, isLoading, error } = useGetAppointmentsQuery(apiParams);

  // Extract appointments safely from the response
  const appointmentsData = React.useMemo(() => {
    if (!data) return [];
    
    // Handle case where data is an object with appointments property
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    
    // Handle case where data is directly an array
    if (Array.isArray(data)) {
      return data;
    }
    
    console.error("Unexpected appointments data format:", data);
    return [];
  }, [data]);

  const pagination = data?.pagination || {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  const handleSelectAppointment = (id: string) => {
    setSelectedAppointments(prev => 
      prev.includes(id) 
        ? prev.filter(appointmentId => appointmentId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedAppointments(
      selectedAppointments.length === appointments.length
        ? []
        : appointments.map(a => a.id)
    );
  };

  const handleExportExcel = () => {
    // Implement Excel export logic
    console.log("Exporting to Excel...");
  };

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log("Exporting to PDF...");
  };

  const handleViewDetails = (appointmentId: string) => {
    router.push(`/admin/appointments/${appointmentId}`);
  };

  const handleEdit = (appointment: Appointment) => {
    onEdit(appointment);
  };

  const handleDelete = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateAppointment = async (updatedData: Partial<Appointment>) => {
    try {
      if (appointmentToEdit) {
        await updateAppointment({ 
          id: appointmentToEdit.id, 
          appointment: updatedData 
        }).unwrap();
        
        toast.success("Appointment updated successfully");
        setIsEditDialogOpen(false);
        setAppointmentToEdit(undefined);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update appointment");
      console.error("Error updating appointment:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (appointmentToDelete) {
      try {
        await deleteAppointment(appointmentToDelete.id).unwrap();
        toast.success("Appointment deleted successfully");
        setIsDeleteDialogOpen(false);
        setAppointmentToDelete(undefined);
      } catch (error) {
        toast.error(getErrorMessage(error) || "Failed to delete appointment");
        console.error("Error deleting appointment:", error);
      }
    }
  };

  // Show skeleton loading state instead of spinner
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-md mr-1" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading appointments. Please try again later.
      </div>
    );
  }

  // Show empty state
  if (!appointmentsData || appointmentsData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No appointments found. Create a new appointment to get started.
      </div>
    );
  }

  // If you're filtering client-side, you can add additional filtering:
  const filteredAppointments = showOnlyEnquiries 
    ? appointmentsData.filter((appointment: Appointment) => 
        appointment.status.toLowerCase().includes('enquiry') || 
        appointment.status.toLowerCase().includes('followup') ||
        appointment.status.toLowerCase().includes('cost') ||
        appointment.status.toLowerCase().includes('issue')
      )
    : appointmentsData;

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment: Appointment) => (
              <TableRow 
                key={appointment.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <TableCell className="font-medium">
                  <span 
                    className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                    onClick={() => handleViewDetails(appointment.id)}
                  >
                    {appointment.patient?.name || 'Unknown Patient'}
                  </span>
                  {appointment.patient?.email && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {appointment.patient.email}
                    </div>
                  )}
                  {appointment.patient?.phoneNumber && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.patient.phoneNumber}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {appointment.date ? (
                    <>
                      {format(new Date(appointment.date), "MMM d, yyyy")}
                      <br />
                      <span className="text-gray-500 dark:text-gray-400">
                        {appointment.time || format(new Date(appointment.date), "h:mm a")}
                      </span>
                    </>
                  ) : (
                    'Not scheduled'
                  )}
                </TableCell>
                <TableCell>{appointment.service || 'General'}</TableCell>
                <TableCell className="capitalize">
                  {appointment.source?.toLowerCase() || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={getStatusColor(appointment.status || 'Unknown')}
                    variant="outline"
                  >
                    {appointment.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    {appointment.patient?.phoneNumber && (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // Get the phone number
                                let phoneNumber = appointment.patient!.phoneNumber;
                                
                                // Remove any non-digit characters except plus sign
                                phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
                                
                                // Check if the phone number already has a country code (starts with + or has 12+ digits)
                                if (!phoneNumber.startsWith('+')) {
                                  // If number already has 10 digits (standard Indian number without code)
                                  if (phoneNumber.length === 10) {
                                    // Add the +91 prefix
                                    phoneNumber = '+91' + phoneNumber;
                                  } 
                                  // If it might already have a country code but not the + symbol
                                  else if (phoneNumber.length > 10) {
                                    phoneNumber = '+' + phoneNumber;
                                  }
                                  // Otherwise assume it needs +91
                                  else {
                                    phoneNumber = '+91' + phoneNumber;
                                  }
                                }
                                
                                // Create message
                                const message = `Hello ${appointment.patient?.name || 'there'}! I'm reaching out regarding your ${appointment.service || 'treatment'} appointment scheduled for ${appointment.date ? format(new Date(appointment.date), "MMM d, yyyy") : 'our upcoming session'}.`;
                                
                                // Open WhatsApp with the formatted number and message
                                window.open(`https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                              }}
                              className="h-8 w-8 p-0 mr-1 text-green-600 hover:text-green-700"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                className="h-4 w-4 fill-current"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              <span className="sr-only">WhatsApp</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>WhatsApp</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(appointment)}
                            className="h-8 w-8 p-0 mr-1"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(appointment)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedAppointments.length > 0 
                ? `Selected ${selectedAppointments.length} of ${pagination.totalItems} appointments`
                : `Showing ${pagination.currentPage === 1 ? 1 : (pagination.currentPage - 1) * pagination.pageSize + 1} to ${Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of ${pagination.totalItems} appointments`
              }
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <AppointmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        appointment={appointmentToEdit as any}
        onSave={handleUpdateAppointment}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the appointment for {appointmentToDelete?.patient?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
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

      <div className="flex justify-end mt-4">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={!pagination.hasPreviousPage}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}