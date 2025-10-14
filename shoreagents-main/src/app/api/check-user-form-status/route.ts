import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateUserId } from '@/lib/userEngagementService';

export async function GET(request: NextRequest) {
  try {
    // Get user_id from query params or generate one
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || generateUserId();
    
    console.log('🔍 check-user-form-status API called with userId:', userId);

    const supabase = createClient();

    // Check if user exists and has filled out the form
    const { data: user, error } = await supabase
      .from('users')
      .select('company, industry_name, first_name, last_name, email')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user form status:', error);
      return NextResponse.json({ error: 'Failed to check user status' }, { status: 500 });
    }

    // Check if user has filled out the form (company/industry OR contact form data)
    const hasFilledForm = user && (
      (user.company && user.industry_name) || 
      (user.first_name && user.last_name && user.email)
    );

    const response = {
      hasFilledForm: !!hasFilledForm,
      userExists: !!user,
      company: user?.company || null,
      industry: user?.industry_name || null,
      firstName: user?.first_name || null,
      lastName: user?.last_name || null,
      email: user?.email || null
    };
    
    console.log('📊 check-user-form-status API response:', response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in check-user-form-status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
