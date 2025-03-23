"use client";

import { useState, useEffect } from "react";
import { Calendar, Filter, FileText, Search, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ConvertedList } from "@/components/converted/ConvertedList";
import { ConvertedDialog } from "@/components/converted/ConvertedDialog";
import { useGetAllStatusQuery } from "@/lib/redux/services/customizationApi";
import { DateRange } from "react-day-picker";

export default function ConvertedPage() {
  // State for filter and search
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [statusFilter, setStatusFilter] = useState('CONVERTED'); // Default to CONVERTED status
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  // State for dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedConverted, setSelectedConverted] = useState<any>(null);
  
  // Fetch statuses for filter
  const { data: statuses, isLoading: isLoadingStatuses } = useGetAllStatusQuery();
  
  // Filter statuses to only include converted ones
  const convertedStatuses = statuses?.filter(status => 
    status.name.toLowerCase().includes('convert')
  ) || [];
  
  // Set default status to CONVERTED if available in statuses
  useEffect(() => {
    if (statuses && statuses.length > 0) {
      const hasConverted = statuses.some(status => status.name === "CONVERTED");
      if (hasConverted) {
        setStatusFilter("CONVERTED");
      } else if (convertedStatuses.length > 0) {
        setStatusFilter(convertedStatuses[0].name);
      }
    }
  }, [statuses, convertedStatuses]);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle time range filter
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as 'all' | 'today' | 'week' | 'month');
  };
  
  // Handle status filter
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  // Handle edit click
  const handleEdit = (converted: any) => {
    setSelectedConverted(converted);
    setIsEditDialogOpen(true);
  };
  
  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return format(date, "MMM dd, yyyy");
  };
  
  // Handle save after edit
  const handleSaveAfterEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedConverted(null);
  };
  
  return (
    <div className="space-y-4 p-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Converted Records</h2>
          <p className="text-muted-foreground">
            View and manage patients who have converted to treatment
          </p>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by patient name, phone, or service..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters ? "bg-accent" : "")}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  {isLoadingStatuses ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    </SelectItem>
                  ) : (
                    convertedStatuses
                      .filter(status => status.name !== "CONVERTED") // Filter out CONVERTED to avoid duplication
                      .map((status) => (
                        <SelectItem key={status.id} value={status.name}>
                          {status.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Custom Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange?.to ? (
                        <>
                          {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                        </>
                      ) : (
                        formatDate(dateRange.from)
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-950 border rounded-md">
        <ConvertedList
          searchQuery={searchQuery}
          timeRange={timeRange}
          statusFilter={statusFilter}
          fromDate={dateRange?.from?.toISOString()}
          toDate={dateRange?.to?.toISOString()}
          onEdit={handleEdit}
        />
      </div>
      
      {selectedConverted && (
        <ConvertedDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          convertedData={selectedConverted}
          onSave={handleSaveAfterEdit}
        />
      )}
    </div>
  );
} 