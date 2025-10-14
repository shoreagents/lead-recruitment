"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
// import { useEngagementTracking } from '@/lib/useEngagementTracking'
import ChatConsole from '@/components/ui/ai-chat-console'
import { PricingCalculatorModal } from '@/components/ui/pricing-calculator-modal'
import { useState, useEffect, useCallback } from 'react'
import { candidateTracker } from '@/lib/candidateTrackingService'
import { getEmployeeCardData } from '@/lib/api'
import { UserQuoteService, UserQuoteSummary } from '@/lib/userQuoteService'
import { 
  NextStepCard, 
  CaseStudyCard, 
  RecentQuoteCard, 
  ReservedCard 
} from '@/components/ui/dashboard-cards'
import { TopCandidateWithMatches } from '@/components/ui/top-candidate-with-matches'
import { InterviewRequestModal, InterviewRequestData } from '@/components/ui/interview-request-modal'

export default function UserDashboardPage() {
  const { user } = useUserAuth()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)

  // Add dashboard-page class to body to prevent scrolling
  useEffect(() => {
    document.body.classList.add('dashboard-page')
    return () => {
      document.body.classList.remove('dashboard-page')
    }
  }, [])
  const [selectedCandidate, setSelectedCandidate] = useState<{ name: string; id: string; position?: string } | null>(null)
  const [topCandidate, setTopCandidate] = useState<Record<string, unknown> | null>(null)
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false)
  const [recentQuotes, setRecentQuotes] = useState<UserQuoteSummary[]>([])
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [recommendedCandidates, setRecommendedCandidates] = useState<Array<{
    id: string;
    name: string;
    position: string;
    avatar?: string;
    score: number;
    isFavorite?: boolean;
    bio?: string;
    expectedSalary?: number;
  }>>([])
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false)
  // const { // recordInteraction } = useEngagementTracking()

  const handleChatWithClaude = useCallback(() => {
    // // recordInteraction('chat')
    console.log('Chat button clicked - interaction recorded')
    setIsChatOpen(true)
  }, []);

  const handleChatOpen = useCallback(() => {
    // // recordInteraction('chat')
    console.log('Chat with Maya button clicked from sidebar - interaction recorded')
    setIsChatOpen(true)
  }, []);

  const handleBrowseTalent = useCallback(() => {
    // recordInteraction('navigation')
    console.log('Browse Talent button clicked - interaction recorded')
    router.push('/we-got-talent')
  }, [router]);

  const handleViewCandidateProfile = useCallback(() => {
    if (topCandidate) {
      // recordInteraction('navigation')
      console.log('Viewing candidate profile:', (topCandidate as Record<string, unknown>).user)
      const userId = ((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.id
      router.push(`/employee/${userId}`)
    } else {
      handleBrowseTalent()
    }
  }, [topCandidate, router, handleBrowseTalent]);

  const handleAskForInterview = useCallback((candidateId: string, candidateName: string, candidatePosition?: string) => {
    // recordInteraction('interview-request')
    console.log('Ask for interview clicked for candidate:', candidateName, candidateId, candidatePosition)
    setSelectedCandidate({ name: candidateName, id: candidateId, position: candidatePosition })
    setIsInterviewModalOpen(true)
  }, [])

  const handleInterviewSubmit = async (data: InterviewRequestData) => {
    try {
      console.log('Interview request submitted:', {
        candidateName: selectedCandidate?.name,
        candidateId: selectedCandidate?.id,
        ...data
      });
      
      // You can add your API call here to submit the interview request
      // await submitInterviewRequest({ candidateId: selectedCandidate?.id, ...data });
      
      setIsInterviewModalOpen(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Error submitting interview request:', error);
    }
  };

  const handleViewMatchedProfile = useCallback((candidateId: string, candidateName: string) => {
    // recordInteraction('navigation')
    console.log('View profile clicked for candidate:', candidateName, candidateId)
    router.push(`/employee/${candidateId}`)
  }, [router]);

  const handleSeePricing = useCallback(() => {
    // recordInteraction('navigation')
    console.log('See Pricing button clicked - interaction recorded')
    router.push('/pricing')
  }, [router]);

  const handleViewQuote = useCallback(() => {
    // recordInteraction('navigation')
    console.log('View Quote button clicked - interaction recorded')
    router.push('/user-dashboard/quotation')
  }, [router]);

  const handleCreateQuote = useCallback(() => {
    // recordInteraction('navigation')
    console.log('Create Quote button clicked - interaction recorded')
    setIsPricingModalOpen(true)
  }, []);

  const fetchTopCandidate = useCallback(async () => {
    try {
      console.log('🔄 Fetching top candidate for dashboard...')
      setIsLoadingCandidate(true)
      
      let userId = null
      
      // Get user ID - either from authenticated user or device ID for anonymous users
      if (user?.user_id) {
        userId = user.user_id
        console.log('Using authenticated user ID:', userId)
      } else {
        // For anonymous users, get device ID from localStorage
        if (typeof window !== 'undefined') {
          userId = localStorage.getItem('content_tracking_device_id')
          console.log('Using device ID for anonymous user:', userId)
          
          // Also check for alternative device ID keys
          const altDeviceId = localStorage.getItem('device_id') || localStorage.getItem('session_id')
          console.log('Alternative device IDs found:', { altDeviceId })
        }
      }

      // If no user ID or device ID available, show no candidate
      if (!userId) {
        console.log('No user ID or device ID available')
        setTopCandidate(null)
        return
      }

      // Use the singleton candidate tracker
      
      // Get the most viewed candidate for this specific user/device
      const mostViewedData = await candidateTracker.getUserMostViewedCandidate(userId)
      
      console.log('🔍 Most viewed data received:', mostViewedData)
      console.log('🔍 User ID being queried:', userId)
      
      if (!mostViewedData) {
        console.log('❌ No most viewed candidate data found - showing fallback candidate')
        // Show a fallback candidate when no viewing history exists
        const employees = await getEmployeeCardData()
        if (employees.length > 0) {
          // Show the first available candidate as fallback
          const fallbackCandidate = {
            ...employees[0],
            hotnessScore: 0 // No viewing history
          }
          console.log('✅ Setting fallback candidate:', fallbackCandidate.user.name)
          setTopCandidate(fallbackCandidate)
          return
        } else {
          setTopCandidate(null)
          return
        }
      }

      // Get all employees to find the one that matches the most viewed candidate
      const employees = await getEmployeeCardData()
      
      // Try multiple matching strategies
      let targetEmployee = employees.find(emp => emp.user.id === mostViewedData.candidate_id)
      
      // If not found by ID, try matching by name
      if (!targetEmployee && mostViewedData.candidate_name) {
        const candidateName = String(mostViewedData.candidate_name);
        targetEmployee = employees.find(emp => 
          emp.user.name.toLowerCase().includes(candidateName.toLowerCase()) ||
          candidateName.toLowerCase().includes(emp.user.name.toLowerCase())
        )
      }
      
      // If still not found, try matching by first name or last name
      if (!targetEmployee && mostViewedData.candidate_name) {
        const nameParts = String(mostViewedData.candidate_name).split(' ')
        targetEmployee = employees.find(emp => 
          nameParts.some(part => 
            emp.user.name.toLowerCase().includes(part.toLowerCase()) ||
            part.toLowerCase().includes(emp.user.name.toLowerCase())
          )
        )
      }
      
      if (targetEmployee) {
        // Add hotness score to the employee data
        const hotnessScore = Number(mostViewedData.view_duration) || 0
        const candidateWithScore = {
          ...targetEmployee,
          hotnessScore: hotnessScore
        }
        
        console.log('✅ Found matching candidate:', targetEmployee.user.name)
        console.log('✅ Hotness score:', hotnessScore)
        setTopCandidate(candidateWithScore)
      } else {
        console.log('❌ No matching employee found for most viewed candidate')
        // Show fallback candidate
        if (employees.length > 0) {
          const fallbackCandidate = {
            ...employees[0],
            hotnessScore: 0
          }
          setTopCandidate(fallbackCandidate)
        } else {
          setTopCandidate(null)
        }
      }
    } catch (error) {
      console.error('❌ Error fetching top candidate:', error)
      setTopCandidate(null)
    } finally {
      setIsLoadingCandidate(false)
    }
  }, [user?.user_id]);

  const fetchRecentQuotes = useCallback(async () => {
    try {
      console.log('🔄 Fetching recent quotes for dashboard...')
      console.log('🔍 User ID:', user?.user_id)
      setIsLoadingQuote(true)
      
      if (!user?.user_id) {
        console.log('❌ No user ID available for quote fetching')
        setRecentQuotes([])
        return
      }

      const result = await UserQuoteService.getAllQuotes(user.user_id)
      
      if (result.success && result.data) {
        console.log('✅ Recent quotes found:', result.data.length)
        // Take the first 3 quotes (latest first)
        const recentQuotes = result.data.slice(0, 3)
        setRecentQuotes(recentQuotes)
      } else {
        console.log('❌ No recent quotes found or error:', result.error)
        console.log('🔍 This means the user has no quotes in the database yet')
        setRecentQuotes([])
      }
    } catch (error) {
      console.error('❌ Error fetching recent quotes:', error)
      setRecentQuotes([])
    } finally {
      setIsLoadingQuote(false)
    }
  }, [user?.user_id]);

  const fetchRecommendedCandidates = useCallback(async () => {
    if (!user?.user_id) {
      console.log('No user ID available for fetching recommended candidates')
      return
    }

    setIsLoadingRecommended(true)
    try {
      console.log('🔍 Fetching recommended candidates from recent quotes for user:', user.user_id)
      
      // Get all quotes for the user
      const quotesResult = await UserQuoteService.getAllQuotes(user.user_id)
      
      if (!quotesResult.success || !quotesResult.data) {
        console.log('No quotes found for user or error occurred')
        setRecommendedCandidates([])
        return
      }

      console.log('📊 Found quotes:', quotesResult.data.length)

      // Collect all recommended candidates from all quotes
      const allRecommendedCandidates: Array<{
        id: string;
        name: string;
        position: string;
        avatar?: string;
        score: number;
        isFavorite?: boolean;
      }> = []

      quotesResult.data.forEach((quote, index) => {
        console.log(`🔍 Quote ${index + 1}:`, {
          id: quote.id,
          candidate_recommendations: quote.candidate_recommendations,
          recommendations_length: quote.candidate_recommendations?.length || 0
        })
        
        if (quote.candidate_recommendations && quote.candidate_recommendations.length > 0) {
          // Handle nested structure: extract recommendedCandidates from each role
          quote.candidate_recommendations.forEach((roleData, roleIndex) => {
            if (roleData.recommendedCandidates && roleData.recommendedCandidates.length > 0) {
              console.log(`✅ Role ${roleIndex + 1} (${roleData.roleTitle}): ${roleData.recommendedCandidates.length} candidates`)
              
              // Map the nested structure to the expected format
              const mappedCandidates = roleData.recommendedCandidates.map(candidate => ({
                id: candidate.id,
                name: candidate.name,
                position: candidate.position,
                avatar: candidate.avatar,
                score: candidate.matchScore || candidate.overallScore || 0,
                isFavorite: candidate.isFavorite || false,
                bio: candidate.bio,
                expectedSalary: candidate.expectedSalary || 0
              }))
              
              allRecommendedCandidates.push(...mappedCandidates)
            }
          })
        } else {
          console.log(`❌ No candidate recommendations in quote ${index + 1}`)
        }
      })

      // Remove duplicates based on candidate ID and sort by score
      const uniqueCandidates = allRecommendedCandidates.reduce((acc, candidate) => {
        const existing = acc.find(c => c.id === candidate.id)
        if (!existing || candidate.score > existing.score) {
          return acc.filter(c => c.id !== candidate.id).concat(candidate)
        }
        return acc
      }, [] as typeof allRecommendedCandidates)

      // Sort by score (highest first) and take top 5
      const topCandidates = uniqueCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      console.log('📋 All collected candidates:', allRecommendedCandidates.length)
      console.log('🔄 Unique candidates after deduplication:', uniqueCandidates.length)
      console.log('🏆 Top 5 candidates:', topCandidates)
      console.log('✅ Setting recommended candidates:', topCandidates.length)
      setRecommendedCandidates(topCandidates)
    } catch (error) {
      console.error('Error fetching recommended candidates:', error)
      setRecommendedCandidates([])
    } finally {
      setIsLoadingRecommended(false)
    }
  }, [user?.user_id]);

  // Fetch data on component mount
  useEffect(() => {
    fetchTopCandidate()
    fetchRecentQuotes()
    fetchRecommendedCandidates()
  }, [fetchTopCandidate, fetchRecentQuotes, fetchRecommendedCandidates])

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar onChatOpen={handleChatOpen} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-1 border-b">
            <SidebarTrigger className="!size-8 hover:bg-lime-100 [&_svg]:!w-6 [&_svg]:!h-6" />
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <Badge variant="secondary" className="text-xs">
                Welcome back, {user?.first_name}!
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* AI Recommendations Content */}
            <div className="grid gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">AI Recommendations</h2>
                <p className="text-muted-foreground">
                  Personalized suggestions based on your browsing behavior
                </p>
              </div>
            </div>

            {/* AI-Powered Sections - Grid Layout */}
            <div className="grid" style={{
              display: 'grid',
              height: '75%',
              width: '100%',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(4, 1fr)',
              gap: '16px',
              backgroundColor: '#ffffff',
              padding: '8px',
              borderRadius: '8px',
            }}>
              
              {/* Section 1: Next Step CTA - 1x1 */}
              <NextStepCard onSeePricing={handleSeePricing} />

              {/* Section 2: Suggested Case Study - 1x2 */}
              <CaseStudyCard onReadMore={() => router.push('/case-studies')} />

              {/* Section 3: Top Candidate with Matches - 1x4 */}
              <TopCandidateWithMatches 
                topCandidate={topCandidate}
                isLoadingCandidate={isLoadingCandidate}
                onViewProfile={handleViewCandidateProfile}
                recommendedCandidates={recommendedCandidates}
                isLoadingRecommended={isLoadingRecommended}
                onAskForInterview={handleAskForInterview}
                onViewMatchedProfile={handleViewMatchedProfile}
              />

              {/* Section 4: Recent Quotes - 1x3 */}
              <RecentQuoteCard 
                recentQuotes={recentQuotes}
                isLoading={isLoadingQuote}
                onViewQuote={handleViewQuote}
                onCreateQuote={handleCreateQuote}
              />

              {/* Section 5: Empty/Reserved - 1x2 */}
              <ReservedCard />

            </div>
          </div>
          
          {/* AI Chat Console */}
          <ChatConsole 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
          
          {/* Pricing Calculator Modal */}
          <PricingCalculatorModal 
            isOpen={isPricingModalOpen} 
            onClose={() => setIsPricingModalOpen(false)} 
          />

          {/* Interview Request Modal */}
          {selectedCandidate && (
            <InterviewRequestModal
              isOpen={isInterviewModalOpen}
              onClose={() => {
                setIsInterviewModalOpen(false);
                setSelectedCandidate(null);
              }}
              candidateName={selectedCandidate.name}
              candidatePosition={selectedCandidate.position || 'Position not specified'}
              candidateId={selectedCandidate.id}
              onSubmit={handleInterviewSubmit}
            />
          )}
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}
