"use client"

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Search, 
  Users, 
  Building2, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  Briefcase,
  MapPin,
  Filter,
  SortAsc,
  Eye,
  AlertTriangle,
  BarChart3
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type JobSummary = {
  id: string
  company: string
  title: string
  applicants: number
  priority: 'low' | 'medium' | 'high'
  application_deadline?: string | null
  experience_level?: string | null
  work_arrangement?: string | null
  industry?: string | null
  department?: string | null
}

type Application = {
  id: string
  user_id: string
  job_id: string
  resume_slug: string
  status: string
  created_at: string
  user?: { email?: string, full_name?: string }
}

export default function Page() {
  const [jobs, setJobs] = useState<JobSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [sortBy, setSortBy] = useState<'applicants_desc' | 'deadline_asc' | 'deadline_desc' | 'priority_desc' | 'priority_asc'>('applicants_desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError(null)
        // Use public active jobs and filter by applicants > 0
        const res = await fetch('/api/jobs/active', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load jobs')
        const data = await res.json()
        const list: JobSummary[] = (data.jobs || [])
          .filter((j: any) => (j.applicants ?? 0) > 0)
          .map((j: any) => ({ 
            id: String(j.id), 
            company: j.company, 
            title: j.title, 
            applicants: Number(j.applicants || 0), 
            priority: (j.priority || 'medium'),
            application_deadline: j.application_deadline || null,
            experience_level: j.experience_level || null,
            work_arrangement: j.work_arrangement || null,
            industry: j.industry || null,
            department: j.department || null
          }))
        setJobs(list)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const openJob = (job: JobSummary) => {
    const slug = `${slugify(job.company)}-${slugify(job.title)}-${job.id}`
    router.push(`/admin/applicants/${encodeURIComponent(slug)}`)
  }

  const visibleJobs = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = jobs.filter(j => {
      const matchesQuery = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
      const matchesPriority = priorityFilter === 'all' || j.priority === priorityFilter
      return matchesQuery && matchesPriority
    })
    const toNum = (d?: string | null) => (d ? new Date(d).getTime() : Number.POSITIVE_INFINITY)
    list = list.sort((a, b) => {
      switch (sortBy) {
        case 'applicants_desc':
          return (b.applicants || 0) - (a.applicants || 0)
        case 'deadline_asc':
          return toNum(a.application_deadline) - toNum(b.application_deadline)
        case 'deadline_desc':
          return toNum(b.application_deadline) - toNum(a.application_deadline)
        case 'priority_desc': {
          const rank = { high: 3, medium: 2, low: 1 } as const
          return (rank[b.priority] - rank[a.priority])
        }
        case 'priority_asc': {
          const rank = { high: 3, medium: 2, low: 1 } as const
          return (rank[a.priority] - rank[b.priority])
        }
        default:
          return 0
      }
    })
    return list
  }, [jobs, search, priorityFilter, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(visibleJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentJobs = visibleJobs.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, priorityFilter, sortBy])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥'
      case 'medium': return '⚡'
      case 'low': return '💡'
      default: return '📋'
    }
  }

  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0)
  const activeJobs = jobs.length
  const highPriorityJobs = jobs.filter(job => job.priority === 'high').length

  if (loading) {
  return (
    <AdminLayout title="Applicants" description="Manage and review applicants">
      <div className="space-y-6">
          {/* Header Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters Skeleton */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </CardContent>
          </Card>

          {/* Jobs Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-card">
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Applicants" description="Manage and review applicants">
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">Total Applicants</p>
                  <p className="text-3xl font-bold text-white">{totalApplicants}</p>
                  <p className="text-xs text-cyan-200">Across all jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">Active Jobs</p>
                  <p className="text-3xl font-bold text-white">{activeJobs}</p>
                  <p className="text-xs text-green-200">Currently open</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">High Priority</p>
                  <p className="text-3xl font-bold text-white">{highPriorityJobs}</p>
                  <p className="text-xs text-yellow-200">Urgent positions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">Avg. Applicants</p>
                  <p className="text-3xl font-bold text-white">
                    {activeJobs > 0 ? Math.round(totalApplicants / activeJobs) : 0}
                  </p>
                  <p className="text-xs text-purple-200">Per job posting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Filters & Search</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
                  placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20"
                />
              </div>
              
              <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                <SelectTrigger className="w-40 bg-white/5 border-transparent text-white focus:border-transparent focus:ring-0">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48 bg-white/5 border-transparent text-white focus:border-transparent focus:ring-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="applicants_desc">Most Applicants</SelectItem>
                  <SelectItem value="deadline_asc">Deadline (Soonest)</SelectItem>
                  <SelectItem value="deadline_desc">Deadline (Latest)</SelectItem>
                  <SelectItem value="priority_desc">Priority (High→Low)</SelectItem>
                  <SelectItem value="priority_asc">Priority (Low→High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-white">Job Positions</h2>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              {visibleJobs.length} results
            </Badge>
          </div>
          {search || priorityFilter !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setPriorityFilter('all')
              }}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Clear filters
            </Button>
          )}
        </div>

        {error ? (
          <Card className="glass-card border-red-500/30">
            <CardContent className="p-6">
              <div className="text-center text-red-400">
                <p className="text-lg font-medium">Error loading jobs</p>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : visibleJobs.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-12">
              <div className="text-center text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No jobs found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map(job => (
                <Card 
                  key={job.id} 
                  className="glass-card hover:bg-white/5 transition-all duration-200 cursor-pointer group border-white/10 hover:border-white/20"
                  onClick={() => openJob(job)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-colors">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-1 flex items-center space-x-2">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`${getPriorityColor(job.priority)} border`}
                        >
                          <span className="mr-1">{getPriorityIcon(job.priority)}</span>
                          {job.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Applicants Count */}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Users className="w-3 h-3 mr-1" />
                        {job.applicants} applicant{job.applicants !== 1 ? 's' : ''}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {job.application_deadline && (
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-white">
                            {new Date(job.application_deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {job.experience_level && (
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-white capitalize">{job.experience_level}</span>
                        </div>
                      )}
                      {job.work_arrangement && (
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-white capitalize">{job.work_arrangement}</span>
                        </div>
                      )}
                      {job.industry && (
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{job.industry}</span>
                        </div>
                      )}
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {visibleJobs.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, visibleJobs.length)} of {visibleJobs.length} jobs
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
          </>
        )}

        {/* Clicking a job navigates to /admin/applicants/[id] for details */}
      </div>
    </AdminLayout>
  )
}


