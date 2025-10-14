'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Eye,
  MessageCircle,
  Download,
  MoreHorizontal,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Trophy,
  Building2,
  Edit3
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import RecruiterSignInModal from '@/components/auth/RecruiterSignInModal';
import RecruiterSignUpForm from '@/components/auth/RecruiterSignUpForm';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function CandidatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Modal handler functions
  const handleSwitchToSignUp = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUpModal(false);
    setShowSignInModal(true);
  };
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    hired: 0
  });
  
  // Applications modal state
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  
  // Status dropdown states
  const [showStatusDropdown, setShowStatusDropdown] = useState<number | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Success dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New Application';
      case 'reviewed': return 'Under Review';
      case 'interviewed': return 'Interviewed';
      case 'hired': return 'Hired';
      default: return 'Unknown';
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-yellow-500 text-white font-semibold">GOLD</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-gray-400 text-white font-semibold">SILVER</Badge>;
    } else {
      return <Badge className="bg-amber-600 text-white font-semibold">BRONZE</Badge>;
    }
  };

  const getProfileStatusBadge = (isComplete: boolean) => {
    if (!isComplete) {
      return <Badge className="bg-orange-500 text-white font-semibold">Profile Not Complete</Badge>;
    }
    return null;
  };

  // Fetch candidates data
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      const response = await fetch('/api/recruiter/candidates', {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      
      const data = await response.json();
      console.log('🔍 Fetched candidates:', data);
      
      setCandidates(data.candidates || []);
      setStats({
        total: data.candidates?.length || 0,
        hired: data.candidates?.reduce((sum: number, c: any) => sum + (c.hiredCount || 0), 0) || 0
      });
      
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [user?.id]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStatusDropdown !== null) {
        setShowStatusDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  // Fetch applications for a specific candidate
  const fetchCandidateApplications = async (candidate: any) => {
    try {
      setLoadingApplications(true);
      setSelectedCandidate(candidate);
      
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      console.log('🔍 Fetching applications for candidate:', candidate.id);
      
      // Fetch applications from recruiter_applications table
      const response = await fetch(`/api/recruiter/candidate-applications?userId=${candidate.id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      
      console.log('🔍 Response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorData = { error: 'Failed to parse error response' };
        }
        console.error('❌ API Error:', errorData);
        console.error('❌ Response status:', response.status);
        console.error('❌ Response statusText:', response.statusText);
        throw new Error(`Failed to fetch applications: ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('🔍 Fetched applications for candidate:', data);
      
      setApplications(data.applications || []);
      setShowApplicationsModal(true);
      
    } catch (err) {
      console.error('Error fetching candidate applications:', err);
      // Show modal with empty applications instead of error
      setApplications([]);
      setShowApplicationsModal(true);
      setError(null); // Clear any previous errors
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    console.log('🔍 Updating status for application:', applicationId, 'to:', newStatus);
    console.log('🔍 Current applications:', applications);
    setIsUpdatingStatus(true);
    setShowStatusDropdown(null);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      console.log('🔍 Making API call to:', `/api/recruiter/applicants/${applicationId}`);
      console.log('🔍 Request body:', { status: newStatus });

      const response = await fetch(`/api/recruiter/applicants/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Response:', result);
        
        // Update the application in the local state
        setApplications(prevApplications => 
          prevApplications.map(application => 
            application.id === applicationId 
              ? { ...application, status: newStatus }
              : application
          )
        );
        setSuccessMessage('Application status updated successfully');
        setShowSuccessDialog(true);
      } else {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        alert(`❌ Failed to update application status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      alert('❌ Failed to update application status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchTerm || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
              <p className="text-gray-600">Review and manage job applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Candidates</p>
                  <div className="text-3xl font-bold text-blue-900">
                    {stats.total}
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Qualified professionals</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">Hired</p>
                  <div className="text-3xl font-bold text-emerald-900">
                    {stats.hired}
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">Successfully hired</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 h-4 w-4" />
                  <Input
                    placeholder="Search candidates by name or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 !bg-white border-2 border-emerald-200 text-gray-900 placeholder-black focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-[3px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50 focus-visible:ring-[3px] shadow-md hover:border-emerald-300 transition-colors"
                  />
                </div>
              </div>
              <select className="px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm hover:border-gray-400 transition-colors min-w-[140px]">
                <option value="all">All Status</option>
                <option value="new">New Applications</option>
                <option value="reviewed">Under Review</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
              </select>
              <select className="px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm hover:border-gray-400 transition-colors min-w-[140px]">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experience</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading candidates...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-white border border-red-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-600 mb-2">Error loading candidates</p>
              <p className="text-red-500 text-sm">{error}</p>
              <Button 
                onClick={fetchCandidates}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">No applicants available</p>
                  <p className="text-gray-500 text-sm">
                    There are currently no candidates in the system. Check back later for new applicants.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate, index) => {
                  // Create color variations for candidate cards
                  const colorVariations = [
                    'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200',
                    'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200',
                    'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200',
                    'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200',
                    'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:from-pink-100 hover:to-pink-200',
                    'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:from-cyan-100 hover:to-cyan-200',
                    'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200',
                    'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-200'
                  ];
                  
                  const cardColor = colorVariations[index % colorVariations.length];
                  
                  return (
                    <Card 
                      key={candidate.id} 
                      className={`${cardColor} shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 cursor-pointer`}
                      onClick={() => fetchCandidateApplications(candidate)}
                    >
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Row 1: Avatar and Name */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {candidate.avatar && candidate.avatar.startsWith('http') ? (
                            <img 
                              src={candidate.avatar} 
                              alt={candidate.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            candidate.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{candidate.name}</h3>
                          <p className="text-gray-600 text-sm truncate">@{candidate.username || candidate.slug}</p>
                        </div>
                      </div>


                      {/* Row 2: Application Stats */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-gray-600">Total Applications:</span>
                          </div>
                          <span className="text-gray-900">{candidate.totalApplications}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="font-bold text-gray-600">Joined:</span>
                          </div>
                          <span className="text-gray-900">{candidate.joinDate}</span>
                        </div>
                      </div>

                      {/* Row 3: Action Buttons */}
                      <div className="mt-auto flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          onClick={() => router.push(`/${candidate.slug}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Profile
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => router.push(`/recruiter/messages?candidate=${encodeURIComponent(candidate.name)}`)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

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

      {/* Applications Modal */}
      <Dialog open={showApplicationsModal} onOpenChange={setShowApplicationsModal}>
        <DialogContent className="!max-w-[70vw] max-h-[90vh] overflow-y-auto bg-white [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {selectedCandidate?.name}'s Applications
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              View and manage applications for this candidate
            </DialogDescription>
            <div className="text-left text-sm text-gray-500 mt-2">
              {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
            </div>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {loadingApplications ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading applications...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 mb-2 font-medium">No applications found</p>
                <p className="text-gray-600 text-sm">
                  This candidate hasn't submitted any applications to your jobs yet.
                </p>
              </div>
            ) : (
              applications.map((application, index) => (
                <div key={application.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold text-lg">
                          {application.jobTitle?.charAt(0) || 'J'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {application.jobTitle || 'Unknown Position'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {application.companyName || 'Unknown Company'}
                            </p>
                          </div>
                          <div className="relative ml-4">
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                application.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                application.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                application.status === 'for verification' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                                application.status === 'initial' ? 'bg-purple-100 text-purple-800' :
                                application.status === 'interview' ? 'bg-indigo-100 text-indigo-800' :
                                application.status === 'final interview' ? 'bg-blue-100 text-blue-800' :
                                application.status === 'not qualified' ? 'bg-red-100 text-red-800' :
                                application.status === 'passed' ? 'bg-green-100 text-green-800' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                application.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                                application.status === 'hired' ? 'bg-emerald-100 text-emerald-800' :
                                application.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                application.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {application.status || 'submitted'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('🔍 Edit icon clicked! Current dropdown:', showStatusDropdown, 'Index:', index);
                                  setShowStatusDropdown(showStatusDropdown === index ? null : index);
                                }}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                disabled={isUpdatingStatus}
                              >
                                <Edit3 className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                            
                            {showStatusDropdown === index && (
                              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                                <div className="py-1">
                                  {[
                                    'submitted',
                                    'for verification', 
                                    'qualified',
                                    'verified',
                                    'initial',
                                    'interview',
                                    'final interview',
                                    'not qualified',
                                    'passed',
                                    'rejected',
                                    'withdrawn',
                                    'hired',
                                    'closed',
                                    'failed'
                                  ].map((status) => (
                                    <button
                                      key={status}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('🔍 Button mousedown! Application ID:', application.id, 'Status:', status);
                                        handleStatusUpdate(application.id, status);
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('🔍 Button clicked! Application ID:', application.id, 'Status:', status);
                                        console.log('🔍 Current dropdown state:', showStatusDropdown);
                                        console.log('🔍 Current index:', index);
                                        handleStatusUpdate(application.id, status);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                                      disabled={isUpdatingStatus}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied: <span className="text-gray-900 font-medium">
                            {new Date(application.appliedAt || application.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {application.resumeSlug && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view resume
                            console.log('View resume for:', application.id);
                          }}
                        >
                          Resume
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view profile
                          console.log('View profile for:', application.id);
                        }}
                      >
                        Profile
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/recruiter/messages');
                        }}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <Button 
              onClick={() => setShowApplicationsModal(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              Success!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {successMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
