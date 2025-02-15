"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentForm } from "./AppointmentForm";
import { Appointment } from "@/app/types/index";

interface AppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAppointment: Appointment | null;
  newAppointment: Partial<Appointment>;
  setNewAppointment: (appointment: Partial<Appointment>) => void;
  handleAddAppointment: () => void;
  handleUpdateAppointment: () => void;
}

export function AppointmentDialog({
  isOpen,
  onOpenChange,
  editingAppointment,
  newAppointment,
  setNewAppointment,
  handleAddAppointment,
  handleUpdateAppointment,
}: AppointmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAppointment ? "Edit Appointment" : "New Appointment"}</DialogTitle>
        </DialogHeader>
        <AppointmentForm newAppointment={newAppointment} setNewAppointment={setNewAppointment} />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={editingAppointment ? handleUpdateAppointment : handleAddAppointment}>
            {editingAppointment ? "Update" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}