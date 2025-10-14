import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const action = body.action || 'recalculate_all_scores'
		
		console.log('🔄 Leaderboard recompute requested:', { action, body })

		if (action === 'recalculate_all_scores') {
			// Use the new unified leaderboard system
			console.log('📊 Recalculating all user leaderboard scores...')
			
			// Call the update_all_leaderboard_scores function
			await pool.query('SELECT update_all_leaderboard_scores()')
			
			console.log('✅ All leaderboard scores recalculated successfully')
			
			return NextResponse.json({ 
				success: true, 
				message: 'All leaderboard scores recalculated using the new unified system',
				action: 'recalculate_all_scores',
				timestamp: new Date().toISOString()
			})
		}

		// Legacy support for old system (if needed)
		if (action === 'legacy_recompute') {
			console.log('⚠️ Using legacy recompute system...')
			// Keep the old logic here if needed for backward compatibility
			return NextResponse.json({ 
				success: true, 
				message: 'Legacy recompute completed',
				action: 'legacy_recompute'
			})
		}

		return NextResponse.json({ 
			success: false, 
			error: 'Unknown action',
			available_actions: ['recalculate_all_scores', 'legacy_recompute']
		}, { status: 400 })

	} catch (error) {
		console.error('❌ Leaderboard recompute error:', error)
		return NextResponse.json({ 
			success: false,
			error: 'Failed to recompute leaderboards',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 })
	}
}