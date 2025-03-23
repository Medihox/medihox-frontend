"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Users, 
  Calendar, 
  ClipboardList, 
  CreditCard, 
  Lock, 
  LineChart, 
  HelpCircle, 
  Menu,
  ArrowUp,
  ArrowUpRight,
  CheckCircle,
  Activity,
  BarChart3,
  Shield,
  DollarSign,
  ArrowDown,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import the components
import SEOMetadata from './SEOMetadata';
import AnimatedSection from './AnimatedSection';
import FeatureCard from './FeatureCard';
import TestimonialCard from './TestimonialCard';
import PricingTier from './PricingTier';
import EnquiryForm from './EnquiryForm';
import MobileMenu from './MobileMenu';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState<string>("India");
  
  // Location-specific data
  const locationData = {
    "India": {
      testimonials: [
        {
          quote: "This system has transformed our multi-specialty clinic. Patient wait times are reduced by 40%, and our doctors can focus on patient care rather than paperwork.",
          author: "Dr. Rajesh Sharma",
          role: "Director, Arogya Healthcare, Mumbai",
          stars: 5
        },
        {
          quote: "The scheduling and WhatsApp reminder features reduced our no-shows by 70%. With high patient volumes, this efficiency has been a game-changer for us.",
          author: "Dr. Priya Patel",
          role: "Chief Medical Officer, Wellness Multi-Specialty Clinic, Bangalore",
          stars: 5
        },
        {
          quote: "After trying several management systems, this is the only one that handles our Ayurvedic treatments scheduling alongside modern medicine. The support team understands Indian healthcare needs.",
          author: "Dr. Ananya Mehta",
          role: "Founder, Ayush Integrated Clinic, New Delhi",
          stars: 5
        }
      ],
      partners: ['Apollo Hospitals', 'Max Healthcare', 'Fortis', 'City Hospital', 'MediHox Centers'],
      regionBenefits: [
        "Compliant with Indian healthcare regulations", 
        "Built-in Aadhaar verification", 
        "GST-ready billing system", 
        "Multi-language support including Hindi, Tamil, Telugu, and Bengali",
        "WhatsApp integration for patient communication"
      ]
    },
    "India-Mumbai": {
      testimonials: [
        {
          quote: "As a leading healthcare provider in Mumbai, we've seen a 45% increase in patient bookings since implementing MediHox. The system's ability to handle our high patient volume is remarkable.",
          author: "Dr. Vikram Mehta",
          role: "CEO, Prime Hospitals, Bandra",
          stars: 5
        },
        {
          quote: "The local support team understands the unique healthcare landscape of Mumbai. The platform's WhatsApp integration is perfect for our patient base who prefer instant communication.",
          author: "Dr. Seema Shah",
          role: "Medical Director, Lifeline Clinics, Andheri",
          stars: 5
        },
        {
          quote: "From Marine Drive to Powai, we manage multiple branches effortlessly with MediHox. The centralized patient data has been crucial for our expanding network across Mumbai.",
          author: "Raj Malhotra",
          role: "Operations Head, Mumbai Medical Network, Worli",
          stars: 5
        }
      ],
      partners: ['Lilavati Hospital', 'Kokilaben Hospital', 'Hinduja Hospital', 'Nanavati Hospital', 'Wockhardt Mumbai'],
      regionBenefits: [
        "Mumbai local transport mapping for appointment scheduling", 
        "Multi-branch management across Mumbai suburbs", 
        "Tailored for high-volume urban patient flow",
        "Local Mumbai healthcare network integration",
        "Monsoon season SMS alerts system"
      ]
    },
    "India-Delhi": {
      testimonials: [
        {
          quote: "The Delhi pollution monitoring integration with appointment scheduling has been invaluable for our respiratory clinic. We can now proactively manage patient flow during poor AQI days.",
          author: "Dr. Arjun Singh",
          role: "Pulmonologist, Delhi Breath Clinic, Connaught Place",
          stars: 5
        },
        {
          quote: "With patients coming from all over NCR, the MediHox system helps us manage the complex scheduling and follow-ups across Delhi, Gurgaon, and Noida seamlessly.",
          author: "Dr. Kiran Reddy",
          role: "Director, Delhi Metro Hospitals, South Delhi",
          stars: 5
        },
        {
          quote: "The multi-language support is perfect for our diverse Delhi patient base. The system's ability to send reminders in Hindi, English, and Punjabi has reduced our no-show rate significantly.",
          author: "Anjali Sharma",
          role: "Patient Coordinator, Delhi Medical Center, Rohini",
          stars: 4
        }
      ],
      partners: ['AIIMS Delhi', 'Fortis Escorts', 'Max Super Speciality', 'Apollo Delhi', 'Sir Ganga Ram Hospital'],
      regionBenefits: [
        "NCR-wide scheduling with traffic time estimates", 
        "Delhi pollution AQI integration for respiratory clinics", 
        "Multi-language support for Delhi's diverse population",
        "AIIMS and other Delhi government hospital referral system",
        "Delhi metro station proximity tagging"
      ]
    },
    "India-Bangalore": {
      testimonials: [
        {
          quote: "As a tech-focused healthcare provider in Bangalore, we needed a system that could match our innovation pace. MediHox integrates perfectly with our existing tech stack and healthcare apps.",
          author: "Dr. Vivek Kumar",
          role: "CTO & Chief Physician, TechMed Clinic, Electronic City",
          stars: 5
        },
        {
          quote: "The analytics dashboard helps us track patient acquisition from Bangalore's IT corridors. We've optimized our specialist availability based on these insights.",
          author: "Dr. Lakshmi Nair",
          role: "CEO, Bangalore Health Systems, Whitefield",
          stars: 5
        },
        {
          quote: "Managing our wellness programs for Bangalore's corporate clients has become effortless with MediHox. The corporate package management feature is tailored perfectly for Bangalore's tech companies.",
          author: "Rahul Menon",
          role: "Wellness Director, Corporate Health Solutions, Koramangala",
          stars: 5
        }
      ],
      partners: ['Manipal Hospital', 'Narayana Health City', 'Columbia Asia', 'Baptist Hospital', 'Bangalore IT Health Consortium'],
      regionBenefits: [
        "Integration with Bangalore tech company healthcare portals", 
        "Special features for managing corporate wellness programs", 
        "Traffic-aware scheduling for Bangalore's notorious congestion",
        "Bangalore tech park shuttle service integration",
        "Specialized IT professional healthcare packages"
      ]
    },
    "USA": {
      testimonials: [
        {
          quote: "We've increased our new patient acquisition by 35% since implementing MediHox. The ROI tracking is exceptional for monitoring our marketing spend.",
          author: "Dr. Sarah Johnson",
          role: "CEO, Wellness Medical Center, Boston",
          stars: 5
        },
        {
          quote: "The HIPAA compliance features give us peace of mind, and the integration with our EHR system was surprisingly smooth.",
          author: "Dr. Michael Williams",
          role: "Medical Director, Pacific Health Partners, San Francisco",
          stars: 5
        },
        {
          quote: "The analytics dashboard helps us identify trends and optimize our patient acquisition funnel. It's been a tremendous asset for our multi-location practice.",
          author: "Jennifer Rodriguez",
          role: "Practice Manager, Southern Medical Group, Houston",
          stars: 4
        }
      ],
      partners: ['Cleveland Clinic', 'Kaiser Permanente', 'Mayo Clinic', 'Johns Hopkins', 'HCA Healthcare'],
      regionBenefits: [
        "Fully HIPAA compliant with audit logs", 
        "Insurance verification integration", 
        "Seamless Epic and Cerner EHR connectivity", 
        "US-based cloud hosting with SOC 2 compliance",
        "Stripe and Square payment processor integration"
      ]
    },
    "UK": {
      testimonials: [
        {
          quote: "MediHox has helped our NHS-affiliated clinic streamline the patient journey while maintaining compliance with all regulations.",
          author: "Dr. Emma Thompson",
          role: "Clinical Director, London Health Centre",
          stars: 5
        },
        {
          quote: "The scheduling system integrates perfectly with our NHS referral process, which has reduced administrative overhead significantly.",
          author: "Dr. James Wilson",
          role: "GP Partner, Manchester Medical Group",
          stars: 4
        },
        {
          quote: "Patient engagement has improved dramatically with the automated follow-up system. Brilliant software for private practices in the UK market.",
          author: "Dr. Oliver Davies",
          role: "Owner, Edinburgh Wellness Clinic",
          stars: 5
        }
      ],
      partners: ['NHS Providers', 'Bupa UK', 'Spire Healthcare', 'BMI Healthcare', 'Nuffield Health'],
      regionBenefits: [
        "NHS Digital integration", 
        "UK GDPR and Data Protection Act 2018 compliance", 
        "Patient record access compliant with UK standards", 
        "Integration with UK e-prescription systems",
        "UK healthcare pathway optimization"
      ]
    }
  };

  // Indian cities for location dropdown
  const indianCities = [
    { value: "India", label: "All India" },
    { value: "India-Mumbai", label: "Mumbai" },
    { value: "India-Delhi", label: "Delhi" },
    { value: "India-Bangalore", label: "Bangalore" },
    { value: "India-Chennai", label: "Chennai" },
    { value: "India-Hyderabad", label: "Hyderabad" },
    { value: "India-Kolkata", label: "Kolkata" },
    { value: "India-Pune", label: "Pune" },
    { value: "India-Jaipur", label: "Jaipur" },
    { value: "India-Ahmedabad", label: "Ahmedabad" },
    { value: "India-Goa", label: "Goa" },
  ];

  // Getting location data with fallback to base country if city-specific data isn't available
  const getLocationData = (loc: string) => {
    if (locationData[loc as keyof typeof locationData]) {
      return locationData[loc as keyof typeof locationData];
    }
    
    // If city-specific data not found, fall back to country level data
    const baseCountry = loc.includes("-") ? loc.split("-")[0] : loc;
    return locationData[baseCountry as keyof typeof locationData] || locationData["India"];
  };

  const currentLocationData = getLocationData(location);
  
  // Function to get display location name
  const getDisplayLocation = (loc: string) => {
    if (loc.includes("-")) {
      return loc.split("-")[1];
    }
    return loc;
  };
  
  const displayLocation = getDisplayLocation(location);
  
  const scrollToEnquiry = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('enquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    // Apply overflow-x-hidden to the document body on mount to prevent horizontal scrolling
    document.body.classList.add('overflow-x-hidden');
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      // Remove the class when component unmounts
      document.body.classList.remove('overflow-x-hidden');
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="overflow-x-hidden relative w-full">
      <SEOMetadata location={location} />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
        scrollToEnquiry={scrollToEnquiry}
      />
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-40 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-6">
          <Link href="/" onClick={scrollToTop} className="flex items-center gap-3 group">
            <div className="relative h-14 w-14 transition-transform duration-300 group-hover:scale-105">
              <div className="dark:hidden">
                <Image src="/icon_light.png" alt="Logo" width={56} height={56} className="drop-shadow-sm" />
              </div>
              <div className="hidden dark:block">
                <Image src="/icon_dark.png" alt="Logo" width={56} height={56} className="drop-shadow-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl md:text-2xl transition-colors duration-300 group-hover:text-primary">MEDI HOX</span>
              <span className="text-[10px] tracking-widest font-medium text-muted-foreground">◆ LEAD-BOOSTER ◆</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Features</Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Testimonials</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Pricing</Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">FAQ</Link>
          </nav>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {location !== "India" && (
              <div className="flex items-center text-xs text-muted-foreground border-r pr-4 mr-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {displayLocation}
                </span>
              </div>
            )}
            <Link href="/login">
              <Button variant="outline" className="rounded-full px-5 hover:shadow-md transition-all">Log In</Button>
            </Link>
            <Link href="#enquiry" onClick={scrollToEnquiry}>
              <Button className="rounded-full px-5 hover:shadow-md transition-all">Get Started</Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full hover:bg-primary/10"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-28 pb-14 md:pt-32 md:pb-20 relative bg-gradient-to-b from-background to-muted/30">
        {/* Background decoration elements */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative">
          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-6 lg:col-span-6"
            >
              <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-full py-1 px-3 w-fit mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium">#{displayLocation}'s Top Healthcare Lead Management</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                #1 Medical <span className="from-purple-700 to-teal-500  bg-gradient-to-r text-transparent bg-clip-text">Lead Management</span> Software in {displayLocation}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Trusted by leading hospitals & clinics in {displayLocation} to capture, track, and convert healthcare leads into patients. 
                Boost your medical practice's growth with our HIPAA compliant patient acquisition system.
              </p>
              
              <div className="flex flex-row gap-4 mb-8">
                <Link href="#enquiry" onClick={scrollToEnquiry} className="w-auto">
                  <Button size="lg" className="group rounded-full px-7 py-6 shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px]">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#enquiry" onClick={scrollToEnquiry} className="w-auto">
                  <Button size="lg" variant="outline" className="rounded-full px-7 py-6 hover:bg-muted/50">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-5 w-5 text-primary" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>
            
            {/* Dashboard with Stats Cards */}
            <div className="relative md:col-span-6 lg:col-span-6">
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-green-400/10 rounded-full filter blur-3xl -z-10"></div>
              
              {/* Dashboard Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl border shadow-2xl bg-white dark:bg-gray-900 mx-8 my-8 relative"
            >
                {/* Light Mode Image */}
                <div className="dark:hidden overflow-hidden rounded-xl">
                <Image 
                  src="/dashboard_light.png" 
                  alt="Dashboard Preview - Light Mode" 
                  width={1000}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Dashboard+Preview";
                  }}
                />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
                </div>
                
                {/* Dark Mode Image */}
                <div className="hidden dark:block overflow-hidden rounded-xl">
                <Image 
                  src="/dashboard_dark.png" 
                  alt="Dashboard Preview - Dark Mode" 
                  width={1000}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Dashboard+Preview";
                  }}
                />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
              </div>
            </motion.div>
              
              {/* Conversion Rate Stats Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-3 z-20 border-2 border-white dark:border-gray-800 hover:border-primary/20 dark:hover:border-primary/20 transition-colors"
              >
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-full">
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Conversion Rate</p>
                  <p className="font-bold">+27% <span className="text-xs font-normal">this month</span></p>
                </div>
              </motion.div>
              
              {/* New Leads Stats Card */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-20 border-2 border-white dark:border-gray-800 hover:border-primary/20 dark:hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-purple-500" />
                  <p className="font-medium text-sm">New Leads</p>
                </div>
                <p className="font-bold text-lg">128 <span className="text-xs font-normal text-gray-500">today</span></p>
              </motion.div>
            </div>
          </div>
          
          {/* Mobile View - Redesigned */}
          <div className="md:hidden flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-full py-1 px-3 w-fit mx-auto mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium">#{displayLocation}'s Top Medical CRM</span>
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight mb-4 text-center">
                #1 Medical <span className="from-purple-700 to-teal-500 bg-gradient-to-r text-transparent bg-clip-text">Lead Management</span> in {displayLocation}
              </h1>
              <p className="text-base text-muted-foreground mb-6 text-center">
                Trusted by leading hospitals & clinics in {displayLocation} to capture, track, and convert patient leads.
              </p>
            </motion.div>
            
            {/* Dashboard Preview with Stats Cards */}
            <div className="relative mx-4 mb-16">
              {/* Dashboard Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-xl border shadow-lg bg-white dark:bg-gray-900 relative"
              >
                {/* Light Mode Image */}
                <div className="dark:hidden overflow-hidden rounded-xl">
                  <Image 
                    src="/dashboard_light.png" 
                    alt="Dashboard Preview - Light Mode" 
                    width={800}
                    height={480}
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Dashboard+Preview";
                    }}
                  />
                  {/* Window Controls */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                {/* Dark Mode Image */}
                <div className="hidden dark:block overflow-hidden rounded-xl">
                  <Image 
                    src="/dashboard_dark.png" 
                    alt="Dashboard Preview - Dark Mode" 
                    width={800}
                    height={480}
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Dashboard+Preview";
                    }}
                  />
                  {/* Window Controls */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                {/* Lead Booster badge */}
                <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Lead Booster
                </div>
                
                {/* Established year badge */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md z-10">
                  ESTD. 2025
                </div>
              </motion.div>
              
              {/* Conversion Rate Stats Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-8 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center gap-2 z-20 border-2 border-white dark:border-gray-800 hover:border-primary/20 dark:hover:border-primary/20 transition-colors"
              >
                <div className="bg-green-50 dark:bg-green-900/30 p-1.5 rounded-full">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Conversion</p>
                  <p className="font-bold text-sm">+27%</p>
                </div>
              </motion.div>
              
              {/* New Leads Stats Card */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -top-8 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-20 border-2 border-white dark:border-gray-800 hover:border-primary/20 dark:hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Users className="h-4 w-4 text-purple-500" />
                  <p className="font-medium text-xs">New Leads</p>
                </div>
                <p className="font-bold text-sm">128 <span className="text-xs font-normal text-gray-500">today</span></p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center px-1"
            >
              <div className="flex flex-col gap-3 mb-6">
                <Link href="#enquiry" onClick={scrollToEnquiry} className="w-full">
                  <Button size="lg" className="w-full group rounded-full shadow-sm hover:shadow-md transition-all">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#enquiry" onClick={scrollToEnquiry} className="w-full">
                  <Button size="lg" variant="outline" className="w-full rounded-full">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Clients/Social Proof Section */}
      <section className="py-6 md:py-8 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Powering Patient Acquisition For Leading Healthcare Providers in {displayLocation}
            </h2>
            <p className="text-muted-foreground">
              Trusted by top medical facilities across {displayLocation}
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-16">
            {/* Placeholder for client logos */}
            {currentLocationData.partners.map((client) => (
              <div key={client} className="text-lg md:text-xl font-bold text-muted-foreground/70">{client}</div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full filter blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-500/5 rounded-full filter blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need For Healthcare Lead Management
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive suite of features is designed specifically for healthcare providers to capture, nurture, and convert leads into patients.
              </p>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="feature-card group relative bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LeadCaptureIcon />
                </div>
                <h3 className="text-xl font-semibold">Lead Capture</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Create beautiful, customizable forms for your website and landing pages to capture potential patient information.
              </p>
              
              <ul className="space-y-2">
                {['Multi-channel capture', 'Form builder', 'AI intent detection', 'Duplicate detection'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="feature-card group relative bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Appointment Scheduling</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Seamlessly convert leads to patients with our intelligent scheduling system that integrates with your calendar.
              </p>
              
              <ul className="space-y-2">
                {['Online booking', 'Calendar integration', 'Automated reminders', 'Pre-appointment forms'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="feature-card group relative bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Lead Tracking</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Track each lead through the entire patient acquisition funnel from first contact to becoming a patient.
              </p>
              
              <ul className="space-y-2">
                {['Conversion pipelines', 'Lead scoring', 'Engagement tracking', 'Follow-up reminders'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="feature-card group relative bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Analytics & Reporting</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Gain actionable insights with comprehensive analytics on your lead generation and conversion metrics.
              </p>
              
              <ul className="space-y-2">
                {['Customizable dashboards', 'ROI reporting', 'Source attribution', 'Trend analysis'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="feature-card group relative bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">HIPAA Compliance</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Rest easy knowing your lead management system adheres to the highest healthcare data security standards.
              </p>
              
              <ul className="space-y-2">
                {['Data encryption', 'Access controls', 'Audit trails', 'Secure messaging'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="feature-card group relative bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">ROI Tracking</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Measure the financial impact of your lead generation efforts with detailed ROI analysis and reporting.
              </p>
              
              <ul className="space-y-2">
                {['Cost per acquisition', 'Lifetime value', 'Campaign ROI', 'Revenue attribution'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="#enquiry" onClick={scrollToEnquiry}>
              <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 group">
                Explore All Features
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Product Demo/Showcase Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        {/* Background decoration elements */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Interactive Demo
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              See Our Lead Management System <span className="text-primary">in Action</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience how MediHox transforms the way healthcare providers capture, 
              nurture, and convert patient leads into lasting relationships
            </p>
          </motion.div>
          
          {/* Custom Tabs Implementation */}
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="dashboard" className="w-full">
              <div className="relative mb-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <TabsList className="relative flex justify-center gap-1 md:gap-4 p-1 rounded-full bg-muted/50 backdrop-blur-sm mx-auto w-fit">
                  <TabsTrigger 
                    value="dashboard" 
                    className="rounded-full px-2 sm:px-3 md:px-5 py-2 text-xs sm:text-sm md:text-base font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                  >
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appointments" 
                    className="rounded-full px-2 sm:px-3 md:px-5 py-2 text-xs sm:text-sm md:text-base font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm whitespace-nowrap"
                  >
                    Lead Mgmt
                  </TabsTrigger>
                  <TabsTrigger 
                    value="patients" 
                    className="rounded-full px-2 sm:px-3 md:px-5 py-2 text-xs sm:text-sm md:text-base font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                  >
                    Analytics
                  </TabsTrigger>
              </TabsList>
              </div>
              
              <div className="mt-8">
                <TabsContent value="dashboard" className="mt-0">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="order-2 md:order-1">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full py-1 px-3 text-sm font-medium mb-4">
                          <Activity className="h-4 w-4" />
                          <span>Real-time Updates</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Centralized Dashboard</h3>
                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                          Get a complete 360° view of your lead generation and conversion metrics, with key performance 
                          indicators and conversion funnels all in one place.
                        </p>
                        
                        <ul className="space-y-3 mb-6">
                          {[
                            'Real-time conversion tracking',
                            'Customizable KPI widgets',
                            'Lead source analytics',
                            'Performance trends visualization'
                          ].map((item, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                              className="flex items-start gap-2"
                            >
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </motion.div>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <Link href="#enquiry" onClick={scrollToEnquiry}>
                          <Button className="group rounded-full">
                            Try Dashboard Demo
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                    
                    <div className="order-1 md:order-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative"
                      >
                        {/* Dashboard preview with frame and effects */}
                        <div className="rounded-xl overflow-hidden border shadow-xl bg-background">
                          {/* Browser window header */}
                          <div className="h-8 bg-muted/80 border-b flex items-center px-4">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="mx-auto text-xs text-muted-foreground">
                              MediHox Dashboard
                            </div>
                          </div>
                          
                          {/* Dashboard preview - Light mode */}
                  <div className="dark:hidden relative">
                    <Image 
                      src="/dashboard_light.png" 
                      alt="Dashboard Preview - Light Mode" 
                      width={1200}
                      height={720}
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Dashboard+Preview";
                      }}
                    />
                  </div>
                          
                          {/* Dashboard preview - Dark mode */}
                  <div className="hidden dark:block relative">
                    <Image 
                      src="/dashboard_dark.png" 
                      alt="Dashboard Preview - Dark Mode" 
                      width={1200}
                      height={720}
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Dashboard+Preview";
                      }}
                    />
                  </div>
                </div>
                        
                        {/* Floating Stats Card */}
                        <motion.div
                          initial={{ opacity: 0, x: 20, y: 20 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-border z-10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-purple-500" />
                            <p className="font-medium text-sm">New Leads Today</p>
                </div>
                          <p className="font-bold text-lg">128 <span className="text-xs font-normal text-green-500">↑12% from yesterday</span></p>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
              </TabsContent>
              
                <TabsContent value="appointments" className="mt-0">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="order-2 md:order-1">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full py-1 px-3 text-sm font-medium mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>Organized Workflows</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Comprehensive Lead Management</h3>
                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                          Track and manage leads through every stage of your pipeline with our intuitive interface. 
                          Easily categorize, prioritize, and follow up with potential patients.
                        </p>
                        
                        <ul className="space-y-3 mb-6">
                          {[
                            'Visual pipeline management',
                            'Automated lead scoring',
                            'Follow-up reminders',
                            'Integration with scheduling'
                          ].map((item, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                              className="flex items-start gap-2"
                            >
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </motion.div>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <Link href="#enquiry" onClick={scrollToEnquiry}>
                          <Button className="group rounded-full">
                            See Lead Management Demo
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                    
                    <div className="order-1 md:order-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative"
                      >
                        {/* Lead Management preview with frame and effects */}
                        <div className="rounded-xl overflow-hidden border shadow-xl bg-background">
                          {/* Browser window header */}
                          <div className="h-8 bg-muted/80 border-b flex items-center px-4">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="mx-auto text-xs text-muted-foreground">
                              MediHox Lead Pipeline
                            </div>
                          </div>
                          
                          {/* Appointment preview - Light mode */}
                  <div className="dark:hidden relative">
                    <Image 
                      src="/appointment_light.png" 
                              alt="Lead Management Preview - Light Mode" 
                      width={1200}
                      height={720}
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Lead+Management+Preview";
                      }}
                    />
                  </div>
                          
                          {/* Appointment preview - Dark mode */}
                  <div className="hidden dark:block relative">
                    <Image 
                      src="/appointment_dark.png" 
                              alt="Lead Management Preview - Dark Mode" 
                      width={1200}
                      height={720}
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Lead+Management+Preview";
                      }}
                    />
                  </div>
                </div>
                        
                        {/* Floating task card */}
                        <motion.div
                          initial={{ opacity: 0, x: -20, y: 20 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-border z-10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <p className="font-medium text-sm">Follow-ups Today</p>
                </div>
                          <p className="font-bold text-lg">24 <span className="text-xs font-normal text-green-500">5 completed</span></p>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
              </TabsContent>
              
                <TabsContent value="patients" className="mt-0">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="order-2 md:order-1">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full py-1 px-3 text-sm font-medium mb-4">
                          <BarChart3 className="h-4 w-4" />
                          <span>Data-Driven Insights</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Powerful Conversion Analytics</h3>
                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                          Analyze your lead-to-patient conversion rates with detailed analytics. Identify bottlenecks 
                          in your sales funnel and optimize your marketing efforts for better ROI.
                        </p>
                        
                        <ul className="space-y-3 mb-6">
                          {[
                            'Custom report builder',
                            'Channel performance tracking',
                            'Conversion funnel visualization',
                            'ROI calculator by lead source'
                          ].map((item, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                              className="flex items-start gap-2"
                            >
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </motion.div>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <Link href="#enquiry" onClick={scrollToEnquiry}>
                          <Button className="group rounded-full">
                            Explore Analytics Demo
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                    
                    <div className="order-1 md:order-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative"
                      >
                        {/* Analytics preview with frame and effects */}
                        <div className="rounded-xl overflow-hidden border shadow-xl bg-background">
                          {/* Browser window header */}
                          <div className="h-8 bg-muted/80 border-b flex items-center px-4">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="mx-auto text-xs text-muted-foreground">
                              MediHox Analytics
                            </div>
                          </div>
                          
                          {/* Patient Records preview - Light mode */}
                  <div className="dark:hidden relative">
                    <Image 
                      src="/patient_light.png" 
                              alt="Analytics Preview - Light Mode" 
                      width={1200}
                      height={720}
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Analytics+Preview";
                      }}
                    />
                  </div>
                          
                          {/* Patient Records preview - Dark mode */}
                  <div className="hidden dark:block relative">
                    <Image 
                      src="/patient_dark.png" 
                              alt="Analytics Preview - Dark Mode" 
                      width={1200}
                      height={720}
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Analytics+Preview";
                      }}
                    />
                  </div>
                </div>
                        
                        {/* Floating stats card */}
                        <motion.div
                          initial={{ opacity: 0, x: 20, y: -20 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-border z-10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                            <p className="font-medium text-sm">Conversion Rate</p>
                </div>
                          <p className="font-bold text-lg">27% <span className="text-xs font-normal text-green-500">↑4.5% this month</span></p>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
              </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center mt-16 md:mt-20"
          >
            <div className="p-1 rounded-full bg-primary/10 mb-6">
              <div className="p-2 rounded-full bg-primary/20">
                <ArrowDown className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-lg text-center mb-4 max-w-xl mx-auto">
              Ready to see how MediHox can transform your healthcare practice?
            </p>
            <Link href="#enquiry" onClick={scrollToEnquiry}>
              <Button size="lg" className="rounded-full px-8">Schedule a Live Demo</Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                Trusted by Healthcare Professionals in {displayLocation}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                See what leading medical providers in {displayLocation} are saying about our platform
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentLocationData.testimonials.map((testimonial, index) => (
              <AnimatedSection key={index}>
              <TestimonialCard
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  stars={testimonial.stars}
              />
            </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the plan that fits your clinic's needs with no hidden fees
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <AnimatedSection>
              <PricingTier
                name="Starter"
                price="15,000"
                description="Perfect for small practices just getting started"
                features={[
                  "Up to 2 practitioners",
                  "10000 patient records",
                  "Basic appointment scheduling",
                  "Patient reminders",
                  "Standard support"
                ]}
                popular={false}
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <PricingTier
                name="Professional"
                price="20,000"
                description="Ideal for growing medical practices"
                features={[
                  "Up to 10 practitioners",
                  "Unlimited patient records",
                  "Advanced scheduling",
                  "Bulk data handling",
                  "EHR integration",
                  "Analytics dashboard",
                  "Priority support"
                ]}
                popular={true}
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <PricingTier
                name="Enterprise"
                price="30,000"
                description="For large clinics with advanced needs"
                features={[
                  "Unlimited practitioners",
                  "Custom workflows",
                  "Advanced analytics",
                  "API access",
                  "Custom integrations",
                  "Training sessions",
                  "Dedicated account manager"
                ]}
                popular={false}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Adding location-specific questions */}
      <section id="faq" className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Frequently Asked Questions</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Find answers to common questions about our medical lead management system in {displayLocation}
              </p>
            </div>
          </AnimatedSection>
          
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">Is there a free trial available for healthcare providers in {displayLocation}?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Yes, we offer a 14-day free trial for all healthcare facilities in {displayLocation}. No credit card required to get started.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">Is MediHox compliant with {location.includes("India") ? "Indian healthcare regulations" : location === "USA" ? "HIPAA" : location === "UK" ? "NHS Digital and UK GDPR" : "local healthcare regulations"}?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Yes, MediHox is fully compliant with {location.includes("India") ? `all Indian healthcare data regulations and standards${location.includes("-") ? ` applicable in ${displayLocation}` : ""}` : location === "USA" ? "HIPAA requirements with end-to-end encryption and access controls" : location === "UK" ? "NHS Digital standards, UK GDPR, and the Data Protection Act 2018" : "all local healthcare regulations in your region"}. We regularly update our systems to maintain compliance with changing regulations.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">Can I integrate with my existing EHR system used in {displayLocation}?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Yes, our Professional and Enterprise plans include integration capabilities with {location.includes("India") ? `popular Indian EHR systems${location.includes("-") ? ` commonly used in ${displayLocation} clinics` : " like Practo, Lybrate, and local hospital management systems"}` : location === "USA" ? "Epic, Cerner, Allscripts, and other major US-based EHR systems" : location === "UK" ? "EMIS, SystmOne, and other NHS-approved EHR systems" : "most major EHR systems in your region"}. Our team can help with custom integrations if needed.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">How does MediHox help medical practices in {displayLocation} increase patient acquisition?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    MediHox is specifically designed for the healthcare market in {displayLocation}, with features that address local patient acquisition challenges. Our clients typically see a 30-40% increase in lead conversion rates through our optimized follow-up system, automated appointment reminders via {location.includes("India") ? "WhatsApp and SMS" : "email and SMS"}, and region-specific marketing analytics that help you understand which channels are most effective for your practice.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">Do you offer training for our medical staff in {displayLocation}?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Absolutely. All plans include basic onboarding in {location.includes("India") ? `English ${location.includes("-") ? `and local languages spoken in ${displayLocation}` : "and regional languages"}` : "your local language"}. Professional plans include online training sessions, and Enterprise plans include personalized on-site training options for your entire medical and administrative team.
                  </AccordionContent>
                </AccordionItem>
                
                {location.includes("-") && (
                  <AccordionItem value="item-6" className="bg-background rounded-lg border">
                    <AccordionTrigger className="px-4">Do you have a local office or support team in {displayLocation}?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      Yes, we have a dedicated local support team in {displayLocation} who understand the specific healthcare ecosystem and challenges of the region. Our local team provides faster response times and solutions tailored to the unique needs of {displayLocation} healthcare providers.
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center bg-primary/10 p-8 md:p-12 rounded-2xl border border-primary/20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Ready to Transform Your {displayLocation} Clinic Operations?</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
                Join hundreds of successful healthcare providers in {displayLocation} using MediHox for patient acquisition. Fill out the form below to request a free trial or schedule a personalized demo with our {displayLocation} team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link href="#enquiry" onClick={scrollToEnquiry} className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#enquiry" onClick={scrollToEnquiry} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

            {/* Region-Specific Benefits Section */}
            <section className="py-16 md:py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/2 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Region-Specific Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Optimized for Healthcare in {displayLocation}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform is specially adapted to meet the unique needs of medical practices in {displayLocation}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {currentLocationData.regionBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 bg-card p-4 rounded-lg border shadow-sm"
              >
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                <p className="font-medium">{benefit}</p>
              </motion.div>
            ))}
            </div>
        </div>
      </section>
      
      {/* Enquiry Form Section */}
      <section id="enquiry" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Get Started Today</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Join hundreds of successful healthcare providers in {displayLocation} using MediHox for patient acquisition. Fill out the form below to request a free trial or schedule a personalized demo with our {displayLocation} team.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <Card>
                <div className="p-6 md:p-8">
                  <EnquiryForm />
                </div>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 md:py-12 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 md:mb-12">
            <div>
              <Link href="/" onClick={scrollToTop} className="flex items-center gap-3 mb-4">
                <div className="relative h-14 w-14">
                  <div className="dark:hidden">
                    <Image src="/icon_light.png" alt="Logo" width={56} height={56} />
                  </div>
                  <div className="hidden dark:block">
                    <Image src="/icon_dark.png" alt="Logo" width={56} height={56} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl md:text-2xl">MEDI HOX</span>
                  <span className="text-[10px] tracking-widest font-medium text-muted-foreground">◆ LEAD-BOOSTER ◆</span>
                </div>
              </Link>
              <p className="text-muted-foreground">
                Empowering healthcare providers with advanced lead management solutions to boost patient acquisition.
              </p>
            </div>
            
            <div className="sm:col-span-1">
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Updates</Link></li>
              </ul>
            </div>
            
            <div className="sm:col-span-1 md:col-span-1">
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guides</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div className="sm:col-span-1">
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">&copy; {new Date().getFullYear()} MediHox. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">HIPAA Compliance</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Icon Component
function LeadCaptureIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
} 