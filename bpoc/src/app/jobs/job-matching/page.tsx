'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  ArrowLeft,
  Target,
  Clock,
  DollarSign,
  BookmarkIcon,
  Building2,
  Search,
  Filter,
  X,
  FileText,
  CheckCircle,
  CheckCircle2,
  Star,
  Gift,
  Share2,
  Facebook,
  Linkedin,
  Mail,
  Copy,
  ChevronDown,
  ChevronUp,
  Brain,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users
} from 'lucide-react';
import { PacmanLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionToken } from '@/lib/auth-helpers';

function JobMatchingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Add CSS styles for search input
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Remove red outline from search input */
      .search-input-no-red:focus,
      .search-input-no-red:focus-visible,
      .search-input-no-red:invalid {
        border-color: rgba(255, 255, 255, 0.2) !important;
        box-shadow: none !important;
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<any | null>(null);
  const [shareJobId, setShareJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWorkType, setFilterWorkType] = useState('all');
  const [filterShift, setFilterShift] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isShiftFilterOpen, setIsShiftFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [isGetStartedDialogOpen, setIsGetStartedDialogOpen] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationType, setApplicationType] = useState<'success' | 'error' | 'info'>('success');
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Use Header's auth modals by toggling URL search params
  const shareRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const shiftFilterRef = useRef<HTMLDivElement>(null);
  const pageSelectorRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  // Open job modal if arrived via shared URL /jobs/[id] -> /jobs/job-matching?jobId=XYZ
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const jobId = params.get('jobId')
      if (jobId) {
        setSelectedJob(jobId)
      }
    } catch {}
  }, [])

  // Close share dropdown, filter dropdown, and page selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShareJobId(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (shiftFilterRef.current && !shiftFilterRef.current.contains(event.target as Node)) {
        setIsShiftFilterOpen(false);
      }
      if (pageSelectorRef.current && !pageSelectorRef.current.contains(event.target as Node)) {
        setIsPageSelectorOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShareJobId(null);
        setIsFilterOpen(false);
        setIsPageSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle application success modal
  useEffect(() => {
    const applicationStatus = searchParams.get('application');
    if (applicationStatus === 'success') {
      setShowSuccessModal(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('application');
      const newQuery = params.toString();
      router.replace(newQuery ? `/jobs/job-matching?${newQuery}` : '/jobs/job-matching', { scroll: false });
    }
  }, [searchParams, router]);

  const [jobs, setJobs] = useState<any[]>([])
  const [matchScores, setMatchScores] = useState<{[key: string]: any}>({})
  const [isLoadingMatches, setIsLoadingMatches] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [hasResume, setHasResume] = useState<boolean | null>(null)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)


  // Fetch jobs and calculate match scores
  useEffect(() => {
    (async () => {
      try {
        // Check if user has a resume first - only if user is logged in
        if (user?.id) {
          try {
            const token = await getSessionToken()
            const resumeCheck = await fetch(`/api/user/saved-resumes`, { 
              headers: { Authorization: `Bearer ${token}` },
              cache: 'no-store' 
            })
            
            if (resumeCheck.ok) {
              const resumeData = await resumeCheck.json()
              console.log('Resume check result:', resumeData)
              
              if (!resumeData.hasSavedResume) {
                setHasResume(false)
                setShowResumeModal(true)
                return // Don't proceed with job fetching
              } else {
                setHasResume(true)
              }
            } else {
              console.error('Failed to check resume:', resumeCheck.status)
              // If we can't check, assume they have a resume to avoid blocking
              setHasResume(true)
            }
          } catch (error) {
            console.error('Error checking resume:', error)
            // If there's an error, assume they have a resume to avoid blocking
            setHasResume(true)
          }
        } else {
          // No user logged in, don't show resume modal
          setHasResume(null)
        }

        // Combined endpoint for active jobs (includes both processed_job_requests and recruiter_jobs)
        const res = await fetch('/api/jobs/combined', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load jobs')
        const data = await res.json()
        const active = data.jobs || []
        const mapped = active.map((row: any) => ({
          id: row.id,
          originalId: row.originalId,
          source: row.source,
          company: row.company,
          companyLogo: row.companyLogo || '🏢',
          postedDays: row.postedDays ?? 0,
          title: row.title,
          employmentType: row.employmentType || [],
          salary: row.salary || '',
          location: row.location || '',
          matchPercentage: 0, // Will be updated with real scores
          // NEW FIELDS - All requested database fields
          priority: row.priority,
          work_arrangement: row.work_arrangement,
          shift: row.shift,
          industry: row.industry,
          department: row.department,
          application_deadline: row.application_deadline,
          experience_level: row.experience_level,
          work_type: row.work_type,
          // details will be loaded on demand
          description: row.job_description || '',
          responsibilities: row.responsibilities || [],
          qualifications: row.requirements || [],
          perks: row.benefits || []
        }))
        setJobs(mapped)

        // Calculate match scores for each job if user is logged in and has resume
        if (user?.id && hasResume) {
          setIsLoadingMatches(true)
          setAnalysisProgress(0)
          
          try {
            const jobIds = mapped.map((job: any) => job.originalId)
            setAnalysisProgress(25)
            
            const response = await fetch('/api/jobs/batch-match', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user.id,
                jobIds: jobIds
              })
            })

            if (response.ok) {
              const data = await response.json()
              setAnalysisProgress(75)
              
              const scores: {[key: string]: any} = {}
              
              // Process results - map originalId back to combined job.id
              if (data.results) {
                Object.entries(data.results).forEach(([originalId, result]: [string, any]) => {
                  // Find the corresponding job with this originalId
                  const job = mapped.find((j: any) => j.originalId === originalId)
                  if (job) {
                    scores[job.id] = {
                      score: result.score,
                      reasoning: result.reasoning,
                      breakdown: result.breakdown,
                      cached: result.cached
                    }
                  }
                })
              }
              
              setMatchScores(scores)
              setAnalysisProgress(100)
            } else {
              const errorText = await response.text()
              console.error('Batch match API error:', response.status, errorText)
              throw new Error(`Failed to analyze jobs: ${response.status} ${errorText}`)
            }
          } catch (error) {
            console.error('Error in batch job matching:', error)
            
            // Fallback to default scores - don't throw error, just use defaults
            const scores: {[key: string]: any} = {}
            mapped.forEach((job: any) => {
              scores[job.id] = { 
                score: 75, 
                reasoning: 'Using default score due to analysis error', 
                breakdown: {},
                cached: false
              }
            })
            setMatchScores(scores)
            setAnalysisProgress(100)
          }
          
          setTimeout(() => {
            setIsLoadingMatches(false)
            setAnalysisProgress(0)
          }, 500)
        }
      } catch (e) {
        console.error('Error loading jobs:', e)
        setJobs([])
      }
    })()
  }, [user?.id, hasResume])

  // Refresh match scores when user changes
  useEffect(() => {
    if (user?.id && jobs.length > 0 && hasResume) {
      // Check if we already have match scores for all jobs
      const hasAllScores = jobs.every(job => matchScores[job.id])
      
      if (hasAllScores) {
        // Already have scores, don't show loading modal
        return
      }
      
      (async () => {
        try {
          setIsLoadingMatches(true)
          setAnalysisProgress(0)
          
          const scores: {[key: string]: any} = {}
          const totalJobs = jobs.length
          
          for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i]
            const progress = Math.round(((i + 1) / totalJobs) * 100)
            
            setAnalysisProgress(progress)
            
            try {
              const matchRes = await fetch(`/api/jobs/match?userId=${user.id}&jobId=${job.originalId}`)
              if (matchRes.ok) {
                const matchData = await matchRes.json()
                scores[job.id] = {
                  score: Math.round(matchData.matchScore),
                  reasoning: matchData.reasoning,
                  breakdown: matchData.breakdown
                }
              } else {
                scores[job.id] = { score: 0, reasoning: 'Analysis failed', breakdown: {} }
              }
            } catch (error) {
              console.error('Error fetching match score for job:', job.id, error)
              scores[job.id] = { score: 0, reasoning: 'Network error', breakdown: {} }
            }
            
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 200))
          }
          
          setAnalysisProgress(100)
          setMatchScores(scores)
        } catch (error) {
          console.error('Error in individual job matching:', error)
          // Set default scores if everything fails
          const scores: {[key: string]: any} = {}
          jobs.forEach((job: any) => {
            scores[job.id] = { score: 75, reasoning: 'Using default score due to analysis error', breakdown: {} }
          })
          setMatchScores(scores)
        } finally {
          setTimeout(() => {
            setIsLoadingMatches(false)
            setAnalysisProgress(0)
          }, 500)
        }
      })()
    }
  }, [user?.id, jobs, hasResume, matchScores])

  // Load full job details when a job is selected (public endpoint so logged-out users can view)
  useEffect(() => {
    (async () => {
      if (!selectedJob) { setSelectedJobDetails(null); return }
      try {
        const res = await fetch(`/api/jobs/combined/${selectedJob}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load job details')
        const data = await res.json()
        setSelectedJobDetails(data.job || null)
      } catch (e) {
        setSelectedJobDetails(null)
      }
    })()
  }, [selectedJob])

  

  // No placeholder fallback; show message when empty

  const handleJobClick = (jobId: string) => {
    setSelectedJob(jobId);
  };

  const handleShare = (platform: string, job: any) => {
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const message = `Check out this amazing job opportunity at ${job.company}: ${job.title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(`Job Opportunity: ${job.title}`)}&body=${encodeURIComponent(message + '\n\n' + jobUrl)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(jobUrl);
        break;
    }
    setShareJobId(null);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (percentage >= 85) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (percentage >= 75) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (percentage >= 65) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (percentage >= 55) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (percentage >= 45) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 95) return `${percentage}% Perfect Match`;
    if (percentage >= 85) return `${percentage}% Excellent Match`;
    if (percentage >= 75) return `${percentage}% Very Good Match`;
    if (percentage >= 65) return `${percentage}% Good Match`;
    if (percentage >= 55) return `${percentage}% Fair Match`;
    if (percentage >= 45) return `${percentage}% Poor Match`;
    return "Not Suitable";
  };

  const getWorkType = (job: any) => {
    // Use actual work_arrangement from job data if available
    if (job.work_arrangement) {
      return job.work_arrangement;
    }
    
    // Fallback to mock work type based on company
    const workTypes: { [key: string]: string } = {
      'Amazon': 'remote',
      'Google': 'hybrid',
      'Microsoft': 'onsite',
      'Shopee': 'remote',
      'Accenture': 'onsite',
      'Concentrix': 'hybrid',
      'Netflix': 'remote',
      'Spotify': 'hybrid',
      'ShoreAgents': 'onsite'
    };
    return workTypes[job.company] || 'onsite';
  };

  const getWorkTypeLabel = (workType: string) => {
    const labels: { [key: string]: string } = {
      'all': 'All Work Types',
      'remote': 'Remote',
      'hybrid': 'Hybrid',
      'onsite': 'On-site'
    };
    return labels[workType] || workType;
  };

  const getShiftLabel = (shift: string) => {
    const labels: { [key: string]: string } = {
      'all': 'All Shifts',
      'day': 'Day Shift',
      'night': 'Night Shift'
    };
    return labels[shift] || shift;
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  const handleFilterChange = (workType: string) => {
    setFilterWorkType(workType);
    setIsFilterOpen(false);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handleShiftFilterChange = (shift: string) => {
    setFilterShift(shift);
    setIsShiftFilterOpen(false);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const triggerHeaderSignUp = () => {
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('signup', 'true')
      // Use client router to notify App Router hooks
      router.replace(url.pathname + url.search)
    } catch {}
  }

  const handleSignIn = () => {
    triggerHeaderSignUp()
  };

  const handleGetStarted = () => {
    triggerHeaderSignUp()
  };

  const list = jobs

  const filteredJobs = useMemo(() => {
    let filtered = list.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Work type filter
      const matchesWorkType = filterWorkType === 'all' || getWorkType(job) === filterWorkType;
      
      // Shift filter
      const matchesShift = filterShift === 'all' || job.shift === filterShift;
      
      return matchesSearch && matchesWorkType && matchesShift;
    });

    // Sort by match percentage if user is logged in and match scores are available
    if (user?.id && Object.keys(matchScores).length > 0) {
      filtered.sort((a, b) => {
        const scoreA = matchScores[a.id]?.score || 0;
        const scoreB = matchScores[b.id]?.score || 0;
        return scoreB - scoreA; // Sort by highest match first
      });
    }

    return filtered;
  }, [searchTerm, filterWorkType, filterShift, list, user?.id, matchScores]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredJobs.length / itemsPerPage);
  }, [filteredJobs.length, itemsPerPage]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredJobs.slice(start, end);
  }, [currentPage, filteredJobs, itemsPerPage]);

  const selectedJobData = selectedJob ? list.find(job => job.id === selectedJob) : null;

  // Check applications using the same API as "My Applications" page
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id || jobs.length === 0) return
      
      try {
        const response = await fetch(`/api/applications?userId=${user?.id}`, { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          const applications = data.applications || []
          
          // Create a set of applied job IDs
          const appliedJobIds = new Set(applications.map((app: any) => String(app.jobId)))
          
          // Check each job against applied jobs (compare originalId with stored jobId)
          const results: Record<string, boolean> = {}
          for (const job of jobs) {
            results[job.id] = appliedJobIds.has(String(job.originalId))
          }
          
          setAppliedMap(results)
        } else {
          console.error('Failed to fetch applications:', response.status)
          // Reset all to not applied
          const results: Record<string, boolean> = {}
          for (const job of jobs) results[job.id] = false
          setAppliedMap(results)
        }
      } catch (error) {
        console.error('Error fetching applications:', error)
        // Reset all to not applied
        const results: Record<string, boolean> = {}
        for (const job of jobs) results[job.id] = false
        setAppliedMap(results)
      }
    }

    fetchApplications()
  }, [user?.id, jobs.length])

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <Header />
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-400 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Job Matching</h1>
                  <p className="text-gray-400">AI-powered job recommendations for you</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20 search-input-no-red"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                
                {/* Work Type Filter */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm flex items-center gap-2 min-w-[140px] justify-between hover:bg-white/20 transition-colors"
                  >
                    <span>{getWorkTypeLabel(filterWorkType)}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 border border-white/20 rounded-lg shadow-lg z-50">
                      {['all', 'remote', 'hybrid', 'onsite'].map((workType) => (
                        <button
                          key={workType}
                          onClick={() => handleFilterChange(workType)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            filterWorkType === workType ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
                          }`}
                        >
                          {getWorkTypeLabel(workType)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shift Filter */}
                <div className="relative" ref={shiftFilterRef}>
                  <button
                    onClick={() => setIsShiftFilterOpen(!isShiftFilterOpen)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm flex items-center gap-2 min-w-[120px] justify-between hover:bg-white/20 transition-colors"
                  >
                    <span>{getShiftLabel(filterShift)}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {isShiftFilterOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 border border-white/20 rounded-lg shadow-lg z-50">
                      {['all', 'day', 'night'].map((shift) => (
                        <button
                          key={shift}
                          onClick={() => handleShiftFilterChange(shift)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            filterShift === shift ? 'bg-purple-500/20 text-purple-400' : 'text-white'
                          }`}
                        >
                          {getShiftLabel(shift)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>
                  {totalPages > 1 
                    ? `Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, filteredJobs.length)} of ${filteredJobs.length} jobs`
                    : user?.id && hasResume
                      ? `Showing ${filteredJobs.length} jobs matched to your profile`
                      : user?.id && hasResume === false
                        ? 'Resume required for job matching'
                        : `Showing ${filteredJobs.length} active jobs`
                  }
                </span>
                <span>
                  {totalPages > 1 
                    ? `Page ${currentPage} of ${totalPages}` 
                    : user?.id && hasResume && Object.keys(matchScores).length > 0
                      ? 'Sorted by match percentage'
                      : user?.id && hasResume === false
                        ? 'Create resume to continue'
                        : 'Sign in to see personalized matches'
                  }
                </span>
              </div>
            </div>
          </motion.div>

          {/* Job Cards */}
          {!user?.id ? (
            <div className="py-16 text-center text-gray-400">
              <Target className="h-16 w-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold mb-2">Sign in to see personalized job matches</h3>
              <p className="text-gray-500">Get AI-powered recommendations based on your skills and preferences</p>
            </div>
          ) : hasResume === false ? (
            <div className="py-16 text-center text-gray-400">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold mb-2">Resume Required</h3>
              <p className="text-gray-500 mb-4">Create your resume to get personalized job matches</p>
              <Button 
                onClick={() => router.push('/resume-builder')}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
              >
                <FileText className="w-4 h-4 mr-2" />
                Build Resume
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No active jobs</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="glass-card border-white/10 hover:border-purple-400/30 h-full transition-all duration-300 cursor-pointer"
                  onClick={() => handleJobClick(job.id)}
                >
                  <CardHeader className="pb-4">
                    {/* Company and Actions */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{job.companyLogo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium text-white">{job.company}</p>
                            <p className="text-xs text-gray-400">
                              {typeof job.postedDays === 'string' ? job.postedDays : `${job.postedDays} days ago`}
                            </p>
                          </div>
                          {/* Priority Badge next to company name */}
                          {job.priority && (
                            <Badge 
                              className={`px-2 py-0.5 text-xs font-semibold ml-2 ${
                                job.priority === 'urgent' ? 'bg-red-600/20 text-red-400 border-red-600/30' :
                                job.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                job.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                'bg-green-500/20 text-green-300 border-green-500/30'
                              }`}
                            >
                              {job.priority === 'urgent' ? '🚨' : job.priority === 'high' ? '⚡' : job.priority === 'medium' ? '⚠️' : '✅'} {job.priority?.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                                             <div className="flex items-center gap-1">
                         <div className="relative" ref={shareJobId === job.id ? shareRef : null}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareJobId(shareJobId === job.id ? null : job.id);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          
                          {shareJobId === job.id && (
                            <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg z-50 min-w-[160px]">
                              <div className="py-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare('facebook', job);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                >
                                  <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">f</span>
                                  </div>
                                  Facebook
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare('linkedin', job);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                >
                                  <Linkedin className="w-4 h-4 text-blue-500" />
                                  LinkedIn
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare('email', job);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                >
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  Email
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare('copy', job);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                >
                                  <Copy className="w-4 h-4 text-gray-400" />
                                  Copy link
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h2 className="text-xl font-bold text-white mb-2">
                      {job.title}
                    </h2>

                    {/* Employment Type + Work Info Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.employmentType
                        .filter((type: string) => type.toLowerCase() !== 'full-time')
                        .map((type: string, idx: number) => (
                        <Badge 
                          key={idx}
                          className="bg-white/10 text-gray-300 border-white/20 px-2 py-1 text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                      
                      {/* Work Arrangement Badge */}
                      {job.work_arrangement && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-2 py-1 text-xs">
                          <Building2 className="w-3 h-3 mr-1" />
                          {job.work_arrangement === 'onsite' ? 'Onsite' : 
                           job.work_arrangement === 'remote' ? 'Remote' : 
                           job.work_arrangement === 'hybrid' ? 'Hybrid' : 
                           job.work_arrangement}
                        </Badge>
                      )}

                      {/* Shift Badge */}
                      {job.shift && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-2 py-1 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.shift === 'day' ? 'Day' : 'Night'}
                        </Badge>
                      )}
                    </div>

                    {/* Match Percentage */}
                    <div className="mb-4">
                      {!user?.id ? (
                        <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 px-3 py-1 text-sm">
                          Sign in to see match
                        </Badge>
                      ) : isLoadingMatches ? (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1 text-sm animate-pulse">
                          AI Analyzing...
                        </Badge>
                      ) : matchScores[job.id] !== undefined ? (
                        <div className="relative">
                          <div className="flex items-center gap-2">
                            {matchScores[job.id].error ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1 text-sm">
                                AI Failed
                              </Badge>
                            ) : (
                                                             <Badge className={`${getMatchColor(matchScores[job.id].score)} px-3 py-1 text-sm`}>
                                 {getMatchLabel(matchScores[job.id].score)}
                               </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 px-3 py-1 text-sm">
                          No match data
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Salary */}
                    <div className="flex items-center text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-white text-sm">{job.salary}</span>
                    </div>

                    {/* Application Deadline - Bottom */}
                    {job.application_deadline && (
                      <div className="flex items-center text-xs text-gray-400 pt-1">
                        <Clock className="w-3 h-3 mr-1.5 text-red-400 flex-shrink-0" />
                        <span>Apply by {new Date(job.application_deadline).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                    )}

                    {/* Quick Apply Button */}
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job.id);
                      }}
                      disabled={Boolean(
                        !!appliedMap[job.id] || 
                        (user?.id && matchScores[job.id]?.score !== undefined && matchScores[job.id].score < 65)
                      )}
                    >
                      {!!appliedMap[job.id] 
                        ? 'Already Applied' 
                        : (user?.id && matchScores[job.id]?.score !== undefined && matchScores[job.id].score < 65)
                          ? 'Not Recommended'
                          : 'View & Apply'
                      }
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between mt-8 py-4"
            >
              {/* Left side - Info */}
              <div className="text-gray-300 text-sm">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>

              {/* Right side - Pagination Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page 
                        ? "bg-blue-600 text-white border-blue-600 px-4 py-2" 
                        : "bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 px-4 py-2"
                      }
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}



          {/* Job Details Modal */}
          <Dialog open={!!selectedJob && !!selectedJobData} onOpenChange={() => setSelectedJob(null)}>
            <DialogContent 
              className="bg-gray-900/95 backdrop-blur-md border-white/10 rounded-2xl !max-w-[1000px] w-full max-h-[85vh] p-0 overflow-hidden"
              showCloseButton={true}
            >
              <VisuallyHidden>
                <DialogTitle>Job Details - {selectedJobData?.title} at {selectedJobData?.company}</DialogTitle>
              </VisuallyHidden>
              {selectedJobData && (
                <>
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-800/80 hover:bg-gray-700/80 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-[85vh]">
                  {/* Selected Job Card - Left Side */}
                  <ScrollArea className="p-6 border-r border-white/10 job-modal-scroll">
                    <div>
                      {/* Company and Save */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{selectedJobData.companyLogo}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white text-lg">{selectedJobData.company}</p>
                            <p className="text-gray-400 text-sm">
                              {typeof selectedJobData.postedDays === 'string' ? selectedJobData.postedDays : `${selectedJobData.postedDays} days ago`}
                            </p>
                          </div>
                        </div>
                        
                        
                      </div>

                      {/* Job Title */}
                      <h2 className="text-2xl font-bold text-white mb-4">
                        {selectedJobData.title}
                      </h2>

                      {/* Job Details */}
                      <div className="space-y-3 mb-6">
                        {/* Industry */}
                        {selectedJobData.industry && (
                          <div className="flex items-center text-gray-300">
                            <Target className="w-5 h-5 mr-3 text-orange-400" />
                            <div>
                              <span className="text-xs text-gray-400">Industry:</span>
                              <span className="ml-2 font-medium text-base">{selectedJobData.industry}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Department */}
                        {selectedJobData.department && (
                          <div className="flex items-center text-gray-300">
                            <FileText className="w-5 h-5 mr-3 text-cyan-400" />
                            <div>
                              <span className="text-xs text-gray-400">Department:</span>
                              <span className="ml-2 font-medium text-base">{selectedJobData.department}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Applicants */}
                        <div className="flex items-center text-gray-300">
                          <span className="text-xs">Applicants:</span>
                          <span className="ml-2 font-medium text-sm">{(selectedJobDetails?.applicants ?? 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Match Percentage */}
                      <div className="mb-4">
                        {!user?.id ? (
                          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 px-3 py-1 text-sm">
                            Sign in to see match
                          </Badge>
                        ) : isLoadingMatches ? (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1 text-sm animate-pulse">
                            AI Analyzing...
                          </Badge>
                        ) : matchScores[selectedJobData.id] !== undefined ? (
                          matchScores[selectedJobData.id].error ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1 text-sm">
                              AI Failed
                            </Badge>
                          ) : (
                                                         <Badge className={`${getMatchColor(matchScores[selectedJobData.id].score)} px-3 py-1 text-sm`}>
                               {getMatchLabel(matchScores[selectedJobData.id].score)}
                             </Badge>
                          )
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 px-3 py-1 text-sm">
                            No match data
                          </Badge>
                        )}
                      </div>

                      {/* AI Match Analysis */}
                      {user?.id && matchScores[selectedJobData.id] && !isLoadingMatches && (
                        <div className="mb-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-white/10 overflow-hidden">
                          {/* Header - Clickable Dropdown */}
                          <button
                            onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                            className="w-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-4 py-3 border-b border-white/10 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
                                  <Target className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-base font-bold text-white">
                                    {matchScores[selectedJobData.id].error ? 'AI Analysis Error' : 'AI Match Analysis'}
                                  </h3>
                                  <p className="text-xs text-gray-300">
                                    {matchScores[selectedJobData.id].error ? 'Unable to analyze match' : 'Detailed compatibility assessment'}
                                  </p>
                                </div>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showAIAnalysis ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {/* Collapsible Content */}
                          {showAIAnalysis && (
                            <div className="p-4 max-h-96 overflow-y-auto job-modal-scroll">
                            {matchScores[selectedJobData.id].error ? (
                              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <X className="w-3 h-3 text-red-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-red-400 font-semibold mb-2">Analysis Failed</h4>
                                    <p className="text-red-300 text-sm mb-3">Failed to analyze job match. This could be due to:</p>
                                    <ul className="text-red-300 text-sm space-y-1 mb-3">
                                      <li>• Missing API configuration</li>
                                      <li>• Insufficient user or job data</li>
                                      <li>• API rate limiting</li>
                                      <li>• Network connectivity issues</li>
                                    </ul>
                                    <div className="bg-red-500/5 border border-red-500/20 rounded p-2">
                                      <p className="text-xs text-red-400 font-mono">
                                        Error: {matchScores[selectedJobData.id].reasoning}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Match Breakdown */}
                                {matchScores[selectedJobData.id].breakdown && Object.keys(matchScores[selectedJobData.id].breakdown).length > 0 && (
                                  <div>
                                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full shadow-lg shadow-purple-400/20"></div>
                                      Match Breakdown
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {Object.entries(matchScores[selectedJobData.id].breakdown).map(([key, value]) => {
                                        const score = Math.round(Number(value));
                                        const getScoreColor = (score: number) => {
                                          if (score >= 90) return 'text-emerald-400';
                                          if (score >= 80) return 'text-green-400';
                                          if (score >= 70) return 'text-blue-400';
                                          if (score >= 60) return 'text-yellow-400';
                                          if (score >= 50) return 'text-orange-400';
                                          return 'text-red-400';
                                        };
                                        
                                        const getScoreBg = (score: number) => {
                                          if (score >= 90) return 'bg-emerald-500/20 border-emerald-500/30';
                                          if (score >= 80) return 'bg-green-500/20 border-green-500/30';
                                          if (score >= 70) return 'bg-blue-500/20 border-blue-500/30';
                                          if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
                                          if (score >= 50) return 'bg-orange-500/20 border-orange-500/30';
                                          return 'bg-red-500/20 border-red-500/30';
                                        };

                                        const getFactorIcon = (key: string) => {
                                          if (key.includes('skills')) return <Star className="w-4 h-4" />;
                                          if (key.includes('experience')) return <Clock className="w-4 h-4" />;
                                          if (key.includes('career')) return <Target className="w-4 h-4" />;
                                          if (key.includes('salary')) return <DollarSign className="w-4 h-4" />;
                                          if (key.includes('work') || key.includes('setup')) return <Building2 className="w-4 h-4" />;
                                          if (key.includes('location')) return <MapPin className="w-4 h-4" />;
                                          if (key.includes('industry')) return <FileText className="w-4 h-4" />;
                                          if (key.includes('shift')) return <Clock className="w-4 h-4" />;
                                          if (key.includes('cultural')) return <Users className="w-4 h-4" />;
                                          return <CheckCircle className="w-4 h-4" />;
                                        };

                                        return (
                                          <div key={key} className={`${getScoreBg(score)} border rounded-md p-3 transition-all hover:scale-105`}>
                                            <div className="flex items-center justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <div className="text-gray-300">
                                                  {getFactorIcon(key)}
                                                </div>
                                                <span className="text-xs font-medium text-gray-200 capitalize">
                                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                              </div>
                                              <div className={`text-sm font-bold ${getScoreColor(score)}`}>
                                                {score}%
                                              </div>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                                              <div 
                                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                                  score >= 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                                                  score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                                  score >= 70 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                                                  score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                                  score >= 50 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                                                  'bg-gradient-to-r from-red-400 to-red-500'
                                                }`}
                                                style={{ width: `${score}%` }}
                                              ></div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                
                                {/* AI Reasoning */}
                                {matchScores[selectedJobData.id].reasoning && (
                                  <div>
                                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg shadow-cyan-400/20"></div>
                                      AI Insights
                                    </h4>
                                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-md p-3 border border-white/10">
                                      <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-cyan-500/20">
                                          <Target className="w-3 h-3 text-cyan-300" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm">
                                            {matchScores[selectedJobData.id].reasoning}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            </div>
                          )}
                        </div>
                      )}

                                              {/* Apply Button */}
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 focus:border-0 focus:ring-0 text-base py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={Boolean(
                            !!appliedMap[selectedJobData.id] || 
                            (user?.id && matchScores[selectedJobData.id]?.score !== undefined && matchScores[selectedJobData.id].score < 65)
                          )}
                          onClick={async () => {
                          try {
                            if (!user) { triggerHeaderSignUp(); return }
                            const token = await getSessionToken()
                            if (!token) { triggerHeaderSignUp(); return }
                            const chk = await fetch('/api/user/saved-resumes', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
                            const j = await chk.json()
                            if (!chk.ok || !j?.hasSavedResume) { 
                              setApplicationMessage('You must have a resume first before applying');
                              setApplicationType('info');
                              setShowApplicationDialog(true);
                              router.push('/resume-builder')
                              return 
                            }
                            const resp = await fetch('/api/user/applications', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ jobId: selectedJobData.originalId, resumeId: j.id || j.resumeId, resumeSlug: j.resumeSlug })
                            })
                            if (!resp.ok) throw new Error('Failed to submit application')
                            // Update local state to reflect application before redirect
                            setAppliedMap(prev => ({ ...prev, [selectedJobData.id]: true }));
                            setSelectedJob(null);
                            setSelectedJobDetails(null);
                            router.push('/jobs/job-matching?application=success');
                            return;
                          } catch (err) {
                            console.error(err)
                            setApplicationMessage('Could not apply. Please try again.');
                            setApplicationType('error');
                            setShowApplicationDialog(true);
                          }
                        }}
                                                >
                                                         {!!appliedMap[selectedJobData.id] 
                               ? 'Already Applied' 
                               : (user?.id && matchScores[selectedJobData.id]?.score !== undefined && matchScores[selectedJobData.id].score < 65)
                                 ? 'Not Recommended'
                                 : 'Apply now'
                             }
                          </Button>
                    </div>
                  </ScrollArea>

                  {/* Job Details - Right Side */}
                  <div className="p-4 job-modal-scroll overflow-y-auto h-full">
                    <div className="space-y-4 pb-4">
                      {/* Job Description */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="flex items-center gap-2 text-white text-lg font-semibold mb-3">
                          <FileText className="h-5 w-5 text-cyan-400" />
                          Job Description
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{selectedJobDetails?.description || selectedJobData.description}</p>
                      </div>

                      {/* Responsibilities */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="flex items-center gap-2 text-white text-lg font-semibold mb-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          Responsibilities
                        </h3>
                          <ul className="space-y-2">
                            {Array.isArray(selectedJobDetails?.responsibilities) && selectedJobDetails.responsibilities.length > 0
                              ? selectedJobDetails.responsibilities.map((responsibility: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm">{responsibility}</span>
                                  </li>
                                ))
                              : (selectedJobData.responsibilities || []).map((responsibility: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm">{responsibility}</span>
                                  </li>
                                ))}
                          </ul>
                      </div>

                      {/* Qualifications */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="flex items-center gap-2 text-white text-lg font-semibold mb-3">
                          <Star className="h-5 w-5 text-yellow-400" />
                          Qualifications & Requirements
                        </h3>
                          <ul className="space-y-2">
                            {Array.isArray(selectedJobDetails?.requirements) && selectedJobDetails.requirements.length > 0
                              ? selectedJobDetails.requirements.map((qualification: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm">{qualification}</span>
                                  </li>
                                ))
                              : (selectedJobData.qualifications || []).map((qualification: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm">{qualification}</span>
                                  </li>
                                ))}
                          </ul>
                      </div>

                      {/* Perks & Benefits */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="flex items-center gap-2 text-white text-lg font-semibold mb-3">
                          <Gift className="h-5 w-5 text-pink-400" />
                          Perks & Benefits
                        </h3>
                          <ul className="space-y-2">
                            {Array.isArray(selectedJobDetails?.benefits) && selectedJobDetails.benefits.length > 0
                              ? selectedJobDetails.benefits.map((perk: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm">{perk}</span>
                                  </li>
                                ))
                              : (selectedJobData.perks || []).map((perk: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm">{perk}</span>
                                  </li>
                                ))}
                          </ul>
                      </div>
                    </div>
                  </div>
                </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Auth handled by Header via URL search param (?signup=true) */}
        </div>
      </div>

      {/* Application Status Alert Dialog */}
      <AlertDialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {applicationType === 'success' ? 'Application Submitted!' : 
               applicationType === 'error' ? 'Application Error' : 'Information'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {applicationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowApplicationDialog(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resume Required Modal */}
      <Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold flex items-center gap-3">
              <FileText className="h-6 w-6 text-cyan-400" />
              Resume Required
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-3">
              To get personalized job matches and apply to positions, you need to create your resume first.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Why you need a resume:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Get AI-powered job matching</li>
                <li>• Apply to positions with one click</li>
                <li>• Showcase your skills and experience</li>
                <li>• Stand out to employers</li>
              </ul>
            </div>
            
                         <div className="flex gap-3">
               <Button 
                 onClick={() => router.push('/resume-builder')}
                 className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
               >
                 <FileText className="w-4 h-4 mr-2" />
                 Build Resume
               </Button>
               <Button 
                 variant="outline"
                 onClick={() => router.push('/')}
                 className="border-white/20 text-white hover:bg-white/10"
               >
                 Go Home
               </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* AI Analysis Loading Modal */}
      {isLoadingMatches && hasResume && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-lg w-full mx-4">
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Job Matches...</h3>
                <p className="text-gray-400 text-sm">This usually takes about 1-2 minutes. We'll keep you updated with each step.</p>
              </div>
              
              {/* Pacman Loader */}
              <div className="flex justify-center py-4">
                <PacmanLoader 
                  color="#fbbf24" 
                  size={40}
                  margin={4}
                  speedMultiplier={1.2}
                />
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-white">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Analysis Steps */}
              <div className="space-y-2">
                <span className="text-sm text-gray-400">Analysis Steps</span>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${analysisProgress > 0 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span>Profile analysis initialized</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${analysisProgress > 25 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span>Job compatibility scanning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${analysisProgress > 50 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span>Skills matching analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${analysisProgress > 75 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span>Experience evaluation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${analysisProgress === 100 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span>Finalizing results</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Application Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              Application Sent Successfully!
            </DialogTitle>
            <DialogDescription className="text-white mt-2">
              Your application has been submitted and is now being reviewed by the employer. You'll be notified about any updates.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/applications');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              View My Applications
            </Button>
            <Button
              onClick={() => setShowSuccessModal(false)}
              variant="outline"
              className="w-full"
            >
              Continue Browsing Jobs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function JobMatchingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen cyber-grid overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading job matching...</p>
        </div>
      </div>
    }>
      <JobMatchingContent />
    </Suspense>
  );
} 