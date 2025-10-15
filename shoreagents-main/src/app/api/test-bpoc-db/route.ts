import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing BPOC database connection...');
    
    // Test database connection
    const { testBPOCDatabaseConnection, fetchBPOCUsersFromDatabase } = await import('@/lib/bpoc-database');
    
    // Test connection
    const connectionTest = await testBPOCDatabaseConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        message: connectionTest.message,
        error: 'Database connection failed'
      }, { status: 500 });
    }
    
    // Test data fetching
    const users = await fetchBPOCUsersFromDatabase();
    
    return NextResponse.json({
      success: true,
      message: `Successfully connected to BPOC database`,
      data: {
        connectionTest: connectionTest.message,
        totalUsers: users.length,
        sampleUser: users.length > 0 ? {
          user_id: users[0].user_id,
          full_name: users[0].full_name,
          position: users[0].position,
          overall_score: users[0].overall_score
        } : null,
        environment: {
          hasDatabaseUrl: !!process.env.BPOC_DATABASE_URL,
          databaseUrlPrefix: process.env.BPOC_DATABASE_URL?.substring(0, 20) + '...'
        }
      }
    });
    
  } catch (error) {
    console.error('❌ BPOC database test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'BPOC database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        hasDatabaseUrl: !!process.env.BPOC_DATABASE_URL,
        databaseUrlPrefix: process.env.BPOC_DATABASE_URL?.substring(0, 20) + '...'
      }
    }, { status: 500 });
  }
}

