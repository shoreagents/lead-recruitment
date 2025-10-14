'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  BookOpen, 
  Users 
} from 'lucide-react'
import { UserQuoteService, UserQuoteSummary } from '@/lib/userQuoteService'

// Next Step Card Component
interface NextStepCardProps {
  onSeePricing: () => void;
}

export const NextStepCard = ({ onSeePricing }: NextStepCardProps) => (
  <Card 
    className="hover:shadow-md transition-shadow"
    style={{
      gridColumn: 'span 1',
      gridRow: 'span 1'
    }}
  >
    <CardContent className="p-4">
      <div className="flex flex-col h-full space-y-3">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-lime-600" />
          <h3 className="text-base font-semibold text-gray-900">Next Step</h3>
        </div>
        <p className="text-sm text-gray-700 flex-grow">Based on your browsing:</p>
        <Button
          onClick={onSeePricing}
          size="sm"
          className="w-full bg-lime-600 hover:bg-lime-700 text-white transition-colors"
        >
          View Pricing
        </Button>
      </div>
    </CardContent>
  </Card>
)

// Case Study Card Component
interface CaseStudyCardProps {
  onReadMore: () => void;
}

export const CaseStudyCard = ({ onReadMore }: CaseStudyCardProps) => (
  <Card 
    className="hover:shadow-md transition-shadow"
    style={{
      gridColumn: 'span 1',
      gridRow: 'span 2'
    }}
  >
    <CardContent className="p-4">
      <div className="flex flex-col h-full space-y-3">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-lime-600" />
          <h3 className="text-base font-semibold text-gray-900">Case Study</h3>
        </div>
        <p className="text-sm text-gray-700 flex-grow">Gallery Group Success</p>
        <Button
          onClick={onReadMore}
          size="sm"
          variant="outline"
          className="w-full border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white transition-colors"
        >
          Read More
        </Button>
      </div>
    </CardContent>
  </Card>
)

// Top Candidate Card Component
interface TopCandidateCardProps {
  topCandidate: Record<string, unknown> | null;
  isLoading: boolean;
  onViewProfile: () => void;
}

export const TopCandidateCard = ({ 
  topCandidate, 
  isLoading, 
  onViewProfile 
}: TopCandidateCardProps) => (
  <Card 
    className="hover:shadow-md transition-shadow"
    style={{
      gridColumn: 'span 1',
      gridRow: 'span 4'
    }}
  >
    <CardContent className="p-4">
      <div className="flex flex-col h-full space-y-3">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-lime-600" />
          <h3 className="text-base font-semibold text-gray-900">Top Candidate</h3>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full border-2 border-lime-600 border-t-transparent w-6 h-6" />
          </div>
        ) : topCandidate ? (
          <div className="space-y-3">
            {/* Candidate Info */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-lime-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-lime-600">
                  {String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.name || '').charAt(0)}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.name || '')}
              </h4>
              <p className="text-xs text-gray-600">
                {String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.position || 'Specialist')}
              </p>
            </div>
            
            {/* Viewing Stats */}
            {Number((topCandidate as Record<string, unknown>).hotnessScore) > 0 && (
              <div className="bg-lime-50 rounded-lg p-2 text-center">
                <div className="text-xs text-lime-600 font-medium">
                  Most viewed by you
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Number((topCandidate as Record<string, unknown>).hotnessScore)} seconds viewed
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No viewing history yet</p>
            <p className="text-xs text-gray-400 mt-1">Start browsing to see recommendations</p>
          </div>
        )}
        <Button
          onClick={onViewProfile}
          size="sm"
          variant="outline"
          className="w-full border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white transition-colors"
        >
          {topCandidate ? 'View Profile' : 'Browse Talent'}
        </Button>
      </div>
    </CardContent>
  </Card>
)

// Recent Quote Card Component
interface RecentQuoteCardProps {
  recentQuotes: UserQuoteSummary[];
  isLoading: boolean;
  onViewQuote: () => void;
  onCreateQuote: () => void;
}

export const RecentQuoteCard = ({ 
  recentQuotes, 
  isLoading, 
  onViewQuote, 
  onCreateQuote 
}: RecentQuoteCardProps) => {
  const latestQuote = recentQuotes.length > 0 ? recentQuotes[0] : null;
  const otherQuotes = recentQuotes.slice(1, 3); // Show up to 2 additional quotes

  return (
    <Card 
      className="hover:shadow-md transition-shadow"
      style={{
        gridColumn: 'span 1',
        gridRow: 'span 3'
      }}
    >
      <CardContent className="p-4">
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-lime-600" />
              <h3 className="text-base font-semibold text-gray-900">Recent Quotes</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onViewQuote}
                className="text-xs px-2 py-1 h-7 border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white transition-colors"
              >
                View All
              </Button>
              <Button
                size="sm"
                onClick={onCreateQuote}
                className="text-xs px-2 py-1 h-7 bg-lime-600 hover:bg-lime-700 text-white"
              >
                + New Quote
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full border-2 border-lime-600 border-t-transparent w-6 h-6" />
            </div>
          ) : latestQuote ? (
            <div className="space-y-3">
              {/* Latest Quote - Prominent Display */}
              <div className="bg-lime-50 rounded-lg p-3 border border-lime-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-lime-700 bg-lime-100 px-2 py-1 rounded">
                    Latest
                  </span>
                  <span className="text-xs text-gray-500">
                    {UserQuoteService.getQuoteAge(latestQuote.created_at)}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-lime-600">
                    {UserQuoteService.formatCurrency(latestQuote.total_monthly_cost, latestQuote.currency_code)}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  <div className="font-medium">{latestQuote.member_count} members</div>
                  <div className="text-xs text-gray-500">{latestQuote.industry}</div>
                  <div className="text-xs text-gray-500">{latestQuote.roles_count} roles</div>
                </div>
              </div>

              {/* Other Recent Quotes */}
              {otherQuotes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Recent</div>
                  {otherQuotes.map((quote, index) => (
                    <div key={quote.id} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {UserQuoteService.formatCurrency(quote.total_monthly_cost, quote.currency_code)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {UserQuoteService.getQuoteAge(quote.created_at)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {quote.member_count} members • {quote.industry}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No quotes yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first quote</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Reserved Card Component
interface ReservedCardProps {
  title?: string;
  description?: string;
}

export const ReservedCard = ({ 
  title = "More suggestions soon...", 
  description = "?" 
}: ReservedCardProps) => (
  <Card 
    className="hover:shadow-md transition-shadow"
    style={{
      gridColumn: 'span 1',
      gridRow: 'span 2'
    }}
  >
    <CardContent className="p-4">
      <div className="flex flex-col h-full items-center justify-center text-center space-y-2">
        <span className="text-gray-500 text-lg">{description}</span>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </CardContent>
  </Card>
)
