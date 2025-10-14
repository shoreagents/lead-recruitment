'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { generateInitials, generateFirstLetter } from '@/lib/utils';
import { 
  ArrowLeft,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Crown,
  Medal,
  Sparkles,
  Stars,
  Briefcase,
  RefreshCw,
  Award,
  Zap,
  Star
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const GAME_LABELS: Record<string, string> = {
  'typing-hero': 'Typing Hero',
  'bpoc-cultural': 'BPOC Cultural',
  'ultimate': 'Ultimate',
  'disc-personality': 'DISC Personality',
}

const GAME_EMOJI: Record<string, string> = {
  'typing-hero': '⌨️',
  'bpoc-cultural': '🌍',
  'ultimate': '🧭',
  'disc-personality': '🧠',
}

function getGameName(id: string): string {
  return GAME_LABELS[id] || id
}

function getGameEmoji(id: string): string {
  return GAME_EMOJI[id] || '🎮'
}

function getCategoryEmoji(c: string) {
  if (c === 'overall') return '🏆'
  if (c === 'game') return '🎮'
  if (c === 'applicants') return '📄'
  if (c === 'engagement') return '✨'
  if (c === 'top-resume') return '📝'
  if (c === 'top-typing-hero') return '⌨️'
  if (c === 'top-disc-players') return '🧠'
  return '⭐'
}

function getPeriodLabel(p: string) {
  if (p === 'weekly') return 'Weekly'
  if (p === 'monthly') return 'Monthly'
  return 'All‑time'
}

type Category = 'overall' | 'typing-hero' | 'disc-personality' | 'profile' | 'resume' | 'applications'
type Period = 'weekly' | 'monthly' | 'all'

interface UserInfo { full_name: string | null; avatar_url: string | null; slug: string | null }

interface GameResult { rank: number; userId: string; bestScore: number; plays: number; lastPlayed: string; user: UserInfo | null }
interface SimpleResult { rank: number; userId: string; score: number; user: UserInfo | null }
interface OverallResult extends SimpleResult { components?: { game_norm: number; applicant_norm: number; engagement_norm: number } }

export default function LeaderboardsPage() {
	const router = useRouter()
	const [category, setCategory] = useState<Category>('overall')
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(10)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [total, setTotal] = useState<number>(0)
	const [results, setResults] = useState<Array<GameResult | SimpleResult | OverallResult>>([])
	const [openUserId, setOpenUserId] = useState<string | null>(null)
	const [userBreakdown, setUserBreakdown] = useState<any | null>(null)
	const [userResumeSlug, setUserResumeSlug] = useState<string | null>(null)
	const [loadingBreakdown, setLoadingBreakdown] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [refreshNonce, setRefreshNonce] = useState(0)

	const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize])
	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	const pageItems = useMemo(() => {
		const items: (number | 'ellipsis')[] = []
		const maxToShow = 7
		if (totalPages <= maxToShow) {
			for (let i = 1; i <= totalPages; i++) items.push(i)
			return items
		}
		const add = (n: number) => { if (!items.includes(n)) items.push(n) }
		add(1)
		if (page > 3) items.push('ellipsis')
		for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i)
		if (page < totalPages - 2) items.push('ellipsis')
		add(totalPages)
		return items
	}, [page, totalPages])


	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				setError('')
				const params = new URLSearchParams()
				params.set('category', category)
				params.set('limit', String(pageSize))
				params.set('offset', String(offset))
				
				const res = await fetch(`/api/leaderboards?${params.toString()}`, { cache: 'no-store' })
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				const data = await res.json()
				setTotal(data.total || 0)
				setResults(data.results || [])
			} catch (e: any) {
				setError(e?.message || 'Failed to load leaderboards')
				setTotal(0)
				setResults([])
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [category, page, pageSize, offset, refreshNonce])

	useEffect(() => { setPage(1) }, [category])

	useEffect(() => {
		const load = async () => {
			if (!openUserId) return
			try {
				setLoadingBreakdown(true)
			const [bRes, rRes] = await Promise.all([
				fetch(`/api/leaderboards/user/${openUserId}`, { cache: 'no-store' }),
				fetch(`/api/users/${openUserId}/resume`, { cache: 'no-store' })
			])
				const b = bRes.ok ? await bRes.json() : null
				const r = rRes.ok ? await rRes.json() : null
				setUserBreakdown(b)
				setUserResumeSlug(r?.slug || null)
			} finally {
				setLoadingBreakdown(false)
			}
		}
		load()
	}, [openUserId, refreshNonce])

	const openUserModal = (userId: string) => setOpenUserId(userId)
	const closeUserModal = () => { setOpenUserId(null); setUserBreakdown(null); setUserResumeSlug(null) }

	const goToResume = async (e: React.MouseEvent, userId: string) => {
		e.stopPropagation()
		try {
			const res = await fetch(`/api/users/${userId}/resume`, { cache: 'no-store' })
			if (!res.ok) return
			const data = await res.json()
			if (data?.slug) router.push(`/${data.slug}`)
		} catch {}
	}

	const refreshLeaderboards = async () => {
		try {
			setRefreshing(true)
			// Trigger recalculation of all leaderboard scores
			await fetch('/api/leaderboards/recompute', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'recalculate_all_scores',
					description: 'Recalculate all user leaderboard scores using the new unified system'
				})
			})
			// Trigger main list and modal re-fetch
			setRefreshNonce(n => n + 1)
			if (openUserId) {
				try {
					const bRes = await fetch(`/api/leaderboards/user/${openUserId}`, { cache: 'no-store' })
					if (bRes.ok) setUserBreakdown(await bRes.json())
				} catch {}
			}
		} finally {
			setRefreshing(false)
		}
	}

	const RankBadge = ({ rank }: { rank: number }) => {
		if (rank === 1) return (
			<motion.div 
				initial={{ scale: 0.8, rotate: -10 }}
				animate={{ scale: 1, rotate: 0 }}
				whileHover={{ scale: 1.1, rotate: 5 }}
				className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-xl shadow-yellow-500/40 ring-3 ring-yellow-400/30"
			>
				<div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/30 to-transparent" />
				<Crown className="w-6 h-6 text-yellow-900 drop-shadow-sm" />
				<div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full flex items-center justify-center">
					<Sparkles className="w-2 h-2 text-yellow-800" />
				</div>
			</motion.div>
		)
		if (rank === 2) return (
			<motion.div 
				initial={{ scale: 0.8, rotate: 10 }}
				animate={{ scale: 1, rotate: 0 }}
				whileHover={{ scale: 1.1, rotate: -3 }}
				className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center shadow-xl shadow-gray-400/30 ring-3 ring-gray-300/40"
			>
				<div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100/40 to-transparent" />
				<Medal className="w-6 h-6 text-gray-700 drop-shadow-sm" />
				<div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-200 rounded-full flex items-center justify-center">
					<Star className="w-2 h-2 text-gray-600" />
				</div>
			</motion.div>
		)
		if (rank === 3) return (
			<motion.div 
				initial={{ scale: 0.8, rotate: -5 }}
				animate={{ scale: 1, rotate: 0 }}
				whileHover={{ scale: 1.1, rotate: 2 }}
				className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 via-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/30 ring-3 ring-orange-400/30"
			>
				<div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300/30 to-transparent" />
				<Award className="w-6 h-6 text-orange-100 drop-shadow-sm" />
				<div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center">
					<Zap className="w-2 h-2 text-orange-800" />
				</div>
			</motion.div>
		)
		return (
			<motion.div 
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				whileHover={{ scale: 1.05 }}
				className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 text-cyan-300 border-2 border-cyan-400/40 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyan-500/20 hover:border-cyan-400/60 transition-all duration-200"
			>
				#{rank}
			</motion.div>
		)
	}

	const Bar = ({ value, color }: { value: number; color: string }) => (
		<div className="h-2 w-full bg-white/10 rounded overflow-hidden">
			<div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, Math.round(value)))}%` }} />
		</div>
	)

	// Hide zero-value rows per category
	const filteredResults = useMemo(() => {
		if (!results || results.length === 0) return []
		// Filter out users with zero scores for all categories
		return (results as SimpleResult[]).filter(r => (r?.score ?? 0) > 0)
	}, [results, category])

	// Selected user for modal header
	const selectedUser = useMemo(() => {
		return (filteredResults as any[]).find((r: any) => r.userId === openUserId) || null
	}, [filteredResults, openUserId])

	const renderRankCell = (rank: number) => (
		<div className="flex items-center justify-center w-full h-full min-h-[60px]">
			<RankBadge rank={rank} />
		</div>
	)

	const renderUserCell = (row: any) => {
		const getSpecialBadge = (rank: number) => {
			if (rank === 1) return <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 border-yellow-400/50 font-bold">🥇 Champion</Badge>
			if (rank === 2) return <Badge className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 border-gray-300/50 font-semibold">🥈 2nd Place</Badge>
			if (rank === 3) return <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900 border-orange-400/50 font-semibold">🥉 3rd Place</Badge>
			return null
		}

		return (
			<div className="flex items-center gap-3 min-w-0">
				<div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${
					row.rank === 1 ? 'ring-3 ring-yellow-400/50' :
					row.rank === 2 ? 'ring-2 ring-gray-300/50' :
					row.rank === 3 ? 'ring-2 ring-orange-400/50' :
					'ring-2 ring-cyan-500/20'
				}`}>
					                {row.user?.avatar_url ? (
                  <img src={row.user.avatar_url} alt={row.user?.full_name || row.userId} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{generateFirstLetter(row.user?.full_name)}</span>
                  </div>
                )}
				</div>
				<div className="flex-1 min-w-0">
					<button onClick={(e) => goToResume(e, row.userId)} className={`text-left truncate hover:underline font-semibold ${
						row.rank === 1 ? 'text-yellow-300' :
						row.rank === 2 ? 'text-gray-200' :
						row.rank === 3 ? 'text-orange-300' :
						'text-cyan-300'
					}`}>
						{row.user?.full_name ? row.user.full_name.split(' ')[0] : row.userId}
					</button>
					{row.user?.slug && (
						<div className="text-xs text-gray-400 truncate">@{row.user.slug}</div>
					)}
					{getSpecialBadge(row.rank)}
				</div>
			</div>
		)
	}

	const renderRow = (row: any, index: number) => {
		const rank = row.rank
		const name = row.user?.full_name || row.userId
		const avatar = row.user?.avatar_url || ''
  return (
			<motion.div key={`${row.userId}-${rank}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * index }}>
				<Card className="glass-card border-white/10 hover:border-cyan-400/30 transition hover:translate-x-0.5 cursor-pointer" onClick={() => openUserModal(row.userId)}>
					<CardContent className="p-5">
						<div className="flex items-center gap-5">
							<RankBadge rank={rank} />
							<div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-cyan-500/20">
								                {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{generateFirstLetter(name)}</span>
                  </div>
                )}
      </div>
							<div className="flex-1 min-w-0">
								<div className="text-white font-semibold truncate flex items-center gap-2">
									<a
										href={userResumeSlug ? `/${userResumeSlug}` : '#'}
										onClick={(e) => { e.stopPropagation(); if (!userResumeSlug) { e.preventDefault() } }}
										className={`hover:underline ${userResumeSlug ? 'text-cyan-300' : 'text-white/80 cursor-not-allowed'}`}
									>
										{row.user?.full_name ? row.user.full_name.split(' ')[0] : row.userId}
									</a>
									{rank <= 3 && <Badge className="bg-cyan-500/20 border-cyan-400/30 text-cyan-300">Top {rank}</Badge>}
								</div>
								{row.user?.slug && (
									<div className="text-xs text-gray-400 truncate">@{row.user.slug}</div>
								)}
								<div className="text-xs text-gray-400 truncate">
									{category === 'overall' && `Overall: ${row.score}`}
									{category === 'typing-hero' && `Typing Hero: ${row.score}`}
									{category === 'disc-personality' && `DISC Personality: ${row.score}`}
									{category === 'profile' && `Profile Completion: ${row.score}`}
									{category === 'resume' && `Resume Building: ${row.score}`}
									{category === 'applications' && `Applications: ${row.score}`}
								</div>
								{/* Breakdown */}
								{category === 'overall' && (
									<div className="mt-2 space-y-2">
										<div className="flex items-center gap-2 text-[11px] text-gray-300">
											<span className="w-20">Typing Hero</span>
											<Bar value={row.typing_hero_score ?? 0} color="bg-cyan-500" />
											<span className="w-10 text-right">{Math.round(row.typing_hero_score ?? 0)}</span>
										</div>
										<div className="flex items-center gap-2 text-[11px] text-gray-300">
											<span className="w-20">DISC</span>
											<Bar value={row.disc_personality_score ?? 0} color="bg-purple-500" />
											<span className="w-10 text-right">{Math.round(row.disc_personality_score ?? 0)}</span>
										</div>
										<div className="flex items-center gap-2 text-[11px] text-gray-300">
											<span className="w-20">Profile</span>
											<Bar value={row.profile_completion_score ?? 0} color="bg-green-500" />
											<span className="w-10 text-right">{Math.round(row.profile_completion_score ?? 0)}</span>
										</div>
										<div className="flex items-center gap-2 text-[11px] text-gray-300">
											<span className="w-20">Resume</span>
											<Bar value={row.resume_building_score ?? 0} color="bg-orange-500" />
											<span className="w-10 text-right">{Math.round(row.resume_building_score ?? 0)}</span>
										</div>
										<div className="flex items-center gap-2 text-[11px] text-gray-300">
											<span className="w-20">Applications</span>
											<Bar value={row.application_activity_score ?? 0} color="bg-amber-500" />
											<span className="w-10 text-right">{Math.round(row.application_activity_score ?? 0)}</span>
										</div>
									</div>
								)}
                </div>
                  </div>
                </CardContent>
              </Card>
          </motion.div>
		)
	}

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
       <Header />
       <div className="pt-16 relative z-10">
         <div className="container max-w-7xl mx-auto px-4 py-8">
                       {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-xl shadow-yellow-500/30"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-200/40 to-transparent" />
                  <Trophy className="w-8 h-8 text-yellow-900 drop-shadow-lg" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-3 h-3 text-yellow-800" />
                  </motion.div>
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold text-white"
                  >
                                         Leaderboards
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-300"
                  >
                    Compete, improve, and rise to the top of our rankings
                  </motion.p>
                </div>

                                 </div>
             </motion.div>

          {/* Top 3 Podium */}
          {!loading && !error && filteredResults.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">🏆 Hall of Fame</h2>
                <p className="text-gray-400">Our top 3 champions leading the way!</p>
              </div>
              
              <div className="flex items-end justify-center gap-4 max-w-3xl mx-auto">
                {/* 2nd Place */}
                <motion.div
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="relative flex-1 max-w-xs"
                >
                  <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-t-lg p-4 h-32 flex flex-col items-center justify-center shadow-xl">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 ring-4 ring-gray-300/50 mb-2">
                      {filteredResults[1]?.user?.avatar_url ? (
                        <img src={filteredResults[1].user.avatar_url} alt={filteredResults[1].user?.full_name || filteredResults[1].userId} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{generateFirstLetter(filteredResults[1]?.user?.full_name || null)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-800 font-bold text-sm text-center truncate w-full">{filteredResults[1]?.user?.full_name ? filteredResults[1].user.full_name.split(' ')[0] : filteredResults[1]?.userId}</div>
                    {filteredResults[1]?.user?.slug && (
                      <div className="text-gray-600 text-xs text-center truncate w-full">@{filteredResults[1].user.slug}</div>
                    )}
                  </div>
                  <div className="bg-gray-500 text-white text-center py-2 rounded-b-lg font-bold">
                    🥈 2nd Place
                  </div>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="relative flex-1 max-w-xs"
                >
                  <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-t-lg p-4 h-40 flex flex-col items-center justify-center shadow-2xl shadow-yellow-500/30 ring-4 ring-yellow-400/50">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                    >
                      <Crown className="w-8 h-8 text-yellow-800" />
                    </motion.div>
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-yellow-200/30 ring-4 ring-yellow-300/70 mb-2 mt-4">
                      {filteredResults[0]?.user?.avatar_url ? (
                        <img src={filteredResults[0].user.avatar_url} alt={filteredResults[0].user?.full_name || filteredResults[0].userId} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{generateFirstLetter(filteredResults[0]?.user?.full_name || null)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-yellow-900 font-bold text-sm text-center truncate w-full">{filteredResults[0]?.user?.full_name ? filteredResults[0].user.full_name.split(' ')[0] : filteredResults[0]?.userId}</div>
                    {filteredResults[0]?.user?.slug && (
                      <div className="text-yellow-700 text-xs text-center truncate w-full">@{filteredResults[0].user.slug}</div>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-yellow-900 text-center py-2 rounded-b-lg font-bold">
                    🥇 Champion
                  </div>
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="relative flex-1 max-w-xs"
                >
                  <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-t-lg p-4 h-28 flex flex-col items-center justify-center shadow-xl">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-200/30 ring-4 ring-orange-300/50 mb-2">
                      {filteredResults[2]?.user?.avatar_url ? (
                        <img src={filteredResults[2].user.avatar_url} alt={filteredResults[2].user?.full_name || filteredResults[2].userId} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{generateFirstLetter(filteredResults[2]?.user?.full_name || null)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-orange-900 font-bold text-sm text-center truncate w-full">{filteredResults[2]?.user?.full_name ? filteredResults[2].user.full_name.split(' ')[0] : filteredResults[2]?.userId}</div>
                    {filteredResults[2]?.user?.slug && (
                      <div className="text-orange-700 text-xs text-center truncate w-full">@{filteredResults[2].user.slug}</div>
                    )}
                  </div>
                  <div className="bg-orange-600 text-orange-100 text-center py-2 rounded-b-lg font-bold">
                    🥉 3rd Place
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Simple intro sentence */}
          <div className="mb-4 text-sm text-gray-300">
            Here are our top candidates — users ahead toward getting hired.
            </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger className="w-40 bg-white/10 border border-white/20 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-gray-700">
                    <SelectItem value="overall">🏆 Overall Score</SelectItem>
                    <SelectItem value="typing-hero">⌨️ Typing Hero</SelectItem>
                    <SelectItem value="disc-personality">🧠 DISC Personality</SelectItem>
                    <SelectItem value="profile">👤 Profile Completion</SelectItem>
                    <SelectItem value="resume">📄 Resume Building</SelectItem>
                    <SelectItem value="applications">💼 Applications</SelectItem>
                  </SelectContent>
                </Select>


                <Button onClick={refreshLeaderboards} disabled={refreshing} className="ml-auto bg-white/10 border border-white/20 hover:bg-white/20 text-white">
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing…' : 'Refresh'}
                </Button>
              </div>



              {/* Table container (table itself unchanged) */}
              <Card className="glass-card border-white/10 mb-4 flex-1 min-h-0">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px] text-gray-300 text-center">Rank</TableHead>
                        <TableHead className="text-gray-300">User</TableHead>
                        {category === 'overall' && (<> 
                          <TableHead className="text-right text-gray-300">Overall</TableHead>
                          <TableHead className="text-right text-gray-300">Typing Hero</TableHead>
                          <TableHead className="text-right text-gray-300">DISC</TableHead>
                          <TableHead className="text-right text-gray-300">Profile</TableHead>
                          <TableHead className="text-right text-gray-300">Resume</TableHead>
                          <TableHead className="text-right text-gray-300">Applications</TableHead>
                        </>)}
                        {category !== 'overall' && (
                          <TableHead className="text-right text-gray-300">Score</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading && (
                        <>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                              <TableCell colSpan={7}>
                                <div className="animate-pulse py-3">
                                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                                  <div className="h-3 bg-white/5 rounded w-2/3" />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                      {!loading && error && (
                        <TableRow><TableCell colSpan={7} className="text-red-400">{error}</TableCell></TableRow>
                      )}
                      {!loading && !error && filteredResults.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-gray-400">
                            No results found. Try refreshing or check if the leaderboard data has been populated.
                          </TableCell>
                        </TableRow>
                      )}
                      {!loading && !error && filteredResults.map((row: any) => {
                        const getRowStyling = (rank: number) => {
                          if (rank === 1) return "hover:bg-yellow-500/10 cursor-pointer border-b border-yellow-400/20 bg-gradient-to-r from-yellow-500/5 to-transparent"
                          if (rank === 2) return "hover:bg-gray-300/10 cursor-pointer border-b border-gray-300/20 bg-gradient-to-r from-gray-400/5 to-transparent"
                          if (rank === 3) return "hover:bg-orange-500/10 cursor-pointer border-b border-orange-400/20 bg-gradient-to-r from-orange-500/5 to-transparent"
                          return "hover:bg-white/5 cursor-pointer border-b border-white/10"
                        }
                        
                        return (
                          <motion.tr 
                            key={`${row.userId}-${row.rank}`} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * (row.rank - 1) }}
                            className={getRowStyling(row.rank)}
                            onClick={() => setOpenUserId(row.userId)}
                          >
                            <TableCell className="text-center">{renderRankCell(row.rank)}</TableCell>
                            <TableCell>{renderUserCell(row)}</TableCell>
                          {category === 'overall' && (<> 
                            <TableCell className="text-right">{row.score}</TableCell>
                            <TableCell className="text-right">{row.typing_hero_score || 0}</TableCell>
                            <TableCell className="text-right">{row.disc_personality_score || 0}</TableCell>
                            <TableCell className="text-right">{row.profile_completion_score || 0}</TableCell>
                            <TableCell className="text-right">{row.resume_building_score || 0}</TableCell>
                            <TableCell className="text-right">{row.application_activity_score || 0}</TableCell>
                          </>)}
                          {category !== 'overall' && (
                            <TableCell className="text-right">{row.score}</TableCell>
                          )}
                          </motion.tr>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {total > 0 && (
                    <div className="flex items-center justify-end gap-3 p-3 border-t border-white/10">
                      <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        {pageItems.map((it, idx) => (
                          typeof it === 'number' ? (
                            <Button key={idx} variant={it === page ? 'secondary' : 'outline'} size="sm" onClick={() => setPage(it)} className={`h-8 px-3 ${it === page ? 'bg-white/10 text-white' : 'text-gray-300 border-white/20 hover:bg-white/10'}`}>{it}</Button>
                          ) : (
                            <span key={idx} className="text-gray-400 px-2">…</span>
                          )
                        ))}
                      </div>
                      <div className="text-gray-300 text-sm px-3 py-1 rounded bg-white/5 border border-white/10">Page {page} of {totalPages}</div>
                      <Select value={String(pageSize)} onValueChange={(v: string) => { setPageSize(Number(v)); setPage(1) }}>
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Page size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 / page</SelectItem>
                          <SelectItem value="10">10 / page</SelectItem>
                          <SelectItem value="15">15 / page</SelectItem>
                          <SelectItem value="20">20 / page</SelectItem>
                          <SelectItem value="25">25 / page</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-white/10 flex flex-col h-[420px] lg:h-[520px]">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                    </span>
                    <span>How Scoring Works</span>
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Quick guide to how we compute ranks</p>
                </CardHeader>
                <CardContent className="space-y-6 text-xs text-gray-300 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400/30">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-white font-semibold"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> Overall Weights</div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-separate border-spacing-y-2">
                        <thead className="text-gray-400 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="text-left">Component</th>
                            <th className="text-left">How</th>
                            <th className="text-right">Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors">
                            <td className="px-3 py-2">Typing Hero</td>
                            <td className="px-3 py-2">Best WPM × Accuracy score</td>
                            <td className="px-3 py-2 text-right">25%</td>
                          </tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors">
                            <td className="px-3 py-2">DISC Personality</td>
                            <td className="px-3 py-2">Average of D, I, S, C scores</td>
                            <td className="px-3 py-2 text-right">25%</td>
                          </tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors">
                            <td className="px-3 py-2">Profile Completion</td>
                            <td className="px-3 py-2">Personal info completeness</td>
                            <td className="px-3 py-2 text-right">15%</td>
                          </tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors">
                            <td className="px-3 py-2">Resume Building</td>
                            <td className="px-3 py-2">Resume creation and quality</td>
                            <td className="px-3 py-2 text-right">20%</td>
                          </tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors">
                            <td className="px-3 py-2">Applications</td>
                            <td className="px-3 py-2">Job application activity</td>
                            <td className="px-3 py-2 text-right">15%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 px-3 py-2 rounded bg-white/10 border border-white/20 text-[11px] text-gray-400">
                      Overall Score = (Typing × 25%) + (DISC × 25%) + (Profile × 15%) + (Resume × 20%) + (Apps × 15%)
                    </p>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-white font-semibold"><span className="w-2 h-2 bg-purple-400 rounded-full" /> Component Scores</div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-separate border-spacing-y-2">
                        <thead className="text-gray-400 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="text-left">Component</th>
                            <th className="text-left">Score Formula</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">Typing Hero</td><td className="px-3 py-2">Best WPM × Accuracy score</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">DISC Personality</td><td className="px-3 py-2">Average of D, I, S, C scores</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">Profile Completion</td><td className="px-3 py-2">Personal info completeness %</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">Resume Building</td><td className="px-3 py-2">Resume creation and quality score</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">Applications</td><td className="px-3 py-2">Job application milestone points</td></tr>
                        </tbody>
                      </table>
                          </div>
                        </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-white font-semibold"><span className="w-2 h-2 bg-green-400 rounded-full" /> Application Milestones</div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-separate border-spacing-y-2">
                        <thead className="text-gray-400 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="text-left">Status</th>
                            <th className="text-right">Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">submitted</td><td className="px-3 py-2 text-right">5</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">qualified</td><td className="px-3 py-2 text-right">15</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">for verification</td><td className="px-3 py-2 text-right">20</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">verified</td><td className="px-3 py-2 text-right">25</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">initial interview</td><td className="px-3 py-2 text-right">35</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">final interview</td><td className="px-3 py-2 text-right">50</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">passed</td><td className="px-3 py-2 text-right">60</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">hired</td><td className="px-3 py-2 text-right">100</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 px-3 py-2 rounded bg-white/10 border border-white/20 text-[11px] text-gray-400">Highest status per job only. No double counting.</p>
                  </div>


                    <div>
                    <div className="mb-3 flex items-center gap-2 text-white font-semibold"><span className="w-2 h-2 bg-pink-400 rounded-full" /> Tier System</div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-separate border-spacing-y-2">
                        <thead className="text-gray-400 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="text-left">Tier</th>
                            <th className="text-left">Score Range</th>
                            <th className="text-left">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">💎 Diamond</td><td className="px-3 py-2">90-100</td><td className="px-3 py-2">Elite performers</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">🥈 Platinum</td><td className="px-3 py-2">75-89</td><td className="px-3 py-2">High achievers</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">🥇 Gold</td><td className="px-3 py-2">60-74</td><td className="px-3 py-2">Strong performers</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">🥉 Silver</td><td className="px-3 py-2">40-59</td><td className="px-3 py-2">Developing skills</td></tr>
                          <tr className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-3 py-2">🏅 Bronze</td><td className="px-3 py-2">0-39</td><td className="px-3 py-2">Getting started</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-1 text-[10px] text-gray-400">Tiers are based on your overall weighted score across all components.</p>
                      </div>
                    </CardContent>
                  </Card>

            </div>
            </div>

          {/* Breakdown Modal */}
          <Dialog open={!!openUserId} onOpenChange={(o) => { if (!o) { setOpenUserId(null); setUserBreakdown(null) } }}>
            <DialogContent className="bg-gray-900 border-white/10 text-white w-[98vw] max-w-none sm:max-w-[1600px] md:max-w-[1600px] lg:max-w-[1700px] xl:max-w-[1800px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden ring-2 ring-cyan-500/20">
                    {selectedUser?.user?.avatar_url ? (
                      <img src={selectedUser.user.avatar_url} alt={selectedUser.user?.full_name || selectedUser?.userId} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                        {generateInitials(selectedUser?.user?.full_name || null)}
                      </div>
                    )}
                  </div>
                  {selectedUser?.user?.full_name || selectedUser?.userId}
                  {selectedUser?.rank && (
                    <Badge className="bg-cyan-500/20 border-cyan-500/30 text-cyan-300">Rank #{selectedUser.rank}</Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-8">
                {loadingBreakdown && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                      <span className="text-cyan-400 font-medium">Loading user details...</span>
                    </div>
                  </div>
                )}
                {!loadingBreakdown && userBreakdown && (
                  <>
                    {/* Overall Score Hero Section */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 mb-4">
                            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-cyan-300 text-sm font-medium tracking-wider uppercase">Overall Performance</span>
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
                          </div>
                          <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            {userBreakdown.overall?.overall_score || 0}
                          </div>
                          <div className="inline-flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">🏆</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{userBreakdown.overall?.tier || 'Bronze'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Component Scores Grid */}
                    <div className="space-y-6">
                      {/* Top Row - 3 Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Typing Hero */}
                        <div className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">⚡</span>
                              </div>
                              <div>
                                <div className="text-blue-300 text-sm font-medium">Typing Hero</div>
                                <div className="text-2xl font-bold text-white">{userBreakdown.components?.typing_hero?.score || 0}</div>
                              </div>
                            </div>
                            <div className="w-full bg-blue-500/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((userBreakdown.components?.typing_hero?.score || 0), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* DISC Personality */}
                        <div className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">🧠</span>
                              </div>
                              <div>
                                <div className="text-purple-300 text-sm font-medium">DISC Personality</div>
                                <div className="text-2xl font-bold text-white">{userBreakdown.components?.disc_personality?.score || 0}</div>
                              </div>
                            </div>
                            <div className="w-full bg-purple-500/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((userBreakdown.components?.disc_personality?.score || 0), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Profile Completion */}
                        <div className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 group-hover:border-green-400/50 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">✅</span>
                              </div>
                              <div>
                                <div className="text-green-300 text-sm font-medium">Profile Completion</div>
                                <div className="text-2xl font-bold text-white">{userBreakdown.components?.profile_completion?.score || 0}</div>
                              </div>
                            </div>
                            <div className="w-full bg-green-500/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((userBreakdown.components?.profile_completion?.score || 0), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - 2 Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Resume Building */}
                        <div className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-orange-500/30 to-red-500/30 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 group-hover:border-orange-400/50 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">📄</span>
                              </div>
                              <div>
                                <div className="text-orange-300 text-sm font-medium">Resume Building</div>
                                <div className="text-2xl font-bold text-white">{userBreakdown.components?.resume_building?.score || 0}</div>
                              </div>
                            </div>
                            <div className="w-full bg-orange-500/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((userBreakdown.components?.resume_building?.score || 0), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Application Activity */}
                        <div className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30 group-hover:border-indigo-400/50 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">🚀</span>
                              </div>
                              <div>
                                <div className="text-indigo-300 text-sm font-medium">Applications</div>
                                <div className="text-2xl font-bold text-white">{userBreakdown.components?.application_activity?.score || 0}</div>
                              </div>
                            </div>
                            <div className="w-full bg-indigo-500/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((userBreakdown.components?.application_activity?.score || 0), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
	)
}