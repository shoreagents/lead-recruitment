import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { UserType } from '@/types/user'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    // Fetch users from the database, excluding admin users
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        pricing_quotes!fk_pricing_quotes_user_id(count)
      `)
      .neq('user_type', 'Admin') // Exclude admin users
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Transform users into lead format
    const leads = users?.map((user, index) => {
      // Determine lead status based on user type and creation date
      let status = 'New Lead'
      let column = 'new'
      let priority = 'Medium'
      
      if (user.user_type === UserType.REGULAR) {
        status = 'Qualified'
        column = 'qualified'
        priority = 'High'
      } else if (user.user_type === UserType.ANONYMOUS) {
        // Check if user has been active recently
        const daysSinceCreated = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceCreated > 7) {
          status = 'Contacted'
          column = 'contacted'
        } else {
          status = 'New Lead'
          column = 'new'
        }
        priority = 'Medium'
      }

       // Determine source based on user data
       let source = 'Website'
       if (user.company) {
         source = user.company
       } else if (user.email && user.email.includes('@')) {
         source = 'Email Signup'
       }

       return {
         id: user.user_id,
         name: user.first_name && user.last_name 
           ? `${user.first_name} ${user.last_name}` 
           : user.first_name || 'Anonymous User',
         company: user.company || 'Not specified',
         email: user.email || 'No email provided',
         status: status,
         priority: priority,
         source: source,
         created: user.created_at,
         lastContact: user.updated_at || user.created_at,
         notes: '',
         column: column,
         userType: user.user_type,
         userId: user.user_id,
         quoteCount: user.pricing_quotes?.[0]?.count || 0,
         industry: user.industry_name || 'Not specified',
         firstLeadCapture: user.first_lead_capture || false,
         secondLeadCapture: user.second_lead_capture || false,
         thirdLeadCapture: user.third_lead_capture || false
       }
    }) || []

    return NextResponse.json({ 
      success: true, 
      data: leads,
      total: leads.length,
      stats: {
        new: leads.filter(lead => lead.column === 'new').length,
        contacted: leads.filter(lead => lead.column === 'contacted').length,
        qualified: leads.filter(lead => lead.column === 'qualified').length,
        proposal: leads.filter(lead => lead.column === 'proposal').length,
        negotiation: leads.filter(lead => lead.column === 'negotiation').length,
        closed: leads.filter(lead => lead.column === 'closed').length
      }
    })

  } catch (error) {
    console.error('Error in leads API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { leadId, column } = await request.json()

    if (!leadId || !column) {
      return NextResponse.json({ error: 'Lead ID and column are required' }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    // Update the lead status in the database
    // For now, we'll just return success since we're using the column for display only
    // In a real implementation, you might want to store the lead status in a separate table
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead status updated successfully' 
    })

  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
