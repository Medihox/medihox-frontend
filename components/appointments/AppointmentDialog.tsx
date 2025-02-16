"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface Appointment {
  id: string;
  patient: {
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status: string;
  source: string;
  beforeTreatmentImages?: string[];
  afterTreatmentImages?: string[];
  notes: string;
  createdAt: string;
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  onSave: (appointment: Partial<Appointment>) => void;
}

export function AppointmentDialog({ 
  open, 
  onOpenChange, 
  appointment,
  onSave 
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    appointmentDate: "",
    appointmentTime: "",
    service: "",
    status: "",
    source: "",
    notes: "",
    beforeTreatmentImages: [],
    afterTreatmentImages: []
  });

  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        ...appointment,
      });
      setBeforeImages(appointment.beforeTreatmentImages || []);
      setAfterImages(appointment.afterTreatmentImages || []);
    }
  }, [appointment]);

  const handleSave = () => {
    onSave({
      ...formData,
      beforeTreatmentImages: beforeImages,
      afterTreatmentImages: afterImages
    });
    onOpenChange(false);
  };

  const handleBeforeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBeforeImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAfterImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeBeforeImage = (index: number) => {
    setBeforeImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeAfterImage = (index: number) => {
    setAfterImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Update Appointment" : "New Appointment"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Basic Info Section */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Appointment Date</Label>
              <Input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              />
            </div>
          </div>

          {/* Service Section */}
          <div className="grid gap-2">
            <Label>Service</Label>
            <Select
              value={formData.service}
              onValueChange={(value) => setFormData({ ...formData, service: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Checkup">General Checkup</SelectItem>
                <SelectItem value="Dental Care">Dental Care</SelectItem>
                <SelectItem value="Eye Care">Eye Care</SelectItem>
                <SelectItem value="Gynecological Checkup">Gynecological Checkup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status and Source Section */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Enquired">Enquired</SelectItem>
                  <SelectItem value="Followup">Follow Up</SelectItem>
                  <SelectItem value="Cost-Issues">Cost Issues</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes Section */}
          <div className="grid gap-2">
            <Label>Notes</Label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Before Treatment Images Section */}
          <div className="grid gap-2">
            <Label>Before Treatment Images</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {beforeImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Before treatment ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeBeforeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleBeforeImageUpload}
                />
                <ImagePlus className="h-6 w-6 text-gray-400" />
              </label>
            </div>
          </div>

          {/* After Treatment Images Section */}
          <div className="grid gap-2">
            <Label>After Treatment Images</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {afterImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`After treatment ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeAfterImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleAfterImageUpload}
                />
                <ImagePlus className="h-6 w-6 text-gray-400" />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {appointment ? "Update" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 