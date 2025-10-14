import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Fetch total users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users')
    const totalUsers = parseInt(usersResult.rows[0]?.count || '0')

    // Fetch active resumes count (saved_resumes table)
    const resumesResult = await pool.query('SELECT COUNT(*) as count FROM saved_resumes')
    const activeResumes = parseInt(resumesResult.rows[0]?.count || '0')

    // Fetch active jobs count (processed_job_requests where status = 'active')
    const jobsResult = await pool.query(
      "SELECT COUNT(*) as count FROM processed_job_requests WHERE status = 'active'"
    )
    const activeJobs = parseInt(jobsResult.rows[0]?.count || '0')

    return NextResponse.json({
      totalUsers,
      activeResumes,
      activeJobs
    })
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics' },
      { status: 500 }
    )
  }
}
