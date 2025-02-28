"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Settings, Loader2, Upload } from "lucide-react";
import { useGetUserProfileQuery, useUpdateProfileMutation } from "@/lib/redux/services/authApi";
import { getErrorMessage } from "@/lib/api/apiUtils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface GeneralSettings {
  organizationName: string;
  phone: string;
  email: string;
  name: string;
  organizationLogo?: string;
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

const initialSettings: Settings = {
  general: {
    organizationName: "",
    phone: "",
    email: "",
    name: "",
    organizationLogo: "",
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
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const { data: profile, isLoading, error, refetch } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (profile) {
      setSettings(prev => ({
        ...prev,
        general: {
          ...prev.general,
          email: profile.email || "",
          name: profile.name || "",
          organizationName: profile.organizationName || "",
          organizationLogo: profile.organizationLogo || "",
          phone: profile.phone || "",
        }
      }));
    }
  }, [profile]);

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

  const handleSaveSettings = async () => {
    try {
      // Prepare data for API call
      const updateData = {
        name: settings.general.name,
        organizationName: settings.general.organizationName,
        phone: settings.general.phone,
      };

      // Call the API
      await updateProfile(updateData).unwrap();
      
      // Refetch the profile data to get the updated values
      refetch();
      
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to save settings");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-800 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <Settings className="h-8 w-8 text-gray-700 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
        <div className="mt-8">
          <Tabs defaultValue="general">
            <TabsList className="border-b dark:bg-gray-900">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="dark:bg-gray-900">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    // Skeleton UI for the general tab content
                    <>
                      {/* Organization Logo Skeleton */}
                      <div className="flex flex-col items-center space-y-2 mb-6">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="w-32 h-32 rounded-md" />
                      </div>
                      
                      {/* Name Field Skeleton */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      
                      {/* Email Field Skeleton */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      
                      {/* Organization Name Field Skeleton */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      
                      {/* Phone Field Skeleton */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </>
                  ) : (
                    // Actual content when loaded
                    <>
                      {settings.general.organizationLogo && (
                        <div className="flex flex-col items-center space-y-2 mb-6">
                          <Label>Organization Logo</Label>
                          <div className="w-32 h-32 relative rounded-md overflow-hidden border border-gray-200">
                            <Image 
                              src={settings.general.organizationLogo} 
                              alt="Organization Logo" 
                              width={128}
                              height={128}
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={settings.general.name}
                          className="dark:bg-gray-900 dark:border-gray-800"
                          onChange={(e) =>
                            handleChange("general", "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={settings.general.email}
                          className="dark:bg-gray-900 dark:border-gray-800"
                          readOnly
                          disabled
                        />
                        <p className="text-xs text-gray-500">Email address cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input
                          id="organizationName"
                          name="organizationName"
                          value={settings.general.organizationName}
                          className="dark:bg-gray-900 dark:border-gray-800"
                          onChange={(e) =>
                            handleChange("general", "organizationName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={settings.general.phone}
                          className="dark:bg-gray-900 dark:border-gray-800"
                          onChange={(e) =>
                            handleChange("general", "phone", e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="dark:bg-gray-900">
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
              <Card className="dark:bg-gray-900">
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
                      className="dark:bg-gray-900"
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

          <Button 
            className="mt-4" 
            onClick={handleSaveSettings}
            disabled={isLoading || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
