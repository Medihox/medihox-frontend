"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, LogOut, Users, Settings, Building2, Package, LifeBuoy, CreditCard, ScrollText 
} from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import axios from "axios";

const menuItems = [
  { label: "Overview", icon: Building2, href: "/super-admin/dashboard" },
  { label: "Admins", icon: Users, href: "/super-admin/admins" },
  { label: "Services", icon: Package, href: "/super-admin/services" },
  { label: "Support", icon: LifeBuoy, href: "/super-admin/support" },
  { label: "Subscriptions", icon: CreditCard, href: "/super-admin/subscriptions" },
  { label: "Transactions", icon: ScrollText, href: "/super-admin/transactions" },
  { label: "Settings", icon: Settings, href: "/super-admin/settings" },
];

export function SuperAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Close mobile menu if open
      if (mobileNavOpen) {
        setMobileNavOpen(false);
      }
      
      // Call the server logout endpoint to clear HTTP-only cookies
      try {
        await axios.post('/api/auth/logout');
      } catch (serverError) {
        console.error("Server logout failed:", serverError);
        // Continue with client-side logout even if server call fails
      }
      
      // Clear all browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear specific tokens as a fallback
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      
      // Clear cookies on the client side
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      }
      
      // Also try to clear domain cookies
      const domain = window.location.hostname;
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      }
      
      // Dispatch the logout action to clear the Redux state
      dispatch(logout());
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to login page after a short delay
      // This ensures all cleanup operations complete before navigation
      setTimeout(() => {
        router.push("/login");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {!isMobile && (
        <div
          className={cn(
            "h-screen bg-white dark:bg-gray-900 border-r flex flex-col transition-all duration-300",
            collapsed ? "w-20" : "w-64"
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <div className="dark:hidden">
                  <Image src="/icon_light.png" alt="Logo" width={40} height={40} />
                </div>
                <div className="hidden dark:block">
                  <Image src="/icon_dark.png" alt="Logo" width={40} height={40} />
                </div>
              </div>
              {!collapsed && <h1 className="text-xl font-bold text-gray-900 dark:text-white">Super Admin</h1>}
            </div>
            <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-gray-100">
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
          </div>

          <nav className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-purple-600 text-white dark:bg-purple-500"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full ${
                isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoggingOut ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              {!collapsed && <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>}
            </button>
          </div>
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setMobileNavOpen(true)}
          className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      <AnimatePresence>
        {isMobile && mobileNavOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
            className="fixed top-0 right-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-lg border-l z-50 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <div className="dark:hidden">
                    <Image src="/icon_light.png" alt="Logo" width={32} height={32} />
                  </div>
                  <div className="hidden dark:block">
                    <Image src="/icon_dark.png" alt="Logo" width={32} height={32} />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Super Admin</h2>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="px-4 py-2 space-y-2 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-purple-600 text-white dark:bg-purple-500"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full ${
                  isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoggingOut ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
