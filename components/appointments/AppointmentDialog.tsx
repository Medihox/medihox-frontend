"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useCreateAppointmentMutation, useUpdateAppointmentMutation, useDeleteAppointmentMutation } from "@/lib/redux/services/appointmentApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";

interface Appointment {
  id: string;
  patient?: {
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
  };
  date: string;
  time?: string;
  service: string;
  status: string;
  source: string;
  notes?: string;
  createdAt: string;
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  onSave: (data: any) => void;
}

// Form validation schema
const appointmentFormSchema = z.object({
  // Patient information - allow empty strings as well
  patientName: z.string().min(2, "Name must be at least 2 characters").or(z.literal('')),
  patientEmail: z.string().email("Please enter a valid email").or(z.literal('')),
  patientPhone: z.string().min(6, "Phone number must be at least 6 characters").or(z.literal('')),
  
  // Appointment details
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  service: z.string().min(1, "Service is required"),
  source: z.string().min(1, "Source is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof appointmentFormSchema>;

export function AppointmentDialog({ 
  open, 
  onOpenChange, 
  appointment,
  onSave 
}: AppointmentDialogProps) {
  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [activeTab, setActiveTab] = useState("details");
  
  const [resolver, setResolver] = useState(() => zodResolver(appointmentFormSchema));

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver,
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      date: "",
      time: "",
      status: "Scheduled",
      service: "General Checkup",
      source: "WEBSITE",
      notes: ""
    }
  });

  useEffect(() => {
    if (appointment) {
      console.log("Setting form values for editing:", appointment);
      
      // Format date properly - ensure we have a valid date string
      let dateString = "";
      if (appointment.date) {
        try {
          const date = new Date(appointment.date);
          dateString = date.toISOString().split('T')[0];
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }
      
      reset({
        patientName: appointment.patient?.name || "",
        patientEmail: appointment.patient?.email || "",
        patientPhone: appointment.patient?.phoneNumber || "",
        date: dateString,
        time: appointment.time || "",
        status: appointment.status || "Scheduled",
        service: appointment.service || "General Checkup",
        source: appointment.source || "WEBSITE",
        notes: appointment.notes || ""
      }, { keepDefaultValues: false });
    }
  }, [appointment, reset]);

  useEffect(() => {
    // Create a dynamic schema based on whether we're editing or creating
    const schema = appointment 
      ? z.object({
          // Make patient fields optional when updating
          patientName: z.string().optional(),
          patientEmail: z.string().optional(),
          patientPhone: z.string().optional(),
          
          // Required fields for both create and update
          date: z.string().min(1, "Date is required"),
          time: z.string().optional(),
          status: z.string().min(1, "Status is required"),
          service: z.string().min(1, "Service is required"),
          source: z.string().min(1, "Source is required"),
          notes: z.string().optional(),
        })
      : appointmentFormSchema; // Use original schema for create
      
    // Update the resolver with the new schema
    setResolver(() => zodResolver(schema));
    
  }, [appointment]);

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form data:", data);
      
      // Combine date and time into a single ISO string
      let fullDate = data.date;
      if (data.time) {
        const dateObj = new Date(data.date);
        const [hours, minutes] = data.time.split(':').map(Number);
        dateObj.setHours(hours, minutes);
        fullDate = dateObj.toISOString();
      }
      
      if (appointment) {
        // When updating, only include appointment-specific fields
        const appointmentData = {
          status: data.status,
          service: data.service,
          source: data.source,
          date: fullDate,
          notes: data.notes
        };
        
        await updateAppointment({
          id: appointment.id,
          appointment: appointmentData
        }).unwrap();
        
        toast.success("Appointment updated successfully");
      } else {
        // When creating, include patient information
        const appointmentData = {
          patient: {
            name: data.patientName,
            email: data.patientEmail,
            phoneNumber: data.patientPhone
          },
          status: data.status,
          service: data.service,
          source: data.source,
          date: fullDate,
          notes: data.notes
        };
        
        await createAppointment(appointmentData).unwrap();
        toast.success("Appointment created successfully");
      }
      
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error with appointment:", error);
      toast.error(getErrorMessage(error) || `Failed to ${appointment ? 'update' : 'create'} appointment`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Update Appointment" : "New Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="details">Appointment Details</TabsTrigger>
              <TabsTrigger value="patient">Patient Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              {/* Appointment Details */}
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Appointment Date</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register("date")}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm">{errors.date?.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      {...register("time")}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Checkup">General Checkup</SelectItem>
                          <SelectItem value="Dental Care">Dental Care</SelectItem>
                          <SelectItem value="Eye Care">Eye Care</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.service && (
                    <p className="text-red-500 text-sm">{errors.service?.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <p className="text-red-500 text-sm">{errors.status?.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="source">Source</Label>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WEBSITE">Website</SelectItem>
                            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                            <SelectItem value="PHONE">Phone</SelectItem>
                            <SelectItem value="EMAIL">Email</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" {...register("notes")} />
                </div>
                
                <div className="flex gap-4 mt-4">
                  {appointment ? (
                    <Button
                      type="button"
                      disabled={isUpdating}
                      className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                      onClick={handleSubmit(onSubmit)}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Appointment"
                      )}
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => setActiveTab("patient")}
                    >
                      Next: Patient Information
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="patient">
              {/* Patient Information */}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input 
                    id="patientName" 
                    {...register("patientName")} 
                    readOnly={!!appointment}
                    disabled={!!appointment}
                    className={appointment ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}
                  />
                  {errors.patientName && (
                    <p className="text-red-500 text-sm">{errors.patientName?.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="patientEmail">Email</Label>
                  <Input 
                    id="patientEmail" 
                    type="email" 
                    {...register("patientEmail")} 
                    readOnly={!!appointment}
                    disabled={!!appointment}
                    className={appointment ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}
                  />
                  {errors.patientEmail && (
                    <p className="text-red-500 text-sm">{errors.patientEmail?.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="patientPhone">Phone Number</Label>
                  <Input 
                    id="patientPhone" 
                    {...register("patientPhone")} 
                    readOnly={!!appointment}
                    disabled={!!appointment}
                    className={appointment ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}
                  />
                  {errors.patientPhone && (
                    <p className="text-red-500 text-sm">{errors.patientPhone?.message}</p>
                  )}
                </div>
                
                <div className="flex gap-4 mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveTab("details")}
                  >
                    Back
                  </Button>
                  
                  {!appointment && (
                    <Button
                      type="button"
                      disabled={isCreating}
                      className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                      onClick={handleSubmit(onSubmit)}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Appointment"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
} 