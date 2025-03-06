"use client";

import { useState, useRef } from "react";
import { useGetAppointmentsQuery, useCreateAppointmentMutation } from "@/lib/redux/services/appointmentApi";
import { Button } from "@/components/ui/button";
import { Upload, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Papa from 'papaparse';

// Sample CSV template
const CSV_TEMPLATE = `patientName,patientEmail,patientPhone,treatment,status,source,date,time,notes
John Doe,john@example.com,1234567890,General Checkup,Scheduled,WEBSITE,2023-12-31,10:00,First visit
Jane Smith,jane@example.com,9876543210,Dental Care,Scheduled,WHATSAPP,2023-12-30,15:30,Follow-up appointment
`;

export function CsvOperations() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({ success: 0, failed: 0, errors: [] });
  const [showUploadResults, setShowUploadResults] = useState(false);
  
  const { data: appointmentsData } = useGetAppointmentsQuery({ pageSize: 1000 }); // Get all appointments for export
  const [createAppointment] = useCreateAppointmentMutation();
  
  // Download appointments as CSV
  const handleDownloadCsv = async () => {
    try {
      setIsDownloading(true);
      
      // Get appointments data
      if (!appointmentsData || !appointmentsData.data) {
        toast.error("No appointments data available");
        return;
      }
      
      // Convert appointments to CSV format
      const csvData = appointmentsData.data.map(appointment => ({
        patientName: appointment.patient?.name || "",
        patientEmail: appointment.patient?.email || "",
        patientPhone: appointment.patient?.phoneNumber || "",
        treatment: appointment.service || "",
        status: appointment.status || "",
        source: appointment.source || "",
        date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : "",
        time: appointment.time || "",
        notes: appointment.notes || ""
      }));
      
      // Generate CSV string
      const csv = Papa.unparse(csvData);
      
      // Create a blob and download it
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Appointments downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error(getErrorMessage(error) || "Failed to download appointments");
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Handle CSV file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadResults({ success: 0, failed: 0, errors: [] });
    
    try {
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data, errors } = results;
          let successCount = 0;
          let failedCount = 0;
          const errorMessages: string[] = [];
          
          // Process each row
          for (const row of data as any[]) {
            try {
              // Validate required fields
              if (!row.patientName || !row.patientEmail || !row.patientPhone || !row.date) {
                failedCount++;
                continue;
              }
              
              // Initialize with default value and improve error handling
              let appointmentDate = new Date().toISOString(); // Default fallback
              
              // Only try to parse if date exists
              if (row.date) {
                try {
                  if (row.time) {
                    const [year, month, day] = row.date.split('-').map(Number);
                    const [hours, minutes] = row.time.split(':').map(Number);
                    const dateObj = new Date(year, month - 1, day, hours, minutes);
                    appointmentDate = dateObj.toISOString();
                  } else {
                    const [year, month, day] = row.date.split('-').map(Number);
                    const dateObj = new Date(year, month - 1, day, 12, 0);
                    appointmentDate = dateObj.toISOString();
                  }
                } catch (e) {
                  failedCount++;
                  continue;
                }
              }
              
              // Create appointment data
              const appointmentData = {
                patient: {
                  name: row.patientName,
                  email: row.patientEmail,
                  phoneNumber: row.patientPhone
                },
                treatment: row.treatment || "General Checkup",
                status: row.status || "Scheduled",
                source: row.source || "WEBSITE",
                date: appointmentDate,
                notes: row.notes || ""
              };
              
              // Call API to create appointment
              await createAppointment(appointmentData).unwrap();
              successCount++;
            } catch (error) {
              failedCount++;
            }
          }
          
          // Show results
          setUploadResults({
            success: successCount,
            failed: failedCount,
            errors: failedCount > 0 ? ["Some records could not be imported. Please check your CSV format and try again."] : []
          });
          setShowUploadResults(true);
          
          if (successCount > 0) {
            toast.success(`Successfully created ${successCount} appointments`);
          }
          
          if (failedCount > 0) {
            toast.error("Some records could not be imported. Please check your CSV format and try again.");
          }
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          
          setIsUploading(false);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast.error("Failed to parse CSV file. Please check the file format.");
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Failed to upload file. Please try again.");
      setIsUploading(false);
    }
  };
  
  // Handle download template
  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'appointments_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          CSV Operations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>CSV Import & Export</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="import">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="import">Import CSV</TabsTrigger>
            <TabsTrigger value="export">Export CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Upload a CSV file to bulk create appointments. 
                Make sure your CSV has the correct format.
              </p>
              
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label 
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-6 w-6 mb-2 text-gray-400" />
                  <span className="text-sm font-medium">Click to select a CSV file</span>
                  <span className="text-xs text-gray-500 mt-1">or drag and drop here</span>
                </label>
              </div>
              
              {showUploadResults && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Upload Results</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Successful: <span className="text-green-600">{uploadResults.success}</span></span>
                    <span className="text-sm">Failed: <span className="text-red-600">{uploadResults.failed}</span></span>
                  </div>
                  
                  {uploadResults.errors.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-1">Errors:</h4>
                      <div className="max-h-40 overflow-y-auto">
                        <ul className="text-xs text-red-500 space-y-1">
                          {uploadResults.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                className="w-full"
                variant="outline"
                onClick={handleDownloadTemplate}
              >
                Download Template
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Download all appointments as a CSV file for backup or analysis.
              </p>
              
              <Button
                className="w-full"
                onClick={handleDownloadCsv}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 