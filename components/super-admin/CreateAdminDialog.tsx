"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRegisterMutation } from "@/lib/redux/services/authApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { AdminForm } from "./AdminForm";

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateAdminDialog({ open, onOpenChange, onSuccess }: CreateAdminDialogProps) {
  const [registerAdmin, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (formData: any) => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        showErrorToast("Please fill in all required fields");
        return;
      }

      // Use register endpoint for creating admins
      await registerAdmin({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organizationName: formData.organizationName,
        role: "ADMIN",
        password: formData.password
      } as any).unwrap();

      showSuccessToast("Admin created successfully");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to create admin");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
        </DialogHeader>
        <AdminForm
          isSubmitting={isLoading}
          onSubmit={handleSubmit}
          submitLabel="Create Admin"
          isPasswordRequired={true}
        />
      </DialogContent>
    </Dialog>
  );
} 