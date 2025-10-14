import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const category: 'game' | 'applicants' | 'engagement' | 'overall' = body.category
    const userId: string = body.userId
    const period: 'weekly' | 'monthly' | 'all' = body.period || 'all'
    const gameId: string | undefined = body.gameId

    if (!category || !userId) {
      return NextResponse.json({ error: 'category and userId are required' }, { status: 400 })
    }

    switch (category) {
      case 'game': {
        if (!gameId || !period) {
          return NextResponse.json({ error: 'gameId and period are required for game category' }, { status: 400 })
        }
        await pool.query(
          `DELETE FROM leaderboard_game_scores WHERE user_id = $1 AND game_id = $2 AND period = $3`,
          [userId, gameId, period]
        )
        break
      }
      case 'applicants': {
        await pool.query(`DELETE FROM leaderboard_applicant_scores WHERE user_id = $1 AND period = 'all'`, [userId])
        break
      }
      case 'engagement': {
        await pool.query(`DELETE FROM leaderboard_engagement_scores WHERE user_id = $1 AND period = 'all'`, [userId])
        break
      }
      case 'overall': {
        await pool.query(`DELETE FROM leaderboard_overall_scores WHERE user_id = $1`, [userId])
        break
      }
      default:
        return NextResponse.json({ error: 'Unknown category' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin leaderboard delete failed:', e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}


