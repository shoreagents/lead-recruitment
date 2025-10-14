import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not available' }, { status: 500 })
    }

    // Fetch all pricing quotes first
    const { data: quotes, error } = await supabase
      .from('pricing_quotes')
      .select(`
        id,
        user_id,
        session_id,
        quote_timestamp,
        member_count,
        industry,
        total_monthly_cost,
        currency_code,
        created_at,
        updated_at,
        quote_number,
        candidate_recommendations
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching quotations:', error)
      return NextResponse.json({ error: 'Failed to fetch quotations', details: error.message }, { status: 500 })
    }

    // Fetch user data for each quote
    const quotations = []
    for (const quote of quotes || []) {
      // Fetch user data for this quote
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, first_name, last_name, email, company, industry_name, user_type')
        .eq('user_id', quote.user_id)
        .single()

      const user = userError ? null : userData
      if (userError) {
        console.warn(`Failed to fetch user data for user_id: ${quote.user_id}`, userError.message)
      }
      const user_name = user?.first_name && user?.last_name 
        ? `${user.first_name} ${user.last_name}`
        : user?.first_name || 'Anonymous User'

      // Determine status based on quote completion
      let status = 'draft'
      if (quote.total_monthly_cost > 0 && quote.member_count > 0) {
        status = 'completed'
      } else if (quote.total_monthly_cost > 0 || quote.member_count > 0) {
        status = 'in_progress'
      }

      quotations.push({
        quote_id: quote.id,
        user_id: quote.user_id,
        user_name: user_name,
        user_email: user?.email || 'No email',
        company: user?.company || null,
        industry: quote.industry || user?.industry_name || null,
        total_employees: quote.member_count || 0,
        total_cost: quote.total_monthly_cost || 0,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        status: status,
        step_completed: status === 'completed' ? 4 : status === 'in_progress' ? 2 : 0,
        quote_number: quote.quote_number || 1,
        currency_code: quote.currency_code || 'PHP',
        session_id: quote.session_id,
        quote_timestamp: quote.quote_timestamp
      })
    }

    // Calculate statistics
    const totalQuotes = quotations.length
    const totalValue = quotations.reduce((sum, quote) => sum + quote.total_cost, 0)
    const averageValue = totalQuotes > 0 ? totalValue / totalQuotes : 0
    const completedQuotes = quotations.filter(quote => quote.status === 'completed').length

    const stats = {
      totalQuotes,
      totalValue,
      averageValue,
      completedQuotes
    }

    return NextResponse.json({
      data: quotations,
      total: totalQuotes,
      stats
    })

  } catch (error) {
    console.error('Error in quotations API:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
