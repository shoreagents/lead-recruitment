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
  Calendar, 
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock3,
  TrendingUp,
  Users,
  Mail,
  Phone,
  ExternalLink,
  ArrowLeft,
  DollarSign,
  Edit3,
  Save,
  X,
  Trophy,
  RefreshCw,
  Building2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import RecruiterSignInModal from '@/components/auth/RecruiterSignInModal';
import RecruiterSignUpForm from '@/components/auth/RecruiterSignUpForm';
import { useAuth } from '@/contexts/AuthContext';

export default function ApplicantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Modal handler functions
  const handleSwitchToSignUp = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUpModal(false);
    setShowSignInModal(true);
  };
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState('jobs'); // 'jobs' or 'applicants'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  
  // Status editing states
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState<any>(null);
  const [showApplicantStatusDropdown, setShowApplicantStatusDropdown] = useState<string | null>(null);
  const [isUpdatingApplicantStatus, setIsUpdatingApplicantStatus] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch real job data from database
  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      if (!user?.id) {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        return;
      }
      
      // Fetch jobs from recruiter jobs API
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      const response = await fetch('/api/recruiter/jobs', {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      
      if (!response.ok) throw new Error('Failed to load jobs');
      
      const data = await response.json();
      
      // Fetch application counts for each job
      const jobsWithApplicants = await Promise.all((data.jobs || []).map(async (job: any) => {
        let applicationsCount = 0;
        try {
          // Fetch applicants for this job to get the real count
          const applicantsResponse = await fetch(`/api/recruiter/applicants?jobId=${job.originalId}`, {
            headers: {
              'x-user-id': user?.id || ''
            }
          });
          
          if (applicantsResponse.ok) {
            const applicantsData = await applicantsResponse.json();
            applicationsCount = applicantsData.applicants?.length || 0;
          }
        } catch (err) {
          console.error('Error fetching applicants count for job:', job.id, err);
        }
        
        return {
          id: job.id,
          originalId: job.originalId,
          title: job.title,
          company: job.company,
          location: job.work_arrangement || 'Remote',
          type: job.work_type || 'Full-time',
          salary: job.salaryMin && job.salaryMax ? 
            `₱${job.salaryMin.toLocaleString()} - ₱${job.salaryMax.toLocaleString()}` : 
            'Not specified',
          postedDate: new Date(job.created_at || Date.now()).toISOString().split('T')[0],
          applicationsCount: applicationsCount,
          status: job.status || 'new_request',
          description: job.description || 'No description available',
          requirements: job.requirements || [],
          priority: job.priority || 'medium',
          application_deadline: job.application_deadline,
          experience_level: job.experienceLevel,
          work_arrangement: job.work_arrangement,
          industry: job.industry,
          department: job.department,
          // Mock applicants data for now - you can replace this with real API call later
          applicants: generateMockApplicants(applicationsCount)
        };
      }));
      
      setJobs(jobsWithApplicants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showApplicantStatusDropdown) {
        setShowApplicantStatusDropdown(null);
      }
      if (showStatusDropdown) {
        setShowStatusDropdown(null);
      }
    };

    if (showApplicantStatusDropdown || showStatusDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showApplicantStatusDropdown, showStatusDropdown]);

  // Refresh jobs when page comes into focus (e.g., when navigating from post-job page)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id && viewMode === 'jobs') {
        fetchJobs(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id, viewMode]);

  // Generate mock applicants data based on job applicants count
  const generateMockApplicants = (count: number) => {
    const mockApplicants = [
      {
        id: 1,
        candidateName: 'Sarah Johnson',
        appliedDate: '2024-01-15',
        status: 'pending',
        experience: '5 years',
        skills: ['Customer Service', 'CRM', 'Communication', 'Problem Solving'],
        rating: 4.8,
        coverLetter: 'I am excited to apply for this position...',
        lastActivity: '2 hours ago'
      },
      {
        id: 2,
        candidateName: 'John Smith',
        appliedDate: '2024-01-14',
        status: 'reviewed',
        experience: '4 years',
        skills: ['Customer Service', 'Sales', 'Communication'],
        rating: 4.5,
        coverLetter: 'I have extensive experience in this field...',
        lastActivity: '1 day ago'
      },
      {
        id: 3,
        candidateName: 'Emily Davis',
        appliedDate: '2024-01-13',
        status: 'interviewed',
        experience: '6 years',
        skills: ['Customer Service', 'CRM', 'Team Leadership'],
        rating: 4.7,
        coverLetter: 'With my leadership experience...',
        lastActivity: '3 hours ago'
      },
      {
        id: 4,
        candidateName: 'Michael Chen',
        appliedDate: '2024-01-12',
        status: 'pending',
        experience: '3 years',
        skills: ['Technical Support', 'JavaScript', 'Customer Service'],
        rating: 4.6,
        coverLetter: 'I have a strong background in technical support...',
        lastActivity: '4 hours ago'
      },
      {
        id: 5,
        candidateName: 'Lisa Rodriguez',
        appliedDate: '2024-01-11',
        status: 'reviewed',
        experience: '2 years',
        skills: ['Technical Support', 'Python', 'Communication'],
        rating: 4.4,
        coverLetter: 'I am passionate about helping customers...',
        lastActivity: '2 days ago'
      }
    ];

    // Return a subset based on the actual applicant count
    return mockApplicants.slice(0, Math.min(count, mockApplicants.length));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock3 className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'interviewed': return <MessageCircle className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleJobClick = async (job: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real applicants for this job using originalId
      const response = await fetch(`/api/recruiter/applicants?jobId=${job.originalId}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load applicants');
      
      const data = await response.json();
      const realApplicants = (data.applications || []).map((app: any) => ({
        id: app.id,
        candidateName: app.user?.full_name?.split(' ')[0] || app.user?.email || 'Applicant',
        appliedDate: new Date(app.created_at).toISOString().split('T')[0],
        status: app.status || 'submitted',
        experience: 'Not specified', // This would need to be fetched from user profile
        skills: [], // This would need to be fetched from user profile
        rating: 4.5, // This would need to be calculated or fetched
        coverLetter: 'Cover letter not available', // This would need to be fetched
        lastActivity: new Date(app.created_at).toLocaleDateString(),
        email: app.user?.email,
        position: app.user?.position,
        location: app.user?.location,
        avatar_url: app.user?.avatar_url,
        resume_slug: app.resume_slug,
        resume_title: app.resume_title
      }));
      
      // Update the job with real applicants
      const updatedJob = {
        ...job,
        applicants: realApplicants,
        applicationsCount: realApplicants.length
      };
      
      setSelectedJob(updatedJob);
      setViewMode('applicants');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToJobs = () => {
    setViewMode('jobs');
    setSelectedJob(null);
  };

  const handleViewApplicants = async (job: any) => {
    console.log('🚀 handleViewApplicants called with job:', job);
    setSelectedJobForModal(job);
    setShowApplicantsModal(true);
    setLoadingApplicants(true);
    
    try {
      // Extract the original UUID from the combined job ID
      const originalJobId = job.originalId || job.id.split('_').slice(1, -1).join('_');
      
      console.log('🔍 Original job ID:', originalJobId);
      console.log('🔍 User ID:', user?.id);
      console.log('🔍 Making API call to:', `/api/recruiter/applicants?jobId=${originalJobId}`);
      
      const response = await fetch(`/api/recruiter/applicants?jobId=${originalJobId}`, {
        headers: {
          'x-user-id': user?.id || ''
        }
      });
      
      console.log('🔍 API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API response data:', data);
        setApplicants(data.applicants || []);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to fetch applicants:', response.status, errorData);
        setApplicants([]);
        
        // Show error details in console for debugging
        if (errorData.details) {
          console.error('Error details:', errorData.details);
        }
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleApplicantStatusUpdate = async (applicantId: string, newStatus: string) => {
    setIsUpdatingApplicantStatus(true);
    setShowApplicantStatusDropdown(null);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(`/api/recruiter/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the applicant in the local state
        setApplicants(prevApplicants => 
          prevApplicants.map(applicant => 
            applicant.id === applicantId 
              ? { ...applicant, status: newStatus }
              : applicant
          )
        );
        setSuccessMessage('Applicant status updated successfully');
        setShowSuccessDialog(true);
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to update applicant status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating applicant status:', error);
      alert('❌ Failed to update applicant status. Please try again.');
    } finally {
      setIsUpdatingApplicantStatus(false);
    }
  };

  const handleJobStatusUpdate = async (jobId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    setShowStatusDropdown(null);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(`/api/recruiter/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the job in the local state
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.originalId === jobId 
              ? { ...job, status: newStatus }
              : job
          )
        );
        setSuccessMessage('Job status updated successfully');
        setShowSuccessDialog(true);
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to update job status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert(`❌ Failed to update job status: ${error.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Status editing functions
  const handleStatusEdit = (applicationId: string, currentStatus: string) => {
    setEditingStatus(applicationId);
    setTempStatus(currentStatus);
  };

  const handleStatusSave = async (applicationId: string) => {
    try {
      setUpdatingStatus(applicationId);
      
      const response = await fetch('/api/recruiter/applicants', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId,
          status: tempStatus
        })
      });

      if (response.ok) {
        // Update local state
        if (selectedJob) {
          const updatedJob = {
            ...selectedJob,
            applicants: selectedJob.applicants.map((app: any) => 
              app.id === applicationId 
                ? { ...app, status: tempStatus }
                : app
            )
          };
          setSelectedJob(updatedJob);
        }
        
        setEditingStatus(null);
        setTempStatus('');
        // You could add a toast notification here
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusCancel = () => {
    setEditingStatus(null);
    setTempStatus('');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredApplicants = selectedJob ? selectedJob.applicants.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  // Calculate stats from real data
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicationsCount, 0);
  const pendingApplicants = jobs.reduce((sum, job) => 
    sum + job.applicants.filter((app: any) => app.status === 'pending').length, 0
  );
  const interviewedApplicants = jobs.reduce((sum, job) => 
    sum + job.applicants.filter((app: any) => app.status === 'interviewed').length, 0
  );
  const hiredApplicants = jobs.reduce((sum, job) => 
    sum + job.applicants.filter((app: any) => app.status === 'hired').length, 0
  );

  const stats = [
    { label: 'Total Applicants', value: totalApplicants.toLocaleString(), change: '+12%', changeType: 'positive' },
    { label: 'Hiring', value: pendingApplicants.toString(), change: '-5%', changeType: 'negative' },
    { label: 'Interviewed', value: interviewedApplicants.toString(), change: '+8%', changeType: 'positive' },
    { label: 'Hired This Month', value: hiredApplicants.toString(), change: '+15%', changeType: 'positive' }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg font-medium">Error loading applicants</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              {viewMode === 'jobs' ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
                  <p className="mt-1 text-sm text-gray-600">Select a job to view its applications</p>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBackToJobs}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Applications</span>
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedJob?.title}</h1>
                    <p className="mt-1 text-sm text-gray-600">{selectedJob?.company} • {selectedJob?.applicationsCount} applications</p>
                  </div>
                </div>
              )}
            </div>
            {viewMode === 'jobs' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchJobs(true)}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Applications</p>
                  <div className="text-3xl font-bold text-blue-900">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-blue-300 animate-pulse rounded"></span>
                    ) : (
                      totalApplicants.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Job applications received</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Hiring</p>
                  <div className="text-3xl font-bold text-yellow-900">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-yellow-300 animate-pulse rounded"></span>
                    ) : (
                      pendingApplicants.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">Awaiting review</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Interviewed</p>
                  <div className="text-3xl font-bold text-purple-900">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-purple-300 animate-pulse rounded"></span>
                    ) : (
                      interviewedApplicants.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-purple-700 mt-2">Interviewed candidates</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">Hired This Month</p>
                  <div className="text-3xl font-bold text-emerald-900">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-emerald-300 animate-pulse rounded"></span>
                    ) : (
                      hiredApplicants.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">Successfully hired</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 !bg-white border-2 border-emerald-200 text-gray-900 placeholder-black focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-[3px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50 focus-visible:ring-[3px] shadow-md hover:border-emerald-300 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm hover:border-gray-400 transition-colors min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm hover:border-gray-400 transition-colors min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === 'jobs' ? (
          /* Jobs List */
          <div className="space-y-4">
            {filteredJobs.map((job, index) => {
              // Create color variations for job cards
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
                <Card key={job.id} className={`${cardColor} shadow-sm hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                        <div className="flex items-center gap-1 relative">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${
                            job.status === 'new_request' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            job.status === 'inactive' ? 'bg-gray-50 text-gray-700 border-gray-200' : 
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {job.status.replace('_', ' ')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowStatusDropdown(showStatusDropdown === job.id ? null : job.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={isUpdatingStatus}
                          >
                            <Edit3 className="w-3 h-3 text-gray-500" />
                          </button>
                          
                          {/* Job Status Dropdown */}
                          {showStatusDropdown === job.id && (
                            <div className="absolute left-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobStatusUpdate(job.originalId, 'new_request');
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'new_request' ? 'bg-amber-50 text-amber-700' : 'text-gray-700'}`}
                              >
                                New Request
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobStatusUpdate(job.originalId, 'active');
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'}`}
                              >
                                Active
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobStatusUpdate(job.originalId, 'inactive');
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'inactive' ? 'bg-gray-50 text-gray-700' : 'text-gray-700'}`}
                              >
                                Inactive
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobStatusUpdate(job.originalId, 'closed');
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'closed' ? 'bg-red-50 text-red-700' : 'text-gray-700'}`}
                              >
                                Closed
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1 truncate">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{job.work_arrangement || 'Remote'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Posted {job.postedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{job.experience_level}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{job.description}</p>
                      {job.application_deadline && (
                        <div className="flex items-center gap-1 text-sm text-red-600 mb-3">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{job.applicationsCount}</div>
                      <div className="text-sm text-gray-600 mb-3">Applications</div>
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewApplicants(job);
                        }}
                      >
                        View Applicants
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        ) : (
          /* Applicants List */
          <div className="space-y-4">
            {filteredApplicants.map((application, index) => {
              // Create color variations for applicant cards
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
                <Card key={application.id} className={`${cardColor} shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {application.avatar_url ? (
                          <img 
                            src={application.avatar_url} 
                            alt={application.candidateName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          application.candidateName.split(' ').map(n => n[0]).join('')
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{application.candidateName}</h3>
                          <div className="flex items-center space-x-2">
                            {editingStatus === application.id ? (
                              <div className="flex items-center space-x-2">
                                <select
                                  value={tempStatus}
                                  onChange={(e) => setTempStatus(e.target.value)}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                  <option value="submitted">Submitted</option>
                                  <option value="qualified">Qualified</option>
                                  <option value="for verification">For Verification</option>
                                  <option value="verified">Verified</option>
                                  <option value="initial interview">Initial Interview</option>
                                  <option value="final interview">Final Interview</option>
                                  <option value="not qualified">Not Qualified</option>
                                  <option value="passed">Passed</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="withdrawn">Withdrawn</option>
                                  <option value="hired">Hired</option>
                                  <option value="closed">Closed</option>
                                </select>
                                <button
                                  onClick={() => handleStatusSave(application.id)}
                                  disabled={updatingStatus === application.id}
                                  className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                                >
                                  {updatingStatus === application.id ? (
                                    <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Save className="w-3 h-3" />
                                  )}
                                </button>
                                <button
                                  onClick={handleStatusCancel}
                                  className="p-1 text-gray-600 hover:text-gray-700"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Badge className={`${getStatusColor(application.status)} flex items-center space-x-1`}>
                                  {getStatusIcon(application.status)}
                                  <span className="capitalize">{application.status}</span>
                                </Badge>
                                <button
                                  onClick={() => handleStatusEdit(application.id, application.status)}
                                  className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          {application.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{application.email}</span>
                            </div>
                          )}
                          {application.position && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{application.position}</span>
                            </div>
                          )}
                          {application.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{application.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {application.appliedDate}</span>
                          </div>
                        </div>
                        {application.resume_title && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                            <FileText className="h-4 w-4" />
                            <span>{application.resume_title}</span>
                          </div>
                        )}
                        {application.skills && application.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {application.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Placeholder for resume functionality
                          console.log('Resume clicked for:', application.candidateName);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Placeholder for profile functionality
                          console.log('Profile clicked for:', application.candidateName);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Redirect to messages page with the specific candidate
                          router.push(`/recruiter/messages?candidate=${encodeURIComponent(application.candidateName)}`);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {((viewMode === 'jobs' && filteredJobs.length === 0) || (viewMode === 'applicants' && filteredApplicants.length === 0)) && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {viewMode === 'jobs' ? 'No jobs found' : 'No applications found'}
              </h3>
              <p className="text-gray-600">
                {viewMode === 'jobs' ? 'Try adjusting your search criteria.' : 'Try adjusting your search criteria or filters.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Detail Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review candidate information and applicant details
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {selectedApplication.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedApplication.candidateName}</h3>
                  <p className="text-lg text-gray-700">{selectedApplication.position}</p>
                  <p className="text-gray-600">{selectedApplication.company}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedApplication.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{selectedApplication.rating}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(selectedApplication.status)} flex items-center space-x-1`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="capitalize">{selectedApplication.status}</span>
                </Badge>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{selectedApplication.candidateName.toLowerCase().replace(' ', '.')}@email.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+63 912 345 6789</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedApplication.coverLetter}</p>
                </div>
              </div>

              {/* Application Timeline */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Application Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                      <p className="text-xs text-gray-500">{selectedApplication.appliedDate}</p>
                    </div>
                  </div>
                  {selectedApplication.status !== 'pending' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Reviewed</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.status === 'interviewed' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Interview Scheduled</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowApplicationModal(false)}>
              Close
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (selectedApplication) {
                  router.push(`/recruiter/messages?candidate=${encodeURIComponent(selectedApplication.candidateName)}`);
                  setShowApplicationModal(false);
                }
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Candidate
            </Button>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Applicants Modal */}
      <Dialog open={showApplicantsModal} onOpenChange={setShowApplicantsModal}>
        <DialogContent className="!max-w-[70vw] max-h-[90vh] overflow-y-auto bg-white border-gray-300 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedJobForModal?.title} - Applicants
            </DialogTitle>
            <DialogDescription>
              View and manage applicants for this job posting
            </DialogDescription>
          </DialogHeader>
          
          {/* Applicants Count */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'}</h3>
          </div>
          
          <div className="space-y-4">
            {selectedJobForModal && (
              <>
                {/* Applicants List */}
                <div className="space-y-3">
                  {loadingApplicants ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading applicants...</p>
                    </div>
                  ) : applicants.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
                      <p className="text-gray-600">This job posting has not received any applications yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applicants.map((applicant) => (
                        <div key={applicant.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
            {applicant.avatar && applicant.avatar.startsWith('http') ? (
              <img 
                src={applicant.avatar} 
                alt={applicant.fullName || 'Applicant'}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-emerald-600 font-semibold text-lg">
                {(applicant.firstName || applicant.fullName)?.charAt(0) || 'U'}
              </span>
            )}
          </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {applicant.fullName || 'Unknown User'}
                                  </h4>
                                  <div className="relative">
                                    <div className="flex items-center gap-1">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        applicant.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                        applicant.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                        applicant.status === 'for verification' ? 'bg-yellow-100 text-yellow-800' :
                                        applicant.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                                        applicant.status === 'initial' ? 'bg-purple-100 text-purple-800' :
                                        applicant.status === 'interview' ? 'bg-indigo-100 text-indigo-800' :
                                        applicant.status === 'final interview' ? 'bg-blue-100 text-blue-800' :
                                        applicant.status === 'not qualified' ? 'bg-red-100 text-red-800' :
                                        applicant.status === 'passed' ? 'bg-green-100 text-green-800' :
                                        applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        applicant.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                                        applicant.status === 'hired' ? 'bg-emerald-100 text-emerald-800' :
                                        applicant.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                        applicant.status === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {applicant.status || 'submitted'}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowApplicantStatusDropdown(showApplicantStatusDropdown === applicant.id ? null : applicant.id);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        disabled={isUpdatingApplicantStatus}
                                      >
                                        <Edit3 className="w-3 h-3 text-gray-500" />
                                      </button>
                                    </div>
                                    
                                    {/* Applicant Status Dropdown */}
                                    {showApplicantStatusDropdown === applicant.id && (
                                      <div className="absolute left-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'submitted');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'submitted' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                        >
                                          Submitted
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'qualified');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'qualified' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                                        >
                                          Qualified
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'for verification');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'for verification' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-700'}`}
                                        >
                                          For Verification
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'verified');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'}`}
                                        >
                                          Verified
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'initial');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'initial' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                                        >
                                          Initial
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'interview');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'interview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                                        >
                                          Interview
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'final interview');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'final interview' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                        >
                                          Final Interview
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'not qualified');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'not qualified' ? 'bg-red-50 text-red-700' : 'text-gray-700'}`}
                                        >
                                          Not Qualified
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'passed');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'passed' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                                        >
                                          Passed
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'rejected');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'rejected' ? 'bg-red-50 text-red-700' : 'text-gray-700'}`}
                                        >
                                          Rejected
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'withdrawn');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'withdrawn' ? 'bg-gray-50 text-gray-700' : 'text-gray-700'}`}
                                        >
                                          Withdrawn
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'hired');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'hired' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'}`}
                                        >
                                          Hired
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'closed');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'closed' ? 'bg-gray-50 text-gray-700' : 'text-gray-700'}`}
                                        >
                                          Closed
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplicantStatusUpdate(applicant.id, 'failed');
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${applicant.status === 'failed' ? 'bg-red-50 text-red-700' : 'text-gray-700'}`}
                                        >
                                          Failed
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  @{applicant.username || 'no-username'}
                                </p>
                                <div className="text-sm text-gray-500">
                                  Applied: <span className="text-gray-900 font-medium">
                                    {new Date(applicant.appliedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {applicant.resumeSlug && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-xs px-3"
                                    onClick={() => {
                                      // Handle view resume
                                      console.log('View resume for:', applicant.id);
                                    }}
                                  >
                                    Resume
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs px-3"
                                  onClick={() => {
                                    // Handle view profile
                                    console.log('View profile for:', applicant.id);
                                  }}
                                >
                                  Profile
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs px-3"
                                  onClick={() => {
                                    // Redirect to messages page
                                    router.push('/recruiter/messages');
                                  }}
                                >
                                  Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicantsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              Success
            </AlertDialogTitle>
            <AlertDialogDescription>
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
