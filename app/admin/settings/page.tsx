"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { Settings } from "lucide-react";

const initialSettings = {
  general: {
    clinicName: "",
    address: "",
    phone: "",
    email: "",
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
  },
  security: {
    twoFactorAuth: false,
    passwordExpirationDays: 30,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);

  interface GeneralSettings {
    clinicName: string;
    address: string;
    phone: string;
    email: string;
  }

  interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    appointmentReminders: boolean;
  }

  interface SecuritySettings {
    twoFactorAuth: boolean;
    passwordExpirationDays: number;
  }

  interface Settings {
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
  }

  const handleChange = (
    section: keyof Settings,
    field: string,
    value: string | boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <Settings className="h-8 w-8 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="mt-8">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your clinic's information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.general).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>
                        {key.replace(/([A-Z])/g, " $1")}
                      </Label>
                      <Input
                        id={key}
                        name={key}
                        value={value}
                        onChange={(e) =>
                          handleChange("general", key, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.notifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <Label htmlFor={key}>
                          {key.replace(/([A-Z])/g, " $1")}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={() =>
                            handleChange("notifications", key, !value)
                          }
                        />
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth">
                      Two-Factor Authentication
                    </Label>
                    <Switch
                      id="twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={() =>
                        handleChange(
                          "security",
                          "twoFactorAuth",
                          !settings.security.twoFactorAuth
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpirationDays">
                      Password Expiration (days)
                    </Label>
                    <Input
                      id="passwordExpirationDays"
                      name="passwordExpirationDays"
                      type="number"
                      value={settings.security.passwordExpirationDays}
                      onChange={(e) =>
                        handleChange(
                          "security",
                          "passwordExpirationDays",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button className="mt-4" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
