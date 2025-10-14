"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { useDeleteQuotationMutation } from '@/hooks/use-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Quote, 
  Plus,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Eye,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  Trash2
} from 'lucide-react'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserQuoteService, UserQuoteSummary } from '@/lib/userQuoteService'
import { PricingCalculatorModal } from '@/components/ui/pricing-calculator-modal'
import { QuoteSummaryModal } from '@/components/ui/quote-summary-modal'
import { useCurrency } from '@/lib/currencyContext'
import { RefreshCw } from 'lucide-react'


export default function QuotationPage() {
  const { user } = useUserAuth()
  const { formatPrice, convertPrice } = useCurrency()
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isQuoteSummaryOpen, setIsQuoteSummaryOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<UserQuoteSummary | null>(null)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [isSending, setIsSending] = useState<string | null>(null)

  // TanStack Query for fetching quotations
  const {
    data: quotations = [],
    isLoading,
    error,
    refetch,
    isFetching,
    isStale
  } = useQuery({
    queryKey: ['quotations', user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) {
        throw new Error('User not authenticated')
      }
      
      console.log('🔄 Fetching user quotations...')
      const result = await UserQuoteService.getAllQuotes(user.user_id)
      
      if (result.success && result.data) {
        console.log('✅ Fetched quotations:', result.data.length)
        return result.data
      } else {
        throw new Error('Failed to fetch quotations')
      }
    },
    enabled: !!user?.user_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnMount: true
  })

  // TanStack Query mutation for deleting quotations
  const deleteQuotationMutation = useMutation({
    mutationFn: async ({ quoteId }: { quoteId: string }) => {
      console.log('🗑️ Deleting quote:', quoteId)
      const { PricingQuoteServiceClient } = await import('@/lib/pricingQuoteServiceClient')
      const result = await PricingQuoteServiceClient.deleteQuote(quoteId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete quote')
      }
      return quoteId
    },
    onMutate: async ({ quoteId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['quotations', user?.user_id] })
      
      // Snapshot the previous value
      const previousQuotations = queryClient.getQueryData(['quotations', user?.user_id])
      
      // Optimistically update the quotations
      queryClient.setQueryData(['quotations', user?.user_id], (old: UserQuoteSummary[] = []) =>
        old.filter(quote => quote.id !== quoteId)
      )
      
      return { previousQuotations }
    },
    onError: (err, { quoteId }, context) => {
      // Revert the optimistic update
      if (context?.previousQuotations) {
        queryClient.setQueryData(['quotations', user?.user_id], context.previousQuotations)
      }
      console.error('❌ Error deleting quote:', err)
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['quotations', user?.user_id] })
    }
  })

  const handleCreateQuotation = () => {
    console.log('Create quotation button clicked - opening pricing calculator modal')
    setIsPricingModalOpen(true)
  }

  const handleDeleteQuotation = async (quoteId: string) => {
    try {
      console.log('🗑️ Deleting quote:', quoteId)
      await deleteQuotationMutation.mutateAsync({ quoteId })
      console.log('✅ Quote deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting quote:', error)
    }
  }

  const handleViewQuote = (formattedQuote: { id: string }) => {
    // Find the original quote data from quotations array
    const originalQuote = quotations.find(q => q.id === formattedQuote.id)
    if (originalQuote) {
      console.log('👁️ Viewing quote:', originalQuote.id)
      setSelectedQuote(originalQuote)
      setIsQuoteSummaryOpen(true)
    }
  }

  // Handle PDF download
  const handleDownloadPDF = async (quote: UserQuoteSummary) => {
    setIsDownloading(quote.id);
    try {
      // Create a simple PDF content
      const content = `
        ShoreAgents Quote Summary
        ========================
        
        Quote ID: ${quote.id}
        Industry: ${quote.industry}
        Team Size: ${quote.member_count} members
        Total Monthly Cost: ${formatPrice(quote.total_monthly_cost)}
        Currency: ${quote.currency_code}
        Created: ${new Date(quote.created_at).toLocaleDateString()}
        
        Roles:
        ${quote.roles_preview.map(role => `- ${role.role_title} (${role.experience_level}, ${role.workspace_type})`).join('\n')}
        
        Valid until: ${new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
      `;
      
      // Create and download the file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shoreagents-quote-${quote.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(null);
    }
  };

  // Handle send to client
  const handleSendToClient = async (quote: UserQuoteSummary) => {
    setIsSending(quote.id);
    try {
      // For now, we'll copy the quote details to clipboard
      const quoteDetails = `
        ShoreAgents Quote Summary
        
        Industry: ${quote.industry}
        Team Size: ${quote.member_count} members
        Total Monthly Cost: ${formatPrice(quote.total_monthly_cost)}
        
        Roles:
        ${quote.roles_preview.map(role => `• ${role.role_title} (${role.experience_level}, ${role.workspace_type})`).join('\n')}
        
        Valid until: ${new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
      `;
      
      await navigator.clipboard.writeText(quoteDetails);
      alert('Quote details copied to clipboard! You can now share this with your client.');
    } catch (error) {
      console.error('Error sending to client:', error);
      alert('Error sharing quote. Please try again.');
    } finally {
      setIsSending(null);
    }
  };

  // Convert UserQuoteSummary to display format
  const formatQuotationForDisplay = (quote: UserQuoteSummary, index: number) => {
    // Determine status based on age and position
    const quoteDate = new Date(quote.created_at)
    const now = new Date()
    const daysSinceCreation = Math.floor((now.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24))
    
    let status = "Active"
    if (daysSinceCreation > 30) {
      status = "Expired"
    } else if (daysSinceCreation > 14) {
      status = "Pending"
    } else if (index === 0) {
      status = "Latest"
    }

    return {
      id: quote.id,
      clientName: "Your Company",
      projectName: `${quote.industry} Team - ${quote.member_count} Members`,
      amount: convertPrice(quote.total_monthly_cost), // Convert to current currency
      status: status,
      createdDate: quote.created_at,
      validUntil: new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from creation
      description: `Monthly team of ${quote.member_count} members for ${quote.industry} operations`,
      items: (() => {
        // Group similar roles by title, experience level, and workspace type
        const groupedRoles: Record<string, { role: typeof quote.roles_preview[0], count: number }> = {};
        
        quote.roles_preview.forEach(role => {
          const key = `${role.role_title}-${role.experience_level}-${role.workspace_type}`;
          if (groupedRoles[key]) {
            groupedRoles[key].count += 1;
          } else {
            groupedRoles[key] = { role, count: 1 };
          }
        });

        return Object.values(groupedRoles).map((groupedRole) => ({
          name: groupedRole.count > 1 ? `${groupedRole.role.role_title} x${groupedRole.count}` : groupedRole.role.role_title,
          quantity: groupedRole.count,
          rate: Math.round(convertPrice(quote.total_monthly_cost / quote.roles_count)),
          total: Math.round(convertPrice(quote.total_monthly_cost / quote.roles_count)) * groupedRole.count
        }));
      })()
    }
  }

  const displayQuotations = quotations.map(formatQuotationForDisplay)
  const filteredQuotations = displayQuotations.filter(quote => 
    selectedStatus === 'all' || quote.status.toLowerCase() === selectedStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Latest':
        return 'bg-lime-100 text-lime-800'
      case 'Active':
        return 'bg-blue-100 text-blue-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Expired':
        return 'bg-red-100 text-red-800'
      case 'Sent':
        return 'bg-blue-100 text-blue-800'
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Latest':
        return <CheckCircle className="w-4 h-4" />
      case 'Active':
        return <Send className="w-4 h-4" />
      case 'Pending':
        return <Clock className="w-4 h-4" />
      case 'Expired':
        return <AlertCircle className="w-4 h-4" />
      case 'Sent':
        return <Send className="w-4 h-4" />
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />
      case 'Draft':
        return <FileText className="w-4 h-4" />
      case 'Rejected':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
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
              <h1 className="text-lg font-semibold">Quotations</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredQuotations.length} quotations
              </Badge>
              {isStale && (
                <Badge variant="outline" className="text-xs text-orange-600">
                  Data may be outdated
                </Badge>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Quotation Management</h2>
                  <p className="text-muted-foreground">
                    Create, manage, and track your quotations
                  </p>
                </div>
                <Button 
                  className="bg-lime-600 hover:bg-lime-700"
                  onClick={handleCreateQuotation}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quotation
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
                className={selectedStatus === 'all' ? 'bg-lime-600 hover:bg-lime-700' : ''}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === 'latest' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('latest')}
                className={selectedStatus === 'latest' ? 'bg-lime-600 hover:bg-lime-700' : ''}
              >
                Latest
              </Button>
              <Button
                variant={selectedStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('active')}
                className={selectedStatus === 'active' ? 'bg-lime-600 hover:bg-lime-700' : ''}
              >
                Active
              </Button>
              <Button
                variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('pending')}
                className={selectedStatus === 'pending' ? 'bg-lime-600 hover:bg-lime-700' : ''}
              >
                Pending
              </Button>
              <Button
                variant={selectedStatus === 'expired' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('expired')}
                className={selectedStatus === 'expired' ? 'bg-lime-600 hover:bg-lime-700' : ''}
              >
                Expired
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full border-2 border-lime-600 border-t-transparent w-8 h-8" />
                <span className="ml-2 text-gray-600">Loading quotations...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading quotations</h3>
                <p className="text-muted-foreground mb-4">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
                <Button 
                  onClick={() => refetch()}
                  className="bg-lime-600 hover:bg-lime-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Background Refetching Indicator */}
            {isFetching && !isLoading && (
              <div className="flex items-center justify-center py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-lime-600 mr-2" />
                <span className="text-sm text-gray-600">Updating quotations...</span>
              </div>
            )}

            {/* Quotations List */}
            {!isLoading && !error && (
              <div className="space-y-6">
                {/* Latest Quote - Full Width */}
                {filteredQuotations.length > 0 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Latest Quote</h3>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-xl">{filteredQuotations[0].projectName}</CardTitle>
                                <Badge className={getStatusColor(filteredQuotations[0].status)}>
                                  {getStatusIcon(filteredQuotations[0].status)}
                                  <span className="ml-1">{filteredQuotations[0].status}</span>
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {filteredQuotations[0].clientName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Created {new Date(filteredQuotations[0].createdDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Valid until {new Date(filteredQuotations[0].validUntil).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-lime-600">
                                {formatPrice(filteredQuotations[0].amount)}
                              </div>
                              <div className="text-sm text-muted-foreground">Total Amount</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{filteredQuotations[0].description}</p>
                          
                          {/* Items List */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Items:</h4>
                            {filteredQuotations[0].items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">{formatPrice(item.total)}</div>
                                  <div className="text-xs text-muted-foreground">{formatPrice(item.rate)}/month</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewQuote(filteredQuotations[0])}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const originalQuote = quotations.find(q => q.id === filteredQuotations[0].id);
                                  if (originalQuote) handleDownloadPDF(originalQuote);
                                }}
                                disabled={isDownloading === filteredQuotations[0].id}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloading === filteredQuotations[0].id ? 'Downloading...' : 'Download PDF'}
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-lime-600 hover:bg-lime-700"
                                onClick={() => {
                                  const originalQuote = quotations.find(q => q.id === filteredQuotations[0].id);
                                  if (originalQuote) handleSendToClient(originalQuote);
                                }}
                                disabled={isSending === filteredQuotations[0].id}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {isSending === filteredQuotations[0].id ? 'Sending...' : 'Send to Client'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteQuotation(filteredQuotations[0].id)}
                                disabled={deleteQuotationMutation.isPending}
                                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                              >
                                {deleteQuotationMutation.isPending ? (
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                {deleteQuotationMutation.isPending ? 'Deleting...' : 'Delete'}
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Quote #{filteredQuotations[0].id.toString().padStart(4, '0')}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Horizontal Rule Separator */}
                    {filteredQuotations.length > 1 && (
                      <hr className="border-gray-200" />
                    )}

                    {/* Previous Quotes - 4 Column Grid */}
                    {filteredQuotations.length > 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Previous Quotes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {filteredQuotations.slice(1).map((quotation) => (
                            <Card key={quotation.id} className="hover:shadow-md transition-shadow aspect-square">
                              <CardContent className="p-4 h-full flex flex-col justify-between">
                                {/* Header */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Badge className={getStatusColor(quotation.status)}>
                                      {getStatusIcon(quotation.status)}
                                      <span className="ml-1 text-xs">{quotation.status}</span>
                                    </Badge>
                                    <div className="text-xs text-muted-foreground">
                                      #{quotation.id.toString().padStart(4, '0')}
                                    </div>
                                  </div>
                                  <h4 className="font-semibold text-sm line-clamp-2">{quotation.projectName}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{quotation.description}</p>
                                </div>

                                {/* Amount */}
                                <div className="text-center py-2">
                                  <div className="text-lg font-bold text-lime-600">
                                    {formatPrice(quotation.amount)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Total Amount</div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-2">
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1 text-xs"
                                      onClick={() => handleViewQuote(quotation)}
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1 text-xs"
                                      onClick={() => {
                                        const originalQuote = quotations.find(q => q.id === quotation.id);
                                        if (originalQuote) handleDownloadPDF(originalQuote);
                                      }}
                                      disabled={isDownloading === quotation.id}
                                    >
                                      <Download className="w-3 h-3 mr-1" />
                                      PDF
                                    </Button>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      className="flex-1 text-xs bg-lime-600 hover:bg-lime-700"
                                      onClick={() => {
                                        const originalQuote = quotations.find(q => q.id === quotation.id);
                                        if (originalQuote) handleSendToClient(originalQuote);
                                      }}
                                      disabled={isSending === quotation.id}
                                    >
                                      <Send className="w-3 h-3 mr-1" />
                                      Send
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                                      onClick={() => handleDeleteQuotation(quotation.id)}
                                      disabled={deleteQuotationMutation.isPending}
                                    >
                                      {deleteQuotationMutation.isPending ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3 h-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <Quote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotations found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedStatus !== 'all' 
                    ? 'Try selecting a different status filter'
                    : 'Get started by creating your first quotation'
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {selectedStatus !== 'all' ? (
                    <Button 
                      onClick={() => setSelectedStatus('all')}
                      className="bg-lime-600 hover:bg-lime-700"
                    >
                      Show All Quotations
                    </Button>
                  ) : (
                    <Button 
                      className="bg-lime-600 hover:bg-lime-700"
                      onClick={handleCreateQuotation}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Quotation
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Summary Stats */}
            {!isLoading && !error && filteredQuotations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-lime-600">
                        {filteredQuotations.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Quotations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(filteredQuotations.reduce((sum, q) => sum + q.amount, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredQuotations.filter(q => q.status === 'Approved').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Approved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Pricing Calculator Modal */}
      <PricingCalculatorModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />

      {/* Quote Summary Modal */}
      {selectedQuote && (
        <QuoteSummaryModal
          isOpen={isQuoteSummaryOpen}
          onClose={() => {
            setIsQuoteSummaryOpen(false)
            setSelectedQuote(null)
          }}
          quote={selectedQuote}
        />
      )}
    </UserGuard>
  )
}
