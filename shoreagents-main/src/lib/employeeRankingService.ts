// Employee Ranking Service - Manages employee ranking and URL generation
import { CandidateRecommendation } from './bpocPricingService';

export interface RankedEmployee {
  id: string;
  name: string;
  position: string;
  overallScore: number;
  matchScore: number;
  rank: number;
  url: string;
}

// Rank employees by their overall score (highest to lowest)
export function rankEmployeesByScore(candidates: CandidateRecommendation[]): RankedEmployee[] {
  // Sort candidates by overall score (highest first), then by match score as tiebreaker
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    return b.matchScore - a.matchScore;
  });

  // Assign ranks and generate URLs
  return sortedCandidates.map((candidate, index) => ({
    id: candidate.id,
    name: candidate.name,
    position: candidate.position,
    overallScore: candidate.overallScore,
    matchScore: candidate.matchScore,
    rank: index + 1,
    url: `/employee/${candidate.id}`
  }));
}

// Get employee rank by ID
export function getEmployeeRank(employeeId: string, rankedEmployees: RankedEmployee[]): number {
  const employee = rankedEmployees.find(emp => emp.id === employeeId);
  return employee ? employee.rank : 0;
}

// Get top N employees
export function getTopEmployees(rankedEmployees: RankedEmployee[], count: number): RankedEmployee[] {
  return rankedEmployees.slice(0, count);
}

// Get employees by score range
export function getEmployeesByScoreRange(
  rankedEmployees: RankedEmployee[], 
  minScore: number, 
  maxScore: number
): RankedEmployee[] {
  return rankedEmployees.filter(emp => 
    emp.overallScore >= minScore && emp.overallScore <= maxScore
  );
}

// Get employees by tier
export function getEmployeesByTier(rankedEmployees: RankedEmployee[], tier: 'GOLD' | 'SILVER' | 'BRONZE'): RankedEmployee[] {
  const scoreRanges = {
    GOLD: { min: 80, max: 100 },
    SILVER: { min: 60, max: 79 },
    BRONZE: { min: 0, max: 59 }
  };

  const range = scoreRanges[tier];
  return getEmployeesByScoreRange(rankedEmployees, range.min, range.max);
}

// Generate employee statistics
export function generateEmployeeStats(rankedEmployees: RankedEmployee[]) {
  const total = rankedEmployees.length;
  const goldCount = getEmployeesByTier(rankedEmployees, 'GOLD').length;
  const silverCount = getEmployeesByTier(rankedEmployees, 'SILVER').length;
  const bronzeCount = getEmployeesByTier(rankedEmployees, 'BRONZE').length;
  
  const averageScore = total > 0 
    ? Math.round(rankedEmployees.reduce((sum, emp) => sum + emp.overallScore, 0) / total)
    : 0;

  return {
    total,
    goldCount,
    silverCount,
    bronzeCount,
    averageScore,
    topPerformer: rankedEmployees[0] || null
  };
}
