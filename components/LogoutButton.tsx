"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear auth state from Redux
    dispatch(logout());
    
    // Clear cookies
    document.cookie = "isAuthenticated=; path=/; max-age=0";
    document.cookie = "userRole=; path=/; max-age=0";
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Redirect to login page
    router.push("/login");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
} 