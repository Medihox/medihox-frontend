"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, DollarSign } from "lucide-react";
import { dummyStats, dummyClinics, dummySuperAdmin } from "@/lib/dummy-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {dummySuperAdmin.name}
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clinics"
          value={dummyStats.totalClinics?.toLocaleString() || "0"}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Patients"
          value={dummyStats.totalPatients.toLocaleString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Appointments"
          value={dummyStats.totalAppointments.toLocaleString()}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${dummyStats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Registered Clinics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clinic Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyClinics.map((clinic) => (
                  <TableRow key={clinic.id}>
                    <TableCell className="font-medium">
                      {clinic.name}
                    </TableCell>
                    <TableCell>{clinic.address}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {clinic.subscription.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          clinic.subscription.status === 'ACTIVE'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {clinic.subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${clinic.stats.totalRevenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}