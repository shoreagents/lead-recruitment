import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    const client = await pool.connect()
    
    try {
      // Test 1: Check users table
      const usersResult = await client.query('SELECT COUNT(*) as user_count FROM users')
      console.log('👥 Users count:', usersResult.rows[0].user_count)
      
      // Test 2: Check typing_hero_sessions table
      const typingHeroResult = await client.query('SELECT COUNT(*) as session_count FROM typing_hero_sessions WHERE finished_at IS NOT NULL')
      console.log('🎮 Typing Hero sessions count:', typingHeroResult.rows[0].session_count)
      
      // Test 3: Check saved_resumes table
      const resumesResult = await client.query('SELECT COUNT(*) as resume_count FROM saved_resumes')
      console.log('📄 Saved resumes count:', resumesResult.rows[0].resume_count)
      
      // Test 4: Check applications table
      const applicationsResult = await client.query('SELECT COUNT(*) as application_count FROM applications')
      console.log('📝 Applications count:', applicationsResult.rows[0].application_count)
      
      // Test 5: Get sample data from each table
      const sampleData = {
        users: [],
        typing_hero: [],
        resumes: [],
        applications: []
      }
      
      // Sample users
      const usersSample = await client.query('SELECT id, full_name, created_at FROM users ORDER BY created_at DESC LIMIT 3')
      sampleData.users = usersSample.rows
      
      // Sample typing hero sessions
      const typingHeroSample = await client.query('SELECT user_id, wpm, finished_at FROM typing_hero_sessions WHERE finished_at IS NOT NULL ORDER BY finished_at DESC LIMIT 3')
      sampleData.typing_hero = typingHeroSample.rows
      
      // Sample resumes
      const resumesSample = await client.query('SELECT user_id, resume_title, updated_at FROM saved_resumes ORDER BY updated_at DESC LIMIT 3')
      sampleData.resumes = resumesSample.rows
      
      // Sample applications
      const applicationsSample = await client.query('SELECT user_id, job_id, created_at FROM applications ORDER BY created_at DESC LIMIT 3')
      sampleData.applications = applicationsSample.rows
      
      return NextResponse.json({
        counts: {
          users: usersResult.rows[0].user_count,
          typing_hero_sessions: typingHeroResult.rows[0].session_count,
          saved_resumes: resumesResult.rows[0].resume_count,
          applications: applicationsResult.rows[0].application_count
        },
        sample_data: sampleData
      })
      
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error testing activity data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
