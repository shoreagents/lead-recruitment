'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Keyboard, Brain, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'

interface TypingHeroStats {
  id: string
  user_id: string
  total_sessions: number
  best_wpm: number
  best_accuracy: number
  consistency_score: number
  percentile_rank: number
  last_played_at: string
  ai_analysis?: string
  created_at: string
  updated_at: string
  user_name: string
  user_email: string
  user_avatar?: string
}

interface DiscPersonalityStats {
  id: string
  user_id: string
  last_taken_at: string
  d: number
  i: number
  s: number
  c: number
  primary_style: string
  secondary_style: string
  consistency_index: number
  strengths: string[]
  blind_spots: string[]
  preferred_env: string[]
  created_at: string
  updated_at: string
  user_name: string
  user_email: string
  user_avatar?: string
}

interface GameTab {
  id: string
  name: string
  icon: any
}

export default function GamesPage() {
  const [selectedTab, setSelectedTab] = useState('typing-hero')
  const [typingHeroStats, setTypingHeroStats] = useState<TypingHeroStats[]>([])
  const [discPersonalityStats, setDiscPersonalityStats] = useState<DiscPersonalityStats[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [discCurrentPage, setDiscCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [error, setError] = useState<string | null>(null)
  
  // Modal and delete states
  const [selectedGameStat, setSelectedGameStat] = useState<any | null>(null)
  const [gameModalOpen, setGameModalOpen] = useState(false)
  const [gameModalType, setGameModalType] = useState<string>('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteStatId, setDeleteStatId] = useState<string>('')
  const [deleteStatType, setDeleteStatType] = useState<string>('')
  const [deleteStatName, setDeleteStatName] = useState<string>('')
  const [deletingStats, setDeletingStats] = useState<string[]>([])

  const tabs: GameTab[] = [
    { id: 'typing-hero', name: 'Typing Hero', icon: Keyboard },
    { id: 'disc-personality', name: 'BPOC DISC', icon: Brain }
  ]

  const fetchTypingHeroStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/typing-hero-stats')
      if (response.ok) {
        const data = await response.json()
        setTypingHeroStats(data.stats || [])
      } else {
        setError('Failed to fetch typing hero stats')
        setTypingHeroStats([])
      }
    } catch (error) {
      setError('Failed to fetch typing hero stats')
      setTypingHeroStats([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDiscPersonalityStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/disc-personality-stats')
      if (response.ok) {
        const data = await response.json()
        setDiscPersonalityStats(data.stats || [])
      } else {
        setError('Failed to fetch DISC personality stats')
        setDiscPersonalityStats([])
      }
    } catch (error) {
      setError('Failed to fetch DISC personality stats')
      setDiscPersonalityStats([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedTab === 'typing-hero') {
      fetchTypingHeroStats()
    } else if (selectedTab === 'disc-personality') {
      fetchDiscPersonalityStats()
    }
  }, [selectedTab, fetchTypingHeroStats, fetchDiscPersonalityStats])

  // Filter and paginate typing hero stats
  const filteredTypingHeroStats = typingHeroStats.filter(stat => {
    const matchesSearch = stat.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stat.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    switch (filterType) {
      case 'active':
        return stat.last_played_at && new Date(stat.last_played_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      case 'inactive':
        return !stat.last_played_at || new Date(stat.last_played_at) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      case 'high-wpm':
        return stat.best_wpm >= 50
      case 'high-accuracy':
        return stat.best_accuracy >= 90
      case 'recent':
        return stat.last_played_at && new Date(stat.last_played_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      case 'all':
      default:
        return true
    }
  })

  // Filter DISC Personality stats
  const filteredDiscPersonalityStats = discPersonalityStats.filter(stat => {
    const matchesSearch = stat.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stat.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    switch (filterType) {
      case 'active':
        return stat.last_taken_at && new Date(stat.last_taken_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      case 'inactive':
        return !stat.last_taken_at || new Date(stat.last_taken_at) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      case 'high-consistency':
        return stat.consistency_index >= 80
      case 'recent':
        return stat.last_taken_at && new Date(stat.last_taken_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      case 'all':
      default:
        return true
    }
  })

  // Pagination logic
  const typingHeroTotalPages = Math.ceil(filteredTypingHeroStats.length / itemsPerPage)
  const paginatedTypingHeroStats = filteredTypingHeroStats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const discTotalPages = Math.ceil(filteredDiscPersonalityStats.length / itemsPerPage)
  const paginatedDiscStats = filteredDiscPersonalityStats.slice(
    (discCurrentPage - 1) * itemsPerPage,
    discCurrentPage * itemsPerPage
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
    setDiscCurrentPage(1)
  }

  const handleFilterChange = (filter: string) => {
    setFilterType(filter)
    setCurrentPage(1)
    setDiscCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setCurrentPage(1)
    setDiscCurrentPage(1)
  }

  const handleViewGameStat = (stat: any, type: string) => {
    setSelectedGameStat(stat)
    setGameModalType(type)
    setGameModalOpen(true)
  }

  const handleDeleteStat = async (statId: string, statType: string, statName: string) => {
    setDeleteStatId(statId)
    setDeleteStatType(statType)
    setDeleteStatName(statName)
    setShowDeleteDialog(true)
  }

  const confirmDeleteStat = async () => {
    if (!deleteStatId || !deleteStatType) return

    try {
      setDeletingStats(prev => [...prev, deleteStatId])
      
      let endpoint = ''
      switch (deleteStatType) {
        case 'typing-hero':
          endpoint = `/api/admin/typing-hero-stats/${deleteStatId}`
          break
        case 'disc-personality':
          endpoint = `/api/admin/disc-personality-stats/${deleteStatId}`
          break
        default:
          throw new Error('Invalid stat type')
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
      })

      if (response.ok) {
        switch (deleteStatType) {
          case 'typing-hero':
            setTypingHeroStats(prev => prev.filter(stat => stat.id !== deleteStatId))
            break
          case 'disc-personality':
            setDiscPersonalityStats(prev => prev.filter(stat => stat.id !== deleteStatId))
            break
        }
        setShowDeleteDialog(false)
        setDeleteStatId('')
        setDeleteStatType('')
        setDeleteStatName('')
        toast.success('Stat record deleted successfully')
      } else {
        throw new Error('Failed to delete stat')
      }
    } catch (error) {
      console.error('Error deleting stat:', error)
      toast.error('Failed to delete stat record')
    } finally {
      setDeletingStats(prev => prev.filter(id => id !== deleteStatId))
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <AdminLayout 
      title="Game Management" 
      description="Manage and monitor game performance and player analytics"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 border border-white/10 rounded-lg p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = selectedTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={` px-4 py-2 rounded-md transition-all duration-200 border border-transparent ${
                  isActive 
                    ? 'bg-white text-gray-900 font-medium border-white/20' 
                    : 'text-white hover:bg-white/5 border-white/10'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Typing Hero Stats Table */}
        {selectedTab === 'typing-hero' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white ">
                <Keyboard className="w-5 h-5" />
                Typing Hero Statistics
              </CardTitle>
              <div className="flex items-center gap-4 ml-auto">
                <div className="relative">
                  <Select value={filterType || 'all'} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white focus:ring-cyan-500">
                      <SelectValue placeholder="All Players" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      <SelectItem value="all">All Players</SelectItem>
                      <SelectItem value="active">Active Players</SelectItem>
                      <SelectItem value="inactive">Inactive Players</SelectItem>
                      <SelectItem value="high-wpm">High WPM (50+)</SelectItem>
                      <SelectItem value="high-accuracy">High Accuracy (90%+)</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20"
                  />
                </div>
                {(searchTerm || filterType !== 'all') && (
                  <Button
                    onClick={clearAllFilters}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white border border-white/20"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-white">{error}</div>
              ) : (
                <>
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                          <TableHead className="text-white font-medium">Name</TableHead>
                          <TableHead className="text-white font-medium">Sessions</TableHead>
                          <TableHead className="text-white font-medium">Best WPM</TableHead>
                          <TableHead className="text-white font-medium">Best Accuracy</TableHead>
                          <TableHead className="text-white font-medium">Consistency</TableHead>
                          <TableHead className="text-white font-medium">Percentile</TableHead>
                          <TableHead className="text-white font-medium">Last Played</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTypingHeroStats.map((stat) => (
                          <TableRow key={stat.id} className="border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => handleViewGameStat(stat, 'typing-hero')}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage 
                                    src={stat.user_avatar} 
                                    alt={stat.user_name}
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-xs">
                                    {getInitials(stat.user_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">{stat.user_name}</div>
                                  <div className="text-sm text-gray-400">{stat.user_email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.total_sessions}</div>
                                <div className="text-xs text-gray-400">sessions</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.best_wpm}</div>
                                <div className="text-xs text-gray-400">WPM</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.best_accuracy}%</div>
                                <div className="text-xs text-gray-400">accuracy</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.consistency_score}</div>
                                <div className="text-xs text-gray-400">consistency</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.percentile_rank}%</div>
                                <div className="text-xs text-gray-400">percentile</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-400">
                                {stat.last_played_at ? new Date(stat.last_played_at).toLocaleDateString() : 'Never'}
                              </div>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-gray-900 border-white/10">
                                  <DropdownMenuItem 
                                    className="text-white"
                                    onClick={() => handleDeleteStat(stat.id, 'typing-hero', stat.user_name)}
                                    disabled={deletingStats.includes(stat.id)}
                                  >
                                    {deletingStats.includes(stat.id) ? 'Deleting...' : 'Delete'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination for Typing Hero Stats */}
                  {filteredTypingHeroStats.length > 0 && (
                    <div className="flex items-center justify-between mt-6 px-6 pb-6">
                      <div className="text-sm text-gray-400">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTypingHeroStats.length)} of {filteredTypingHeroStats.length} players
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
                          {Array.from({ length: Math.min(5, typingHeroTotalPages) }, (_, i) => {
                            const pageNumber = i + 1
                            return (
                              <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`w-8 h-8 p-0 ${
                                  currentPage === pageNumber
                                    ? 'bg-white text-gray-900'
                                    : 'border-white/10 text-white hover:bg-white/10'
                                }`}
                              >
                                {pageNumber}
                              </Button>
                            )
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === typingHeroTotalPages}
                          className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* DISC Personality Stats Table */}
        {selectedTab === 'disc-personality' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white ">
                <Brain className="w-5 h-5" />
                BPOC DISC Statistics
              </CardTitle>
              <div className="flex items-center gap-4 ml-auto">
                <div className="relative">
                  <Select value={filterType || 'all'} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white focus:ring-cyan-500">
                      <SelectValue placeholder="All Players" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      <SelectItem value="all">All Players</SelectItem>
                      <SelectItem value="active">Active Players</SelectItem>
                      <SelectItem value="inactive">Inactive Players</SelectItem>
                      <SelectItem value="high-consistency">High Consistency (80%+)</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20"
                  />
                </div>
                {(searchTerm || filterType !== 'all') && (
                  <Button
                    onClick={clearAllFilters}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white border border-white/20"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-white">{error}</div>
              ) : (
                <>
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                          <TableHead className="text-white font-medium">Name</TableHead>
                          <TableHead className="text-white font-medium">D</TableHead>
                          <TableHead className="text-white font-medium">I</TableHead>
                          <TableHead className="text-white font-medium">S</TableHead>
                          <TableHead className="text-white font-medium">C</TableHead>
                          <TableHead className="text-white font-medium">Primary Style</TableHead>
                          <TableHead className="text-white font-medium">Consistency</TableHead>
                          <TableHead className="text-white font-medium">Last Taken</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedDiscStats.map((stat) => (
                          <TableRow key={stat.id} className="border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => handleViewGameStat(stat, 'disc-personality')}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage 
                                    src={stat.user_avatar} 
                                    alt={stat.user_name}
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-xs">
                                    {getInitials(stat.user_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">{stat.user_name}</div>
                                  <div className="text-sm text-gray-400">{stat.user_email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.d}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.i}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.s}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.c}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <Badge className="bg-blue-500/20 text-white border-blue-500/30">
                                  {stat.primary_style || 'N/A'}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium text-white">{stat.consistency_index}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-400">
                                {stat.last_taken_at ? new Date(stat.last_taken_at).toLocaleDateString() : 'Never'}
                              </div>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-gray-900 border-white/10">
                                  <DropdownMenuItem 
                                    className="text-white"
                                    onClick={() => handleDeleteStat(stat.id, 'disc-personality', stat.user_name)}
                                    disabled={deletingStats.includes(stat.id)}
                                  >
                                    {deletingStats.includes(stat.id) ? 'Deleting...' : 'Delete'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination for DISC Stats */}
                  {filteredDiscPersonalityStats.length > 0 && (
                    <div className="flex items-center justify-between mt-6 px-6 pb-6">
                      <div className="text-sm text-gray-400">
                        Showing {(discCurrentPage - 1) * itemsPerPage + 1} to {Math.min(discCurrentPage * itemsPerPage, filteredDiscPersonalityStats.length)} of {filteredDiscPersonalityStats.length} players
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDiscCurrentPage(discCurrentPage - 1)}
                          disabled={discCurrentPage === 1}
                          className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          Previous
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, discTotalPages) }, (_, i) => {
                            const pageNumber = i + 1
                            return (
                              <Button
                                key={pageNumber}
                                variant={discCurrentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => setDiscCurrentPage(pageNumber)}
                                className={`w-8 h-8 p-0 ${
                                  discCurrentPage === pageNumber
                                    ? 'bg-white text-gray-900'
                                    : 'border-white/10 text-white hover:bg-white/10'
                                }`}
                              >
                                {pageNumber}
                              </Button>
                            )
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDiscCurrentPage(discCurrentPage + 1)}
                          disabled={discCurrentPage === discTotalPages}
                          className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .modal-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .modal-scrollbar::-webkit-scrollbar-track {
            background: #1F2937;
            border-radius: 3px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb {
            background: #4B5563;
            border-radius: 3px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
          }
        `}</style>

        {/* Game Details Modal */}
        <Dialog open={gameModalOpen} onOpenChange={setGameModalOpen}>
        <DialogContent 
          className="max-w-none w-[70vw] h-[85vh] bg-gray-900 border-white/10 overflow-y-auto m-4 p-6 modal-scrollbar"
          style={{
            position: 'fixed',
            top: '7.5vh',
            left: '15vw',
            right: '15vw',
            bottom: '7.5vh',
            transform: 'none',
            margin: 0,
            maxWidth: 'none',
            maxHeight: 'none',
            scrollbarWidth: 'thin',
            scrollbarColor: '#4B5563 #1F2937'
          }}
        >
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                {gameModalType === 'typing-hero' ? (
                  <>
                    <Keyboard className="w-6 h-6 text-white" />
                    Typing Hero Details
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6 text-white" />
                    DISC Personality Details
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedGameStat && (
              <div className="space-y-8">
                {/* User Information */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                  <h3 className="text-xl font-bold text-white mb-6">
                    User Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">User Name</label>
                      <p className="text-white text-lg font-semibold">{selectedGameStat.user_name}</p>
                  </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <p className="text-white text-lg">{selectedGameStat.user_email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Typing Hero Details */}
                {gameModalType === 'typing-hero' && (
                  <div className="space-y-6">
                    {/* Session Information */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6">
                        Session Information
                      </h3>
                      <div className="grid grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Total Sessions</label>
                          <p className="text-white text-2xl font-bold">{selectedGameStat.total_sessions}</p>
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Completed Sessions</label>
                          <p className="text-white text-2xl font-bold">{selectedGameStat.completed_sessions}</p>
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Last Played</label>
                          <p className="text-white text-sm">{selectedGameStat.last_played_at ? new Date(selectedGameStat.last_played_at).toLocaleString() : 'Never'}</p>
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Completion Rate</label>
                          <p className="text-white text-2xl font-bold text-white">
                            {selectedGameStat.total_sessions > 0 ? Math.round((selectedGameStat.completed_sessions / selectedGameStat.total_sessions) * 100) : 0}%
                          </p>
                    </div>
                      </div>
                      </div>

                    {/* Performance Metrics */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6">
                        Performance Metrics
                      </h3>
                      <div className="grid grid-cols-5 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Best WPM</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.best_wpm || 'N/A'}</p>
                    </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Best Accuracy</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.best_accuracy ? `${selectedGameStat.best_accuracy}%` : 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Best Score</label>
                          <p className="text-white text-2xl font-bold">{selectedGameStat.best_score || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Best Streak</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.best_streak || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Average WPM</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.avg_wpm || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Latest Performance */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6">
                        Latest Performance
                      </h3>
                      <div className="grid grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Latest Score</label>
                          <p className="text-white text-2xl font-bold">{selectedGameStat.latest_score || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Latest WPM</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.latest_wpm || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Latest Accuracy</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.latest_accuracy ? `${selectedGameStat.latest_accuracy}%` : 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Latest Difficulty</label>
                          <p className="text-white text-lg font-semibold bg-gray-600 px-3 py-1 rounded-full">{selectedGameStat.latest_difficulty || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Statistics */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6">
                        Detailed Statistics
                      </h3>
                      <div className="grid grid-cols-5 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Average Accuracy</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.avg_accuracy ? `${selectedGameStat.avg_accuracy}%` : 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Total Play Time</label>
                          <p className="text-white text-xl font-bold">{selectedGameStat.total_play_time ? `${Math.round(selectedGameStat.total_play_time / 1000)}s` : 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Words Correct</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.total_words_correct || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Words Incorrect</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.total_words_incorrect || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Reaction Time</label>
                          <p className="text-white text-xl font-bold">{selectedGameStat.average_reaction_time ? `${selectedGameStat.average_reaction_time}ms` : 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Word Analysis */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6">
                        Word Analysis
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="text-sm font-medium text-gray-300">Most Common Correct Words</label>
                          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30">
                            {selectedGameStat.most_common_correct_words ? (
                              <div className="space-y-2">
                                {Array.isArray(selectedGameStat.most_common_correct_words) ? (
                                  selectedGameStat.most_common_correct_words.map((word: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <span className="text-white text-sm">{word.word || word}</span>
                                      <span className="text-gray-400 text-xs">{word.count || word.frequency || ''}</span>
                                    </div>
                                  ))
                                ) : (
                                  <pre className="text-white text-xs font-mono overflow-x-auto">
                                    {JSON.stringify(selectedGameStat.most_common_correct_words, null, 2)}
                                  </pre>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No data available</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-sm font-medium text-gray-300">Most Common Incorrect Words</label>
                          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30">
                            {selectedGameStat.most_common_incorrect_words ? (
                              <div className="space-y-2">
                                {Array.isArray(selectedGameStat.most_common_incorrect_words) ? (
                                  selectedGameStat.most_common_incorrect_words.map((word: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <span className="text-white text-sm">{word.word || word}</span>
                                      <span className="text-gray-400 text-xs">{word.count || word.frequency || ''}</span>
                                    </div>
                                  ))
                                ) : (
                                  <pre className="text-white text-xs font-mono overflow-x-auto">
                                    {JSON.stringify(selectedGameStat.most_common_incorrect_words, null, 2)}
                                  </pre>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No data available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* AI Analysis Section - Only for Typing Hero */}
                {gameModalType === 'typing-hero' && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-600/20 shadow-lg">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white">
                        AI Performance Analysis
                      </h3>
                    </div>
                    <div className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-6">
                      {(() => {
                        console.log('🔍 AI Analysis Debug:', {
                          hasAiAnalysis: !!selectedGameStat.ai_analysis,
                          type: typeof selectedGameStat.ai_analysis,
                          value: selectedGameStat.ai_analysis,
                          isString: typeof selectedGameStat.ai_analysis === 'string',
                          keys: typeof selectedGameStat.ai_analysis === 'object' ? Object.keys(selectedGameStat.ai_analysis) : 'N/A',
                          stringValues: typeof selectedGameStat.ai_analysis === 'object' ? Object.values(selectedGameStat.ai_analysis).filter(v => typeof v === 'string') : 'N/A'
                        })
                        
                        if (!selectedGameStat.ai_analysis) {
                          return <div className="text-gray-400 italic">No AI analysis available</div>
                        }
                        
                        // Handle different data types
                        let analysisText = ''
                        if (typeof selectedGameStat.ai_analysis === 'string') {
                          // Try to parse as JSON first, then fallback to string
                          try {
                            const parsed = JSON.parse(selectedGameStat.ai_analysis)
                            if (parsed.text) {
                              analysisText = parsed.text
                            } else if (parsed.content) {
                              analysisText = parsed.content
                            } else if (parsed.analysis) {
                              analysisText = parsed.analysis
                            } else {
                              analysisText = selectedGameStat.ai_analysis
                            }
                          } catch {
                            analysisText = selectedGameStat.ai_analysis
                          }
                        } else if (typeof selectedGameStat.ai_analysis === 'object') {
                          // If it's an object, try to extract text content
                          if (selectedGameStat.ai_analysis.text) {
                            analysisText = selectedGameStat.ai_analysis.text
                          } else if (selectedGameStat.ai_analysis.content) {
                            analysisText = selectedGameStat.ai_analysis.content
                          } else if (selectedGameStat.ai_analysis.analysis) {
                            analysisText = selectedGameStat.ai_analysis.analysis
                          } else if (selectedGameStat.ai_analysis.summary) {
                            analysisText = selectedGameStat.ai_analysis.summary
                          } else if (selectedGameStat.ai_analysis.description) {
                            analysisText = selectedGameStat.ai_analysis.description
                          } else {
                            // Try to find any string value in the object (including nested objects)
                            const extractStrings = (obj: any, depth = 0): string[] => {
                              if (depth > 3) return [] // Prevent infinite recursion
                              const strings: string[] = []
                              
                              for (const [key, value] of Object.entries(obj)) {
                                if (typeof value === 'string' && value.trim().length > 10) {
                                  strings.push(value)
                                } else if (typeof value === 'object' && value !== null) {
                                  strings.push(...extractStrings(value, depth + 1))
                                }
                              }
                              return strings
                            }
                            
                            const stringValues = extractStrings(selectedGameStat.ai_analysis)
                            if (stringValues.length > 0) {
                              analysisText = stringValues.join('\n\n')
                            } else {
                              // Show the structure in a more readable format
                              const formatObject = (obj: any, indent = 0): string => {
                                const spaces = '  '.repeat(indent)
                                let result = ''
                                
                                for (const [key, value] of Object.entries(obj)) {
                                  if (typeof value === 'string' && value.length > 0) {
                                    result += `${spaces}${key}: ${value}\n`
                                  } else if (typeof value === 'object' && value !== null) {
                                    result += `${spaces}${key}:\n${formatObject(value, indent + 1)}`
                                  } else if (typeof value === 'number' || typeof value === 'boolean') {
                                    result += `${spaces}${key}: ${value}\n`
                                  }
                                }
                                return result
                              }
                              
                              analysisText = `AI Analysis Data:\n\n${formatObject(selectedGameStat.ai_analysis)}`
                            }
                          }
                        } else {
                          analysisText = String(selectedGameStat.ai_analysis)
                        }
                        
                        if (!analysisText.trim()) {
                          return <div className="text-gray-400 italic">AI analysis is empty</div>
                        }
                        
                        // Try to extract the aiAssessment from the comprehensive analysis
                        let aiAssessment = null
                        if (typeof selectedGameStat.ai_analysis === 'object' && selectedGameStat.ai_analysis.aiAssessment) {
                          aiAssessment = selectedGameStat.ai_analysis.aiAssessment
                        } else if (typeof selectedGameStat.ai_analysis === 'string') {
                          try {
                            const parsed = JSON.parse(selectedGameStat.ai_analysis)
                            if (parsed.aiAssessment) {
                              aiAssessment = parsed.aiAssessment
                            } else if (parsed.overallAssessment) {
                              // If it's already the aiAssessment format
                              aiAssessment = parsed
                            }
                          } catch (e) {
                            // If parsing fails, treat as raw text
                          }
                        }

                        if (aiAssessment) {
                          return (
                            <div className="space-y-6">
                              {/* Overall Assessment */}
                              <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-white border-b border-gray-600/30 pb-2">
                                  Performance Analysis
                                </h4>
                                <div className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-4">
                                  <p 
                                    className="text-gray-200 leading-relaxed"
                                    style={{ 
                                      fontFamily: 'system-ui, -apple-system, sans-serif',
                                      lineHeight: '1.7',
                                      fontSize: '15px'
                                    }}
                                  >
                                    {aiAssessment.overallAssessment}
                                  </p>
                                </div>
                              </div>

                              {/* Strengths */}
                              {aiAssessment.strengths?.length > 0 && (
                                <div className="space-y-4">
                                  <h4 className="text-lg font-semibold text-white border-b border-gray-600/30 pb-2">
                                    Your Strengths
                                  </h4>
                                  <div className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-4">
                                    <ul className="text-gray-300 space-y-3">
                                      {aiAssessment.strengths.map((strength: string, i: number) => (
                                        <li 
                                          key={i}
                                          className="flex items-start space-x-3 p-3 bg-gray-600/30 rounded-lg border border-gray-600/20"
                                          style={{ 
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                            lineHeight: '1.6',
                                            fontSize: '15px'
                                          }}
                                        >
                                          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">{i + 1}</span>
                                          </div>
                                          <span className="text-gray-200">{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {/* Personalized Tips */}
                              {aiAssessment.personalizedTips?.length > 0 && (
                                <div className="space-y-4">
                                  <h4 className="text-lg font-semibold text-white border-b border-gray-600/30 pb-2">
                                    Personalized Tips
                                  </h4>
                                  <div className="space-y-4">
                                    {aiAssessment.personalizedTips.map((tip: any, i: number) => (
                                      <div key={i} className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-4">
                                        <div className="flex items-start space-x-3">
                                          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm">•</span>
                                          </div>
                                          <div className="flex-1">
                                            <p 
                                              className="text-gray-300 font-semibold mb-2"
                                              style={{ 
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                lineHeight: '1.6',
                                                fontSize: '16px'
                                              }}
                                            >
                                              {tip.category}: {tip.tip}
                                            </p>
                                            <p 
                                              className="text-gray-200"
                                              style={{ 
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                lineHeight: '1.6',
                                                fontSize: '15px'
                                              }}
                                            >
                                              {tip.explanation}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Next Session Goal */}
                              {aiAssessment.nextSessionGoal && (
                                <div className="space-y-4">
                                  <h4 className="text-lg font-semibold text-white border-b border-gray-600/30 pb-2">
                                    Next Session Goal
                                  </h4>
                                  <div className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm">•</span>
                                      </div>
                                      <p 
                                        className="text-gray-200 font-medium"
                                        style={{ 
                                          fontFamily: 'system-ui, -apple-system, sans-serif',
                                          lineHeight: '1.6',
                                          fontSize: '16px'
                                        }}
                                      >
                                        {aiAssessment.nextSessionGoal}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Encouragement */}
                              {aiAssessment.encouragement && (
                                <div className="space-y-4 pt-6 border-t border-gray-600/20">
                                  <h4 className="text-lg font-semibold text-white text-center">
                                    Encouragement
                                  </h4>
                                  <div className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-6 text-center">
                                    <div className="flex items-center justify-center space-x-3">
                                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">•</span>
                                      </div>
                                      <p 
                                        className="text-gray-200 font-medium"
                                        style={{ 
                                          fontFamily: 'system-ui, -apple-system, sans-serif',
                                          lineHeight: '1.6',
                                          fontSize: '16px'
                                        }}
                                      >
                                        {aiAssessment.encouragement}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        }

                        // Fallback to raw text display if aiAssessment not found
                        return (
                          <div className="space-y-4">
                            <div 
                              className="text-gray-200 leading-relaxed"
                              style={{ 
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                lineHeight: '1.7',
                                fontSize: '15px'
                              }}
                            >
                              {analysisText.split('\n').map((line, index) => {
                                const isBulletPoint = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')
                                const isHeader = line.trim().endsWith(':') && line.length < 50
                                
                                if (isHeader) {
                                  return (
                                    <div key={index} className="mb-4">
                                      <h4 className="text-lg font-semibold text-white border-b border-purple-400/30 pb-2 mb-3">
                                        {line}
                                      </h4>
                                    </div>
                                  )
                                } else if (isBulletPoint) {
                                  return (
                                    <div key={index} className="flex items-start space-x-3 mb-3 p-3 bg-purple-500/5 rounded-lg border border-purple-400/20">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-gray-200">{line.replace(/^[•\-\*]\s*/, '')}</span>
                                    </div>
                                  )
                                } else if (line.trim()) {
                                  return (
                                    <div key={index} className="mb-3 p-3 bg-gray-800/30 rounded-lg">
                                      <p className="text-gray-200">{line}</p>
                                    </div>
                                  )
                                } else {
                                  return <div key={index} className="mb-2"></div>
                                }
                              })}
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                )}

                {/* DISC Personality Details */}
                {gameModalType === 'disc-personality' && (
                  <div className="space-y-6">
                    {/* Session Information */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6">
                        Session Information
                      </h3>
                      <div className="grid grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Total Sessions</label>
                          <p className="text-white text-2xl font-bold">{selectedGameStat.total_sessions}</p>
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Completed Sessions</label>
                          <p className="text-white text-2xl font-bold">{selectedGameStat.completed_sessions}</p>
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Last Taken</label>
                          <p className="text-white text-sm">{selectedGameStat.last_taken_at ? new Date(selectedGameStat.last_taken_at).toLocaleString() : 'Never'}</p>
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Completion Rate</label>
                          <p className="text-white text-2xl font-bold text-white">
                            {selectedGameStat.total_sessions > 0 ? Math.round((selectedGameStat.completed_sessions / selectedGameStat.total_sessions) * 100) : 0}%
                          </p>
                      </div>
                    </div>
                      </div>

                    {/* DISC Scores */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6">
                        DISC Scores
                      </h3>
                      <div className="grid grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">D Score (Dominance)</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.d || 'N/A'}</p>
                      </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">I Score (Influence)</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.i || 'N/A'}</p>
                    </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">S Score (Steadiness)</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.s || 'N/A'}</p>
                    </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">C Score (Conscientiousness)</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.c || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Personality Types */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6 ">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        Personality Types
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Primary Style</label>
                          <p className="text-white text-2xl font-bold bg-indigo-600 px-4 py-2 rounded-full">{selectedGameStat.primary_style || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Secondary Style</label>
                          <p className="text-white text-2xl font-bold bg-indigo-600 px-4 py-2 rounded-full">{selectedGameStat.secondary_style || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Quality */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6 ">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        Assessment Quality
                      </h3>
                      <div className="grid grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Confidence Score</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.best_confidence_score || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Completion Time</label>
                          <p className="text-white text-xl font-bold">{selectedGameStat.average_completion_time ? `${Math.round(selectedGameStat.average_completion_time / 1000)}s` : 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Consistency Trend</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.consistency_index || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Percentile</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.percentile ? `${selectedGameStat.percentile}%` : 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6 ">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        AI Analysis
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Latest AI Assessment</label>
                          <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600/30">
                            {selectedGameStat.latest_ai_assessment ? (
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <div className="prose prose-invert max-w-none">
                                      <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedGameStat.latest_ai_assessment}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-600/30">
                                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                                  <span className="text-gray-400 text-xs">AI-Generated Assessment</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-12 h-12 bg-gray-600/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                                <p className="text-gray-400 text-sm">No assessment available</p>
                                <p className="text-gray-500 text-xs mt-1">Complete a DISC assessment to generate AI insights</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Latest BPO Roles</label>
                          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30">
                            {selectedGameStat.latest_bpo_roles ? (
                              <div className="space-y-2">
                                {Array.isArray(selectedGameStat.latest_bpo_roles) ? (
                                  selectedGameStat.latest_bpo_roles.map((role: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                      <span className="text-white text-sm">{role.title || role}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-white text-sm">{selectedGameStat.latest_bpo_roles}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No roles data available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gamification */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6 ">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        Gamification
                      </h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Total XP</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.total_xp || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Badges Earned</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.badges_earned || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Latest Session XP</label>
                          <p className="text-white text-2xl font-bold text-white">{selectedGameStat.latest_session_xp || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cultural Metrics */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600/20">
                      <h3 className="text-xl font-bold text-white mb-6 ">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        Cultural Metrics
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Cultural Alignment Score</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.cultural_alignment_score || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Authenticity Score</label>
                          <p className="text-white text-3xl font-bold text-white">{selectedGameStat.authenticity_score || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-gray-900 border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Stat Record</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete the stat record for {deleteStatName}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteStat}
                disabled={deletingStats.includes(deleteStatId)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingStats.includes(deleteStatId) ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}