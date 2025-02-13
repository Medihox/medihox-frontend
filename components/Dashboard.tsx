"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Home } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardStats } from "@/app/types";

const mockStats: DashboardStats = {
  totalInquiries: 150,
  activeInquiries: 45,
  totalAppointments: 89,
  upcomingAppointments: 12,
  conversionRate: 35,
  sourceDistribution: {
    WhatsApp: 40,
    Phone: 25,
    Facebook: 20,
    Website: 15,
  },
};

const inquiryData = [
  { month: "Jan", inquiries: 65 },
  { month: "Feb", inquiries: 85 },
  { month: "Mar", inquiries: 75 },
  { month: "Apr", inquiries: 95 },
  { month: "May", inquiries: 115 },
  { month: "Jun", inquiries: 90 },
];

export default function Dashboard() {
  const sourceData = Object.entries(mockStats.sourceDistribution).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const COLORS = ["#10B981", "#3B82F6", "#1D4ED8", "#F59E0B"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Home className="h-8 w-8 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Inquiries */}
          <Link href="/admin/inquiries">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Inquiries</p>
                  <p className="text-2xl font-bold">{mockStats.totalInquiries}</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Appointments */}
          <Link href="/admin/appointments">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-2xl font-bold">{mockStats.totalAppointments}</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Upcoming Appointments */}
          <Link href="/admin/appointments">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold">{mockStats.upcomingAppointments}</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Conversion Rate */}
          <Link href="/admin/analytics">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">{mockStats.conversionRate}%</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Inquiry Trends</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inquiryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Source Distribution</h2>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4 max-w-full">
                {sourceData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
