'use client';

import { X, Users, CheckCircle, Eye, Download, Send, MessageCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Badge } from './badge';
import { UserQuoteSummary } from '@/lib/userQuoteService';
import { useState } from 'react';
import { useCurrency } from '@/lib/currencyContext';

interface QuoteSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: UserQuoteSummary;
}

export function QuoteSummaryModal({ isOpen, onClose, quote }: QuoteSummaryModalProps) {
  const { formatPrice, convertPrice } = useCurrency();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Create a simple PDF content
      const content = `
        ShoreAgents Quote Summary
        ========================
        
        Quote ID: ${quote.id}
        Industry: ${quote.industry}
        Team Size: ${quote.member_count} members
        Total Monthly Cost: ${formatPrice(convertPrice(quote.total_monthly_cost))}
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
      setIsDownloading(false);
    }
  };

  // Handle send to client
  const handleSendToClient = async () => {
    setIsSending(true);
    try {
      // For now, we'll copy the quote details to clipboard
      const quoteDetails = `
        ShoreAgents Quote Summary
        
        Industry: ${quote.industry}
        Team Size: ${quote.member_count} members
        Total Monthly Cost: ${formatPrice(convertPrice(quote.total_monthly_cost))}
        
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
      setIsSending(false);
    }
  };

  // formatPrice is now provided by useCurrency hook

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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Latest':
        return <CheckCircle className="w-4 h-4" />
      case 'Active':
        return <Send className="w-4 h-4" />
      case 'Pending':
        return <Eye className="w-4 h-4" />
      case 'Expired':
        return <X className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  };

  // Determine status based on age
  const quoteDate = new Date(quote.created_at)
  const now = new Date()
  const daysSinceCreation = Math.floor((now.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24))
  
  let status = "Active"
  if (daysSinceCreation > 30) {
    status = "Expired"
  } else if (daysSinceCreation > 14) {
    status = "Pending"
  } else {
    status = "Latest"
  }

  return (
    <div className="fixed inset-0 bg-black/20 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-lime-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quote Summary</h2>
              <p className="text-sm text-gray-600">Quote #{quote.id.slice(-8)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                {getStatusIcon(status)}
                {status}
              </Badge>
              <span className="text-sm text-gray-600">
                Created {new Date(quote.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-lime-600">
                {formatPrice(convertPrice(quote.total_monthly_cost))}
              </div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>


          {/* Roles Breakdown */}
          {quote.roles_preview && quote.roles_preview.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role Details</CardTitle>
                <CardDescription>
                  Breakdown of positions and experience levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
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

                    return Object.values(groupedRoles).map((groupedRole, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {groupedRole.count > 1 ? `${groupedRole.count}x ` : ''}{groupedRole.role.role_title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {groupedRole.role.experience_level} • {groupedRole.role.workspace_type}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(convertPrice(Math.round(quote.total_monthly_cost / quote.roles_count) * groupedRole.count))}
                          </div>
                          <div className="text-xs text-gray-600">per month</div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Candidate Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-lime-600" />
                Recommended Candidates
              </CardTitle>
              <CardDescription>
                Top candidates that were suggested during quote creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                // Extract all recommended candidates from the nested structure
                const allCandidates: Array<{
                  id: string;
                  name: string;
                  position: string;
                  avatar?: string;
                  score: number;
                  bio?: string;
                  expectedSalary?: number;
                }> = [];

                if (quote.candidate_recommendations && quote.candidate_recommendations.length > 0) {
                  quote.candidate_recommendations.forEach((roleData: any) => {
                    if (roleData.recommendedCandidates && roleData.recommendedCandidates.length > 0) {
                      const mappedCandidates = roleData.recommendedCandidates.map((candidate: any) => ({
                        id: candidate.id,
                        name: candidate.name,
                        position: candidate.position,
                        avatar: candidate.avatar,
                        score: candidate.matchScore || candidate.overallScore || 0,
                        bio: candidate.bio,
                        expectedSalary: candidate.expectedSalary || 0
                      }));
                      allCandidates.push(...mappedCandidates);
                    }
                  });
                }

                // Check if we have any candidates
                const hasCandidates = allCandidates.length > 0;
                
                return hasCandidates ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                            {candidate.avatar ? (
                              <img 
                                src={candidate.avatar} 
                                alt={candidate.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <Users className="w-6 h-6 text-lime-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-lime-600">{candidate.score}%</div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                      {/* Additional candidate info */}
                      {candidate.expectedSalary && candidate.expectedSalary > 0 && (
                        <div className="mb-3 p-2 bg-lime-50 rounded-lg">
                          <div className="text-sm font-medium text-lime-800">
                            Expected: {formatPrice(convertPrice(candidate.expectedSalary))}/month
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-lime-600 hover:bg-lime-700 text-white"
                          onClick={() => window.open(`/employee/${candidate.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-lime-300 text-lime-700 hover:bg-lime-50"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-lime-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse the Talent Pool</h3>
                    <p className="text-gray-600 mb-4">
                      The recommended candidates don't match your specific role requirements.
                    </p>
                    <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-lime-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Explore our full talent pool for better matches</span>
                      </div>
                    </div>
                    <Button 
                      className="bg-lime-600 hover:bg-lime-700 text-white"
                      onClick={() => window.open('/we-got-talent', '_blank')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Browse Talent Pool
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
              <CardDescription>
                Monthly cost distribution for your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Base Salary Costs</span>
                  <span className="font-medium">
                    {formatPrice(convertPrice(Math.round(quote.total_monthly_cost * 0.8)))}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="flex flex-col">
                    <span className="text-gray-600">Working Setup</span>
                    <span className="text-sm text-gray-500">
                      {(() => {
                        const workspaceCounts: Record<string, number> = {};
                        quote.roles_preview?.forEach(role => {
                          const workspace = role.workspace_type;
                          workspaceCounts[workspace] = (workspaceCounts[workspace] || 0) + 1;
                        });
                        return Object.entries(workspaceCounts)
                          .map(([workspace, count]) => `${count}x ${workspace}`)
                          .join(', ');
                      })()}
                    </span>
                  </div>
                  <span className="font-medium">
                    {formatPrice(convertPrice(Math.round(quote.total_monthly_cost * 0.15)))}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-lime-50 rounded-lg px-4">
                  <span className="text-lg font-semibold text-gray-900">Total Monthly Cost</span>
                  <span className="text-xl font-bold text-lime-600">
                    {formatPrice(convertPrice(quote.total_monthly_cost))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button 
                size="sm" 
                className="bg-lime-600 hover:bg-lime-700"
                onClick={handleSendToClient}
                disabled={isSending}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send to Client'}
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Valid until {new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
