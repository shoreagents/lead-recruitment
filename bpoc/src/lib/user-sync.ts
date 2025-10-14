import { User } from '@supabase/supabase-js'

export async function syncUserToDatabase(user: User) {
  try {
    console.log('🔄 Starting client-side user sync for:', user.email)
    
    // Skip sync if user doesn't have required data
    if (!user.id || !user.email) {
      console.log('⏭️ Skipping sync - missing required user data')
      return { success: true, action: 'skipped', reason: 'missing_data' }
    }
    
    // Extract user data from Supabase user object
    const userData = {
      id: user.id,
      email: user.email || '',
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      full_name: user.user_metadata?.full_name || user.user_metadata?.first_name + ' ' + user.user_metadata?.last_name || '',
      location: user.user_metadata?.location || '',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      phone: user.user_metadata?.phone || null,
      bio: user.user_metadata?.bio || null,
      position: user.user_metadata?.position || null,
      company: user.user_metadata?.company || null,
      completed_data: user.user_metadata?.completed_data ?? false,
      birthday: user.user_metadata?.birthday || null,
      gender: user.user_metadata?.gender || null,
      admin_level: user.user_metadata?.admin_level || 'user'
    }

    console.log('📤 Sending user data to sync API:', {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      admin_level: userData.admin_level
    })

    // Call the sync API endpoint
    const response = await fetch('/api/user/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    console.log('📡 Sync API response status:', response.status)
    console.log('📡 Sync API response headers:', Object.fromEntries(response.headers.entries()))

    // Read the response body once
    const responseText = await response.text()
    console.log('📄 Raw response text:', responseText)
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorData.details || errorMessage
        } catch (jsonError) {
          console.log('⚠️ Could not parse error response as JSON')
          errorMessage = responseText || errorMessage
        }
      }
      throw new Error(`Sync API error: ${errorMessage}`)
    }
    
    if (!responseText) {
      throw new Error('Empty response from sync API')
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:', parseError)
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    console.log('✅ Client-side sync completed:', result)
    return result

  } catch (error) {
    console.error('❌ Error in client-side user sync:', error)
    throw error
  }
}
