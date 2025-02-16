"use client";

import { useState } from "react";
import { Download, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FilterTimeRange, AppointmentStatus } from "@/app/admin/appointments/page";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AppointmentDialog } from "./AppointmentDialog";

interface Appointment {
  id: string;
  patient: {
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status: string;
  source: string;
  createdBy: {
    name: string;
    role: string;
  };
  notes: string;
  createdAt: string;
}

// Mock data based on the Appointment interface
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patient: {
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+1234567890",
      city: "New York"
    },
    appointmentDate: "2024-04-28",
    appointmentTime: "10:00",
    service: "General Checkup",
    status: "Scheduled",
    source: "Website",
    createdBy: {
      name: "Dr. Smith",
      role: "doctor"
    },
    notes: "Regular checkup",
    createdAt: "2024-04-25T10:00:00Z"
  },
  {
    id: "2",
    patient: {
      name: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "+1234567891",
      city: "Los Angeles"
    },
    appointmentDate: "2024-04-28",
    appointmentTime: "11:30",
    service: "Dental Care",
    status: "Completed",
    source: "WhatsApp",
    createdBy: {
      name: "Dr. Johnson",
      role: "doctor"
    },
    notes: "Follow-up appointment",
    createdAt: "2024-04-25T11:00:00Z"
  },
  {
    id: "3",
    patient: {
      name: "Alice Johnson",
      email: "alice@example.com",
      phoneNumber: "+1234567892",
      city: "San Francisco"
    },
    appointmentDate: "2024-04-28",
    appointmentTime: "14:00",
    service: "Eye Checkup",
    status: "Cancelled",
    source: "Phone",
    createdBy: {
      name: "Dr. Williams",
      role: "doctor"
    },
    notes: "Emergency visit",
    createdAt: "2024-04-25T14:00:00Z"
  },
  {
    id: "4",
    patient: {
      name: "Bob Williams",
      email: "bob@example.com",
      phoneNumber: "+1234567893",
      city: "Chicago"
    },
    appointmentDate: "2024-04-28",
    appointmentTime: "15:00",
    service: "Gynecological Checkup",
    status: "Enquired",
    source: "Email",
    createdBy: {
      name: "Dr. Brown",
      role: "doctor"
    },
    notes: "Follow-up visit",
    createdAt: "2024-04-25T15:00:00Z"
  }
];

interface AppointmentsListProps {
  searchQuery: string;
  timeRange: FilterTimeRange;
  statusFilter: AppointmentStatus;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    case "Completed":
      return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
    case "Cancelled":
      return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    case "Enquired":
      return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
    case "Followup":
      return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
    case "Cost-Issue":
      return "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
    default:
      return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "WhatsApp":
      return "🟢";
    case "Phone":
      return "📞";
    case "Facebook":
      return "👤";
    case "Website":
      return "🌐";
    default:
      return "📱";
  }
};

export function AppointmentsList({ searchQuery, timeRange, statusFilter }: AppointmentsListProps) {
  const router = useRouter();
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredAppointments = appointments.filter(appointment => {
    // Search filter
    const matchesSearch = 
      appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.patient.phoneNumber.includes(searchQuery) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      appointment.status.toLowerCase() === statusFilter.toLowerCase();

    // Time range filter
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesTimeRange = (() => {
      switch (timeRange) {
        case 'today':
          return appointmentDate.toDateString() === today.toDateString();
        
        case 'week': {
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          return appointmentDate >= weekAgo && appointmentDate <= today;
        }
        
        case 'month': {
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          return appointmentDate >= monthAgo && appointmentDate <= today;
        }
        
        case 'all':
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesTimeRange;
  });

  const handleSelectAppointment = (id: string) => {
    setSelectedAppointments(prev => 
      prev.includes(id) 
        ? prev.filter(appointmentId => appointmentId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedAppointments(
      selectedAppointments.length === filteredAppointments.length
        ? []
        : filteredAppointments.map(a => a.id)
    );
  };

  const handleExportExcel = () => {
    // Implement Excel export logic
    console.log("Exporting to Excel...");
  };

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log("Exporting to PDF...");
  };

  const handleViewDetails = (appointmentId: string) => {
    router.push(`/admin/appointments/${appointmentId}`);
  };

  const handleEdit = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateAppointment = (updatedAppointment: Partial<Appointment>) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentToEdit?.id 
        ? { ...app, ...updatedAppointment }
        : app
    ));
    setAppointmentToEdit(undefined);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter(app => app.id !== appointmentToDelete.id));
      setAppointmentToDelete(undefined);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-4 px-4">
                <input
                  type="checkbox"
                  checked={selectedAppointments.length === filteredAppointments.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Patient</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Appointment Date</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Service</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Source</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Created By</th>
              <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedAppointments.includes(appointment.id)}
                    onChange={() => handleSelectAppointment(appointment.id)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span 
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                      onClick={() => handleViewDetails(appointment.id)}
                    >
                      {appointment.patient.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.patient.phoneNumber}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.appointmentTime}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {appointment.service}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getSourceIcon(appointment.source)}</span>
                    <span className="text-sm text-gray-900 dark:text-white">{appointment.source}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {appointment.createdBy.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {appointment.createdBy.role}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900"
                      onClick={() => handleDelete(appointment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedAppointments.length > 0 
                ? `Selected ${selectedAppointments.length} of ${filteredAppointments.length} appointments`
                : `Showing ${filteredAppointments.length} appointments`
              }
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <AppointmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        appointment={appointmentToEdit}
        onSave={handleUpdateAppointment}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the appointment for {appointmentToDelete?.patient.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}