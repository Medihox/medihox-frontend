"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OnboardingForm from "./OnboardingForm"
import LoadingScreen from "../../components/LoadingScreen"
import { showSuccessToast, showErrorToast, showInfoToast } from "@/lib/utils/toast"
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
    // Just show the onboarding page after loading
    // Using a simple timeout isn't needed anymore since the LoadingScreen
    // will handle its own duration and transition
    if (!isLoading) return; // Skip if already loaded
  }, [hasCompletedOnboarding, isAuthenticated, accessToken, router, isLoading])

  const handleLoadingComplete = () => {
    setIsLoading(false);
  }

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
      
      showSuccessToast("Onboarding completed successfully!")
      
      // Redirect to login page instead of dashboard
      setTimeout(() => {
        router.push("/login")
      }, 500)
    } catch (error) {
      setIsSubmitting(false)
      const errorMessage = getErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Onboarding Error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-gray-900 flex items-center justify-center px-2 py-4 sm:p-4">
      {isLoading ? (
        <LoadingScreen 
          duration={2500} 
          onLoadingComplete={handleLoadingComplete} 
        />
      ) : (
        <OnboardingForm onComplete={handleOnboardingComplete} isSubmitting={isSubmitting} />
      )}
    </div>
  )
}
