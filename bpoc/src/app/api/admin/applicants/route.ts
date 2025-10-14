import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // For development, allow access without strict authentication
    if (process.env.NODE_ENV === 'development') {
      const jobId = Number((request.nextUrl.searchParams.get('jobId') || '').trim())
      if (!jobId || Number.isNaN(jobId)) return NextResponse.json({ error: 'jobId required' }, { status: 400 })

      const res = await pool.query(
        `SELECT a.*, 
                u.email as user_email, u.full_name as user_full_name, u.avatar_url as user_avatar, u.position as user_position, u.location as user_location,
                sr.resume_title as saved_resume_title,
                sr.resume_slug as saved_resume_slug
         FROM applications a
         LEFT JOIN users u ON u.id = a.user_id
         LEFT JOIN saved_resumes sr ON sr.id = a.resume_id
         WHERE a.job_id = $1
         ORDER BY a.created_at DESC`,
        [jobId]
      )

      const applications = res.rows.map(r => ({
        id: r.id,
        user_id: r.user_id,
        job_id: r.job_id,
        resume_slug: r.saved_resume_slug || r.resume_slug, // Use saved_resume_slug if available, fallback to applications.resume_slug
        status: r.status,
        created_at: r.created_at,
        user: { email: r.user_email, full_name: r.user_full_name, avatar_url: r.user_avatar, position: r.user_position, location: r.user_location },
        resume_title: r.saved_resume_title
      }))

      return NextResponse.json({ applications })
    }

    // Production authentication logic
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const adminCheck = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
    if (adminCheck.rows[0]?.admin_level !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const jobId = Number((request.nextUrl.searchParams.get('jobId') || '').trim())
    if (!jobId || Number.isNaN(jobId)) return NextResponse.json({ error: 'jobId required' }, { status: 400 })

    const res = await pool.query(
      `SELECT a.*, 
              u.email as user_email, u.full_name as user_full_name, u.avatar_url as user_avatar, u.position as user_position, u.location as user_location,
              sr.resume_title as saved_resume_title,
              sr.resume_slug as saved_resume_slug
       FROM applications a
       LEFT JOIN users u ON u.id = a.user_id
       LEFT JOIN saved_resumes sr ON sr.id = a.resume_id
       WHERE a.job_id = $1
       ORDER BY a.created_at DESC`,
      [jobId]
    )

    const applications = res.rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      job_id: r.job_id,
      resume_slug: r.saved_resume_slug || r.resume_slug, // Use saved_resume_slug if available, fallback to applications.resume_slug
      status: r.status,
      created_at: r.created_at,
      user: { email: r.user_email, full_name: r.user_full_name, avatar_url: r.user_avatar, position: r.user_position, location: r.user_location },
      resume_title: r.saved_resume_title
    }))

    return NextResponse.json({ applications })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // For development, allow admin actions
    if (process.env.NODE_ENV === 'development') {
      const body = await request.json()
      const { applicationId, status } = body

      if (!applicationId || !status) {
        return NextResponse.json({ error: 'applicationId and status are required' }, { status: 400 })
      }

      // Validate status against the enum
      const validStatuses = [
        'submitted', 'qualified', 'for verification', 'verified', 
        'initial interview', 'final interview', 'not qualified', 'passed', 
        'rejected', 'withdrawn', 'hired', 'closed'
      ]
      
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }

      // Update the application status
      const updateResult = await pool.query(
        'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, applicationId]
      )

      if (updateResult.rowCount === 0) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      console.log(`Admin updated application ${applicationId} status to ${status}`)

      // If an application is marked as hired, close the job and close all other applications for that job
      try {
        if (status === 'hired') {
          const jobIdRes = await pool.query('SELECT job_id FROM applications WHERE id = $1', [applicationId])
          const jobId = jobIdRes.rows[0]?.job_id
          if (jobId != null) {
            await pool.query(`UPDATE processed_job_requests SET status = 'closed', updated_at = NOW() WHERE id = $1`, [jobId])
            await pool.query(`UPDATE applications SET status = 'closed', updated_at = NOW() WHERE job_id = $1 AND id <> $2 AND status <> 'hired'`, [jobId, applicationId])
          }
        }
      } catch (err) {
        console.error('Failed cascading close on hire (dev mode):', err)
      }

      return NextResponse.json({ 
        message: 'Application status updated successfully',
        application: updateResult.rows[0]
      })
    }

    // Production authentication logic
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const adminCheck = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
    if (adminCheck.rows[0]?.admin_level !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const body = await request.json()
    const { applicationId, status } = body

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'applicationId and status are required' }, { status: 400 })
    }

    // Validate status against the enum
    const validStatuses = [
      'submitted', 'qualified', 'for verification', 'verified', 
      'initial interview', 'final interview', 'not qualified', 'passed', 
      'rejected', 'withdrawn', 'hired', 'closed'
    ]
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update the application status
    const updateResult = await pool.query(
      'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, applicationId]
    )

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    console.log(`Admin ${userId} updated application ${applicationId} status to ${status}`)

    // If an application is marked as hired, close the job and close all other applications for that job
    try {
      if (status === 'hired') {
        const jobIdRes = await pool.query('SELECT job_id FROM applications WHERE id = $1', [applicationId])
        const jobId = jobIdRes.rows[0]?.job_id
        if (jobId != null) {
          await pool.query(`UPDATE processed_job_requests SET status = 'closed', updated_at = NOW() WHERE id = $1`, [jobId])
          await pool.query(`UPDATE applications SET status = 'closed', updated_at = NOW() WHERE job_id = $1 AND id <> $2 AND status <> 'hired'`, [jobId, applicationId])
        }
      }
    } catch (err) {
      console.error('Failed cascading close on hire:', err)
    }

    return NextResponse.json({ 
      message: 'Application status updated successfully',
      application: updateResult.rows[0]
    })

  } catch (e) {
    console.error('Error updating application status:', e)
    return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For development, allow admin actions
    if (process.env.NODE_ENV === 'development') {
      const body = await request.json()
      const { applicationId } = body

      if (!applicationId) {
        return NextResponse.json({ error: 'applicationId is required' }, { status: 400 })
      }

      // Get application details before deletion for logging
      const appDetails = await pool.query(
        'SELECT a.*, u.email as user_email, u.full_name as user_full_name FROM applications a LEFT JOIN users u ON u.id = a.user_id WHERE a.id = $1',
        [applicationId]
      )

      if (appDetails.rowCount === 0) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      // Delete the application
      const deleteResult = await pool.query(
        'DELETE FROM applications WHERE id = $1',
        [applicationId]
      )

      if (deleteResult.rowCount === 0) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      const app = appDetails.rows[0]
      console.log(`Admin deleted application ${applicationId} for user ${app.user_email} (${app.user_full_name})`)

      return NextResponse.json({ 
        message: 'Application removed successfully'
      })
    }

    // Production authentication logic
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const adminCheck = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
    if (adminCheck.rows[0]?.admin_level !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const body = await request.json()
    const { applicationId } = body

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 })
    }

    // Get application details before deletion for logging
    const appDetails = await pool.query(
      'SELECT a.*, u.email as user_email, u.full_name as user_full_name FROM applications a LEFT JOIN users u ON u.id = a.user_id WHERE a.id = $1',
      [applicationId]
    )

    if (appDetails.rowCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Delete the application
    const deleteResult = await pool.query(
      'DELETE FROM applications WHERE id = $1',
      [applicationId]
    )

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const app = appDetails.rows[0]
    console.log(`Admin ${userId} deleted application ${applicationId} for user ${app.user_email} (${app.user_full_name})`)

    return NextResponse.json({ 
      message: 'Application removed successfully'
    })

  } catch (e) {
    console.error('Error removing application:', e)
    return NextResponse.json({ error: 'Failed to remove application' }, { status: 500 })
  }
}


