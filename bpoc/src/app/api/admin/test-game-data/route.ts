import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(_request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      // Check typing_hero_sessions
      const typingHeroQuery = `
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN finished_at IS NOT NULL THEN 1 END) as completed_sessions,
          COUNT(CASE WHEN finished_at IS NOT NULL AND wpm IS NOT NULL THEN 1 END) as sessions_with_wpm
        FROM typing_hero_sessions
      `
      const typingHeroResult = await client.query(typingHeroQuery)
      
      // Check bpoc_cultural_stats
      const bpocCulturalQuery = `
        SELECT 
          COUNT(*) as total_stats,
          COUNT(CASE WHEN survival_status IS NOT NULL THEN 1 END) as stats_with_survival
        FROM bpoc_cultural_stats
      `
      const bpocCulturalResult = await client.query(bpocCulturalQuery)
      
      // Check ultimate_stats
      const ultimateQuery = `
        SELECT 
          COUNT(*) as total_stats,
          COUNT(CASE WHEN score IS NOT NULL THEN 1 END) as stats_with_score
        FROM ultimate_stats
      `
      const ultimateResult = await client.query(ultimateQuery)
      
      // Get sample data from each table
      const sampleTypingHero = await client.query(`
        SELECT user_id, wpm, accuracy, finished_at 
        FROM typing_hero_sessions 
        WHERE finished_at IS NOT NULL 
        ORDER BY finished_at DESC 
        LIMIT 3
      `)
      
      const sampleBpocCultural = await client.query(`
        SELECT user_id, survival_status, cultural_score, created_at 
        FROM bpoc_cultural_stats 
        ORDER BY created_at DESC 
        LIMIT 3
      `)
      
      const sampleUltimate = await client.query(`
        SELECT user_id, score, level_reached, created_at 
        FROM ultimate_stats 
        ORDER BY created_at DESC 
        LIMIT 3
      `)

      return NextResponse.json({
        typing_hero: {
          counts: typingHeroResult.rows[0],
          sample_data: sampleTypingHero.rows
        },
        bpoc_cultural: {
          counts: bpocCulturalResult.rows[0],
          sample_data: sampleBpocCultural.rows
        },
        ultimate: {
          counts: ultimateResult.rows[0],
          sample_data: sampleUltimate.rows
        }
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error testing game data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
