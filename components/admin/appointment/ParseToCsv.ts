import { Appointment } from '@/app/types';
import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<Appointment[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Map CSV data to Appointment objects
        const appointments: Appointment[] = results.data.map((row: any, index: number) => ({
          id: (index + 1).toString(), // Generate a unique ID
          patient: {
            id: "",
            name: row["Patient Name"] || "",
            email: row["Email"] || "",
            phoneNumber: row["Mobile"] || "",
            converted: false,
            createdAt: new Date().toISOString(),
            createdById: {
              id: "",
              name: "",
              email: "",
              status: "active",
              role: "admin",
              createdAt: new Date().toISOString(),
            },
          },
          appointmentDate: row["Date"] || "",
          appointmentTime: row["Time"] || "",
          service: row["Service"] || "",
          status: row["Status"] || "Scheduled",
          source: row["Source"] || "",
          notes: row["Notes"] || "",
          createdAt: new Date().toISOString(),
          createdBy: {
            id: "",
            name: "",
            email: "",
            role: "admin",
            status: "active",
            createdAt: new Date().toISOString(),
          },
        }));
        resolve(appointments);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};