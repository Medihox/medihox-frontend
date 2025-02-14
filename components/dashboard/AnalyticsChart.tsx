import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";
import { useTheme } from "next-themes";

const data = [
  { name: "Dec", value: 1500000 },
  { name: "Jan", value: 2500000 },
  { name: "Feb", value: 3500000 },
  { name: "Mar", value: 4500000 },
  { name: "Apr", value: 3000000 },
  { name: "May", value: 2000000 },
  { name: "Jun", value: 3500000 },
  { name: "Jul", value: 5000000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
          ₹{payload[0].value.toLocaleString()}
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fee Collection Analytics</h3>
        <div className="flex gap-2">
          <button className="text-sm text-purple-800 dark:text-purple-400 font-medium">Monthly Collection</button>
          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Classwise Collection
          </button>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {/* ✅ Using ComposedChart to combine Area and Line */}
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              {/* ✅ Gradient for smooth purple effect */}
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#7c3aed" : "#8b5cf6"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isDark ? "#7c3aed" : "#8b5cf6"} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#f0f0f0"} vertical={false} horizontal={true} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? "#9ca3af" : "#888888", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? "#9ca3af" : "#888888", fontSize: 12 }} tickFormatter={(value) => `₹${(value / 100000)}L`} dx={-10} />
            <Tooltip content={<CustomTooltip />} />

            {/* ✅ Gradient-filled Area */}
            <Area type="monotone" dataKey="value" stroke="none" fill="url(#colorValue)" />

            {/* ✅ Solid line on top of the gradient */}
            <Line type="monotone" dataKey="value" stroke={isDark ? "#7c3aed" : "#8b5cf6"} strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
