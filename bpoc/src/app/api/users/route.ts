import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        full_name: true,
        location: true,
        avatar_url: true,
        created_at: true,
        admin_level: true,
        completed_data: true,
        slug: true,
        username: true,
        company: true,
        // Include related data
        workStatus: {
          select: {
            work_status: true,
            current_position: true,
            current_employer: true
          }
        },
        discPersonalityStats: {
          select: {
            latest_primary_type: true,
            latest_secondary_type: true,
            best_confidence_score: true,
            total_xp: true,
            badges_earned: true
          }
        },
        typingHeroStats: {
          select: {
            best_wpm: true,
            best_accuracy: true,
            total_sessions: true
          }
        },
        leaderboardScore: {
          select: {
            overall_score: true,
            tier: true,
            rank_position: true
          }
        }
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, first_name, last_name, full_name, location } = body

    const user = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        full_name,
        location
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
