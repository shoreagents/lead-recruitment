'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AIIndustryAutocomplete } from '@/components/ui/ai-industry-autocomplete';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Send, X } from 'lucide-react';
import { generateUserId } from '@/lib/userEngagementService';

interface AnonymousUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnonymousUserModal({ isOpen, onClose }: AnonymousUserModalProps) {
  const [formData, setFormData] = useState({
    industry: '',
    employeeCount: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      industry: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get user_id using the consistent generateUserId function
      const userId = generateUserId();

      // Send data to API
      const response = await fetch('/api/anonymous-user-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit inquiry');
      }

      const result = await response.json();
      console.log('Inquiry submitted successfully:', result);
      
      // Reset form and close modal
      setFormData({ industry: '', employeeCount: '', company: '', message: '' });
      onClose();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      // You could add a toast notification here to show the error to the user
      alert(error instanceof Error ? error.message : 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Tell us about your business
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We'd love to learn about your business and how we can help you scale with our offshore talent solutions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <AIIndustryAutocomplete
              value={formData.industry}
              onChange={handleIndustryChange}
              label="Industry *"
              placeholder="Select your industry..."
              id="industry"
            />
          </div>

          <div>
            <Label htmlFor="employeeCount">How many employees do you need? *</Label>
            <Input
              id="employeeCount"
              name="employeeCount"
              type="number"
              min="1"
              max="100"
              value={formData.employeeCount}
              onChange={handleInputChange}
              required
              className="mt-1"
              placeholder="Enter number of employees"
            />
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="Your company name"
            />
          </div>

          <div>
            <Label htmlFor="message">Tell us about your business needs *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="mt-1 min-h-[100px]"
              placeholder="What challenges are you facing? What type of support do you need?"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-lime-600 hover:bg-lime-700 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
