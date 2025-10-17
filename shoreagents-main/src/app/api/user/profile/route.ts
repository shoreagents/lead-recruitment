import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch user data with quote count
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId
      },
      include: {
        pricingQuotes: {
          select: {
            id: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Exclude phone_number and country, add quote count
    const { phone_number, country, pricingQuotes, ...userData } = user
    
    const profileData = {
      ...userData,
      quoteCount: pricingQuotes.length
    }

    return NextResponse.json({
      success: true,
      data: profileData
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, first_name, last_name, email, company, industry_name } = body

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Update user data (excluding phone_number and country)
    const updatedUser = await prisma.user.update({
      where: {
        user_id
      },
      data: {
        first_name,
        last_name,
        email,
        company,
        industry_name,
        updated_at: new Date()
      }
    })

    const { phone_number, country, ...userData } = updatedUser

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

