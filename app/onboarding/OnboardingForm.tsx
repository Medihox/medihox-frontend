"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Step1EmailPassword from "./Step1EmailPassword"
import Step2OtpVerification from "./Step2OtpVerification"
import Step3SecretKey from "./Step3SecretKey"
import Step4ClinicInfo from "./Step4ClinicInfo"
import { Mail, Shield, Key, Building2 } from "lucide-react"
import React from "react"
import toast from "react-hot-toast"

interface OnboardingFormProps {
  onComplete: () => void
}

const steps = [
  {
    title: "Get Started",
    content: "Begin your journey with us by creating your account.",
    icon: Mail,
  },
  {
    title: "Verify Your Identity",
    content: "We've sent you a one-time password to ensure it's really you.",
    icon: Shield,
  },
  {
    title: "Secure Your Account",
    content: "Enter your unique secret key for an extra layer of security.",
    icon: Key,
  },
  {
    title: "Personalize Your Clinic",
    content: "Let's add some personal touches to make your clinic stand out.",
    icon: Building2,
  },
]


export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    secretKey: "",
    clinicName: "",
    clinicLogo: null as File | null,
  })

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1EmailPassword formData={formData} updateFormData={updateFormData} />
      case 1:
        return <Step2OtpVerification formData={formData} updateFormData={updateFormData} />
      case 2:
        return <Step3SecretKey formData={formData} updateFormData={updateFormData} />
      case 3:
        return <Step4ClinicInfo formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  const handleFinish = async () => {
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Onboarding completed successfully!")
      onComplete()
    } catch (error) {
      toast.error("Onboarding failed. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-6xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.5 }}
            className="lg:w-1/2 bg-[#4A90E2] text-white p-8 flex flex-col justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="mb-6"
            >
              {steps[currentStep].icon && React.createElement(steps[currentStep].icon, { size: 100 })}
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 text-center">{steps[currentStep].title}</h2>
            <p className="text-lg mb-6 text-center">{steps[currentStep].content}</p>
          </motion.div>
        </AnimatePresence>
        <div className="lg:w-1/2 p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? "bg-[#4A90E2] text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 hidden sm:block">{step.title.split(" ")[0]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-[#4A90E2] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ type: "tween", duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-6">
            <Button onClick={handleBack} disabled={currentStep === 0} variant="outline">
              Back
            </Button>
            <Button
              onClick={currentStep === steps.length - 1 ? handleFinish : handleNext}
              disabled={currentStep === steps.length - 1 && !formData.clinicName} 
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
