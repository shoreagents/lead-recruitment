import { createClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { supabase, response } = createClient(req)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/services',
    '/pricing',
    '/contact',
    '/blogs',
    '/case-studies',
    '/auth/callback',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/signup-simple',
    '/api/auth/check-email',
    '/api/autocomplete',
    '/api/chat',
    '/api/test-anthropic',
    '/api/test-description',
    '/api/debug',
    '/gettingstart',
    '/how-it-works',
    '/pillars',
    '/currency-test',
    '/test-device-id',
    '/test-industry-dropdown',
    '/testing'
  ]

  // Admin-only routes
  const adminRoutes = [
    '/admin',
    '/admin/login',
    '/api/admin'
  ]

  // User dashboard routes
  const userRoutes = [
    '/dashboard',
    '/employee',
    '/we-got-talent'
  ]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if the current path is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if the current path is user-only
  const isUserRoute = userRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // If it's a public route, allow access
  if (isPublicRoute) {
    return response
  }

  // If no session and trying to access protected routes
  if (!session) {
    if (isAdminRoute) {
      // Redirect to admin login
      const redirectUrl = new URL('/admin/login', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    if (isUserRoute) {
      // Redirect to regular login (you might want to create a user login page)
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // For any other protected route, redirect to home
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is authenticated, check their permissions
  if (session) {
    try {
      // Fetch user data to check permissions
      const { data: userData, error } = await supabase
        .from('users')
        .select('user_type, is_admin, admin_level')
        .eq('auth_user_id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching user data in middleware:', error)
        // If we can't fetch user data, redirect to home
        return NextResponse.redirect(new URL('/', req.url))
      }

      // Check admin routes
      if (isAdminRoute) {
        if (!userData.is_admin || !['Admin', 'SuperAdmin'].includes(userData.user_type)) {
          // User is not an admin, redirect to home with error message
          const redirectUrl = new URL('/', req.url)
          redirectUrl.searchParams.set('error', 'access_denied')
          return NextResponse.redirect(redirectUrl)
        }
      }

      // Check user routes
      if (isUserRoute) {
        if (userData.is_admin) {
          // Admin trying to access user routes, redirect to admin dashboard
          return NextResponse.redirect(new URL('/admin', req.url))
        }
      }

      // If admin is trying to access regular user routes, redirect to admin dashboard
      if (userData.is_admin && isUserRoute) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }

    } catch (error) {
      console.error('Error in middleware user check:', error)
      // If there's an error checking user permissions, redirect to home
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
