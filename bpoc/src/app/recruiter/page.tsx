'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Star,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Shield,
  Globe,
  Award,
  Search,
  Filter,
  Eye,
  MessageCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RecruiterSignInModal from '@/components/auth/RecruiterSignInModal';
import RecruiterSignUpForm from '@/components/auth/RecruiterSignUpForm';
import RecruiterNavbar from '@/components/layout/RecruiterNavbar';
import RecruiterFooter from '@/components/layout/RecruiterFooter';
import RecruiterProfileCompletionModal from '@/components/auth/RecruiterProfileCompletionModal';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense } from 'react';

function RecruiterHomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const handleSwitchToSignUp = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUpModal(false);
    setShowSignInModal(true);
  };

  // Redirect authenticated recruiters to dashboard
  useEffect(() => {
    if (user && user.user_metadata?.admin_level === 'recruiter') {
      console.log('✅ Authenticated recruiter detected, redirecting to dashboard');
      router.push('/recruiter/dashboard');
    }
  }, [user, router]);

  // Early check: Sign out regular users if they access /recruiter
  useEffect(() => {
    const handleUserAccess = async () => {
      if (user && user.user_metadata?.admin_level !== 'recruiter') {
        console.log('🚫 RecruiterPage: Regular user detected, showing user redirect modal');
        setShowUserModal(true);
        await signOut();
      }
    }
    
    handleUserAccess();
  }, [user, signOut]);

  // Fetch user profile from Railway
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          setProfileLoading(true);
          console.log('🔄 Fetching user profile for:', user.id);
          const response = await fetch(`/api/user/profile?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log('✅ User profile loaded:', data.user);
            setUserProfile(data.user);
            
            // Sign out regular users and show modal
            if (data.user.admin_level !== 'recruiter') {
              console.log('🚫 RecruiterPage: Regular user detected, showing user redirect modal');
              setShowUserModal(true);
              await signOut();
              return;
            }
            
            // Check if profile completion is needed (only for recruiters)
            // Don't show modal if user was just created (within last 5 minutes) - they just signed up
            const userCreatedAt = new Date(data.user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - userCreatedAt.getTime();
            const minutesSinceCreation = timeDiff / (1000 * 60);
            
            if (data.user && !data.user.completed_data && minutesSinceCreation > 5) {
              console.log('📝 Profile completion needed, showing modal');
              console.log('📊 User completed_data value:', data.user.completed_data);
              console.log('📊 Minutes since user creation:', minutesSinceCreation);
              setShowProfileModal(true);
            } else if (data.user && !data.user.completed_data && minutesSinceCreation <= 5) {
              console.log('⏭️ User recently created (within 5 minutes), not showing modal yet');
              console.log('📊 Minutes since user creation:', minutesSinceCreation);
            } else {
              console.log('✅ Profile already completed, not showing modal');
              console.log('📊 User completed_data value:', data.user?.completed_data);
            }
          } else {
            console.error('❌ Failed to fetch user profile:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        console.log('⚠️ No user ID available for profile fetch');
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  // Check URL parameters for sign-in flow from sign-up
  useEffect(() => {
    const action = searchParams.get('action');
    const source = searchParams.get('source');
    
    if (action === 'signin' && source === 'signup') {
      console.log('🔄 Detected recruiter sign-up flow, opening sign-in modal');
      // Clear the URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      url.searchParams.delete('source');
      window.history.replaceState({}, '', url.toString());
      
      // Open sign-in modal by triggering a click on the sign-in button
      // We'll use a small delay to ensure the page is fully loaded
      setTimeout(() => {
        setShowSignInModal(true);
      }, 1000);
    }
  }, [searchParams]);

  const handleProfileComplete = async () => {
    setShowProfileModal(false);
    // Refetch profile data instead of reloading the page
    if (user?.id) {
      try {
        const response = await fetch(`/api/user/profile?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error('Error refetching profile after completion:', error);
        // Fallback to page reload if refetch fails
        window.location.reload();
      }
    }
  };

  const stats = [
    {
      title: 'Active Candidates',
      value: '15,000+',
      description: 'Pre-screened professionals',
      icon: Users,
      color: 'text-emerald-600'
    },
    {
      title: 'Success Rate',
      value: '85%',
      description: 'Placement success rate',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Average Time',
      value: '7 Days',
      description: 'To find perfect match',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Cost Savings',
      value: '60%',
      description: 'Reduced hiring costs',
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'AI-Powered Matching',
      description: 'Our advanced AI analyzes candidate profiles and matches them with your job requirements for the perfect fit.'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Get immediate access to pre-screened candidates with verified skills and experience.'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'All candidates go through our rigorous screening process including skills assessment and cultural fit evaluation.'
    },
    {
      icon: Globe,
      title: 'Global Talent Pool',
      description: 'Access top BPO professionals from the Philippines with diverse skills and experience levels.'
    }
  ];

  const candidateTypes = [
    {
      title: 'Customer Service',
      count: '5,200+',
      description: 'Experienced customer support professionals',
      skills: ['Communication', 'Problem Solving', 'Multi-tasking'],
      avgExperience: '3-5 years'
    },
    {
      title: 'Technical Support',
      count: '3,800+',
      description: 'IT and technical support specialists',
      skills: ['Technical Troubleshooting', 'Software Support', 'Network Management'],
      avgExperience: '4-6 years'
    },
    {
      title: 'Sales & Marketing',
      count: '2,900+',
      description: 'Sales professionals and marketing experts',
      skills: ['Lead Generation', 'Sales Closing', 'Digital Marketing'],
      avgExperience: '2-4 years'
    },
    {
      title: 'Back Office',
      count: '3,100+',
      description: 'Administrative and back-office specialists',
      skills: ['Data Entry', 'Process Management', 'Quality Assurance'],
      avgExperience: '2-5 years'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechCorp Solutions',
      role: 'HR Director',
      content: 'BPOC.IO has revolutionized our hiring process. We found 3 perfect candidates in just 5 days!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'Global Services Inc',
      role: 'Recruitment Manager',
      content: 'The AI matching is incredible. Candidates are pre-screened and ready to start immediately.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      company: 'Customer First Co',
      role: 'Talent Acquisition Lead',
      content: 'Quality candidates, fast turnaround, and excellent support. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
      {/* Recruiter Navbar */}
      <RecruiterNavbar 
        onSignInClick={() => setShowSignInModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="text-center">
            {/* Main Headline with Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="block">Find Your Next</span>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-300 animate-pulse"
                >
                  Perfect Hire
                </motion.span>
              </motion.h1>
              
              {/* Compelling Subtitle for Recruiters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              >
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mb-6 text-2xl md:text-3xl font-semibold text-white"
                >
                  Connect with verified BPO talent instantly
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="mb-6 text-lg"
                >
                  Access <span className="font-bold text-emerald-400">15,000+ pre-screened BPO professionals</span> with verified skills and experience
                </motion.p>
                
                {/* Stats Display */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 max-w-6xl mx-auto"
                >
                  {/* Active Candidates */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="flex items-center gap-3 text-center sm:text-left"
                  >
                    <Users className="h-6 w-6 text-emerald-400" />
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">15,000+</div>
                      <div className="text-xs text-emerald-300 font-medium">Active Candidates</div>
                    </div>
                  </motion.div>

                  {/* Success Rate */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="flex items-center gap-3 text-center sm:text-left"
                  >
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">85%</div>
                      <div className="text-xs text-cyan-300 font-medium">Success Rate</div>
                    </div>
                  </motion.div>

                  {/* Average Time */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    className="flex items-center gap-3 text-center sm:text-left"
                  >
                    <Clock className="h-6 w-6 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">7 Days</div>
                      <div className="text-xs text-purple-300 font-medium">Average Time</div>
                    </div>
                  </motion.div>

                  {/* Cost Savings */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 2.0 }}
                    className="flex items-center gap-3 text-center sm:text-left"
                  >
                    <DollarSign className="h-6 w-6 text-orange-400" />
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">60%</div>
                      <div className="text-xs text-orange-300 font-medium">Cost Savings</div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>


            {/* CTA Buttons with Enhanced Styling */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              {user && user.user_metadata?.admin_level === 'recruiter' ? (
                // Show recruiter-specific buttons when signed in
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-2xl shadow-emerald-500/25 text-lg px-10 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300"
                      onClick={() => router.push('/recruiter/post-job')}
                    >
                      📝 Post a Job
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent text-lg px-10 py-4 rounded-full font-semibold backdrop-blur-sm transition-all duration-300"
                      onClick={() => router.push('/recruiter/dashboard')}
                    >
                      📊 Go to Dashboard
                    </Button>
                  </motion.div>
                </>
              ) : (
                // Show general button when not signed in
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-2xl shadow-emerald-500/25 text-lg px-10 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300"
                    onClick={() => setShowSignInModal(true)}
                  >
                    🚀 Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm text-gray-400 mb-8 text-center">Trusted by 500+ companies worldwide</p>
              
              {/* Company Names Carousel */}
              <div className="relative w-full overflow-hidden">
                <div className="flex animate-scroll whitespace-nowrap">
                  <div className="flex items-center space-x-12 text-white/60">
                    <span className="text-xl font-bold">TechCorp</span>
                    <span className="text-xl font-bold">GlobalBPO</span>
                    <span className="text-xl font-bold">CallCenter Pro</span>
                    <span className="text-xl font-bold">SupportHub</span>
                    <span className="text-xl font-bold">DataFlow</span>
                    <span className="text-xl font-bold">CloudTech</span>
                    <span className="text-xl font-bold">NexGen</span>
                    <span className="text-xl font-bold">ProCall</span>
                    <span className="text-xl font-bold">TechCorp</span>
                    <span className="text-xl font-bold">GlobalBPO</span>
                    <span className="text-xl font-bold">CallCenter Pro</span>
                    <span className="text-xl font-bold">SupportHub</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BPOC Recruiter?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most advanced BPO recruitment platform to help you find the perfect candidates faster and more efficiently.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              // Create color variations for feature cards
              const colorVariations = [
                'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200',
                'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200',
                'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200',
                'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200'
              ];
              
              const iconColors = [
                'bg-gradient-to-br from-blue-500 to-blue-600',
                'bg-gradient-to-br from-emerald-500 to-emerald-600',
                'bg-gradient-to-br from-purple-500 to-purple-600',
                'bg-gradient-to-br from-orange-500 to-orange-600'
              ];
              
              const cardColor = colorVariations[index % colorVariations.length];
              const iconColor = iconColors[index % iconColors.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`${cardColor} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col`}>
                    <CardContent className="p-6 text-center flex flex-col h-full">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 mx-auto mb-4 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex-shrink-0">{feature.title}</h3>
                      <p className="text-gray-600 flex-grow">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and find your perfect candidates with our streamlined process
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-2xl font-bold text-white">1</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Post Your Job</h3>
                  <p className="text-gray-600">
                    Create a detailed job posting with requirements, skills, and preferences. Our AI will help optimize your listing.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-cyan-50 to-blue-100 border border-cyan-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-2xl font-bold text-white">2</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Matching</h3>
                  <p className="text-gray-600">
                    Our advanced AI analyzes your requirements and matches you with the most qualified candidates from our database.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-2xl font-bold text-white">3</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview & Hire</h3>
                  <p className="text-gray-600">
                    Review matched candidates, conduct interviews, and make your hire. We handle all the paperwork and onboarding.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of companies who trust BPOC.IO for their recruitment needs
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              // Create color variations for testimonial cards
              const colorVariations = [
                'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200',
                'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200',
                'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200'
              ];
              
              const cardColor = colorVariations[index % colorVariations.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`${cardColor} shadow-sm hover:shadow-lg transition-all duration-300 h-full`}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                      <div className="border-t pt-4">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-sm text-emerald-600">{testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your recruitment needs. No hidden fees, no surprises.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
                  <CardDescription className="text-gray-600">Perfect for small teams</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">₱2,500</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col flex-grow">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Up to 5 job postings</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">100 candidate profiles</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Basic analytics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Email support</span>
                    </div>
                    <div className="flex items-center opacity-0">
                      <CheckCircle className="h-5 w-5 mr-3" />
                      <span className="text-gray-700">Placeholder</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white px-4 py-1">Most Popular</Badge>
                </div>
                <CardHeader className="text-center pb-8 pt-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
                  <CardDescription className="text-gray-600">Ideal for growing companies</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">₱7,500</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col flex-grow">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Unlimited job postings</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">500 candidate profiles</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Advanced analytics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Priority support</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">AI-powered matching</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
                  <CardDescription className="text-gray-600">For large organizations</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">₱15,000</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col flex-grow">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Unlimited everything</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Custom integrations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Dedicated account manager</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">24/7 phone support</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Custom reporting</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure & Compliant</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                <span>Global Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="border-t border-gray-200"></div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 text-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Ready to Transform Your Hiring Process?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of recruiters who have found their perfect candidates on BPOC.IO
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border-0 shadow-lg shadow-emerald-500/25 text-lg px-8 py-4 rounded-full"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white bg-white text-lg px-8 py-4 rounded-full shadow-sm"
                >
                  Schedule a Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sign In Modal */}
      <RecruiterSignInModal 
        open={showSignInModal} 
        onOpenChange={setShowSignInModal}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      
      {/* Sign Up Modal */}
      <RecruiterSignUpForm
        open={showSignUpModal}
        onOpenChange={setShowSignUpModal}
        onSwitchToLogin={handleSwitchToSignIn}
      />

      {/* Profile Completion Modal */}
      <RecruiterProfileCompletionModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onComplete={handleProfileComplete}
      />

      {/* User Redirect Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white text-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              BPOC User Account Detected
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-gray-200 text-center leading-relaxed">
                This account is registered as a <span className="font-bold text-cyan-400">BPOC User Account</span>, not a recruiter account.
              </p>
            </div>
            
            <div className="space-y-3 text-gray-300">
              <p className="text-sm">
                As a BPOC user, you have access to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Build professional resumes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Play career development games</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Take skill assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Apply for jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Track your career progress</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-4">
              <p className="text-emerald-200 text-sm text-center">
                This page is for <span className="font-bold text-emerald-400">recruiters only</span>. Please go to the main BPOC home page to access your account features.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowUserModal(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Stay Here
            </Button>
            <Button
              onClick={() => {
                setShowUserModal(false);
                router.push('/home');
              }}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              Go to BPOC Home
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recruiter Footer */}
      <RecruiterFooter />
    </div>
  );
}

export default function RecruiterHomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecruiterHomePageContent />
    </Suspense>
  );
}