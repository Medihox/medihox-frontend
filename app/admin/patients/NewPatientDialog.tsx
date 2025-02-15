"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Patient {
  name: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  city: string;
  country: string;
  converted: boolean;
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
  patient?: Patient; // For editing an existing patient
}

export function NewPatientDialog({ open, onOpenChange, patient }: NewPatientDialogProps) {
  const [newPatient, setNewPatient] = useState<Partial<Patient>>(
    patient || {
      name: "",
      email: "",
      phoneNumber: "",
      whatsappNumber: "",
      city: "",
      country: "",
      converted: false,
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
    onOpenChange(false); // Close the dialog
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
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
              <Input
                id="name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={newPatient.phoneNumber}
                onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsappNumber" className="text-gray-700 dark:text-gray-300">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={newPatient.whatsappNumber}
                onChange={(e) => setNewPatient({ ...newPatient, whatsappNumber: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">City</Label>
              <Input
                id="city"
                value={newPatient.city}
                onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">Country</Label>
              <Input
                id="country"
                value={newPatient.country}
                onChange={(e) => setNewPatient({ ...newPatient, country: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="converted" className="text-gray-700 dark:text-gray-300">Converted</Label>
            <Checkbox
              id="converted"
              checked={newPatient.converted}
              onCheckedChange={(checked) => setNewPatient({ ...newPatient, converted: checked as boolean })}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>
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