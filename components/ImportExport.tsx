"use client";

import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

export function ImportExport() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        Import
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}