"use client";

import { useState } from "react";
import { Download, FileText, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  User
} from "@/lib/redux/services/userApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersListProps {
  searchQuery: string;
  timeRange: "all" | "today" | "week" | "month";
  statusFilter: 'all' | 'ACTIVE' | 'INACTIVE';
}

export function UsersList({ searchQuery, timeRange, statusFilter }: UsersListProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Query users with filtering
  const { data, isLoading, isFetching, error } = useGetUsersQuery({
    page,
    pageSize,
    search: searchQuery,
    timeRange,
    status: statusFilter
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const [updatedUserData, setUpdatedUserData] = useState<Partial<User>>({});
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleUserClick = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id).unwrap();
      showSuccessToast("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to delete user");
    }
  };

  const handleUpdate = (user: User) => {
    setUserToUpdate(user);
    setUpdateDialogOpen(true);
    
    setUpdatedUserData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
  };

  const handleExportCSV = () => {
    if (!data?.data) return;
    
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Status",
      "Created At",
      "Last Login"
    ];

    const formatDate = (dateString?: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return `${formattedDate} ${formattedTime}`;
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      data.data
        .map((user) =>
          [
            user.name,
            user.email,
            user.phone || "",
            user.role,
            user.status,
            formatDate(user.createdAt),
            formatDate(user.lastLogin),
          ].join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateUser = async () => {
    if (!userToUpdate || !updatedUserData) return;
    
    try {
      const userData = {
        name: updatedUserData.name,
        email: updatedUserData.email,
        phone: updatedUserData.phone,
        role: updatedUserData.role,
        status: updatedUserData.status
      };

      console.log("Sending update data:", userData);
      
      await updateUser({
        id: userToUpdate.id,
        user: userData
      }).unwrap();
      
      showSuccessToast("User updated successfully");
      setUpdateDialogOpen(false);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to update user");
      console.error("Update error:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE':
        return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
      case 'INACTIVE':
        return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'ADMIN':
        return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
      case 'DOCTOR':
        return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      case 'RECEPTIONIST':
        return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
      case 'EMPLOYEE':
        return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Name & Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created At</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <Skeleton className="h-5 w-24" />
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">Error loading users</div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Name & Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created At</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.data.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  {user.phone || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  {user.lastLogin ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(user.lastLogin).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(user.lastLogin).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Never</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleUpdate(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {data?.data.length || 0} of {data?.pagination?.totalItems || 0} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data?.pagination?.hasPreviousPage}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {data?.pagination?.currentPage || 1} of {data?.pagination?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!data?.pagination?.hasNextPage}
                onClick={() => setPage(prev => prev + 1)}
              >
                Next
              </Button>
              <Button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {userToDelete?.name}&apos;s account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          
          {userToUpdate && (
            <div className="py-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser();
              }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={updatedUserData.name || ''}
                      onChange={(e) => setUpdatedUserData({...updatedUserData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={updatedUserData.email || ''}
                      onChange={(e) => setUpdatedUserData({...updatedUserData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={updatedUserData.phone || ''}
                      onChange={(e) => setUpdatedUserData({...updatedUserData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                      value={updatedUserData.role || 'EMPLOYEE'}
                      onValueChange={(value) => setUpdatedUserData({...updatedUserData, role: value as 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'EMPLOYEE'})}
                    >
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                        <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={updatedUserData.status || 'ACTIVE'}
                      onValueChange={(value) => setUpdatedUserData({...updatedUserData, status: value as 'ACTIVE' | 'INACTIVE'})}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setUpdateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update User"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 