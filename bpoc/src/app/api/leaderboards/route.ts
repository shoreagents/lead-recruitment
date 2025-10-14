import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

type Category = 'overall' | 'typing-hero' | 'disc-personality' | 'profile' | 'resume' | 'applications'

function toInt(value: any, fallback: number): number {
	const n = Number(value)
	return Number.isFinite(n) ? n : fallback
}

async function getNewLeaderboard(
	category: Category,
	limit: number,
	offset: number,
	userIdForMe: string | null
) {
	let orderBy = 'overall_score DESC'
	let selectFields = `
		uls.user_id,
		uls.overall_score,
		uls.typing_hero_score,
		uls.disc_personality_score,
		uls.profile_completion_score,
		uls.resume_building_score,
		uls.application_activity_score,
		uls.tier,
		uls.rank_position,
		uls.metrics,
		uls.updated_at,
		uls.last_activity_at
	`

	// Customize query based on category
	switch (category) {
		case 'typing-hero':
			orderBy = 'typing_hero_score DESC, overall_score DESC'
			break
		case 'disc-personality':
			orderBy = 'disc_personality_score DESC, overall_score DESC'
			break
		case 'profile':
			orderBy = 'profile_completion_score DESC, overall_score DESC'
			break
		case 'resume':
			orderBy = 'resume_building_score DESC, overall_score DESC'
			break
		case 'applications':
			orderBy = 'application_activity_score DESC, overall_score DESC'
			break
		case 'overall':
		default:
			orderBy = 'overall_score DESC, rank_position ASC'
			break
	}

	// Get leaderboard data
	const res = await pool.query(`
		SELECT ${selectFields}
		FROM user_leaderboard_scores uls
		ORDER BY ${orderBy}
		LIMIT $1 OFFSET $2
	`, [limit, offset])

	// Get total count
	const countRes = await pool.query(`
		SELECT COUNT(*) AS c FROM user_leaderboard_scores
	`)

	// Get user info for the results
	const ids = res.rows.map((r: any) => r.user_id)
	let users: Record<string, { 
		full_name: string | null; 
		avatar_url: string | null; 
		slug: string | null;
		username: string | null;
	}> = {}
	
	if (ids.length > 0) {
		const ures = await pool.query(`
			SELECT id, full_name, avatar_url, slug, username 
			FROM users 
			WHERE id = ANY($1)
		`, [ids])
		users = Object.fromEntries(ures.rows.map((u: any) => [
			u.id, 
			{ 
				full_name: u.full_name, 
				avatar_url: u.avatar_url, 
				slug: u.slug,
				username: u.username
			}
		]))
	}

	// Get "me" data if userIdForMe provided
	let me: any = null
	if (userIdForMe) {
		const meRes = await pool.query(`
			SELECT ${selectFields}
			FROM user_leaderboard_scores uls
			WHERE user_id = $1
		`, [userIdForMe])
		
		if (meRes.rows.length > 0) {
			const meRow = meRes.rows[0]
			const meUser = users[userIdForMe] || null
			
			// Find rank by counting users with better scores
			let rankQuery = ''
			switch (category) {
				case 'typing-hero':
					rankQuery = `
						SELECT COUNT(*) + 1 as rank
						FROM user_leaderboard_scores 
						WHERE typing_hero_score > $1 
						OR (typing_hero_score = $1 AND overall_score > $2)
					`
					break
				case 'disc-personality':
					rankQuery = `
						SELECT COUNT(*) + 1 as rank
						FROM user_leaderboard_scores 
						WHERE disc_personality_score > $1 
						OR (disc_personality_score = $1 AND overall_score > $2)
					`
					break
				case 'profile':
					rankQuery = `
						SELECT COUNT(*) + 1 as rank
						FROM user_leaderboard_scores 
						WHERE profile_completion_score > $1 
						OR (profile_completion_score = $1 AND overall_score > $2)
					`
					break
				case 'resume':
					rankQuery = `
						SELECT COUNT(*) + 1 as rank
						FROM user_leaderboard_scores 
						WHERE resume_building_score > $1 
						OR (resume_building_score = $1 AND overall_score > $2)
					`
					break
				case 'applications':
					rankQuery = `
						SELECT COUNT(*) + 1 as rank
						FROM user_leaderboard_scores 
						WHERE application_activity_score > $1 
						OR (application_activity_score = $1 AND overall_score > $2)
					`
					break
				default:
					rankQuery = `
						SELECT COUNT(*) + 1 as rank
						FROM user_leaderboard_scores 
						WHERE overall_score > $1
					`
					break
			}
			
			const rankRes = await pool.query(rankQuery, [
				meRow.typing_hero_score || 0,
				meRow.overall_score || 0
			])
			
			me = {
				rank: Number(rankRes.rows[0]?.rank || 1),
				userId: meRow.user_id,
				score: getScoreForCategory(meRow, category),
				overall_score: meRow.overall_score,
				typing_hero_score: meRow.typing_hero_score,
				disc_personality_score: meRow.disc_personality_score,
				profile_completion_score: meRow.profile_completion_score,
				resume_building_score: meRow.resume_building_score,
				application_activity_score: meRow.application_activity_score,
				tier: meRow.tier,
				user: meUser
			}
		}
	}

	const total = Number(countRes.rows[0]?.c || 0)
	
	// Debug: Log sample scores
	if (res.rows.length > 0) {
		console.log('📊 Sample scores for category', category, ':')
		res.rows.slice(0, 3).forEach((r: any, i: number) => {
			console.log(`  ${i + 1}. User: ${r.user_id}`)
			console.log(`     Overall: ${r.overall_score}, Tier: ${r.tier}`)
			console.log(`     Typing: ${r.typing_hero_score}, DISC: ${r.disc_personality_score}`)
			console.log(`     Profile: ${r.profile_completion_score}, Resume: ${r.resume_building_score}`)
			console.log(`     Applications: ${r.application_activity_score}`)
		})
	}
	
	return {
		total,
		results: res.rows.map((r: any, i: number) => ({
			rank: offset + i + 1,
			userId: r.user_id,
			score: getScoreForCategory(r, category),
			overall_score: r.overall_score,
			typing_hero_score: r.typing_hero_score,
			disc_personality_score: r.disc_personality_score,
			profile_completion_score: r.profile_completion_score,
			resume_building_score: r.resume_building_score,
			application_activity_score: r.application_activity_score,
			tier: r.tier,
			rank_position: r.rank_position,
			metrics: r.metrics,
			updated_at: r.updated_at,
			last_activity_at: r.last_activity_at,
			user: users[r.user_id] || null,
		})),
		me,
	}
}

function getScoreForCategory(row: any, category: Category): number {
	switch (category) {
		case 'typing-hero':
			return row.typing_hero_score || 0
		case 'disc-personality':
			return row.disc_personality_score || 0
		case 'profile':
			return row.profile_completion_score || 0
		case 'resume':
			return row.resume_building_score || 0
		case 'applications':
			return row.application_activity_score || 0
		case 'overall':
		default:
			return row.overall_score || 0
	}
}

export async function GET(request: NextRequest) {
	try {
		const url = new URL(request.url)
		const category = (url.searchParams.get('category') || 'overall') as Category
		const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 50), 1), 100)
		const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0)
		const me = url.searchParams.get('me') || null

		console.log('🏆 New Leaderboard API called:', { category, limit, offset, me })

		// Debug: Check if table has data
		const debugRes = await pool.query('SELECT COUNT(*) as count FROM user_leaderboard_scores')
		console.log('📊 Total users in leaderboard:', debugRes.rows[0]?.count)
		
		if (Number(debugRes.rows[0]?.count) === 0) {
			console.log('⚠️ No data in user_leaderboard_scores table')
			return NextResponse.json({
				category,
				total: 0,
				results: [],
				me: null,
				system: 'new_unified',
				error: 'No data found. Please populate the leaderboard data first.',
				action: 'Use the "Populate Data" button or call /api/leaderboards/populate'
			})
		}

		const data = await getNewLeaderboard(category, limit, offset, me)
		
		return NextResponse.json({ 
			category, 
			...data,
			// Add metadata about the new system
			system: 'new_unified',
			description: 'Unified leaderboard system with 5 components: Typing Hero, DISC Personality, Profile Completion, Resume Building, and Applications'
		})
	} catch (error) {
		console.error('❌ New Leaderboards error:', error)
		return NextResponse.json({ 
			error: 'Failed to load leaderboard',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 })
	}
}