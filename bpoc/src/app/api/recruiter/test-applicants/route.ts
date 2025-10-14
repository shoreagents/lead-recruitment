import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      console.log('🔍 Testing recruiter_applications table for job:', jobId);

      // Test 1: Check if table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'recruiter_applications'
        );
      `);
      
      console.log('🔍 Table exists:', tableExists.rows[0]?.exists);

      // Test 2: Check table structure
      const tableStructure = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'recruiter_applications'
        ORDER BY ordinal_position;
      `);
      
      console.log('🔍 Table structure:', tableStructure.rows);

      // Test 3: Check if job exists in recruiter_jobs
      const jobExists = await client.query(
        'SELECT id, job_title FROM recruiter_jobs WHERE id = $1',
        [jobId]
      );
      
      console.log('🔍 Job exists:', jobExists.rows.length > 0);

      // Test 4: Count applications for this job
      const appCount = await client.query(
        'SELECT COUNT(*) as count FROM recruiter_applications WHERE job_id = $1',
        [jobId]
      );
      
      console.log('🔍 Application count:', appCount.rows[0]?.count);

      // Test 5: Try to get basic application data
      const basicData = await client.query(`
        SELECT id, user_id, job_id, status, created_at
        FROM recruiter_applications 
        WHERE job_id = $1
        LIMIT 5
      `, [jobId]);
      
      console.log('🔍 Basic application data:', basicData.rows);

      // Test 6: Check foreign key constraints
      const constraints = await client.query(`
        SELECT 
          tc.constraint_name, 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name='recruiter_applications';
      `);
      
      console.log('🔍 Foreign key constraints:', constraints.rows);

      return NextResponse.json({
        success: true,
        tests: {
          tableExists: tableExists.rows[0]?.exists,
          tableStructure: tableStructure.rows,
          jobExists: jobExists.rows.length > 0,
          applicationCount: appCount.rows[0]?.count,
          basicApplicationData: basicData.rows,
          foreignKeyConstraints: constraints.rows
        }
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
