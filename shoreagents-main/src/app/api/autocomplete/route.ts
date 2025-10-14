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
        suggestions: [],
        error: 'API key not configured'
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
      model: 'claude-3-haiku-20240307',
      max_tokens: type === 'description' ? 500 : 300,
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
        suggestions = JSON.parse(content.text)
        console.log('✅ Parsed AI suggestions:', suggestions);
      } catch (parseError) {
        console.error('❌ Failed to parse suggestions:', parseError)
        // Fallback suggestions based on type
        suggestions = getFallbackSuggestions(query, type, industry)
        console.log('🔄 Using fallback suggestions:', suggestions);
      }

      // Ensure we always return an array
      if (!Array.isArray(suggestions)) {
        console.log('⚠️ Suggestions not an array, using fallback');
        suggestions = getFallbackSuggestions(query, type, industry);
      }

      console.log('📤 Returning suggestions:', suggestions);
      return NextResponse.json(suggestions)
    }

  } catch (error) {
    console.error('❌ Autocomplete API error:', error)
    
    // Fallback suggestions for common inputs
    const fallbackSuggestions = getFallbackSuggestions(query, type, industry)
    console.log('🔄 Using fallback suggestions in catch:', fallbackSuggestions);
    
    if (type === 'description') {
      const fallbackDescription = `We are looking for a ${roleTitle || 'professional'} to join our team. This role involves various responsibilities and requires relevant experience in the field.`;
      console.log('📝 Returning fallback description:', fallbackDescription);
      return NextResponse.json(fallbackDescription)
    } else {
      console.log('📤 Returning fallback suggestions:', fallbackSuggestions);
      return NextResponse.json(fallbackSuggestions)
    }
  }
}

function getFallbackSuggestions(query: string, type: string = 'role', industry?: string): Array<{title: string, description: string, level: string}> {
  const lowerQuery = query.toLowerCase()
  
  if (type === 'industry') {
    return [
      { title: "Technology", description: "Software development, IT services, and technology solutions", level: "Industry" },
      { title: "Healthcare", description: "Healthcare services, medical practices, and wellness", level: "Industry" },
      { title: "Finance", description: "Banking, accounting, and financial advisory services", level: "Industry" },
      { title: "Real Estate", description: "Property management, real estate services, and construction", level: "Industry" },
      { title: "Marketing", description: "Digital marketing, advertising, and brand management", level: "Industry" }
    ]
  }
  
  if (type === 'role') {
    if (lowerQuery.includes('dev') || lowerQuery.includes('software') || lowerQuery.includes('program')) {
      return [
        { title: "Software Developer", description: "Develops software applications and systems", level: "mid" },
        { title: "Frontend Developer", description: "Creates user interfaces and client-side applications", level: "mid" },
        { title: "Backend Developer", description: "Develops server-side applications and APIs", level: "mid" }
      ]
    }
    
    if (lowerQuery.includes('market') || lowerQuery.includes('social') || lowerQuery.includes('content')) {
      return [
        { title: "Marketing Manager", description: "Develops and executes marketing strategies", level: "senior" },
        { title: "Content Writer", description: "Creates engaging content for various platforms", level: "mid" },
        { title: "Social Media Specialist", description: "Manages social media presence and campaigns", level: "mid" }
      ]
    }
    
    if (lowerQuery.includes('customer') || lowerQuery.includes('service') || lowerQuery.includes('support')) {
      return [
        { title: "Customer Service Representative", description: "Provides customer support and assistance", level: "entry" },
        { title: "Support Specialist", description: "Handles technical support and troubleshooting", level: "mid" },
        { title: "Client Success Manager", description: "Ensures client satisfaction and retention", level: "senior" }
      ]
    }
    
    if (lowerQuery.includes('admin') || lowerQuery.includes('assistant') || lowerQuery.includes('virtual')) {
      return [
        { title: "Virtual Assistant", description: "Provides administrative and support services", level: "entry" },
        { title: "Administrative Assistant", description: "Handles administrative tasks and coordination", level: "entry" },
        { title: "Executive Assistant", description: "Supports senior executives with various tasks", level: "mid" }
      ]
    }
    
    if (lowerQuery.includes('account') || lowerQuery.includes('finance') || lowerQuery.includes('book')) {
      return [
        { title: "Accountant", description: "Manages financial records and reporting", level: "mid" },
        { title: "Bookkeeper", description: "Maintains financial records and transactions", level: "entry" },
        { title: "Financial Analyst", description: "Analyzes financial data and market trends", level: "mid" }
      ]
    }
    
    // Default role suggestions
    return [
      { title: "Software Developer", description: "Develops software applications and systems", level: "mid" },
      { title: "Marketing Manager", description: "Develops and executes marketing strategies", level: "senior" },
      { title: "Customer Service Representative", description: "Provides customer support and assistance", level: "entry" }
    ]
  }
  
  // Default fallback
  return [
    { title: "Software Developer", description: "Develops software applications and systems", level: "mid" },
    { title: "Marketing Manager", description: "Develops and executes marketing strategies", level: "senior" },
    { title: "Customer Service Representative", description: "Provides customer support and assistance", level: "entry" }
  ]
}