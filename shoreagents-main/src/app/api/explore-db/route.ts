import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Exploring BPOC database structure...');
    
    // Import BPOC database functions
    const { getBPOCDatabasePool } = await import('@/lib/bpoc-database');
    
    const pool = getBPOCDatabasePool();
    const client = await pool.connect();
    
    try {
      // Get all table names
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      
      const tables = tablesResult.rows.map(row => row.table_name);
      
      // Get column information for each table
      const tableInfo = {};
      
      for (const tableName of tables) {
        const columnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName]);
        
        tableInfo[tableName] = columnsResult.rows;
      }
      
      // Try to find a table that might contain user data
      const userTables = tables.filter(table => 
        table.toLowerCase().includes('user') || 
        table.toLowerCase().includes('candidate') ||
        table.toLowerCase().includes('employee') ||
        table.toLowerCase().includes('profile')
      );
      
      // Get sample data from potential user tables
      const sampleData = {};
      
      for (const tableName of userTables.slice(0, 3)) { // Limit to first 3 tables
        try {
          const sampleResult = await client.query(`SELECT * FROM ${tableName} LIMIT 3`);
          sampleData[tableName] = sampleResult.rows;
        } catch (error) {
          sampleData[tableName] = { error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Database structure explored successfully',
        data: {
          allTables: tables,
          userTables: userTables,
          tableInfo: tableInfo,
          sampleData: sampleData,
          totalTables: tables.length
        }
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error exploring database:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to explore database structure',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}




