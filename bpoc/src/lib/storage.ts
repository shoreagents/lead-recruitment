import { supabase } from './supabase'

// Test function to check Supabase Storage configuration
export const testStorageConnection = async () => {
  try {
    console.log('🔍 Testing Supabase Storage connection...')
    
    // Check if we can list files in the bucket
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .list('', {
        limit: 1,
        offset: 0
      })
    
    if (error) {
      console.error('❌ Storage connection test failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return { success: false, error: error.message }
    }
    
    console.log('✅ Storage connection test successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Storage connection test error:', error)
    return { success: false, error: String(error) }
  }
}

// Profile photo storage functions
export const uploadProfilePhoto = async (file: File, userId: string) => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size must be less than 5MB')
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    
    console.log('📤 Uploading to Supabase Storage:', {
      bucket: 'profile-photos',
      fileName,
      fileSize: file.size,
      fileType: file.type,
      userId
    })
    
    // Upload to Supabase Storage with simpler options
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting
      })
    
    if (error) {
      console.error('❌ Supabase upload error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        statusCode: error.statusCode
      })
      
      // Check if it's an RLS error
      if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        throw new Error('Storage access denied. Please check bucket permissions and RLS policies.')
      }
      
      throw new Error(`Upload failed: ${error.message || 'Unknown error'}`)
    }
    
    console.log('✅ File uploaded successfully:', data)
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)
    
    console.log('🔗 Public URL generated:', publicUrl)
    
    return { fileName, publicUrl }
  } catch (error) {
    // Enhanced error logging
    console.error('❌ Error uploading profile photo:', {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    })
    
    // Extract meaningful error message
    let errorMessage = 'Upload failed'
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
      if ('message' in error) {
        errorMessage = String(error.message)
      } else if ('error' in error) {
        errorMessage = String(error.error)
      } else {
        errorMessage = JSON.stringify(error)
      }
    } else {
      errorMessage = String(error)
    }
    
    throw new Error(`Profile photo upload failed: ${errorMessage}`)
  }
}

export const deleteProfilePhoto = async (fileName: string) => {
  try {
    const { error } = await supabase.storage
      .from('profile-photos')
      .remove([fileName])
    
    if (error) {
      console.error('❌ Supabase delete error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Delete failed: ${error.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error deleting profile photo:', error)
    throw error
  }
}

export const getProfilePhotoUrl = (fileName: string) => {
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName)
  
  return publicUrl
}

// Image optimization helper
export const optimizeImage = async (file: File, maxWidth = 400, maxHeight = 400): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      // Resize canvas
      canvas.width = width
      canvas.height = height
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(optimizedFile)
        } else {
          resolve(file) // Fallback to original
        }
      }, 'image/jpeg', 0.8) // 80% quality
    }
    
    img.src = URL.createObjectURL(file)
  })
} 