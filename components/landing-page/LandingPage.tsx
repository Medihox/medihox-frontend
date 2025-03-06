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
  Menu 
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <SEOMetadata />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
        scrollToEnquiry={scrollToEnquiry}
      />
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-sm z-40 border-b">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
          <Link href="/" onClick={scrollToTop} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="font-bold text-xl">MedClinic</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="#enquiry" onClick={scrollToEnquiry}>
              <Button>Get Started</Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-28 pb-14 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
                Streamline Your <span className="text-primary">Clinic Management</span> With Ease
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                All-in-one solution to manage appointments, patients, billing, and more. 
                Spend less time on admin and more time with patients.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
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
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-xl overflow-hidden shadow-2xl border mt-6 md:mt-0"
            >
              {/* Dashboard preview image - light/dark mode variants */}
              <div className="dark:hidden relative">
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
              </div>
              <div className="hidden dark:block relative">
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Clients/Social Proof Section */}
      <section className="py-6 md:py-8 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-muted-foreground">Trusted by healthcare providers worldwide</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-16">
            {/* Placeholder for client logos */}
            {['MedCenter', 'HealthPlus', 'CarePoint', 'VitalClinic', 'MediLife'].map((client) => (
              <div key={client} className="text-lg md:text-xl font-bold text-muted-foreground/70">{client}</div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Powerful Features for Modern Clinics</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to manage your clinic efficiently in one integrated platform
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatedSection>
              <FeatureCard 
                icon={Calendar}
                title="Smart Scheduling"
                description="Intelligent appointment scheduling with automated reminders to reduce no-shows and optimize your clinic's time."
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <FeatureCard 
                icon={Users}
                title="Patient Management"
                description="Comprehensive patient profiles with medical history, visit notes, and communication preferences in one place."
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <FeatureCard 
                icon={ClipboardList}
                title="Electronic Health Records"
                description="Secure, compliant EHR system that makes documentation easier and provides quick access to patient information."
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <FeatureCard 
                icon={CreditCard}
                title="Billing & Invoicing"
                description="Streamline payment processing with automated billing, insurance claim management, and financial reporting."
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <FeatureCard 
                icon={Lock}
                title="HIPAA Compliant"
                description="Built with security at its core to ensure patient data is protected and regulatory requirements are met."
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <FeatureCard 
                icon={LineChart}
                title="Analytics & Reporting"
                description="Data-driven insights to help you understand clinic performance, patient trends, and growth opportunities."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* Product Demo/Showcase Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">See Our System in Action</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Watch how our platform streamlines clinic operations from patient check-in to follow-up
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <Tabs defaultValue="dashboard" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-6 md:mb-8 overflow-x-auto max-w-full">
                <TabsTrigger value="dashboard" className="text-sm md:text-base whitespace-nowrap">Dashboard</TabsTrigger>
                <TabsTrigger value="appointments" className="text-sm md:text-base whitespace-nowrap">Appointments</TabsTrigger>
                <TabsTrigger value="patients" className="text-sm md:text-base whitespace-nowrap">Patient Records</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <div className="rounded-xl overflow-hidden border shadow-md">
                  {/* Dashboard preview image - light/dark mode variants */}
                  <div className="dark:hidden relative">
                    <Image 
                      src="/dashboard_light.png" 
                      alt="Dashboard Preview - Light Mode" 
                      width={1200}
                      height={720}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Dashboard+Preview";
                      }}
                    />
                  </div>
                  <div className="hidden dark:block relative">
                    <Image 
                      src="/dashboard_dark.png" 
                      alt="Dashboard Preview - Dark Mode" 
                      width={1200}
                      height={720}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Dashboard+Preview";
                      }}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Centralized Dashboard</h3>
                  <p className="text-muted-foreground">
                    Get a complete overview of your clinic with key metrics, upcoming appointments, 
                    and important notifications all in one place.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="appointments">
                <div className="rounded-xl overflow-hidden border shadow-md">
                  {/* Appointments preview image - light/dark mode variants */}
                  <div className="dark:hidden relative">
                    <Image 
                      src="/appointment_light.png" 
                      alt="Appointment Preview - Light Mode" 
                      width={1200}
                      height={720}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Appointment+Preview";
                      }}
                    />
                  </div>
                  <div className="hidden dark:block relative">
                    <Image 
                      src="/appointment_dark.png" 
                      alt="Appointment Preview - Dark Mode" 
                      width={1200}
                      height={720}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Appointment+Preview";
                      }}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Intelligent Scheduling</h3>
                  <p className="text-muted-foreground">
                    Manage appointments with ease through our intuitive calendar interface with 
                    drag-and-drop functionality and automated patient reminders.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="patients">
                <div className="rounded-xl overflow-hidden border shadow-md">
                  {/* Patient Records preview image - light/dark mode variants */}
                  <div className="dark:hidden relative">
                    <Image 
                      src="/patient_light.png" 
                      alt="Patient Records Preview - Light Mode" 
                      width={1200}
                      height={720}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/e2e8f0/64748b?text=Patient+Records+Preview";
                      }}
                    />
                  </div>
                  <div className="hidden dark:block relative">
                    <Image 
                      src="/patient_dark.png" 
                      alt="Patient Records Preview - Dark Mode" 
                      width={1200}
                      height={720}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x500/1e293b/94a3b8?text=Patient+Records+Preview";
                      }}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Complete Patient History</h3>
                  <p className="text-muted-foreground">
                    Access comprehensive patient profiles with medical history, visit notes, 
                    prescriptions, and test results in a secure, organized interface.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Loved by Healthcare Professionals</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                See what leading healthcare providers across India are saying about our platform
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatedSection>
              <TestimonialCard
                quote="This system has transformed our multi-specialty clinic. Patient wait times are reduced by 40%, and our doctors can focus on patient care rather than paperwork."
                author="Dr. Rajesh Sharma"
                role="Director, Arogya Healthcare, Mumbai"
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <TestimonialCard
                quote="The scheduling and WhatsApp reminder features reduced our no-shows by 70%. With high patient volumes, this efficiency has been a game-changer for us."
                author="Dr. Priya Patel"
                role="Chief Medical Officer, Wellness Multi-Specialty Clinic, Bangalore"
                stars={5}
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <TestimonialCard
                quote="After trying several management systems, this is the only one that handles our Ayurvedic treatments scheduling alongside modern medicine. The support team understands Indian healthcare needs."
                author="Dr. Ananya Mehta"
                role="Founder, Ayush Integrated Clinic, New Delhi"
                stars={5}
              />
            </AnimatedSection>
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
      
      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Frequently Asked Questions</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Find answers to common questions about our clinic management system
              </p>
            </div>
          </AnimatedSection>
          
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">Is there a free trial available?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Yes, we offer a 14-day free trial for all plans. No credit card required to get started.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">How secure is patient data on your platform?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    We take security seriously. Our platform is HIPAA compliant with end-to-end encryption, regular security audits, and strict access controls to protect patient information.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">Can I integrate with my existing EHR system?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Yes, our Professional and Enterprise plans include integration capabilities with most major EHR systems. Our team can help with custom integrations if needed.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">How easy is it to migrate from our current system?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    We've designed our migration process to be as smooth as possible. Our team will assist you with importing patient records and existing data. Most clinics can be fully operational within 1-2 weeks.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4">Do you offer training for our staff?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Absolutely. All plans include basic onboarding. Professional plans include online training sessions, and Enterprise plans include personalized on-site training options.
                  </AccordionContent>
                </AccordionItem>
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Ready to Transform Your Clinic Operations?</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare providers who've improved efficiency and patient satisfaction with our platform.
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
      
      {/* Enquiry Form Section */}
      <section id="enquiry" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Get Started Today</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Fill out the form below to request a free trial or schedule a personalized demo with our team
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
              <Link href="/" onClick={scrollToTop} className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary"></div>
                <span className="font-bold text-xl">MedClinic</span>
              </Link>
              <p className="text-muted-foreground">
                Streamlining healthcare operations with intuitive practice management software.
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
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">&copy; {new Date().getFullYear()} MedClinic. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">HIPAA Compliance</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 