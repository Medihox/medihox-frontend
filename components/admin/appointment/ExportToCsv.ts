import { Appointment } from '@/app/types';
import Papa from 'papaparse';

export const exportToCSV = (data: Appointment[]) => {
  // Convert appointments to a CSV-friendly format
  const csvData = data.map((appointment) => ({
    "Patient Name": appointment.patient.name,
    "Email": appointment.patient.email,
    "Mobile": appointment.patient.phoneNumber,
    "Date": appointment.appointmentDate,
    "Time": appointment.appointmentTime,
    "Service": appointment.service,
    "Status": appointment.status,
    "Source": appointment.source,
    "Notes": appointment.notes,
  }));

  // Generate CSV
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  // Create a download link and trigger the download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'appointments.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};