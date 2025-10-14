import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  Users, 
  Target, 
  MessageCircle, 
  Eye, 
  Heart 
} from 'lucide-react'
import { useFavorites } from '@/lib/favorites-context'
import { getEmployeeCardData } from '@/lib/api'
import { EmployeeCardData } from '@/types/api'
import { useEmployeeCardData } from '@/hooks/use-api'

// Top Candidate Section Component
interface TopCandidateSectionProps {
  topCandidate: Record<string, unknown> | null;
  isLoading: boolean;
  onViewProfile: () => void;
  onAskForInterview?: (candidateId: string, candidateName: string, candidatePosition?: string) => void;
}

const TopCandidateSection = ({ 
  topCandidate, 
  isLoading, 
  onViewProfile,
  onAskForInterview
}: TopCandidateSectionProps) => {
  // Use TanStack Query for data fetching - preserves all custom logic
  const { data: allProfiles = [], isLoading: isLoadingProfiles } = useEmployeeCardData();
  
  // Find the profile that matches the current candidate - preserves custom logic
  const employeeProfile = React.useMemo(() => {
    if (!topCandidate || !allProfiles.length) return null;
    
    const userId = String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.id || '');
    if (!userId) return null;
    
    return allProfiles.find(p => p.user.id === userId) || null;
  }, [topCandidate, allProfiles]);
  
  const isLoadingProfile = isLoadingProfiles;

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center space-x-3">
        <Users className="w-5 h-5 text-lime-600" />
        <h3 className="text-base font-semibold text-gray-900">Top Candidate</h3>
      </div>
      
      {isLoading || isLoadingProfile ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full border-2 border-lime-600 border-t-transparent w-6 h-6" />
        </div>
      ) : (employeeProfile || topCandidate) ? (
        <div className="space-y-3">
          {/* Use fallback data if employee profile is not available */}
          {(() => {
            const displayData = {
              name: employeeProfile?.user?.name || String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.name || 'Unknown'),
              position: employeeProfile?.user?.position || String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.position || 'Position'),
              bio: employeeProfile?.user?.bio || String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.bio || ''),
              avatar: employeeProfile?.user?.avatar || String(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.avatar || ''),
              expectedSalary: Number(((topCandidate as Record<string, unknown>).user as Record<string, unknown>)?.expectedSalary || 0)
            };
            
            return (
              <>
                {/* Candidate Info */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={displayData.avatar} />
                    <AvatarFallback className="text-lg bg-lime-100 text-lime-600">
                      {displayData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {displayData.name}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {displayData.position}
                    </p>
                  </div>
                </div>

                {/* Bio and Expected Salary */}
                {displayData.bio && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-600 line-clamp-2" title={displayData.bio}>
                      {displayData.bio}
                    </div>
                  </div>
                )}
                
                {displayData.expectedSalary > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-lime-600">
                      Expected: ${displayData.expectedSalary.toLocaleString()}/month
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-1 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-6 text-xs px-1 text-white hover:brightness-110 hover:scale-105 transition-all duration-200"
                    style={{ 
                      borderColor: 'rgb(101, 163, 13)', 
                      backgroundColor: 'rgb(101, 163, 13)' 
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onAskForInterview && employeeProfile) {
                        onAskForInterview(employeeProfile.user.id, employeeProfile.user.name, employeeProfile.user.position)
                      }
                    }}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Interview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-6 text-xs px-1 text-white hover:brightness-110 hover:scale-105 transition-all duration-200"
                    style={{ 
                      borderColor: 'rgb(101, 163, 13)', 
                      backgroundColor: 'rgb(101, 163, 13)' 
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewProfile()
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                </div>
              </>
            );
          })()}
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
    </div>
  )
}

// Best Matched Candidates Component
interface BestMatchedCandidatesProps {
  recommendedCandidates: Array<{
    id: string;
    name: string;
    position: string;
    avatar?: string;
    score: number;
    isFavorite?: boolean;
    bio?: string;
    expectedSalary?: number;
  }>;
  isLoading: boolean;
  onAskForInterview?: (candidateId: string, candidateName: string) => void;
  onViewProfile?: (candidateId: string, candidateName: string) => void;
}

const BestMatchedCandidates = ({ 
  recommendedCandidates = [], 
  isLoading = false,
  onAskForInterview,
  onViewProfile
}: BestMatchedCandidatesProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [employeeProfiles, setEmployeeProfiles] = useState<EmployeeCardData[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  
  // Debug logging
  console.log('🎯 BestMatchedCandidates received:', {
    recommendedCandidates,
    count: recommendedCandidates.length,
    isLoading
  })
  
  // Fetch employee profiles from BPOC API
  useEffect(() => {
    const fetchEmployeeProfiles = async () => {
      if (recommendedCandidates.length === 0) return;
      
      setIsLoadingProfiles(true);
      try {
        const allProfiles = await getEmployeeCardData();
        const profiles = recommendedCandidates.map(candidate => {
          const profile = allProfiles.find(p => p.user.id === candidate.id);
          return profile || null;
        });
        
        // Filter out null results
        const validProfiles = profiles.filter((profile): profile is EmployeeCardData => profile !== null);
        setEmployeeProfiles(validProfiles);
      } catch (error) {
        console.error('Error fetching employee profiles:', error);
      } finally {
        setIsLoadingProfiles(false);
      }
    };

    fetchEmployeeProfiles();
  }, [recommendedCandidates]);
  
  // Auto-rotate through candidates every 3 seconds
  useEffect(() => {
    if (recommendedCandidates.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % recommendedCandidates.length
        );
      setIsAnimating(false);
      }, 150); // Half of animation duration
    }, 3000); // 3 seconds
    
    return () => clearInterval(interval);
  }, [recommendedCandidates.length]);
  
  // Handle manual navigation with animation
  const handleNavigateTo = (index: number) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 150);
  };
  
  // Get the current candidate to display
  const currentCandidate = recommendedCandidates.length > 0 ? recommendedCandidates[currentIndex] : null;
  const currentEmployeeProfile = employeeProfiles.length > 0 ? employeeProfiles[currentIndex] : null;
  
  // Debug current candidate
  console.log('🎯 Current candidate:', {
    currentIndex,
    currentCandidate,
    currentEmployeeProfile,
    totalCandidates: recommendedCandidates.length
  })
  
  if (isLoading || isLoadingProfiles) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-lime-600" />
          <h4 className="text-sm font-semibold text-gray-900">AI Matched</h4>
        </div>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full border-2 border-lime-600 border-t-transparent w-4 h-4" />
        </div>
      </div>
    )
  }

  if (!currentCandidate) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-lime-600" />
          <h4 className="text-sm font-semibold text-gray-900">AI Matched</h4>
        </div>
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">No AI matches yet</div>
          <div className="text-gray-400 text-xs">Create a quote to see recommendations</div>
        </div>
      </div>
    )
  }

  // Use fallback data if employee profile is not available
  const displayData = {
    name: currentEmployeeProfile?.user?.name || currentCandidate?.name || 'Unknown',
    position: currentEmployeeProfile?.user?.position || currentCandidate?.position || 'Position',
    avatar: currentEmployeeProfile?.user?.avatar || currentCandidate?.avatar,
    bio: currentEmployeeProfile?.user?.bio || currentCandidate?.bio,
    expectedSalary: currentCandidate?.expectedSalary || 0
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center space-x-2">
        <Target className="w-4 h-4 text-lime-600" />
        <h4 className="text-sm font-semibold text-gray-900">AI Matched</h4>
      </div>
      
      {/* Current Candidate Card */}
      <div className={`bg-gray-50 rounded-lg p-3 transition-all duration-300 ${
        isAnimating ? 'opacity-0 transform translate-x-2' : 'opacity-100 transform translate-x-0'
      }`}>
        {/* Candidate Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarImage src={displayData.avatar} />
            <AvatarFallback className="text-lg bg-lime-100 text-lime-800">
              {displayData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <div className="text-sm font-semibold text-gray-800 truncate" title={displayData.name}>
                {displayData.name.split(' ')[0]}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(currentCandidate.id);
                }}
                className="p-0.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                title={isFavorite(currentCandidate.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className={`w-3 h-3 transition-all duration-200 ${
                    isFavorite(currentCandidate.id) 
                      ? 'text-red-500 fill-current scale-110' 
                      : 'text-gray-400 hover:text-red-500 hover:scale-105'
                  }`} 
                />
              </button>
            </div>
            <div className="text-xs text-gray-600 truncate" title={displayData.position}>
              {displayData.position}
            </div>
          </div>
        </div>

        {/* Bio and Expected Salary */}
        {displayData.bio && (
          <div className="mb-3">
            <div className="text-xs text-gray-600 line-clamp-2" title={displayData.bio}>
              {displayData.bio}
            </div>
          </div>
        )}
        
        {displayData.expectedSalary > 0 && (
          <div className="mb-3">
            <div className="text-xs font-medium text-lime-600">
              Expected: ${displayData.expectedSalary.toLocaleString()}/month
            </div>
          </div>
        )}

        {/* Score Bar */}
        <div className="w-full mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Match Score</span>
            <span className="font-semibold">{Math.round(currentCandidate.score)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-1.5 rounded-full transition-all duration-700 ease-out" 
              style={{ 
                width: `${Math.min(currentCandidate.score, 100)}%`,
                backgroundColor: 'rgb(101, 163, 13)',
                transform: isAnimating ? 'scaleX(0)' : 'scaleX(1)',
                transformOrigin: 'left'
              }}
            ></div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 w-full">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-6 text-xs px-1 text-white hover:brightness-110 hover:scale-105 transition-all duration-200"
            style={{ 
              borderColor: 'rgb(101, 163, 13)', 
              backgroundColor: 'rgb(101, 163, 13)' 
            }}
            onClick={(e) => {
              e.stopPropagation()
              onAskForInterview?.(currentCandidate.id, currentCandidate.name)
            }}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Interview
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-6 text-xs px-1 text-white hover:brightness-110 hover:scale-105 transition-all duration-200"
            style={{ 
              borderColor: 'rgb(101, 163, 13)', 
              backgroundColor: 'rgb(101, 163, 13)' 
            }}
            onClick={(e) => {
              e.stopPropagation()
              onViewProfile?.(currentCandidate.id, currentCandidate.name)
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            View Profile
          </Button>
        </div>
      </div>

      {/* Carousel Indicators */}
      {recommendedCandidates.length > 1 && (
        <div className="flex justify-center gap-1">
          {recommendedCandidates.map((_, index) => (
            <button
              key={index}
              onClick={() => handleNavigateTo(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-lime-600 scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Main Combined Component
interface TopCandidateWithMatchesProps {
  topCandidate: Record<string, unknown> | null;
  isLoadingCandidate: boolean;
  onViewProfile: () => void;
  recommendedCandidates: Array<{
    id: string;
    name: string;
    position: string;
    avatar?: string;
    score: number;
    isFavorite?: boolean;
    bio?: string;
    expectedSalary?: number;
  }>;
  isLoadingRecommended: boolean;
  onAskForInterview?: (candidateId: string, candidateName: string) => void;
  onViewMatchedProfile?: (candidateId: string, candidateName: string) => void;
}

export const TopCandidateWithMatches = ({
  topCandidate,
  isLoadingCandidate,
  onViewProfile,
  recommendedCandidates,
  isLoadingRecommended,
  onAskForInterview,
  onViewMatchedProfile
}: TopCandidateWithMatchesProps) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow h-full"
      style={{
        gridColumn: 'span 1',
        gridRow: 'span 4'
      }}
    >
      <CardContent className="p-4 h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-lime-600" />
            <h3 className="text-base font-semibold text-gray-900">Candidate Insights</h3>
          </div>

          {/* Split into two equal sections */}
          <div className="flex-1 flex flex-col">
            {/* Top Candidate Section - 50% */}
            <div className="flex-1 flex flex-col">
              <TopCandidateSection 
                topCandidate={topCandidate}
                isLoading={isLoadingCandidate}
                onViewProfile={onViewProfile}
                onAskForInterview={onAskForInterview}
              />
            </div>
            
            {/* Horizontal Rule */}
            <hr className="border-gray-200 my-4" />
            
            {/* Best Matched Candidates Section - 50% */}
            <div className="flex-1 flex flex-col">
              <BestMatchedCandidates 
                recommendedCandidates={recommendedCandidates}
                isLoading={isLoadingRecommended}
                onAskForInterview={onAskForInterview}
                onViewProfile={onViewMatchedProfile}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
