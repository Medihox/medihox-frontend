"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Smooth animations
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
} from "lucide-react";
import { FaClinicMedical } from "react-icons/fa";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: FileSpreadsheet, label: "Inquiries", href: "/admin/inquiries" },
  { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
  { icon: UserCog, label: "Patients", href: "/admin/patients" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: PlusCircle, label: "Support", href: "/admin/support" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
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

      {/* Mobile Navigation Button */}
      {isMobile && (
        <button
          onClick={() => setMobileNavOpen(true)}
          className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Right-Side Sliding Mobile Navigation */}
      <AnimatePresence>
        {isMobile && mobileNavOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
            className="fixed top-0 right-0 h-screen w-64 bg-white shadow-lg border-l z-50 flex flex-col"
          >
            {/* Close Button */}
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold text-gray-900">Admin</h2>
              <button onClick={() => setMobileNavOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="px-4 py-2 space-y-2 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                      pathname === item.href && "bg-gray-100 text-gray-900 font-medium"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4">
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full">
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
