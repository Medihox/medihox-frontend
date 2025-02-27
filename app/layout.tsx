import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ReduxProviders } from '@/lib/redux/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clinic Management System',
  description: 'A comprehensive SAAS solution for clinic management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-screen">
              {/* Theme Toggle Positioned at Top-Right */}
              <div className="absolute top-1 right-10 z-50">
                <ThemeToggle />
              </div>

              {/* Page Content */}
              {children}
            </div>
          </ThemeProvider>
          <Toaster />
          
          {/* Add Hot Toast Provider */}
          <HotToaster position="top-right" />
        </ReduxProviders>
      </body>
    </html>
  );
}
