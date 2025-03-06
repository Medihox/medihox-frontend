"use client";

import { useState } from "react";
import { Download, FileText, MoreVertical, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  showOnlyEnquiries?: boolean;
  onEdit: (appointment: Appointment) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    case "Completed":
      return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
    case "Cancelled":
      return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    case "Enquired":
      return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
    case "Followup":
      return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
    case "Cost-Issue":
      return "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
    default:
      return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
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
  
  // Improve filter creation to ensure proper values
  const filters = React.useMemo(() => {
    // Create a clean object with only defined filters
    const result: Record<string, any> = {};
    
    // Only add search if it has a value
    if (searchQuery && searchQuery.trim() !== '') {
      result.search = searchQuery.trim();
    }
    
    // Add time range filter if not 'all'
    if (timeRange && timeRange !== 'all') {
      result.timeRange = timeRange;
    }
    
    // Add status filter if not 'all'
    if (statusFilter && statusFilter !== 'all') {
      result.status = statusFilter;
    }
    
    // Always include pagination
    result.page = page;
    result.pageSize = pageSize;
    
    return result;
  }, [searchQuery, timeRange, statusFilter, page, pageSize]);

  // Add debugging to see what's being sent
  console.log('Sending filters to API:', filters);
  const { data, isLoading, error } = useGetAppointmentsQuery({
    page,
    pageSize,
    search: searchQuery,
    timeRange,
    status: statusFilter === 'all' ? undefined : statusFilter,
    isEnquiry: showOnlyEnquiries,
  } as any);

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
                onClick={() => handleViewDetails(appointment.id)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <TableCell className="font-medium">
                  {appointment.patient?.name || 'Unknown Patient'}
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
                  >
                    {appointment.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(appointment)}
                      className="h-8 w-8 p-0 mr-1"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(appointment)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
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