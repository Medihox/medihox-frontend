import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";
import { useTheme } from "next-themes";

interface AnalyticsChartProps {
  data: {
    month: string;
    appointments: number;
    enquiries: number;
  }[];
}

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

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  // Format month string (e.g., "2025-02" to "Feb")
  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + "-01"); // Add day to make a valid date
    return date.toLocaleString('default', { month: 'short' });
  };
  
  // Format the data for the chart
  const chartData = data.map(item => ({
    name: formatMonth(item.month),
    enquiries: item.enquiries,
    appointments: item.appointments
  }));

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
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
