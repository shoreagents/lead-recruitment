import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

type ImprovePayload = {
  job_title?: string
  experience_level?: '' | 'entry-level' | 'mid-level' | 'senior-level'
  job_description?: string
  requirements?: string[]
  responsibilities?: string[]
  benefits?: string[]
  skills?: string[]
}

export async function POST(request: NextRequest) {
  const client = await pool.connect()
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
    const id = Number(body?.id)
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const asIs: boolean = !!body?.asIs || body?.mode === 'as-is'
    const targetRaw: string = String(body?.to || body?.target || '').toLowerCase()
    const processedStatus: 'processed' | 'active' = (targetRaw === 'active' || targetRaw === 'hiring') ? 'active' : 'processed'

    await client.query('BEGIN')
    const srcRes = await client.query('SELECT * FROM job_requests WHERE id = $1 FOR UPDATE', [id])
    if (srcRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    const src = srcRes.rows[0]

    // Build AI input
    const seed: ImprovePayload = {
      job_title: src.job_title || '',
      experience_level: src.experience_level || '',
      job_description: src.job_description || '',
      requirements: Array.isArray(src.requirements) ? src.requirements : [],
      responsibilities: Array.isArray(src.responsibilities) ? src.responsibilities : [],
      benefits: Array.isArray(src.benefits) ? src.benefits : [],
      skills: Array.isArray(src.skills) ? src.skills : []
    }

    const improved = asIs
      ? {
          job_title: seed.job_title || 'Customer Service Representative',
          experience_level: (seed.experience_level as any) || 'mid-level',
          job_description: seed.job_description || 'We are seeking a motivated professional to join our growing team.',
          requirements: Array.isArray(seed.requirements) ? seed.requirements : [],
          responsibilities: Array.isArray(seed.responsibilities) ? seed.responsibilities : [],
          benefits: Array.isArray(seed.benefits) ? seed.benefits : [],
          skills: Array.isArray(seed.skills) ? seed.skills : []
        }
      : await callAnthropicForImprovement(seed)

    // Update original status only
    await client.query('UPDATE job_requests SET status = $1::job_status_enum, updated_at = NOW() WHERE id = $2', ['processed', id])

    // Insert or update processed row (1:1 by id)
    const insertSql = `
      INSERT INTO processed_job_requests (
        id, company_id, job_title, work_arrangement, salary_min, salary_max, job_description,
        requirements, responsibilities, benefits, skills,
        experience_level, application_deadline, industry, department,
        work_type, currency, salary_type, status, views, applicants, created_at, updated_at, priority
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8::text[], $9::text[], $10::text[], $11::text[],
        $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, NOW(), NOW(), $22
      )
      ON CONFLICT (id) DO UPDATE SET
        job_title = EXCLUDED.job_title,
        job_description = EXCLUDED.job_description,
        requirements = EXCLUDED.requirements,
        responsibilities = EXCLUDED.responsibilities,
        benefits = EXCLUDED.benefits,
        skills = EXCLUDED.skills,
        experience_level = EXCLUDED.experience_level,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING *
    `
    const ins = await client.query(insertSql, [
      id,
      src.company_id,
      improved.job_title || src.job_title,
      src.work_arrangement,
      src.salary_min,
      src.salary_max,
      improved.job_description || src.job_description,
      improved.requirements || src.requirements || [],
      improved.responsibilities || src.responsibilities || [],
      improved.benefits || src.benefits || [],
      improved.skills || src.skills || [],
      improved.experience_level || src.experience_level,
      src.application_deadline,
      src.industry,
      src.department,
      src.work_type,
      src.currency,
      src.salary_type,
      processedStatus,
      src.views ?? 0,
      src.applicants ?? 0,
      src.priority
    ])

    await client.query('COMMIT')

    const row = ins.rows[0]
    const companyName = await getCompanyName(row.company_id)
    const card = rowToJobCard({ ...row, company_name: companyName })
    return NextResponse.json({ processedJob: card, originalJobId: String(id) })
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('Process job error:', e)
    return NextResponse.json({ error: 'Failed to process job' }, { status: 500 })
  } finally {
    client.release()
  }
}

async function callAnthropicForImprovement(data: ImprovePayload): Promise<Required<ImprovePayload>> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
  if (!apiKey) {
    // Fallback: echo inputs
    return fillImprovedDefaults(data)
  }
  const prompt = buildPrompt(data)
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: 'claude-3-5-sonnet-20241022', max_tokens: 2000, temperature: 0.7, messages: [{ role: 'user', content: prompt }] })
  })
  if (!resp.ok) return fillImprovedDefaults(data)
  const json = await resp.json()
  const text: string = json?.content?.[0]?.text || ''
  return safelyParseImprovedJSON(text, data)
}

function buildPrompt(data: ImprovePayload): string {
  const seed = {
    job_title: data.job_title || '',
    experience_level: data.experience_level || '',
    job_description: data.job_description || '',
    requirements: data.requirements || [],
    responsibilities: data.responsibilities || [],
    benefits: data.benefits || [],
    skills: data.skills || []
  }
  return `You are a staffing operations expert. Your task: if existing data is already reasonable, ONLY refine wording for clarity and professionalism without adding new items. If a field is missing or clearly insufficient, then generate appropriate default content.

Return STRICT JSON only with keys: job_title, experience_level, job_description, requirements, responsibilities, benefits, skills.

Hard rules:
- If an input array (requirements, responsibilities, benefits, skills) is NON-EMPTY and items are meaningful/relevant, keep the SAME number of items; rewrite each line for clarity and professionalism.
- If an input array is NON-EMPTY but items are nonsense (random characters, repeated punctuation, blank/near-blank, or off-topic), DISCARD them and produce 3–4 strong, generic items suitable for PH BPO roles.
- If an input array is EMPTY, generate 3–4 high-quality, generic items suitable for PH BPO roles.
- Each bullet should be concise (roughly 2–12 words), action-oriented, and not redundant.
- Keep experience_level strictly one of: "entry-level" | "mid-level" | "senior-level". If an input value exists, keep it as-is.
- job_description: 3–6 concise sentences. If an input description exists, rewrite it; otherwise generate one.
- No emojis, no numbering, no markdown. JSON only.

INPUT:
${JSON.stringify(seed, null, 2)}

OUTPUT JSON SHAPE:
{
  "job_title": "...",
  "experience_level": "entry-level | mid-level | senior-level",
  "job_description": "...",
  "requirements": ["..."],
  "responsibilities": ["..."],
  "benefits": ["..."],
  "skills": ["..."]
}`
}

function safelyParseImprovedJSON(text: string, fallback: ImprovePayload): Required<ImprovePayload> {
  const match = text.match(/\{[\s\S]*\}/)
  let parsed: any = {}
  try { parsed = match ? JSON.parse(match[0]) : JSON.parse(text) } catch {}
  const arr = (v: any) => Array.isArray(v) ? v.filter(Boolean).map((s: any) => String(s).trim()).slice(0, 20) : []
  // Accept the model's length when it provides items (it may choose 3–4 to replace nonsense).
  // If the model returned nothing, fall back to the original if present; otherwise empty for defaulting below.
  const acceptModelLength = (improved: string[], original?: string[]) => {
    if (improved.length > 0) return improved
    if (Array.isArray(original) && original.length > 0) return original
    return []
  }
  const str = (v: any) => (typeof v === 'string' ? v.trim() : '')
  const lvlRaw = str(parsed.experience_level)
  const lvl = fallback.experience_level ? fallback.experience_level : ((['entry-level', 'mid-level', 'senior-level'] as const).includes(lvlRaw as any) ? (lvlRaw as any) : 'mid-level')
  return {
    job_title: str(parsed.job_title) || fallback.job_title || 'Customer Service Representative',
    experience_level: lvl,
    job_description: str(parsed.job_description) || fallback.job_description || 'We are seeking a motivated professional to join our growing team.',
    requirements: (() => { const i = arr(parsed.requirements); const a = acceptModelLength(i, fallback.requirements); return a.length ? a : (fallback.requirements || ['At least 1 year BPO experience','Excellent English communication skills','Amenable to shifting schedules']) })(),
    responsibilities: (() => { const i = arr(parsed.responsibilities); const a = acceptModelLength(i, fallback.responsibilities); return a.length ? a : (fallback.responsibilities || ['Handle customer inquiries','Provide timely resolutions','Document interactions in CRM']) })(),
    benefits: (() => { const i = arr(parsed.benefits); const a = acceptModelLength(i, fallback.benefits); return a.length ? a : (fallback.benefits || ['Competitive salary package','HMO','Performance incentives']) })(),
    skills: (() => { const i = arr(parsed.skills); const a = acceptModelLength(i, fallback.skills); return a.length ? a : (fallback.skills || ['Customer service','Active listening','Problem-solving']) })()
  }
}

async function getCompanyName(companyId: string | null): Promise<string | null> {
  if (!companyId) return null
  const res = await pool.query('SELECT company FROM members WHERE company_id = $1', [companyId])
  return res.rows[0]?.company ?? null
}

function capitalize(s: string): string { return !s ? s : s.charAt(0).toUpperCase() + s.slice(1) }

function formatSalary(currency: string, min: number | null, max: number | null, type: string): string {
  const symbol = String(currency || 'PHP').toUpperCase() === 'PHP' ? '₱' : String(currency || 'PHP').toUpperCase() + ' '
  const fmt = (n: number) => n.toLocaleString('en-PH')
  if (min != null && max != null) return `${symbol}${fmt(min)} - ${symbol}${fmt(max)} / ${type}`
  if (min != null) return `${symbol}${fmt(min)} / ${type}`
  if (max != null) return `${symbol}${fmt(max)} / ${type}`
  return ''
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
  const priority: 'low' | 'medium' | 'high' =
    priorityFromDb === 'low' || priorityFromDb === 'medium' || priorityFromDb === 'high'
      ? (priorityFromDb as any)
      : derivedPriority
  return {
    id: String(row.id),
    company: row.company_name || 'Unknown Company',
    companyLogo: row.company_logo || '🏢',
    title: row.job_title || 'Untitled Role',
    location: row.location || row['location'] || '',
    locationType: locationType === 'onsite' ? 'on-site' : locationType,
    salary,
    employmentType,
    postedDays,
    applicants: row.applicants ?? 0,
    status: 'approved',
    priority,
  }
}

function fillImprovedDefaults(data: ImprovePayload): Required<ImprovePayload> {
  return {
    job_title: data.job_title || 'Customer Service Representative',
    experience_level: data.experience_level || 'mid-level',
    job_description: data.job_description || 'We are seeking a motivated professional to join our growing team.',
    requirements: data.requirements && data.requirements.length ? data.requirements : ['At least 1 year BPO experience','Excellent English communication skills','Amenable to shifting schedules'],
    responsibilities: data.responsibilities && data.responsibilities.length ? data.responsibilities : ['Handle customer inquiries','Provide timely resolutions','Document interactions in CRM'],
    benefits: data.benefits && data.benefits.length ? data.benefits : ['Competitive salary package','HMO','Performance incentives'],
    skills: data.skills && data.skills.length ? data.skills : ['Customer service','Active listening','Problem-solving'],
  }
}


