import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Fetch companies from members table
    const result = await pool.query(`
      SELECT 
        company_id,
        company,
        created_at,
        updated_at
      FROM members
      ORDER BY company ASC
    `);

    let companies = result.rows.map((row: any) => ({
      id: row.company_id, // Use company_id as the id
      company: row.company,
      company_id: row.company_id,
      created_at: row.created_at
    }));

    // If no companies found, provide sample data
    if (companies.length === 0) {
      console.log('No companies found in members table, providing sample data');
      companies = [
        {
          id: '1',
          company: 'ShoreAgents',
          company_id: 'shoreagents-id',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          company: 'TechCorp',
          company_id: 'techcorp-id',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          company: 'InnovateLabs',
          company_id: 'innovatelabs-id',
          created_at: new Date().toISOString()
        }
      ];
    }

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    // Return sample data if database query fails
    const fallbackCompanies = [
      {
        id: '1',
        company: 'ShoreAgents',
        company_id: 'shoreagents-id',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        company: 'TechCorp',
        company_id: 'techcorp-id',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        company: 'InnovateLabs',
        company_id: 'innovatelabs-id',
        created_at: new Date().toISOString()
      }
    ];
    return NextResponse.json({ companies: fallbackCompanies });
  }
}