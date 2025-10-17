import { NextRequest, NextResponse } from 'next/server'
import { syncUserToDatabaseServer } from '@/lib/user-sync-server'

/**
 * Test endpoint to verify that user sync preserves existing data
 * This helps debug the issue where manual profile changes get overwritten
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('🧪 Testing sync protection for user:', userId)

    // Simulate old Supabase metadata (this should NOT overwrite existing data)
    const oldSupabaseMetadata = {
      id: userId,
      email: 'test@example.com',
      first_name: 'OldFirstName',
      last_name: 'OldLastName', 
      full_name: 'OldFirstName OldLastName',
      location: 'Old Location',
      phone: '123-456-7890',
      bio: 'Old bio',
      position: 'Old Position',
      company: 'Old Company',
      completed_data: false,
      birthday: null,
      gender: null,
      admin_level: 'user'
    }

    console.log('🧪 Simulating sync with old Supabase metadata:', oldSupabaseMetadata)

    const result = await syncUserToDatabaseServer(oldSupabaseMetadata)

    console.log('🧪 Sync result:', result)

    return NextResponse.json({
      success: true,
      message: 'Sync protection test completed',
      result,
      explanation: 'If sync protection is working, existing database data should be preserved and not overwritten by the old Supabase metadata'
    })

  } catch (error) {
    console.error('❌ Error in sync protection test:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      error: 'Test failed',
      details: errorMessage
    }, { status: 500 })
  }
}

