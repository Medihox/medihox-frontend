"use client";

import { useEffect, useState } from "react";
import { SuperAdminSidebar } from "@/components/layout/super-admin-sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className={`h-full relative ${inter.className}`}>
      <div className="flex h-screen">
        <SuperAdminSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
