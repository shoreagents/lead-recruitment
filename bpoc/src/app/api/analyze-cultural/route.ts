import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, transcript, region, generateScript } = await request.json();
    
    if (!prompt || !region) {
      return NextResponse.json({ 
        error: 'Missing required fields: prompt or region' 
      }, { status: 400 });
    }
    
    if (!generateScript && !transcript) {
      return NextResponse.json({ 
        error: 'Missing required fields: transcript (unless generating script)' 
      }, { status: 400 });
    }

    // Check Claude API key
    const claudeKey = process.env.CLAUDE_API_KEY;
    if (!claudeKey) {
      console.error('Claude API key not configured');
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 });
    }

    console.log('Analyzing cultural communication with Claude...');
    console.log('Region:', region);
    console.log('Transcript length:', transcript ? transcript.length : 'N/A');
    console.log('Generate Script:', generateScript);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `Cultural analysis failed: ${response.status} - ${errorText}` 
      }, { status: 500 });
    }

    const result = await response.json();
    const content = result.content[0].text;
    
    console.log('Claude cultural analysis successful');
    
    // If generating script, return the raw content as feedback
    if (generateScript) {
      return NextResponse.json({
        success: true,
        analysis: {
          feedback: content // Return the generated script directly
        },
        rawResponse: content
      });
    }
    
    // Try to parse structured response for cultural analysis
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          success: true,
          analysis: parsed,
          rawResponse: content
        });
      }
    } catch (parseError) {
      console.log('Could not parse JSON response, returning raw text');
    }
    
    // Return raw response if JSON parsing fails
    return NextResponse.json({
      success: true,
      analysis: {
        score: 75, // Default score
        feedback: content,
        region: region
      },
      rawResponse: content
    });

  } catch (error) {
    console.error('Cultural analysis error:', error);
    return NextResponse.json({ 
      error: 'Cultural analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
