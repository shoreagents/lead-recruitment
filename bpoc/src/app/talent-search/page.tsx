'use client'

import { motion } from 'framer-motion'
import { Search, RefreshCw, User, Mail, Calendar, MapPin, Eye, Star, Users, Trophy, Filter, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/layout/Header'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Candidate {
  id: string
  name: string
  position: string
  location: string
  email: string
  joinDate: string
  resumeAvailable: boolean
  profileComplete: boolean
  avatar: string
  overallScore: number
  slug: string
  resumeSlug: string | null
  verified: boolean
  completedSteps?: number
}

export default function TalentSearchPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'highest-scores' | 'verified'>('all')
     const [stats, setStats] = useState([
     { label: "Total", count: 0, color: "bg-gradient-to-br from-blue-500 to-blue-600", icon: User },
     { label: "Verified Profile", count: 0, color: "bg-gradient-to-br from-green-500 to-green-600", icon: Star }
   ])

  // Function to determine rank based on overall score (matching leaderboards system)
  const getRank = (score: number) => {
    if (score >= 90 && score <= 100) return { rank: '💎 Diamond', color: 'text-cyan-200', bgColor: 'bg-cyan-400/30', borderColor: 'border-cyan-400/50' }
    if (score >= 75 && score <= 89) return { rank: '🥈 Platinum', color: 'text-slate-200', bgColor: 'bg-slate-400/30', borderColor: 'border-slate-400/50' }
    if (score >= 60 && score <= 74) return { rank: '🥇 Gold', color: 'text-yellow-200', bgColor: 'bg-yellow-400/30', borderColor: 'border-yellow-400/50' }
    if (score >= 40 && score <= 59) return { rank: '🥉 Silver', color: 'text-gray-200', bgColor: 'bg-gray-400/30', borderColor: 'border-gray-400/50' }
    if (score >= 0 && score <= 39) return { rank: '🏅 Bronze', color: 'text-orange-200', bgColor: 'bg-orange-400/30', borderColor: 'border-orange-400/50' }
    return { rank: 'None', color: 'text-gray-500', bgColor: 'bg-gray-600/20', borderColor: 'border-gray-600/30' }
  }

  // Fetch candidates data on component mount and when filter changes
  useEffect(() => {
    fetchCandidates()
  }, [filterType])

  // Filter candidates based on search term only (filtering is now handled by backend)
  useEffect(() => {
    let filtered = candidates

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCandidates(filtered)
  }, [searchTerm, candidates])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/talent-search?filter=${filterType}`)
      const data = await response.json()
      
      if (data.success) {
        setCandidates(data.candidates)
        setFilteredCandidates(data.candidates)
        
        // Update stats
        const verifiedCount = data.candidates.filter((candidate: any) => candidate.verified).length
        
        setStats([
          { label: "Total", count: data.total, color: "bg-gradient-to-br from-blue-500 to-blue-600", icon: User },
          { label: "Verified Profile", count: verifiedCount, color: "bg-gradient-to-br from-green-500 to-green-600", icon: Star }
        ])
      }
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchCandidates()
  }

  const handleViewProfile = (slug: string) => {
    router.push(`/${slug}`)
  }


  return (
    <>
      <Header />
      <div className="min-h-screen bg-black cyber-grid pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                     {/* Header */}
           <div className="mb-8">
             <div className="flex items-center gap-4">
               <Search className="w-8 h-8 text-cyan-400" />
               <div>
                 <h1 className="text-3xl font-bold text-white mb-2">Talent Search</h1>
                 <p className="text-gray-300">Browse our pool of qualified BPO talent</p>
               </div>
             </div>
           </div>

                     {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-300 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">{stat.count}</div>
                    </div>
                  </div>
                </CardContent>
                
                {/* Subtle background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>

                     {/* Search, Filter and Refresh */}
           <div className="flex gap-4 mb-8">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                               <Input 
                   placeholder="Search talents..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 bg-black/50 border-white/20 text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&:focus]:ring-0 [&:focus]:outline-none [&:focus]:border-white/20 [&:focus-visible]:border-white/20 [&:focus]:shadow-none [&:focus-visible]:shadow-none"
                 />
             </div>
             <Select value={filterType} onValueChange={(value: 'all' | 'highest-scores' | 'verified') => setFilterType(value)}>
               <SelectTrigger className="w-48 bg-black/50 border-white/20 text-white focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&:focus]:ring-0 [&:focus]:outline-none [&:focus]:border-white/20 [&:focus-visible]:border-white/20 [&:focus]:shadow-none [&:focus-visible]:shadow-none">
                 <Filter className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter by..." />
               </SelectTrigger>
               <SelectContent className="bg-gray-900 border-white/20 text-white">
                 <SelectItem value="all">All Talents</SelectItem>
                 <SelectItem value="highest-scores">Highest Scores</SelectItem>
                 <SelectItem value="verified">With Verified Badge</SelectItem>
               </SelectContent>
             </Select>
             <Button 
               className="bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
               onClick={handleRefresh}
               disabled={loading}
             >
               <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
               {loading ? 'Loading...' : 'Refresh'}
             </Button>
           </div>

                     {/* Candidates Grid */}
           {loading ? (
             <div className="text-center py-12">
               <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-gray-400">Loading qualified candidates...</p>
             </div>
           ) : filteredCandidates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 mb-2">No candidates found</p>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'No qualified candidates available yet'}
              </p>
            </div>
          ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredCandidates.map((candidate) => (
                                   <Card key={candidate.id} className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
                    {/* Profile Picture Header */}
                    <div className="relative h-32">
                      {candidate.avatar && candidate.avatar.startsWith('http') ? (
                        <img 
                          src={candidate.avatar} 
                          alt={candidate.name}
                          className={`w-24 h-24 rounded-full object-cover border-4 mx-auto mt-4 shadow-lg group-hover:scale-105 transition-transform duration-300 ${
                            getRank(candidate.overallScore).rank === '💎 Diamond' ? 'border-cyan-500/50' :
                            getRank(candidate.overallScore).rank === '🥈 Platinum' ? 'border-slate-400/60' :
                            getRank(candidate.overallScore).rank === '🥇 Gold' ? 'border-yellow-400' :
                            getRank(candidate.overallScore).rank === '🥉 Silver' ? 'border-gray-400/60' :
                            getRank(candidate.overallScore).rank === '🏅 Bronze' ? 'border-orange-400' :
                            'border-white/20'
                          }`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mt-4 shadow-lg group-hover:scale-105 transition-transform duration-300 border-4 bg-gradient-to-br from-cyan-500 to-purple-600 ${
                        getRank(candidate.overallScore).rank === '💎 Diamond' ? 'border-cyan-500/50' :
                        getRank(candidate.overallScore).rank === '🥈 Platinum' ? 'border-slate-400/60' :
                        getRank(candidate.overallScore).rank === '🥇 Gold' ? 'border-yellow-400' :
                        getRank(candidate.overallScore).rank === '🥉 Silver' ? 'border-gray-400/60' :
                        getRank(candidate.overallScore).rank === '🏅 Bronze' ? 'border-orange-400' :
                        'border-white/20'
                      } ${candidate.avatar && candidate.avatar.startsWith('http') ? 'hidden' : ''}`}>
                        {candidate.name.split(' ')[0][0].toUpperCase()}
                      </div>
                    </div>

                    <CardContent className="p-6 -mt-8 relative z-10">
                      {/* First Name and Username */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">{candidate.name.split(' ')[0]}</h3>
                          {candidate.verified && candidate.completedSteps === 5 && (
                            <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-300/30 relative overflow-hidden">
                              {/* Shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
                              <Check className="w-4 h-4 text-white font-bold relative z-10 drop-shadow-lg" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300 mb-2">@{candidate.slug}</p>
                      </div>

                      {/* Overall Score and Rank Badges */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                            Score: {candidate.overallScore}
                          </span>
                        </div>
                        {(() => {
                          const rankInfo = getRank(candidate.overallScore)
                          if (rankInfo.rank !== 'None') {
                            return (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${rankInfo.bgColor} ${rankInfo.color} border ${rankInfo.borderColor}`}>
                                {rankInfo.rank}
                              </span>
                            )
                          }
                          return null
                        })()}
                      </div>

                      {/* Location and Join Date */}
                      <div className="flex justify-center items-center gap-8 mb-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>Joined {candidate.joinDate}</span>
                        </div>
                      </div>


                      {/* Action Button */}
                      <div className="flex justify-center">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                          onClick={() => handleViewProfile(candidate.slug)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                    
                    {/* Subtle background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
               ))}
             </div>
          )}
        </div>
      </div>
    </>
  )
}