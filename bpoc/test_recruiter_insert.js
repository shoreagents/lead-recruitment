// Simple test script to check if recruiter insert works
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testRecruiterInsert() {
  try {
    console.log('🧪 Testing recruiter insert...');
    
    // First, check current constraint
    const constraintResult = await pool.query(`
      SELECT conname, consrc 
      FROM pg_constraint 
      WHERE conname = 'users_admin_level_check'
    `);
    
    console.log('📋 Current constraint:', constraintResult.rows[0]);
    
    // Try to insert a test recruiter
    const testId = '00000000-0000-0000-0000-000000000001';
    const testEmail = 'test-recruiter@example.com';
    
    const insertResult = await pool.query(`
      INSERT INTO users (
        id, email, first_name, last_name, full_name, 
        location, admin_level, completed_data, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `, [
      testId,
      testEmail,
      'Test',
      'Recruiter',
      'Test Recruiter',
      'Test Location',
      'recruiter',
      false
    ]);
    
    console.log('✅ Recruiter insert successful:', insertResult.rows[0]);
    
    // Clean up
    await pool.query('DELETE FROM users WHERE id = $1', [testId]);
    console.log('🧹 Test record cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('❌ Error details:', error);
  } finally {
    await pool.end();
  }
}

testRecruiterInsert();
