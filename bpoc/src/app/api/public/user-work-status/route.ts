import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// GET /api/public/user-work-status
// Optional: ?userId=<uuid> OR ?slug=<resume_slug>
// If neither provided, returns a paginated list: ?limit=100&offset=0
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const resumeSlug = searchParams.get('slug')
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')

    let userId = userIdParam

    if (!userId && resumeSlug) {
      // Resolve userId from saved_resumes by resume slug
      const slugRes = await pool.query(
        `SELECT user_id FROM saved_resumes WHERE resume_slug = $1 LIMIT 1`,
        [resumeSlug]
      )
      if (slugRes.rows.length > 0) {
        userId = slugRes.rows[0].user_id
      }
    }

    if (!userId) {
      // No specific user requested: return paginated list
      const limit = Math.min(Math.max(parseInt(limitParam || '100', 10) || 100, 1), 200)
      const offset = Math.max(parseInt(offsetParam || '0', 10) || 0, 0)

      const listRes = await pool.query(
        `SELECT user_id, current_employer, current_position, current_salary, notice_period_days,
                expected_salary, current_mood, work_status, preferred_shift, work_setup, completed_data, created_at, updated_at
           FROM user_work_status
          ORDER BY updated_at DESC
          LIMIT $1 OFFSET $2`,
        [limit, offset]
      )

      const rows = listRes.rows.map((row: any) => ({
        userId: row.user_id,
        currentEmployer: row.current_employer,
        currentPosition: row.current_position,
        currentSalary: row.current_salary,
        noticePeriod: row.notice_period_days,
        expectedSalary: row.expected_salary,
        currentMood: row.current_mood,
        workStatus: row.work_status,
        preferredShift: row.preferred_shift,
        workSetup: row.work_setup,
        completedData: row.completed_data,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))

      return NextResponse.json({ results: rows, limit, offset })
    }

    const result = await pool.query(
      `SELECT user_id, current_employer, current_position, current_salary, notice_period_days,
              expected_salary, current_mood, work_status, preferred_shift, work_setup, completed_data, created_at, updated_at
         FROM user_work_status
        WHERE user_id = $1`,
      [userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ found: false })
    }

    const row = result.rows[0]
    const workStatus = {
      userId: row.user_id,
      currentEmployer: row.current_employer,
      currentPosition: row.current_position,
      currentSalary: row.current_salary,
      noticePeriod: row.notice_period_days,
      expectedSalary: row.expected_salary,
      currentMood: row.current_mood,
      workStatus: row.work_status,
      preferredShift: row.preferred_shift,
      workSetup: row.work_setup,
      completedData: row.completed_data,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }

    return NextResponse.json({ found: true, workStatus })
  } catch (error) {
    console.error('Error fetching public work status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


