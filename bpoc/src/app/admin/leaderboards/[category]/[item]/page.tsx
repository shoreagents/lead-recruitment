'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  Trophy, 
  ChevronLeft,
  TrendingUp,
  Clock,
  Medal,
  Crown,
  Star,
  Award,
  Users,
  Target,
  Zap,
  ArrowUpDown,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AdminLayout from '@/components/layout/AdminLayout'

// Mock data - in real app, this would come from API
const mockLeaderboardData = {
  'disc-personality': [
    { rank: 1, name: 'Sarah Johnson', score: 95, level: 'D-21', avatar: 'SJ', date: '2024-01-15', time: '2:30' },
    { rank: 2, name: 'Mike Chen', score: 92, level: 'I-18', avatar: 'MC', date: '2024-01-14', time: '2:45' },
    { rank: 3, name: 'Emily Davis', score: 89, level: 'S-15', avatar: 'ED', date: '2024-01-13', time: '3:10' },
    { rank: 4, name: 'Alex Rodriguez', score: 87, level: 'C-12', avatar: 'AR', date: '2024-01-12', time: '2:55' },
    { rank: 5, name: 'Lisa Wang', score: 85, level: 'D-10', avatar: 'LW', date: '2024-01-11', time: '3:20' },
  ],
  'typing-hero': [
    { rank: 1, name: 'David Kim', score: 85, wpm: 120, accuracy: 98, avatar: 'DK', date: '2024-01-15', time: '1:45' },
    { rank: 2, name: 'Jessica Lee', score: 82, wpm: 115, accuracy: 96, avatar: 'JL', date: '2024-01-14', time: '1:50' },
    { rank: 3, name: 'Robert Smith', score: 79, wpm: 110, accuracy: 94, avatar: 'RS', date: '2024-01-13', time: '2:00' },
    { rank: 4, name: 'Maria Garcia', score: 76, wpm: 105, accuracy: 92, avatar: 'MG', date: '2024-01-12', time: '1:55' },
    { rank: 5, name: 'James Wilson', score: 73, wpm: 100, accuracy: 90, avatar: 'JW', date: '2024-01-11', time: '2:10' },
  ],
}

const getItemDisplayName = (category: string, item: string) => {
  const itemNames: { [key: string]: string } = {
    'disc-personality': 'DISC Personality',
    'typing-speed': 'Typing Speed Test',
    'logical-reasoning': 'Logical Reasoning',
    'communication-skills': 'Communication Skills',
    'workplace-judgment': 'Workplace Judgment',
    'typing-hero': 'Typing Hero',
    'disc-personality-game': 'BPOC DISC',
  }
  return itemNames[item] || item
}

const getScoreDisplay = (item: string, data: any) => {
  switch (item) {
    case 'disc-personality':
    case 'disc-personality-game':
      return `${data.score}% (${data.level})`
    case 'typing-hero':
      return `${data.wpm} WPM (${data.accuracy}% accuracy)`
    default:
      return `${data.score}%`
  }
}

export default function LeaderboardDashboard() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const item = params.item as string
  
  const [sortBy, setSortBy] = useState<'top' | 'recent'>('top')
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    // In real app, fetch data from API based on category and item
    const data = mockLeaderboardData[item as keyof typeof mockLeaderboardData] || []
    setLeaderboardData(data)
  }, [item])

  const handleBack = () => {
    router.push('/admin/leaderboards')
  }

  const getSortIcon = () => {
    return sortBy === 'top' ? <TrendingUp className="h-4 w-4" /> : <Clock className="h-4 w-4" />
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-400" />
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />
    if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />
    return null
  }

  // Pagination logic
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLeaderboardData = leaderboardData.slice(startIndex, endIndex)

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [leaderboardData.length])

  return (
    <AdminLayout title={`${getItemDisplayName(category, item)} Leaderboard`} description="View rankings and statistics">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{getItemDisplayName(category, item)}</h1>
                <p className="text-gray-400">Leaderboard & Rankings</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Crown className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Top Score</p>
                  <p className="text-2xl font-bold text-white">
                    {leaderboardData[0]?.score || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Players</p>
                  <p className="text-2xl font-bold text-white">{leaderboardData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg Score</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(leaderboardData.reduce((acc, curr) => acc + curr.score, 0) / leaderboardData.length || 0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Today</p>
                  <p className="text-2xl font-bold text-white">
                    {leaderboardData.filter(item => item.date === '2024-01-15').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={(value: 'top' | 'recent') => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <div className="flex items-center gap-2">
                  {getSortIcon()}
                  <SelectValue placeholder="Sort by..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Top Performers
                  </div>
                </SelectItem>
                <SelectItem value="recent">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recently Played
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Badge variant="outline" className="border-white/20 text-white">
            <Filter className="h-4 w-4 mr-2" />
            {sortBy === 'top' ? 'Top Performers' : 'Recently Played'}
          </Badge>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Leaderboard Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white">Rank</TableHead>
                    <TableHead className="text-white">Player</TableHead>
                    <TableHead className="text-white">Score</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLeaderboardData.map((player, index) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">#{player.rank}</span>
                          {getRankIcon(player.rank)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
                              {player.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white font-medium">{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          {getScoreDisplay(item, player)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(player.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {player.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            
            {/* Pagination */}
            {leaderboardData.length > 0 && (
              <div className="flex items-center justify-between mt-6 px-6 pb-6">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, leaderboardData.length)} of {leaderboardData.length} players
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-cyan-500 text-white hover:bg-cyan-600"
                              : "border-white/10 text-white hover:bg-white/10"
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}


