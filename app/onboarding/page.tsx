"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OnboardingForm from "./OnboardingForm"
import LoadingScreen from "../../components/LoadingScreen"
import toast from "react-hot-toast"

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleOnboardingComplete = async () => {
    try {
      // Simulating successful onboarding
      document.cookie = "hasCompletedOnboarding=true; path=/; max-age=31536000"
      document.cookie = "isAuthenticated=true; path=/; max-age=31536000"
      document.cookie = "userRole=ADMIN; path=/; max-age=31536000"
      toast.success("Onboarding completed successfully!")
      router.push("/")
    } catch (error) {
      toast.error("Onboarding failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      {isLoading ? <LoadingScreen /> : <OnboardingForm onComplete={handleOnboardingComplete} />}
    </div>
  )
}
