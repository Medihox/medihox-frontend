"use client";

import { useState } from "react";
import { 
  Ticket, 
  Search, 
  Filter, 
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  Pencil,
  Trash2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Ticket {
  id: string;
  customer: string;
  subject: string;
  status: string;
  priority: string;
  created: string;
  platform: string;
  description?: string;
}

export default function CustomerSupport() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      customer: "John Doe",
      subject: "Booking Confirmation Issue",
      status: "open",
      priority: "high",
      created: "2024-03-20",
      platform: "Water Park",
      description: "Unable to receive booking confirmation email"
    },
    {
      id: "TKT-002",
      customer: "Jane Smith",
      subject: "Refund Request",
      status: "pending",
      priority: "medium",
      created: "2024-03-19",
      platform: "Theme Park",
      description: "Requesting refund due to weather conditions"
    },
    {
      id: "TKT-003",
      customer: "Mike Johnson",
      subject: "Event Cancellation",
      status: "resolved",
      priority: "low",
      created: "2024-03-18",
      platform: "Private Event",
      description: "Need to cancel private event booking"
    },
  ]);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      customer: "",
      subject: "",
      status: "open",
      priority: "medium",
      platform: "Theme Park",
      description: "",
    },
  });

  const handleCreateTicket = (data: any) => {
    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      created: new Date().toISOString().split('T')[0],
      ...data,
    };
    setTickets([...tickets, newTicket]);
    form.reset();
    setIsDialogOpen(false);
    toast.success("Ticket created successfully");
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    form.reset({
      customer: ticket.customer,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      platform: ticket.platform,
      description: ticket.description,
    });
    setIsDialogOpen(true);
  };

  const handleUpdateTicket = (data: any) => {
    if (editingTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === editingTicket.id
          ? { ...ticket, ...data }
          : ticket
      );
      setTickets(updatedTickets);
      setEditingTicket(null);
      form.reset();
      setIsDialogOpen(false);
      toast.success("Ticket updated successfully");
    }
  };

  const handleDeleteTicket = (id: string) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      setTickets(tickets.filter((ticket) => ticket.id !== id));
      toast.success("Ticket deleted successfully");
    }
  };

  const filteredTickets = tickets
    .filter((ticket) => 
      selectedStatus === "all" ? true : ticket.status === selectedStatus
    )
    .filter((ticket) =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-rose-500",
      pending: "bg-amber-500",
      resolved: "bg-green-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-blue-500",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold ">Customer Support</h1>
            <p className="text-muted-foreground mt-1">Manage support tickets and customer inquiries</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-rose-600 hover:bg-rose-700"
                onClick={() => {
                  setEditingTicket(null);
                  form.reset();
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTicket ? "Edit Ticket" : "Create New Ticket"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(editingTicket ? handleUpdateTicket : handleCreateTicket)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter customer name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter ticket subject" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Theme Park">Theme Park</SelectItem>
                            <SelectItem value="Water Park">Water Park</SelectItem>
                            <SelectItem value="Private Event">Private Event</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter ticket description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                    {editingTicket ? "Update Ticket" : "Create Ticket"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4  bg-card">
            <div className="flex items-center">
              <div className="p-2 bg-primary rounded-lg">
                <Ticket className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-4">
                <p className="text-sm ">Total Tickets</p>
                <p className="text-2xl font-semibold ">{tickets.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 ">
            <div className="flex items-center">
              <div className="p-2 bg-amber-600 rounded-lg">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-4">
                <p className="text-sm">Pending</p>
                <p className="text-2xl font-semibold ">
                  {tickets.filter(t => t.status === "pending").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 ">
            <div className="flex items-center">
              <div className="p-2 bg-red-600 rounded-lg">
                <AlertCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-4">
                <p className="text-sm ">Critical</p>
                <p className="text-2xl font-semibold ">
                  {tickets.filter(t => t.priority === "high").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 ">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-4">
                <p className="text-sm ">Resolved</p>
                <p className="text-2xl font-semibold ">
                  {tickets.filter(t => t.status === "resolved").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} >
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full  flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <span className="ml-2">{ticket.customer}</span>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{ticket.platform}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.created}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTicket(ticket)}
                          >
                            <Pencil className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTicket(ticket.id)}
                          >
                            <Trash2 className="h-4 w-4 text-rose-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}