'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth-context'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Mail, 
  Calendar, 
  Building,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  RefreshCw,
  FileText,
  TrendingUp,
  UserCheck,
  DollarSign,
  Calculator
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface Quotation {
  quote_id: string
  user_id: string
  user_name: string
  user_email: string
  company: string | null
  industry: string | null
  total_employees: number
  total_cost: number
  created_at: string
  updated_at: string
  status: string
  step_completed: number
  quote_number: number
  currency_code: string
  session_id: string | null
  quote_timestamp: string
}

interface QuotationsResponse {
  data: Quotation[]
  total: number
  stats: {
    totalQuotes: number
    totalValue: number
    averageValue: number
    completedQuotes: number
  }
}

// API function to fetch quotations
const fetchQuotations = async (): Promise<QuotationsResponse> => {
  const response = await fetch('/api/admin/quotations')
  if (!response.ok) {
    throw new Error('Failed to fetch quotations')
  }
  return response.json()
}

export default function LeadQuotations() {
  const router = useRouter()
  const { admin, loading, signOut, isAdmin } = useAdminAuth()
  
  // Use TanStack React Query
  const { data: quotationsData, isLoading, error, refetch } = useQuery({
    queryKey: ['quotations'],
    queryFn: fetchQuotations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })

  const quotations = quotationsData?.data || []
  const stats = quotationsData?.stats || {
    totalQuotes: 0,
    totalValue: 0,
    averageValue: 0,
    completedQuotes: 0
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const formatCurrency = (amount: number, currencyCode: string = 'PHP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStepProgress = (step: number) => {
    const steps = [
      { name: 'Company Info', completed: step >= 1 },
      { name: 'Industry', completed: step >= 2 },
      { name: 'Personal Info', completed: step >= 3 },
      { name: 'Review', completed: step >= 4 }
    ]
    return steps
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
              <h1 className="text-lg font-semibold">Lead Quotations</h1>
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
                  <h1 className="text-3xl font-bold text-gray-900">Lead Quotations</h1>
                  <p className="text-gray-600 mt-2">Track and manage pricing quotes from your leads</p>
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

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-lime-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-lime-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Value</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue, 'PHP')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Calculator className="h-8 w-8 text-lime-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Average Value</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageValue, 'PHP')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-lime-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.completedQuotes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quotations List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-lime-600" />
                    Lead Quotations
                  </CardTitle>
                  <CardDescription>
                    All pricing quotes generated by your leads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-lime-600" />
                      <span className="ml-2 text-gray-600">Loading quotations...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 font-medium">Failed to load quotations</p>
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
                  ) : quotations.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No quotations found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quotations.map((quotation) => (
                        <Card key={quotation.quote_id} className="border-lime-200 shadow-sm">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                              {/* Quote Info */}
                              <div className="space-y-3 border-r border-gray-200 pr-6 bg-gray-50/30 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <Users className="w-4 h-4 text-gray-600" />
                                  <h4 className="font-medium text-gray-900">Lead Information</h4>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {quotation.user_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">{quotation.user_email}</p>
                                  {quotation.company && (
                                    <p className="text-sm text-gray-600">{quotation.company}</p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(quotation.status)}
                                    {quotation.industry && (
                                      <Badge variant="outline">{quotation.industry}</Badge>
                                    )}
                                  </div>
                                  
                                  <div className="text-sm text-gray-600">
                                    <p><strong>Quote #:</strong> {quotation.quote_number}</p>
                                    <p><strong>Created:</strong> {new Date(quotation.created_at).toLocaleDateString()}</p>
                                    <p><strong>Updated:</strong> {new Date(quotation.updated_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Quote Details */}
                              <div className="space-y-4 border-r border-gray-200 pr-6 bg-lime-50/30 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <Calculator className="w-4 h-4 text-lime-600" />
                                  <h4 className="font-medium text-gray-900">Quote Details</h4>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Employees:</span>
                                    <span className="font-medium">{quotation.total_employees.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Cost:</span>
                                    <span className="font-bold text-lg text-lime-600">{formatCurrency(quotation.total_cost, quotation.currency_code)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Progress Steps */}
                              <div className="space-y-4 border-r border-gray-200 pr-6 bg-blue-50/30 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                  <h4 className="font-medium text-gray-900">Progress</h4>
                                </div>
                                <div className="space-y-2">
                                  {getStepProgress(quotation.step_completed).map((step, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      {step.completed ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                      )}
                                      <span className={`text-sm ${step.completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                        {step.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="space-y-4 bg-green-50/30 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="w-4 h-4 text-green-600" />
                                  <h4 className="font-medium text-gray-900">Actions</h4>
                                </div>
                                <div className="space-y-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-lime-200 text-lime-700 hover:bg-lime-50"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Quote
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-lime-200 text-lime-700 hover:bg-lime-50"
                                  >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Lead
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
