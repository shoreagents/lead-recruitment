import { 
  User, 
  Application, 
  Job, 
  AIAnalysisResult, 
  ResumeGenerated, 
  ApiResponse,
  EmployeeCardData,
  WorkStatus,
  WorkStatusResponse
} from '@/types/api';
import { BPOCUser, BPOCApiResponse } from './bpocApiService';

// Updated to use the local BPOC database API route
export async function fetchAllUserData(): Promise<BPOCUser[]> {
  try {
    console.log('🔍 Fetching user data from local BPOC API...');
    
    const response = await fetch('/api/bpoc-users', {
      cache: 'no-store' // Always get fresh data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    const users = result.data;
    
    // Convert BPOCDatabaseUser to BPOCUser format for compatibility
    const convertedUsers: BPOCUser[] = users.map((user: any) => ({
      user_id: user.user_id,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      full_name: user.full_name,
      email: '', // Not available in database
      location: user.location || '',
      avatar_url: user.avatar_url,
      bio: user.bio,
      position: user.position || '',
      current_position: user.current_position || '',
      expected_salary: user.expected_salary || '',
      work_status: user.work_status || '',
      work_status_completed: user.work_status_completed || false,
      user_created_at: user.user_created_at || '',
      user_updated_at: '', // Not available in database
      analysis_id: null, // Not in database structure
      overall_score: user.overall_score || 0,
      ats_compatibility_score: 0, // Not in database
      content_quality_score: 0, // Not in database
      professional_presentation_score: 0, // Not in database
      skills_alignment_score: 0, // Not in database
      key_strengths: user.key_strengths || [],
      improvements: user.improvements || [],
      recommendations: user.recommendations || [],
      improved_summary: user.improved_summary || '',
      strengths_analysis: user.strengths_analysis || {},
      candidate_profile: user.candidate_profile || {},
      analysis_created_at: '', // Not in database
      analysis_updated_at: '', // Not in database
      skills_snapshot: user.skills_snapshot || [],
      experience_snapshot: user.experience_snapshot || []
    }));
    
    console.log('✅ Fetched all user data from API:', convertedUsers.length, 'users');
    return convertedUsers;
  } catch (error) {
    console.error('❌ Error fetching user data from API:', error);
    return [];
  }
}

// Legacy functions - now using the single endpoint
export async function fetchUsers(): Promise<User[]> {
  try {
    const bpocUsers = await fetchAllUserData();
    // Convert BPOCUser to User format for backward compatibility
    return bpocUsers.map(bpocUser => ({
      id: bpocUser.user_id,
      name: bpocUser.full_name,
      email: '', // Not available in BPOC data
      position: bpocUser.position || bpocUser.current_position || '',
      location: bpocUser.location,
      avatar: bpocUser.avatar_url,
      bio: bpocUser.bio,
      work_status: bpocUser.work_status,
      created_at: bpocUser.user_created_at,
      updated_at: bpocUser.user_updated_at
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function fetchApplications(): Promise<Application[]> {
  // Applications data is not available in the new single endpoint
  // Return empty array for now
  console.warn('Applications data not available in new API structure');
  return [];
}

export async function fetchJobs(): Promise<Job[]> {
  // Jobs data is not available in the new single endpoint
  // Return empty array for now
  console.warn('Jobs data not available in new API structure');
  return [];
}

export async function fetchAIAnalysisResults(): Promise<AIAnalysisResult[]> {
  try {
    const bpocUsers = await fetchAllUserData();
    // Convert BPOCUser analysis data to AIAnalysisResult format
    return bpocUsers
      .filter(user => user.analysis_id !== null)
      .map(user => ({
        id: user.analysis_id!,
        user_id: user.user_id,
        overall_score: user.overall_score || 0,
        ats_compatibility_score: user.ats_compatibility_score || 0,
        content_quality_score: user.content_quality_score || 0,
        professional_presentation_score: user.professional_presentation_score || 0,
        skills_alignment_score: user.skills_alignment_score || 0,
        key_strengths: user.key_strengths || [],
        improvements: user.improvements || [],
        recommendations: user.recommendations || [],
        created_at: user.analysis_created_at || '',
        updated_at: user.analysis_updated_at || ''
      }));
  } catch (error) {
    console.error('Error fetching AI analysis results:', error);
    return [];
  }
}

export async function fetchResumesGenerated(): Promise<ResumeGenerated[]> {
  // Resume data is not available in the new single endpoint
  // Return empty array for now
  console.warn('Resume data not available in new API structure');
  return [];
}

// Fetch resume for a specific user
export async function fetchUserResume(userId: string): Promise<ResumeGenerated | null> {
  try {
    console.log('🔍 Fetching resume for user:', userId);
    
    // Try different possible resume endpoints
    const possibleEndpoints = [
      `${API_BASE_URL}/user-data/${userId}/resume`,
      `${API_BASE_URL}/resume/${userId}`,
      `${API_BASE_URL}/user/${userId}/resume`,
      `${API_BASE_URL}/public/resume/${userId}`
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        console.log('🔄 Trying endpoint:', endpoint);
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Resume found at:', endpoint);
          return data;
        }
      } catch (error) {
        console.log('❌ Endpoint failed:', endpoint, error);
        continue;
      }
    }

    // If no resume endpoint works, try to get resume data from the user data
    const userData = await fetchAllUserData();
    const user = userData.find(u => u.user_id === userId);
    
    if (user && user.analysis_id) {
      // Create a mock resume from the analysis data
      const mockResume: ResumeGenerated = {
        id: user.analysis_id,
        user_id: userId,
        original_resume_id: null,
        template_used: 'ai-generated',
        generation_metadata: {
          userAgent: 'ShoreAgents-TalentCard',
          templateUsed: 'ai-generated',
          generationTimestamp: new Date().toISOString(),
          originalResumeData: {
            name: user.full_name,
            email: (user.candidate_profile as Record<string, unknown>)?.email as string || '',
            phone: (user.candidate_profile as Record<string, unknown>)?.phone as string || '',
            skills: user.skills_snapshot || [],
            summary: user.improved_summary || user.bio || 'No resume content available',
            education: user.education_snapshot || [],
            experience: user.experience_snapshot || []
          }
        },
        created_at: user.analysis_created_at || user.user_created_at
      };
      
      console.log('📄 Created mock resume from analysis data');
      return mockResume;
    }

    console.warn('⚠️ No resume data found for user:', userId);
    return null;
  } catch (error) {
    console.error('❌ Error fetching resume for user:', userId, error);
    return null;
  }
}

export async function fetchWorkStatus(): Promise<WorkStatus[]> {
  try {
    const bpocUsers = await fetchAllUserData();
    // Convert BPOCUser work status data to WorkStatus format
    return bpocUsers
      .filter(user => user.work_status_id !== null)
      .map(user => ({
        id: user.work_status_id!,
        userId: user.user_id,
        currentEmployer: user.current_employer || '',
        currentPosition: user.current_position || '',
        workStatus: user.work_status || '',
        preferredShift: user.preferred_shift || '',
        workSetup: user.work_setup || '',
        currentMood: user.current_mood || '',
        noticePeriodDays: user.notice_period_days || 0,
        expectedSalary: user.expected_salary || '',
        completed: user.work_status_completed || false,
        createdAt: user.work_status_created_at || '',
        updatedAt: user.work_status_updated_at || ''
      }));
  } catch (error) {
    console.error('Error fetching work status:', error);
    return [];
  }
}

export async function getEmployeeCardData(): Promise<EmployeeCardData[]> {
  try {
    // Use the single endpoint to get all data
    const bpocUsers = await fetchAllUserData();
    
    console.log('🔄 Converting BPOC data to EmployeeCardData format...');
    
    // Convert BPOCUser data to EmployeeCardData format
    return bpocUsers.map(bpocUser => {
      // Extract email from candidate_profile if available
      const candidateProfile = bpocUser.candidate_profile as Record<string, unknown>;
      const email = candidateProfile?.email as string || '';

      const user: User = {
        id: bpocUser.user_id,
        name: bpocUser.first_name,
        email: email,
        position: bpocUser.position || bpocUser.current_position || '',
        location: bpocUser.location,
        avatar: bpocUser.avatar_url,
        bio: bpocUser.bio,
        work_status: bpocUser.work_status,
        created_at: bpocUser.user_created_at,
        updated_at: bpocUser.user_updated_at
      };

      const aiAnalysis: AIAnalysisResult | undefined = bpocUser.analysis_id ? {
        id: bpocUser.analysis_id,
        user_id: bpocUser.user_id,
        overall_score: bpocUser.overall_score || 0,
        ats_compatibility_score: bpocUser.ats_compatibility_score || 0,
        content_quality_score: bpocUser.content_quality_score || 0,
        professional_presentation_score: bpocUser.professional_presentation_score || 0,
        skills_alignment_score: bpocUser.skills_alignment_score || 0,
        key_strengths: bpocUser.key_strengths || [],
        improvements: bpocUser.improvements || [],
        recommendations: bpocUser.recommendations || [],
        created_at: bpocUser.analysis_created_at || '',
        updated_at: bpocUser.analysis_updated_at || ''
      } : undefined;

      const workStatus: WorkStatus | undefined = bpocUser.work_status_id ? {
        id: bpocUser.work_status_id,
        userId: bpocUser.user_id,
        currentEmployer: bpocUser.current_employer || '',
        currentPosition: bpocUser.current_position || '',
        workStatus: bpocUser.work_status || '',
        preferredShift: bpocUser.preferred_shift || '',
        workSetup: bpocUser.work_setup || '',
        currentMood: bpocUser.current_mood || '',
        noticePeriodDays: bpocUser.notice_period_days || 0,
        expectedSalary: bpocUser.expected_salary || '',
        completed: bpocUser.work_status_completed || false,
        createdAt: bpocUser.work_status_created_at || '',
        updatedAt: bpocUser.work_status_updated_at || ''
      } : undefined;

      return {
        user,
        applications: [], // Not available in new API structure
        appliedJobs: [], // Not available in new API structure
        aiAnalysis,
        resume: undefined, // Resume data not available in current API structure
        workStatus
      };
    });
  } catch (error) {
    console.error('Error fetching employee card data:', error);
    return [];
  }
}

// Currency API service using Open Exchange Rates
export const currencyApi = {
  // Open Exchange Rates API with your API key
  async fetchRatesPrimary(): Promise<Record<string, number> | null> {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY || '6df09f6a1ad74d29a741d8a8ab06112f';
      console.log('Using API key:', API_KEY ? 'API key found' : 'No API key found');
      console.log('Making request to Open Exchange Rates API...');
      const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Open Exchange Rates API failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Validate the response structure
      if (!data.rates || typeof data.rates !== 'object') {
        throw new Error('Invalid response format from Open Exchange Rates API');
      }
      
      console.log('Open Exchange Rates API response:', {
        timestamp: data.timestamp,
        base: data.base,
        ratesCount: Object.keys(data.rates).length,
        sampleRates: {
          USD: data.rates.USD,
          AUD: data.rates.AUD,
          CAD: data.rates.CAD,
          GBP: data.rates.GBP,
          NZD: data.rates.NZD,
          EUR: data.rates.EUR,
          PHP: data.rates.PHP
        }
      });
      
      return data.rates || null;
    } catch (error) {
      console.warn('Open Exchange Rates API failed:', error);
      return null;
    }
  },

  // Fallback API - ExchangeRate-API (free tier)
  async fetchRatesFallback(): Promise<Record<string, number> | null> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) throw new Error('Fallback API failed');
      
      const data = await response.json();
      return data.rates || null;
    } catch (error) {
      console.warn('Fallback currency API failed:', error);
      return null;
    }
  },

  // Get rates with fallback strategy
  async getExchangeRates(): Promise<Record<string, number> | null> {
    try {
      // Try Open Exchange Rates API first
      const primaryRates = await this.fetchRatesPrimary();
      if (primaryRates) {
        console.log('✅ Primary currency API successful');
        return primaryRates;
      }

      // Try fallback API
      const fallbackRates = await this.fetchRatesFallback();
      if (fallbackRates) {
        console.log('✅ Fallback currency API successful');
        return fallbackRates;
      }

      // Return null if both fail
      console.warn('⚠️ All currency APIs failed, using static rates');
      return null;
    } catch (error) {
      console.error('❌ Currency API error:', error);
      return null;
    }
  }
};
