import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // Check if it's a recruiter job (starts with 'recruiter_')
    if (jobId.startsWith('recruiter_')) {
      const actualId = jobId.replace('recruiter_', '')
      
      const result = await pool.query(`
        SELECT 
          rj.*, 
          COALESCE(rj.company_id, u.company) AS company_name
        FROM recruiter_jobs rj
        LEFT JOIN users u ON u.id = rj.recruiter_id
        WHERE rj.id = $1
      `, [actualId])

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      const row = result.rows[0]
      
      // Get real application count from recruiter_applications table
      const apps = await pool.query('SELECT COUNT(*)::int AS cnt FROM recruiter_applications WHERE job_id = $1', [actualId])
      const realApplicants = apps.rows?.[0]?.cnt ?? 0
      
      return NextResponse.json({
        job: {
          id: `recruiter_${row.id}`,
          originalId: String(row.id),
          source: 'recruiter_jobs',
          company: row.company_name || 'Unknown Company',
          companyLogo: '🏢',
          title: row.job_title || 'Untitled Role',
          description: row.job_description || 'No description available',
          location: '',
          work_arrangement: row.work_arrangement,
          shift: row.shift,
          industry: row.industry,
          department: row.department,
          experience_level: row.experience_level,
          work_type: row.work_type,
          application_deadline: row.application_deadline,
          salary_min: row.salary_min,
          salary_max: row.salary_max,
          currency: row.currency,
          salary_type: row.salary_type,
          priority: row.priority,
          status: row.status,
          applicants: realApplicants,
          views: row.views || 0,
          created_at: row.created_at,
          updated_at: row.updated_at,
          requirements: Array.isArray(row.requirements) ? row.requirements.flatMap(item => 
            typeof item === 'string' ? item.split('\n\n').filter(s => s.trim()) : [item]
          ) : [],
          responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities.flatMap(item => 
            typeof item === 'string' ? item.split('\n\n').filter(s => s.trim()) : [item]
          ) : [],
          benefits: Array.isArray(row.benefits) ? row.benefits.flatMap(item => 
            typeof item === 'string' ? item.split('\n\n').filter(s => s.trim()) : [item]
          ) : [],
          skills: row.skills || []
        }
      })
    } else {
      // Handle processed job requests (existing logic)
      // Extract numeric ID if it starts with 'processed_'
      const actualJobId = jobId.startsWith('processed_') ? jobId.replace('processed_', '') : jobId
      
      const result = await pool.query(`
        SELECT p.*, m.company AS company_name
        FROM processed_job_requests p
        LEFT JOIN members m ON m.company_id = p.company_id
        WHERE p.id = $1
      `, [actualJobId])

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      const row = result.rows[0]
      
      // Get application count
      const apps = await pool.query('SELECT COUNT(*)::int AS cnt FROM applications WHERE job_id = $1', [row.id])
      const realApplicants = apps.rows?.[0]?.cnt ?? 0

      return NextResponse.json({
        job: {
          id: `processed_${row.id}`,
          originalId: String(row.id),
          source: 'processed_job_requests',
          company: 'ShoreAgents',
          companyLogo: row.company_logo || '🏢',
          title: row.job_title || 'Untitled Role',
          description: row.job_description || 'No description available',
          location: row.location || '',
          work_arrangement: row.work_arrangement,
          shift: row.shift,
          industry: row.industry,
          department: row.department,
          experience_level: row.experience_level,
          work_type: row.work_type,
          application_deadline: row.application_deadline,
          salary_min: row.salary_min,
          salary_max: row.salary_max,
          currency: row.currency,
          salary_type: row.salary_type,
          priority: row.priority,
          status: row.status,
          applicants: realApplicants,
          views: row.views || 0,
          created_at: row.created_at,
          updated_at: row.updated_at,
          requirements: Array.isArray(row.requirements) ? row.requirements.flatMap(item => 
            typeof item === 'string' ? item.split('\n\n').filter(s => s.trim()) : [item]
          ) : [],
          responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities.flatMap(item => 
            typeof item === 'string' ? item.split('\n\n').filter(s => s.trim()) : [item]
          ) : [],
          benefits: Array.isArray(row.benefits) ? row.benefits.flatMap(item => 
            typeof item === 'string' ? item.split('\n\n').filter(s => s.trim()) : [item]
          ) : [],
          skills: row.skills || []
        }
      })
    }
  } catch (e) {
    console.error('Error fetching job details:', e)
    return NextResponse.json({ error: 'Failed to fetch job details' }, { status: 500 })
  }
}
