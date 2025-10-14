import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

function withCors(res: NextResponse) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v))
  return res
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }))
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const email = (url.searchParams.get('email') || '').trim().toLowerCase()

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return withCors(NextResponse.json({ error: 'Invalid email' }, { status: 400 }))
  }

  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      'SELECT 1 FROM users WHERE lower(email) = $1 LIMIT 1',
      [email]
    )
    return withCors(NextResponse.json({ exists: rows.length > 0 }))
  } catch {
    return withCors(NextResponse.json({ error: 'Lookup failed' }, { status: 500 }))
  } finally {
    client.release()
  }
}
