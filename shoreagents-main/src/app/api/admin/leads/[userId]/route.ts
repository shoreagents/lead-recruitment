import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    // Fetch detailed user information
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        pricing_quotes!fk_pricing_quotes_user_id(
          id,
          quote_number,
          total_monthly_cost,
          currency_code,
          created_at
        )
      `)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user details:', error)
      return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Transform user data into lead details format
    const leadDetails = {
      id: user.user_id,
      name: user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.first_name || 'Anonymous User',
      company: user.company || 'Not specified',
      email: user.email || 'No email provided',
      phone: user.phone || 'No phone provided',
      industry: user.industry_name || 'Not specified',
      userType: user.user_type,
      created: user.created_at,
      updated: user.updated_at,
      firstLeadCapture: user.first_lead_capture || false,
      secondLeadCapture: user.second_lead_capture || false,
      thirdLeadCapture: user.third_lead_capture || false,
      hasFilledForm: user.has_filled_form || false,
      pricingQuotes: user.pricing_quotes || [],
      totalQuotes: user.pricing_quotes?.length || 0,
      totalValue: user.pricing_quotes?.reduce((sum: number, quote: any) => 
        sum + (parseFloat(quote.total_monthly_cost) || 0), 0) || 0
    }

    return NextResponse.json({ 
      success: true, 
      data: leadDetails
    })

  } catch (error) {
    console.error('Error in lead details API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
