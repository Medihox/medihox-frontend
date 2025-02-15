"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterTimeRange = "all" | "today" | "week" | "month";
export type PatientStatus = "all" | "converted" | "not-converted";

interface FiltersProps {
  timeRange: FilterTimeRange;
  setTimeRange: (range: FilterTimeRange) => void;
  statusFilter: PatientStatus;
  setStatusFilter: (status: PatientStatus) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function Filters({
  timeRange,
  setTimeRange,
  statusFilter,
  setStatusFilter,
  showFilters,
  setShowFilters,
}: FiltersProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Time Range Filter */}
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>

      {/* Patient Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="converted">Converted</SelectItem>
          <SelectItem value="not-converted">Not Converted</SelectItem>
        </SelectContent>
      </Select>

      {/* Toggle Additional Filters */}
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}