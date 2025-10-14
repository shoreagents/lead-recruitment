import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    console.log('🔍 Testing Supabase Storage from server...')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Test 1: List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Failed to list buckets:', bucketsError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to list buckets: ${bucketsError.message}` 
      })
    }
    
    console.log('📦 Available buckets:', buckets)
    
    const profilePhotosBucket = buckets.find(bucket => bucket.name === 'profile-photos')
    
    if (!profilePhotosBucket) {
      return NextResponse.json({ 
        success: false, 
        error: 'profile-photos bucket does not exist' 
      })
    }
    
    // Test 2: Check bucket configuration
    console.log('📋 Bucket configuration:', {
      name: profilePhotosBucket.name,
      id: profilePhotosBucket.id,
      public: profilePhotosBucket.public,
      file_size_limit: profilePhotosBucket.file_size_limit,
      allowed_mime_types: profilePhotosBucket.allowed_mime_types
    })
    
    // Test 3: Try to list files (this tests RLS)
    const { data: files, error: filesError } = await supabase.storage
      .from('profile-photos')
      .list('', { limit: 10, offset: 0 })
    
    if (filesError) {
      console.error('❌ Failed to list files:', filesError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to list files: ${filesError.message}`,
        bucketConfig: profilePhotosBucket
      })
    }
    
    console.log('📁 Files in bucket:', files)
    
    // Test 4: Try to upload a test file (this will test RLS for uploads)
    const testFile = new Blob(['test'], { type: 'text/plain' })
    const testFileName = `test-${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(testFileName, testFile, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (uploadError) {
      console.error('❌ Failed to upload test file:', uploadError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to upload test file: ${uploadError.message}`,
        bucketConfig: profilePhotosBucket,
        files: files
      })
    }
    
    // Clean up test file
    await supabase.storage
      .from('profile-photos')
      .remove([testFileName])
    
    console.log('✅ Test upload successful, file cleaned up')
    
    return NextResponse.json({
      success: true,
      bucket: profilePhotosBucket,
      files: files,
      message: 'Storage connection test successful - uploads working'
    })
    
  } catch (error) {
    console.error('❌ Storage test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: `Storage test error: ${error}` 
    })
  }
} 