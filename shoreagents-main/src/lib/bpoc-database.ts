// BPOC Database Client
// ===================
// Direct connection to BPOC database instead of using public API

import { Pool } from 'pg';

// Database connection pool
let bpocPool: Pool | null = null;

export function getBPOCDatabasePool(): Pool {
  if (!bpocPool) {
    const databaseUrl = process.env.BPOC_DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('BPOC_DATABASE_URL environment variable is not set');
    }

    bpocPool = new Pool({
      connectionString: databaseUrl,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });
  }

  return bpocPool;
}

// Close the database pool (useful for cleanup)
export async function closeBPOCDatabasePool(): Promise<void> {
  if (bpocPool) {
    await bpocPool.end();
    bpocPool = null;
  }
}

// Test database connection
export async function testBPOCDatabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const pool = getBPOCDatabasePool();
    const client = await pool.connect();
    
    // Test query - adjust table name as needed
    const result = await client.query('SELECT 1 as test');
    client.release();
    
    return {
      success: true,
      message: 'Successfully connected to BPOC database'
    };
  } catch (error) {
    return {
      success: false,
      message: `BPOC database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Interface for BPOC user data from database
export interface BPOCDatabaseUser {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  location: string;
  avatar_url: string | null;
  bio: string | null;
  position: string | null;
  current_position: string | null;
  expected_salary: string | null;
  work_status: string | null;
  work_status_completed: boolean | null;
  overall_score: number | null;
  skills_snapshot: string[] | null;
  experience_snapshot: any[] | null;
  user_created_at: string;
  key_strengths: string[] | null;
  improvements: string[] | null;
  recommendations: string[] | null;
  improved_summary: string | null;
  strengths_analysis: any | null;
  candidate_profile: any | null;
}

// Fetch all users from BPOC database
export async function fetchBPOCUsersFromDatabase(): Promise<BPOCDatabaseUser[]> {
  const pool = getBPOCDatabasePool();
  const client = await pool.connect();
  
  try {
    // Use the actual database schema - users table with correct column names
    const query = `
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.full_name,
        u.location,
        u.avatar_url,
        u.bio,
        u.position,
        u.created_at as user_created_at,
        COALESCE(ws.current_position, u.position) as current_position,
        COALESCE(ws.expected_salary, '0') as expected_salary,
        COALESCE(ws.work_status::text, 'Not specified') as work_status,
        COALESCE(ws.completed_data, false) as work_status_completed,
        COALESCE(ar.overall_score, 0) as overall_score,
        COALESCE(ar.skills_snapshot, '[]'::jsonb) as skills_snapshot,
        COALESCE(ar.experience_snapshot, '[]'::jsonb) as experience_snapshot,
        COALESCE(ar.key_strengths, '[]'::jsonb) as key_strengths,
        COALESCE(ar.improvements, '[]'::jsonb) as improvements,
        COALESCE(ar.recommendations, '[]'::jsonb) as recommendations,
        COALESCE(ar.improved_summary, '') as improved_summary,
        COALESCE(ar.strengths_analysis, '{}'::jsonb) as strengths_analysis,
        COALESCE(ar.candidate_profile, '{}'::jsonb) as candidate_profile
      FROM users u
      LEFT JOIN user_work_status ws ON u.id = ws.user_id
      LEFT JOIN ai_analysis_results ar ON u.id = ar.user_id
      WHERE u.id IS NOT NULL
      ORDER BY COALESCE(ar.overall_score, 0) DESC, u.created_at DESC
    `;
    
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

// Fetch user by ID from BPOC database
export async function fetchBPOCUserById(userId: string): Promise<BPOCDatabaseUser | null> {
  const pool = getBPOCDatabasePool();
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.full_name,
        u.location,
        u.avatar_url,
        u.bio,
        u.position,
        u.created_at as user_created_at,
        COALESCE(ws.current_position, u.position) as current_position,
        COALESCE(ws.expected_salary, '0') as expected_salary,
        COALESCE(ws.work_status::text, 'Not specified') as work_status,
        COALESCE(ws.completed_data, false) as work_status_completed,
        COALESCE(ar.overall_score, 0) as overall_score,
        COALESCE(ar.skills_snapshot, '[]'::jsonb) as skills_snapshot,
        COALESCE(ar.experience_snapshot, '[]'::jsonb) as experience_snapshot,
        COALESCE(ar.key_strengths, '[]'::jsonb) as key_strengths,
        COALESCE(ar.improvements, '[]'::jsonb) as improvements,
        COALESCE(ar.recommendations, '[]'::jsonb) as recommendations,
        COALESCE(ar.improved_summary, '') as improved_summary,
        COALESCE(ar.strengths_analysis, '{}'::jsonb) as strengths_analysis,
        COALESCE(ar.candidate_profile, '{}'::jsonb) as candidate_profile
      FROM users u
      LEFT JOIN user_work_status ws ON u.id = ws.user_id
      LEFT JOIN ai_analysis_results ar ON u.id = ar.user_id
      WHERE u.id = $1
    `;
    
    const result = await client.query(query, [userId]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
