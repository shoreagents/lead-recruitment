/**
 * Utility functions for updating Supabase user metadata
 */

export interface SupabaseMetadata {
  first_name?: string
  last_name?: string
  full_name?: string
  location?: string
  phone?: string
  position?: string
  bio?: string
  company?: string
  location_place_id?: string
  location_lat?: number
  location_lng?: number
  location_city?: string
  location_province?: string
  location_country?: string
  location_barangay?: string
  location_region?: string
  gender?: string
  gender_custom?: string
  username?: string
  completed_data?: boolean
  birthday?: string
}

/**
 * Update Supabase user metadata via API
 */
export async function updateSupabaseMetadata(userId: string, metadata: SupabaseMetadata) {
  try {
    console.log('🔄 Updating Supabase metadata for user:', userId)
    console.log('📊 Metadata to update:', metadata)

    const response = await fetch('/api/user/update-supabase-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        metadata
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Failed to update Supabase metadata:', result.error)
      throw new Error(result.error || 'Failed to update Supabase metadata')
    }

    console.log('✅ Supabase metadata updated successfully:', result)
    return result

  } catch (error) {
    console.error('❌ Error updating Supabase metadata:', error)
    throw error
  }
}

/**
 * Get current Supabase user metadata
 */
export async function getSupabaseMetadata(userId: string) {
  try {
    console.log('🧪 Getting Supabase metadata for user:', userId)

    const response = await fetch(`/api/user/update-supabase-metadata?userId=${userId}`, {
      method: 'GET',
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Failed to get Supabase metadata:', result.error)
      throw new Error(result.error || 'Failed to get Supabase metadata')
    }

    console.log('✅ Supabase metadata retrieved successfully:', result)
    return result

  } catch (error) {
    console.error('❌ Error getting Supabase metadata:', error)
    throw error
  }
}

/**
 * Sync user profile data to Supabase metadata
 * This function takes user profile data and formats it for Supabase metadata
 */
export function syncProfileToSupabaseMetadata(profileData: any): SupabaseMetadata {
  return {
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    full_name: profileData.full_name,
    location: profileData.location,
    phone: profileData.phone,
    position: profileData.position,
    bio: profileData.bio,
    company: profileData.company,
    location_place_id: profileData.location_place_id,
    location_lat: profileData.location_lat,
    location_lng: profileData.location_lng,
    location_city: profileData.location_city,
    location_province: profileData.location_province,
    location_country: profileData.location_country,
    location_barangay: profileData.location_barangay,
    location_region: profileData.location_region,
    gender: profileData.gender,
    gender_custom: profileData.gender_custom,
    username: profileData.username,
    completed_data: profileData.completed_data,
    birthday: profileData.birthday
  }
}

