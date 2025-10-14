import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('🔍 API: Fetching resume slug for user:', userId)

    // Query to get the most recent resume slug for the user
    const query = `
      SELECT resume_slug 
      FROM saved_resumes 
      WHERE user_id = $1 
      ORDER BY updated_at DESC 
      LIMIT 1
    `
    
    const result = await pool.query(query, [userId])

    if (result.rows.length === 0) {
      console.log('❌ API: No resume found for user:', userId)
      return NextResponse.json({ resumeSlug: null })
    }

    const resumeSlug = result.rows[0].resume_slug
    console.log('✅ API: Resume slug found:', resumeSlug)

    return NextResponse.json({ resumeSlug })
  } catch (error) {
    console.error('❌ API: Error fetching resume slug:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 })
  }
}
