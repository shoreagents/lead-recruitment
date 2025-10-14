require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function showAllTables() {
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
    console.log('📋 USERS TABLE:')
    console.log('=' .repeat(50))
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
    } else {
      console.log(`Found ${users.length} users:`)
      console.log(JSON.stringify(users, null, 2))
    }
    console.log('\n')
    
    console.log('📋 PRICING_QUOTES TABLE:')
    console.log('=' .repeat(50))
    const { data: pricingQuotes, error: quotesError } = await supabase
      .from('pricing_quotes')
      .select('*')
    
    if (quotesError) {
      console.error('❌ Error fetching pricing quotes:', quotesError.message)
    } else {
      console.log(`Found ${pricingQuotes.length} pricing quotes:`)
      console.log(JSON.stringify(pricingQuotes, null, 2))
    }
    console.log('\n')
    
    // Get all tables from information_schema
    console.log('📋 ALL TABLES IN DATABASE:')
    console.log('=' .repeat(50))
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_all_tables')
    
    if (tablesError) {
      // Fallback: try to get table info from information_schema
      console.log('Trying alternative method to get table information...')
      const { data: tableInfo, error: tableInfoError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_type')
        .eq('table_schema', 'public')
      
      if (tableInfoError) {
        console.error('❌ Error fetching table information:', tableInfoError.message)
      } else {
        console.log('Available tables:')
        tableInfo.forEach(table => {
          console.log(`  - ${table.table_name} (${table.table_type})`)
        })
      }
    } else {
      console.log('All tables:', tables)
    }
    
    // Summary
    console.log('\n📊 SUMMARY:')
    console.log('=' .repeat(50))
    console.log(`✅ Users: ${users?.length || 0} records`)
    console.log(`✅ Pricing Quotes: ${pricingQuotes?.length || 0} records`)
    console.log(`✅ Total records: ${(users?.length || 0) + (pricingQuotes?.length || 0)}`)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Full error:', error)
  }
}

showAllTables()




