'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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

interface RecruiterSignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp?: () => void;
}

export default function RecruiterSignInModal({ 
  open, 
  onOpenChange, 
  onSwitchToSignUp 
}: RecruiterSignInModalProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError('Sign in failed: ' + signInError.message);
      } else {
        onOpenChange(false);
        router.push('/recruiter/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    onOpenChange(false);
    if (onSwitchToSignUp) {
      onSwitchToSignUp();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-gray-200 shadow-xl" data-recruiter-modal="true">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Recruiter Sign In
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Access your recruiter dashboard and manage your talent pipeline
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                onClick={handleSwitchToSignUp}
              >
                Don't have an account? Create one
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
