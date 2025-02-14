"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, LogOut, Users, Settings, Building2, Package, LifeBuoy, CreditCard, ScrollText 
} from "lucide-react";
import { FaClinicMedical } from "react-icons/fa";

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

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
              <FaClinicMedical className="h-8 w-8 text-purple-600 dark:text-purple-400" />
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Super Admin</h2>
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
