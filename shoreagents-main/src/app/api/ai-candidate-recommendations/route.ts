import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export interface CandidateRecommendation {
  id: string
  name: string
  position: string
  expectedSalary: number
  experience: string
  skills: string[]
  overallScore: number
  matchScore: number
  isRecommended: boolean
}

export interface JobPositionMatch {
  role: string
  level: 'entry' | 'mid' | 'senior'
  recommendedCandidates: CandidateRecommendation[]
  averageSalary: number
  totalCandidates: number
}

// AI-powered candidate recommendation system
export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { role, level, industry, memberCount } = await request.json();

    if (!role || !level) {
      return NextResponse.json(
        { error: 'Role and level are required' },
        { status: 400 }
      );
    }

    console.log(`🤖 AI Candidate Analysis: ${role} (${level}) in ${industry || 'any'} industry`);

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create comprehensive system prompt for candidate analysis
    const systemPrompt = `You are an expert talent acquisition AI that analyzes job requirements and generates realistic candidate recommendations.

Your task is to analyze the provided role, level, and industry context to generate 3-5 realistic candidate profiles that would be suitable for this position.

For each candidate, provide:
- Realistic name and background
- Appropriate experience level and years
- Relevant skills for the role and industry
- Market-appropriate salary expectations
- Professional strengths and qualifications

Focus on creating diverse, realistic candidates that represent the actual talent pool for this role and level.`;

    const userPrompt = `Analyze and generate candidate recommendations for:

**Role**: ${role}
**Level**: ${level}
**Industry**: ${industry || 'General Business'}
**Team Size**: ${memberCount || 'Not specified'}

Generate 3-5 realistic candidate profiles that would be suitable for this ${level}-level ${role} position in the ${industry || 'general'} industry.

CRITICAL REQUIREMENTS:
- ALL candidates must be DIRECTLY relevant to the ${role} role
- NO unrelated positions (like Graphic Designer for Software Developer)
- ALL candidates must have clear, specific positions related to ${role}
- Focus on ${industry || 'technology'} industry experience
- Ensure candidates match the ${level} experience level

For each candidate, consider:
- Appropriate experience level (${level})
- Industry-relevant skills for ${role}
- Market-appropriate salary expectations for Philippines
- Professional background and qualifications
- Diversity in experience and specializations within ${role}

Return ONLY a JSON array with this exact structure:
[
  {
    "name": "Full Name",
    "position": "Specific ${role} Position (e.g., 'Senior ${role}', '${role} Specialist', 'Lead ${role}')",
    "expectedSalary": 35000,
    "experience": "X years in ${role.toLowerCase()} development",
    "skills": ["${role.toLowerCase()} skill1", "${role.toLowerCase()} skill2", "relevant skill3"],
    "overallScore": 85,
    "matchScore": 90,
    "isRecommended": true
  }
]

IMPORTANT: Every candidate must have a position that is directly related to ${role}. No generic or unrelated positions.`;

    // Generate recommendations using Claude
    let response;
    try {
      response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
    } catch (modelError) {
      console.error('❌ Claude API error:', modelError);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    const aiResponse = response.content[0];
    if (aiResponse.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    console.log('🤖 AI Response received, parsing candidates...');

    // Parse the AI response
    let candidates: CandidateRecommendation[];
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in AI response');
      }

      const rawCandidates = JSON.parse(jsonMatch[0]);
      
      // Validate and process candidates
      candidates = rawCandidates.map((candidate: any, index: number) => {
        // Ensure position is relevant to the role
        let position = candidate.position || role;
        if (!position.toLowerCase().includes(role.toLowerCase()) && 
            !role.toLowerCase().includes(position.toLowerCase())) {
          // If position doesn't match role, create a relevant one
          position = `${level === 'entry' ? 'Junior' : level === 'senior' ? 'Senior' : ''} ${role}`.trim();
        }
        
        return {
          id: `ai_candidate_${Date.now()}_${index}`,
          name: candidate.name || `AI Generated Candidate ${index + 1}`,
          position: position,
          expectedSalary: Math.max(15000, Math.min(200000, candidate.expectedSalary || 30000)),
          experience: candidate.experience || `${level} level experience`,
          skills: Array.isArray(candidate.skills) ? candidate.skills : [],
          overallScore: Math.max(60, Math.min(100, candidate.overallScore || 75)),
          matchScore: Math.max(70, Math.min(100, candidate.matchScore || 80)),
          isRecommended: candidate.isRecommended !== false
        };
      });

      console.log(`✅ Generated ${candidates.length} AI candidates for ${role}`);

    } catch (parseError) {
      console.error('❌ Failed to parse AI candidate response:', parseError);
      console.error('Raw AI response:', aiResponse.text);
      
      // Fallback: Generate basic candidates
      candidates = generateFallbackCandidates(role, level, industry);
    }

    // Calculate average salary
    const averageSalary = candidates.length > 0 
      ? Math.round(candidates.reduce((sum, c) => sum + c.expectedSalary, 0) / candidates.length)
      : 0;

    // Create the response
    const result: JobPositionMatch = {
      role,
      level,
      recommendedCandidates: candidates,
      averageSalary,
      totalCandidates: candidates.length
    };

    console.log(`🎯 AI Recommendation Summary:`, {
      role,
      level,
      candidateCount: candidates.length,
      averageSalary,
      isRecommended: candidates.some(c => c.isRecommended)
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ AI Candidate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate candidate recommendations' },
      { status: 500 }
    );
  }
}

// Fallback candidate generation if AI parsing fails
function generateFallbackCandidates(role: string, level: string, industry?: string): CandidateRecommendation[] {
  const baseSalary = level === 'entry' ? 25000 : level === 'mid' ? 45000 : 75000;
  
  return [
    {
      id: `fallback_1_${Date.now()}`,
      name: 'Maria Santos',
      position: `${role} Specialist`,
      expectedSalary: baseSalary,
      experience: `${level} level with 3+ years experience`,
      skills: ['Problem Solving', 'Communication', 'Technical Skills'],
      overallScore: 75,
      matchScore: 80,
      isRecommended: true
    },
    {
      id: `fallback_2_${Date.now()}`,
      name: 'John Dela Cruz',
      position: `Senior ${role}`,
      expectedSalary: baseSalary + 10000,
      experience: `${level} level with 5+ years experience`,
      skills: ['Leadership', 'Project Management', 'Industry Knowledge'],
      overallScore: 80,
      matchScore: 85,
      isRecommended: true
    },
    {
      id: `fallback_3_${Date.now()}`,
      name: 'Ana Rodriguez',
      position: `${role} Coordinator`,
      expectedSalary: baseSalary - 5000,
      experience: `${level} level with 2+ years experience`,
      skills: ['Organization', 'Attention to Detail', 'Team Collaboration'],
      overallScore: 70,
      matchScore: 75,
      isRecommended: true
    }
  ];
}
