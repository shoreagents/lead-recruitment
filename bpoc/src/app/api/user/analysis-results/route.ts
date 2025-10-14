import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const client = await pool.connect()
    try {
      let query = `
        SELECT 
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
      `
      const params: any[] = [userId]
      if (sessionId) {
        // If we store only one row per user, sessionId filter is informational.
        // Keep compatibility by ignoring extra rows and returning the single row.
      }
      query += ' ORDER BY updated_at DESC LIMIT 1'

      const { rows } = await client.query(query, params)
      if (rows.length === 0) {
        return NextResponse.json({ found: false })
      }

      return NextResponse.json({ found: true, analysis: rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ GET /api/user/analysis-results error:', error)
    return NextResponse.json({ error: 'Failed to load analysis results' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      await client.query('DELETE FROM ai_analysis_results WHERE user_id = $1', [userId])
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear analysis results' }, { status: 500 })
  }
}


