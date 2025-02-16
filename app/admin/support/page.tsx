"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { HandCoinsIcon } from "lucide-react";

const faqs = [
  {
    question: "How do I schedule an appointment?",
    answer:
      "You can schedule an appointment by logging into your account and navigating to the 'Appointments' section. From there, you can select an available time slot that works for you.",
  },
  {
    question:
      "What should I do if I need to cancel or reschedule my appointment?",
    answer:
      "If you need to cancel or reschedule your appointment, please log into your account and go to the 'Appointments' section. There, you can find your scheduled appointment and select the option to cancel or reschedule. If it's less than 24 hours before your appointment, please call our office directly.",
  },
  {
    question: "How can I access my medical records?",
    answer:
      "You can access your medical records through our patient portal. Log into your account and navigate to the 'Medical Records' section. If you need assistance or have trouble accessing your records, please contact our support team.",
  },
  {
    question: "What insurance plans do you accept?",
    answer:
      "We accept a wide range of insurance plans. Please check our 'Insurance' page for a full list of accepted providers. If you don't see your insurance listed, contact our billing department for more information.",
  },
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Support request submitted:", formData);
    toast.success(
      "Your support request has been submitted. We'll get back to you soon!"
    );
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <HandCoinsIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Support</h1>
        </div>
        <div className="mt-8 space-y-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">Frequently Asked Questions</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="dark:border-gray-700">
                    <AccordionTrigger className="dark:text-gray-100">{faq.question}</AccordionTrigger>
                    <AccordionContent className="dark:text-gray-400">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">Contact Support</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Can't find what you're looking for? Send us a message.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-300">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="dark:text-gray-300">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="dark:text-gray-300">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
