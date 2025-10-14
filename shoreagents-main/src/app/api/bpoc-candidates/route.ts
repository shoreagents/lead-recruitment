import { NextRequest, NextResponse } from 'next/server';
import { getBPOCPool } from '@/lib/bpoc-database';

export interface BPOCUser {
  user_id: string
  first_name: string
  last_name: string
  full_name: string
  location: string
  avatar_url: string | null
  bio: string | null
  position: string | null
  current_position: string | null
  expected_salary: string | null
  work_status_completed: boolean | null
  overall_score: number | null
  skills_snapshot: string[] | null
  experience_snapshot: any[] | null
}

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

// Parse salary string to number
function parseSalary(salaryString: string | null): number {
  if (!salaryString) return 0
  
  const numbers = salaryString.match(/[\d,]+/g)
  if (!numbers || numbers.length === 0) return 0
  
  let salary = 0
  
  if (numbers.length > 1) {
    const min = parseInt(numbers[0].replace(/,/g, ''))
    const max = parseInt(numbers[1].replace(/,/g, ''))
    salary = Math.round((min + max) / 2)
  } else {
    salary = parseInt(numbers[0].replace(/,/g, ''))
  }
  
  if (salary < 15000 || salary > 200000) {
    return 0
  }
  
  return salary
}

// Determine experience level based on position count
function determineExperienceLevel(user: BPOCUser): 'entry' | 'mid' | 'senior' {
  if (user.experience_snapshot && Array.isArray(user.experience_snapshot)) {
    const positionCount = user.experience_snapshot.length
    
    // Use position count as experience indicator
    if (positionCount >= 5) return 'senior'
    if (positionCount >= 2) return 'mid'
    return 'entry'
  }
  
  return 'mid' // Default
}

// Enhanced match score calculation with automation and RPA support
function calculateMatchScore(candidatePosition: string, targetRole: string, candidateSkills?: string[]): number {
  const candidate = candidatePosition.toLowerCase().trim()
  const target = targetRole.toLowerCase().trim()
  
  // Direct match
  if (candidate === target || candidate.includes(target) || target.includes(candidate)) {
    return 100
  }
  
  // Enhanced role mappings with automation and RPA support
  const roleMappings: Record<string, string[]> = {
    'developer': ['programmer', 'engineer', 'coder', 'software developer', 'web developer', 'frontend developer', 'backend developer', 'full stack developer', 'mobile developer', 'devops engineer', 'software engineer', 'application developer', 'developer', 'web dev', 'junior web dev', 'junior web developer'],
    'designer': ['graphic designer', 'ui designer', 'ux designer', 'visual designer', 'web designer', 'product designer', 'interaction designer', 'creative designer', 'brand designer', 'graphic design'],
    'marketing': ['marketing specialist', 'digital marketing', 'social media', 'seo', 'marketing coordinator', 'marketing manager', 'brand manager', 'growth hacker', 'marketing analyst'],
    'sales': ['sales representative', 'account manager', 'business development', 'sales executive', 'sales coordinator', 'sales development representative', 'sdr', 'inside sales', 'outside sales', 'sales consultant', 'territory manager'],
    'support': ['customer support', 'help desk', 'technical support', 'customer service', 'support specialist', 'client success', 'customer success', 'support engineer'],
    'admin': ['administrative assistant', 'office manager', 'executive assistant', 'admin assistant', 'administrative coordinator', 'office coordinator', 'personal assistant', 'admin', 'admin support'],
    'accounting': ['bookkeeper', 'accountant', 'financial analyst', 'finance', 'accounting assistant', 'financial controller', 'auditor', 'tax specialist'],
    'hr': ['human resources', 'recruiter', 'talent acquisition', 'hr specialist', 'hr coordinator', 'people operations', 'talent manager', 'hr manager'],
    'project': ['project manager', 'project coordinator', 'scrum master', 'project lead', 'program manager', 'product manager', 'delivery manager'],
    'automation': ['automation engineer', 'automation specialist', 'automation developer', 'rpa developer', 'rpa engineer', 'process automation', 'workflow automation', 'business process automation', 'robotic process automation', 'automations', 'automation analyst'],
    'engineer': ['software engineer', 'automation engineer', 'process engineer', 'systems engineer', 'automation specialist', 'rpa engineer', 'automation developer', 'developer', 'web developer'],
    'software': ['software engineer', 'software developer', 'developer', 'web developer', 'junior web developer', 'web dev', 'junior web dev'],
    'web': ['web developer', 'web dev', 'junior web developer', 'junior web dev', 'developer', 'software developer', 'software engineer']
  }
  
  // Check for automation-specific matches
  if (target.includes('automation') || target.includes('rpa') || target.includes('robotic')) {
    // High priority for automation roles
    for (const keyword of roleMappings.automation) {
      if (candidate.includes(keyword)) {
        return 95
      }
    }
    
    // Check skills for automation keywords
    if (candidateSkills) {
      const automationSkills = candidateSkills.filter(skill => 
        skill.toLowerCase().includes('automation') ||
        skill.toLowerCase().includes('rpa') ||
        skill.toLowerCase().includes('process') ||
        skill.toLowerCase().includes('workflow') ||
        skill.toLowerCase().includes('robotic')
      )
      if (automationSkills.length > 0) {
        return 90
      }
    }
  }
  
  // Standard role category matching
  for (const [category, keywords] of Object.entries(roleMappings)) {
    if (target.includes(category)) {
      for (const keyword of keywords) {
        if (candidate.includes(keyword)) {
          return 85
        }
      }
    }
  }
  
  // Word-based matching
  const targetWords = target.split(' ').filter(word => word.length > 2)
  const candidateWords = candidate.split(' ').filter(word => word.length > 2)
  
  const matchingWords = targetWords.filter(word => 
    candidateWords.some(cWord => cWord.includes(word) || word.includes(cWord))
  )
  
  if (matchingWords.length > 0) {
    const matchPercentage = (matchingWords.length / targetWords.length) * 70
    return Math.round(matchPercentage)
  }
  
  return 20
}

/**
 * GET endpoint - Fetch all candidates directly from BPOC database
 * Used by /we-got-talent page for displaying talent pool
 */
export async function GET() {
  try {
    console.log('🔍 Fetching candidates directly from BPOC database...');
    
    const pool = getBPOCPool();
    
    // Query the same view that the BPOC public API uses
    // This ensures data consistency and privacy filtering
    const query = `
      SELECT 
        user_id, first_name, last_name, full_name, location, avatar_url, bio, position,
        current_position, work_status, expected_salary, overall_score, 
        skills_snapshot, experience_snapshot, key_strengths, improvements, 
        recommendations, improved_summary, user_created_at, work_status_completed,
        -- Additional fields for comprehensive candidate profiles
        ats_compatibility_score, content_quality_score, professional_presentation_score,
        skills_alignment_score, strengths_analysis, salary_analysis, career_path
      FROM public.v_user_complete_data
      WHERE user_id IS NOT NULL
      ORDER BY overall_score DESC NULLS LAST, user_created_at DESC
      LIMIT 200
    `;
    
    const result = await pool.query(query);
    
    console.log(`✅ Fetched ${result.rows.length} candidates from BPOC database`);
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      source: 'direct-database',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching candidates from BPOC database:', error);
    
    // Provide helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isConnectionError = errorMessage.includes('ECONNREFUSED') || 
                              errorMessage.includes('BPOC_DATABASE_URL');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch candidates from database',
        details: errorMessage,
        hint: isConnectionError 
          ? 'Check that BPOC_DATABASE_URL is set correctly in your .env.local file'
          : 'Database query failed. Check server logs for details.'
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Get candidate recommendations for a specific role
 * Used by pricing calculator for matching candidates to job positions
 */
export async function POST(request: NextRequest) {
  try {
    const { role, level, industry } = await request.json();

    if (!role || !level) {
      return NextResponse.json(
        { error: 'Role and level are required' },
        { status: 400 }
      );
    }

    console.log(`🔍 BPOC Candidates API: Searching for ${role} (${level} level) in ${industry || 'any'} industry`);

    // Fetch BPOC data from database (not external API)
    let bpocEmployees: BPOCUser[] = []
    try {
      const pool = getBPOCPool();
      
      // Query database directly for better performance
      const query = `
        SELECT 
          user_id, first_name, last_name, full_name, location, avatar_url, bio, position,
          current_position, work_status, expected_salary, overall_score, 
          skills_snapshot, experience_snapshot, work_status_completed
        FROM public.v_user_complete_data
        WHERE user_id IS NOT NULL
        ORDER BY overall_score DESC NULLS LAST
        LIMIT 500
      `;
      
      const result = await pool.query(query);
      bpocEmployees = result.rows;
      
      console.log(`📋 BPOC Candidates API: Fetched ${bpocEmployees.length} total employees from BPOC database`);
      
    } catch (error) {
      console.error('❌ Error fetching BPOC data from database:', error);
      return NextResponse.json(
        { error: 'Failed to fetch BPOC candidate data from database' },
        { status: 500 }
      );
    }

    // Filter candidates - be more inclusive to show more candidates like user dashboard
    const activeCandidates = bpocEmployees.filter(emp => {
      const name = emp.full_name?.toLowerCase() || ''
      const position = (emp.current_position || emp.position || '').toLowerCase()
      const skills = emp.skills_snapshot || []
      
      // Exclude test/mock data
      if (name.includes('shoreagents') || 
          name.includes('test') || 
          name.includes('mock') ||
          position.includes('robber') ||
          position.includes('test') ||
          position.includes('mock')) {
        return false
      }
      
      // Include candidates with automation skills even if they don't have work_status_completed
      const hasAutomationSkills = skills.some(skill => 
        skill.toLowerCase().includes('automation') ||
        skill.toLowerCase().includes('rpa') ||
        skill.toLowerCase().includes('process automation') ||
        skill.toLowerCase().includes('workflow')
      )
      
      // If they have automation skills and we're looking for automation roles, include them
      if (hasAutomationSkills && (role.toLowerCase().includes('automation') || role.toLowerCase().includes('rpa'))) {
        return true
      }
      
      // For other roles, prefer candidates with work_status_completed and salary, but also include others
      if (emp.work_status_completed === true && emp.expected_salary && emp.expected_salary.trim() !== '') {
        const salary = parseSalary(emp.expected_salary)
        if (salary > 0) {
          return true
        }
      }
      
      // Include candidates even without work_status_completed if they have a position
      if (emp.position || emp.current_position) {
        return true
      }
      
      return false
    })
    
    console.log(`✅ BPOC Candidates API: Found ${activeCandidates.length} active candidates with salary data`);
    
    // Calculate match scores and filter by experience level
    const candidatesWithScores = activeCandidates
      .map(candidate => {
        const candidateLevel = determineExperienceLevel(candidate)
        // For candidates with empty positions but relevant skills, use skills for matching
        const candidatePosition = candidate.current_position || candidate.position || ''
        const candidateSkills = candidate.skills_snapshot || []
        
        // If position is empty but has automation skills, create a virtual position
        let positionForMatching = candidatePosition
        if (!candidatePosition && candidateSkills.some(skill => 
          skill.toLowerCase().includes('automation') ||
          skill.toLowerCase().includes('rpa') ||
          skill.toLowerCase().includes('process automation')
        )) {
          positionForMatching = 'Automation Specialist'
        }
        
        const matchScore = calculateMatchScore(
          positionForMatching, 
          role,
          candidateSkills
        )
        
        const levelMatches = candidateLevel === level
        const levelFlexible = (level === 'senior' && candidateLevel === 'mid') || 
                             (level === 'mid' && candidateLevel === 'entry') ||
                             (level === 'entry' && candidateLevel === 'mid')
        const highMatchScore = matchScore >= 50
        const similarPosition = matchScore >= 30
        const isCompletelyUnrelated = matchScore < 20
        
        if (isCompletelyUnrelated) {
          return null
        }
        
        if (levelMatches || levelFlexible || highMatchScore || similarPosition) {
          return {
            id: candidate.user_id,
            name: candidate.full_name,
            position: positionForMatching || 'Unknown Position',
            expectedSalary: parseSalary(candidate.expected_salary),
            experience: candidate.experience_snapshot ? 
              `${candidate.experience_snapshot.length} positions` : 'Experience not specified',
            skills: candidate.skills_snapshot || [],
            overallScore: candidate.overall_score || 0,
            matchScore,
            isRecommended: matchScore >= 70 && (candidate.overall_score || 0) >= 50
          } as CandidateRecommendation
        }
        
        return null
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
    const recommendedCandidates = candidatesWithScores.slice(0, 10)
    
    // Check if we have good matches (high match score and relevant positions)
    const goodMatches = recommendedCandidates.filter(c => {
      // Must have decent match score (lowered from 70 to 50)
      if (c.matchScore < 50) return false
      
      // Position must be relevant to the role
      const candidatePos = c.position.toLowerCase()
      const targetRole = role.toLowerCase()
      
      // Direct match or contains key terms
      const isRelevant = candidatePos.includes(targetRole) || 
                        targetRole.includes(candidatePos) ||
                        // Check for role category matches
                        (targetRole.includes('developer') && candidatePos.includes('developer')) ||
                        (targetRole.includes('designer') && candidatePos.includes('designer')) ||
                        (targetRole.includes('manager') && candidatePos.includes('manager')) ||
                        (targetRole.includes('analyst') && candidatePos.includes('analyst')) ||
                        (targetRole.includes('engineer') && candidatePos.includes('engineer')) ||
                        // Enhanced automation matching
                        (targetRole.includes('automation') && (candidatePos.includes('automation') || candidatePos.includes('rpa') || candidatePos.includes('process'))) ||
                        (targetRole.includes('rpa') && (candidatePos.includes('rpa') || candidatePos.includes('automation') || candidatePos.includes('robotic'))) ||
                        (targetRole.includes('robotic') && (candidatePos.includes('robotic') || candidatePos.includes('automation') || candidatePos.includes('rpa')))
      
      return isRelevant
    })
    
    // If no good matches found, return empty results (no fallback data)
    if (goodMatches.length === 0) {
      console.log(`⚠️ No good matches found for ${role}, returning empty results`);
      
      const result: JobPositionMatch = {
        role,
        level,
        recommendedCandidates: [],
        averageSalary: 0,
        totalCandidates: 0
      };
      
      return NextResponse.json(result);
    }
    
    // Calculate average salary from good matches only
    const averageSalary = goodMatches.length > 0 
      ? Math.round(goodMatches.reduce((sum, c) => sum + c.expectedSalary, 0) / goodMatches.length)
      : 0

    const result: JobPositionMatch = {
      role,
      level,
      recommendedCandidates: goodMatches,
      averageSalary,
      totalCandidates: goodMatches.length
    };

    console.log(`🎯 BPOC Candidates API Result:`, {
      role,
      level,
      candidateCount: goodMatches.length,
      averageSalary,
      candidates: goodMatches.map(c => `${c.name} (${c.position}) - ₱${c.expectedSalary}`)
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ BPOC Candidates API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidate recommendations' },
      { status: 500 }
    );
  }
}
