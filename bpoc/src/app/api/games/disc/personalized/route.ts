import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { isAssessment, prompt, discScores, responses, userId } = body || {}

    // Check for API key
    const apiKey = process.env.CLAUDE_API_KEY
    if (!apiKey) {
      console.warn('⚠️ CLAUDE_API_KEY not found, returning fallback responses')
      return getFallbackResponse(isAssessment, discScores, prompt)
    }

    if (isAssessment) {
      // Generate AI assessment using Claude
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        })

        if (response.ok) {
          const data = await response.json()
          const aiAssessment = data.content[0].text
          return NextResponse.json({ aiAssessment, generatedBy: 'claude-3.5-sonnet' })
        } else {
          console.error('Claude API error for assessment:', response.status)
          return getFallbackResponse(true, discScores, prompt)
        }
      } catch (error) {
        console.error('Error calling Claude for assessment:', error)
        return getFallbackResponse(true, discScores, prompt)
      }
    }

    // Fetch user data for personalization
    let user = null
    if (userId) {
      try {
        const userQuery = `
          SELECT id, email, first_name, last_name, location, position, bio, birthday
          FROM users 
          WHERE id = $1
        `
        const userResult = await pool.query(userQuery, [userId])
        if (userResult.rows.length > 0) {
          user = userResult.rows[0]
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    // Generate personalized questions using Claude
    try {
      // Calculate age from birthday if available
      let age = 25 // default
      if (user?.birthday) {
        const birthDate = new Date(user.birthday)
        const today = new Date()
        age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
      }

      // Create response analysis
      const responseAnalysis = responses ? responses.map((r: any, i: number) => 
        `Q${i+1}: Selected "${r.selectedChoice}" (${r.discType}) - Response time: ${r.responseTime}ms`
      ).join('\n') : 'No detailed responses available'

      // Calculate personality patterns by context
      const personalityPatterns: any = {}
      if (responses) {
        // Group responses by context and calculate DISC patterns
        responses.forEach((r: any) => {
          const context = r.context || 'UNKNOWN'
          if (!personalityPatterns[context]) {
            personalityPatterns[context] = { D: 0, I: 0, S: 0, C: 0, total: 0 }
          }
          personalityPatterns[context][r.discType]++
          personalityPatterns[context].total++
        })
      }

      // Safe scores calculation
      const safeScores = {
        D: discScores?.D || 0,
        I: discScores?.I || 0,
        S: discScores?.S || 0,
        C: discScores?.C || 0
      }

      const personalizedPrompt = `You are a Filipino psychology expert creating brutally honest personality assessment questions.

REAL USER PROFILE:
Name: ${user?.first_name || 'User'} ${user?.last_name || ''}
Age: ${age}
Location: ${user?.location || 'Metro Manila'}
Position: ${user?.position || 'Professional'}
Bio: ${user?.bio || 'No bio provided'}
Email: ${user?.email || 'No email provided'}

ACTUAL 30 RESPONSES ANALYSIS:
${responseAnalysis}

PERSONALITY PATTERNS BY CONTEXT:
${JSON.stringify(personalityPatterns, null, 2)}

CURRENT DISC SCORES AFTER 30 QUESTIONS:
D (Eagle): ${safeScores.D || 0} - ${Math.round(((safeScores.D || 0) / 30) * 100)}% dominance
I (Peacock): ${safeScores.I || 0} - ${Math.round(((safeScores.I || 0) / 30) * 100)}% influence  
S (Turtle): ${safeScores.S || 0} - ${Math.round(((safeScores.S || 0) / 30) * 100)}% steadiness
C (Owl): ${safeScores.C || 0} - ${Math.round(((safeScores.C || 0) / 30) * 100)}% conscientiousness

PERSONALITY CONFLICTS TO EXPLOIT:
Based on the actual responses, ${user?.first_name || 'this person'} shows conflicting patterns that need deeper testing.

Create 5 BRUTAL personalized questions that:
1. Use ${user?.first_name || 'the user'}'s exact name and situation
2. Reference their actual location (${user?.location || 'Metro Manila'})
3. Match their professional level (${user?.position || 'Professional'})
4. Force choices between their competing personality sides
5. Make it impossible to fake - reveal their TRUE authentic self

Each question MUST:
- Address ${user?.first_name || 'the user'} directly by name
- Reference their real location and work situation
- Create conflict between their different personality patterns
- Have consequences that reveal their deepest values
- Be authentically Filipino in context and language

Format as JSON array with 5 questions:
[
  {
    "id": 31,
    "context": "PERSONALIZED",
    "title": "Brutally honest title using ${user?.first_name || 'User'}'s name",
    "scenario": "Specific situation with ${user?.first_name || 'User'}'s exact context in ${user?.location || 'Metro Manila'}, addressing them directly",
    "options": [
      {"id": "A", "disc": "D", "animal": "🦅 ACTION NAME", "text": "What ${user?.first_name || 'User'} would do", "reaction": "Real outcome for ${user?.first_name || 'User'}"},
      {"id": "B", "disc": "I", "animal": "🦚 SOCIAL NAME", "text": "Alternative for ${user?.first_name || 'User'}", "reaction": "Different result"},
      {"id": "C", "disc": "S", "animal": "🐢 STEADY NAME", "text": "Safe option for ${user?.first_name || 'User'}", "reaction": "Stable outcome"},
      {"id": "D", "disc": "C", "animal": "🦉 WISE NAME", "text": "Logical approach for ${user?.first_name || 'User'}", "reaction": "Analytical result"}
    ]
  }
]

Make it PERSONAL. Use ${user?.first_name || 'User'}'s name throughout. Make it impossible to game.`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 3000,
          messages: [{
            role: 'user',
            content: personalizedPrompt
          }]
        })
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.content[0].text
        
        // Extract JSON from Claude's response
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          try {
            const personalizedQuestions = JSON.parse(jsonMatch[0])
            console.log(`✅ Generated ${personalizedQuestions.length} personalized questions via Claude`)
            return NextResponse.json({ personalizedQuestions })
          } catch (parseError) {
            console.error('Error parsing Claude JSON:', parseError)
            return getFallbackResponse(false, discScores)
          }
        } else {
          console.error('No JSON found in Claude response')
          return getFallbackResponse(false, discScores)
        }
      } else {
        console.error('Claude API error for personalized questions:', response.status)
        return getFallbackResponse(false, discScores)
      }
    } catch (error) {
      console.error('Error calling Claude for personalized questions:', error)
      return getFallbackResponse(false, discScores)
    }

  } catch (error) {
    console.error('Error in personalized API:', error)
    return NextResponse.json({ personalizedQuestions: [] })
  }
}

// Fallback function for when Claude API is unavailable
function getFallbackResponse(isAssessment: boolean, discScores?: any, prompt?: string) {
  if (isAssessment) {
    const primary = discScores ? Object.entries(discScores).sort(([,a],[,b]) => (b as number) - (a as number))[0]?.[0] : 'D'
    const text = prompt || `Your profile suggests a primary ${primary} type with strong potential in Filipino BPO roles. This assessment was generated without AI due to API limitations.`
    return NextResponse.json({ aiAssessment: text, generatedBy: 'fallback' })
  }

  // Fallback personalized questions
  const baseId = 31
  const makeOption = (id: string, disc: 'D'|'I'|'S'|'C', text: string, reaction: string) => ({ 
    id, disc, animal: disc === 'D' ? '🦅 LEADER' : disc === 'I' ? '🦚 CONNECTOR' : disc === 'S' ? '🐢 SUPPORTER' : '🦉 ANALYST', text, reaction 
  })

  const questions = Array.from({ length: 5 }).map((_, idx) => ({
    id: baseId + idx,
    context: 'PERSONALIZED',
    title: `Personal Challenge ${idx + 1}`,
    scenario: 'Based on your earlier choices, how would you respond in this situation?',
    options: [
      makeOption('A', 'D', 'Take charge and set the direction for everyone', 'You lead decisively and inspire confidence'),
      makeOption('B', 'I', 'Bring people together and energize the team', 'Your positivity creates momentum'),
      makeOption('C', 'S', 'Support steadily and keep things calm', 'Your consistency grounds the group'),
      makeOption('D', 'C', 'Analyze carefully and design a solid plan', 'Your clarity improves quality for all'),
    ],
  }))

  return NextResponse.json({ personalizedQuestions: questions })
}


