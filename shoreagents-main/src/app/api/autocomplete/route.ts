import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Simple in-memory cache for autocomplete suggestions
const suggestionCache = new Map<string, { suggestions: unknown[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting to prevent excessive API calls
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // Max 20 requests per minute per IP (increased from 10)

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { query, type, industry, roleTitle, generateAnother, generationCount } = await request.json();

    if (!query || !type) {
      return NextResponse.json(
        { error: 'Query and type are required' },
        { status: 400 }
      );
    }

    // Validate query length to prevent unnecessary API calls
    if (query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const rateLimitKey = `${clientIP}-${type}`;
    
    const rateLimitData = rateLimitMap.get(rateLimitKey);
    if (rateLimitData) {
      if (now < rateLimitData.resetTime) {
        if (rateLimitData.count >= RATE_LIMIT_MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please wait before making another request.' },
            { status: 429 }
          );
        }
        rateLimitData.count++;
      } else {
        // Reset rate limit window
        rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Check cache first (but not for "generate another" requests)
    const cacheKey = generateAnother 
      ? `${type}-${query}-${industry || ''}-${roleTitle || ''}-${Date.now()}` // Unique key for each "generate another"
      : `${type}-${query}-${industry || ''}-${roleTitle || ''}`;
    
    const cached = suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION && !generateAnother) {
      return NextResponse.json({ suggestions: cached.suggestions });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'industry') {
      systemPrompt = `Suggest industries based on user input. Return ONLY JSON array:
      [{"title": "Industry Name", "description": "Brief description", "level": "Industry"}]
      
      IMPORTANT:
      - Return actual INDUSTRY NAMES (like "Web Development", "E-commerce", "Healthcare")
      - NOT job descriptions or tasks
      - Include 4-6 suggestions
      - Keep descriptions under 8 words
      - Use "Industry" as the level for all suggestions`;

      userPrompt = `Query: "${query}"
      
      Suggest 4-6 matching industry names. Focus on exact/partial matches.
      Return only JSON array with industry names, not job descriptions.`;
    } else if (type === 'role') {
      systemPrompt = `You are a job title suggestion assistant. Return ONLY a JSON array of job titles with descriptions.
      Format: [{"title": "Job Title", "description": "Brief job description", "level": "entry|mid|senior"}]
      
      IMPORTANT: 
      - Return actual JOB TITLES (like "Software Developer", "Marketing Manager")
      - NOT task descriptions or responsibilities
      - Include 3-5 suggestions
      - Keep descriptions under 10 words
      - Be specific about experience level`;

      userPrompt = `Query: "${query}" | Industry: ${industry || 'General'}
      
      Suggest 3-5 JOB TITLES that match this query. Focus on actual job positions, not tasks.
      Examples of good job titles: "Junior Web Developer", "Senior Software Engineer", "Marketing Coordinator"
      Examples of BAD responses: "Build websites", "Write code", "Manage projects"
      
      Return only JSON array with job titles.`;
    } else if (type === 'description') {
      systemPrompt = `You are an AI assistant that generates detailed job role descriptions.
      Based on the role title and industry context, create a comprehensive job description.
      
      IMPORTANT: You must return ONLY the job description text directly.
      Do not wrap it in JSON, quotes, or any other formatting.
      Just return the plain text description.
      Make the description professional, specific, and comprehensive.`;

      // Create more varied prompts for different generations
      const variationPrompts = [
        `Create a DIFFERENT variation focusing on TECHNICAL SKILLS and SYSTEM EXPERTISE. Emphasize software, tools, and technical competencies.`,
        `Create a DIFFERENT variation focusing on COMMUNICATION and INTERPERSONAL SKILLS. Emphasize client relations, teamwork, and soft skills.`,
        `Create a DIFFERENT variation focusing on OPERATIONAL and PROCESS MANAGEMENT. Emphasize workflow, efficiency, and organizational skills.`,
        `Create a DIFFERENT variation focusing on ANALYTICAL and PROBLEM-SOLVING SKILLS. Emphasize data analysis, critical thinking, and decision-making.`,
        `Create a DIFFERENT variation focusing on LEADERSHIP and PROJECT MANAGEMENT. Emphasize team leadership, project coordination, and strategic thinking.`,
        `Create a DIFFERENT variation focusing on CREATIVE and INNOVATIVE SKILLS. Emphasize creativity, innovation, and out-of-the-box thinking.`
      ];

      // Use a variation prompt based on generation count for "generate another"
      const randomVariation = generateAnother 
        ? variationPrompts[(generationCount || 0) % variationPrompts.length]
        : '';

      userPrompt = `Generate a detailed job description for the role: "${roleTitle}"
      Industry context: ${industry || 'General business'}
      
      Create a comprehensive description that includes:
      - Primary responsibilities and daily tasks
      - Required skills and qualifications
      - Industry-specific knowledge or experience
      - Expected deliverables and outcomes
      
      ${randomVariation}
      
      IMPORTANT: Use completely different wording, structure, and focus areas. Make this description unique and distinct from any previous versions.
      
      Return ONLY the plain text description. No JSON, no quotes, no formatting. Just the description text.`;
    }

    // Try Claude 4 Sonnet first, fallback to Claude 3.5 Sonnet if not available
    let response;
    try {
      response = await anthropic.messages.create({
        model: 'claude-4-sonnet-20241022', // Using Claude 4 Sonnet for faster responses
        max_tokens: 300, // Further reduced for faster response
        temperature: generateAnother ? 0.8 : 0.6, // Slightly lower for more consistent, faster responses
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
    } catch (modelError) {
      console.log('Claude 4 not available, falling back to Claude 3.5 Sonnet');
      response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022', // Fallback to Claude 3.5 Sonnet
        max_tokens: 300,
        temperature: generateAnother ? 0.8 : 0.6,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
    }

    const aiResponse = response.content[0];
    if (aiResponse.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Debug logging for industry type
    if (type === 'industry') {
      console.log('🔍 Industry API Debug:', {
        query,
        aiResponse: aiResponse.text,
        type
      });
    }

    // Parse the response
    let suggestions;
    try {
      if (type === 'description') {
        // For descriptions, expect plain text directly
        suggestions = aiResponse.text.trim();
        
        // Clean up any potential formatting artifacts
        suggestions = suggestions
          .replace(/^["']|["']$/g, '') // Remove surrounding quotes
          .replace(/^\{[\s\S]*"description":\s*["']?([^"'}]+)["']?[\s\S]*\}$/, '$1') // Extract from JSON if AI still returns it
          .trim();
        
        if (!suggestions) {
          throw new Error('No description found in response');
        }
      } else {
        // For suggestions, expect a JSON array
        const jsonMatch = aiResponse.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in response');
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse.text);
      console.error('Parse error:', parseError);
      
      // For descriptions, provide a fallback
      if (type === 'description') {
        suggestions = `This role involves key responsibilities and tasks related to ${roleTitle || 'the position'}. The ideal candidate should have relevant experience and skills for this position.`;
      } else {
        return NextResponse.json(
          { error: 'Failed to parse suggestions' },
          { status: 500 }
        );
      }
    }

    // Debug logging for parsed suggestions
    if (type === 'industry') {
      console.log('🔍 Parsed Industry Suggestions:', {
        suggestions,
        count: Array.isArray(suggestions) ? suggestions.length : 'not array'
      });
    }

    // Cache the results
    suggestionCache.set(cacheKey, {
      suggestions,
      timestamp: Date.now()
    });

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Autocomplete API error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
