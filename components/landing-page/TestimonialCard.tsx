"use client";

import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  stars?: number;
}

const TestimonialCard = ({ quote, author, role, stars = 5 }: TestimonialCardProps) => (
  <Card className="border-0 shadow-sm">
    <CardHeader>
      <div className="flex space-x-1">
        {[...Array(stars)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground italic mb-4">"{quote}"</p>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </CardContent>
  </Card>
);

export default TestimonialCard; 