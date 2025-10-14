import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    const result = await pool.query('SELECT COUNT(*) as total_applicants FROM applications')
    const totalApplicants = parseInt(result.rows[0].total_applicants)
    
    return NextResponse.json({ 
      total_applicants: totalApplicants 
    })
  } catch (error) {
    console.error('Error getting total applicants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
