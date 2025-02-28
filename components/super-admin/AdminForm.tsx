"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AdminUser } from "@/lib/redux/services/superAdminApi";

interface AdminFormData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  organizationName?: string;
  role: "ADMIN";
  password?: string;
}

interface AdminFormProps {
  initialData?: Partial<AdminUser>;
  isSubmitting: boolean;
  onSubmit: (data: AdminFormData) => void;
  submitLabel: string;
  isPasswordRequired?: boolean;
}

export function AdminForm({
  initialData,
  isSubmitting,
  onSubmit,
  submitLabel,
  isPasswordRequired = true
}: AdminFormProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    organizationName: initialData?.organizationName || "",
    role: "ADMIN",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        organizationName: initialData.organizationName || "",
        role: "ADMIN",
        password: "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="name">Name*</Label>
        <Input 
          id="name" 
          placeholder="Enter admin name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email*</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="admin@clinic.com" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          placeholder="Enter phone number" 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input 
          id="organizationName" 
          placeholder="Enter organization name" 
          value={formData.organizationName}
          onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">
          Password{isPasswordRequired ? '*' : ''} 
          {!isPasswordRequired && <span className="text-xs">(Leave blank to keep current)</span>}
        </Label>
        <Input 
          id="password" 
          type="password"
          placeholder="Enter password" 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required={isPasswordRequired}
        />
      </div>
      
      <Button 
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : submitLabel}
      </Button>
    </form>
  );
} 