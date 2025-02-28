"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateUserMutation } from "@/lib/redux/services/userApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";

interface UserData {
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "EMPLOYEE" | "DOCTOR" | "RECEPTIONIST";
  status: "ACTIVE" | "INACTIVE";
  password: string;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (userData: any) => void; // Optional callback for parent component
}

export function UserDialog({ open, onOpenChange, onSave }: UserDialogProps) {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    role: "EMPLOYEE",
    status: "ACTIVE",
    password: ""
  });
  
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        showErrorToast("Please fill in all required fields");
        return;
      }
      
      // Format phone number if needed
      const formattedPhone = userData.phone.startsWith('+') 
        ? userData.phone 
        : userData.phone ? `+91${userData.phone}` : undefined;
      
      const userDataToSend = {
        ...userData,
        phone: formattedPhone
      };
      
      // Create user via API
      await createUser(userDataToSend).unwrap();
      showSuccessToast("User created successfully");
      
      // Call parent callback if provided
      if (onSave) {
        onSave(userDataToSend);
      }
      
      // Reset form and close dialog
      setUserData({
        name: "",
        email: "",
        phone: "",
        role: "EMPLOYEE",
        status: "ACTIVE",
        password: ""
      });
      onOpenChange(false);
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to create user");
      console.error("Error creating user:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-gray-100">
            Add New User
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name*
              </Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                required
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
              Phone <span className="text-xs">(+91 will be added if missing)</span>
            </Label>
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              placeholder="e.g. 9876543210"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">
                Role
              </Label>
              <Select 
                value={userData.role} 
                onValueChange={(value) => setUserData({...userData, role: value as UserData['role']})}
              >
                <SelectTrigger id="role" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <Select 
                value={userData.status} 
                onValueChange={(value) => setUserData({...userData, status: value as "ACTIVE" | "INACTIVE"})}
              >
                <SelectTrigger id="status" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password*
            </Label>
            <Input
              id="password"
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              placeholder="Enter password"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add User"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 