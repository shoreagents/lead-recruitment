'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  MoreHorizontal, 
  Download, 
  Eye, 
  Trash2,
  Calendar,
  User,
  Mail,
  File,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import AdminLayout from '@/components/layout/AdminLayout'

interface Resume {
  id: string
  user_id: string
  resume_title: string
  template_used: string
  view_count: number
  created_at: string
  updated_at: string
  user_name: string
  user_email: string
  user_avatar?: string
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [previewResume, setPreviewResume] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingResumes, setDeletingResumes] = useState<Set<string>>(new Set())
  const [forceDeleteMode, setForceDeleteMode] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortOrder, setSortOrder] = useState<string>('latest')

  // Fetch resumes from database
  const fetchResumes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/resumes?t=${Date.now()}`, { cache: 'no-store' })
      const data = await response.json()
      
      if (response.ok) {
        console.log('📋 Fetched resumes:', data.resumes);
        console.log('📋 First resume slug:', data.resumes[0]?.resume_slug);
        setResumes(data.resumes)
      } else {
        toast.error('Failed to fetch resumes')
      }
    } catch (error) {
      toast.error('Error fetching resumes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])



  // Filter resumes based on search term and sort by date
  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch = 
      resume.resume_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.template_used.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  }).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB
  })



  // Pagination logic
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentResumes = filteredResumes.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortOrder])

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return variants[status as keyof typeof variants] || variants.draft
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const handleViewResume = async (resumeId: string) => {
    try {
      setPreviewLoading(true)
      setPreviewOpen(true)
      
      const response = await fetch(`/api/admin/resumes/${resumeId}/preview?t=${Date.now()}`, { cache: 'no-store' })
      const data = await response.json()
      
      if (response.ok) {
        console.log('🔍 Preview resume data:', data.resume);
        console.log('🔍 Preview resume slug:', data.resume?.resume_slug);
        setPreviewResume(data.resume)
      } else {
        toast.error('Failed to fetch resume preview')
      }
    } catch (error) {
      toast.error('Error fetching resume preview')
    } finally {
      setPreviewLoading(false)
    }
  }



  const handleDeleteResume = async (resumeId: string, force: boolean = false) => {
    try {
      setDeletingResumes(prev => new Set(prev).add(resumeId))
      
      const url = force 
        ? `/api/admin/resumes/${resumeId}?force=true`
        : `/api/admin/resumes/${resumeId}`
      
      const response = await fetch(url, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Remove the deleted resume from the list
        setResumes(prevResumes => prevResumes.filter(resume => resume.id !== resumeId))
        setShowDeleteDialog(false)
        setDeleteResumeId(null)
        setForceDeleteMode(false)
        
        // Show success toast
        toast.success('Resume deleted successfully')
      } else {
        const errorData = await response.json()
        
        // Check if it's a constraint violation and offer force delete
        if (response.status === 400 && (errorData.error.includes('applications') || errorData.error.includes('referenced'))) {
          setForceDeleteMode(true)
          setDeleteResumeId(resumeId) // Make sure we keep the resume ID
          setShowDeleteDialog(true) // Open the dialog to show force delete option
          toast.error('Resume has applications. Use force delete to remove all references.')
        } else {
          toast.error(errorData.error || 'Failed to delete resume')
        }
      }
    } catch (error) {
      toast.error('Error deleting resume')
    } finally {
      setDeletingResumes(prev => {
        const newSet = new Set(prev)
        newSet.delete(resumeId)
        return newSet
      })
    }
  }



  return (
    <AdminLayout title="Resume Management" description="Manage user resumes and documents">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Resumes</p>
                  <p className="text-2xl font-bold text-white">{resumes.length}</p>
                  <p className="text-xs text-green-400">All time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-white">
                    {resumes.reduce((sum, r) => sum + r.view_count, 0)}
                  </p>
                  <p className="text-xs text-green-400">All resumes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Templates</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(resumes.map(r => r.template_used)).size}
                  </p>
                  <p className="text-xs text-yellow-400">Unique templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Users</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(resumes.map(r => r.user_id)).size}
                  </p>
                  <p className="text-xs text-purple-400">With resumes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search resumes, users, or file types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-white/20 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 invalid:border-white/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={fetchResumes}
                  className="border-transparent text-white hover:bg-white/10"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-transparent text-white hover:bg-white/10">
                      {sortOrder === 'latest' ? 'Latest Resumes' : 'Oldest Resumes'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-white/10">
                    <DropdownMenuItem 
                      onClick={() => setSortOrder('latest')}
                      className="text-white hover:bg-white/10"
                    >
                      Latest Resumes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => setSortOrder('oldest')}
                      className="text-white hover:bg-white/10"
                    >
                      Oldest Resumes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  onClick={fetchResumes}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No resumes found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resume Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentResumes.map((resume) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card hover:bg-white/5 transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                                             {/* Header with User Info */}
                       <div className="flex items-center space-x-3 mb-3">
                         <Avatar className="w-10 h-10">
                           <AvatarImage 
                             src={resume.user_avatar} 
                             alt={resume.user_name}
                           />
                           <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-sm">
                             {getInitials(resume.user_name)}
                           </AvatarFallback>
                         </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{resume.user_name}</p>
                          <p className="text-gray-400 text-xs truncate">{resume.user_email}</p>
                        </div>
                      </div>

                                             {/* Resume Title */}
                       <div className="mb-3">
                         <h3 className="text-white font-semibold text-sm mb-1 truncate">{resume.resume_title}</h3>
                         <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                           {resume.template_used}
                         </Badge>
                       </div>

                       {/* Resume Info */}
                       <div className="space-y-2 mb-4">
                         <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center space-x-1">
                             <Eye className="w-3 h-3 text-gray-400" />
                             <span className="text-gray-400">Views</span>
                           </div>
                           <span className="text-gray-300">{resume.view_count}</span>
                         </div>
                         
                         <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center space-x-1">
                             <Calendar className="w-3 h-3 text-gray-400" />
                             <span className="text-gray-400">Created</span>
                           </div>
                           <span className="text-gray-300">{formatDate(resume.created_at)}</span>
                         </div>
                       </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center space-x-1">
                                                     <Button
                             variant="ghost"
                             size="sm"
                             className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                             title="View Resume"
                             onClick={() => handleViewResume(resume.id)}
                           >
                             <Eye className="w-3 h-3" />
                           </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                            title="Download"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 border-white/10 text-white">
                                Coming Soon
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title="Delete"
                          disabled={deletingResumes.has(resume.id)}
                          onClick={() => {
                            setDeleteResumeId(resume.id)
                            setForceDeleteMode(false)
                            setShowDeleteDialog(true)
                          }}
                        >
                          {deletingResumes.has(resume.id) ? (
                            <div className="w-3 h-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                          ) : (
                          <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {!loading && filteredResumes.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredResumes.length)} of {filteredResumes.length} resumes
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

                           {/* Resume Preview Modal */}
        {previewOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Resume Preview</h2>
                  {previewResume?.resume_slug && (
                    <span className="text-sm text-gray-400">Slug: {previewResume.resume_slug}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {previewResume?.resume_slug && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/${previewResume.resume_slug}`, '_blank')}
                      className="border-white/10 text-white hover:bg-white/10 px-4 py-2"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Resume
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewOpen(false)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {previewLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              ) : previewResume ? (
                <div className="space-y-6 px-6 py-6 flex-1 overflow-y-auto">
                  {/* Resume Header */}
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{previewResume.resume_title}</h2>
                      <p className="text-gray-400 text-lg">Created by {previewResume.user_name}</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-lg px-4 py-2">
                      {previewResume.template_used}
                    </Badge>
                  </div>

                  {/* Resume Content */}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
                    {previewResume?.resume_slug ? (
                      <iframe
                        src={`/${previewResume.resume_slug}`}
                        className="w-full"
                        style={{ height: '70vh', border: '0' }}
                        title="Resume Preview"
                      />
                    ) : (
                      <div 
                        className="resume-preview-content"
                        style={{
                          height: '100%',
                          overflowY: 'auto',
                          padding: '40px',
                          backgroundColor: 'white',
                          color: '#333',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          fontFamily: 'Arial, sans-serif'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: previewResume?.resume_html || 'No preview available' 
                        }}
                      />
                    )}
                  </div>
                  
                </div>
              ) : (
                <div className="flex items-center justify-center flex-1">
                  <p className="text-gray-400">No resume data available</p>
                </div>
              )}
            </div>
          </div>
        )}
       </div>

       {/* Delete Confirmation Dialog */}
       <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
         if (!open) {
           setForceDeleteMode(false)
           setDeleteResumeId(null)
         }
         setShowDeleteDialog(open)
       }}>
         <AlertDialogContent className="bg-gray-900 border-gray-700 text-white z-[9999]">
           <AlertDialogHeader>
             <AlertDialogTitle className="text-white">Delete Resume</AlertDialogTitle>
             <AlertDialogDescription className="text-gray-300">
               {forceDeleteMode ? (
                 <>
                   This resume has applications that reference it. 
                   <br /><br />
                   <strong>Force delete will remove:</strong>
                   <br />• The resume
                   <br />• All related applications
                   <br /><br />
                   <span className="text-yellow-400">This action cannot be undone!</span>
                 </>
               ) : (
                 'Are you sure you want to delete this resume? This action cannot be undone.'
               )}
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel 
               className="border-gray-700 text-gray-300 hover:bg-gray-800"
               onClick={() => {
                 setForceDeleteMode(false)
                 setShowDeleteDialog(false)
                 setDeleteResumeId(null)
               }}
             >
               Cancel
             </AlertDialogCancel>
             {forceDeleteMode ? (
               <AlertDialogAction
                 onClick={() => {
                   deleteResumeId && handleDeleteResume(deleteResumeId, true)
                 }}
                 disabled={deleteResumeId ? deletingResumes.has(deleteResumeId) : false}
                 className="bg-red-700 hover:bg-red-800 text-white disabled:opacity-50"
               >
                 {deleteResumeId && deletingResumes.has(deleteResumeId) ? 'Force Deleting...' : 'Force Delete'}
               </AlertDialogAction>
             ) : (
             <AlertDialogAction
               onClick={() => {
                 deleteResumeId && handleDeleteResume(deleteResumeId)
               }}
                 disabled={deleteResumeId ? deletingResumes.has(deleteResumeId) : false}
                 className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
             >
                 {deleteResumeId && deletingResumes.has(deleteResumeId) ? 'Deleting...' : 'Delete'}
             </AlertDialogAction>
             )}
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>




     </AdminLayout>
   )
 } 