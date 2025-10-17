'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2 } from 'lucide-react';

interface RecruiterSignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn?: () => void;
}

export default function RecruiterSignUpModal({ 
  open, 
  onOpenChange, 
  onSwitchToSignIn 
}: RecruiterSignUpModalProps) {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    position: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email';
    if (!formData.company.trim()) return 'Company is required';
    if (!formData.position.trim()) return 'Position is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    // Set flag to indicate this is a recruiter sign-up flow
    sessionStorage.setItem('recruiterSignupFlow', 'true');
    
    try {
      // Check if email already exists
      const existsRes = await fetch(`/api/recruiter/signup?email=${encodeURIComponent(formData.email)}`);
      if (existsRes.ok) {
        const { exists } = await existsRes.json();
        if (exists) {
          setError('An account with this email already exists. Please sign in instead.');
          setIsLoading(false);
          return;
        }
      }

      // Proceed with Supabase registration
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          admin_level: 'recruiter'
        }
      );
      
      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(signUpError.message);
        }
      } else if (data.user) {
        // Create recruiter in database
        try {
          const recruiterResponse = await fetch('/api/recruiter/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`,
              location: 'Not specified',
              completed_data: false
            })
          });

          if (!recruiterResponse.ok) {
            const recruiterResult = await recruiterResponse.json();
            setError(`Failed to create recruiter account: ${recruiterResult.details || recruiterResult.error || 'Unknown error'}`);
            setIsLoading(false);
            return;
          }

          setSuccessMessage('Recruiter account created! Please sign in to continue.');
          
          setTimeout(() => {
            onOpenChange(false);
            if (onSwitchToSignIn) {
              onSwitchToSignIn();
            }
          }, 2000);
          
        } catch (recruiterError) {
          console.error('Error creating recruiter:', recruiterError);
          setError('Failed to create recruiter account. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignIn = () => {
    onOpenChange(false);
    if (onSwitchToSignIn) {
      onSwitchToSignIn();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Create Recruiter Account
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Join our platform and start finding the best talent
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600 text-sm text-center">{successMessage}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={isLoading}
                  autoComplete="given-name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={isLoading}
                  autoComplete="family-name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="john.smith@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-1">
                Company
              </label>
              <input
                id="company"
                type="text"
                required
                placeholder="TechCorp Solutions"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={isLoading}
                autoComplete="organization"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Position Field */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-900 mb-1">
                Position/Title
              </label>
              <input
                id="position"
                type="text"
                required
                placeholder="Senior Talent Acquisition Manager"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={isLoading}
                autoComplete="organization-title"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                onClick={handleSwitchToSignIn}
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </div>

        <DialogFooter className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 flex-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
