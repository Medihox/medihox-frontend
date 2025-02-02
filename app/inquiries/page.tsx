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
import {
  DownloadCloud,
  Upload,
  UserPlus,
  FileSpreadsheet,
  HelpCircle,
  User2,
  Pencil,
  Trash2,
} from "lucide-react";
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
import { exportToCSV, parseCSV } from "@/lib/csv";
import { Inquiry } from "../types";
import { cn } from "@/lib/utils";

const mockData: Inquiry[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    mobile: "1234567890",
    address: "123 Main St",
    source: "WhatsApp",
    comments: "Interested in consultation",
    services: "Full Body Checkup",
    status: "Active",
    createdAt: "2024-01-20T10:00:00Z",
  },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockData);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [newInquiry, setNewInquiry] = useState<Partial<Inquiry>>({
    name: "",
    email: "",
    mobile: "",
    address: "",
    source: "WhatsApp",
    comments: "",
    services: "",
    status: "Active",
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsedData = await parseCSV(file);
      const newInquiries: Inquiry[] = parsedData.map((item, index) => ({
        ...item,
        id: (inquiries.length + index + 1).toString(),
      }));
      setInquiries([...inquiries, ...newInquiries]);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };

  const handleExport = () => {
    const exportData = inquiries.map(({ id, ...rest }) => rest);
    exportToCSV(exportData);
  };

  const handleAddInquiry = () => {
    const inquiry: Inquiry = {
      ...newInquiry as Inquiry,
      id: (inquiries.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    setInquiries([...inquiries, inquiry]);
    setNewInquiry({
      name: "",
      email: "",
      mobile: "",
      address: "",
      source: "WhatsApp",
      comments: "",
      services: "",
      status: "Active",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditInquiry = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry);
    setNewInquiry(inquiry);
    setIsAddDialogOpen(true);
  };

  const handleUpdateInquiry = () => {
    if (!editingInquiry) return;
    const updatedInquiries = inquiries.map((inquiry) =>
      inquiry.id === editingInquiry.id ? { ...inquiry, ...newInquiry } : inquiry
    );
    setInquiries(updatedInquiries);
    setEditingInquiry(null);
    setNewInquiry({
      name: "",
      email: "",
      mobile: "",
      address: "",
      source: "WhatsApp",
      comments: "",
      services: "",
      status: "Active",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(inquiries.filter((inquiry) => inquiry.id !== id));
  };

  const getStatusColor = (status: Inquiry["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-red-500";
      case "Following":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSourceColor = (source: Inquiry["source"]) => {
    switch (source) {
      case "WhatsApp":
        return "bg-green-500";
      case "Phone":
        return "bg-blue-500";
      case "Facebook":
        return "bg-blue-600";
      case "Website":
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
            <FileSpreadsheet className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Inquiry List</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Help
            </Button>
            <div className="flex items-center gap-2">
              <User2 className="h-5 w-5" />
              <span className="font-medium">Super Admin</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <DownloadCloud className="h-4 w-4" />
              Download Import Template
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
                <Upload className="h-4 w-4" />
                Import New Inquiry
              </Button>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingInquiry ? "Edit Inquiry" : "Add New Inquiry"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newInquiry.name}
                      onChange={(e) =>
                        setNewInquiry({ ...newInquiry, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newInquiry.email}
                      onChange={(e) =>
                        setNewInquiry({ ...newInquiry, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      value={newInquiry.mobile}
                      onChange={(e) =>
                        setNewInquiry({ ...newInquiry, mobile: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newInquiry.address}
                      onChange={(e) =>
                        setNewInquiry({ ...newInquiry, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="source">Source</Label>
                    <Select
                      value={newInquiry.source}
                      onValueChange={(value: Inquiry["source"]) =>
                        setNewInquiry({ ...newInquiry, source: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="services">Services</Label>
                    <Input
                      id="services"
                      value={newInquiry.services}
                      onChange={(e) =>
                        setNewInquiry({ ...newInquiry, services: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newInquiry.status}
                      onValueChange={(value: Inquiry["status"]) =>
                        setNewInquiry({ ...newInquiry, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Following">Following</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={newInquiry.comments}
                      onChange={(e) =>
                        setNewInquiry({ ...newInquiry, comments: e.target.value })
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
                    onClick={editingInquiry ? handleUpdateInquiry : handleAddInquiry}
                  >
                    {editingInquiry ? "Update" : "Add"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="rounded border p-1 text-white"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email ID</TableHead>
                <TableHead>Mobile No</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>{inquiry.mobile}</TableCell>
                  <TableCell>{inquiry.address}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-white",
                        getSourceColor(inquiry.source)
                      )}
                    >
                      {inquiry.source}
                    </Badge>
                  </TableCell>
                  <TableCell>{inquiry.comments}</TableCell>
                  <TableCell>{inquiry.services}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-white",
                        getStatusColor(inquiry.status)
                      )}
                    >
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditInquiry(inquiry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteInquiry(inquiry.id)}
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