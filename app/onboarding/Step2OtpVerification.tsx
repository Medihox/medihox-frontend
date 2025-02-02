"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  otp: string;
}

interface Step2OtpVerificationProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function Step2OtpVerification({ formData, updateFormData }: Step2OtpVerificationProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Label htmlFor="otp">OTP Verification</Label>
      <Input
        id="otp"
        type="text"
        value={formData.otp}
        onChange={(e) => updateFormData({ otp: e.target.value })}
        placeholder="Enter OTP"
        className="mt-1"
      />
    </motion.div>
  )
}

