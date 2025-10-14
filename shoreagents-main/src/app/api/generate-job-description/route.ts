import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { teamSize, roleType, roles, experience, industry, budget } = await request.json()

    // Generate a comprehensive job description based on the form data
    let description = `We are seeking ${teamSize} ${roleType === 'same' ? 'team members' : 'professionals'} to join our offshore team.`

    if (roles) {
      if (roleType === 'same') {
        description += ` All positions are for ${roles}.`
      } else {
        description += ` The roles include: ${roles}.`
      }
    }

    if (experience) {
      const experienceText = {
        'entry': 'Entry level (0-2 years of experience)',
        'mid': 'Mid level (3-5 years of experience)', 
        'senior': 'Senior level (6+ years of experience)',
        'mixed': 'Mixed experience levels'
      }[experience] || experience;
      description += ` We are looking for ${experienceText} candidates.`
    }

    if (industry) {
      description += ` This position is in the ${industry} industry.`
    }

    if (budget) {
      description += ` We offer competitive compensation within the ${budget} range.`
    }

    // Add standard requirements
    description += ` 

Requirements:
• Strong communication skills in English
• Relevant experience in the field
• Ability to work in a remote/offshore environment
• Commitment to quality and deadlines
• Collaborative team player

Benefits:
• Competitive salary package
• Flexible working hours
• Professional development opportunities
• International team exposure
• Career growth potential

This is an excellent opportunity to work with a dynamic international team and gain valuable experience in a professional offshore environment.`

    return NextResponse.json({
      success: true,
      description: description.trim()
    })

  } catch (error) {
    console.error('Error generating job description:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate job description'
    }, { status: 500 })
  }
}
