import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false })
    }

    // If DATABASE_URL is not configured (e.g., local dev without DB), avoid failing fetch
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ isAdmin: false })
    }

    // Lazy-load database pool only when DB is configured
    const { default: pool } = await import('@/lib/database')

    // Check if user is admin in the Railway users table
    const query = `
      SELECT id, email, full_name, admin_level, avatar_url 
      FROM users 
      WHERE id = $1 AND admin_level = 'admin'
    `
    const result = await pool.query(query, [userId])
    
    if (result.rows.length > 0) {
      return NextResponse.json({
        isAdmin: true,
        adminUser: result.rows[0]
      })
    }

    return NextResponse.json({ isAdmin: false })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
} 