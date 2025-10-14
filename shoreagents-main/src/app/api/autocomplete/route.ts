import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ 
        suggestions: [],
        error: 'API key not configured'
      }, { status: 500 })
    }

    const { input, context = '', maxSuggestions = 3 } = await request.json()

    if (!input || input.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Create a comprehensive prompt for role suggestions
    const prompt = `You are an AI assistant helping users specify job roles and positions. Based on the user's input "${input}" and context "${context}", suggest ${maxSuggestions} relevant job roles or positions.

Context: The user is looking for team members for their business. They might be specifying roles like:
- Software Developer, Frontend Developer, Backend Developer
- Marketing Manager, Content Writer, Social Media Specialist
- Customer Service Representative, Sales Representative
- Accountant, Bookkeeper, Financial Analyst
- Virtual Assistant, Administrative Assistant
- Project Manager, Team Lead, Operations Manager
- Graphic Designer, UI/UX Designer, Web Designer
- Data Analyst, Business Analyst, Research Analyst
- HR Specialist, Recruiter, Talent Acquisition
- And many more...

Based on the input "${input}", suggest ${maxSuggestions} specific, relevant job roles that would be appropriate for offshore staffing. Make the suggestions:
1. Specific and professional
2. Commonly used in business contexts
3. Relevant to the input provided
4. Different from each other but related

Format your response as a JSON array of objects with "text" and "confidence" fields:
[
  {"text": "Software Developer", "confidence": 0.9},
  {"text": "Frontend Developer", "confidence": 0.8},
  {"text": "Full Stack Developer", "confidence": 0.7}
]

Only return the JSON array, no other text.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    if (!response || !response.content || response.content.length === 0) {
      throw new Error('Empty response from Anthropic API')
    }

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic')
    }

    // Parse the JSON response
    let suggestions
    try {
      suggestions = JSON.parse(content.text)
    } catch (parseError) {
      console.error('Failed to parse suggestions:', parseError)
      // Fallback suggestions based on common roles
      suggestions = [
        { text: "Software Developer", confidence: 0.8 },
        { text: "Marketing Manager", confidence: 0.7 },
        { text: "Customer Service Representative", confidence: 0.6 }
      ]
    }

    return NextResponse.json({ suggestions })

  } catch (error) {
    console.error('Autocomplete API error:', error)
    
    // Fallback suggestions for common inputs
    const fallbackSuggestions = getFallbackSuggestions(input)
    
    return NextResponse.json({ 
      suggestions: fallbackSuggestions,
      error: error instanceof Error ? error.message : 'AI service temporarily unavailable'
    })
  }
}

function getFallbackSuggestions(input: string): Array<{text: string, confidence: number}> {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes('dev') || lowerInput.includes('software') || lowerInput.includes('program')) {
    return [
      { text: "Software Developer", confidence: 0.9 },
      { text: "Frontend Developer", confidence: 0.8 },
      { text: "Backend Developer", confidence: 0.8 }
    ]
  }
  
  if (lowerInput.includes('market') || lowerInput.includes('social') || lowerInput.includes('content')) {
    return [
      { text: "Marketing Manager", confidence: 0.9 },
      { text: "Content Writer", confidence: 0.8 },
      { text: "Social Media Specialist", confidence: 0.8 }
    ]
  }
  
  if (lowerInput.includes('customer') || lowerInput.includes('service') || lowerInput.includes('support')) {
    return [
      { text: "Customer Service Representative", confidence: 0.9 },
      { text: "Support Specialist", confidence: 0.8 },
      { text: "Client Success Manager", confidence: 0.7 }
    ]
  }
  
  if (lowerInput.includes('admin') || lowerInput.includes('assistant') || lowerInput.includes('virtual')) {
    return [
      { text: "Virtual Assistant", confidence: 0.9 },
      { text: "Administrative Assistant", confidence: 0.8 },
      { text: "Executive Assistant", confidence: 0.7 }
    ]
  }
  
  if (lowerInput.includes('account') || lowerInput.includes('finance') || lowerInput.includes('book')) {
    return [
      { text: "Accountant", confidence: 0.9 },
      { text: "Bookkeeper", confidence: 0.8 },
      { text: "Financial Analyst", confidence: 0.7 }
    ]
  }
  
  // Default suggestions
  return [
    { text: "Software Developer", confidence: 0.8 },
    { text: "Marketing Manager", confidence: 0.7 },
    { text: "Customer Service Representative", confidence: 0.6 }
  ]
}