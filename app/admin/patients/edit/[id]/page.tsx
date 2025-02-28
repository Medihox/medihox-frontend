"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NewPatientDialog } from "../../NewPatientDialog";
import { useGetPatientByIdQuery } from "@/lib/redux/services/patientApi";
import { Loader2 } from "lucide-react";
import { showErrorToast } from "@/lib/utils/toast";

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(true);
  const patientId = params.id as string;
  
  const { data: patient, isLoading, error } = useGetPatientByIdQuery(patientId);
  
  // When dialog closes, navigate back to patients list
  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      router.push("/admin/patients");
    }
  };
  
  // Show error if patient fetch fails
  useEffect(() => {
    if (error) {
      showErrorToast("Failed to load patient data");
      router.push("/admin/patients");
    }
  }, [error, router]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }
  
  if (!patient) {
    return null;
  }
  
  return (
    <div>
      <NewPatientDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        patientId={patientId}
        initialData={{
          name: patient.name,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          whatsappNumber: patient.whatsappNumber,
          address: patient.address || '',
        }}
      />
    </div>
  );
} 