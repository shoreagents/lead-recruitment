import { NextRequest, NextResponse } from 'next/server';

interface ImproveResumeRequest {
  resumeData: any;
  sessionId: string;
}

interface ImprovedResumeContent {
  name: string;
  bestJobTitle: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    achievements: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    highlights: string[];
  }>;
  certifications: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    impact: string[];
  }>;
  achievements: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { resumeData, sessionId }: ImproveResumeRequest = await request.json();

    // Get Claude API key from environment
    const claudeApiKey = process.env.CLAUDE_API_KEY;
    if (!claudeApiKey) {
      return NextResponse.json(
        { success: false, error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Create improvement prompt for Claude
    const improvementPrompt = createImprovementPrompt(resumeData);

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: improvementPrompt
          }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to improve resume with Claude' },
        { status: 500 }
      );
    }

    const claudeData = await claudeResponse.json();
    const improvementText = claudeData.content[0].text;

    // Parse Claude's response into structured data
    const improvedContent = parseClaudeImprovementResponse(improvementText, resumeData);

    return NextResponse.json({
      success: true,
      improvedResume: improvedContent,
      sessionId
    });

  } catch (error) {
    console.error('Resume improvement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to improve resume' },
      { status: 500 }
    );
  }
}

function createImprovementPrompt(resumeData: any): string {
  const candidateName = resumeData?.name || resumeData?.personalInfo?.name || 'Candidate';
  const candidateSkills = resumeData?.skills || [];
  const candidateExperience = resumeData?.experience || [];
  const candidateEducation = resumeData?.education || [];
  const candidateSummary = resumeData?.summary || resumeData?.objective || '';

  return `You are an expert resume writer specializing in creating compelling, professional resumes for the BPO industry in the Philippines.

CRITICAL INSTRUCTIONS:
- USE ALL INFORMATION from the extracted JSON resume data provided below - do not skip or omit any sections
- Make sure to include ALL work experience entries, ALL skills, ALL education, ALL certifications, ALL projects, and ALL achievements present in the data
- ONLY use information that is explicitly present in the provided resume data - never add or invent information
- DO NOT add certifications, projects, or achievements that are not mentioned in the original data
- Focus on improving the presentation and wording of existing information while ensuring nothing is left out
- Make the content more impactful and professional while staying 100% factual
- If a field exists in the resume data (even if it seems minor), include it in your improved version

ORIGINAL RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

IMPROVEMENT REQUIREMENTS:
1. Use the candidate's actual name: ${candidateName}
2. Include EVERY work experience entry from the resume data - do not skip any jobs or roles
3. Analyze the existing experience and suggest the best job title based on actual roles and responsibilities
4. Enhance existing work experience descriptions with better wording and action verbs
5. Include ALL skills from the resume and organize them into technical, soft skills, and languages
6. Improve existing education section with better presentation - include all educational entries
7. Include ALL certifications that are explicitly mentioned in the original resume
8. Include ALL projects that are explicitly mentioned in the original resume
9. Include ALL achievements that are explicitly mentioned in the original resume
10. Create a compelling professional summary based on actual experience and skills
11. Optimize for ATS (Applicant Tracking Systems) using existing keywords
12. Ensure every section in the resume data is represented in your improved version

PROFESSIONAL SUMMARY GUIDELINES:
- Create a compelling 3-4 sentence summary that highlights the candidate's key strengths
- Focus on their most relevant experience, skills, and career achievements
- Use strong action verbs and industry-specific keywords
- Emphasize their unique value proposition and career objectives
- Make it engaging and professional while staying factual
- Include their years of experience if available
- Mention their key technical skills or specializations if relevant
- End with their career goals or what they're seeking

Please provide an improved resume in the following JSON structure, using ONLY information from the provided resume data:

{
  "name": "${candidateName}",
  "bestJobTitle": "[Analyze the resume and suggest the most appropriate job title based on actual experience and skills]",
  "summary": "[Create a compelling 3-4 sentence professional summary that highlights key strengths, experience, skills, and career objectives. Focus on their most relevant achievements and what makes them unique. Use strong action verbs and industry keywords. Example format: 'Experienced [role] with [X] years of expertise in [key areas]. Demonstrated success in [specific achievements]. Skilled in [key technical skills]. Seeking [career goal or next step].']",
  "experience": [
    {
      "title": "[Use actual job title or suggest better title based on responsibilities]",
      "company": "[Actual company name]",
      "duration": "[Actual duration]",
      "achievements": [
        "[Enhance actual achievements with better wording and action verbs]"
      ]
    }
  ],
  "skills": {
    "technical": [
      "[Only include technical skills that are explicitly mentioned in the resume]"
    ],
    "soft": [
      "[Only include soft skills that are explicitly mentioned in the resume]"
    ],
    "languages": [
      "[Only include languages that are explicitly mentioned in the resume]"
    ]
  },
  "education": [
    {
      "degree": "[Actual degree name]",
      "institution": "[Actual institution name]",
      "year": "[Actual year]",
      "highlights": [
        "[Only include highlights that are explicitly mentioned in the resume]"
      ]
    }
  ],
  "certifications": [
    "[Only include certifications that are explicitly mentioned in the resume]"
  ],
  "projects": [
    {
      "title": "[Only include projects that are explicitly mentioned in the resume]",
      "description": "[Use actual project description with enhanced wording]",
      "technologies": [
        "[Only include technologies that are explicitly mentioned]"
      ],
      "impact": [
        "[Only include impact that is explicitly mentioned]"
      ]
    }
  ],
  "achievements": [
    "[Only include achievements that are explicitly mentioned in the resume, enhanced with better wording]"
  ]
}

CRITICAL RULES:
- USE EVERY PIECE OF DATA from the extracted JSON - include all experience entries, all skills, all education, all certifications, all projects, and all achievements
- NEVER skip or omit sections that exist in the resume data - if it's in the JSON, it must be in your output
- NEVER invent or add information that is not in the original resume
- ONLY enhance the wording and presentation of existing information
- If a section is empty in the original resume, leave it empty or use an empty array
- Focus on making existing content more impactful and professional
- Use action verbs and strong language to improve existing descriptions
- Ensure all content is 100% factual and based on provided data
- The goal is to present existing information in a more compelling way, not to add new information
- For the professional summary, focus on their actual experience and achievements, not generic statements
- Double-check that you haven't accidentally left out any work experience, skills, education, or other sections from the original data`;
}

function parseClaudeImprovementResponse(responseText: string, resumeData: any): ImprovedResumeContent {
  try {
    // Extract JSON from Claude's response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and provide defaults if needed
    return {
      name: parsed.name || 'Candidate',
      bestJobTitle: parsed.bestJobTitle || 'Professional',
      summary: parsed.summary || 'Professional summary will be generated based on your experience.',
      experience: parsed.experience || [],
      skills: parsed.skills || {
        technical: ['Microsoft Office', 'Customer Service Software'],
        soft: ['Communication', 'Problem Solving'],
        languages: ['English (Fluent)', 'Filipino (Native)']
      },
      education: parsed.education || [],
      certifications: parsed.certifications || [],
      projects: parsed.projects || [],
      achievements: parsed.achievements || []
    };
  } catch (error) {
    console.error('Error parsing Claude improvement response:', error);
    
    // Return default improved content if parsing fails
    return {
      name: 'Candidate',
      bestJobTitle: 'Professional',
      summary: 'Professional summary will be generated based on your experience.',
      experience: [],
      skills: {
        technical: ['Microsoft Office', 'Customer Service Software'],
        soft: ['Communication', 'Problem Solving'],
        languages: ['English (Fluent)', 'Filipino (Native)']
      },
      education: [],
      certifications: [],
      projects: [],
      achievements: []
    };
  }
}