import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    
    try {
      const { searchParams } = new URL(request.url)
      const range = (searchParams.get('range') || '7d').toLowerCase()
      const rangeToDays: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }
      const days = rangeToDays[range] ?? 7

      // Get daily job application counts for selected window
      const applicationTrendsQuery = `
        WITH date_series AS (
          SELECT generate_series(
            CURRENT_DATE - INTERVAL '${days - 1} days',
            CURRENT_DATE,
            INTERVAL '1 day'
          )::date AS date
        ),
        daily_applications AS (
          SELECT 
            DATE(a.created_at) as application_date,
            COUNT(*) as application_count
          FROM applications a
          WHERE a.created_at >= CURRENT_DATE - INTERVAL '${days - 1} days'
          GROUP BY DATE(a.created_at)
        )
        SELECT 
          ds.date,
          COALESCE(da.application_count, 0) as application_count,
          TO_CHAR(ds.date, 'Mon DD') as display_date
        FROM date_series ds
        LEFT JOIN daily_applications da ON ds.date = da.application_date
        ORDER BY ds.date ASC
      `

      const result = await client.query(applicationTrendsQuery)
      
      // Transform the data for the chart
      const applicationTrends = result.rows.map((row: any) => ({
        date: row.date,
        count: parseInt(row.application_count),
        displayDate: row.display_date
      }))

      return NextResponse.json({ 
        application_trends: applicationTrends 
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error getting application trends:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
