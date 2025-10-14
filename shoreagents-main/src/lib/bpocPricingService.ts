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
    overallScore: user.overall_score,
    experienceSnapshot: user.experience_snapshot?.length || 0
  })
  
  // Check if there's explicit experience data
  if (user.experience_snapshot && Array.isArray(user.experience_snapshot)) {
    const totalExperience = user.experience_snapshot.reduce((total, exp) => {
      if (exp.duration && typeof exp.duration === 'string') {
        // Parse duration (e.g., "2 years", "6 months")
        const years = exp.duration.match(/(\d+)\s*year/i)
        const months = exp.duration.match(/(\d+)\s*month/i)
        if (years) return total + parseInt(years[1])
        if (months) return total + parseInt(months[1]) / 12
      }
      return total
    }, 0)
    
    console.log(`📊 Total experience calculated: ${totalExperience} years`)
    
    if (totalExperience >= 5) return 'senior'
    if (totalExperience >= 2) return 'mid'
    return 'entry'
  }
  
  // Fallback: use overall score and position to determine level
  if (user.overall_score) {
    console.log(`📊 Using overall score: ${user.overall_score}`)
    if (user.overall_score >= 85) return 'senior'
    if (user.overall_score >= 70) return 'mid'
  }
  
  // Check position title for seniority indicators
  const position = user.current_position || user.position || ''
  const lowerPosition = position.toLowerCase()
  
  console.log(`📊 Analyzing position title: "${position}"`)
  
  if (lowerPosition.includes('senior') || lowerPosition.includes('lead') || lowerPosition.includes('manager') || 
      lowerPosition.includes('director') || lowerPosition.includes('head') || lowerPosition.includes('chief')) {
    console.log(`✅ Determined as SENIOR based on position title`)
    return 'senior'
  }
  if (lowerPosition.includes('junior') || lowerPosition.includes('associate') || lowerPosition.includes('entry') ||
      lowerPosition.includes('trainee') || lowerPosition.includes('intern')) {
    console.log(`✅ Determined as ENTRY based on position title`)
    return 'entry'
  }
  
  console.log(`✅ Defaulting to MID level`)
  return 'mid' // Default to mid-level
}

// Calculate match score based on role similarity
function calculateMatchScore(candidatePosition: string, targetRole: string): number {
  const candidate = candidatePosition.toLowerCase().trim()
  const target = targetRole.toLowerCase().trim()
  
  console.log(`🎯 Calculating match score: "${candidate}" vs "${target}"`)
  
  // Exact match
  if (candidate === target || candidate.includes(target) || target.includes(candidate)) {
    console.log(`✅ Exact match found: 100%`)
    return 100
  }
  
  // Common role mappings with more specific matching and similar positions
  const roleMappings: Record<string, string[]> = {
    'developer': ['programmer', 'engineer', 'coder', 'software developer', 'web developer', 'frontend developer', 'backend developer', 'full stack developer', 'mobile developer', 'devops engineer', 'software engineer', 'application developer'],
    'designer': ['graphic designer', 'ui designer', 'ux designer', 'visual designer', 'web designer', 'product designer', 'interaction designer', 'creative designer', 'brand designer'],
    'writer': ['content writer', 'copywriter', 'content creator', 'blogger', 'technical writer', 'content strategist', 'content manager', 'editor', 'journalist'],
    'marketing': ['marketing specialist', 'digital marketing', 'social media', 'seo', 'marketing coordinator', 'marketing manager', 'brand manager', 'growth hacker', 'marketing analyst'],
    'sales': ['sales representative', 'account manager', 'business development', 'sales executive', 'sales coordinator', 'sales development representative', 'sdr', 'inside sales', 'outside sales', 'sales consultant', 'territory manager'],
    'support': ['customer support', 'help desk', 'technical support', 'customer service', 'support specialist', 'client success', 'customer success', 'support engineer'],
    'admin': ['administrative assistant', 'office manager', 'executive assistant', 'admin assistant', 'administrative coordinator', 'office coordinator', 'personal assistant'],
    'accounting': ['bookkeeper', 'accountant', 'financial analyst', 'finance', 'accounting assistant', 'financial controller', 'auditor', 'tax specialist'],
    'hr': ['human resources', 'recruiter', 'talent acquisition', 'hr specialist', 'hr coordinator', 'people operations', 'talent manager'],
    'project': ['project manager', 'project coordinator', 'scrum master', 'project lead', 'program manager', 'product manager', 'delivery manager'],
    'nurse': ['registered nurse', 'rn', 'nursing', 'healthcare', 'medical', 'patient care', 'clinical', 'nurse practitioner', 'lpn', 'licensed practical nurse', 'cna', 'certified nursing assistant', 'healthcare worker', 'medical assistant', 'healthcare assistant'],
    'healthcare': ['nurse', 'registered nurse', 'rn', 'nursing', 'medical', 'patient care', 'clinical', 'nurse practitioner', 'lpn', 'licensed practical nurse', 'cna', 'certified nursing assistant', 'healthcare worker', 'medical assistant', 'healthcare assistant', 'doctor', 'physician', 'therapist', 'pharmacist', 'healthcare professional'],
    'medical': ['nurse', 'registered nurse', 'rn', 'nursing', 'healthcare', 'patient care', 'clinical', 'nurse practitioner', 'lpn', 'licensed practical nurse', 'cna', 'certified nursing assistant', 'healthcare worker', 'medical assistant', 'healthcare assistant', 'doctor', 'physician', 'therapist', 'pharmacist', 'healthcare professional', 'medical professional'],
    'care': ['nurse', 'registered nurse', 'rn', 'nursing', 'healthcare', 'medical', 'patient care', 'clinical', 'nurse practitioner', 'lpn', 'licensed practical nurse', 'cna', 'certified nursing assistant', 'healthcare worker', 'medical assistant', 'healthcare assistant', 'caregiver', 'care worker', 'patient care specialist']
  }
  
  // Check for role category matches - more strict matching
  for (const [category, keywords] of Object.entries(roleMappings)) {
    if (target.includes(category)) {
      console.log(`🔍 Checking category "${category}" for target "${target}"`)
      for (const keyword of keywords) {
        if (candidate.includes(keyword)) {
          console.log(`✅ Category match found: "${keyword}" in "${candidate}" - 85%`)
          return 85
        }
      }
    }
  }
  
  // Check for partial word matches (more strict)
  const targetWords = target.split(' ').filter(word => word.length > 2)
  const candidateWords = candidate.split(' ').filter(word => word.length > 2)
  
  const matchingWords = targetWords.filter(word => 
    candidateWords.some(cWord => cWord.includes(word) || word.includes(cWord))
  )
  
  if (matchingWords.length > 0) {
    const matchPercentage = (matchingWords.length / targetWords.length) * 70
    console.log(`✅ Partial word match: ${matchingWords.join(', ')} - ${Math.round(matchPercentage)}%`)
    return Math.round(matchPercentage)
  }
  
  // Check for completely unrelated roles - return very low score
  const unrelatedRoles = ['developer', 'designer', 'engineer', 'programmer', 'coder']
  const isUnrelated = unrelatedRoles.some(role => 
    candidate.includes(role) && !target.includes(role)
  )
  
  if (isUnrelated) {
    console.log(`❌ Unrelated role detected: "${candidate}" vs "${target}" - 10%`)
    return 10
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
    
    let bpocEmployees: BPOCUser[] = []
    try {
      bpocEmployees = await fetchBPOCEmployeeData()
      console.log(`📋 BPOC Service: Fetched ${bpocEmployees.length} total employees from BPOC`);
      
      if (bpocEmployees.length === 0) {
        console.warn('⚠️ BPOC API returned empty data, this might be a network issue');
        throw new Error('No BPOC data available');
      }
    } catch (bpocError) {
      console.warn('⚠️ BPOC API unavailable, using empty candidate list:', bpocError)
      bpocEmployees = []
    }
    
    // Filter active employees with expected salary and exclude mock/test data
    const activeCandidates = bpocEmployees.filter(emp => {
      // Basic filters
      if (emp.work_status_completed !== true) return false
      if (!emp.expected_salary || emp.expected_salary.trim() === '') return false
      
      // Exclude mock/test data
      const name = emp.full_name?.toLowerCase() || ''
      const position = (emp.current_position || emp.position || '').toLowerCase()
      
      // Skip obvious test/mock entries
      if (name.includes('shoreagents') || 
          name.includes('test') || 
          name.includes('mock') ||
          position.includes('robber') ||
          position.includes('test') ||
          position.includes('mock')) {
        console.log(`🚫 Excluding mock/test data: ${emp.full_name} - ${position}`)
        return false
      }
      
      // Validate salary is reasonable
      const salary = parseSalary(emp.expected_salary)
      if (salary === 0) {
        console.log(`🚫 Excluding candidate with invalid salary: ${emp.full_name} - ${emp.expected_salary}`)
        return false
      }
      
      return true
    })
    
    console.log(`✅ BPOC Service: Found ${activeCandidates.length} active candidates with salary data`);
    
    // Calculate match scores and filter by experience level
    const candidatesWithScores = activeCandidates
      .map(candidate => {
        const candidateLevel = determineExperienceLevel(candidate)
        const matchScore = calculateMatchScore(
          candidate.current_position || candidate.position || '', 
          role
        )
        
        console.log(`🔍 Candidate: ${candidate.full_name}`, {
          position: candidate.current_position || candidate.position,
          candidateLevel,
          requestedLevel: level,
          matchScore,
          overallScore: candidate.overall_score,
          levelMatch: candidateLevel === level
        })
        
        // More flexible inclusion criteria for similar positions
        const levelMatches = candidateLevel === level
        const highMatchScore = matchScore >= 50 // Lower threshold for similar positions
        const similarPosition = matchScore >= 30 // Include candidates with similar positions
        
        // Only exclude completely unrelated roles
        const isCompletelyUnrelated = matchScore < 20
        
        if (isCompletelyUnrelated) {
          console.log(`❌ Excluding ${candidate.full_name}: completely unrelated role (${matchScore}% match)`)
          return null
        }
        
        // Include if: level matches OR high match score OR similar position
        if (!levelMatches && !highMatchScore && !similarPosition) {
          console.log(`❌ Excluding ${candidate.full_name}: level mismatch (${candidateLevel} vs ${level}) and low match score (${matchScore})`)
          return null
        }
        
        console.log(`✅ Including ${candidate.full_name}: level=${candidateLevel}, match=${matchScore}`)
        
        return {
          id: candidate.user_id,
          name: candidate.full_name,
          position: candidate.current_position || candidate.position || 'Unknown Position',
          expectedSalary: parseSalary(candidate.expected_salary),
          experience: candidate.experience_snapshot ? 
            `${candidate.experience_snapshot.length} positions` : 'Experience not specified',
          skills: candidate.skills_snapshot || [],
          overallScore: candidate.overall_score || 0,
          matchScore,
          isRecommended: matchScore >= 70 && (candidate.overall_score || 0) >= 70
        } as CandidateRecommendation
      })
      .filter((candidate): candidate is CandidateRecommendation => candidate !== null)
    
    // Sort by match score and overall score
    candidatesWithScores.sort((a, b) => {
      if (a.matchScore !== b.matchScore) {
        return b.matchScore - a.matchScore
      }
      return b.overallScore - a.overallScore
    })
    
    // Get top 10 recommendations
    let recommendedCandidates = candidatesWithScores.slice(0, 10)
    
    // If we don't have enough candidates, try to include more with lower thresholds
    if (recommendedCandidates.length < 3) {
      console.log(`⚠️ Only ${recommendedCandidates.length} candidates found, trying more flexible matching...`)
      
      // Re-evaluate all candidates with more flexible criteria
      const flexibleCandidates = activeCandidates
        .map(candidate => {
          const candidateLevel = determineExperienceLevel(candidate)
          const matchScore = calculateMatchScore(
            candidate.current_position || candidate.position || '', 
            role
          )
          
          // More flexible inclusion criteria for similar positions
          const flexibleMatch = matchScore >= 25 || (candidate.overall_score || 0) >= 60
          
          if (!flexibleMatch) return null
          
          return {
            id: candidate.user_id,
            name: candidate.full_name,
            position: candidate.current_position || candidate.position || 'Unknown Position',
            expectedSalary: parseSalary(candidate.expected_salary),
            experience: candidate.experience_snapshot ? 
              `${candidate.experience_snapshot.length} positions` : 'Experience not specified',
            skills: candidate.skills_snapshot || [],
            overallScore: candidate.overall_score || 0,
            matchScore,
            isRecommended: matchScore >= 70 && (candidate.overall_score || 0) >= 70
          } as CandidateRecommendation
        })
        .filter((candidate): candidate is CandidateRecommendation => candidate !== null)
        .sort((a, b) => {
          if (a.matchScore !== b.matchScore) {
            return b.matchScore - a.matchScore
          }
          return b.overallScore - a.overallScore
        })
        .slice(0, 10)
      
      if (flexibleCandidates.length > recommendedCandidates.length) {
        console.log(`✅ Found ${flexibleCandidates.length} candidates with flexible matching`)
        recommendedCandidates = flexibleCandidates
      }
    }
    
    // Calculate average salary from recommended candidates
    const averageSalary = recommendedCandidates.length > 0 
      ? Math.round(recommendedCandidates.reduce((sum, c) => sum + c.expectedSalary, 0) / recommendedCandidates.length)
      : 0
    
    console.log(`🎯 BPOC Service: Match results for ${role}:`, {
      totalCandidates: candidatesWithScores.length,
      recommendedCandidates: recommendedCandidates.length,
      averageSalary: averageSalary,
      hasValidSalaryData: averageSalary > 0,
      dataSource: averageSalary > 0 ? 'REAL BPOC DATA' : 'NO VALID SALARY DATA',
      topMatch: recommendedCandidates[0] ? {
        name: recommendedCandidates[0].name,
        matchScore: recommendedCandidates[0].matchScore,
        salary: recommendedCandidates[0].expectedSalary
      } : null
    });
    
    return {
      role,
      level,
      recommendedCandidates,
      averageSalary,
      totalCandidates: candidatesWithScores.length
    }
    
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
    
    const activeCandidates = bpocEmployees.filter(emp => 
      emp.work_status_completed === true && 
      emp.expected_salary && 
      emp.expected_salary.trim() !== ''
    )
    
    // Extract unique roles
    const roleSet = new Set<string>()
    const levelCounts = { entry: 0, mid: 0, senior: 0 }
    
    activeCandidates.forEach(candidate => {
      const position = candidate.current_position || candidate.position
      if (position) {
        // Normalize role names
        const normalizedRole = position.toLowerCase()
          .replace(/senior|junior|lead|manager|specialist|coordinator|assistant/g, '')
          .trim()
        
        if (normalizedRole) {
          roleSet.add(normalizedRole)
        }
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
