"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreatePatientMutation, useUpdatePatientMutation } from "@/lib/redux/services/patientApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId?: string;
  initialData?: Partial<{
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
    address?: string;
    status: "ACTIVE" | "INACTIVE" | "CONVERTED" | "DELETED";
  }>;
}

export function NewPatientDialog({ 
  open, 
  onOpenChange, 
  patientId,
  initialData 
}: NewPatientDialogProps) {
  const [newPatient, setNewPatient] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
    whatsappNumber: initialData?.whatsappNumber || "",
    address: initialData?.address || "",
    status: initialData?.status || "ACTIVE",
  });
  
  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  
  const isLoading = isCreating || isUpdating;

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setNewPatient({
        name: initialData.name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        whatsappNumber: initialData.whatsappNumber || "",
        address: initialData.address || "",
        status: initialData.status || "ACTIVE",
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!newPatient.name || !newPatient.email || !newPatient.phoneNumber) {
        showErrorToast("Please fill in all required fields");
        return;
      }
      
      // Format phone numbers with country code
      const phoneNumber = newPatient.phoneNumber.startsWith('+') 
        ? newPatient.phoneNumber 
        : `+91${newPatient.phoneNumber}`;
        
      const whatsappNumber = newPatient.whatsappNumber 
        ? (newPatient.whatsappNumber.startsWith('+') 
            ? newPatient.whatsappNumber 
            : `+91${newPatient.whatsappNumber}`)
        : undefined;
      
      // Prepare data that matches the API validation schema
      const patientData = {
        name: newPatient.name,
        email: newPatient.email,
        phoneNumber,
        whatsappNumber,
        address: newPatient.address || undefined,
        status: newPatient.status
      };
      
      console.log("Submitting patient data:", patientData);
      
      if (patientId) {
        // Update existing patient
        await updatePatient({
          id: patientId,
          patient: patientData
        }).unwrap();
        showSuccessToast("Patient updated successfully");
      } else {
        // Create new patient
        await createPatient(patientData).unwrap();
        showSuccessToast("Patient created successfully");
      }
      onOpenChange(false);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to save patient");
      console.error("Error saving patient:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-gray-100">
            {patientId ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name*
              </Label>
              <Input
                id="name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
                Phone Number* <span className="text-xs">(+91 will be added if missing)</span>
              </Label>
              <Input
                id="phoneNumber"
                value={newPatient.phoneNumber}
                onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                required
                placeholder="e.g. 9876543210"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsappNumber" className="text-gray-700 dark:text-gray-300">
                WhatsApp Number <span className="text-xs">(optional)</span>
              </Label>
              <Input
                id="whatsappNumber"
                value={newPatient.whatsappNumber}
                onChange={(e) => setNewPatient({ ...newPatient, whatsappNumber: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
              Address <span className="text-xs">(optional)</span>
            </Label>
            <Input
              id="address"
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">
              Patient Status
            </Label>
            <Select 
              value={newPatient.status} 
              onValueChange={(value) => setNewPatient({...newPatient, status: value as "ACTIVE" | "INACTIVE" | "CONVERTED" | "DELETED"})}
            >
              <SelectTrigger id="status" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
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
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {patientId ? "Updating..." : "Creating..."}
              </>
            ) : (
              patientId ? "Update" : "Add"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}