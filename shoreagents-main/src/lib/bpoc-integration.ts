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
  private apiUrl = 'https://www.bpoc.io/api/public/user-data'

  /**
   * Fetch data from BPOC API
   */
  async fetchBPOCData(): Promise<BPOCEmployee[]> {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(`BPOC API error: ${data.message || 'Unknown error'}`)
      }

      return data.data || []
    } catch (error) {
      console.error('Error fetching BPOC data:', error)
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
   * Test BPOC API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const employees = await this.fetchBPOCData()
      return {
        success: true,
        message: `Successfully connected to BPOC API. Found ${employees.length} employees.`
      }
    } catch (error) {
      return {
        success: false,
        message: `BPOC API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

// Export singleton instance
export const bpocIntegration = new BPOCIntegration()
