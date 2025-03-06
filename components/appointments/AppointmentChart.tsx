"use client";

import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes"

const data = [
  { name: "Jan", scheduled: 150, completed: 120 },
  { name: "Feb", scheduled: 200, completed: 180 },
  { name: "Mar", scheduled: 250, completed: 220 },
  { name: "Apr", scheduled: 180, completed: 150 },
  { name: "May", scheduled: 220, completed: 200 },
  { name: "Jun", scheduled: 280, completed: 250 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-sm font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AppointmentChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card className="p-6 bg-white dark:bg-gray-900 border-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Trends</h3>
        <div className="flex items-center gap-4">
          <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300">
            <option value="all">All</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <div className="flex gap-2">
            <button className="text-sm text-purple-600 dark:text-purple-400 font-medium">Graph</button>
            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Table
            </button>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="scheduledGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#7c3aed" : "#8b5cf6"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isDark ? "#7c3aed" : "#8b5cf6"} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#10b981" : "#34d399"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isDark ? "#10b981" : "#34d399"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? "#374151" : "#f0f0f0"}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#9ca3af" : "#888888", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#9ca3af" : "#888888", fontSize: 12 }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="scheduled"
              stroke={isDark ? "#7c3aed" : "#8b5cf6"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: isDark ? "#7c3aed" : "#8b5cf6", strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="completed"
              stroke={isDark ? "#10b981" : "#34d399"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: isDark ? "#10b981" : "#34d399", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
