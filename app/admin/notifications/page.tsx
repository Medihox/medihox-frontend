"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, BellRing, Calendar as CalendarIcon, Mail, MessageSquare, Phone, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

type NotificationChannel = "email" | "whatsapp" | "sms";

type MessageTemplate = {
  id: string;
  title: string;
  content: string;
};

type Appointment = {
  id: string;
  patientName: string;
  time: string;
  type: string;
  contact: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
  selected?: boolean;
};

const messageTemplates: MessageTemplate[] = [
  {
    id: "appointment-reminder",
    title: "Appointment Reminder",
    content: `Dear Patient,

We hope this message finds you well. This is a friendly reminder about your upcoming appointment at Dr. PK Talwar's Clinic scheduled for {date}.

Appointment Details:
• Date: {date}
• Location: Dr. PK Talwar's Clinic
• What to bring: Any recent medical reports or test results

Please arrive 10-15 minutes before your scheduled time. If you need to reschedule or have any questions, please contact us at +91-XXXXXXXXXX.

Best regards,
Dr. PK Talwar's Clinic Team`,
  },
  {
    id: "appointment-confirmation",
    title: "Appointment Confirmation",
    content: `Dear Patient,

Thank you for scheduling an appointment with Dr. PK Talwar's Clinic. This message confirms your appointment for {date}.

Important Information:
• Please arrive 10-15 minutes early
• Bring any relevant medical records
• Wear a mask during your visit
• Keep your phone in silent mode

If you need to cancel or reschedule, please notify us at least 24 hours in advance.

We look forward to seeing you.

Best regards,
Dr. PK Talwar's Clinic`,
  },
  {
    id: "follow-up",
    title: "Follow-up Reminder",
    content: `Dear Patient,

This is a reminder for your follow-up appointment scheduled at Dr. PK Talwar's Clinic on {date}.

Please Remember:
• Bring your previous prescription
• Bring any new test reports
• Bring a list of current medications
• Share any new symptoms or concerns you've experienced

Your continued care is important to us. If you need to reschedule, please contact us as soon as possible.

Best regards,
Dr. PK Talwar's Clinic Team`,
  },
  {
    id: "pre-appointment",
    title: "Pre-Appointment Instructions",
    content: `Dear Patient,

Your appointment at Dr. PK Talwar's Clinic is scheduled for {date}. To ensure a smooth consultation, please note the following instructions:

Pre-Appointment Guidelines:
1. Fast for 8 hours before the appointment (if applicable)
2. Bring all recent medical reports
3. List any medications you're currently taking
4. Arrive 15 minutes before your scheduled time
5. Wear comfortable clothing

For any queries, please contact our reception at +91-XXXXXXXXXX.

Best regards,
Dr. PK Talwar's Clinic`,
  },
  {
    id: "appointment-reschedule",
    title: "Appointment Reschedule Request",
    content: `Dear Patient,

We notice you missed your appointment scheduled for {date}. We understand that unexpected situations can arise.

Would you like to reschedule your appointment? Please contact us at your earliest convenience to set up a new appointment time.

Contact Details:
• Phone: +91-XXXXXXXXXX
• WhatsApp: +91-XXXXXXXXXX
• Email: clinic@drpktalwar.com

Your health is our priority, and we look forward to serving you.

Best regards,
Dr. PK Talwar's Clinic Team`,
  },
  {
    id: "test-results",
    title: "Test Results Available",
    content: `Dear Patient,

Your test results from your recent visit on {date} are now available. Please schedule a follow-up appointment to discuss your results with Dr. PK Talwar.

Important Notes:
• Results will be explained during your consultation
• Bring your original test reports
• Schedule your appointment within the next 7 days

To schedule your follow-up appointment, please call us at +91-XXXXXXXXXX.

Best regards,
Dr. PK Talwar's Clinic Team`,
  },
  {
    id: "general-checkup",
    title: "General Check-up Reminder",
    content: `Dear Patient,

Your general health check-up is scheduled for {date} at Dr. PK Talwar's Clinic.

Preparation Guidelines:
1. 8-hour fasting required
2. Bring previous health records
3. Wear comfortable clothing
4. Plan for 1-2 hours at the clinic
5. Avoid heavy meals before tests

Note: Please inform us about any specific health concerns you'd like to discuss during your check-up.

Best regards,
Dr. PK Talwar's Clinic Team`,
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel[]>([]);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulating fetching data (replace this with an actual API call)
        const response = await new Promise<Notification[]>((resolve) =>
          setTimeout(() => {
            resolve([
              {
                id: "1",
                title: "Notification 1",
                message: "This is a message",
                type: "info",
                isRead: false,
                createdAt: new Date().toString(),
              },
              {
                id: "2",
                title: "Notification 2",
                message: "This is another message",
                type: "warning",
                isRead: false,
                createdAt: new Date().toString(),
              },
            ]);
          }, 1000)
        );
        setNotifications(response);
      } catch (err) {
        setError("Failed to load notifications");
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (selectedTemplate && selectedTemplate !== "custom") {
      const template = messageTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        const formattedDate = selectedDate ? format(selectedDate, "PPP") : "{date}";
        setNotificationMessage(template.content.replace("{date}", formattedDate));
      }
    }
  }, [selectedTemplate, selectedDate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedDate) {
        setAppointments([]);
        return;
      }

      setLoadingAppointments(true);
      try {
        // Replace this with actual API call
        const response = await new Promise<Appointment[]>((resolve) =>
          setTimeout(() => {
            // Mock appointments for demo - replace with actual API data
            resolve([
              {
                id: "1",
                patientName: "John Doe",
                time: "09:00 AM",
                type: "Regular Checkup",
                contact: {
                  email: "john@example.com",
                  phone: "+1234567890",
                  whatsapp: "+1234567890"
                }
              },
              {
                id: "2",
                patientName: "Jane Smith",
                time: "10:30 AM",
                type: "Follow-up",
                contact: {
                  email: "jane@example.com",
                  phone: "+1234567891"
                }
              },
            ]);
          }, 1000)
        );
        setAppointments(response);
      } catch (error) {
        toast.error("Failed to fetch appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    toast.success("Notification deleted");
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
    toast.success("All notifications marked as read");
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    toast.success("All notifications deleted");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(appointments.map(app => app.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointments(prev => [...prev, appointmentId]);
    } else {
      setSelectedAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const handleSendNotification = async () => {
    if (!selectedDate || selectedChannel.length === 0 || !notificationMessage || selectedAppointments.length === 0) {
      toast.error("Please select appointments and fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Notifications sent to ${selectedAppointments.length} appointment(s)`);
      setSelectedDate(new Date());
      setSelectedChannel([]);
      setNotificationMessage("");
      setSelectedAppointments([]);
    } catch (error) {
      toast.error("Failed to send notifications");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-8">
          <BellRing className="h-8 w-8 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
            <TabsTrigger value="send">Send Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-start">
              <div className="mb-4 space-x-4">
                <Button variant="outline" onClick={handleMarkAllAsRead}>
                  Mark All as Read
                </Button>
                <Button variant="outline" onClick={handleDeleteAll}>
                  Delete All
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {notifications.length === 0
                ? Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonNotification key={index} />
                  ))
                : notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="send">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Send Appointment Notifications</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Appointment Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                          initialFocus
                          defaultMonth={selectedDate}
                          className="rounded-md border border-purple-200 dark:border-purple-800"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notification Channels
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedChannel.includes("email") ? "default" : "outline"}
                        onClick={() => {
                          setSelectedChannel(prev =>
                            prev.includes("email")
                              ? prev.filter(c => c !== "email")
                              : [...prev, "email"]
                          );
                        }}
                        className={cn(
                          "border-purple-200 dark:border-purple-800",
                          selectedChannel.includes("email") && "bg-purple-600 hover:bg-purple-700 text-white"
                        )}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                      <Button
                        variant={selectedChannel.includes("whatsapp") ? "default" : "outline"}
                        onClick={() => {
                          setSelectedChannel(prev =>
                            prev.includes("whatsapp")
                              ? prev.filter(c => c !== "whatsapp")
                              : [...prev, "whatsapp"]
                          );
                        }}
                        className={cn(
                          "border-purple-200 dark:border-purple-800",
                          selectedChannel.includes("whatsapp") && "bg-purple-600 hover:bg-purple-700 text-white"
                        )}
                      >
                        <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </Button>
                      <Button
                        variant={selectedChannel.includes("sms") ? "default" : "outline"}
                        onClick={() => {
                          setSelectedChannel(prev =>
                            prev.includes("sms")
                              ? prev.filter(c => c !== "sms")
                              : [...prev, "sms"]
                          );
                        }}
                        className={cn(
                          "border-purple-200 dark:border-purple-800",
                          selectedChannel.includes("sms") && "bg-purple-600 hover:bg-purple-700 text-white"
                        )}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        SMS
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message Template
                    </label>
                    <Select
                      value={selectedTemplate}
                      onValueChange={(value) => {
                        setSelectedTemplate(value);
                        if (value === "custom") {
                          setNotificationMessage("");
                        }
                      }}
                    >
                      <SelectTrigger className="w-full border-purple-200 dark:border-purple-800">
                        <SelectValue placeholder="Select a template or write custom message" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Message</SelectItem>
                        {messageTemplates.map((template) => (
                          <SelectItem 
                            key={template.id} 
                            value={template.id}
                            className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          >
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Message
                      </label>
                      {selectedTemplate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate("custom");
                            setNotificationMessage("");
                          }}
                        >
                          Clear Template
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={notificationMessage}
                      onChange={(e) => {
                        setNotificationMessage(e.target.value);
                        // Clear template selection if user modifies the message
                        if (selectedTemplate !== "custom") {
                          setSelectedTemplate("custom");
                        }
                      }}
                      placeholder={
                        selectedTemplate !== "custom"
                          ? "Template message will appear here..." 
                          : "Enter your custom notification message..."
                      }
                      className="h-32"
                    />
                    {selectedTemplate !== "custom" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        You can edit the template message if needed
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleSendNotification}
                    disabled={isLoading || !selectedDate || selectedChannel.length === 0 || !notificationMessage}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Notifications
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    Appointments for {selectedDate ? format(selectedDate, "PPP") : "Selected Date"}
                  </h2>
                  <div className="flex items-center gap-4">
                    {appointments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedAppointments.length === appointments.length}
                          onCheckedChange={handleSelectAll}
                          id="select-all"
                          className="border-purple-200 dark:border-purple-800"
                        />
                        <label
                          htmlFor="select-all"
                          className="text-sm text-gray-600 dark:text-gray-300"
                        >
                          Select All
                        </label>
                      </div>
                    )}
                    <Badge variant="secondary">
                      {selectedAppointments.length} selected of {appointments.length}
                    </Badge>
                  </div>
                </div>

                {loadingAppointments ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedDate ? (
                      <p>No appointments found for this date</p>
                    ) : (
                      <p>Select a date to view appointments</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={cn(
                          "border border-purple-200 dark:border-purple-800 rounded-lg p-4 transition-colors",
                          selectedAppointments.includes(appointment.id)
                            ? "bg-purple-50 dark:bg-purple-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedAppointments.includes(appointment.id)}
                            onCheckedChange={(checked) => 
                              handleSelectAppointment(appointment.id, checked as boolean)
                            }
                            className="mt-1 border-purple-200 dark:border-purple-800"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {appointment.patientName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {appointment.time} - {appointment.type}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {appointment.contact.email && (
                                  <Badge variant="outline" className="border-purple-200 dark:border-purple-800">
                                    <Mail className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                  </Badge>
                                )}
                                {appointment.contact.whatsapp && (
                                  <Badge variant="outline" className="border-purple-200 dark:border-purple-800">
                                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-purple-600 dark:fill-purple-400">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                  </Badge>
                                )}
                                {appointment.contact.phone && (
                                  <Badge variant="outline" className="border-purple-200 dark:border-purple-800">
                                    <Phone className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              <p>Email: {appointment.contact.email}</p>
                              <p>Phone: {appointment.contact.phone}</p>
                              {appointment.contact.whatsapp && (
                                <p>WhatsApp: {appointment.contact.whatsapp}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const typeColors = {
    info: "bg-blue-100 dark:bg-blue-900/10 border-blue-200 dark:border-blue-700/10",
    warning: "bg-yellow-100 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-700/10",
    success: "bg-green-100 dark:bg-green-900/10 border-green-200 dark:border-green-700/10",
    error: "bg-red-100 dark:bg-red-900/10 border-red-200 dark:border-red-700/10",
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-lg",
        typeColors[notification.type],
        !notification.isRead && "font-semibold"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{notification.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-100">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Badge
        variant={
          notification.type === "info" || notification.type === "success"
            ? "default"
            : notification.type === "warning"
            ? "secondary"
            : "destructive"
        }
        className="mt-2"
      >
        {notification.type}
      </Badge>
    </div>
  );
}

function SkeletonNotification() {
  return (
    <div className="p-4 border rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
};
