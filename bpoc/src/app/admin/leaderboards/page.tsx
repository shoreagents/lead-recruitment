'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Gamepad2, 
  ClipboardList,
  Users,
  Target,
	BarChart3,
	Crown,
	Medal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react'

// Inject custom CSS to remove red outlines
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .admin-search-no-red:focus,
    .admin-search-no-red:focus-visible,
    .admin-search-no-red:invalid {
      border-color: rgba(255, 255, 255, 0.2) !important;
      box-shadow: none !important;
      outline: none !important;
      --tw-ring-color: transparent !important;
      --tw-ring-offset-color: transparent !important;
    }
    .admin-search-no-red.invalid {
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
    .admin-search-no-red:-webkit-autofill,
    .admin-search-no-red:-webkit-autofill:hover,
    .admin-search-no-red:-webkit-autofill:focus,
    .admin-search-no-red:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset !important;
      -webkit-text-fill-color: #fff !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
  `
  document.head.appendChild(style)
}
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AdminLayout from '@/components/layout/AdminLayout'
import { generateInitials } from '@/lib/utils'
// Removed actions dropdown since delete is not supported
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

const GAME_LABELS: Record<string, string> = {
	'typing-hero': 'Typing Hero',
	'disc-personality': 'DISC Personality',
}
function getGameName(id: string): string { return GAME_LABELS[id] || id }

export default function LeaderboardsPage() {
	const [category, setCategory] = useState<'overall' | 'typing-hero' | 'disc-personality' | 'profile' | 'resume' | 'applications'>('overall')
	const [rows, setRows] = useState<any[]>([])
	const [total, setTotal] = useState<number>(0)
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(10)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')

	const [openUserId, setOpenUserId] = useState<string | null>(null)
	const [openUserInfo, setOpenUserInfo] = useState<{ full_name?: string | null; avatar_url?: string | null } | null>(null)
	const [openUserResumeSlug, setOpenUserResumeSlug] = useState<string | null>(null)
	const [breakdown, setBreakdown] = useState<any | null>(null)
	const [loadingBreakdown, setLoadingBreakdown] = useState<boolean>(false)
	const [refreshing, setRefreshing] = useState<boolean>(false)
	const [refreshNonce, setRefreshNonce] = useState<number>(0)

	const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

	const pageItems = useMemo<(number | string)[]>(() => {
		const items: Array<number | string> = []
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i += 1) items.push(i)
			return items
		}
		items.push(1)
		const start = Math.max(2, page - 1)
		const end = Math.min(totalPages - 1, page + 1)
		if (start > 2) items.push('...')
		for (let i = start; i <= end; i += 1) items.push(i)
		if (end < totalPages - 1) items.push('...')
		items.push(totalPages)
		return items
	}, [totalPages, page])

	const fetchRows = async () => {
		try {
			setLoading(true)
			setError('')
			const params = new URLSearchParams()
			params.set('category', category)
			params.set('limit', String(pageSize))
			params.set('offset', String((page - 1) * pageSize))
			
			const res = await fetch(`/api/leaderboards?${params.toString()}`, { cache: 'no-store' })

			if (!res.ok) throw new Error('Failed to load')
			const data = await res.json()
			setRows(data.results || [])
			setTotal(data.total || 0)
		} catch (e: any) {
			setError(e?.message || 'Failed to load')
			setRows([])
			setTotal(0)
		} finally {
			setLoading(false)
		}
	}


	useEffect(() => { fetchRows() }, [category, refreshNonce, page, pageSize])
	


  // Delete action removed

	const formatNumber = (n: any) => {
		const v = Number(n)
		if (!Number.isFinite(v)) return '-'
		return Math.round(v)
	}

	const openBreakdown = async (row: any) => {
		setOpenUserId(row.userId)
		setOpenUserInfo(row.user || null)
		setOpenUserResumeSlug(null)
		setLoadingBreakdown(true)
		setBreakdown(null)
		try {
			const [bRes, rRes] = await Promise.all([
				fetch(`/api/leaderboards/user/${row.userId}?source=live`, { cache: 'no-store' }),
				fetch(`/api/users/${row.userId}/resume`, { cache: 'no-store' })
			])
			const b = bRes.ok ? await bRes.json() : null
			const r = rRes.ok ? await rRes.json() : null
			setBreakdown(b)
			setOpenUserResumeSlug(r?.slug || null)
		} catch {
			setBreakdown(null)
		} finally {
			setLoadingBreakdown(false)
		}
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
			setRefreshNonce(n => n + 1)
			if (openUserId) {
				try {
					const bRes = await fetch(`/api/leaderboards/user/${openUserId}`, { cache: 'no-store' })
					if (bRes.ok) setBreakdown(await bRes.json())
				} catch {}
			}
		} finally {
			setRefreshing(false)
		}
	}

	const selectedRow = useMemo(() => rows.find((r: any) => r.userId === openUserId) || null, [rows, openUserId])

	const goToResume = async (e: React.MouseEvent, userId: string) => {
		e.stopPropagation()
		try {
			const res = await fetch(`/api/users/${userId}/resume`, { cache: 'no-store' })
			if (!res.ok) return
			const data = await res.json()
			if (data?.slug) window.open(`/${data.slug}`, '_blank')
		} catch {}
	}

  return (
		<AdminLayout title="Leaderboards" description="Moderate leaderboard data">
      <div className="space-y-6">
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
					<Card className="glass-card border-white/10">
						<CardHeader><CardTitle className="text-white">Search & Filters</CardTitle></CardHeader>
            <CardContent>
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex-1 relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<Input
										placeholder="Search by user name..."
										className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20 admin-search-no-red"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Select value={category} onValueChange={(v: any) => setCategory(v)}>
										<SelectTrigger className="w-48 bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-0 focus:outline-none">
											<SelectValue placeholder="Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="overall">🏆 Overall Score</SelectItem>
											<SelectItem value="typing-hero">⌨️ Typing Hero</SelectItem>
											<SelectItem value="disc-personality">🧠 DISC Personality</SelectItem>
											<SelectItem value="profile">👤 Profile Completion</SelectItem>
											<SelectItem value="resume">📄 Resume Building</SelectItem>
											<SelectItem value="applications">💼 Applications</SelectItem>
										</SelectContent>
									</Select>
									<Button onClick={refreshLeaderboards} disabled={refreshing} className="bg-white/10 border border-white/20 hover:bg-white/20 text-white">
										<RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
										{refreshing ? 'Refreshing…' : 'Refresh'}
									</Button>
								</div>
							</div>
            </CardContent>
          </Card>
            </motion.div>


              <Card className="glass-card border-white/10">
                <CardHeader>
						<CardTitle className="text-white">Results ({total})</CardTitle>
                </CardHeader>
                <CardContent>
						{loading ? (
							<div className="text-gray-400 py-10 text-center">Loading…</div>
						) : error ? (
							<div className="text-red-400 py-10 text-center">{error}</div>
						) : rows.length === 0 ? (
							<div className="text-gray-400 py-10 text-center">No data</div>
						) : (

                        <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                                <TableHead className="text-right">Tier</TableHead>
                                {category === 'overall' && <TableHead className="text-right">Typing Hero</TableHead>}
                                {category === 'overall' && <TableHead className="text-right">DISC</TableHead>}
                                {category === 'overall' && <TableHead className="text-right">Profile</TableHead>}
                                {category === 'overall' && <TableHead className="text-right">Resume</TableHead>}
                                {category === 'overall' && <TableHead className="text-right">Applications</TableHead>}
                                <TableHead className="text-right">Last Activity</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {rows.map((r: any) => (
                                <TableRow key={r.userId} className="cursor-pointer" onClick={() => openBreakdown(r)}>
                                  <TableCell className="font-medium">#{r.rank || '-'}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full overflow-hidden">
                                        {r.user?.avatar_url ? (
                                          <img src={r.user.avatar_url} alt={r.user?.full_name || r.userId} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{generateInitials(r.user?.full_name || null)}</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="min-w-0">
                                        <div className="truncate text-white">{r.user?.full_name || r.userId}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="font-mono text-lg font-bold text-white">
                                      {formatNumber(r.score)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Badge variant="outline" className={`border-white/20 ${
                                      r.tier === 'Diamond' ? 'text-cyan-400 border-cyan-400' :
                                      r.tier === 'Platinum' ? 'text-gray-300 border-gray-300' :
                                      r.tier === 'Gold' ? 'text-yellow-400 border-yellow-400' :
                                      r.tier === 'Silver' ? 'text-gray-400 border-gray-400' :
                                      'text-amber-600 border-amber-600'
                                    }`}>
                                      {r.tier || 'Bronze'}
                                    </Badge>
                                  </TableCell>
                                  {category === 'overall' && <TableCell className="text-right">{formatNumber(r.typing_hero_score)}</TableCell>}
                                  {category === 'overall' && <TableCell className="text-right">{formatNumber(r.disc_personality_score)}</TableCell>}
                                  {category === 'overall' && <TableCell className="text-right">{formatNumber(r.profile_completion_score)}</TableCell>}
                                  {category === 'overall' && <TableCell className="text-right">{formatNumber(r.resume_building_score)}</TableCell>}
                                  {category === 'overall' && <TableCell className="text-right">{formatNumber(r.application_activity_score)}</TableCell>}
                                  <TableCell className="text-right text-sm text-gray-400">
                                    {r.last_activity_at ? new Date(r.last_activity_at).toLocaleDateString() : '-'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {total > 0 && (
                            <div className="flex items-center justify-end mt-6 gap-3">
                              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50">
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <div className="flex items-center gap-2">
                                {Array.from({ length: Math.max(1, totalPages) }).map((_, idx) => {
                                  const it = idx + 1
                                  return (
                                    <Button key={idx} variant={it === page ? 'secondary' : 'outline'} size="sm" onClick={() => setPage(it)} className={`h-8 px-3 ${it === page ? 'bg-white/10 text-white' : 'text-gray-300 border-white/20 hover:bg-white/10'}`}>
                                      {it}
                                    </Button>
                                  )
                                })}
                              </div>
                              <div className="text-gray-300 text-sm px-3 py-1 rounded bg-white/5 border border-white/10">Page {page} of {totalPages}</div>
                              <Select value={String(pageSize)} onValueChange={(v: string) => { setPageSize(Number(v)); setPage(1) }}>
                                <SelectTrigger className="w-[120px] h-8 bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-0 focus:outline-none">
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
                        </>

						)}
					</CardContent>
				</Card>

			</div>

			<Dialog open={!!openUserId} onOpenChange={(o) => { if (!o) { setOpenUserId(null); setBreakdown(null) } }}>
				<DialogContent className="bg-gray-900 border-white/10 text-white max-w-5xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden ring-2 ring-cyan-500/20">
								{selectedRow?.user?.avatar_url ? (
									<img src={selectedRow.user.avatar_url} alt={selectedRow.user?.full_name || selectedRow?.userId} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
										{generateInitials(selectedRow?.user?.full_name || null)}
									</div>
								)}
							</div>
							{selectedRow?.user?.full_name || selectedRow?.userId}
							{selectedRow?.rank && (
								<Badge className="bg-cyan-500/20 border-cyan-500/30 text-cyan-300">Rank #{selectedRow.rank}</Badge>
							)}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						{loadingBreakdown && (
							<div className="text-gray-400 text-center py-8">Loading user details...</div>
						)}
						{!loadingBreakdown && breakdown && (
							<>
								{/* Overall Score */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<div className="text-gray-400 text-xs">Overall Score</div>
										<div className="text-white text-2xl font-bold">{breakdown.overall?.overall_score || 0}</div>
									</div>
									<div>
										<div className="text-gray-400 text-xs">Tier</div>
										<div className="text-white text-lg font-semibold">{breakdown.overall?.tier || 'Bronze'}</div>
									</div>
								</div>

								{/* Component Scores */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<div className="text-gray-400 text-xs">Typing Hero</div>
										<div className="text-white text-lg">{breakdown.components?.typing_hero?.score || 0}</div>
									</div>
									<div>
										<div className="text-gray-400 text-xs">DISC Personality</div>
										<div className="text-white text-lg">{breakdown.components?.disc_personality?.score || 0}</div>
									</div>
									<div>
										<div className="text-gray-400 text-xs">Profile Completion</div>
										<div className="text-white text-lg">{breakdown.components?.profile_completion?.score || 0}</div>
									</div>
									<div>
										<div className="text-gray-400 text-xs">Resume Building</div>
										<div className="text-white text-lg">{breakdown.components?.resume_building?.score || 0}</div>
									</div>
									<div>
										<div className="text-gray-400 text-xs">Applications</div>
										<div className="text-white text-lg">{breakdown.components?.application_activity?.score || 0}</div>
									</div>
								</div>

							</>
						)}
					</div>
				</DialogContent>
			</Dialog>
    </AdminLayout>
  )
}