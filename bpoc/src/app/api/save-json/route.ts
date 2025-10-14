import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { jsonData, fileName } = await request.json()
    
    if (!jsonData || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: jsonData and fileName' },
        { status: 400 }
      )
    }

    // Create a unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const baseFileName = fileName.replace(/\.[^/.]+$/, '') // Remove extension
    const jsonFileName = `${baseFileName}_${timestamp}.json`
    
    // Ensure the directory exists
    const publicDir = path.join(process.cwd(), 'public', 'extracted-json')
    await fs.mkdir(publicDir, { recursive: true })
    
    // Save the JSON file
    const filePath = path.join(publicDir, jsonFileName)
    const jsonString = JSON.stringify(jsonData, null, 2)
    await fs.writeFile(filePath, jsonString, 'utf8')
    
    console.log(`💾 JSON file saved to server: ${jsonFileName}`)
    console.log(`📁 File path: ${filePath}`)
    
    return NextResponse.json({
      success: true,
      fileName: jsonFileName,
      filePath: `/extracted-json/${jsonFileName}`,
      message: 'JSON file saved successfully'
    })
    
  } catch (error) {
    console.error('❌ Error saving JSON file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save JSON file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 