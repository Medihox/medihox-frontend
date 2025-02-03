"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, UserCheck } from "lucide-react";
import { dummyStats, dummyUser } from "@/lib/dummy-data";
import Dashboard from "@/components/Dashboard";

export default function AdminDashboard() {
  return (
    <Dashboard />
  );
}