import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  // Check if user is admin (you can add more admin validation here)
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await pool.connect()
    try {
      // Get overall game statistics
      const overallStatsSql = `
        SELECT 
          COUNT(DISTINCT user_id) as total_players,
          COUNT(*) as total_sessions,
          AVG(avg_us_score) as overall_avg_us,
          AVG(avg_uk_score) as overall_avg_uk,
          AVG(avg_au_score) as overall_avg_au,
          AVG(avg_ca_score) as overall_avg_ca,
          AVG(best_survival_status) as overall_best_survival,
          AVG(best_average_score) as overall_best_avg_score
        FROM bpoc_cultural_stats
      `
      const overallResult = await client.query(overallStatsSql)

      // Get top performers
      const topPerformersSql = `
        SELECT 
          u.full_name,
          u.email,
          bcs.current_tier,
          bcs.best_average_score,
          bcs.best_survival_status,
          bcs.total_sessions,
          bcs.last_played_at
        FROM bpoc_cultural_stats bcs
        JOIN users u ON bcs.user_id = u.id
        ORDER BY bcs.best_average_score DESC, bcs.best_survival_status DESC
        LIMIT 20
      `
      const topPerformersResult = await client.query(topPerformersSql)

      // Get tier distribution
      const tierDistributionSql = `
        SELECT 
          current_tier,
          COUNT(*) as player_count
        FROM bpoc_cultural_stats
        WHERE current_tier IS NOT NULL
        GROUP BY current_tier
        ORDER BY player_count DESC
      `
      const tierDistributionResult = await client.query(tierDistributionSql)

      // Get recent activity
      const recentActivitySql = `
        SELECT 
          u.full_name,
          u.email,
          bcs.last_played_at,
          bcs.current_tier,
          bcs.total_sessions
        FROM bpoc_cultural_stats bcs
        JOIN users u ON bcs.user_id = u.id
        WHERE bcs.last_played_at IS NOT NULL
        ORDER BY bcs.last_played_at DESC
        LIMIT 20
      `
      const recentActivityResult = await client.query(recentActivitySql)

      return NextResponse.json({
        success: true,
        overallStats: overallResult.rows[0],
        topPerformers: topPerformersResult.rows,
        tierDistribution: tierDistributionResult.rows,
        recentActivity: recentActivityResult.rows
      })

    } finally {
      client.release()
    }

  } catch (e) {
    console.error('Failed to fetch BPOC Cultural admin stats', e)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
