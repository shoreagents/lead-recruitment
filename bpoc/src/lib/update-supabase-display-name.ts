/**
 * Utility function to update Supabase display name
 * This can be called from the frontend to ensure the display name is updated
 */

export interface UpdateDisplayNameData {
  first_name: string
  last_name: string
  full_name: string
  location?: string
  phone?: string
  position?: string
  bio?: string
  company?: string
}

/**
 * Update Supabase display name via the dedicated API
 */
export async function updateSupabaseDisplayName(userId: string, data: UpdateDisplayNameData) {
  try {
    console.log('🔄 Updating Supabase display name for user:', userId)
    console.log('📊 Display name data:', data)

    const response = await fetch('/api/user/update-supabase-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        metadata: data
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Failed to update Supabase display name:', result.error)
      throw new Error(result.error || 'Failed to update Supabase display name')
    }

    console.log('✅ Supabase display name updated successfully:', result)
    return result

  } catch (error) {
    console.error('❌ Error updating Supabase display name:', error)
    throw error
  }
}

/**
 * Get current Supabase metadata
 */
export async function getCurrentSupabaseMetadata(userId: string) {
  try {
    console.log('🔍 Getting current Supabase metadata for user:', userId)

    const response = await fetch(`/api/user/update-supabase-metadata?userId=${userId}`, {
      method: 'GET',
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Failed to get Supabase metadata:', result.error)
      throw new Error(result.error || 'Failed to get Supabase metadata')
    }

    console.log('✅ Supabase metadata retrieved:', result)
    return result

  } catch (error) {
    console.error('❌ Error getting Supabase metadata:', error)
    throw error
  }
}

/**
 * Test Supabase connection and metadata update
 */
export async function testSupabaseUpdate(userId: string, testData?: Partial<UpdateDisplayNameData>) {
  try {
    console.log('🧪 Testing Supabase update for user:', userId)

    const response = await fetch('/api/test-supabase-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        testData: testData || {
          first_name: 'TestFirstName',
          last_name: 'TestLastName',
          full_name: 'TestFirstName TestLastName',
          location: 'Test Location',
          phone: '123-456-7890',
          position: 'Test Position'
        }
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Supabase test failed:', result.error)
      throw new Error(result.error || 'Supabase test failed')
    }

    console.log('✅ Supabase test completed:', result)
    return result

  } catch (error) {
    console.error('❌ Error in Supabase test:', error)
    throw error
  }
}

