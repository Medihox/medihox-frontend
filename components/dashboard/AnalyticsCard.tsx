"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string;
  trend: string;
  trendIsUp: boolean;
  icon: LucideIcon;
}

export function AnalyticsCard({ title, value, trend, trendIsUp, icon: Icon }: AnalyticsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h4>
            <div className={cn(
              "flex items-center mt-1 text-sm font-medium",
              trendIsUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {trend}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 