import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// POST - Check if username is available
export async function POST(request: NextRequest) {
  try {
    const { username, userId } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Validate username format (alphanumeric, underscore, hyphen, 3-20 characters)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ 
        error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens' 
      }, { status: 400 })
    }

    console.log('🔍 Checking username availability:', username)

    // Check if username exists (excluding current user if updating)
    let query = 'SELECT id FROM users WHERE username = $1'
    let params = [username.toLowerCase()]

    if (userId) {
      query += ' AND id != $2'
      params.push(userId)
    }

    const result = await pool.query(query, params)

    const isAvailable = result.rows.length === 0

    console.log('✅ Username check result:', { username, isAvailable })

    return NextResponse.json({ 
      available: isAvailable,
      username: username.toLowerCase()
    })

  } catch (error) {
    console.error('❌ Error checking username:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 })
  }
}
