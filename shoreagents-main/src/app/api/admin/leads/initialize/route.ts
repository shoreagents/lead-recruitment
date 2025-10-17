import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/admin/leads/initialize - Initialize lead progress for existing users
export async function POST(request: NextRequest) {
  try {
    // Get all users who don't have any lead progress records
    const usersWithoutProgress = await prisma.user.findMany({
      where: {
        leadProgress: {
          none: {}
        }
      },
      select: {
        user_id: true,
        created_at: true,
        user_type: true
      }
    })

    console.log(`Found ${usersWithoutProgress.length} users without lead progress`)

    // Create initial progress records for users without any
    const progressRecords = usersWithoutProgress.map(user => ({
      user_id: user.user_id,
      status: 'new_lead',
      previous_status: null,
      changed_by: 'system',
      change_reason: 'Initial lead status assignment'
    }))

    if (progressRecords.length > 0) {
      await prisma.leadProgress.createMany({
        data: progressRecords
      })
    }

    return NextResponse.json({
      success: true,
      message: `Initialized lead progress for ${progressRecords.length} users`,
      initialized: progressRecords.length
    })

  } catch (error) {
    console.error('Error initializing lead progress:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initialize lead progress' 
    }, { status: 500 })
  }
}
