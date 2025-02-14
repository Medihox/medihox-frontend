"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Appointment } from "../../types";
import { cn } from "@/lib/utils";
import { dummyAppointments } from "@/lib/dummy-data";

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(dummyAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patient: {
      id: "",
      name: "",
      email: "",
      phoneNumber: "",
      converted: false,
      role: "",
      permissions: [],
      status: "",
      createdAt: new Date().toISOString(),
    },
    appointmentDate: "",
    appointmentTime: "",
    service: "",
    status: "Scheduled",
    source: "",
    createdBy: {
      id: "",
      name: "",
      email: "",
    },
    notes: "",
  });

  const handleAddAppointment = () => {
    const appointment: Appointment = {
      ...(newAppointment as Appointment),
      id: (appointments.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    setAppointments([...appointments, appointment]);
    setNewAppointment({
      patient: {
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        converted: false,
      },
      appointmentDate: "",
      appointmentTime: "",
      service: "",
      status: "Scheduled",
      source: "",
      createdBy: {
        id: "",
        name: "",
        email: "",
      },
      notes: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setNewAppointment(appointment);
    setIsAddDialogOpen(true);
  };

  const handleUpdateAppointment = () => {
    if (!editingAppointment) return;
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === editingAppointment.id
        ? { ...appointment, ...newAppointment }
        : appointment
    );
    setAppointments(updatedAppointments);
    setEditingAppointment(null);
    setNewAppointment({
      patient: {
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        converted: false,
      },
      appointmentDate: "",
      appointmentTime: "",
      service: "",
      status: "Scheduled",
      source: "",
      createdBy: {
        id: "",
        name: "",
        email: "",
      },
      notes: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      case "Enquiry":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? "Edit Appointment" : "New Appointment"}
                </DialogTitle>
              </DialogHeader>
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
                    onValueChange={(value: Appointment["status"]) =>
                      setNewAppointment({ ...newAppointment, status: value })
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

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    editingAppointment
                      ? handleUpdateAppointment
                      : handleAddAppointment
                  }
                >
                  {editingAppointment ? "Update" : "Add"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg bg-white shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Patient Name</TableHead>
                <TableHead className="min-w-[150px]">Email</TableHead>
                <TableHead className="min-w-[120px]">Mobile</TableHead>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead className="min-w-[120px]">Time</TableHead>
                <TableHead className="min-w-[150px]">Service</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[150px]">Source</TableHead>
                <TableHead className="min-w-[150px]">Created By</TableHead>
                <TableHead className="min-w-[200px]">Notes</TableHead>
                <TableHead className="min-w-[120px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="whitespace-nowrap">
                    {appointment.patient.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {appointment.patient.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {appointment.patient.phoneNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {appointment.appointmentDate}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {appointment.appointmentTime}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {appointment.service}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      className={cn(
                        "text-white",
                        getStatusColor(appointment.status)
                      )}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {appointment.source}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {appointment.createdBy.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap truncate">
                    {appointment.notes}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
