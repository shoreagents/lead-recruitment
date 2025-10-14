import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

function capitalize(s: string): string { return !s ? s : s.charAt(0).toUpperCase() + s.slice(1) }

function formatSalary(currency: string, min: number | null, max: number | null, type: string): string {
  const symbol = String(currency || 'PHP').toUpperCase() === 'PHP' ? '₱' : String(currency || 'PHP').toUpperCase() + ' '
  const fmt = (n: number) => n.toLocaleString('en-PH')
  if (min != null && max != null) return `${symbol}${fmt(min)} - ${symbol}${fmt(max)} / ${type}`
  if (min != null) return `${symbol}${fmt(min)} / ${type}`
  if (max != null) return `${symbol}${fmt(max)} / ${type}`
  return ''
}

export async function GET(_request: NextRequest) {
  try {
    const res = await pool.query(`
      SELECT p.*, m.company AS company_name
      FROM processed_job_requests p
      LEFT JOIN members m ON m.company_id = p.company_id
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `)

    const jobs = await Promise.all(res.rows.map(async (row: any) => {
      const apps = await pool.query('SELECT COUNT(*)::int AS cnt FROM applications WHERE job_id = $1', [row.id])
      const realApplicants = apps.rows?.[0]?.cnt ?? 0
      const employmentType: string[] = []
      if (row.work_type) employmentType.push(capitalize(String(row.work_type)))
      if (row.experience_level) employmentType.push(capitalize(String(row.experience_level)))
      const salary = formatSalary(String(row.currency || 'PHP'), row.salary_min != null ? Number(row.salary_min) : null, row.salary_max != null ? Number(row.salary_max) : null, String(row.salary_type || 'monthly'))
      const createdAt = row.created_at ? new Date(row.created_at) : new Date()
      const ms = Date.now() - createdAt.getTime()
      const postedDays = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
      const locationType = String(row.work_arrangement || 'onsite')
      const priorityFromDb = String(row.priority ?? '').toLowerCase()
      const priority: 'low' | 'medium' | 'high' | 'urgent' =
        ['low', 'medium', 'high', 'urgent'].includes(priorityFromDb)
          ? (priorityFromDb as any)
          : ((): 'low' | 'medium' | 'high' => {
              if (realApplicants >= 50) return 'high'
              if (realApplicants >= 10) return 'medium'
              return 'low'
            })()

      return {
        id: String(row.id),
        company: 'ShoreAgents',
        companyLogo: row.company_logo || '🏢',
        title: row.job_title || 'Untitled Role',
        location: row.location || row['location'] || '',
        locationType: locationType === 'onsite' ? 'on-site' : locationType,
        salary,
        employmentType,
        postedDays,
        applicants: realApplicants,
        status: 'hiring',
        priority,
        application_deadline: row.application_deadline,
        experience_level: row.experience_level,
        work_arrangement: row.work_arrangement,
        shift: row.shift,
        industry: row.industry,
        department: row.department,
      }
    }))

    return NextResponse.json({ jobs })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch active jobs' }, { status: 500 })
  }
}


