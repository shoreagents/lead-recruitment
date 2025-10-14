import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    // Simple test query
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version')
    
    return NextResponse.json({ 
      success: true, 
      current_time: result.rows[0].current_time,
      db_version: result.rows[0].db_version,
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    }, { status: 500 })
  }
}
