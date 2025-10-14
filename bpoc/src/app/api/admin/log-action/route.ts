import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { action, details, userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if user is admin
    const adminQuery = `
      SELECT id FROM users 
      WHERE id = $1 AND admin_level = 'admin'
    `
    const adminResult = await pool.query(adminQuery, [userId])
    
    if (adminResult.rows.length === 0) {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 })
    }

    const adminUserId = adminResult.rows[0].id
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Log the action
    const logQuery = `
      SELECT log_admin_action($1, $2, $3, $4)
    `
    await pool.query(logQuery, [adminUserId, action, details, ipAddress])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging admin action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 