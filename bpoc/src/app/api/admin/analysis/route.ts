import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting to fetch AI analysis results...')
    
    // Query ai_analysis_results with user information
    const result = await pool.query(`
      SELECT 
        aar.id,
        aar.user_id,
        aar.overall_score,
        aar.ats_compatibility_score,
        aar.content_quality_score,
        aar.professional_presentation_score,
        aar.skills_alignment_score,
        aar.improved_summary,
        aar.key_strengths,
        aar.strengths_analysis,
        aar.salary_analysis,
        aar.career_path,
        aar.section_analysis,
        aar.created_at,
        aar.updated_at,
        u.full_name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM ai_analysis_results aar
      LEFT JOIN users u ON aar.user_id = u.id
      ORDER BY aar.created_at DESC
    `)

    console.log('API: Raw analysis data:', result.rows)
    console.log('API: Number of analyses found:', result.rows.length)

    const transformedAnalyses = result.rows.map((analysis: any) => ({
      id: analysis.id,
      user_id: analysis.user_id,
      overall_score: analysis.overall_score || 0,
      ats_compatibility_score: analysis.ats_compatibility_score || 0,
      content_quality_score: analysis.content_quality_score || 0,
      professional_presentation_score: analysis.professional_presentation_score || 0,
      skills_alignment_score: analysis.skills_alignment_score || 0,
      improved_summary: analysis.improved_summary || '',
      key_strengths: analysis.key_strengths || [],
      strengths_analysis: analysis.strengths_analysis || {},
      salary_analysis: analysis.salary_analysis || {},
      career_path: analysis.career_path || {},
      section_analysis: analysis.section_analysis || {},
      created_at: analysis.created_at,
      updated_at: analysis.updated_at,
      user_name: analysis.user_name || 'Unknown User',
      user_email: analysis.user_email || 'No email',
      user_avatar: analysis.user_avatar
    }))

    return NextResponse.json({
      analyses: transformedAnalyses,
      total: transformedAnalyses.length,
      averageScore: transformedAnalyses.length > 0 
        ? Math.round(transformedAnalyses.reduce((sum: number, a: any) => sum + a.overall_score, 0) / transformedAnalyses.length)
        : 0
    })

  } catch (error) {
    console.error('Error in analysis API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, analysisId, ...data } = body

    switch (action) {
      case 'update':
        const updateResult = await pool.query(
          'UPDATE ai_analysis_results SET updated_at = NOW() WHERE id = $1',
          [analysisId]
        )

        if (updateResult.rowCount === 0) {
          return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Analysis updated successfully' })

      case 'delete':
        const deleteResult = await pool.query(
          'DELETE FROM ai_analysis_results WHERE id = $1',
          [analysisId]
        )

        if (deleteResult.rowCount === 0) {
          return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Analysis deleted successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error in analysis API POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
