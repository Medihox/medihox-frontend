"use client";

import { useState, useEffect, useRef } from "react"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Loader2, ImagePlus, Trash2, AlertCircle, Check } from "lucide-react";
import { 
  useGetAllServicesQuery,
  useGetAllStatusQuery 
} from "@/lib/redux/services/customizationApi";
import { 
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation 
} from "@/lib/redux/services/appointmentApi";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import Image from "next/image";

interface Patient {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  city?: string;
  country?: string;
}

interface Converted {
  id: string;
  patient?: Patient;
  patientId?: string;
  date: string;
  time?: string;
  status: string;
  notes?: string;
  service: string;
  source: string;
  createdAt: string;
  beforeImages?: string[];
  afterImages?: string[];
}

interface ConvertedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  convertedData?: Converted;
  onSave?: () => void;
}

export function ConvertedDialog({ 
  open, 
  onOpenChange,
  convertedData,
  onSave
}: ConvertedDialogProps) {
  // Refs for file inputs
  const beforeImagesInputRef = useRef<HTMLInputElement>(null);
  const afterImagesInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch services and statuses
  const { data: services, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: statuses, isLoading: isLoadingStatuses } = useGetAllStatusQuery();
  
  // Mutations
  const [updateConverted, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  
  // Form state
  const [patientInfo, setPatientInfo] = useState<Patient>({
    name: "",
    email: "",
    phoneNumber: "",
    city: "",
    country: ""
  });
  
  // Treatment details state
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  
  // Images state
  const [beforeImages, setBeforeImages] = useState<File[]>([]);
  const [afterImages, setAfterImages] = useState<File[]>([]);
  const [beforeImagePreviews, setBeforeImagePreviews] = useState<string[]>([]);
  const [afterImagePreviews, setAfterImagePreviews] = useState<string[]>([]);
  const [existingBeforeImages, setExistingBeforeImages] = useState<string[]>([]);
  const [existingAfterImages, setExistingAfterImages] = useState<string[]>([]);
  
  // UI state
  const [currentTab, setCurrentTab] = useState("details");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open && convertedData) {
      // Set basic fields
      setPatientInfo({
        id: convertedData.patient?.id,
        name: convertedData.patient?.name || "",
        email: convertedData.patient?.email || "",
        phoneNumber: convertedData.patient?.phoneNumber || "",
        city: convertedData.patient?.city || "",
        country: convertedData.patient?.country || ""
      });
      
      setService(convertedData.service || "");
      setStatus(convertedData.status || "");
      setSource(convertedData.source || "");
      setNotes(convertedData.notes || "");
      
      // Handle date
      if (convertedData.date) {
        try {
          setDate(new Date(convertedData.date));
        } catch (e) {
          console.error("Invalid date:", convertedData.date);
        }
      } else {
        setDate(undefined);
      }
      
      // Set time
      setTime(convertedData.time || "");
      
      // Set existing images
      setExistingBeforeImages(convertedData.beforeImages || []);
      setExistingAfterImages(convertedData.afterImages || []);
      
      // Clear new file uploads
      setBeforeImages([]);
      setAfterImages([]);
      setBeforeImagePreviews([]);
      setAfterImagePreviews([]);
    } else if (!open) {
      // Reset form when closing
      resetForm();
    }
  }, [open, convertedData]);
  
  // Clean up image preview URLs when component unmounts
  useEffect(() => {
    return () => {
      beforeImagePreviews.forEach(url => URL.revokeObjectURL(url));
      afterImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [beforeImagePreviews, afterImagePreviews]);
  
  const resetForm = () => {
    setPatientInfo({
      name: "",
      email: "",
      phoneNumber: "",
      city: "",
      country: ""
    });
    setService("");
    setStatus("");
    setSource("");
    setNotes("");
    setDate(undefined);
    setTime("");
    setBeforeImages([]);
    setAfterImages([]);
    setBeforeImagePreviews([]);
    setAfterImagePreviews([]);
    setExistingBeforeImages([]);
    setExistingAfterImages([]);
    setCurrentTab("details");
    setValidationErrors({});
  };
  
  // Handle patient info changes
  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle before images upload
  const handleBeforeImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Create preview URLs for new files
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setBeforeImages(prev => [...prev, ...files]);
      setBeforeImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  // Handle after images upload
  const handleAfterImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Create preview URLs for new files
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setAfterImages(prev => [...prev, ...files]);
      setAfterImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  // Delete before image preview
  const deleteBeforeImage = (index: number) => {
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(beforeImagePreviews[index]);
    
    setBeforeImages(prev => prev.filter((_, i) => i !== index));
    setBeforeImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Delete after image preview
  const deleteAfterImage = (index: number) => {
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(afterImagePreviews[index]);
    
    setAfterImages(prev => prev.filter((_, i) => i !== index));
    setAfterImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Delete existing before image
  const deleteExistingBeforeImage = (index: number) => {
    setExistingBeforeImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Delete existing after image
  const deleteExistingAfterImage = (index: number) => {
    setExistingAfterImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!patientInfo.name) errors.name = "Patient name is required";
    if (!patientInfo.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!service) errors.service = "Service is required";
    if (!status) errors.status = "Status is required";
    if (!source) errors.source = "Source is required";
    if (!date) errors.date = "Date is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!convertedData?.id) {
      toast.error("Invalid converted record");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process any new images
      const processedBeforeImages = await Promise.all(beforeImages.map(file => convertFileToBase64(file)));
      const processedAfterImages = await Promise.all(afterImages.map(file => convertFileToBase64(file)));
      
      // Combine with existing images that weren't deleted
      const allBeforeImages = [...existingBeforeImages, ...processedBeforeImages];
      const allAfterImages = [...existingAfterImages, ...processedAfterImages];
      
      // Format date and time
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      
      // Prepare update data
      const updateData = {
        patient: {
          ...patientInfo
        },
        service,
        status,
        source,
        notes,
        date: formattedDate,
        time,
        beforeImages: allBeforeImages,
        afterImages: allAfterImages
      };
      
      // Call API to update the converted record
      await updateConverted({
        id: convertedData.id,
        appointment: updateData
      }).unwrap();
      
      toast.success("Converted record updated successfully");
      
      // Call onSave callback if provided
      if (onSave) {
        onSave();
      }
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update converted record");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Converted Record</DialogTitle>
          <DialogDescription>
            Update converted patient details and treatment images
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="details" 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details">Patient & Appointment</TabsTrigger>
            <TabsTrigger value="before">Before Images</TabsTrigger>
            <TabsTrigger value="after">After Images</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto py-4">
            <TabsContent value="details" className="space-y-6 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Patient Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={patientInfo.name}
                    onChange={handlePatientChange}
                    disabled={convertedData?.patientId !== undefined}
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-red-500">{validationErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={patientInfo.phoneNumber}
                    onChange={handlePatientChange}
                    disabled={convertedData?.patientId !== undefined}
                    className={validationErrors.phoneNumber ? "border-red-500" : ""}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="text-xs text-red-500">{validationErrors.phoneNumber}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={patientInfo.email}
                    onChange={handlePatientChange}
                    disabled={convertedData?.patientId !== undefined}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">
                    Service <span className="text-red-500">*</span>
                  </Label>
                  {isLoadingServices ? (
                    <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Loading services...</span>
                    </div>
                  ) : (
                    <select
                      id="service"
                      value={service}
                      onChange={(e) => {
                        setService(e.target.value);
                        if (validationErrors.service) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.service;
                            return newErrors;
                          });
                        }
                      }}
                      className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-gray-950 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                        validationErrors.service ? "border-red-500" : "border-gray-200 dark:border-gray-800"
                      )}
                    >
                      <option value="">Select a service</option>
                      {services?.map((svc) => (
                        <option key={svc.id} value={svc.name}>
                          {svc.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {validationErrors.service && (
                    <p className="text-xs text-red-500">{validationErrors.service}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  {isLoadingStatuses ? (
                    <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Loading statuses...</span>
                    </div>
                  ) : (
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        if (validationErrors.status) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.status;
                            return newErrors;
                          });
                        }
                      }}
                      className={cn(
                        "w-full px-3 py-2 bg-white dark:bg-gray-950 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                        validationErrors.status ? "border-red-500" : "border-gray-200 dark:border-gray-800"
                      )}
                    >
                      <option value="">Select a status</option>
                      {statuses?.filter(sts => 
                        sts.name.toLowerCase().includes('convert')
                      ).map((sts) => (
                        <option key={sts.id} value={sts.name}>
                          {sts.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {validationErrors.status && (
                    <p className="text-xs text-red-500">{validationErrors.status}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">
                    Source <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="source"
                    value={source}
                    onChange={(e) => {
                      setSource(e.target.value);
                      if (validationErrors.source) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.source;
                          return newErrors;
                        });
                      }
                    }}
                    className={cn(
                      "w-full px-3 py-2 bg-white dark:bg-gray-950 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                      validationErrors.source ? "border-red-500" : "border-gray-200 dark:border-gray-800"
                    )}
                  >
                    <option value="">Select a source</option>
                    <option value="WEBSITE">Website</option>
                    <option value="DIRECT_CALL">Direct Call</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="WALK_IN">Walk-in</option>
                    <option value="EMAIL">Email</option>
                  </select>
                  {validationErrors.source && (
                    <p className="text-xs text-red-500">{validationErrors.source}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                          validationErrors.date ? "border-red-500" : ""
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          setDatePickerOpen(false);
                          if (validationErrors.date) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.date;
                              return newErrors;
                            });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {validationErrors.date && (
                    <p className="text-xs text-red-500">{validationErrors.date}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes about this converted record"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="before" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Before Treatment Images</h3>
                  <Input
                    ref={beforeImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleBeforeImagesUpload}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => beforeImagesInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </div>
                
                {/* Existing before images */}
                {existingBeforeImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Existing Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {existingBeforeImages.map((imageUrl, index) => (
                        <div key={`existing-before-${index}`} className="relative group">
                          <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={imageUrl}
                              alt={`Before treatment ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteExistingBeforeImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New before images */}
                {beforeImagePreviews.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">New Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {beforeImagePreviews.map((previewUrl, index) => (
                        <div key={`new-before-${index}`} className="relative group">
                          <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={previewUrl}
                              alt={`New before treatment ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteBeforeImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {existingBeforeImages.length === 0 && beforeImagePreviews.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <ImagePlus className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No before treatment images yet</p>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="mt-2"
                      onClick={() => beforeImagesInputRef.current?.click()}
                    >
                      Upload Images
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="after" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">After Treatment Images</h3>
                  <Input
                    ref={afterImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAfterImagesUpload}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => afterImagesInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </div>
                
                {/* Existing after images */}
                {existingAfterImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Existing Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {existingAfterImages.map((imageUrl, index) => (
                        <div key={`existing-after-${index}`} className="relative group">
                          <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={imageUrl}
                              alt={`After treatment ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteExistingAfterImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New after images */}
                {afterImagePreviews.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">New Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {afterImagePreviews.map((previewUrl, index) => (
                        <div key={`new-after-${index}`} className="relative group">
                          <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={previewUrl}
                              alt={`New after treatment ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteAfterImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {existingAfterImages.length === 0 && afterImagePreviews.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <ImagePlus className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No after treatment images yet</p>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="mt-2"
                      onClick={() => afterImagesInputRef.current?.click()}
                    >
                      Upload Images
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={isSubmitting || isLoadingServices || isLoadingStatuses}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
