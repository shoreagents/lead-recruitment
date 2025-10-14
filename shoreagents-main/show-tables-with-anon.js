require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function showTablesWithAnon() {
  console.log('🔍 Connecting to Supabase database with ANON key...\n')
  
  // Initialize Supabase client with anon key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !anonKey) {
    console.error('❌ Missing Supabase environment variables!')
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
    return
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  console.log(`✅ Anon Key: ${anonKey.substring(0, 20)}...`)
  console.log('')
  
  const supabase = createClient(supabaseUrl, anonKey)
  
  try {
    console.log('📋 TESTING TABLE ACCESS:')
    console.log('=' .repeat(50))
    
    // Test users table
    console.log('\n🔍 Testing USERS table...')
    try {
      const { data: users, error: usersError, count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .limit(5) // Limit to 5 records for testing
      
      if (usersError) {
        console.log(`❌ Users table error: ${usersError.message}`)
      } else {
        console.log(`✅ Users table accessible - ${usersCount} total records`)
        console.log(`📄 Showing first ${users.length} records:`)
        console.log(JSON.stringify(users, null, 2))
      }
    } catch (error) {
      console.log(`❌ Users table error: ${error.message}`)
    }
    
    // Test pricing_quotes table
    console.log('\n🔍 Testing PRICING_QUOTES table...')
    try {
      const { data: quotes, error: quotesError, count: quotesCount } = await supabase
        .from('pricing_quotes')
        .select('*', { count: 'exact' })
        .limit(5) // Limit to 5 records for testing
      
      if (quotesError) {
        console.log(`❌ Pricing quotes table error: ${quotesError.message}`)
      } else {
        console.log(`✅ Pricing quotes table accessible - ${quotesCount} total records`)
        console.log(`📄 Showing first ${quotes.length} records:`)
        console.log(JSON.stringify(quotes, null, 2))
      }
    } catch (error) {
      console.log(`❌ Pricing quotes table error: ${error.message}`)
    }
    
    // Try to get all records if the tables are accessible
    console.log('\n📋 GETTING ALL DATA:')
    console.log('=' .repeat(50))
    
    // Get all users
    console.log('\n👥 ALL USERS:')
    try {
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('*')
      
      if (allUsersError) {
        console.log(`❌ Error getting all users: ${allUsersError.message}`)
      } else {
        console.log(`✅ Retrieved ${allUsers.length} users:`)
        console.log(JSON.stringify(allUsers, null, 2))
      }
    } catch (error) {
      console.log(`❌ Error getting all users: ${error.message}`)
    }
    
    // Get all pricing quotes
    console.log('\n💰 ALL PRICING QUOTES:')
    try {
      const { data: allQuotes, error: allQuotesError } = await supabase
        .from('pricing_quotes')
        .select('*')
      
      if (allQuotesError) {
        console.log(`❌ Error getting all pricing quotes: ${allQuotesError.message}`)
      } else {
        console.log(`✅ Retrieved ${allQuotes.length} pricing quotes:`)
        console.log(JSON.stringify(allQuotes, null, 2))
      }
    } catch (error) {
      console.log(`❌ Error getting all pricing quotes: ${error.message}`)
    }
    
    console.log('\n✅ Database query completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Full error:', error)
  }
}

showTablesWithAnon()




