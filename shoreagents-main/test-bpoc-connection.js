/**
 * Quick test script to verify BPOC database connection
 * Run with: node test-bpoc-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing BPOC database connection...\n');
  
  // Check if environment variable is set
  if (!process.env.BPOC_DATABASE_URL) {
    console.error('❌ BPOC_DATABASE_URL is not set in .env.local');
    console.log('\nPlease add it to your .env.local file:');
    console.log('BPOC_DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"');
    process.exit(1);
  }
  
  console.log('✅ BPOC_DATABASE_URL is set');
  console.log('📡 Connection string:', process.env.BPOC_DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
  const pool = new Pool({
    connectionString: process.env.BPOC_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Test basic connection
    console.log('\n🔌 Testing connection...');
    const timeResult = await pool.query('SELECT NOW()');
    console.log('✅ Connected successfully!');
    console.log('⏰ Server time:', timeResult.rows[0].now);
    
    // Test view access
    console.log('\n📊 Testing v_user_complete_data view...');
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM public.v_user_complete_data'
    );
    console.log('✅ View is accessible!');
    console.log('👥 Total candidates:', countResult.rows[0].total);
    
    // Get sample data
    console.log('\n📝 Fetching sample candidate...');
    const sampleResult = await pool.query(
      'SELECT user_id, full_name, position, overall_score FROM public.v_user_complete_data ORDER BY overall_score DESC LIMIT 1'
    );
    
    if (sampleResult.rows.length > 0) {
      console.log('✅ Sample candidate retrieved:');
      console.log('   Name:', sampleResult.rows[0].full_name);
      console.log('   Position:', sampleResult.rows[0].position || 'Not specified');
      console.log('   Score:', sampleResult.rows[0].overall_score || 'N/A');
    }
    
    console.log('\n✨ All tests passed! Your BPOC database connection is working correctly.\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Hint: Check your database password in BPOC_DATABASE_URL');
    } else if (error.message.includes('no such file or directory')) {
      console.log('\n💡 Hint: Make sure .env.local file exists in shoreagents-main folder');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Hint: The v_user_complete_data view might not exist in your BPOC database');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();

