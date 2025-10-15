import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a recruiter
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { admin_level: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (user.admin_level !== 'recruiter') {
      return NextResponse.json({ error: 'Recruiter access required' }, { status: 403 })
    }

    // Fetch from recruiter_jobs table for the current recruiter
    console.log('🔍 Fetching jobs for userId:', userId)
    const recruiterJobs = await (prisma as any).RecruiterJob.findMany({
      where: { recruiter_id: userId },
      orderBy: { created_at: 'desc' }
    })

    console.log('🔍 Database query result:', {
      rowCount: recruiterJobs.length,
      rows: recruiterJobs
    })

    let jobs = recruiterJobs.map((row: any, index: number) => ({
      id: `recruiter_jobs_${row.id}_${index}`, // Create unique ID by combining source table, original ID, and index
      originalId: String(row.id), // Keep original ID for reference
      title: row.job_title || 'Untitled Role',
      description: row.job_description || 'No description available',
      industry: row.industry || 'Not Specified',
      department: row.department || 'Not Specified',
      experienceLevel: row.experience_level || 'Not Specified',
      salaryMin: row.salary_min || 0,
      salaryMax: row.salary_max || 0,
      status: row.status || 'inactive',
      company: row.company_id || 'Unknown Company',
      created_at: row.created_at,
      work_type: row.work_type,
      work_arrangement: row.work_arrangement,
      shift: row.shift,
      priority: row.priority,
      currency: row.currency,
      salary_type: row.salary_type,
      application_deadline: row.application_deadline,
      requirements: row.requirements || [],
      responsibilities: row.responsibilities || [],
      benefits: row.benefits || [],
      skills: row.skills || [],
      source_table: 'recruiter_jobs'
    }))

    console.log('🔍 Final jobs array:', jobs)

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/recruiter/jobs - Starting job creation')
  
  try {
    // Get user ID from headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    console.log('🔍 User ID from headers:', userId)
    
    if (!userId) {
      console.log('❌ No user ID found in headers')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Verifying user is a recruiter...')
    // Verify user is a recruiter
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { admin_level: true, company: true }
    })
    
    console.log('🔍 User found:', user)
    
    if (!user) {
      console.log('❌ User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (user.admin_level !== 'recruiter') {
      console.log('❌ User is not a recruiter, admin_level:', user.admin_level)
      return NextResponse.json({ error: 'Recruiter access required' }, { status: 403 })
    }
    
    console.log('✅ User verified as recruiter')

    // Skip table existence check since we know the table exists
    console.log('🔍 Proceeding with job creation (table check skipped)')

    const body = await request.json()
    console.log('🔍 Job creation request body:', body)
    
    // Get the recruiter user ID and company from the authenticated user
    const recruiterId = userId
    const recruiterCompany = user.company
    console.log('🔍 Recruiter ID:', recruiterId)
    console.log('🔍 Recruiter Company:', recruiterCompany)
    
    // Check if company is set
    if (!recruiterCompany) {
      console.log('❌ Recruiter company not set!')
      return NextResponse.json({ 
        error: 'Company information is required. Please update your profile with company details.' 
      }, { status: 400 })
    }
    
    // Map enum values from frontend format to database enum format
    const mapExperienceLevel = (level: string) => {
      switch (level) {
        case 'entry-level':
          return 'entry_level'
        case 'mid-level':
          return 'mid_level'
        case 'senior-level':
          return 'senior_level'
        default:
          return 'entry_level' // Default fallback
      }
    }
    
    const mapWorkArrangement = (arrangement: string) => {
      switch (arrangement) {
        case 'onsite':
          return 'onsite'
        case 'remote':
          return 'remote'
        case 'hybrid':
          return 'hybrid'
        default:
          return 'onsite' // Default fallback
      }
    }
    
    const mapPriority = (priority: string) => {
      switch (priority) {
        case 'low':
          return 'low'
        case 'medium':
          return 'medium'
        case 'high':
          return 'high'
        case 'urgent':
          return 'urgent'
        default:
          return 'medium' // Default fallback
      }
    }
    
    const mapShift = (shift: string) => {
      switch (shift) {
        case 'day':
          return 'day'
        case 'night':
          return 'night'
        case 'both':
          return 'both'
        default:
          return 'day' // Default fallback
      }
    }
    
    // Prepare job data for insertion
    const jobData = {
      recruiter_id: recruiterId,
      company_id: recruiterCompany,
      job_title: body.job_title,
      job_description: body.job_description,
      industry: body.industry,
      department: body.department,
      work_type: body.work_type,
      work_arrangement: mapWorkArrangement(body.work_arrangement),
      experience_level: mapExperienceLevel(body.experience_level),
      salary_min: body.salary_min,
      salary_max: body.salary_max,
      currency: body.currency,
      salary_type: body.salary_type,
      application_deadline: body.application_deadline ? new Date(body.application_deadline) : null,
      priority: mapPriority(body.priority),
      shift: mapShift(body.shift),
      requirements: body.requirements || [],
      responsibilities: body.responsibilities || [],
      benefits: body.benefits || [],
      skills: body.skills || [],
      status: 'new_request' // Default status as per your requirements
    }
    
    console.log('🔍 Job data to insert:', jobData)
    
    // Check if Prisma client is available
    console.log('🔍 Prisma client available:', !!prisma)
    console.log('🔍 Prisma RecruiterJob model available:', !!(prisma as any).RecruiterJob)
    
    // Insert into recruiter_jobs table using Prisma
    console.log('🔍 Attempting to create job in database...')
    let newJob;
    
    try {
      newJob = await (prisma as any).RecruiterJob.create({
        data: jobData
      })
      console.log('✅ Job created successfully with Prisma:', newJob)
    } catch (prismaError) {
      console.error('❌ Prisma error:', prismaError)
      console.log('🔄 Attempting fallback with raw SQL...')
      
      // Fallback: Use raw SQL if Prisma fails
      const { pool } = await import('@/lib/database')
      const client = await pool.connect()
      
      try {
        const insertQuery = `
          INSERT INTO recruiter_jobs (
            recruiter_id, company_id, job_title, job_description, industry, department,
            work_type, work_arrangement, experience_level, salary_min, salary_max,
            currency, salary_type, application_deadline, priority, shift,
            requirements, responsibilities, benefits, skills, status
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
          ) RETURNING *
        `
        
        const values = [
          jobData.recruiter_id,
          jobData.company_id,
          jobData.job_title,
          jobData.job_description,
          jobData.industry,
          jobData.department,
          jobData.work_type,
          jobData.work_arrangement,
          jobData.experience_level,
          jobData.salary_min,
          jobData.salary_max,
          jobData.currency,
          jobData.salary_type,
          jobData.application_deadline,
          jobData.priority,
          jobData.shift,
          jobData.requirements,
          jobData.responsibilities,
          jobData.benefits,
          jobData.skills,
          jobData.status
        ]
        
        const result = await client.query(insertQuery, values)
        newJob = result.rows[0]
        console.log('✅ Job created successfully with raw SQL:', newJob)
      } finally {
        client.release()
      }
    }

    return NextResponse.json({ 
      success: true, 
      job: newJob 
    })
  } catch (error) {
    console.error('❌ Error creating job:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError'
    })
    
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      error: `Failed to create job: ${errorMessage}` 
    }, { status: 500 })
  }
}
