"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Dummy services data
const services = [
  {
    id: "1",
    name: "Appointment Management",
    description: "Complete appointment scheduling system",
    price: 299,
    status: "active",
    clinics: 45,
  },
  {
    id: "2",
    name: "Billing System",
    description: "Automated invoicing and payment tracking",
    price: 499,
    status: "inactive",
    clinics: 30,
  },
];

export default function ServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input placeholder="Enter service name" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Enter service description" />
              </div>
              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <Input type="number" placeholder="299" />
              </div>
              <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                Create Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table for Large Screens */}
      <div className="hidden sm:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active Clinics</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>
                  <Badge variant={service.status === "active" ? "default" : "secondary"}>
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell>{service.clinics}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {services.map((service) => (
          <Card key={service.id} className="p-4 border">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <Badge variant={service.status === "active" ? "default" : "secondary"}>
                {service.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{service.description}</p>
            <div className="mt-2 flex justify-between">
              <span className="font-semibold text-lg">${service.price}</span>
              <span className="text-sm text-gray-600">{service.clinics} Active Clinics</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="w-full">
                <Pencil className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="w-full">
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
