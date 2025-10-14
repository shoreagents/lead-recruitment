import { Pool } from 'pg';

/**
 * BPOC Database Connection Pool
 * 
 * This creates a direct connection to the BPOC database to fetch candidate data.
 * Used for faster data access compared to HTTP API calls.
 * 
 * Configuration:
 * - Uses BPOC_DATABASE_URL environment variable
 * - Connection pooling for efficient resource usage
 * - SSL enabled for secure connections
 * - Max 10 concurrent connections
 */

// Singleton pool instance
let bpocPool: Pool | null = null;

/**
 * Get or create BPOC database connection pool
 * Returns the same pool instance on subsequent calls
 */
export function getBPOCPool(): Pool {
  if (!bpocPool) {
    const connectionString = process.env.BPOC_DATABASE_URL;
    
    if (!connectionString) {
      throw new Error(
        'BPOC_DATABASE_URL environment variable is not set. ' +
        'Please add it to your .env.local file.'
      );
    }

    bpocPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for Supabase connections
      },
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Timeout connection attempts after 2 seconds
    });

    // Log pool errors
    bpocPool.on('error', (err) => {
      console.error('Unexpected error on BPOC database pool:', err);
    });

    console.log('✅ BPOC database connection pool created');
  }
  
  return bpocPool;
}

/**
 * Close the BPOC database connection pool
 * Call this when shutting down the application
 */
export async function closeBPOCPool() {
  if (bpocPool) {
    await bpocPool.end();
    bpocPool = null;
    console.log('🔌 BPOC database connection pool closed');
  }
}

/**
 * Test the BPOC database connection
 * Returns true if connection is successful
 */
export async function testBPOCConnection(): Promise<boolean> {
  try {
    const pool = getBPOCPool();
    const result = await pool.query('SELECT NOW()');
    console.log('✅ BPOC database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ BPOC database connection test failed:', error);
    return false;
  }
}

