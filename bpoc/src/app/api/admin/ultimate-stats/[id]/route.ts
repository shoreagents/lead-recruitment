import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete the ultimate stat
    const result = await pool.query(
      'DELETE FROM ultimate_stats WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Ultimate stat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Ultimate stat deleted successfully',
      deletedId: id
    })

  } catch (error) {
    console.error('Error deleting ultimate stat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
