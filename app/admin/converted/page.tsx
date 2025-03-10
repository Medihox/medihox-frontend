"use client";

import { useState, useEffect } from "react";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { AppointmentDialog } from "@/components/appointments/AppointmentDialog";
import { Search, Filter, Plus, CheckCircle } from "lucide-react";
import { useGetAllStatusQuery } from "@/lib/redux/services/customizationApi";

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
  status: string;
  notes?: string;
  service: string;
  source: string;
  createdAt: string;
}

export type FilterTimeRange = 'all' | 'today' | 'week' | 'month';
export type AppointmentStatus = string;

export default function ConvertedAppointmentsPage() {
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<FilterTimeRange>("all");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>("CONVERTED");
  const [showFilters, setShowFilters] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  
  // Fetch all statuses from the API
  const { data: statuses } = useGetAllStatusQuery();
  
  // Filter for converted-related statuses
  useEffect(() => {
    if (statuses) {
      const convertedStatuses = statuses.filter(status => 
        status.name.toLowerCase().includes('convert') || 
        status.name === "CONVERTED"
      );
      
      // Set available statuses for filtering
      setAvailableStatuses(convertedStatuses.map(s => s.name));
      
      // Make sure CONVERTED status is available or use the first status
      if (convertedStatuses.length > 0) {
        if (!convertedStatuses.some(s => s.name === "CONVERTED")) {
          setStatusFilter(convertedStatuses[0].name);
        }
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

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceFilter(e.target.value);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDialogOpen(true);
  };

  const handleCreateAppointment = (appointmentData: Partial<Appointment>) => {
    if (selectedAppointment) {
      console.log('Updating appointment:', appointmentData);
      // Add your update logic here
    } else {
      console.log('Creating new appointment:', appointmentData);
    }
    setIsAppointmentDialogOpen(false);
    setSelectedAppointment(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Converted Patient's History
              </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and manage all converted patient's history</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search appointments..."
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
              
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="w-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select 
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    {availableStatuses.length > 0 ? (
                      availableStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))
                    ) : (
                      <option value="CONVERTED">Converted</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service
                  </label>
                  <select 
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                    value={serviceFilter}
                    onChange={handleServiceChange}
                  >
                    <option value="">All Services</option>
                    <option value="Eye care">Eye care</option>
                    <option value="Dental">Dental</option>
                    <option value="General checkup">General checkup</option>
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
              </div>
            )}
          </div>
          
          <AppointmentsList 
            searchQuery={searchQuery}
            timeRange={timeRange}
            statusFilter={statusFilter}
            onEdit={handleEditAppointment}
          />
        </div>
      </div>

      <AppointmentDialog 
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        onSave={handleCreateAppointment}
        appointment={selectedAppointment}
      />
    </div>
  );
} 