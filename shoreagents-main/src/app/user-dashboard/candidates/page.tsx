"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  Filter,
  Star,
  Heart,
  MessageCircle,
  Eye,
  Download,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getEmployeeCardData } from '@/lib/api'
import { EmployeeCardData } from '@/types/api'

export default function CandidatesPage() {
  const { user } = useUserAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [candidates, setCandidates] = useState<EmployeeCardData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real candidates from BPOC API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        console.log('🔄 Fetching candidates from BPOC API...')
        setLoading(true)
        const data = await getEmployeeCardData()
        console.log('✅ Fetched candidates:', data.length)
        setCandidates(data)
      } catch (error) {
        console.error('❌ Error fetching candidates:', error)
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  const handleFavorite = (candidateId: string) => {
    setFavorites(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.user.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'available' && candidate.user.work_status === 'Available') ||
                         (selectedFilter === 'favorites' && favorites.includes(candidate.user.id))
    return matchesSearch && matchesFilter
  })

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Candidates</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredCandidates.length} candidates found
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header */}
            <div className="grid gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Browse Candidates</h2>
                <p className="text-muted-foreground">
                  Find the perfect talent for your business needs
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates by name or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('all')}
                  className={selectedFilter === 'all' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === 'available' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('available')}
                  className={selectedFilter === 'available' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  Available
                </Button>
                <Button
                  variant={selectedFilter === 'favorites' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('favorites')}
                  className={selectedFilter === 'favorites' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full border-2 border-lime-600 border-t-transparent w-8 h-8" />
                <span className="ml-3 text-gray-600">Loading candidates...</span>
              </div>
            )}

            {/* Candidates Grid - 4 Column Portrait Layout */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCandidates.map((candidate) => (
                  <Card key={candidate.user.id} className="hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
                    {/* Portrait Header with Avatar */}
                    <CardHeader className="pb-3 text-center relative">
                      <div className="flex flex-col items-center space-y-2">
                        {/* Large Avatar */}
                        <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center shadow-sm">
                          {candidate.user.avatar ? (
                            <img 
                              src={candidate.user.avatar} 
                              alt={candidate.user.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="w-8 h-8 text-lime-600" />
                          )}
                        </div>
                        
                        {/* Name and Position */}
                        <div className="text-center min-h-0">
                          <CardTitle className="text-base font-semibold leading-tight truncate">{candidate.user.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{candidate.user.position}</p>
                        </div>
                        
                        {/* Favorite Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFavorite(candidate.user.id)}
                          className="absolute top-2 right-2 p-1 h-6 w-6"
                        >
                          <Heart 
                            className={`w-3 h-3 ${
                              favorites.includes(candidate.user.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {/* Content */}
                    <CardContent className="flex-1 flex flex-col space-y-2 px-3 pb-3 min-h-0">
                      {/* AI Analysis Score */}
                      {candidate.aiAnalysis && (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">{candidate.aiAnalysis.overall_score.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">AI</span>
                        </div>
                      )}

                      {/* Location */}
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-muted-foreground text-center truncate">{candidate.user.location}</span>
                      </div>

                      {/* Work Status */}
                      <div className="flex items-center justify-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          candidate.user.work_status === 'Available' ? 'bg-green-500' : 
                          candidate.user.work_status === 'Busy' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-xs text-muted-foreground truncate">
                          {candidate.user.work_status || 'Unknown'}
                        </span>
                      </div>

                      {/* Skills from AI Analysis */}
                      {candidate.aiAnalysis?.key_strengths && candidate.aiAnalysis.key_strengths.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1">
                          {candidate.aiAnalysis.key_strengths.slice(0, 1).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                              {skill.length > 15 ? skill.substring(0, 15) + '...' : skill}
                            </Badge>
                          ))}
                          {candidate.aiAnalysis.key_strengths.length > 1 && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              +{candidate.aiAnalysis.key_strengths.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Bio Preview */}
                      {candidate.user.bio && (
                        <p className="text-xs text-muted-foreground text-center line-clamp-2 flex-1 min-h-0">
                          {candidate.user.bio}
                        </p>
                      )}

                      {/* Actions - Fixed at bottom */}
                      <div className="flex flex-col gap-1.5 pt-2 mt-auto">
                        <Button 
                          size="sm" 
                          className="w-full bg-lime-600 hover:bg-lime-700 text-white text-xs h-8"
                          onClick={() => window.open(`/employee/${candidate.user.id}`, '_blank')}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-xs h-8"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredCandidates.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFilter('all')
                  }}
                  className="bg-lime-600 hover:bg-lime-700"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}
