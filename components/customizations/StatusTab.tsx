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
  useGetAllStatusQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
  StatusEntity
} from "@/lib/redux/services/customizationApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { Skeleton } from "@/components/ui/skeleton";

export function StatusTab() {
  const { data: statuses, isLoading } = useGetAllStatusQuery();
  const [createStatus, { isLoading: isCreating }] = useCreateStatusMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [deleteStatus, { isLoading: isDeleting }] = useDeleteStatusMutation();

  const [newStatusName, setNewStatusName] = useState("");
  const [editStatusId, setEditStatusId] = useState<string | null>(null);
  const [editStatusName, setEditStatusName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<StatusEntity | null>(null);

  const handleAddStatus = async () => {
    if (!newStatusName.trim()) return;
    
    try {
      await createStatus({ name: newStatusName }).unwrap();
      showSuccessToast("Status added successfully");
      setNewStatusName("");
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to add status");
    }
  };

  const handleEditStatus = (status: StatusEntity) => {
    setEditStatusId(status.id);
    setEditStatusName(status.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editStatusName.trim()) return;
    
    try {
      await updateStatus({ id, status: { name: editStatusName } }).unwrap();
      showSuccessToast("Status updated successfully");
      setEditStatusId(null);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to update status");
    }
  };

  const handleCancelEdit = () => {
    setEditStatusId(null);
  };

  const handleDeleteClick = (status: StatusEntity) => {
    setStatusToDelete(status);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!statusToDelete) return;
    
    try {
      await deleteStatus(statusToDelete.id).unwrap();
      showSuccessToast("Status deleted successfully");
      setDeleteDialogOpen(false);
      setStatusToDelete(null);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to delete status");
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

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the status
                &quot;{statusToDelete?.name}&quot; from your account.
                This could affect entities that are currently using this status.
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          Status Options
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Manage status options that can be used across the application
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add new status..."
          value={newStatusName}
          onChange={(e) => setNewStatusName(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          onClick={handleAddStatus} 
          disabled={isCreating || !newStatusName.trim()}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Status
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
            {statuses?.map((status) => (
              <tr key={status.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editStatusId === status.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={editStatusName}
                        onChange={(e) => setEditStatusName(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveEdit(status.id)}
                        disabled={isUpdating || !editStatusName.trim()}
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
                      {status.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(status.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStatus(status)}
                      disabled={editStatusId !== null}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(status)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {statuses?.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No status options found. Add your first one now.
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
              This action cannot be undone. This will permanently delete the status
              &quot;{statusToDelete?.name}&quot; from your account.
              This could affect entities that are currently using this status.
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