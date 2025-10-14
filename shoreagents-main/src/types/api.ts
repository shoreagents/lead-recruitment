export interface User {
  id: string;
  name: string; // Changed from full_name to name for consistency
  email: string;
  location: string;
  position: string;
  avatar: string | null; // Changed from avatar_url to avatar
  bio: string | null; // Added bio field
  work_status: string | null; // Added work_status field
  created_at: string;
  updated_at: string; // Added updated_at field
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  resume_id: string;
  resume_slug: string;
  status: string;
  position: number;
  created_at: string;
}

export interface Job {
  id: number;
  company_id: string;
  job_title: string;
  department: string;
  work_arrangement: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  status: string;
  views: number;
  applicants: number;
  created_at: string;
}

export interface AIAnalysisResult {
  id: string;
  user_id: string;
  overall_score: number;
  ats_compatibility_score: number;
  content_quality_score: number;
  professional_presentation_score: number;
  skills_alignment_score: number;
  key_strengths: string[];
  improvements: string[];
  recommendations: string[];
  created_at: string;
  updated_at: string;
}

export interface ResumeGenerated {
  id: string;
  user_id: string;
  original_resume_id: string | null;
  template_used: string;
  generation_metadata: {
    userAgent: string;
    templateUsed: string;
    originalResumeData: {
      files?: Array<{
        data: string;
        fileName: string;
        fileType: string;
      }>;
      fileNames?: string[];
      fileTypes?: string[];
      totalFiles?: number;
      name?: string;
      email?: string;
      phone?: string;
      skills?: string[] | {
        soft?: string;
        tools?: string;
        languages?: string;
        technical?: string;
        design?: string;
      };
      summary?: string;
      education?: Array<Record<string, unknown>>;
      experience?: Array<Record<string, unknown>>;
      projects?: Array<Record<string, unknown>>;
      achievements?: string[];
      bestJobTitle?: string;
      certifications?: string[];
      location?: string;
    };
    generationTimestamp: string;
  };
  created_at: string;
}

export interface WorkStatus {
  id: string;
  userId: string;
  currentEmployer: string;
  currentPosition: string;
  workStatus: string;
  preferredShift: string;
  workSetup: string;
  currentMood: string;
  noticePeriodDays: number;
  expectedSalary: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkStatusResponse {
  results: WorkStatus[];
  limit: number;
  offset: number;
}

export interface ApiResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
}

export interface EmployeeCardData {
  user: User;
  applications: Application[];
  appliedJobs: Job[];
  aiAnalysis?: AIAnalysisResult;
  resume?: ResumeGenerated;
  workStatus?: WorkStatus;
  hotnessScore?: number;
}
