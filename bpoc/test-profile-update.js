const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testProfileUpdate() {
  console.log('🧪 Testing profile update process...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const supabaseAdmin = createClient(supabaseUrl, serviceKey)
  
  // Get the test user
  const { data: users } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 })
  const testUser = users.users[0]
  
  console.log('🔍 Test user:', testUser.email)
  console.log('🔍 Current name:', testUser.user_metadata?.full_name)
  
  // Simulate the profile update process
  const newFirstName = 'UpdatedJohn'
  const newLastName = 'UpdatedSmith'
  const newFullName = `${newFirstName} ${newLastName}`
  
  console.log('🔄 Updating profile with new name:', newFullName)
  
  const { data: updateResult, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(testUser.id, {
    user_metadata: {
      ...testUser.user_metadata,
      first_name: newFirstName,
      last_name: newLastName,
      full_name: newFullName,
      updated_at: new Date().toISOString()
    }
  })
  
  if (updateError) {
    console.error('❌ Profile update failed:', updateError.message)
    return
  }
  
  console.log('✅ Profile update successful!')
  console.log('✅ New name:', updateResult.user?.user_metadata?.full_name)
  console.log('✅ First name:', updateResult.user?.user_metadata?.first_name)
  console.log('✅ Last name:', updateResult.user?.user_metadata?.last_name)
  
  // Verify the update
  const { data: verifyUser } = await supabaseAdmin.auth.admin.getUserById(testUser.id)
  console.log('🔍 Verification - Current metadata:', verifyUser.user?.user_metadata?.full_name)
}

testProfileUpdate()

