"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Appointment } from "@/app/types/index";
import { cn } from "@/lib/utils";

interface AppointmentTableProps {
  appointments: Appointment[];
  handleEditAppointment: (appointment: Appointment) => void;
  handleDeleteAppointment: (id: string) => void;
  getStatusColor: (status: Appointment["status"]) => string;
}

export function AppointmentTable({
  appointments,
  handleEditAppointment,
  handleDeleteAppointment,
  getStatusColor,
}: AppointmentTableProps) {
  return (
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
            <TableCell className="whitespace-nowrap">{appointment.patient.name}</TableCell>
            <TableCell className="whitespace-nowrap">{appointment.patient.email}</TableCell>
            <TableCell className="whitespace-nowrap">{appointment.patient.phoneNumber}</TableCell>
            <TableCell className="whitespace-nowrap">{appointment.appointmentDate}</TableCell>
            <TableCell className="whitespace-nowrap">{appointment.appointmentTime}</TableCell>
            <TableCell className="whitespace-nowrap">{appointment.service}</TableCell>
            <TableCell className="whitespace-nowrap">
              <Badge className={cn("text-white", getStatusColor(appointment.status))}>
                {appointment.status}
              </Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap">{appointment.source}</TableCell>
            <TableCell className="whitespace-nowrap">{appointment.createdBy?.name}</TableCell>
            <TableCell className="whitespace-nowrap truncate">{appointment.notes}</TableCell>
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
  );
}