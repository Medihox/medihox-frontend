"use client";

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  details: { label: string; value: string | number }[];
  colorScheme: {
    bg: string;
    iconBg: string;
    iconColor: string;
  };
  href: string;
}

export function StatsCard({ title, value, icon: Icon, details, colorScheme, href }: StatsCardProps) {
  return (
    <Card className={`p-6 ${colorScheme.bg} border-none transition-colors`}>
      <div className="flex justify-between items-start">
        <div>
          <Link href={href} className="block group">
            <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {value}
            </h3>
          </Link>
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