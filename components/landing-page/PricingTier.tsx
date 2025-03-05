"use client";

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

const PricingTier = ({ name, price, description, features, popular }: PricingTierProps) => (
  <Card className={`relative ${popular ? 'border-primary shadow-lg' : ''}`}>
    {popular && (
      <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
        Most Popular
      </div>
    )}
    <CardHeader>
      <CardTitle className="text-2xl">{name}</CardTitle>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-3xl font-bold">₹{price}</span>
        <span className="text-muted-foreground">/year</span>
      </div>
      <CardDescription className="mt-3">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button className="w-full" variant={popular ? "default" : "outline"}>
        Choose Plan
      </Button>
    </CardFooter>
  </Card>
);

export default PricingTier; 