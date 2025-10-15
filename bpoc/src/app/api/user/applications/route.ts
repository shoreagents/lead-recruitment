import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function DELETE(request: NextRequest) {
  const client = await pool.connect()
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Delete all applications for this user
    await client.query('DELETE FROM applications WHERE user_id = $1', [userId])
    
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete applications' }, { status: 500 })
  } finally {
    client.release()
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const jobId = body?.jobId
    const resumeId = String(body?.resumeId || '')
    const resumeSlug = String(body?.resumeSlug || '')
    
    if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    if (!resumeId || !resumeSlug) return NextResponse.json({ error: 'resumeId and resumeSlug required' }, { status: 400 })

    // Determine job type and validate job exists
    let jobType: 'processed' | 'recruiter'
    let numericJobId: number | null = null
    let uuidJobId: string | null = null

    // Check if it's a UUID (recruiter job) or number (processed job)
    if (typeof jobId === 'string' && jobId.includes('-')) {
      // It's a UUID - recruiter job
      jobType = 'recruiter'
      uuidJobId = jobId
      
      // Verify recruiter job exists
      const recruiterJobCheck = await client.query('SELECT id FROM recruiter_jobs WHERE id = $1', [uuidJobId])
      if (recruiterJobCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Recruiter job not found' }, { status: 404 })
      }
    } else {
      // It's a number - processed job
      jobType = 'processed'
      numericJobId = Number(jobId)
      
      if (Number.isNaN(numericJobId)) {
        return NextResponse.json({ error: 'Invalid job ID format' }, { status: 400 })
      }
      
      // Verify processed job exists
      const processedJobCheck = await client.query('SELECT id FROM processed_job_requests WHERE id = $1', [numericJobId])
      if (processedJobCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Processed job not found' }, { status: 404 })
      }
    }

    await client.query('BEGIN')

    // Ensure resume belongs to user
    const r = await client.query('SELECT id, user_id FROM saved_resumes WHERE id = $1', [resumeId])
    if (r.rows.length === 0 || String(r.rows[0].user_id) !== String(userId)) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Invalid resume' }, { status: 400 })
    }

    // Check for existing application and insert new one
    let existing, ins
    if (jobType === 'processed') {
      // Use applications table for processed jobs
      existing = await client.query('SELECT * FROM applications WHERE user_id = $1 AND job_id = $2 LIMIT 1', [userId, numericJobId])
      
      if (existing.rows.length > 0) {
        await client.query('COMMIT')
        return NextResponse.json({ application: existing.rows[0], created: false })
      }

      ins = await client.query(
        `INSERT INTO applications (user_id, job_id, resume_id, resume_slug, status)
         VALUES ($1, $2, $3, $4, 'submitted')
         RETURNING *`,
        [userId, numericJobId, resumeId, resumeSlug]
      )
    } else {
      // Use recruiter_applications table for recruiter jobs
      existing = await client.query('SELECT * FROM recruiter_applications WHERE user_id = $1 AND job_id = $2 LIMIT 1', [userId, uuidJobId])
      
      if (existing.rows.length > 0) {
        await client.query('COMMIT')
        return NextResponse.json({ application: existing.rows[0], created: false })
      }

      ins = await client.query(
        `INSERT INTO recruiter_applications (user_id, job_id, resume_id, resume_slug, status)
         VALUES ($1, $2, $3, $4, 'submitted')
         RETURNING *`,
        [userId, uuidJobId, resumeId, resumeSlug]
      )

      // Update the applicants count in recruiter_jobs
      await client.query(
        `UPDATE recruiter_jobs 
         SET applicants = applicants + 1, updated_at = now()
         WHERE id = $1`,
        [uuidJobId]
      )
    }

    await client.query('COMMIT')
    return NextResponse.json({ application: ins.rows[0], created: true })
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('Error in applications POST:', e)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  } finally {
    client.release()
  }
}


