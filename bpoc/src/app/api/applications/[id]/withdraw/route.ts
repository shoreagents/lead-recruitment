import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Check if the application exists and belongs to the user
      const checkResult = await client.query(
        'SELECT id, status FROM applications WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      const application = checkResult.rows[0];

      // Check if the application can be withdrawn
      if (application.status === 'withdrawn') {
        return NextResponse.json({ error: 'Application is already withdrawn' }, { status: 400 });
      }

      if (application.status === 'hired') {
        return NextResponse.json({ error: 'Cannot withdraw a hired application' }, { status: 400 });
      }

      if (application.status === 'rejected') {
        return NextResponse.json({ error: 'Cannot withdraw a rejected application' }, { status: 400 });
      }

      // Update the application status to withdrawn
      const updateResult = await client.query(
        'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
        ['withdrawn', id]
      );

      return NextResponse.json({
        message: 'Application withdrawn successfully',
        application: updateResult.rows[0]
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw application' },
      { status: 500 }
    );
  }
}
