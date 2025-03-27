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
  title: {
    default: 'MediHox - Medical Lead Management Software',
    template: '%s | MediHox'
  },
  description: 'Best-in-class medical lead management system for healthcare providers. Boost patient acquisition and streamline your practice.',
  keywords: 'medical lead management, healthcare CRM, patient acquisition, clinic management, hospital management',
  authors: [{ name: 'MediHox' }],
  creator: 'MediHox',
  publisher: 'MediHox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medihox.com',
    siteName: 'MediHox',
    title: 'MediHox - Medical Lead Management Software',
    description: 'Best-in-class medical lead management system for healthcare providers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediHox Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediHox - Medical Lead Management Software',
    description: 'Best-in-class medical lead management system for healthcare providers.',
    images: ['/twitter-image.jpg'],
    creator: '@medihox',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
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
              <div className="fixed bottom-5 right-5 z-50">
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
