"use client";

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Send, Clock, Calendar, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateInquiryMutation } from '@/lib/redux/services/inquiryApi';
import { toast } from 'react-hot-toast';

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organizationName: '',
    notes: '',
    requestFor: 'Free Trial Access'
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [createInquiry] = useCreateInquiryMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, requestFor: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    
    try {
      const result = await createInquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        organizationName: formData.organizationName,
        notes: formData.notes,
        requestFor: formData.requestFor
      }).unwrap();
      
      // Show toast notification on success
      toast.success("Thank you for your interest! Our team will contact you shortly.", {
        duration: 5000,
        position: 'top-right',
      });
      
      setFormStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        organizationName: '',
        notes: '',
        requestFor: 'Free Trial Access'
      });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setFormStatus('error');
      
      // Show toast notification on error
      toast.error("Something went wrong. Please try again later.", {
        duration: 5000,
        position: 'top-right',
      });
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };

  return (
    <>
      {formStatus === 'success' && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            Thank you for your interest! We've received your inquiry and will contact you shortly.
          </AlertDescription>
        </Alert>
      )}
      
      {formStatus === 'error' && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            Something went wrong while submitting your request. Please try again later.
          </AlertDescription>
        </Alert>
      )}
    
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. John Doe" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@clinic.com" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizationName">Clinic/Organization Name</Label>
            <Input 
              id="organizationName" 
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Your Clinic Name" 
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>What are you interested in?</Label>
          <RadioGroup 
            value={formData.requestFor} 
            onValueChange={handleRadioChange} 
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Free Trial Access" id="trial" />
              <Label htmlFor="trial" className="font-normal flex items-center gap-2">
                <Clock className="h-4 w-4" /> Free Trial Access
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Schedule Demo" id="demo" />
              <Label htmlFor="demo" className="font-normal flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Schedule a Demo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Integration Capabilities" id="integration" />
              <Label htmlFor="integration" className="font-normal flex items-center gap-2">
                <LineChart className="h-4 w-4" /> Integration Capabilities
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Information</Label>
          <Textarea 
            id="notes" 
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tell us about your clinic's needs and any specific features you're interested in..."
            className="min-h-[120px]"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={formStatus === 'loading'}
        >
          {formStatus === 'loading' ? 'Submitting...' : 'Submit Enquiry'}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </>
  );
};

export default EnquiryForm; 