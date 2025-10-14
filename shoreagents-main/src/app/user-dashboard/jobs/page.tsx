"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Briefcase, 
  Search, 
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { useState } from 'react'

// Mock data for jobs
const mockJobs = [
  {
    id: 1,
    title: "Real Estate Virtual Assistant",
    company: "Property Management Co.",
    location: "Remote",
    type: "Full-time",
    salary: "$800-1200/month",
    status: "Active",
    applicants: 12,
    postedDate: "2024-01-15",
    description: "Looking for an experienced virtual assistant to handle real estate transactions, client communications, and administrative tasks.",
    requirements: ["Real Estate Experience", "English Proficiency", "Computer Skills"]
  },
  {
    id: 2,
    title: "Customer Service Representative",
    company: "Tech Solutions Inc.",
    location: "Manila, Philippines",
    type: "Part-time",
    salary: "$500-800/month",
    status: "Active",
    applicants: 8,
    postedDate: "2024-01-20",
    description: "Seeking a friendly and professional customer service rep to handle client inquiries and support tickets.",
    requirements: ["Customer Service Experience", "Communication Skills", "Problem Solving"]
  },
  {
    id: 3,
    title: "Data Entry Specialist",
    company: "Business Services Ltd.",
    location: "Remote",
    type: "Contract",
    salary: "$300-500/month",
    status: "Closed",
    applicants: 15,
    postedDate: "2024-01-10",
    description: "Temporary position for data entry and document processing tasks.",
    requirements: ["Typing Speed 60+ WPM", "Attention to Detail", "MS Office Skills"]
  }
]

export default function JobsPage() {
  const { user } = useUserAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || job.status.toLowerCase() === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Closed':
        return 'bg-gray-100 text-gray-800'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-100 text-blue-800'
      case 'Part-time':
        return 'bg-purple-100 text-purple-800'
      case 'Contract':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Jobs</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredJobs.length} jobs found
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Job Postings</h2>
                  <p className="text-muted-foreground">
                    Manage your job postings and track applications
                  </p>
                </div>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-lime-600 hover:bg-lime-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('all')}
                  className={selectedStatus === 'all' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('active')}
                  className={selectedStatus === 'active' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  Active
                </Button>
                <Button
                  variant={selectedStatus === 'closed' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('closed')}
                  className={selectedStatus === 'closed' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  Closed
                </Button>
              </div>
            </div>

            {/* Jobs List */}
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          <Badge className={getTypeColor(job.type)}>
                            {job.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applicants} applicants
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Applicants
                        </Button>
                        <Button size="sm" className="bg-lime-600 hover:bg-lime-700">
                          Manage Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'Try adjusting your search terms or filters'
                    : 'Get started by posting your first job'
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {searchTerm || selectedStatus !== 'all' ? (
                    <Button 
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedStatus('all')
                      }}
                      className="bg-lime-600 hover:bg-lime-700"
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="bg-lime-600 hover:bg-lime-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Job
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}


