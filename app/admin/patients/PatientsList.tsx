"use client";

import { useState, useEffect } from "react";
import { Download, FileText, MoreVertical, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
  useGetPatientsQuery,
  useDeletePatientMutation,
  useUpdatePatientMutation,
  Patient
} from "@/lib/redux/services/patientApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { NewPatientDialog } from "./NewPatientDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientsListProps {
  searchQuery: string;
  timeRange: "all" | "today" | "week" | "month";
  statusFilter: 'all' | 'ACTIVE' | 'INACTIVE' | 'CONVERTED' | 'DELETED';
}

export type PatientStatus = 'all' | 'ACTIVE' | 'INACTIVE' | 'CONVERTED' | 'DELETED';

export function PatientsList({ searchQuery, timeRange, statusFilter }: PatientsListProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Query patients with filtering
  const { data, isLoading, isFetching, error } = useGetPatientsQuery({
    page,
    pageSize,
    search: searchQuery,
    timeRange,
    status: statusFilter
  });

  // Set loading state when fetching new page
  useEffect(() => {
    setIsPageLoading(isFetching);
  }, [isFetching]);

  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [patientToUpdate, setPatientToUpdate] = useState<Patient | null>(null);
  const [updatedPatientData, setUpdatedPatientData] = useState<Partial<Patient>>({});
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();

  const handlePatientClick = (id: string) => {
    router.push(`/admin/patients/${id}`);
  };

  const handleDelete = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    
    try {
      await deletePatient(patientToDelete.id).unwrap();
      showSuccessToast("Patient deleted successfully");
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to delete patient");
    }
  };

  const handleUpdate = (patient: Patient) => {
    setPatientToUpdate(patient);
    setUpdateDialogOpen(true);
    
    setUpdatedPatientData({
      name: patient.name,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      whatsappNumber: patient.whatsappNumber,
      address: patient.address || '',
      status: patient.status
    });
  };

  const handleExportCSV = () => {
    if (!data?.data) return;
    
    const headers = [
      "Name",
      "Email",
      "Phone",
      "WhatsApp",
      "Address",
      "Status",
      "Created By",
      "Created At",
    ];

    const formatDate = (dateString: string) => {
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
        .map((patient) =>
          [
            patient.name,
            patient.email,
            patient.phoneNumber,
            patient.whatsappNumber || "",
            patient.address || "",
            patient.status,
            patient.createdBy?.name || "",
            formatDate(patient.createdAt),
          ].join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `patients-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdatePatient = async () => {
    if (!patientToUpdate || !updatedPatientData) return;
    
    try {
      // Format phone numbers to include country code if not already present
      const phoneNumber = updatedPatientData.phoneNumber?.startsWith('+') 
        ? updatedPatientData.phoneNumber 
        : `+91${updatedPatientData.phoneNumber}`;
        
      const whatsappNumber = updatedPatientData.whatsappNumber?.startsWith('+') 
        ? updatedPatientData.whatsappNumber 
        : updatedPatientData.whatsappNumber ? `+91${updatedPatientData.whatsappNumber}` : undefined;
      
      // Convert boolean to string to avoid JSON parsing issues
      const patientData = {
        name: updatedPatientData.name,
        email: updatedPatientData.email,
        phoneNumber,
        whatsappNumber,
        address: updatedPatientData.address || undefined,
        status: updatedPatientData.status
      };

      console.log("Sending update data:", patientData); // Log the data being sent
      
      await updatePatient({
        id: patientToUpdate.id,
        patient: patientData
      }).unwrap();
      
      showSuccessToast("Patient updated successfully");
      setUpdateDialogOpen(false);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to update patient");
      console.error("Update error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[200px]">
                Patient
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <Skeleton className="h-5 w-28" />
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <Skeleton className="h-5 w-32" />
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
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">Error loading patients</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONVERTED':
        return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
      case 'ACTIVE':
        return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      case 'INACTIVE':
        return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
      case 'DELETED':
        return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="text-sm font-medium">
            Total: <span className="text-purple-600 dark:text-purple-400">{data?.pagination.totalItems || 0}</span> patients
          </div>
          <Button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[200px]">
                Patient
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.data.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 min-w-[200px]">
                  <div className="flex flex-col">
                    <span 
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      {patient.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.phoneNumber}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  {patient.address || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  {patient.createdBy?.name || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(patient.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(patient.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleUpdate(patient)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900"
                      onClick={() => handleDelete(patient)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && data?.data && data.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No patients found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : "There are no patients matching your filters."}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setPage(1);
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
        
        {!isLoading && data?.data && data.data.length > 0 && (
          <div className="flex justify-between items-center mt-6 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">{data?.data.length}</span> of <span className="font-medium">{data?.pagination.totalItems}</span> patients
              <span className="hidden sm:inline-block ml-1">
                (Page <span className="font-medium">{data?.pagination.currentPage}</span> of <span className="font-medium">{data?.pagination.totalPages}</span>)
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={page <= 1 || isPageLoading}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
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
                disabled={page >= (data?.pagination.totalPages || 1) || isPageLoading}
                onClick={() => setPage(prev => prev + 1)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {patientToDelete?.name}&apos;s record and remove their data from our servers.
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
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          
          {patientToUpdate && (
            <div className="py-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePatient();
              }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={updatedPatientData.name || ''}
                      onChange={(e) => setUpdatedPatientData({...updatedPatientData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={updatedPatientData.email || ''}
                      onChange={(e) => setUpdatedPatientData({...updatedPatientData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      value={updatedPatientData.phoneNumber || ''}
                      onChange={(e) => setUpdatedPatientData({...updatedPatientData, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-whatsapp">WhatsApp Number</Label>
                    <Input
                      id="edit-whatsapp"
                      value={updatedPatientData.whatsappNumber || ''}
                      onChange={(e) => setUpdatedPatientData({...updatedPatientData, whatsappNumber: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={updatedPatientData.address || ''}
                    onChange={(e) => setUpdatedPatientData({...updatedPatientData, address: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={updatedPatientData.status || 'ACTIVE'}
                    onValueChange={(value) => setUpdatedPatientData({...updatedPatientData, status: value as 'ACTIVE' | 'INACTIVE' | 'CONVERTED' | 'DELETED'})}
                  >
                    <SelectTrigger id="edit-status" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="CONVERTED">Converted</SelectItem>
                      <SelectItem value="DELETED">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setUpdateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Patient</Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}