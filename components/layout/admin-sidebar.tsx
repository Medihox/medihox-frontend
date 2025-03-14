"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard,
  FileSpreadsheet,
  Calendar,
  UserCog,
  Users,
  Bell,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Paintbrush,
  CheckCircle
} from "lucide-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import toast from "react-hot-toast";
import { useGetUserProfileQuery } from "@/lib/redux/services/authApi";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: FileSpreadsheet, label: "Enquiries(Leads)", href: "/admin/inquiries" },
  { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
  { icon: CheckCircle, label: "Converted", href: "/admin/converted" },
  { icon: UserCog, label: "Patients", href: "/admin/patients" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { 
    icon: Paintbrush,
    label: "Customizations", 
    href: "/admin/customizations" 
  },
  { icon: PlusCircle, label: "Support", href: "/admin/support" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Fetch the user profile data
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery();
  const userName = userProfile?.name || "Admin User";

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    
    document.cookie = "isAuthenticated=; path=/; max-age=0";
    document.cookie = "userRole=; path=/; max-age=0";
    
    toast.success("Logged out successfully");
    
    router.push("/login");
  };

  // Helper function to check if current path is active for a menu item
  const isActive = (href: string) => {
    if (pathname === href) return true;
    
    // For sub-routes, check if the pathname starts with the menu item href
    // But make sure it's a complete segment match (e.g., /admin/patients should match /admin/patients/123
    // but not /admin/patient-settings)
    if (href !== '/admin/dashboard') { // Dashboard is special case, only exact match
      return pathname.startsWith(href + '/');
    }
    
    return false;
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
            <div className="flex gap-2 items-center">
              <div className="relative h-8 w-8">
                <div className="dark:hidden">
                  <Image src="/icon_light.png" alt="Logo" width={32} height={32} />
                </div>
                <div className="hidden dark:block">
                  <Image src="/icon_dark.png" alt="Logo" width={32} height={32} />
                </div>
              </div>
              {!collapsed && (
                profileLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {userName}
                  </h1>
                )
              )}
            </div>
            <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-gray-100">
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
          </div>
          
          <nav className="overflow-y-auto scrollbar-hide flex-1 p-4 space-y-2 no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive(item.href) || pathname === item.href
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Logout</span>}
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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {profileLoading ? <Skeleton className="h-6 w-32" /> : userName}
                </h2>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="overflow-y-auto scrollbar-hide flex-1 px-4 py-2 space-y-2 no-scrollbar">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive(item.href) || pathname === item.href
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
