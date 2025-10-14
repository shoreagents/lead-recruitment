import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting to fetch resumes...')
    
    // Query saved_resumes with user information
    const result = await pool.query(`
      SELECT 
        sr.id,
        sr.user_id,
        sr.resume_title,
        sr.resume_slug,
        sr.resume_data,
        sr.template_used,
        sr.view_count,
        sr.created_at,
        sr.updated_at,
        u.full_name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM saved_resumes sr
      LEFT JOIN users u ON sr.user_id = u.id
      ORDER BY sr.created_at DESC
    `)

    console.log('API: Raw resumes data:', result.rows)
    console.log('API: Number of resumes found:', result.rows.length)

    // Debug: Check the first resume's data structure
    if (result.rows.length > 0) {
      const firstResume = result.rows[0]
      console.log('API: First resume ID:', firstResume.id)
      console.log('API: First resume data type:', typeof firstResume.resume_data)
      console.log('API: First resume data keys:', firstResume.resume_data ? Object.keys(firstResume.resume_data) : 'null')
      console.log('API: First resume data sample:', firstResume.resume_data ? JSON.stringify(firstResume.resume_data).substring(0, 200) + '...' : 'null')
    }

    const transformedResumes = result.rows.map((resume: any) => ({
      id: resume.id,
      user_id: resume.user_id,
      resume_title: resume.resume_title || 'Untitled Resume',
      resume_slug: resume.resume_slug,
      template_used: resume.template_used || 'Default',
      view_count: resume.view_count || 0,
      created_at: resume.created_at,
      updated_at: resume.updated_at,
      user_name: resume.user_name || 'Unknown User',
      user_email: resume.user_email || 'No email',
      user_avatar: resume.user_avatar
    }))

    return NextResponse.json({
      resumes: transformedResumes,
      total: transformedResumes.length,
      totalViews: transformedResumes.reduce((sum: number, r: any) => sum + r.view_count, 0),
      uniqueTemplates: new Set(transformedResumes.map((r: any) => r.template_used)).size
    })

  } catch (error) {
    console.error('Error in resumes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, resumeId, ...data } = body

    switch (action) {
      case 'update':
        const updateResult = await pool.query(
          'UPDATE resumes SET title = $1, status = $2, updated_at = NOW() WHERE id = $3',
          [data.title, data.status, resumeId]
        )

        if (updateResult.rowCount === 0) {
          return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Resume updated successfully' })

      case 'delete':
        const deleteResult = await pool.query(
          'DELETE FROM resumes WHERE id = $1',
          [resumeId]
        )

        if (deleteResult.rowCount === 0) {
          return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Resume deleted successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error in resumes API POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 