"use client";

import { useState } from "react";
import { PatientsList } from "./PatientsList";
import { NewPatientDialog } from "./NewPatientDialog";
import { Search, Filter, Plus } from "lucide-react";

export type FilterTimeRange = 'all' | 'today' | 'week' | 'month';
export type PatientStatus = 'all' | 'ACTIVE' | 'INACTIVE' | 'CONVERTED' | 'DELETED';

export default function PatientsPage() {
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<FilterTimeRange>("all");
  const [statusFilter, setStatusFilter] = useState<PatientStatus>("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value as FilterTimeRange);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as PatientStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">      
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">All Patients</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all patients</p>
          </div>
          <button 
            onClick={() => setIsNewPatientOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Patient
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
                    placeholder="Search patients..."
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
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City
                    </label>
                    <select className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                      <option value="">All Cities</option>
                      <option value="new-york">New York</option>
                      <option value="los-angeles">Los Angeles</option>
                      <option value="chicago">Chicago</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country
                    </label>
                    <select className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                      <option value="">All Countries</option>
                      <option value="usa">USA</option>
                      <option value="canada">Canada</option>
                      <option value="uk">UK</option>
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
          
          <PatientsList 
            searchQuery={searchQuery}
            timeRange={timeRange}
            statusFilter={statusFilter}
          />
        </div>
      </div>

      <NewPatientDialog 
        open={isNewPatientOpen}
        onOpenChange={setIsNewPatientOpen}
      />
    </div>
  );
}