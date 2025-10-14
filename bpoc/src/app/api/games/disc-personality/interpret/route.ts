import { NextRequest, NextResponse } from 'next/server'

// Placeholder endpoint to produce an AI interpretation object.
// Swap this with a real Anthropic Claude call server-side.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scores, primary } = body || {}

    const interpretation = {
      summary: `Primary style ${primary}. Balanced profile with D:${scores?.D}% I:${scores?.I}% S:${scores?.S}% C:${scores?.C}%.`,
      strengths: [
        primary === 'D' ? 'Takes initiative' : 'Builds relationships',
        'Learns quickly'
      ],
      risks: [primary === 'C' ? 'Over-analyzes under time pressure' : 'May skip details'],
      role_fit: [
        { role: 'Customer Support', fit: 78 },
        { role: 'Team Lead', fit: primary === 'D' ? 88 : 72 }
      ],
      coaching_tips: ['Clarify expectations up front', 'Use checklists for consistency'],
      confidence: 0.9
    }

    return NextResponse.json({ interpretation })
  } catch (e) {
    return NextResponse.json({ interpretation: null })
  }
}


