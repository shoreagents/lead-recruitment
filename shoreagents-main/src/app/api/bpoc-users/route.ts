import { NextRequest, NextResponse } from 'next/server'
import { fetchBPOCUsersFromDatabase } from '@/lib/bpoc-database'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 BPOC Users API: Fetching users from database...')
    
    const users = await fetchBPOCUsersFromDatabase()
    
    console.log(`✅ BPOC Users API: Fetched ${users.length} users`)
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    })
  } catch (error) {
    console.error('❌ BPOC Users API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch BPOC users',
        data: []
      },
      { status: 500 }
    )
  }
}
