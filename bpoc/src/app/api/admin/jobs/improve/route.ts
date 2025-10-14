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
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // In non-dev, ensure admin
    if (process.env.NODE_ENV !== 'development') {
      const adminCheck = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
      if (adminCheck.rows[0]?.admin_level !== 'admin') {
        return NextResponse.json({ error: 'Admin only' }, { status: 403 })
      }
    }

    const body = (await request.json()) as {
      data: ImprovePayload
    }
    const data = body?.data || {}

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Claude/Anthropic API key not configured' }, { status: 500 })
    }

    const prompt = buildPrompt(data)

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!resp.ok) {
      const err = await resp.text().catch(() => '')
      console.error('Anthropic error:', err)
      return NextResponse.json({ error: 'AI improve failed' }, { status: 500 })
    }

    const json = await resp.json()
    const text: string = json?.content?.[0]?.text || ''
    const improved = safelyParseImprovedJSON(text, data)

    return NextResponse.json({ improved })
  } catch (e) {
    console.error('Improve job error:', e)
    return NextResponse.json({ error: 'Failed to improve job fields' }, { status: 500 })
  }
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

  return `You are a staffing operations expert. Your task: if existing data is already reasonable, ONLY refine wording for clarity and professionalism without adding new items. If a field is missing or clearly insufficient, then and only then generate appropriate default content.

Return STRICT JSON only with keys: job_title, experience_level, job_description, requirements, responsibilities, benefits, skills.

Hard rules:
- If an input array (requirements, responsibilities, benefits, skills) is NON-EMPTY and items are meaningful/relevant, keep the SAME number of items; rewrite each line for clarity and professionalism.
- If an input array is NON-EMPTY but items are nonsense (e.g., random characters, repeated punctuation, blank/near-blank, or off-topic), DISCARD them and produce 3–4 strong, generic items suitable for PH BPO roles.
- If an input array is EMPTY, generate 3–4 high-quality, generic items suitable for PH BPO roles.
- Each bullet should be concise (roughly 2–12 words), action-oriented, and not redundant.
- Keep experience_level strictly one of: "entry-level" | "mid-level" | "senior-level". If an input value exists, keep it as-is.
- job_description: 3–6 concise sentences. If an input description exists, rewrite it for clarity; otherwise generate one.
- Avoid company-specific claims or confidential info.
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
  // Extract the first JSON object in text
  const match = text.match(/\{[\s\S]*\}/)
  let parsed: any = null
  try {
    parsed = match ? JSON.parse(match[0]) : JSON.parse(text)
  } catch {
    parsed = {}
  }
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
  // If fallback has a level, keep it; else use parsed if valid; else default
  const lvl = fallback.experience_level
    ? fallback.experience_level
    : ((['entry-level', 'mid-level', 'senior-level'] as const).includes(lvlRaw as any) ? (lvlRaw as any) : 'mid-level')
  return {
    job_title: str(parsed.job_title) || fallback.job_title || 'Customer Service Representative',
    experience_level: lvl,
    job_description: str(parsed.job_description) || fallback.job_description || 'We are seeking a motivated professional to join our growing team. You will deliver excellent service and collaborate with cross-functional partners to achieve business goals.',
    requirements: (() => {
      const improved = arr(parsed.requirements)
      const accepted = acceptModelLength(improved, fallback.requirements)
      return accepted.length ? accepted : (fallback.requirements || [
      'At least 1 year BPO experience',
      'Excellent English communication skills',
      'Amenable to shifting schedules'
      ])
    })(),
    responsibilities: (() => {
      const improved = arr(parsed.responsibilities)
      const accepted = acceptModelLength(improved, fallback.responsibilities)
      return accepted.length ? accepted : (fallback.responsibilities || [
      'Handle customer inquiries via phone, chat, or email',
      'Troubleshoot basic issues and provide timely resolutions',
      'Document interactions accurately in CRM'
      ])
    })(),
    benefits: (() => {
      const improved = arr(parsed.benefits)
      const accepted = acceptModelLength(improved, fallback.benefits)
      return accepted.length ? accepted : (fallback.benefits || [
      'Competitive salary package',
      'HMO on Day 1 or upon regularization',
      'Performance incentives'
      ])
    })(),
    skills: (() => {
      const improved = arr(parsed.skills)
      const accepted = acceptModelLength(improved, fallback.skills)
      return accepted.length ? accepted : (fallback.skills || [
      'Customer service',
      'Active listening',
      'Problem-solving'
      ])
    })()
  }
}


