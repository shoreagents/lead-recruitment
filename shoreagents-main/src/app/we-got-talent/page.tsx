'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TalentCard } from '@/components/ui/talent-card';
import { ResumeModal } from '@/components/ui/resume-modal';
import { InterviewRequestModal, InterviewRequestData } from '@/components/ui/interview-request-modal';
import { SideNav } from '@/components/layout/SideNav';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/toast-context';
// import { useEngagementTracking } from '@/lib/useEngagementTracking';
import { useFavorites } from '@/lib/favorites-context';
import { useEmployeeCardData } from '@/hooks/use-api';
// import { ButtonLoader } from '@/components/ui/loader'; // Removed - will be recreated later
import {
  Search,
  Users,
  RefreshCw,
  Heart
} from 'lucide-react';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedResume, setSelectedResume] = useState<ResumeGenerated | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<EmployeeCardData | null>(null);
  const { showToast } = useToast();
  // const { recordInteraction } = useEngagementTracking();
  
  // Use TanStack Query to fetch employee data
  const { data: employees = [], isLoading, error, refetch } = useEmployeeCardData();

  const handleInterviewSubmit = async (data: InterviewRequestData) => {
    try {
      // Here you would typically send the interview request to your backend
      console.log('Interview request submitted:', {
        candidateName: selectedCandidate?.user.name,
        candidateId: selectedCandidate?.user.id,
        ...data
      });
      
      showToast('Interview request submitted successfully!', 'success');
      setIsInterviewModalOpen(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Error submitting interview request:', error);
      showToast('Failed to submit interview request. Please try again.', 'error');
    }
  };

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      showToast(`Refreshed ${employees.length} employees successfully`, 'success');
    } catch (err) {
      showToast('Failed to refresh employee data. Please try again.', 'error');
      console.error('Error refreshing employees:', err);
    }
  }, [refetch, employees.length, showToast]);

  // Use useMemo to compute filtered employees instead of useEffect + setState
  const filteredEmployees = useMemo(() => {
    // Safety check: ensure employees is an array
    if (!Array.isArray(employees)) {
      return [];
    }
    
    let filtered = employees;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user?.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.workStatus?.currentEmployer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employee.workStatus?.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(employee => employee.user?.id && favorites.has(employee.user.id));
    }

    // Sort employees by score (highest to lowest)
    return filtered.sort((a, b) => {
      // Calculate scores for comparison
      const getScore = (employee: EmployeeCardData) => {
        // Use AI analysis score if available
        if (employee.aiAnalysis?.overall_score) {
          return employee.aiAnalysis.overall_score;
        }
        
        // Calculate score based on various factors
        let score = 0;
        if (employee.resume) score += 20;
        if (employee.aiAnalysis) score += 15;
        if (employee.workStatus) score += 25;
        if (employee.applications && Array.isArray(employee.applications) && employee.applications.length > 0) score += 10;
        if (employee.user?.position) score += 10;
        if (employee.user?.location) score += 10;
        if (employee.user?.avatar) score += 10;
        
        return Math.min(score, 100);
      };
      
      const scoreA = getScore(a);
      const scoreB = getScore(b);
      
      // Sort from highest to lowest
      return scoreB - scoreA;
    });
  }, [employees, searchTerm, favorites, showFavoritesOnly]);


  const handleViewResume = (resume: ResumeGenerated) => {
    // recordInteraction('view-resume');
    setSelectedResume(resume);
    setIsResumeModalOpen(true);
  };

  const toggleFavoritesView = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    // recordInteraction('toggle-favorites');
  };



  // Removed loading state - show content immediately

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-red-600 mb-4">Failed to load employee data. Please try again.</p>
          <Button onClick={() => {
            // recordInteraction('refresh-employees');
            handleRefresh();
          }} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SideNav */}
      <SideNav />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Talent Pool</h1>
              <p className="text-gray-600 mt-2">
                Discover qualified candidates ready to join your team
              </p>

            </div>
            <Button onClick={() => {
              // recordInteraction('refresh-employees');
              handleRefresh();
            }} variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>


          {/* Search and Favorites */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="Search by name, position, or location..."
                value={searchTerm}
                onChange={(e) => {
                  // recordInteraction('search-employees');
                  setSearchTerm(e.target.value);
                }}
                className="pl-10 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleFavoritesView}
                variant={showFavoritesOnly ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  showFavoritesOnly 
                    ? 'bg-lime-600 hover:bg-lime-700 text-white' 
                    : 'hover:bg-lime-50 hover:border-lime-200 hover:text-lime-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span>Favorites ({favorites.size})</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee, index) => (
              <TalentCard
                key={employee.user.id}
                data={employee}
                onAskForInterview={() => {
                  // Handle interview request for this candidate
                  // recordInteraction('interview-request')
                  console.log('Interview requested for:', employee.user.name);
                  setSelectedCandidate(employee);
                  setIsInterviewModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resume Modal */}
      <ResumeModal
        resume={selectedResume}
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setSelectedResume(null);
        }}
      />

      {/* Interview Request Modal */}
      {selectedCandidate && (
        <InterviewRequestModal
          isOpen={isInterviewModalOpen}
          onClose={() => {
            setIsInterviewModalOpen(false);
            setSelectedCandidate(null);
          }}
          candidateName={selectedCandidate.user.name}
          candidatePosition={selectedCandidate.user.position || 'Position not specified'}
          candidateId={selectedCandidate.user.id}
          onSubmit={handleInterviewSubmit}
        />
      )}

    </div>
  );
}
