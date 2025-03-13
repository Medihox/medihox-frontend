"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CalendarIcon, Clock, Upload, Image as ImageIcon, X } from "lucide-react";
import { 
  useCreateAppointmentMutation, 
  useUpdateAppointmentMutation, 
  useDeleteAppointmentMutation,
  CreateAppointmentRequest,
  UpdateAppointmentRequest
} from "@/lib/redux/services/appointmentApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { 
  useGetAllServicesQuery,
  useGetAllStatusQuery 
} from "@/lib/redux/services/customizationApi";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  patient?: {
    name: string;
    email: string;
    phoneNumber: string;
    city?: string;
  };
  date: string;
  time?: string;
  service: string;
  status: string;
  source: string;
  notes?: string;
  createdAt: string;
  beforeImages?: string[];
  afterImages?: string[];
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  onSave?: (data: any) => void;
}

export function AppointmentDialog({ 
  open, 
  onOpenChange, 
  appointment,
  onSave 
}: AppointmentDialogProps) {
  // API hooks
  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  
  // Fetch custom status and service options
  const { data: services, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: statuses, isLoading: isLoadingStatuses } = useGetAllStatusQuery();
  
  // Form state
  const [formData, setFormData] = useState({
      patientName: "",
      patientEmail: "",
      patientPhone: "",
    service: "",
    status: "",
    source: "",
    notes: "",
    date: new Date(),
      time: "",
    beforeImages: [] as File[],
    afterImages: [] as File[]
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAppointmentStatus, setIsAppointmentStatus] = useState(true); // Default true for appointments
  const [isConvertedStatus, setIsConvertedStatus] = useState(false);
  
  // Image state
  const [beforeImagePreviews, setBeforeImagePreviews] = useState<string[]>([]);
  const [afterImagePreviews, setAfterImagePreviews] = useState<string[]>([]);
  
  // Track modified fields
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  
  // File input refs
  const beforeImagesRef = useRef<HTMLInputElement>(null);
  const afterImagesRef = useRef<HTMLInputElement>(null);
  
  // Check if the selected status is appointment or converted type
  useEffect(() => {
    if (statuses && formData.status) {
      const selectedStatus = statuses.find(s => s.id === formData.status || s.name === formData.status);
      if (selectedStatus) {
        const statusName = selectedStatus.name.toLowerCase();
        
        // Check for appointment status
        setIsAppointmentStatus(
          statusName.includes('appointment') || 
          statusName.includes('scheduled') || 
          statusName.includes('confirmed')
        );
        
        // Check for converted status
        setIsConvertedStatus(
          statusName.includes('convert') || 
          selectedStatus.name === "CONVERTED"
        );
      }
    }
  }, [formData.status, statuses]);
  
  // Initialize form from appointment data
  useEffect(() => {
    if (appointment) {
      // Find service and status IDs that match the names
      const serviceId = services?.find(s => s.name === appointment.service)?.id || appointment.service;
      const statusId = statuses?.find(s => s.name === appointment.status)?.id || appointment.status;
      
      // Parse date and time from the date string if it's in ISO format
      let dateObj = new Date();
      let timeString = "";
      
      if (appointment.date) {
        try {
          // Try to parse as ISO date
          const parsedDate = new Date(appointment.date);
          
          if (!isNaN(parsedDate.getTime())) {
            dateObj = parsedDate;
            
            // Extract time as HH:MM format for the time input
            const hours = String(parsedDate.getHours()).padStart(2, '0');
            const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
            timeString = `${hours}:${minutes}`;
          }
        } catch (e) {
          console.error("Failed to parse date:", appointment.date);
        }
      }
      
      // Set initial image URLs if they exist
      if (appointment.beforeImages && appointment.beforeImages.length > 0) {
        setBeforeImagePreviews(appointment.beforeImages);
      }
      
      if (appointment.afterImages && appointment.afterImages.length > 0) {
        setAfterImagePreviews(appointment.afterImages);
      }
      
      setFormData({
        patientName: appointment.patient?.name || "",
        patientEmail: appointment.patient?.email || "",
        patientPhone: appointment.patient?.phoneNumber || "",
        service: serviceId,
        status: statusId,
        source: appointment.source || "",
        notes: appointment.notes || "",
        date: dateObj,
        time: timeString || appointment.time || "",
        beforeImages: [],
        afterImages: []
      });
      
      // Reset modified fields tracking when opening the dialog
      setModifiedFields(new Set());
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
        date: new Date(),
        time: "",
        beforeImages: [],
        afterImages: []
      });
      
      // Clear image previews
      setBeforeImagePreviews([]);
      setAfterImagePreviews([]);
      
      // Reset modified fields tracking when opening the dialog
      setModifiedFields(new Set());
    }
  }, [appointment, open, services, statuses]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Track which field was modified
    setModifiedFields(prev => {
      const updated = new Set(prev);
      updated.add(name);
      return updated;
    });
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Track that date was modified
      setModifiedFields(prev => {
        const updated = new Set(prev);
        updated.add('date');
        return updated;
      });
      
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };
  
  // Handle image file uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Create preview URLs for the selected images
      const previewURLs = files.map(file => URL.createObjectURL(file));
      
      if (type === 'before') {
        setBeforeImagePreviews(prev => [...prev, ...previewURLs]);
        setFormData(prev => ({
          ...prev,
          beforeImages: [...prev.beforeImages, ...files]
        }));
        setModifiedFields(prev => {
          const updated = new Set(prev);
          updated.add('beforeImages');
          return updated;
        });
      } else {
        setAfterImagePreviews(prev => [...prev, ...previewURLs]);
        setFormData(prev => ({
          ...prev,
          afterImages: [...prev.afterImages, ...files]
        }));
        setModifiedFields(prev => {
          const updated = new Set(prev);
          updated.add('afterImages');
          return updated;
        });
      }
    }
  };
  
  // Remove image from preview and form data
  const removeImage = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      // Revoke the preview URL to prevent memory leaks
      URL.revokeObjectURL(beforeImagePreviews[index]);
      
      // Remove from previews and form data
      setBeforeImagePreviews(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        beforeImages: prev.beforeImages.filter((_, i) => i !== index)
      }));
    } else {
      // Revoke the preview URL
      URL.revokeObjectURL(afterImagePreviews[index]);
      
      // Remove from previews and form data
      setAfterImagePreviews(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        afterImages: prev.afterImages.filter((_, i) => i !== index)
      }));
    }
    
    // Mark the field as modified
    setModifiedFields(prev => {
      const updated = new Set(prev);
      updated.add(type === 'before' ? 'beforeImages' : 'afterImages');
      return updated;
    });
  };
  
  // Helper function to convert File objects to Base64 strings
  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    
    return Promise.all(promises);
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Find selected service and status
      const selectedService = services?.find(s => s.id === formData.service || s.name === formData.service);
      const selectedStatus = statuses?.find(s => s.id === formData.status || s.name === formData.status);
      
      // Prepare the base data structure for patient info
      let patientData: Record<string, any> = {};
      
      // Only include patient fields that were modified or for new appointments
      if (!appointment || modifiedFields.has('patientName')) patientData.name = formData.patientName;
      if (!appointment || modifiedFields.has('patientEmail')) patientData.email = formData.patientEmail;
      if (!appointment || modifiedFields.has('patientPhone')) patientData.phoneNumber = formData.patientPhone;
      
      // Initialize update data object
      const updateData: Record<string, any> = {};
      
      // Only add patient data if any patient field was modified or for new appointments
      if (!appointment || Object.keys(patientData).length > 0) {
        updateData.patient = patientData;
      }
      
      // Handle date and time fields
      if (!appointment || modifiedFields.has('date') || modifiedFields.has('time')) {
        // Create a date object from the selected date
        const dateObj = new Date(formData.date);
        
        // Parse time string (HH:MM) and set hours and minutes
        if (formData.time) {
          const [hours, minutes] = formData.time.split(':').map(Number);
        dateObj.setHours(hours, minutes);
        }
        
        // Add the formatted date to the update data
        updateData.date = dateObj.toISOString();
      }
      
      // Handle image uploads for CONVERTED status
      if (isConvertedStatus) {
        // Only update before images if they were modified and there are images
        if (modifiedFields.has('beforeImages') && formData.beforeImages.length > 0) {
          // Convert files to base64 for API submission
          const base64BeforeImages = await convertFilesToBase64(formData.beforeImages);
          updateData.beforeImages = base64BeforeImages;
        }
        
        // Only update after images if they were modified and there are images
        if (modifiedFields.has('afterImages') && formData.afterImages.length > 0) {
          // Convert files to base64 for API submission
          const base64AfterImages = await convertFilesToBase64(formData.afterImages);
          updateData.afterImages = base64AfterImages;
        }
      }
      
      // Add other fields only if they were modified or for new appointments
      if (!appointment || modifiedFields.has('service')) updateData.service = selectedService?.name || formData.service;
      if (!appointment || modifiedFields.has('status')) updateData.status = selectedStatus?.name || formData.status;
      if (!appointment || modifiedFields.has('source')) updateData.source = formData.source;
      if (!appointment || modifiedFields.has('notes')) updateData.notes = formData.notes;
      
      if (appointment) {
        // Update existing appointment
        await updateAppointment({
          id: appointment.id,
          appointment: updateData as UpdateAppointmentRequest
        }).unwrap();
        
        toast.success("Appointment updated successfully");
      } else {
        // Creating new appointment - ensure all required fields are present
        if (!updateData.patient) {
          updateData.patient = {
            name: formData.patientName,
            email: formData.patientEmail,
            phoneNumber: formData.patientPhone
          };
        }
        
        // Ensure required fields for new appointments
        updateData.status = selectedStatus?.name || formData.status;
        updateData.service = selectedService?.name || formData.service;
        updateData.source = formData.source;
        
        // Set date properly for new appointments
        if (!updateData.date) {
          const dateObj = new Date(formData.date);
          if (formData.time) {
            const [hours, minutes] = formData.time.split(':').map(Number);
            dateObj.setHours(hours, minutes);
          }
          updateData.date = dateObj.toISOString();
        }
        
        await createAppointment(updateData as CreateAppointmentRequest).unwrap();
        toast.success("Appointment created successfully");
      }
      
      // Call onSave if provided
      if (onSave) {
        onSave(updateData);
      }
      
      // Reset and close dialog
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to save appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto no-scrollbar pr-1 -mr-1">
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
                  disabled={!!appointment} // Disabled if editing existing appointment
                  className={appointment ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}
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
                  disabled={!!appointment}
                  className={appointment ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}
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
                  disabled={!!appointment}
                  className={appointment ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}
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
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="PHONE">Phone</option>
                  <option value="EMAIL">Email</option>
                  <option value="DIRECT_CALL">Direct Call</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="WALK_IN">Walk-in</option>
                </select>
                </div>
                
              {/* Date and Time Selectors */}
              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Appointment Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Select time"
                  />
                </div>
              </div>
              
              {/* Before and After Images - Only show when CONVERTED status is selected */}
              {isConvertedStatus && (
                <>
                  <div className="col-span-2">
                    <div className="border border-dashed rounded-md p-4 mt-4">
                      <h3 className="text-md font-medium mb-2">Before Treatment Images</h3>
                      
                      {/* Image previews */}
                      {beforeImagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {beforeImagePreviews.map((src, index) => (
                            <div key={`before-${index}`} className="relative group">
                              <div className="h-24 w-full rounded-md overflow-hidden border">
                                <img 
                                  src={src} 
                                  alt={`Before treatment ${index + 1}`} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index, 'before')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => beforeImagesRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Images
                        </Button>
                        <input
                          ref={beforeImagesRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'before')}
                        />
                        <span className="text-sm text-gray-500">
                          {beforeImagePreviews.length} {beforeImagePreviews.length === 1 ? 'image' : 'images'} selected
                        </span>
                      </div>
                    </div>
                </div>
                
                  <div className="col-span-2">
                    <div className="border border-dashed rounded-md p-4">
                      <h3 className="text-md font-medium mb-2">After Treatment Images</h3>
                      
                      {/* Image previews */}
                      {afterImagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {afterImagePreviews.map((src, index) => (
                            <div key={`after-${index}`} className="relative group">
                              <div className="h-24 w-full rounded-md overflow-hidden border">
                                <img 
                                  src={src} 
                                  alt={`After treatment ${index + 1}`} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index, 'after')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => afterImagesRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Images
                        </Button>
                        <input
                          ref={afterImagesRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'after')}
                        />
                        <span className="text-sm text-gray-500">
                          {afterImagePreviews.length} {afterImagePreviews.length === 1 ? 'image' : 'images'} selected
                        </span>
                      </div>
                    </div>
                  </div>
                </>
                  )}
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

            <div className="flex justify-end gap-3 pt-2">
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
                    {appointment ? "Updating Appointment..." : "Creating Appointment..."}
                        </>
                      ) : (
                  appointment ? "Update Appointment" : "Create Appointment"
                      )}
                    </Button>
                </div>
          </form>
              </div>
      </DialogContent>
    </Dialog>
  );
} 