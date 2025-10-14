// API Route for BPOC Data Sync
// ============================

import { NextRequest, NextResponse } from 'next/server'
import { bpocIntegration } from '@/lib/bpoc-integration'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'employees':
        const employeeResult = await bpocIntegration.syncBPOCEmployees()
        return NextResponse.json({
          success: true,
          action: 'employees',
          result: employeeResult
        })

      case 'analysis':
        const analysisResult = await bpocIntegration.syncAIAnalysis()
        return NextResponse.json({
          success: true,
          action: 'analysis',
          result: analysisResult
        })

      case 'test':
        const testResult = await bpocIntegration.testConnection()
        return NextResponse.json({
          success: testResult.success,
          action: 'test',
          result: testResult
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "employees", "analysis", or "test"'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('BPOC sync error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await bpocIntegration.testConnection()
    return NextResponse.json(result)
  } catch (error) {
    console.error('BPOC test error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
