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
    organizationLogo?: File;
  }) => {
    setIsSubmitting(true)
    try {
      // Create the API request object with required fields
      const requestData: any = {
        email: data.email,
        organizationName: data.organizationName
      };
      
      // Process organization logo if available
      if (data.organizationLogo) {
        try {
          // Convert logo to base64 string with proper format
          const base64Logo = await convertFileToBase64(data.organizationLogo);
          
          // Ensure the base64 string starts with 'data:image' as expected by backend
          if (base64Logo && base64Logo.startsWith('data:image')) {
            requestData.organizationLogo = base64Logo;
          } else {
            console.error("Invalid image format:", base64Logo?.substring(0, 30) + "...");
          }
        } catch (error) {
          console.error("Error converting logo to base64:", error);
          // Continue without logo on error, backend will use default
        }
      }
      
      // Submit to API
      const response = await completeOnboarding(requestData).unwrap();
      console.log("Onboarding successful:", response);
      
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
  
  // Helper function to convert File to base64 string
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
