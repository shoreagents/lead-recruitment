import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔍 API called: GET /api/recruiter/activity-fallback');
  
  try {
    // Get user ID from headers (set by middleware)
    const recruiterId = request.headers.get('x-user-id');
    if (!recruiterId) {
      console.log('❌ No recruiter ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Recruiter ID:', recruiterId);

    // Return empty activities with helpful message for new recruiters
    console.log('✅ Returning fallback activities for new recruiter');

    return NextResponse.json({
      success: true,
      activities: [],
      total: 0,
      message: 'Welcome! Start by posting your first job to see activity here!'
    });

  } catch (error) {
    console.error('❌ Error in fallback activity endpoint:', error);
    
    return NextResponse.json({
      success: true,
      activities: [],
      total: 0,
      message: 'Welcome! Start by posting your first job to see activity here!'
    });
  }
}
