import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT 
        j.*, 
        m.company AS company_name,
        COALESCE(app_counts.applicant_count, 0) AS real_applicants
      FROM job_requests j
      LEFT JOIN members m ON m.company_id = j.company_id
      LEFT JOIN (
        SELECT job_id, COUNT(*) as applicant_count
        FROM applications
        GROUP BY job_id
      ) app_counts ON app_counts.job_id = j.id
      WHERE j.status <> 'processed'
      ORDER BY j.created_at DESC
    `)

    const normalizeStatus = (raw: any): 'job-request' | 'approved' | 'hiring' | 'closed' => {
      const s = String(raw ?? '').toLowerCase().replace(/[_\s]+/g, '-').trim()
      if (!s) return 'job-request'
      if (['job-request', 'job_request', 'request', 'new', 'pending', 'submitted', 'to-review'].includes(s)) return 'job-request'
      if (['approved', 'in-review', 'review', 'screened'].includes(s)) return 'approved'
      if (['hiring', 'open', 'active', 'interview', 'ongoing', 'posting'].includes(s)) return 'hiring'
      if (['closed', 'filled', 'cancelled', 'canceled', 'archived', 'rejected', 'done'].includes(s)) return 'closed'
      return 'job-request'
    }

    const jobs = result.rows.map((row: any) => {
      const employmentTypeRaw = row.employment_type
      let employmentType: string[] = []
      // Our DDL uses work_type (text) and experience_level (enum); build a small array label
      const workType = String(row.work_type || '').trim()
      const experienceLevel = String(row.experience_level || '').trim()
      if (workType) employmentType.push(capitalize(workType))
      if (experienceLevel) employmentType.push(capitalize(experienceLevel))
      if (employmentType.length === 0) employmentType = ['Full-time']

      // Compute posted days
      const createdAt = row.created_at ? new Date(row.created_at) : new Date()
      const ms = Date.now() - createdAt.getTime()
      const postedDays = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))

      // Map work_arrangement enum to UI locationType
      const locationType = String(row.work_arrangement || 'on-site').toLowerCase().replace(/\s+/g, '-')
      const normalizedLocationType = ['on-site', 'onsite', 'remote', 'hybrid'].includes(locationType)
        ? locationType
        : 'on-site'
      const finalLocationType = normalizedLocationType === 'onsite' ? 'on-site' : (normalizedLocationType as 'on-site' | 'remote' | 'hybrid')

      // We do not have priority in the DDL; derive a lightweight one from applicants/views
      const derivedPriority = ((): 'low' | 'medium' | 'high' => {
        const applicants = Number(row.applicants ?? 0)
        if (applicants >= 50) return 'high'
        if (applicants >= 10) return 'medium'
        return 'low'
      })()

      // Format salary
      const currency = String(row.currency || 'PHP').toUpperCase()
      const salaryType = String(row.salary_type || 'monthly').toLowerCase()
      const min = row.salary_min != null ? Number(row.salary_min) : null
      const max = row.salary_max != null ? Number(row.salary_max) : null
      const salary = formatSalary(currency, min, max, salaryType)

      return {
        id: String(row.id),
        company: row.company_name || 'Unknown Company',
        companyLogo: row.company_logo || '🏢',
        title: row.title || row.position || row.job_title || '',
        location: row.location || row.city || row["location"] || '',
        locationType: finalLocationType,
        salary,
        employmentType,
        postedDays,
        applicants: row.real_applicants ?? 0,
        status: mapStatusFromEnum(row.status),
        priority: (row.priority as any) || derivedPriority,
        source: 'original',
        applicationDeadline: row.application_deadline || null,
      }
    })

    // fetch processed jobs with real applicant counts
    const processedRes = await pool.query(`
      SELECT 
        p.*, 
        m.company AS company_name,
        COALESCE(p.priority, j.priority) AS merged_priority,
        COALESCE(app_counts.applicant_count, 0) AS real_applicants
      FROM processed_job_requests p
      LEFT JOIN members m ON m.company_id = p.company_id
      LEFT JOIN job_requests j ON j.id = p.id
      LEFT JOIN (
        SELECT job_id, COUNT(*) as applicant_count
        FROM applications
        GROUP BY job_id
      ) app_counts ON app_counts.job_id = p.id
      ORDER BY p.created_at DESC
    `)
    const processedJobs = processedRes.rows.map((row: any) => ({
      ...rowToJobCard({ ...row, priority: row.merged_priority ?? row.priority, applicants: row.real_applicants }),
      job_description: row.job_description,
      requirements: row.requirements,
      responsibilities: row.responsibilities,
      benefits: row.benefits,
      skills: row.skills,
      source: 'processed' as const
    }))

    return NextResponse.json({ jobs: [...processedJobs, ...jobs] })
  } catch (error) {
    console.error('Error fetching job requests:', error)
    return NextResponse.json({ error: 'Failed to fetch job requests' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const action = body?.action

    // In development, allow all authenticated users to use this endpoint
    if (process.env.NODE_ENV !== 'development') {
      // Ensure the caller is an admin in non-dev environments
      const adminCheck = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
      if (adminCheck.rows[0]?.admin_level !== 'admin') {
        return NextResponse.json({ error: 'Admin only' }, { status: 403 })
      }
    }

    switch (action) {
      case 'create': {
        const {
          company,
          title,
          location,
          salary,
          status: uiStatus,
          workArrangement,
          workType,
          experienceLevel,
          application_deadline,
          industry,
          department,
          requirements,
          responsibilities,
          benefits,
          skills,
          jobDescription,
          priority,
          shift
        } = body?.data || {}

        // Find or create member
        let companyId: string | null = null
        if (company) {
          const found = await pool.query('SELECT company_id FROM members WHERE company = $1 LIMIT 1', [company])
          if (found.rows.length > 0) {
            companyId = found.rows[0].company_id
          } else {
            const inserted = await pool.query('INSERT INTO members (company) VALUES ($1) RETURNING company_id', [company])
            companyId = inserted.rows[0].company_id
          }
        }

        const parsedSalary = parseSalary(String(salary || ''))
        const dbStatus = uiStatusToDbStatus(uiStatus || 'job-request')
        const dbWorkArrangement = normalizeWorkArrangement(workArrangement || 'onsite')
        const dbWorkType = (workType || 'full-time')
        const dbExperience = experienceLevel || null

        const insert = await pool.query(
          `INSERT INTO job_requests (
            company_id, job_title, work_arrangement, salary_min, salary_max, job_description,
            requirements, responsibilities, benefits, skills,
            experience_level, application_deadline, industry, department,
            work_type, currency, salary_type, status, priority, shift
          ) VALUES (
            $1, $2, $3::work_arrangement_enum, $4, $5, $6,
            $7::text[], $8::text[], $9::text[], $10::text[],
            $11::experience_level_enum, $12::date, $13, $14,
            $15, $16, $17, $18::job_status_enum, $19::priority_enum, $20::shift_enum
          )
          RETURNING *`,
          [
            companyId,
            title,
            dbWorkArrangement,
            parsedSalary.min,
            parsedSalary.max,
            jobDescription || 'Pending description',
            Array.isArray(requirements) ? requirements : [],
            Array.isArray(responsibilities) ? responsibilities : [],
            Array.isArray(benefits) ? benefits : [],
            Array.isArray(skills) ? skills : [],
            dbExperience,
            application_deadline || null,
            industry || null,
            department || null,
            dbWorkType,
            parsedSalary.currency,
            parsedSalary.type,
            dbStatus,
            (priority as any) || 'medium',
            (shift as any) || 'day'
          ]
        )

        const row = insert.rows[0]
        const companyName = company || (await getCompanyName(row.company_id)) || 'Unknown Company'
        const payload = rowToJobCard({ ...row, company_name: companyName })
        return NextResponse.json({ job: payload })
      }

      case 'update': {
        const { id, title, location, salary, status: uiStatus, workArrangement, workType, experienceLevel, companyId, salaryType, currency, applicants, jobDescription, industry, department, application_deadline, requirements, responsibilities, benefits, skills, priority, shift } = body?.data || {}
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        const parsedSalary = parseSalary(String(salary || ''))
        const dbStatus = uiStatus ? uiStatusToDbStatus(uiStatus) : undefined
        const fields: string[] = []
        const values: any[] = []
        const push = (f: string, v: any) => { fields.push(f); values.push(v) }
        if (title != null) push('job_title', title)
        // location/city column not present in this schema; ignore
        if (workArrangement != null) push('work_arrangement', normalizeWorkArrangement(workArrangement))
        if (workType != null) push('work_type', workType)
        if (experienceLevel != null) push('experience_level', experienceLevel)
        if (companyId != null) push('company_id', companyId)
        if (jobDescription != null) push('job_description', jobDescription)
        if (industry != null) push('industry', industry)
        if (department != null) push('department', department)
        if (application_deadline != null) push('application_deadline', application_deadline)
        if (Array.isArray(requirements)) push('requirements', requirements)
        if (Array.isArray(responsibilities)) push('responsibilities', responsibilities)
        if (Array.isArray(benefits)) push('benefits', benefits)
        if (Array.isArray(skills)) push('skills', skills)
        if (salary != null) {
          push('salary_min', parsedSalary.min)
          push('salary_max', parsedSalary.max)
          push('currency', parsedSalary.currency)
          push('salary_type', parsedSalary.type)
        }
        if (currency != null && salary == null) push('currency', currency)
        if (salaryType != null && salary == null) push('salary_type', salaryType)
        if (applicants != null) push('applicants', applicants)
        if (priority != null) push('priority', priority)
        if (shift != null) push('shift', shift)
        if (dbStatus != null) push('status', dbStatus)
        if (fields.length === 0) return NextResponse.json({ error: 'no fields' }, { status: 400 })
        const setSql = fields.map((f, i) => `${f} = $${i + 1}`).join(', ')
        const update = await pool.query(`UPDATE job_requests SET ${setSql}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`, [...values, id])
        if (update.rows.length === 0) return NextResponse.json({ error: 'not found' }, { status: 404 })
        const row = update.rows[0]
        const companyName = await getCompanyName(row.company_id)
        return NextResponse.json({ job: rowToJobCard({ ...row, company_name: companyName }) })
      }

      case 'move': {
        const { id, toStatus } = body?.data || {}
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        const dbStatus = uiStatusToDbStatus(toStatus)
        const update = await pool.query('UPDATE job_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [dbStatus, id])
        if (update.rows.length === 0) return NextResponse.json({ error: 'not found' }, { status: 404 })
        const row = update.rows[0]
        const companyName = await getCompanyName(row.company_id)
        return NextResponse.json({ job: rowToJobCard({ ...row, company_name: companyName }) })
      }

      case 'delete': {
        const { id } = body?.data || {}
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          // Ensure processed row is removed even if FK is missing
          await client.query('DELETE FROM processed_job_requests WHERE id = $1', [id])
          await client.query('DELETE FROM job_requests WHERE id = $1', [id])
          await client.query('COMMIT')
          return NextResponse.json({ success: true })
        } catch (e) {
          await client.query('ROLLBACK')
          throw e
        } finally {
          client.release()
        }
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error mutating job requests:', error)
    const message = error instanceof Error ? error.message : 'Failed to process request'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatSalary(currency: string, min: number | null, max: number | null, type: string): string {
  const symbol = currency.toUpperCase() === 'PHP' ? '₱' : currency.toUpperCase() + ' '
  const fmt = (n: number) => n.toLocaleString('en-PH')
  if (min != null && max != null) return `${symbol}${fmt(min)} - ${symbol}${fmt(max)} / ${type}`
  if (min != null) return `${symbol}${fmt(min)} / ${type}`
  if (max != null) return `${symbol}${fmt(max)} / ${type}`
  return ''
}

function mapStatusFromEnum(dbStatus: any): 'job-request' | 'approved' | 'hiring' | 'closed' {
  // job_status_enum: active | inactive | closed | processed
  const s = String(dbStatus ?? '').toLowerCase()
  if (s === 'active') return 'hiring'
  if (s === 'inactive') return 'job-request'
  if (s === 'processed') return 'approved'
  if (s === 'closed') return 'closed'
  return 'job-request'
}

function uiStatusToDbStatus(ui: any): 'active' | 'inactive' | 'closed' | 'processed' {
  const s = String(ui ?? '').toLowerCase()
  if (s === 'hiring') return 'active'
  if (s === 'approved') return 'processed'
  if (s === 'closed') return 'closed'
  return 'inactive' // job-request
}

function normalizeWorkArrangement(val: any): 'onsite' | 'remote' | 'hybrid' {
  const s = String(val ?? '').toLowerCase()
  if (s === 'remote') return 'remote'
  if (s === 'hybrid') return 'hybrid'
  return 'onsite'
}

async function getCompanyName(companyId: string | null): Promise<string | null> {
  if (!companyId) return null
  const res = await pool.query('SELECT company FROM members WHERE company_id = $1', [companyId])
  return res.rows[0]?.company ?? null
}

function rowToJobCard(row: any) {
  const employmentType: string[] = []
  if (row.work_type) employmentType.push(capitalize(String(row.work_type)))
  if (row.experience_level) employmentType.push(capitalize(String(row.experience_level)))
  const salary = formatSalary(String(row.currency || 'PHP'), row.salary_min != null ? Number(row.salary_min) : null, row.salary_max != null ? Number(row.salary_max) : null, String(row.salary_type || 'monthly'))
  const createdAt = row.created_at ? new Date(row.created_at) : new Date()
  const ms = Date.now() - createdAt.getTime()
  const postedDays = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
  const locationType = String(row.work_arrangement || 'onsite')
  const derivedPriority = ((): 'low' | 'medium' | 'high' => {
    const a = Number(row.applicants ?? 0)
    if (a >= 50) return 'high'
    if (a >= 10) return 'medium'
    return 'low'
  })()
  const priorityFromDb = String(row.priority ?? '').toLowerCase()
  const priority: 'low' | 'medium' | 'high' | 'urgent' =
    ['low', 'medium', 'high', 'urgent'].includes(priorityFromDb)
      ? (priorityFromDb as any)
      : derivedPriority
  return {
    id: String(row.id),
    company: row.company_name || 'Unknown Company',
    companyLogo: row.company_logo || '🏢',
    title: row.job_title || 'Untitled Role',
    location: row.location || row["location"] || '',
    locationType: locationType === 'onsite' ? 'on-site' : locationType,
    salary,
    employmentType,
    postedDays,
    applicants: row.applicants ?? 0,
    status: mapStatusFromEnum(row.status),
    priority,
    shift: row.shift || 'day',
    applicationDeadline: row.application_deadline || null,
  }
}

function parseSalary(input: string): { currency: string, min: number | null, max: number | null, type: string } {
  const lower = input.toLowerCase()
  const type = lower.includes('/hr') || lower.includes('per hour') ? 'hourly' : (lower.includes('/day') ? 'daily' : (lower.includes('/year') ? 'yearly' : 'monthly'))
  const currency = lower.includes('₱') || lower.includes('php') ? 'PHP' : (lower.includes('usd') || lower.includes('$') ? 'USD' : 'PHP')
  const nums = input.replace(/[^0-9\-–,]/g, ' ').split(/\s+/).filter(Boolean).map(n => Number(n.replace(/,/g, ''))).filter(n => !isNaN(n))
  let min: number | null = null
  let max: number | null = null
  if (nums.length >= 2) {
    min = Math.min(nums[0], nums[1])
    max = Math.max(nums[0], nums[1])
  } else if (nums.length === 1) {
    min = nums[0]
  }
  return { currency, min, max, type }
}


