import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get API keys from server environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const cloudConvertApiKey = process.env.CLOUDCONVERT_API_KEY;
    
    const missingKeys = [];
    if (!openaiApiKey) missingKeys.push('OPENAI_API_KEY');
    if (!cloudConvertApiKey) missingKeys.push('CLOUDCONVERT_API_KEY');
    
    if (missingKeys.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `API keys not configured on server: ${missingKeys.join(', ')}. Please add to environment variables.` 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      openaiApiKey: openaiApiKey,
      cloudConvertApiKey: cloudConvertApiKey
    });

  } catch (error) {
    console.error('API key fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch API keys'
      },
      { status: 500 }
    );
  }
} 