import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking leaderboard system status...')
    
    // Check if the new table exists and has data
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_leaderboard_scores'
      )
    `)
    
    if (!tableExists.rows[0]?.exists) {
      return NextResponse.json({
        status: 'error',
        message: 'user_leaderboard_scores table does not exist',
        action: 'Run the complete_leaderboard_setup.sql script first'
      })
    }
    
    // Check if table has data
    const dataCount = await pool.query(`
      SELECT COUNT(*) as count FROM user_leaderboard_scores
    `)
    
    const userCount = Number(dataCount.rows[0]?.count || 0)
    
    if (userCount === 0) {
      return NextResponse.json({
        status: 'empty',
        message: 'user_leaderboard_scores table is empty',
        action: 'Run update_all_leaderboard_scores() function to populate data',
        userCount: 0
      })
    }
    
    // Get sample data
    const sampleData = await pool.query(`
      SELECT 
        user_id, overall_score, tier, rank_position,
        typing_hero_score, disc_personality_score, profile_completion_score,
        resume_building_score, application_activity_score
      FROM user_leaderboard_scores 
      ORDER BY overall_score DESC 
      LIMIT 3
    `)
    
    return NextResponse.json({
      status: 'ready',
      message: 'Leaderboard system is ready',
      userCount,
      sampleData: sampleData.rows,
      system: 'new_unified'
    })
    
  } catch (error) {
    console.error('❌ Status check error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check leaderboard status',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
