import { DivideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: typeof DivideIcon;
  details: { label: string; value: string | number }[];
  colorScheme: {
    bg: string;
    iconBg: string;
    iconColor: string;
  };
}

export function StatsCard({ title, value, icon: Icon, details, colorScheme }: StatsCardProps) {
  return (
    <Card className={`p-6 ${colorScheme.bg} border-none transition-colors`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {details.map((detail, index) => (
              <span key={index}>
                {detail.label}: {detail.value}
                {index < details.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
        <div className={`h-10 w-10 ${colorScheme.iconBg} rounded-full flex items-center justify-center transition-colors`}>
          <Icon className={`h-5 w-5 ${colorScheme.iconColor}`} />
        </div>
      </div>
    </Card>
  );
}