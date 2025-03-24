"use client";

import { useState, useEffect } from "react";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { AppointmentDialog } from "@/components/appointments/AppointmentDialog";
import { Search, Calendar, Check, X } from "lucide-react";
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

interface Service {
  id: string;
  name: string;
}

export type FilterTimeRange = 'all' | 'today' | 'week' | 'month';
export type AppointmentStatus = string;

export default function AppointmentsListPage() {
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<FilterTimeRange>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(undefined);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(undefined);
  const [serviceFilter, setServiceFilter] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  
  // Fetch all statuses from the API
  const { data: statuses } = useGetAllStatusQuery();
  
  // Store available statuses for possible future use
  useEffect(() => {
    if (statuses) {
      setAvailableStatuses(statuses.map(s => s.name));
    }
  }, [statuses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value as FilterTimeRange);
    // Clear date range when time range filter is used
    if (e.target.value !== 'all') {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // If no start date or both dates are selected, set new start date
      setStartDate(date);
      setEndDate(undefined);
    } else {
      // If start date is earlier than the selected date, set end date
      if (date.getTime() >= startDate.getTime()) {
        setEndDate(date);
      } else {
        // If selected date is earlier than start date, swap them
        setEndDate(startDate);
        setStartDate(date);
      }
    }
    
    // Clear time range filter when using custom date range
    setTimeRange('all');
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

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">All Appointments</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all appointments</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search appointments..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
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
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300"
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