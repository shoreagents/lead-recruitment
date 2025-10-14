import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    const result = await pool.query('SELECT COUNT(*) as total_users FROM users')
    const totalUsers = parseInt(result.rows[0].total_users)
    
    return NextResponse.json({ 
      total_users: totalUsers 
    })
  } catch (error) {
    console.error('Error getting total users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
