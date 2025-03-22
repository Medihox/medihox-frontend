"use client";

import { useState, useRef } from "react";
import { useGetInquiriesQuery, useCreateAppointmentMutation, CreateAppointmentRequest } from "@/lib/redux/services/appointmentApi";
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

// Sample CSV template - using string literal to avoid TS issues
const CSV_TEMPLATE = "patientName,patientEmail,patientPhone,treatment,status,source,date,notes\n" + 
"John Doe,john@example.com,9998887771,General Checkup,Enquiry,WEBSITE,2023-12-31,Initial inquiry about consultation\n" +
"Jane Smith,jane@example.com,9876543210,Dental Care,Enquiry,DIRECT_CALL,2023-12-30,Looking for price information\n" +
"Robert Johnson,robert@example.com,7776665554,Skin Treatment,Enquiry,INSTAGRAM,2023-12-29,Interested in dermatology services\n" +
"Sarah Williams,sarah@example.com,8889994443,Hair Transplant,Enquiry,FACEBOOK,2023-12-28,Requested detailed information on procedure\n" +
"Michael Brown,michael@example.com,9990001112,Weight Loss Program,Follow Up,REFERRAL,2023-12-27,Following up on previous conversation\n";

interface CsvOperationsProps {
  onSuccess?: () => void;
}

export function CsvOperations({ onSuccess }: CsvOperationsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({ success: 0, failed: 0, errors: [] });
  const [showUploadResults, setShowUploadResults] = useState(false);
  
  const { data: inquiriesData } = useGetInquiriesQuery({ pageSize: 1000 }); // Get all inquiries for export
  const [createInquiry] = useCreateAppointmentMutation();
  
  // Download inquiries as CSV
  const handleDownloadCsv = async () => {
    try {
      setIsDownloading(true);
      
      // Get inquiries data
      if (!inquiriesData || !inquiriesData.data) {
        toast.error("No inquiry data available");
        return;
      }
      
      // Convert inquiries to CSV format
      const csvData = inquiriesData.data.map(inquiry => ({
        patientName: inquiry.patient?.name || "",
        patientEmail: inquiry.patient?.email || "",
        patientPhone: inquiry.patient?.phoneNumber || "",
        treatment: inquiry.service || "",
        status: inquiry.status || "",
        source: inquiry.source || "",
        date: inquiry.date ? new Date(inquiry.date).toISOString().split('T')[0] : "",
        notes: inquiry.notes || ""
      }));
      
      // Generate CSV string
      const csv = Papa.unparse(csvData);
      
      // Create a blob and download it
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Inquiries downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error(getErrorMessage(error) || "Failed to download inquiries");
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
          const validRecords: CreateAppointmentRequest[] = [];
          const invalidRecords: any[] = [];
          
          // Process each row
          for (const row of data as any[]) {
            try {
              // Validate required fields
              if (!row.patientName || !row.patientEmail || !row.patientPhone) {
                invalidRecords.push(row);
                continue;
              }
              
              // Create inquiry data with proper typing
              const inquiryData: CreateAppointmentRequest = {
                patient: {
                  name: row.patientName,
                  email: row.patientEmail,
                  phoneNumber: row.patientPhone
                },
                service: row.treatment || row.service || "General Inquiry",
                status: row.status || "Enquiry",
                source: row.source || "WEBSITE",
                date: row.date ? row.date : new Date().toISOString().split('T')[0],
                notes: row.notes || ""
              };
              
              validRecords.push(inquiryData);
            } catch (error) {
              invalidRecords.push(row);
            }
          }
          
          // If we have valid records, send them in bulk
          if (validRecords.length > 0) {
            try {
              // Send all valid records in a single API call
              await createInquiry(validRecords).unwrap();
              
              // Show results
              setUploadResults({
                success: validRecords.length,
                failed: invalidRecords.length,
                errors: invalidRecords.length > 0 
                  ? [`${invalidRecords.length} records could not be imported. Please check your CSV format and try again.`] 
                  : []
              });
              
              if (validRecords.length > 0) {
                toast.success(`Successfully created ${validRecords.length} inquiries`);
                // Call onSuccess callback to trigger refetch
                onSuccess?.();
              }
              
              if (invalidRecords.length > 0) {
                toast.error(`${invalidRecords.length} records could not be imported. Please check your CSV format and try again.`);
              }
            } catch (error) {
              console.error("Error creating bulk inquiries:", error);
              toast.error(getErrorMessage(error) || "Failed to create inquiries");
              setUploadResults({
                success: 0,
                failed: validRecords.length + invalidRecords.length,
                errors: [getErrorMessage(error) || "Failed to create inquiries"]
              });
            }
          } else {
            setUploadResults({
              success: 0,
              failed: invalidRecords.length,
              errors: ["No valid records found in the CSV file"]
            });
            toast.error("No valid records found in the CSV file");
          }
          
          setShowUploadResults(true);
          
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
    link.setAttribute('download', 'inquiries_template.csv');
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
                Upload a CSV file to bulk create inquiries. 
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
                  disabled={isUploading}
                />
                <label
                  htmlFor="csv-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 mb-2 text-purple-600 animate-spin" />
                      <span className="text-sm font-medium text-purple-600">Processing CSV...</span>
                      <span className="text-xs text-gray-500 mt-1">Please wait</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2 text-gray-400" />
                      <span className="text-sm font-medium">Click to upload CSV</span>
                      <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
                    </>
                  )}
                </label>
              </div>
              
              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Download CSV Template
                </Button>
              </div>
              
              {showUploadResults && (
                <div className={`rounded-lg p-4 text-sm ${
                  uploadResults.failed > 0 
                    ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                    : 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  <p className="font-medium">Import Results:</p>
                  <p>Successfully imported: {uploadResults.success}</p>
                  {uploadResults.failed > 0 && (
                    <div>
                      <p>Failed to import: {uploadResults.failed}</p>
                      <ul className="list-disc list-inside mt-1">
                        {uploadResults.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Export all inquiries to a CSV file for backup or analysis.
              </p>
              
              <Button
                onClick={handleDownloadCsv}
                className="w-full"
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
                    Download Inquiries CSV
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