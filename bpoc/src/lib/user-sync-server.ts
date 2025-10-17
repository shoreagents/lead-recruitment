import pool from '@/lib/database'
import { capitalizeNames, capitalizeFullName } from '@/lib/name-utils'

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  location: string
  avatar_url?: string | null
  phone?: string | null
  bio?: string | null
  position?: string | null
  company?: string | null
  completed_data?: boolean | null
  birthday?: string | null
  gender?: string | null
  admin_level?: string
}

export async function syncUserToDatabaseServer(userData: UserData) {
  console.log('🔄 Starting server-side user sync for:', userData.email)
  
  // Check environment variables
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  console.log('🔧 Database configuration check:', {
    hasDatabaseUrl: !!databaseUrl,
    databaseUrlPrefix: databaseUrl ? databaseUrl.substring(0, 30) + '...' : 'missing'
  })
  
  const client = await pool.connect()
  
  try {
    // Test database connection first
    console.log('🧪 Testing database connection...')
    await client.query('SELECT NOW()')
    console.log('✅ Database connection successful')
    
    // Capitalize names before processing
    const capitalizedNames = capitalizeNames(userData.first_name, userData.last_name);
    const capitalizedFullName = capitalizeFullName(userData.full_name);
    
    console.log('🔍 User data received:', {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      full_name: userData.full_name,
      admin_level: userData.admin_level
    })
    console.log('📝 Capitalized names:', {
      first_name: capitalizedNames.firstName,
      last_name: capitalizedNames.lastName,
      full_name: capitalizedFullName
    })
    
    // Check if user already exists
    const checkQuery = 'SELECT id FROM users WHERE id = $1'
    const checkResult = await client.query(checkQuery, [userData.id])
    
    if (checkResult.rows.length > 0) {
      // User exists, update their data
      console.log('👤 User exists, updating data...')
      
      // Get existing user data to preserve manual changes
      const existingUserQuery = `
        SELECT first_name, last_name, full_name, location, avatar_url, phone, bio, position, 
               company, completed_data, birthday, gender, admin_level, updated_at
        FROM users WHERE id = $1
      `
      const existingUserResult = await client.query(existingUserQuery, [userData.id])
      const existingUser = existingUserResult.rows[0]
      
      console.log('🔍 Existing user data from database:', existingUser)
      console.log('🔍 New data from Supabase metadata:', {
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: userData.full_name,
        location: userData.location,
        phone: userData.phone,
        bio: userData.bio,
        position: userData.position
      })
      
      // Check if we actually need to update anything
      const hasExistingData = existingUser.first_name || existingUser.last_name || existingUser.full_name
      const hasNewData = userData.first_name || userData.last_name || userData.full_name
      
      if (hasExistingData && !hasNewData) {
        console.log('🛡️ Skipping sync - user has existing data and no new Supabase metadata')
        return {
          success: true,
          action: 'skipped',
          user: existingUser,
          reason: 'Existing data preserved, no new metadata to sync'
        }
      }
      
      // Preserve existing values if they exist and are not empty
      // Only update with Supabase metadata if database values are empty/null
      // This prevents manual changes from being overwritten by older Supabase metadata
      const finalFirstName = existingUser.first_name || userData.first_name || ''
      const finalLastName = existingUser.last_name || userData.last_name || ''
      const finalFullName = existingUser.full_name || userData.full_name || ''
      const finalLocation = existingUser.location || userData.location || ''
      const finalPhone = existingUser.phone || userData.phone || ''
      const finalBio = existingUser.bio || userData.bio || ''
      const finalPosition = existingUser.position || userData.position || ''
      const finalCompany = existingUser.company || userData.company || ''
      const finalAvatarUrl = existingUser.avatar_url || userData.avatar_url || ''
      
      console.log('🛡️ Data preservation logic:')
      console.log('🛡️ - Database values take priority over Supabase metadata')
      console.log('🛡️ - This prevents manual profile changes from being overwritten')
      console.log('🛡️ - Only empty/null database fields will be updated from Supabase')
      
      // Use existing completed_data if it's true, otherwise use the new value
      const finalCompletedData = existingUser.completed_data === true ? true : (userData.completed_data ?? false)
      
      console.log('🔍 Final values to save (preserving existing data):', {
        first_name: finalFirstName,
        last_name: finalLastName,
        full_name: finalFullName,
        location: finalLocation,
        phone: finalPhone,
        bio: finalBio,
        position: finalPosition,
        company: finalCompany,
        completed_data: finalCompletedData
      })
      
      const updateQuery = `
        UPDATE users SET
          email = $2,
          first_name = $3,
          last_name = $4,
          full_name = $5,
          location = $6,
          avatar_url = $7,
          phone = $8,
          bio = $9,
          position = $10,
          company = $11,
          completed_data = $12,
          birthday = $13,
          gender = $14,
          admin_level = $15,
          updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, first_name, last_name, admin_level
      `
      
      const updateResult = await client.query(updateQuery, [
        userData.id,
        userData.email,
        finalFirstName,
        finalLastName,
        finalFullName,
        finalLocation,
        finalAvatarUrl,
        finalPhone,
        finalBio,
        finalPosition,
        finalCompany,
        finalCompletedData,
        userData.birthday,
        userData.gender,
        userData.admin_level
      ])
      
      console.log('✅ User updated successfully:', updateResult.rows[0])
      console.log('🔍 Updated user data:', {
        id: updateResult.rows[0].id,
        email: updateResult.rows[0].email,
        first_name: updateResult.rows[0].first_name,
        last_name: updateResult.rows[0].last_name,
        admin_level: updateResult.rows[0].admin_level
      })
      console.log('⚠️ WARNING: User sync is updating admin_level to:', userData.admin_level)
      return {
        success: true,
        action: 'updated',
        user: updateResult.rows[0]
      }
      
    } else {
      // User doesn't exist, create new user
      console.log('👤 User does not exist, creating new user...')
      
      const insertQuery = `
        INSERT INTO users (
          id, email, first_name, last_name, full_name, location,
          avatar_url, phone, bio, position, company, completed_data,
          birthday, gender, admin_level, created_at, updated_at
        ) VALUES (
          $1, $2, COALESCE(NULLIF($3, ''), SPLIT_PART($2, '@', 1)), COALESCE(NULLIF($4, ''), ''), COALESCE(NULLIF($5, ''), $2), $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()
        )
        RETURNING id, email, first_name, last_name, admin_level
      `
      
      const insertResult = await client.query(insertQuery, [
        userData.id,
        userData.email,
        capitalizedNames.firstName,
        capitalizedNames.lastName,
        capitalizedFullName,
        userData.location,
        userData.avatar_url,
        userData.phone,
        userData.bio,
        userData.position,
        userData.company,
        userData.completed_data,
        userData.birthday,
        userData.gender,
        userData.admin_level
      ])
      
      console.log('✅ User created successfully:', insertResult.rows[0])
      console.log('🔍 Created user data:', {
        id: insertResult.rows[0].id,
        email: insertResult.rows[0].email,
        first_name: insertResult.rows[0].first_name,
        last_name: insertResult.rows[0].last_name,
        admin_level: insertResult.rows[0].admin_level
      })
      return {
        success: true,
        action: 'created',
        user: insertResult.rows[0]
      }
    }
    
  } catch (error) {
    console.error('❌ Error in server-side user sync:', error)
    
    // Enhanced error logging
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userData: {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name
      },
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`User sync failed: ${error.message}`)
    } else {
      throw new Error('User sync failed: Unknown error occurred')
    }
  } finally {
    client.release()
  }
}
