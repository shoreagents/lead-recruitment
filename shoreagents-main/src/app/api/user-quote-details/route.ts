import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userError) {
      console.error('❌ Error fetching user:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all pricing quotes for this user
    const { data: quotes, error: quotesError } = await supabase
      .from('pricing_quotes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (quotesError) {
      console.error('❌ Error fetching quotes:', quotesError);
      return NextResponse.json(
        { error: 'Failed to fetch quotes' },
        { status: 500 }
      );
    }

    // Get pricing quote roles for each quote
    const quotesWithRoles = await Promise.all(
      quotes.map(async (quote) => {
        const { data: roles, error: rolesError } = await supabase
          .from('pricing_quote_roles')
          .select('*')
          .eq('quote_id', quote.id)
          .order('created_at', { ascending: true });

        return {
          ...quote,
          roles: roles || [],
          rolesError: rolesError
        };
      })
    );

    return NextResponse.json({
      user,
      quotes: quotesWithRoles,
      totalQuotes: quotes.length
    });

  } catch (error) {
    console.error('❌ User quote details API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




