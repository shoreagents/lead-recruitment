import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/leads/[userId]/progress - Get user's progress history
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    // Get user's progress history
    const progressHistory = await prisma.leadProgress.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            company: true
          }
        }
      }
    })

    // Get current status (latest progress record)
    const currentStatus = progressHistory[0]?.status || 'new_lead'

    return NextResponse.json({
      success: true,
      data: {
        userId,
        currentStatus,
        progressHistory,
        totalChanges: progressHistory.length
      }
    })

  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch user progress' 
    }, { status: 500 })
  }
}

// POST /api/admin/leads/[userId]/progress - Update specific user's status
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const { status, changedBy, changeReason } = await request.json()

    if (!userId || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID and status are required' 
      }, { status: 400 })
    }

    // Get the current status for this user
    const currentProgress = await prisma.leadProgress.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })

    const previousStatus = currentProgress?.status || null

    // Create new progress record
    const newProgress = await prisma.leadProgress.create({
      data: {
        user_id: userId,
        status,
        previous_status: previousStatus,
        changed_by: changedBy || null,
        change_reason: changeReason || null
      }
    })

    return NextResponse.json({
      success: true,
      data: newProgress,
      message: `Lead status updated to ${status}`
    })

  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update user progress' 
    }, { status: 500 })
  }
}
