require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function showTablesSimple() {
  console.log('🔍 Connecting to Supabase database...\n')
  
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables!')
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    return
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  console.log(`✅ Service Role Key: ${supabaseKey.substring(0, 20)}...`)
  console.log('')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    console.log('📋 TESTING TABLE ACCESS:')
    console.log('=' .repeat(50))
    
    // Test users table
    console.log('\n🔍 Testing USERS table...')
    try {
      const { data: users, error: usersError, count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      if (usersError) {
        console.log(`❌ Users table error: ${usersError.message}`)
      } else {
        console.log(`✅ Users table accessible - ${usersCount} records`)
      }
    } catch (error) {
      console.log(`❌ Users table error: ${error.message}`)
    }
    
    // Test pricing_quotes table
    console.log('\n🔍 Testing PRICING_QUOTES table...')
    try {
      const { data: quotes, error: quotesError, count: quotesCount } = await supabase
        .from('pricing_quotes')
        .select('*', { count: 'exact', head: true })
      
      if (quotesError) {
        console.log(`❌ Pricing quotes table error: ${quotesError.message}`)
      } else {
        console.log(`✅ Pricing quotes table accessible - ${quotesCount} records`)
      }
    } catch (error) {
      console.log(`❌ Pricing quotes table error: ${error.message}`)
    }
    
    // Try to get a few sample records from each table
    console.log('\n📋 SAMPLE DATA:')
    console.log('=' .repeat(50))
    
    // Sample from users (limit to 3 records)
    console.log('\n👥 USERS (first 3 records):')
    try {
      const { data: usersSample, error: usersSampleError } = await supabase
        .from('users')
        .select('*')
        .limit(3)
      
      if (usersSampleError) {
        console.log(`❌ Error: ${usersSampleError.message}`)
      } else {
        console.log(`Found ${usersSample.length} sample users:`)
        console.log(JSON.stringify(usersSample, null, 2))
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`)
    }
    
    // Sample from pricing_quotes (limit to 3 records)
    console.log('\n💰 PRICING QUOTES (first 3 records):')
    try {
      const { data: quotesSample, error: quotesSampleError } = await supabase
        .from('pricing_quotes')
        .select('*')
        .limit(3)
      
      if (quotesSampleError) {
        console.log(`❌ Error: ${quotesSampleError.message}`)
      } else {
        console.log(`Found ${quotesSample.length} sample pricing quotes:`)
        console.log(JSON.stringify(quotesSample, null, 2))
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`)
    }
    
    console.log('\n✅ Database connection test completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Full error:', error)
  }
}

showTablesSimple()




