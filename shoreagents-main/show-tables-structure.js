require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function showTablesStructure() {
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
    // Get table information from information_schema
    console.log('📋 DATABASE TABLES:')
    console.log('=' .repeat(50))
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name')
    
    if (tablesError) {
      console.error('❌ Error fetching table information:', tablesError.message)
      return
    }
    
    console.log(`Found ${tables.length} tables in the database:`)
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table.table_name} (${table.table_type})`)
    })
    
    console.log('\n📋 TABLE COLUMNS:')
    console.log('=' .repeat(50))
    
    for (const table of tables) {
      console.log(`\n🔍 Table: ${table.table_name}`)
      console.log('-'.repeat(30))
      
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position')
      
      if (columnsError) {
        console.error(`❌ Error fetching columns for ${table.table_name}:`, columnsError.message)
        continue
      }
      
      columns.forEach(column => {
        const nullable = column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        const defaultVal = column.column_default ? ` DEFAULT ${column.column_default}` : ''
        console.log(`  - ${column.column_name}: ${column.data_type} ${nullable}${defaultVal}`)
      })
    }
    
    // Try to get row counts for each table
    console.log('\n📊 ROW COUNTS:')
    console.log('=' .repeat(50))
    
    for (const table of tables) {
      try {
        const { count, error: countError } = await supabase
          .from(table.table_name)
          .select('*', { count: 'exact', head: true })
        
        if (countError) {
          console.log(`  ${table.table_name}: Error getting count - ${countError.message}`)
        } else {
          console.log(`  ${table.table_name}: ${count} rows`)
        }
      } catch (error) {
        console.log(`  ${table.table_name}: Error - ${error.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Full error:', error)
  }
}

showTablesStructure()




