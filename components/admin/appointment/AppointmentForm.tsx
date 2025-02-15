"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Appointment } from "@/app/types/index";

interface AppointmentFormProps {
  newAppointment: Partial<Appointment>;
  setNewAppointment: (appointment: Partial<Appointment>) => void;
}

export function AppointmentForm({ newAppointment, setNewAppointment }: AppointmentFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {/* Patient Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            value={newAppointment.patient?.name || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                patient: {
                  ...newAppointment.patient,
                  name: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="patientEmail">Email</Label>
          <Input
            id="patientEmail"
            type="email"
            value={newAppointment.patient?.email || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                patient: {
                  ...newAppointment.patient,
                  email: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="patientMobile">Mobile</Label>
          <Input
            id="patientMobile"
            value={newAppointment.patient?.phoneNumber || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                patient: {
                  ...newAppointment.patient,
                  phoneNumber: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* Appointment Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="appointmentDate">Date</Label>
          <Input
            id="appointmentDate"
            type="date"
            value={newAppointment.appointmentDate || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                appointmentDate: e.target.value,
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="appointmentTime">Time</Label>
          <Input
            id="appointmentTime"
            type="time"
            value={newAppointment.appointmentTime || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                appointmentTime: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Service and Source */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="service">Service</Label>
          <Input
            id="service"
            value={newAppointment.service || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                service: e.target.value,
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={newAppointment.source || ""}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                source: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Status */}
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={newAppointment.status || "Scheduled"}
          onValueChange={(value) =>
            setNewAppointment({
              ...newAppointment,
              status: value as Appointment["status"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="No Show">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={newAppointment.notes || ""}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              notes: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}