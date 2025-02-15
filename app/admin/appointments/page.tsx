"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { dummyAppointments } from "@/lib/dummy-data";
import { Appointment } from "../../types";
import { AppointmentActions } from "@/components/admin/appointment/AppointmentActions";
import { AppointmentDialog } from "@/components/admin/appointment/AppointmentDialog";
import { AppointmentTable } from "@/components/admin/appointment/AppointmentTable";
import { exportToCSV } from "@/components/admin/appointment/ExportToCsv";
import { parseCSV } from "@/components/admin/appointment/ParseToCsv";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patient: {
      id: "",
      name: "",
      email: "",
      phoneNumber: "",
      converted: false,
      createdAt: new Date().toISOString(),
      createdById: {
        id: "",
        name: "",
        email: "",
        status: "active",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    },
    appointmentDate: "",
    appointmentTime: "",
    service: "",
    status: "Scheduled",
    source: "",
    notes: "",
  });

  const handleAddAppointment = () => {
    const appointment: Appointment = {
      ...(newAppointment as Appointment),
      id: (appointments.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    setAppointments([...appointments, appointment]);
    resetNewAppointment();
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
    resetNewAppointment();
    setIsAddDialogOpen(false);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const resetNewAppointment = () => {
    setNewAppointment({
      patient: {
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        converted: false,
        createdAt: new Date().toISOString(),
        createdById: {
          id: "",
          name: "",
          email: "",
          status: "active",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      },
      appointmentDate: "",
      appointmentTime: "",
      service: "",
      status: "Scheduled",
      source: "",
      notes: "",
    });
  };

  const handleExport = () => {
    const exportData = appointments.map(({ id, ...rest }) => ({ id, ...rest }));
    exportToCSV(exportData);
    console.log("Export Data:", exportData); // Replace with actual export logic
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const parsedData = await parseCSV(file);
      const newAppointments: Appointment[] = parsedData.map((item, index) => ({
        ...item,
        id: (appointments.length + index + 1).toString(),
      }));
      setAppointments([...appointments, ...newAppointments]);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
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
        <div className="mb-8 flex items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          </div>
        </div>

        <div className="mb-8">
          <AppointmentActions
            handleExport={handleExport}
            handleFileUpload={handleFileUpload}
            openDialog={() => setIsAddDialogOpen(true)}
          />
        </div>

        <AppointmentDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          editingAppointment={editingAppointment}
          newAppointment={newAppointment}
          setNewAppointment={setNewAppointment}
          handleAddAppointment={handleAddAppointment}
          handleUpdateAppointment={handleUpdateAppointment}
        />

        <div className="rounded-lg bg-white shadow overflow-x-auto">
          <AppointmentTable
            appointments={appointments}
            handleEditAppointment={handleEditAppointment}
            handleDeleteAppointment={handleDeleteAppointment}
            getStatusColor={getStatusColor}
          />
        </div>
      </div>
    </div>
  );
}