import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    // Count active jobs from processed_job_requests table (same as Applicants page)
    const result = await pool.query(`
      SELECT COUNT(*) as active_jobs 
      FROM processed_job_requests 
      WHERE status = 'active'
    `)
    const activeJobs = parseInt(result.rows[0].active_jobs)
    
    return NextResponse.json({ 
      active_jobs: activeJobs 
    })
  } catch (error) {
    console.error('Error getting active jobs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
