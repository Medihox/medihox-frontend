"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OnboardingForm from "./OnboardingForm"
import LoadingScreen from "../../components/LoadingScreen"
import toast from "react-hot-toast"
import { useCompleteOnboardingMutation } from "@/lib/redux/services/authApi"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setOnboardingCompleted } from "@/lib/redux/slices/authSlice"
import { getErrorMessage } from "@/lib/api/apiUtils"

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [completeOnboarding] = useCompleteOnboardingMutation()
  
  // Get auth status from Redux
  const hasCompletedOnboarding = useAppSelector(state => state.auth.hasCompletedOnboarding)
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const accessToken = useAppSelector(state => state.auth.accessToken)

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated || accessToken) {
      toast.error("You are already logged in")
      router.push("/admin/dashboard")
      return
    }
    
    // If onboarding is already completed, redirect to login
    if (hasCompletedOnboarding) {
      toast.info("You have already completed onboarding")
      router.push("/login")
      return
    }
    
    // Otherwise, just show the onboarding page after loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [hasCompletedOnboarding, isAuthenticated, accessToken, router])

  const handleOnboardingComplete = async (data: { 
    email: string;
    organizationName: string;
    // We don't need these in the final API call
    otp: string; 
    password: string;
    secretKey: string;
  }) => {
    setIsSubmitting(true)
    try {
      // Only pass the required fields to the API
      await completeOnboarding({
        email: data.email,
        organizationName: data.organizationName
      }).unwrap();
      
      // Update redux state
      dispatch(setOnboardingCompleted())
      
      // Set cookies for middleware
      document.cookie = "hasCompletedOnboarding=true; path=/; max-age=31536000"
      
      toast.success("Onboarding completed successfully!")
      
      // Redirect to login page instead of dashboard
      setTimeout(() => {
        router.push("/login")
      }, 500)
    } catch (error) {
      setIsSubmitting(false)
      toast.error(getErrorMessage(error) || "Onboarding failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-gray-900 flex items-center justify-center p-4">
      {isLoading ? <LoadingScreen /> : <OnboardingForm onComplete={handleOnboardingComplete} isSubmitting={isSubmitting} />}
    </div>
  )
}
