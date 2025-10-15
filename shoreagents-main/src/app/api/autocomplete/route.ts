import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  let query = '';
  let type = 'role';
  let industry = '';
  let roleTitle = '';
  
  try {
    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ 
        error: 'AI autocomplete requires ANTHROPIC_API_KEY to be configured'
      }, { status: 500 })
    }

    const requestData = await request.json()
    query = requestData.query || '';
    type = requestData.type || 'role';
    industry = requestData.industry || '';
    roleTitle = requestData.roleTitle || '';

    console.log('🔍 Autocomplete API called:', { query, type, industry, roleTitle });

    if (!query || query.length < 2) {
      console.log('📝 Query too short, returning empty array');
      return NextResponse.json([])
    }

    // Handle different types of autocomplete requests
    let prompt = '';
    let maxSuggestions = 5;
    
    if (type === 'industry') {
      prompt = `You are an AI assistant helping users specify their business industry. Based on the user's input "${query}", suggest ${maxSuggestions} relevant industries.

Context: The user is looking for offshore team members for their business. They might be specifying industries like:
- Technology, Software Development, IT Services
- Healthcare, Medical Services, Wellness
- Finance, Banking, Accounting
- Real Estate, Property Management
- Marketing, Advertising, Digital Marketing
- E-commerce, Online Retail
- Education, Training, E-learning
- Legal, Law Firms, Compliance
- Manufacturing, Production
- Construction, Building
- And many more...

Based on the input "${query}", suggest ${maxSuggestions} specific, relevant industries that would be appropriate for offshore staffing. Make the suggestions:
1. Specific and professional
2. Commonly used in business contexts
3. Relevant to the input provided
4. Different from each other but related

Format your response as a JSON array of objects with "title", "description", and "level" fields:
[
  {"title": "Technology", "description": "Software development, IT services, and technology solutions", "level": "Industry"},
  {"title": "Healthcare", "description": "Healthcare services, medical practices, and wellness", "level": "Industry"}
]

Only return the JSON array, no other text.`;
    } else if (type === 'role') {
      prompt = `You are an AI assistant helping users specify job roles and positions. Based on the user's input "${query}"${industry ? ` in the ${industry} industry` : ''}, suggest ${maxSuggestions} relevant job roles or positions.

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

Based on the input "${query}"${industry ? ` in the ${industry} industry` : ''}, suggest ${maxSuggestions} specific, relevant job roles that would be appropriate for offshore staffing. Make the suggestions:
1. Specific and professional
2. Commonly used in business contexts
3. Relevant to the input provided
4. Different from each other but related

Format your response as a JSON array of objects with "title", "description", and "level" fields:
[
  {"title": "Software Developer", "description": "Develops software applications and systems", "level": "mid"},
  {"title": "Frontend Developer", "description": "Creates user interfaces and client-side applications", "level": "mid"}
]

Only return the JSON array, no other text.`;
    } else if (type === 'description') {
      prompt = `You are an AI assistant helping users generate job descriptions. Based on the role "${roleTitle}"${industry ? ` in the ${industry} industry` : ''}, generate a comprehensive job description.

The job description should include:
1. A brief overview of the role
2. Key responsibilities and duties
3. Required skills and qualifications
4. Experience level expectations
5. Any industry-specific requirements

Make the description:
- Professional and detailed
- Specific to the role and industry
- Clear and easy to understand
- Appropriate for offshore staffing

Return only the job description text, no other formatting.`;
    } else {
      // Default to role suggestions
      prompt = `You are an AI assistant helping users specify job roles and positions. Based on the user's input "${query}", suggest ${maxSuggestions} relevant job roles or positions.

Format your response as a JSON array of objects with "title", "description", and "level" fields:
[
  {"title": "Software Developer", "description": "Develops software applications and systems", "level": "mid"}
]

Only return the JSON array, no other text.`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: type === 'description' ? 1000 : 500,
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

    // Handle different response types
    if (type === 'description') {
      // For descriptions, return the text directly
      console.log('📝 Returning description:', content.text);
      return NextResponse.json(content.text)
    } else {
      // For suggestions, parse the JSON response
      let suggestions
      try {
        console.log('🤖 Raw AI response:', content.text);
        suggestions = JSON.parse(content.text)
        console.log('✅ Parsed AI suggestions:', suggestions);
      } catch (parseError) {
        console.error('❌ Failed to parse AI suggestions:', parseError)
        console.error('❌ Raw response that failed to parse:', content.text);
        
        // Try to extract JSON from the response if it's wrapped in text
        try {
          const jsonMatch = content.text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            suggestions = JSON.parse(jsonMatch[0]);
            console.log('✅ Extracted JSON from wrapped response:', suggestions);
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (extractError) {
          console.error('❌ Failed to extract JSON from response:', extractError);
          return NextResponse.json({ 
            error: 'Failed to parse AI response',
            details: extractError instanceof Error ? extractError.message : 'Unknown parsing error'
          }, { status: 500 })
        }
      }

      // Ensure we always return an array
      if (!Array.isArray(suggestions)) {
        console.log('⚠️ Suggestions not an array');
        return NextResponse.json({ 
          error: 'AI returned invalid response format',
          details: 'Expected array but got: ' + typeof suggestions 
        }, { status: 500 })
      }

      console.log('📤 Returning suggestions:', suggestions);
      return NextResponse.json(suggestions)
    }

  } catch (error) {
    console.error('❌ Autocomplete API error:', error)
    
    return NextResponse.json({ 
      error: 'AI autocomplete failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
