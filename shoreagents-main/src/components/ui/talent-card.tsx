'use client';

import { useRouter } from 'next/navigation';
import { EmployeeCardData } from '@/types/api';
import Image from 'next/image';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
// import { ButtonLoader } from './loader'; // Removed - will be recreated later
import { 
  User, 
  Eye,
  Trophy,
  Calendar,
  Flame,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { candidateTracker } from '@/lib/candidateTrackingService';
import { useFavorites } from '@/lib/favorites-context';

interface TalentCardProps {
  data: EmployeeCardData;
  onAskForInterview?: () => void;
}

export function TalentCard({ data, onAskForInterview }: TalentCardProps) {
  const router = useRouter();
  const hasWorkStatus = data.workStatus;
  const hasResume = data.resume;
  const [hotnessScore, setHotnessScore] = useState<number>(0);
  const [isLoadingHotness, setIsLoadingHotness] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Function to calculate gradual popularity score (0-100)
  const calculateGradualPopularity = (rawScore: number): number => {
    if (!rawScore || rawScore <= 0) return 0;
    
    // Use logarithmic scaling to make it harder to reach 100%
    // This creates a more gradual progression
    const maxRawScore = 1000; // Adjust this based on your data range
    const normalizedScore = Math.min(rawScore / maxRawScore, 1);
    
    // Apply logarithmic scaling: log(1 + x) / log(2) gives us 0-1 range
    const logScore = Math.log(1 + normalizedScore * 9) / Math.log(10); // 9x multiplier for more spread
    
    // Convert to percentage and cap at 100
    return Math.min(logScore * 100, 100);
  }

  // Calculate score based on various factors
  const calculateScore = () => {
    let score = 0;
    if (hasResume) score += 20;
    if (data.aiAnalysis) score += 15;
    if (hasWorkStatus) score += 25;
    if (data.applications && Array.isArray(data.applications) && data.applications.length > 0) score += 10;
    if (data.user?.position) score += 10;
    if (data.user?.location) score += 10;
    if (data.user?.avatar) score += 10;
    
    // Use AI analysis score if available
    if (data.aiAnalysis?.overall_score) {
      return data.aiAnalysis.overall_score;
    }
    
    return Math.min(score, 100);
  };

  const score = calculateScore();

  // Fetch hotness score for this candidate
  useEffect(() => {
    const fetchHotnessScore = async () => {
      try {
        setIsLoadingHotness(true);
        console.log('🔍 Fetching hotness score for candidate:', data.user?.id);
        
        if (!data.user?.id) {
          console.warn('No user ID available for hotness score calculation');
          setIsLoadingHotness(false);
          return;
        }
        
        const analytics = await candidateTracker.getCandidateAnalytics(data.user.id);
        console.log('📊 Received analytics data:', analytics);
        
        if (analytics && typeof analytics.hotness_score === 'number') {
          setHotnessScore(analytics.hotness_score);
          console.log('✅ Set hotness score:', analytics.hotness_score);
        } else {
          setHotnessScore(0);
          console.log('📊 No hotness score data, setting to 0');
        }
      } catch (error) {
        console.error('❌ Error fetching hotness score:', error);
        setHotnessScore(0);
      } finally {
        setIsLoadingHotness(false);
      }
    };

    fetchHotnessScore();
  }, [data.user.id]);

  // Get hotness level and color
  const getHotnessLevel = (score: number) => {
    if (score >= 80) return { level: 'HOT', color: 'bg-red-500', textColor: 'text-red-600' };
    if (score >= 60) return { level: 'WARM', color: 'bg-orange-500', textColor: 'text-orange-600' };
    if (score >= 40) return { level: 'COOL', color: 'bg-blue-500', textColor: 'text-blue-600' };
    if (score >= 20) return { level: 'CHILL', color: 'bg-green-500', textColor: 'text-green-600' };
    return { level: 'COLD', color: 'bg-gray-400', textColor: 'text-gray-600' };
  };

  const gradualScore = calculateGradualPopularity(hotnessScore);
  const hotness = getHotnessLevel(gradualScore);
  


  return (
    <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative h-full flex flex-col">
      {/* Score badge in top right */}
      <div className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full px-3 py-1 flex items-center justify-center text-sm font-bold shadow-lg">
        <Trophy className="w-3 h-3 mr-1" />
        {score}
      </div>

      {/* Hotness indicator in top left */}
      {!isLoadingHotness && hotnessScore > 0 && (
        <div className="absolute -top-2 -left-2 bg-white border border-gray-200 rounded-full px-2 py-1 flex items-center justify-center text-xs font-semibold shadow-lg">
          <Flame className={`w-3 h-3 mr-1 ${hotness.textColor}`} />
          <span className={hotness.textColor}>{hotness.level}</span>
        </div>
      )}
      <CardContent className="p-6 flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center relative overflow-hidden">
            {data.user.avatar ? (
              <Image
                src={data.user.avatar}
                alt={data.user.name}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          
          {/* Name and Position */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">
                {data.user.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(data.user.id);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title={isFavorite(data.user.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className={`w-4 h-4 ${
                    isFavorite(data.user.id) 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-400 hover:text-red-500'
                  }`} 
                />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {(() => {
                const position = hasWorkStatus && data.workStatus?.currentPosition 
                  ? data.workStatus.currentPosition 
                  : (data.user.position || 'Position not specified');
                // If position contains commas, take only the first role
                return position?.split(',')[0]?.trim() || 'Position not specified';
              })()}
            </p>
          </div>

          {/* Email */}
        </div>


        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Hotness Bar */}
        {isLoadingHotness ? (
          <div className="mb-4 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-5 h-5" />
              <span className="text-sm text-gray-600"></span>
            </div>
          </div>
        ) : hotnessScore > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Popularity</span>
              <span className="font-semibold">{Math.min(Math.round(calculateGradualPopularity(hotnessScore)), 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-out ${hotness.color}`}
                style={{ width: `${Math.min(calculateGradualPopularity(hotnessScore), 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={() => {
              // Navigate to employee profile page
              router.push(`/employee/${data.user.id}`);
            }}
            className="w-full bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-700 hover:to-lime-800 text-white flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </Button>
          <Button
            onClick={onAskForInterview}
            variant="outline"
            className="w-full border-lime-200 text-lime-700 hover:bg-lime-50 hover:border-lime-300 hover:text-lime-800 flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Ask for Interview</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
