'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Headphones,
  Keyboard,
  Target,
  TrendingUp,
  Clock,
  Play,
  Trophy,
  Users,
  Zap,
  BarChart3,
  Guitar,
  Phone,
  Brain,
  FileText,
  Utensils,
  Crown,
  Globe,
  Eye,
  Monitor,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSessionToken } from '@/lib/auth-helpers';
import { useAuth } from '@/contexts/AuthContext';

export default function CareerGamesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ completed: number; totalSessions: number; achievementPoints: number } | null>(null);
  
  // Demo modal state
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const demoWords = ['create', 'assist', 'design', 'manage'];
  
  // DISC Demo state
  const [showDiscDemoModal, setShowDiscDemoModal] = useState(false);
  const [discDemoStep, setDiscDemoStep] = useState(0);
  const [discDemoScores, setDiscDemoScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [discDemoSelected, setDiscDemoSelected] = useState<string | null>(null);
  const [discDemoReaction, setDiscDemoReaction] = useState<string | null>(null);
  const [discDemoAutoMode, setDiscDemoAutoMode] = useState(false);
  const [discDemoCurrentChoice, setDiscDemoCurrentChoice] = useState(0);
  
  // DISC Demo scenarios (sample from actual game)
  const discDemoScenarios = [
    {
      id: 1,
      context: "FAMILY",
      title: "💰 OFW Money Drama",
      scenario: "Your sister in Dubai sends ₱80,000 for mom's surgery. Your uncle 'borrows' ₱15,000 for tricycle repair. Your cousin needs ₱10,000 for enrollment. Mom is crying because money is disappearing...",
      options: [
        { id: 'A', disc: 'D', text: "STOP! Sister's money is for MOM ONLY! Pay it back NOW!", reaction: "A fierce spirit stirs within..." },
        { id: 'B', disc: 'I', text: "Let's call ate together and explain the situation honestly", reaction: "A vibrant energy awakens..." },
        { id: 'C', disc: 'S', text: "Use my own ₱20,000 savings to cover what they took", reaction: "A steady presence grows..." },
        { id: 'D', disc: 'C', text: "Calculate exact surgery costs, track spending, create repayment plan", reaction: "Ancient wisdom gathers..." }
      ]
    },
    {
      id: 2,
      context: "WORK",
      title: "📞 Angry Customer Crisis",
      scenario: "Customer screaming about billing error, threatening to cancel account worth ₱50,000 monthly. Your manager is in a meeting. You have 2 minutes to resolve this...",
      options: [
        { id: 'A', disc: 'D', text: "I'll fix this immediately! Give me your account number and I'll override the system!", reaction: "A fierce spirit stirs within..." },
        { id: 'B', disc: 'I', text: "I completely understand your frustration! Let me personally handle this for you!", reaction: "A vibrant energy awakens..." },
        { id: 'C', disc: 'S', text: "I hear you. Let me carefully check every detail of your account", reaction: "A steady presence grows..." },
        { id: 'D', disc: 'C', text: "Let me trace the exact billing sequence and identify the root cause", reaction: "Ancient wisdom gathers..." }
      ]
    }
  ];

  // Typing animation effect for demo
  useEffect(() => {
    if (!showDemoModal) return;
    
    const currentText = demoWords[currentTypingIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
          setTypingSpeed(Math.random() * 100 + 50);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
          setTypingSpeed(25);
        } else {
          setIsDeleting(false);
          setCurrentTypingIndex((prev) => (prev + 1) % demoWords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, currentTypingIndex, isDeleting, typingSpeed, showDemoModal, demoWords]);

  // DISC Demo logic
  const handleDiscDemoChoice = (optionId: string, disc: string, reaction: string) => {
    setDiscDemoSelected(optionId);
    setDiscDemoReaction(reaction);
    
    // Update scores
    setDiscDemoScores(prev => ({
      ...prev,
      [disc]: prev[disc as keyof typeof prev] + 1
    }));
    
    // Auto-advance after showing reaction
    setTimeout(() => {
      setDiscDemoStep(prev => prev + 1);
      setDiscDemoSelected(null);
      setDiscDemoReaction(null);
    }, 2000);
  };

  // Reset DISC demo when modal opens
  useEffect(() => {
    if (showDiscDemoModal) {
      setDiscDemoStep(0);
      setDiscDemoScores({ D: 0, I: 0, S: 0, C: 0 });
      setDiscDemoSelected(null);
      setDiscDemoReaction(null);
      setDiscDemoAutoMode(true);
      setDiscDemoCurrentChoice(0);
    }
  }, [showDiscDemoModal]);

  // Auto-advancing DISC demo
  useEffect(() => {
    if (!showDiscDemoModal || !discDemoAutoMode) return;
    
    const timer = setTimeout(() => {
      if (discDemoStep < discDemoScenarios.length) {
        const currentScenario = discDemoScenarios[discDemoStep];
        const options = currentScenario.options;
        const choiceIndex = discDemoCurrentChoice % options.length;
        const selectedOption = options[choiceIndex];
        
        // Auto-select choice
        setDiscDemoSelected(selectedOption.id);
        setDiscDemoReaction(selectedOption.reaction);
        
        // Update scores
        setDiscDemoScores(prev => ({
          ...prev,
          [selectedOption.disc]: prev[selectedOption.disc as keyof typeof prev] + 1
        }));
        
        // Move to next choice or next scenario
        setTimeout(() => {
          if (discDemoCurrentChoice < options.length - 1) {
            setDiscDemoCurrentChoice(prev => prev + 1);
            setDiscDemoSelected(null);
            setDiscDemoReaction(null);
          } else {
            setDiscDemoStep(prev => prev + 1);
            setDiscDemoCurrentChoice(0);
            setDiscDemoSelected(null);
            setDiscDemoReaction(null);
          }
        }, 2000);
      }
    }, discDemoStep === 0 ? 1000 : 3000);

    return () => clearTimeout(timer);
  }, [showDiscDemoModal, discDemoAutoMode, discDemoStep, discDemoCurrentChoice, discDemoScenarios]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!user?.id) return
        const res = await fetch(`/api/leaderboards/user/${user.id}`)
        if (!res.ok) throw new Error(`Failed to load leaderboard user data: ${res.status}`)
        const data = await res.json()
        console.log('🔍 Frontend Debug - User ID being used:', user.id)
        console.log('🔍 Frontend Debug - User email:', user.email)
        console.log('🔍 Frontend Debug - User username:', user.username)
        console.log('🔍 Frontend Debug - API Response:', data)
        console.log('🔍 Frontend Debug - Engagement:', data?.engagement)
        console.log('🔍 Frontend Debug - Games:', data?.games)
        
        // Let's also test the profile API to compare
        try {
          // Try username first, then email, then user ID as fallback
          const profileSlug = user.username || user.email || user.id
          console.log('🔍 Frontend Debug - Profile slug being used:', profileSlug)
          const profileRes = await fetch(`/api/public/user-by-slug/${profileSlug}`)
          if (profileRes.ok) {
            const profileData = await profileRes.json()
            console.log('🔍 Frontend Debug - Profile API Response:', profileData)
            console.log('🔍 Frontend Debug - Profile completed_games:', profileData.user?.completed_games)
            console.log('🔍 Frontend Debug - Profile game_stats:', profileData.user?.game_stats)
          } else {
            console.log('❌ Profile API failed with status:', profileRes.status)
            console.log('❌ Profile API URL attempted:', `/api/public/user-by-slug/${profileSlug}`)
          }
        } catch (profileError) {
          console.log('❌ Profile API test failed:', profileError)
        }
        
        // Compute gamesCompleted from engagement items where game completed points > 0 for visible games only
        const engagementItems: Array<{ label: string; points: number }> = data?.engagement?.items || []
        console.log('🔍 Frontend Debug - Engagement Items:', engagementItems)
        const visibleGameLabels = new Set([
          'Typing Hero Completed',
          'DISC Personality Completed'
        ])
        const gamesCompleted = engagementItems.filter(i => visibleGameLabels.has(i.label) && (i.points || 0) > 0).length
        // Total sessions from leaderboard games plays
        const gamesArr: Array<{ plays?: number }> = data?.games || []
        const totalSessions = gamesArr.reduce((sum, g) => sum + (Number(g.plays || 0)), 0)
        // Achievement points from engagement total
        const achievementPoints = Number(data?.engagement?.total || 0)
        setProgress({ completed: gamesCompleted, totalSessions, achievementPoints })
      } catch (e) {
        console.error('❌ Failed fetching games progress (leaderboard):', e)
        setProgress({ completed: 0, totalSessions: 0, achievementPoints: 0 })
      }
    }
    if (user?.id) {
      fetchProgress()
    }
  }, [user?.id])

  // All games (including hidden ones for future use)
  const allGames = [
    {
        id: 'typing-hero',
        title: 'Typing Hero',
        description: '🎵 Experience the ultimate typing challenge! Master BPO vocabulary while jamming to the rhythm. Race against time, hit the perfect notes, and become a typing legend!',
        icon: Guitar,
        category: 'Speed',
        duration: '2-3 minutes',
        content: 'WPM Challenge',
        categoryColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        skillsDeveloped: ['⚡ Lightning Speed', '🎯 Precision', '🎵 Rhythm Mastery', '💼 BPO Vocabulary', '🧠 Focus'],
        participants: 2847,
        rating: 4.9,
        gameInfo: '🔥 Most Popular Game! Master the art of fast, accurate typing while grooving to the beat. Perfect for call center agents who need lightning-fast keyboard skills!',
        specialBadge: '🔥 HOT',
        specialBadgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      },
    {
      id: 'disc-personality',
      title: 'BPOC DISC',
      description: '🎯 Discover your BPO animal spirit! Navigate authentic scenarios and unlock your communication style. Get AI-powered personalized questions, earn XP and badges, and receive BPO career insights.',
      icon: Brain,
      category: 'Personality',
      duration: '3-5 minutes',
      content: 'DISC Analysis',
      categoryColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      skillsDeveloped: ['🎭 Self Discovery', '🤝 Team Harmony', '💬 Communication Style', '👑 Leadership DNA', '🎯 Emotional Intelligence'],
      participants: 156,
      rating: 4.9,
      gameInfo: '🐅 Meet your BPO animal! Discover which role fits your personality - from Eagle leaders to Turtle supporters. Perfect for understanding team dynamics in the workplace!',
      specialBadge: '🌟 INSIGHT',
      specialBadgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      id: 'ultimate',
      title: 'BPOC Ultimate',
      description: '👑 The ultimate BPO mastery challenge! Face real workplace crises, make critical decisions, and prove you have what it takes to be a BPO leader. Are you ready for the ultimate test?',
      icon: Crown,
      difficulty: 'Advanced',
      category: 'Assessment',
      duration: '10-15 minutes',
      content: 'Multiple Scenarios',
      difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      categoryColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      skillsDeveloped: ['🎯 Strategic Thinking', '⚡ Crisis Management', '👑 Leadership', '💎 Integrity', '🚀 Innovation'],
      participants: 89,
      rating: 4.8,
      gameInfo: '🏆 The ultimate test for BPO professionals! This advanced challenge simulates real workplace scenarios where your decisions matter. Perfect for aspiring managers and team leads!',
      specialBadge: '🏆 ELITE',
      specialBadgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    },
    {
      id: 'bpoc-cultural',
      title: 'BPOC Cultural',
      description: '🌍 Master global communication! Navigate cultural differences, adapt your communication style, and become a true global BPO professional. Connect with clients from every corner of the world!',
      icon: Globe,
      difficulty: 'Expert',
      category: 'Cultural',
      duration: '25 minutes',
      content: '4 Stages',
      difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      categoryColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      skillsDeveloped: ['🌍 Cultural Intelligence', '🗣️ Voice Adaptation', '✍️ Writing Mastery', '🤝 Global Communication', '🎭 Cultural Sensitivity'],
      participants: 45,
      rating: 4.9,
      gameInfo: '🌐 Become a global communication expert! This advanced game teaches you to work with clients from different cultures and adapt your communication style accordingly.',
      specialBadge: '🌍 GLOBAL',
      specialBadgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },

  ];

  // Filter out hidden games (BPOC Ultimate and BPOC Cultural)
  const hiddenGameIds = ['ultimate', 'bpoc-cultural'];
  const games = allGames.filter(game => !hiddenGameIds.includes(game.id));

  const handleStartGame = (gameId: string) => {
    setSelectedGame(gameId);
    
    // Navigate to specific game pages
    if (gameId === 'typing-hero') {
      router.push('/career-tools/games/typing-hero');
    } else if (gameId === 'disc-personality') {
      router.push('/career-tools/games/disc-personality');
    } else if (gameId === 'ultimate') {
      router.push('/career-tools/games/ultimate');
    } else if (gameId === 'bpoc-cultural') {
      router.push('/career-tools/games/bpoc-cultural');
    } else {
      // For other games, you can add navigation or modals here
      console.log(`Starting game: ${gameId}`);
    }
  };

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <Header />
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="relative">
                  <Trophy className="h-16 w-16 text-green-400 mr-6 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-900">⚡</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Career Games
                  </h1>
                  <p className="text-gray-300 text-lg">🎮 Level up your BPO skills through interactive challenges</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-semibold">Interactive Learning</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-500/20 rounded-full px-3 py-1">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 text-sm font-semibold">Skill Building</span>
                    </div>
                    <div className="flex items-center gap-2 bg-cyan-500/20 rounded-full px-3 py-1">
                      <Trophy className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 text-sm font-semibold">Achievements</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="group"
              >
                <Card className="glass-card border-white/10 hover:border-white/30 h-full transition-all duration-500 group-hover:scale-105 relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-slate-800/50 backdrop-blur-xl">
                  {/* Animated Background Effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
                  </div>


                  {/* Enhanced Icon with Glow Effect */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-xl flex items-center justify-center shadow-lg shadow-green-400/25 group-hover:shadow-green-400/40 transition-all duration-300">
                    <game.icon className="w-6 h-6 text-green-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  </div>

                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="text-2xl font-bold text-white pr-16 mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                      {game.title}
                      {game.id === 'typing-hero' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-slate-900/95 border border-cyan-500/30 text-cyan-100 backdrop-blur-sm max-w-xs">
                            <div className="flex items-center gap-2">
                              <Monitor className="w-4 h-4 text-cyan-400" />
                              <div>
                                <p className="font-semibold text-cyan-200">Desktop & Large Screen Optimized</p>
                                <p className="text-xs text-cyan-300/80 mt-1">
                                  This game is designed for desktop and large screen experiences. 
                                  For the best gameplay, use a computer or large screen.
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-sm leading-relaxed mb-4">
                      {game.description}
                    </CardDescription>

                    {/* Enhanced Game Info with Glow */}
                    {game.gameInfo && (
                      <div className="bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/30 rounded-xl p-4 mb-4 shadow-lg shadow-cyan-500/10">
                        <p className="text-sm text-cyan-200 font-medium">{game.gameInfo}</p>
                      </div>
                    )}

                    {/* Enhanced Badges with Better Styling */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={`${game.categoryColor} font-semibold shadow-lg`}>
                        {game.category}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/40 flex items-center gap-1 shadow-lg">
                        <Clock className="w-3 h-3" />
                        {game.duration}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/40 flex items-center gap-1 shadow-lg">
                        <BarChart3 className="w-3 h-3" />
                        {game.content}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 relative z-10">
                    {/* Enhanced Skills Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Skills You'll Master:</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {game.skillsDeveloped.map((skill, skillIndex) => (
                          <Badge 
                            key={skillIndex}
                            variant="secondary"
                            className="bg-gradient-to-r from-green-500/25 to-cyan-500/25 text-green-200 border-green-500/40 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>


                    {/* Enhanced CTA Buttons with Multiple Effects */}
                    {game.id === 'typing-hero' ? (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/70 font-bold py-4 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                          onClick={() => setShowDemoModal(true)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>👁️ Live Demo</span>
                          </div>
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-500 via-green-600 to-cyan-600 hover:from-green-600 hover:via-green-700 hover:to-cyan-700 text-white border-0 shadow-xl shadow-green-500/30 transition-all duration-500 group-hover:shadow-2xl hover:scale-110 font-bold text-base py-4 relative overflow-hidden"
                          onClick={() => handleStartGame(game.id)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <Play className="w-4 h-4" />
                            <span>🚀 Start</span>
                          </div>
                        </Button>
                      </div>
                    ) : game.id === 'disc-personality' ? (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/70 font-bold py-4 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                          onClick={() => setShowDiscDemoModal(true)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>👁️ Live Demo</span>
                          </div>
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-500 via-green-600 to-cyan-600 hover:from-green-600 hover:via-green-700 hover:to-cyan-700 text-white border-0 shadow-xl shadow-green-500/30 transition-all duration-500 group-hover:shadow-2xl hover:scale-110 font-bold text-base py-4 relative overflow-hidden"
                          onClick={() => handleStartGame(game.id)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <Play className="w-4 h-4" />
                            <span>🚀 Start</span>
                          </div>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 via-green-600 to-cyan-600 hover:from-green-600 hover:via-green-700 hover:to-cyan-700 text-white border-0 shadow-xl shadow-green-500/30 transition-all duration-500 group-hover:shadow-2xl hover:scale-110 font-bold text-base py-4 relative overflow-hidden"
                        onClick={() => handleStartGame(game.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <Play className="w-5 h-5" />
                          <span>🚀 Start Your Journey</span>
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Progress Section */}
          <div className="w-full max-w-4xl mx-auto">
            {/* Your Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-white text-center justify-center">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="py-3 text-gray-300">Games Completed</td>
                          <td className="py-3 text-right text-white font-medium">
                            {!user ? 'Please log in' : progress ? `${progress.completed} / 2` : 'Loading...'}
                          </td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-3 text-gray-300">Total Sessions</td>
                          <td className="py-3 text-right text-white font-medium">
                            {!user ? '—' : progress ? progress.totalSessions : 'Loading...'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-300">Achievement Points</td>
                          <td className="py-3 text-right text-cyan-400 font-medium">
                            {!user ? '—' : progress ? progress.achievementPoints : 'Loading...'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {user && !progress && (
                      <div className="text-center py-4">
                        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-400 text-sm">Loading your progress...</p>
                      </div>
                    )}
                    {!user && (
                      <p className="text-center text-gray-400 text-sm mt-3">Please log in to view your progress</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Demo Modal */}
      <AlertDialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <AlertDialogContent className="bg-black border-gray-700 max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-2xl">Typing Hero - Interactive Demo</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Experience the gameplay mechanics in this live demo
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden min-h-[400px] my-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 rounded-t-2xl"></div>
            
            {/* Demo Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Typing Hero</h3>
                <p className="text-sm text-gray-400">Interactive Demo</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Play className="w-3 h-3 mr-1" />
                Live Demo
              </Badge>
            </div>

            {/* Demo Game Area */}
            <div className="relative h-48 bg-gradient-to-b from-gray-900/50 to-gray-800/50 rounded-lg border border-white/10 overflow-hidden">
              {/* Lane Dividers */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-cyan-400/30"
                  style={{ left: `${(i / 5) * 100}%` }}
                />
              ))}

              {/* Danger Zone */}
              <div
                className="absolute left-0 right-0 border-t-2 border-b-2 border-red-400/60 bg-red-400/10"
                style={{
                  top: '85%',
                  height: '15%'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-xs opacity-60">DANGER ZONE</span>
                </div>
              </div>

              {/* Animated Falling Words */}
              <AnimatePresence>
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ 
                      y: [0, 100, 200, 300, 400],
                      opacity: [0, 1, 1, 1, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      delay: i * 0.8,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className={`absolute text-white font-bold text-xs px-2 py-1 rounded bg-blue-500/80`}
                    style={{
                      left: `${((i % 5) / 5) * 100 + (1 / 5) * 50}%`,
                      top: '0%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {['assist', 'create', 'design', 'develop', 'manage', 'support', 'service', 'project'][i % 8]}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Animated Effects */}
              <AnimatePresence>
                {Array.from({ length: 4 }, (_, i) => (
                  <motion.div
                    key={`effect-${i}`}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 2, 0], opacity: [1, 1, 0] }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 1.5 + 1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute text-4xl pointer-events-none"
                    style={{
                      left: `${((i % 5) / 5) * 100 + (1 / 5) * 50}%`,
                      top: '70%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {i % 2 === 0 ? '🔥' : '💩'}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Bonus Text Effects */}
              <AnimatePresence>
                {Array.from({ length: 2 }, (_, i) => (
                  <motion.div
                    key={`bonus-${i}`}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -30, scale: 1.2 }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 3 + 2,
                      repeat: Infinity,
                      repeatDelay: 4
                    }}
                    className="absolute text-xs font-bold pointer-events-none text-green-400"
                    style={{
                      left: `${((i % 5) / 5) * 100 + (1 / 5) * 50}%`,
                      top: '65%',
                      transform: 'translateX(-50%)',
                      textShadow: '0 0 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    PERFECT! +50
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Demo Stats */}
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-bold">2,450</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <span className="text-green-400 font-bold">12</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💩</span>
                  <span className="text-red-400 font-bold">3</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-bold">5x</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-cyan-400 font-bold">45 WPM</span>
                <span className="text-white">92% Accuracy</span>
              </div>
            </div>

            {/* Demo Input Area */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <div className="bg-gray-700/50 border border-white/20 rounded-md px-3 py-2 text-sm font-mono text-white relative">
                    <span className="text-white">{displayText}</span>
                    <span className="text-cyan-400 animate-pulse">|</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  <div>Timing bonuses: <span className="text-green-400">Perfect +50</span></div>
                  <div>Realistic accuracy system</div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400 text-center">
                <span className="text-cyan-400 font-semibold">Disclaimer:</span> You type the words in the input area below the game screen, not directly on the falling words
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowDemoModal(false)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0"
            >
              Close Demo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* DISC Demo Modal */}
      <AlertDialog open={showDiscDemoModal} onOpenChange={setShowDiscDemoModal}>
        <AlertDialogContent className="bg-black border-gray-700 max-w-5xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-2xl">🎯 BPOC DISC - Interactive Demo</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Experience authentic Filipino scenarios and discover your BPO animal spirit!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden min-h-[500px] my-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-t-2xl"></div>
            
            {/* Demo Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">🎯 Filipino DISC Personality</h3>
                <p className="text-sm text-gray-400">Interactive Demo</p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Play className="w-3 h-3 mr-1" />
                Live Demo
              </Badge>
            </div>

            {/* Demo Content */}
            {discDemoStep < discDemoScenarios.length ? (
              <div className="space-y-6">
                {/* Auto Demo Indicator */}
                <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Auto Demo in Progress</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>

                {/* Current Scenario */}
                <motion.div 
                  key={discDemoStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-500/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">
                      {discDemoScenarios[discDemoStep].context === 'FAMILY' ? '👨‍👩‍👧‍👦' : 
                       discDemoScenarios[discDemoStep].context === 'WORK' ? '💼' : '🎯'}
                    </span>
                    <span className="text-purple-300 font-semibold text-sm">
                      {discDemoScenarios[discDemoStep].context} Context
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {discDemoScenarios[discDemoStep].title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {discDemoScenarios[discDemoStep].scenario}
                  </p>
                </motion.div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {discDemoScenarios[discDemoStep].options.map((option, index) => {
                    const isSelected = discDemoSelected === option.id;
                    const isHighlighted = discDemoCurrentChoice === index && !discDemoSelected;
                    
                    // Get context colors for consistent styling
                    const contextColors = {
                      FAMILY: { primary: 'pink', bg: 'from-pink-500/10 to-rose-500/10', border: 'border-pink-500/30' },
                      WORK: { primary: 'blue', bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/30' },
                      SOCIAL: { primary: 'green', bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/30' },
                      TRAFFIC: { primary: 'orange', bg: 'from-orange-500/10 to-red-500/10', border: 'border-orange-500/30' },
                      MONEY: { primary: 'yellow', bg: 'from-yellow-500/10 to-amber-500/10', border: 'border-yellow-500/30' }
                    };
                    
                    const currentContext = discDemoScenarios[discDemoStep].context as keyof typeof contextColors;
                    const colors = contextColors[currentContext] || contextColors.WORK;
                    
                    return (
                      <motion.div
                        key={option.id}
                        className={`text-left transition-all rounded-lg border ${colors.border} bg-gradient-to-br ${colors.bg} ${
                          isSelected 
                            ? `ring-2 ring-${colors.primary}-400 scale-[1.02] shadow-lg` 
                            : isHighlighted 
                            ? `ring-1 ring-${colors.primary}-400/50 scale-[1.01] shadow-md` 
                            : `hover:ring-1 hover:ring-${colors.primary}-400/50`
                        } backdrop-blur-sm p-4 relative overflow-hidden`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: isSelected ? 1.02 : isHighlighted ? 1.01 : 1
                        }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <span className="text-white text-sm">✓</span>
                          </motion.div>
                        )}
                        
                        {/* Highlighting effect */}
                        {isHighlighted && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                          />
                        )}
                        
                        <div className="flex items-center gap-3">
                          <div className="text-2xl select-none">
                            🔮
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-semibold leading-snug text-base">
                              {option.text}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Spirit Reaction */}
                {discDemoReaction && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -20 }}
                    className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 relative overflow-hidden"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="text-2xl mb-2"
                    >
                      ✨
                    </motion.div>
                    <p className="text-purple-300 font-semibold">{discDemoReaction}</p>
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                )}

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">
                      Question {discDemoStep + 1} of {discDemoScenarios.length}
                    </div>
                    <div className="text-purple-300 text-xs">
                      Auto Demo • {discDemoAutoMode ? 'Running' : 'Paused'}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((discDemoStep + 1) / discDemoScenarios.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                </div>
              </div>
            ) : (
              /* Demo Results */
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="text-6xl mb-4"
                >
                  🔮
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Your Filipino BPO Animal Spirit!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-300 mb-6"
                >
                  Based on your demo choices, you're showing traits of a {Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'D' ? 'Dominant Leader' : Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'I' ? 'Influential Social Star' : Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'S' ? 'Steady Guardian' : 'Conscientious Analyst'}!
                </motion.p>
                
                {/* Sample Animal Display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center mb-6"
                >
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-6xl mb-3">
                        {Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'D' ? '🦅' : 
                         Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'I' ? '🦚' : 
                         Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'S' ? '🐢' : '🦉'}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'D' ? 'The Sky Dominator' : 
                         Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'I' ? 'The Social Star' : 
                         Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'S' ? 'The Steady Guardian' : 'The Wise Analyst'}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'D' ? 'You soar above challenges and lead from the front!' : 
                         Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'I' ? 'You light up rooms and connect with people effortlessly!' : 
                         Object.entries(discDemoScores).sort(([,a], [,b]) => b - a)[0][0] === 'S' ? 'You keep everything running smoothly and provide the foundation teams depend on!' : 'You spot what others miss and ensure everything meets the highest standards!'}
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30 relative overflow-hidden"
                >
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                  <h4 className="text-lg font-semibold text-white mb-3">🎯 Perfect BPO Roles for You:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="text-cyan-300"
                    >
                      • Team Lead
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                      className="text-cyan-300"
                    >
                      • Operations Manager
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                      className="text-cyan-300"
                    >
                      • Customer Service Lead
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                      className="text-cyan-300"
                    >
                      • Quality Assurance
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-xs text-gray-400"
                >
                  This is just a demo! Take the full assessment to get your complete personality analysis with AI-powered insights and personalized BPO career recommendations.
                </motion.p>
              </motion.div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowDiscDemoModal(false)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
            >
              Close Demo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 