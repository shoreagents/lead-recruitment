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
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('overall');
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const companyLeaders: any[] = [];

  const recentAchievements: any[] = [];

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'diamond': return <Gem className="h-5 w-5 text-blue-500" />;
      case 'gold': return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'silver': return <Medal className="h-5 w-5 text-gray-400" />;
      default: return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'gold': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300';
      case 'silver': return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-500" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                Leaderboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">Top performers and companies in the BPOC network</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-32 px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 text-sm font-medium"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-40 px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 text-sm font-medium"
              >
                <option value="overall">Overall</option>
                <option value="individuals">Individuals</option>
                <option value="companies">Companies</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="individuals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-emerald-50 border border-emerald-200">
            <TabsTrigger value="individuals" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Top Individuals</TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Top Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="individuals" className="space-y-6">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topPerformers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                  <p className="text-gray-600">No leaderboard data found for individuals.</p>
                </div>
              ) : (
                topPerformers.slice(0, 3).map((performer, index) => (
                <Card key={performer.rank} className={`relative overflow-hidden ${
                  index === 0 ? 'ring-2 ring-yellow-400 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50' : 
                  index === 1 ? 'ring-2 ring-gray-300 shadow-md bg-gradient-to-br from-gray-50 to-slate-50' : 
                  'ring-2 ring-amber-500 shadow-md bg-gradient-to-br from-orange-50 to-amber-50'
                }`}>
                  <div className={`absolute top-0 left-0 right-0 h-2 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-slate-400' : 
                    'bg-gradient-to-r from-orange-400 to-amber-500'
                  }`}></div>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {getRankIcon(performer.rank)}
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 overflow-hidden">
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
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {performer.user?.full_name ? 
                        performer.user.full_name.split(' ')[0] : 
                        performer.user?.email || 'Unknown User'
                      }
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {performer.user?.slug ? `@${performer.user.slug}` : 'No profile'}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">Score: {performer.score}</p>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900">{performer.score}</span>
                      <Badge variant="secondary" className="text-xs">
                        Rank #{performer.rank}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Full Leaderboard */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 text-emerald-500 mr-2" />
                  Complete Rankings
                </CardTitle>
                <CardDescription>All top performers ranked by overall score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : topPerformers.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                      <p className="text-gray-600">No leaderboard data found.</p>
                    </div>
                  ) : (
                    topPerformers.map((performer) => (
                      <div key={performer.rank} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(performer.rank)}
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
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
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {performer.user?.full_name ? 
                                performer.user.full_name.split(' ')[0] : 
                                performer.user?.email || 'Unknown User'
                              }
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            {performer.user?.slug ? `@${performer.user.slug}` : 'No profile'}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-3 w-3" />
                              <span>Score: {performer.score}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xl font-bold text-gray-900">{performer.score}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              Rank #{performer.rank}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            {/* Top 3 Company Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {companyLeaders.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                  <p className="text-gray-600">No leaderboard data found for companies.</p>
                </div>
              ) : (
                companyLeaders.slice(0, 3).map((company, index) => (
                <Card key={company.rank} className={`relative overflow-hidden ${
                  index === 0 ? 'ring-2 ring-yellow-400 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50' : 
                  index === 1 ? 'ring-2 ring-gray-300 shadow-md bg-gradient-to-br from-gray-50 to-slate-50' : 
                  'ring-2 ring-amber-500 shadow-md bg-gradient-to-br from-orange-50 to-amber-50'
                }`}>
                  <div className={`absolute top-0 left-0 right-0 h-2 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-slate-400' : 
                    'bg-gradient-to-r from-orange-400 to-amber-500'
                  }`}></div>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {getRankIcon(company.rank)}
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      {company.company ? company.company.split(' ').map(n => n[0]).join('') : 'C'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{company.company}</h3>
                    <p className="text-sm text-gray-600 mb-2">{company.location}</p>
                    <p className="text-sm text-gray-500 mb-3">{company.employees} employees</p>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900">{company.score}</span>
                      <div className="flex items-center space-x-1">
                        {getChangeIcon(company.changeType)}
                        <span className={`text-sm ${
                          company.changeType === 'up' ? 'text-green-600' : 
                          company.changeType === 'down' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {company.change}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {company.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Complete Company Rankings */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 text-emerald-500 mr-2" />
                  Complete Company Rankings
                </CardTitle>
                <CardDescription>All top companies ranked by overall performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyLeaders.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                      <p className="text-gray-600">No company leaderboard data found.</p>
                    </div>
                  ) : (
                    companyLeaders.map((company) => (
                    <div key={company.rank} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(company.rank)}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {company.company ? company.company.split(' ').map(n => n[0]).join('') : 'C'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{company.company}</h4>
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
                            {company.employees} employees
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{company.location}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{company.stats.totalHires} hires</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{company.stats.avgRating} avg rating</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{company.stats.retentionRate} retention</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {company.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl font-bold text-gray-900">{company.score}</span>
                          <div className="flex items-center space-x-1">
                            {getChangeIcon(company.changeType)}
                            <span className={`text-sm ${
                              company.changeType === 'up' ? 'text-green-600' : 
                              company.changeType === 'down' ? 'text-red-600' : 
                              'text-gray-600'
                            }`}>
                              {company.change}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Overall Score</p>
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
