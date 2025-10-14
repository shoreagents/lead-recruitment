import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resumeId = (await params).id
    const { searchParams } = new URL(request.url)
    const forceDelete = searchParams.get('force') === 'true'
    
    console.log('API: Deleting resume with ID:', resumeId, 'Force delete:', forceDelete)

    // First check if there are any applications referencing this resume
    const applicationsCheck = await pool.query(
      'SELECT COUNT(*) FROM applications WHERE resume_id = $1',
      [resumeId]
    )
    
    const applicationsCount = parseInt(applicationsCheck.rows[0].count)
    
    if (applicationsCount > 0) {
      if (forceDelete) {
        console.log(`API: Force deleting resume - deleting ${applicationsCount} applications first`)
        
        // Delete related applications first
        await pool.query(
          'DELETE FROM applications WHERE resume_id = $1',
          [resumeId]
        )
        
        console.log('API: Related applications deleted')
      } else {
        console.log(`API: Cannot delete resume - ${applicationsCount} applications reference it`)
        return NextResponse.json({ 
          error: `Cannot delete resume. It is referenced by ${applicationsCount} application(s). Use ?force=true to delete anyway.` 
        }, { status: 400 })
      }
    }

    // Delete the resume from saved_resumes table
    const deleteResult = await pool.query(
      'DELETE FROM saved_resumes WHERE id = $1',
      [resumeId]
    )

    if (deleteResult.rowCount === 0) {
      console.log('API: Resume not found for deletion')
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    console.log('API: Resume deleted successfully')
    return NextResponse.json({ message: 'Resume deleted successfully' })

  } catch (error: any) {
    console.error('Error deleting resume:', error)
    
    // Handle foreign key constraint violation specifically
    if (error.code === '23503') {
      return NextResponse.json({ 
        error: 'Cannot delete resume. It is referenced by other records in the system. Please remove all references first.' 
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resumeId = (await params).id
    console.log('API: Fetching resume with ID:', resumeId)

    // Get the resume from saved_resumes table
    const result = await pool.query(
      'SELECT * FROM saved_resumes WHERE id = $1',
      [resumeId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json({ resume: result.rows[0] })

  } catch (error) {
    console.error('Error fetching resume:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
