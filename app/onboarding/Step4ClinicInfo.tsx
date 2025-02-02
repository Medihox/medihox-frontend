"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ImagePlus } from "lucide-react"
import type React from "react" // Added import for React

interface FormData {
  clinicName: string;
  clinicLogo: File | null;
}

interface Step4ClinicInfoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function Step4ClinicInfo({ formData, updateFormData }: Step4ClinicInfoProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({ clinicLogo: file })
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 flex items-center justify-center">
          {logoPreview ? (
            <Image
              src={logoPreview || "/placeholder.svg"}
              alt="Clinic Logo"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlus size={48} className="text-gray-400" />
          )}
        </div>
        <Label htmlFor="clinicLogo" className="cursor-pointer bg-[#4A90E2] text-white px-4 py-2 rounded-md">
          Upload Logo
        </Label>
        <Input id="clinicLogo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
      </div>
      <div>
        <Label htmlFor="clinicName">Clinic Name</Label>
        <Input
          id="clinicName"
          type="text"
          value={formData.clinicName}
          onChange={(e) => updateFormData({ clinicName: e.target.value })}
          placeholder="Enter clinic name"
          className="mt-1"
        />
      </div>
    </motion.div>
  )
}

