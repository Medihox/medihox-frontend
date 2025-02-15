"use client";

import { Button } from "@/components/ui/button";
import { DownloadCloud, Upload, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AppointmentActionsProps {
  handleExport: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openDialog: () => void;
}

export function AppointmentActions({ handleExport, handleFileUpload, openDialog }: AppointmentActionsProps) {
  return (
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
          Import Appointments
        </Button>
      </div>
      <Button className="gap-2" onClick={openDialog}>
        <Plus className="h-4 w-4" />
        New Appointment
      </Button>
    </div>
  );
}