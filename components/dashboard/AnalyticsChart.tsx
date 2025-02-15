import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";
import { useTheme } from "next-themes";

const data = [
  { name: "Dec", enquiries: 150, appointments: 100 },
  { name: "Jan", enquiries: 250, appointments: 180 },
  { name: "Feb", enquiries: 350, appointments: 220 },
  { name: "Mar", enquiries: 450, appointments: 300 },
  { name: "Apr", enquiries: 300, appointments: 280 },
  { name: "May", enquiries: 200, appointments: 190 },
  { name: "Jun", enquiries: 350, appointments: 250 },
  { name: "Jul", enquiries: 500, appointments: 350 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
          {payload[0].value.toLocaleString()} Enquiries
        </p>
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
          {payload[1]?.value?.toLocaleString()} Appointments
        </p>
      </div>
    );
  }
  return null;
};

export function AnalyticsChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card className="col-span-2 p-6 border-none bg-white dark:bg-gray-900 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enquiries & Appointments Overview</h3>
        <div className="flex gap-2">
          <button className="text-sm text-purple-800 dark:text-purple-400 font-medium">Monthly Enquiries</button>

        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#7c3aed" : "#8b5cf6"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isDark ? "#7c3aed" : "#8b5cf6"} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#10b981" : "#34d399"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isDark ? "#10b981" : "#34d399"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#f0f0f0"} vertical={false} horizontal={true} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? "#9ca3af" : "#888888", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? "#9ca3af" : "#888888", fontSize: 12 }} tickFormatter={(value) => `${value}`} dx={-10} />
            <Tooltip content={<CustomTooltip />} />

            <Area type="monotone" dataKey="enquiries" stroke="none" fill="url(#colorEnquiries)" />
            <Area type="monotone" dataKey="appointments" stroke="none" fill="url(#colorAppointments)" />

            <Line type="monotone" dataKey="enquiries" stroke={isDark ? "#7c3aed" : "#8b5cf6"} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="appointments" stroke={isDark ? "#10b981" : "#34d399"} strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
