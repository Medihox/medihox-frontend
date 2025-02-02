'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Hide sidebar on onboarding and login pages
  const hideSidebar = ['/onboarding', '/login'].includes(pathname);

  useEffect(() => {
    // Check if user is visiting for the first time
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');

    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
      localStorage.setItem('hasCompletedOnboarding', 'true'); // Mark onboarding as done
    }
  }, [router]);

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
