"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, DollarSign } from "lucide-react";
import { dummyStats, dummyClinics, dummySuperAdmin } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 pt-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clinics"
          value={dummyStats.totalClinics?.toLocaleString() || "0"}
          icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Patients"
          value={dummyStats.totalPatients.toLocaleString()}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Appointments"
          value={dummyStats.totalAppointments.toLocaleString()}
          icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${dummyStats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      {/* Clinics List */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Registered Clinics</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table View for Large Screens */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Clinic Name</th>
                    <th className="px-4 py-2 text-left">Address</th>
                    <th className="px-4 py-2 text-left">Subscription</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyClinics.map((clinic) => (
                    <tr key={clinic.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{clinic.name}</td>
                      <td className="px-4 py-2">{clinic.address}</td>
                      <td className="px-4 py-2">
                        <Badge variant="secondary">
                          {clinic.subscription.plan}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            clinic.subscription.status === "ACTIVE"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {clinic.subscription.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        ${clinic.stats.totalRevenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View for Mobile */}
            <div className="sm:hidden space-y-4">
              {dummyClinics.map((clinic) => (
                <Card key={clinic.id} className="p-4 border">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{clinic.name}</h3>
                    <Badge
                      variant={
                        clinic.subscription.status === "ACTIVE"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {clinic.subscription.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{clinic.address}</p>
                  <div className="mt-2 flex justify-between">
                    <Badge variant="secondary">{clinic.subscription.plan}</Badge>
                    <span className="font-semibold">
                      ${clinic.stats.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
