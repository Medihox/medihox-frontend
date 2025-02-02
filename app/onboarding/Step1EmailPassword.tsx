"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  email: string;
  password: string;
}

interface Step1EmailPasswordProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function Step1EmailPassword({ formData, updateFormData }: Step1EmailPasswordProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="Enter your email"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData({ password: e.target.value })}
          placeholder="Enter your password"
          className="mt-1"
        />
      </div>
    </motion.div>
  )
}

