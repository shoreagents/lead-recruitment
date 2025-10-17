import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/leads/progress - Get all users with their current lead status
export async function GET(request: NextRequest) {
  try {
    // Get all users with their latest lead progress
    const usersWithProgress = await prisma.user.findMany({
      include: {
        leadProgress: {
          orderBy: { created_at: 'desc' },
          take: 1 // Get only the latest progress record
        },
        pricingQuotes: {
          orderBy: { created_at: 'desc' },
          take: 3 // Get latest 3 quotes
        }
      },
      orderBy: { created_at: 'desc' }
    })

    // Transform data to match the expected format
    const leads = usersWithProgress.map(user => {
      const currentProgress = user.leadProgress[0]
      const currentStatus = currentProgress?.status || 'new_lead'
      
      // Determine status display name
      const statusMap: { [key: string]: string } = {
        'new_lead': 'New Lead',
        'stage_1': 'Stage 1',
        'stage_2': 'Stage 2',
        'pending': 'Pending',
        'meeting_booked': 'Meeting Booked',
        'signed_up': 'Signed Up',
        'closed_won': 'Closed Won'
      }

      // Calculate priority based on user type and activity
      let priority = 'Low'
      if (user.user_type === 'Regular' && user.pricingQuotes.length > 0) {
        priority = 'High'
      } else if (user.user_type === 'Regular') {
        priority = 'Medium'
      }

      return {
        id: user.user_id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
        company: user.company || 'Unknown Company',
        email: user.email || 'No email',
        status: statusMap[currentStatus] || 'New Lead',
        priority,
        source: user.user_type === 'Regular' ? 'Website' : 'Anonymous',
        created: user.created_at?.toISOString() || new Date().toISOString(),
        lastContact: user.updated_at?.toISOString() || new Date().toISOString(),
        notes: '',
        column: currentStatus,
        userType: user.user_type,
        userId: user.user_id,
        quoteCount: user.pricingQuotes.length,
        industry: user.industry_name || 'Unknown',
        firstLeadCapture: user.first_lead_capture || false,
        secondLeadCapture: user.second_lead_capture || false,
        thirdLeadCapture: user.third_lead_capture || false
      }
    })

    // Calculate stats
    const stats = {
      new: leads.filter(lead => lead.column === 'new_lead').length,
      stage1: leads.filter(lead => lead.column === 'stage_1').length,
      stage2: leads.filter(lead => lead.column === 'stage_2').length,
      pending: leads.filter(lead => lead.column === 'pending').length,
      meeting_booked: leads.filter(lead => lead.column === 'meeting_booked').length,
      signed_up: leads.filter(lead => lead.column === 'signed_up').length,
      closed_won: leads.filter(lead => lead.column === 'closed_won').length
    }

    return NextResponse.json({
      success: true,
      data: leads,
      stats,
      total: leads.length
    })

  } catch (error) {
    console.error('Error fetching leads with progress:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch leads with progress' 
    }, { status: 500 })
  }
}

// POST /api/admin/leads/progress - Update lead status
export async function POST(request: NextRequest) {
  try {
    const { userId, status, changedBy, changeReason } = await request.json()

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
      message: 'Lead status updated successfully'
    })

  } catch (error) {
    console.error('Error updating lead status:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update lead status' 
    }, { status: 500 })
  }
}
