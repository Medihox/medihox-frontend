"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Loader2, Search, Filter, ChevronRight, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetSuperAdminUsersQuery, useDeleteSuperAdminUserMutation } from "@/lib/redux/services/superAdminApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { CreateAdminDialog } from "@/components/super-admin/CreateAdminDialog";
import { EditAdminDialog } from "@/components/super-admin/EditAdminDialog";
import { AdminUser } from "@/lib/redux/services/superAdminApi";
import { Card, CardContent } from "@/components/ui/card";
import { AdminsList } from "@/components/super-admin/AdminsList";

type FilterTimeRange = 'all' | 'today' | 'week' | 'month';
type AdminStatus = 'all' | 'ACTIVE' | 'INACTIVE';

export default function AdminsPage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<FilterTimeRange>("all");
  const [statusFilter, setStatusFilter] = useState<AdminStatus>("all");
  const [showFilters, setShowFilters] = useState(false);

  // State for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  // API hooks
  const { data: usersResponse, isLoading, refetch } = useGetSuperAdminUsersQuery();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteSuperAdminUserMutation();

  // Filter and search handling
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTimeRangeChange = (value: FilterTimeRange) => {
    setTimeRange(value);
  };

  const handleStatusChange = (value: AdminStatus) => {
    setStatusFilter(value);
  };

  // Dialog handlers
  const openEditDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (adminId: string) => {
    setAdminToDelete(adminId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    try {
      await deleteAdmin(adminToDelete).unwrap();
      showSuccessToast("Admin deleted successfully");
      setIsDeleteDialogOpen(false);
      setAdminToDelete(null);
      refetch();
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to delete admin");
    }
  };

  // Filter admins based on search and filters
  const filteredAdmins = usersResponse?.data.filter(admin => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (admin.organizationName && admin.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Admins</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage all clinic admins</p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Add Admin
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search by name, email, organization..."
                      className="pl-10 pr-4 py-2 w-full"
                    />
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {showFilters ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => handleStatusChange(value as AdminStatus)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={timeRange}
                    onValueChange={(value) => handleTimeRangeChange(value as FilterTimeRange)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Cities</SelectItem>
                          <SelectItem value="new-york">New York</SelectItem>
                          <SelectItem value="los-angeles">Los Angeles</SelectItem>
                          <SelectItem value="chicago">Chicago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country
                      </label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="All Countries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Countries</SelectItem>
                          <SelectItem value="usa">USA</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="uk">UK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subscription
                      </label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="All Subscriptions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Subscriptions</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin List */}
            <AdminsList
              admins={filteredAdmins}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          </CardContent>
        </Card>
      </div>

      {/* Create Admin Dialog */}
      <CreateAdminDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />

      {/* Edit Admin Dialog */}
      <EditAdminDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        adminData={selectedAdmin}
        onSuccess={refetch}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the admin user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}