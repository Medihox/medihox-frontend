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

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    patientMobile: "1234567890",
    appointmentDate: "2024-01-25",
    appointmentTime: "10:00",
    doctor: "Dr. Smith",
    service: "General Checkup",
    status: "Scheduled",
    notes: "First visit",
    createdAt: "2024-01-20T10:00:00Z",
  },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(
    null
  );
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientName: "",
    patientEmail: "",
    patientMobile: "",
    appointmentDate: "",
    appointmentTime: "",
    doctor: "",
    service: "",
    status: "Scheduled",
    notes: "",
  });

  const handleAddAppointment = () => {
    const appointment: Appointment = {
      ...newAppointment as Appointment,
      id: (appointments.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    setAppointments([...appointments, appointment]);
    setNewAppointment({
      patientName: "",
      patientEmail: "",
      patientMobile: "",
      appointmentDate: "",
      appointmentTime: "",
      doctor: "",
      service: "",
      status: "Scheduled",
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
      patientName: "",
      patientEmail: "",
      patientMobile: "",
      appointmentDate: "",
      appointmentTime: "",
      doctor: "",
      service: "",
      status: "Scheduled",
      notes: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      case "No Show":
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? "Edit Appointment" : "New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={newAppointment.patientName}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        patientName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="patientEmail">Email</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    value={newAppointment.patientEmail}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        patientEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="patientMobile">Mobile</Label>
                  <Input
                    id="patientMobile"
                    value={newAppointment.patientMobile}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        patientMobile: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="appointmentDate">Date</Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={newAppointment.appointmentDate}
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
                      value={newAppointment.appointmentTime}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          appointmentTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input
                    id="doctor"
                    value={newAppointment.doctor}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        doctor: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Input
                    id="service"
                    value={newAppointment.service}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        service: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAppointment.status}
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
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
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

        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.patientEmail}</TableCell>
                  <TableCell>{appointment.patientMobile}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-white",
                        getStatusColor(appointment.status)
                      )}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{appointment.notes}</TableCell>
                  <TableCell>
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