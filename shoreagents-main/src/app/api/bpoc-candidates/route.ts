import { NextRequest, NextResponse } from 'next/server';

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
  avatar?: string | null
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

// Smart role category detection without hardcoding (moved outside for reusability)
function getRoleCategory(role: string): string {
    const roleLower = role.toLowerCase()
    
    // Development/Technical roles
    if (roleLower.includes('developer') || roleLower.includes('programmer') || 
        roleLower.includes('engineer') || roleLower.includes('coder') ||
        roleLower.includes('software') || roleLower.includes('web') ||
        roleLower.includes('app') || roleLower.includes('mobile')) {
      return 'development'
    }
    
    // Design roles
    if (roleLower.includes('designer') || roleLower.includes('design') ||
        roleLower.includes('ui') || roleLower.includes('ux') ||
        roleLower.includes('graphic') || roleLower.includes('visual')) {
      return 'design'
    }
    
    // Marketing roles
    if (roleLower.includes('marketing') || roleLower.includes('seo') ||
        roleLower.includes('social') || roleLower.includes('digital') ||
        roleLower.includes('brand') || roleLower.includes('growth')) {
      return 'marketing'
    }
    
    // Sales roles
    if (roleLower.includes('sales') || roleLower.includes('account') ||
        roleLower.includes('business development') || roleLower.includes('bd')) {
      return 'sales'
    }
    
    // Support roles
    if (roleLower.includes('support') || roleLower.includes('customer') ||
        roleLower.includes('help desk') || roleLower.includes('success')) {
      return 'support'
    }
    
    // Administrative roles
    if (roleLower.includes('admin') || roleLower.includes('assistant') ||
        roleLower.includes('coordinator') || roleLower.includes('office')) {
      return 'admin'
    }
    
    // Financial roles
    if (roleLower.includes('accounting') || roleLower.includes('finance') ||
        roleLower.includes('bookkeeper') || roleLower.includes('auditor')) {
      return 'finance'
    }
    
    // HR roles
    if (roleLower.includes('hr') || roleLower.includes('human resources') ||
        roleLower.includes('recruiter') || roleLower.includes('talent')) {
      return 'hr'
    }
    
    // Management roles
    if (roleLower.includes('manager') || roleLower.includes('lead') ||
        roleLower.includes('director') || roleLower.includes('head')) {
      return 'management'
    }
    
    // Project roles
    if (roleLower.includes('project') || roleLower.includes('scrum') ||
        roleLower.includes('product') || roleLower.includes('delivery')) {
      return 'project'
    }
    
    // Automation roles
    if (roleLower.includes('automation') || roleLower.includes('rpa') ||
        roleLower.includes('robotic') || roleLower.includes('process')) {
      return 'automation'
    }
    
    return 'general'
}

// Enhanced match score calculation using user input (role, industry) and candidate data (position, skills)
function calculateMatchScore(
  candidatePosition: string, 
  targetRole: string, 
  candidateSkills?: string[], 
  userIndustry?: string,
  candidateBio?: string
): number {
  const candidate = candidatePosition.toLowerCase().trim()
  const target = targetRole.toLowerCase().trim()
  
  let baseScore = 5 // Start with low score
  
  // Define role synonyms for better matching
  const roleSynonyms: Record<string, string[]> = {
    'human resources': ['hr', 'recruiter', 'recruitment', 'talent', 'people', 'hiring'],
    'hr': ['human resources', 'recruiter', 'recruitment', 'talent'],
    'developer': ['programmer', 'engineer', 'coder', 'software'],
    'designer': ['design', 'ui', 'ux', 'graphic', 'visual'],
    'marketing': ['digital marketing', 'seo', 'social media', 'content'],
    'sales': ['business development', 'account', 'salesperson'],
    'accountant': ['accounting', 'bookkeeper', 'finance', 'cpa'],
    'customer service': ['customer support', 'support', 'service', 'help desk'],
  }
  
  // Check for synonym matches
  const checkSynonymMatch = (role: string): boolean => {
    for (const [key, synonyms] of Object.entries(roleSynonyms)) {
      if (role.includes(key) || key.includes(role)) {
        return synonyms.some(syn => candidate.includes(syn))
      }
    }
    return false
  }
  
  // 1. DIRECT ROLE MATCH (Exact or substring match with user's input) - 100 points
  if (candidate === target || candidate.includes(target) || target.includes(candidate)) {
    baseScore = 100
  }
  // 1.5. SYNONYM MATCH - 80 points
  else if (checkSynonymMatch(target)) {
    baseScore = 80
    console.log(`   ✅ Synonym match found for "${target}" in "${candidate}"`)
  }
  // 2. PARTIAL WORD MATCH (Words from user's role input match candidate position) - 70 points
  else {
    // Extract meaningful words from user's role input
    const targetWords = target.split(' ').filter((w: string) => w.length > 2)
    const candidateWords = candidate.split(' ').filter((w: string) => w.length > 2)
    
    // Check if any words from user's input match candidate's position
    const hasWordMatch = targetWords.some((targetWord: string) => 
      candidateWords.some((candidateWord: string) => 
        targetWord.includes(candidateWord) || candidateWord.includes(targetWord)
      )
    )
    
    if (hasWordMatch) {
      baseScore = 70
    }
  }
  
  // 3. SKILL-BASED MATCHING - 65-85 points
  if (candidateSkills && candidateSkills.length > 0) {
    const targetRoleWords = target.split(' ').filter((w: string) => w.length > 2)
    const relevantSkills = candidateSkills.filter((skill: string) => 
      targetRoleWords.some((roleWord: string) => 
        skill.toLowerCase().includes(roleWord.toLowerCase()) || 
        roleWord.toLowerCase().includes(skill.toLowerCase())
      )
    )
    
    if (relevantSkills.length > 0) {
      const skillMatchScore = 65 + Math.min(relevantSkills.length * 5, 20)
      baseScore = Math.max(baseScore, skillMatchScore) // Take higher of category or skill score
    }
  }
  
  // 4. INDUSTRY BOOST (if user specified industry) - +10 points
  if (userIndustry && (candidateBio || candidatePosition)) {
    const industryLower = userIndustry.toLowerCase()
    const bioLower = (candidateBio || '').toLowerCase()
    const posLower = candidatePosition.toLowerCase()
    
    // Check if candidate has experience in the target industry
    if (bioLower.includes(industryLower) || posLower.includes(industryLower)) {
      baseScore = Math.min(baseScore + 10, 100) // Boost by 10 points, max 100
      console.log(`   ⬆️ Industry match boost: +10 (${userIndustry})`)
    }
  }
  
  return baseScore
}

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
    
    // Check if the role is too generic
    const genericRoles = ['team member', 'staff', 'employee', 'worker', 'professional', 'person', 'role']
    const isGenericRole = genericRoles.some(generic => role.toLowerCase().trim() === generic)
    
    if (isGenericRole) {
      console.log(`⚠️ Role "${role}" is too generic. Returning empty results.`);
      return NextResponse.json({
        role,
        level,
        recommendedCandidates: [],
        averageSalary: 0,
        totalCandidates: 0,
        message: 'Please provide a more specific role (e.g., "Developer", "Designer", "Marketing Manager")'
      });
    }

    // Fetch BPOC data directly from database with comprehensive error handling
    let bpocEmployees: BPOCUser[] = []
    try {
      console.log('🔍 BPOC Candidates API: Attempting to fetch from database...');
      
      // Database URL is already configured and working (as seen in we-got-talent page)
      
      const { fetchBPOCUsersFromDatabase } = await import('@/lib/bpoc-database')
      
      console.log('📋 BPOC Candidates API: Database module imported successfully');
      
      const bpocUsers = await fetchBPOCUsersFromDatabase()
      
      console.log(`📋 BPOC Candidates API: Raw database result: ${bpocUsers.length} users`);
      
      // Convert to BPOCUser format with null checks
      bpocEmployees = bpocUsers.map(user => ({
        user_id: user.user_id || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        full_name: user.full_name || '',
        location: user.location || '',
        avatar_url: user.avatar_url || null,
        bio: user.bio || null,
        position: user.position || null,
        current_position: user.current_position || null,
        expected_salary: user.expected_salary || null,
        work_status_completed: user.work_status_completed || false,
        overall_score: user.overall_score || 0,
        skills_snapshot: user.skills_snapshot || [],
        experience_snapshot: user.experience_snapshot || []
      }))
      
      console.log(`📋 BPOC Candidates API: Converted ${bpocEmployees.length} employees for matching`);
      
      // Debug: Log sample of employees
      if (bpocEmployees.length > 0) {
        console.log('🔍 Sample employees from database:', bpocEmployees.slice(0, 3).map(emp => ({
          name: emp.full_name,
          position: emp.current_position || emp.position,
          salary: emp.expected_salary,
          workStatus: emp.work_status_completed
        })));
      } else {
        console.log('⚠️ No employees found in database!');
      }
      
    } catch (error) {
      console.error('❌ Error fetching BPOC data from database:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      
      // Return empty results instead of error to prevent 500
      console.log('⚠️ Returning empty results due to database error');
      
      // For development/testing, you can uncomment this to return some mock data
      // const mockCandidates: CandidateRecommendation[] = [
      //   {
      //     id: 'mock-1',
      //     name: 'John Developer',
      //     position: 'Software Developer',
      //     expectedSalary: 50000,
      //     experience: '3 years experience',
      //     skills: ['JavaScript', 'React', 'Node.js'],
      //     overallScore: 85,
      //     matchScore: 90,
      //     isRecommended: true
      //   }
      // ];
      
      const result: JobPositionMatch = {
        role,
        level,
        recommendedCandidates: [],
        averageSalary: 0,
        totalCandidates: 0
      };
      
      return NextResponse.json(result);
    }

    // Filter candidates - be more inclusive to show more candidates like user dashboard
    const activeCandidates = bpocEmployees.filter(emp => {
      const name = emp.full_name?.toLowerCase() || ''
      const position = (emp.current_position || emp.position || '').toLowerCase()
      const skills = emp.skills_snapshot || []
      
      // Exclude test/mock/fake data - COMPREHENSIVE FILTERING
      if (name.includes('shoreagents') || 
          name.includes('test') || 
          name.includes('mock') ||
          name.includes('cthulhu') ||
          name.includes('cult') ||
          name.includes('argel john') ||
          name.includes('charmine') ||
          name.includes('charm salas') ||
          name.includes('ron paulo') ||
          name.includes('r m') ||
          name === 'r m' ||
          position.includes('robber') ||
          position.includes('test') ||
          position.includes('mock') ||
          position.includes('cthulhu') ||
          position.includes('cult') ||
          position.includes('president') ||
          position.includes('coo') ||
          position.includes('nurse') ||
          position.includes('unknown')) {
        console.log(`🚫 Excluding test/mock candidate: ${emp.full_name} - ${position}`)
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
      
      // Include candidates with a valid position title (salary is optional for matching)
      if (emp.position || emp.current_position) {
        return true
      }
      
      return false
    })
    
    console.log(`✅ BPOC Candidates API: Found ${activeCandidates.length} active candidates with salary data`);
    
    // Debug: Log sample of active candidates
    if (activeCandidates.length > 0) {
      console.log('🔍 Sample active candidates:', activeCandidates.slice(0, 3).map(emp => ({
        name: emp.full_name,
        position: emp.current_position || emp.position,
        salary: emp.expected_salary,
        workStatus: emp.work_status_completed
      })));
    } else {
      console.log('⚠️ No active candidates after filtering!');
    }
    
    // Calculate match scores based on position, description, and skills only
    const candidatesWithScores = activeCandidates
      .map(candidate => {
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
        
        // Pass user industry and candidate bio for better matching
        let matchScore = calculateMatchScore(
          positionForMatching, 
          role,
          candidateSkills,
          industry, // User's industry input
          candidate.bio || undefined // Candidate's bio
        )
        
        // Boost score based on relevant skills (max +15 points)
        const roleKeywords = role.toLowerCase().split(' ')
        const relevantSkillsCount = candidateSkills.filter((skill: string) => 
          roleKeywords.some((keyword: string) => 
            skill.toLowerCase().includes(keyword) || keyword.includes(skill.toLowerCase())
          )
        ).length
        
        if (relevantSkillsCount > 0) {
          const skillBoost = Math.min(relevantSkillsCount * 5, 15)
          matchScore = Math.min(matchScore + skillBoost, 100)
          console.log(`⬆️ Boosted ${candidate.full_name} by ${skillBoost} points for ${relevantSkillsCount} relevant skills`)
        }
        
        // Boost score for candidates with high overall scores (quality indicator)
        if (candidate.overall_score && candidate.overall_score >= 70) {
          matchScore = Math.min(matchScore + 5, 100)
        }
        
        // Debug: Log matching details for first few candidates
        if (activeCandidates.indexOf(candidate) < 3) {
          console.log(`🔍 Matching candidate: ${candidate.full_name}`, {
            position: positionForMatching,
            targetRole: role,
            matchScore,
            skills: candidateSkills.slice(0, 3).join(', '),
            avatarUrl: candidate.avatar_url
          });
        }
        
        // Experience level removed - only focus on position, description, and skills
        const highMatchScore = matchScore >= 81  // Very strict for high matches to avoid mismatches
        const similarPosition = matchScore >= 60  // Much stricter for similar positions
        const isCompletelyUnrelated = matchScore < 50  // Much stricter to exclude irrelevant roles
        
        if (isCompletelyUnrelated) {
          return null
        }
        
        // Only match based on role/position and skills - no experience level filtering
        if (highMatchScore || similarPosition) {
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
            isRecommended: matchScore >= 81 && (candidate.overall_score || 0) >= 50,
            avatar: candidate.avatar_url && candidate.avatar_url.trim() !== '' 
              ? (candidate.avatar_url.startsWith('http') 
                  ? candidate.avatar_url 
                  : `https://${candidate.avatar_url}`)
              : null
          } as CandidateRecommendation
        }
        
        return null
      })
      .filter((candidate): candidate is CandidateRecommendation => candidate !== null)
    
    // Group candidates by match score ranges for diversity
    const excellentMatches = candidatesWithScores.filter(c => c.matchScore >= 81)
    const goodMatches = candidatesWithScores.filter(c => c.matchScore >= 60 && c.matchScore < 81)
    const fairMatches = candidatesWithScores.filter(c => c.matchScore >= 50 && c.matchScore < 60)
    
    console.log(`📊 Match distribution - Excellent: ${excellentMatches.length}, Good: ${goodMatches.length}, Fair: ${fairMatches.length}`);
    
    // Sort each group by overall score and add slight randomization for diversity
    const sortWithDiversity = (candidates: CandidateRecommendation[]) => {
      return candidates.sort((a, b) => {
        // Primary sort: overall score
        const scoreDiff = b.overallScore - a.overallScore
        // Add slight randomization (±5 points) to prevent always showing same candidates
        const randomFactor = (Math.random() - 0.5) * 10
        return scoreDiff + randomFactor
      })
    }
    
    sortWithDiversity(excellentMatches)
    sortWithDiversity(goodMatches)
    sortWithDiversity(fairMatches)
    
    // Build diverse recommendation pool:
    // - Take top excellent matches (prioritized)
    // - Mix in good matches for variety
    // - Add fair matches if needed
    const recommendedCandidates = [
      ...excellentMatches.slice(0, 10),      // Top 10 excellent matches
      ...goodMatches.slice(0, 6),            // 6 good matches for variety
      ...fairMatches.slice(0, 4),            // 4 fair matches as alternatives
    ].slice(0, 20) // Cap at 20 total
    
    console.log(`📋 BPOC Candidates API: ${candidatesWithScores.length} candidates with scores, top 10: ${recommendedCandidates.length}`);
    
    // Debug: Log sample of recommended candidates before final filtering
    if (recommendedCandidates.length > 0) {
      console.log('🔍 Sample recommended candidates before final filtering:', recommendedCandidates.slice(0, 3).map(c => ({
        name: c.name,
        position: c.position,
        matchScore: c.matchScore,
        expectedSalary: c.expectedSalary
      })));
    }
    
    // Apply final relevance filtering (much stricter matching for better results)
    const finalFilteredCandidates = recommendedCandidates.filter(c => {
      // Much higher match score threshold to exclude irrelevant candidates
      if (c.matchScore < 60) return false
      
      // Use user's actual input to filter - NO hardcoded categories
      const candidatePos = c.position.toLowerCase()
      const targetRole = role.toLowerCase()
      
      // Extract meaningful words from USER'S role input
      const targetWords = targetRole.split(' ').filter((w: string) => w.length > 2)
      const candidateWords = candidatePos.split(' ').filter((w: string) => w.length > 2)
      
      // Check if user's role words match candidate position
      const hasPositionMatch = candidatePos.includes(targetRole) || 
                              targetRole.includes(candidatePos) ||
                              targetWords.some((targetWord: string) => 
                                candidateWords.some((candidateWord: string) => 
                                  targetWord.includes(candidateWord) || candidateWord.includes(candidateWord)
                                )
                              )
      
      // Check if candidate has skills matching user's role input
      const hasRelevantSkills = c.skills && c.skills.length > 0 && c.skills.some((skill: string) => 
        targetWords.some((roleWord: string) => 
          skill.toLowerCase().includes(roleWord.toLowerCase()) || 
          roleWord.toLowerCase().includes(skill.toLowerCase())
        )
      )
      
      // Much higher threshold for high match scores
      const hasHighMatchScore = c.matchScore >= 80
      
      // Include if: High match score OR (position match AND skills match)
      // This ensures we only get candidates relevant to USER'S actual input
      return hasHighMatchScore || (hasPositionMatch && hasRelevantSkills)
    })
    
    console.log(`📋 BPOC Candidates API: Final filtering - ${recommendedCandidates.length} candidates → ${finalFilteredCandidates.length} final matches`);
    
    // Debug: Log why candidates are being filtered out
    if (finalFilteredCandidates.length === 0 && recommendedCandidates.length > 0) {
      console.log('🔍 Debug: Why candidates are being filtered out:');
      recommendedCandidates.slice(0, 3).forEach(c => {
        const candidatePos = c.position.toLowerCase()
        const targetRole = role.toLowerCase()
        const targetCategory = getRoleCategory(targetRole)
        const candidateCategory = getRoleCategory(candidatePos)
        
        console.log(`  - ${c.name} (${c.position}):`, {
          matchScore: c.matchScore,
          targetRole,
          candidatePos,
          targetCategory,
          candidateCategory,
          includesTarget: candidatePos.includes(targetRole),
          targetIncludesCandidate: targetRole.includes(candidatePos),
          categoryMatch: targetCategory === candidateCategory
        });
      });
    }
    
    // If no matches found, return empty results (no fallback data)
    if (finalFilteredCandidates.length === 0) {
      console.log(`⚠️ No matches found for ${role}, returning empty results`);
      
      const result: JobPositionMatch = {
        role,
        level,
        recommendedCandidates: [],
        averageSalary: 0,
        totalCandidates: 0
      };
      
      return NextResponse.json(result);
    }
    
    // Calculate average salary from filtered matches only
    const averageSalary = finalFilteredCandidates.length > 0 
      ? Math.round(finalFilteredCandidates.reduce((sum, c) => sum + c.expectedSalary, 0) / finalFilteredCandidates.length)
      : 0

    const result: JobPositionMatch = {
      role,
      level,
      recommendedCandidates: finalFilteredCandidates,
      averageSalary,
      totalCandidates: finalFilteredCandidates.length
    };

    console.log(`🎯 BPOC Candidates API Result:`, {
      role,
      level,
      candidateCount: finalFilteredCandidates.length,
      averageSalary,
      candidates: finalFilteredCandidates.map(c => `${c.name} (${c.position}) - ₱${c.expectedSalary} - ${c.matchScore}% match - Avatar: ${c.avatar || 'None'}`)
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
