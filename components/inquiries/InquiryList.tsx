"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Pencil, Trash2, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FilterTimeRange } from "@/app/admin/inquiries/page";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useGetInquiriesQuery, useUpdateAppointmentMutation, useDeleteAppointmentMutation } from "@/lib/redux/services/appointmentApi";
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

interface Inquiry {
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

export type InquiryStatus = string;

interface InquiryListProps {
  searchQuery: string;
  timeRange: FilterTimeRange;
  statusFilter: InquiryStatus | "all";
  fromDate?: string;
  toDate?: string;
  onEdit: (inquiry: Inquiry) => void;
  shouldRefetch?: boolean;
  onRefetchComplete?: () => void;
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

export function InquiryList({ 
  searchQuery, 
  timeRange, 
  statusFilter,
  fromDate,
  toDate,
  onEdit,
  shouldRefetch,
  onRefetchComplete
}: InquiryListProps) {
  const router = useRouter();
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add API hooks
  const [updateInquiry] = useUpdateAppointmentMutation();
  const [deleteInquiry] = useDeleteAppointmentMutation();
  
  // Prepare filters for API
  const filters = React.useMemo(() => {
    const result: Record<string, any> = {
      page,
      pageSize
    };
    
    if (searchQuery && searchQuery.trim() !== '') {
      result.search = searchQuery.trim();
    }
    
    if (timeRange && timeRange !== 'all') {
      result.timeRange = timeRange;
    }
    
    if (statusFilter && statusFilter !== 'all') {
      result.status = statusFilter;
    }
    
    if (fromDate && fromDate.trim() !== '') {
      result.fromDate = fromDate;
    }
    
    if (toDate && toDate.trim() !== '') {
      result.toDate = toDate;
    }
    
    // Make sure page and pageSize are included
    result.page = typeof page === 'number' ? page : 1;
    result.pageSize = typeof pageSize === 'number' ? pageSize : 10;
    
    return result;
  }, [searchQuery, timeRange, statusFilter, fromDate, toDate, page, pageSize]);

  // Fetch inquiries from API using the dedicated inquiries endpoint
  const { data, isLoading, error, refetch } = useGetInquiriesQuery(filters);

  // Handle refetch when shouldRefetch is true
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      onRefetchComplete?.();
    }
  }, [shouldRefetch, refetch, onRefetchComplete]);

  // Extract inquiries safely from the response
  const inquiriesData = React.useMemo(() => {
    if (!data) return [];
    
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  }, [data]);

  // Handle pagination
  const pagination = React.useMemo(() => {
    if (data && typeof data === 'object' && 'pagination' in data) {
      return (data as any).pagination;
    }
    
    return {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }, [data]);

  // Handle inquiry deletion
  const handleDeleteClick = (inquiry: Inquiry) => {
    setInquiryToDelete(inquiry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!inquiryToDelete) return;
    
    try {
      await deleteInquiry(inquiryToDelete.id).unwrap();
      toast.success("Inquiry deleted successfully");
      setIsDeleteDialogOpen(false);
      setInquiryToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to delete inquiry");
    }
  };

  // Handle page navigation
  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPage(prev => Math.max(1, prev - 1));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      // If it's a full ISO date string
      if (timeString.includes('T')) {
        return format(new Date(timeString), 'hh:mm a');
      }
      
      // If it's just a time string
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      return format(date, 'hh:mm a');
    } catch (error) {
      return timeString;
    }
  };

  // Navigate to inquiry details page
  const navigateToDetails = (inquiry: Inquiry) => {
    router.push(`/admin/inquiries/${inquiry.id}`);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading inquiries: {getErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div>
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Patient</TableHead>
            <TableHead>Service</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : inquiriesData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No inquiries found. Try different filters or create a new inquiry.
              </TableCell>
            </TableRow>
          ) : (
            inquiriesData.map((inquiry: Inquiry) => (
              <TableRow 
                key={inquiry.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span 
                      className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 hover:underline"
                      onClick={() => navigateToDetails(inquiry)}
                    >
                      {inquiry.patient?.name || "N/A"}
                    </span>
                    <div className="flex flex-col mt-1">
                      <span className="text-xs text-gray-400">
                        {inquiry.patient?.email || "No email"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {inquiry.patient?.phoneNumber || "No phone"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {inquiry.service || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(inquiry.status)} border`}
                  >
                    {inquiry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <span>{getSourceIcon(inquiry.source)}</span>
                    <span>{inquiry.source}</span>
                  </span>
                </TableCell>
                <TableCell>
                  {formatDate(inquiry.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Get and format the phone number
                              let phoneNumber = inquiry.patient?.phoneNumber || '';
                              if (!phoneNumber) {
                                toast.error("No phone number available");
                                return;
                              }
                                
                              // Clean the phone number
                              phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
                              
                              // Add country code if needed
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
                              const message = `Hello ${inquiry.patient?.name || 'there'}! I'm reaching out regarding your inquiry about ${inquiry.service || 'our services'}.`;
                              
                              // Open WhatsApp with the formatted number and message
                              window.open(`https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
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
                        <TooltipContent>
                          <p>WhatsApp</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8"
                            onClick={() => onEdit(inquiry)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Inquiry</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(inquiry);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Inquiry</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination controls */}
      {!isLoading && inquiriesData.length > 0 && (
        <div className="flex justify-end mt-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={!pagination.hasPreviousPage}
              onClick={goToPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={goToNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the inquiry for {inquiryToDelete?.patient?.name || 'this patient'}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 