import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  console.log('🧪 Testing database connection...')
  
  try {
    // Check environment variables
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error('❌ Missing DATABASE_URL environment variable')
      return NextResponse.json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is not set',
        status: 'failed'
      }, { status: 500 })
    }

    console.log('🔧 Database configuration check:', {
      hasDatabaseUrl: !!databaseUrl,
      databaseUrlPrefix: databaseUrl ? databaseUrl.substring(0, 30) + '...' : 'missing'
    })

    // Test database connection
    const client = await pool.connect()
    
    try {
      console.log('🧪 Testing database connection...')
      const result = await client.query('SELECT NOW() as current_time, version() as db_version')
      console.log('✅ Database connection successful')
      
      // Test users table
      const usersCount = await client.query('SELECT COUNT(*) as count FROM users')
      console.log('📊 Users table count:', usersCount.rows[0]?.count)
      
      return NextResponse.json({
        status: 'success',
        message: 'Database connection successful',
        details: {
          currentTime: result.rows[0]?.current_time,
          dbVersion: result.rows[0]?.db_version,
          usersCount: usersCount.rows[0]?.count
        },
        timestamp: new Date().toISOString()
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
    
    return NextResponse.json({
      status: 'failed',
      error: 'Database connection failed',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

