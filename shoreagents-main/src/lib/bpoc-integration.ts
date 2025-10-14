// BPOC Integration for Supabase
// =============================
// Since Supabase doesn't support HTTP extension, we handle HTTP calls in the application

import { createClient } from '@/lib/supabase/client'

export interface BPOCEmployee {
  user_id: string
  full_name: string
  first_name: string
  last_name: string
  current_position?: string
  position?: string
  location?: string
  avatar_url?: string
  bio?: string
  overall_score?: number
  skills_snapshot?: unknown[]
  experience_snapshot?: unknown
  expected_salary?: number
  work_status?: string
  work_status_completed?: boolean
  user_created_at?: string
  key_strengths?: unknown[]
  improvements?: unknown[]
  recommendations?: unknown[]
  improved_summary?: string
  strengths_analysis?: unknown
}

export interface BPOCAnalysis {
  user_id: string
  analysis_id?: string
  session_id?: string
  overall_score?: number
  ats_compatibility_score?: number
  content_quality_score?: number
  professional_presentation_score?: number
  skills_alignment_score?: number
  key_strengths?: unknown[]
  improvements?: unknown[]
  recommendations?: unknown[]
  improved_summary?: string
  strengths_analysis?: unknown
  salary_analysis?: unknown
  career_path?: unknown
  section_analysis?: unknown
  candidate_profile?: unknown
  skills_snapshot?: unknown[]
  experience_snapshot?: unknown
  education_snapshot?: unknown
  portfolio_links?: unknown[]
  analysis_created_at?: string
  analysis_updated_at?: string
}

export class BPOCIntegration {
  private supabase = createClient()

  /**
   * Fetch data from BPOC database via API
   */
  async fetchBPOCData(): Promise<BPOCEmployee[]> {
    try {
      // Fetch data from API route (server-side database access)
      const response = await fetch('/api/bpoc-users')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(`API error: ${result.error || 'Unknown error'}`)
      }
      
      const bpocUsers = result.data
      
      // Convert to BPOCEmployee format
      return bpocUsers.map((user: any) => ({
        user_id: user.user_id,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        current_position: user.current_position,
        position: user.position,
        location: user.location,
        avatar_url: user.avatar_url,
        bio: user.bio,
        overall_score: user.overall_score,
        skills_snapshot: user.skills_snapshot,
        experience_snapshot: user.experience_snapshot,
        expected_salary: user.expected_salary,
        work_status: user.work_status,
        work_status_completed: user.work_status_completed,
        user_created_at: user.user_created_at,
        key_strengths: user.key_strengths,
        improvements: user.improvements,
        recommendations: user.recommendations,
        improved_summary: user.improved_summary,
        strengths_analysis: user.strengths_analysis
      }))
    } catch (error) {
      console.error('Error fetching BPOC data from database:', error)
      throw error
    }
  }

  /**
   * Sync BPOC employees data to Supabase
   */
  async syncBPOCEmployees(): Promise<{
    total_processed: number
    new_employees: number
    updated_employees: number
    errors: number
  }> {
    try {
      // Fetch data from BPOC API
      const employees = await this.fetchBPOCData()

      // Call the database function with the data
      const { data, error } = await this.supabase.rpc('sync_bpoc_employees_data_supabase', {
        employee_data: employees
      })

      if (error) {
        throw error
      }

      return data[0] || {
        total_processed: 0,
        new_employees: 0,
        updated_employees: 0,
        errors: 0
      }
    } catch (error) {
      console.error('Error syncing BPOC employees:', error)
      throw error
    }
  }

  /**
   * Sync AI analysis data to Supabase
   */
  async syncAIAnalysis(): Promise<{
    total_processed: number
    new_analyses: number
    updated_analyses: number
    errors: number
  }> {
    try {
      // Fetch data from BPOC API
      const employees = await this.fetchBPOCData()

      // Extract analysis data from employees
      const analysisData = employees
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter(emp => (emp as any).analysis_id) // Only employees with analysis data
        .map(emp => ({
          user_id: emp.user_id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          analysis_id: (emp as any).analysis_id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          session_id: (emp as any).session_id,
          overall_score: emp.overall_score,
          // ... map other analysis fields
        }))

      // Call the database function with the data
      const { data, error } = await this.supabase.rpc('sync_ai_analysis_data_supabase', {
        analysis_data: analysisData
      })

      if (error) {
        throw error
      }

      return data[0] || {
        total_processed: 0,
        new_analyses: 0,
        updated_analyses: 0,
        errors: 0
      }
    } catch (error) {
      console.error('Error syncing AI analysis:', error)
      throw error
    }
  }

  /**
   * Test BPOC database connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { testBPOCDatabaseConnection } = await import('@/lib/bpoc-database')
      const result = await testBPOCDatabaseConnection()
      
      if (result.success) {
        const employees = await this.fetchBPOCData()
        return {
          success: true,
          message: `Successfully connected to BPOC database. Found ${employees.length} employees.`
        }
      } else {
        return result
      }
    } catch (error) {
      return {
        success: false,
        message: `BPOC database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

// Export singleton instance
export const bpocIntegration = new BPOCIntegration()
