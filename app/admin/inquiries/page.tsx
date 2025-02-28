"use client";

import { useState, useEffect } from "react";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";
import { Search, Filter, Plus } from "lucide-react";
import { useGetAllStatusQuery } from "@/lib/redux/services/customizationApi";

export type FilterTimeRange = 'all' | 'today' | 'week' | 'month';
export type AppointmentStatus = string;

export default function InquiriesPage() {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<FilterTimeRange>("all");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>("enquired");
  const [showFilters, setShowFilters] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
  
  // Fetch all statuses from the API
  const { data: statuses } = useGetAllStatusQuery();
  
  // Filter out only enquiry-related statuses
  useEffect(() => {
    if (statuses) {
      const enquiryStatuses = statuses.filter(status => 
        status.name.toLowerCase().includes('enquir') || 
        status.name.toLowerCase().includes('followup') ||
        status.name.toLowerCase().includes('cost') ||
        status.name.toLowerCase().includes('issue')
      );
      
      // Set available statuses for filtering
      setAvailableStatuses(enquiryStatuses.map(s => s.name));
      
      // Set default status filter if available
      if (enquiryStatuses.length > 0 && statusFilter === 'enquired') {
        setStatusFilter(enquiryStatuses[0].name);
      }
    }
  }, [statuses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value as FilterTimeRange);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleEditInquiry = (inquiry: any) => {
    setAppointmentToEdit(inquiry);
    setIsNewAppointmentOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">All Enquiries</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all enquiries</p>
          </div>
          <button 
            onClick={() => setIsNewAppointmentOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Enquiry
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search enquiries..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300"
                >
                  <option value="all">All Enquiries</option>
                  {availableStatuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Service
                    </label>
                    <select className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                      <option value="">All Services</option>
                      <option value="general">General Checkup</option>
                      <option value="dental">Dental Care</option>
                      <option value="eye">Eye Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Source
                    </label>
                    <select className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                      <option value="">All Sources</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">Phone</option>
                      <option value="facebook">Facebook</option>
                      <option value="website">Website</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created By
                    </label>
                    <select className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                      <option value="">All Staff</option>
                      <option value="dr-smith">Dr. Smith</option>
                      <option value="dr-johnson">Dr. Johnson</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <AppointmentsList 
            searchQuery={searchQuery}
            timeRange={timeRange}
            statusFilter={statusFilter as any}
            showOnlyEnquiries={true}
            onEdit={handleEditInquiry}
          />
        </div>
      </div>

      <NewAppointmentDialog 
        open={isNewAppointmentOpen}
        onOpenChange={(open) => {
          setIsNewAppointmentOpen(open);
          if (!open) setAppointmentToEdit(null);
        }}
        isEnquiry={true}
        initialData={appointmentToEdit}
        appointmentId={appointmentToEdit?.id}
      />
    </div>
  );
}