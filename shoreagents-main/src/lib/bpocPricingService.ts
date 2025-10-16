// BPOC Pricing Service - Integrates BPOC candidate data with pricing calculator
import { fetchBPOCEmployeeData, type BPOCUser } from './bpocApiService'

export interface CandidateRecommendation {
  id: string
  name: string
  position: string
  expectedSalary: number
  experience: string
  skills: string[]
  overallScore: number
  matchScore: number
  isRecommended: boolean
  avatar?: string | null
}

export interface JobPositionMatch {
  role: string
  level: 'entry' | 'mid' | 'senior'
  recommendedCandidates: CandidateRecommendation[]
  averageSalary: number
  totalCandidates: number
}

// Parse salary string to number (handles various formats with validation)
function parseSalary(salaryString: string | null): number {
  if (!salaryString) return 0
  
  // Extract numbers from salary string (handles formats like "₱25,000 - ₱35,000", "25000", etc.)
  const numbers = salaryString.match(/[\d,]+/g)
  if (!numbers || numbers.length === 0) return 0
  
  let salary = 0
  
  // If range, take the average
  if (numbers.length > 1) {
    const min = parseInt(numbers[0].replace(/,/g, ''))
    const max = parseInt(numbers[1].replace(/,/g, ''))
    salary = Math.round((min + max) / 2)
  } else {
    salary = parseInt(numbers[0].replace(/,/g, ''))
  }
  
  // Validate salary range (reasonable PHP salary range: 15,000 - 200,000)
  // Filter out unrealistic values like 7,000,000+ pesos
  if (salary < 15000 || salary > 200000) {
    console.log(`⚠️ Unrealistic salary detected: ${salaryString} -> ${salary}. Skipping.`)
    return 0
  }
  
  return salary
}

// Determine experience level based on various factors
function determineExperienceLevel(user: BPOCUser): 'entry' | 'mid' | 'senior' {
  console.log(`🔍 Determining experience level for ${user.full_name}:`, {
    position: user.current_position || user.position,
    experienceCount: user.experience_snapshot?.length || 0,
    overallScore: user.overall_score
  })
  
  // Use experience snapshot length as primary indicator
  if (user.experience_snapshot && Array.isArray(user.experience_snapshot)) {
    const experienceCount = user.experience_snapshot.length
    
    if (experienceCount >= 5) {
      console.log(`✅ Classified as SENIOR: ${experienceCount} positions`)
      return 'senior'
    }
    
    if (experienceCount >= 2) {
      console.log(`✅ Classified as MID: ${experienceCount} positions`)
      return 'mid'
    }
    
    console.log(`✅ Classified as ENTRY: ${experienceCount} positions`)
    return 'entry'
  }
  
  // Fallback to position title analysis
  const position = (user.current_position || user.position || '').toLowerCase()
  
  if (position.includes('senior') || position.includes('lead') || position.includes('manager') || position.includes('director')) {
    console.log(`✅ Classified as SENIOR based on position: ${position}`)
    return 'senior'
  }
  
  if (position.includes('junior') || position.includes('entry') || position.includes('assistant') || position.includes('intern')) {
    console.log(`✅ Classified as ENTRY based on position: ${position}`)
    return 'entry'
  }
  
  // Default to mid-level for unknown positions
  console.log(`✅ Defaulting to MID level`)
  return 'mid' // Default to mid-level
}

// Calculate match score based on role similarity
function calculateMatchScore(candidatePosition: string, targetRole: string): number {
  const candidate = candidatePosition.toLowerCase().trim()
  const target = targetRole.toLowerCase().trim()
  
  console.log(`🔍 Calculating match score: "${candidate}" vs "${target}"`)
  
  // Direct match
  if (candidate === target || candidate.includes(target) || target.includes(candidate)) {
    console.log(`✅ Direct match found: 100%`)
    return 100
  }
  
  // Word-based matching
  const targetWords = target.split(' ').filter(word => word.length > 2)
  const candidateWords = candidate.split(' ').filter(word => word.length > 2)
  
  const matchingWords = targetWords.filter(word => 
    candidateWords.some(cWord => cWord.includes(word) || word.includes(cWord))
  )
  
  if (matchingWords.length > 0) {
    const matchPercentage = (matchingWords.length / targetWords.length) * 70
    console.log(`✅ Word-based match: ${matchPercentage}%`)
    return Math.round(matchPercentage)
  }
  
  console.log(`⚠️ No significant match found: "${candidate}" vs "${target}" - 20%`)
  return 20 // Lower default for unrelated roles
}

// Get candidate recommendations for a specific role and level
export async function getCandidateRecommendations(
  role: string, 
  level: 'entry' | 'mid' | 'senior',
  industry?: string
): Promise<JobPositionMatch> {
  try {
    console.log(`🔍 BPOC Service: Searching for ${role} (${level} level) in industry: ${industry || 'any'}`);
    
    // Use the local BPOC candidates API instead of external API
    const response = await fetch('/api/bpoc-candidates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        level,
        industry
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jobMatch = await response.json();
    console.log(`📋 BPOC Service: Fetched ${jobMatch.totalCandidates} candidates from local API`);
    
    if (jobMatch.totalCandidates === 0) {
      console.warn('⚠️ Local BPOC API returned no candidates');
      return {
        role,
        level,
        recommendedCandidates: [],
        averageSalary: 0,
        totalCandidates: 0
      };
    }
    
    return jobMatch;
    
  } catch (error) {
    console.error('Error fetching candidate recommendations:', error)
    
    // Return empty result on error
    return {
      role,
      level,
      recommendedCandidates: [],
      averageSalary: 0,
      totalCandidates: 0
    }
  }
}

// Get all available roles and levels from BPOC data
export async function getAvailableRolesAndLevels(): Promise<{
  roles: string[]
  levels: Array<{ level: 'entry' | 'mid' | 'senior', count: number }>
}> {
  try {
    const bpocEmployees = await fetchBPOCEmployeeData()
    
    const roleSet = new Set<string>()
    const levelCounts = { entry: 0, mid: 0, senior: 0 }
    
    bpocEmployees.forEach(candidate => {
      const role = candidate.current_position || candidate.position
      if (role) {
        roleSet.add(role)
      }
      
      const level = determineExperienceLevel(candidate)
      levelCounts[level]++
    })
    
    return {
      roles: Array.from(roleSet).sort(),
      levels: [
        { level: 'entry', count: levelCounts.entry },
        { level: 'mid', count: levelCounts.mid },
        { level: 'senior', count: levelCounts.senior }
      ]
    }
    
  } catch (error) {
    console.error('Error fetching available roles:', error)
    return { roles: [], levels: [] }
  }
}

// Get salary range for a specific role and level
export async function getSalaryRange(
  role: string, 
  level: 'entry' | 'mid' | 'senior'
): Promise<{ min: number, max: number, average: number }> {
  try {
    const match = await getCandidateRecommendations(role, level)
    
    if (match.recommendedCandidates.length === 0) {
      return { min: 0, max: 0, average: 0 }
    }
    
    const salaries = match.recommendedCandidates.map(c => c.expectedSalary)
    const min = Math.min(...salaries)
    const max = Math.max(...salaries)
    const average = Math.round(salaries.reduce((sum, s) => sum + s, 0) / salaries.length)
    
    return { min, max, average }
    
  } catch (error) {
    console.error('Error fetching salary range:', error)
    return { min: 0, max: 0, average: 0 }
  }
}