import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId, jobIds } = await request.json();

    if (!userId || !jobIds?.length) {
      return NextResponse.json({ error: 'userId and jobIds are required' }, { status: 400 });
    }

    console.log('🔍 Batch match request:', { userId, jobIds });

    const client = await pool.connect();
    try {
      console.log('🔍 About to query user data for userId:', userId);
      // Get user data once
      const userResult = await client.query(`
        SELECT 
          u.id, u.full_name, u.location, u.position, u.bio,
          u.location_place_id, u.location_lat, u.location_lng, u.location_city, u.location_province, u.location_barangay, u.location_region,
          sr.resume_data,
          aar.skills_snapshot, aar.experience_snapshot, aar.education_snapshot,
          uws.current_employer, uws.current_position, uws.current_salary, uws.expected_salary, uws.work_status, uws.preferred_shift, uws.work_setup
        FROM users u
        LEFT JOIN saved_resumes sr ON u.id = sr.user_id
        LEFT JOIN ai_analysis_results aar ON u.id = aar.user_id
        LEFT JOIN user_work_status uws ON u.id = uws.user_id
        WHERE u.id = $1
      `, [userId]);

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const user = userResult.rows[0];

      // Separate job IDs by type (processed jobs are integers, recruiter jobs are UUIDs)
      const processedJobIds = jobIds.filter(id => !id.includes('-') && !isNaN(Number(id)));
      const recruiterJobIds = jobIds.filter(id => id.includes('-') || isNaN(Number(id)));
      
      console.log('🔍 Separated job IDs:', { processedJobIds, recruiterJobIds });

      // Get all jobs from both sources
      let processedJobsResult, recruiterJobsResult;
      
      if (processedJobIds.length > 0) {
        try {
          processedJobsResult = await client.query(`
            SELECT 
              pjr.id, pjr.job_title, pjr.job_description, pjr.requirements, 
              pjr.responsibilities, pjr.benefits, pjr.skills, pjr.experience_level,
              pjr.industry, pjr.department, pjr.work_arrangement, pjr.salary_min, pjr.salary_max,
              m.company as company_name, 'processed_job_requests' as source
            FROM processed_job_requests pjr
            LEFT JOIN members m ON pjr.company_id = m.company_id
            WHERE pjr.id = ANY($1)
          `, [processedJobIds]);
        } catch (error) {
          console.error('Error fetching processed jobs:', error);
          processedJobsResult = { rows: [] };
        }
      } else {
        processedJobsResult = { rows: [] };
      }

      if (recruiterJobIds.length > 0) {
        try {
          recruiterJobsResult = await client.query(`
            SELECT 
              rj.id, rj.job_title, rj.job_description, rj.requirements, 
              rj.responsibilities, rj.benefits, rj.skills, rj.experience_level,
              rj.industry, rj.department, rj.work_arrangement, rj.salary_min, rj.salary_max,
              COALESCE(rj.company_id, u.company) as company_name, 'recruiter_jobs' as source
            FROM recruiter_jobs rj
            LEFT JOIN users u ON u.id = rj.recruiter_id
            WHERE rj.id = ANY($1)
          `, [recruiterJobIds]);
        } catch (error) {
          console.error('Error fetching recruiter jobs:', error);
          recruiterJobsResult = { rows: [] };
        }
      } else {
        recruiterJobsResult = { rows: [] };
      }

      // Combine results from both sources
      const jobResult = {
        rows: [...processedJobsResult.rows, ...recruiterJobsResult.rows]
      };

      const jobs = jobResult.rows;
      console.log('🔍 Batch match - Found jobs:', jobs.length);
      console.log('🔍 Batch match - Job sources:', jobs.map(j => ({ id: j.id, source: j.source, title: j.job_title })));

      // Check cache for all jobs at once (24 hours cache)
      const cachedResults = await client.query(`
        SELECT job_id, score, reasoning, breakdown, analyzed_at
        FROM job_match_results 
        WHERE user_id = $1 AND job_id = ANY($2)
        AND analyzed_at > NOW() - INTERVAL '24 hours'
      `, [userId, jobIds]);

      const cachedMap = new Map();
      cachedResults.rows.forEach(row => {
        cachedMap.set(row.job_id, {
          score: row.score,
          reasoning: row.reasoning,
          breakdown: typeof row.breakdown === 'string' ? JSON.parse(row.breakdown) : row.breakdown
        });
      });

      // Process only non-cached jobs
      const uncachedJobs = jobs.filter(job => !cachedMap.has(job.id));
      const results = {};

      // Add cached results
      cachedMap.forEach((value, jobId) => {
        results[jobId] = { ...value, cached: true };
      });

      // Process uncached jobs in parallel
      if (uncachedJobs.length > 0) {
        console.log(`Processing ${uncachedJobs.length} uncached jobs in parallel`);
        
        const analysisPromises = uncachedJobs.map(async (job) => {
          // Calculate distance from user to office (Clark, Pampanga)
          const officeLat = 15.175949880147643;
          const officeLng = 120.53233701473826;
          let distanceKm = null;
          let distanceDescription = 'Location not available';
          
          if (user.location_lat && user.location_lng) {
            distanceKm = calculateDistance(user.location_lat, user.location_lng, officeLat, officeLng);
            if (distanceKm <= 5) {
              distanceDescription = 'Very close to office (< 5km)';
            } else if (distanceKm <= 15) {
              distanceDescription = 'Close to office (5-15km)';
            } else if (distanceKm <= 30) {
              distanceDescription = 'Moderate distance (15-30km)';
            } else if (distanceKm <= 50) {
              distanceDescription = 'Far from office (30-50km)';
            } else {
              distanceDescription = 'Very far from office (> 50km)';
            }
          }

          // Prepare data for Anthropic analysis
          const analysisData = {
            user: {
              name: user.full_name,
              location: user.location,
              locationDetails: {
                city: user.location_city,
                province: user.location_province,
                barangay: user.location_barangay,
                region: user.location_region,
                distanceKm: distanceKm,
                distanceDescription: distanceDescription
              },
              currentPosition: user.position,
              bio: user.bio,
              resumeData: user.resume_data,
              skills: user.skills_snapshot || [],
              experience: user.experience_snapshot || [],
              education: user.education_snapshot || [],
              workStatus: {
                currentEmployer: user.current_employer,
                currentPosition: user.current_position,
                currentSalary: user.current_salary,
                expectedSalary: user.expected_salary,
                workStatus: user.work_status,
                preferredShift: user.preferred_shift,
                workSetup: user.work_setup
              }
            },
            job: {
              title: job.job_title,
              description: job.job_description,
              requirements: job.requirements || [],
              responsibilities: job.responsibilities || [],
              benefits: job.benefits || [],
              skills: job.skills || [],
              experienceLevel: job.experience_level,
              industry: job.industry,
              department: job.department,
              workArrangement: job.work_arrangement,
              salaryRange: `${job.salary_min || 0} - ${job.salary_max || 0}`,
              company: job.company_name
            }
          };

          return analyzeJobMatchWithAI(analysisData).then(matchScore => ({
            jobId: job.id,
            score: Math.round(matchScore.score ?? 0),
            reasoning: matchScore.reasoning ?? '',
            breakdown: matchScore.breakdown ?? {},
            cached: false
          })).catch(error => {
            console.error(`Error analyzing job ${job.id}:`, error);
            // Return failure indicator for this specific job
            return {
              jobId: job.id,
              score: null,
              reasoning: 'Failed to analyze - AI analysis unavailable',
              breakdown: {},
              cached: false,
              failed: true,
              error: true
            };
          });
        });

        const analysisResults = await Promise.all(analysisPromises);

        // Cache the new results (only cache successful analyses)
        for (const result of analysisResults) {
          if (result.score !== null && !result.failed) {
            await client.query(`
              INSERT INTO job_match_results (user_id, job_id, score, reasoning, breakdown, analyzed_at)
              VALUES ($1, $2, $3, $4, $5, NOW())
              ON CONFLICT (user_id, job_id)
              DO UPDATE SET score = EXCLUDED.score, reasoning = EXCLUDED.reasoning, breakdown = EXCLUDED.breakdown, analyzed_at = NOW()
            `, [userId, result.jobId, result.score, result.reasoning, JSON.stringify(result.breakdown)]);
          }

          results[result.jobId] = result;
        }
      }

      return NextResponse.json({ 
        results,
        cached: cachedMap.size,
        analyzed: uncachedJobs.length,
        total: jobIds.length
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in batch job matching:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ 
      error: 'Failed to analyze job matches',
      details: error.message 
    }, { status: 500 });
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Reuse the existing analyzeJobMatchWithAI function
async function analyzeJobMatchWithAI(data: any) {
  try {
    // Check if API key is available
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('CLAUDE_API_KEY not found in environment variables');
      throw new Error('API key not configured');
    }

    // Clean and prepare data for analysis - handle different data types safely
    const cleanUserSkills = Array.isArray(data.user.skills) ? data.user.skills.filter((s: any) => s && typeof s === 'string' && s.trim()) : [];
    const cleanUserExperience = Array.isArray(data.user.experience) ? data.user.experience.filter((e: any) => e && typeof e === 'string' && e.trim()) : [];
    const cleanUserEducation = Array.isArray(data.user.education) ? data.user.education.filter((ed: any) => ed && typeof ed === 'string' && ed.trim()) : [];
    
    const cleanJobRequirements = Array.isArray(data.job.requirements) ? data.job.requirements.filter((r: any) => r && typeof r === 'string' && r.trim()) : [];
    const cleanJobResponsibilities = Array.isArray(data.job.responsibilities) ? data.job.responsibilities.filter((r: any) => r && typeof r === 'string' && r.trim()) : [];
    const cleanJobBenefits = Array.isArray(data.job.benefits) ? data.job.benefits.filter((b: any) => b && typeof b === 'string' && b.trim()) : [];
    const cleanJobSkills = Array.isArray(data.job.skills) ? data.job.skills.filter((s: any) => s && typeof s === 'string' && s.trim()) : [];

    const prompt = `You are an expert HR professional and career counselor. Analyze the match between a job candidate and a job posting.

CANDIDATE PROFILE:
- Name: ${data.user.name}
- Location: ${data.user.location} (${data.user.locationDetails?.distanceDescription || 'Location not available'})
- Current Position: ${data.user.currentPosition || 'Not specified'}
- Bio: ${data.user.bio || 'No bio provided'}
- Skills: ${cleanUserSkills.join(', ') || 'No skills listed'}
- Experience: ${cleanUserExperience.join(', ') || 'No experience listed'}
- Education: ${cleanUserEducation.join(', ') || 'No education listed'}
- Work Status: ${data.user.workStatus?.workStatus || 'Not specified'}
- Current Employer: ${data.user.workStatus?.currentEmployer || 'Not specified'}
- Expected Salary: ${data.user.workStatus?.expectedSalary || 'Not specified'}
- Preferred Shift: ${data.user.workStatus?.preferredShift || 'Not specified'}
- Work Setup Preference: ${data.user.workStatus?.workSetup || 'Not specified'}

JOB POSTING:
- Title: ${data.job.title}
- Company: ${data.job.company || 'Company not specified'}
- Description: ${data.job.description || 'No description provided'}
- Requirements: ${cleanJobRequirements.join(', ') || 'No requirements listed'}
- Responsibilities: ${cleanJobResponsibilities.join(', ') || 'No responsibilities listed'}
- Benefits: ${cleanJobBenefits.join(', ') || 'No benefits listed'}
- Required Skills: ${cleanJobSkills.join(', ') || 'No skills listed'}
- Experience Level: ${data.job.experienceLevel || 'Not specified'}
- Industry: ${data.job.industry || 'Not specified'}
- Department: ${data.job.department || 'Not specified'}
- Work Arrangement: ${data.job.workArrangement || 'Not specified'}
- Salary Range: ${data.job.salaryRange || 'Not specified'}

Analyze the compatibility between this candidate and job posting. Consider:

PRIMARY FACTORS (Critical):
- Skills Match: How well do the candidate's skills align with job requirements?
- Experience Match: Does the candidate's experience match the required level?
- Career Progression: Does this role advance the candidate's career?
- Salary Alignment: Is the salary range appropriate for the candidate's expectations?

SECONDARY FACTORS (Important):
- Work Setup Match: Does the work arrangement (remote/hybrid/onsite) align with preferences?
- Location Compatibility: How does the distance/commute factor in?
- Industry Alignment: Does the candidate's background fit the industry?

TERTIARY FACTORS (Nice-to-have):
- Shift Preference: Does the shift preference align?
- Cultural Fit: Based on the job description and company, would this be a good cultural fit?

Return your analysis as a JSON object with this exact structure:
{
  "reasoning": "• Strong match on technical skills - you have React, Node.js, and TypeScript experience which are exactly what they need\\n• Good experience level match - you have 3+ years of experience and they're looking for mid-level\\n• Perfect match on work setup - you want hybrid and they offer exactly that",
  "breakdown": {
    "skillsMatch": 90,
    "experienceMatch": 85,
    "careerMatch": 88,
    "salaryMatch": 85,
    "workSetupMatch": 90,
    "locationMatch": 80,
    "industryMatch": 75,
    "shiftMatch": 85,
    "culturalMatch": 85
  },
  "weightedScore": 86.1
}

The score should be 0-100 where:
- 95-100: Perfect match, highly recommended
- 85-94: Excellent match, strongly recommended  
- 75-84: Very good match, recommended
- 65-74: Good match, worth considering
- 55-64: Fair match, some concerns
- 45-54: Poor match, not recommended
- Below 45: Not suitable, avoid

IMPORTANT: Write the reasoning as conversational bullet points that speak directly to the candidate. Keep it friendly and encouraging while highlighting key strengths and any concerns. Use bullet points (•) and mention specific details like skills, distance, salary, and work preferences. Make it feel like you're giving personalized career advice.

SCORING GUIDELINES:
- 95-100: Perfect alignment across PRIMARY factors (skills, experience, career, salary) with strong secondary factors
- 85-94: Strong alignment in PRIMARY factors with minor concerns in secondary factors
- 75-84: Good alignment in PRIMARY factors but some areas in secondary/tertiary factors need improvement
- 65-74: Decent PRIMARY factor alignment but several secondary factors need attention
- 55-64: Fair PRIMARY factor alignment with significant concerns in secondary factors
- 45-54: Poor PRIMARY factor alignment with major issues across multiple factors
- Below 45: Major misalignment in PRIMARY factors - not suitable

**WEIGHTING PRIORITY:**
- PRIMARY factors (Skills, Experience, Career Progression, Salary) are CRITICAL - poor scores here significantly impact overall match
- SECONDARY factors (Work Setup, Location, Industry) are IMPORTANT but can be compensated by strong primary factors
- TERTIARY factors (Shift, Cultural) are NICE-TO-HAVE and have minimal impact on overall score

**APPLICATION THRESHOLD:** Only jobs with 65% or higher match scores should be recommended for application.

**IMPORTANT:** Always calculate the weighted score using the provided formula and use that as the final score.`;

    console.log('Calling Anthropic API for batch analysis');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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
      console.error('Anthropic API error:', response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Anthropic API response received');
    
    const content = result.content[0].text;
    console.log('AI response content:', content);
    
    // Extract JSON from the response with better error handling
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        // Clean the JSON string by removing control characters and fixing common issues
        let jsonStr = jsonMatch[0]
          .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
          .replace(/\n/g, ' ') // Replace newlines with spaces
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();

        // Try to fix common JSON issues
        jsonStr = jsonStr
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes around unquoted keys
          .replace(/:\s*([^",{\[\s][^,}]*?)(\s*[,}])/g, ': "$1"$2'); // Add quotes around unquoted string values

        const parsed = JSON.parse(jsonStr);
        
        // Validate the response structure
        if (typeof parsed.score !== 'undefined') {
          parsed.weightedScore = parsed.score;
        }
        
        if (!parsed.weightedScore && parsed.breakdown) {
          // Calculate weighted score if not provided
          const weights = {
            skillsMatch: 0.25,
            experienceMatch: 0.20,
            careerMatch: 0.20,
            salaryMatch: 0.15,
            workSetupMatch: 0.10,
            locationMatch: 0.05,
            industryMatch: 0.03,
            shiftMatch: 0.01,
            culturalMatch: 0.01
          };
          
          let weightedSum = 0;
          let totalWeight = 0;
          
          for (const [key, value] of Object.entries(parsed.breakdown)) {
            if (weights[key as keyof typeof weights]) {
              weightedSum += (value as number) * weights[key as keyof typeof weights];
              totalWeight += weights[key as keyof typeof weights];
            }
          }
          
          parsed.weightedScore = totalWeight > 0 ? weightedSum / totalWeight : 75;
        }

        return {
          score: parsed.weightedScore || parsed.score || 75,
          reasoning: parsed.reasoning || 'Analysis completed',
          breakdown: parsed.breakdown || {}
        };
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', content);
        console.error('Cleaned JSON string:', jsonStr);
        
        // Try to extract a score from the content even if JSON parsing fails
        const scoreMatch = content.match(/(?:score|match|rating)[:\s]*(\d+)/i);
        const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : null;
        
        if (extractedScore !== null) {
          console.log('Extracted fallback score:', extractedScore);
          
          return {
            score: Math.min(100, Math.max(0, extractedScore)),
            reasoning: 'Analysis completed with extracted scoring',
            breakdown: {
              skillsMatch: extractedScore,
              experienceMatch: extractedScore,
              careerMatch: extractedScore,
              salaryMatch: extractedScore,
              workSetupMatch: extractedScore,
              locationMatch: extractedScore,
              industryMatch: extractedScore,
              shiftMatch: extractedScore,
              culturalMatch: extractedScore
            }
          };
        } else {
          console.log('No score found in content, marking as failed');
          
          return {
            score: null,
            reasoning: 'Failed to analyze - Unable to parse AI response',
            breakdown: {},
            failed: true,
            error: true
          };
        }
      }
    } else {
      console.error('No JSON found in response');
      console.error('Raw content:', content);
      
      // Try to extract a score from the content even if no JSON is found
      const scoreMatch = content.match(/(?:score|match|rating)[:\s]*(\d+)/i);
      const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : null;
      
      if (extractedScore !== null) {
        console.log('Extracted fallback score from non-JSON content:', extractedScore);
        
        return {
          score: Math.min(100, Math.max(0, extractedScore)),
          reasoning: 'Analysis completed with extracted scoring (no JSON found)',
          breakdown: {
            skillsMatch: extractedScore,
            experienceMatch: extractedScore,
            careerMatch: extractedScore,
            salaryMatch: extractedScore,
            workSetupMatch: extractedScore,
            locationMatch: extractedScore,
            industryMatch: extractedScore,
            shiftMatch: extractedScore,
            culturalMatch: extractedScore
          }
        };
      } else {
        console.log('No score found in non-JSON content, marking as failed');
        
        return {
          score: null,
          reasoning: 'Failed to analyze - No valid response format found',
          breakdown: {},
          failed: true,
          error: true
        };
      }
    }
  } catch (error) {
    console.error('Error in analyzeJobMatchWithAI:', error);
    throw error;
  }
}
