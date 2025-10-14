import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if user is admin
    const adminQuery = `
      SELECT id FROM users 
      WHERE id = $1 AND admin_level = 'admin'
    `
    const adminResult = await pool.query(adminQuery, [userId])
    
    if (adminResult.rows.length === 0) {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 })
    }

    // Get dashboard statistics
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM resumes) as total_resumes,
        (SELECT COUNT(*) FROM typing_hero_results) + 
        (SELECT COUNT(*) FROM logic_grid_results) as total_games,
        (SELECT COUNT(*) FROM disc_personality_results) + 
        (SELECT COUNT(*) FROM communication_skills_results) as total_assessments
    `
    const statsResult = await pool.query(statsQuery)
    const stats = statsResult.rows[0]

    // Get recent admin activity
    const activityQuery = `
      SELECT aal.*, u.full_name as admin_name
      FROM admin_activity_logs aal
      JOIN users u ON aal.user_id = u.id
      ORDER BY aal.created_at DESC
      LIMIT 10
    `
    const activityResult = await pool.query(activityQuery)

    return NextResponse.json({
      total_users: parseInt(stats.total_users),
      total_resumes: parseInt(stats.total_resumes),
      total_games: parseInt(stats.total_games),
      total_assessments: parseInt(stats.total_assessments),
      recent_activity: activityResult.rows
    })
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 