"use client";

import { useState } from "react";
import { Download, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  converted: boolean;
  createdById: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
  createdAt: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "1234567890",
    address: "New York, USA",
    converted: false,
    createdById: {
      id: "u1",
      name: "Dr. Smith",
      email: "dr.smith@example.com",
      role: "doctor",
      status: "active",
      createdAt: "2024-01-01T10:00:00Z",
    },
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phoneNumber: "0987654321",
    address: "Los Angeles, USA",
    converted: true,
    createdById: {
      id: "u2",
      name: "Dr. Johnson",
      email: "dr.johnson@example.com",
      role: "doctor",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
    },
    createdAt: "2024-01-25T10:00:00Z",
  },
];

interface PatientsListProps {
  searchQuery: string;
  timeRange: "all" | "today" | "week" | "month";
  statusFilter: "all" | "converted" | "not-converted";
}

const getConversionStatusColor = (converted: boolean) => {
  if (converted) {
    return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
  }
  return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
};

export function PatientsList({ searchQuery, timeRange, statusFilter }: PatientsListProps) {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [patientToUpdate, setPatientToUpdate] = useState<Patient | null>(null);
  const [updatedPatientData, setUpdatedPatientData] = useState<Partial<Patient>>({});

  const filteredPatients = patients.filter((patient) => {
    const matchesSearchQuery =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTimeRange =
      timeRange === "all" ||
      (timeRange === "today" && new Date(patient.createdAt).toDateString() === new Date().toDateString()) ||
      (timeRange === "week" && new Date(patient.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (timeRange === "month" && new Date(patient.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "converted" && patient.converted) ||
      (statusFilter === "not-converted" && !patient.converted);

    return matchesSearchQuery && matchesTimeRange && matchesStatus;
  });

  const handleDelete = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (patientToDelete) {
      setPatients(patients.filter((p) => p.id !== patientToDelete.id));
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleUpdate = (patient: Patient) => {
    setPatientToUpdate(patient);
    setUpdatedPatientData(patient);
    setUpdateDialogOpen(true);
  };

  const confirmUpdate = () => {
    if (patientToUpdate && updatedPatientData) {
      setPatients(patients.map((p) => 
        p.id === patientToUpdate.id 
          ? { ...p, ...updatedPatientData }
          : p
      ));
      setUpdateDialogOpen(false);
      setPatientToUpdate(null);
      setUpdatedPatientData({});
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Address",
      "Status",
      "Created By",
      "Created At",
    ];

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return `${formattedDate} ${formattedTime}`;
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      filteredPatients
        .map((patient) =>
          [
            patient.name,
            patient.email,
            patient.phoneNumber,
            patient.address,
            patient.converted ? "Converted" : "Not Converted",
            patient.createdById.name,
            formatDate(patient.createdAt),
          ].join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePatientClick = (patientId: string) => {
    router.push(`/admin/patients/${patientId}`);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[200px]">
                Patient
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 min-w-[200px]">
                  <div className="flex flex-col">
                    <span 
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      {patient.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.phoneNumber}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  {patient.address}
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <Badge className={getConversionStatusColor(patient.converted)}>
                    {patient.converted ? "Converted" : "Not Converted"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  {patient.createdById?.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 min-w-[150px]">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(patient.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(patient.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm min-w-[120px]">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleUpdate(patient)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900"
                      onClick={() => handleDelete(patient)}
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
              Showing {filteredPatients.length} patients
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={updatedPatientData.name || ''}
                onChange={(e) =>
                  setUpdatedPatientData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={updatedPatientData.email || ''}
                onChange={(e) =>
                  setUpdatedPatientData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={updatedPatientData.phoneNumber || ''}
                onChange={(e) =>
                  setUpdatedPatientData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={updatedPatientData.address || ''}
                onChange={(e) =>
                  setUpdatedPatientData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <select
                  id="status"
                  value={updatedPatientData.converted ? "converted" : "not-converted"}
                  onChange={(e) =>
                    setUpdatedPatientData((prev) => ({
                      ...prev,
                      converted: e.target.value === "converted",
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
                >
                  <option value="converted">Converted</option>
                  <option value="not-converted">Not Converted</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {patientToDelete?.name}&apos;s record and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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