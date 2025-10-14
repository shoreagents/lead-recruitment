import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

function generateResumeHtml(content: any, title: string): string {
  let html = `<div class="resume-content" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">`
  
  // Add title
  html += `<h1 style="color: #333; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px;">${title}</h1>`
  
  // Handle different content structures
  if (typeof content === 'object') {
    if (Array.isArray(content)) {
      // Handle array of sections
      content.forEach((section: any, index: number) => {
        if (section.title) {
          html += `<h2 style="color: #555; margin-top: 25px; margin-bottom: 15px; border-left: 4px solid #007bff; padding-left: 10px;">${section.title}</h2>`
        }
        if (section.content) {
          html += `<div style="margin-bottom: 15px; line-height: 1.6;">${section.content}</div>`
        }
        if (section.items && Array.isArray(section.items)) {
          section.items.forEach((item: any) => {
            html += `<div style="margin-bottom: 10px; padding-left: 20px;">`
            if (item.title) html += `<strong>${item.title}</strong><br>`
            if (item.description) html += `<span style="color: #666;">${item.description}</span>`
            html += `</div>`
          })
        }
      })
    } else {
      // Handle object with sections
      Object.keys(content).forEach((key) => {
        const section = content[key]
        if (section && typeof section === 'object') {
          html += `<h2 style="color: #555; margin-top: 25px; margin-bottom: 15px; border-left: 4px solid #007bff; padding-left: 10px;">${key.charAt(0).toUpperCase() + key.slice(1)}</h2>`
          
          if (section.content) {
            html += `<div style="margin-bottom: 15px; line-height: 1.6;">${section.content}</div>`
          }
          
          if (section.items && Array.isArray(section.items)) {
            section.items.forEach((item: any) => {
              html += `<div style="margin-bottom: 10px; padding-left: 20px;">`
              if (item.title) html += `<strong>${item.title}</strong><br>`
              if (item.description) html += `<span style="color: #666;">${item.description}</span>`
              html += `</div>`
            })
          }
        }
      })
    }
  } else if (typeof content === 'string') {
    html += `<div style="line-height: 1.6; white-space: pre-wrap;">${content}</div>`
  }
  
  html += `</div>`
  return html
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: Starting to fetch resume preview for ID:', params.id)
    
         // Query saved_resumes with user information
     const result = await pool.query(`
       SELECT 
         sr.id,
         sr.user_id,
         sr.resume_title,
         sr.resume_slug,
         sr.resume_data,
         sr.template_used,
         sr.view_count,
         sr.created_at,
         sr.updated_at,
         u.full_name as user_name,
         u.email as user_email
       FROM saved_resumes sr
       LEFT JOIN users u ON sr.user_id = u.id
       WHERE sr.id = $1
     `, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const resume = result.rows[0]
    console.log('API: Resume data found:', resume)

         // Fetch resume content from the slug URL
     let resumeHtml = 'No preview available'
     if (resume.resume_slug) {
       try {
         const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
         const resumeUrl = `${baseUrl}/${resume.resume_slug}`
         
         console.log('API: Fetching resume from URL:', resumeUrl)
         
                   const response = await fetch(resumeUrl)
          if (response.ok) {
            const htmlContent = await response.text()
            
            // Extract the main content from the HTML
            // Look for the resume content container - try multiple patterns
            let contentMatch = null
            
            // Try to find the main resume content area
            const patterns = [
              /<main[^>]*>([\s\S]*?)<\/main>/i,
              /<div[^>]*class="[^"]*resume[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
              /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
              /<div[^>]*id="[^"]*resume[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
              /<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i
            ]
            
            for (const pattern of patterns) {
              contentMatch = htmlContent.match(pattern)
              if (contentMatch) break
            }
            
            if (contentMatch) {
              // Clean up the extracted content
              let cleanContent = contentMatch[1]
              
              // Remove navigation, headers, and other UI elements
              cleanContent = cleanContent.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
              cleanContent = cleanContent.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
              cleanContent = cleanContent.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
              cleanContent = cleanContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              cleanContent = cleanContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              
              // Remove loading elements
              cleanContent = cleanContent.replace(/<div[^>]*class="[^"]*loading[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
              cleanContent = cleanContent.replace(/<div[^>]*class="[^"]*spinner[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
              
              // Remove any remaining UI elements that might interfere
              cleanContent = cleanContent.replace(/<div[^>]*class="[^"]*(nav|header|footer|sidebar)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
              
              resumeHtml = cleanContent
            } else {
              // Fallback: create a simple preview with the resume title
              resumeHtml = `<div class="resume-content" style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h1 style="color: #333; margin-bottom: 20px;">${resume.resume_title}</h1>
                <p style="color: #666;">Resume preview not available</p>
                <p style="margin-top: 20px;"><a href="${resumeUrl}" target="_blank" style="color: #007bff; text-decoration: none;">View full resume</a></p>
              </div>`
            }
         } else {
           resumeHtml = `<div class="resume-content">
             <h1>${resume.resume_title}</h1>
             <p>Resume not found. <a href="${resumeUrl}" target="_blank">Try viewing the full resume</a></p>
           </div>`
         }
       } catch (error) {
         console.error('Error fetching resume content:', error)
         resumeHtml = `<div class="resume-content">
           <h1>${resume.resume_title}</h1>
           <p style="color: red;">Error loading resume: ${error instanceof Error ? error.message : 'Unknown error'}</p>
           <p><a href="/${resume.resume_slug}" target="_blank">View full resume</a></p>
         </div>`
       }
     }

         const transformedResume = {
       id: resume.id,
       user_id: resume.user_id,
       resume_title: resume.resume_title || 'Untitled Resume',
       resume_slug: resume.resume_slug,
       template_used: resume.template_used || 'Default',
       view_count: resume.view_count || 0,
       created_at: resume.created_at,
       updated_at: resume.updated_at,
       user_name: resume.user_name || 'Unknown User',
       user_email: resume.user_email || 'No email',
       resume_html: resumeHtml,
       resume_data: resume.resume_data
     }

    return NextResponse.json({
      resume: transformedResume
    })

  } catch (error) {
    console.error('Error in resume preview API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
