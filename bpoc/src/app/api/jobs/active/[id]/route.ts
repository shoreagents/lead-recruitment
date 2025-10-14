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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number((await params).id)
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const res = await pool.query(
      `SELECT p.*, m.company AS company_name
       FROM processed_job_requests p
       LEFT JOIN members m ON m.company_id = p.company_id
       WHERE p.id = $1 AND p.status IN ('processed','active')
       LIMIT 1`,
      [id]
    )
    if (res.rows.length === 0) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const row = res.rows[0]

    const employmentType: string[] = []
    if (row.work_type) employmentType.push(capitalize(String(row.work_type)))
    if (row.experience_level) employmentType.push(capitalize(String(row.experience_level)))
    const salary = formatSalary(String(row.currency || 'PHP'), row.salary_min != null ? Number(row.salary_min) : null, row.salary_max != null ? Number(row.salary_max) : null, String(row.salary_type || 'monthly'))
    const createdAt = row.created_at ? new Date(row.created_at) : new Date()
    const ms = Date.now() - createdAt.getTime()
    const postedDays = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
    const locationType = String(row.work_arrangement || 'onsite')

    // Count real applications from applications table (unique per user by constraint)
    const apps = await pool.query('SELECT COUNT(*)::int AS cnt FROM applications WHERE job_id = $1', [id])
    const realApplicants = apps.rows?.[0]?.cnt ?? 0

    const job = {
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
      status: row.status === 'active' ? 'hiring' : 'approved',
      priority: ((): 'low' | 'medium' | 'high' => {
        const a = Number(row.applicants ?? 0)
        if (a >= 50) return 'high'
        if (a >= 10) return 'medium'
        return 'low'
      })(),
      application_deadline: row.application_deadline,
      experience_level: row.experience_level,
      work_arrangement: row.work_arrangement,
      shift: row.shift,
      industry: row.industry,
      department: row.department,
      job_description: row.job_description,
      requirements: Array.isArray(row.requirements) ? row.requirements : [],
      responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
      benefits: Array.isArray(row.benefits) ? row.benefits : [],
      skills: Array.isArray(row.skills) ? row.skills : []
    }

    return NextResponse.json({ job })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}


