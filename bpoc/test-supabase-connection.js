const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection and metadata update...')
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  console.log('🔍 Environment check:')
  console.log('🔍 Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing')
  console.log('🔍 Service key available:', !!serviceKey)
  
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing environment variables')
    return
  }
  
  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)
    
    console.log('🔍 Testing Supabase connection...')
    
    // Test connection by getting auth users (this requires service role)
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1
    })
    
    if (usersError) {
      console.error('❌ Failed to connect to Supabase:', usersError.message)
      console.error('❌ Error details:', usersError)
      return
    }
    
    console.log('✅ Successfully connected to Supabase!')
    console.log('✅ Found', users.users.length, 'users')
    
    if (users.users.length > 0) {
      const testUser = users.users[0]
      console.log('🔍 Test user ID:', testUser.id)
      console.log('🔍 Test user email:', testUser.email)
      console.log('🔍 Current metadata:', testUser.user_metadata)
      
      // Test updating metadata
      console.log('🔄 Testing metadata update...')
      const { data: updateResult, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(testUser.id, {
        user_metadata: {
          ...testUser.user_metadata,
          test_update: new Date().toISOString(),
          test_field: 'This is a test update'
        }
      })
      
      if (updateError) {
        console.error('❌ Failed to update metadata:', updateError.message)
        console.error('❌ Update error details:', updateError)
      } else {
        console.log('✅ Metadata update successful!')
        console.log('✅ Updated user:', updateResult.user?.email)
        console.log('✅ New metadata:', updateResult.user?.user_metadata)
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('❌ Error details:', error)
  }
}

testSupabaseConnection()

