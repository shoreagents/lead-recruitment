import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM privacy_settings WHERE user_id = $1',
        [userId]
      )

      if (result.rowCount === 0) {
        // Return default settings if no privacy settings exist
        return NextResponse.json({
          success: true,
          data: {
            username: 'public',
            first_name: 'public',
            last_name: 'only-me',
            location: 'public',
            job_title: 'public',
            birthday: 'only-me',
            age: 'only-me',
            gender: 'only-me',
            member_since: 'public',
            resume_score: 'public',
            games_completed: 'public',
            key_strengths: 'only-me'
          }
        })
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error fetching privacy settings:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch privacy settings',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...privacySettings } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Validate privacy settings
    const validValues = ['public', 'only-me']
    const settingsToValidate = [
      'username', 'first_name', 'last_name', 'location', 'job_title',
      'birthday', 'age', 'gender', 'member_since', 'resume_score',
      'games_completed', 'key_strengths'
    ]

    for (const setting of settingsToValidate) {
      if (privacySettings[setting] && !validValues.includes(privacySettings[setting])) {
        return NextResponse.json(
          { error: `Invalid value for ${setting}. Must be 'public' or 'only-me'` },
          { status: 400 }
        )
      }
    }

    const client = await pool.connect()
    try {
      // Upsert privacy settings
      const result = await client.query(
        `INSERT INTO privacy_settings (
          user_id, username, first_name, last_name, location, job_title,
          birthday, age, gender, member_since, resume_score, games_completed, key_strengths
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )
        ON CONFLICT (user_id) DO UPDATE SET
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          location = EXCLUDED.location,
          job_title = EXCLUDED.job_title,
          birthday = EXCLUDED.birthday,
          age = EXCLUDED.age,
          gender = EXCLUDED.gender,
          member_since = EXCLUDED.member_since,
          resume_score = EXCLUDED.resume_score,
          games_completed = EXCLUDED.games_completed,
          key_strengths = EXCLUDED.key_strengths,
          updated_at = NOW()
        RETURNING *`,
        [
          userId,
          privacySettings.username || 'public',
          privacySettings.first_name || 'public',
          privacySettings.last_name || 'only-me',
          privacySettings.location || 'public',
          privacySettings.job_title || 'public',
          privacySettings.birthday || 'only-me',
          privacySettings.age || 'only-me',
          privacySettings.gender || 'only-me',
          privacySettings.member_since || 'public',
          privacySettings.resume_score || 'public',
          privacySettings.games_completed || 'public',
          privacySettings.key_strengths || 'only-me'
        ]
      )

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Privacy settings updated successfully'
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error updating privacy settings:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update privacy settings',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
