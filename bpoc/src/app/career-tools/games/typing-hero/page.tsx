'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  ArrowLeft,
  Guitar,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Zap,
  Target,
  Clock,
  Volume2,
  VolumeX,
  Lock,
  CheckCircle,
  Star,
  Share,
  Eye,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { storyGenerator, UserStoryProfile, GameProgressData, StoryChapter } from '@/lib/story-generator';
import { PacmanLoader } from 'react-spinners';

// Progressive Vocabulary by difficulty level (varying lengths and complexity)
// NEW: MUCH MORE VARIED AND INTELLIGENT VOCABULARY
const SMART_VOCABULARY = {
  // Phase 1: Simple assessment words
  baseline: {
    words: ['the', 'and', 'you', 'for', 'are', 'with', 'his', 'they', 'have', 'this', 'will', 'your', 'from', 'can', 'said', 'each', 'which', 'she', 'how', 'their', 'time', 'work', 'help', 'good', 'call', 'make', 'need', 'know', 'find', 'more'],
    speed: 0.6,
    spawnRate: 2000
  },
  
  // Phase 2: BPO basics
  bpo_basics: {
    words: ['assist', 'help', 'support', 'service', 'call', 'chat', 'email', 'ticket', 'issue', 'solve', 'fix', 'answer', 'respond', 'follow', 'update', 'check', 'verify', 'confirm', 'process', 'handle', 'manage', 'review', 'send', 'receive', 'forward', 'escalate', 'close', 'complete', 'track', 'monitor'],
    speed: 0.8,
    spawnRate: 1800
  },
  
  // Phase 3: Professional terms  
  professional: {
    words: ['customer', 'client', 'business', 'company', 'project', 'database', 'network', 'system', 'website', 'software', 'application', 'platform', 'interface', 'workflow', 'procedure', 'protocol', 'standard', 'quality', 'performance', 'efficiency', 'productivity', 'solution', 'strategy', 'implementation', 'optimization', 'analysis', 'reporting', 'documentation', 'training', 'development'],
    speed: 1.0,
    spawnRate: 1500
  }
};

// Progressive Chapter-Based Difficulty System
const getChapterDifficulty = (chapterNumber: number) => {
  // Chapter 1-2: Very Easy (Learning) - Let players get comfortable
  if (chapterNumber <= 2) {
    return {
      speed: 0.3, // Very slow falling speed
      spawnRate: 3500, // 3.5 seconds between words - very relaxed
      displayName: `📚 Chapter ${chapterNumber} (Learning)`,
      bpm: 70,
      difficultyLevel: 'learning'
    };
  }
  // Chapter 3-5: Easy (Building Confidence)  
  else if (chapterNumber <= 5) {
    return {
      speed: 0.4,
      spawnRate: 2800, // 2.8 seconds between words
      displayName: `🌱 Chapter ${chapterNumber} (Building)`,
      bpm: 85,
      difficultyLevel: 'building'
    };
  }
  // Chapter 6-10: Medium (Getting Comfortable)
  else if (chapterNumber <= 10) {
    return {
      speed: 0.5 + (chapterNumber - 6) * 0.05, // Gradually increase speed
      spawnRate: 2400 - (chapterNumber - 6) * 80, // Gradually decrease spawn time
      displayName: `🎯 Chapter ${chapterNumber} (Comfortable)`,
      bpm: 95 + (chapterNumber - 6) * 3,
      difficultyLevel: 'comfortable'
    };
  }
  // Chapter 11-20: Challenging (Pushing Limits)
  else if (chapterNumber <= 20) {
    return {
      speed: 0.7 + (chapterNumber - 11) * 0.03,
      spawnRate: 1800 - (chapterNumber - 11) * 30,
      displayName: `🚀 Chapter ${chapterNumber} (Challenging)`,
      bpm: 110 + (chapterNumber - 11) * 2,
      difficultyLevel: 'challenging'
    };
  }
  // Chapter 21+: Expert (Mastery)
  else {
    return {
      speed: 1.0 + Math.min((chapterNumber - 21) * 0.02, 0.5), // Cap at 1.5x speed
      spawnRate: Math.max(1200 - (chapterNumber - 21) * 20, 800), // Cap at 0.8 seconds
      displayName: `🏆 Chapter ${chapterNumber} (Mastery)`,
      bpm: Math.min(130 + (chapterNumber - 21) * 1, 160), // Cap at 160 BPM
      difficultyLevel: 'mastery'
    };
  }
};

const BPO_VOCABULARY = {
  rookie: {
    words: ['assist', 'create', 'design', 'develop', 'manage', 'support', 'service', 'project', 'website', 'database', 'network', 'system', 'client', 'customer', 'business', 'company', 'product', 'solution', 'problem', 'request', 'feedback', 'process', 'workflow', 'team work', 'data entry', 'web design', 'user guide', 'help desk', 'call center', 'email support'],
    speed: 0.5, // Start slow for rookie mode
    spawnRate: 2000, // Slower spawn rate for rookie mode
    displayName: '🎸 Rookie',
    bpm: 90 // Slower tempo for rookie
  },
  rockstar: {
    words: ['assist', 'create', 'design', 'develop', 'manage', 'support', 'service', 'project', 'website', 'database', 'network', 'system', 'client', 'customer', 'business', 'company', 'product', 'solution', 'problem', 'request', 'feedback', 'process', 'workflow', 'team work', 'data entry', 'web design', 'user guide', 'help desk', 'call center', 'email support'],
    speed: 0.7, // Medium speed
    spawnRate: 1800, // Medium spawn rate
    displayName: '🎤 Rockstar',
    bpm: 110 // Medium tempo for rockstar
  },
  virtuoso: {
    words: ['customer', 'service', 'support', 'billing', 'account', 'payment', 'problem', 'solution', 'request', 'feedback', 'process', 'system', 'update', 'manage', 'handle', 'call back', 'send email', 'fix issue', 'new task', 'team lead', 'data sync', 'user info', 'web page', 'file size', 'test mode', 'load time', 'sync data', 'copy text', 'push code', 'link site'],
    speed: 0.9, // Faster speed
    spawnRate: 1600, // Faster spawn rate
    displayName: '🎼 Virtuoso',
    bpm: 130 // Faster tempo for virtuoso
  },
  legend: {
    words: ['troubleshoot', 'escalation', 'resolution', 'representative', 'professional', 'assistance', 'communication', 'documentation', 'verification', 'authorization', 'schedule meeting', 'update system', 'process payment', 'customer feedback', 'technical support', 'quality assurance', 'data management', 'system integration', 'performance review', 'project timeline', 'client requirements', 'workflow automation', 'security protocols', 'backup procedures', 'error handling', 'user experience', 'database query', 'network config', 'server maintenance', 'code deployment'],
    speed: 1.2, // Fastest speed
    spawnRate: 1400, // Fastest spawn rate
    displayName: '🏆 Legend',
    bpm: 150 // Fastest tempo for legend
  }
};

type DifficultyLevel = 'rookie' | 'rockstar' | 'virtuoso' | 'legend';

interface FallingWord {
  id: string;
  word: string;
  lane: number;
  y: number;
  speed: number;
  typed: boolean;
  missed: boolean;
  sentenceIndex?: number; // Track which sentence this word belongs to
}

interface GameStats {
  score: number;
  fires: number;
  poos: number;
  combo: number;
  longestStreak: number;
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  charactersTyped: number;
  correctWords: number;
  totalWords: number;
}

interface DifficultyProgress {
  rookie: boolean;
  rockstar: boolean;
  virtuoso: boolean;
  legend: boolean;
}

export default function TypingHeroPage() {
  const router = useRouter();
  const { user } = useAuth();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null); // NEW: Dedicated music audio element
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // NEW: Shared results state
  const [sharedResults, setSharedResults] = useState<any>(null);
  const [showSharedResults, setShowSharedResults] = useState(false);
  
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
  
  // NEW: Music preference state
  const [musicGender, setMusicGender] = useState<'male' | 'female'>('male'); // Default to male
  
  // NEW: Audio preview state
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewingGender, setPreviewingGender] = useState<'male' | 'female' | null>(null);
  const [previewCountdown, setPreviewCountdown] = useState(0);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  
  // NEW: Volume control state
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volume, setVolume] = useState(0.6);
  
  // Custom song paths
  const CUSTOM_SONGS = {
    male: '/typing hero songs/male.mp3',
    female: '/typing hero songs/female.mp3'
  };
  
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'generating' | 'story-ready' | 'ready' | 'playing' | 'paused' | 'failed' | 'complete' | 'overwhelmed' | 'recovering' | 'chapter-transition'>('menu');
  const [recoveryCountdown, setRecoveryCountdown] = useState(5);
  const [recoveryGraceTime, setRecoveryGraceTime] = useState(0); // 30-second grace period after recovery
  const recoveryGraceRef = useRef(0); // Ref for accessing grace time in timer without causing re-renders
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('rockstar');
  const [stablePerformanceLevel, setStablePerformanceLevel] = useState<DifficultyLevel>('rockstar');
  const [difficultyProgress, setDifficultyProgress] = useState<DifficultyProgress>({
    rookie: false,
    rockstar: false,
    virtuoso: false,
    legend: false
  });
  const [showInputGuide, setShowInputGuide] = useState(false);
  const [isInitialStart, setIsInitialStart] = useState(true);
  
  // NEW: Complete Story System State
  const [completeStory, setCompleteStory] = useState<any>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [currentStory, setCurrentStory] = useState<StoryChapter | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedSentences, setCompletedSentences] = useState<string[]>([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [storyReady, setStoryReady] = useState(false);
  const [isChapterComplete, setIsChapterComplete] = useState(false);
  const isChapterCompleteRef = useRef(false);
  const [completedChapterNumber, setCompletedChapterNumber] = useState<number | null>(null);
  
  const [gameStats, setGameStats] = useState({
    score: 0,
    fires: 0,
    poos: 0,
    combo: 0,
    longestStreak: 0,
    wpm: 0,
    accuracy: 0,
    elapsedTime: 0,
    charactersTyped: 0,
    correctWords: 0,
    totalWords: 0,
    missedWords: 0,
    lastTypingTime: 0, // Track when user last typed
    // NEW: Advanced WPM tracking
    totalKeypresses: 0,
    burstWPM: 0,
    sustainedWPM: 0,
    realtimeWPM: 0,
    // NEW: Word-level tracking for AI analysis
    wordsCorrect: [] as Array<{
      word: string;
      timestamp: number;
      reactionTime: number;
      difficulty: string;
      position: { lane: number; y: number };
    }>,
    wordsIncorrect: [] as Array<{
      word: string;
      userInput: string;
      timestamp: number;
      errorType: 'typo' | 'spelling' | 'speed' | 'missed';
      difficulty: string;
      position: { lane: number; y: number };
    }>
  });
  
  // NEW: Hidden metrics collection (invisible to users)
  const [hiddenMetrics, setHiddenMetrics] = useState<{
    reactionTimes: number[];
    errorPatterns: Array<{
      type: string;
      category: string;
      timestamp: number;
      stressLevel: string;
      comboLevel: number;
      word: string;
    }>;
    stressIndicators: any[];
    vocabularyPerformance: Record<string, number>;
    focusMetrics: any[];
    sessionFlow: any[];
  }>({
    reactionTimes: [],
    errorPatterns: [],
    stressIndicators: [],
    vocabularyPerformance: {},
    focusMetrics: [],
    sessionFlow: []
  });
  const [lastWordAppearTime, setLastWordAppearTime] = useState<number | null>(null);
  
  // NEW: Intelligent Adaptive System
  const [adaptiveSettings, setAdaptiveSettings] = useState({
    currentSpeedMultiplier: 0.6, // Start SLOWER for assessment
    wordComplexityLevel: 1,
    encouragementLevel: 'assessment',
    lastPerformanceCheck: Date.now(),
    assessmentPhase: 'baseline', // baseline → finding_speed → optimal → challenge
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    playerSpeedFound: false,
    optimalSpeed: 1.0,
    lastAnnouncement: Date.now()
  });

  // Removed complex WPM tracking - using simple calculation now
  
  // NEW: Game announcements
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string | null>(null);
  
  // NEW: Detailed session tracking for AI analysis
  const [sessionData, setSessionData] = useState({
    errorPatterns: [] as Array<{
      word: string;
      userInput: string;
      errorType: 'typo' | 'spelling' | 'speed' | 'missed';
      timestamp: number;
    }>,
    typingBehavior: {
      averageWordLength: 0,
      fastestWord: '',
      slowestWord: '',
      commonMistakes: [] as string[]
    }
  });
  
  // NEW: AI Assessment state
  const [aiAssessment, setAiAssessment] = useState<any>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [isAiAssessmentExpanded, setIsAiAssessmentExpanded] = useState(false);
  const [isAiPerformanceExpanded, setIsAiPerformanceExpanded] = useState(false);
  // NEW: Stats snapshot returned by save API (aggregated top words, totals)
  const [statsSnapshot, setStatsSnapshot] = useState<any>(null);
  // NEW: Saving session spinner
  const [savingSession, setSavingSession] = useState(false);
  
  // NEW: Smart streak tracking
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    bestStreak: 0,
    streakType: 'accuracy', // 'accuracy', 'speed', 'combo'
    achievements: [] as string[]
  });
  
  // NEW: Advanced visual effects system
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
    maxLife: number;
  }>>([]);
  
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0, intensity: 0 });
  const [backgroundPulse, setBackgroundPulse] = useState({ color: 'cyan', intensity: 0 });
  const [comboVisual, setComboVisual] = useState({ scale: 1, glow: 0 });
  
  // Game objects
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [targetZoneWords, setTargetZoneWords] = useState<FallingWord[]>([]);
  const [effects, setEffects] = useState<Array<{id: string, type: 'fire' | 'poo', lane: number}>>([]);
  const [bonusEffects, setBonusEffects] = useState<Array<{id: string, text: string, lane: number, y: number}>>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const endCalledRef = useRef<boolean>(false);
  const sessionSavedRef = useRef<boolean>(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  
  // NEW: Resume check state
  const [showResumeRequiredModal, setShowResumeRequiredModal] = useState(false);
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  const [checkingResume, setCheckingResume] = useState(false);
  const [userResumeData, setUserResumeData] = useState<any>(null);
  
  // Progressive difficulty state
  const [currentSpawnRate, setCurrentSpawnRate] = useState<number>(1800);
  
  // Typing animation state for demo
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const demoWords = ['create', 'assist', 'design', 'manage'];
  
  // Game intervals
  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const wordSpawnRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentWordIndexRef = useRef<number>(0);
  const currentLaneRef = useRef<number>(0); // Track current lane for sequential spawning
  const currentSentenceStartWordRef = useRef<number>(0); // Track where current sentence started
  const currentSentenceIndexRef = useRef<number>(-1); // Track current sentence being spawned
  const currentStoryRef = useRef<StoryChapter | null>(null); // Ref for story to avoid useEffect loops
  const currentSentenceRef = useRef<number>(0); // Current sentence index (0-based)
  const currentWordInSentenceRef = useRef<number>(0); // Current word within sentence (0-based)
  const sentenceWordsSpawnedRef = useRef<number>(0); // How many words from current sentence have been spawned
  const canStartNextSentenceRef = useRef<boolean>(true); // Can we start the next sentence?

  // Game configuration
  const LANES = 5;
  const TARGET_ZONE_Y = 85; // Percentage from top
  const TARGET_ZONE_TOLERANCE = 8; // Percentage tolerance
  
  // Sentence color system - vibrant, distinct colors
  const getSentenceColor = (sentenceIndex: number) => {
    const colors = [
      'bg-blue-500/80 border-blue-400',      // Sentence 1: Blue
      'bg-green-500/80 border-green-400',    // Sentence 2: Green  
      'bg-purple-500/80 border-purple-400',  // Sentence 3: Purple
      'bg-orange-500/80 border-orange-400',  // Sentence 4: Orange
      'bg-pink-500/80 border-pink-400',      // Sentence 5: Pink
      'bg-cyan-500/80 border-cyan-400',      // Sentence 6: Cyan
      'bg-yellow-500/80 border-yellow-400',  // Sentence 7: Yellow
      'bg-indigo-500/80 border-indigo-400',  // Sentence 8: Indigo
    ];
    return colors[sentenceIndex % colors.length] || 'bg-blue-500/80 border-blue-400';
  };

  
  // Get current difficulty config
  const getCurrentConfig = () => BPO_VOCABULARY[currentDifficulty];
  
  // Initialize Web Audio API for procedural music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.log('Web Audio API not supported');
      }
    }

    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Check for existing story when user is loaded
  useEffect(() => {
    if (!user) return;
    
    const checkExistingStory = async () => {
      try {
        console.log('📖 Checking for existing story on page load...');
        const loadResult = await storyGenerator.loadUserActiveStory(user.id);
        
        if (loadResult.hasStory && loadResult.story) {
          console.log('✅ Found existing story:', loadResult.story.title);
          setCompleteStory(loadResult.story);
        } else {
          console.log('📝 No existing story found');
        }
      } catch (error) {
        console.error('❌ Error checking for existing story:', error);
      }
    };
    
    checkExistingStory();
  }, [user]);

  // NEW: Check if user has a saved resume
  const checkUserResume = useCallback(async () => {
    if (!user?.id) {
      setHasResume(false);
      return false;
    }

    setCheckingResume(true);
    try {
      // Get the session token for authentication
      const token = await (await import('@/lib/auth-helpers')).getSessionToken();
      
      const response = await fetch('/api/user/saved-resumes', {
        headers: {
          'x-user-id': String(user.id),
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        const hasResumeData = data?.success && data?.hasSavedResume;
        setHasResume(hasResumeData);
        return hasResumeData;
      } else {
        setHasResume(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking user resume:', error);
      setHasResume(false);
      return false;
    } finally {
      setCheckingResume(false);
    }
  }, [user?.id]);

  // Check for saved resume on page load
  useEffect(() => {
    if (user?.id) {
      console.log('🔍 Typing Hero: Checking for saved resume on page load...');
      checkUserResume();
    }
  }, [user?.id, checkUserResume]);

  // NEW: Fetch and extract skills/career goals from saved resume
  const fetchUserResumeData = async () => {
    if (!user?.id) return null;

    try {
      // Get the session token for authentication
      const token = await (await import('@/lib/auth-helpers')).getSessionToken();
      
      // Fetch saved resume data
      const response = await fetch('/api/user/saved-resume-data', {
        headers: {
          'x-user-id': String(user.id),
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.success && data?.resumeData) {
          setUserResumeData(data.resumeData);
          return data.resumeData;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching resume data:', error);
      return null;
    }
  };

  // NEW: Extract skills from resume data
  const extractSkillsFromResume = (resumeData: any): string[] => {
    const skills: string[] = [];
    
    if (!resumeData) return skills;

    // Extract from skills object
    if (resumeData.skills) {
      if (Array.isArray(resumeData.skills.technical)) {
        skills.push(...resumeData.skills.technical);
      }
      if (Array.isArray(resumeData.skills.soft_skills)) {
        skills.push(...resumeData.skills.soft_skills);
      }
      if (Array.isArray(resumeData.skills.tools)) {
        skills.push(...resumeData.skills.tools);
      }
      if (Array.isArray(resumeData.skills.languages)) {
        skills.push(...resumeData.skills.languages);
      }
    }

    // Remove duplicates and return
    return [...new Set(skills)].filter(Boolean);
  };

  // NEW: Extract career goals from resume data
  const extractCareerGoalsFromResume = (resumeData: any): string[] => {
    const goals: string[] = [];
    
    if (!resumeData) return goals;

    // Extract from summary
    if (resumeData.summary) {
      goals.push(resumeData.summary);
    }

    // Extract from objectives
    if (resumeData.objective) {
      goals.push(resumeData.objective);
    }

    // Extract from career summary
    if (resumeData.career_summary) {
      goals.push(resumeData.career_summary);
    }

    return goals.filter(Boolean);
  };

  // NEW: Stop current music (simplified for custom songs)
  const stopMusic = useCallback(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
    }
  }, []);

  // NEW: Pause music without resetting position
  const pauseMusic = useCallback(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
    }
  }, []);

  // NEW: Resume music from current position
  const resumeMusic = useCallback(() => {
    if (musicAudioRef.current && !isMuted) {
      musicAudioRef.current.play().catch(error => {
        console.log('Music resume failed:', error);
      });
    }
  }, [isMuted]);

  // NEW: Play custom songs based on game state and gender preference
  const playMusic = useCallback((trackType: 'menu' | 'rookie' | 'rockstar' | 'virtuoso' | 'legend' | 'failure' | 'success') => {
    if (isMuted) return;
    
    // Wait for audio element to be ready
    if (!musicAudioRef.current) {
      console.log('🎵 Audio element not ready, retrying...');
      setTimeout(() => playMusic(trackType), 100);
      return;
    }
    
    // Stop current music
    stopMusic();
    
    // Select song based on gender preference  
    const songPath = CUSTOM_SONGS[musicGender];
    
    try {
      musicAudioRef.current.src = songPath;
      musicAudioRef.current.volume = isMuted ? 0 : volume; // Use volume state
      musicAudioRef.current.loop = true; // Loop the song
      
      // Play the song
      musicAudioRef.current.play().catch(error => {
        console.log('Music play failed:', error);
        // Try again after a short delay
        setTimeout(() => {
          if (musicAudioRef.current) {
            musicAudioRef.current.play().catch(console.error);
          }
        }, 500);
      });
      
      console.log(`🎵 Playing ${musicGender} song for ${trackType}: ${songPath}`);
    } catch (error) {
      console.error('Failed to load custom song:', error);
    }

    // OLD MUSIC CODE REMOVED - Using custom songs now
    /* OLD MUSIC CONFIGURATIONS REMOVED
      menu: {
        bpm: 100,
        bassFreq: 80,
        leadFreqs: [330, 440, 550],
        drumTempo: 0.5
      },
      rookie: {
        bpm: 90,
        bassFreq: 60,
        leadFreqs: [262, 330, 392], // C, E, G
        drumTempo: 0.4
      },
      rockstar: {
        bpm: 110,
        bassFreq: 70,
        leadFreqs: [294, 370, 440], // D, F#, A
        drumTempo: 0.35
      },
      virtuoso: {
        bpm: 130,
        bassFreq: 80,
        leadFreqs: [330, 415, 523], // E, G#, C
        drumTempo: 0.3
      },
      legend: {
        bpm: 150,
        bassFreq: 90,
        leadFreqs: [349, 440, 554], // F, A, C#
        drumTempo: 0.25
      },

      failure: {
        bpm: 60,
        bassFreq: 40,
        leadFreqs: [147, 175, 208], // Low disappointed chord
        drumTempo: 0.8
      },
      success: {
        bpm: 120,
        bassFreq: 100,
        leadFreqs: [523, 659, 784], // High victory chord
        drumTempo: 0.3
      }
    };

    const config = configs[trackType];
    const beatInterval = 60 / config.bpm;

    // Create bass line
    const createBassPattern = () => {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.value = config.bassFreq;
      bassGain.gain.value = 0.3;
      
      bassOsc.connect(bassGain);
      bassGain.connect(masterGain);
      
      nodes.oscillators.push(bassOsc);
      nodes.gainNodes.push(bassGain);
      
      bassOsc.start();
      
      // Bass pattern
      const pattern = [1, 0.1, 0.5, 0.1]; // Strong, weak, medium, weak
      let step = 0;
      
      const bassInterval = setInterval(() => {
        if (!nodes.isPlaying) {
          clearInterval(bassInterval);
          return;
        }
        
        bassGain.gain.cancelScheduledValues(ctx.currentTime);
        bassGain.gain.setValueAtTime(pattern[step % pattern.length] * 0.3, ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + beatInterval * 0.8);
        
        step++;
      }, beatInterval * 1000);
    };

    // Create lead melody
    const createLeadMelody = () => {
      config.leadFreqs.forEach((freq, index) => {
        setTimeout(() => {
          if (!nodes.isPlaying) return;
          
          const leadOsc = ctx.createOscillator();
          const leadGain = ctx.createGain();
          
          leadOsc.type = 'square';
          leadOsc.frequency.value = freq;
          leadGain.gain.value = 0.15;
          
          leadOsc.connect(leadGain);
          leadGain.connect(masterGain);
          
          nodes.oscillators.push(leadOsc);
          nodes.gainNodes.push(leadGain);
          
          leadOsc.start();
          
          // Melody pattern
          const melodyInterval = setInterval(() => {
            if (!nodes.isPlaying) {
              clearInterval(melodyInterval);
              return;
            }
            
            // Create short melody notes
            leadGain.gain.cancelScheduledValues(ctx.currentTime);
            leadGain.gain.setValueAtTime(0.15, ctx.currentTime);
            leadGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + beatInterval * 0.3);
          }, beatInterval * 2000);
          
        }, index * beatInterval * 500);
      });
    };

    // Create drum pattern
    const createDrumPattern = () => {
      const drumInterval = setInterval(() => {
        if (!nodes.isPlaying) {
          clearInterval(drumInterval);
          return;
        }
        
        // Create kick drum
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        
        kickOsc.type = 'sine';
        kickOsc.frequency.value = 60;
        kickGain.gain.value = 0.4;
        
        kickOsc.connect(kickGain);
        kickGain.connect(masterGain);
        
        kickOsc.start();
        kickOsc.stop(ctx.currentTime + 0.1);
        
        kickGain.gain.setValueAtTime(0.4, ctx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
      }, config.drumTempo * 1000);
    };

    END OF OLD MUSIC CODE */
  }, [isMuted, stopMusic, musicGender]);

  // Handle music changes based on game state - only start music when actually playing
  useEffect(() => {
    if (isMuted) return;
    
    // Handle different game states
    if (gameState === 'playing') {
      // Only start music if not already playing
      if (musicAudioRef.current && musicAudioRef.current.paused) {
        const musicTrack = currentDifficulty as 'rookie' | 'rockstar' | 'virtuoso' | 'legend';
        playMusic(musicTrack);
      }
    } else if (gameState === 'failed') {
      playMusic('failure');
    } else if (gameState === 'paused') {
      // Keep music paused - don't restart it
      pauseMusic();
    } else {
      // For all other states (menu, generating, complete, etc.), stop music
      stopMusic();
    }
  }, [gameState, isMuted, playMusic, pauseMusic, stopMusic, currentDifficulty]);


  // NEW: Generate personalized story for the user
  // Helper function to reset all game tracking
  const resetGameTracking = () => {
    setCurrentWordIndex(0);
    currentWordIndexRef.current = 0;
    currentLaneRef.current = 0;
    currentSentenceStartWordRef.current = 0;
    currentSentenceIndexRef.current = -1;
    currentSentenceRef.current = 0;
    currentWordInSentenceRef.current = 0;
    sentenceWordsSpawnedRef.current = 0;
    canStartNextSentenceRef.current = true;
    setCompletedSentences([]);
    setIsChapterComplete(false);
    isChapterCompleteRef.current = false;
  };

  // NEW: Load or generate complete 5-chapter story
  const loadOrGenerateCompleteStory = useCallback(async () => {
    console.log('🎬 loadOrGenerateCompleteStory called! User:', !!user);
    if (!user) {
      console.log('❌ No user found, returning null');
      return null;
    }

    setIsGeneratingStory(true);
    setStoryError(null);
    setStoryReady(false);
    setGameState('generating');
    
    console.log('🎬 Starting complete story load/generation...');
    
    try {
      // First, try to load existing active story
      console.log('📖 Checking for existing active story...');
      const loadResult = await storyGenerator.loadUserActiveStory(user.id);
      
      if (loadResult.hasStory && loadResult.story) {
        console.log('✅ Found existing complete story:', loadResult.story.title);
        setCompleteStory(loadResult.story);
        
        // Set current chapter to Chapter 1
        setCurrentChapter(1);
        const chapter1 = loadResult.story.chapters[0];
        setCurrentStory(chapter1);
        currentStoryRef.current = chapter1;
        
        // Reset all tracking
        resetGameTracking();
        
        // Update spawn rate for selected difficulty
        const difficultyConfig = getCurrentConfig();
        setCurrentSpawnRate(difficultyConfig.spawnRate);
        console.log('🎯 Selected difficulty:', difficultyConfig.displayName, 'spawn rate:', difficultyConfig.spawnRate);
        
        setStoryReady(true);
        setGameState('story-ready');
        console.log('✅ Existing story loaded and ready');
        return loadResult.story;
      }

      // No existing story, generate complete 5-chapter story
      console.log('📝 No existing story found, generating complete 5-chapter story...');
      
      // Fetch resume data to extract skills and career goals
      const resumeData = userResumeData || await fetchUserResumeData();
      const skills = extractSkillsFromResume(resumeData);
      const careerGoals = extractCareerGoalsFromResume(resumeData);
      
      // Create user profile for story generation
      const userProfile: UserStoryProfile = {
        userId: user.id,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.user_metadata?.full_name || 'Professional',
        position: user.user_metadata?.position || 'Career Professional',
        skills: skills.length > 0 ? skills : ['Communication', 'Problem Solving', 'Teamwork'],
        careerGoals: careerGoals.length > 0 ? careerGoals : ['Professional Growth', 'Career Advancement'],
        currentEmployer: user.user_metadata?.company || '',
        workStatus: user.user_metadata?.work_status || 'professional',
        location: user.user_metadata?.location || 'Global'
      };

      const gameProgress: GameProgressData = {
        currentChapter: 1, // Always start with 1 for complete story generation
        difficulty: currentDifficulty,
        currentWPM: gameStats.wpm,
        accuracy: gameStats.accuracy,
        completedStories: Math.floor(gameStats.correctWords / 50),
        totalWordsTyped: gameStats.correctWords,
        averageSessionTime: gameStats.elapsedTime,
        strongWordTypes: [],
        weakWordTypes: []
      };

      console.log('🎬 Generating complete story for:', userProfile.name, 'Difficulty:', currentDifficulty);
      
      const completeStoryResult = await storyGenerator.generateCompleteStory(userProfile, gameProgress);
      setCompleteStory(completeStoryResult);
      
      // Set current chapter to Chapter 1
      setCurrentChapter(1);
      const chapter1 = completeStoryResult.chapters[0];
      setCurrentStory(chapter1);
      currentStoryRef.current = chapter1;
      
      // Reset all tracking
      resetGameTracking();
      
      // Update spawn rate for selected difficulty
      const difficultyConfig = getCurrentConfig();
      setCurrentSpawnRate(difficultyConfig.spawnRate);
      console.log('🎯 Selected difficulty:', difficultyConfig.displayName, 'spawn rate:', difficultyConfig.spawnRate);
      
      setStoryReady(true);
      setGameState('story-ready');
      console.log('✅ Complete 5-chapter story generated and ready:', completeStoryResult.title);
      return completeStoryResult;
      
    } catch (error) {
      console.error('❌ Complete story generation failed:', error);
      setStoryError('Failed to generate personalized story. Please try again.');
      setStoryReady(false);
      return null;
    } finally {
      setIsGeneratingStory(false);
    }
  }, [user, currentDifficulty, gameStats.correctWords, gameStats.wpm, gameStats.accuracy, gameStats.elapsedTime]);

  // NEW: Load next chapter from pre-generated complete story
  const loadNextChapter = (chapterNumber: number) => {
    if (!completeStory || !completeStory.chapters) {
      console.error('❌ No complete story available to load next chapter');
      return;
    }

    if (chapterNumber > completeStory.chapters.length) {
      console.error('❌ Requested chapter', chapterNumber, 'exceeds available chapters:', completeStory.chapters.length);
      return;
    }

    console.log('📖 Loading pre-generated chapter:', chapterNumber);
    
    const nextChapter = completeStory.chapters[chapterNumber - 1]; // Array is 0-indexed
    setCurrentChapter(chapterNumber);
    setCurrentStory(nextChapter);
    currentStoryRef.current = nextChapter;
    
    // Reset all tracking for new chapter
    resetGameTracking();
    
    // Update spawn rate for new chapter
    const chapterConfig = getChapterDifficulty(chapterNumber);
    setCurrentSpawnRate(chapterConfig.spawnRate);
    console.log('🎯 Chapter', chapterNumber, 'difficulty:', chapterConfig.displayName, 'spawn rate:', chapterConfig.spawnRate);
    
    // Transition to story-ready state
    setStoryReady(true);
    setGameState('story-ready');
    console.log('✅ Chapter', chapterNumber, 'loaded and ready:', nextChapter.title);
  };

  // NEW: Regenerate complete story (for "Regenerate Story" button)
  const regenerateCompleteStory = async () => {
    console.log('🔄 Regenerating complete story...');
    
    if (!user) {
      console.log('❌ No user found for story regeneration');
      return;
    }

    // Check if user has a saved resume first
    const hasResumeData = await checkUserResume();
    if (!hasResumeData) {
      setShowResumeRequiredModal(true);
      return;
    }

    setIsGeneratingStory(true);
    setStoryError(null);
    setStoryReady(false);
    setGameState('generating');
    
    try {
      // Fetch resume data to extract skills and career goals
      const resumeData = userResumeData || await fetchUserResumeData();
      const skills = extractSkillsFromResume(resumeData);
      const careerGoals = extractCareerGoalsFromResume(resumeData);
      
      // Create user profile for story generation
      const userProfile: UserStoryProfile = {
        userId: user.id,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.user_metadata?.full_name || 'Professional',
        position: user.user_metadata?.position || 'Career Professional',
        skills: skills.length > 0 ? skills : ['Communication', 'Problem Solving', 'Teamwork'],
        careerGoals: careerGoals.length > 0 ? careerGoals : ['Professional Growth', 'Career Advancement'],
        currentEmployer: user.user_metadata?.company || '',
        workStatus: user.user_metadata?.work_status || 'professional',
        location: user.user_metadata?.location || 'Global'
      };

      const gameProgress: GameProgressData = {
        currentChapter: 1,
        difficulty: currentDifficulty,
        currentWPM: gameStats.wpm,
        accuracy: gameStats.accuracy,
        completedStories: Math.floor(gameStats.correctWords / 50),
        totalWordsTyped: gameStats.correctWords,
        averageSessionTime: gameStats.elapsedTime,
        strongWordTypes: [],
        weakWordTypes: []
      };

      console.log('🎬 Regenerating complete story for:', userProfile.name);
      
      const completeStoryResult = await storyGenerator.generateCompleteStory(userProfile, gameProgress);
      setCompleteStory(completeStoryResult);
      
      // Set current chapter to Chapter 1
      setCurrentChapter(1);
      const chapter1 = completeStoryResult.chapters[0];
      setCurrentStory(chapter1);
      currentStoryRef.current = chapter1;
      
      // Reset all tracking
      resetGameTracking();
      
      // Update spawn rate for selected difficulty
      const difficultyConfig = getCurrentConfig();
      setCurrentSpawnRate(difficultyConfig.spawnRate);
      
      setStoryReady(true);
      setGameState('story-ready');
      console.log('✅ Complete story regenerated:', completeStoryResult.title);
      
    } catch (error) {
      console.error('❌ Story regeneration failed:', error);
      setStoryError('Failed to regenerate story. Please try again.');
      setStoryReady(false);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // NEW: Get next sequential word from story
  const getNextSequentialWord = useCallback(() => {
    if (!user || !currentStory) return null;
    
    const nextWord = storyGenerator.getNextSequentialWord(user.id, currentWordIndex);
    return nextWord?.text || null;
  }, [user, currentStory, currentWordIndex]);

  // NEW: Handle "I'm Ready" button click after story is generated
  const handleImReady = () => {
    if (gameState === 'story-ready' && storyReady) {
      setGameState('ready');
      console.log('🎮 Player clicked "I\'m Ready", now waiting for Start Typing button...');
    }
  };

  // Check if difficulty is unlocked based on user progress
  const isDifficultyUnlocked = (difficulty: DifficultyLevel): boolean => {
    // All difficulties unlocked by default - let players choose their challenge level
    return true;
  };

  // Get difficulty recommendation status
  const getDifficultyStatus = (difficulty: DifficultyLevel): 'recommended' | 'available' | 'advanced' => {
    const progressionOrder: DifficultyLevel[] = ['rookie', 'rockstar', 'virtuoso', 'legend'];
    const currentIndex = progressionOrder.indexOf(currentDifficulty);
    const targetIndex = progressionOrder.indexOf(difficulty);
    
    if (targetIndex === currentIndex) return 'recommended';
    if (targetIndex < currentIndex) return 'available';
    return 'advanced';
  };

  // AI-based performance level calculation
  const getActualPerformanceLevel = (): DifficultyLevel => {
    if (gameStats.totalWords < 5) {
      // Not enough data - show selected difficulty
      return currentDifficulty;
    }

    const { wpm, accuracy, totalWords, fires, poos } = gameStats;
    
    // Calculate performance score (0-100)
    let performanceScore = 0;
    
    // WPM contribution (40% of score)
    if (wpm >= 40) performanceScore += 40;
    else if (wpm >= 25) performanceScore += 30;
    else if (wpm >= 15) performanceScore += 20;
    else performanceScore += 10;
    
    // Accuracy contribution (40% of score)
    if (accuracy >= 80) performanceScore += 40;
    else if (accuracy >= 60) performanceScore += 30;
    else if (accuracy >= 40) performanceScore += 20;
    else if (accuracy >= 20) performanceScore += 10;
    else performanceScore += 0;
    
    // Fire/Poo ratio contribution (20% of score)
    const ratio = poos > 0 ? fires / poos : fires > 0 ? 5 : 0;
    if (ratio >= 2) performanceScore += 20;
    else if (ratio >= 1) performanceScore += 15;
    else if (ratio >= 0.5) performanceScore += 10;
    else performanceScore += 5;
    
    // Map performance score to difficulty levels
    if (performanceScore >= 80) return 'legend';    // 🏆 Legend (80-100)
    if (performanceScore >= 65) return 'virtuoso';  // 🎼 Virtuoso (65-79)  
    if (performanceScore >= 45) return 'rockstar';  // 🎤 Rockstar (45-64)
    return 'rookie';                                 // 🎸 Rookie (0-44)
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'rookie': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'rockstar': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'virtuoso': return 'text-orange-400 border-orange-500/30 bg-orange-500/20';
      case 'legend': return 'text-red-400 border-red-500/30 bg-red-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  // Update stable performance level only when there's significant change
  useEffect(() => {
    if (gameStats.totalWords >= 10) { // Only update after enough data
      const newLevel = getActualPerformanceLevel();
      if (newLevel !== stablePerformanceLevel) {
        // Only update if the level has actually changed
        setStablePerformanceLevel(newLevel);
      }
    }
  }, [gameStats.wpm, gameStats.accuracy, gameStats.totalWords, gameStats.fires, gameStats.poos]);

  // Removed complex WPM calculation - using simple method now

  // Removed complex WPM tracking functions
  
  // NEW: AI Assessment function
  const getAIAssessment = async (finalStats?: any) => {
    setLoadingAssessment(true);
    try {
      // Use provided stats or current gameStats
      const stats = finalStats || gameStats;
      const sessionErrors = sessionData.errorPatterns;
      
      console.log('📊 AI Assessment Data:', { stats, sessionErrors }); // Debug log
      
      const assessmentData = {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        totalWords: stats.totalWords,
        correctWords: stats.correctWords,
        missedWords: stats.missedWords,
        fires: stats.fires,
        poos: stats.poos,
        elapsedTime: stats.elapsedTime,
        charactersTyped: stats.charactersTyped,
        errorPatterns: sessionErrors,
        difficultyLevel: currentDifficulty,
        streakData: streakData,
        // NEW: Word-level tracking for better AI analysis
        wordsCorrect: stats.wordsCorrect,
        wordsIncorrect: stats.wordsIncorrect
      };
      
      const response = await fetch('/api/games/typing-hero/ai-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });
      
      const result = await response.json();
      if (result.success) {
        setAiAssessment(result.assessment);
      }
    } catch (error) {
      console.error('Failed to get AI assessment:', error);
      // Fallback assessment
      setAiAssessment({
        overallAssessment: `Great session! You achieved ${gameStats.wpm} WPM with ${gameStats.accuracy}% accuracy.`,
        performanceLevel: gameStats.wpm >= 60 ? "Advanced" : gameStats.wpm >= 40 ? "Intermediate" : "Developing",
        strengths: ["Session completion", "Persistence"],
        improvementAreas: ["Consistency"],
        personalizedTips: [{
          category: "General",
          tip: "Keep practicing regularly for steady improvement",
          explanation: "Consistent practice builds muscle memory"
        }],
        encouragement: "Keep up the excellent work!",
        nextSessionGoal: "Focus on maintaining accuracy while increasing speed"
      });
    } finally {
      setLoadingAssessment(false);
    }
  };

  // OLD spawnWord function removed - now using spawnWordInterval in useEffect

  // Start game with selected difficulty
  const startGame = async (difficulty: DifficultyLevel = 'rockstar') => {
    // Stop any preview music that might be playing
    stopPreview();
    
    // Trigger header SignUp dialog if user is not logged in
    if (!user) {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('signup', 'true');
        router.push(`${url.pathname}?${url.searchParams.toString()}`);
        return;
      }
    }
    if (!isDifficultyUnlocked(difficulty)) return;

    // Check if user has a saved resume first (use cached value for instant response)
    if (hasResume === false) {
      setShowResumeRequiredModal(true);
      return;
    }
    
    // If we haven't checked yet, check now
    if (hasResume === null) {
      const hasResumeData = await checkUserResume();
      if (!hasResumeData) {
        setShowResumeRequiredModal(true);
        return;
      }
    }
    
    setCurrentDifficulty(difficulty);
    setGameState('generating'); // NEW: Show story generation state
    setIsInitialStart(true); // Reset for new game
    endCalledRef.current = false;
    sessionSavedRef.current = false;
    setRecoveryGraceTime(0); // Reset grace period for new game
    recoveryGraceRef.current = 0; // Reset ref as well
    
    // NEW: Load or generate complete 5-chapter story for the session
    loadOrGenerateCompleteStory().then(() => {
      console.log('✅ Complete story ready, state transition handled by loadOrGenerateCompleteStory');
      // Note: setGameState('story-ready') is handled inside loadOrGenerateCompleteStory
    });
    
        // Use selected difficulty for spawn rate
        const difficultyConfig = getCurrentConfig();
        setCurrentSpawnRate(difficultyConfig.spawnRate);
    setGameStats({
      score: 0,
      fires: 0,
      poos: 0,
      combo: 0,
      longestStreak: 0,
      wpm: 0,
      accuracy: 0,
      elapsedTime: 0,
      charactersTyped: 0,
      correctWords: 0,
      totalWords: 0,
      missedWords: 0,
      totalKeypresses: 0,
      burstWPM: 0,
      sustainedWPM: 0,
      realtimeWPM: 0,
      // Initialize word tracking arrays
      wordsCorrect: [],
      wordsIncorrect: []
    });

    // Removed WPM tracker - using simple calculation now
    
    setFallingWords([]);
    setCurrentInput('');
    setEffects([]);
    setBonusEffects([]);
    setCountdown(null);
    
    // Focus input and show ready guide
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Show input guide with ready button
    setShowInputGuide(true);
  };

  // Actually start the game after ready button is clicked
  const handleReadyClick = async () => {
    // Check if user has a saved resume first
    const hasResumeData = await checkUserResume();
    if (!hasResumeData) {
      setShowResumeRequiredModal(true);
      return;
    }

    setShowInputGuide(false);
    setGameStartTime(Date.now());
    
    // Start countdown before beginning game
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null) return null;
        
        // Play countdown tick sound
        if (!isMuted && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.log);
        }
        
        if (prev <= 1) {
          // Show "GO!" for a brief moment, then start game
          setTimeout(() => {
            clearInterval(countdownInterval);
            setCountdown(null);
            setGameState('playing');
            setIsInitialStart(false); // Mark that we've started the game (after countdown)
            const musicTrack = currentDifficulty as 'rookie' | 'rockstar' | 'virtuoso' | 'legend';
            playMusic(musicTrack);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 800); // Brief delay to show "GO!"
          return 0; // Show "GO!" instead of 0
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Pause/Resume game
  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
      pauseMusic();
    } else if (gameState === 'paused') {
      // Start countdown before resuming
      setCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null) return null;
          
          // Play countdown tick sound
          if (!isMuted && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.log);
          }
          
          if (prev <= 1) {
            // Show "GO!" for a brief moment, then resume game
            setTimeout(() => {
              clearInterval(countdownInterval);
              setCountdown(null);
              setGameState('playing');
              resumeMusic();
              if (inputRef.current) {
                inputRef.current.focus();
              }
              // Show input guide briefly when resuming
              setShowInputGuide(true);
              setTimeout(() => {
                setShowInputGuide(false);
              }, 2000); // Show for 2 seconds when resuming
            }, 800); // Brief delay to show "GO!"
            return 0; // Show "GO!" instead of 0
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle overwhelmed state recovery with countdown
  const handleOverwhelmedRecovery = () => {
    // Clear most of the falling words to give player breathing room
    setFallingWords(prev => prev.slice(0, 3)); // Keep only 3 words
    
    // Start recovery countdown
    setRecoveryCountdown(5);
    setGameState('recovering');
  };

  // Check if player can end session (minimum 1:00)
  const canEndSession = () => {
    return gameStats.elapsedTime >= 60; // 1 minute
  };

  // End game
  const endGame = async (success: boolean, finalMetrics?: { wpm?: number; accuracy?: number }) => {
    if (endCalledRef.current) return;
    endCalledRef.current = true;
    
    // Stop music immediately when game ends
    stopMusic();
    
    // Check if user is logged in before saving
    if (!user?.id) {
      console.log('⚠️ User not logged in, skipping session save');
      setGameState(success ? 'complete' : 'failed');
      return;
    }

    console.log(`🎮 Game ended: ${success ? 'SUCCESS' : 'FAILED'}`);
        console.log('📊 Final stats:', gameStats);
        console.log('🔍 WordsIncorrect length:', gameStats.wordsIncorrect.length);
        console.log('🔍 WordsIncorrect array:', gameStats.wordsIncorrect);
        
        // Set appropriate game state based on success and minimum time
    if (success || gameStats.elapsedTime >= 60) {
      setGameState('complete'); // Player completed session or reached minimum time
      // Ensure music is stopped when game completes
      console.log('🎵 Game completed - stopping music');
      stopMusic();
    } else {
      setGameState('failed'); // Game ended prematurely (overwhelmed, quit early, etc.)
    }
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (wordSpawnRef.current) clearInterval(wordSpawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
    
    // Clear countdown if active
    setCountdown(null);
    
    // Stop gameplay music and play result music only for failed games
    stopMusic();
    if (!success && gameStats.elapsedTime < 60) {
      // Only play failure music for actual failures, not successful completions
      setTimeout(() => {
        playMusic('failure');
      }, 500);
    }
    
    // No progress updates since all challenges "fail to complete"

    // Persist session
    try {
      const startedAt = new Date(gameStartTime || Date.now());
      const finishedAt = new Date();
      const durationMs = finishedAt.getTime() - startedAt.getTime();
      const token = await (await import('@/lib/auth-helpers')).getSessionToken();
      if (token && !sessionSavedRef.current) {
        sessionSavedRef.current = true;
        const wpmToSave = typeof finalMetrics?.wpm === 'number' ? finalMetrics.wpm : gameStats.wpm;
        const accToSave = typeof finalMetrics?.accuracy === 'number' ? finalMetrics.accuracy : gameStats.accuracy;
        
        // NEW: Calculate enhanced metrics for business intelligence
        const enhancedMetrics = calculateEnhancedMetrics(hiddenMetrics, gameStats);
        
        // Get AI analysis first
        let aiAnalysis = {};
        // Show loading spinner while AI analysis runs
        setLoadingAssessment(true);
        try {
          const aiResponse = await fetch('/api/games/typing-hero/ai-assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wpm: wpmToSave,
              accuracy: accToSave,
              totalWords: gameStats.totalWords,
              correctWords: gameStats.correctWords,
              missedWords: gameStats.missedWords,
              fires: gameStats.fires,
              poos: gameStats.poos,
              elapsedTime: gameStats.elapsedTime,
              charactersTyped: gameStats.charactersTyped,
              errorPatterns: sessionData.errorPatterns,
              difficultyLevel: currentDifficulty,
              streakData: streakData,
              // NEW: Word-level tracking for better AI analysis
              wordsCorrect: gameStats.wordsCorrect,
              wordsIncorrect: gameStats.wordsIncorrect
            })
          });
          
          const aiResult = await aiResponse.json();
          if (aiResult.success) {
            aiAnalysis = aiResult.analysis;
            setAiAssessment(aiResult.analysis.aiAssessment);
          }
        } catch (aiError) {
          console.error('Failed to get AI analysis:', aiError);
        } finally {
          // Hide loading spinner regardless of success/failure
          setLoadingAssessment(false);
        }

        // Save session with new clean structure
        console.log('💾 Saving Typing Hero session for user:', user.id);
        console.log('📊 Session data being sent:', {
          score: gameStats.score,
          wpm: wpmToSave,
          longest_streak: gameStats.longestStreak,
          correct_words: gameStats.correctWords,
          wrong_words: gameStats.poos,
          elapsed_time: gameStats.elapsedTime,
          overall_accuracy: accToSave,
          hasAiAnalysis: Object.keys(aiAnalysis).length > 0,
          wordsCorrectCount: gameStats.wordsCorrect.length,
          wordsIncorrectCount: gameStats.wordsIncorrect.length,
          wordsCorrectSample: gameStats.wordsCorrect.slice(0, 2),
          wordsIncorrectSample: gameStats.wordsIncorrect.slice(0, 2)
        });
        
        console.log('💾 About to save session - WordsIncorrect length:', gameStats.wordsIncorrect.length);
        console.log('💾 About to save session - WordsIncorrect array:', gameStats.wordsIncorrect);
        
        setSavingSession(true);
        const saveResponse = await fetch('/api/games/typing-hero/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // Core metrics (exactly as requested)
            score: gameStats.score,
            wpm: wpmToSave,
            longest_streak: gameStats.longestStreak,
            correct_words: gameStats.correctWords,
            wrong_words: gameStats.wordsIncorrect.length,
            elapsed_time: gameStats.elapsedTime,
            overall_accuracy: accToSave,
            
            // AI analysis as single JSONB
            ai_analysis: aiAnalysis,
            
            // NEW: Word-level tracking for detailed analysis
            words_correct: gameStats.wordsCorrect,
            words_incorrect: gameStats.wordsIncorrect,
            
            // Generated story
            generated_story: completeStory ? JSON.stringify(completeStory) : null,
            
            // Optional metadata
            difficulty_level: currentDifficulty,
            session_status: success ? 'completed' : 'failed'
          })
        });
        
        if (saveResponse.ok) {
          const saveResult = await saveResponse.json();
          console.log('✅ Session saved successfully:', saveResult);
          if (saveResult?.stats) {
            setStatsSnapshot(saveResult.stats);
            console.log('📊 Stats snapshot:', saveResult.stats);
          }
        } else {
          console.error('❌ Failed to save session:', await saveResponse.text());
        }
        setSavingSession(false);
      }
    } catch (e) {
      console.error('Failed to save Typing Hero session', e);
    } finally {
      setSavingSession(false);
    }
    
    // AI assessment is now handled before saving the session
  };

  // Create visual effect
  const createEffect = (type: 'fire' | 'poo', lane: number) => {
    const effectId = `effect-${Date.now()}-${Math.random()}`;
    setEffects(prev => [...prev, { id: effectId, type, lane }]);
    
    // Play sound effect
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.log);
    }
    
    // Remove effect after animation
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== effectId));
    }, 1000);
  };

  // NEW: Smart encouragement system
  const createBonusEffect = (text: string, lane: number, y: number) => {
    const bonusId = `bonus-${Date.now()}-${Math.random()}`;
    
    // Smart encouragement based on performance (only for non-point messages)
    const smartText = text.includes('+') ? text : getSmartEncouragement(text);
    
    setBonusEffects(prev => [...prev, { id: bonusId, text: smartText, lane, y }]);
    
    // Remove bonus text after animation
    setTimeout(() => {
      setBonusEffects(prev => prev.filter(e => e.id !== bonusId));
    }, 1500);
  };

  // NEW: Get smart encouragement based on current performance
  const getSmartEncouragement = (originalText: string) => {
    const currentAccuracy = gameStats.correctWords / Math.max(1, gameStats.totalWords);
    const recentErrors = hiddenMetrics.errorPatterns.slice(-5).filter(ep => ep.type !== 'correct').length;
    const combo = gameStats.combo;
    
    // High performance - motivational messages
    if (currentAccuracy > 0.9 && combo > 8) {
      const messages = ['🚀 ON FIRE!', '⭐ AMAZING!', '💪 UNSTOPPABLE!', '🎯 PERFECT!', '👑 CHAMPION!'];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Good performance - encouraging messages
    if (currentAccuracy > 0.8 && combo > 4) {
      const messages = ['🔥 GREAT JOB!', '✨ EXCELLENT!', '🎉 FANTASTIC!', '💫 BRILLIANT!', '🌟 SUPERB!'];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Recovering from errors - supportive messages
    if (recentErrors > 2 && combo > 2) {
      const messages = ['💪 COMEBACK!', '🎯 FOCUSED!', '⚡ RECOVERING!', '🔄 BACK ON TRACK!', '🎪 NICE SAVE!'];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Struggling - gentle encouragement
    if (currentAccuracy < 0.7 || recentErrors > 3) {
      const messages = ['🌱 KEEP GOING!', '💝 YOU GOT THIS!', '🎨 IMPROVING!', '🌈 ALMOST THERE!', '🎵 STAY CALM!'];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Default positive messages
    const messages = ['✅ NICE!', '👍 GOOD!', '🎯 HIT!', '⚡ FAST!', '🎪 COOL!'];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Calculate timing bonus based on word position
  const getTimingBonus = (word: FallingWord): number => {
    const distanceFromTarget = Math.abs(word.y - TARGET_ZONE_Y);
    if (distanceFromTarget <= TARGET_ZONE_TOLERANCE) {
      return 50; // Perfect timing bonus
    } else if (distanceFromTarget <= TARGET_ZONE_TOLERANCE * 2) {
      return 25; // Good timing bonus
    } else if (distanceFromTarget <= TARGET_ZONE_TOLERANCE * 3) {
      return 10; // Okay timing bonus
    }
    return 0; // No bonus for very early/late typing
  };

  // Simulate realistic typing errors based on difficulty and speed
  const simulateTypingError = (word: string, difficulty: DifficultyLevel): boolean => {
    // Base error rate increases with difficulty
    const baseErrorRates: Record<string, number> = {
      rookie: 0.02,    // 2% error rate
      rockstar: 0.05,  // 5% error rate  
      virtuoso: 0.08,   // 8% error rate
      legend: 0.12      // 12% error rate
    };
    
    // Error rate increases with word length
    const lengthMultiplier = Math.min(word.length / 5, 2);
    
    // Error rate increases with typing speed (WPM)
    const speedMultiplier = Math.min(gameStats.wpm / 50, 1.5);
    
    const totalErrorRate = baseErrorRates[difficulty] * lengthMultiplier * speedMultiplier;
    
    // Random chance of error
    return Math.random() < totalErrorRate;
  };

  // Handle word typing
  const handleWordType = (word: FallingWord, isCorrect: boolean) => {
    if (isCorrect) {
      // Fire effect! 🔥
      createEffect('fire', word.lane);
      
      // Calculate timing bonus and show bonus text
      const timingBonus = getTimingBonus(word);
      if (timingBonus === 50) {
        createBonusEffect('PERFECT! +50', word.lane, word.y);
      } else if (timingBonus === 25) {
        createBonusEffect('GREAT! +25', word.lane, word.y);
      } else if (timingBonus === 10) {
        createBonusEffect('GOOD! +10', word.lane, word.y);
      }
      
      setGameStats(prev => {
        const newCombo = prev.combo + 1;
        const comboMultiplier = Math.min(Math.floor(newCombo / 5) + 1, 16);
        const basePoints = 100;
        const difficultyBonus = currentDifficulty === 'rookie' ? 0 : 
                               currentDifficulty === 'rockstar' ? 25 :
                               currentDifficulty === 'virtuoso' ? 50 : 100;
        const totalPoints = (basePoints + difficultyBonus + timingBonus) * comboMultiplier;
        
        // Update combo visual effects with new combo value
        updateComboVisual(newCombo);
        
        const newLongestStreak = Math.max(prev.longestStreak, newCombo);
        
        return {
          ...prev,
          score: prev.score + totalPoints,
          fires: prev.fires + 1,
          combo: newCombo,
          longestStreak: newLongestStreak,
          correctWords: prev.correctWords + 1,
          totalWords: prev.totalWords + 1,
          charactersTyped: prev.charactersTyped + word.word.length,
          // Track correct word for AI analysis
          wordsCorrect: [...prev.wordsCorrect, {
            word: word.word,
            timestamp: Date.now(),
            reactionTime: Math.max(0, Date.now() - (lastWordAppearTime || Date.now())),
            difficulty: currentDifficulty,
            position: { lane: word.lane, y: word.y }
          }]
        };
      });
      console.log('✅ Correct word tracked:', word.word, 'Total correct:', gameStats.wordsCorrect.length + 1);
    } else {
      // Poo effect! 💩
      createEffect('poo', word.lane);
      
      setGameStats(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 25),
        poos: prev.poos + 1,
        combo: 0, // Reset combo
        totalWords: prev.totalWords + 1,
          // Track incorrect word for AI analysis
          wordsIncorrect: [...prev.wordsIncorrect, {
            word: word.word,
            userInput: currentInput.trim(),
            timestamp: Date.now(),
            errorType: 'spelling' as const,
            difficulty: currentDifficulty,
            position: { lane: word.lane, y: word.y }
          }]
        }));
        console.log('❌ Incorrect word tracked:', word.word, 'User input:', currentInput.trim(), 'Total incorrect:', gameStats.wordsIncorrect.length + 1);
    }
    
    // Mark word as typed
    setFallingWords(prev => 
      prev.map(w => w.id === word.id ? { ...w, typed: true } : w)
    );
  };

  // Helper function to check if input is definitely incorrect
  const checkIfDefinitelyIncorrect = (input: string, words: FallingWord[]): boolean => {
    if (!input.trim()) return false;
    
    const normalizedInput = input.toLowerCase().trim();
    const visibleWords = words.filter(w => !w.typed && !w.missed && w.y >= 0 && w.y <= 100);
    
    // If no visible words, input can't be correct
    if (visibleWords.length === 0) return true;
    
    // Only check for definite incorrectness if input is at least 5 characters
    // This prevents clearing while user is still typing
    if (normalizedInput.length < 5) return false;
    
    // Check if input could be a partial match for any visible word
    for (const word of visibleWords) {
      const normalizedWord = word.word.toLowerCase();
      
      // Direct partial match
      if (normalizedWord.startsWith(normalizedInput)) return false;
      
      // Handle words with spaces - check if input could be part of the word
      if (normalizedWord.includes(' ')) {
        const noSpaceWord = normalizedWord.replace(/\s+/g, '');
        if (noSpaceWord.startsWith(normalizedInput)) return false;
      }
      
      // Handle input with spaces - check if it could match a word without spaces
      if (normalizedInput.includes(' ')) {
        const noSpaceInput = normalizedInput.replace(/\s+/g, '');
        if (normalizedWord.startsWith(noSpaceInput)) return false;
      }
    }
    
    // If we get here, the input doesn't match any visible word and can't be a partial match
    return true;
  };

  // NEW: Handle sequential word completion
  const handleSequentialWordCompletion = useCallback((word: string) => {
    if (!user || !currentStory) return;
    
    // Update word index
    setCurrentWordIndex(prev => prev + 1);
    
    // Check if sentence is complete
    const sentenceCompletion = storyGenerator.isSentenceComplete(user.id, currentWordIndex);
    if (sentenceCompletion.isComplete && sentenceCompletion.completedText) {
      setCompletedSentences(prev => [...prev, sentenceCompletion.completedText!]);
      console.log('✅ Sentence completed:', sentenceCompletion.completedText);
      
      // Sentence completion bonus
      setGameStats(prev => ({
        ...prev,
        score: prev.score + 200 // Bonus for completing sentence
      }));
    }
    
    // Check if chapter is complete  
    const chapterCompletion = storyGenerator.isChapterComplete(user.id, currentWordIndex);
    if (chapterCompletion.isComplete && !isChapterCompleteRef.current && !isGeneratingStory) {
      console.log('🎉 Chapter completed! Starting transition...');
      isChapterCompleteRef.current = true;
      setIsChapterComplete(true);
      
      // Store completed chapter number and trigger transition state
      const chapterNum = currentStory?.chapterNumber || 1;
      setCompletedChapterNumber(chapterNum);
      setGameState('chapter-transition');
      
      // Check if this is the final chapter (5 chapters total)
      if (chapterNum >= 5) {
        console.log('🏆 GAME COMPLETED! All 5 chapters finished!');
        // Delay to show celebration, then go to complete state
        setTimeout(() => {
          setGameState('complete');
          isChapterCompleteRef.current = false; // Reset flag
          setIsChapterComplete(false); // Reset flag
        }, 3000); // 3 second celebration for game completion
      } else {
        // Continue to next chapter
        setTimeout(() => {
          console.log('🎯 Chapter transition timeout fired. Loading chapter:', chapterNum + 1);
          loadNextChapter(chapterNum + 1); // Load pre-generated next chapter
          isChapterCompleteRef.current = false; // Reset flag
          setIsChapterComplete(false); // Reset flag
        }, 2000); // 2 second delay to show celebration
      }
    }
  }, [user, currentStory, currentWordIndex, completeStory, isChapterComplete, isGeneratingStory]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStartTime = performance.now();
    const value = e.target.value.toLowerCase();
    console.log('⌨️ INPUT:', value, 'Falling words:', fallingWords.length); // DEBUG
    setCurrentInput(value);
    
    // Simple character tracking for WPM calculation
    if (value.length > 0) {
      setGameStats(prev => ({
        ...prev,
        charactersTyped: prev.charactersTyped + 1,
        lastTypingTime: prev.elapsedTime // Update last typing time
      }));
    }
    
    if (!value.trim()) {
      // Clear timeout when input is empty
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
        inputTimeoutRef.current = undefined;
      }
      return;
    }
    
    // Auto-clear if input gets too long without matching (prevents getting stuck)
    if (value.length > 15) {
      console.log('🚫 Auto-clearing long input:', value);
      setCurrentInput('');
      if (inputRef.current) inputRef.current.value = '';
      
      // Give poo penalty for getting stuck
      setEffects(prev => [...prev, {
        id: Date.now().toString(),
        type: 'poo',
        lane: Math.floor(Math.random() * LANES)
      }]);
      
      // Find closest word for tracking
      const closestWord = fallingWords.find(w => !w.typed && !w.missed && w.y >= 0 && w.y <= 100);
      
      setGameStats(prev => ({
        ...prev,
        poos: prev.poos + 1,
        totalWords: prev.totalWords + 1,
        // Track long input as incorrect word
        wordsIncorrect: [...prev.wordsIncorrect, {
          word: closestWord?.word || 'long_input',
          userInput: value,
          timestamp: Date.now(),
          errorType: 'speed' as const,
          difficulty: currentDifficulty,
          position: { lane: closestWord?.lane || 0, y: closestWord?.y || 0 }
        }]
      }));
      return;
    }
    
    // Set timeout to auto-clear input after 4 seconds of no matching word
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
    }
    
    inputTimeoutRef.current = setTimeout(() => {
      if (currentInput.trim().length > 2) {
        console.log('⏰ Auto-clearing inactive input:', currentInput);
        setCurrentInput('');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        
        // Give small poo penalty for timeout
        setEffects(prev => [...prev, {
          id: Date.now().toString(),
          type: 'poo',
          lane: Math.floor(Math.random() * LANES)
        }]);
        
        // Find closest word for tracking
        const closestWord = fallingWords.find(w => !w.typed && !w.missed && w.y >= 0 && w.y <= 100);
        
        setGameStats(prev => ({
          ...prev,
          poos: prev.poos + 1,
          totalWords: prev.totalWords + 1,
          // Track timeout as incorrect word
          wordsIncorrect: [...prev.wordsIncorrect, {
            word: closestWord?.word || 'timeout',
            userInput: currentInput.trim(),
            timestamp: Date.now(),
            errorType: 'speed' as const,
            difficulty: currentDifficulty,
            position: { lane: closestWord?.lane || 0, y: closestWord?.y || 0 }
          }]
        }));
      }
    }, 4000);
    
    // Check if typed word matches any visible falling word
    // For words with spaces, we need to handle them specially
    const matchingWord = fallingWords.find(w => {
      if (!w.typed && !w.missed && w.y >= 0 && w.y <= 100) {
        // Handle words with spaces by comparing normalized versions
        const normalizedInput = value.trim();
        const normalizedWord = w.word.toLowerCase();
        
        // Direct match
        if (normalizedWord === normalizedInput) return true;
        
        // Handle case where user types without spaces for words that have spaces
        // e.g., "call back" can be typed as "callback"
        if (normalizedWord.includes(' ')) {
          const noSpaceWord = normalizedWord.replace(/\s+/g, '');
          if (noSpaceWord === normalizedInput) return true;
        }
        
        // Handle case where user types with spaces for words that don't have spaces
        // e.g., "help" can be typed as "h e l p" (though this is less common)
        if (!normalizedWord.includes(' ') && normalizedInput.includes(' ')) {
          const noSpaceInput = normalizedInput.replace(/\s+/g, '');
          if (noSpaceInput === normalizedWord) return true;
        }
      }
      return false;
    });
    
    if (matchingWord) {
      console.log('🎯 WORD MATCHED!', matchingWord.word, 'at position:', matchingWord.y); // DEBUG
      
      // NEW: Collect hidden metrics for successful word match
      const reactionTime = lastWordAppearTime ? inputStartTime - lastWordAppearTime : 0;
      const wordCategory = getWordCategory(matchingWord.word);
      const currentAccuracy = gameStats.correctWords / Math.max(1, gameStats.totalWords);
      const stressLevel = calculateStressLevel(currentAccuracy, gameStats.combo);
      
      // Simulate realistic typing errors
      const shouldHaveError = simulateTypingError(matchingWord.word, currentDifficulty);
      
      if (shouldHaveError) {
        // NEW: Collect error metrics
        setHiddenMetrics(prev => ({
          ...prev,
          reactionTimes: [...prev.reactionTimes, reactionTime],
          errorPatterns: [...prev.errorPatterns, {
            type: 'simulated_error',
            category: wordCategory,
            timestamp: Date.now(),
            stressLevel,
            comboLevel: gameStats.combo,
            word: matchingWord.word
          }],
          vocabularyPerformance: {
            ...prev.vocabularyPerformance,
            [wordCategory]: (prev.vocabularyPerformance[wordCategory] || 0) - 0.5
          }
        }));
        
        // NEW: Trigger error visual effects (simplified)
        const gameAreaRect = gameAreaRef.current?.getBoundingClientRect();
        if (gameAreaRect) {
          const x = gameAreaRect.left + (matchingWord.lane / LANES) * gameAreaRect.width + (gameAreaRect.width / LANES) / 2;
          const y = gameAreaRect.top + (matchingWord.y / 100) * gameAreaRect.height;
          
          // Red error particles and screen shake
          createParticleExplosion(x, y, '#ff0000', 6);
          triggerScreenShake(8);
          triggerBackgroundPulse('red', 0.25);
          
          // Reset combo visual effects
          setComboVisual({ scale: 1, glow: 0 });
        }
        
        // Simulate a typing error - treat as incorrect
        handleWordType(matchingWord, false);
        setCurrentInput(''); // Clear input after error
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } else {
        // NEW: Collect success metrics
        setHiddenMetrics(prev => ({
          ...prev,
          reactionTimes: [...prev.reactionTimes, reactionTime],
          errorPatterns: [...prev.errorPatterns, {
            type: 'correct',
            category: wordCategory,
            timestamp: Date.now(),
            stressLevel,
            comboLevel: gameStats.combo,
            word: matchingWord.word
          }],
          vocabularyPerformance: {
            ...prev.vocabularyPerformance,
            [wordCategory]: (prev.vocabularyPerformance[wordCategory] || 0) + 1
          },
          focusMetrics: [...prev.focusMetrics, {
            timestamp: Date.now(),
            accuracy: currentAccuracy,
            wpm: gameStats.wpm,
            combo: gameStats.combo
          }]
        }));
        
        // NEW: Update adaptive settings based on performance
        updateAdaptiveSettings(true, currentAccuracy, gameStats.combo);
        
        // NEW: Update streak tracking
        updateStreakTracking(true, currentAccuracy, gameStats.wpm, gameStats.combo);
        
        // NEW: Trigger visual effects for successful hit (simplified)
        // Use word position for effects
        const gameAreaRect = gameAreaRef.current?.getBoundingClientRect();
        if (gameAreaRect) {
          const x = gameAreaRect.left + (matchingWord.lane / LANES) * gameAreaRect.width + (gameAreaRect.width / LANES) / 2;
          const y = gameAreaRect.top + (matchingWord.y / 100) * gameAreaRect.height;
          
          // Perfect timing effects
          const timingBonus = getTimingBonus(matchingWord);
          if (timingBonus >= 50) {
            createParticleExplosion(x, y, '#ffd700', 20); // MORE Gold particles
            triggerScreenShake(30); // INTENSE shake
            triggerBackgroundPulse('yellow', 0.8);
          } else if (timingBonus >= 25) {
            createParticleExplosion(x, y, '#00ffff', 16); // MORE Cyan particles
            triggerScreenShake(25); // STRONG shake
            triggerBackgroundPulse('cyan', 0.6);
          } else {
            createParticleExplosion(x, y, '#00ff00', 12); // MORE Green particles
            triggerScreenShake(20); // NOTICEABLE shake
            triggerBackgroundPulse('green', 0.5);
          }
          
          // Combo visual effects are now handled in the stats update
        }
        
        // No error - proceed normally
        handleWordType(matchingWord, true);
        
        // NEW: Handle sequential story progression
        handleSequentialWordCompletion(matchingWord.word);
        
        // Enhanced visual feedback for high-speed typing
        if (gameStats.wpm > 80) {
          createBonusEffect('🚀 SPEED DEMON!', matchingWord.lane, matchingWord.y - 20);
        } else if (gameStats.wpm > 60) {
          createBonusEffect('⚡ FAST!', matchingWord.lane, matchingWord.y - 20);
        }
        
        setCurrentInput(''); // Clear input after successful match
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        
        // Clear timeout after successful match
        if (inputTimeoutRef.current) {
          clearTimeout(inputTimeoutRef.current);
          inputTimeoutRef.current = undefined;
        }
      }
    } else {
      // Check if the current input is definitely incorrect (no possible match)
      // This happens when user types a word that can't possibly match any visible word
      const isDefinitelyIncorrect = checkIfDefinitelyIncorrect(value, fallingWords);
      
      if (isDefinitelyIncorrect) {
        // Auto-clear incorrect input immediately
        setCurrentInput('');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        
        // Create poo effect for incorrect word
        const randomLane = Math.floor(Math.random() * LANES);
        createEffect('poo', randomLane);
        
        setGameStats(prev => ({
          ...prev,
          score: Math.max(0, prev.score - 25),
          poos: prev.poos + 1,
          combo: 0,
          totalWords: prev.totalWords + 1
        }));
      }
    }
  };

  // Handle Enter key for incorrect words
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      // Check if it doesn't match any visible falling word using the same logic as handleInputChange
      const hasMatch = fallingWords.some(w => {
        if (!w.typed && !w.missed && w.y >= 0 && w.y <= 100) {
          const normalizedInput = currentInput.toLowerCase().trim();
          const normalizedWord = w.word.toLowerCase();
          
          // Direct match
          if (normalizedWord === normalizedInput) return true;
          
          // Handle case where user types without spaces for words that have spaces
          if (normalizedWord.includes(' ')) {
            const noSpaceWord = normalizedWord.replace(/\s+/g, '');
            if (noSpaceWord === normalizedInput) return true;
          }
          
          // Handle case where user types with spaces for words that don't have spaces
          if (!normalizedWord.includes(' ') && normalizedInput.includes(' ')) {
            const noSpaceInput = normalizedInput.replace(/\s+/g, '');
            if (noSpaceInput === normalizedWord) return true;
          }
        }
        return false;
      });
      
      if (!hasMatch && fallingWords.length > 0) {
        // Wrong word typed - create poo effect in random lane
        const randomLane = Math.floor(Math.random() * LANES);
        createEffect('poo', randomLane);
        
        // Track error for AI analysis
        const closestWord = fallingWords.find(w => !w.typed && !w.missed && w.y >= 0 && w.y <= 100);
        if (closestWord) {
          setSessionData(prev => ({
            ...prev,
            errorPatterns: [...prev.errorPatterns, {
              word: closestWord.word,
              userInput: currentInput.trim(),
              errorType: 'spelling', // User pressed Enter on wrong word
              timestamp: Date.now()
            }]
          }));
        }
        
        setGameStats(prev => ({
          ...prev,
          score: Math.max(0, prev.score - 25),
          poos: prev.poos + 1,
          combo: 0,
          totalWords: prev.totalWords + 1,
          // Track incorrect word for AI analysis
          wordsIncorrect: [...prev.wordsIncorrect, {
            word: closestWord?.word || 'unknown',
            userInput: currentInput.trim(),
            timestamp: Date.now(),
            errorType: 'spelling' as const,
            difficulty: currentDifficulty,
            position: { lane: closestWord?.lane || 0, y: closestWord?.y || 0 }
          }]
        }));
      }
      
      // Clear both state and input field for both correct and incorrect words
      setCurrentInput('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      
      // Clear timeout after Enter key
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
        inputTimeoutRef.current = undefined;
      }
    }
  };

  // Game timer - tracks elapsed time and progressive difficulty
  useEffect(() => {
    console.log(`⚡ Timer useEffect starting - gameState: ${gameState}, difficulty: ${currentDifficulty}`);
    if (gameState !== 'playing') return;
    
    timerRef.current = setInterval(() => {
      setGameStats(prev => {
          const newElapsedTime = prev.elapsedTime + 1;
          console.log(`🕐 Timer tick: ${prev.elapsedTime} -> ${newElapsedTime}`);
        
        // Check for overwhelmed condition - multiple triggers
        // Note: We'll check this in a separate useEffect to avoid stale closure issues
        const totalAttempts = prev.totalWords;
        const recentAccuracy = totalAttempts > 0 ? (prev.correctWords / totalAttempts) * 100 : 100;
        const missedCount = prev.missedWords;
        
        // Update grace period countdown using ref to avoid useEffect restart
        if (recoveryGraceRef.current > 0) {
          recoveryGraceRef.current = Math.max(0, recoveryGraceRef.current - 1);
          setRecoveryGraceTime(recoveryGraceRef.current); // Update state for UI display if needed
        }

        // Performance-based overwhelmed detection - focus on accuracy and speed struggles
        // IMPORTANT: Use > not >= to ensure we don't trigger exactly at the minute mark
        // DISABLED during 30-second grace period after recovery
        const shouldTriggerOverwhelmed = recoveryGraceRef.current === 0 && (
          // Speed is getting too fast and accuracy is suffering
          (newElapsedTime > 60 && recentAccuracy < 25 && missedCount >= 10) ||   // AFTER 1 min: struggling with speed
          (newElapsedTime > 90 && recentAccuracy < 35 && missedCount >= 12) ||   // AFTER 1.5 min: still struggling
          (newElapsedTime > 120 && recentAccuracy < 40 && missedCount >= 15) ||  // AFTER 2 min: consistent struggle
          (newElapsedTime > 60 && recentAccuracy < 15 && missedCount >= 12) ||   // AFTER 1 min: very poor accuracy
          (newElapsedTime > 75 && missedCount >= 18)                             // AFTER 1:15: too many missed words
        );
        
        if (shouldTriggerOverwhelmed) {
          setGameState('overwhelmed');
          return { ...prev, elapsedTime: newElapsedTime };
        }
        
        // Progressive difficulty scaling every 30 seconds
        if (newElapsedTime % 30 === 0 && newElapsedTime > 0) {
          // Increase speed and spawn rate gradually
          const difficultyMultiplier = 1 + (Math.floor(newElapsedTime / 30) * 0.1);
          const newSpeed = Math.min(getCurrentConfig().speed * difficultyMultiplier, 2.0); // Cap at 2x speed
          const newSpawnRate = Math.max(getCurrentConfig().spawnRate / difficultyMultiplier, 800); // Minimum 800ms spawn rate
           
           setFallingWords(current => 
             current.map(word => ({ ...word, speed: newSpeed }))
           );
          
          // Update spawn rate for new interval (handled by useEffect)
          setCurrentSpawnRate(newSpawnRate);
          
          console.log(`🎮 Difficulty increased! Speed: ${newSpeed.toFixed(1)}, Spawn Rate: ${newSpawnRate}ms`);
        }
        
        // WPM calculation - only update when actively typing
        const wordsTyped = prev.charactersTyped / 5;
        const minutes = newElapsedTime / 60;
        let finalWPM = prev.wpm; // Keep current WPM if not actively typing
        
        // Only recalculate WPM if we have characters and it's been less than 3 seconds since last activity
        // This prevents WPM from dropping when user pauses
        const timeSinceLastActivity = newElapsedTime - (prev.lastTypingTime || 0);
        if (prev.charactersTyped > 0 && minutes > 0 && timeSinceLastActivity <= 3) {
          finalWPM = Math.round(wordsTyped / minutes);
          // Cap at realistic maximum
          finalWPM = Math.min(finalWPM, 120); // Reasonable max for a typing game
        }
        
        // Simple accuracy calculation
        let accuracy = 0;
        if (prev.totalWords > 0) {
          accuracy = Math.round((prev.correctWords / prev.totalWords) * 100 * 10) / 10; // Round to 1 decimal
          accuracy = Math.max(0, Math.min(100, accuracy)); // Keep between 0-100%
         }
        
        return {
          ...prev,
          elapsedTime: newElapsedTime,
          accuracy,
          wpm: finalWPM
        };
      });
    }, 1000);
    
    return () => {
        console.log(`🛑 Timer cleanup - gameState: ${gameState}, difficulty: ${currentDifficulty}`);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    }, [gameState]); // Removed currentDifficulty and recoveryGraceTime to prevent timer restarts

  // Note: Removed "too many words" trigger - overwhelmed should only be based on performance/accuracy
  // The main timer useEffect handles all overwhelmed conditions based on accuracy and missed words

  // Recovery countdown timer
  useEffect(() => {
    if (gameState !== 'recovering') return;
    
    if (recoveryCountdown > 0) {
      const timer = setTimeout(() => {
        setRecoveryCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Countdown finished, resume playing with 30-second grace period
      setGameState('playing');
      recoveryGraceRef.current = 30; // Set ref for timer logic
      setRecoveryGraceTime(30); // Set state for UI display
      
      // Focus input when recovering
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [gameState, recoveryCountdown]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    gameLoopRef.current = setInterval(() => {
      setFallingWords(prev => {
        const updated = prev.map(word => ({
          ...word,
          y: word.y + word.speed
        }));
        
        // Remove words that are off screen or typed
        const active = updated.filter(word => 
          word.y < 110 && !word.typed
        );
        
        // Mark missed words and update stats
        const withMissed = active.map(word => {
          if (word.y > TARGET_ZONE_Y + TARGET_ZONE_TOLERANCE && !word.missed && !word.typed) {
            // Check if the missed word matches current input - if so, clear input to prevent blocking
            const normalizedInput = currentInput.toLowerCase().trim();
            const normalizedWord = word.word.toLowerCase();
            
            const inputMatchesWord = normalizedWord === normalizedInput || 
              (normalizedWord.includes(' ') && normalizedWord.replace(/\s+/g, '') === normalizedInput) ||
              (normalizedInput.includes(' ') && normalizedInput.replace(/\s+/g, '') === normalizedWord);
            
            if (inputMatchesWord && normalizedInput.length > 0) {
              console.log('🚫 Auto-clearing input for missed word:', word.word);
              
              // Track missed word for AI analysis
              setSessionData(prev => ({
                ...prev,
                errorPatterns: [...prev.errorPatterns, {
                  word: word.word,
                  userInput: normalizedInput,
                  errorType: 'missed', // Word fell off screen while typing
                  timestamp: Date.now()
                }]
              }));
              
              setCurrentInput('');
              if (inputRef.current) {
                inputRef.current.value = '';
              }
              
              // Clear timeout when auto-clearing for missed word
              if (inputTimeoutRef.current) {
                clearTimeout(inputTimeoutRef.current);
                inputTimeoutRef.current = undefined;
              }
              
              // Give poo penalty for missing the word they were typing
              setEffects(prev => [...prev, {
                id: Date.now().toString(),
                type: 'poo',
                lane: word.lane
              }]);
              
              setGameStats(prev => ({
                ...prev,
                poos: prev.poos + 1
              }));
            }
            
            // Update game stats when word is missed
            setGameStats(prev => ({
              ...prev,
              totalWords: prev.totalWords + 1,
              missedWords: prev.missedWords + 1,
              // Track missed word for AI analysis
              wordsIncorrect: [...prev.wordsIncorrect, {
                word: word.word,
                userInput: normalizedInput,
                timestamp: Date.now(),
                errorType: 'missed' as const,
                difficulty: currentDifficulty,
                position: { lane: word.lane, y: word.y }
              }]
            }));
            return { ...word, missed: true };
          }
          return word;
        });
        
        return withMissed;
      });
      
      // Update words in target zone
      setTargetZoneWords(
        fallingWords.filter(word => 
          word.y >= TARGET_ZONE_Y - TARGET_ZONE_TOLERANCE &&
          word.y <= TARGET_ZONE_Y + TARGET_ZONE_TOLERANCE &&
          !word.typed && !word.missed
        )
      );
    }, 16); // ~60 FPS
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, fallingWords]);

  // Word spawning - one by one in left-to-right sentence flow
  useEffect(() => {
    console.log('🎮 Word spawning useEffect triggered. gameState:', gameState);
    if (gameState !== 'playing') return;
    
    console.log('🎮 Starting word spawning. Spawn rate:', currentSpawnRate);
    console.log('🔍 Current story available:', !!currentStoryRef.current);
    console.log('🔍 Current sentence:', currentSentenceRef.current);
    console.log('🔍 Current word in sentence:', currentWordInSentenceRef.current);
    
    const spawnWordInterval = () => {
      console.log('🎮 Interval triggered, spawning next word');
      
      // Check if story is available using ref
      const story = currentStoryRef.current;
      if (!story || !story.sentences || story.sentences.length === 0) {
        console.log('🎮 No story available in interval, waiting...');
        return;
      }
      
      // PERFECT SENTENCE COMPLETION LOGIC
      const sentenceIndex = currentSentenceRef.current;
      const wordIndex = currentWordInSentenceRef.current;
      
      // Check if we're done with all sentences
      if (sentenceIndex >= story.sentences.length) {
        console.log('🎉 All sentences completed! Chapter finished.');
        // Stop the interval to prevent overwhelming the game
        if (wordSpawnRef.current) {
          clearInterval(wordSpawnRef.current);
          wordSpawnRef.current = undefined;
        }
        
        // Trigger chapter completion logic
        if (!isChapterCompleteRef.current && !isGeneratingStory) {
          console.log('🎉 Chapter completed! Starting transition...');
          isChapterCompleteRef.current = true;
          setIsChapterComplete(true);
          
          // Update completed chapter number for UI
          setCompletedChapterNumber(currentChapter);
          
          // Set game state for chapter transition celebration
          setGameState('chapter-transition');
          
          // Check if this is the final chapter (5 chapters total)
          const chapterNum = currentChapter;
          if (chapterNum >= 5) {
            // Game complete! Final celebration
            setTimeout(() => {
              console.log('🏆 All 5 chapters completed! Game finished!');
              setGameState('complete');
              isChapterCompleteRef.current = false; // Reset flag
              setIsChapterComplete(false); // Reset flag
            }, 3000); // 3 second celebration for game completion
          } else {
            // Continue to next chapter
            setTimeout(() => {
              console.log('🎯 Chapter transition timeout fired. Loading chapter:', chapterNum + 1);
              loadNextChapter(chapterNum + 1); // Load pre-generated next chapter
              isChapterCompleteRef.current = false; // Reset flag
              setIsChapterComplete(false); // Reset flag
            }, 2000); // 2 second delay to show celebration
          }
        }
        return;
      }
      
      const currentSentence = story.sentences[sentenceIndex];
      if (!currentSentence || !currentSentence.words) {
        console.log('🚫 Invalid sentence');
        return;
      }
      
      // Check if we can start the next sentence
      if (!canStartNextSentenceRef.current) {
        console.log('⏳ Waiting for current sentence to complete before spawning more words...');
        return;
      }
      
      // Check if current sentence is fully spawned
      if (wordIndex >= currentSentence.words.length) {
        console.log('📝 All words from sentence', sentenceIndex + 1, 'have been spawned. Waiting for completion...');
        canStartNextSentenceRef.current = false; // Block further spawning until sentence completes
        
        // We'll check sentence completion in a separate effect that monitors fallingWords
        return;
      }
      
      // Get the actual word from the sentence
      const actualWord = currentSentence.words[wordIndex];
      
      console.log(`📝 SENTENCE ${sentenceIndex + 1}: Word ${wordIndex + 1}/${currentSentence.words.length} - "${actualWord}"`);
      
      // Use chapter-based difficulty
      const chapterNumber = story.chapterNumber || 1;
      const config = getChapterDifficulty(chapterNumber);
      
      // PERFECT LEFT-TO-RIGHT LANE ASSIGNMENT
      const selectedLane = wordIndex % LANES;
      
      console.log(`🎯 LANE ASSIGNMENT: Sentence ${sentenceIndex + 1}, Word ${wordIndex + 1} → Lane ${selectedLane}`);
      
      // Create the falling word
      const newWord = {
        id: `word-${Date.now()}-${Math.random()}`,
        word: actualWord,
        lane: selectedLane,
        y: -10,
        speed: config.speed,
        typed: false,
        missed: false,
        sentenceIndex: sentenceIndex
      };
      
      console.log('🎮 SPAWNING:', actualWord, 'in lane', selectedLane, '| Sentence:', sentenceIndex + 1, '| Word', wordIndex + 1, '/', currentSentence.words.length);
      
      setFallingWords(currentWords => [...currentWords, newWord]);
      
      // ADVANCE TO NEXT WORD IN SENTENCE
      currentWordInSentenceRef.current += 1;
      sentenceWordsSpawnedRef.current += 1;
      
      // Update global word index for stats
      currentWordIndexRef.current += 1;
      setCurrentWordIndex(currentWordIndexRef.current);
      
      setLastWordAppearTime(performance.now());
    };
    
    const intervalId = setInterval(spawnWordInterval, currentSpawnRate);
    wordSpawnRef.current = intervalId;
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameState, currentSpawnRate]); // Stable dependencies only

  // Monitor sentence completion - check if all words from current sentence are done
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const currentSentenceIndex = currentSentenceRef.current;
    const story = currentStoryRef.current;
    
    if (!story || currentSentenceIndex >= story.sentences.length) return;
    
    // Check if all words from current sentence are typed or missed
    const currentSentenceWords = fallingWords.filter(w => 
      w.sentenceIndex === currentSentenceIndex && !w.typed && !w.missed
    );
    
    if (currentSentenceWords.length === 0 && !canStartNextSentenceRef.current) {
      console.log('✅ SENTENCE', currentSentenceIndex + 1, 'FULLY COMPLETED! Enabling next sentence...');
      currentSentenceRef.current += 1; // Move to next sentence
      currentWordInSentenceRef.current = 0; // Reset word index
      sentenceWordsSpawnedRef.current = 0; // Reset spawned counter
      canStartNextSentenceRef.current = true; // Allow next sentence
    }
  }, [fallingWords, gameState]);

  // Toggle mute
  const toggleMute = () => {
    const wasMuted = isMuted;
    setIsMuted(!isMuted);
    
    if (wasMuted) {
      // Was muted, now unmuting - restart music based on current state
      if (gameState === 'playing') {
        const musicTrack = currentDifficulty as 'rookie' | 'rockstar' | 'virtuoso' | 'legend';
        playMusic(musicTrack);
      } else if (gameState === 'failed') {
        playMusic('failure');
      }
      // Don't start music for menu, complete, or other states
    } else {
      // Was unmuted, now muting - stop music
      stopMusic();
    }
  };

  // NEW: Preview music function with countdown
  const previewMusic = async (type: 'male' | 'female') => {
    if (isPreviewing) return;
    
    // Stop any existing preview audio first
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }
    
    setIsPreviewing(true);
    setPreviewingGender(type);
    setPreviewCountdown(10);
    const newPreviewAudio = new Audio(`/typing hero songs/${type === 'male' ? 'male' : 'female'}.mp3`);
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

  // NEW: Volume control functions
  const toggleVolumeControl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    // Only toggle the volume control visibility, don't change mute state
    setShowVolumeControl(!showVolumeControl);
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    
    // Update music volume if playing
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = newVolume;
    }
  };

  // Keep input focused during gameplay
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      const focusInterval = setInterval(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 1000); // Check every second

      return () => clearInterval(focusInterval);
    }
  }, [gameState]);

  // Force green border styling
  useEffect(() => {
    if (gameState === 'playing') {
      const style = document.createElement('style');
      style.textContent = `
        input[data-typing-input="true"] {
          border-color: #4ade80 !important;
          border: 3px solid #4ade80 !important;
        }
        input[data-typing-input="true"]:focus {
          border-color: #4ade80 !important;
          border: 3px solid #4ade80 !important;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3) !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [gameState]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (wordSpawnRef.current) clearInterval(wordSpawnRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      stopMusic();
    };
  }, [stopMusic]);

  // NEW: Particle animation system
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animateParticles = () => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.2, // gravity
          life: particle.life - 1,
          size: particle.size * 0.98 // shrink over time
        }))
        .filter(particle => particle.life > 0)
      );
    };

    const animationId = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationId);
  }, [particles]);

  // NEW: Screen shake animation
  useEffect(() => {
    if (screenShake.intensity <= 0) return;
    
    const shakeAnimation = () => {
      setScreenShake(prev => ({
        x: (Math.random() - 0.5) * prev.intensity,
        y: (Math.random() - 0.5) * prev.intensity,
        intensity: prev.intensity * 0.9 // decay
      }));
    };

    const animationId = requestAnimationFrame(shakeAnimation);
    return () => cancelAnimationFrame(animationId);
  }, [screenShake]);

  // NEW: Background pulse animation
  useEffect(() => {
    if (backgroundPulse.intensity <= 0) return;
    
    const pulseAnimation = () => {
      setBackgroundPulse(prev => ({
        ...prev,
        intensity: prev.intensity * 0.95 // fade out
      }));
    };

    const animationId = requestAnimationFrame(pulseAnimation);
    return () => cancelAnimationFrame(animationId);
  }, [backgroundPulse]);

  // NEW: Helper functions for hidden metrics
  const getWordCategory = (word: string) => {
    if (!word) return 'unknown';
    
    const categories = {
      'customer_service': ['customer', 'service', 'support', 'help', 'assist', 'call', 'chat'],
      'technical': ['troubleshoot', 'system', 'network', 'database', 'configuration', 'update'],
      'billing': ['billing', 'payment', 'invoice', 'account', 'transaction', 'refund'],
      'quality': ['quality', 'standard', 'metric', 'compliance', 'review', 'audit'],
      'communication': ['email', 'phone', 'message', 'respond', 'follow', 'escalate']
    };
    
    for (const [category, words] of Object.entries(categories)) {
      if (words.some(w => word.toLowerCase().includes(w))) return category;
    }
    return 'general';
  };

  // NEW: Get words from a specific category
  const getCategoryWords = (category: string, allWords: string[]) => {
    const categoryKeywords = {
      'customer_service': ['customer', 'service', 'support', 'help', 'assist', 'call', 'chat'],
      'technical': ['troubleshoot', 'system', 'network', 'database', 'configuration', 'update'],
      'billing': ['billing', 'payment', 'invoice', 'account', 'transaction', 'refund'],
      'quality': ['quality', 'standard', 'metric', 'compliance', 'review', 'audit'],
      'communication': ['email', 'phone', 'message', 'respond', 'follow', 'escalate']
    };
    
    const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
    return allWords.filter(word => 
      keywords.some(keyword => word.toLowerCase().includes(keyword))
    );
  };

  const calculateStressLevel = (accuracy: number, combo: number) => {
    const baselineAccuracy = 0.85;
    const comboFactor = combo > 10 ? 'high_pressure' : combo > 5 ? 'medium_pressure' : 'low_pressure';
    
    if (accuracy < baselineAccuracy - 0.15) return 'high_stress';
    if (accuracy < baselineAccuracy - 0.05) return 'medium_stress';
    return 'low_stress';
  };

  // NEW: Calculate enhanced metrics for business intelligence
  const calculateEnhancedMetrics = (hiddenMetrics: any, gameStats: any) => {
    const reactionTimes = hiddenMetrics.reactionTimes.filter((rt: number) => rt > 0);
    const avgReactionTime = reactionTimes.length > 0 
      ? reactionTimes.reduce((a: number, b: number) => a + b, 0) / reactionTimes.length 
      : 0;
    
    const errorPatterns = hiddenMetrics.errorPatterns || [];
    const vocabularyPerf = hiddenMetrics.vocabularyPerformance || {};
    
    // Calculate advanced metrics
    const consistency = calculateConsistency(reactionTimes);
    const stressResponse = analyzeStressResponse(errorPatterns);
    const learningCurve = analyzeLearningProgression(hiddenMetrics.focusMetrics);
    const vocabularyStrengths = findTopVocabularyAreas(vocabularyPerf);
    
    return {
      // Technical Performance
      avg_reaction_time: Math.round(avgReactionTime),
      reaction_consistency: Math.round(consistency * 100) / 100,
      error_recovery_speed: calculateRecoverySpeed(errorPatterns),
      
      // Cognitive Performance
      learning_velocity: Math.round(learningCurve.improvement * 100) / 100,
      adaptability_score: calculateAdaptability(errorPatterns),
      focus_sustainability: calculateFocusScore(hiddenMetrics.focusMetrics),
      
      // Workplace Readiness
      stress_management: stressResponse.resilience,
      performance_under_pressure: stressResponse.consistency,
      persistence_indicator: gameStats.totalWords > 15 ? 'high' : 'medium',
      
      // Industry Fitness
      vocabulary_strengths: vocabularyStrengths,
      bpo_readiness_score: calculateBPOReadiness(vocabularyStrengths, stressResponse),
      role_indicators: generateRoleIndicators(vocabularyPerf, stressResponse),
      
      // Meta Information
      metrics_version: '1.0',
      collected_at: new Date().toISOString(),
      session_quality: reactionTimes.length > 10 ? 'high' : 'medium'
    };
  };

  // Helper calculation functions for enhanced metrics
  const calculateConsistency = (values: number[]) => {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return mean > 0 ? Math.max(0, 1 - (stdDev / mean)) : 0;
  };

  const analyzeStressResponse = (errorPatterns: any[]) => {
    const stressLevels = errorPatterns.map(ep => ep.stressLevel);
    const highStressErrors = stressLevels.filter(sl => sl === 'high_stress').length;
    const totalErrors = errorPatterns.filter(ep => ep.type === 'incorrect' || ep.type === 'simulated_error').length;
    
    return {
      resilience: highStressErrors === 0 ? 'high' : highStressErrors < 3 ? 'medium' : 'low',
      consistency: totalErrors < 5 ? 'high' : totalErrors < 10 ? 'medium' : 'low'
    };
  };

  const analyzeLearningProgression = (focusMetrics: any[]) => {
    if (focusMetrics.length < 5) return { improvement: 0.5 };
    
    const firstHalf = focusMetrics.slice(0, Math.floor(focusMetrics.length / 2));
    const secondHalf = focusMetrics.slice(Math.floor(focusMetrics.length / 2));
    
    const firstAvgWpm = firstHalf.reduce((sum, m) => sum + (m.wpm || 0), 0) / firstHalf.length;
    const secondAvgWpm = secondHalf.reduce((sum, m) => sum + (m.wpm || 0), 0) / secondHalf.length;
    
    const improvement = firstAvgWpm > 0 ? (secondAvgWpm - firstAvgWpm) / firstAvgWpm : 0;
    return { improvement: Math.max(-1, Math.min(2, improvement)) };
  };

  const findTopVocabularyAreas = (vocabularyPerf: any) => {
    const areas = Object.entries(vocabularyPerf)
      .filter(([_, score]) => (score as number) > 2)
      .sort(([_, a], [__, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([area, _]) => area);
    
    return areas.length > 0 ? areas : ['general'];
  };

  const calculateRecoverySpeed = (errorPatterns: any[]) => {
    // Simple recovery speed calculation based on error spacing
    const errors = errorPatterns.filter(ep => ep.type !== 'correct');
    if (errors.length < 2) return 'fast';
    
    const avgTimeBetweenErrors = errors.length > 1 
      ? (errors[errors.length - 1].timestamp - errors[0].timestamp) / (errors.length - 1)
      : 10000;
    
    return avgTimeBetweenErrors > 5000 ? 'fast' : avgTimeBetweenErrors > 2000 ? 'medium' : 'slow';
  };

  const calculateAdaptability = (errorPatterns: any[]) => {
    const totalPatterns = errorPatterns.length;
    const correctPatterns = errorPatterns.filter(ep => ep.type === 'correct').length;
    return totalPatterns > 0 ? Math.round((correctPatterns / totalPatterns) * 100) : 50;
  };

  const calculateFocusScore = (focusMetrics: any[]) => {
    if (focusMetrics.length === 0) return 50;
    
    const consistentAccuracy = focusMetrics.every(m => Math.abs(m.accuracy - 0.85) < 0.1);
    const consistentWpm = focusMetrics.length > 1 && 
      Math.abs(focusMetrics[focusMetrics.length - 1].wpm - focusMetrics[0].wpm) < 10;
    
    return consistentAccuracy && consistentWpm ? 85 : 
           consistentAccuracy || consistentWpm ? 70 : 50;
  };

  const calculateBPOReadiness = (vocabStrengths: string[], stressResponse: any) => {
    let score = 50; // baseline
    
    // Boost for customer service vocabulary
    if (vocabStrengths.includes('customer_service')) score += 20;
    if (vocabStrengths.includes('communication')) score += 15;
    if (vocabStrengths.includes('technical')) score += 10;
    
    // Boost for stress management
    if (stressResponse.resilience === 'high') score += 15;
    else if (stressResponse.resilience === 'medium') score += 5;
    
    return Math.min(100, Math.max(0, score));
  };

  const generateRoleIndicators = (vocabularyPerf: any, stressResponse: any) => {
    const indicators = [];
    
    if (vocabularyPerf.customer_service > 3) indicators.push('customer_support');
    if (vocabularyPerf.technical > 3) indicators.push('technical_support');
    if (vocabularyPerf.billing > 2) indicators.push('billing_specialist');
    if (stressResponse.resilience === 'high') indicators.push('crisis_management');
    
    return indicators.length > 0 ? indicators : ['general_bpo'];
  };

  // NEW: Visual effects functions
  const createParticleExplosion = (x: number, y: number, color: string, count: number = 8) => {
    console.log('🎆 Creating particle explosion:', { x, y, color, count }); // DEBUG
    const newParticles: Array<{
      id: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      life: number;
      maxLife: number;
    }> = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 12 + Math.random() * 8, // MUCH BIGGER particles
        life: 120 + Math.random() * 60, // LONGER lasting
        maxLife: 120 + Math.random() * 60
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    console.log('✨ Total particles:', newParticles.length); // DEBUG
  };

  const triggerScreenShake = (intensity: number = 10) => {
    setScreenShake({ x: 0, y: 0, intensity });
  };

  const triggerBackgroundPulse = (color: string, intensity: number = 0.3) => {
    setBackgroundPulse({ color, intensity });
  };

  const updateComboVisual = (combo: number) => {
    const scale = 1 + Math.min(combo * 0.05, 0.5);
    const glow = Math.min(combo * 0.1, 1);
    setComboVisual({ scale, glow });

    // Enhanced streak effects
    if (combo >= 10) {
      // Hot streak! Add screen shake and background pulse
      triggerScreenShake(15);
      triggerBackgroundPulse('#fbbf24', 0.3); // Golden glow
      
      // Create bonus text effect
      const randomLane = Math.floor(Math.random() * LANES);
      if (combo === 10) {
        createBonusEffect('🔥 HOT STREAK! 🔥', randomLane, 50);
      } else if (combo === 20) {
        createBonusEffect('🚀 ON FIRE! 🚀', randomLane, 50);
      } else if (combo === 30) {
        createBonusEffect('⚡ LEGENDARY! ⚡', randomLane, 50);
      } else if (combo % 10 === 0) {
        createBonusEffect(`🎸 ${combo}x COMBO! 🎸`, randomLane, 50);
      }
    }
  };

  // NEW: INTELLIGENT ADAPTIVE SYSTEM with announcements
  const updateAdaptiveSettings = (isCorrect: boolean, currentAccuracy: number, combo: number) => {
    const now = Date.now();
    
    // Only update every 2 seconds for more responsive adaptation
    if (now - adaptiveSettings.lastPerformanceCheck < 2000) return;
    
    setAdaptiveSettings(prev => {
      let newSettings = { ...prev };
      
      // Track consecutive successes/failures
      if (isCorrect) {
        newSettings.consecutiveSuccesses++;
        newSettings.consecutiveFailures = 0;
      } else {
        newSettings.consecutiveFailures++;
        newSettings.consecutiveSuccesses = 0;
      }
      
      // PHASE-BASED ADAPTATION
      switch (prev.assessmentPhase) {
        case 'baseline':
          // Learning player's baseline - start slow and assess
          if (currentAccuracy > 0.8 && newSettings.consecutiveSuccesses >= 5) {
            announcePhaseChange("Nice! Getting warmed up! Let's try some BPO terms...");
            newSettings.assessmentPhase = 'finding_speed';
            newSettings.currentSpeedMultiplier = 0.8;
          } else if (currentAccuracy < 0.5) {
            // Player struggling with basics - stay slow
            newSettings.currentSpeedMultiplier = Math.max(0.4, prev.currentSpeedMultiplier - 0.1);
            if (now - prev.lastAnnouncement > 10000) {
              announcePhaseChange("Take your time! Finding your rhythm...");
              newSettings.lastAnnouncement = now;
            }
          }
          break;
          
        case 'finding_speed':
          // Finding optimal speed
          if (currentAccuracy > 0.85 && combo > 5) {
            // Speed up gradually
            newSettings.currentSpeedMultiplier = Math.min(1.2, prev.currentSpeedMultiplier + 0.1);
            if (newSettings.currentSpeedMultiplier >= 1.0 && !prev.playerSpeedFound) {
              announcePhaseChange("Great! You're hitting your stride! Ready for professional terms?");
              newSettings.assessmentPhase = 'optimal';
              newSettings.playerSpeedFound = true;
              newSettings.optimalSpeed = newSettings.currentSpeedMultiplier;
            }
          } else if (currentAccuracy < 0.7 || newSettings.consecutiveFailures >= 3) {
            // Slow down if struggling
            newSettings.currentSpeedMultiplier = Math.max(0.6, prev.currentSpeedMultiplier - 0.1);
            if (now - prev.lastAnnouncement > 8000) {
              announcePhaseChange("Let me slow this down a bit...");
              newSettings.lastAnnouncement = now;
            }
          }
          break;
          
        case 'optimal':
          // Found their speed - maintain and fine-tune
          if (currentAccuracy > 0.9 && combo > 8) {
            announcePhaseChange("Excellent! You're crushing it! Let's test your limits...");
            newSettings.assessmentPhase = 'challenge';
            newSettings.currentSpeedMultiplier = Math.min(1.5, prev.currentSpeedMultiplier + 0.2);
          } else if (currentAccuracy < 0.75) {
            // Return to optimal speed
            newSettings.currentSpeedMultiplier = prev.optimalSpeed;
            if (now - prev.lastAnnouncement > 8000) {
              announcePhaseChange("Back to your sweet spot!");
              newSettings.lastAnnouncement = now;
            }
          }
          break;
          
        case 'challenge':
          // Testing limits
          if (currentAccuracy < 0.7) {
            announcePhaseChange("Perfect! We found your limits. This is your optimal challenge level!");
            newSettings.assessmentPhase = 'optimal';
            newSettings.currentSpeedMultiplier = prev.optimalSpeed * 1.1; // Slightly above optimal
          }
          break;
      }
      
      return {
        ...newSettings,
        lastPerformanceCheck: now
      };
    });
  };
  
  // NEW: Announce phase changes
  const announcePhaseChange = (message: string) => {
    console.log('📢 ANNOUNCEMENT:', message); // DEBUG
    setCurrentAnnouncement(message);
    
    // Clear announcement after 3 seconds
    setTimeout(() => {
      setCurrentAnnouncement(null);
    }, 3000);
  };

  // NEW: Smart streak tracking and achievements
  const updateStreakTracking = (isCorrect: boolean, accuracy: number, wpm: number, combo: number) => {
    setStreakData(prev => {
      let newCurrentStreak = prev.currentStreak;
      let newBestStreak = prev.bestStreak;
      let newAchievements = [...prev.achievements];
      
      if (isCorrect) {
        newCurrentStreak++;
        newBestStreak = Math.max(newBestStreak, newCurrentStreak);
        
        // Achievement triggers
        if (newCurrentStreak === 10 && !newAchievements.includes('streak_10')) {
          newAchievements.push('streak_10');
          createBonusEffect('🏆 10 STREAK!', 2, 50);
        } else if (newCurrentStreak === 20 && !newAchievements.includes('streak_20')) {
          newAchievements.push('streak_20');
          createBonusEffect('🎯 20 STREAK!', 2, 50);
        } else if (wpm > 60 && !newAchievements.includes('speed_demon')) {
          newAchievements.push('speed_demon');
          createBonusEffect('⚡ SPEED DEMON!', 2, 50);
        } else if (accuracy > 95 && combo > 5 && !newAchievements.includes('precision_master')) {
          newAchievements.push('precision_master');
          createBonusEffect('🎯 PRECISION MASTER!', 2, 50);
        }
      } else {
        newCurrentStreak = 0; // Reset streak on error
      }
      
      return {
        ...prev,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        achievements: newAchievements
      };
    });
  };

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
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Shared Results</h2>
              <p className="text-gray-300">Someone shared their Typing Hero achievement!</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {sharedResults.score.toLocaleString()} points
                </div>
                <div className="text-sm text-gray-300">Total Score</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xl font-bold text-green-400">{sharedResults.wpm} WPM</div>
                  <div className="text-xs text-gray-300">Words Per Minute</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xl font-bold text-blue-400">{sharedResults.accuracy}%</div>
                  <div className="text-xs text-gray-300">Accuracy</div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-lg font-bold text-orange-400">{sharedResults.longestStreak} streak</div>
                <div className="text-xs text-gray-300">Longest Streak</div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-300">Difficulty: <span className="text-purple-400 font-semibold capitalize">{sharedResults.difficulty}</span></div>
                <div className="text-xs text-gray-400">Completed: {new Date(sharedResults.timestamp).toLocaleDateString()}</div>
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
                  setGameState('menu');
                  // Clear URL parameters
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Try to Beat It!
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Hidden audio elements */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEgCj2a4OwPPgEEQJvQ8t2RQgoMX7zS8dlUIAwXZr7n7qhVEwdAXbzS8NxTHwMFPZnK8N+Ja" type="audio/wav" />
      </audio>
      
      {/* NEW: Custom music audio element */}
      <audio ref={musicAudioRef} preload="auto" />
      

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
                  if (gameState === 'playing' || gameState === 'paused' || gameState === 'ready') {
                    setShowExitDialog(true);
                  } else {
                    router.back();
                  }
                }}
                className="mr-6 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <div className="relative">
                  <Guitar className="h-16 w-16 text-green-400 mr-6 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">🎵</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Typing Hero
                  </h1>
                  <p className="text-gray-300 text-lg">🎵 Experience the ultimate typing challenge!</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-semibold">Lightning Speed</span>
                    </div>
                    <div className="flex items-center gap-2 bg-cyan-500/20 rounded-full px-3 py-1">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 text-sm font-semibold">Precision</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-500/20 rounded-full px-3 py-1">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 text-sm font-semibold">Rhythm Mastery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Game Controls */}
            {(gameState === 'ready' || gameState === 'playing' || gameState === 'paused') && (
              <div className="flex items-center gap-4">
                {gameState === 'playing' && (
                  <Button
                    variant="outline"
                    onClick={togglePause}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                {gameState === 'paused' && (
                  <Button
                    variant="outline"
                    onClick={togglePause}
                    disabled={countdown !== null}
                    className={`border-green-500/50 text-green-400 hover:bg-green-500/10 ${countdown !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {countdown !== null ? (countdown === 0 ? 'GO!' : `Resuming in ${countdown}...`) : 'Resume'}
                  </Button>
                )}
                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleVolumeControl}
                    className="border-white/20 text-white hover:bg-white/10 bg-black/50 backdrop-blur-sm"
                    title="Volume Control"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  {/* Volume Control Slider */}
                  {showVolumeControl && (
                    <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2 backdrop-blur-sm">
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
              </div>
            )}
          </motion.div>

          {/* Enhanced Game Menu */}
          {gameState === 'menu' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-6 mb-12"
              >
                <div className="relative">
                  <motion.h1
                    animate={{ 
                      backgroundImage: [
                        "linear-gradient(45deg, #10b981, #06b6d4)",
                        "linear-gradient(45deg, #06b6d4, #8b5cf6)",
                        "linear-gradient(45deg, #8b5cf6, #f59e0b)",
                        "linear-gradient(45deg, #f59e0b, #10b981)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent mb-4"
                    style={{
                      backgroundImage: "linear-gradient(45deg, #10b981, #06b6d4)",
                    }}
                  >
                    TYPING HERO
                  </motion.h1>
                </div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
                >
                  Master your typing skills through <span className="text-green-400 font-semibold">personalized AI-generated stories</span> that adapt to your career journey
                </motion.p>


                {/* Additional Banner Info */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center items-center gap-6 mt-6 text-sm"
                >
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-green-300">AI-Powered Stories</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    <span className="text-blue-300">4 Difficulty Levels</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                    <span className="text-purple-300">Real-time Analytics</span>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 md:flex md:justify-center gap-6 md:gap-8 mt-8"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20"
                  >
                    <div className="text-3xl font-bold text-cyan-400">AI</div>
                    <div className="text-sm text-gray-400">Powered</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20"
                  >
                    <div className="text-3xl font-bold text-green-400">∞</div>
                    <div className="text-sm text-gray-400">Stories</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20"
                  >
                    <div className="text-3xl font-bold text-purple-400">4</div>
                    <div className="text-sm text-gray-400">Levels</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20"
                  >
                    <div className="text-3xl font-bold text-orange-400">🎵</div>
                    <div className="text-sm text-gray-400">Music</div>
                  </motion.div>
                </motion.div>
              </motion.div>
              {/* How to Play Card - Full width container */}
              <div className="w-full">
                <Card className="glass-card border-white/10 bg-gradient-to-br from-green-500/10 to-cyan-500/10 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">How to Play</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-400 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">🎵 Choose Your Soundtrack</h4>
                          <p className="text-gray-300 text-sm">Select between Male Vocals (Words Per Minute Warrior) or Female Vocals (Keys to My Dreams) to set the perfect mood for your typing session.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-400 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">⌨️ Type the Falling Words</h4>
                          <p className="text-gray-300 text-sm">Words fall from the top of the screen. Type them accurately before they hit the bottom to score points!</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-400 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">🎯 Hit the Perfect Notes</h4>
                          <p className="text-gray-300 text-sm">Maintain high accuracy to keep the music playing. Miss too many words and the music stops!</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-400 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">🏆 Become a Legend</h4>
                          <p className="text-gray-300 text-sm">Master the typing challenge and achieve the highest WPM scores to become a typing legend!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-green-400" />
                      <h4 className="text-lg font-semibold text-white">💡 Pro Tip</h4>
                    </div>
                    <p className="text-green-200 text-sm">Focus on accuracy over speed! The game rewards precision. Start with Rookie mode to learn the BPO vocabulary, then work your way up to Legend status.</p>
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* Interactive Game Setup */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Difficulty Selection */}
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
                        Choose Your Challenge Level
                      </CardTitle>
                      <p className="text-gray-300">Each level has different word complexity, falling speed, and spawn rates</p>
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mt-3">
                        <p className="text-blue-300 text-sm">
                          <span className="font-semibold">💡 How it works:</span> Higher difficulties use more complex words, faster falling speeds, and quicker word spawning. Your performance automatically adapts the AI story generation!
                        </p>
                    </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['rookie', 'rockstar', 'virtuoso', 'legend'] as DifficultyLevel[]).map((difficulty, index) => {
                          const config = BPO_VOCABULARY[difficulty];
                          const isSelected = currentDifficulty === difficulty;
                          const isUnlocked = isDifficultyUnlocked(difficulty);
                          const status = getDifficultyStatus(difficulty);
                          
                          const getDifficultyGradient = (diff: DifficultyLevel, selected: boolean) => {
                            if (selected) return 'bg-gradient-to-r from-green-500 to-cyan-500 shadow-xl shadow-green-500/30 border-green-400';
                            
                            switch (diff) {
                              case 'rookie': return 'border-green-400/30 hover:border-green-400/60 hover:bg-green-500/5';
                              case 'rockstar': return 'border-blue-400/30 hover:border-blue-400/60 hover:bg-blue-500/5';
                              case 'virtuoso': return 'border-purple-400/30 hover:border-purple-400/60 hover:bg-purple-500/5';
                              case 'legend': return 'border-orange-400/30 hover:border-orange-400/60 hover:bg-orange-500/5';
                              default: return 'border-white/20 hover:border-white/40';
                            }
                          };
                          
                          return (
                            <motion.div
                              key={difficulty}
                              initial={{ y: 30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1 + index * 0.1 }}
                              whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                              whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
                              className="relative"
                            >
                              {/* Status Badge */}
                              {status === 'recommended' && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-lg"
                                >
                                  ⭐ Recommended
                                </motion.div>
                              )}
                              {status === 'advanced' && (
                                <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                                  🚀 Advanced
                         </div>
                              )}
                              
                              <Button
                                variant={isSelected ? 'default' : 'outline'}
                                onClick={() => isUnlocked && setCurrentDifficulty(difficulty)}
                                disabled={!isUnlocked}
                                className={`
                                  w-full h-28 p-4 relative overflow-hidden transition-all duration-300 text-white
                                  ${getDifficultyGradient(difficulty, isSelected)}
                                `}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="flex items-center justify-between w-full relative z-10">
                                  <div className="text-left flex-1">
                                    <div className="font-bold text-lg flex items-center gap-2 mb-1">
                                      <span className="text-3xl">🎵</span>
                                      <div>
                                        <div>{config.displayName}</div>
                                        <div className="text-xs opacity-70 font-normal">
                                          {difficulty === 'rookie' && 'Perfect for beginners'}
                                          {difficulty === 'rockstar' && 'Balanced challenge'}
                                          {difficulty === 'virtuoso' && 'For experienced typists'}
                                          {difficulty === 'legend' && 'Ultimate challenge'}
                       </div>
                     </div>
                         </div>
                                    <div className="text-xs opacity-80 bg-black/20 rounded px-2 py-1 inline-block">
                                      Speed: {config.speed}x • Words every {config.spawnRate/1000}s • {config.bpm} BPM
                       </div>
                     </div>
                                  {!isUnlocked && (
                                    <Lock className="w-5 h-5 opacity-50 ml-2" />
                                  )}
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-7 h-7 bg-white rounded-full flex items-center justify-center ml-2"
                                    >
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    </motion.div>
                                  )}
                   </div>
                              </Button>
                            </motion.div>
                          );
                        })}
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Music & Quick Start */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-6"
                >
                  {/* Music Selection Card */}
                  <Card className="glass-card border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                         <span className="text-white text-lg">🎵</span>
                       </div>
                        Music Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 gap-3">
                       <div className="space-y-2">
                         <Button
                           variant={musicGender === 'male' ? 'default' : 'outline'}
                           onClick={() => setMusicGender('male')}
                           className={`${musicGender === 'male' 
                             ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                             : 'border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400/70'
                           } w-full h-16 md:h-20 transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
                         >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                           <div className="text-center relative z-10">
                             <div className="text-lg font-bold flex items-center justify-center gap-2">
                               <span className="text-2xl">♂️</span>
                               Male Vocals
                             </div>
                             <div className="text-xs opacity-80 font-medium">WORDS PER MINUTE WARRIOR</div>
                           </div>
                         </Button>
                         <Button
                           onClick={() => previewMusic('male')}
                           disabled={isPreviewing}
                           variant="outline"
                           size="sm"
                           className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10 disabled:opacity-50"
                         >
                           {isPreviewing && previewingGender === 'male' ? (
                             <div className="flex items-center gap-2">
                               <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
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
                       
                       <div className="space-y-2">
                         <Button
                           variant={musicGender === 'female' ? 'default' : 'outline'}
                           onClick={() => setMusicGender('female')}
                           className={`${musicGender === 'female' 
                             ? 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg shadow-pink-500/30' 
                             : 'border-pink-500/50 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400/70'
                           } w-full h-16 md:h-20 transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
                         >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                           <div className="text-center relative z-10">
                             <div className="text-lg font-bold flex items-center justify-center gap-2">
                               <span className="text-2xl">♀️</span>
                               Female Vocals
                             </div>
                             <div className="text-xs opacity-80 font-medium">Keys to My Dreams</div>
                           </div>
                         </Button>
                         <Button
                           onClick={() => previewMusic('female')}
                           disabled={isPreviewing}
                           variant="outline"
                           size="sm"
                           className="w-full border-pink-500/30 text-pink-300 hover:bg-pink-500/10 disabled:opacity-50"
                         >
                           {isPreviewing && previewingGender === 'female' ? (
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
                     </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="glass-card border-white/10 bg-gradient-to-br from-green-500/10 to-cyan-500/10 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                   </div>
                        Ready to Play?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Start Game Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className="w-full h-16 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold text-xl shadow-xl shadow-green-500/30 relative overflow-hidden group"
                          onClick={() => startGame(currentDifficulty)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <div className="relative z-10 flex items-center justify-center gap-3">
                            <Play className="h-6 w-6" />
                            <span>🚀 START TYPING</span>
                          </div>
                        </Button>
                      </motion.div>

                      {/* Demo Button */}
                     <Button
                       variant="outline"
                        className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/70 font-bold py-3 h-12 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                       onClick={() => setShowDemoModal(true)}
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                       <div className="relative z-10 flex items-center justify-center gap-3">
                          <Eye className="h-5 w-5" />
                          <span>👁️ Watch Demo</span>
                       </div>
                     </Button>

                     {/* Generate New Story Button - disabled if story exists */}
                     <Button
                       variant="outline"
                       className={`w-full font-bold py-3 h-12 transition-all duration-300 relative overflow-hidden group ${
                         completeStory 
                           ? 'border-gray-500/30 text-gray-500 cursor-not-allowed opacity-60' 
                           : 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400/70 hover:scale-105'
                       }`}
                       onClick={regenerateCompleteStory}
                       disabled={isGeneratingStory || completeStory}
                     >
                       {!completeStory && (
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                       )}
                       <div className="relative z-10 flex items-center justify-center gap-3">
                         <RotateCcw className="h-5 w-5" />
                         <span>
                           {isGeneratingStory 
                             ? '🔄 Generating...' 
                             : completeStory 
                               ? '✅ Story Ready' 
                               : '✨ Generate Story'
                           }
                         </span>
                       </div>
                     </Button>
                     
                     {/* Note when story exists */}
                     {completeStory && (
                       <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                         <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                           <CheckCircle className="h-4 w-4" />
                           <span>You already have your story generated!</span>
                         </div>
                         <p className="text-green-300 text-xs mt-1">
                           Click "Start Typing" to play with your personalized story.
                         </p>
                       </div>
                     )}
                 </CardContent>
              </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

      {/* Story Generation State with Flashing Words */}
      {gameState === 'generating' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 space-y-6"
        >
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-4">
              <PacmanLoader 
                color="#fbbf24" 
                size={60}
                margin={4}
              />
            </div>
            <h3 className="text-2xl font-bold text-white text-center">
              AI is generating your Typing Hero story...
            </h3>
            <p className="text-gray-400 max-w-md text-center mx-auto">
              Creating a personalized career journey story based on your profile. This will take a few seconds.
            </p>
            
            {/* Flashing Story Words Preview */}
            <div className="mt-8 space-y-4">
              <p className="text-sm text-cyan-400 uppercase tracking-wider">Preview Words</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {['success', 'ambition', 'growth', 'opportunity', 'excellence', 'achievement', 'progress', 'determination'].map((word, index) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                      scale: [0.8, 1, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      delay: index * 0.3,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full text-white text-sm border border-purple-400/30"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                These words might appear in your personalized story...
              </p>
            </div>
            
            {currentStory && (
              <div className="text-sm text-cyan-400 bg-cyan-400/10 rounded-lg p-3 border border-cyan-400/20">
                ✨ Story Title: "{currentStory.title}"
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Chapter Transition State */}
      {gameState === 'chapter-transition' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 space-y-6"
        >
          {/* Chapter Complete Celebration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Chapter {completedChapterNumber} Complete!
            </h2>
            <p className="text-xl text-gray-300 mb-4">
              {completedChapterNumber && completedChapterNumber >= 5 
                ? "🏆 INCREDIBLE! You've completed all 5 chapters! Calculating final results..." 
                : "Excellent work! Preparing your next challenge..."
              }
            </p>
            
            {/* Quick Stats */}
            <div className="flex space-x-6 text-center">
              <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{gameStats.wpm}</div>
                <div className="text-sm text-green-300">WPM</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">{gameStats.accuracy.toFixed(0)}%</div>
                <div className="text-sm text-blue-300">Accuracy</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">{gameStats.correctWords}</div>
                <div className="text-sm text-purple-300">Words</div>
              </div>
            </div>
          </motion.div>

          {/* Progress Animation */}
          <motion.div
            className="flex space-x-2"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              />
            ))}
          </motion.div>

          <motion.p
            className="text-lg text-gray-400 text-center max-w-md"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {completedChapterNumber && completedChapterNumber >= 5 
              ? "🏆 Preparing your final victory celebration..." 
              : "🤖 AI is crafting your next personalized story chapter..."
            }
          </motion.p>
          
          {/* Chapter Progress */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Chapter Progress</p>
            <div className="flex space-x-2 justify-center">
              {[1, 2, 3, 4, 5].map((chapterNum) => (
                <div
                  key={chapterNum}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                chapterNum <= (completedChapterNumber || 0)
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-600 text-gray-400'
                              }`}
                >
                  {chapterNum}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

          {/* Story Ready State */}
          {gameState === 'story-ready' && storyReady && currentStory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 space-y-8"
            >
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="text-6xl">📚</div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    Your Story is Ready!
                  </h3>
                  <p className="text-xl text-gray-300 max-w-lg leading-relaxed text-center mx-auto">
                    From your past experiences... are you ready to <span className="text-cyan-400 font-bold">type the past</span> to <span className="text-green-400 font-bold">change your future</span>?
                  </p>
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-cyan-400/20">
                    <h4 className="text-xl font-bold text-cyan-400 mb-3">
                      📖 "{currentStory.title}"
                    </h4>
                    <p className="text-gray-300 mb-3">
                      Chapter {currentStory.chapterNumber} • {currentStory.sentences.length} sentences • {currentStory.sentences.reduce((sum, s) => sum + s.words.length, 0)} words
                    </p>
                    <p className="text-sm text-gray-400">
                      Words will fall from above in story order. Type each word as it reaches the target zone to continue your career narrative.
                    </p>
                  </div>
                </div>
                
                {/* Prominent Ready Button */}
                <div className="space-y-4">
                  <Button
                    onClick={handleImReady}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-12 py-6 text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    size="lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    I'm Ready to Type My Future!
                     </Button>
                  <p className="text-xs text-gray-500">
                    Click when you're ready to start the typing challenge
                  </p>
                   </div>
              </div>
            </motion.div>
          )}

          {/* Game Arena */}
          {(gameState === 'ready' || gameState === 'playing' || gameState === 'paused') && (
            <div className="space-y-6">
              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >

                {/* Time Progress Bar */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Time Elapsed</span>
                    <span className="text-cyan-400 font-bold">
                      {Math.floor(gameStats.elapsedTime / 60)}:{(gameStats.elapsedTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((gameStats.elapsedTime / 180) * 100, 100)} 
                    className="h-2"
                  />
                </div>

                {/* Game Stats */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-bold">{gameStats.score.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-green-400 font-bold">{gameStats.fires}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💩</span>
                      <span className="text-red-400 font-bold">{gameStats.poos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <div className="flex flex-col items-center gap-1">
                        {/* Current vs Best Streak Display */}
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                      <span 
                              className="text-purple-400 font-bold transition-all duration-300 block text-lg"
                        style={{
                          transform: `scale(${comboVisual.scale})`,
                          textShadow: comboVisual.glow > 0 ? `0 0 ${comboVisual.glow * 10}px #a855f7` : 'none',
                          color: comboVisual.glow > 0.5 ? '#fbbf24' : '#a855f7'
                        }}
                      >
                              {gameStats.combo}
                      </span>
                            <span className="text-xs text-gray-400 font-medium">CURRENT</span>
                          </div>
                          <div className="text-gray-500 text-sm">vs</div>
                          <div className="text-center">
                            <span className="text-green-400 font-bold block text-lg">
                              {gameStats.longestStreak}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">BEST</span>
                          </div>
                        </div>
                        
                        {/* Streak Status */}
                        {gameStats.combo >= 5 && (
                          <span className="text-xs font-bold animate-pulse" style={{
                            color: gameStats.combo >= 30 ? '#fbbf24' : 
                                   gameStats.combo >= 20 ? '#f97316' : 
                                   gameStats.combo >= 10 ? '#ef4444' : '#8b5cf6'
                          }}>
                            {gameStats.combo >= 30 ? '🏆 LEGENDARY STREAK!' : 
                             gameStats.combo >= 20 ? '🚀 INSANE STREAK!' : 
                             gameStats.combo >= 10 ? '🔥 ON FIRE!' : 
                             '⚡ Hot Streak!'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-cyan-400" />
                      <div className="flex flex-col items-center">
                        <span className="text-cyan-400 font-bold text-lg">{gameStats.wpm} WPM</span>
                        {gameStats.burstWPM > gameStats.wpm + 10 && (
                          <span className="text-xs text-green-400 animate-pulse">
                            ⚡ Peak: {gameStats.burstWPM}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Level:</span>
                        <span className="text-sm font-bold" style={{ color: getDifficultyColor(stablePerformanceLevel).split(' ')[0].split('-')[1] }}>
                          {BPO_VOCABULARY[stablePerformanceLevel].displayName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Chapter:</span>
                        <span className="text-sm font-bold text-purple-400">
                          {currentChapter}: {currentStory?.title || 'Loading...'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white">
                      Accuracy: <span className="font-bold">{Math.round(gameStats.accuracy)}%</span>
                    </span>
                    {/* NEW: Smart Performance Indicator */}
                    {gameStats.totalWords > 2 && (
                      <div className="flex items-center gap-2">
                        {/* Phase Indicator */}
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          adaptiveSettings.assessmentPhase === 'baseline' ? 'bg-blue-500/20 text-blue-400' :
                          adaptiveSettings.assessmentPhase === 'finding_speed' ? 'bg-yellow-500/20 text-yellow-400' :
                          adaptiveSettings.assessmentPhase === 'optimal' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {adaptiveSettings.assessmentPhase === 'baseline' ? '🎯 ASSESSING' :
                           adaptiveSettings.assessmentPhase === 'finding_speed' ? '⚡ FINDING SPEED' :
                           adaptiveSettings.assessmentPhase === 'optimal' ? '🎪 OPTIMAL ZONE' :
                           '🚀 CHALLENGE MODE'}
                        </div>
                        
                        {/* Speed Indicator */}
                        <div className="text-xs text-gray-400">
                          Speed: {Math.round(adaptiveSettings.currentSpeedMultiplier * 100)}%
                        </div>
                        
                        {/* Consecutive Success/Failure Indicator */}
                        {adaptiveSettings.consecutiveSuccesses > 2 && (
                          <div className="text-xs text-green-400">
                            🔥 {adaptiveSettings.consecutiveSuccesses} streak
                          </div>
                        )}
                        
                        {adaptiveSettings.consecutiveFailures > 1 && (
                          <div className="text-xs text-red-400">
                            💪 Keep going ({adaptiveSettings.consecutiveFailures})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Game Area */}
              <Card className="glass-card border-white/10 relative overflow-hidden">
                <div
                  ref={gameAreaRef}
                  className="relative h-96 bg-gradient-to-b from-gray-900/50 to-gray-800/50"
                  style={{ 
                    background: `linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(30,30,30,0.9) 100%)`,
                    transform: `translate(${screenShake.x}px, ${screenShake.y}px)`,
                    boxShadow: backgroundPulse.intensity > 0 ? 
                      `inset 0 0 ${20 * backgroundPulse.intensity}px ${backgroundPulse.color === 'yellow' ? '#ffd700' : 
                       backgroundPulse.color === 'cyan' ? '#00ffff' : 
                       backgroundPulse.color === 'green' ? '#00ff00' : '#ff0000'}` : 'none'
                  }}
                >
                  {/* Start Game Modal - Only show when ready */}
                  {gameState === 'ready' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4"
                      >
                        <div className="mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⌨️</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Ready to Start?</h3>
                          <p className="text-gray-300">
                            Click the "Start Typing Challenge" button below to begin your typing adventure!
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                          <span className="animate-bounce">⬇️</span>
                          <span>Look for the green button below</span>
                          <span className="animate-bounce">⬇️</span>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Pause Overlay */}
                  {gameState === 'paused' && !countdown && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
                    >
                      <div className="bg-gray-900/95 border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 text-center">
                        <div className="mb-6">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Pause className="h-6 w-6 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">Game Paused</h2>
                          <p className="text-gray-400 text-sm">Take a break or continue</p>
                        </div>
                        
                        <div className="space-y-3">
                          <Button
                            onClick={togglePause}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume Game
                          </Button>
                          
                          {canEndSession() ? (
                            <Button 
                              onClick={() => endGame(true, { wpm: gameStats.wpm, accuracy: gameStats.accuracy })}
                              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                            >
                              <Trophy className="h-4 w-4 mr-2" />
                              End Session
                            </Button>
                          ) : (
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-sm text-gray-400">
                                Complete 1 minute to end session
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {60 - Math.round(gameStats.elapsedTime)} seconds remaining
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                                    {/* Countdown Overlay */}
                  {countdown !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
                    >
                      <div className="glass-card border-white/10 p-8 text-center">
                        <motion.div
                          key={countdown}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-6xl font-bold text-white mb-4"
                        >
                          {countdown === 0 ? 'GO!' : countdown}
                        </motion.div>
                        <div className="text-lg text-gray-300">
                          {countdown === 0 ? 'Start typing!' : (isInitialStart ? 'Game starting...' : 'Game resuming...')}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Lane Dividers */}
                  {Array.from({ length: LANES + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-cyan-400/30"
                      style={{ left: `${(i / LANES) * 100}%` }}
                    />
                  ))}

                                     {/* Danger Zone */}
                   <div
                     className="absolute left-0 right-0 border-t-2 border-b-2 border-red-400/60 bg-red-400/10"
                     style={{
                       top: '90%',
                       height: '10%'
                     }}
                   >
                     <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-red-400 font-bold text-sm opacity-60">DANGER ZONE</span>
                     </div>
                   </div>

                  {/* Falling Words */}
                  <AnimatePresence>
                    {fallingWords.map((word) => (
                      <motion.div
                        key={word.id}
                        data-word-id={word.id}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className={`absolute text-white font-bold text-sm px-2 py-1 rounded border-2 ${
                          word.missed ? 'bg-red-500/80 border-red-400' : 
                          getSentenceColor(word.sentenceIndex || 0)
                        }`}
                        style={{
                          left: `${(word.lane / LANES) * 100 + (1 / LANES) * 50}%`,
                          top: `${word.y}%`,
                          transform: 'translateX(-50%)',
                           fontSize: currentDifficulty === 'rookie' ? '13px' : 
                                    currentDifficulty === 'rockstar' ? '12px' :
                                    currentDifficulty === 'virtuoso' ? '11px' : '10px',
                           zIndex: 100 // Ensure words are always visible above announcements
                        }}
                      >
                        {word.word}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Effects */}
                  <AnimatePresence>
                    {effects.map((effect) => (
                      <motion.div
                        key={effect.id}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute text-6xl pointer-events-none"
                        style={{
                          left: `${(effect.lane / LANES) * 100 + (1 / LANES) * 50}%`,
                          top: `${TARGET_ZONE_Y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {effect.type === 'fire' ? '🔥' : '💩'}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Bonus Text Effects */}
                  <AnimatePresence>
                    {bonusEffects.map((bonus) => (
                      <motion.div
                        key={bonus.id}
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -30, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute text-sm font-bold pointer-events-none"
                        style={{
                          left: `${(bonus.lane / LANES) * 100 + (1 / LANES) * 50}%`,
                          top: `${bonus.y}%`,
                          transform: 'translateX(-50%)',
                          color: bonus.text.includes('PERFECT') ? '#10b981' : 
                                 bonus.text.includes('GREAT') ? '#f59e0b' : '#8b5cf6',
                          textShadow: '0 0 4px rgba(0,0,0,0.8)'
                        }}
                      >
                        {bonus.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* NEW: Particle System */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {particles.map((particle) => (
                      <div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                          left: `${particle.x}px`,
                          top: `${particle.y}px`,
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                          backgroundColor: particle.color,
                          opacity: particle.life / particle.maxLife,
                          boxShadow: `0 0 ${particle.size}px ${particle.color}`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                  </div>

                   {/* NEW: SMART ANNOUNCEMENTS - Positioned to not block falling words */}
                  {currentAnnouncement && (
                    <motion.div
                       initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.8, y: 20 }}
                       className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30"
                    >
                       <div className="bg-gradient-to-r from-purple-500/95 to-cyan-500/95 text-white px-4 py-2 rounded-full text-center font-bold text-sm shadow-lg backdrop-blur-sm border border-white/30">
                        🎯 {currentAnnouncement}
                      </div>
                    </motion.div>
                  )}

                  {/* Reaction Zone */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex items-center gap-8">
                      {Array.from({ length: LANES }, (_, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center">
                          {effects.find(e => e.lane === i) && (
                            <span className="text-2xl">
                              {effects.find(e => e.lane === i)?.type === 'fire' ? '🔥' : '💩'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Story words now fall from above - no display box needed */}
              {false && currentStory && (
                <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-cyan-400 mb-2">
                        📖 {currentStory?.title}
                      </h3>
                      <div className="text-xs text-gray-400 mb-3">
                        Your Personalized Story • Chapter {currentStory?.chapterNumber}
                      </div>
                    </div>
                    
                    {/* Completed Sentences */}
                    <div className="space-y-2 mb-4">
                      {completedSentences.map((sentence, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-green-400 bg-green-400/10 rounded-lg p-3 border border-green-400/20"
                        >
                          ✅ {sentence}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Current Sentence Progress */}
                    {user && currentStory && (
                      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/30">
                        <div className="text-xs text-gray-400 mb-1">Currently typing:</div>
                        <div className="text-sm">
                          {(() => {
                            const progress = storyGenerator.getCurrentSentenceProgress(user?.id || '', currentWordIndex);
                            return (
                              <span>
                                <span className="text-gray-500">
                                  {progress.completedWords.join(' ')}
                                </span>
                                {progress.completedWords.length > 0 && ' '}
                                <span className="text-yellow-400 font-bold bg-yellow-400/20 px-1 rounded">
                                  {progress.nextWord}
                                </span>
                                {progress.remainingWords.length > 0 && ' '}
                                <span className="text-gray-600">
                                  {progress.remainingWords.join(' ')}
                                </span>
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                    
                    {/* Story Generation Status */}
                    {isGeneratingStory && (
                      <div className="text-center py-4">
                        <div className="flex justify-center mb-2">
                          <PacmanLoader 
                            color="#fbbf24" 
                            size={28}
                            margin={3}
                          />
                        </div>
                        <div className="text-cyan-400 text-sm">
                          🎬 Generating your next chapter...
                        </div>
                      </div>
                    )}
                    
                    {storyError && (
                      <div className="text-center py-2">
                        <div className="text-red-400 text-xs">
                          ⚠️ {storyError}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Input Area */}
              <Card className="glass-card border-white/10 relative">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      {/* Ready State - Focus on Typing Box */}
                      {gameState === 'ready' && (
                        <div className="text-center space-y-6 mb-8 p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border-2 border-cyan-400/50">
                          <div className="space-y-3">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                              🎯 Focus Here!
                            </h3>
                            <p className="text-lg text-gray-300">
                              This is where you'll type the falling words
                            </p>
                            <div className="flex items-center justify-center gap-2 text-cyan-400">
                              <span className="animate-bounce">⬇️</span>
                              <span className="text-sm">Click Ready to start</span>
                              <span className="animate-bounce">⬇️</span>
                            </div>
                          </div>
                                <Button
                                  onClick={handleReadyClick}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-12 py-4 text-xl shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
                                >
                            <span className="text-2xl mr-3">🚀</span>
                            Start Typing Challenge!
                                </Button>
                              </div>
                        )}
                      
                                             <Input
                         ref={inputRef}
                         value={currentInput}
                         onChange={handleInputChange}
                         onKeyPress={handleKeyPress}
                        placeholder={gameState === 'playing' ? "Type the falling words here..." : gameState === 'ready' ? "Click Ready above to start typing..." : "Get ready to type..."}
                        className={`text-2xl font-mono h-24 px-8 rounded-xl transition-all duration-500 [&:not(:focus)]:border-green-400 [&:focus]:border-green-400 ${
                          gameState === 'ready' 
                            ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-4 border-cyan-400 shadow-2xl shadow-cyan-400/30 text-white placeholder-cyan-200 animate-pulse ring-4 ring-cyan-400/20' 
                            : gameState === 'playing'
                            ? 'bg-gray-800/70 border-3 border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/50 text-white placeholder-gray-400 shadow-lg shadow-green-400/20 !border-green-400 focus:!border-green-400 border-green-400 focus:border-green-400'
                            : 'bg-gray-800/50 border-2 border-gray-600 text-gray-400 placeholder-gray-500'
                        }`}
                        style={{
                          borderColor: gameState === 'playing' ? '#4ade80' : undefined,
                          border: gameState === 'playing' ? '3px solid #4ade80' : undefined,
                          boxShadow: gameState === 'playing' ? '0 0 0 3px rgba(74, 222, 128, 0.3)' : undefined
                        }}
                        data-typing-input="true"
                         disabled={gameState !== 'playing'}
                         autoComplete="off"
                         autoCorrect="off"
                         spellCheck="false"
                       />
                    </div>
                                          <div className="text-sm text-gray-400">
                        <div className="mt-1 text-xs">
                          Timing bonuses: <span className="text-green-400">Perfect +50</span> | <span className="text-yellow-400">Great +25</span> | <span className="text-purple-400">Good +10</span>
                        </div>
                        <div className="mt-1 text-xs text-cyan-400">
                          Realistic accuracy system - errors increase with speed & difficulty
                        </div>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Overwhelmed State - Recovery Chance */}
          {gameState === 'overwhelmed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <Card className="glass-card border-red-500/30 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-3xl text-center mb-4 text-red-400">
                    🚨 OVERWHELMED! 🚨
                  </CardTitle>
                  <div className="text-center">
                    <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                      SPEED TOO FAST
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <p className="text-lg text-gray-300">
                      The game speed got too fast and you're missing too many words!
                    </p>
                    <p className="text-gray-400">
                      Take a breather and decide your next move:
                    </p>
                  </div>

                  {/* Current Stats */}
                  <div className="grid grid-cols-3 gap-4 bg-black/20 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{gameStats.wpm}</div>
                      <div className="text-xs text-gray-400">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{gameStats.longestStreak}</div>
                      <div className="text-xs text-gray-400">Best Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.floor(gameStats.elapsedTime / 60)}:{(gameStats.elapsedTime % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-400">Time</div>
                    </div>
                  </div>

                  {/* Recovery Options */}
                  <div className="flex gap-4">
                    {canEndSession() ? (
                      <Button 
                        onClick={() => endGame(true, { wpm: gameStats.wpm, accuracy: gameStats.accuracy })}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                      >
                        <Trophy className="h-5 w-5 mr-2" />
                        End Session
                      </Button>
                    ) : (
                      <div className="flex-1 text-center p-3 bg-gray-800/50 rounded border border-gray-600/50">
                        <p className="text-sm text-gray-400">
                          Minimum session: {Math.ceil((60 - gameStats.elapsedTime) / 60)} min remaining
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleOverwhelmedRecovery}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Get Ready - Fight Back!
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recovery Countdown State */}
          {gameState === 'recovering' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <Card className="glass-card border-green-500/30 bg-green-500/5">
                <CardContent className="text-center py-12">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-green-400">
                      Get Ready!
                    </h2>
                    
                    {/* Countdown Display */}
                    <div className="relative">
                      <motion.div
                        key={recoveryCountdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="text-8xl font-bold text-white mb-4"
                      >
                        {recoveryCountdown > 0 ? recoveryCountdown : 'GO!'}
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-lg text-gray-300">
                        {recoveryCountdown > 0 ? 
                          "Take your time... Relax and get ready. Game resumes in:" : 
                          "Perfect! Now let's get back to typing!"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {recoveryCountdown > 0 ?
                          "Screen cleared • Breathe deeply • Focus on accuracy over speed" :
                          "You've got this! Start with any visible word and build momentum"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Enhanced Interactive Game Complete */}
          {(gameState === 'failed' || gameState === 'complete') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              {/* Hero Section with Animated Background */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  gameState === 'complete' 
                    ? 'from-green-500/20 via-cyan-500/20 to-blue-500/20' 
                    : 'from-red-500/20 via-orange-500/20 to-yellow-500/20'
                } animate-pulse`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                
                <Card className="glass-card border-white/20 relative z-10">
                  <CardHeader className="text-center space-y-6 pb-8">
                    {/* Celebration Animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                      className="text-8xl"
                    >
                      {gameState === 'complete' ? '🏆' : '📊'}
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <CardTitle className={`text-5xl font-bold mb-4 bg-gradient-to-r ${
                        gameState === 'complete' 
                          ? 'from-green-400 via-cyan-400 to-blue-400' 
                          : 'from-red-400 via-orange-400 to-yellow-400'
                      } bg-clip-text text-transparent`}>
                        {gameState === 'complete' ? 'LEGENDARY SESSION!' : 'SESSION COMPLETE!'}
                  </CardTitle>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                      >
                        <Badge className={`text-lg px-6 py-2 ${gameState === 'complete' 
                          ? "bg-gradient-to-r from-green-500/30 to-cyan-500/30 text-green-300 border-green-400/50 shadow-lg shadow-green-400/20"
                          : "bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-300 border-red-400/50 shadow-lg shadow-red-400/20"
                        }`}>
                          ✨ {gameState === 'complete' ? 'MISSION ACCOMPLISHED' : 'PROGRESS MADE'} ✨
                    </Badge>
                      </motion.div>
                    </motion.div>
                </CardHeader>
                  
                  <CardContent className="space-y-8 px-8 pb-8">
                    {/* Animated Statistics Grid */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {/* Score */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotateY: 5 }}
                        className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30 text-center group hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1, type: "spring", bounce: 0.6 }}
                          className="text-5xl font-bold text-yellow-400 mb-2"
                        >
                          {gameStats.score.toLocaleString()}
                        </motion.div>
                        <div className="text-sm text-gray-400 group-hover:text-yellow-300 transition-colors">🏆 Total Score</div>
                      </motion.div>

                      {/* WPM */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotateY: 5 }}
                        className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-400/30 text-center group hover:shadow-xl hover:shadow-cyan-400/20 transition-all duration-300"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.2, type: "spring", bounce: 0.6 }}
                          className="text-5xl font-bold text-cyan-400 mb-2"
                        >
                          {gameStats.wpm}
                        </motion.div>
                        <div className="text-sm text-gray-400 group-hover:text-cyan-300 transition-colors">⚡ WPM (Adjusted)</div>
                       {gameStats.burstWPM > gameStats.wpm && (
                          <div className="text-xs text-green-400 mt-1 opacity-75 group-hover:opacity-100 transition-opacity">
                            🚀 Peak: {gameStats.burstWPM} WPM
                         </div>
                       )}
                      </motion.div>

                      {/* Longest Streak */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotateY: 5 }}
                        className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-400/30 text-center group hover:shadow-xl hover:shadow-orange-400/20 transition-all duration-300"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.4, type: "spring", bounce: 0.6 }}
                          className="text-5xl font-bold text-orange-400 mb-2"
                        >
                          {gameStats.longestStreak}
                        </motion.div>
                        <div className="text-sm text-gray-400 group-hover:text-orange-300 transition-colors">🔥 Longest Streak</div>
                      </motion.div>

                      {/* Accuracy - Featured */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotateY: 5 }}
                        className={`bg-gradient-to-br ${gameStats.accuracy >= 70 
                          ? 'from-green-500/20 to-emerald-500/20 border-green-400/30 hover:shadow-green-400/20' 
                          : 'from-red-500/20 to-pink-500/20 border-red-400/30 hover:shadow-red-400/20'
                        } rounded-xl p-6 border text-center group hover:shadow-xl transition-all duration-300`}
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.6, type: "spring", bounce: 0.6 }}
                          className={`text-5xl font-bold mb-2 ${gameStats.accuracy >= 70 ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {Math.round(gameStats.accuracy)}%
                        </motion.div>
                        <div className={`text-sm transition-colors ${gameStats.accuracy >= 70 
                          ? 'text-gray-400 group-hover:text-green-300' 
                          : 'text-gray-400 group-hover:text-red-300'
                        }`}>🎯 Accuracy</div>
                      </motion.div>
                    </motion.div>

                    {/* Secondary Stats Row */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
                    >
                      {/* Correct Words */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-400/20 text-center group hover:shadow-lg hover:shadow-green-400/10 transition-all"
                      >
                        <div className="text-3xl font-bold text-green-400 mb-1">{gameStats.fires}</div>
                        <div className="text-xs text-gray-400 group-hover:text-green-300 transition-colors">🔥 Correct Words</div>
                      </motion.div>

                      {/* Wrong Words */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-400/20 text-center group hover:shadow-lg hover:shadow-red-400/10 transition-all"
                      >
                        <div className="text-3xl font-bold text-red-400 mb-1">{gameStats.wordsIncorrect.length}</div>
                        <div className="text-xs text-gray-400 group-hover:text-red-300 transition-colors">💩 Wrong Words</div>
                      </motion.div>

                      {/* Elapsed Time */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg p-4 border border-purple-400/20 text-center group hover:shadow-lg hover:shadow-purple-400/10 transition-all"
                      >
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                        {Math.floor(gameStats.elapsedTime / 60)}:{(gameStats.elapsedTime % 60).toString().padStart(2, '0')}
                      </div>
                        <div className="text-xs text-gray-400 group-hover:text-purple-300 transition-colors">⏱️ Elapsed Time</div>
                      </motion.div>

                      {/* Chapters Completed */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-400/20 text-center group hover:shadow-lg hover:shadow-cyan-400/10 transition-all"
                      >
                        <div className="text-3xl font-bold text-cyan-400 mb-1">
                          {completedChapterNumber || 0} / 5
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-cyan-300 transition-colors">📚 Chapters Completed</div>
                      </motion.div>
                    </motion.div>

                  {/* Current Session Word Tracking */}
                  <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      📊 This Session
                    </h3>
                    {savingSession && (
                      <div className="mb-3 flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                        <p className="text-cyan-400 text-xs">Saving session...</p>
                      </div>
                    )}
                    {gameStats.wordsCorrect.length === 0 && gameStats.wordsIncorrect.length === 0 ? (
                      <div className="text-center text-yellow-400 text-sm">
                        ⚠️ No words typed in this session
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-green-400 font-semibold mb-1">Correct Words ({gameStats.wordsCorrect.length})</p>
                          <div 
                            className="max-h-32 overflow-y-auto"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#4B5563 #1F2937'
                            }}
                          >
                            <ul className="text-xs text-gray-300 space-y-1">
                              {gameStats.wordsCorrect.length > 0 ? (
                                gameStats.wordsCorrect.map((word: any, i: number) => (
                                  <li key={`correct-${i}`} className="flex justify-between">
                                    <span>{word.word}</span>
                                    <span className="text-green-500">✓</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500 italic">No correct words</li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-red-400 font-semibold mb-1">Incorrect Words ({gameStats.wordsIncorrect.length})</p>
                          <div 
                            className="max-h-32 overflow-y-auto"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#4B5563 #1F2937'
                            }}
                          >
                            <ul className="text-xs text-gray-300 space-y-1">
                              {gameStats.wordsIncorrect.length > 0 ? (
                                gameStats.wordsIncorrect.map((word: any, i: number) => (
                                  <li key={`incorrect-${i}`} className="flex justify-between">
                                    <span>{word.word}</span>
                                    <span className="text-red-500">✗</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500 italic">No incorrect words</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* All-Time Historical Stats */}
                  {statsSnapshot && (
                    <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        📈 All-Time Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-green-400 font-semibold mb-1">Top Correct Words</p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {(statsSnapshot.most_common_correct_words || []).slice(0,6).map((cw: any, i: number) => (
                              <li key={`cw-${i}`} className="flex justify-between"><span>{cw.word}</span><span className="text-green-500">{cw.count}×</span></li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-red-400 font-semibold mb-1">Top Incorrect Words</p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {(statsSnapshot.most_common_incorrect_words || []).slice(0,6).map((iw: any, i: number) => (
                              <li key={`iw-${i}`} className="flex justify-between"><span>{iw.word}</span><span className="text-red-500">{iw.count}×</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                    {/* AI Performance Analysis - Enhanced */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-xl p-6"
                    >
                      <button
                        onClick={() => setIsAiPerformanceExpanded(!isAiPerformanceExpanded)}
                        className="flex items-center justify-between w-full mb-6 hover:bg-cyan-500/20 rounded p-2 -m-2 transition-colors"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 2.2, type: "spring" }}
                          className="flex items-center space-x-3"
                        >
                          <div className="text-4xl animate-pulse">🤖</div>
                          <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                              AI Performance Analysis
                            </h3>
                            <p className="text-sm text-gray-400">Advanced pattern recognition complete</p>
                          </div>
                        </motion.div>
                        {isAiPerformanceExpanded ? (
                          <ChevronUp className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-cyan-400" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {isAiPerformanceExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >

                      {/* AI Insights Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                           {gameStats.burstWPM > 60 && (
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 2.4 }}
                            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-4"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-2xl">⚡</span>
                              <span className="text-green-400 font-semibold">Speed Burst Detected</span>
                            </div>
                            <p className="text-gray-300 text-sm">Your peak typing shows excellent potential for speed development.</p>
                          </motion.div>
                        )}

                           {gameStats.wpm > gameStats.sustainedWPM * 1.2 && (
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 2.6 }}
                            className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-4"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-2xl">🎯</span>
                              <span className="text-blue-400 font-semibold">Adaptation Success</span>
                            </div>
                            <p className="text-gray-300 text-sm">Your rhythm improved during gameplay - excellent flow state!</p>
                          </motion.div>
                        )}

                           {gameStats.longestStreak > 10 && (
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 2.8 }}
                            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-4"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-2xl">🔥</span>
                              <span className="text-orange-400 font-semibold">Focus Master</span>
                            </div>
                            <p className="text-gray-300 text-sm">Strong concentration patterns - you handle pressure well!</p>
                          </motion.div>
                        )}

                           {gameStats.accuracy > 80 && (
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 3.0 }}
                            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-4"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-2xl">🎯</span>
                              <span className="text-purple-400 font-semibold">Precision Expert</span>
                            </div>
                            <p className="text-gray-300 text-sm">High accuracy in rhythm-based typing - exceptional skill!</p>
                          </motion.div>
                        )}
                         </div>

                      {/* Estimated Real WPM */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 3.2 }}
                        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-4 text-center"
                      >
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-3xl">💡</span>
                          <span className="text-yellow-400 font-bold text-lg">Real-World Estimate</span>
                       </div>
                        <p className="text-2xl font-bold text-yellow-300 mb-1">
                          {Math.round(gameStats.burstWPM * 0.8)}-{Math.round(gameStats.wpm * 1.2)} WPM
                        </p>
                        <p className="text-gray-400 text-sm">
                          {gameStats.wpm >= 60 ? "Professional typing speed - excellent for BPO roles" :
                           gameStats.wpm >= 40 ? "Good typing speed - suitable for most office work" :
                           gameStats.wpm >= 25 ? "Developing speed - practice will improve performance" :
                           "Beginner level - focus on accuracy first, then speed"}
                        </p>
                      </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                       {/* AI Personalized Assessment */}
                       {loadingAssessment && (
                         <div className="bg-purple-500/10 border border-purple-500/30 rounded p-4 mt-4">
                           <div className="flex items-center justify-center space-x-2">
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                             <p className="text-purple-400 text-sm">🧠 AI analyzing your performance...</p>
                           </div>
                         </div>
                       )}

                       {aiAssessment && (
                         <div className="bg-purple-500/10 border border-purple-500/30 rounded p-4 mt-4">
                           <button
                             onClick={() => setIsAiAssessmentExpanded(!isAiAssessmentExpanded)}
                             className="flex items-center justify-between w-full mb-3 hover:bg-purple-500/20 rounded p-2 -m-2 transition-colors"
                           >
                             <div className="flex items-center space-x-2">
                               <span className="text-2xl">🧠</span>
                               <div>
                                 <p className="text-purple-400 font-semibold text-sm">AI Typing Coach Assessment</p>
                                 <p className="text-xs text-gray-400">Performance Level: {aiAssessment.performanceLevel}</p>
                               </div>
                             </div>
                             {isAiAssessmentExpanded ? (
                               <ChevronUp className="w-5 h-5 text-purple-400" />
                             ) : (
                               <ChevronDown className="w-5 h-5 text-purple-400" />
                             )}
                           </button>
                           
                           <AnimatePresence>
                             {isAiAssessmentExpanded && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{ duration: 0.3, ease: "easeInOut" }}
                                 className="overflow-hidden"
                               >
                                 <div className="space-y-3 text-xs">
                             <div>
                               <p className="text-gray-200 leading-relaxed">{aiAssessment.overallAssessment}</p>
                             </div>
                             
                             {aiAssessment.strengths?.length > 0 && (
                               <div>
                                 <p className="text-green-400 font-medium mb-1">💪 Your Strengths:</p>
                                 <ul className="text-gray-300 space-y-1">
                                   {aiAssessment.strengths.map((strength: string, i: number) => (
                                     <li key={i}>• {strength}</li>
                                   ))}
                                 </ul>
                               </div>
                             )}
                             
                             {aiAssessment.personalizedTips?.length > 0 && (
                               <div>
                                 <p className="text-cyan-400 font-medium mb-2">🎯 Personalized Tips:</p>
                                 <div className="space-y-2">
                                   {aiAssessment.personalizedTips.map((tip: any, i: number) => (
                                     <div key={i} className="bg-black/30 rounded p-2">
                                       <p className="text-yellow-400 font-medium text-xs">
                                         {tip.category}: {tip.tip}
                                       </p>
                                       <p className="text-gray-400 text-xs mt-1">{tip.explanation}</p>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             
                             {aiAssessment.nextSessionGoal && (
                               <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                                 <p className="text-blue-400 font-medium text-xs">🎯 Next Session Goal:</p>
                                 <p className="text-gray-300 text-xs">{aiAssessment.nextSessionGoal}</p>
                               </div>
                             )}
                             
                             <div className="text-center pt-2">
                               <p className="text-purple-300 text-xs italic">{aiAssessment.encouragement}</p>
                             </div>
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                         </div>
                       )}
                </CardContent>
              </Card>
              </div>

              {/* Achievement Badges */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 3.4 }}
                      className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/30 rounded-xl p-6"
                    >
                <h3 className="text-lg font-bold text-center mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  🏅 Session Achievements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Speed Achievement */}
                  {gameStats.wpm >= 40 && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-3 text-center border border-cyan-400/30"
                    >
                      <div className="text-2xl mb-1">🚀</div>
                      <div className="text-xs text-cyan-400 font-semibold">Speed Demon</div>
                      <div className="text-xs text-gray-400">40+ WPM</div>
                    </motion.div>
                  )}
                  
                  {/* Accuracy Achievement */}
                  {gameStats.accuracy >= 70 && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-3 text-center border border-green-400/30"
                    >
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs text-green-400 font-semibold">Sharp Shooter</div>
                      <div className="text-xs text-gray-400">70%+ Accuracy</div>
                    </motion.div>
                  )}
                  
                  {/* Streak Achievement */}
                  {gameStats.longestStreak >= 10 && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-3 text-center border border-orange-400/30"
                    >
                      <div className="text-2xl mb-1">🔥</div>
                      <div className="text-xs text-orange-400 font-semibold">On Fire</div>
                      <div className="text-xs text-gray-400">{gameStats.longestStreak} Streak</div>
                    </motion.div>
                  )}
                  
                  {/* Completion Achievement */}
                  {gameState === 'complete' && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-3 text-center border border-purple-400/30"
                    >
                      <div className="text-2xl mb-1">👑</div>
                      <div className="text-xs text-purple-400 font-semibold">Champion</div>
                      <div className="text-xs text-gray-400">Completed</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Enhanced Action Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => {
                    stopPreview();
                    router.push('/career-tools/games');
                  }}
                    className="w-full h-14 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Back to Games</div>
                      <div className="text-xs opacity-75">More challenges await</div>
                    </div>
                </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={async () => {
                    try {
                      // Create a results-only shareable link
                      const resultsData = {
                        game: 'Typing Hero',
                        score: gameStats.score,
                        wpm: gameStats.wpm,
                        accuracy: Math.round(gameStats.accuracy),
                        longestStreak: gameStats.longestStreak,
                        difficulty: currentDifficulty,
                        timestamp: new Date().toISOString()
                      };
                      
                      // Encode results in URL parameters
                      const encodedResults = encodeURIComponent(JSON.stringify(resultsData));
                      const shareableUrl = `${window.location.origin}/career-tools/games/typing-hero?results=${encodedResults}`;
                      
                      const shareText = `🎮 Just crushed Typing Hero!\n\n🏆 ${gameStats.score.toLocaleString()} points\n⚡ ${gameStats.wpm} WPM\n🎯 ${Math.round(gameStats.accuracy)}% accuracy\n🔥 ${gameStats.longestStreak} streak\n\nCan you beat my score? 🚀\n\nView my results: ${shareableUrl}`;
                      
                      if (navigator.share) {
                        navigator.share({
                          title: 'My Typing Hero Achievement!',
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
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-400/20 transition-all duration-300"
                  >
                    <Share className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Share Results</div>
                      <div className="text-xs opacity-75">Show off your skills</div>
                    </div>
                </Button>
                </motion.div>


                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    className="w-full h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-400/20 transition-all duration-300"
                  onClick={() => {
                    // Reset game state to menu
                    setGameState('menu');
                    setCurrentStory(null);
                    currentStoryRef.current = null;
                    resetGameTracking();
                    // Force a page refresh to ensure clean state
                    window.location.href = '/career-tools/games/typing-hero';
                  }}
                >
                    <Play className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Play Again</div>
                      <div className="text-xs opacity-75">Beat your record</div>
              </div>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
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

       {/* Exit Game Alert Dialog */}
       <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                     <AlertDialogContent className="bg-black border-gray-700">
           <AlertDialogHeader>
             <AlertDialogTitle className="text-white">Leave Typing Hero?</AlertDialogTitle>
             <AlertDialogDescription className="text-gray-300">
               Are you sure you want to exit the game? This will take you back to the main menu and you'll lose your current progress.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
               Continue Playing
             </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                stopPreview();
                router.back();
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
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
                Before you can start playing <span className="text-cyan-400 font-semibold">Typing Hero</span>, 
                you need to create your resume first!
              </p>
              <p className="text-sm text-gray-400">
                Creating a resume helps us personalize your gaming experience and generate 
                custom stories based on your career profile.
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div className="space-y-1">
                    <p className="text-cyan-400 font-semibold text-sm">Why create a resume?</p>
                    <ul className="text-xs text-gray-400 space-y-1 ml-1">
                      <li>• Get personalized game stories</li>
                      <li>• Unlock all game features</li>
                      <li>• Track your progress better</li>
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