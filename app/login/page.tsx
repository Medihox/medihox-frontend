"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/lib/redux/services/authApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Clear previous error message
    setErrorMessage(null);
    
    try {
      const response = await login(values).unwrap();
      dispatch(
        setCredentials({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        })
      );

      // Store auth state in cookies for middleware
      document.cookie = "isAuthenticated=true; path=/; max-age=31536000"; // 1 year
      document.cookie = `userRole=${response.user.role}; path=/; max-age=31536000`;

      // Show success toast
      showSuccessToast(`Welcome, ${response.user.name || 'User'}! Login successful.`);

      // Redirect based on user role
      setTimeout(() => {
        if (response.user.role === "SUPER_ADMIN") {
          router.push("/super-admin/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      }, 800);
    } catch (error: any) {
      // Extract the specific error message from the backend response
      let message = "Login failed. Please try again.";
      
      // Check for different structures of error responses
      if (error.data?.message) {
        message = error.data.message;
      } else if (error.data?.error) {
        message = error.data.error;
      } else if (error.message) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      
      // Set the error message to display in the UI
      setErrorMessage(message);
      
      // Also show a toast for immediate feedback
      showErrorToast(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Display backend error message */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
            {errorMessage}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Add the onboarding option */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            New clinic or first time?{" "}
            <Link href="/onboarding" className="text-purple-600 hover:text-purple-700 font-medium">
              Complete your onboarding
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}