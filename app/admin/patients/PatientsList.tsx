"use client";

import { useState } from "react";
import { Download, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  city: string;
  country: string;
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
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phoneNumber: "0987654321",
    whatsappNumber: "0987654321",
    city: "Los Angeles",
    country: "USA",
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

export function PatientsList({ searchQuery, timeRange, statusFilter }: PatientsListProps) {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearchQuery =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleSelectPatient = (id: string) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((patientId) => patientId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedPatients(
      selectedPatients.length === filteredPatients.length
        ? []
        : filteredPatients.map((p) => p.id)
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "WhatsApp",
      "City",
      "Country",
      "Status",
      "Created By",
      "Created At",
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      filteredPatients
        .filter((patient) => selectedPatients.includes(patient.id))
        .map((patient) =>
          [
            patient.name,
            patient.email,
            patient.phoneNumber,
            patient.whatsappNumber,
            patient.city,
            patient.country,
            patient.converted ? "Converted" : "Not Converted",
            patient.createdById.name,
            new Date(patient.createdAt).toLocaleString(),
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectedPatients.length === filteredPatients.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">City</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Country</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Created By</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Created At</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPatients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedPatients.includes(patient.id)}
                  onChange={() => handleSelectPatient(patient.id)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{patient.name}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{patient.email}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{patient.phoneNumber}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{patient.whatsappNumber}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{patient.city}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{patient.country}</td>
              <td className="px-4 py-3 text-sm">
                <Badge className={patient.converted ? "bg-green-500" : "bg-red-500"}>
                  {patient.converted ? "Converted" : "Not Converted"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{patient.createdById?.name}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {new Date(patient.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            {selectedPatients.length > 0
              ? `Selected ${selectedPatients.length} of ${filteredPatients.length} patients`
              : `Showing ${filteredPatients.length} patients`}
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
  );
}