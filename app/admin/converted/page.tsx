"use client";

import { useState, useEffect } from "react";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { AppointmentDialog } from "@/components/appointments/AppointmentDialog";
import { Search, Plus, CheckCircle, Calendar, Check, X } from "lucide-react";
import { useGetAllStatusQuery } from "@/lib/redux/services/customizationApi";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  const [serviceFilter, setServiceFilter] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  
  // Add date range state variables
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(undefined);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
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
    // Clear date range when time range filter is used
    if (e.target.value !== 'all') {
      clearDateRange();
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceFilter(e.target.value);
  };
  
  const clearDateRange = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setTempStartDate(undefined);
    setTempEndDate(undefined);
  };
  
  // Format start and end dates for display and API
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';
  
  // Get display label for date range
  const dateRangeLabel = startDate 
    ? endDate 
      ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
      : `From ${format(startDate, 'MMM d, yyyy')}`
    : 'Select dates';

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
              
              <div className="flex items-center gap-3">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "justify-start text-left font-normal",
                        (startDate || endDate) && "text-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{dateRangeLabel}</span>
                      {(startDate || endDate) && (
                        <X 
                          className="ml-2 h-4 w-4 text-muted-foreground hover:text-foreground" 
                          onClick={(e) => {
                            e.stopPropagation();
                            clearDateRange();
                          }}
                        />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom" alignOffset={-10} sideOffset={5}>
                    <div className="p-2 border-b">
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 text-xs px-2 py-0" 
                          onClick={() => {
                            clearDateRange();
                          }}
                        >
                          Clear
                        </Button>
                        <Button 
                          size="sm"
                          variant="default"
                          className="h-6 text-xs px-2 py-0 bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => {
                            setStartDate(tempStartDate);
                            setEndDate(tempEndDate);
                            if (tempStartDate) {
                              setTimeRange('all');
                            }
                            setIsCalendarOpen(false);
                          }}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                      </div>
                    </div>
                    <CalendarComponent
                      mode="range"
                      selected={{
                        from: tempStartDate || startDate,
                        to: tempEndDate || endDate,
                      }}
                      onSelect={(range) => {
                        if (range?.from) {
                          setTempStartDate(range.from);
                          setTempEndDate(range.to);
                        } else {
                          setTempStartDate(undefined);
                          setTempEndDate(undefined);
                        }
                      }}
                      initialFocus
                      className="scale-95 origin-top"
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-gray-400">or</span>
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
            </div>
          </div>
          
          <AppointmentsList 
            searchQuery={searchQuery}
            timeRange={timeRange}
            statusFilter={statusFilter}
            fromDate={formattedStartDate}
            toDate={formattedEndDate}
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