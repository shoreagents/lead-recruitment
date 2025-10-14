import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user:', userError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    // If user doesn't exist, return basic data
    if (!user) {
      return NextResponse.json({
        user: null,
        quotes: [],
        totalQuotes: 0,
        recentActivity: [],
        leadCaptureStatus: {
          first_lead_capture: false,
          second_lead_capture: false,
          third_lead_capture: false
        },
        isNewUser: true
      });
    }

    // Fetch user's pricing quotes
    const { data: quotes, error: quotesError } = await supabase
      .from('pricing_quotes')
      .select('*')
      .eq('user_id', userId)
      .order('quote_timestamp', { ascending: false });

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
    }

    // Fetch recent page visits for activity tracking
    const { data: pageVisits, error: visitsError } = await supabase
      .from('user_page_visits')
      .select('*')
      .eq('user_id', userId)
      .order('visit_timestamp', { ascending: false })
      .limit(5);

    if (visitsError) {
      console.error('Error fetching page visits:', visitsError);
    }

    // Determine user status and interests
    const isAnonymous = user.user_type === 'Anonymous';
    const isRegular = user.user_type === 'Regular';
    const hasQuotes = quotes && quotes.length > 0;
    const hasContactInfo = !!(user.first_name || user.last_name || user.email);
    const hasCompany = !!user.company;
    const hasIndustry = !!user.industry;

    // Analyze user interests based on data
    const interests = [];
    if (user.industry) interests.push(user.industry);
    if (hasQuotes) interests.push('pricing');
    if (user.company) interests.push('business solutions');

    // Determine what the user might be looking for
    const potentialNeeds = [];
    if (isAnonymous && !hasContactInfo) {
      potentialNeeds.push('contact_information');
    }
    if (isAnonymous && !hasQuotes) {
      potentialNeeds.push('pricing_calculator');
    }
    if (hasQuotes && !isRegular) {
      potentialNeeds.push('account_creation');
    }
    if (hasCompany && !hasQuotes) {
      potentialNeeds.push('quote_creation');
    }

    return NextResponse.json({
      user: {
        user_id: user.user_id,
        user_type: user.user_type,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        company: user.company,
        industry: user.industry,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      quotes: quotes || [],
      totalQuotes: quotes?.length || 0,
      recentActivity: pageVisits || [],
      leadCaptureStatus: {
        first_lead_capture: user.first_lead_capture || false,
        second_lead_capture: user.second_lead_capture || false,
        third_lead_capture: user.third_lead_capture || false
      },
      userProfile: {
        isAnonymous,
        isRegular,
        hasQuotes,
        hasContactInfo,
        hasCompany,
        hasIndustry,
        interests,
        potentialNeeds
      },
      isNewUser: false
    });

  } catch (error) {
    console.error('User data API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




