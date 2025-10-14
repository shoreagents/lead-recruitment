'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Brain, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  Sparkles,
  Trophy,
  RefreshCw,
  Eye,
  Search,
  X,
  Star,
  TrendingDown,
  Award,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react'

interface Analysis {
  id: string
  user_id: string
  overall_score: number
  ats_compatibility_score: number
  content_quality_score: number
  professional_presentation_score: number
  skills_alignment_score: number
  improved_summary: string
  key_strengths: string[]
  strengths_analysis: any
  salary_analysis: any
  career_path: any
  section_analysis: any
  created_at: string
  updated_at: string
  user_name: string
  user_email: string
  user_avatar?: string
}

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [scoreFilter, setScoreFilter] = useState<string>('all')
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [stats, setStats] = useState({
    totalAnalyses: 0,
    completedAnalyses: 0,
    failedAnalyses: 0,
    processingAnalyses: 0,
    averageScore: 0,
    successRate: 0
  })

  // Fetch analyses from database
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/analysis')
        const data = await response.json()
        
        if (response.ok) {
          const validatedAnalyses = data.analyses.map(validateAnalysisData)
          setAnalyses(validatedAnalyses)
          setStats({
            totalAnalyses: data.total,
            completedAnalyses: data.total,
            failedAnalyses: 0,
            processingAnalyses: 0,
            averageScore: data.averageScore,
            successRate: 100
          })
        } else {
          console.error('Failed to fetch analyses:', data.error)
        }
      } catch (error) {
        console.error('Error fetching analyses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [])

  // Filter analyses based on search term and score filter
  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = 
      analysis.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesScore = scoreFilter === 'all' || 
      (scoreFilter === 'excellent' && analysis.overall_score >= 80) ||
      (scoreFilter === 'good' && analysis.overall_score >= 60 && analysis.overall_score < 80) ||
      (scoreFilter === 'needs-improvement' && analysis.overall_score < 60)
    
    return matchesSearch && matchesScore
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAnalyses = filteredAnalyses.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, scoreFilter])

  const refreshAnalyses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analysis')
      const data = await response.json()
      
      if (response.ok) {
        const validatedAnalyses = data.analyses.map(validateAnalysisData)
        setAnalyses(validatedAnalyses)
        setStats({
          totalAnalyses: data.total,
          completedAnalyses: data.total,
          failedAnalyses: 0,
          processingAnalyses: 0,
          averageScore: data.averageScore,
          successRate: 100
        })
      } else {
        console.error('Failed to refresh analyses:', data.error)
      }
    } catch (error) {
      console.error('Error refreshing analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Helper function to validate and format analysis data
  const validateAnalysisData = (analysis: Analysis) => {
    // Ensure key_strengths is always an array
    if (!Array.isArray(analysis.key_strengths)) {
      analysis.key_strengths = analysis.key_strengths ? [String(analysis.key_strengths)] : []
    }

    // Ensure strengths_analysis is an object with proper structure
    if (!analysis.strengths_analysis || typeof analysis.strengths_analysis !== 'object') {
      analysis.strengths_analysis = {}
    }

    // Ensure salary_analysis is an object with proper structure
    if (!analysis.salary_analysis || typeof analysis.salary_analysis !== 'object') {
      analysis.salary_analysis = {}
    }

    // Ensure career_path is an object with proper structure
    if (!analysis.career_path || typeof analysis.career_path !== 'object') {
      analysis.career_path = {}
    }

    // Ensure section_analysis is an object with proper structure
    if (!analysis.section_analysis || typeof analysis.section_analysis !== 'object') {
      analysis.section_analysis = {}
    }

    return analysis
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const handleViewAnalysis = (analysis: Analysis) => {
    console.log('handleViewAnalysis called with:', analysis)
    console.log('Strengths Analysis:', analysis.strengths_analysis)
    console.log('Salary Analysis:', analysis.salary_analysis)
    console.log('Career Path:', analysis.career_path)
    console.log('Section Analysis:', analysis.section_analysis)
    try {
      setSelectedAnalysis(analysis)
      setAnalysisModalOpen(true)
      console.log('Modal state updated - selectedAnalysis:', analysis, 'analysisModalOpen:', true)
    } catch (error) {
      console.error('Error in handleViewAnalysis:', error)
    }
  }

  const dashboardCards = [
    {
      title: 'Total Analyses',
      value: stats.totalAnalyses,
      icon: BarChart3,
      color: 'from-cyan-500 to-blue-600',
      description: 'All time analyses',
      trend: '+12% this week'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      description: 'Completed successfully',
      trend: '+2.1% this month'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      description: 'Overall performance',
      trend: '+5.3% improvement'
    },
    {
      title: 'Active Processing',
      value: stats.processingAnalyses,
      icon: Activity,
      color: 'from-yellow-500 to-orange-600',
      description: 'Currently processing',
      trend: '-8% from yesterday'
    }
  ]

  return (
    <AdminLayout title="AI Analysis Management" description="Manage and view AI-powered resume analysis results">
      <div className="space-y-6">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card hover:bg-white/5 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{card.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                      <p className="text-xs text-green-400 mt-2">{card.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-transparent text-white hover:bg-white/10">
                      {scoreFilter === 'all' ? 'All Scores' : 
                       scoreFilter === 'excellent' ? 'Excellent (80+)' :
                       scoreFilter === 'good' ? 'Good (60-79)' :
                       'Needs Improvement (&lt;60)'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-white/10">
                    <DropdownMenuItem 
                      onClick={() => setScoreFilter('all')}
                      className="text-white hover:bg-white/10"
                    >
                      All Scores
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => setScoreFilter('excellent')}
                      className="text-white hover:bg-white/10"
                    >
                      Excellent (80+)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setScoreFilter('good')}
                      className="text-white hover:bg-white/10"
                    >
                      Good (60-79)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setScoreFilter('needs-improvement')}
                      className="text-white hover:bg-white/10"
                    >
                      Needs Improvement (&lt;60)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700" onClick={refreshAnalyses}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            ) : filteredAnalyses.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No analysis results found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white">User</TableHead>
                      <TableHead className="text-white">Overall Score</TableHead>
                      <TableHead className="text-white">ATS Compatibility</TableHead>
                      <TableHead className="text-white">Content Quality</TableHead>
                      <TableHead className="text-white">Professional Presentation</TableHead>
                      <TableHead className="text-white">Skills Alignment</TableHead>
                      <TableHead className="text-white">Created At</TableHead>
                      <TableHead className="text-white">Updated At</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAnalyses.map((analysis) => (
                      <TableRow key={analysis.id} className="border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => handleViewAnalysis(analysis)}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage 
                                src={analysis.user_avatar} 
                                alt={analysis.user_name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-xs">
                                {getInitials(analysis.user_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium text-sm">{analysis.user_name}</p>
                              <p className="text-gray-400 text-xs">{analysis.user_email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getScoreBadge(analysis.overall_score)}>
                            {analysis.overall_score}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(analysis.ats_compatibility_score)}>
                            {analysis.ats_compatibility_score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(analysis.content_quality_score)}>
                            {analysis.content_quality_score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(analysis.professional_presentation_score)}>
                            {analysis.professional_presentation_score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(analysis.skills_alignment_score)}>
                            {analysis.skills_alignment_score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">
                            {formatDate(analysis.created_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">
                            {formatDate(analysis.updated_at)}
                          </span>
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
                                className="text-red-400"
                                onClick={() => {
                                  // Add delete functionality here
                                  console.log('Delete analysis:', analysis.id)
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredAnalyses.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAnalyses.length)} of {filteredAnalyses.length} analyses
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
          </CardContent>
        </Card>

        {/* Analysis Details Modal */}
        {analysisModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setAnalysisModalOpen(false)}>
            <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-6xl w-full mx-4 h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="text-white font-semibold text-lg">AI Analysis Details</div>
                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white" onClick={() => setAnalysisModalOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6 text-sm text-gray-300">
              
              {selectedAnalysis && (
                <>
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-400">User</div>
                      <div className="text-white">{selectedAnalysis.user_name} <span className="text-gray-400">{selectedAnalysis.user_email}</span></div>
                    </div>
                    <div>
                      <div className="text-gray-400">Analysis Created</div>
                      <div className="text-white">{formatDate(selectedAnalysis.created_at)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Overall Score</div>
                      <div className="text-white">{selectedAnalysis.overall_score || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">ATS Compatibility</div>
                      <div className="text-white">{selectedAnalysis.ats_compatibility_score || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Content Quality</div>
                      <div className="text-white">{selectedAnalysis.content_quality_score || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Professional Presentation</div>
                      <div className="text-white">{selectedAnalysis.professional_presentation_score || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Skills Alignment</div>
                      <div className="text-white">{selectedAnalysis.skills_alignment_score || 'N/A'}</div>
                    </div>
                    {selectedAnalysis.improved_summary && (
                      <div>
                        <div className="text-gray-400 mb-2">Improved Summary</div>
                        <div className="text-white whitespace-pre-wrap p-3 bg-white/5 rounded-lg">{selectedAnalysis.improved_summary}</div>
                      </div>
                    )}
                    {selectedAnalysis.key_strengths && selectedAnalysis.key_strengths.length > 0 && (
                      <div>
                        <div className="text-gray-400 mb-2">Key Strengths</div>
                        <div className="space-y-2">
                          {selectedAnalysis.key_strengths.map((strength: string, index: number) => (
                            <div key={index} className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <div className="text-green-400 text-sm">{strength}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedAnalysis.section_analysis && Object.keys(selectedAnalysis.section_analysis).length > 0 && (
                      <div>
                        <div className="text-gray-400 mb-2">Section Analysis</div>
                        <div className="space-y-2">
                          {Object.entries(selectedAnalysis.section_analysis).map(([section, analysis]) => (
                            <div key={section} className="p-3 bg-white/5 rounded-lg">
                              <div className="text-white font-medium capitalize mb-2">{section.replace(/_/g, ' ')}</div>
                              {typeof analysis === 'object' && analysis !== null ? (
                                <div className="space-y-2">
                                  {Object.entries(analysis).map(([key, value]) => (
                                    <div key={key} className="text-sm">
                                      <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                                      <span className="text-gray-300 ml-2">{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-300 text-sm">{String(analysis)}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {selectedAnalysis.strengths_analysis && Object.keys(selectedAnalysis.strengths_analysis).length > 0 && (
                      <div>
                        <div className="text-gray-400 mb-2">Strengths Analysis</div>
                        <div className="space-y-2">
                          {Object.entries(selectedAnalysis.strengths_analysis).map(([key, value]) => (
                            <div key={key} className="p-3 bg-white/5 rounded-lg">
                              <div className="text-white font-medium capitalize mb-1">{key.replace(/_/g, ' ')}</div>
                              <div className="text-gray-300 text-sm">{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedAnalysis.salary_analysis && Object.keys(selectedAnalysis.salary_analysis).length > 0 && (
                      <div>
                        <div className="text-gray-400 mb-2">Salary Analysis</div>
                        <div className="space-y-2">
                          {Object.entries(selectedAnalysis.salary_analysis).map(([key, value]) => (
                            <div key={key} className="p-3 bg-white/5 rounded-lg">
                              <div className="text-white font-medium capitalize mb-1">{key.replace(/_/g, ' ')}</div>
                              {Array.isArray(value) ? (
                                <div className="space-y-1">
                                  {value.map((item, index) => (
                                    <div key={index} className="text-gray-300 text-sm">• {String(item)}</div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-300 text-sm">{String(value)}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedAnalysis.career_path && Object.keys(selectedAnalysis.career_path).length > 0 && (
                      <div>
                        <div className="text-gray-400 mb-2">Career Path</div>
                        <div className="space-y-2">
                          {Object.entries(selectedAnalysis.career_path).map(([key, value]) => (
                            <div key={key} className="p-3 bg-white/5 rounded-lg">
                              <div className="text-white font-medium capitalize mb-1">{key.replace(/_/g, ' ')}</div>
                              {Array.isArray(value) ? (
                                <div className="space-y-1">
                                  {value.map((item, index) => (
                                    <div key={index} className="text-gray-300 text-sm">• {String(item)}</div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-300 text-sm">{String(value)}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}