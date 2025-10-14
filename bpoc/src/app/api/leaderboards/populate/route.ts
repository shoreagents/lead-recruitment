import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Populating leaderboard data...')
    
    // First check if the table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_leaderboard_scores'
      )
    `)
    
    if (!tableExists.rows[0]?.exists) {
      return NextResponse.json({
        success: false,
        error: 'user_leaderboard_scores table does not exist',
        action: 'Run the complete_leaderboard_setup.sql script first'
      }, { status: 400 })
    }
    
    // Check if the function exists
    const functionExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name = 'update_all_leaderboard_scores'
      )
    `)
    
    if (!functionExists.rows[0]?.exists) {
      return NextResponse.json({
        success: false,
        error: 'update_all_leaderboard_scores function does not exist',
        action: 'Run the complete_leaderboard_setup.sql script first'
      }, { status: 400 })
    }
    
    // Get current user count
    const beforeCount = await pool.query(`
      SELECT COUNT(*) as count FROM user_leaderboard_scores
    `)
    
    console.log('📊 Current leaderboard entries:', beforeCount.rows[0]?.count)
    
    // Run the function to populate/update all scores
    console.log('🔄 Running update_all_leaderboard_scores()...')
    await pool.query('SELECT update_all_leaderboard_scores()')
    
    // Get new user count
    const afterCount = await pool.query(`
      SELECT COUNT(*) as count FROM user_leaderboard_scores
    `)
    
    // Get sample of populated data
    const sampleData = await pool.query(`
      SELECT 
        user_id, overall_score, tier, rank_position,
        typing_hero_score, disc_personality_score, profile_completion_score,
        resume_building_score, application_activity_score
      FROM user_leaderboard_scores 
      ORDER BY overall_score DESC 
      LIMIT 5
    `)
    
    console.log('✅ Leaderboard data populated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Leaderboard data populated successfully',
      beforeCount: Number(beforeCount.rows[0]?.count || 0),
      afterCount: Number(afterCount.rows[0]?.count || 0),
      sampleData: sampleData.rows,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Populate error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to populate leaderboard data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
