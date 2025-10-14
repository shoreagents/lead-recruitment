import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
    }
    
    const missingVars = Object.entries(envVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    const hasAllVars = missingVars.length === 0
    
    return NextResponse.json({
      success: hasAllVars,
      envVars: {
        ...envVars,
        // Mask sensitive values
        NEXT_PUBLIC_SUPABASE_ANON_KEY: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
          `${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` : undefined,
        SUPABASE_SERVICE_ROLE_KEY: envVars.SUPABASE_SERVICE_ROLE_KEY ? 
          `${envVars.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...` : undefined
      },
      missingVars,
      message: hasAllVars ? 'All environment variables are set' : 'Missing environment variables'
    })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Environment check error: ${error}` 
    })
  }
} 