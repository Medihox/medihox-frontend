"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CalendarIcon, Clock, Upload, Image as ImageIcon, X } from "lucide-react";
import { 
  useGetAllServicesQuery,
  useGetAllStatusQuery 
} from "@/lib/redux/services/customizationApi";
import { 
  useCreateAppointmentMutation, 
  useUpdateAppointmentMutation, 
  CreateAppointmentRequest 
} from "@/lib/redux/services/appointmentApi";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  inquiryId?: string;
}

interface Inquiry {
  id: string;
  patient?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  status: string;
  service: string;
  source: string;
  notes?: string;
  createdAt?: string;
  date?: string;
  time?: string;
  beforeImages?: string[];
  afterImages?: string[];
}

export function InquiryDialog({ 
  open, 
  onOpenChange,
  initialData,
  inquiryId
}: InquiryDialogProps) {
  // Fetch services and status options from API
  const { data: services, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: statuses, isLoading: isLoadingStatuses } = useGetAllStatusQuery();
  
  // API mutations
  const [createInquiry] = useCreateAppointmentMutation();
  const [updateInquiry] = useUpdateAppointmentMutation();
  
  // File input refs
  const beforeImagesRef = useRef<HTMLInputElement>(null);
  const afterImagesRef = useRef<HTMLInputElement>(null);
  
  // Initialize form state
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
    afterImages: [] as File[],
  });
  
  // UI state for showing previews
  const [beforeImagePreviews, setBeforeImagePreviews] = useState<string[]>([]);
  const [afterImagePreviews, setAfterImagePreviews] = useState<string[]>([]);
  
  // Track which fields have been modified
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to check if the current status is an appointment type
  const [isAppointmentStatus, setIsAppointmentStatus] = useState(false);
  
  // State to check if the status is "CONVERTED"
  const [isConvertedStatus, setIsConvertedStatus] = useState(false);
  
  // Check if the selected status is appointment or converted type
  useEffect(() => {
    if (statuses && formData.status) {
      const selectedStatus = statuses.find(s => s.id === formData.status);
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
  
  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (initialData) {
      // Find service and status IDs that match the names
      const serviceId = services?.find(s => s.name === initialData.service)?.id || "";
      const statusId = statuses?.find(s => s.name === initialData.status)?.id || "";
      
      // Parse date and time from the date string if it's in ISO format
      let dateObj = new Date();
      let timeString = "";
      
      if (initialData.date) {
        try {
          // Try to parse as ISO date
          const parsedDate = new Date(initialData.date);
          
          if (!isNaN(parsedDate.getTime())) {
            dateObj = parsedDate;
            
            // Extract time as HH:MM format for the time input
            const hours = String(parsedDate.getHours()).padStart(2, '0');
            const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
            timeString = `${hours}:${minutes}`;
          }
        } catch (e) {
          // If parsing fails, use current date
          console.error("Failed to parse date:", initialData.date);
        }
      }
      
      // Set initial image URLs if they exist
      if (initialData.beforeImages && initialData.beforeImages.length > 0) {
        setBeforeImagePreviews(initialData.beforeImages);
      }
      
      if (initialData.afterImages && initialData.afterImages.length > 0) {
        setAfterImagePreviews(initialData.afterImages);
      }
      
      setFormData({
        patientName: initialData.patient?.name || "",
        patientEmail: initialData.patient?.email || "",
        patientPhone: initialData.patient?.phoneNumber || "",
        service: serviceId,
        status: statusId,
        source: initialData.source || "",
        notes: initialData.notes || "",
        date: dateObj,
        // Use extracted time if available, otherwise fallback to initialData.time or empty string
        time: timeString || initialData.time || "",
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
  }, [initialData, open, services, statuses]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Find selected service and status
      const selectedService = services?.find(s => s.id === formData.service);
      const selectedStatus = statuses?.find(s => s.id === formData.status);
      
      // Prepare the base data structure for patient info
      let patientData: Record<string, any> = {};
      
      // Only include patient fields that were modified
      if (modifiedFields.has('patientName')) patientData.name = formData.patientName;
      if (modifiedFields.has('patientEmail')) patientData.email = formData.patientEmail;
      if (modifiedFields.has('patientPhone')) patientData.phoneNumber = formData.patientPhone;
      
      // Initialize update data object
      const updateData: Record<string, any> = {};
      
      // Only add patient data if any patient field was modified
      if (Object.keys(patientData).length > 0) {
        updateData.patient = patientData;
      }
      
      // Handle date and time fields
      if (isAppointmentStatus && (modifiedFields.has('date') || modifiedFields.has('time'))) {
        // Create a date object from the selected date
        const dateObj = new Date(formData.date);
        
        // Parse time string (HH:MM) and set hours and minutes
        if (formData.time) {
          const [hours, minutes] = formData.time.split(':').map(Number);
          dateObj.setHours(hours, minutes);
        }
        
        // Add the formatted date to the update data
        updateData.date = dateObj.toISOString();
      } else if (modifiedFields.has('date')) {
        // For non-appointment statuses, still update the date if it was modified
        updateData.date = new Date().toISOString();
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
      
      // Add other fields only if they were modified
      if (modifiedFields.has('service')) updateData.service = selectedService?.name || formData.service;
      if (modifiedFields.has('status')) updateData.status = selectedStatus?.name || formData.status;
      if (modifiedFields.has('source')) updateData.source = formData.source;
      if (modifiedFields.has('notes')) updateData.notes = formData.notes;
      
      // For new inquiries, ensure required fields are present
      if (!inquiryId) {
        // Make sure we always have patient data for new inquiries
        if (!updateData.patient) {
          updateData.patient = {
            name: formData.patientName,
            email: formData.patientEmail,
            phoneNumber: formData.patientPhone
          };
        }
        
        // Ensure all required fields are present for new inquiries (CreateAppointmentRequest type requirements)
        if (!updateData.status) updateData.status = selectedStatus?.name || formData.status;
        if (!updateData.service) updateData.service = selectedService?.name || formData.service;
        if (!updateData.source) updateData.source = formData.source;
        if (!updateData.date) {
          updateData.date = isAppointmentStatus 
            ? (() => {
                const dateObj = new Date(formData.date);
                if (formData.time) {
                  const [hours, minutes] = formData.time.split(':').map(Number);
                  dateObj.setHours(hours, minutes);
                }
                return dateObj.toISOString();
              })()
            : new Date().toISOString();
        }
      }
      
      // Create or update based on whether we have an ID
      if (inquiryId) {
        await updateInquiry({
          id: inquiryId,
          appointment: updateData
        }).unwrap();
        toast.success("Inquiry updated successfully");
      } else {
        // Construct a valid CreateAppointmentRequest object
        const appointmentRequest: CreateAppointmentRequest = {
          patient: updateData.patient,
          status: updateData.status,
          service: updateData.service,
          source: updateData.source,
          date: updateData.date,
          time: updateData.time,
          notes: updateData.notes,
          beforeImages: updateData.beforeImages,
          afterImages: updateData.afterImages
        };
        
        await createInquiry(appointmentRequest).unwrap();
        toast.success("Inquiry created successfully");
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to save inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {inquiryId ? "Edit Inquiry" : "New Inquiry"}
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
              
              {/* Appointment Date Selector - Only show when appointment status is selected */}
              {isAppointmentStatus && (
                <>
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
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" /> 
                      Please set both date and time for the appointment.
                    </p>
                  </div>
                </>
              )}
              
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
                    {inquiryId ? "Updating Inquiry..." : "Creating Inquiry..."}
                  </>
                ) : (
                  inquiryId ? "Update Inquiry" : "Create Inquiry"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 