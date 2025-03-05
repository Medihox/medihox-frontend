"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <Card className="border hover:shadow-lg transition-all duration-300">
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="bg-primary/10 p-2 rounded-full">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default FeatureCard; 