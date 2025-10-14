'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PacmanLoader } from 'react-spinners';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Building,
  Calendar,
  Star,
  X,
  MoreVertical,
  LogOut,
  ChevronDown,
  Filter,
  TrendingUp,
  Target,
  Zap,
  MapPin,
  Rocket,
  Trophy,
  Heart,
  Sparkles,
  Crown,
  Flame,
  Users,
  Award,
  Gift,
  PartyPopper,
  ThumbsUp,
  MessageCircle,
  Share2,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface JobApplication {
  id: string;
  jobId: string;
  resumeId: string;
  resumeSlug: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  status: 'submitted' | 'qualified' | 'for verification' | 'verified' | 'initial interview' | 'final interview' | 'not qualified' | 'passed' | 'rejected' | 'withdrawn' | 'hired' | 'closed';
  appliedDate: string;
  lastUpdated: string;
  jobDescription?: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  workArrangement?: string;
  experienceLevel?: string;
  industry?: string;
  department?: string;
  applicationDeadline?: string;
  candidateCount?: number;
}

const statusConfig = {
  submitted: { 
    label: 'Submitted', 
    description: 'Your application is under review. We will get back to you within 3-5 business days.',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
    icon: Clock 
  },
  qualified: { 
    label: 'Qualified', 
    description: 'You meet the basic requirements. Our hiring team is now evaluating your fit for the role.',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
    icon: Eye 
  },
  'for verification': { 
    label: 'For Verification', 
    description: 'We are verifying your credentials and background information.',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', 
    icon: AlertCircle 
  },
  verified: { 
    label: 'Verified', 
    description: 'All information confirmed. You will be contacted soon for the next phase.',
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', 
    icon: CheckCircle 
  },
  'initial interview': { 
    label: 'Initial Interview', 
    description: 'You have been selected for an interview. Please prepare for a phone or video call.',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', 
    icon: CheckCircle 
  },
  'final interview': { 
    label: 'Final Interview', 
    description: 'You have advanced to the final round. Please prepare for a comprehensive interview.',
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', 
    icon: CheckCircle 
  },
  'not qualified': { 
    label: 'Not Qualified', 
    description: 'Your application did not meet the requirements. We encourage you to apply for other roles.',
    color: 'bg-red-500/20 text-red-400 border-red-500/30', 
    icon: XCircle 
  },
  passed: { 
    label: 'Passed', 
    description: 'Congratulations! You have passed the evaluation and are being considered for final selection.',
    color: 'bg-green-500/20 text-green-400 border-green-500/30', 
    icon: Star 
  },
  rejected: { 
    label: 'Rejected', 
    description: 'Your application was not selected. We appreciate your interest and encourage you to apply for other opportunities.',
    color: 'bg-red-500/20 text-red-400 border-red-500/30', 
    icon: XCircle 
  },
  withdrawn: { 
    label: 'Withdrawn', 
    description: 'You have withdrawn your application. You can reapply when the position is available.',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', 
    icon: XCircle 
  },
  closed: {
    label: 'Closed',
    description: 'This application is closed because the job has been closed. You can apply for similar roles.',
    color: 'bg-gray-600/20 text-gray-300 border-gray-600/30',
    icon: XCircle
  },
  hired: { 
    label: 'Hired', 
    description: 'Congratulations! You have been hired. Welcome to the team! You will receive onboarding details via email.',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', 
    icon: Star 
  }
};

export default function ApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'job' | 'application'>('job');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState<string | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.dropdown-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // Achievement system
  const checkAchievements = (apps: JobApplication[]) => {
    const total = apps.length;
    const hired = apps.filter(app => app.status === 'hired').length;
    const inProgress = apps.filter(app => ['submitted', 'qualified', 'for verification', 'verified', 'initial interview', 'final interview'].includes(app.status)).length;
    
    setTotalApplications(total);
    setSuccessRate(total > 0 ? Math.round((hired / total) * 100) : 0);
    
    // Check for achievements
    if (total >= 1 && achievementUnlocked !== 'first_application') {
      setAchievementUnlocked('first_application');
      setShowCelebration(true);
    } else if (total >= 5 && achievementUnlocked !== 'application_spree') {
      setAchievementUnlocked('application_spree');
      setShowCelebration(true);
    } else if (hired >= 1 && achievementUnlocked !== 'first_hire') {
      setAchievementUnlocked('first_hire');
      setShowCelebration(true);
    } else if (total >= 10 && achievementUnlocked !== 'job_hunter') {
      setAchievementUnlocked('job_hunter');
      setShowCelebration(true);
    }
  };

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log('🔄 Fetching applications for user:', user?.id);
        setLoading(true);
        
        const response = await fetch(`/api/applications?userId=${user?.id}`);
        console.log('📡 API response status:', response.status);
        console.log('📡 API response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📋 API response data:', data);
          console.log('🔍 Status values in applications:', data.applications?.map((app: JobApplication) => ({ id: app.id, status: app.status, jobTitle: app.jobTitle })));
          setApplications(data.applications || []);
          checkAchievements(data.applications || []);
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to fetch applications:', response.status, errorText);
          setApplications([]);
        }
      } catch (error) {
        console.error('❌ Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchApplications();
    } else {
      console.log('⚠️ No user ID available');
    }
  }, [user?.id]);

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      console.warn('⚠️ Unknown status:', status);
    }
    return config ? config.icon : Clock;
  };

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      console.warn('⚠️ Unknown status:', status);
    }
    return config ? config.color : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusLabel = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      console.warn('⚠️ Unknown status:', status);
      return status; // Return the raw status if not found
    }
    return config.label;
  };

  const getStatusDescription = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      console.warn('⚠️ Unknown status:', status);
      return 'Status information not available'; // Return default description if not found
    }
    return config.description;
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/withdraw`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (response.ok) {
        // Update the local state to reflect the withdrawn status
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'withdrawn' as const }
            : app
        ));
        setOpenMenuId(null); // Close the menu
      } else {
        console.error('Failed to withdraw application');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your applications</h2>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <Header />
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg mr-3">
                  <Briefcase className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">My Applications</h1>
                  <p className="text-gray-400">Track your job applications and progress</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="max-w-7xl mx-auto space-y-8">

            {/* Simple Success Message */}
            <AnimatePresence>
              {showCelebration && achievementUnlocked === 'first_hire' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-400">Congratulations!</h3>
                      <p className="text-white">You've been hired for a position!</p>
                    </div>
                    <Button
                      onClick={() => setShowCelebration(false)}
                      variant="ghost"
                      size="sm"
                      className="text-green-400 hover:text-green-300 ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <label className="text-white font-medium">Filter by Status:</label>
              </div>
              <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white hover:bg-white/10 min-w-[200px] justify-between"
                  >
                    {selectedStatus === 'all' 
                      ? `All Applications (${applications.length})`
                      : `${getStatusLabel(selectedStatus)} (${applications.filter(app => app.status === selectedStatus).length})`
                    }
                    <ChevronDown className="w-3 h-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-white/10 text-white">
                  <DropdownMenuLabel>Application Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={selectedStatus === 'all' ? 'bg-white/20' : ''}
                    onClick={() => setSelectedStatus('all')}
                  >
                    All Applications ({applications.length})
                  </DropdownMenuItem>
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const count = applications.filter(app => app.status === status).length;
                    if (count === 0) return null;
                    return (
                      <DropdownMenuItem
                        key={status}
                        className={selectedStatus === status ? 'bg-white/20' : ''}
                        onClick={() => setSelectedStatus(status)}
                      >
                        {config.label} ({count})
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>

            {/* Applications List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <PacmanLoader 
                      color="#fbbf24" 
                      size={40}
                      margin={4}
                      speedMultiplier={1.2}
                    />
                  </div>
                  <p className="text-gray-400">Loading your applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <Card className="glass-card border-white/10 text-center py-16 hover:border-cyan-500/20 transition-all duration-300">
                  <CardContent>
                    <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 max-w-md mx-auto">
                      <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Briefcase className="h-10 w-10 text-cyan-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {selectedStatus === 'all' ? 'No applications yet' : 'No applications found'}
                      </h3>
                      <p className="text-gray-400 mb-6 text-lg">
                        {selectedStatus === 'all' 
                          ? "Start your job search journey by applying to positions that match your skills"
                          : `No applications with status "${getStatusLabel(selectedStatus)}" found.`
                        }
                      </p>
                      <Button 
                        onClick={() => router.push('/jobs/job-matching')} 
                        className="w-full max-w-md bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 text-lg py-4"
                      >
                        Browse Available Jobs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredApplications.map((application, index) => {
                    const StatusIcon = getStatusIcon(application.status);
                    return (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                      <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group h-full">
                        <CardContent className="p-6 h-full flex flex-col">
                          {/* Header with Job Title and Status */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors flex-1 leading-tight">
                                  {application.jobTitle}
                                </h3>
                                <Badge className={`${getStatusColor(application.status)} border-2 flex-shrink-0`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {getStatusLabel(application.status)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <Building className="h-4 w-4 text-cyan-400" />
                                <span className="font-medium">{application.companyName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="h-4 w-4 text-green-400" />
                                <span>{application.location || 'Location not specified'}</span>
                              </div>
                            </div>
                            
                            {/* Action Menu */}
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOpenMenuId(openMenuId === application.id ? null : application.id)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              
                              {openMenuId === application.id && (
                                <div className="dropdown-menu absolute right-0 top-full mt-1 w-48 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-10">
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        setSelectedApplication(application);
                                        setIsModalOpen(true);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-2"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </button>
                                    {application.status !== 'withdrawn' && application.status !== 'hired' && application.status !== 'rejected' && (
                                      <button
                                        onClick={() => withdrawApplication(application.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                      >
                                        <LogOut className="h-4 w-4" />
                                        Withdraw Application
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Status Description */}
                          <div className="mb-4 p-3 bg-gray-800/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${
                                application.status === 'hired' 
                                  ? 'bg-emerald-400'
                                  : application.status === 'not qualified' || application.status === 'rejected'
                                  ? 'bg-red-400'
                                  : application.status === 'final interview'
                                  ? 'bg-indigo-400'
                                  : application.status === 'initial interview'
                                  ? 'bg-purple-400'
                                  : application.status === 'verified'
                                  ? 'bg-cyan-400'
                                  : application.status === 'for verification'
                                  ? 'bg-orange-400'
                                  : application.status === 'qualified'
                                  ? 'bg-yellow-400'
                                  : application.status === 'submitted'
                                  ? 'bg-blue-400'
                                  : application.status === 'passed'
                                  ? 'bg-green-400'
                                  : application.status === 'withdrawn' || application.status === 'closed'
                                  ? 'bg-gray-400'
                                  : 'bg-gray-400'
                              }`}></div>
                              <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Status Update</span>
                            </div>
                            <p className="text-sm text-gray-300 font-medium leading-relaxed italic">
                              {getStatusDescription(application.status)}
                            </p>
                          </div>
                          
                          {/* Applied Date */}
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-auto">
                            <Calendar className="h-4 w-4 text-purple-400" />
                            <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedApplication.jobTitle}</h2>
                <p className="text-gray-400">{selectedApplication.companyName}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedApplication(null);
                  setActiveTab('job');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('job')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'job'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Job Details
              </button>
              <button
                onClick={() => setActiveTab('application')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'application'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Application Details
              </button>
            </div>

            {/* Modal Content */}
            <div 
              className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#374151 #1f2937'
              }}
            >
              {activeTab === 'job' && (
                <div className="space-y-6">
                {/* Job Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-400">Company:</span>
                    <p className="text-white font-medium">{selectedApplication.companyName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Location:</span>
                    <p className="text-white font-medium">{selectedApplication.location}</p>
                  </div>
                  {selectedApplication.salary && (
                    <div>
                      <span className="text-sm text-gray-400">Salary:</span>
                      <p className="text-yellow-400 font-medium">{selectedApplication.salary}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-400">Applied Date:</span>
                    <p className="text-white font-medium">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Job Description */}
                {selectedApplication.jobDescription && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedApplication.jobDescription}</p>
                  </div>
                )}

                {/* Requirements & Responsibilities */}
                {selectedApplication.requirements && selectedApplication.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Requirements & Responsibilities</h3>
                    <ul className="space-y-2">
                      {(() => {
                        // Handle the data - try multiple approaches
                        let requirements = [];
                        
                        if (Array.isArray(selectedApplication.requirements)) {
                          // Already an array
                          requirements = selectedApplication.requirements;
                        } else if (typeof selectedApplication.requirements === 'string') {
                          // Try to parse as JSON first
                          try {
                            const parsed = JSON.parse(selectedApplication.requirements);
                            if (Array.isArray(parsed)) {
                              requirements = parsed;
                            } else {
                              // Split by newlines
                              requirements = selectedApplication.requirements
                                .split('\n')
                                .filter(item => item.trim() && item.trim().length > 0);
                            }
                          } catch (e) {
                            // Not JSON, split by newlines
                            requirements = selectedApplication.requirements
                              .split('\n')
                              .filter(item => item.trim() && item.trim().length > 0);
                          }
                        }
                        
                        // If still no items, try splitting by other methods
                        if (requirements.length === 0 && typeof selectedApplication.requirements === 'string') {
                          const text = selectedApplication.requirements;
                          if (text.includes('•')) {
                            requirements = text.split('•').filter(item => item.trim());
                          } else if (text.includes('-')) {
                            requirements = text.split('-').filter(item => item.trim());
                          } else if (text.includes(';')) {
                            requirements = text.split(';').filter(item => item.trim());
                          } else {
                            // Last resort: split by periods
                            requirements = text.split('.').filter(item => item.trim() && item.length > 10);
                          }
                        }
                        
                        return requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="text-cyan-400 mt-1">•</span>
                            <span>{req.trim()}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                )}

                {/* Skills Required */}
                {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        // Handle the data - try multiple approaches
                        let skills = [];
                        
                        if (Array.isArray(selectedApplication.skills)) {
                          // Already an array
                          skills = selectedApplication.skills;
                        } else if (typeof selectedApplication.skills === 'string') {
                          // Try to parse as JSON first
                          try {
                            const parsed = JSON.parse(selectedApplication.skills);
                            if (Array.isArray(parsed)) {
                              skills = parsed;
                            } else {
                              // Split by newlines
                              skills = selectedApplication.skills
                                .split('\n')
                                .filter(item => item.trim() && item.trim().length > 0);
                            }
                          } catch (e) {
                            // Not JSON, split by newlines
                            skills = selectedApplication.skills
                              .split('\n')
                              .filter(item => item.trim() && item.trim().length > 0);
                          }
                        }
                        
                        // If still no items, try splitting by other methods
                        if (skills.length === 0 && typeof selectedApplication.skills === 'string') {
                          const text = selectedApplication.skills;
                          if (text.includes(',')) {
                            skills = text.split(',').filter(item => item.trim());
                          } else if (text.includes('•')) {
                            skills = text.split('•').filter(item => item.trim());
                          } else if (text.includes('-')) {
                            skills = text.split('-').filter(item => item.trim());
                          } else if (text.includes(';')) {
                            skills = text.split(';').filter(item => item.trim());
                          } else {
                            // Last resort: split by periods
                            skills = text.split('.').filter(item => item.trim() && item.length > 5);
                          }
                        }
                        
                        return skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                            {skill.trim()}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Perks & Benefits */}
                {selectedApplication.benefits && selectedApplication.benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Perks & Benefits</h3>
                    <ul className="space-y-2">
                      {(() => {
                        // Handle the data - try multiple approaches
                        let benefits = [];
                        
                        if (Array.isArray(selectedApplication.benefits)) {
                          // Already an array
                          benefits = selectedApplication.benefits;
                        } else if (typeof selectedApplication.benefits === 'string') {
                          // Try to parse as JSON first
                          try {
                            const parsed = JSON.parse(selectedApplication.benefits);
                            if (Array.isArray(parsed)) {
                              benefits = parsed;
                            } else {
                              // Split by newlines
                              benefits = selectedApplication.benefits
                                .split('\n')
                                .filter(item => item.trim() && item.trim().length > 0);
                            }
                          } catch (e) {
                            // Not JSON, split by newlines
                            benefits = selectedApplication.benefits
                              .split('\n')
                              .filter(item => item.trim() && item.trim().length > 0);
                          }
                        }
                        
                        // If still no items, try splitting by other methods
                        if (benefits.length === 0 && typeof selectedApplication.benefits === 'string') {
                          const text = selectedApplication.benefits;
                          if (text.includes('•')) {
                            benefits = text.split('•').filter(item => item.trim());
                          } else if (text.includes('-')) {
                            benefits = text.split('-').filter(item => item.trim());
                          } else if (text.includes(';')) {
                            benefits = text.split(';').filter(item => item.trim());
                          } else if (text.includes('✓')) {
                            benefits = text.split('✓').filter(item => item.trim());
                          } else {
                            // Last resort: split by periods
                            benefits = text.split('.').filter(item => item.trim() && item.length > 10);
                          }
                        }
                        
                        return benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>{benefit.trim()}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                )}

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  {selectedApplication.workArrangement && (
                    <div>
                      <span className="text-sm text-gray-400">Work Arrangement:</span>
                      <p className="text-white font-medium capitalize">{selectedApplication.workArrangement}</p>
                    </div>
                  )}
                  {selectedApplication.experienceLevel && (
                    <div>
                      <span className="text-sm text-gray-400">Experience Level:</span>
                      <p className="text-white font-medium capitalize">{selectedApplication.experienceLevel}</p>
                    </div>
                  )}
                  {selectedApplication.industry && (
                    <div>
                      <span className="text-sm text-gray-400">Industry:</span>
                      <p className="text-white font-medium">{selectedApplication.industry}</p>
                    </div>
                  )}
                  {selectedApplication.department && (
                    <div>
                      <span className="text-sm text-gray-400">Department:</span>
                      <p className="text-white font-medium">{selectedApplication.department}</p>
                    </div>
                  )}
                  {selectedApplication.applicationDeadline && (
                    <div>
                      <span className="text-sm text-gray-400">Application Deadline:</span>
                      <p className="text-white font-medium">{new Date(selectedApplication.applicationDeadline).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-400">Application Status:</span>
                    <p className="text-white font-medium">{getStatusLabel(selectedApplication.status)}</p>
                  </div>
                </div>
                </div>
              )}

              {activeTab === 'application' && (
                <div className="space-y-6">
                  {/* Application Status */}
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Application Status</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedApplication.status === 'hired' 
                          ? 'bg-emerald-400'
                          : selectedApplication.status === 'not qualified' || selectedApplication.status === 'rejected'
                          ? 'bg-red-400'
                          : selectedApplication.status === 'final interview'
                          ? 'bg-indigo-400'
                          : selectedApplication.status === 'initial interview'
                          ? 'bg-purple-400'
                          : selectedApplication.status === 'verified'
                          ? 'bg-cyan-400'
                          : selectedApplication.status === 'for verification'
                          ? 'bg-orange-400'
                          : selectedApplication.status === 'qualified'
                          ? 'bg-yellow-400'
                          : selectedApplication.status === 'submitted'
                          ? 'bg-blue-400'
                          : selectedApplication.status === 'passed'
                          ? 'bg-green-400'
                          : selectedApplication.status === 'withdrawn' || selectedApplication.status === 'closed'
                          ? 'bg-gray-400'
                          : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm text-gray-300 font-medium">{getStatusLabel(selectedApplication.status)}</span>
                    </div>
                    <p className="text-sm text-gray-300 italic">
                      {getStatusDescription(selectedApplication.status)}
                    </p>
                  </div>

                  {/* Application Data */}
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Application Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-400">Applied Date:</span>
                        <p className="text-white font-medium">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Resume Slug:</span>
                        <p className="text-white font-medium">{selectedApplication.resumeSlug}</p>
                      </div>
                    </div>
                  </div>

                  {/* Resume Information */}
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Resume</h3>
                      <button
                        onClick={() => router.push(`/resume/${selectedApplication.resumeSlug}`)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-600/30 transition-colors group"
                      >
                      <FileText className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300" />
                      <div className="text-left">
                        <p className="text-white font-medium group-hover:text-cyan-300">Resume Used</p>
                        <p className="text-sm text-gray-400">Slug: {selectedApplication.resumeSlug}</p>
                        <p className="text-xs text-cyan-400 mt-1">Click to view resume →</p>
                      </div>
                    </button>
                  </div>

                  {/* Candidates Applied */}
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Competition</h3>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Total Candidates Applied</p>
                        <p className="text-sm text-gray-400">
                          {selectedApplication.candidateCount !== undefined 
                            ? `${selectedApplication.candidateCount} candidate${selectedApplication.candidateCount !== 1 ? 's' : ''} applied for this position`
                            : 'This information is not available at the moment'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
