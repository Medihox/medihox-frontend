"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

// Dummy support tickets
const tickets = [
  {
    id: "1",
    subject: "Billing Issue",
    clinic: "Main Street Clinic",
    status: "open",
    priority: "high",
    createdAt: "2024-03-20",
    lastUpdate: "2024-03-21",
  },
  // Add more dummy tickets...
];

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Clinic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.clinic}</TableCell>
                <TableCell>
                  <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.priority === "high"
                        ? "destructive"
                        : ticket.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.createdAt}</TableCell>
                <TableCell>{ticket.lastUpdate}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Respond to Ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                              Sed do eiusmod tempor incididunt ut labore et dolore
                              magna aliqua.
                            </p>
                          </div>
                          <Textarea
                            placeholder="Type your response here..."
                            className="min-h-[200px]"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Close Ticket</Button>
                            <Button>Send Response</Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}