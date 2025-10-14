import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  try {
    const { rows } = await pool.query(
      `SELECT 
         id,
         session_id as "sessionId",
         overall_score as "overallScore",
         ats_compatibility_score as "atsCompatibility",
         content_quality_score as "contentQuality",
         professional_presentation_score as "professionalPresentation",
         skills_alignment_score as "skillsAlignment",
         key_strengths as "keyStrengths",
         strengths_analysis as "strengthsAnalysis",
         improvements,
         recommendations,
         improved_summary as "improvedSummary",
         salary_analysis as "salaryAnalysis",
         career_path as "careerPath",
         section_analysis as "sectionAnalysis",
         portfolio_links as "portfolioLinks",
         files_analyzed as "filesAnalyzed",
         candidate_profile as "candidateProfile",
         skills_snapshot as "skillsSnapshot",
         experience_snapshot as "experienceSnapshot",
         education_snapshot as "educationSnapshot",
         created_at as "createdAt",
         updated_at as "updatedAt"
       FROM ai_analysis_results
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 1`,
      [userId]
    )
    if (rows.length === 0) return NextResponse.json({ found: false })
    return NextResponse.json({ found: true, analysis: rows[0] })
  } catch (e) {
    console.error('Failed to fetch public analysis', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}


