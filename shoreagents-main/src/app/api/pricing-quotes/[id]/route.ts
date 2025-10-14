import { NextRequest, NextResponse } from 'next/server'
import { PricingQuoteService } from '@/lib/pricingQuoteService'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🗑️ DELETE request received')
    const { id: quoteId } = await params
    console.log('🗑️ Quote ID:', quoteId)
    
    if (!quoteId) {
      console.log('❌ No quote ID provided')
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    console.log('🗑️ Calling PricingQuoteService.deleteQuote...')
    const result = await PricingQuoteService.deleteQuote(quoteId)
    console.log('🗑️ Delete result:', result)
    
    if (result.success) {
      console.log('✅ Quote deleted successfully')
      return NextResponse.json(
        { message: 'Quote deleted successfully' },
        { status: 200 }
      )
    } else {
      console.log('❌ Delete failed:', result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to delete quote' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Error in DELETE API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params
    
    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    const result = await PricingQuoteService.getQuoteById(quoteId)
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 200 })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error fetching pricing quote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
