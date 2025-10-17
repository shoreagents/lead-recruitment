import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  console.log('🧪 Testing user profile API...')
  
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required',
        test: 'failed'
      }, { status: 400 })
    }
    
    console.log('🔍 Testing profile fetch for user:', userId)
    
    // Test database connection
    const client = await pool.connect()
    
    try {
      // Test basic connection
      await client.query('SELECT NOW()')
      console.log('✅ Database connection successful')
      
      // Test user profile query
      const query = `
        SELECT 
          u.id, u.email, u.first_name, u.last_name, u.full_name, u.location, u.avatar_url, u.phone, u.bio, u.position, u.completed_data, u.birthday, u.slug, u.created_at, u.updated_at,
          u.gender, u.gender_custom, u.username, u.company, u.admin_level,
          u.location_place_id, u.location_lat, u.location_lng, u.location_city, u.location_province, u.location_country, u.location_barangay, u.location_region,
          COALESCE(uls.overall_score, 0) as overall_score
        FROM users u
        LEFT JOIN user_leaderboard_scores uls ON u.id = uls.user_id
        WHERE u.id = $1
      `
      
      const result = await client.query(query, [userId])
      
      if (result.rows.length === 0) {
        return NextResponse.json({
          test: 'success',
          message: 'User not found in database',
          userId: userId,
          timestamp: new Date().toISOString()
        })
      }
      
      const user = result.rows[0]
      
      return NextResponse.json({
        test: 'success',
        message: 'User profile found',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          username: user.username,
          admin_level: user.admin_level,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        timestamp: new Date().toISOString()
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ User profile test failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      test: 'failed',
      error: 'User profile test failed',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

