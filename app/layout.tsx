import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clinic Management System',
  description: 'Manage your clinic inquiries and appointments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
