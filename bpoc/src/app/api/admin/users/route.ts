import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting to fetch users...')
    console.log('API: Database URL exists:', !!process.env.DATABASE_URL)
    
    // Fetch users from your users table using PostgreSQL
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    )

    console.log('API: Raw users data:', result.rows)
    console.log('API: Number of users found:', result.rows.length)

    // Transform the data to match the expected format
    const transformedUsers = result.rows.map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      last_sign_in_at: user.updated_at, // Using updated_at as last activity
      status: 'active', // All users in your table are active
      role: 'user', // Default role
      location: user.location,
      bio: user.bio,
      position: user.position,
      completed_data: user.completed_data,
      birthday: user.birthday,
      admin_level: user.admin_level || 'user',
      slug: user.slug
    }))

    return NextResponse.json({ 
      users: transformedUsers,
      total: transformedUsers.length,
      active: transformedUsers.filter((u: any) => u.status === 'active').length,
      inactive: transformedUsers.filter((u: any) => u.status === 'inactive').length
    })

  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, ...data } = body

    switch (action) {
      case 'update':
        // Update user in your users table using PostgreSQL
        const updateResult = await pool.query(
          'UPDATE users SET full_name = $1, email = $2, phone = $3, location = $4, bio = $5, position = $6, avatar_url = $7, updated_at = NOW() WHERE id = $8',
          [data.full_name, data.email, data.phone, data.location, data.bio, data.position, data.avatar_url, userId]
        )

        if (updateResult.rowCount === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'User updated successfully' })

      case 'toggleAdmin':
        // Toggle admin level between 'user' and 'admin'
        console.log('API: Toggling admin for user:', userId)
        
        const currentUser = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
        
        if (currentUser.rowCount === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const currentAdminLevel = currentUser.rows[0].admin_level
        
        console.log('API: Current admin_level:', currentAdminLevel)
        
        const newAdminLevel = currentAdminLevel === 'admin' ? 'user' : 'admin'
        
        console.log('API: New admin_level:', newAdminLevel)
        
        const toggleResult = await pool.query(
          'UPDATE users SET admin_level = $1, updated_at = NOW() WHERE id = $2',
          [newAdminLevel, userId]
        )

        if (toggleResult.rowCount === 0) {
          return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
        }

        // Verify the update by fetching the user again
        const verifyResult = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
        console.log('API: Verification - admin_level:', verifyResult.rows[0].admin_level)

        console.log('API: Successfully updated user admin status')

        return NextResponse.json({ 
          message: `User ${newAdminLevel === 'admin' ? 'promoted to admin' : 'demoted to user'} successfully`,
          newAdminLevel 
        })

      case 'delete':
        // Delete user from your users table using PostgreSQL
        const deleteResult = await pool.query(
          'DELETE FROM users WHERE id = $1',
          [userId]
        )

        if (deleteResult.rowCount === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'User deleted successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error in users API POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 