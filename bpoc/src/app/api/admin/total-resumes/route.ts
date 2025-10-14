import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    const result = await pool.query('SELECT COUNT(*) as total_resumes FROM saved_resumes')
    const totalResumes = parseInt(result.rows[0].total_resumes)
    
    return NextResponse.json({ 
      total_resumes: totalResumes 
    })
  } catch (error) {
    console.error('Error getting total resumes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
