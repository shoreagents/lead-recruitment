import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
import { capitalizeNames, capitalizeFullName } from '@/lib/name-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    // Check if email exists in users table
    const result = await pool.query(
      'SELECT id, email, admin_level FROM users WHERE email = $1',
      [email]
    )

    return NextResponse.json({ 
      exists: result.rows.length > 0,
      user: result.rows[0] || null
    })

  } catch (error) {
    console.error('Error checking recruiter email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Recruiter signup request body:', body)
    
    const { 
      id, 
      email, 
      first_name, 
      last_name, 
      full_name, 
      location = 'Not specified',
      avatar_url = null,
      phone = null,
      bio = null
    } = body

    // Capitalize names before processing
    const capitalizedNames = capitalizeNames(first_name, last_name);
    const capitalizedFullName = capitalizeFullName(full_name);

    // Validate required fields
    if (!id || !email || !first_name || !last_name) {
      console.log('❌ Missing required fields:', { id, email, first_name, last_name })
      return NextResponse.json(
        { error: 'Missing required fields: id, email, first_name, last_name' },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists with email:', email)
    const existingUser = await pool.query(
      'SELECT id, admin_level FROM users WHERE email = $1',
      [email]
    )

    console.log('📋 Existing user check result:', existingUser.rows)

    if (existingUser.rows.length > 0) {
      console.log('👤 User already exists, updating to recruiter')
      // Update existing user to recruiter if they're not already
      if (existingUser.rows[0].admin_level !== 'recruiter') {
        const updateResult = await pool.query(
          'UPDATE users SET admin_level = $1, updated_at = NOW() WHERE id = $2',
          ['recruiter', existingUser.rows[0].id]
        )
        console.log('✅ User updated to recruiter:', updateResult.rowCount)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'User updated to recruiter',
        user: { id: existingUser.rows[0].id, admin_level: 'recruiter' }
      })
    }

    // Insert new recruiter user
    console.log('➕ Inserting new recruiter user')
    console.log('📝 Insert data:', {
      id, email, first_name, last_name, full_name,
      location, avatar_url, phone, bio,
      admin_level: 'recruiter', completed_data: false
    })

    console.log('🔍 About to insert recruiter with admin_level: recruiter')
    
    const result = await pool.query(
      `INSERT INTO users (
        id, email, first_name, last_name, full_name, 
        location, avatar_url, phone, bio, 
        admin_level, completed_data, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *`,
      [
        id, email, capitalizedNames.firstName, capitalizedNames.lastName, capitalizedFullName,
        location, avatar_url, phone, bio,
        'recruiter', false
      ]
    )
    
    console.log('🔍 Insert completed, checking result...')

    console.log('✅ Recruiter created successfully:', result.rows[0])
    console.log('🔍 Final admin_level in database:', result.rows[0].admin_level)

    return NextResponse.json({ 
      success: true, 
      message: 'Recruiter created successfully',
      user: result.rows[0]
    })

  } catch (error) {
    console.error('❌ Error creating recruiter:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to create recruiter',
      details: errorMessage,
      type: 'database_error'
    }, { status: 500 })
  }
}
