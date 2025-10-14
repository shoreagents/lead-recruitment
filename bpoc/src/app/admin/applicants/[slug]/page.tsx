'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getSessionToken } from '@/lib/auth-helpers'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/toast'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Users, 
  Building2, 
  Calendar, 
  Eye, 
  User,
  FileText,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  Zap,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react'

function extractIdFromSlug(slug: string): string | null {
  // Expect format: some-slug-{id}
  const parts = slug.split('-')
  const last = parts[parts.length - 1]
  return /^[0-9]+$/.test(last) ? last : null
}

export default function ApplicantsJobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = String(params.slug || '')
  const id = extractIdFromSlug(slug)

  const [jobHeader, setJobHeader] = useState<{ title: string; company: string; applicants: number } | null>(null)
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
	const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'qualified' | 'for verification' | 'verified' | 'initial interview' | 'final interview' | 'not qualified' | 'passed' | 'rejected' | 'withdrawn' | 'hired' | 'closed'>('all')
	  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'status_asc' | 'status_desc'>('newest')
  const [viewSlug, setViewSlug] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Admin functionality states
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [tempStatus, setTempStatus] = useState<string>('')
  const [deletingApplication, setDeletingApplication] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [removingApplication, setRemovingApplication] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      if (!id) { setError('Invalid job'); return }
      try {
        setLoading(true)
        setError(null)
        const jobRes = await fetch(`/api/jobs/active/${id}`, { cache: 'no-store' })
        if (jobRes.ok) {
          const jd = await jobRes.json()
          setJobHeader({ title: jd.job?.title || 'Job', company: jd.job?.company || '', applicants: jd.job?.applicants ?? 0 })
        }
        const token = await getSessionToken()
        const res = await fetch(`/api/admin/applicants?jobId=${id}`, { cache: 'no-store', headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (res.ok) {
          const data = await res.json()
          setApps(data.applications || [])
        }
      } catch (e) {
        setError('Failed to load applicants')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

	const visibleApps = (() => {
		const q = search.trim().toLowerCase()
		let list = apps.filter((a: any) => {
			const name = (a.user?.full_name || a.user?.email || '').toLowerCase()
			const matchesQuery = !q || name.includes(q)
			const matchesStatus = statusFilter === 'all' || a.status === statusFilter
			return matchesQuery && matchesStatus
		})
		list = list.sort((a: any, b: any) => {
			switch (sortBy) {
				case 'newest':
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				case 'oldest':
					return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				case 'name_asc':
					return String(a.user?.full_name || a.user?.email || '').localeCompare(String(b.user?.full_name || b.user?.email || ''))
				case 'name_desc':
					return String(b.user?.full_name || b.user?.email || '').localeCompare(String(a.user?.full_name || a.user?.email || ''))
				case 'status_asc':
					return String(a.status).localeCompare(String(b.status))
				case 'status_desc':
					return String(b.status).localeCompare(String(a.status))
				default:
					return 0
			}
		})
		return list
	})()

  // Pagination logic
  const totalPages = Math.ceil(visibleApps.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentApps = visibleApps.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, sortBy])

  const getStatusStats = () => {
    const stats = {
      submitted: 0,
      qualified: 0,
      'for verification': 0,
      verified: 0,
      'initial interview': 0,
      'final interview': 0,
      'not qualified': 0,
      passed: 0,
      rejected: 0,
      withdrawn: 0,
      hired: 0,
      closed: 0
    }
    
    apps.forEach(app => {
      if (app.status && stats.hasOwnProperty(app.status)) {
        stats[app.status as keyof typeof stats]++
      }
    })
    
    return stats
  }

  const statusStats = getStatusStats()
  const totalApplicants = apps.length
  const activeApplicants = apps.filter(app => !['rejected', 'withdrawn', 'hired', 'not qualified', 'closed'].includes(app.status)).length

  // Admin functions
  const handleStatusEdit = (applicationId: string, currentStatus: string) => {
    setEditingStatus(applicationId)
    setTempStatus(currentStatus)
  }

  const handleStatusSave = async (applicationId: string) => {
    try {
      setUpdatingStatus(applicationId)
      const token = await getSessionToken()
      
      const response = await fetch('/api/admin/applicants', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          applicationId,
          status: tempStatus
        })
      })

      if (response.ok) {
        // Update local state
        setApps(prevApps => 
          prevApps.map(app => 
            app.id === applicationId 
              ? { ...app, status: tempStatus }
              : app
          )
        )
        
        setEditingStatus(null)
        setTempStatus('')
        toast.success('Application status updated successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Error updating status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleStatusCancel = () => {
    setEditingStatus(null)
    setTempStatus('')
  }

  const handleRemoveApplication = async (applicationId: string) => {
    try {
      setRemovingApplication(applicationId)
      const token = await getSessionToken()
      
      const response = await fetch('/api/admin/applicants', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          applicationId
        })
      })

      if (response.ok) {
        // Remove from local state
        setApps(prevApps => prevApps.filter(app => app.id !== applicationId))
        
        setDeletingApplication(null)
        toast.success('Application removed successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to remove application')
      }
    } catch (error) {
      console.error('Error removing application:', error)
      toast.error('Error removing application')
    } finally {
      setRemovingApplication(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Loading..." description="Loading applicants data">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-16" />
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
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-48" />
              </div>
            </CardContent>
          </Card>

          {/* Applicants Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
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
    <AdminLayout 
      title={jobHeader ? `${jobHeader.title}` : 'Applicants'} 
      description={jobHeader ? `${jobHeader.company} • ${totalApplicants} applicants` : ''}
    >
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
        {error && (
          <Card className="glass-card border-red-500/30">
            <CardContent className="p-6">
              <div className="text-center text-red-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-lg font-medium">Error loading applicants</p>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Applicants</p>
                  <p className="text-2xl font-bold text-white">{totalApplicants}</p>
                  <p className="text-xs text-green-400">All applications received</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-white">{activeApplicants}</p>
                  <p className="text-xs text-green-400">Currently in process</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {statusStats.qualified + statusStats['for verification'] + statusStats.verified + statusStats['initial interview'] + statusStats['final interview']}
                  </p>
                  <p className="text-xs text-green-400">Under review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Hired</p>
                  <p className="text-2xl font-bold text-white">{statusStats.hired}</p>
                  <p className="text-xs text-green-400">Successfully placed</p>
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
                  placeholder="Search applicant name or email..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="for verification">For Verification</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="initial interview">Initial Interview</SelectItem>
                  <SelectItem value="final interview">Final Interview</SelectItem>
                  <SelectItem value="not qualified">Not Qualified</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name_asc">Name (A→Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z→A)</SelectItem>
                  <SelectItem value="status_asc">Status (A→Z)</SelectItem>
                  <SelectItem value="status_desc">Status (Z→A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-white">Applicants</h2>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              {visibleApps.length} results
            </Badge>
          </div>
          {(search || statusFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
              }}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Applicants Grid */}
        {visibleApps.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-12">
              <div className="text-center text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No applicants found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
				</div>
			</CardContent>
		</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentApps.map((app: any) => (
              <Card 
                key={app.id} 
                className="glass-card hover:bg-white/5 transition-all duration-200 border-white/10 hover:border-white/20 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <Avatar className="w-14 h-14 border-2 border-white/20">
                      <AvatarImage src={app.user?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                        {(app.user?.full_name || app.user?.email || 'A').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Applicant Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white text-lg truncate group-hover:text-blue-300 transition-colors">
                            {app.user?.full_name || app.user?.email || 'Applicant'}
                          </h3>
                          <p className="text-sm text-gray-300 truncate">
                            {app.user?.email || 'No email'}
                          </p>
                        </div>
                        
                        {/* Status Badge with Edit/View Options */}
                        <div className="flex items-center space-x-2">
                          {editingStatus === app.id ? (
                            <div className="flex items-center space-x-2">
                              <Select value={tempStatus} onValueChange={setTempStatus}>
                                <SelectTrigger className="w-32 h-8 bg-white/5 border-white/20 text-white text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="submitted">Submitted</SelectItem>
                                  <SelectItem value="qualified">Qualified</SelectItem>
                                  <SelectItem value="for verification">For Verification</SelectItem>
                                  <SelectItem value="verified">Verified</SelectItem>
                                  <SelectItem value="initial interview">Initial Interview</SelectItem>
                                  <SelectItem value="final interview">Final Interview</SelectItem>
                                  <SelectItem value="not qualified">Not Qualified</SelectItem>
                                  <SelectItem value="passed">Passed</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                  <SelectItem value="hired">Hired</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                onClick={() => handleStatusSave(app.id)}
                                disabled={updatingStatus === app.id}
                                className="h-8 w-8 p-0 bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                              >
                                {updatingStatus === app.id ? (
                                  <Skeleton className="w-3 h-3 rounded-full" />
                                ) : (
                                  <Save className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleStatusCancel}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Badge className={`capitalize whitespace-nowrap ${statusClass(app.status)}`}>
                                {getStatusIcon(app.status)}
                                <span className="ml-1">{app.status || 'submitted'}</span>
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusEdit(app.id, app.status)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-blue-300 hover:bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-white/10 mb-3" />

                      {/* Additional Details - Flexible content area */}
                      <div className="flex-1 space-y-2 text-sm mb-3">
                        {app.user?.location && (
                          <div className="flex items-center space-x-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-white">{app.user.location}</span>
                          </div>
                        )}
                        
                        {app.resume_title && (
                          <div className="flex items-center space-x-2 text-gray-300">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-white truncate">{app.resume_title}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">Applied {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons - Always at bottom */}
                      <div className="flex space-x-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewSlug(app.resume_slug)}
                          className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 group-hover:text-blue-300 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Resume
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingApplication(app.id)}
                          className="px-3 bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/40 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, visibleApps.length)} of {visibleApps.length} applicants
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
          </div>
        )}

        {/* Resume Preview Dialog */}
        <Dialog open={!!viewSlug} onOpenChange={(open) => { if (!open) setViewSlug(null) }}>
          <DialogContent className="w-[96vw] sm:max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-white">Resume Preview</DialogTitle>
            </DialogHeader>
            <div className="h-[75vh] w-full rounded-lg overflow-hidden border border-white/20">
              {viewSlug && (
                <iframe 
                  src={`/${viewSlug}`} 
                  className="w-full h-full" 
                  title="Resume Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Remove Application Confirmation Dialog */}
        <AlertDialog open={!!deletingApplication} onOpenChange={(open) => { if (!open) setDeletingApplication(null) }}>
          <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Remove Application</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to remove this application? This action cannot be undone and will permanently delete the application record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingApplication && handleRemoveApplication(deletingApplication)}
                disabled={removingApplication === deletingApplication}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {removingApplication === deletingApplication ? 'Removing...' : 'Remove Application'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}

function statusClass(status: string): string {
  const s = String(status || '').toLowerCase()
  if (s === 'hired') return 'bg-green-500/20 text-green-300 border-green-500/30'
  if (s === 'closed') return 'bg-slate-600/20 text-slate-300 border-slate-600/30'
  if (s === 'rejected' || s === 'not qualified') return 'bg-red-500/20 text-red-300 border-red-500/30'
  if (s === 'passed') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  if (s === 'initial interview' || s === 'final interview') return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  if (s === 'verified') return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  if (s === 'qualified') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  if (s === 'for verification') return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  if (s === 'withdrawn') return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
}

function getStatusIcon(status: string): React.ReactNode {
  const s = String(status || '').toLowerCase()
  switch (s) {
    case 'hired': return <CheckCircle className="w-3 h-3" />
    case 'closed': return <Pause className="w-3 h-3" />
    case 'rejected': case 'not qualified': return <XCircle className="w-3 h-3" />
    case 'passed': return <CheckCircle className="w-3 h-3" />
    case 'initial interview': case 'final interview': return <Play className="w-3 h-3" />
    case 'verified': return <CheckCircle className="w-3 h-3" />
    case 'qualified': return <Eye className="w-3 h-3" />
    case 'for verification': return <AlertCircle className="w-3 h-3" />
    case 'withdrawn': return <Pause className="w-3 h-3" />
    default: return <Clock className="w-3 h-3" />
  }

}

