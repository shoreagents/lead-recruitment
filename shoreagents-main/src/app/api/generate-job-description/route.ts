import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { teamSize, roleType, roles, experience, industry, budget } = await request.json()

    console.log('🔍 Generating job description for:', { teamSize, roleType, roles, experience, industry, budget })

    // Create a more dynamic and personalized job description
    const teamSizeText = parseInt(teamSize) === 1 ? 'a talented professional' : `${teamSize} skilled professionals`
    const rolesText = roles && roles !== 'undefined' ? roles : 'various professional roles'
    const roleText = roleType === 'same' ? `all specializing in ${rolesText}` : `covering various roles including ${rolesText}`
    
    // Experience level descriptions
    const experienceDescriptions = {
      'entry': {
        title: 'Entry Level',
        years: '0-2 years',
        skills: 'basic knowledge and eagerness to learn',
        responsibilities: 'supporting senior team members and learning industry best practices'
      },
      'mid': {
        title: 'Mid Level',
        years: '3-5 years',
        skills: 'solid experience and proven track record',
        responsibilities: 'leading projects and mentoring junior team members'
      },
      'senior': {
        title: 'Senior Level',
        years: '6+ years',
        skills: 'extensive expertise and leadership capabilities',
        responsibilities: 'strategic planning and driving innovation'
      },
      'mixed': {
        title: 'Mixed Experience',
        years: 'various levels',
        skills: 'diverse skill sets and experience levels',
        responsibilities: 'collaborative team environment with growth opportunities'
      }
    }

    const expInfo = experienceDescriptions[experience] || experienceDescriptions['mid']
    
    // Clean and validate industry
    const cleanIndustry = industry && industry !== 'undefined' ? industry : 'professional services'
    
    // Industry-specific requirements
    const industryRequirements = {
      'Technology': 'proficiency in modern development tools and agile methodologies',
      'Healthcare': 'understanding of healthcare regulations and patient data privacy',
      'Finance': 'knowledge of financial regulations and risk management',
      'Real Estate': 'experience with property management and client relations',
      'Construction': 'understanding of project management and safety protocols',
      'Engineering': 'technical expertise and problem-solving abilities',
      'Marketing': 'digital marketing expertise and brand management skills',
      'Customer Service': 'excellent communication and problem-solving abilities',
      'Sales': 'proven track record in client acquisition and relationship management'
    }

    const industryReq = industryRequirements[cleanIndustry] || `relevant experience in the ${cleanIndustry} industry`

    // Generate dynamic job description
    let description = `We are looking for ${teamSizeText} to join our dynamic offshore team, ${roleText}. 

**Position Overview:**
This is a ${expInfo.title} position (${expInfo.years} of experience) in the ${cleanIndustry} industry. We need someone with ${expInfo.skills} who can contribute to ${expInfo.responsibilities}.

**Key Responsibilities:**
• Deliver high-quality work within project timelines
• Collaborate effectively with international team members
• Maintain clear communication with stakeholders
• Continuously improve processes and outcomes
• ${expInfo.title === 'Senior Level' ? 'Mentor junior team members and drive strategic initiatives' : 'Support team objectives and contribute to project success'}

**Required Skills & Qualifications:**
• ${expInfo.years} of relevant experience in ${rolesText}
• Strong English communication skills (written and verbal)
• ${industryReq}
• Proficiency in relevant tools and technologies
• Ability to work independently and as part of a team
• Strong problem-solving and analytical skills
• Commitment to quality and attention to detail

**Preferred Qualifications:**
• Previous offshore or remote work experience
• Experience working with international teams
• ${cleanIndustry !== 'professional services' ? `Specific knowledge of ${cleanIndustry} industry practices` : 'Cross-industry experience'}
• Project management or leadership experience
• Continuous learning mindset

**What We Offer:**
• Competitive compensation package
• Flexible working hours to accommodate time zone differences
• Professional development and training opportunities
• Exposure to international business practices
• Career advancement opportunities
• Collaborative and inclusive work environment
• Modern tools and technology support

**About the Role:**
This position offers the opportunity to work with a diverse, international team while contributing to meaningful projects. You'll be part of a growing organization that values innovation, collaboration, and professional growth. The role provides excellent learning opportunities and the chance to work with cutting-edge technologies and methodologies.

**Application Process:**
We're looking for candidates who are passionate about their work and eager to grow with our team. If you meet the qualifications and are excited about this opportunity, we'd love to hear from you.

This is an excellent opportunity for ${expInfo.title.toLowerCase()} professionals who want to advance their careers while working with a dynamic international team.`

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
