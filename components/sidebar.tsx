"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // ✅ Smooth animations
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
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
} from "lucide-react";
import { FaClinicMedical } from "react-icons/fa";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileSpreadsheet, label: "Inquiries", href: "/inquiries" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: UserCog, label: "Patients", href: "/patients" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: PlusCircle, label: "Support", href: "/support" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect if it's a mobile view
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <div
          className={cn(
            "h-screen bg-white border-r flex flex-col transition-all duration-300",
            collapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo & Toggle Button */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaClinicMedical className="h-8 w-8 text-gray-700" />
              {!collapsed && <h1 className="text-2xl font-bold text-gray-900">Clinic</h1>}
            </div>
            <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-gray-100">
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="px-2 space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                    pathname === item.href && "bg-gray-100 text-gray-900 font-medium"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4 pb-4">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full">
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navbar for Mobile */}
      {isMobile && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed bottom-0 w-full bg-white border-t shadow-lg flex justify-around p-3"
        >
          {menuItems.slice(0, 5).map((item) => { // Show only 5 items in bottom nav
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center text-gray-700">
                <Icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </motion.nav>
      )}
    </>
  );
}
