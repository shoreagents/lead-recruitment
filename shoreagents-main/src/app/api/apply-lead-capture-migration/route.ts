import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Applying lead capture migration...');
    
    const supabase = createClient();
    
    // Check if columns already exist
    const { data: columns, error: columnError } = await supabase
      .from('users')
      .select('first_lead_capture, second_lead_capture')
      .limit(1);
    
    if (!columnError) {
      console.log('✅ Lead capture columns already exist');
      return NextResponse.json({
        success: true,
        message: 'Lead capture columns already exist',
        data: columns
      });
    }
    
    // If columns don't exist, we need to add them
    // Since we can't add columns directly through Supabase client, we'll return instructions
    return NextResponse.json({
      success: false,
      message: 'Cannot add columns through Supabase client. Please run the SQL migration manually.',
      sql: `
        ALTER TABLE public.users 
        ADD COLUMN first_lead_capture BOOLEAN DEFAULT FALSE,
        ADD COLUMN second_lead_capture BOOLEAN DEFAULT FALSE;
        
        CREATE INDEX idx_users_first_lead_capture ON public.users USING btree (first_lead_capture);
        CREATE INDEX idx_users_second_lead_capture ON public.users USING btree (second_lead_capture);
      `
    });
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
