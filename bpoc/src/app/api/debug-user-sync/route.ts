import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  console.log('🔍 Debug: User sync diagnostic started')
  
  try {
    // 1. Check environment variables
    const databaseUrl = process.env.DATABASE_URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('🔧 Environment variables check:', {
      hasDatabaseUrl: !!databaseUrl,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      nodeEnv: process.env.NODE_ENV
    })
    
    if (!databaseUrl) {
      return NextResponse.json({
        status: 'failed',
        error: 'Missing DATABASE_URL environment variable',
        details: 'DATABASE_URL is required for database operations'
      }, { status: 500 })
    }
    
    // 2. Test database connection
    console.log('🧪 Testing database connection...')
    const client = await pool.connect()
    
    try {
      // Test basic connection
      const connectionTest = await client.query('SELECT NOW() as current_time')
      console.log('✅ Database connection successful')
      
      // Test users table
      const usersTableTest = await client.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 hour' THEN 1 END) as recent_users
        FROM users
      `)
      
      // Test table structure
      const tableStructure = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position
      `)
      
      return NextResponse.json({
        status: 'success',
        message: 'Database connection and structure verified',
        details: {
          connection: {
            currentTime: connectionTest.rows[0]?.current_time,
            status: 'connected'
          },
          usersTable: {
            totalUsers: usersTableTest.rows[0]?.total_users,
            recentUsers: usersTableTest.rows[0]?.recent_users
          },
          tableStructure: tableStructure.rows.map(row => ({
            column: row.column_name,
            type: row.data_type,
            nullable: row.is_nullable
          })),
          environment: {
            hasDatabaseUrl: !!databaseUrl,
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey,
            nodeEnv: process.env.NODE_ENV
          }
        },
        timestamp: new Date().toISOString()
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Database diagnostic failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({
      status: 'failed',
      error: 'Database diagnostic failed',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log('🔍 Debug: Testing user sync with sample data')
  
  try {
    const { userId, email, firstName, lastName } = await request.json()
    
    if (!userId || !email) {
      return NextResponse.json({
        error: 'Missing required fields: userId and email'
      }, { status: 400 })
    }
    
    // Test user sync with provided data
    const { syncUserToDatabaseServer } = await import('@/lib/user-sync-server')
    
    const testUserData = {
      id: userId,
      email: email,
      first_name: firstName || 'Test',
      last_name: lastName || 'User',
      full_name: `${firstName || 'Test'} ${lastName || 'User'}`,
      location: '',
      avatar_url: null,
      phone: null,
      bio: null,
      position: null,
      company: null,
      completed_data: false,
      birthday: null,
      gender: null,
      admin_level: 'user'
    }
    
    console.log('🧪 Testing user sync with data:', testUserData)
    
    const result = await syncUserToDatabaseServer(testUserData)
    
    return NextResponse.json({
      status: 'success',
      message: 'User sync test completed',
      result: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ User sync test failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      status: 'failed',
      error: 'User sync test failed',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

