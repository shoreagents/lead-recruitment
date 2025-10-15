'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  Medal,
  Award,
  Star,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Clock,
  Target,
  Zap,
  Crown,
  Gem,
  Flame,
  Sparkles,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Building2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RecruiterSignInModal from '@/components/auth/RecruiterSignInModal';
import RecruiterSignUpForm from '@/components/auth/RecruiterSignUpForm';

export default function LeaderboardPage() {
  const router = useRouter();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Modal handler functions
  const handleSwitchToSignUp = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUpModal(false);
    setShowSignInModal(true);
  };
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [companyLeaders, setCompanyLeaders] = useState<any[]>([]);
  const [popularJobs, setPopularJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/recruiter/leaderboard`);
        if (response.ok) {
          const data = await response.json();
          setTopPerformers(data.topRecruiters || []);
          setCompanyLeaders(data.topCompanies || []);
          setPopularJobs(data.popularJobs || []);
        } else {
          console.error('Failed to fetch leaderboard data');
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond': return <Gem className="h-5 w-5 text-blue-500" />;
      case 'gold': return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'silver': return <Medal className="h-5 w-5 text-gray-400" />;
      default: return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'gold': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300';
      case 'silver': return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-500" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
              <p className="text-sm text-gray-600">Top performers and companies in the BPOC network</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="individuals" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-gray-200 rounded-xl p-1 shadow-sm">
            <TabsTrigger 
              value="individuals" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Top Applicants
            </TabsTrigger>
            <TabsTrigger 
              value="companies" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all duration-200"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Top Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individuals" className="space-y-6">
            {/* Enhanced Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {loading ? (
                <div className="col-span-full text-center py-16">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Loading applicants...</h3>
                  <p className="text-gray-600">Fetching top applicants data</p>
                </div>
              ) : topPerformers.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No data available</h3>
                  <p className="text-gray-600">No leaderboard data found for applicants.</p>
                </div>
              ) : (
                (topPerformers || []).slice(0, 3).map((performer, index) => (
                <Card key={performer.rank} className={`relative overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'ring-4 ring-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 scale-105' : 
                  index === 1 ? 'ring-2 ring-gray-300 shadow-xl bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50' : 
                  'ring-2 ring-amber-500 shadow-xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
                }`}>
                  <div className={`absolute top-0 left-0 right-0 h-3 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-300 via-slate-400 to-gray-500' : 
                    'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500'
                  }`}></div>
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      {getRankIcon(performer.rank)}
                    </div>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 overflow-hidden shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-slate-500' :
                      'bg-gradient-to-br from-orange-400 to-amber-500'
                    }`}>
                      {performer.user?.avatar_url ? (
                        <img 
                          src={performer.user.avatar_url} 
                          alt={performer.user.full_name || 'User'}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        performer.user?.full_name ? (
                          performer.user.full_name.split(' ')[0].charAt(0).toUpperCase()
                        ) : (
                          performer.user?.email?.charAt(0).toUpperCase() || 'A'
                        )
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {performer.user?.full_name ? 
                        performer.user.full_name.split(' ')[0] : 
                        performer.user?.email || 'Unknown User'
                      }
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      {performer.user?.slug ? `@${performer.user.slug}` : 'No profile'}
                    </p>
                    <Badge variant="secondary" className="text-sm font-semibold px-4 py-2">
                      {performer.rank === 1 ? '1st place' : performer.rank === 2 ? '2nd place' : performer.rank === 3 ? '3rd place' : `${performer.rank}th place`}
                    </Badge>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Enhanced Full Leaderboard */}
            <Card className="bg-white border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  Complete Applicants Rankings
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 mt-2">All top applicants ranked by number of applications</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                    </div>
                  ) : topPerformers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No Data Available</h3>
                      <p className="text-gray-600">No leaderboard data found.</p>
                    </div>
                  ) : (
                    (topPerformers || []).map((performer, index) => (
                      <div key={performer.rank} className={`flex items-center space-x-6 p-6 rounded-xl transition-all duration-200 hover:shadow-lg ${
                        index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'
                      } border border-gray-200`}>
                        <div className="flex items-center justify-center w-10">
                          {getRankIcon(performer.rank)}
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden shadow-lg">
                          {performer.user?.avatar_url ? (
                            <img 
                              src={performer.user.avatar_url} 
                              alt={performer.user.full_name || 'User'}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            performer.user?.full_name ? (
                              performer.user.full_name.split(' ')[0].charAt(0).toUpperCase()
                            ) : (
                              performer.user?.email?.charAt(0).toUpperCase() || 'A'
                            )
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {performer.user?.full_name ? 
                                performer.user.full_name.split(' ')[0] : 
                                performer.user?.email || 'Unknown User'
                              }
                            </h4>
                            <Badge variant="secondary" className="text-sm font-semibold">
                              {performer.rank === 1 ? '1st place' : performer.rank === 2 ? '2nd place' : performer.rank === 3 ? '3rd place' : `${performer.rank}th place`}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 font-medium">
                            {performer.user?.slug ? `@${performer.user.slug}` : 'No profile'}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Trophy className="h-4 w-4 text-emerald-500" />
                              <span className="font-semibold">{performer.total_applications} applications across {performer.active_jobs} active jobs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-8">
            {/* Enhanced Top 3 Company Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {loading ? (
                <div className="col-span-full text-center py-16">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Loading companies...</h3>
                  <p className="text-gray-600">Fetching top companies data</p>
                </div>
              ) : companyLeaders.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No data available</h3>
                  <p className="text-gray-600">No leaderboard data found for companies.</p>
                </div>
              ) : (
                (companyLeaders || []).slice(0, 3).map((company, index) => (
                <Card key={company.rank} className={`relative overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'ring-4 ring-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 scale-105' : 
                  index === 1 ? 'ring-2 ring-gray-300 shadow-xl bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50' : 
                  'ring-2 ring-amber-500 shadow-xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
                }`}>
                  <div className={`absolute top-0 left-0 right-0 h-3 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-300 via-slate-400 to-gray-500' : 
                    'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500'
                  }`}></div>
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      {getRankIcon(company.rank)}
                    </div>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-slate-500' :
                      'bg-gradient-to-br from-orange-400 to-amber-500'
                    }`}>
                      {company.company ? company.company.split(' ').map((n: string) => n[0]).join('') : 'C'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{company.company}</h3>
                    <Badge variant="secondary" className="text-sm font-semibold px-4 py-2">
                      {company.rank === 1 ? '1st place' : company.rank === 2 ? '2nd place' : company.rank === 3 ? '3rd place' : `${company.rank}th place`}
                    </Badge>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Enhanced Complete Company Rankings */}
            <Card className="bg-white border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  Complete Company Rankings
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 mt-2">All top companies ranked by overall performance</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {companyLeaders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No data available</h3>
                      <p className="text-gray-600">No company leaderboard data found.</p>
                    </div>
                  ) : (
                    (companyLeaders || []).map((company, index) => (
                    <div key={company.rank} className={`flex items-center space-x-6 p-6 rounded-xl transition-all duration-200 hover:shadow-lg ${
                      index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'
                    } border border-gray-200`}>
                      <div className="flex items-center justify-center w-10">
                        {getRankIcon(company.rank)}
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {company.company ? company.company.split(' ').map((n: string) => n[0]).join('') : 'C'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{company.company}</h4>
                          <Badge variant="secondary" className="text-sm font-semibold">
                            {company.rank === 1 ? '1st place' : company.rank === 2 ? '2nd place' : company.rank === 3 ? '3rd place' : `${company.rank}th place`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 font-medium">{company.total_jobs} jobs posted, {company.active_jobs} active</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold">{company.total_applications} applications</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-purple-500" />
                            <span className="font-semibold">{company.total_jobs} jobs posted</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-green-500" />
                            <span className="font-semibold">{company.active_jobs} active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>

      {/* Sign In Modal */}
      <RecruiterSignInModal 
        open={showSignInModal} 
        onOpenChange={setShowSignInModal}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      
      {/* Sign Up Modal */}
      <RecruiterSignUpForm
        open={showSignUpModal}
        onOpenChange={setShowSignUpModal}
        onSwitchToLogin={handleSwitchToSignIn}
      />

    </div>
  );
}
