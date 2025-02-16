"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface Patient {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  converted: boolean;
  beforeTreatmentImages?: File[];
  afterTreatmentImages?: File[];
  createdById: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
}

interface NewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
}

export function NewPatientDialog({ open, onOpenChange, patient }: NewPatientDialogProps) {
  const [newPatient, setNewPatient] = useState<Partial<Patient>>(
    patient || {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      converted: false,
      beforeTreatmentImages: [],
      afterTreatmentImages: [],
      createdById: {
        id: "",
        name: "",
        email: "",
        role: "admin",
        status: "active",
        createdAt: "",
      },
    }
  );

  const handleSave = () => {
    // Save or update the patient logic here
    onOpenChange(false);
  };

  const handleBeforeImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPatient(prev => ({
        ...prev,
        beforeTreatmentImages: Array.from(e.target.files || [])
      }));
    }
  };

  const handleAfterImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPatient(prev => ({
        ...prev,
        afterTreatmentImages: Array.from(e.target.files || [])
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-gray-100">
            {patient ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={newPatient.phoneNumber}
                onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                Address
              </Label>
              <Input
                id="address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="converted"
                checked={newPatient.converted}
                onCheckedChange={(checked) => 
                  setNewPatient({ ...newPatient, converted: checked as boolean })
                }
              />
              <Label htmlFor="converted" className="text-gray-700 dark:text-gray-300">
                Converted
              </Label>
            </div>
          </div>

          {newPatient.converted && (
            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Before Treatment Images
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBeforeImagesUpload}
                    className="hidden"
                    id="before-images"
                  />
                  <Label
                    htmlFor="before-images"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {newPatient.beforeTreatmentImages?.length || 0} files selected
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  After Treatment Images
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAfterImagesUpload}
                    className="hidden"
                    id="after-images"
                  />
                  <Label
                    htmlFor="after-images"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {newPatient.afterTreatmentImages?.length || 0} files selected
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {patient ? "Update" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}