"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateSuperAdminUserMutation } from "@/lib/redux/services/superAdminApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { AdminForm } from "./AdminForm";
import { AdminUser } from "@/lib/redux/services/superAdminApi";

interface EditAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminData: AdminUser | null;
  onSuccess?: () => void;
}

export function EditAdminDialog({ 
  open, 
  onOpenChange, 
  adminData, 
  onSuccess 
}: EditAdminDialogProps) {
  const [updateAdmin, { isLoading }] = useUpdateSuperAdminUserMutation();

  const handleSubmit = async (formData: any) => {
    if (!adminData?.id) return;

    try {
      if (!formData.name || !formData.email) {
        showErrorToast("Please fill in all required fields");
        return;
      }

      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organizationName: formData.organizationName,
        status: formData.status,
      };

      await updateAdmin({ 
        id: adminData.id, 
        user: updateData
      }).unwrap();

      showSuccessToast("Admin updated successfully");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to update admin");
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
        </DialogHeader>
        {adminData && (
          <AdminForm
            initialData={adminData}
            isSubmitting={isLoading}
            onSubmit={handleSubmit}
            submitLabel="Update Admin"
            isPasswordRequired={false}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 