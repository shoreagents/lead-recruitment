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
  const client = await pool.connect()
  
  try {
    // Capitalize names before processing
    const capitalizedNames = capitalizeNames(userData.first_name, userData.last_name);
    const capitalizedFullName = capitalizeFullName(userData.full_name);
    
    console.log('🔄 Starting server-side user sync for:', userData.email)
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
      
      // First, get the existing completed_data value to preserve it
      const existingUserQuery = 'SELECT completed_data FROM users WHERE id = $1'
      const existingUserResult = await client.query(existingUserQuery, [userData.id])
      const existingCompletedData = existingUserResult.rows[0]?.completed_data
      
      console.log('🔍 Existing completed_data value:', existingCompletedData)
      console.log('🔍 New completed_data value from metadata:', userData.completed_data)
      
      // Use existing completed_data if it's true, otherwise use the new value
      const finalCompletedData = existingCompletedData === true ? true : (userData.completed_data ?? false)
      
      console.log('🔍 Final completed_data value to save:', finalCompletedData)
      
      const updateQuery = `
        UPDATE users SET
          email = $2,
          first_name = COALESCE(NULLIF($3, ''), SPLIT_PART($2, '@', 1)),
          last_name = COALESCE(NULLIF($4, ''), ''),
          full_name = COALESCE(NULLIF($5, ''), $2),
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
        capitalizedNames.firstName,
        capitalizedNames.lastName,
        capitalizedFullName,
        userData.location,
        userData.avatar_url,
        userData.phone,
        userData.bio,
        userData.position,
        userData.company,
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
    throw error
  } finally {
    client.release()
  }
}
