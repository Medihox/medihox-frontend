"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LogOut, Users, Settings, Building2, Package, LifeBuoy, CreditCard, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaClinicMedical } from "react-icons/fa";

const routes = [
  {
    label: "Overview",
    icon: Building2,
    href: "/super-admin/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Admins",
    icon: Users,
    href: "/super-admin/admins",
    color: "text-violet-500",
  },
  {
    label: "Services",
    icon: Package,
    href: "/super-admin/services",
    color: "text-pink-700",
  },
  {
    label: "Support",
    icon: LifeBuoy,
    href: "/super-admin/support",
    color: "text-orange-700",
  },
  {
    label: "Subscriptions",
    icon: CreditCard,
    href: "/super-admin/subscriptions",
    color: "text-emerald-500",
  },
  {
    label: "Transactions",
    icon: ScrollText,
    href: "/super-admin/transactions",
    color: "text-green-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
];

export function SuperAdminSidebar() {
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
              {!collapsed && <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>}
            </div>
            <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-gray-100">
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="px-2 space-y-2 flex-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                  pathname === route.href && "bg-gray-100 text-gray-900 font-medium"
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                {!collapsed && <span>{route.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="px-4 pb-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-5 w-5" />
                {!collapsed && <span>Logout</span>}
              </Link>
            </Button>
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
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button onClick={() => setMobileNavOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="px-4 py-2 space-y-2 flex-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                    pathname === route.href && "bg-gray-100 text-gray-900 font-medium"
                  )}
                >
                  <route.icon className={cn("h-5 w-5", route.color)} />
                  <span>{route.label}</span>
                </Link>
              ))}
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
