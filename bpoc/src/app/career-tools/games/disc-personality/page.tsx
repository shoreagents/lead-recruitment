'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  ArrowLeft,
  Brain,
  Play,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  Star,
  Zap,
  VolumeX,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Building2,
  BarChart3,
  Briefcase,
  Flame,
  Sparkles,
  Shield,
  Heart,
  DollarSign,
  Car,
  Users,
  Church,
  Home,
  ChevronDown
} from 'lucide-react';
import { PacmanLoader } from 'react-spinners';

import { FILIPINO_DISC_SCENARIOS } from '../../../../data/filipinoDiscScenarios';

// Animal personality definitions
const ANIMAL_PERSONALITIES = {
  D: {
    animal: "🦅 EAGLE",
    title: "The Sky Dominator",
    description: "You soar above challenges and lead from the front!",
    traits: ["Natural Leader", "Results-Focused", "Decisive", "Direct"],
    bpoRoles: ["Team Lead", "Operations Manager", "Escalation Specialist", "Performance Coach"],
    color: "from-red-500 to-red-600",
    borderColor: "border-red-500/30"
  },
  I: {
    animal: "🦚 PEACOCK", 
    title: "The Social Star",
    description: "You light up rooms and connect with people effortlessly!",
    traits: ["People-Oriented", "Enthusiastic", "Persuasive", "Optimistic"],
    bpoRoles: ["Customer Service Lead", "Sales Manager", "Training Specialist", "Client Relations"],
    color: "from-yellow-500 to-yellow-600",
    borderColor: "border-yellow-500/30"
  },
  S: {
    animal: "🐢 TURTLE",
    title: "The Steady Guardian", 
    description: "You keep everything running smoothly and provide the foundation teams depend on!",
    traits: ["Reliable", "Patient", "Team-Oriented", "Consistent"],
    bpoRoles: ["Quality Assurance", "Operations Coordinator", "Process Analyst", "Support Specialist"],
    color: "from-green-500 to-green-600",
    borderColor: "border-green-500/30"
  },
  C: {
    animal: "🦉 OWL",
    title: "The Wise Analyst",
    description: "You spot what others miss and ensure everything meets the highest standards!",
    traits: ["Detail-Oriented", "Analytical", "Quality-Focused", "Systematic"],
    bpoRoles: ["Quality Manager", "Data Analyst", "Compliance Specialist", "Documentation Lead"],
    color: "from-blue-500 to-blue-600", 
    borderColor: "border-blue-500/30"
  }
};

// Context icons mapping
const CONTEXT_ICONS = {
  FAMILY: Home,
  WORK: Briefcase,
  SOCIAL: Users,
  TRAFFIC: Car,
  MONEY: DollarSign,
  CRISIS: Shield,
  RELIGION: Church,
  RELATIONSHIPS: Heart
};

// Context color themes
const CONTEXT_COLORS = {
  FAMILY: {
    primary: 'purple',
    border: 'border-purple-500/30',
    bg: 'bg-purple-900/30',
    containerBg: 'bg-purple-900/20',
    text: 'text-purple-300',
    accent: 'text-purple-400'
  },
  WORK: {
    primary: 'blue',
    border: 'border-blue-500/30',
    bg: 'bg-blue-900/30',
    containerBg: 'bg-blue-900/20',
    text: 'text-blue-300',
    accent: 'text-blue-400'
  },
  SOCIAL: {
    primary: 'green',
    border: 'border-green-500/30',
    bg: 'bg-green-900/30',
    containerBg: 'bg-green-900/20',
    text: 'text-green-300',
    accent: 'text-green-400'
  },
  TRAFFIC: {
    primary: 'orange',
    border: 'border-orange-500/30',
    bg: 'bg-orange-900/30',
    containerBg: 'bg-orange-900/20',
    text: 'text-orange-300',
    accent: 'text-orange-400'
  },
  MONEY: {
    primary: 'yellow',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-900/30',
    containerBg: 'bg-yellow-900/20',
    text: 'text-yellow-300',
    accent: 'text-yellow-400'
  },
  CRISIS: {
    primary: 'red',
    border: 'border-red-500/30',
    bg: 'bg-red-900/30',
    containerBg: 'bg-red-900/20',
    text: 'text-red-300',
    accent: 'text-red-400'
  },
  RELIGION: {
    primary: 'indigo',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-900/30',
    containerBg: 'bg-indigo-900/20',
    text: 'text-indigo-300',
    accent: 'text-indigo-400'
  },
  RELATIONSHIPS: {
    primary: 'pink',
    border: 'border-pink-500/30',
    bg: 'bg-pink-900/30',
    containerBg: 'bg-pink-900/20',
    text: 'text-pink-300',
    accent: 'text-pink-400'
  },
  PERSONAL: {
    primary: 'rose',
    border: 'border-rose-500/30',
    bg: 'bg-rose-900/30',
    containerBg: 'bg-rose-900/20',
    text: 'text-rose-300',
    accent: 'text-rose-400'
  }
};

interface GameState {
  currentQuestion: number;
  scores: { D: number; I: number; S: number; C: number };
  gameStarted: boolean;
  gameCompleted: boolean;
  xpPoints: number;
  badges: string[];
  achievements: string[];
  streak: number;
  combo: number;
  lastAnswer: string;
  sessionStartTime: Date | null;
  userProfile: UserProfile | null;
  responses: QuestionResponse[];
  personalizedQuestions: PersonalizedQuestion[];
  showPersonalized: boolean;
  isGeneratingPersonalized: boolean;
}

interface PersonalizedQuestion {
  id: number;
  context: string;
  title: string;
  scenario: string;
  options: Array<{
    id: string;
    disc: string;
    animal: string;
    text: string;
    reaction: string;
  }>;
}

interface UserProfile {
  name: string;
  age: number;
  location: string;
  monthlyIncome: string;
  workExperience: string;
  livingSituation: string;
  familyRole: string;
}

interface QuestionResponse {
  questionId: number;
  selectedChoice: string;
  discType: string;
  responseTime: number;
  timestamp: Date;
}

export default function FilipinoDiscGame() {
  const router = useRouter();
  
  // NEW: Shared results state
  const [sharedResults, setSharedResults] = useState<any>(null);
  const [showSharedResults, setShowSharedResults] = useState(false);
  const { user, session } = useAuth();
  
  // Check for shared results on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resultsParam = urlParams.get('results');
    
    if (resultsParam) {
      try {
        const decodedResults = JSON.parse(decodeURIComponent(resultsParam));
        setSharedResults(decodedResults);
        setShowSharedResults(true);
      } catch (error) {
        console.error('Failed to parse shared results:', error);
      }
    }
  }, []);
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    scores: { D: 0, I: 0, S: 0, C: 0 },
    gameStarted: false,
    gameCompleted: false,
    xpPoints: 0,
    badges: [],
    achievements: [],
    streak: 0,
    combo: 0,
    lastAnswer: '',
    sessionStartTime: null,
    userProfile: null,
    responses: [],
    personalizedQuestions: [],
    showPersonalized: false,
    isGeneratingPersonalized: false
  });
  

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [discResult, setDiscResult] = useState<any>(null);
  const [showReaction, setShowReaction] = useState<string | null>(null);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSpiritReveal, setShowSpiritReveal] = useState(false);
  const [revealStep, setRevealStep] = useState(0);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(false);
  
  // Music control state
  const [musicGender, setMusicGender] = useState<'male' | 'female'>('male');
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [aiAssessment, setAiAssessment] = useState<string | null>(null);
  const [isGeneratingAIAssessment, setIsGeneratingAIAssessment] = useState(false);
  const [aiBpoRoles, setAiBpoRoles] = useState<any[] | null>(null);
  const [isGeneratingBpoRoles, setIsGeneratingBpoRoles] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState<Set<number>>(new Set());
  
  // Resume check state
  const [showResumeRequiredModal, setShowResumeRequiredModal] = useState(false);
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  const [checkingResume, setCheckingResume] = useState(false);
  
  // Toggle role explanation
  const toggleRoleExplanation = (index: number) => {
    setExpandedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  
  // Music selection state
  const [musicLanguage, setMusicLanguage] = useState<'maledisc' | 'femaledisc'>('maledisc');
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewingGender, setPreviewingGender] = useState<'maledisc' | 'femaledisc' | null>(null);
  const [previewCountdown, setPreviewCountdown] = useState(0);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  // Initialize background music
  useEffect(() => {
    // Stop current music if it exists
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    
    const audio = new Audio(`/bpoc-disc-songs/${musicLanguage}.mp3`);
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.3; // Respect mute state
    audio.preload = 'auto';
    
    // Add error handling
    audio.addEventListener('error', (e) => {
      console.error('❌ Audio loading error:', e);
    });
    
    setBackgroundMusic(audio);
    
    // If music was playing before, start the new track
    if (isMusicPlaying && gameState.gameStarted) {
      audio.play().catch(error => {
        console.log('Music play failed on gender change:', error);
      });
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [musicLanguage]);

  // Handle mute state changes
  useEffect(() => {
    if (backgroundMusic) {
      backgroundMusic.volume = isMuted ? 0 : 0.3;
    }
  }, [isMuted, backgroundMusic]);

  // Play music when game starts
  useEffect(() => {
    if (gameState.gameStarted && backgroundMusic && !isMusicPlaying) {
      const playMusic = async () => {
        try {
          await backgroundMusic.play();
          setIsMusicPlaying(true);
        } catch (error) {
          // Autoplay blocked - user can manually start music with toggle button
        }
      };
      playMusic();
    }
  }, [gameState.gameStarted, backgroundMusic, isMusicPlaying]);

  // Preview music function with countdown
  const previewMusic = async (type: 'maledisc' | 'femaledisc') => {
    if (isPreviewing) return;
    
    // Stop any existing preview audio first
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }
    
    setIsPreviewing(true);
    setPreviewingGender(type);
    setPreviewCountdown(10);
    const newPreviewAudio = new Audio(`/bpoc-disc-songs/${type}.mp3`);
    newPreviewAudio.volume = 0.3;
    setPreviewAudio(newPreviewAudio);
    
    try {
      await newPreviewAudio.play();
      
      // Countdown from 10 to 0
      const countdownInterval = setInterval(() => {
        setPreviewCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            newPreviewAudio.pause();
            newPreviewAudio.currentTime = 0;
            setIsPreviewing(false);
            setPreviewingGender(null);
            setPreviewAudio(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('❌ Preview error:', error);
      setIsPreviewing(false);
      setPreviewingGender(null);
      setPreviewCountdown(0);
    }
  };

  // Stop preview function
  const stopPreview = () => {
    setIsPreviewing(false);
    setPreviewingGender(null);
    setPreviewCountdown(0);
    // Stop the stored preview audio
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
      setPreviewAudio(null);
    }
  };

  // Toggle music function
  const toggleMusic = async () => {
    console.log('🎵 toggleMusic called');
    console.log('🎵 backgroundMusic:', backgroundMusic);
    console.log('🎵 isMusicPlaying:', isMusicPlaying);
    
    if (!backgroundMusic) {
      console.log('🎵 No background music available');
      return;
    }
    
    try {
      if (isMusicPlaying) {
        console.log('🎵 Pausing music...');
        backgroundMusic.pause();
        setIsMusicPlaying(false);
      } else {
        console.log('🎵 Playing music...');
        // Check if audio is ready to play
        if (backgroundMusic.readyState >= 2) { // HAVE_CURRENT_DATA
          await backgroundMusic.play();
          setIsMusicPlaying(true);
          console.log('🎵 Music started successfully');
        } else {
          console.log('🎵 Audio not ready, waiting...');
          // Wait for audio to be ready
          backgroundMusic.addEventListener('canplay', async () => {
            try {
              await backgroundMusic.play();
              setIsMusicPlaying(true);
              console.log('🎵 Music started after waiting');
            } catch (playError) {
              console.error('❌ Play error:', playError);
            }
          }, { once: true });
        }
      }
    } catch (error) {
      console.error('❌ Music toggle error:', error);
    }
  };

  // Sound effects for spirit selection
  const playSpiritSound = (discType: string) => {
    try {
      const sounds = {
        'D': () => {
          // Eagle screech simulation with Web Audio API
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        },
        'I': () => {
          // Peacock call - melodic chirp
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(650, audioContext.currentTime + 0.2);
          
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
        },
        'S': () => {
          // Turtle - low gentle hum
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.6);
        },
        'C': () => {
          // Owl hoot - two tone
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(250, audioContext.currentTime + 0.2);
          
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }
      };
      
      sounds[discType as keyof typeof sounds]?.();
    } catch (error) {
      console.log('🔇 Sound not available:', error);
    }
  };

  // Toggle volume control
  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    // Only toggle the volume control visibility, don't change mute state
    setShowVolumeControl(!showVolumeControl);
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0); // Set mute state based on volume
    if (backgroundMusic) {
      backgroundMusic.volume = newVolume;
    }
  };

  // Profile modal removed - using existing user data

  const currentScenario = gameState.showPersonalized 
    ? gameState.personalizedQuestions?.[gameState.currentQuestion - FILIPINO_DISC_SCENARIOS.length]
    : FILIPINO_DISC_SCENARIOS[gameState.currentQuestion];
  
  // Randomize choice order to prevent pattern recognition (memoized to prevent re-shuffling)
  const shuffledOptions = useMemo(() => {
    return currentScenario?.options ? [...currentScenario.options].sort(() => Math.random() - 0.5) : [];
  }, [currentScenario?.options]);
  
	// Style helpers for DISC options
	const getDiscStyles = (disc: string) => {
		switch (disc) {
			case 'D':
				return {
					bg: 'from-red-500/10 to-red-600/10',
					border: 'border-red-500/40',
					ring: 'ring-red-500/30',
					text: 'text-red-300'
				}
			case 'I':
				return {
					bg: 'from-yellow-500/10 to-yellow-600/10',
					border: 'border-yellow-500/40',
					ring: 'ring-yellow-500/30',
					text: 'text-yellow-300'
				}
			case 'S':
				return {
					bg: 'from-green-500/10 to-green-600/10',
					border: 'border-green-500/40',
					ring: 'ring-green-500/30',
					text: 'text-green-300'
				}
			case 'C':
				return {
					bg: 'from-blue-500/10 to-blue-600/10',
					border: 'border-blue-500/40',
					ring: 'ring-blue-500/30',
					text: 'text-blue-300'
				}
			default:
				return {
					bg: 'from-cyan-500/10 to-purple-600/10',
					border: 'border-white/10',
					ring: 'ring-white/10',
					text: 'text-gray-300'
				}
		}
	}
  
  const totalQuestions = FILIPINO_DISC_SCENARIOS.length + (gameState.personalizedQuestions?.length || 0);
  const progressPercent = Math.min(100, Math.round(((gameState.currentQuestion + 1) / Math.max(totalQuestions, 1)) * 100));
  
  // Auto-create user profile from existing data
  useEffect(() => {
    if (user && !gameState.userProfile && gameState.gameStarted) {
      const profile: UserProfile = {
        name: user.user_metadata?.full_name || 'Player',
        age: 28, // Default age
        location: user.user_metadata?.location || 'Metro Manila',
        monthlyIncome: '35000-50000', // Default based on BPO averages
        workExperience: '3-5-years-bpo', // Default
        livingSituation: 'with_parents', // Common Filipino situation
        familyRole: 'supportive_child' // Common Filipino role
      };
      setGameState(prev => ({ ...prev, userProfile: profile }));
    }
  }, [user, gameState.gameStarted, gameState.userProfile]);

  // Check if user has a saved resume
  const checkUserResume = useCallback(async () => {
    console.log('🔍 DISC checkUserResume: Starting check for user:', user?.id);
    
    if (!user?.id) {
      console.log('❌ DISC checkUserResume: No user ID found');
      setHasResume(false);
      return false;
    }

    setCheckingResume(true);
    try {
      console.log('🔑 DISC checkUserResume: Getting session token...');
      // Get the session token for authentication
      const token = await (await import('@/lib/auth-helpers')).getSessionToken();
      console.log('🎫 DISC checkUserResume: Token obtained:', !!token);
      
      console.log('📡 DISC checkUserResume: Fetching saved resumes...');
      const response = await fetch('/api/user/saved-resumes', {
        headers: {
          'x-user-id': String(user.id),
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        cache: 'no-store'
      });

      console.log('📊 DISC checkUserResume: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📄 DISC checkUserResume: Response data:', data);
        const hasResumeData = data?.success && data?.hasSavedResume;
        console.log('✅ DISC checkUserResume: Has resume:', hasResumeData);
        setHasResume(hasResumeData);
        return hasResumeData;
      } else {
        console.log('❌ DISC checkUserResume: Response not OK');
        const errorText = await response.text();
        console.log('❌ DISC checkUserResume: Error response:', errorText);
        setHasResume(false);
        return false;
      }
    } catch (error) {
      console.error('❌ DISC checkUserResume: Error:', error);
      setHasResume(false);
      return false;
    } finally {
      setCheckingResume(false);
      console.log('🏁 DISC checkUserResume: Check complete');
    }
  }, [user?.id]);

  // Check for saved resume on page load
  useEffect(() => {
    if (user?.id) {
      console.log('🔍 DISC: Checking for saved resume on page load...');
      checkUserResume();
    }
  }, [user?.id, checkUserResume]);

  const startGame = async () => {
    console.log('🎮 DISC: Starting game...');
    
    // Stop any preview that's playing
    stopPreview();
    
    if (!user) {
      console.log('❌ DISC: No user found, triggering signup');
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('signup', 'true');
        router.push(`${url.pathname}?${url.searchParams.toString()}`);
        return;
      }
    }
    
    try {
      // Check if user has a saved resume first (use cached value for instant response)
      if (hasResume === false) {
        console.log('⚠️ DISC: No resume found (cached), showing modal');
        setShowResumeRequiredModal(true);
        return;
      }
      
      // If we haven't checked yet, check now
      if (hasResume === null) {
        console.log('🔍 DISC: Checking user resume (not cached yet)...');
        const hasResumeData = await checkUserResume();
        console.log('📝 DISC: Resume check result:', hasResumeData);
        
        if (!hasResumeData) {
          console.log('⚠️ DISC: No resume found, showing modal');
          setShowResumeRequiredModal(true);
          return;
        }
      }
      
      console.log('✅ DISC: Resume found, starting game!');
      setGameState(prev => ({ 
        ...prev, 
        gameStarted: true,
        sessionStartTime: new Date()
      }));
    } catch (error) {
      console.error('❌ DISC: Error in startGame:', error);
      // If there's an error checking resume, allow game to start anyway
      setGameState(prev => ({ 
        ...prev, 
        gameStarted: true,
        sessionStartTime: new Date()
      }));
    }
  };



  // Generate personalized questions using Claude API
  const generatePersonalizedQuestions = async (responses?: any[], scores?: any) => {
    if (!user) {
      console.error('❌ No user found for personalized questions');
      completeGame();
      return;
    }

    // Use passed parameters or fallback to current state
    const currentResponses = responses || gameState.responses;
    const currentScores = scores || gameState.scores;

    console.log('🤖 Starting personalized questions generation for user:', user.id);
    setGameState(prev => ({ ...prev, isGeneratingPersonalized: true }));
    
    try {
      console.log('🤖 Generating personalized questions for', user.email);
      console.log('🤖 Current responses count:', currentResponses.length);
      console.log('🤖 Current DISC scores:', currentScores);
      console.log('🤖 Raw responses data:', currentResponses);
      console.log('🤖 Raw scores data:', currentScores);
      
      const requestBody = {
        userId: user.id,
        responses: currentResponses,
        discScores: currentScores
      };
      
      console.log('🤖 Sending request body:', requestBody);
      
      const response = await fetch('/api/games/disc/personalized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🌐 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received API response:', data);
        
        // Validate that we actually got questions
        if (data.personalizedQuestions && data.personalizedQuestions.length > 0) {
          console.log('✅ Setting up', data.personalizedQuestions.length, 'personalized questions');
          setGameState(prev => ({
            ...prev,
            personalizedQuestions: data.personalizedQuestions,
            showPersonalized: true,
            currentQuestion: FILIPINO_DISC_SCENARIOS.length,
            isGeneratingPersonalized: false
          }));
          
          // Clear any lingering UI state from previous question
          setSelectedOption(null);
          setShowReaction(null);
          setShowAchievement(null);
        } else {
          console.error('❌ No personalized questions in response:', data);
          completeGame();
        }
      } else {
        const errorText = await response.text();
        console.error('❌ API call failed:', response.status, errorText);
        // Complete game without personalized questions
        completeGame();
      }
    } catch (error) {
      console.error('❌ Error generating personalized questions:', error);
      // Complete game without personalized questions
      completeGame();
    }
  };

  const completeGame = () => {
    setGameState(prev => ({
      ...prev,
      gameCompleted: true,
      isGeneratingPersonalized: false
    }));
    calculateResults(gameState.scores);
  };

	// Safety check after functions are defined
	useEffect(() => {
		if (!currentScenario && gameState.gameStarted && !gameState.gameCompleted && !gameState.isGeneratingPersonalized) {
			console.log('⚠️ No current scenario found, completing game');
			console.log('Game state:', {
				currentQuestion: gameState.currentQuestion,
				showPersonalized: gameState.showPersonalized,
				personalizedQuestionsCount: gameState.personalizedQuestions?.length || 0,
				totalQuestions,
				isGenerating: gameState.isGeneratingPersonalized
			});
			completeGame();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentScenario, gameState.gameStarted, gameState.gameCompleted, gameState.isGeneratingPersonalized])

  const generateAIBpoRoles = async (results: any, allResponses: any[]): Promise<any[]> => {
    if (!user) return [];
    
    setIsGeneratingBpoRoles(true);
    
    try {
      console.log('💼 Generating AI BPO roles for user:', user.id);
      
      // First, fetch actual jobs from the job-matching API
      let actualJobs: any[] = [];
      try {
        const jobsResponse = await fetch('/api/public/jobs?pageSize=20&status=active');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          actualJobs = jobsData.items || [];
          console.log('📋 Fetched actual jobs:', actualJobs.length);
        }
      } catch (jobError) {
        console.error('Error fetching jobs:', jobError);
      }
      
      // Get user's current position from user metadata or profile
      const currentPosition = user.user_metadata?.position || user.user_metadata?.current_position || 'Not specified';
      const currentExperience = user.user_metadata?.bio || 'No bio available';
      const location = user.user_metadata?.location || 'Philippines';
      
      // Create a list of available job titles from actual jobs
      const availableJobTitles = actualJobs.map(job => job.job_title).filter(Boolean);
      const jobTitlesList = availableJobTitles.length > 0 ? availableJobTitles.join(', ') : 'Customer Service Representative, Technical Support Specialist, Quality Assurance Analyst, Team Lead';
      
      const bpoRolesPrompt = `You are an expert BPO career consultant. Based on this candidate's DISC personality and current position, recommend 4 suitable BPO job titles from the available jobs.

CANDIDATE:
- Current Position: ${currentPosition}
- Primary DISC Type: ${results.primaryType} (${results.scores[results.primaryType]}%)
- Secondary Type: ${results.secondaryType} (${results.scores[results.secondaryType]}%)

AVAILABLE JOB TITLES: ${jobTitlesList}

Return ONLY a JSON array of exactly 4 job recommendations with explanations:
[
  {
    "title": "Customer Experience Specialist",
    "explanation": "Your high Influence scores show natural people skills and communication abilities that make you perfect for customer-facing roles where you can build relationships and solve problems."
  },
  {
    "title": "Quality Assurance Analyst", 
    "explanation": "Your Conscientiousness traits indicate attention to detail and systematic thinking, ideal for ensuring quality standards and process improvement."
  },
  {
    "title": "Team Lead - Technical Support",
    "explanation": "Your balanced Dominance and Steadiness scores suggest leadership potential combined with reliability, perfect for guiding technical teams."
  },
  {
    "title": "Data Analytics Specialist",
    "explanation": "Your analytical Conscientiousness nature aligns with data-driven roles where precision and systematic analysis are crucial."
  }
]

Focus on real BPO roles in the Philippines that match their personality and experience level. Provide specific explanations for why each role suits their DISC personality type.`;

      const response = await fetch('/api/games/disc/personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          responses: allResponses,
          discScores: results.scores,
          prompt: bpoRolesPrompt,
          isAssessment: true // Reuse the same endpoint
        })
      });

      let generatedRoles: any[] = [];
      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.aiAssessment || '';
        
        // Try to extract JSON from the AI response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            generatedRoles = JSON.parse(jsonMatch[0]);
            console.log('✅ AI BPO roles generated:', generatedRoles.length);
          } catch (parseError) {
            console.error('Error parsing BPO roles JSON:', parseError);
            // Fallback to default roles with explanations
            generatedRoles = [
              { 
                title: "Customer Service Representative",
                explanation: `Your ${results.primaryType === 'I' ? 'high Influence' : results.primaryType === 'S' ? 'steady and reliable' : results.primaryType === 'C' ? 'analytical and detail-oriented' : 'decisive and results-focused'} personality makes you excellent at helping customers and building relationships.`
              },
              { 
                title: "Technical Support Specialist",
                explanation: `Your ${results.primaryType === 'C' ? 'systematic approach' : results.primaryType === 'S' ? 'patient nature' : results.primaryType === 'D' ? 'problem-solving skills' : 'communication abilities'} is perfect for troubleshooting and technical assistance.`
              },
              { 
                title: "Quality Assurance Analyst",
                explanation: `Your ${results.primaryType === 'C' ? 'attention to detail' : results.primaryType === 'S' ? 'methodical approach' : results.primaryType === 'D' ? 'results focus' : 'people skills'} ensures quality standards are met consistently.`
              },
              { 
                title: "Team Lead",
                explanation: `Your ${results.primaryType === 'D' ? 'natural leadership' : results.primaryType === 'I' ? 'people skills' : results.primaryType === 'S' ? 'reliability' : 'analytical thinking'} makes you an effective team leader.`
              }
            ];
          }
        } else {
          console.error('No JSON found in BPO roles response');
          generatedRoles = [
            { 
              title: "Customer Service Representative",
              explanation: `Your ${results.primaryType === 'I' ? 'high Influence' : results.primaryType === 'S' ? 'steady and reliable' : results.primaryType === 'C' ? 'analytical and detail-oriented' : 'decisive and results-focused'} personality makes you excellent at helping customers and building relationships.`
            },
            { 
              title: "Technical Support Specialist",
              explanation: `Your ${results.primaryType === 'C' ? 'systematic approach' : results.primaryType === 'S' ? 'patient nature' : results.primaryType === 'D' ? 'problem-solving skills' : 'communication abilities'} is perfect for troubleshooting and technical assistance.`
            },
            { 
              title: "Quality Assurance Analyst",
              explanation: `Your ${results.primaryType === 'C' ? 'attention to detail' : results.primaryType === 'S' ? 'methodical approach' : results.primaryType === 'D' ? 'results focus' : 'people skills'} ensures quality standards are met consistently.`
            },
            { 
              title: "Team Lead",
              explanation: `Your ${results.primaryType === 'D' ? 'natural leadership' : results.primaryType === 'I' ? 'people skills' : results.primaryType === 'S' ? 'reliability' : 'analytical thinking'} makes you an effective team leader.`
            }
          ];
        }
      } else {
        // Fallback roles based on DISC type with explanations
        const discBasedRoles = {
          'D': [
            { 
              title: "Team Lead - Operations",
              explanation: "Your natural Dominance traits make you a born leader who can drive results and motivate teams to achieve operational excellence."
            },
            { 
              title: "Quality Assurance Supervisor",
              explanation: "Your decisive nature and results focus make you perfect for overseeing quality standards and ensuring compliance."
            },
            { 
              title: "Training Manager",
              explanation: "Your leadership abilities and direct communication style make you effective at developing and training team members."
            },
            { 
              title: "Customer Experience Manager",
              explanation: "Your results-oriented approach and decision-making skills help you drive customer satisfaction and business outcomes."
            }
          ],
          'I': [
            { 
              title: "Customer Experience Specialist",
              explanation: "Your high Influence scores show natural people skills and enthusiasm that create positive customer interactions."
            },
            { 
              title: "Training and Development",
              explanation: "Your people-oriented nature and communication skills make you excellent at teaching and developing others."
            },
            { 
              title: "Team Lead - Customer Support",
              explanation: "Your social skills and ability to connect with people make you an effective leader in customer-facing roles."
            },
            { 
              title: "Sales Representative",
              explanation: "Your persuasive nature and optimistic attitude make you naturally suited for sales and relationship building."
            }
          ],
          'S': [
            { 
              title: "Technical Support Specialist",
              explanation: "Your patient and steady nature makes you excellent at providing consistent, reliable technical assistance."
            },
            { 
              title: "Data Entry Specialist",
              explanation: "Your methodical approach and attention to detail ensure accurate and consistent data processing."
            },
            { 
              title: "Customer Service Representative",
              explanation: "Your reliable and team-oriented nature makes you a dependable customer service professional."
            },
            { 
              title: "Quality Assurance Analyst",
              explanation: "Your consistent and systematic approach ensures quality standards are maintained across all processes."
            }
          ],
          'C': [
            { 
              title: "Data Analytics Specialist",
              explanation: "Your analytical thinking and attention to detail make you perfect for interpreting data and finding insights."
            },
            { 
              title: "Quality Assurance Analyst",
              explanation: "Your systematic approach and high standards ensure quality compliance and process improvement."
            },
            { 
              title: "Technical Documentation",
              explanation: "Your detail-oriented nature and systematic thinking make you excellent at creating accurate technical documentation."
            },
            { 
              title: "Process Improvement Specialist",
              explanation: "Your analytical skills and systematic approach help identify and implement process optimizations."
            }
          ]
        };
        generatedRoles = discBasedRoles[results.primaryType as keyof typeof discBasedRoles] || discBasedRoles['I'];
      }
      
      // Set state for UI display
      setAiBpoRoles(generatedRoles);
      console.log('🎯 AI BPO Roles generated and returned:', generatedRoles.length, 'roles');
      return generatedRoles;
      
    } catch (error) {
      console.error('❌ AI BPO roles generation failed:', error);
      const fallbackRoles = [
        { 
          title: "Customer Service Representative",
          explanation: `Your ${results.primaryType === 'I' ? 'high Influence' : results.primaryType === 'S' ? 'steady and reliable' : results.primaryType === 'C' ? 'analytical and detail-oriented' : 'decisive and results-focused'} personality makes you excellent at helping customers and building relationships.`
        },
        { 
          title: "Technical Support Specialist",
          explanation: `Your ${results.primaryType === 'C' ? 'systematic approach' : results.primaryType === 'S' ? 'patient nature' : results.primaryType === 'D' ? 'problem-solving skills' : 'communication abilities'} is perfect for troubleshooting and technical assistance.`
        },
        { 
          title: "Quality Assurance Analyst",
          explanation: `Your ${results.primaryType === 'C' ? 'attention to detail' : results.primaryType === 'S' ? 'methodical approach' : results.primaryType === 'D' ? 'results focus' : 'people skills'} ensures quality standards are met consistently.`
        },
        { 
          title: "Team Lead",
          explanation: `Your ${results.primaryType === 'D' ? 'natural leadership' : results.primaryType === 'I' ? 'people skills' : results.primaryType === 'S' ? 'reliability' : 'analytical thinking'} makes you an effective team leader.`
        }
      ];
      setAiBpoRoles(fallbackRoles);
      return fallbackRoles;
    } finally {
      setIsGeneratingBpoRoles(false);
    }
  };

  const generateAIAssessment = async (results: any, allResponses: any[]): Promise<string> => {
    if (!user) return '';
    
    setIsGeneratingAIAssessment(true);
    
    try {
      console.log('🧠 Generating AI assessment with ALL', allResponses.length, 'responses');
      
      const assessmentPrompt = `Analyze this complete BPOC DISC personality assessment for ${user.user_metadata?.first_name || user.email || 'this person'}:

FINAL RESULTS:
Primary Type: ${results.primaryType} (${results.scores[results.primaryType]}%)
Secondary Type: ${results.secondaryType} (${results.scores[results.secondaryType]}%)
All Scores: Dominance=${results.scores.D}%, Influence=${results.scores.I}%, Steadiness=${results.scores.S}%, Conscientiousness=${results.scores.C}%
Confidence: ${results.confidence}%

COMPLETE RESPONSE ANALYSIS (All ${allResponses.length} Questions):
${allResponses.map(r => `Q${r.questionId}: Choice ${r.selectedChoice} (${r.discType}) - ${r.responseTime}ms response time`).join('\n')}

Create a comprehensive 3-paragraph assessment that:
1. Analyzes their TRUE personality based on ALL response patterns (not just scores)
2. Explains how this applies to Filipino workplace culture and BPO roles
3. Provides specific strengths, blind spots, and growth recommendations
4. References notable response patterns or speed/consistency
5. Uses encouraging but brutally honest tone
6. IMPORTANT: Always use full DISC terms (Dominance, Influence, Steadiness, Conscientiousness) instead of just initials (D, I, S, C)

Additionally, provide these specific sections:
- CORE TRAITS: List 3-4 key personality traits based on their actual responses and patterns. For each trait, provide evidence from their response patterns. Examples: "Strategic Decision-Maker (evidenced by balanced Dominance/Conscientiousness pattern)", "Analytical Problem-Solver (reflected in Conscientiousness-type response patterns)", "Natural Leader (demonstrated through consistent Dominance choices)", "Team Collaborator (shown in Steadiness and Influence responses)", "Social Connector (evidenced by Influence-dominant patterns)". Always include the specific DISC pattern evidence in parentheses.

- CULTURAL STRENGTHS: Explain 2-3 specific Filipino cultural values they embody based on their choices. Reference their actual response patterns and how they align with Filipino workplace values like pakikisama (ability to get along), malasakit (genuine care), bayanihan (community spirit), husay at tiyaga (excellence and perseverance), and tapang at tiyaga (courage and perseverance).

- ANIMAL PERSONALITY ANALYSIS: Based on their primary type (${results.primaryType}), explain WHY they became their specific animal (${results.primaryType === 'D' ? 'Eagle' : results.primaryType === 'I' ? 'Peacock' : results.primaryType === 'S' ? 'Turtle' : 'Owl'}) and what this reveals about their authentic self. Use the animal metaphor to describe their natural instincts, decision-making patterns, and how they navigate challenges. Make it personal and insightful. Format this section in bullet points for easy reading. Include specific examples from their response patterns that demonstrate their animal personality traits.

IMPORTANT FORMATTING: 
- For Filipino cultural terms, always provide English translations in parentheses for consistency (e.g., "pakikisama (ability to get along)", "malasakit (genuine care)", "bayanihan (community spirit)")
- Always use full DISC terminology: "Dominance" not "D", "Influence" not "I", "Steadiness" not "S", "Conscientiousness" not "C"
- For CORE TRAITS, always include evidence in parentheses showing which DISC patterns support each trait
- For ANIMAL PERSONALITY ANALYSIS, reference specific response patterns and timing data that demonstrate their animal characteristics

Make it deeply personal and actionable based on their actual choices.`;

      const response = await fetch('/api/games/disc/personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          responses: allResponses,
          discScores: results.scores,
          prompt: assessmentPrompt,
          isAssessment: true
        })
      });

      let generatedAssessment = '';
      if (response.ok) {
        const data = await response.json();
        generatedAssessment = data.aiAssessment || `Based on your complete ${allResponses.length}-question assessment, you demonstrate strong ${results.primaryType === 'D' ? 'leadership and decisive action' : results.primaryType === 'I' ? 'social influence and team building' : results.primaryType === 'S' ? 'reliability and steady support' : 'analytical thinking and systematic approach'}. Your response patterns show authentic decision-making that aligns well with Filipino workplace values and BPO industry requirements.`;
        console.log('✅ AI assessment generated using:', data.generatedBy);
      } else {
        generatedAssessment = `Your comprehensive ${allResponses.length}-question assessment reveals a ${results.primaryType === 'D' ? 'dynamic leader' : results.primaryType === 'I' ? 'natural influencer' : results.primaryType === 'S' ? 'steady supporter' : 'analytical thinker'} with strong potential. Your response patterns show consistent decision-making that indicates excellent professional capabilities and cultural adaptability in the Philippine workplace.`;
      }
      
      // Set state for UI display
      setAiAssessment(generatedAssessment);
      console.log('🎯 AI Assessment generated and returned:', generatedAssessment.length, 'characters');
      return generatedAssessment;
      
    } catch (error) {
      console.log('❌ AI assessment failed, using enhanced fallback');
      const fallbackAssessment = `Your comprehensive ${allResponses.length}-question assessment reveals a ${results.primaryType === 'D' ? 'dynamic leader' : results.primaryType === 'I' ? 'natural influencer' : results.primaryType === 'S' ? 'steady supporter' : 'analytical thinker'} with strong potential. Your response patterns show consistent decision-making that indicates excellent professional capabilities and cultural adaptability in the Philippine workplace.`;
      setAiAssessment(fallbackAssessment);
      return fallbackAssessment;
    } finally {
      setIsGeneratingAIAssessment(false);
    }
  };

  const handleOptionSelect = (optionId: string, disc: string, reaction: string) => {
    const startTime = Date.now();
    setSelectedOption(optionId);
    
    // Show mysterious spirit collection instead of reaction
    const spiritMessages = {
      'D': 'A fierce spirit stirs within...',
      'I': 'A vibrant energy awakens...',
      'S': 'A steady presence grows...',
      'C': 'Ancient wisdom gathers...'
    };
    setShowReaction(spiritMessages[disc as keyof typeof spiritMessages] || 'A mysterious force awakens...');
    
    // Play spirit sound effect
    playSpiritSound(disc);
    
    // Record response
    const response: QuestionResponse = {
      questionId: gameState.currentQuestion + 1,
      selectedChoice: optionId,
      discType: disc,
      responseTime: startTime - (gameState.sessionStartTime?.getTime() || startTime),
      timestamp: new Date()
    };

    // Calculate XP per question (small amount per question)
    let xpGain = 5; // 5 XP per question answered
    const newAchievements = [...gameState.achievements];
    
    // Streak system
    let newStreak = gameState.streak;
    let newCombo = gameState.combo;
    
    if (disc === gameState.lastAnswer) {
      newStreak += 1;
      newCombo += 1;
      xpGain += Math.floor(newStreak * 2); // Bonus XP for streaks (reduced)
    } else {
      newStreak = 1;
      newCombo = 0;
    }
    
    // Achievement system
    if (gameState.currentQuestion === 0 && disc === 'D') {
      newAchievements.push('Quick Eagle');
    }
    if (newStreak === 3 && !newAchievements.includes('Streak Master')) {
      newAchievements.push('Streak Master');
      setShowAchievement('Streak Master');
      setTimeout(() => setShowAchievement(null), 3000);
    }
    
    setTimeout(() => {
      const newScores = { ...gameState.scores };
      newScores[disc as keyof typeof newScores] += 1;
      
      const newResponses = [...gameState.responses, response];
      
      // Update state with new data
        setGameState(prev => ({
          ...prev,
          scores: newScores,
          xpPoints: prev.xpPoints + xpGain,
          achievements: newAchievements,
          streak: newStreak,
          combo: newCombo,
        lastAnswer: disc,
        responses: newResponses
      }));
      
      // Check if we just completed the 30th question (index 29)
      if (gameState.currentQuestion === FILIPINO_DISC_SCENARIOS.length - 1 && !gameState.showPersonalized) {
        console.log('🎯 Just completed question 30! Responses:', newResponses.length);
        console.log('🎯 Final scores after 30 questions:', newScores);
        console.log('🎯 Triggering personalized questions generation');
        generatePersonalizedQuestions(newResponses, newScores);
        return;
      }
      
      // Continue to next question or complete game
      if (gameState.currentQuestion < totalQuestions - 1) {
        setGameState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1
        }));
        setSelectedOption(null);
        setShowReaction(null);
      } else {
        completeGame();
      }
    }, 1500);
  };

  const calculateResults = async (scores: { D: number; I: number; S: number; C: number }) => {
    // Start the dramatic reveal sequence
    setShowSpiritReveal(true);
    setRevealStep(0);
    
    // Step 1: "The spirits have spoken..."
    setTimeout(() => setRevealStep(1), 1000);
    
    // Step 2: "Your destiny is revealed..."
    setTimeout(() => setRevealStep(2), 3000);
    
    // Step 3: Show the actual results
    setTimeout(async () => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    // Calculate raw percentages
    const rawPercentages = {
      D: (scores.D / total) * 100,
      I: (scores.I / total) * 100,
      S: (scores.S / total) * 100,
      C: (scores.C / total) * 100
    };
    
    // Round to integers and ensure they sum to exactly 100
    const roundedPercentages = {
      D: Math.round(rawPercentages.D),
      I: Math.round(rawPercentages.I),
      S: Math.round(rawPercentages.S),
      C: Math.round(rawPercentages.C)
    };
    
    // Calculate the difference from 100
    const currentSum = Object.values(roundedPercentages).reduce((sum, val) => sum + val, 0);
    const difference = 100 - currentSum;
    
    // Find the largest percentage to adjust
    const sortedEntries = Object.entries(roundedPercentages).sort(([,a], [,b]) => b - a);
    const largestKey = sortedEntries[0][0] as keyof typeof roundedPercentages;
    
    // Adjust the largest percentage to make the sum exactly 100
    const percentages = {
      ...roundedPercentages,
      [largestKey]: roundedPercentages[largestKey] + difference
    };

    const sorted = Object.entries(percentages).sort(([,a], [,b]) => b - a);
    const primaryType = sorted[0][0] as 'D' | 'I' | 'S' | 'C';
      const secondaryType = sorted[1][0] as 'D' | 'I' | 'S' | 'C';

    // Calculate cultural alignment based on response patterns
    const calculateCulturalAlignment = () => {
      const culturalContexts = ['FAMILY', 'WORK', 'SOCIAL', 'TRAFFIC', 'MONEY', 'CRISIS'];
      const contextScores = culturalContexts.map(context => {
        const contextResponses = gameState.responses.filter((r, index) => {
          const scenario = index < FILIPINO_DISC_SCENARIOS.length ? FILIPINO_DISC_SCENARIOS[index] : null;
          return scenario?.context === context;
        });
        if (contextResponses.length === 0) return 0;
        
        // Score based on culturally appropriate choices
        const culturalScore = contextResponses.reduce((score, response) => {
          // Higher score for choices that show Filipino values
          if (response.discType === 'S' && (context === 'FAMILY' || context === 'SOCIAL')) return score + 1.5; // Steadiness in family/social
          if (response.discType === 'I' && context === 'SOCIAL') return score + 1.3; // Influence in social
          if (response.discType === 'D' && (context === 'WORK' || context === 'CRISIS')) return score + 1.2; // Dominance in work/crisis
          if (response.discType === 'C' && context === 'MONEY') return score + 1.1; // Conscientiousness in money
          return score + 1; // Base score for any response
        }, 0);
        
        return culturalScore / contextResponses.length;
      });
      
      const averageCulturalScore = contextScores.reduce((sum, score) => sum + score, 0) / contextScores.length;
      return Math.min(95, Math.max(60, Math.round(averageCulturalScore * 20))); // Scale to 60-95%
    };

    const results = {
      primaryType,
        secondaryType,
      scores: percentages,
        confidence: Math.min(95, 70 + (Math.max(...Object.values(percentages)) - Math.min(...Object.values(percentages)))),
        culturalAlignment: calculateCulturalAlignment(),
        authenticity: 90 // High for demo purposes
    };

      // Calculate final XP bonus using the same formula as database
      const durationSeconds = Math.floor((Date.now() - (gameState.sessionStartTime?.getTime() || Date.now())) / 1000);
      const completionBonusXP = Math.round(
        (results.confidence * 2) + 
        (results.culturalAlignment * 1.5) + 
        (gameState.responses.length * 5) +
        (durationSeconds < 600 ? 50 : 0) // Speed bonus for under 10 minutes
      );
      
      // Calculate badges using same logic as database
      const finalBadges = results.confidence >= 85 ? ['High Confidence Achievement'] : [];
      
      // Update XP and badges with final values
      setGameState(prev => ({
        ...prev,
        xpPoints: completionBonusXP, // Set to final calculated XP (not accumulative)
        achievements: finalBadges // Set to final badges
      }));
      
      console.log('🎯 Final XP calculated:', completionBonusXP, 'points');
      console.log('📊 XP Breakdown:', {
        confidenceXP: results.confidence * 2,
        culturalXP: results.culturalAlignment * 1.5,
        questionXP: gameState.responses.length * 5,
        speedBonus: durationSeconds < 600 ? 50 : 0,
        duration: `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`,
        badges: finalBadges.length
      });

      // Generate AI assessment and BPO roles - WAIT for both to complete and capture results
      console.log('🤖 Starting AI analysis...');
      const [generatedAssessment, generatedBpoRoles] = await Promise.all([
        generateAIAssessment(results, gameState.responses),
        generateAIBpoRoles(results, gameState.responses)
      ]);
      console.log('✅ AI analysis completed');
      console.log('📝 Generated AI Assessment:', generatedAssessment.length, 'characters');
      console.log('💼 Generated BPO Roles:', generatedBpoRoles.length, 'roles');

    setDiscResult(results);
      setShowSpiritReveal(false);
    setShowResults(true);
    
    // Stop music when results are shown
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }

      // Save complete session to database (AI data should now be available)
      console.log('💾 Saving complete DISC session to database');
      console.log('🔑 User info:', { id: user?.id, email: user?.email });
      console.log('📊 Session data:', {
        responses: gameState.responses.length,
        scores: gameState.scores,
        hasAiAssessment: !!generatedAssessment,
        aiAssessmentLength: generatedAssessment?.length || 0,
        hasBpoRoles: !!generatedBpoRoles && generatedBpoRoles.length > 0,
        bpoRolesCount: generatedBpoRoles?.length || 0,
        bpoRolesPreview: generatedBpoRoles?.slice(0, 2).map(r => r?.title) || []
      });
      
      try {
        console.log('📤 Sending AI data to database:', {
          aiAssessmentPreview: generatedAssessment?.substring(0, 100) + '...',
          bpoRolesData: generatedBpoRoles
        });
        
        const response = await fetch('/api/games/disc/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || 'no-token'}`
          },
          body: JSON.stringify({
						sessionStartTime: gameState.sessionStartTime,
            sessionData: {
							totalResponses: gameState.responses.length,
							completionTime: Math.floor((Date.now() - (gameState.sessionStartTime?.getTime() || Date.now())) / 1000),
							culturalContexts: ['FAMILY', 'WORK', 'SOCIAL', 'TRAFFIC', 'MONEY', 'CRISIS'],
							personalizedQuestionsUsed: gameState.personalizedQuestions.length
            },
            coreResponses: gameState.responses.slice(0, 30),
            coreScores: gameState.scores,
            personalizedResponses: gameState.responses.slice(30),
            personalizedQuestions: gameState.personalizedQuestions,
						finalResults: results,
						aiAssessment: generatedAssessment,
						aiBpoRoles: generatedBpoRoles,
						userContext: {
							position: user?.user_metadata?.position || user?.user_metadata?.current_position,
							location: user?.user_metadata?.location,
							bio: user?.user_metadata?.bio
            }
          })
        });
        
        console.log('🌐 API Response status:', response.status);
        const responseData = await response.json();
        console.log('📋 API Response data:', responseData);
        
        if (response.ok) {
        console.log('✅ DISC session saved successfully');
        // Prefer latest session XP so UI matches disc_personality_stats.latest_session_xp
        const apiLatestXp = responseData?.totals?.latest_session_xp;
        const apiBadges = responseData?.totals?.badges_earned;
        if (typeof apiLatestXp === 'number' || typeof apiBadges === 'number') {
          setGameState(prev => ({
            ...prev,
            xpPoints: typeof apiLatestXp === 'number' ? apiLatestXp : prev.xpPoints,
            achievements: typeof apiBadges === 'number' ? new Array(Math.max(0, apiBadges)).fill('') : prev.achievements
          }));
        }
        } else {
          console.error('❌ API returned error:', responseData);
        }
      } catch (error) {
        console.error('❌ Failed to save DISC session:', error);
        console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      }
    }, 5000);
  };

  const resetGame = () => {
    // Stop any playing music
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    setIsMusicPlaying(false);
    
    setGameState({
      currentQuestion: 0,
      scores: { D: 0, I: 0, S: 0, C: 0 },
      gameStarted: false,
      gameCompleted: false,
      xpPoints: 0,
      badges: [],
      achievements: [],
      streak: 0,
      combo: 0,
      lastAnswer: '',
      sessionStartTime: null,
      userProfile: null,
		responses: [],
		personalizedQuestions: [],
		showPersonalized: false,
		isGeneratingPersonalized: false
    });
    setSelectedOption(null);
    setShowResults(false);
    setDiscResult(null);
    setShowReaction(null);
  };


  // Show Spirit Reveal modal
  if (showSpiritReveal) {
    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        <Header />
        <div className="pt-16 relative z-10 flex items-center justify-center min-h-screen">
          <Card className="disc-game-screen max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="flex justify-center">
                  <PacmanLoader 
                    color="#fbbf24" 
                    size={60}
                    margin={4}
                    speedMultiplier={1.2}
                  />
                </div>
              </div>
              
              <motion.div
                key={revealStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-3xl font-bold gradient-text mb-6">
                  {revealStep === 0 && "The ancient spirits have been watching..."}
                  {revealStep === 1 && "Your choices have awakened a power within..."}
                  {revealStep === 2 && "Your true nature is about to be revealed..."}
                </h2>
              </motion.div>
              
              <div className="flex justify-center gap-8 mb-8">
                {[
                  { emoji: '🦅', score: gameState.scores.D, color: 'text-red-400' },
                  { emoji: '🦚', score: gameState.scores.I, color: 'text-yellow-400' },
                  { emoji: '🐢', score: gameState.scores.S, color: 'text-green-400' },
                  { emoji: '🦉', score: gameState.scores.C, color: 'text-blue-400' }
                ].map((spirit, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <div className="text-4xl mb-2">{spirit.emoji}</div>
                    <div className={`text-xl font-bold ${spirit.color}`}>{spirit.score}</div>
                  </motion.div>
                ))}
              </div>
              
              <p className="text-gray-300 text-lg">
                The spirits are converging... Your destiny awaits...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading screen for personalized question generation
  if (gameState.isGeneratingPersonalized) {
    return (
			<div className="min-h-screen cyber-grid pb-40">
        <Header />
        <div className="pt-16 relative z-10 flex items-center justify-center min-h-screen">
          <Card className="disc-game-screen max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="flex justify-center">
                  <PacmanLoader 
                    color="#fbbf24" 
                    size={60}
                    margin={4}
                    speedMultiplier={1.2}
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-4">
                🤖 AI Analyzing Your Personality, {user?.user_metadata?.first_name || 'Player'}...
              </h2>
              <p className="text-gray-300 mb-4">
                Claude AI is creating 5 personalized questions based on your unique Filipino cultural patterns and response style using your real profile data from {user?.user_metadata?.location || 'your location'}.
              </p>
              <div className="disc-progress-bar mb-4">
                <motion.div 
                  className="disc-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
              <p className="text-sm text-gray-400">
                This will make your results impossible to fake and perfectly personalized to your life! ✨
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults && discResult) {
    // Stop music when reaching results
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    
    const personalityType = ANIMAL_PERSONALITIES[discResult.primaryType as keyof typeof ANIMAL_PERSONALITIES];

    return (
			<div className="min-h-screen cyber-grid pb-40">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Header />
        
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-6xl">{personalityType.animal.split(' ')[0]}</div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    You are {personalityType.animal}!
                  </h1>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">{personalityType.title}</h2>
                <p className="text-gray-300 text-lg">{personalityType.description}</p>
                </div>
                
              {/* Results Cards */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Game Stats */}
                <Card className="disc-game-screen">
                  <CardHeader>
                    <CardTitle className="text-white">🏆 Your Achievement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-400">{gameState.xpPoints}</div>
                        <div className="text-sm text-gray-400">Session XP</div>
                    </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{gameState.achievements.length}</div>
                        <div className="text-sm text-gray-400">Badges</div>
                  </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">{discResult.confidence}%</div>
                        <div className="text-sm text-gray-400">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">{Math.round(discResult.culturalAlignment)}%</div>
                        <div className="text-sm text-gray-400">Cultural Match</div>
                      </div>
                  </div>
                  </CardContent>
                </Card>
                </div>

              {/* Detailed Personality Explanation */}
              <Card className="disc-game-screen mb-8">
                <CardHeader>
                  <CardTitle className="text-white">🧬 Understanding Your {personalityType.animal} Nature</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">Your Core Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAssessment && aiAssessment.includes('CORE TRAITS:') ? (
                        // Extract AI-generated core traits
                        aiAssessment
                          .split('CORE TRAITS:')[1]
                          ?.split('CULTURAL STRENGTHS:')[0]
                          ?.split('\n')
                          .filter(line => line.trim() && !line.includes('CULTURAL STRENGTHS'))
                          .map((trait, index) => {
                            // Fix common hyphenation issues
                            let fixedTrait = trait.trim().replace(/^[-•]\s*/, '');
                            fixedTrait = fixedTrait
                              .replace(/Actionoriented/g, 'Action-oriented')
                              .replace(/Relationshipconscious/g, 'Relationship-conscious')
                              .replace(/Strategicrelationship/g, 'Strategic relationship')
                              .replace(/Adaptablecommunicator/g, 'Adaptable communicator');
                            
                            return (
                              <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                                {fixedTrait}
                              </span>
                            );
                          })
                      ) : (
                        // Fallback to hardcoded traits
                        personalityType.traits.map((trait, index) => (
                          <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                            {trait}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Your Cultural Strengths</h4>
                    <div className="text-gray-300">
                      {aiAssessment && aiAssessment.includes('CULTURAL STRENGTHS:') ? (
                        (() => {
                          // Extract the cultural strengths section
                          const culturalSection = aiAssessment
                            .split('CULTURAL STRENGTHS:')[1]
                            ?.split('ANIMAL PERSONALITY ANALYSIS')[0] // Remove animal personality analysis section
                            ?.trim();
                          
                          if (culturalSection) {
                            // Clean up the content and display as bullet points
                            const cleanCultural = culturalSection
                              .replace(/^[^:]*:\s*/, '') // Remove everything before the first colon
                              .trim();
                            
                            // Split by numbered items or bullet points and display each as a separate line
                            // Handle both numbered format (1. 2. 3.) and bullet points (- • *)
                            const bulletPoints = cleanCultural
                              .split(/(?<=^|\n)\s*(?:\d+\.\s*|[-•*]\s+)/)
                              .map((point: string) => point.trim())
                              .filter((point: string) => point.length > 0);
                            
                            return (
                              <div className="space-y-3">
                                {bulletPoints.map((point: string, bulletIndex: number) => (
                                  <div key={bulletIndex} className="flex items-start gap-3">
                                    <span className="text-purple-400 mt-1 flex-shrink-0">-</span>
                                    <span 
                                      className="text-gray-300 leading-relaxed"
                                      dangerouslySetInnerHTML={{
                                        __html: point
                                          .replace(/\b(pakikisama|malasakit|bayanihan|kapwa|utang na loob|hiya|pagkamatiyaga|tiyaga|husay at tiyaga|tapang at tiyaga)\b/gi, 
                                            '<span class="text-purple-400 font-semibold">$1</span>')
                                          .replace(/\b(ability to get along|genuine care|community spirit|shared identity|debt of gratitude|sense of shame|relating to others|patience|perseverance|excellence and perseverance|courage and perseverance)\b/gi, 
                                            '<span class="text-pink-400 font-medium">$1</span>')
                                          .replace(/\b(Filipino|cultural|values|tradition|heritage|workplace)\b/gi, 
                                            '<span class="text-yellow-400 font-medium">$1</span>')
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          
                          // Fallback if no specific cultural strengths found
                          return 'Your Filipino cultural strengths are being analyzed.';
                        })()
                      ) : (
                        // Fallback to hardcoded cultural strengths
                        <div className="space-y-3">
                          {personalityType.title === "The Sky Dominator" && (
                            <div className="flex items-start gap-3">
                              <span className="text-purple-400 mt-1 flex-shrink-0">-</span>
                              <span className="text-gray-300 leading-relaxed">
                                You're the natural <span className="text-purple-400 font-semibold">tagapamuno</span> who takes charge during challenges. Your <span className="text-yellow-400 font-medium">diskarte</span> mentality helps you find solutions where others see obstacles.
                              </span>
                            </div>
                          )}
                          {personalityType.title === "The Social Star" && (
                            <div className="flex items-start gap-3">
                              <span className="text-purple-400 mt-1 flex-shrink-0">-</span>
                              <span className="text-gray-300 leading-relaxed">
                                You embody the spirit of <span className="text-purple-400 font-semibold">pakikipagkapwa</span> - connecting with others naturally. Your warmth and enthusiasm make you perfect for building relationships in any setting.
                              </span>
                            </div>
                          )}
                          {personalityType.title === "The Steady Guardian" && (
                            <div className="flex items-start gap-3">
                              <span className="text-purple-400 mt-1 flex-shrink-0">-</span>
                              <span className="text-gray-300 leading-relaxed">
                                You represent the value of <span className="text-purple-400 font-semibold">malasakit</span> - caring for others consistently. Your reliability and patience make you the foundation that teams depend on.
                              </span>
                            </div>
                          )}
                          {personalityType.title === "The Wise Analyst" && (
                            <div className="flex items-start gap-3">
                              <span className="text-purple-400 mt-1 flex-shrink-0">-</span>
                              <span className="text-gray-300 leading-relaxed">
                                You reflect the trait of being <span className="text-purple-400 font-semibold">matalino</span> - not just smart, but wise. Your attention to detail and systematic approach ensures quality in everything you do.
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>


				{/* AI Assessment Section - Show loading or content */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-purple-400" />
              <h4 className="text-xl font-semibold text-purple-300">🧠 AI Personal Assessment</h4>
						{isGeneratingAIAssessment && (
							<div className="flex items-center gap-2 ml-auto">
								<PacmanLoader 
									color="#a855f7" 
									size={16}
									margin={2}
									speedMultiplier={1.2}
								/>
								<span className="text-xs text-purple-300">Analyzing...</span>
							</div>
						)}
            </div>
            
					{isGeneratingAIAssessment ? (
						<div className="text-center py-8">
							<div className="flex justify-center mb-4">
								<PacmanLoader 
									color="#a855f7" 
									size={48}
									margin={4}
									speedMultiplier={1.2}
								/>
							</div>
							<p className="text-purple-300 text-lg font-medium">AI is analyzing your personality...</p>
							<p className="text-gray-400 text-sm mt-2">Examining your response patterns and cultural alignment</p>
						</div>
					) : typeof aiAssessment === 'string' ? (
						<>
            {/* Visual Response Pattern Analysis */}
            <div className="mb-6 p-4 bg-black/20 rounded-lg">
              <h5 className="text-sm font-semibold text-cyan-300 mb-3">📊 Response Pattern Analysis</h5>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-gray-400">Total Responses Analyzed</div>
                  <div className="text-2xl font-bold text-white">{gameState.responses.length}</div>
                </div>
                <div>
                  <div className="text-gray-400">Average Response Time</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(gameState.responses.reduce((sum, r) => sum + (r.responseTime || 0), 0) / gameState.responses.length / 1000)}s
                  </div>
                </div>
              </div>
            </div>

            {/* DISC Score Visualization */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-cyan-300 mb-3">🎯 Personality Breakdown</h5>
              
              {/* Circular Progress Rings */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {[
                  { type: 'D', label: 'Dominance', color: 'text-red-400', bgColor: 'stroke-red-500', score: discResult.scores.D, emoji: '🦅' },
                  { type: 'I', label: 'Influence', color: 'text-yellow-400', bgColor: 'stroke-yellow-500', score: discResult.scores.I, emoji: '🦚' },
                  { type: 'S', label: 'Steadiness', color: 'text-green-400', bgColor: 'stroke-green-500', score: discResult.scores.S, emoji: '🐢' },
                  { type: 'C', label: 'Conscientiousness', color: 'text-blue-400', bgColor: 'stroke-blue-500', score: discResult.scores.C, emoji: '🦉' }
                ].map(item => {
                  const circumference = 2 * Math.PI * 35;
                  const strokeDasharray = `${(item.score / 100) * circumference} ${circumference}`;
                  
                  return (
                    <div key={item.type} className="flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-2">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="6"
                            fill="none"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            className={item.bgColor}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                            style={{
                              transition: 'stroke-dasharray 1s ease-in-out',
                              filter: 'drop-shadow(0 0 6px currentColor)'
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                            <div className="text-2xl">{item.emoji}</div>
                            <div className={`text-xs font-bold ${item.color}`}>{item.score}%</div>
                      </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white text-sm">{item.label}</div>
                        <div className="text-lg font-bold text-gray-300">{item.type}</div>
                      </div>
                  </div>
                  );
                })}
                </div>

              {/* Bar Chart Alternative */}
              <div className="space-y-3">
                {[
                  { type: 'D', label: 'Dominance', color: 'bg-red-500', score: discResult.scores.D },
                  { type: 'I', label: 'Influence', color: 'bg-yellow-500', score: discResult.scores.I },
                  { type: 'S', label: 'Steadiness', color: 'bg-green-500', score: discResult.scores.S },
                  { type: 'C', label: 'Conscientiousness', color: 'bg-blue-500', score: discResult.scores.C }
                ].map(item => (
                  <div key={item.type} className="flex items-center gap-3">
                    <div className="w-8 text-center font-bold">{item.type}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.score}%` }}
                            />
                          </div>
                    <div className="w-12 text-right text-sm font-semibold">
                      {item.score}%
                    </div>
                    <div className="w-24 text-xs text-gray-400">
                      {item.label}
                    </div>
                  </div>
                ))}
                  </div>
                </div>
                
            {/* Response Speed Analysis */}
            <div className="mb-6 p-4 bg-black/20 rounded-lg">
              <h5 className="text-sm font-semibold text-cyan-300 mb-3">⚡ Decision Speed Insights</h5>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-gray-400">Fastest Response</div>
                  <div className="text-lg font-bold text-green-400">
                    {Math.min(...gameState.responses.map(r => r.responseTime || 0)) / 1000}s
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Longest Response</div>
                  <div className="text-lg font-bold text-orange-400">
                    {Math.max(...gameState.responses.map(r => r.responseTime || 0)) / 1000}s
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Text */}
            <div className="bg-black/30 rounded-lg p-4">
              <button
                onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
                className="flex items-center justify-between w-full text-left mb-3 hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
              >
                <h5 className="text-sm font-semibold text-purple-300">🔮 Deep Personality Insights</h5>
                <ChevronDown 
                  className={`h-4 w-4 text-purple-300 transition-transform duration-200 ${
                    isInsightsExpanded ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
               {isInsightsExpanded && (
                 <div className="text-gray-300 leading-relaxed text-sm space-y-3">
                   {aiAssessment.split('\n\n').filter((paragraph: string) => {
                     // Filter out CORE TRAITS and CULTURAL STRENGTHS sections
                     return !paragraph.toLowerCase().includes('core traits:') && 
                            !paragraph.toLowerCase().includes('cultural strengths:');
                   }).map((paragraph: string, index: number) => {
                     // Enhanced animal personality analysis logic (copied from profile page)
                     const isAnimalAnalysis = paragraph.toLowerCase().includes('personality analysis') || 
                                            paragraph.toLowerCase().includes('owl personality') ||
                                            paragraph.toLowerCase().includes('eagle personality') ||
                                            paragraph.toLowerCase().includes('peacock personality') ||
                                            paragraph.toLowerCase().includes('turtle personality') ||
                                            paragraph.toLowerCase().includes('animal personality reason');
                     
                     if (isAnimalAnalysis) {
                       // Get the user's primary type and animal data
                       const userPrimaryType = discResult.primaryType;
                       const personalityType = ANIMAL_PERSONALITIES[userPrimaryType as keyof typeof ANIMAL_PERSONALITIES];
                       const animalName = personalityType.animal.replace(/[🦅🦚🐢🦉]/g, '').trim();
                       
                       // Create animal mapping for fallback content generation
                       const animalMap = {
                         'D': { emoji: '🦅', name: 'EAGLE', traits: 'leadership instincts and decisive nature' },
                         'I': { emoji: '🦚', name: 'PEACOCK', traits: 'social influence and team-building abilities' },
                         'S': { emoji: '🐢', name: 'TURTLE', traits: 'reliability and steady support' },
                         'C': { emoji: '🦉', name: 'OWL', traits: 'analytical thinking and systematic approach' }
                       };
                       
                       let userAnimalData = animalMap[userPrimaryType as keyof typeof animalMap] || animalMap['D'];
                       let userAnimalName = userAnimalData.name;
                       let userAnimalTraits = userAnimalData.traits;
                       
                       // Try to extract the actual AI assessment content from the full assessment
                       let animalContent = '';
                       
                       // Look for the ANIMAL PERSONALITY REASON section specifically
                       let animalReasonParagraph = aiAssessment.split('\n\n').find((paragraph: string) => 
                         paragraph.toLowerCase().includes('animal personality reason')
                       );
                       
                       if (animalReasonParagraph) {
                         // Extract the content after the section title
                         const reasonContent = animalReasonParagraph
                           .split(/animal personality reason[:\s]*/i)[1]
                           ?.trim();
                         
                         if (reasonContent) {
                           // Parse bullet points from the database content
                           const bulletPoints = reasonContent
                             .split('\n')
                             .map((line: string) => line.trim())
                             .filter((line: string) => line && line.startsWith('•'))
                             .map((line: string) => line.replace(/^•\s*/, '').trim())
                             .filter((line: string) => line.length > 0);
                           
                           if (bulletPoints.length > 0) {
                             animalContent = bulletPoints.join('\n');
                           } else {
                             animalContent = reasonContent;
                           }
                         }
                       }
                       
                       // If not found, try alternative patterns
                       let alternativeParagraph = null;
                       if (!animalContent || animalContent.length < 10) {
                         // Try to find any paragraph that contains animal personality analysis
                         alternativeParagraph = aiAssessment.split('\n\n').find((paragraph: string) => {
                           const lowerParagraph = paragraph.toLowerCase();
                           return (lowerParagraph.includes('animal personality') && 
                                   (lowerParagraph.includes('analysis') || 
                                    lowerParagraph.includes('reason') ||
                                    lowerParagraph.includes('instincts'))) ||
                                  (lowerParagraph.includes('eagle') && lowerParagraph.includes('personality')) ||
                                  (lowerParagraph.includes('peacock') && lowerParagraph.includes('personality')) ||
                                  (lowerParagraph.includes('turtle') && lowerParagraph.includes('personality')) ||
                                  (lowerParagraph.includes('owl') && lowerParagraph.includes('personality'));
                         });
                         
                         if (alternativeParagraph) {
                           // Extract content after any animal personality header
                           const content = alternativeParagraph
                             .split(/animal personality[:\s]*/i)[1] ||
                             alternativeParagraph
                             .split(/personality[:\s]*/i)[1] ||
                             alternativeParagraph;
                           
                           if (content && content.trim().length > 10) {
                             animalContent = content.trim();
                           }
                         }
                       }
                       
                       // Final fallback: Look for specific animal name in assessment
                       if (!animalContent || animalContent.length < 10) {
                         // Try to find content that mentions the specific animal
                         const animalSpecificParagraph = aiAssessment.split('\n\n').find((paragraph: string) => {
                           const lowerParagraph = paragraph.toLowerCase();
                           const animalLower = userAnimalName.toLowerCase();
                           return lowerParagraph.includes(animalLower) && 
                                  (lowerParagraph.includes('personality') || 
                                   lowerParagraph.includes('instincts') ||
                                   lowerParagraph.includes('natural'));
                         });
                         
                         if (animalSpecificParagraph) {
                           // Extract content after the animal name
                           const content = animalSpecificParagraph
                             .split(new RegExp(`${userAnimalName}[:\s]*`, 'i'))[1] ||
                             animalSpecificParagraph;
                           
                           if (content && content.trim().length > 10) {
                             animalContent = content.trim();
                           }
                         }
                       }
                       
                       // Final fallback: Generate correct animal personality reason if database content not found
                       if (!animalContent || animalContent.length < 10) {
                         const userName = 'you';
                         animalContent = `• Like the ${userAnimalName}'s natural instincts, ${userName} demonstrate ${userAnimalTraits} in your decision-making patterns
• The ${userAnimalName} personality reflects ${userName}'s authentic approach to challenges and social interactions
• This ${userPrimaryType === 'D' ? 'dominance' : userPrimaryType === 'I' ? 'influence' : userPrimaryType === 'S' ? 'steadiness' : 'conscientiousness'}-dominant profile shows how ${userName} naturally navigate professional and personal situations`;
                       }
                       
                       // Clean up the content
                       const cleanAnimal = animalContent.trim();
                       
                       if (cleanAnimal && cleanAnimal.length > 10) {
                         return (
                           <div key={index} className="space-y-2">
                             <h4 className="text-lg font-semibold text-purple-300 mb-3">
                               ANIMAL PERSONALITY ({userAnimalName}) ANALYSIS:
                             </h4>
                             <div className="space-y-4">
                               {cleanAnimal
                                 .split('\n')
                                 .filter((line: string) => {
                                   const trimmed = line.trim();
                                   // Filter out header lines that might be redundant
                                   return trimmed && 
                                          !trimmed.toLowerCase().includes('animal personality reason') &&
                                          !trimmed.toLowerCase().includes('animal personality -') &&
                                          !trimmed.toLowerCase().includes('personality analysis') &&
                                          !trimmed.match(/^[A-Z\s]+:$/); // Filter out lines that are just headers like "ANIMAL PERSONALITY REASON:"
                                 })
                                 .map((point: string, bulletIndex: number) => (
                                   <div key={bulletIndex} className="flex items-start gap-2 mb-6">
                                     <span className="text-purple-400 mt-1">•</span>
                                     <span className="text-gray-300 leading-relaxed">{point.replace(/^•\s*/, '')}</span>
                                   </div>
                                 ))}
                             </div>
                           </div>
                         );
                       }
                       
                       // If no meaningful content after cleaning, don't display
                       return null;
                     }
                     
                     // Highlight important phrases within the paragraph
                     const highlightText = (text: string) => {
                       return text
                         .replace(/\b(strengths?|blind spots?|growth|recommendations?|patterns?|response|critical|essential|important|key|should|must|need to)\b/gi, 
                           '<span class="text-cyan-400 font-semibold">$1</span>')
                         .replace(/\b(dominance|influence|steadiness|conscientiousness)\b/gi, 
                           '<span class="text-purple-400 font-medium">$1</span>')
                         .replace(/\b(filipino|bpo|workplace|culture|cultural)\b/gi, 
                           '<span class="text-yellow-400 font-medium">$1</span>');
                     };
                     
                     return (
                       <div key={index} dangerouslySetInnerHTML={{ 
                         __html: highlightText(paragraph)
                           .replace(/•\s*/g, '<div class="mb-4">• ') // Add spacing after each bullet
                           .replace(/\n\n/g, '</div><div class="mb-4">') // Add paragraph spacing
                           .replace(/^/, '<div class="mb-4">') // Start with div
                           .replace(/$/, '</div>') // End with div
                       }} />
                     );
                   })}
                 </div>
               )}
            </div>
						</>
					) : (
						<div className="text-center py-6">
							<p className="text-gray-400">AI assessment will appear here once generated.</p>
                  </div>
                )}
				</div>
                </CardContent>
              </Card>

              {/* AI-Powered BPO Career Insights */}
              <Card className="disc-game-screen mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                  <CardTitle className="text-white">💼 Perfect BPO Roles for You</CardTitle>
                    {isGeneratingBpoRoles && (
                      <div className="flex items-center gap-2">
                        <PacmanLoader 
                          color="#06b6d4" 
                          size={16}
                          margin={2}
                          speedMultiplier={1.2}
                        />
                        <span className="text-xs text-cyan-300">AI Analyzing...</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isGeneratingBpoRoles ? (
                    <div className="text-center py-8">
                      <div className="flex justify-center mb-4">
                        <PacmanLoader 
                          color="#06b6d4" 
                          size={48}
                          margin={4}
                          speedMultiplier={1.2}
                        />
                      </div>
                      <p className="text-cyan-300 text-lg font-medium">AI is finding your perfect BPO roles...</p>
                      <p className="text-gray-400 text-sm mt-2">Analyzing your personality against {user?.user_metadata?.position || 'your background'}</p>
                    </div>
                  ) : aiBpoRoles && aiBpoRoles.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiBpoRoles.map((role: any, index: number) => (
                          <div key={index} className="bg-white/5 rounded-lg overflow-hidden">
                            <div 
                              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/10 transition-colors"
                              onClick={() => toggleRoleExplanation(index)}
                            >
                              <Briefcase className="h-5 w-5 text-cyan-400" />
                              <span className="text-white flex-1">{role.title}</span>
                              <ChevronDown 
                                className={`h-4 w-4 text-cyan-400 transition-transform ${
                                  expandedRoles.has(index) ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                            {expandedRoles.has(index) && role.explanation && (
                              <div className="px-3 pb-3">
                                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <span className="text-cyan-400 text-sm">💡</span>
                                    <p className="text-cyan-200 text-sm leading-relaxed">
                                      {role.explanation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Fallback to default roles
                    <div className="space-y-4">
                      <div className="text-sm text-gray-400 mb-4">Based on your {personalityType.animal} personality:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalityType.bpoRoles.map((role, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Briefcase className="h-5 w-5 text-cyan-400" />
                        <span className="text-white">{role}</span>
                          </div>
                      ))}
                    </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => {
                    stopPreview();
                    router.push('/career-tools/games');
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg w-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      // Create a results-only shareable link
                      const resultsData = {
                        game: 'BPOC DISC Personality',
                        personalityType: personalityType.animal,
                        animal: personalityType.animal,
                        title: personalityType.title,
                        description: personalityType.description,
                        bpoRoles: personalityType.bpoRoles,
                        traits: personalityType.traits,
                        timestamp: new Date().toISOString()
                      };
                      
                      // Encode results in URL parameters
                      const encodedResults = encodeURIComponent(JSON.stringify(resultsData));
                      const shareableUrl = `${window.location.origin}/career-tools/games/disc-personality?results=${encodedResults}`;
                      
                      const shareText = `I'm a ${personalityType.animal}! ${personalityType.title} 🎯 Perfect for ${personalityType.bpoRoles[0]} roles! What's your BPO animal?\n\nView my results: ${shareableUrl}`;
                      
                      if (navigator.share) {
                        navigator.share({
                          title: 'My BPOC DISC Personality Results!',
                          text: shareText,
                          url: shareableUrl
                        });
                      } else {
                        // Fallback: copy to clipboard
                        await navigator.clipboard.writeText(shareText);
                        
                        // Show success feedback
                        const button = event?.target as HTMLButtonElement;
                        if (button) {
                          const originalText = button.innerHTML;
                          button.innerHTML = '<div class="flex items-center"><span class="w-4 h-4 mr-2">✓</span>Results Copied!</div>';
                          setTimeout(() => {
                            button.innerHTML = originalText;
                          }, 2000);
                        }
                      }
                    } catch (error) {
                      console.error('Failed to share results:', error);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Button
                  onClick={resetGame}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Take Again
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Demo interface removed - now using AlertDialog modal

  // Welcome screen
  if (!gameState.gameStarted) {
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
                <Button
                  variant="ghost"
                  onClick={() => {
                    stopPreview();
                    router.push('/career-tools/games');
                  }}
                  className="mr-6 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <div className="flex items-center">
                  <div className="relative">
                    <Brain className="h-16 w-16 text-purple-400 mr-6 animate-pulse" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">🧠</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      BPOC DISC
                    </h1>
                    <p className="text-gray-300 text-lg">🧠 Unlock your professional superpowers through engaging scenarios</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 bg-purple-500/20 rounded-full px-3 py-1">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-semibold">Personality Discovery</span>
                      </div>
                      <div className="flex items-center gap-2 bg-pink-500/20 rounded-full px-3 py-1">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-pink-300 text-sm font-semibold">Team Dynamics</span>
                      </div>
                      <div className="flex items-center gap-2 bg-cyan-500/20 rounded-full px-3 py-1">
                        <Trophy className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-300 text-sm font-semibold">Leadership Potential</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Big Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-16"
            >
              <motion.h1
                animate={{ 
                  backgroundImage: [
                    "linear-gradient(45deg, #a855f7, #ec4899, #06b6d4)",
                    "linear-gradient(45deg, #ec4899, #06b6d4, #a855f7)",
                    "linear-gradient(45deg, #06b6d4, #a855f7, #ec4899)",
                    "linear-gradient(45deg, #a855f7, #ec4899, #06b6d4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text mb-4"
                style={{ backgroundSize: "200% 200%" }}
              >
                BPOC DISC
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              >
                Discover your <span className="text-purple-400 font-bold">BPO animal spirit</span> through authentic workplace scenarios and unlock your communication superpowers!
              </motion.p>
              
              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                <div className="flex items-center gap-2 bg-purple-500/20 rounded-full px-4 py-2 border border-purple-500/30">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-sm font-semibold">AI-Powered Assessment</span>
                </div>
                <div className="flex items-center gap-2 bg-pink-500/20 rounded-full px-4 py-2 border border-pink-500/30">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-300 text-sm font-semibold">Authentic Scenarios</span>
                </div>
                <div className="flex items-center gap-2 bg-cyan-500/20 rounded-full px-4 py-2 border border-cyan-500/30">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300 text-sm font-semibold">Career Insights</span>
                </div>
              </motion.div>

               {/* Feature Icons */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.0 }}
                 className="flex justify-center gap-8 mb-12"
               >
                 <div className="glass-card p-6 rounded-xl text-center bg-cyan-500/10 border border-cyan-400/30">
                   <div className="text-4xl font-bold text-cyan-400 mb-2">AI</div>
                   <div className="text-gray-300 text-sm">Powered</div>
                 </div>
                 <div className="glass-card p-6 rounded-xl text-center bg-green-500/10 border border-green-400/30">
                   <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
                   <div className="text-gray-300 text-sm">Scenarios</div>
                 </div>
                 <div className="glass-card p-6 rounded-xl text-center bg-purple-500/10 border border-purple-400/30">
                   <div className="text-4xl font-bold text-purple-400 mb-2">6</div>
                   <div className="text-gray-300 text-sm">Contexts</div>
                 </div>
                 <div className="glass-card p-6 rounded-xl text-center bg-orange-500/10 border border-orange-400/30">
                   <div className="text-4xl font-bold text-orange-400 mb-2">🎵</div>
                   <div className="text-gray-300 text-sm">Music</div>
                 </div>
               </motion.div>
            </motion.div>

            {/* How to Play Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <Card className="glass-card border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">How to Play</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-400 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">🎯 Choose Your Scenario</h4>
                          <p className="text-gray-300 text-sm">Select from 4 different workplace scenarios that test your natural responses and decision-making style.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-400 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">🤔 Answer Honestly</h4>
                          <p className="text-gray-300 text-sm">Respond to each situation based on what you would naturally do, not what you think you should do.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-400 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">🎭 Discover Your Type</h4>
                          <p className="text-gray-300 text-sm">Get your personality type (Dominance, Influence, Steadiness, or Conscientiousness) and learn about your unique communication style.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-400 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">🚀 Unlock Your Potential</h4>
                          <p className="text-gray-300 text-sm">See which BPO roles match your personality and how to work better with different team members.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">💡 Pro Tip</h4>
                    </div>
                    <p className="text-purple-200 text-sm">There are no right or wrong answers! This assessment reveals your natural communication style and helps you understand how to work effectively with different personality types in the workplace.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interactive Game Setup */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 md:px-6">
              
              {/* What Makes Special */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="xl:col-span-2"
              >
                <Card className="glass-card border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      What Makes Special
                    </CardTitle>
                    <p className="text-gray-300">Discover the unique features that make this DISC assessment special</p>
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400 text-lg">💡</span>
                        <span className="text-blue-300 font-semibold">How it works:</span>
                      </div>
                      <p className="text-blue-200 text-sm">This assessment uses authentic Filipino scenarios, AI personalization, and BPO-focused insights to reveal your true personality type!</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg">🎯</span>
                            </div>
                            <div>
                              <h4 className="text-white font-bold">Filipino Context</h4>
                              <p className="text-purple-300 text-sm">Authentic scenarios</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">30 Filipino scenarios + 5 AI personalized questions using your real name and location</p>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg">🤖</span>
                            </div>
                            <div>
                              <h4 className="text-white font-bold">AI Powered</h4>
                              <p className="text-blue-300 text-sm">Personalized assessment</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">Claude AI creates custom questions using your profile data for maximum personalization</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg">💼</span>
                            </div>
                            <div>
                              <h4 className="text-white font-bold">BPO Career</h4>
                              <p className="text-green-300 text-sm">Role matching</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">Perfect role matches for Philippine call centers and BPO companies</p>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/30">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg">🎮</span>
                            </div>
                            <div>
                              <h4 className="text-white font-bold">Gamified</h4>
                              <p className="text-yellow-300 text-sm">XP & achievements</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">XP, achievements, streaks, and shareable results for engagement</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Audio of BPOC DISC */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="space-y-6"
              >
                <Card className="glass-card border-white/10 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🎵</span>
                      </div>
                      Music Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button
                        variant={musicLanguage === 'maledisc' ? 'default' : 'outline'}
                        onClick={() => setMusicLanguage('maledisc')}
                        className={`${musicLanguage === 'maledisc' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                          : 'border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/70'
                        } w-full h-16 transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="text-center relative z-10">
                          <div className="text-lg font-bold flex items-center justify-center gap-2">
                            <span className="text-xl">♂️</span>
                            Male Vocals
                          </div>
                          <div className="text-xs opacity-80">Who Are You</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => previewMusic('maledisc')}
                        disabled={isPreviewing}
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 disabled:opacity-50"
                      >
                        {isPreviewing && previewingGender === 'maledisc' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <span>Previewing... {previewCountdown}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>🎵</span>
                            <span>Preview (10s)</span>
                          </div>
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        variant={musicLanguage === 'femaledisc' ? 'default' : 'outline'}
                        onClick={() => setMusicLanguage('femaledisc')}
                        className={`${musicLanguage === 'femaledisc' 
                          ? 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white shadow-lg shadow-pink-500/30' 
                          : 'border-pink-500/50 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400/70'
                        } w-full h-16 transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="text-center relative z-10">
                          <div className="text-lg font-bold flex items-center justify-center gap-2">
                            <span className="text-xl">♀️</span>
                            Female Vocals
                          </div>
                          <div className="text-xs opacity-80">Sino Ka Ba</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => previewMusic('femaledisc')}
                        disabled={isPreviewing}
                        variant="outline"
                        size="sm"
                        className="w-full border-pink-500/30 text-pink-300 hover:bg-pink-500/10 disabled:opacity-50"
                      >
                        {isPreviewing && previewingGender === 'femaledisc' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                            <span>Previewing... {previewCountdown}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>🎵</span>
                            <span>Preview (10s)</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Start Playing */}
                <Card className="glass-card border-white/10 bg-gradient-to-br from-green-500/10 to-cyan-500/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                      Ready to Play?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        onClick={startGame}
                        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-bold text-lg py-4 h-14 shadow-xl shadow-purple-500/30 transition-all duration-500 hover:scale-105 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <Play className="w-5 h-5" />
                          <span>🚀 Discover My Filipino BPO Animal!</span>
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      </Button>
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game interface
  const ContextIcon = CONTEXT_ICONS[currentScenario?.context as keyof typeof CONTEXT_ICONS] || Brain;
  
  // Get current context colors
  const getContextColors = () => {
    const context = currentScenario?.context as keyof typeof CONTEXT_COLORS;
    // For personalized questions (questions 31-35), use PERSONAL context
    if (gameState.showPersonalized) {
      return CONTEXT_COLORS.PERSONAL;
    }
    return CONTEXT_COLORS[context] || CONTEXT_COLORS.FAMILY;
  };
  
  const contextColors = getContextColors();
  
  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Shared Results Display */}
      {showSharedResults && sharedResults && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{sharedResults.animal}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Shared Results</h2>
              <p className="text-gray-300">Someone shared their DISC personality results!</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {sharedResults.animal}
                </div>
                <div className="text-lg font-semibold text-white mb-2">
                  {sharedResults.title}
                </div>
                <div className="text-sm text-gray-300">
                  {sharedResults.description}
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm font-semibold text-green-400 mb-2">Perfect BPO Roles:</div>
                <div className="flex flex-wrap gap-2">
                  {sharedResults.bpoRoles.map((role: string, index: number) => (
                    <span key={index} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm font-semibold text-blue-400 mb-2">Key Traits:</div>
                <div className="flex flex-wrap gap-2">
                  {sharedResults.traits.map((trait: string, index: number) => (
                    <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-xs text-gray-400">
                  Completed: {new Date(sharedResults.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowSharedResults(false);
                  setSharedResults(null);
                  // Clear URL parameters
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowSharedResults(false);
                  setSharedResults(null);
                  setGameState(prev => ({ ...prev, gameStarted: false }));
                  // Clear URL parameters
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Take the Test!
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Header />
      
		<div className="pt-16 relative z-10 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-4 h-full">
          {/* Compact Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setShowExitDialog(true)}
                className="mr-4 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ContextIcon className="h-8 w-8 text-green-400 mr-3" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">BPOC DISC 🎯</h1>
                  <p className="text-gray-400 text-sm">{currentScenario?.context} Context</p>
                </div>
              </div>
              
            </div>
            
            {/* Music Controls */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={toggleMute}
                className="border-white/20 text-white hover:bg-white/10"
                title="Volume Control"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              {/* Volume Control */}
              {showVolumeControl && (
                <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2">
                  <span className="text-xs text-white">Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-xs text-white">{Math.round(volume * 100)}%</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Game Layout */}
          <div className="flex gap-4 h-[calc(100vh-140px)]">
            {/* Left Side - Progress and Stats */}
				<div className="w-1/3 h-full grid grid-rows-2 gap-4">
              {/* Filipino Personality Journey */}
              <Card className="disc-game-screen">
						<CardContent className="p-4 h-full flex flex-col">
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold text-cyan-300">🎯 Personality Journey</h3>
                      <div className="text-xs text-gray-400">Discovering Your Filipino Work Style</div>
                      </div>
                    
                    <div className="flex-1 space-y-3">
                      {/* Current Context */}
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Current Context</div>
                        <div className="text-sm font-semibold text-white">
                          {currentScenario?.context === 'FAMILY' ? '👨‍👩‍👧‍👦 Family Dynamics' :
                           currentScenario?.context === 'WORK' ? '💼 Professional Workplace' :
                           currentScenario?.context === 'SOCIAL' ? '🎉 Social Interactions' :
                           currentScenario?.context === 'TRAFFIC' ? '🚗 Traffic & Stress' :
                           currentScenario?.context === 'MONEY' ? '💰 Money & Values' :
                           currentScenario?.context === 'CRISIS' ? '⚡ Crisis Response' :
                           gameState.showPersonalized ? '🎯 Personal Challenges' : '🔮 Final Assessment'}
                      </div>
                      </div>

                      {/* Personality Emergence */}
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-2">Emerging Traits</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2 text-center">
                            <div className="text-purple-400 font-bold">{Math.round((gameState.scores.D / Math.max(gameState.currentQuestion + 1, 1)) * 100)}%</div>
                          </div>
                          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2 text-center">
                            <div className="text-purple-400 font-bold">{Math.round((gameState.scores.I / Math.max(gameState.currentQuestion + 1, 1)) * 100)}%</div>
                          </div>
                          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2 text-center">
                            <div className="text-purple-400 font-bold">{Math.round((gameState.scores.S / Math.max(gameState.currentQuestion + 1, 1)) * 100)}%</div>
                          </div>
                          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2 text-center">
                            <div className="text-purple-400 font-bold">{Math.round((gameState.scores.C / Math.max(gameState.currentQuestion + 1, 1)) * 100)}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Cultural Insight */}
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3">
                        <div className="text-xs text-cyan-300 mb-1">Filipino Values Focus</div>
                        <div className="text-xs text-gray-300">
                          {currentScenario?.context === 'FAMILY' ? 'Testing your "malasakit" (caring) in family situations' :
                           currentScenario?.context === 'WORK' ? 'Exploring "pakikipagkapwa" (shared identity) at work' :
                           currentScenario?.context === 'SOCIAL' ? 'Revealing your "pakikisama" (harmony) in social interactions' :
                           currentScenario?.context === 'TRAFFIC' ? 'Testing your "diskarte" (resourcefulness) under pressure' :
                           currentScenario?.context === 'MONEY' ? 'Exploring your "utang na loob" (debt of gratitude) and financial values' :
                           currentScenario?.context === 'CRISIS' ? 'Revealing your "bayanihan" (community spirit) in emergencies' :
                           gameState.showPersonalized ? 'Discovering your authentic Filipino leadership style' :
                           'Discovering your authentic Filipino leadership style'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

            {/* Spirit Stage */}
            <Card className="disc-game-screen">
						<CardContent className="p-4 h-full flex flex-col">
							<div className="text-center flex flex-col h-full">
								<div className="text-lg font-bold text-cyan-300 mb-3">🎭 Spirit Stage 🎭</div>
                  
                  {/* Main Character Stage - takes up remaining space */}
							<div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30 flex-1 flex items-center justify-center min-h-[200px]">
                    {selectedOption && showReaction && (
              <motion.div
                        key={`${gameState.currentQuestion}-${selectedOption}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1.5, 1], 
                          opacity: [0, 1, 1],
                          rotate: [0, 360, 0]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="text-center"
                      >
                        {/* Show the character based on DISC type, not choice ID */}
                        {(() => {
                          const currentChoice = shuffledOptions?.find(opt => opt.id === selectedOption);
                          const discType = currentChoice?.disc;
                          
                          if (discType === 'D') {
                            return (
                              <motion.div
                                animate={{ 
                                  y: [0, -20, 0],
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 0.8, repeat: 2 }}
                                className="text-9xl"
                                style={{ filter: 'drop-shadow(0 0 20px #ef4444)' }}
                              >
                                🦅
                              </motion.div>
                            );
                          } else if (discType === 'I') {
                            return (
                              <motion.div
                                animate={{ 
                                  rotate: [0, 15, -15, 0],
                                  scale: [1, 1.3, 1]
                                }}
                                transition={{ duration: 1, repeat: 2 }}
                                className="text-9xl"
                                style={{ filter: 'drop-shadow(0 0 20px #ffd23f)' }}
                              >
                                🦚
                              </motion.div>
                            );
                          } else if (discType === 'S') {
                            return (
                              <motion.div
                                animate={{ 
                                  x: [0, 10, -10, 0],
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 1.2, repeat: 2 }}
                                className="text-9xl"
                                style={{ filter: 'drop-shadow(0 0 20px #10b981)' }}
                              >
                                🐢
                              </motion.div>
                            );
                          } else if (discType === 'C') {
                            return (
                              <motion.div
                                animate={{ 
                                  rotate: [0, -20, 20, 0],
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 0.9, repeat: 2 }}
                                className="text-9xl"
                                style={{ filter: 'drop-shadow(0 0 20px #3b82f6)' }}
                              >
                                🦉
                              </motion.div>
                            );
                          }
                          return null;
                        })()}
                      </motion.div>
                    )}
                    
                    {/* Default state when no selection */}
                    {!selectedOption && (
								<div className="text-8xl opacity-30">🔮</div>
                    )}
                       </div>
                  
							<div className="text-center text-sm text-gray-400 mt-3 font-medium">
                    Question {gameState.currentQuestion + 1} of {totalQuestions}
                     </div>
                    </div>
                  </CardContent>
                </Card>

            </div>

            {/* Right Side - Main Game Content */}
				<div className="w-2/3 h-full">
              <motion.div
                key={gameState.currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <div className={`disc-game-screen h-full rounded-xl border ${contextColors.border} ${contextColors.containerBg} pt-2 pb-0 px-2 scenario-${currentScenario?.context.toLowerCase()} flex flex-col`}>
                  {/* Compact top header with progress */}
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <ContextIcon className="h-5 w-5 text-cyan-400" />
                      <span className={`px-2 py-0.5 rounded-full bg-white/5 border ${contextColors.border} ${contextColors.text} text-[10px] tracking-wide uppercase`}>
                        {gameState.showPersonalized ? 'PERSONAL' : currentScenario?.context}
                      </span>
                      </div>
                    <div className="flex-1">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-${contextColors.primary}-500 to-${contextColors.primary}-400`} style={{ width: `${progressPercent}%` }} />
                    </div>
                       </div>
                    <div className="text-[10px] text-gray-400 whitespace-nowrap">{gameState.currentQuestion + 1}/{totalQuestions}</div>
                     </div>

                  {/* Title */}
                  <h2 className="text-2xl font-extrabold text-center mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow">{currentScenario?.title}</h2>

                  {/* Scenario */}
                  <div className={`rounded-lg border ${contextColors.border} ${contextColors.bg} p-3 mb-1`}>
                    <p className="text-lg text-gray-200 leading-relaxed">{currentScenario?.scenario}</p>
                  </div>

                  {/* Choices grid - force 2x2 */}
                  <div className="grid grid-cols-1 gap-2 flex-1">
                    {shuffledOptions.map((choice, index) => {
                      return (
                        <motion.button
                          key={choice.id}
                          onClick={() => handleOptionSelect(choice.id, choice.disc, choice.reaction)}
                          disabled={selectedOption !== null}
                          className={`text-left transition-all rounded-lg border ${contextColors.border} ${contextColors.bg} ${selectedOption === choice.id ? `ring-2 ring-${contextColors.primary}-400 scale-[1.005]` : `hover:ring-1 hover:ring-${contextColors.primary}-400/50`} hover:translate-y-[-1px] hover:shadow-lg/30 backdrop-blur-sm`}
                          whileHover={{ scale: selectedOption === null ? 1.01 : 1 }}
                          whileTap={{ scale: 0.99 }}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="p-4 h-24 flex items-center">
                            <div className="text-white font-semibold leading-tight text-base flex items-center gap-2">
                              <span className="text-2xl">🔮</span>
                              {choice.text}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Popup */}
      <AnimatePresence>
      {showReaction && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowReaction(null)}
        >
          <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="disc-game-screen border-cyan-400/50 shadow-xl">
              <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">✨</div>
                <p className="text-xl font-semibold text-white">{showReaction}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Achievement Notification */}
      <AnimatePresence>
      {showAchievement && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 shadow-xl"
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-green-400 font-bold">Achievement Unlocked!</p>
              <p className="text-white text-sm">{showAchievement}</p>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>


      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-black border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave BPOC DISC Game?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Your progress will be lost if you leave now. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Continue Playing
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                stopPreview();
                router.push('/career-tools/games');
              }} 
              className="bg-red-600 hover:bg-red-700"
            >
              Exit Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resume Required Alert Dialog */}
      <AlertDialog open={showResumeRequiredModal} onOpenChange={setShowResumeRequiredModal}>
        <AlertDialogContent className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-3xl">📝</span>
              Resume Required
            </AlertDialogTitle>
            <div className="text-gray-300 text-base mt-4 space-y-3">
              <p>
                Before you can start playing <span className="text-cyan-400 font-semibold">BPOC DISC</span>, 
                you need to create your resume first!
              </p>
              <p className="text-sm text-gray-400">
                Creating a resume helps us personalize your gaming experience and generate 
                custom personality insights based on your career profile.
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div className="space-y-1">
                    <p className="text-cyan-400 font-semibold text-sm">Why create a resume?</p>
                    <ul className="text-xs text-gray-400 space-y-1 ml-1">
                      <li>• Get personalized game insights</li>
                      <li>• Unlock all game features</li>
                      <li>• Track your personality progress</li>
                      <li>• Stand out to recruiters</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 mt-6">
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              Maybe Later
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowResumeRequiredModal(false);
                router.push('/resume-builder');
              }}
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold border-0 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">🚀</span>
              Create Resume Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </div>
  );
}
