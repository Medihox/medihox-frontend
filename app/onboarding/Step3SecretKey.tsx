"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  secretKey: string;
}

interface Step3SecretKeyProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function Step3SecretKey({ formData, updateFormData }: Step3SecretKeyProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Label htmlFor="secretKey">Secret Key</Label>
      <Input
        id="secretKey"
        type="text"
        value={formData.secretKey}
        onChange={(e) => updateFormData({ secretKey: e.target.value })}
        placeholder="Enter secret key"
        className="mt-1"
      />
    </motion.div>
  )
}

