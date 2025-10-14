import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test if environment variables are loaded
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY
    const apiKeyLength = process.env.ANTHROPIC_API_KEY?.length || 0
    
    return NextResponse.json({
      hasApiKey,
      apiKeyLength,
      message: hasApiKey 
        ? `API key is configured (${apiKeyLength} characters)`
        : 'ANTHROPIC_API_KEY is not set in environment variables'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
