"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { 
  useGetAllServicesQuery,
  useGetAllStatusQuery 
} from "@/lib/redux/services/customizationApi";
import { useCreateAppointmentMutation, useUpdateAppointmentMutation } from "@/lib/redux/services/appointmentApi";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnquiry?: boolean;
  initialData?: any;
  appointmentId?: string;
}

export function NewAppointmentDialog({ 
  open, 
  onOpenChange,
  isEnquiry = false,
  initialData,
  appointmentId
}: NewAppointmentDialogProps) {
  // Fetch services and status options from API
  const { data: services, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: statuses, isLoading: isLoadingStatuses } = useGetAllStatusQuery();
  
  // Add update mutation
  const [createAppointment] = useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  
  // Initialize form state from initial data if provided
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    service: "",
    status: "",
    source: "",
    notes: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (initialData) {
      // Find service and status IDs that match the names
      const serviceId = services?.find(s => s.name === initialData.service)?.id || "";
      const statusId = statuses?.find(s => s.name === initialData.status)?.id || "";
      
      setFormData({
        patientName: initialData.patient?.name || "",
        patientEmail: initialData.patient?.email || "",
        patientPhone: initialData.patient?.phoneNumber || "",
        service: serviceId,
        status: statusId,
        source: initialData.source || "",
        notes: initialData.notes || ""
      });
    } else if (open) {
      // Reset form when opening without initial data
      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        service: "",
        status: "",
        source: "",
        notes: "",
      });
    }
  }, [initialData, open, services, statuses]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Find selected service and status
      const selectedService = services?.find(s => s.id === formData.service);
      const selectedStatus = statuses?.find(s => s.id === formData.status);
      
      // Format data for API
      const appointmentData = {
        patient: {
          name: formData.patientName,
          email: formData.patientEmail,
          phoneNumber: formData.patientPhone
        },
        date: new Date().toISOString().split('T')[0],
        service: selectedService?.name || formData.service,
        status: selectedStatus?.name || formData.status,
        source: formData.source,
        notes: formData.notes
      };
      
      // Create or update based on whether we have an ID
      if (appointmentId) {
        await updateAppointment({
          id: appointmentId,
          appointment: appointmentData
        }).unwrap();
        toast.success(isEnquiry ? "Enquiry updated successfully" : "Appointment updated successfully");
      } else {
        await createAppointment(appointmentData).unwrap();
        toast.success(isEnquiry ? "Enquiry created successfully" : "Appointment created successfully");
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {appointmentId 
              ? (isEnquiry ? "Edit Enquiry" : "Edit Appointment") 
              : (isEnquiry ? "New Enquiry" : "New Appointment")
            }
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientEmail">Email</Label>
              <Input
                id="patientEmail"
                name="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientPhone">Phone Number</Label>
              <Input
                id="patientPhone"
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Treatment</Label>
              {isLoadingServices ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Loading treatments...</span>
                </div>
              ) : (
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  required
                >
                  <option value="">Select Treatment</option>
                  {services?.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isLoadingStatuses ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Loading statuses...</span>
                </div>
              ) : (
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  required
                >
                  <option value="">Select Status</option>
                  {statuses?.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                required
              >
                <option value="">Select Source</option>
                <option value="WEBSITE">Website</option>
                <option value="DIRECT_CALL">Direct Call</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="REFERRAL">Referral</option>
                <option value="WALK_IN">Walk-in</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              className="h-20"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || isLoadingServices || isLoadingStatuses}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {appointmentId 
                    ? (isEnquiry ? "Updating Enquiry..." : "Updating...") 
                    : (isEnquiry ? "Creating Enquiry..." : "Creating...")
                  }
                </>
              ) : (
                appointmentId 
                ? (isEnquiry ? "Update Enquiry" : "Update") 
                : (isEnquiry ? "Create Enquiry" : "Create")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}