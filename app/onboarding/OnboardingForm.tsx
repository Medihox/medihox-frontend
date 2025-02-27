"use client"

import { useState, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSendOnboardingOtpMutation, useVerifyEmailMutation, useVerifySecretKeyMutation } from "@/lib/redux/services/authApi"
import { getErrorMessage } from "@/lib/api/apiUtils"
import toast from "react-hot-toast"
import { Eye, EyeOff, Upload, Loader2 } from "lucide-react"
import { OTPInputField } from "./OTPInput"

const passwordSchema = z.string().min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: passwordSchema
});

const otpSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  otp: z.string().length(6, "OTP must be exactly 6 characters."),
  password: passwordSchema
});

const secretKeySchema = z.object({
  secretKey: z.string().min(6, "Secret key must be at least 6 characters."),
  email: z.string().email(),
  otp: z.string(),
  password: passwordSchema
});

const organizationSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters."),
  organizationLogo: z.instanceof(File).optional(),
  email: z.string().email(),
  otp: z.string(),
  password: passwordSchema,
  secretKey: z.string()
});

type EmailFormValues = z.infer<typeof emailSchema>
type OtpFormValues = z.infer<typeof otpSchema>
type SecretKeyFormValues = z.infer<typeof secretKeySchema>
type OrganizationFormValues = z.infer<typeof organizationSchema>

interface OnboardingFormProps {
  onComplete: (data: OrganizationFormValues) => void
  isSubmitting: boolean
}

export default function OnboardingForm({ onComplete, isSubmitting }: OnboardingFormProps) {
  const [step, setStep] = useState<"email" | "otp" | "secretKey" | "organization">("email")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userOtp, setUserOtp] = useState("")
  const [userSecretKey, setUserSecretKey] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOnboardingOtpMutation()
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation()
  const [verifySecretKey, { isLoading: isVerifyingSecretKey }] = useVerifySecretKeyMutation()

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
    email: "",
      otp: "",
    password: "",
    },
  })

  const secretKeyForm = useForm<SecretKeyFormValues>({
    resolver: zodResolver(secretKeySchema),
    defaultValues: {
      secretKey: "",
      email: "",
    otp: "",
      password: ""
    },
  })
  
  const organizationForm = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      otp: "",
      password: "",
      secretKey: ""
    },
  })

  const handleSendOtp = async (data: EmailFormValues) => {
    try {
      // Send both email and password when requesting OTP
      await sendOtp({ 
        email: data.email,
        password: data.password 
      }).unwrap()
      
      setUserEmail(data.email)
      setUserPassword(data.password)
      
      otpForm.setValue("email", data.email)
      otpForm.setValue("password", data.password)
      
      setStep("otp")
      toast.success("OTP sent to your email")
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to send OTP. Please try again.")
    }
  }

  const handleVerifyOtp = async (data: OtpFormValues) => {
    try {
      // First verify the OTP with the API
      await verifyEmail({
        email: data.email,
        otp: data.otp
      }).unwrap()
      
      // Store OTP for final submission
      setUserOtp(data.otp)
      
      // Set up the secret key form with previous data
      secretKeyForm.setValue("email", data.email)
      secretKeyForm.setValue("otp", data.otp)
      secretKeyForm.setValue("password", data.password)
      
      // Move to the secret key step
      setStep("secretKey")
      toast.success("Email verified successfully")
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to verify OTP. Please try again.")
    }
  }
  
  const handleVerifySecretKey = async (data: SecretKeyFormValues) => {
    try {
      // Verify secret key with email
      await verifySecretKey({
        secretKey: data.secretKey,
        email: data.email
      }).unwrap()
      
      setUserSecretKey(data.secretKey)
      
      // Set up organization form with previous data
      organizationForm.setValue("email", data.email)
      organizationForm.setValue("otp", data.otp)
      organizationForm.setValue("password", data.password)
      organizationForm.setValue("secretKey", data.secretKey)
      
      // Move to organization step
      setStep("organization")
      toast.success("Secret key verified successfully")
    } catch (error) {
      toast.error(getErrorMessage(error) || "Invalid secret key. Please try again.")
    }
  }
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Set the file in the form
      organizationForm.setValue("organizationLogo", file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const triggerLogoUpload = () => {
    fileInputRef.current?.click()
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const getFormTitle = () => {
    switch (step) {
      case "email":
        return "Complete Your Onboarding";
      case "otp":
        return "Verify Your Email";
      case "secretKey":
        return "Enter Secret Key";
      case "organization":
        return "Organization Details";
      default:
        return "Complete Onboarding";
    }
  }

  const getFormDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email and create a password to continue";
      case "otp":
        return "Enter the verification code sent to your email";
      case "secretKey":
        return "Enter the secret key provided by your administrator";
      case "organization":
        return "Set up your organization profile";
      default:
        return "";
    }
  }

  const handleFinalSubmit = (data: OrganizationFormValues) => {
    onComplete({
      email: data.email,
      organizationName: data.organizationName,
      otp: data.otp,
      password: data.password,
      secretKey: data.secretKey,
      organizationLogo: data.organizationLogo
    });
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">{getFormTitle()}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {getFormDescription()}
        </p>
      </div>

      {step === "email" && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-6">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      disabled={isSendingOtp}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={emailForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Create a secure password"
                        type={showPassword ? "text" : "password"}
                        disabled={isSendingOtp}
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 8 characters with uppercase, lowercase, and number.
                  </p>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        </Form>
      )}

      {step === "otp" && (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
            <OTPInputField 
              control={otpForm.control}
              name="otp"
              label="Verification Code"
            />
            
            <div className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP & Continue"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => emailForm.getValues().email && emailForm.getValues().password ? 
                  handleSendOtp({
                    email: emailForm.getValues().email,
                    password: emailForm.getValues().password
                  }) : 
                  setStep("email")
                }
                disabled={isSendingOtp}
              >
                {isSendingOtp ? "Resending..." : "Resend Code"}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === "secretKey" && (
        <Form {...secretKeyForm}>
          <form onSubmit={secretKeyForm.handleSubmit(handleVerifySecretKey)} className="space-y-6">
            <FormField
              control={secretKeyForm.control}
              name="secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your secret key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This key is provided by your administrator
                  </p>
                </FormItem>
              )}
            />
            
            <div className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isVerifyingSecretKey}
              >
                {isVerifyingSecretKey ? "Verifying..." : "Verify & Continue"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep("otp")}
              >
                Back to OTP Verification
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      {step === "organization" && (
        <Form {...organizationForm}>
          <form onSubmit={organizationForm.handleSubmit(handleFinalSubmit)} className="space-y-6">
            <FormField
              control={organizationForm.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your organization name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Organization Logo</FormLabel>
              <div className="flex flex-col items-center space-y-4">
                {logoPreview ? (
                  <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                      onClick={triggerLogoUpload}
                    >
                      Change
                    </button>
          </div>
                ) : (
                  <div 
                    className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={triggerLogoUpload}
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Upload Logo</span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: Square image, 512x512px or larger
                </p>
              </div>
            </FormItem>
            
            <div className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  "Complete Onboarding"
                )}
            </Button>
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep("secretKey")}
              >
                Back to Secret Key
            </Button>
          </div>
          </form>
        </Form>
      )}
      </div>
  )
}
