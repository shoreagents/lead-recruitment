import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (process.env.NODE_ENV !== 'development') {
      const adminCheck = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
      if (adminCheck.rows[0]?.admin_level !== 'admin') {
        return NextResponse.json({ error: 'Admin only' }, { status: 403 })
      }
    }
    const body = await request.json()
    const { action, data } = body || {}
    if (action !== 'update') return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    const { id } = data || {}
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const fields: string[] = []
    const values: any[] = []
    const push = (f: string, v: any) => { fields.push(f); values.push(v) }
    if (data.title != null) push('job_title', data.title)
    if (data.location != null) {/* ignored: no location column */}
    if (data.workArrangement != null) push('work_arrangement', data.workArrangement)
    if (data.workType != null) push('work_type', data.workType)
    if (data.experienceLevel != null) push('experience_level', data.experienceLevel)
    if (data.companyId != null) push('company_id', data.companyId)
    if (data.jobDescription != null) push('job_description', data.jobDescription)
    if (data.industry != null) push('industry', data.industry)
    if (data.department != null) push('department', data.department)
    if (data.application_deadline != null) push('application_deadline', data.application_deadline)
    if (Array.isArray(data.requirements)) push('requirements', data.requirements)
    if (Array.isArray(data.responsibilities)) push('responsibilities', data.responsibilities)
    if (Array.isArray(data.benefits)) push('benefits', data.benefits)
    if (Array.isArray(data.skills)) push('skills', data.skills)
    if (data.salary != null) {
      // salary is already pre-formatted string in UI; ignore here to avoid parse differences
    }
    if (data.currency != null) push('currency', data.currency)
    if (data.salaryType != null) push('salary_type', data.salaryType)
    if (data.priority != null) push('priority', data.priority)
    if (data.shift != null) push('shift', data.shift)
    if (data.status != null) push('status', data.status)
    if (fields.length === 0) return NextResponse.json({ error: 'no fields' }, { status: 400 })

    const setSql = fields.map((f, i) => `${f} = $${i + 1}`).join(', ')
    const update = await pool.query(`UPDATE processed_job_requests SET ${setSql}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`, [...values, id])
    if (update.rows.length === 0) return NextResponse.json({ error: 'not found' }, { status: 404 })

    // Business rule: when a job is closed, if any application for that job is 'hired',
    // set all other applications for that job to 'closed'
    try {
      if (data.status === 'closed') {
        const hasHired = await pool.query(
          `SELECT 1 FROM applications WHERE job_id = $1 AND status = 'hired' LIMIT 1`,
          [id]
        )
        if (hasHired.rowCount > 0) {
          await pool.query(
            `UPDATE applications SET status = 'closed' WHERE job_id = $1 AND status <> 'hired'`,
            [id]
          )
        }
      }
    } catch (e) {
      console.error('Failed to cascade close other applications on job close:', e)
      // Do not fail the main request if cascade fails
    }

    return NextResponse.json({ job: update.rows[0] })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update processed job' }, { status: 500 })
  }
}


