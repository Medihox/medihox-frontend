"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesTab } from "@/components/customizations/ServicesTab";
import { StatusTab } from "@/components/customizations/StatusTab";

export default function CustomizationsPage() {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Customizations
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage services and status options
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <Tabs defaultValue="services" className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <TabsList className="h-12 w-full bg-transparent border-b border-gray-200 dark:border-gray-800">
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger
                  value="status"
                  className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600"
                >
                  Status
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="services" className="p-4">
              <ServicesTab />
            </TabsContent>

            <TabsContent value="status" className="p-4">
              <StatusTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 