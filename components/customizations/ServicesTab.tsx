"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  ServiceEntity
} from "@/lib/redux/services/customizationApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

export function ServicesTab() {
  const { data: services, isLoading } = useGetAllServicesQuery();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const [newServiceName, setNewServiceName] = useState("");
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceEntity | null>(null);

  const handleAddService = async () => {
    if (!newServiceName.trim()) return;
    
    try {
      await createService({ name: newServiceName }).unwrap();
      showSuccessToast("Treatment added successfully");
      setNewServiceName("");
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to add treatment");
    }
  };

  const handleEditService = (service: ServiceEntity) => {
    setEditServiceId(service.id);
    setEditServiceName(service.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editServiceName.trim()) return;
    
    try {
      await updateService({ id, service: { name: editServiceName } }).unwrap();
      showSuccessToast("Treatment updated successfully");
      setEditServiceId(null);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to update treatment");
    }
  };

  const handleCancelEdit = () => {
    setEditServiceId(null);
  };

  const handleDeleteClick = (service: ServiceEntity) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      await deleteService(serviceToDelete.id).unwrap();
      showSuccessToast("Treatment deleted successfully");
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to delete treatment");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-44 mb-2" />
          <Skeleton className="h-4 w-full max-w-md mb-4" />
        </div>

        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          Treatment Options
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Manage treatment options that can be used across the application
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add new treatment..."
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          onClick={handleAddService} 
          disabled={isCreating || !newServiceName.trim()}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Treatment
            </>
          )}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {services?.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editServiceId === service.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={editServiceName}
                        onChange={(e) => setEditServiceName(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveEdit(service.id)}
                        disabled={isUpdating || !editServiceName.trim()}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {service.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(service.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditService(service)}
                      disabled={editServiceId !== null}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(service)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {services?.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-500 mb-3">
                      <Package className="h-12 w-12 mx-auto opacity-50" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No treatment options found. Add your first one now.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the treatment
              "{serviceToDelete?.name}" from your account.
              This could affect entities that are currently using this treatment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 