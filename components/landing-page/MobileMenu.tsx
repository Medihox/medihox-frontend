"use client";

import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToEnquiry: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const MobileMenu = ({ isOpen, setIsOpen, scrollToEnquiry }: MobileMenuProps) => {
  return (
    <motion.div 
      className={`fixed inset-0 bg-background z-50 flex flex-col p-6 ${isOpen ? 'block' : 'hidden'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-8">
        <Link href="/" onClick={(e) => {
          e.preventDefault();
          setIsOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary"></div>
          <span className="font-bold text-xl">MedClinic</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col space-y-6 text-xl">
        <Link 
          href="#features" 
          className="py-2 hover:text-primary transition-colors"
          onClick={() => {
            setIsOpen(false);
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Features
        </Link>
        <Link 
          href="#testimonials" 
          className="py-2 hover:text-primary transition-colors"
          onClick={() => {
            setIsOpen(false);
            document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Testimonials
        </Link>
        <Link 
          href="#pricing" 
          className="py-2 hover:text-primary transition-colors"
          onClick={() => {
            setIsOpen(false);
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Pricing
        </Link>
        <Link 
          href="#faq" 
          className="py-2 hover:text-primary transition-colors"
          onClick={() => {
            setIsOpen(false);
            document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          FAQ
        </Link>
      </div>
      
      <div className="mt-auto flex flex-col space-y-4 pt-8">
        <Link href="/login" onClick={() => setIsOpen(false)}>
          <Button variant="outline" className="w-full">Log In</Button>
        </Link>
        <Link 
          href="#enquiry" 
          onClick={(e) => {
            setIsOpen(false);
            scrollToEnquiry(e);
          }}
        >
          <Button className="w-full">Get Started</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default MobileMenu; 