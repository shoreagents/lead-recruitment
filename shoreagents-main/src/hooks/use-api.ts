import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeeCardData } from '@/types/api';

// Types
interface UserFormStatus {
  hasFilledForm: boolean;
  userExists: boolean;
  company: string | null;
  industry: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  user_id: string;
}

interface AnonymousUserData {
  user_id: string;
  industry: string;
  company?: string;
}

interface AutocompleteData {
  query: string;
  user_id: string;
  type?: string;
  industry?: string;
  roleTitle?: string;
  generateAnother?: boolean;
  generationCount?: number;
}

export interface AISuggestion {
  title: string;
  description: string;
  level: string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  country: string;
}

interface CheckEmailData {
  email: string;
}

interface InterviewRequestData {
  candidate_id: string;
  candidate_name: string;
  candidate_position: string;
  candidate_avatar_url: string;
  message: string;
}

interface DeleteQuotationData {
  quoteId: string;
}

interface PricingProgressData {
  step: number;
  data: any;
  user_id: string;
  quote_id?: string;
}

// API Functions
const fetchUserFormStatus = async (userId: string): Promise<UserFormStatus> => {
  const response = await fetch(`/api/check-user-form-status?user_id=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user form status');
  }
  return response.json();
};

const submitContactForm = async (data: ContactFormData): Promise<unknown> => {
  const response = await fetch('/api/contact-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit contact form');
  }
  
  return response.json();
};

const submitAnonymousUserData = async (data: AnonymousUserData): Promise<unknown> => {
  const response = await fetch('/api/anonymous-user-inquiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit anonymous user data');
  }
  
  return response.json();
};

const fetchAutocompleteSuggestions = async (data: AutocompleteData): Promise<AISuggestion[] | string> => {
  const response = await fetch('/api/autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: data.query,
      user_id: data.user_id,
      type: data.type || 'role', // Default to 'role' type
      industry: data.industry,
      roleTitle: data.roleTitle,
      generateAnother: data.generateAnother,
      generationCount: data.generationCount
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch autocomplete suggestions');
  }
  
  const result = await response.json();
  
  // For description type, return the string directly
  if (data.type === 'description') {
    return result;
  }
  
  // For other types, return the suggestions array
  return result;
};

const checkEmailExists = async (data: CheckEmailData): Promise<{ exists: boolean }> => {
  const response = await fetch('/api/auth/check-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to check email');
  }
  
  return response.json();
};

const signupUser = async (data: SignupData): Promise<unknown> => {
  const response = await fetch('/api/auth/signup-simple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create account');
  }
  
  return response.json();
};

const submitInterviewRequest = async (data: InterviewRequestData): Promise<unknown> => {
  const response = await fetch('/api/interview-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit interview request');
  }
  
  return response.json();
};

const deleteQuotation = async (data: DeleteQuotationData): Promise<unknown> => {
  const response = await fetch(`/api/pricing-quotes/${data.quoteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete quotation');
  }
  
  return response.json();
};

const savePricingProgress = async (data: PricingProgressData): Promise<unknown> => {
  console.log('🚀 TanStack Query: Calling savePricingProgress with:', data);
  
  const response = await fetch('/api/pricing-progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  console.log('📡 TanStack Query: API response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('❌ TanStack Query: API error response:', errorData);
    throw new Error(`Failed to save pricing progress: ${errorData.error || 'Unknown error'}`);
  }
  
  const result = await response.json();
  console.log('✅ TanStack Query: API success response:', result);
  return result;
};

// Custom Hooks
export const useUserFormStatus = (userId: string) => {
  return useQuery({
    queryKey: ['userFormStatus', userId],
    queryFn: () => fetchUserFormStatus(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContactFormMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data, variables) => {
      // Invalidate and refetch user form status
      queryClient.invalidateQueries({ 
        queryKey: ['userFormStatus', variables.user_id] 
      });
    },
  });
};

export const useAnonymousUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitAnonymousUserData,
    onSuccess: (data, variables) => {
      // Invalidate and refetch user form status
      queryClient.invalidateQueries({ 
        queryKey: ['userFormStatus', variables.user_id] 
      });
    },
  });
};

export const useAutocompleteSuggestions = (
  query: string, 
  userId: string, 
  enabled: boolean = true,
  type: string = 'role',
  industry?: string,
  roleTitle?: string,
  generateAnother?: boolean,
  generationCount?: number
) => {
  return useQuery<AISuggestion[] | string>({
    queryKey: ['autocomplete', query, userId, type, industry, roleTitle, generateAnother, generationCount],
    queryFn: () => fetchAutocompleteSuggestions({ 
      query, 
      user_id: userId,
      type,
      industry,
      roleTitle,
      generateAnother,
      generationCount
    }),
    enabled: enabled && query.length >= 2, // Only fetch if query is 2 or more characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    retry: 1, // Only retry once on failure
    retryDelay: 2000, // Wait 2 seconds before retry
  });
};

export const useCheckEmailMutation = () => {
  return useMutation({
    mutationFn: checkEmailExists,
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};

export const useInterviewRequestMutation = () => {
  return useMutation({
    mutationFn: submitInterviewRequest,
  });
};

export const useDeleteQuotationMutation = () => {
  return useMutation({
    mutationFn: deleteQuotation,
  });
};

// BPOC Employee Data Hooks
interface BPOCUser {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  location: string;
  avatar_url: string | null;
  bio: string | null;
  position: string | null;
  current_position: string | null;
  work_status: string | null;
  expected_salary: string | null;
  user_created_at: string;
  overall_score: number | null;
  skills_snapshot: string[];
  experience_snapshot: unknown;
  key_strengths: string[];
  improvements: string[];
  recommendations: string[];
  improved_summary: string | null;
  strengths_analysis: Record<string, unknown> | null;
}

const fetchBPOCEmployeeData = async (): Promise<BPOCUser[]> => {
  // Fetch data from API route (server-side database access)
  const response = await fetch('/api/bpoc-users');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(`API error: ${result.error || 'Unknown error'}`);
  }
  
  const bpocUsers = result.data;
  
  // Convert to BPOCUser format
  return bpocUsers.map((user: any) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name,
    location: user.location,
    avatar_url: user.avatar_url,
    bio: user.bio,
    position: user.position,
    current_position: user.current_position,
    work_status: user.work_status,
    expected_salary: user.expected_salary,
    user_created_at: user.user_created_at,
    overall_score: user.overall_score,
    skills_snapshot: user.skills_snapshot || [],
    experience_snapshot: user.experience_snapshot,
    key_strengths: user.key_strengths || [],
    improvements: user.improvements || [],
    recommendations: user.recommendations || [],
    improved_summary: user.improved_summary,
    strengths_analysis: user.strengths_analysis
  }));
};

export const useBPOCEmployeeData = () => {
  return useQuery({
    queryKey: ['bpoc-employees'],
    queryFn: fetchBPOCEmployeeData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch on component mount
  });
};

export const useBPOCEmployeeById = (employeeId: string) => {
  return useQuery<BPOCUser>({
    queryKey: ['bpoc-employee', employeeId],
    queryFn: async () => {
      const employees = await fetchBPOCEmployeeData();
      const employee = employees.find(emp => emp.user_id === employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

// Employee Card Data Hook for Talent Pool - Now using BPOC database via API
const fetchEmployeeCardData = async (): Promise<EmployeeCardData[]> => {
  // Fetch data from API route (server-side database access)
  const response = await fetch('/api/bpoc-users');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(`API error: ${result.error || 'Unknown error'}`);
  }
  
  const bpocUsers = result.data;
  
  // Convert BPOC database data to EmployeeCardData format
  return bpocUsers.map((bpocUser: any) => {
    const candidateProfile = bpocUser.candidate_profile as Record<string, unknown>;
    const email = candidateProfile?.email as string || '';

    return {
      user: {
        id: bpocUser.user_id,
        name: bpocUser.first_name,
        email: email,
        position: bpocUser.position || bpocUser.current_position || '',
        location: bpocUser.location,
        avatar: bpocUser.avatar_url,
        bio: bpocUser.bio,
        work_status: bpocUser.work_status,
        created_at: bpocUser.user_created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        score: bpocUser.overall_score || 0,
        skills: bpocUser.skills_snapshot || [],
        experience: bpocUser.experience_snapshot ? 
          (Array.isArray(bpocUser.experience_snapshot) ? 
            bpocUser.experience_snapshot.length + ' years' : 
            'Experience available') : 
          'Experience not specified',
        expectedSalary: bpocUser.expected_salary ? 
          parseFloat(bpocUser.expected_salary.replace(/[^\d.]/g, '')) : 0,
        workStatus: bpocUser.work_status || 'Status not specified',
        joinedDate: bpocUser.user_created_at ? new Date(bpocUser.user_created_at).toISOString().split('T')[0] : '2023-01-01',
        tier: (bpocUser.overall_score || 0) >= 80 ? 'GOLD' : 
              (bpocUser.overall_score || 0) >= 60 ? 'SILVER' : 'BRONZE'
      },
      applications: [], // Empty array for now
      appliedJobs: [], // Empty array for now
      workStatus: {
        id: bpocUser.user_id || '',
        userId: bpocUser.user_id || '',
        currentEmployer: 'Not specified', // This field might not be in the database
        currentPosition: bpocUser.current_position || bpocUser.position || 'Not specified',
        workStatus: bpocUser.work_status || 'Not specified',
        preferredShift: 'Not specified',
        workSetup: 'Not specified',
        currentMood: 'Not specified',
        noticePeriodDays: 0,
        expectedSalary: bpocUser.expected_salary || '0',
        completed: bpocUser.work_status_completed || false,
        createdAt: bpocUser.user_created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      resume: undefined, // Will be fetched separately if needed
      aiAnalysis: undefined // Will be fetched separately if needed
    };
  });
};

export const useEmployeeCardData = () => {
  return useQuery<EmployeeCardData[]>({
    queryKey: ['employee-card-data'],
    queryFn: fetchEmployeeCardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

// BPOC Database Connection Test Hook
export const useBPOCDatabaseTest = () => {
  return useQuery({
    queryKey: ['bpoc-database-test'],
    queryFn: async () => {
      const response = await fetch('/api/test-bpoc-db');
      if (!response.ok) {
        throw new Error('Failed to test BPOC database connection');
      }
      const data = await response.json();
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePricingProgressMutation = () => {
  return useMutation({
    mutationFn: savePricingProgress,
  });
};

// Lead Management Hooks
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  priority: string;
  source: string;
  created: string;
  lastContact: string;
  notes: string;
  column: string;
  userType: string;
  userId: string;
  quoteCount: number;
  industry: string;
  firstLeadCapture: boolean;
  secondLeadCapture: boolean;
  thirdLeadCapture: boolean;
}

interface LeadsResponse {
  success: boolean;
  data: Lead[];
  total: number;
  stats: {
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    negotiation: number;
    closed: number;
  };
}

const fetchLeads = async (): Promise<LeadsResponse> => {
  const response = await fetch('/api/admin/leads');
  
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }
  
  return response.json();
};

const updateLeadStatus = async ({ leadId, column }: { leadId: string; column: string }): Promise<{ success: boolean; message: string }> => {
  const response = await fetch('/api/admin/leads', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ leadId, column }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update lead status');
  }
  
  return response.json();
};

export const useLeads = () => {
  return useQuery<LeadsResponse>({
    queryKey: ['leads'],
    queryFn: fetchLeads,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      // Invalidate and refetch leads data
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
