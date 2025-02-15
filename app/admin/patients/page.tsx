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
import { Users as UsersIcon, UserPlus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Patient, User } from "../../types";

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "1234567890",
    whatsappNumber: "1234567890",
    city: "New York",
    country: "USA",
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
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    city: "",
    country: "",
    converted: false,
    createdById: {
      id: "",
      name: "",
      email: "",
      role: "admin",
      status: "active",
      createdAt: "",
    },
  });

  const handleAddPatient = () => {
    const patient: Patient = {
      ...newPatient as Patient,
      id: (patients.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    setPatients([...patients, patient]);
    resetForm();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setNewPatient(patient);
    setIsAddDialogOpen(true);
  };

  const handleUpdatePatient = () => {
    if (!editingPatient) return;
    const updatedPatients = patients.map((patient) =>
      patient.id === editingPatient.id ? { ...patient, ...newPatient } : patient
    );
    setPatients(updatedPatients);
    resetForm();
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  const resetForm = () => {
    setEditingPatient(null);
    setNewPatient({
      name: "",
      email: "",
      phoneNumber: "",
      whatsappNumber: "",
      city: "",
      country: "",
      converted: false,
      createdById: {
        id: "",
        name: "",
        email: "",
        role: "admin",
        status: "active",
        createdAt: "",
      },
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPatient ? "Edit Patient" : "Add New Patient"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newPatient.name}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={newPatient.phoneNumber}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      value={newPatient.whatsappNumber}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, whatsappNumber: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newPatient.city}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newPatient.country}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, country: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="converted">Converted</Label>
                  <Checkbox
                    id="converted"
                    checked={newPatient.converted}
                    onCheckedChange={(checked) =>
                      setNewPatient({ ...newPatient, converted: checked as boolean })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={editingPatient ? handleUpdatePatient : handleAddPatient}>
                  {editingPatient ? "Update" : "Add"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg bg-white shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>WhatsApp Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phoneNumber}</TableCell>
                  <TableCell>{patient.whatsappNumber}</TableCell>
                  <TableCell>{patient.city}</TableCell>
                  <TableCell>{patient.country}</TableCell>
                  <TableCell>
                    <Badge className={patient.converted ? "bg-green-500" : "bg-red-500"}>
                      {patient.converted ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.createdById?.name}</TableCell>
                  <TableCell>
                    {patient.createdAt ? new Date(patient.createdAt).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditPatient(patient)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeletePatient(patient.id)}
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