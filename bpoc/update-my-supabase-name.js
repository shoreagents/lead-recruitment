const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function updateMySupabaseName() {
  console.log('🔄 Updating your Supabase display name...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const supabaseAdmin = createClient(supabaseUrl, serviceKey)
  
  // Get your user
  const { data: users } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 })
  const myUser = users.users[0]
  
  console.log('🔍 Current user:', myUser.email)
  console.log('🔍 Current display name:', myUser.user_metadata?.full_name)
  
  // Update with your actual name (replace with your real name)
  const newFirstName = 'John'  // Replace with your actual first name
  const newLastName = 'Smith'  // Replace with your actual last name
  const newFullName = `${newFirstName} ${newLastName}`
  
  console.log('🔄 Updating to:', newFullName)
  
  const { data: updateResult, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(myUser.id, {
    user_metadata: {
      ...myUser.user_metadata,
      first_name: newFirstName,
      last_name: newLastName,
      full_name: newFullName,
      updated_at: new Date().toISOString()
    }
  })
  
  if (updateError) {
    console.error('❌ Update failed:', updateError.message)
    return
  }
  
  console.log('✅ Display name updated successfully!')
  console.log('✅ New display name:', updateResult.user?.user_metadata?.full_name)
  console.log('✅ First name:', updateResult.user?.user_metadata?.first_name)
  console.log('✅ Last name:', updateResult.user?.user_metadata?.last_name)
}

updateMySupabaseName()

