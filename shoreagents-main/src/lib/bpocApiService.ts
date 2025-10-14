// BPOC API Service for fetching employee data
export interface BPOCUser {
  user_id: string
  first_name: string
  last_name: string
  full_name: string
  location: string
  avatar_url: string | null
  bio: string | null
  position: string | null
  gender: string | null
  gender_custom: string | null
  slug: string
  location_city: string | null
  location_province: string | null
  location_country: string | null
  location_region: string | null
  location_barangay: string | null
  user_created_at: string
  user_updated_at: string
  work_status_id: string | null
  current_employer: string | null
  current_position: string | null
  work_status: string | null
  preferred_shift: string | null
  work_setup: string | null
  current_mood: string | null
  notice_period_days: number | null
  expected_salary: string | null
  work_status_completed: boolean | null
  work_status_created_at: string | null
  work_status_updated_at: string | null
  analysis_id: string | null
  session_id: string | null
  overall_score: number | null
  ats_compatibility_score: number | null
  content_quality_score: number | null
  professional_presentation_score: number | null
  skills_alignment_score: number | null
  key_strengths: string[] | null
  strengths_analysis: Record<string, unknown> | null
  improvements: string[] | null
  recommendations: string[] | null
  improved_summary: string | null
  salary_analysis: Record<string, unknown> | null
  career_path: Record<string, unknown> | null
  section_analysis: Record<string, unknown> | null
  candidate_profile: Record<string, unknown> | null
  skills_snapshot: string[] | null
  experience_snapshot: Record<string, unknown>[] | null
  education_snapshot: Record<string, unknown>[] | null
  portfolio_links: string[] | null
  analysis_created_at: string | null
  analysis_updated_at: string | null
}

export interface BPOCApiResponse {
  success: boolean
  data: BPOCUser[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
    totalPages: number
    currentPage: number
  }
  meta: {
    requestedFields: string
    includePrivate: boolean
    sortBy: string
    sortOrder: string
    timestamp: string
    version: string
  }
}

// Fetch all employee data from BPOC database via local API
export async function fetchBPOCEmployeeData(): Promise<BPOCUser[]> {
  try {
    // Use local API that connects directly to BPOC database
    const response = await fetch('/api/bpoc-candidates')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error('API returned unsuccessful response')
    }
    
    console.log('✅ Fetched BPOC employee data from database:', data.data.length, 'employees')
    return data.data
  } catch (error) {
    console.error('❌ Error fetching BPOC employee data:', error)
    throw error
  }
}

// Get employees with completed work status
export async function getActiveEmployees(): Promise<BPOCUser[]> {
  try {
    const employees = await fetchBPOCEmployeeData()
    return employees.filter(emp => emp.work_status_completed === true)
  } catch (error) {
    console.error('❌ Error fetching active employees:', error)
    return []
  }
}

// Get employees by work status
export async function getEmployeesByWorkStatus(status: string): Promise<BPOCUser[]> {
  try {
    const employees = await fetchBPOCEmployeeData()
    return employees.filter(emp => emp.work_status === status)
  } catch (error) {
    console.error('❌ Error fetching employees by work status:', error)
    return []
  }
}

// Get employees by position
export async function getEmployeesByPosition(position: string): Promise<BPOCUser[]> {
  try {
    const employees = await fetchBPOCEmployeeData()
    return employees.filter(emp => 
      emp.position?.toLowerCase().includes(position.toLowerCase()) ||
      emp.current_position?.toLowerCase().includes(position.toLowerCase())
    )
  } catch (error) {
    console.error('❌ Error fetching employees by position:', error)
    return []
  }
}

// Get employees with analysis data
export async function getEmployeesWithAnalysis(): Promise<BPOCUser[]> {
  try {
    const employees = await fetchBPOCEmployeeData()
    return employees.filter(emp => emp.analysis_id !== null)
  } catch (error) {
    console.error('❌ Error fetching employees with analysis:', error)
    return []
  }
}

// Get top performing employees (by overall score)
export async function getTopPerformingEmployees(limit: number = 10): Promise<BPOCUser[]> {
  try {
    const employees = await fetchBPOCEmployeeData()
    return employees
      .filter(emp => emp.overall_score !== null)
      .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
      .slice(0, limit)
  } catch (error) {
    console.error('❌ Error fetching top performing employees:', error)
    return []
  }
}

// Search employees by name or skills
export async function searchEmployees(query: string): Promise<BPOCUser[]> {
  try {
    const employees = await fetchBPOCEmployeeData()
    const searchTerm = query.toLowerCase()
    
    return employees.filter(emp => 
      emp.full_name.toLowerCase().includes(searchTerm) ||
      emp.position?.toLowerCase().includes(searchTerm) ||
      emp.current_position?.toLowerCase().includes(searchTerm) ||
      emp.skills_snapshot?.some(skill => skill.toLowerCase().includes(searchTerm)) ||
      emp.location.toLowerCase().includes(searchTerm)
    )
  } catch (error) {
    console.error('❌ Error searching employees:', error)
    return []
  }
}

// Get employee statistics
export async function getEmployeeStatistics(): Promise<{
  total: number
  active: number
  employed: number
  available: number
  withAnalysis: number
  averageScore: number
  topSkills: string[]
  workSetupDistribution: Record<string, number>
  locationDistribution: Record<string, number>
}> {
  try {
    const employees = await fetchBPOCEmployeeData()
    
    const active = employees.filter(emp => emp.work_status_completed === true).length
    const employed = employees.filter(emp => emp.work_status === 'employed').length
    const available = employees.filter(emp => emp.work_status === 'available').length
    const withAnalysis = employees.filter(emp => emp.analysis_id !== null).length
    
    const scoresWithAnalysis = employees
      .filter(emp => emp.overall_score !== null)
      .map(emp => emp.overall_score!)
    const averageScore = scoresWithAnalysis.length > 0 
      ? scoresWithAnalysis.reduce((sum, score) => sum + score, 0) / scoresWithAnalysis.length 
      : 0
    
    // Get top skills
    const allSkills = employees
      .flatMap(emp => emp.skills_snapshot || [])
      .filter(skill => skill && skill.trim() !== '')
    
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill]) => skill)
    
    // Work setup distribution
    const workSetupDistribution = employees.reduce((acc, emp) => {
      if (emp.work_setup) {
        acc[emp.work_setup] = (acc[emp.work_setup] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    // Location distribution
    const locationDistribution = employees.reduce((acc, emp) => {
      if (emp.location_province) {
        acc[emp.location_province] = (acc[emp.location_province] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    return {
      total: employees.length,
      active,
      employed,
      available,
      withAnalysis,
      averageScore: Math.round(averageScore * 100) / 100,
      topSkills,
      workSetupDistribution,
      locationDistribution
    }
  } catch (error) {
    console.error('❌ Error getting employee statistics:', error)
    return {
      total: 0,
      active: 0,
      employed: 0,
      available: 0,
      withAnalysis: 0,
      averageScore: 0,
      topSkills: [],
      workSetupDistribution: {},
      locationDistribution: {}
    }
  }
}
