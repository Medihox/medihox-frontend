import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>{appointment.patientName}</TableCell>
            <TableCell>
              {format(new Date(appointment.date), 'PPp')}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  appointment.status === 'COMPLETED'
                    ? 'default'
                    : appointment.status === 'SCHEDULED'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {appointment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}