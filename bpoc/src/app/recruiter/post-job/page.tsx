'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  Plus,
  X,
  Users,
  Edit3,
  ChevronDown,
  Building2,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import RecruiterSignInModal from '@/components/auth/RecruiterSignInModal';
import RecruiterSignUpForm from '@/components/auth/RecruiterSignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';


interface CreateJobForm {
  job_title: string;
  job_description: string;
  industry: string;
  department: string;
  work_type: string;
  work_arrangement: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  salary_type: string;
  application_deadline: string;
  priority: string;
  shift: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  company: string;
  status?: string;
}

interface RequirementItem {
  id: string;
  text: string;
}

type JobListItem = {
  id: string;
  originalId: string;
  title: string;
  description: string;
  industry: string;
  department: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
  company: string;
  created_at?: string;
  work_type?: string;
  work_arrangement?: string;
  shift?: string;
  priority?: string;
  currency?: string;
  salary_type?: string;
  application_deadline?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
};

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '', 'new_request', 'active', 'inactive', 'closed'
  const [timeFilter, setTimeFilter] = useState<string>('all'); // 'all', 'latest', 'old'
  const [selectedJob, setSelectedJob] = useState<JobListItem | null>(null);
  const [showJobDetailModal, setShowJobDetailModal] = useState<boolean>(false);
  const [isEditingJob, setIsEditingJob] = useState<boolean>(false);
  const [editJobForm, setEditJobForm] = useState<CreateJobForm | null>(null);
  const [isUpdatingJob, setIsUpdatingJob] = useState<boolean>(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobListItem | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [showApplicantStatusDropdown, setShowApplicantStatusDropdown] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingApplicantStatus, setIsUpdatingApplicantStatus] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeletingJob, setIsDeletingJob] = useState(false);

  const [createJobForm, setCreateJobForm] = useState<CreateJobForm>({
    job_title: '',
    job_description: '',
    industry: '',
    department: '',
    work_type: 'full-time',
    work_arrangement: 'onsite',
    experience_level: 'entry-level',
    salary_min: 25000,
    salary_max: 35000,
    currency: 'PHP',
    salary_type: 'monthly',
    application_deadline: '',
    priority: 'medium',
    shift: 'day',
    requirements: [],
    responsibilities: [],
    benefits: [],
    skills: [],
    company: ''
  });

  const [requirementItems, setRequirementItems] = useState<RequirementItem[]>([]);
  const [responsibilityItems, setResponsibilityItems] = useState<RequirementItem[]>([]);
  const [benefitItems, setBenefitItems] = useState<RequirementItem[]>([]);
  const [skillItems, setSkillItems] = useState<RequirementItem[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!createJobForm.job_title.trim()) {
      errors.job_title = 'Job title is required';
    }
    if (!createJobForm.company.trim()) {
      errors.company = 'Company is required';
    }
    if (!createJobForm.industry.trim()) {
      errors.industry = 'Industry is required';
    }
    if (!createJobForm.department.trim()) {
      errors.department = 'Department is required';
    }
    if (!createJobForm.job_description.trim() || createJobForm.job_description.trim().length < 20) {
      errors.job_description = 'Job description is required (min 20 characters)';
    }
    if (!createJobForm.work_type) {
      errors.work_type = 'Work type is required';
    }
    if (!createJobForm.experience_level) {
      errors.experience_level = 'Experience level is required';
    }
    if (!createJobForm.work_arrangement) {
      errors.work_arrangement = 'Work arrangement is required';
    }
    if (!createJobForm.shift) {
      errors.shift = 'Shift is required';
    }
    if (!createJobForm.priority) {
      errors.priority = 'Priority is required';
    }
    if (!createJobForm.currency) {
      errors.currency = 'Currency is required';
    }
    if (!createJobForm.salary_type) {
      errors.salary_type = 'Salary type is required';
    }

    if (Number.isNaN(createJobForm.salary_min) || createJobForm.salary_min < 0) {
      errors.salary_min = 'Min salary must be a non-negative number';
    }
    if (Number.isNaN(createJobForm.salary_max) || createJobForm.salary_max < 0) {
      errors.salary_max = 'Max salary must be a non-negative number';
    }
    if (
      !Number.isNaN(createJobForm.salary_min) &&
      !Number.isNaN(createJobForm.salary_max) &&
      createJobForm.salary_max < createJobForm.salary_min
    ) {
      errors.salary_max = 'Max salary must be greater than or equal to min salary';
    }

    if (!createJobForm.application_deadline) {
      errors.application_deadline = 'Application deadline is required';
      } else {
      const d = new Date(createJobForm.application_deadline);
      if (isNaN(d.getTime())) {
        errors.application_deadline = 'Application deadline must be a valid date';
      }
    }

    if (requirementItems.length === 0 && !newRequirement.trim()) {
      errors.requirements = 'At least one requirement is required';
    }
    if (responsibilityItems.length === 0 && !newResponsibility.trim()) {
      errors.responsibilities = 'At least one responsibility is required';
    }
    if (benefitItems.length === 0 && !newBenefit.trim()) {
      errors.benefits = 'At least one benefit is required';
    }
    if (skillItems.length === 0 && !newSkill.trim()) {
      errors.skills = 'At least one skill is required';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, general: 'Please fix the errors below and try again.' }))
      return false;
    }
    return true;
  };

  useEffect(() => {
    const loadCompanyFromProfile = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(`/api/user/profile?userId=${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        const company = data?.user?.company || '';
        setCreateJobForm(prev => ({ ...prev, company }));
      } catch (_err) {
        // ignore
      }
    };
    loadCompanyFromProfile();
  }, [user?.id]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const res = await fetch('/api/recruiter/jobs', {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) {
        setJobs([]);
        return;
      }
      const data = await res.json();
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (_err) {
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStatusDropdown) {
        setShowStatusDropdown(null);
      }
      if (showApplicantStatusDropdown) {
        setShowApplicantStatusDropdown(null);
      }
    };

    if (showStatusDropdown || showApplicantStatusDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showStatusDropdown, showApplicantStatusDropdown]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Status filter
    if (statusFilter) {
      result = result.filter(j => j.status === statusFilter);
    }

    // Search term (title, description, company)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.description || '').toLowerCase().includes(q) ||
        (j.company || '').toLowerCase().includes(q)
      );
    }

    // Time filter
    if (timeFilter === 'latest') {
      result.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
    } else if (timeFilter === 'old') {
      result.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return da - db;
      });
    }

    return result;
  }, [jobs, statusFilter, searchTerm, timeFilter]);


  const handleCreateJob = async () => {
    setIsSubmitting(true);
    setFormErrors({});

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Include any in-progress textarea values so they are saved even if not Enter-added
      const requirements = [...requirementItems.map(item => item.text)];
      if (newRequirement.trim()) requirements.push(newRequirement.trim());

      const responsibilities = [...responsibilityItems.map(item => item.text)];
      if (newResponsibility.trim()) responsibilities.push(newResponsibility.trim());

      const benefits = [...benefitItems.map(item => item.text)];
      if (newBenefit.trim()) benefits.push(newBenefit.trim());

      const skills = [...skillItems.map(item => item.text)];
      if (newSkill.trim()) skills.push(newSkill.trim());

      const formData = {
        ...createJobForm,
        requirements,
        responsibilities,
        benefits,
        skills,
      };

      // Attach auth token via Authorization header so middleware can add x-user-id
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch('/api/recruiter/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('✅ Job request created successfully');
          // Reset form
        setCreateJobForm({
          job_title: '',
          job_description: '',
          industry: '',
          department: '',
          work_type: 'full-time',
          work_arrangement: 'onsite',
          experience_level: 'entry-level',
            salary_min: 25000,
            salary_max: 35000,
          currency: 'PHP',
          salary_type: 'monthly',
          application_deadline: '',
          priority: 'medium',
          shift: 'day',
          requirements: [],
          responsibilities: [],
          benefits: [],
            skills: [],
            company: ''
          });
          setRequirementItems([]);
          setResponsibilityItems([]);
          setBenefitItems([]);
          setSkillItems([]);
          setNewRequirement('');
          setNewResponsibility('');
          setNewBenefit('');
          setNewSkill('');
          // Refresh job list to show the newly created card
          await fetchJobs();
          setShowCreateJobModal(false);
        }
      } else {
        const errorData = await response.json();
        setFormErrors({ general: errorData.error || 'Failed to create job' });
        alert(`❌ Failed to create job: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setFormErrors({ general: 'Failed to create job' });
      alert('❌ Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToSignUp = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUpModal(false);
    setShowSignInModal(true);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const newItem = { id: Date.now().toString(), text: newRequirement.trim() };
      setRequirementItems([...requirementItems, newItem]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (id: string) => {
    setRequirementItems(requirementItems.filter(item => item.id !== id));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      const newItem = { id: Date.now().toString(), text: newResponsibility.trim() };
      setResponsibilityItems([...responsibilityItems, newItem]);
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (id: string) => {
    setResponsibilityItems(responsibilityItems.filter(item => item.id !== id));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      const newItem = { id: Date.now().toString(), text: newBenefit.trim() };
      setBenefitItems([...benefitItems, newItem]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (id: string) => {
    setBenefitItems(benefitItems.filter(item => item.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const newItem = { id: Date.now().toString(), text: newSkill.trim() };
      setSkillItems([...skillItems, newItem]);
      setNewSkill('');
    }
  };

  const removeSkill = (id: string) => {
    setSkillItems(skillItems.filter(item => item.id !== id));
  };

  const handleJobCardClick = (job: JobListItem) => {
    setSelectedJob(job);
    setShowJobDetailModal(true);
    setIsEditingJob(false);
  };

  const handleEditJob = () => {
    if (!selectedJob) return;
    
    // Convert JobListItem to CreateJobForm format
    setEditJobForm({
      job_title: selectedJob.title,
      job_description: selectedJob.description,
      industry: selectedJob.industry,
      department: selectedJob.department,
      work_type: selectedJob.work_type || 'full-time',
      work_arrangement: selectedJob.work_arrangement || 'onsite',
      experience_level: selectedJob.experienceLevel,
      salary_min: selectedJob.salaryMin,
      salary_max: selectedJob.salaryMax,
      currency: selectedJob.currency || 'PHP',
      salary_type: selectedJob.salary_type || 'monthly',
      application_deadline: selectedJob.application_deadline || '',
      priority: selectedJob.priority || 'medium',
      shift: selectedJob.shift || 'day',
      requirements: selectedJob.requirements || [],
      responsibilities: selectedJob.responsibilities || [],
      benefits: selectedJob.benefits || [],
      skills: selectedJob.skills || [],
      company: selectedJob.company,
      status: selectedJob.status
    });
    
    setIsEditingJob(true);
  };

  const handleUpdateJob = async () => {
    if (!selectedJob || !editJobForm) return;
    
    setIsUpdatingJob(true);
    setFormErrors({});

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(`/api/recruiter/jobs/${selectedJob.originalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(editJobForm),
      });

      if (response.ok) {
        setSuccessMessage('Job updated successfully');
        setShowSuccessDialog(true);
        setIsEditingJob(false);
        await fetchJobs(); // Refresh the job list
      } else {
        const errorData = await response.json();
        setFormErrors({ general: errorData.error || 'Failed to update job' });
        alert(`❌ Failed to update job: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setFormErrors({ general: 'Failed to update job' });
      alert('❌ Failed to update job. Please try again.');
    } finally {
      setIsUpdatingJob(false);
    }
  };

  const handleQuickStatusUpdate = async (jobId: string, newStatus: string) => {
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
        alert(`❌ Failed to update status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
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

  const handleViewApplicants = async (job: JobListItem) => {
    setSelectedJobForModal(job);
    setShowApplicantsModal(true);
    setLoadingApplicants(true);
    
    try {
      // Extract the original UUID from the combined job ID
      // job.id format: "recruiter_jobs_cdea4970-35c8-4d36-a6c9-2825e46ebb5e_0"
      // We need: "cdea4970-35c8-4d36-a6c9-2825e46ebb5e"
      const originalJobId = job.originalId || job.id.split('_').slice(1, -1).join('_');
      
      console.log('🔍 Original job ID:', originalJobId);
      
      const response = await fetch(`/api/recruiter/applicants?jobId=${originalJobId}`, {
        headers: {
          'x-user-id': user?.id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
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

  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    
    setIsDeletingJob(true);
    
    try {
      // Extract the original UUID from the combined job ID
      const originalJobId = selectedJob.originalId || selectedJob.id.split('_').slice(1, -1).join('_');
      
      console.log('🗑️ Deleting job with ID:', originalJobId);
      
      const response = await fetch(`/api/recruiter/jobs/${originalJobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || ''
        }
      });
      
      if (response.ok) {
        // Remove the job from the local state
        setJobs(prevJobs => prevJobs.filter(job => job.id !== selectedJob.id));
        
        // Close the modal and show success message
        setShowJobDetailModal(false);
        setShowDeleteDialog(false);
        setSelectedJob(null);
        
        setSuccessMessage('Job has been successfully deleted.');
        setShowSuccessDialog(true);
        
        console.log('✅ Job deleted successfully');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to delete job:', response.status, errorData);
        
        setSuccessMessage('Failed to delete job. Please try again.');
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setSuccessMessage('An error occurred while deleting the job. Please try again.');
      setShowSuccessDialog(true);
    } finally {
      setIsDeletingJob(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Request</h1>
              <p className="text-gray-600">Create and track your job requests</p>
            </div>
                   <Button 
                     onClick={() => setShowCreateJobModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 rounded-full transform hover:scale-105"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     New Request
                   </Button>
        </div>
      </div>

        {/* Status Legend */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">📋 Job Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400"></span>
              <div>
                <span className="font-medium text-amber-800">New Request</span>
                <p className="text-amber-700 text-xs">Not visible in BPOC jobs yet. You can still edit it.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <div>
                <span className="font-medium text-green-800">Active</span>
                <p className="text-green-700 text-xs">Job is live and visible in BPOC jobs.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-400"></span>
              <div>
                <span className="font-medium text-gray-800">Inactive</span>
                <p className="text-gray-700 text-xs">Job is on hold and not accepting applications.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              <div>
                <span className="font-medium text-red-800">Closed</span>
                <p className="text-red-700 text-xs">Job is fulfilled and no longer accepting applications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 sticky top-4 z-10 bg-white/90 backdrop-blur flex flex-col md:flex-row gap-3 md:items-center md:justify-between border border-gray-200 rounded-lg p-3 shadow-sm">
                <input
                  type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs (title, company, description)..."
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                   />
          <div className="flex gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
              <option value="">All statuses</option>
              <option value="new_request">New request</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="closed">Closed</option>
              </select>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All</option>
              <option value="latest">Latest jobs</option>
              <option value="old">Old jobs</option>
              </select>
        </div>
      </div>

        {/* Jobs List */}
        {loadingJobs ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading your jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {jobs.length === 0 && !searchTerm && !statusFilter && timeFilter === 'all' ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-600">Create your first job request to get started</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching jobs found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div 
                  key={job.id} 
                  className={`${cardColor} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-5`}
                  onClick={() => handleJobCardClick(job)}
                >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${job.status === 'new_request' ? 'bg-amber-50 text-amber-700 border-amber-200' : job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : job.status === 'inactive' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
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
                    </div>
                    
                    {/* Status Dropdown */}
                    {showStatusDropdown === job.id && (
                      <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusUpdate(job.originalId, 'new_request');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'new_request' ? 'bg-amber-50 text-amber-700' : 'text-gray-700'}`}
                        >
                          New Request
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusUpdate(job.originalId, 'active');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'}`}
                        >
                          Active
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusUpdate(job.originalId, 'inactive');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'inactive' ? 'bg-gray-50 text-gray-700' : 'text-gray-700'}`}
                        >
                          Inactive
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusUpdate(job.originalId, 'closed');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${job.status === 'closed' ? 'bg-red-50 text-red-700' : 'text-gray-700'}`}
                        >
                          Closed
                        </button>
                      </div>
                    )}
                  </div>
                    </div>
                <p className="text-sm text-gray-700 line-clamp-3 mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                  {job.industry && <span className="px-2 py-1 bg-gray-100 rounded-full">{job.industry}</span>}
                  {job.department && <span className="px-2 py-1 bg-gray-100 rounded-full">{job.department}</span>}
                  {job.experienceLevel && <span className="px-2 py-1 bg-gray-100 rounded-full">{job.experienceLevel}</span>}
                    </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>
                    {job.salaryMin && job.salaryMax ? (
                      <>₱{job.salaryMin.toLocaleString()} - ₱{job.salaryMax.toLocaleString()}</>
                    ) : (
                      'Salary not specified'
                    )}
                  </span>
                  {job.created_at && (
                    <span className="text-gray-500">{new Date(job.created_at).toLocaleDateString()}</span>
                  )}
                    </div>
                    </div>
              );
            })}
          </div>
        )}
      </div>

           {/* Create Job Modal */}
           <Dialog open={showCreateJobModal} onOpenChange={setShowCreateJobModal}>
        <DialogContent className="!max-w-none !w-[80vw] h-[85vh] max-h-[85vh] bg-white border-gray-300 text-gray-900 overflow-y-auto">
               <DialogHeader>
                 <DialogTitle className="text-2xl font-bold text-gray-900">Create New Job Request</DialogTitle>
            <DialogDescription>
              Fill out the details below to create a new job posting.
                 </DialogDescription>
               </DialogHeader>

               <div className="space-y-6">
            {formErrors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formErrors.general}
              </div>
            )}
            
            {/* Job Title and Company */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                     <input
                       type="text"
                       value={createJobForm.job_title}
                  onChange={(e) => setCreateJobForm({...createJobForm, job_title: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.job_title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                       placeholder="e.g., Customer Service Representative"
                     />
                    {formErrors.job_title && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.job_title}</p>
                    )}
                   </div>
              
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                    <input
                      type="text"
                  value={createJobForm.company}
                      onChange={(e) => setCreateJobForm({ ...createJobForm, company: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none ${formErrors.company ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Company"
                      readOnly
                    />
                    {formErrors.company && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.company}</p>
                    )}
                   </div>
            </div>

            {/* Industry and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                     <input
                       type="text"
                       value={createJobForm.industry}
                  onChange={(e) => setCreateJobForm({...createJobForm, industry: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.industry ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                       placeholder="e.g., BPO, Healthcare, Finance"
                     />
                    {formErrors.industry && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.industry}</p>
                    )}
                   </div>
              
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                     <input
                       type="text"
                       value={createJobForm.department}
                  onChange={(e) => setCreateJobForm({...createJobForm, department: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.department ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                       placeholder="e.g., Customer Support, Sales"
                     />
                    {formErrors.department && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.department}</p>
                    )}
                   </div>
            </div>

            {/* Work Type and Experience Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Type *</label>
                     <select
                       value={createJobForm.work_type}
                  onChange={(e) => setCreateJobForm({...createJobForm, work_type: e.target.value})}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.work_type ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
                    {formErrors.work_type && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.work_type}</p>
                    )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                <select
                  value={createJobForm.experience_level}
                  onChange={(e) => setCreateJobForm({...createJobForm, experience_level: e.target.value})}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.experience_level ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                >
                  <option value="entry-level">Entry Level</option>
                  <option value="mid-level">Mid Level</option>
                  <option value="senior-level">Senior Level</option>
                     </select>
                    {formErrors.experience_level && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.experience_level}</p>
                    )}
                   </div>
                 </div>

                 {/* Job Description */}
                 <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                   <textarea
                     value={createJobForm.job_description}
                onChange={(e) => setCreateJobForm({...createJobForm, job_description: e.target.value})}
                     rows={4}
                     className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.job_description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                     placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                   />
                 {formErrors.job_description && (
                   <p className="text-red-600 text-sm mt-1">{formErrors.job_description}</p>
                 )}
                 </div>

            {/* Work Arrangement, Shift, and Salary */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Arrangement *</label>
                     <select
                       value={createJobForm.work_arrangement}
                  onChange={(e) => setCreateJobForm({...createJobForm, work_arrangement: e.target.value})}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.work_arrangement ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                >
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                     </select>
                    {formErrors.work_arrangement && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.work_arrangement}</p>
                    )}
                   </div>
              
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift *</label>
                     <select
                  value={createJobForm.shift}
                  onChange={(e) => setCreateJobForm({...createJobForm, shift: e.target.value})}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.shift ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                >
                  <option value="day">Day Shift</option>
                  <option value="night">Night Shift</option>
                  <option value="both">Both</option>
                     </select>
                    {formErrors.shift && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.shift}</p>
                    )}
                   </div>
              
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                     <select
                  value={createJobForm.priority}
                  onChange={(e) => setCreateJobForm({...createJobForm, priority: e.target.value})}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.priority ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                     </select>
                    {formErrors.priority && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.priority}</p>
                    )}
                   </div>
                 </div>

                 {/* Salary Information */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary *</label>
                     <input
                       type="number"
                       value={createJobForm.salary_min}
                  onChange={(e) => setCreateJobForm({...createJobForm, salary_min: parseInt(e.target.value) || 0})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.salary_min ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                       placeholder="25000"
                     />
                    {formErrors.salary_min && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.salary_min}</p>
                    )}
                   </div>
              
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary *</label>
                     <input
                       type="number"
                       value={createJobForm.salary_max}
                  onChange={(e) => setCreateJobForm({...createJobForm, salary_max: parseInt(e.target.value) || 0})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.salary_max ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                       placeholder="35000"
                     />
                    {formErrors.salary_max && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.salary_max}</p>
                    )}
                   </div>
              
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                     <select
                       value={createJobForm.currency}
                  onChange={(e) => setCreateJobForm({...createJobForm, currency: e.target.value})}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.currency ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                     >
                  <option value="PHP">PHP</option>
                  <option value="USD">USD</option>
                     </select>
                    {formErrors.currency && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.currency}</p>
                    )}
                   </div>
              
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Type *</label>
                     <select
                       value={createJobForm.salary_type}
                  onChange={(e) => setCreateJobForm({...createJobForm, salary_type: e.target.value})}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.salary_type ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                >
                  <option value="monthly">Monthly</option>
                  <option value="hourly">Hourly</option>
                  <option value="yearly">Yearly</option>
                     </select>
                    {formErrors.salary_type && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.salary_type}</p>
                    )}
                   </div>
                 </div>

            {/* Application Deadline */}
                   <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
                     <input
                       type="date"
                value={createJobForm.application_deadline}
                onChange={(e) => setCreateJobForm({...createJobForm, application_deadline: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.application_deadline ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                     />
                    {formErrors.application_deadline && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.application_deadline}</p>
                    )}
                   </div>

            {/* Dynamic Lists */}
            <div className="space-y-6">
              {/* Requirements */}
                   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements *</label>
                {formErrors.requirements && (
                  <p className="text-red-600 text-sm mb-2">{formErrors.requirements}</p>
                )}
                <div className="flex gap-2 mb-3">
                  <textarea
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addRequirement();
                      }
                    }}
                    rows={3}
                    className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                    placeholder="Add requirements... (Enter to add, Shift+Enter for new line)"
                  />
                </div>
                <div className="space-y-2">
                  {requirementItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm">{item.text}</span>
                      <Button
                        type="button"
                        onClick={() => removeRequirement(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                   </div>
                 </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities *</label>
                {formErrors.responsibilities && (
                  <p className="text-red-600 text-sm mb-2">{formErrors.responsibilities}</p>
                )}
                <div className="flex gap-2 mb-3">
                  <textarea
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addResponsibility();
                      }
                    }}
                    rows={3}
                    className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                    placeholder="Add responsibilities... (Enter to add, Shift+Enter for new line)"
                  />
                </div>
                     <div className="space-y-2">
                  {responsibilityItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm">{item.text}</span>
                           <Button
                             type="button"
                        onClick={() => removeResponsibility(item.id)}
                        variant="ghost"
                             size="sm"
                             className="text-red-600 hover:text-red-700"
                           >
                        <X className="h-4 w-4" />
                           </Button>
                         </div>
                       ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits *</label>
                {formErrors.benefits && (
                  <p className="text-red-600 text-sm mb-2">{formErrors.benefits}</p>
                )}
                <div className="flex gap-2 mb-3">
                         <textarea
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                    rows={3}
                           className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                    placeholder="Add benefits... (Enter to add, Shift+Enter for new line)"
                  />
                </div>
                <div className="space-y-2">
                  {benefitItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm">{item.text}</span>
                         <Button
                           type="button"
                        onClick={() => removeBenefit(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                         </Button>
                       </div>
                  ))}
                     </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills *</label>
                {formErrors.skills && (
                  <p className="text-red-600 text-sm mb-2">{formErrors.skills}</p>
                )}
                <div className="flex gap-2 mb-3">
                  <textarea
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    rows={3}
                    className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                    placeholder="Add skills... (Enter to add, Shift+Enter for new line)"
                  />
                </div>
                <div className="space-y-2">
                  {skillItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm">{item.text}</span>
                      <Button
                        type="button"
                        onClick={() => removeSkill(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                   </div>
                 ))}
                </div>
              </div>
            </div>
               </div>

          <DialogFooter className="flex gap-3">
                 <Button 
                   variant="outline" 
                   onClick={() => setShowCreateJobModal(false)}
              disabled={isSubmitting}
                 >
                   Cancel
                 </Button>
                 <Button 
                   onClick={handleCreateJob}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                 >
              {isSubmitting ? 'Creating...' : 'Create Job Request'}
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

      {/* Job Detail Modal */}
      <Dialog open={showJobDetailModal} onOpenChange={setShowJobDetailModal}>
        <DialogContent className="!max-w-none !w-[80vw] max-h-[85vh] bg-white border-gray-300 text-gray-900 overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                {isEditingJob ? (
                  <input
                    type="text"
                    value={editJobForm?.job_title || ''}
                    onChange={(e) => setEditJobForm(prev => prev ? { ...prev, job_title: e.target.value } : null)}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600 w-full"
                    placeholder="Job Title"
                  />
                ) : (
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedJob?.title}
                </DialogTitle>
                )}
                <DialogDescription>
                  Job Details and Information
                </DialogDescription>
                   </div>
                   </div>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6">
                {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Company</label>
                    {isEditingJob ? (
                      <input
                        type="text"
                        value={editJobForm?.company || ''}
                        onChange={(e) => setEditJobForm(prev => prev ? { ...prev, company: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedJob.company}</p>
                    )}
                   </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Industry</label>
                    {isEditingJob ? (
                      <input
                        type="text"
                        value={editJobForm?.industry || ''}
                        onChange={(e) => setEditJobForm(prev => prev ? { ...prev, industry: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedJob.industry}</p>
                    )}
                   </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                    {isEditingJob ? (
                      <input
                        type="text"
                        value={editJobForm?.department || ''}
                        onChange={(e) => setEditJobForm(prev => prev ? { ...prev, department: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedJob.department}</p>
                    )}
                      </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Experience Level</label>
                    {isEditingJob ? (
                      <select
                        value={editJobForm?.experience_level || ''}
                        onChange={(e) => setEditJobForm(prev => prev ? { ...prev, experience_level: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="entry-level">Entry Level</option>
                        <option value="mid-level">Mid Level</option>
                        <option value="senior-level">Senior Level</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{selectedJob.experienceLevel}</p>
                    )}
                   </div>
                 </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                    {isEditingJob ? (
                      <select
                        value={editJobForm?.status || 'new_request'}
                        onChange={(e) => setEditJobForm(prev => prev ? { ...prev, status: e.target.value } : null)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="new_request">New Request</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        selectedJob.status === 'new_request' ? 'bg-amber-100 text-amber-800' :
                        selectedJob.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedJob.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedJob.status.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                   </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Salary Range</label>
                    {isEditingJob ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={editJobForm?.salary_min || ''}
                          onChange={(e) => setEditJobForm(prev => prev ? { ...prev, salary_min: parseInt(e.target.value) || 0 } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Min Salary"
                        />
                        <input
                          type="number"
                          value={editJobForm?.salary_max || ''}
                          onChange={(e) => setEditJobForm(prev => prev ? { ...prev, salary_max: parseInt(e.target.value) || 0 } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Max Salary"
                        />
                   </div>
                    ) : (
                      <p className="text-gray-900">
                        {selectedJob.salaryMin && selectedJob.salaryMax ? (
                          `₱${selectedJob.salaryMin.toLocaleString()} - ₱${selectedJob.salaryMax.toLocaleString()}`
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    )}
                   </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Created Date</label>
                    <p className="text-gray-900">
                      {selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : 'Not available'}
                    </p>
                    </div>
                      </div>
                    </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Description</label>
                {isEditingJob ? (
                  <textarea
                    value={editJobForm?.job_description || ''}
                    onChange={(e) => setEditJobForm(prev => prev ? { ...prev, job_description: e.target.value } : null)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedJob.description}</p>
                      </div>
                )}
                 </div>

              {/* Work Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Work Type</label>
                  {isEditingJob ? (
                    <select
                      value={editJobForm?.work_type || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { ...prev, work_type: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{selectedJob.work_type || 'Not specified'}</p>
                  )}
                   </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Work Arrangement</label>
                  {isEditingJob ? (
                    <select
                      value={editJobForm?.work_arrangement || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { ...prev, work_arrangement: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{selectedJob.work_arrangement || 'Not specified'}</p>
                  )}
                   </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Shift</label>
                  {isEditingJob ? (
                    <select
                      value={editJobForm?.shift || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { ...prev, shift: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="day">Day</option>
                      <option value="night">Night</option>
                      <option value="rotating">Rotating</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{selectedJob.shift || 'Not specified'}</p>
                  )}
                 </div>
                         </div>
                     
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                  {isEditingJob ? (
                    <select
                      value={editJobForm?.priority || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { ...prev, priority: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{selectedJob.priority || 'Not specified'}</p>
                  )}
                       </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Currency</label>
                  {isEditingJob ? (
                    <select
                      value={editJobForm?.currency || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { ...prev, currency: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="PHP">PHP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{selectedJob.currency || 'Not specified'}</p>
                  )}
                     </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Salary Type</label>
                  {isEditingJob ? (
                    <select
                      value={editJobForm?.salary_type || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { ...prev, salary_type: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{selectedJob.salary_type || 'Not specified'}</p>
                  )}
                   </div>
                    </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Application Deadline</label>
                {isEditingJob ? (
                  <input
                    type="date"
                    value={editJobForm?.application_deadline || ''}
                    onChange={(e) => setEditJobForm(prev => prev ? { ...prev, application_deadline: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {selectedJob.application_deadline ? new Date(selectedJob.application_deadline).toLocaleDateString() : 'Not specified'}
                  </p>
                )}
               </div>

                  {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Requirements</h3>
                {isEditingJob ? (
                  <div className="space-y-3">
                    <textarea
                      value={editJobForm?.requirements?.join('\n') || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { 
                        ...prev, 
                        requirements: e.target.value.split('\n').filter(item => item.trim() !== '') 
                      } : null)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter requirements (one per line)..."
                    />
                    <p className="text-sm text-gray-500">Enter each requirement on a new line</p>
                   </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedJob.requirements && selectedJob.requirements.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-600 mr-2">•</span>
                            <span className="text-gray-900">{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No requirements specified</p>
                    )}
                   </div>
                )}
                     </div>
                     
                  {/* Responsibilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h3>
                {isEditingJob ? (
                  <div className="space-y-3">
                    <textarea
                      value={editJobForm?.responsibilities?.join('\n') || ''}
                      onChange={(e) => setEditJobForm(prev => prev ? { 
                        ...prev, 
                        responsibilities: e.target.value.split('\n').filter(item => item.trim() !== '') 
                      } : null)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter responsibilities (one per line)..."
                    />
                    <p className="text-sm text-gray-500">Enter each responsibility on a new line</p>
                               </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedJob.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-600 mr-2">•</span>
                            <span className="text-gray-900">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No responsibilities specified</p>
                    )}
                        </div>
                )}
                </div>

              {/* Benefits and Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                  {isEditingJob ? (
                  <div className="space-y-3">
                      <textarea
                        value={editJobForm?.benefits?.join('\n') || ''}
                        onChange={(e) => setEditJobForm(prev => prev ? { 
                          ...prev, 
                          benefits: e.target.value.split('\n').filter(item => item.trim() !== '') 
                        } : null)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter benefits (one per line)..."
                      />
                      <p className="text-sm text-gray-500">Enter each benefit on a new line</p>
                                 </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedJob.benefits && selectedJob.benefits.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedJob.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-emerald-600 mr-2">•</span>
                              <span className="text-gray-900">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No benefits specified</p>
                      )}
                                     </div>
                  )}
                           </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                  {isEditingJob ? (
                  <div className="space-y-3">
                      <textarea
                        value={editJobForm?.skills?.join('\n') || ''}
                        onChange={(e) => setEditJobForm(prev => prev ? { 
                          ...prev, 
                          skills: e.target.value.split('\n').filter(item => item.trim() !== '') 
                        } : null)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter skills (one per line)..."
                      />
                      <p className="text-sm text-gray-500">Enter each skill on a new line</p>
                   </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedJob.skills && selectedJob.skills.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedJob.skills.map((skill, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-emerald-600 mr-2">•</span>
                              <span className="text-gray-900">{skill}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No skills specified</p>
                      )}
                    </div>
                  )}
                </div>
               </div>
               
          <DialogFooter>
            {isEditingJob ? (
              <div className="flex gap-3">
                 <Button 
                   variant="outline" 
                                     onClick={() => {
                    setIsEditingJob(false);
                    setEditJobForm(null);
                                     }}
                  disabled={isUpdatingJob}
                                   >
                  Cancel
                 </Button>
                <Button
                  onClick={handleUpdateJob}
                  disabled={isUpdatingJob}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isUpdatingJob ? 'Updating...' : 'Save Changes'}
                 </Button>
                     </div>
                   ) : (
              <div className="flex gap-2">
                {!isEditingJob && (
                  <>
                                   <Button
                                     variant="outline"
                      onClick={handleEditJob}
                      className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                    >
                      Edit Job
                                   </Button>
                                   <Button
                                     variant="outline"
                      onClick={() => selectedJob && handleViewApplicants(selectedJob)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      View Applicants
                                   </Button>
                                   <Button
                                     variant="outline"
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Job
                                   </Button>
                  </>
                )}
                                   <Button 
                                     variant="outline" 
                  onClick={() => setShowJobDetailModal(false)}
                >
                  Close
                                   </Button>
                     </div>
                   )}
          </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              Delete Job
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedJob?.title}"? This action cannot be undone and will permanently remove the job from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeletingJob}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteJob}
              disabled={isDeletingJob}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingJob ? 'Deleting...' : 'Delete Job'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}