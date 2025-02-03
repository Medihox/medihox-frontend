"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 99,
    features: [
      "Up to 500 patients",
      "Basic appointment scheduling",
      "Electronic health records",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 199,
    features: [
      "Unlimited patients",
      "Advanced scheduling",
      "Custom branding",
      "Priority support",
      "Analytics dashboard",
    ],
  },
  {
    name: "Enterprise",
    price: 499,
    features: [
      "All Pro features",
      "Custom development",
      "Dedicated support",
      "SLA guarantee",
      "Multi-clinic management",
    ],
  },
];

const subscriptions = [
  {
    id: "1",
    clinicName: "Main Street Clinic",
    plan: "Pro",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    amount: 199,
  },
  // Add more dummy subscriptions...
];

export default function SubscriptionsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                ${plan.price}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clinic</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.clinicName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{sub.plan}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={sub.status === "active" ? "default" : "destructive"}>
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell>{sub.startDate}</TableCell>
                <TableCell>{sub.endDate}</TableCell>
                <TableCell>${sub.amount}/month</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}