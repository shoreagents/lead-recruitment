import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    console.log('🔍 Testing database tables for data...')
    
    // Check users table
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users')
    const userCount = usersResult.rows[0].count
    
    // Check typing_hero_sessions table
    const typingResult = await pool.query('SELECT COUNT(*) as count FROM typing_hero_sessions')
    const typingCount = typingResult.rows[0].count
    
    // Check saved_resumes table
    const resumesResult = await pool.query('SELECT COUNT(*) as count FROM saved_resumes')
    const resumesCount = resumesResult.rows[0].count
    
    // Check if there are any completed game sessions
    const completedGamesResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM typing_hero_sessions 
      WHERE finished_at IS NOT NULL
    `)
    const completedGamesCount = completedGamesResult.rows[0].count
    
    // Get a sample of recent activity
    const sampleActivityResult = await pool.query(`
      SELECT 
        u.full_name,
        ths.finished_at,
        ths.wpm
      FROM typing_hero_sessions ths
      JOIN users u ON ths.user_id = u.id
      WHERE ths.finished_at IS NOT NULL
      ORDER BY ths.finished_at DESC
      LIMIT 3
    `)
    
    return NextResponse.json({
      table_counts: {
        users: userCount,
        typing_hero_sessions: typingCount,
        saved_resumes: resumesCount,
        completed_games: completedGamesCount
      },
      sample_activity: sampleActivityResult.rows,
      message: 'Database test completed'
    })
    
  } catch (error) {
    console.error('❌ Error testing database:', error)
    return NextResponse.json({ 
      error: 'Database test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
