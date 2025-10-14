'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth-context'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  KanbanBoard, 
  KanbanCard, 
  KanbanCards, 
  KanbanHeader, 
  KanbanProvider 
} from '@/components/ui/shadcn-io/kanban'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar, 
  Building,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  RefreshCw
} from 'lucide-react'
import { useLeads, useUpdateLeadStatus } from '@/hooks/use-api'

const columns = [
  { id: 'new', name: 'New Leads' },
  { id: 'contacted', name: 'Contacted' },
  { id: 'qualified', name: 'Qualified' },
  { id: 'proposal', name: 'Proposal Sent' },
  { id: 'negotiation', name: 'Negotiation' },
  { id: 'closed', name: 'Closed Won' }
]

export default function LeadManagement() {
  const router = useRouter()
  const { admin, loading, signOut, isAdmin } = useAdminAuth()
  const { data: leadsData, isLoading, error, refetch } = useLeads()
  const updateLeadStatusMutation = useUpdateLeadStatus()
  
  const leads = leadsData?.data || []
  const stats = leadsData?.stats || {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    closed: 0
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="w-3 h-3" />
      case 'Medium':
        return <Clock className="w-3 h-3" />
      case 'Low':
        return <CheckCircle className="w-3 h-3" />
      default:
        return <Target className="w-3 h-3" />
    }
  }

  const handleDataChange = (newData: typeof leads) => {
    // Update lead status when dragged to different column
    newData.forEach(lead => {
      const originalLead = leads.find(l => l.id === lead.id)
      if (originalLead && originalLead.column !== lead.column) {
        updateLeadStatusMutation.mutate({
          leadId: lead.id,
          column: lead.column
        })
      }
    })
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return null
  }

  return (
    <AdminGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Lead Management</h1>
              <Badge variant="secondary" className="text-xs">
                Welcome back, {admin?.first_name}!
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="w-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
                  <p className="text-gray-600 mt-2">Track and manage your sales pipeline</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => refetch()}
                    disabled={isLoading}
                    variant="outline"
                    className="border-lime-200 text-lime-700 hover:bg-lime-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="border-lime-200 text-lime-700 hover:bg-lime-50"
                  >
                    Logout
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-l-4 border-l-lime-500 bg-gradient-to-t from-lime-50/50 to-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-lime-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-lime-600">
                      {isLoading ? '...' : leadsData?.total || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All pipeline stages
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 bg-gradient-to-t from-blue-50/50 to-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                    <UserPlus className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {isLoading ? '...' : stats.new}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fresh opportunities
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-t from-yellow-50/50 to-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {isLoading ? '...' : stats.contacted + stats.qualified + stats.proposal + stats.negotiation}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active deals
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-gradient-to-t from-green-50/50 to-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {isLoading ? '...' : stats.closed}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Successful deals
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Kanban Board */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-lime-600" />
                    Lead Tracking
                  </CardTitle>
                  <CardDescription>
                    Drag and drop leads between stages to update their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[600px]">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-lime-600" />
                        <span className="text-lime-600">Loading leads...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-[600px]">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 font-medium">Failed to load leads</p>
                        <p className="text-sm text-gray-600 mt-2">Please try refreshing the page</p>
                        <Button 
                          onClick={() => refetch()} 
                          className="mt-4 bg-lime-600 hover:bg-lime-700 text-white"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="flex items-center justify-center h-[600px]">
                      <div className="text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No leads found</p>
                        <p className="text-sm text-gray-500 mt-2">Leads will appear here when users sign up</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[600px]">
                      <KanbanProvider
                        columns={columns}
                        data={leads}
                        onDataChange={handleDataChange}
                      >
                        {(column) => (
                          <KanbanBoard key={column.id} id={column.id}>
                            <KanbanHeader className="bg-lime-50 border-b border-lime-200">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-lime-800">{column.name}</span>
                                <Badge variant="outline" className="text-lime-600 border-lime-300">
                                  {leads.filter(lead => lead.column === column.id).length}
                                </Badge>
                              </div>
                            </KanbanHeader>
                            <KanbanCards id={column.id}>
                              {(lead) => (
                                <KanbanCard key={lead.id} id={lead.id} name={lead.name}>
                                  <div className="space-y-3">
                                     {/* Lead Header */}
                                     <div className="flex items-start justify-between">
                                       <div>
                                         <h4 className="font-semibold text-sm text-gray-900">{lead.name}</h4>
                                         <p className="text-xs text-gray-600">{lead.company}</p>
                                       </div>
                                     </div>

                                     {/* Contact Info */}
                                     <div className="space-y-1">
                                       <div className="flex items-center gap-2 text-xs text-gray-600">
                                         <Mail className="w-3 h-3" />
                                         <span className="truncate">{lead.email}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-xs text-gray-600">
                                         <Building className="w-3 h-3" />
                                         <span>{lead.source}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-xs text-gray-600">
                                         <Target className="w-3 h-3" />
                                         <span>{lead.industry}</span>
                                       </div>
                                       {lead.quoteCount > 0 && (
                                         <div className="flex items-center gap-2 text-xs text-lime-600">
                                           <Star className="w-3 h-3" />
                                           <span>{lead.quoteCount} quote{lead.quoteCount > 1 ? 's' : ''}</span>
                                         </div>
                                       )}
                                     </div>

                                    {/* Notes */}
                                    {lead.notes && (
                                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                        {lead.notes}
                                      </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(lead.created).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(lead.lastContact).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </KanbanCard>
                              )}
                            </KanbanCards>
                          </KanbanBoard>
                        )}
                      </KanbanProvider>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  )
}
