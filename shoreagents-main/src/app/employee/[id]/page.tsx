'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ButtonLoader } from '@/components/ui/loader'; // Removed - will be recreated later
import { 
  ArrowLeft, 
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Heart,
  ChevronDown,
  ChevronUp,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';
import { candidateTracker } from '@/lib/candidateTrackingService';
import { useAuth } from '@/lib/auth-context';
import { generateUserId } from '@/lib/userEngagementService';
import { InterviewRequestModal, InterviewRequestData } from '@/components/ui/interview-request-modal';
import { useBPOCEmployeeById } from '@/hooks/use-api';

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  position: string;
  location: string;
  avatar: string | null;
  bio: string | null;
  score: number;
  skills: string[];
  experience: string;
  expectedSalary: number;
  workStatus: string;
  joinedDate: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  // AI Analysis data
  keyStrengths: string[];
  improvements: string[];
  recommendations: string[];
  improvedSummary: string | null;
  strengthsAnalysis: Record<string, unknown> | null;
}

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user, appUser } = useAuth();
  
  // Use TanStack Query to fetch employee data
  const { data: bpocEmployee, isLoading, error } = useBPOCEmployeeById(params.id as string);

  // Convert BPOC data to EmployeeProfile format
  const employee: EmployeeProfile | null = bpocEmployee ? {
    id: bpocEmployee.user_id,
    name: bpocEmployee.full_name,
    email: `${bpocEmployee.first_name.toLowerCase()}.${bpocEmployee.last_name.toLowerCase()}@example.com`,
    position: bpocEmployee.current_position || bpocEmployee.position || 'Position not specified',
    location: bpocEmployee.location || 'Location not specified',
    avatar: bpocEmployee.avatar_url || null,
    bio: bpocEmployee.bio || `Professional ${bpocEmployee.current_position || bpocEmployee.position || 'candidate'} with expertise in various technologies.`,
    score: bpocEmployee.overall_score || 0,
    skills: bpocEmployee.skills_snapshot || [],
    experience: bpocEmployee.experience_snapshot ? 
      (Array.isArray(bpocEmployee.experience_snapshot) ? 
        bpocEmployee.experience_snapshot.length + ' years' : 
        'Experience available') : 
      'Experience not specified',
    expectedSalary: bpocEmployee.expected_salary ? 
      parseFloat(bpocEmployee.expected_salary.replace(/[^\d.]/g, '')) : 0,
    workStatus: bpocEmployee.work_status || 'Status not specified',
    joinedDate: bpocEmployee.user_created_at ? new Date(bpocEmployee.user_created_at).toISOString().split('T')[0] : '2023-01-01',
    tier: (bpocEmployee.overall_score || 0) >= 80 ? 'GOLD' : 
          (bpocEmployee.overall_score || 0) >= 60 ? 'SILVER' : 'BRONZE',
    // AI Analysis data
    keyStrengths: bpocEmployee.key_strengths || [],
    improvements: bpocEmployee.improvements || [],
    recommendations: bpocEmployee.recommendations || [],
    improvedSummary: bpocEmployee.improved_summary || null,
    strengthsAnalysis: bpocEmployee.strengths_analysis || null
  } : null;

  // Start tracking when employee data is loaded
  useEffect(() => {
    if (employee) {
      const trackingUserId = appUser?.user_id || 
        (typeof window !== 'undefined' ? generateUserId() : '') || 
        '';
      
      console.log('🔍 Starting candidate tracking with user ID:', trackingUserId);
      candidateTracker.startTracking(
        trackingUserId,
        employee.id, 
        employee.name
      );
    }
  }, [employee, appUser?.user_id]);

  // Cleanup tracking when component unmounts or user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      candidateTracker.endTracking();
    };

    // Listen for page unload events
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      candidateTracker.endTracking();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  // Handle anonymous to authenticated user transition
  useEffect(() => {
    const handleUserLogin = async () => {
      if (appUser?.user_id) {
        const anonymousUserId = candidateTracker.getAnonymousUserId();
        if (anonymousUserId) {
          console.log('🔄 User logged in, transferring anonymous data...');
          await candidateTracker.transferAnonymousDataToUser(anonymousUserId, appUser.user_id);
        }
      }
    };

    handleUserLogin();
  }, [appUser?.user_id]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-lime-100 text-lime-800 border-lime-300 shadow-sm';
    if (score >= 60) return 'bg-lime-50 text-lime-700 border-lime-200 shadow-sm';
    return 'bg-lime-50 text-lime-600 border-lime-200 shadow-sm';
  };

  const toggleAIAnalysis = async () => {
    const newState = !showAIAnalysis;
    setShowAIAnalysis(newState);
    
    // AI analysis view is now tracked as part of the overall view duration
    if (newState && employee) {
      console.log(`📊 User opened AI analysis for ${employee.name}`);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!employee) return;
    
    const newFavoriteState = !isFavorite(employee.id);
    toggleFavorite(employee.id);
    
    // Favorite actions are now tracked as part of the overall view duration
    console.log(`📊 User ${newFavoriteState ? 'favorited' : 'unfavorited'} ${employee.name}`);
  };

  const handleTabClick = async (tabValue: string) => {
    if (!employee) return;
    
    // Tab switching is now tracked as part of the overall view duration
    // No need for separate section click tracking
    console.log(`📊 User switched to ${tabValue} tab`);
  };

  const handleAskForInterview = () => {
    setShowInterviewModal(true);
  };

  const handleInterviewSubmit = async (data: InterviewRequestData) => {
    if (!employee) return;
    
    // Interview requests are now tracked as part of the overall view duration
    console.log(`📊 User requested interview for ${employee.name}`);
    
    // Here you would typically send the data to your backend
    console.log('Interview request data:', data);
    console.log('Candidate:', employee.name);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };


  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-lime-600 border-t-transparent w-8 h-8 mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Loading Employee Profile...</h1>
          <p className="text-gray-600">Fetching candidate information</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
          <p className="text-gray-600 mb-2">Unable to fetch employee data.</p>
          <p className="text-sm text-gray-500 mb-6">Please try again later.</p>
          <div className="space-x-4">
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle employee not found
  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <p className="text-gray-600 mb-2">The employee profile with ID "{params.id}" doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-6">This could be because the employee ID is invalid or the data hasn't been loaded yet.</p>
          <div className="space-x-4">
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-lime-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.back()}
                className="flex-shrink-0 border-lime-200 hover:bg-lime-50 hover:border-lime-300 hover:text-lime-700 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employee Profile</h1>
                <p className="text-sm text-lime-600 font-medium">Detailed candidate information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="relative mt-15">
              <CardHeader className="text-center">
                {/* Favorite Button - Upper Right */}
                <Button
                  onClick={handleFavoriteToggle}
                  variant="outline"
                  size="icon"
                  className={`absolute top-4 right-4 transition-all duration-200 ${
                    isFavorite(employee.id) 
                      ? 'bg-lime-50 border-lime-300 text-lime-600 hover:bg-lime-100 shadow-sm' 
                      : 'hover:bg-lime-50 hover:border-lime-200 hover:text-lime-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-all duration-200 ${isFavorite(employee.id) ? 'fill-current scale-110' : 'hover:scale-105 hover:text-lime-600'}`} />
                </Button>
                
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 ring-4 ring-lime-100 shadow-lg">
                      <AvatarImage src={employee.avatar || ''} />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-lime-400 to-lime-600 text-white">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {/* Status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-lime-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg">{employee.name.split(' ')[0]}</CardTitle>
                <CardDescription className="text-sm">{employee.position.split(',')[0].trim()}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge className={`${getScoreColor(employee.score)} flex items-center space-x-1`}>
                    <Trophy className="w-3 h-3" />
                    <span>Score {employee.score}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                
                {/* Summary Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Award className="w-4 h-4 text-lime-600" />
                    Summary
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {employee.bio || 'No Bio to show.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ask for Interview Button */}
            <div className="mt-4">
              <Button 
                onClick={handleAskForInterview}
                className="w-full bg-lime-600 hover:bg-lime-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask for Interview
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-4 mt-0" onValueChange={handleTabClick}>
              <TabsList className="grid w-full grid-cols-2 bg-lime-50 border border-lime-200">
                <TabsTrigger value="overview" className="data-[state=active]:bg-lime-600 data-[state=active]:text-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-lime-600 data-[state=active]:text-white data-[state=active]:shadow-sm">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Briefcase className="w-4 h-4 text-lime-600" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{employee.position}</h4>
                          <p className="text-xs text-gray-600">{employee.experience} of experience</p>
                          <p className="text-xs text-gray-500">Current Position</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <GraduationCap className="w-4 h-4 text-lime-600" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Education Information</h4>
                          <p className="text-xs text-gray-600">Education details not available</p>
                          <p className="text-xs text-gray-500">Contact candidate for details</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Show More Button */}
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={toggleAIAnalysis}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-lime-200 text-lime-700 hover:bg-lime-50 hover:border-lime-300 hover:text-lime-800 transition-all duration-200 shadow-sm"
                  >
                    {showAIAnalysis ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide AI Analysis
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show AI Analysis
                      </>
                    )}
                  </Button>
                </div>

                {/* AI Analysis Content - Conditionally Rendered */}
                {showAIAnalysis && (
                  <div className="space-y-6 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 fade-in-0 duration-300">
                    {/* AI-Enhanced Summary */}
                    {employee.improvedSummary && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-lime-600" />
                            AI-Enhanced Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {employee.improvedSummary}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* AI Analysis Grid */}
                    {employee.keyStrengths.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Top Strengths */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Top Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Key Strengths */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Key Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Core Strengths */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Core Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Technical Strengths */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Technical Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Notable Achievements */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Notable Achievements
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Market Advantages */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Market Advantages
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Unique Value Proposition */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Unique Value Proposition
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Areas to Highlight */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-lime-600" />
                              Areas to Highlight
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {employee.keyStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                  <p className="text-sm text-gray-700">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Award className="w-4 h-4 text-lime-600" />
                      Technical Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                      {employee.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs break-words max-w-full border-lime-200 text-lime-700 hover:bg-lime-50 hover:border-lime-300 transition-colors duration-200">
                          <span className="truncate block max-w-full">{skill}</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>



            </Tabs>
          </div>
        </div>
      </div>

      {/* Interview Request Modal */}
      {employee && (
        <InterviewRequestModal
          isOpen={showInterviewModal}
          onClose={() => setShowInterviewModal(false)}
          candidateName={employee.name}
          candidatePosition={employee.position}
          onSubmit={handleInterviewSubmit}
        />
      )}
    </div>
  );
}
