# Supabase Storage Setup for Profile Photos

## Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** → **Buckets**
3. Click **Create a new bucket**
4. Configure the bucket:
   - **Name**: `profile-photos`
   - **Public bucket**: ✅ **Yes** (for public URLs)
   - **File size limit**: `5MB`
   - **Allowed MIME types**: `image/*`
5. Click **Create bucket**

## Step 2: Set Storage Policies

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to profile photos
CREATE POLICY "Public read access to profile photos" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own photos
CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 3: Test the Setup

1. Upload a test image through the settings page
2. Verify the image appears in the Supabase Storage dashboard
3. Check that the public URL works
4. Verify the image appears in the header and profile page

## Step 4: Railway Database Update

Run this SQL in your Railway database:

```sql
-- Add avatar_url column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN users.avatar_url IS 'URL to user profile photo stored in Supabase Storage';

-- Create index for faster queries on avatar_url
CREATE INDEX IF NOT EXISTS idx_users_avatar_url ON users(avatar_url) WHERE avatar_url IS NOT NULL;
```

## Features Implemented

### ✅ Storage Functions
- **uploadProfilePhoto**: Uploads and optimizes images
- **deleteProfilePhoto**: Removes photos from storage
- **getProfilePhotoUrl**: Gets public URLs
- **optimizeImage**: Resizes and compresses images

### ✅ UI Components
- **Settings Page**: Photo upload with preview
- **Profile Page**: Photo upload with loading states
- **Header**: Displays profile photos
- **Mobile Menu**: Shows profile photos

### ✅ Features
- **Image Optimization**: Automatic resizing to 400x400px
- **File Validation**: Type and size checks (5MB limit)
- **Loading States**: User feedback during upload
- **Error Handling**: Comprehensive error messages
- **Database Sync**: Updates both Supabase and Railway
- **Real-time Updates**: Header updates immediately

### ✅ Security
- **Row-level Security**: Users can only access their own photos
- **File Type Validation**: Only images allowed
- **Size Limits**: 5MB maximum file size
- **Unique Filenames**: Prevents conflicts

## Environment Variables

Your existing Supabase environment variables are already configured:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

1. **Upload Photo**: Click the camera icon in settings or profile page
2. **Select Image**: Choose a JPG, PNG, or GIF file (max 5MB)
3. **Automatic Optimization**: Image is resized and compressed
4. **Storage**: Photo is uploaded to Supabase Storage
5. **Database Update**: URL is saved to Railway database
6. **UI Update**: Photo appears in header and profile immediately

## Troubleshooting

### Common Issues:

1. **Upload Fails**: Check file size and type
2. **Photo Not Showing**: Verify Supabase Storage policies
3. **Database Error**: Ensure avatar_url column exists
4. **CORS Issues**: Check Supabase Storage CORS settings

### Debug Steps:

1. Check browser console for errors
2. Verify Supabase Storage bucket exists
3. Test storage policies in Supabase dashboard
4. Check Railway database for avatar_url column 