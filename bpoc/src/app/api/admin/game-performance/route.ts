import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      const { searchParams } = new URL(request.url)
      const range = (searchParams.get('range') || '30d').toLowerCase()
      const rangeToDays: Record<string, number | 'all'> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
        '365d': 365,
        'all': 'all'
      }
      const days = rangeToDays[range] ?? 30
      
      // For now, let's get all-time counts to fix the immediate issue
      // We can add time filtering later once we confirm the basic query works
      const userCountsQuery = `
        SELECT 
          'typing-hero' as game_type,
          COUNT(DISTINCT user_id) as user_count,
          'Typing Hero' as display_name,
          'Users playing typing speed game' as description
        FROM typing_hero_sessions
        WHERE user_id IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'disc-personality' as game_type,
          COUNT(DISTINCT user_id) as user_count,
          'BPOC DISC' as display_name,
          'Users taking DISC personality assessment' as description
        FROM disc_personality_sessions
        WHERE user_id IS NOT NULL
        
        ORDER BY user_count DESC
      `
      
      const result = await client.query(userCountsQuery)
      
      const gamePerformance = result.rows.map((row: any) => ({
        gameType: row.game_type,
        displayName: row.display_name,
        userCount: parseInt(row.user_count) || 0,
        description: row.description
      }))

      console.log('Game user counts:', gamePerformance)
      
      return NextResponse.json({ game_performance: gamePerformance })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching game user counts:', error)
    return NextResponse.json({ 
      game_performance: [],
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
