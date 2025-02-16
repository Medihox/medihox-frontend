"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusDialog } from "./StatusDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Status {
  id: string;
  name: string;
  color: string;
  description: string;
  type: 'appointment' | 'inquiry';
}

const mockStatuses: Status[] = [
  {
    id: "1",
    name: "Scheduled",
    color: "purple",
    description: "Appointment is scheduled",
    type: "appointment"
  },
  {
    id: "2",
    name: "Completed",
    color: "green",
    description: "Appointment is completed",
    type: "appointment"
  },
  {
    id: "3",
    name: "New Lead",
    color: "blue",
    description: "New inquiry received",
    type: "inquiry"
  }
];

export function StatusTab() {
  const [statuses, setStatuses] = useState<Status[]>(mockStatuses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusToEdit, setStatusToEdit] = useState<Status | null>(null);
  const [statusToDelete, setStatusToDelete] = useState<Status | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = (status: Status) => {
    if (statusToEdit) {
      setStatuses(statuses.map(s => s.id === status.id ? status : s));
    } else {
      setStatuses([...statuses, { ...status, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
    setStatusToEdit(null);
  };

  const handleEdit = (status: Status) => {
    setStatusToEdit(status);
    setIsDialogOpen(true);
  };

  const handleDelete = (status: Status) => {
    setStatusToDelete(status);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (statusToDelete) {
      setStatuses(statuses.filter(s => s.id !== statusToDelete.id));
      setIsDeleteDialogOpen(false);
      setStatusToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Status List</h3>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" /> Add Status
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Color</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.map((status) => (
            <TableRow key={status.id}>
              <TableCell>
                <Badge className={`bg-${status.color}-100 text-${status.color}-700 dark:text-black dark:bg-${status.color}-800`}>
                  {status.name}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{status.type}</TableCell>
              <TableCell>{status.description}</TableCell>
              <TableCell>
                <div className={`w-6 h-6 rounded-full bg-${status.color}-500`} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(status)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(status)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <StatusDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        status={statusToEdit}
        onSave={handleSave}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 