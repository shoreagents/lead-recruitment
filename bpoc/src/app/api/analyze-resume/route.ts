import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

interface AnalysisRequest {
  resumeData: any;
  portfolioLinks?: any[];
  sessionId: string;
}

interface AnalysisResult {
  overallScore: number;
  atsCompatibility: number;
  contentQuality: number;
  professionalPresentation: number;
  skillsAlignment: number;
  keyStrengths: string[];
  strengthsAnalysis: {
    topStrengths: string[];
    uniqueValue: string;
    areasToHighlight: string[];
    coreStrengths: string[];
    technicalStrengths: string[];
    softSkills: string[];
    achievements: string[];
    marketAdvantage: string[];
  };
  improvements: string[];
  recommendations: string[];
  improvedSummary: string;
  salaryAnalysis: {
    currentLevel: string;
    recommendedSalaryRange: string;
    marketPosition?: string;
    growthPotential?: string;
    factorsAffectingSalary: string[];
    negotiationTips: string[];
  };
  careerPath: {
    currentRole?: string;
    targetRole?: string;
    currentPosition: string;
    nextCareerSteps: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    skillGaps: string[];
    timeline: string;
    timelineDetails: string;
  };
  sectionAnalysis: {
    contact: { score: number; reasons: string[]; issues: string[]; improvements: string[] };
    summary: { score: number; reasons: string[]; issues: string[]; improvements: string[] };
    experience: { score: number; reasons: string[]; issues: string[]; improvements: string[] };
    education: { score: number; reasons: string[]; issues: string[]; improvements: string[] };
    skills: { score: number; reasons: string[]; issues: string[]; improvements: string[] };
  };
}

function extractCandidateProfile(resumeData: any): { name?: string; email?: string; phone?: string; location?: string } {
  const getFirst = (obj: any, keys: string[]): string | undefined => {
    for (const k of keys) {
      if (obj && typeof obj === 'object' && obj[k]) return obj[k];
    }
    return undefined;
  };

  const fromSingle = (data: any) => ({
    name: getFirst(data, ['name', 'full_name', 'fullName', 'personal_name', 'candidate_name']) ||
          (data?.first_name && data?.last_name ? `${data.first_name} ${data.last_name}` : undefined) ||
          data?.contact?.name,
    email: getFirst(data, ['email', 'email_address', 'contact_email']) || data?.contact?.email,
    phone: getFirst(data, ['phone', 'phone_number', 'contact_phone', 'mobile', 'telephone']) || data?.contact?.phone,
    location: getFirst(data, ['location', 'address', 'city']) || data?.contact?.location,
  });

  try {
    if (resumeData?.files && Array.isArray(resumeData.files)) {
      for (const f of resumeData.files) {
        const prof = fromSingle(f?.data || {});
        if (prof.name || prof.email || prof.phone || prof.location) return prof;
      }
      return {};
    }
    return fromSingle(resumeData || {});
  } catch {
    return {};
  }
}

function aggregateArrays(resumeData: any): { skills: string[]; experience: any[]; education: any[] } {
  const result = { skills: [] as string[], experience: [] as any[], education: [] as any[] };
  try {
    const addFrom = (data: any) => {
      if (Array.isArray(data?.skills)) result.skills.push(...data.skills.filter((x: any) => typeof x === 'string'));
      if (Array.isArray(data?.experience)) result.experience.push(...data.experience);
      if (Array.isArray(data?.education)) result.education.push(...data.education);
    };
    if (resumeData?.files && Array.isArray(resumeData.files)) {
      for (const f of resumeData.files) addFrom(f?.data || {});
    } else {
      addFrom(resumeData || {});
    }
    // Dedup skills (case-insensitive)
    const seen = new Set<string>();
    result.skills = result.skills.filter(s => {
      const key = s.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return result;
  } catch {
    return result;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resumeData, portfolioLinks = [], sessionId }: AnalysisRequest = await request.json();

    console.log('🔍 DEBUG: Received analysis request');
    console.log('  - resumeData type:', typeof resumeData);
    console.log('  - resumeData keys:', Object.keys(resumeData || {}));
    console.log('  - portfolioLinks count:', portfolioLinks.length);
    console.log('  - sessionId:', sessionId);

    // Auth: user comes from middleware
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      console.error('❌ Missing userId in headers');
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Prepare DB connection
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ Missing DATABASE_URL');
      return NextResponse.json(
        { success: false, error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    // Get Claude API key from environment
    const claudeApiKey = process.env.CLAUDE_API_KEY;
    if (!claudeApiKey) {
      console.error('❌ Claude API key not configured');
      return NextResponse.json(
        { success: false, error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Create analysis prompt for Claude
    console.log('🔍 DEBUG: Creating analysis prompt...');
    const analysisPrompt = createAnalysisPrompt(resumeData, portfolioLinks);
    console.log('🔍 DEBUG: Analysis prompt length:', analysisPrompt.length);

    // Call Claude API with retry/backoff for overloaded/temporary errors
    console.log('🔍 DEBUG: Calling Claude API...');
    const maxAttempts = 4;
    let claudeResponse: Response | null = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const start = Date.now();
      claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
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
            { role: 'user', content: analysisPrompt }
          ]
        })
      });
      console.log(`🔍 DEBUG: Claude attempt ${attempt} status:`, claudeResponse.status, `(${Date.now() - start}ms)`);
      // Break if success
      if (claudeResponse.ok) break;
      // Retry on transient/overload
      if ([429, 500, 502, 503, 504, 529].includes(claudeResponse.status)) {
        const backoffMs = 1500 * attempt + Math.floor(Math.random() * 500);
        console.warn(`⚠️ Claude transient error ${claudeResponse.status}. Retrying in ${backoffMs}ms...`);
        await new Promise(r => setTimeout(r, backoffMs));
        continue;
      }
      // Non-retryable
      break;
    }

    console.log('🔍 DEBUG: Claude API response status:', claudeResponse?.status);

    if (!claudeResponse || !claudeResponse.ok) {
      const errorData = claudeResponse ? await claudeResponse.text() : 'no response';
      console.error('❌ Claude API error:', errorData);
      console.error('❌ Claude API status:', claudeResponse ? claudeResponse.status : 'no status');
      const status = claudeResponse ? claudeResponse.status : 502;
      const isOverloaded = status === 529 || status === 503 || status === 504;
      return NextResponse.json(
        { success: false, error: `Failed to analyze resume with Claude: ${status} - ${errorData}` },
        { status: isOverloaded ? 503 : 500 }
      );
    }

    const claudeData = await claudeResponse.json();
    console.log('🔍 DEBUG: Claude API response received');
    
    if (!claudeData.content || !claudeData.content[0] || !claudeData.content[0].text) {
      console.error('❌ Invalid Claude API response structure:', claudeData);
      return NextResponse.json(
        { success: false, error: 'Invalid response structure from Claude API' },
        { status: 500 }
      );
    }

    const analysisText = claudeData.content[0].text;
    console.log('🔍 DEBUG: Analysis text length:', analysisText.length);

    // Parse Claude's response into structured data
    console.log('🔍 DEBUG: Parsing Claude response...');
    const analysisResult = parseClaudeResponse(analysisText, resumeData);
    console.log('🔍 DEBUG: Analysis parsing complete');

    // Persist analysisResult to ai_analysis_results (UPSERT by user_id + session_id)
    const filesAnalyzed = (() => {
      try {
        const isMultiple = Array.isArray((resumeData as any)?.files);
        if (isMultiple) {
          return {
            totalFiles: (resumeData as any).totalFiles,
            fileTypes: (resumeData as any).fileTypes,
            fileNames: (resumeData as any).fileNames,
          };
        }
        return { totalFiles: 1, fileTypes: ['resume'], fileNames: ['Resume'] };
      } catch {
        return null;
      }
    })();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Ensure user exists (optional safety)
      const userExists = await client.query('SELECT 1 FROM users WHERE id = $1', [userId]);
      if (userExists.rowCount === 0) {
        console.warn('⚠️ User not found in users table, proceeding to save analysis with FK constraint');
      }

      const upsertSql = `
        INSERT INTO ai_analysis_results (
          user_id,
          session_id,
          original_resume_id,
          overall_score,
          ats_compatibility_score,
          content_quality_score,
          professional_presentation_score,
          skills_alignment_score,
          key_strengths,
          strengths_analysis,
          improvements,
          recommendations,
          improved_summary,
          salary_analysis,
          career_path,
          section_analysis,
          analysis_metadata,
          portfolio_links,
          files_analyzed,
          candidate_profile,
          skills_snapshot,
          experience_snapshot,
          education_snapshot,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, NOW()
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
          session_id = EXCLUDED.session_id,
          original_resume_id = EXCLUDED.original_resume_id,
          overall_score = EXCLUDED.overall_score,
          ats_compatibility_score = EXCLUDED.ats_compatibility_score,
          content_quality_score = EXCLUDED.content_quality_score,
          professional_presentation_score = EXCLUDED.professional_presentation_score,
          skills_alignment_score = EXCLUDED.skills_alignment_score,
          key_strengths = EXCLUDED.key_strengths,
          strengths_analysis = EXCLUDED.strengths_analysis,
          improvements = EXCLUDED.improvements,
          recommendations = EXCLUDED.recommendations,
          improved_summary = EXCLUDED.improved_summary,
          salary_analysis = EXCLUDED.salary_analysis,
          career_path = EXCLUDED.career_path,
          section_analysis = EXCLUDED.section_analysis,
          analysis_metadata = EXCLUDED.analysis_metadata,
          portfolio_links = EXCLUDED.portfolio_links,
          files_analyzed = EXCLUDED.files_analyzed,
          candidate_profile = EXCLUDED.candidate_profile,
          skills_snapshot = EXCLUDED.skills_snapshot,
          experience_snapshot = EXCLUDED.experience_snapshot,
          education_snapshot = EXCLUDED.education_snapshot,
          updated_at = NOW()
        RETURNING id`;

      const snapshots = aggregateArrays(resumeData);
      const profile = extractCandidateProfile(resumeData);

      const params = [
        userId,
        sessionId,
        null, // original_resume_id (not available in request yet)
        analysisResult.overallScore,
        analysisResult.atsCompatibility,
        analysisResult.contentQuality,
        analysisResult.professionalPresentation,
        analysisResult.skillsAlignment,
        JSON.stringify(analysisResult.keyStrengths || []),
        JSON.stringify(analysisResult.strengthsAnalysis || {}),
        JSON.stringify(analysisResult.improvements || []),
        JSON.stringify(analysisResult.recommendations || []),
        analysisResult.improvedSummary || '',
        JSON.stringify(analysisResult.salaryAnalysis || {}),
        JSON.stringify(analysisResult.careerPath || {}),
        JSON.stringify(analysisResult.sectionAnalysis || {}),
        JSON.stringify({ source: 'claude-3-5-sonnet-20241022' }),
        JSON.stringify(portfolioLinks || []),
        filesAnalyzed ? JSON.stringify(filesAnalyzed) : null,
        JSON.stringify(profile || {}),
        JSON.stringify(snapshots.skills || []),
        JSON.stringify(snapshots.experience || []),
        JSON.stringify(snapshots.education || []),
      ];

      const upsertResult = await client.query(upsertSql, params);
      const analysisId = upsertResult.rows[0]?.id;
      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        sessionId,
        analysisId,
        saved: true
      });
    } catch (dbError) {
      await client.query('ROLLBACK');
      console.error('❌ Error saving analysis results:', dbError);
      // Return analysis result even if DB save failed
      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        sessionId,
        saved: false
      });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: `Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

function createAnalysisPrompt(resumeData: any, portfolioLinks: any[]): string {
  console.log('🔍 DEBUG: createAnalysisPrompt called');
  console.log('  - resumeData type:', typeof resumeData);
  console.log('  - resumeData keys:', Object.keys(resumeData || {}));
  
  // Handle multiple files (resumes and certificates)
  const isMultipleFiles = resumeData?.files && Array.isArray(resumeData.files);
  console.log('  - isMultipleFiles:', isMultipleFiles);
  
  let candidateName = 'Candidate';
  let candidateSkills: string[] = [];
  let candidateExperience: any[] = [];
  let candidateEducation: any[] = [];
  let candidateSummary = '';
  let candidateLocation = 'Philippines';
  let certificates: any[] = [];
  let totalFiles = 1;
  let fileTypes: string[] = [];
  let fileNames: string[] = [];

  if (isMultipleFiles) {
    // Multiple files structure
    totalFiles = resumeData.totalFiles || resumeData.files.length;
    fileTypes = resumeData.fileTypes || [];
    fileNames = resumeData.fileNames || [];
    
    console.log('  - totalFiles:', totalFiles);
    console.log('  - fileTypes:', fileTypes);
    console.log('  - fileNames:', fileNames);
    
    // Extract data from all files
    resumeData.files.forEach((file: any, index: number) => {
      const fileData = file.data;
      const fileName = file.fileName;
      const fileType = file.fileType;
      
      console.log(`  - Processing file ${index + 1}: ${fileName} (${fileType})`);
      
      // Extract skills from all files
      if (fileData?.skills && Array.isArray(fileData.skills)) {
        candidateSkills = [...candidateSkills, ...fileData.skills];
      }
      
      // Extract experience from resume files
      if (fileData?.experience && Array.isArray(fileData.experience)) {
        candidateExperience = [...candidateExperience, ...fileData.experience];
      }
      
      // Extract education from all files
      if (fileData?.education && Array.isArray(fileData.education)) {
        candidateEducation = [...candidateEducation, ...fileData.education];
      }
      
      // Get summary from first resume file
      if (!candidateSummary && fileData?.summary) {
        candidateSummary = fileData.summary;
      }
      
      // Get name from first file with name
      if (candidateName === 'Candidate' && fileData?.name) {
        candidateName = fileData.name;
      }
      
      // Get location from first file with location
      if (candidateLocation === 'Philippines' && fileData?.location) {
        candidateLocation = fileData.location;
      }
      
      // Identify certificates
      if (fileType.includes('certificate') || fileName.toLowerCase().includes('certificate') || 
          fileType.includes('certification') || fileName.toLowerCase().includes('certification')) {
        certificates.push({
          fileName: fileName,
          data: fileData
        });
      }
    });
    
    // Remove duplicates from skills
    candidateSkills = [...new Set(candidateSkills)];
  } else {
    // Single file structure (backward compatibility)
    candidateName = resumeData?.name || resumeData?.personalInfo?.name || 'Candidate';
    candidateSkills = resumeData?.skills || [];
    candidateExperience = resumeData?.experience || [];
    candidateEducation = resumeData?.education || [];
    candidateSummary = resumeData?.summary || resumeData?.objective || '';
    candidateLocation = resumeData?.location || resumeData?.personalInfo?.location || 'Philippines';
    totalFiles = 1;
    fileTypes = ['resume'];
    fileNames = ['Resume'];
  }
  
  console.log('  - Extracted data:');
  console.log('    - candidateName:', candidateName);
  console.log('    - candidateSkills count:', candidateSkills.length);
  console.log('    - candidateExperience count:', candidateExperience.length);
  console.log('    - candidateEducation count:', candidateEducation.length);
  console.log('    - certificates count:', certificates.length);
  
  // Calculate experience level based on actual data
  const totalExperience = candidateExperience.length;
  const experienceLevel = totalExperience === 0 ? 'entry' : 
                         totalExperience <= 2 ? 'junior' : 
                         totalExperience <= 5 ? 'mid' : 'senior';
  
  // Get current position from actual experience
  const currentPosition = candidateExperience.length > 0 ? 
    candidateExperience[0]?.position || candidateExperience[0]?.title || 'Professional' : 
    'Entry Level Professional';

  const prompt = `You are an expert resume analyst specializing in BPO (Business Process Outsourcing) industry analysis for the Philippine market.

IMPORTANT: Analyze the ACTUAL resume data provided and generate insights based on the real content. Do NOT use generic examples.

CANDIDATE CONTEXT:
- Name: ${candidateName}
- Location: ${candidateLocation}
- Current Position: ${currentPosition}
- Experience Level: ${experienceLevel} (based on ${totalExperience} positions)
- Total Files Uploaded: ${totalFiles}
- File Types: ${fileTypes.join(', ')}
- File Names: ${fileNames.join(', ')}
- Skills Found: ${candidateSkills.length} skills
- Education: ${candidateEducation.length} items
- Certificates: ${certificates.length} certificates
- Summary: ${candidateSummary ? 'Present' : 'Missing'}

RESUME DATA TO ANALYZE:
${JSON.stringify(resumeData, null, 2)}

PORTFOLIO LINKS:
${JSON.stringify(portfolioLinks, null, 2)}

ANALYSIS REQUIREMENTS:
1. Base ALL analysis on the actual resume content provided across ALL files
2. Consider certificates as additional qualifications and achievements
3. Calculate scores based on real data quality and completeness
4. Identify strengths from actual skills, experience, achievements, and certifications
5. Suggest improvements based on what's missing or could be enhanced
6. Provide salary recommendations based on actual experience level, location, and certifications - MUST be in PHP (Philippine Peso) format only
7. Create career path based on current position, skills, and qualifications

IMPORTANT SALARY FORMAT REQUIREMENTS:
- ALL salary ranges MUST be in PHP format (e.g., "PHP 20,000 - 35,000")
- Do NOT use USD, EUR, or any other currency
- Use Philippine Peso market rates for BPO industry
- Format: "PHP [minimum] - [maximum]" (e.g., "PHP 25,000 - 40,000")

Please provide a detailed analysis in the following JSON structure, using ONLY information from the provided resume data:

{
  "overallScore": [Calculate based on actual content quality across all files],
  "atsCompatibility": [Score based on keyword optimization and format],
  "contentQuality": [Score based on completeness and impact],
  "professionalPresentation": [Score based on formatting and structure],
  "skillsAlignment": [Score based on BPO industry relevance],
  "keyStrengths": [
    [List 3-5 actual strengths from the resume data with detailed explanations, including certifications]
  ],
  "strengthsAnalysis": {
    "topStrengths": [
      [List 3-5 top strengths that make the candidate stand out, including certifications]
    ],
    "uniqueValue": "[Describe what makes this candidate unique and valuable in 1-2 sentences]",
    "areasToHighlight": [
      [List 3-4 key areas the candidate should emphasize in interviews and applications]
    ],
    "coreStrengths": [
      [List 3-4 core professional strengths with detailed explanations]
    ],
    "technicalStrengths": [
      [List 2-3 technical skills that are valuable for BPO roles]
    ],
    "softSkills": [
      [List 2-3 soft skills that make the candidate valuable]
    ],
    "achievements": [
      [List 2-3 notable achievements from the resume with impact, including certifications]
    ],
    "marketAdvantage": [
      [List 2-3 specific advantages for BPO industry based on resume and certifications]
    ]
  },
  "improvements": [
    [List 3-5 specific improvements based on what's missing or weak]
  ],
  "recommendations": [
    [List 3-5 actionable recommendations based on actual content]
  ],
  "improvedSummary": "[Create a compelling 3-4 sentence professional summary that highlights key strengths, career objectives, and certifications, optimized for BPO industry]",
  "salaryAnalysis": {
    "currentLevel": "${experienceLevel}",
    "recommendedSalaryRange": "[Calculate based on experience level, location, and certifications - MUST be in PHP format like 'PHP 20,000 - 35,000' or 'PHP 25,000 - 40,000']",
    "marketPosition": "[Analyze the candidate's competitive position in the BPO job market based on their skills, experience, certifications, and location. Consider market demand, skill scarcity, and industry trends. Provide specific insights about their competitive advantages and market positioning. Include how their unique combination of skills and experience makes them stand out in the current job market.]",
    "growthPotential": "[Assess the candidate's potential for career advancement and salary growth based on their current skills, experience level, certifications, and market trends. Include specific recommendations for skill development and career progression opportunities. Consider their current position, target roles, and the skills needed to advance. Provide actionable insights on how they can maximize their earning potential and career trajectory.]",
    "factorsAffectingSalary": [
      [List 3-4 factors based on actual resume content and certifications]
    ],
    "negotiationTips": [
      [List 3-4 tips based on actual achievements, skills, and certifications]
    ]
  },
  "careerPath": {
    "currentRole": "${currentPosition}",
    "targetRole": "[Next logical position based on current role and certifications]",
    "currentPosition": "${currentPosition}",
    "nextCareerSteps": [
      {
        "step": "1",
        "title": "[Next logical position based on current role and certifications]",
        "description": "[Specific description based on actual skills and qualifications]"
      },
      {
        "step": "2",
        "title": "[Advanced position based on certifications and experience]",
        "description": "[Specific description based on actual skills and qualifications]"
      }
    ],
    "skillGaps": [
      [List 2-3 skill gaps based on actual resume content and target positions]
    ],
    "timeline": "[Realistic timeline based on current level and certifications]",
    "timelineDetails": "[Detailed timeline explanation based on actual skills and qualifications]"
  },
  "sectionAnalysis": {
    "contact": {
      "score": [Score based on actual contact information completeness],
      "reasons": [List reasons for the score based on actual data],
      "issues": [List issues found in actual contact section],
      "improvements": [List improvements based on actual gaps]
    },
    "summary": {
      "score": [Score based on actual summary quality],
      "reasons": [List reasons for the score based on actual data],
      "issues": [List issues found in actual summary],
      "improvements": [List improvements based on actual gaps]
    },
    "experience": {
      "score": [Score based on actual experience presentation],
      "reasons": [List reasons for the score based on actual data],
      "issues": [List issues found in actual experience section],
      "improvements": [List improvements based on actual gaps]
    },
    "education": {
      "score": [Score based on actual education presentation],
      "reasons": [List reasons for the score based on actual data],
      "issues": [List issues found in actual education section],
      "improvements": [List improvements based on actual gaps]
    },
    "skills": {
      "score": [Score based on actual skills presentation],
      "reasons": [List reasons for the score based on actual data],
      "issues": [List issues found in actual skills section],
      "improvements": [List improvements based on actual gaps]
    }
  }
}`;

  console.log('🔍 DEBUG: Prompt created successfully, length:', prompt.length);
  return prompt;
}

function parseClaudeResponse(responseText: string, resumeData: any): AnalysisResult {
  try {
    // Extract JSON from Claude's response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and provide defaults if needed
    return {
      overallScore: parsed.overallScore || 70,
      atsCompatibility: parsed.atsCompatibility || 75,
      contentQuality: parsed.contentQuality || 70,
      professionalPresentation: parsed.professionalPresentation || 75,
      skillsAlignment: parsed.skillsAlignment || 70,
      keyStrengths: parsed.keyStrengths || ['Good communication skills', 'Relevant experience'],
      strengthsAnalysis: parsed.strengthsAnalysis || {
        topStrengths: ['Strong communication skills', 'Customer service experience', 'Problem-solving abilities'],
        uniqueValue: 'Reliable and customer-focused professional with strong communication skills',
        areasToHighlight: ['Customer service excellence', 'Communication skills', 'Problem-solving'],
        coreStrengths: ['Strong communication skills', 'Customer service experience'],
        technicalStrengths: ['Basic computer skills', 'Microsoft Office proficiency'],
        softSkills: ['Teamwork', 'Problem-solving'],
        achievements: ['Consistent performance', 'Reliable attendance'],
        marketAdvantage: ['Philippine market knowledge', 'English proficiency']
      },
      improvements: parsed.improvements || ['Add more specific achievements', 'Improve keyword optimization'],
      recommendations: parsed.recommendations || ['Focus on quantifiable results', 'Include industry keywords'],
      improvedSummary: parsed.improvedSummary || 'This is the improved summary based on the analysis.',
      salaryAnalysis: parsed.salaryAnalysis || {
        currentLevel: 'mid',
        recommendedSalaryRange: 'PHP 20,000 - 30,000',
        marketPosition: 'Competitive for experience level',
        growthPotential: 'High potential for advancement with skill development',
        factorsAffectingSalary: ['Experience level', 'Technical skills', 'Location'],
        negotiationTips: ['Highlight achievements', 'Research market rates']
      },
      careerPath: parsed.careerPath || {
        currentRole: 'Customer Service Representative',
        targetRole: 'Team Lead or Quality Analyst',
        currentPosition: 'Customer Service Representative',
        nextCareerSteps: [
          { step: '1', title: 'Team Lead', description: 'Lead small teams' },
          { step: '2', title: 'Quality Analyst', description: 'Monitor service quality' }
        ],
        skillGaps: ['Leadership skills', 'Advanced analytics'],
        timeline: '2-3 years for promotion',
        timelineDetails: 'Focus on developing leadership skills and taking on additional responsibilities'
      },
      sectionAnalysis: parsed.sectionAnalysis || {
        contact: { score: 80, reasons: ['Contact info present'], issues: [], improvements: [] },
        summary: { score: 70, reasons: ['Summary included'], issues: ['Could be stronger'], improvements: ['Add achievements'] },
        experience: { score: 75, reasons: ['Experience shown'], issues: ['Missing metrics'], improvements: ['Add numbers'] },
        education: { score: 80, reasons: ['Education listed'], issues: [], improvements: [] },
        skills: { score: 70, reasons: ['Skills included'], issues: ['Missing technical skills'], improvements: ['Add industry keywords'] }
      }
    };
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    
    // Return default analysis if parsing fails
    return {
      overallScore: 70,
      atsCompatibility: 75,
      contentQuality: 70,
      professionalPresentation: 75,
      skillsAlignment: 70,
      keyStrengths: ['Good communication skills', 'Relevant experience'],
      strengthsAnalysis: {
        topStrengths: ['Strong communication skills', 'Customer service experience', 'Problem-solving abilities'],
        uniqueValue: 'Reliable and customer-focused professional with strong communication skills',
        areasToHighlight: ['Customer service excellence', 'Communication skills', 'Problem-solving'],
        coreStrengths: ['Strong communication skills', 'Customer service experience'],
        technicalStrengths: ['Basic computer skills', 'Microsoft Office proficiency'],
        softSkills: ['Teamwork', 'Problem-solving'],
        achievements: ['Consistent performance', 'Reliable attendance'],
        marketAdvantage: ['Philippine market knowledge', 'English proficiency']
      },
      improvements: ['Add more specific achievements', 'Improve keyword optimization'],
      recommendations: ['Focus on quantifiable results', 'Include industry keywords'],
      improvedSummary: 'This is the improved summary based on the analysis.',
      salaryAnalysis: {
        currentLevel: 'mid',
        recommendedSalaryRange: 'PHP 20,000 - 30,000',
        marketPosition: 'Competitive for experience level',
        growthPotential: 'High potential for advancement with skill development',
        factorsAffectingSalary: ['Experience level', 'Technical skills', 'Location'],
        negotiationTips: ['Highlight achievements', 'Research market rates']
      },
      careerPath: {
        currentRole: 'Customer Service Representative',
        targetRole: 'Team Lead or Quality Analyst',
        currentPosition: 'Customer Service Representative',
        nextCareerSteps: [
          { step: '1', title: 'Team Lead', description: 'Lead small teams' },
          { step: '2', title: 'Quality Analyst', description: 'Monitor service quality' }
        ],
        skillGaps: ['Leadership skills', 'Advanced analytics'],
        timeline: '2-3 years for promotion',
        timelineDetails: 'Focus on developing leadership skills and taking on additional responsibilities'
      },
      sectionAnalysis: {
        contact: { score: 80, reasons: ['Contact info present'], issues: [], improvements: [] },
        summary: { score: 70, reasons: ['Summary included'], issues: ['Could be stronger'], improvements: ['Add achievements'] },
        experience: { score: 75, reasons: ['Experience shown'], issues: ['Missing metrics'], improvements: ['Add numbers'] },
        education: { score: 80, reasons: ['Education listed'], issues: [], improvements: [] },
        skills: { score: 70, reasons: ['Skills included'], issues: ['Missing technical skills'], improvements: ['Add industry keywords'] }
      }
    };
  }
} 