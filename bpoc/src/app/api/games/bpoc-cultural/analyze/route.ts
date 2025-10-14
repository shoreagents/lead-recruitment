import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'missing_api_key' }, { status: 500 })

    const sRes = sessionId
      ? await pool.query(`SELECT * FROM bpoc_cultural_sessions WHERE id = $1 AND user_id = $2`, [sessionId, userId])
      : { rows: [] as any[] }
    const statsRes = await pool.query(`SELECT * FROM bpoc_cultural_stats WHERE user_id = $1`, [userId])
    const session = sRes.rows[0] || {}
    const stats = statsRes.rows[0] || {}

    const t = (v: any) => (typeof v === 'string' ? v.trim() : '')

    const systemPrompt = `You are an expert BPO cultural communication evaluator. Be concise, fair, and practical for hiring decisions.`

    const userPrompt = `Evaluate the candidate's text-only responses for cultural communication across regions. DO NOT assume any voice performance.
If a field is empty, mark it as unknown and proceed. Provide a regional recommendation based on text responses (US, UK, AU, CA).

INPUT RESPONSES (TEXT ONLY)
1B Writing Style Chameleon:
${t(session.c1b_text) || t(stats.last_c1b_text)}

1C Slang Decoder:
${t(session.c1c_text) || t(stats.last_c1c_text)}

2A Cultural Style Switch (writing):
${t(session.c2a_text) || t(stats.last_c2a_text)}

3A Cultural Landmine Field:
${t(session.c3a_text) || t(stats.last_c3a_text)}

3B Professional Boundary Test:
${t(session.c3b_text) || t(stats.last_c3b_text)}

3C Communication Breakdown Crisis:
${t(session.c3c_text) || t(stats.last_c3c_text)}

RESPONSE FORMAT
Return ONLY JSON, no prose, matching this schema:
{
  "summary": string (<= 120 words),
  "hire_recommendation": "hire" | "maybe" | "do_not_hire",
  "per_region_recommendation": {
    "US": "hire" | "maybe" | "do_not_hire",
    "UK": "hire" | "maybe" | "do_not_hire",
    "AU": "hire" | "maybe" | "do_not_hire",
    "CA": "hire" | "maybe" | "do_not_hire"
  },
  "strengths": string[],
  "risks": string[],
  "writing": {
    "style": string,
    "tone": string,
    "issues": string[],
    "score": number
  }
}`

    const payload = {
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify(payload)
    })

    if (!resp.ok) {
      const txt = await resp.text()
      return NextResponse.json({ error: `anthropic_error_${resp.status}`, details: txt }, { status: 500 })
    }

    const data = await resp.json().catch(() => ({} as any))
    const content = (data?.content?.[0]?.text as string) || ''

    let resultJson: any = {}
    try { resultJson = JSON.parse(content) } catch { resultJson = { raw: content } }
    const summary = resultJson.summary || (typeof content === 'string' ? content.slice(0, 800) : null)

    // Ensure only one result per user: replace existing record(s) for this user in a transaction
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      // Serialize writes per user to avoid race conditions creating multiple rows
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1::text))', [String(userId)])
      await client.query(`DELETE FROM bpoc_cultural_results WHERE user_id = $1`, [userId])
      const ins = await client.query(
        `INSERT INTO bpoc_cultural_results (user_id, session_id, model_provider, model_version, prompt, result_json, summary_text)
         VALUES ($1,$2,'anthropic',$3,$4,$5,$6) RETURNING id`,
        [userId, sessionId || null, payload.model, userPrompt, resultJson, summary]
      )
      await client.query('COMMIT')
      return NextResponse.json({ ok: true, resultId: ins.rows[0].id, summary, result: resultJson })
    } catch (err) {
      try { await client.query('ROLLBACK') } catch {}
      throw err
    } finally {
      client.release()
    }
  } catch (e) {
    console.error('bpoc-cultural/analyze failed:', e)
    return NextResponse.json({ error: 'analysis_failed' }, { status: 500 })
  }
}


