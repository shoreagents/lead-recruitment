import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Just return a simple response - we don't need to create users here
    // Other functions handle user creation properly
    console.log('🔍 ensure-anonymous-user: API called - no user creation needed');
    
    return NextResponse.json({ 
      success: true, 
      message: 'API endpoint working - user creation handled elsewhere',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in ensure-anonymous-user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
