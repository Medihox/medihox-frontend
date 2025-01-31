'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar on onboarding and login pages
  const hideSidebar = ['/onboarding', '/login'].includes(pathname);

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
