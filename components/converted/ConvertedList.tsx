"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetAppointmentsQuery } from "@/lib/redux/services/appointmentApi";
import { format, parseISO } from "date-fns";
import { 
  ChevronLeft, ChevronRight, MoreHorizontal, Search, Calendar, Clock, 
  CheckCircle, Loader2, AlertCircle, Star, ExternalLink, Pencil, Download, FileText,
  Trash2, MessageCircle, Phone, User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

// Define interface for Converted item
interface Converted {
  id: string;
  patient?: {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    city?: string;
    country?: string;
  };
  date: string;
  time?: string;
  status: string;
  notes?: string;
  service: string;
  source: string;
  createdAt: string;
  beforeImages?: string[];
  afterImages?: string[];
}

// Define props for ConvertedList component
interface ConvertedListProps {
  searchQuery: string;
  timeRange: 'all' | 'today' | 'week' | 'month';
  statusFilter: string;
  fromDate?: string;
  toDate?: string;
  onEdit?: (converted: Converted) => void;
}

export function ConvertedList({ 
  searchQuery, 
  timeRange, 
  statusFilter,
  fromDate,
  toDate,
  onEdit
}: ConvertedListProps) {
  const router = useRouter();
  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConvertedId, setSelectedConvertedId] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  
  // Ensure we're always filtering for converted status
  const finalStatusFilter = statusFilter === 'all' ? 'CONVERTED' : statusFilter;
  
  // Get converted appointments with filters
  const { data, isLoading, isFetching, error, refetch } = useGetAppointmentsQuery({
    search: searchQuery,
    timeRange,
    status: finalStatusFilter, // Use our ensured filter
    fromDate,
    toDate,
    page: currentPage,
    pageSize: 10,
  });
  
  // Ensure converted items have the CONVERTED status or other converted-like status
  const convertedItems = data?.data.filter(
    appointment => appointment.status.toLowerCase().includes('convert')
  ) || [];
  
  const totalPages = data?.pagination?.totalPages || 1;
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, timeRange, statusFilter, fromDate, toDate]);
  
  // Automatically refetch when needed
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);
  
  // Set loading state when fetching new page
  useEffect(() => {
    setIsPageLoading(isFetching);
  }, [isFetching]);
  
  // Handle pagination navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Handle editing a converted item
  const handleEdit = (converted: Converted) => {
    if (onEdit) {
      onEdit(converted);
    }
  };

  // Handle viewing details of a converted item
  const handleViewDetails = (convertedId: string) => {
    router.push(`/admin/converted/${convertedId}`);
  };

  // Handle patient details
  const handleViewPatient = (patientId?: string) => {
    if (patientId) {
      router.push(`/admin/patients/${patientId}`);
    }
  };

  // Handle WhatsApp message
  const handleWhatsAppMessage = (phoneNumber?: string, patientName?: string) => {
    if (!phoneNumber) return;
    
    // Format phone number (remove non-digits except +)
    let formattedNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Add country code if needed
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber;
    }
    
    // Create message and open WhatsApp
    const message = `Hello ${patientName || 'there'}! I'm reaching out regarding your treatment.`;
    window.open(`https://wa.me/${formattedNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Handle delete
  const handleDelete = (convertedId: string) => {
    // Implement delete functionality
    console.log('Delete converted record:', convertedId);
    // Would typically show a confirmation dialog here
  };

  // Handle exporting to Excel
  const handleExportExcel = () => {
    // Implement Excel export logic
    console.log("Exporting to Excel...");
  };

  // Handle exporting to PDF
  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log("Exporting to PDF...");
  };
  
  // Render loading state
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
                  <Skeleton className="h-4 w-24 mt-1" />
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
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex flex-col">
        <div className="p-8 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Error loading data</h3>
          <p className="text-sm text-gray-500 mt-2">
            There was a problem fetching the converted records. Please try again.
          </p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
        
        {/* Add export buttons at the bottom */}
        <div className="flex justify-end mt-4 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render empty state
  if (convertedItems.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No converted records found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? `No results for "${searchQuery}"` : "There are no converted records matching your filters."}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setCurrentPage(1);
              // Reset other filters if needed
            }}
          >
            Reset filters
          </Button>
        </div>
        
        {/* Add export buttons at the bottom */}
        <div className="flex justify-end mt-4 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    status = status.toLowerCase();
    
    if (status.includes('convert')) {
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800";
    }
    
    if (status.includes('complete') || status.includes('done')) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-800";
    }
    
    if (status.includes('cancel') || status.includes('decline')) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800";
    }
    
    if (status.includes('pending') || status.includes('wait')) {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800";
    }
    
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700";
  };
  
  // Helper function to determine if a record has treatment images
  const hasTreatmentImages = (converted: Converted) => {
    return (
      (converted.beforeImages && converted.beforeImages.length > 0) || 
      (converted.afterImages && converted.afterImages.length > 0)
    );
  };
  
  return (
    <div className="flex flex-col">
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
            {convertedItems.map((converted) => (
              <TableRow 
                key={converted.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span 
                      className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                      onClick={() => handleViewDetails(converted.id)}
                    >
                      {converted.patient?.name || 'Unknown Patient'}
                      {hasTreatmentImages(converted) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex ml-2">
                                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Has treatment images</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </span>
                  </div>
                  {converted.patient?.email && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {converted.patient.email}
                    </div>
                  )}
                  {converted.patient?.phoneNumber && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {converted.patient.phoneNumber}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {converted.date ? (
                    <>
                      {format(new Date(converted.date), "MMM d, yyyy")}
                      <br />
                      <span className="text-gray-500 dark:text-gray-400">
                        {converted.time || 'No time specified'}
                      </span>
                    </>
                  ) : (
                    'Not scheduled'
                  )}
                </TableCell>
                <TableCell>{converted.service || 'Not specified'}</TableCell>
                <TableCell className="capitalize">
                  {converted.source?.toLowerCase() || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={getStatusColor(converted.status || 'Unknown')}
                    variant="outline"
                  >
                    {converted.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewDetails(converted.id)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {converted.patient?.phoneNumber && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => handleWhatsAppMessage(converted.patient?.phoneNumber, converted.patient?.name)}
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span className="sr-only">WhatsApp</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send WhatsApp message</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(converted)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        
                        {converted.patient?.id && (
                          <DropdownMenuItem onClick={() => handleViewPatient(converted.patient?.id)}>
                            <User className="h-4 w-4 mr-2" />
                            View Patient
                          </DropdownMenuItem>
                        )}
                        
                        {converted.patient?.phoneNumber && (
                          <DropdownMenuItem onClick={() => window.open(`tel:${converted.patient?.phoneNumber}`, '_blank')}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Patient
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={() => handleDelete(converted.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination controls - only shown when there are results */}
      {!isLoading && convertedItems.length > 0 && (
        <div className="flex justify-between items-center mt-6 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{convertedItems.length}</span> of <span className="font-medium">{data?.pagination?.totalItems || 0}</span> results
            <span className="hidden sm:inline-block ml-1">
              (Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 mr-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Excel</span>
              <span className="inline sm:hidden">Excel</span>
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 mr-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="inline sm:hidden">PDF</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage <= 1 || isPageLoading}
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              className="flex items-center px-3"
            >
              {isPageLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ChevronLeft className="h-4 w-4 mr-1" />
              )}
              <span>Previous</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isPageLoading}
              onClick={() => goToPage(currentPage + 1)}
              className="flex items-center px-3"
            >
              <span>Next</span>
              {isPageLoading ? (
                <Loader2 className="h-4 w-4 ml-1 animate-spin" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 