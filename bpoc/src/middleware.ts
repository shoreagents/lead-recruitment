import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // Only apply middleware to API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/save-resume') || 
      request.nextUrl.pathname.startsWith('/api/save-generated-resume') ||
      request.nextUrl.pathname.startsWith('/api/save-resume-to-profile') ||
      request.nextUrl.pathname.startsWith('/api/user/saved-resumes') ||
      request.nextUrl.pathname.startsWith('/api/recruiter/jobs') ||
      request.nextUrl.pathname.startsWith('/api/recruiter/activity') ||
      request.nextUrl.pathname.startsWith('/api/admin/applicants') ||
      request.nextUrl.pathname.startsWith('/api/user/applications') ||
      request.nextUrl.pathname.startsWith('/api/analyze-resume') ||
      request.nextUrl.pathname.startsWith('/api/user/analysis-results') ||
      request.nextUrl.pathname.startsWith('/api/user/extracted-resume') ||
      request.nextUrl.pathname.startsWith('/api/user/saved-resume/') ||
      request.nextUrl.pathname.startsWith('/api/admin/jobs') ||
      request.nextUrl.pathname.startsWith('/api/admin/members') ||
      request.nextUrl.pathname.startsWith('/api/admin/jobs/improve') ||
      request.nextUrl.pathname.startsWith('/api/admin/jobs/process') ||
      request.nextUrl.pathname.startsWith('/api/admin/processed-jobs') ||
      request.nextUrl.pathname.startsWith('/api/games/typing-hero/session') ||
      request.nextUrl.pathname.startsWith('/api/games/disc-personality/session') ||
      request.nextUrl.pathname.startsWith('/api/games/disc/session') ||
      request.nextUrl.pathname.startsWith('/api/games/ultimate/session')) {
    console.log('🔍 Middleware: Processing authenticated API request')
    
    try {
      // Get the authorization header
      const authHeader = request.headers.get('authorization')
      console.log('🔑 Auth header present:', !!authHeader)
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ Middleware: Missing or invalid authorization header')
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      console.log('🎫 Token length:', token.length)
      
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      console.log('🔧 Middleware environment check:', {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseKey: !!supabaseKey
      })

      if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Middleware: Missing Supabase environment variables')
        // For development, you can temporarily bypass this check
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ Development mode: Bypassing authentication check')
          const requestHeaders = new Headers(request.headers)
          requestHeaders.set('x-user-id', 'dev-user-id')
          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
        }
        return NextResponse.json(
          { error: 'Authentication configuration error' },
          { status: 500 }
        )
      }
      
      // Initialize Supabase client for token verification only
      console.log('🔌 Middleware: Initializing Supabase client for token verification...')
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Verify the token and get user
      console.log('🔍 Middleware: Verifying token...')
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error) {
        console.error('❌ Middleware: Token verification error:', error)
        return NextResponse.json(
          { error: 'Invalid or expired token', details: error.message },
          { status: 401 }
        )
      }

      if (!user) {
        console.log('❌ Middleware: No user found from token')
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      console.log('✅ Middleware: User authenticated:', user.id)

      // Clone the request and add user ID to headers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', user.id)
      console.log('📋 Middleware: Added user ID to headers:', user.id)

      // Return the modified request
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('❌ Middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/save-resume',
    '/api/save-generated-resume',
    '/api/save-resume-to-profile',
    '/api/user/saved-resumes',
    '/api/recruiter/jobs',
    '/api/recruiter/jobs/:path*',
    '/api/recruiter/activity',
    '/api/admin/applicants',
    '/api/user/applications',
    '/api/analyze-resume',
    '/api/user/analysis-results',
    '/api/user/extracted-resume',
    '/api/user/saved-resume-data',
    '/api/user/ai-analysis-score',
    '/api/user/games-count',
    '/api/user/saved-resume/:path*',
    '/api/admin/jobs',
    '/api/admin/jobs/:path*',
    '/api/admin/members',
    '/api/admin/jobs/improve',
    '/api/admin/jobs/process'
    ,'/api/admin/processed-jobs',
    '/api/admin/processed-jobs/:path*',
    '/api/games/typing-hero/session',
    '/api/games/disc-personality/session',
    '/api/games/disc/session',
    '/api/games/ultimate/session'
  ],
} 