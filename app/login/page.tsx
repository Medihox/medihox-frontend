"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dummyUser, dummySuperAdmin } from "@/lib/dummy-data";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Dummy authentication logic
    const user = values.email === dummySuperAdmin.email 
      ? dummySuperAdmin 
      : dummyUser;
    
    setIsLoading(false);
    
    toast({
      title: "Login Successful",
      description: "Redirecting to dashboard...",
    });

    // Redirect based on user type
    router.push(user.userType === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-950 p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-4">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Login</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the admin portal
          </p>
        </div>

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
                      placeholder="admin@clinic.com"
                      type="email"
                      disabled={isLoading}
                      {...field}
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
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center">
                <Link
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Protected by enterprise-grade security</p>
          <p className="mt-2 text-xs">
            Demo credentials:<br />
            Admin: admin@clinic.com<br />
            Super Admin: super@clinic.com<br />
            Password: any 8+ characters
          </p>
        </div>
      </div>
    </div>
  );
}