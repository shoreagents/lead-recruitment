require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function showDatabaseSummary() {
  console.log('🗄️ SHOREAGENTS DATABASE SUMMARY\n')
  console.log('=' .repeat(60))
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    console.log('📋 ALL DATABASE TABLES:')
    console.log('=' .repeat(60))
    
    // 1. USERS TABLE
    console.log('\n👥 1. USERS TABLE')
    console.log('-'.repeat(40))
    const { data: users, error: usersError, count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (usersError) {
      console.log(`❌ Error: ${usersError.message}`)
    } else {
      console.log(`✅ Records: ${usersCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(users, null, 2))
    }
    
    // 2. PRICING_QUOTES TABLE
    console.log('\n💰 2. PRICING_QUOTES TABLE')
    console.log('-'.repeat(40))
    const { data: quotes, error: quotesError, count: quotesCount } = await supabase
      .from('pricing_quotes')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (quotesError) {
      console.log(`❌ Error: ${quotesError.message}`)
    } else {
      console.log(`✅ Records: ${quotesCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(quotes, null, 2))
    }
    
    // 3. CANDIDATE_VIEWS TABLE
    console.log('\n👀 3. CANDIDATE_VIEWS TABLE')
    console.log('-'.repeat(40))
    const { data: views, error: viewsError, count: viewsCount } = await supabase
      .from('candidate_views')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (viewsError) {
      console.log(`❌ Error: ${viewsError.message}`)
    } else {
      console.log(`✅ Records: ${viewsCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(views, null, 2))
    }
    
    // 4. AI_ANALYSIS TABLE
    console.log('\n🤖 4. AI_ANALYSIS TABLE')
    console.log('-'.repeat(40))
    const { data: analysis, error: analysisError, count: analysisCount } = await supabase
      .from('ai_analysis')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (analysisError) {
      console.log(`❌ Error: ${analysisError.message}`)
    } else {
      console.log(`✅ Records: ${analysisCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(analysis, null, 2))
    }
    
    // 5. BPOC_EMPLOYEES TABLE
    console.log('\n🏢 5. BPOC_EMPLOYEES TABLE')
    console.log('-'.repeat(40))
    const { data: employees, error: employeesError, count: employeesCount } = await supabase
      .from('bpoc_employees')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (employeesError) {
      console.log(`❌ Error: ${employeesError.message}`)
    } else {
      console.log(`✅ Records: ${employeesCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(employees, null, 2))
    }
    
    // 6. INTERVIEW_REQUEST TABLE
    console.log('\n📞 6. INTERVIEW_REQUEST TABLE')
    console.log('-'.repeat(40))
    const { data: interviews, error: interviewsError, count: interviewsCount } = await supabase
      .from('interview_request')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (interviewsError) {
      console.log(`❌ Error: ${interviewsError.message}`)
    } else {
      console.log(`✅ Records: ${interviewsCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(interviews, null, 2))
    }
    
    // 7. PRICING_QUOTE_ROLES TABLE
    console.log('\n💼 7. PRICING_QUOTE_ROLES TABLE')
    console.log('-'.repeat(40))
    const { data: roles, error: rolesError, count: rolesCount } = await supabase
      .from('pricing_quote_roles')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (rolesError) {
      console.log(`❌ Error: ${rolesError.message}`)
    } else {
      console.log(`✅ Records: ${rolesCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(roles, null, 2))
    }
    
    // 8. USER_PAGE_VISITS TABLE
    console.log('\n🌐 8. USER_PAGE_VISITS TABLE')
    console.log('-'.repeat(40))
    const { data: visits, error: visitsError, count: visitsCount } = await supabase
      .from('user_page_visits')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (visitsError) {
      console.log(`❌ Error: ${visitsError.message}`)
    } else {
      console.log(`✅ Records: ${visitsCount}`)
      console.log('📊 Sample data:')
      console.log(JSON.stringify(visits, null, 2))
    }
    
    // SUMMARY
    console.log('\n📊 DATABASE SUMMARY:')
    console.log('=' .repeat(60))
    console.log(`✅ Users: ${usersCount || 0} records`)
    console.log(`✅ Pricing Quotes: ${quotesCount || 0} records`)
    console.log(`✅ Candidate Views: ${viewsCount || 0} records`)
    console.log(`✅ AI Analysis: ${analysisCount || 0} records`)
    console.log(`✅ BPOC Employees: ${employeesCount || 0} records`)
    console.log(`✅ Interview Requests: ${interviewsCount || 0} records`)
    console.log(`✅ Pricing Quote Roles: ${rolesCount || 0} records`)
    console.log(`✅ User Page Visits: ${visitsCount || 0} records`)
    
    const totalRecords = (usersCount || 0) + (quotesCount || 0) + (viewsCount || 0) + 
                       (analysisCount || 0) + (employeesCount || 0) + (interviewsCount || 0) + 
                       (rolesCount || 0) + (visitsCount || 0)
    
    console.log(`\n🎯 TOTAL RECORDS: ${totalRecords}`)
    console.log('\n✅ Database analysis completed!')
    
  } catch (error) {
    console.error('❌ Database analysis failed:', error.message)
  }
}

showDatabaseSummary()




