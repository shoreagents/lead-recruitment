import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CandidateAnalysisRequest {
  candidateId?: string;
  candidateName?: string;
  question?: string;
}

interface CandidateData {
  user_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  position: string | null;
  current_position: string | null;
  expected_salary: string | null;
  location: string;
  bio: string | null;
  skills_snapshot: string[] | null;
  experience_snapshot: any[] | null;
  overall_score: number | null;
  key_strengths: string[] | null;
  improvements: string[] | null;
  recommendations: string[] | null;
  improved_summary: string | null;
  work_status_completed: boolean | null;
}

/**
 * Fetch candidate data from BPOC database
 */
async function fetchCandidateData(candidateId?: string, candidateName?: string): Promise<CandidateData | null> {
  try {
    const { fetchBPOCUsersFromDatabase, fetchBPOCUserById } = await import('@/lib/bpoc-database');
    
    if (candidateId) {
      // Fetch by ID
      const candidate = await fetchBPOCUserById(candidateId);
      return candidate as CandidateData | null;
    } else if (candidateName) {
      // Search by name with fuzzy matching
      const allCandidates = await fetchBPOCUsersFromDatabase();
      const searchName = candidateName.toLowerCase().trim();
      
      // First try exact matches
      let candidate = allCandidates.find(c => 
        c.full_name.toLowerCase().includes(searchName) ||
        searchName.includes(c.full_name.toLowerCase())
      );
      
      // If no exact match, try fuzzy matching on first name
      if (!candidate) {
        const firstName = searchName.split(' ')[0]; // Get first word
        
        // Calculate similarity score between names
        const calculateSimilarity = (str1: string, str2: string): number => {
          const longer = str1.length > str2.length ? str1 : str2;
          const shorter = str1.length > str2.length ? str2 : str1;
          if (longer.length === 0) return 1.0;
          const distance = levenshteinDistance(longer, shorter);
          return (longer.length - distance) / longer.length;
        };
        
        // Simple Levenshtein distance calculation
        const levenshteinDistance = (str1: string, str2: string): number => {
          const matrix = [];
          for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
          }
          for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
          }
          for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
              if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
              } else {
                matrix[i][j] = Math.min(
                  matrix[i - 1][j - 1] + 1,
                  matrix[i][j - 1] + 1,
                  matrix[i - 1][j] + 1
                );
              }
            }
          }
          return matrix[str2.length][str1.length];
        };
        
        const matches = allCandidates.map(c => {
          const firstName = c.first_name?.toLowerCase() || '';
          const lastName = c.last_name?.toLowerCase() || '';
          const fullName = c.full_name.toLowerCase();
          
          // Calculate similarity scores
          const firstNameScore = calculateSimilarity(firstName, searchName);
          const lastNameScore = calculateSimilarity(lastName, searchName);
          const fullNameScore = calculateSimilarity(fullName, searchName);
          
          // Also check for partial matches
          const firstNamePartial = firstName.includes(searchName) || searchName.includes(firstName);
          const lastNamePartial = lastName.includes(searchName) || searchName.includes(lastName);
          
          const maxScore = Math.max(firstNameScore, lastNameScore, fullNameScore);
          const hasPartial = firstNamePartial || lastNamePartial;
          
          return {
            candidate: c,
            score: maxScore,
            hasPartial,
            firstNameScore,
            lastNameScore,
            fullNameScore
          };
        }).filter(m => m.score > 0.3 || m.hasPartial); // Threshold for similarity
        
        // Sort by score and partial match
        matches.sort((a, b) => {
          if (a.hasPartial && !b.hasPartial) return -1;
          if (!a.hasPartial && b.hasPartial) return 1;
          return b.score - a.score;
        });
        
        if (matches.length === 1) {
          candidate = matches[0].candidate;
          console.log(`🔍 Found single match for "${candidateName}": ${candidate.full_name} (score: ${matches[0].score.toFixed(2)})`);
        } else if (matches.length > 1) {
          // Multiple matches - return the best one but log the options
          console.log(`🔍 Multiple matches for "${candidateName}":`, matches.map(m => `${m.candidate.full_name} (score: ${m.score.toFixed(2)})`));
          candidate = matches[0].candidate;
        }
      }
      
      return candidate as CandidateData | null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching candidate data:', error);
    return null;
  }
}

/**
 * Generate AI analysis of candidate
 */
async function analyzeCandidateWithAI(candidate: CandidateData, question?: string): Promise<string> {
  const candidateSummary = `
CANDIDATE PROFILE:
Name: ${candidate.full_name}
Position: ${candidate.current_position || candidate.position || 'Not specified'}
Location: ${candidate.location}
Expected Salary: ${candidate.expected_salary || 'Not specified'}
Overall Score: ${candidate.overall_score || 'Not scored'}

BIO:
${candidate.bio || 'No bio available'}

SKILLS:
${candidate.skills_snapshot && candidate.skills_snapshot.length > 0 
  ? candidate.skills_snapshot.join(', ') 
  : 'No skills listed'}

EXPERIENCE:
${candidate.experience_snapshot && candidate.experience_snapshot.length > 0
  ? candidate.experience_snapshot.map((exp: any, idx: number) => 
      `${idx + 1}. ${exp.position || exp.title || 'Position'} at ${exp.company || 'Company'} (${exp.duration || 'Duration not specified'})`
    ).join('\n')
  : 'No experience listed'}

KEY STRENGTHS:
${candidate.key_strengths && candidate.key_strengths.length > 0
  ? candidate.key_strengths.join(', ')
  : 'Not analyzed yet'}

AREAS FOR IMPROVEMENT:
${candidate.improvements && candidate.improvements.length > 0
  ? candidate.improvements.join(', ')
  : 'Not analyzed yet'}

RECOMMENDATIONS:
${candidate.recommendations && candidate.recommendations.length > 0
  ? candidate.recommendations.join(', ')
  : 'Not analyzed yet'}

PROFILE SUMMARY:
${candidate.improved_summary || 'Not available'}

PROFILE STATUS:
${candidate.work_status_completed ? 'Complete' : 'Incomplete'}
`;

  const systemPrompt = `You are Maya Santos, an expert AI recruiter and career advisor for ShoreAgents. 
You have deep knowledge of candidate evaluation, talent matching, and career development.

Your role is to provide insightful, professional analysis about candidates in the BPOC database.
Be specific, use the data provided, and give actionable insights.

When answering questions about candidates:
- Be professional but conversational
- Highlight strengths and areas for growth
- Suggest best-fit roles based on their experience
- Provide salary expectations context
- Mention cultural fit considerations
- Be honest about gaps or areas needing development

Keep responses concise (2-3 paragraphs max) unless asked for detailed analysis.`;

  const userPrompt = question 
    ? `${candidateSummary}\n\nQUESTION: ${question}\n\nProvide a helpful, professional answer based on the candidate's profile.`
    : `${candidateSummary}\n\nProvide a comprehensive professional summary of this candidate, including their strengths, experience level, best-fit roles, and overall recommendation for potential employers.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    const textContent = response.content.find(block => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : 'Unable to generate analysis.';
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    throw error;
  }
}

/**
 * API Route Handler
 */
export async function POST(request: NextRequest) {
  try {
    const body: CandidateAnalysisRequest = await request.json();
    const { candidateId, candidateName, question } = body;

    console.log('🔍 Candidate Analysis Request:', { candidateId, candidateName, question: question ? 'Yes' : 'No' });

    // Validate input
    if (!candidateId && !candidateName) {
      return NextResponse.json(
        { error: 'Either candidateId or candidateName must be provided' },
        { status: 400 }
      );
    }

    // Fetch candidate data
    const candidate = await fetchCandidateData(candidateId, candidateName);

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found candidate:', candidate.full_name);

    // Generate AI analysis
    const analysis = await analyzeCandidateWithAI(candidate, question);

    console.log('✅ Generated AI analysis for:', candidate.full_name);

    return NextResponse.json({
      success: true,
      candidate: {
        id: candidate.user_id,
        name: candidate.full_name,
        position: candidate.current_position || candidate.position,
        location: candidate.location,
        expectedSalary: candidate.expected_salary,
        overallScore: candidate.overall_score,
        skills: candidate.skills_snapshot || [],
        experienceCount: candidate.experience_snapshot?.length || 0
      },
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Candidate Analysis API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze candidate',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to list all candidates (for autocomplete/search)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '20');

    const { fetchBPOCUsersFromDatabase } = await import('@/lib/bpoc-database');
    let candidates = await fetchBPOCUsersFromDatabase();

    // Filter by query if provided
    if (query) {
      const queryLower = query.toLowerCase();
      candidates = candidates.filter(c => 
        c.full_name.toLowerCase().includes(queryLower) ||
        (c.current_position && c.current_position.toLowerCase().includes(queryLower)) ||
        (c.position && c.position.toLowerCase().includes(queryLower))
      );
    }

    // Limit results
    candidates = candidates.slice(0, limit);

    // Return simplified candidate list
    const candidateList = candidates.map(c => ({
      id: c.user_id,
      name: c.full_name,
      position: c.current_position || c.position || 'No position specified',
      location: c.location,
      overallScore: c.overall_score || 0
    }));

    return NextResponse.json({
      success: true,
      candidates: candidateList,
      total: candidateList.length
    });

  } catch (error) {
    console.error('❌ Get candidates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

