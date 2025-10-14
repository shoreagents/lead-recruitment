'use client';

/**
 * BPOC Cultural Game - Cultural Communication Arena
 * 
 * FIXED ISSUES:
 * 1. Survival Status Calculation: Fixed issue where survival status was showing 100% 
 *    even when no answers were provided. The problem was in resetChallengeState() 
 *    which was resetting interactionCount to 0 every time the user moved between 
 *    challenges, causing the survival status calculation to always return 0.
 * 
 * 2. State Persistence: Modified resetChallengeState() to only reset challenge-specific 
 *    state variables (like currentResponse, audioBlob, etc.) while preserving cumulative 
 *    game progress variables (interactionCount, culturalScores, achievements).
 * 
 * 3. Survival Status Logic: The survival status is now properly calculated based on:
 *    - interactionCount (must be > 0 to have any survival status)
 *    - Average cultural scores across all regions
 *    - Achievement bonuses (up to 10%)
 *    - Time penalty if game runs out of time (-20%)
 * 
 * 4. Debugging: Added comprehensive console logging to track state changes and 
 *    survival status calculations for troubleshooting.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  Mic, MicOff, Play, Pause, RotateCcw, Send, Timer, 
  Flag, Users, Zap, Trophy, Crown, Skull, Volume2, 
  MessageSquare, Globe, Target, Star, ArrowLeft, Share, AlertTriangle
} from 'lucide-react';
import { PacmanLoader } from 'react-spinners';

const CulturalCommunicationArena = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [gameState, setGameState] = useState('welcome');
  const [currentStage, setCurrentStage] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for demo
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [culturalScores, setCulturalScores] = useState<Record<string, number>>({
    US: 0,
    UK: 0,
    AU: 0,
    CA: 0
  });
  const [playerName, setPlayerName] = useState('Player');
  const [currentResponse, setCurrentResponse] = useState('');
  const [survivalStatus, setSurvivalStatus] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [toastAchievement, setToastAchievement] = useState<string | null>(null);
  const [stageAchievements, setStageAchievements] = useState<Record<number, string[]>>({});

  // Count any real player interactions (voice recordings or writing submissions)
  const [interactionCount, setInteractionCount] = useState(0);

  // Real voice recording state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [canRecord, setCanRecord] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [hasSavedResults, setHasSavedResults] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Combo challenge state
  const [comboVoiceDone, setComboVoiceDone] = useState(false);
  const [comboWriteDone, setComboWriteDone] = useState(false);

  // Final boss state
  const [bossRoundIndex, setBossRoundIndex] = useState(0); // 0..3
  const [bossVoiceDone, setBossVoiceDone] = useState(false);
  const [bossTimer, setBossTimer] = useState(30);
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);

  // Cultural recording state
  const [currentRecordingRegion, setCurrentRecordingRegion] = useState<string | null>(null);
  const [culturalTranscripts, setCulturalTranscripts] = useState<Record<string, string>>({
    US: '',
    UK: '',
    AU: '',
    CA: ''
  });
  const [generatedScripts, setGeneratedScripts] = useState<Record<string, string>>({
    US: '',
    UK: '',
    AU: '',
    CA: ''
  });
  const [isGeneratingScript, setIsGeneratingScript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<Record<string, boolean>>({ US: false, UK: false, AU: false, CA: false });

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      console.log('Timer ran out, calculating final survival status...');
      console.log('State when timer ran out:', {
        interactionCount,
        culturalScores,
        achievements: achievements?.length || 0,
        timeLeft
      });
      // Calculate final survival status before showing results
      const finalSurvivalStatus = calculateSurvivalStatus();
      console.log('Timer: Setting survival status to:', finalSurvivalStatus);
      setSurvivalStatus(finalSurvivalStatus);
      setGameState('results');
    }
  }, [gameState, timeLeft, interactionCount, culturalScores, achievements]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setRecordingTime(0);
    }
  }, [isRecording]);

  // Reset per-challenge state when moving between challenges/stages
  useEffect(() => {
    setComboVoiceDone(false);
    setComboWriteDone(false);
    setBossRoundIndex(0);
    setBossVoiceDone(false);
    setBossTimer(30);
    
    // Clear audio recordings when moving to new challenge
    setAudioChunks([]);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    // Clear cultural recording state
    setCurrentRecordingRegion(null);
    setCulturalTranscripts({
      US: '',
      UK: '',
      AU: '',
      CA: ''
    });
    setGeneratedScripts({
      US: '',
      UK: '',
      AU: '',
      CA: ''
    });
  }, [currentChallenge, currentStage]);

  // Per-round timer for final boss
  useEffect(() => {
    const current = stages[currentStage - 1].challenges[currentChallenge];
    if (gameState === 'playing' && current.type === 'ultimate' && bossTimer > 0 && !bossVoiceDone) {
      const t = setInterval(() => setBossTimer((s) => s - 1), 1000);
      return () => clearInterval(t);
    }
  }, [gameState, currentStage, currentChallenge, bossTimer, bossVoiceDone]);

  // Achievement toast: show newest briefly
  useEffect(() => {
    if (achievements.length > 0) {
      const latest = achievements[achievements.length - 1];
      setToastAchievement(latest);
      const t = setTimeout(() => setToastAchievement(null), 4500);
      return () => clearTimeout(t);
    }
  }, [achievements]);

  // Survival status is calculated when the game ends (either by timer or completion)
  // No need for additional useEffect here

  // Check current permission state without requesting new permissions
  const checkCurrentPermissionState = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      console.log('Current microphone permission state:', permission.state);
      return permission.state;
    } catch (error) {
      console.log('Could not check permission state:', error);
      return 'unknown';
    }
  };

  // Check microphone permissions on mount and when needed
  const checkMicrophonePermission = async () => {
    try {
      console.log('Checking microphone permissions...');

      // First check current permission state (best-effort)
      const permissionState = await checkCurrentPermissionState();
      console.log('Permission state before getUserMedia:', permissionState);

      // Attempt to get a stream; success here means permission is granted
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // If we reached here, permission is granted and the device is available
      setCanRecord(true);

      // Immediately stop tracks; we only needed this to verify permission
      stream.getTracks().forEach((track) => track.stop());

      console.log('✅ Microphone permission granted and device available');
    } catch (error) {
      setCanRecord(false);
      console.error('Microphone access failed:', error);

      // Check if it's a permission or device error
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          console.log('Permission denied by user');
          alert('Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.');
        } else if (error.name === 'NotFoundError') {
          console.log('No microphone found');
          alert('No microphone device found. Please connect a microphone and refresh the page.');
        } else if (error.name === 'NotReadableError') {
          console.log('Microphone is busy or not accessible');
          alert('Microphone is busy or not accessible. Please close other applications using the microphone and refresh the page.');
        } else {
          alert(`Microphone error: ${error.message}. Please check your microphone settings and refresh the page.`);
        }
      } else {
        alert('Failed to access microphone. Please check your browser settings and refresh the page.');
      }
    }
  };

  // Enhanced microphone permission check with retry
  const retryMicrophonePermission = async () => {
    console.log('Retrying microphone permission...');
    setCanRecord(false);
    await checkMicrophonePermission();
  };

  // Comprehensive microphone debugging function
  const debugMicrophoneStatus = async () => {
    console.log('=== MICROPHONE DEBUG INFO ===');
    console.log('Browser:', navigator.userAgent);
    console.log('MediaDevices supported:', !!navigator.mediaDevices);
    console.log('getUserMedia supported:', !!navigator.mediaDevices?.getUserMedia);
    console.log('MediaRecorder supported:', !!window.MediaRecorder);
    
    // Check permissions
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      console.log('Microphone permission state:', permission.state);
      console.log('Permission can change:', permission.onchange !== null);
    } catch (error) {
      console.log('Could not check permission state:', error);
    }
    
    // Check available devices
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      console.log('Available audio input devices:', audioInputs);
    } catch (error) {
      console.log('Could not enumerate devices:', error);
    }
    
    // Check current canRecord state
    console.log('Current canRecord state:', canRecord);
    console.log('Current isRecording state:', isRecording);
    console.log('Current audioContext state:', !!audioContext);
    console.log('Current mediaRecorder state:', mediaRecorder?.state);
    
    console.log('=== END DEBUG INFO ===');
  };

  // Check microphone permissions on mount and when needed
  useEffect(() => {
    checkMicrophonePermission();
    
    // Load user stats if available
    const loadUserStats = async () => {
      try {
        const token = await (await import('@/lib/auth-helpers')).getSessionToken().catch(() => null);
        if (token) {
          const response = await fetch('/api/games/bpoc-cultural/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Loaded user stats:', data);
            // You can use this data to show previous performance
          }
        }
      } catch (error) {
        console.log('Could not load user stats:', error);
      }
    };
    
    loadUserStats();
    
    // Cleanup audio URL on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      // Clean up any active audio context
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioUrl]);

  // Save game data once when results screen is reached
  useEffect(() => {
    if (gameState !== 'results' || hasSavedResults) return;
    (async () => {
      try {
        const token = await (await import('@/lib/auth-helpers')).getSessionToken().catch(() => null);
        if (!token) {
          setHasSavedResults(true);
          return;
        }
        const sessionData = {
          startedAt: new Date(Date.now() - (300 - timeLeft) * 1000),
          finishedAt: new Date(),
          durationMs: (300 - timeLeft) * 1000,
          stageReached: currentStage,
          challengeCompleted: currentChallenge,
          gameState: 'results',
          timeLeft: timeLeft,
          survivalStatus: survivalStatus,
          interactionCount: interactionCount,
          usScore: Math.round(culturalScores.US),
          ukScore: Math.round(culturalScores.UK),
          auScore: Math.round(culturalScores.AU),
          caScore: Math.round(culturalScores.CA),
          tierName: calculateTier().tier,
          tierDescription: calculateTier().description,
          achievements: achievements,
          metrics: {
            culturalTranscripts,
            generatedScripts,
            stageAchievements,
            audioRecordings: {
              totalRecordings: interactionCount,
              recordingTime: recordingTime
            },
            challengeBreakdown: {
              stage1: { completed: currentStage >= 1, challenges: stages[0]?.challenges?.length || 0 },
              stage2: { completed: currentStage >= 2, challenges: stages[1]?.challenges?.length || 0 },
              stage3: { completed: currentStage >= 3, challenges: stages[2]?.challenges?.length || 0 },
              stage4: { completed: currentStage >= 4, challenges: stages[3]?.challenges?.length || 0 }
            }
          },
          // Voice (1A) and Angry (2B) transcripts per region
          c1a_us_text: culturalTranscripts.US || null,
          c1a_uk_text: culturalTranscripts.UK || null,
          c1a_au_text: culturalTranscripts.AU || null,
          c1a_ca_text: culturalTranscripts.CA || null,
          // Writing inputs from window map
          ...(typeof window !== 'undefined' && (window as any).bpocWriting ? (window as any).bpocWriting : {})
        };
        const response = await fetch('/api/games/bpoc-cultural/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-user-id': String((await (await import('@/lib/auth-helpers')).getUserId()) || '') },
          body: JSON.stringify(sessionData)
        });
        const saved = await response.json().catch(() => ({} as any))
        const sessionId = saved?.sessionId
        // Trigger analysis once saved
        if (sessionId) {
          setAnalysisLoading(true)
          try {
            const ares = await fetch('/api/games/bpoc-cultural/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: (await (await import('@/lib/auth-helpers')).getUserId()) || undefined, sessionId })
            })
            if (ares.ok) {
              const adata = await ares.json()
              setAnalysisSummary(adata?.summary || null)
              setAnalysisResult(adata?.result || null)
            }
          } finally {
            setAnalysisLoading(false)
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setHasSavedResults(true);
      }
    })();
  }, [gameState, hasSavedResults]);

  // Immediately show loading indicator on results screen
  useEffect(() => {
    if (gameState === 'results' && !analysisSummary) {
      setAnalysisLoading(true);
    }
  }, [gameState]);

  // Helper: add achievement (global + per-stage)
  const addAchievement = (label: string) => {
    setAchievements((prev) => [...prev, label]);
    setStageAchievements((prev) => ({
      ...prev,
      [currentStage]: [...(prev[currentStage] || []), label],
    }));
    
    // Update survival status after achievement is added
    setTimeout(() => updateSurvivalStatus(), 0);
  };

  const handleBackClick = () => {
    if (gameState === 'playing') {
      setShowExitDialog(true);
      return;
    }
    if (gameState === 'welcome') {
      router.push('/career-tools/games');
    } else {
      setGameState('welcome');
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    router.push('/career-tools/games');
  };

  const proceedToIntro = () => {
    // If not logged in, open signup dialog via URL param
    if (!user) {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('signup', 'true');
        router.push(`${url.pathname}?${url.searchParams.toString()}`);
        return;
      }
    }
    console.log('Starting game from welcome screen...');
    console.log('Initial state values:', {
      survivalStatus,
      interactionCount,
      culturalScores,
      achievements: achievements?.length || 0
    });
    setGameState('playing');
  };

  const stages = [
    {
      name: "Cultural Bootcamp",
      description: "Master the fundamentals of cross-cultural communication",
      scenario: "You're a new BPO agent joining a global team. Your first task is to introduce yourself to different regional teams and adapt your communication style to match their cultural expectations.",
      instructions: "Complete both challenges to demonstrate your basic cultural awareness and adaptability.",
      challenges: [
        {
          title: "The Writing Style Chameleon",
          description: "Same message, 4 different cultural styles",
          scenario: "Your manager asks you to communicate a project deadline change to different regional stakeholders. Each region expects different levels of formality and communication structure.",
          instructions: "Write the same message in 4 different styles that match each region's cultural communication preferences. Pay attention to vocabulary, sentence structure, and tone. Complete all 4 within time limit.",
          type: "writing",
          timeLimit: 90,
          regions: ['US', 'UK', 'AU', 'CA'],
          eliminationTriggers: [
            "Generic corporate speak for all regions",
            "Inappropriate formality level",
            "Cultural tone-deafness",
            "Takes longer than 20 seconds per response"
          ]
        },
        {
          title: "The Slang Decoder Challenge",
          description: "Decode regional slang and respond appropriately",
          scenario: "You'll receive 10 client messages with regional slang from different cultures. Your mission is to decode the slang and respond appropriately to each.",
          instructions: "Decode regional slang terms and respond in culturally appropriate ways. Show understanding of informal language without taking offense. Complete all responses within time limit.",
          type: "slang",
          timeLimit: 90,
          regions: ['US', 'UK', 'AU', 'CA'],
          eliminationTriggers: [
            "Misunderstand more than 3 slang terms",
            "Respond inappropriately to cultural tone",
            "Show offense at casual/informal language",
            "Take longer than 90 seconds total"
          ]
        }
      ]
    },
    {
      name: "Client Integration Arena", 
      description: "Handle real-world client interactions with cultural sensitivity",
      scenario: "You're now handling live client interactions. You'll face team coordination challenges that require immediate cultural adaptation under pressure.",
      instructions: "Navigate through coordination challenges. Your survival depends on maintaining cultural appropriateness while solving problems.",
      challenges: [
        {
          title: "The Cultural Style Switch",
          description: "Same business problem, 4 different cultural approaches (writing)",
          scenario: "Client's social media campaign is 20% below target metrics. Explain the situation to 4 different clients using their preferred communication style.",
          instructions: "Provide a concise written response for each culture. Adapt your approach to match each region's communication preferences while maintaining professional quality.",
          type: "writing",
          timeLimit: 120,
          regions: ['US', 'UK', 'AU', 'CA'],
          eliminationTriggers: [
            "Same approach for all cultures",
            "Wrong formality level for any region",
            "Cultural stereotyping or insensitivity"
          ]
        }
      ]
    },
    {
      name: "The Pressure Cooker",
      description: "Advanced cultural navigation under extreme pressure",
      scenario: "You're now in high-pressure situations that test your cultural intelligence and professional boundaries. Each challenge requires perfect cultural adaptation while maintaining professionalism.",
      instructions: "Navigate through increasingly sensitive cultural situations. Demonstrate emotional maturity and cultural intelligence under pressure.",
      challenges: [
        {
          title: "The Cultural Landmine Field",
          description: "Navigate 4 increasingly sensitive cultural situations",
          scenario: "You'll face 4 increasingly sensitive situations that test your ability to handle inappropriate comments, passive-aggressive attacks, and cultural insensitivity professionally.",
          instructions: "Navigate each cultural sensitivity appropriately. Maintain professional relationships despite difficult comments. Address underlying concerns without defensive reactions.",
          type: "landmines",
          timeLimit: 150,
          regions: ['US', 'UK', 'AU', 'CA'],
          eliminationTriggers: [
            "Take offense at inappropriate comments",
            "Miss passive-aggressive subtext completely",
            "Give dishonest responses to avoid conflict",
            "Show cultural insensitivity in responses"
          ]
        },
        {
          title: "The Professional Boundary Test",
          description: "Handle clients pushing professional boundaries",
          scenario: "Clients are pushing professional boundaries by asking personal questions, making inappropriate requests, or sharing excessive personal information.",
          instructions: "Maintain appropriate professional boundaries. Redirect conversations back to business appropriately. Handle inappropriate comments with grace while preserving client relationships.",
          type: "boundaries",
          timeLimit: 120,
          regions: ['US', 'UK', 'AU', 'CA'],
          eliminationTriggers: [
            "Share personal information inappropriately",
            "Agree to inappropriate social meetings",
            "Miss red flags in boundary-pushing behavior",
            "Escalate conflict unnecessarily"
          ]
        },
        {
          title: "The Communication Breakdown Crisis",
          description: "Resolve severe misunderstanding across cultures",
          scenario: "There's a serious cultural misunderstanding causing project risk. Your task is to identify the core issue and write a de-escalation message that preserves the relationship.",
          instructions: "Draft a clear, neutral, relationship-preserving message. Identify the misunderstanding without blame and propose next steps.",
          type: "crisis",
          timeLimit: 120,
          regions: ['US', 'UK', 'AU', 'CA'],
          eliminationTriggers: [
            "Assign blame instead of resolving",
            "Over-apologize without action",
            "Ignore cultural subtext",
            "Overly defensive tone"
          ]
        }
      ]
    }
  ];

  const culturalContexts: Record<string, {
    flag: string;
    name: string;
    style: string;
    color: string;
    example: string;
    tone: string;
  }> = {
    US: {
      flag: "🇺🇸",
      name: "United States",
      style: "Direct & Efficient",
      color: "from-blue-600 to-red-600",
      example: "Hey! Quick fix needed - API is down. Can you jump on this ASAP?",
      tone: "Casual confidence, solution-focused"
    },
    UK: {
      flag: "🇬🇧", 
      name: "United Kingdom",
      style: "Polite & Proper",
      color: "from-purple-600 to-blue-800",
      example: "Good morning. I'm rather concerned about the quarterly figures...",
      tone: "Professional diplomacy, structured approach"
    },
    AU: {
      flag: "🇦🇺",
      name: "Australia", 
      style: "Honest & Direct",
      color: "from-yellow-600 to-green-600",
      example: "G'day mate! This project's gone pear-shaped - what's the real story?",
      tone: "Relaxed authenticity, straight-talking"
    },
    CA: {
      flag: "🇨🇦",
      name: "Canada",
      style: "Kind & Considerate", 
      color: "from-red-600 to-red-800",
      example: "Sorry to bother you, but I'm quite worried about the timeline...",
      tone: "Warm empathy, collaborative approach"
    }
  };

  const mockChallenges = {
    voice_intro: {
      US: "Hey team, quick intro for the new guy joining our sprint...",
      UK: "Good morning everyone. I'd like to introduce our new team member...", 
      AU: "G'day everyone! Meet your new teammate...",
      CA: "Hi there, hope everyone's having a good day. I'd like to introduce..."
    },
    writing_adaptation: {
      scenario: "Project deadline moved up by 2 days due to client request",
      US: "Heads up - client moved deadline up 2 days. Totally doable if we prioritize X and Y.",
      UK: "I wanted to update you regarding a timeline adjustment requested by the client...",
      AU: "Quick update - client's moved deadline up 2 days. Tight but doable.",
      CA: "Hi everyone, sorry for short notice, but client asked us to move deadline up 2 days..."
    },
    angry_customers: [
      {
        region: "US",
        level: "Frustrated",
        message: "Your service is pretty disappointing. I expected way better for what I'm paying.",
        context: "Direct but professional de-escalation needed"
      },
      {
        region: "UK", 
        level: "Irate",
        message: "This is absolutely unacceptable. I demand to speak to someone with actual authority.",
        context: "Diplomatic handling of authority challenge"
      },
      {
        region: "AU",
        level: "FURIOUS", 
        message: "This is a complete fucking shambles! You people are bloody useless!",
        context: "Handle extreme language professionally"
      }
    ]
  };

  // Real voice recording functions
  const startRealRecording = async () => {
    try {
      console.log('Starting voice recording...');
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      console.log('Microphone access granted, stream active:', stream.active);
      
      // Create audio context for monitoring
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      
      setAudioContext(audioCtx);
      
      // Monitor audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudioLevel = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          requestAnimationFrame(checkAudioLevel);
        }
      };
      checkAudioLevel();
      
      // Use a simple MediaRecorder with basic settings
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size, event.data.type);
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        console.log('Recording stopped, processing chunks...');
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (chunks.length > 0) {
          // Create audio blob
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          console.log('Recording successful:', {
            blobSize: audioBlob.size,
            chunksCount: chunks.length,
            type: audioBlob.type
          });
          
          setAudioBlob(audioBlob);
          setAudioUrl(audioUrl);
          setAudioChunks([]);
          
          // Analyze the recording
          analyzeVoiceRecording(audioBlob);
        } else {
          console.error('No audio chunks recorded');
          alert('Recording failed - no audio data captured. Please try again.');
        }
        
        // Clean up
        if (audioContext) {
          audioContext.close();
          setAudioContext(null);
        }
        setAudioLevel(0);
        setIsRecording(false);
      };
      
      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setInteractionCount((c) => c + 1);
      setRecordingTime(0);
      
      console.log('Recording started successfully');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions and try again.');
      setIsRecording(false);
    }
  };

  const stopRealRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('Stopping recording...');
      mediaRecorder.stop();
    }
  };

  // Enhanced audio playback function
  const playAudioRecording = async () => {
    if (!audioRef.current || !audioUrl) {
      console.log('No audio to play');
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      console.log('Audio playback started');
    } catch (error) {
      console.error('Audio playback failed:', error);
      alert('Audio playback failed. Please try recording again.');
    }
  };

  // Test function to create a minimal audio file for debugging
  const createTestAudio = () => {
    try {
      console.log('Creating test audio file...');
      
      // Create a simple audio context and oscillator
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const destination = audioCtx.createMediaStreamDestination();
      
      oscillator.connect(destination);
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
      oscillator.start();
      
      // Record for 2 seconds
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        oscillator.stop();
        audioCtx.close();
        
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          console.log('Test audio created:', {
            blobSize: audioBlob.size,
            chunksCount: chunks.length,
            type: audioBlob.type
          });
          
          setAudioBlob(audioBlob);
          setAudioUrl(audioUrl);
          setAudioChunks([]);
          
          // Test the transcription with this audio
          analyzeVoiceRecording(audioBlob);
        }
      };
      
      mediaRecorder.start();
      
      // Stop after 2 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, 2000);
      
    } catch (error) {
      console.error('Test audio creation failed:', error);
    }
  };

  // Test microphone with actual recording
  const testMicrophoneRecording = async () => {
    try {
      console.log('Testing microphone with actual recording...');
      
      if (!canRecord) {
        alert('Microphone not ready. Please check permissions first.');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          console.log('Microphone test successful:', {
            blobSize: audioBlob.size,
            chunksCount: chunks.length
          });
          alert('✅ Microphone test successful! Your microphone is working correctly.');
        } else {
          alert('❌ Microphone test failed - no audio recorded.');
        }
      };
      
      recorder.start();
      alert('🎤 Recording test audio for 3 seconds... Speak into your microphone.');
      
      setTimeout(() => {
        recorder.stop();
      }, 3000);
      
    } catch (error) {
      console.error('Microphone test failed:', error);
      alert(`❌ Microphone test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Simple fallback recording method
  const startFallbackRecording = async () => {
    try {
      console.log('Starting fallback recording...');
      
      if (!canRecord) {
        alert('Microphone not ready. Please check permissions first.');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      // Use Web Audio API to create a simple recording
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const destination = audioCtx.createMediaStreamDestination();
      source.connect(destination);
      
      const recorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        audioCtx.close();
        
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          console.log('Fallback recording successful:', {
            blobSize: audioBlob.size,
            chunksCount: chunks.length
          });
          
          setAudioBlob(audioBlob);
          setAudioUrl(audioUrl);
          setAudioChunks([]);
          analyzeVoiceRecording(audioBlob);
        } else {
          alert('Fallback recording failed - no audio data captured. Please try again.');
        }
        
        setIsRecording(false);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      
      console.log('Fallback recording started');
      
    } catch (error) {
      console.error('Fallback recording failed:', error);
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          alert('Microphone permission denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError') {
          alert('Microphone is busy. Please close other applications using the microphone and try again.');
        } else {
          alert(`Microphone error: ${error.message}`);
        }
      } else {
        alert(`Fallback recording failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setIsRecording(false);
    }
  };

  // Cultural recording handler
  const handleCulturalRecording = async (region: string) => {
    if (!isRecording) {
      // Start recording for this region
      setCurrentRecordingRegion(region);
      await startCulturalRecording(region);
    } else {
      // Stop recording
      stopCulturalRecording();
    }
  };

  // Start cultural recording for specific region
  const startCulturalRecording = async (region: string) => {
    try {
      console.log(`Starting ${region} cultural recording...`);
      
      // Double-check microphone permission before starting
      if (!canRecord) {
        console.log('Microphone not ready, attempting to re-check permissions...');
        await retryMicrophonePermission();
        if (!canRecord) {
          alert('Microphone is not available. Please check your microphone permissions and try again.');
          return;
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      console.log(`${region} microphone access granted, stream active:`, stream.active);
      
      // Create audio context for monitoring
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      
      setAudioContext(audioCtx);
      
      // Monitor audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudioLevel = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          requestAnimationFrame(checkAudioLevel);
        }
      };
      checkAudioLevel();
      
      // Create recorder
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        console.log(`${region} data available:`, event.data.size);
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        console.log(`${region} recording stopped, processing...`);
        
        stream.getTracks().forEach(track => track.stop());
        
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          
          console.log(`${region} recording successful:`, {
            blobSize: audioBlob.size,
            chunksCount: chunks.length
          });
          
          // Analyze the recording for this specific region
          analyzeCulturalVoiceRecording(audioBlob, region);
        } else {
          console.error(`${region} no audio chunks recorded`);
          alert(`${region} recording failed - no audio data captured. Please try again.`);
        }
        
        // Clean up
        if (audioContext) {
          audioContext.close();
          setAudioContext(null);
        }
        setAudioLevel(0);
        setIsRecording(false);
        setCurrentRecordingRegion(null);
      };
      
      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setInteractionCount((c) => c + 1);
      setRecordingTime(0);
      
      console.log(`${region} recording started successfully`);
      
    } catch (error) {
      console.error(`Error starting ${region} recording:`, error);
      
      // Provide specific error messages based on error type
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          alert(`Microphone permission denied for ${region}. Please allow microphone access and try again.`);
        } else if (error.name === 'NotFoundError') {
          alert(`No microphone found for ${region}. Please connect a microphone and try again.`);
        } else if (error.name === 'NotReadableError') {
          alert(`Microphone is busy for ${region}. Please close other applications using the microphone and try again.`);
        } else {
          alert(`Microphone error for ${region}: ${error.message}`);
        }
      } else {
        alert(`Failed to start ${region} recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setIsRecording(false);
      setCurrentRecordingRegion(null);
      
      // Try to re-check microphone permissions
      await retryMicrophonePermission();
    }
  };

  // Stop cultural recording
  const stopCulturalRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('Stopping cultural recording...');
      mediaRecorder.stop();
    }
  };

  // Analyze cultural voice recording for specific region
  const analyzeCulturalVoiceRecording = async (audioBlob: Blob, region: string) => {
    try {
      console.log(`Starting AI analysis for ${region}...`);
      
      // Set transcription loading state for this region
      setIsTranscribing(prev => ({
        ...prev,
        [region]: true
      }));
      
      // 1. Transcribe audio with OpenAI Whisper
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      console.log('Sending audio to OpenAI Whisper...');
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      
      if (!transcribeResponse.ok) {
        const errorText = await transcribeResponse.text();
        console.error('Transcription API Error Response:', errorText);
        throw new Error(`Transcription failed: ${transcribeResponse.status} - ${errorText}`);
      }
      
      let transcript;
      try {
        const responseData = await transcribeResponse.json();
        transcript = responseData.transcript;
        if (!transcript) {
          throw new Error('No transcript in response');
        }
      } catch (parseError) {
        console.error('Failed to parse transcription response:', parseError);
        throw new Error('Invalid transcription response format');
      }
      console.log('Transcription successful:', transcript);
      
      // Update transcript for this region (stored in metrics and later saved to DB on results)
      setCulturalTranscripts(prev => ({
        ...prev,
        [region]: transcript
      }));
      

      // Disable downstream Claude analysis for now per request
      // Simply end the transcribing state
      setIsTranscribing(prev => ({

        ...prev,
        [region]: false
      }));
      

    } catch (error: any) {
      console.error(`Error analyzing ${region} recording:`, error?.message || error);

      setIsTranscribing(prev => ({
        ...prev,
        [region]: false
      }));
      alert(`Failed to process ${region} recording. Please try again.`);
    }
  };

  // Get region-specific prompt for cultural analysis
  const getRegionSpecificPrompt = (region: string, transcript: string) => {
    // Safety check to ensure stages and challenges exist
    if (!stages[currentStage - 1] || !stages[currentStage - 1].challenges || !stages[currentStage - 1].challenges[currentChallenge]) {
      console.warn('Challenge not found, using default prompt');
      return `Analyze this voice response for cultural appropriateness in ${region} context.`;
    }
    
    const currentChallengeTitle = stages[currentStage - 1].challenges[currentChallenge].title;
    
    // Check if this is "The Angry Customer Gauntlet" challenge
    if (currentChallengeTitle === "The Angry Customer Gauntlet") {
      // Special prompt for customer service de-escalation challenge
      const customerComplaints = {
        US: "Your service is pretty disappointing. I expected way better for what I'm paying.",
        UK: "This is absolutely unacceptable. I demand to speak to someone with actual authority who can resolve this properly.",
        AU: "This is a complete fucking shambles! You people are bloody useless! I want my money back RIGHT NOW or I'm posting this disaster everywhere!",
        CA: "This is absolutely unacceptable. I demand to speak to someone with actual authority who can resolve this properly."
      };
      
      const complaint = customerComplaints[region as keyof typeof customerComplaints] || customerComplaints.UK;
      
      return `You are evaluating a customer service response for de-escalation effectiveness in ${region} cultural context.

Customer Complaint: "${complaint}"

Agent's Response: "${transcript}"

Evaluate this response as a customer service professional. Consider:

1. **De-escalation Effectiveness**: Does the response calm the customer and address their frustration?
2. **Cultural Appropriateness**: Does the tone and language match ${region} communication norms?
3. **Professional Standards**: Does it maintain professionalism while showing empathy?
4. **Problem Resolution**: Does it offer concrete solutions or next steps?
5. **Emotional Intelligence**: Does it handle the customer's anger appropriately?

${region}-Specific Cultural Considerations:
${region === 'US' ? 'Direct, solution-focused, enthusiastic but professional tone' :
  region === 'UK' ? 'Polite, formal, diplomatic, structured approach' :
  region === 'AU' ? 'Authentic, straightforward, casual professionalism, honest empathy' :
  'Kind, considerate, empathetic, collaborative tone'}

Provide a JSON response with:
{
  "score": [0-100],
  "deEscalation": "How effectively the response calms the customer",
  "culturalFit": "How well it matches ${region} communication style",
  "professionalism": "Professional standards maintained",
  "solutionOriented": "Whether concrete solutions are offered",
  "improvements": "Specific suggestions for better de-escalation",
  "overallFeedback": "Comprehensive assessment of customer service effectiveness"
}

Score should be 0-100 where:
- 90-100: Excellent de-escalation and cultural fit for ${region}
- 80-89: Very good de-escalation and cultural fit for ${region}
- 70-79: Good de-escalation and cultural fit for ${region}
- Below 70: Needs improvement in de-escalation or cultural adaptation for ${region}

Be strict and evaluate both de-escalation effectiveness AND cultural appropriateness.`;
    }
    

    
    // Original prompt for other challenges
    const basePrompt = `Analyze this voice response for cultural appropriateness in ${region} context.`;
    
    const regionCriteria = {
      US: {
        style: "Direct & Efficient",
        keyTraits: ["directness", "efficiency", "enthusiasm", "solution-focused", "casual confidence"],
        examples: ["Hey team!", "I'm excited to", "ready to jump in", "Let's make this awesome"],
        scoring: "Score higher for: direct language, enthusiasm, efficiency focus, casual but professional tone"
      },
      UK: {
        style: "Polite & Proper", 
        keyTraits: ["formality", "politeness", "diplomacy", "structured approach", "understatement"],
        examples: ["Good morning", "I'm delighted to", "rather looking forward", "I do hope", "excellent results"],
        scoring: "Score higher for: formal language, politeness, diplomatic tone, structured communication"
      },
      AU: {
        style: "Honest & Direct",
        keyTraits: ["authenticity", "straightforwardness", "casual professionalism", "honest enthusiasm", "relaxed confidence"],
        examples: ["G'day", "Stoked to be", "pretty keen", "get stuck in", "smash our goals", "ripper"],
        scoring: "Score higher for: authentic language, casual professionalism, honest enthusiasm, relaxed confidence"
      },
      CA: {
        style: "Kind & Considerate",
        keyTraits: ["empathy", "collaboration", "gentle politeness", "considerate language", "warm professionalism"],
        examples: ["Hi there", "hope everyone's having a good day", "quite excited", "really looking forward", "hopefully"],
        scoring: "Score higher for: empathetic language, collaborative tone, gentle politeness, warm professionalism"
      }
    };

    const criteria = regionCriteria[region as keyof typeof regionCriteria];
    
    return `${basePrompt}

Cultural Context: ${criteria.style}
Voice Response: "${transcript}"

Key Cultural Traits to Evaluate:
${criteria.keyTraits.map(trait => `- ${trait}`).join('\n')}

Examples of Good ${region} Communication:
${criteria.examples.map(example => `- "${example}"`).join('\n')}

Scoring Guidelines: ${criteria.scoring}

Evaluate and provide a JSON response with:
{
  "score": [0-100],
  "tone": "Description of tone appropriateness",
  "culturalSensitivity": "How well it matches ${region} communication norms",
  "professionalLevel": "Professional standards maintained",
  "improvements": "Specific suggestions for better ${region} cultural fit",
  "overallFeedback": "Comprehensive assessment of cultural adaptation"
}

Score should be 0-100 where:
- 90-100: Excellent cultural match for ${region}
- 80-89: Very good cultural match for ${region}
- 70-79: Good cultural match for ${region}
- Below 70: Needs improvement in ${region} cultural adaptation

Be strict and differentiate between regions. A response that's perfect for US might score poorly for UK, and vice versa.`;
  };

  // Get region-specific fallback score when AI analysis fails
  const getFallbackScore = (region: string, transcript: string): number => {
    // Safety check to ensure stages and challenges exist
    if (!stages[currentStage - 1] || !stages[currentStage - 1].challenges || !stages[currentStage - 1].challenges[currentChallenge]) {
      console.warn('Challenge not found, using default fallback scoring');
      return 60; // Default fallback score
    }
    
    const currentChallengeTitle = stages[currentStage - 1].challenges[currentChallenge].title;
    
    // Check if this is "The Angry Customer Gauntlet" challenge
    if (currentChallengeTitle === "The Angry Customer Gauntlet") {
      // Fallback scoring for customer service de-escalation
      const baseScore = 55; // Lower base score for de-escalation challenge
      const transcriptLower = transcript.toLowerCase();
      let bonus = 0;
      
      // Check for de-escalation keywords
      if (transcriptLower.includes('understand') || transcriptLower.includes('apologize') || transcriptLower.includes('sorry')) bonus += 8;
      if (transcriptLower.includes('help') || transcriptLower.includes('resolve') || transcriptLower.includes('fix')) bonus += 7;
      if (transcriptLower.includes('calm') || transcriptLower.includes('patient') || transcriptLower.includes('listen')) bonus += 6;
      if (transcriptLower.includes('solution') || transcriptLower.includes('next step') || transcriptLower.includes('action')) bonus += 5;
      
      // Region-specific de-escalation bonuses
      switch (region) {
        case 'US':
          if (transcriptLower.includes('absolutely') || transcriptLower.includes('right away')) bonus += 3;
          break;
        case 'UK':
          if (transcriptLower.includes('certainly') || transcriptLower.includes('immediately')) bonus += 3;
          break;
        case 'AU':
          if (transcriptLower.includes('straight away') || transcriptLower.includes('no worries')) bonus += 3;
          break;
        case 'CA':
          if (transcriptLower.includes('absolutely') || transcriptLower.includes('right away')) bonus += 3;
          break;
      }
      
      // Add some randomness to ensure different scores
      const randomBonus = Math.floor(Math.random() * 10);
      
      return Math.min(75, baseScore + bonus + randomBonus); // Cap at 75 for de-escalation fallback
    }
    

    
    // Original fallback scoring for other challenges
    const baseScore = 60; // Base score for all regions
    
    // Add region-specific bonuses based on transcript content
    const transcriptLower = transcript.toLowerCase();
    let bonus = 0;
    
    switch (region) {
      case 'US':
        if (transcriptLower.includes('hey') || transcriptLower.includes('team')) bonus += 10;
        if (transcriptLower.includes('excited') || transcriptLower.includes('ready')) bonus += 8;
        if (transcriptLower.includes('jump in') || transcriptLower.includes('awesome')) bonus += 7;
        break;
      case 'UK':
        if (transcriptLower.includes('good morning') || transcriptLower.includes('delighted')) bonus += 10;
        if (transcriptLower.includes('rather') || transcriptLower.includes('excellent')) bonus += 8;
        if (transcriptLower.includes('hope') || transcriptLower.includes('objectives')) bonus += 7;
        break;
      case 'AU':
        if (transcriptLower.includes('gday') || transcriptLower.includes('stoked')) bonus += 10;
        if (transcriptLower.includes('keen') || transcriptLower.includes('smash')) bonus += 8;
        if (transcriptLower.includes('ripper') || transcriptLower.includes('stuck in')) bonus += 7;
          break;
      case 'CA':
        if (transcriptLower.includes('hope everyone') || transcriptLower.includes('quite excited')) bonus += 10;
        if (transcriptLower.includes('really looking forward') || transcriptLower.includes('hopefully')) bonus += 8;
        if (transcriptLower.includes('working together') || transcriptLower.includes('great results')) bonus += 7;
        break;
    }
    
    // Add some randomness to ensure different scores
    const randomBonus = Math.floor(Math.random() * 15);
    
    return Math.min(100, baseScore + bonus + randomBonus);
  };

  // Generate sample script for specific region using Claude API
  const generateSampleScript = async (region: string) => {
    try {
      setIsGeneratingScript(region);
      console.log(`Generating ${region} sample script...`);
      
      const prompt = `Create a natural, authentic sample script for someone introducing themselves to a new team in ${region} cultural communication style.

Cultural Context: ${culturalContexts[region as keyof typeof culturalContexts].style}
Region: ${region}

Requirements:
- Should be 2-3 sentences long (15-25 seconds when spoken)
- Must authentically reflect ${region} communication norms
- Should sound natural and conversational, not forced
- Include appropriate greetings, enthusiasm, and team-focused language
- Match the cultural style: ${culturalContexts[region as keyof typeof culturalContexts].style}
- Use generic language (avoid specific names, companies, or personal details)
- Focus on role, enthusiasm, and team collaboration
- Keep it professional but culturally appropriate

Return ONLY the script text, no explanations or formatting. Make it sound like a real person speaking naturally in ${region} style.`;

      console.log('Sending request to /api/analyze-cultural with:', {
        prompt,
        transcript: '',
        region,
        generateScript: true
      });

      const response = await fetch('/api/analyze-cultural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          transcript: '', 
          region,
          generateScript: true 
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Script generation failed: ${response.status} - ${errorText}`);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log('Full API response:', responseData);
      } catch (parseError) {
        console.error('Failed to parse script generation response:', parseError);
        throw new Error('Invalid script generation response format');
      }

      if (!responseData.success) {
        throw new Error(`API returned error: ${responseData.error || 'Unknown error'}`);
      }

      const { analysis } = responseData;
      const script = analysis?.feedback || analysis?.overallFeedback || 'Script generation failed';
      
      console.log(`${region} script generated:`, script);
      
      // Store the generated script
      setGeneratedScripts(prev => ({
        ...prev,
        [region]: script
      }));

    } catch (error) {
      console.error(`Error generating ${region} script:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate ${region} script: ${errorMessage}`);
    } finally {
      setIsGeneratingScript(null);
    }
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      startRealRecording();
    } else {
      stopRealRecording();
    }
  };

  // Analyze voice recording for cultural fit using AI
  const analyzeVoiceRecording = async (audioBlob: Blob) => {
    try {
      setIsAnalyzingVoice(true);
      console.log('Starting AI voice analysis...');
      
      // 1. Transcribe audio with OpenAI Whisper
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      
      if (!transcribeResponse.ok) {
        const errorText = await transcribeResponse.text();
        console.error('Transcription API Error Response:', errorText);
        throw new Error(`Transcription failed: ${transcribeResponse.status} - ${errorText}`);
      }
      
      let transcript;
      try {
        const responseData = await transcribeResponse.json();
        transcript = responseData.transcript;
        if (!transcript) {
          throw new Error('No transcript in response');
        }
      } catch (parseError) {
        console.error('Failed to parse transcription response:', parseError);
        throw new Error('Invalid transcription response format');
      }
      console.log('Transcription successful:', transcript);
      
      // 2. Analyze cultural fit with Claude
      const current = stages[currentStage - 1].challenges[currentChallenge];
      const currentRegion = current.regions?.[0] || 'US';
      
      const prompt = `Analyze this voice response for cultural appropriateness in ${currentRegion} context:
      
      Cultural Context: ${culturalContexts[currentRegion].style}
      Voice Response: "${transcript}"
      
      Evaluate and provide a JSON response with:
      {
        "score": 85,
        "tone": "Appropriate for US direct style",
        "culturalSensitivity": "Good understanding of US communication norms",
        "professionalLevel": "Maintains professional standards",
        "improvements": "Could be more concise",
        "overallFeedback": "Strong cultural adaptation with room for improvement"
      }
      
      Score should be 0-100 where:
      - 90-100: Excellent cultural match
      - 80-89: Very good cultural match  
      - 70-79: Good cultural match
      - Below 70: Needs improvement in cultural adaptation`;
      
      const analysisResponse = await fetch('/api/analyze-cultural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, transcript, region: currentRegion })
      });
      
      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('Cultural Analysis API Error Response:', errorText);
        throw new Error(`Cultural analysis failed: ${analysisResponse.status} - ${errorText}`);
      }
      
      let analysis;
      try {
        const responseData = await analysisResponse.json();
        analysis = responseData.analysis;
        if (!analysis) {
          throw new Error('No analysis in response');
        }
      } catch (parseError) {
        console.error('Failed to parse cultural analysis response:', parseError);
        throw new Error('Invalid cultural analysis response format');
      }
      console.log('Cultural analysis successful:', analysis);
      
      // Update cultural scores based on AI analysis
      const score = analysis.score || 75;
      setCulturalScores(prev => ({
        ...prev,
        [currentRegion]: Math.min(100, prev[currentRegion] + score/10)
      }));
      
      // Update survival status after score change
      setTimeout(() => updateSurvivalStatus(), 0);
      
      // Add achievements based on performance
      if (score > 85) {
        addAchievement(`${culturalContexts[currentRegion].flag} Cultural Master`);
      } else if (score > 70) {
        addAchievement(`${culturalContexts[currentRegion].flag} Cultural Learner`);
      }
      
      // Mark voice completion flags depending on active challenge type
      if (current.type === 'combo') {
        setComboVoiceDone(true);
      } else if (current.type === 'ultimate') {
        setBossVoiceDone(true);
      }
      
      // Store transcript for display
      setCurrentResponse(transcript);
      
      // Automatically advance to next challenge after voice submission
      // Only auto-advance if this is not a combo challenge or if both parts are done
      const currentChallengeData = stages[currentStage - 1].challenges[currentChallenge];
      if (currentChallengeData.type !== 'combo' || (comboVoiceDone && comboWriteDone)) {
        setTimeout(() => {
          nextChallenge();
        }, 1000); // 1 second delay to show feedback
      }
      
      return analysis;
      
    } catch (error) {
      console.error('AI voice analysis failed, using fallback:', error);
      
      // Fallback to current simulation
      const duration = recordingTime;
      const baseScore = Math.min(100, 60 + (duration * 2));
      const region = ['US', 'UK', 'AU', 'CA'][Math.floor(Math.random() * 4)] as keyof typeof culturalContexts;
      const score = Math.min(100, baseScore + Math.random() * 20);
      
      setCulturalScores(prev => ({
        ...prev,
        [region]: Math.min(100, prev[region] + score/10)
      }));
      
      // Update survival status after fallback score
      setTimeout(() => updateSurvivalStatus(), 0);
      
      if (score > 85) {
        addAchievement(`${culturalContexts[region].flag} Cultural Master`);
      }
      
      // Mark completion flags
      const current = stages[currentStage - 1].challenges[currentChallenge];
      if (current.type === 'combo') {
        setComboVoiceDone(true);
      } else if (current.type === 'ultimate') {
        setBossVoiceDone(true);
      }
      
      // Automatically advance to next challenge after voice submission
      // Only auto-advance if this is not a combo challenge or if both parts are done
      const currentChallengeData = stages[currentStage - 1].challenges[currentChallenge];
      if (currentChallengeData.type !== 'combo' || (comboVoiceDone && comboWriteDone)) {
        setTimeout(() => {
          nextChallenge();
        }, 1000); // 1 second delay to show feedback
      }
      
      return { score, feedback: 'Fallback analysis used' };
    } finally {
      setIsAnalyzingVoice(false);
    }
  };

  // Enhanced cultural analysis for text input
  const analyzeCulturalFit = (text: string) => {
    const analysis = {
      US: 0, UK: 0, AU: 0, CA: 0, overall: 0
    };
    
    // Cultural keyword analysis
    const usKeywords = ['direct', 'efficient', 'quick', 'asap', 'heads up', 'jump on', 'fix', 'team'];
    const ukKeywords = ['rather', 'concerned', 'regarding', 'adjustment', 'proper', 'good morning', 'structured', 'diplomatic'];
    const auKeywords = ['mate', 'honest', 'straight', 'real', 'authentic', 'gday', 'pear-shaped', 'bloody'];
    const caKeywords = ['sorry', 'bother', 'worried', 'timeline', 'collaborative', 'hope', 'having a good day', 'quite'];
    
    // Score based on keyword presence and text length
    const textLower = text.toLowerCase();
    
    usKeywords.forEach(word => {
      if (textLower.includes(word)) analysis.US += 8;
    });
    ukKeywords.forEach(word => {
      if (textLower.includes(word)) analysis.UK += 8;
    });
    auKeywords.forEach(word => {
      if (textLower.includes(word)) analysis.AU += 8;
    });
    caKeywords.forEach(word => {
      if (textLower.includes(word)) analysis.CA += 8;
    });
    
    // Bonus for appropriate length and structure
    if (text.length > 20) {
      analysis.US += 5;
      analysis.UK += 5;
      analysis.AU += 5;
      analysis.CA += 5;
    }
    
    // Cap scores at 100
    analysis.US = Math.min(100, analysis.US);
    analysis.UK = Math.min(100, analysis.UK);
    analysis.AU = Math.min(100, analysis.AU);
    analysis.CA = Math.min(100, analysis.CA);
    
    analysis.overall = (analysis.US + analysis.UK + analysis.AU + analysis.CA) / 4;
    return analysis;
  };

  const handleWritingSubmit = () => {
    if (currentResponse.length > 10) {
      // Real-time cultural analysis
      const culturalAnalysis = analyzeCulturalFit(currentResponse);
      
      // Update scores based on actual content analysis
      Object.entries(culturalAnalysis).forEach(([region, score]) => {
        if (region !== 'overall') {
          setCulturalScores(prev => ({
            ...prev,
            [region]: Math.min(100, prev[region as keyof typeof culturalScores] + score/10)
          }));
        }
      });
      
      setInteractionCount((c) => c + 1);
      
      // Check for achievements based on performance
      if (culturalAnalysis.overall > 80) {
        addAchievement("🌟 Cultural Chameleon");
      }
      
      // Add specific cultural achievements
      if (culturalAnalysis.US > 85) addAchievement("🇺🇸 US Communication Expert");
      if (culturalAnalysis.UK > 85) addAchievement("🇬🇧 UK Communication Expert");
      if (culturalAnalysis.AU > 85) addAchievement("🇦🇺 AU Communication Expert");
      if (culturalAnalysis.CA > 85) addAchievement("🇨🇦 CA Communication Expert");


      // Persist the currentResponse into the correct challenge field (local state to be saved on results)
      const challenge = stages[currentStage - 1]?.challenges?.[currentChallenge]
      if (challenge) {
        // Map writing-type challenges to state fields
        // 1B, 1C, 2A, 3A, 3B, 3C are writing inputs
        const title = String(challenge.title || '').toLowerCase()
        setGeneratedScripts(prev => ({ ...prev })) // keep same shape
        setCulturalTranscripts(prev => ({ ...prev })) // no-op, but ensures state refs stay stable
        // Store into a dedicated map so it can be included on save
        if ((window as any).bpocWriting == null) (window as any).bpocWriting = {}
        const map = (window as any).bpocWriting as Record<string,string>
        if (title.includes('writing style chameleon')) map.c1b_text = currentResponse
        else if (title.includes('slang decoder')) map.c1c_text = currentResponse
        else if (title.includes('cultural style switch')) map.c2a_text = currentResponse
        else if (title.includes('cultural landmine')) map.c3a_text = currentResponse
        else if (title.includes('professional boundary')) map.c3b_text = currentResponse
        else if (title.includes('communication breakdown')) map.c3c_text = currentResponse
      }

      // Clear response and move to next challenge
      setCurrentResponse('');

      const current = stages[currentStage - 1].challenges[currentChallenge];
      if (current.type === 'combo') {
        setComboWriteDone(true);
      }

      nextChallenge();

    }
  };

  const nextChallenge = () => {
    const currentStageData = stages[currentStage - 1];
    if (currentChallenge < currentStageData.challenges.length - 1) {
      console.log('Moving to next challenge...');
      console.log('State before moving:', {
        interactionCount,
        culturalScores,
        achievements: achievements?.length || 0
      });
      
      setCurrentChallenge(prev => prev + 1);
      // Reset challenge-specific state when moving to next challenge
      resetChallengeState();
      
      console.log('State after moving (challenge-specific reset):', {
        interactionCount,
        culturalScores,
        achievements: achievements?.length || 0
      });
    } else if (currentStage < stages.length) {
      console.log('Moving to next stage...');
      console.log('State before moving:', {
        interactionCount,
        culturalScores,
        achievements: achievements?.length || 0
      });
      
      setCurrentStage(prev => prev + 1);
      setCurrentChallenge(0);
      // Reset challenge-specific state when moving to next stage
      resetChallengeState();
      
      console.log('State after moving (challenge-specific reset):', {
        interactionCount,
        culturalScores,
        achievements: achievements?.length || 0
      });
    } else {
      console.log('Game completed, calculating final survival status...');
      // Calculate final survival status before showing results
      const finalSurvivalStatus = calculateSurvivalStatus();
      console.log('Game completion: Setting survival status to:', finalSurvivalStatus);
      setSurvivalStatus(finalSurvivalStatus);
      setGameState('results');
    }
  };

  const resetChallengeState = () => {
    console.log('resetChallengeState called - resetting challenge-specific state only');
    console.log('State before reset:', {
      interactionCount,
      culturalScores,
      achievements: achievements?.length || 0
    });
    
    setCurrentResponse('');
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioChunks([]);
    setIsRecording(false);
    setRecordingTime(0);
    setCurrentRecordingRegion(null);
    setComboVoiceDone(false);
    setComboWriteDone(false);
    setBossVoiceDone(false);
    setBossTimer(30);
    setIsAnalyzingVoice(false);
    setIsGeneratingScript(null);
    setIsTranscribing({ US: false, UK: false, AU: false, CA: false });
    setCulturalTranscripts({ US: '', UK: '', AU: '', CA: '' });
    setGeneratedScripts({ US: '', UK: '', AU: '', CA: '' });
    setAudioLevel(0);
    setMediaRecorder(null);
    setCanRecord(false);
    setAudioContext(null);
    setToastAchievement(null);
    setStageAchievements({});
    // DON'T reset interactionCount - it should accumulate across all challenges
    // DON'T reset culturalScores - they should persist across challenges
    // DON'T reset achievements - they should accumulate across challenges
    // DON'T reset timeLeft - it's the overall game timer
    
    console.log('State after reset (should preserve cumulative values):', {
      interactionCount,
      culturalScores,
      achievements: achievements?.length || 0
    });
  };

  const calculateSurvivalStatus = () => {
    console.log('calculateSurvivalStatus called with:', {
      interactionCount,
      culturalScores,
      achievements: achievements?.length || 0,
      timeLeft
    });
    
    // If no interactions, survival status should be 0%
    if (interactionCount === 0) {
      console.log('No interactions, returning 0');
      return 0;
    }

    // Calculate based on cultural scores and completion rate
    const avgScore = Object.values(culturalScores || {}).reduce((a, b) => a + b, 0) / 4;
    console.log('Average score:', avgScore);
    
    // Base survival on average score
    let survival = Math.max(0, Math.min(100, avgScore));
    console.log('Base survival:', survival);
    
    // Bonus for achievements (up to 10%)
    const achievementBonus = Math.min(10, (achievements?.length || 0) * 2);
    survival = Math.min(100, survival + achievementBonus);
    console.log('Survival after achievement bonus:', survival);
    
    // Penalty for incomplete game (if time ran out)
    if (timeLeft === 0) {
      survival = Math.max(0, survival - 20);
      console.log('Survival after time penalty:', survival);
    }
    
    const finalSurvival = Math.round(survival);
    console.log('Final survival status:', finalSurvival);
    return finalSurvival;
  };

  const updateSurvivalStatus = () => {
    console.log('updateSurvivalStatus called');
    const newSurvivalStatus = calculateSurvivalStatus();
    console.log('Setting survival status to:', newSurvivalStatus);
    setSurvivalStatus(newSurvivalStatus);
  };

  const calculateTier = () => {
    // Safety checks
    if (!culturalScores || !achievements) {
      console.warn('calculateTier: culturalScores or achievements not initialized');
      return {
        tier: "Unknown",
        icon: "❓",
        color: "from-gray-500 to-gray-700",
        description: "Unable to calculate tier - data not available"
      };
    }

    // If the user hasn't interacted with any challenge, force the lowest tier
    if (interactionCount === 0) {
      return {
        tier: "No Participation",
        icon: "🕒",
        color: "from-gray-500 to-gray-700",
        description: "No challenges were completed. Play the arena to earn a cultural rating."
      };
    }

    const avgScore = Object.values(culturalScores).reduce((a, b) => a + b, 0) / 4;
    const achievementCount = achievements.length;
    
    if (avgScore >= 90 && achievementCount >= 5) {
      return {
        tier: "Cultural Legend",
        icon: "🌟",
        color: "from-yellow-400 to-yellow-600",
        description: "Global Communication Master - Perfect for any international client"
      };
    } else if (avgScore >= 80 && achievementCount >= 3) {
      return {
        tier: "Cultural Master", 
        icon: "🏆",
        color: "from-blue-500 to-purple-600",
        description: "Excellent cultural adaptation - Premium client tier"
      };
    } else if (avgScore >= 70) {
      return {
        tier: "Cultural Professional",
        icon: "🥈", 
        color: "from-gray-400 to-gray-600",
        description: "Good cultural awareness - Standard placement tier"
      };
    } else if (avgScore >= 50) {
      return {
        tier: "Cultural Trainee",
        icon: "🥉",
        color: "from-orange-500 to-orange-700", 
        description: "Basic competency - Needs cultural development"
      };
    } else {
      // Preserve internal scoring but avoid negative phrasing in UI
      return {
        tier: "Needs Development",
        icon: "🧭",
        color: "from-orange-500 to-orange-700",
        description: "Early-stage cultural competency — see AI recommendations below"
      };
    }
  };

  const restartGame = () => {
    console.log('Restarting game...');
    console.log('State before restart:', {
      survivalStatus,
      interactionCount,
      culturalScores,
      achievements: achievements?.length || 0
    });
    
    setGameState('playing');
    setCurrentStage(1);
    setCurrentChallenge(0);
    setTimeLeft(300);
    setCulturalScores({ US: 0, UK: 0, AU: 0, CA: 0 });
    setAchievements([]);
    setInteractionCount(0); // Reset for new game
    setSurvivalStatus(0); // Reset for new game
    // Don't set survival status here - it will be calculated when game ends
    setCurrentResponse('');
    setCurrentRecordingRegion(null);
    setCulturalTranscripts({ US: '', UK: '', AU: '', CA: '' });
    setGeneratedScripts({ US: '', UK: '', AU: '', CA: '' });
    setIsGeneratingScript(null);
    setIsTranscribing({ US: false, UK: false, AU: false, CA: false });
    
    console.log('State after restart:', {
      survivalStatus: 0,
      interactionCount: 0,
      culturalScores: { US: 0, UK: 0, AU: 0, CA: 0 },
      achievements: []
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    console.log('Starting game...');
    console.log('Initial state values:', {
      survivalStatus,
      interactionCount,
      culturalScores,
      achievements: achievements?.length || 0
    });
    setGameState('playing');
  };

  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Header />
        
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={handleBackClick}
                  className="mr-4 text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <div className="flex items-center">
                  <Globe className="h-12 w-12 text-green-400 mr-4" />
                  <div>
                    <h1 className="text-4xl font-bold gradient-text">BPOC Cultural</h1>
                    <p className="text-gray-400">The Ultimate Client Survival Arena</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-center mb-6">
                      <div>
                        <CardTitle className="text-3xl font-bold gradient-text mb-2">
                          Welcome to BPOC Cultural!
                        </CardTitle>
                        <p className="text-gray-300 text-lg">
                          The Ultimate Client Survival Arena
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-6 text-left max-w-3xl mx-auto">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-400" />
                          How to Play
                        </h3>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">🎯</span>
                            <span>Navigate through 4 stages of cultural communication challenges</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">🌍</span>
                            <span>Master communication across US, UK, Australian, and Canadian cultures</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">📖</span>
                            <span>Each stage includes detailed scenarios and clear instructions</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">🎤</span>
                            <span>Record voice responses and adapt writing styles in real-time</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">💎</span>
                            <span>Become a Cultural Chameleon - the ultimate global communicator</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">⚠️</span>
                            <span>One cultural mistake = instant elimination</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">🏆</span>
                            <span>Survive 25 minutes to become a Global Communication Legend</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-lg border border-white/10" style={{ backgroundColor: '#111315' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-5 w-5 text-green-400" />
                            <h4 className="text-white font-semibold">Cultural Mastery</h4>
                          </div>
                          <p className="text-gray-300 text-sm">Test your ability to adapt communication styles across different English-speaking cultures!</p>
                        </div>
                      <div className="p-4 rounded-lg border border-white/10" style={{ backgroundColor: '#111315' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5 text-blue-400" />
                            <h4 className="text-white font-semibold">Voice & Writing</h4>
                          </div>
                          <p className="text-gray-300 text-sm">Master both spoken and written communication in high-pressure scenarios!</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <Button
                      onClick={proceedToIntro}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-6 h-14"
                    >
                      <Play className="h-6 w-6 mr-3" />
                      Start the Cultural Game
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  // Results Screen
  if (gameState === 'results') {
    try {
      // Debug logging to identify the issue
      console.log('Results page loading with state:', {
        gameState,
        stages: !!stages,
        stagesLength: stages?.length,
        culturalScores,
        achievements,
        currentStage,
        currentChallenge,
        timeLeft,
        survivalStatus,
        interactionCount
      });
      
      // Additional debugging for survival status calculation
      console.log('Survival status details:', {
        currentSurvivalStatus: survivalStatus,
        interactionCount,
        culturalScoresValues: Object.values(culturalScores || {}),
        culturalScoresSum: Object.values(culturalScores || {}).reduce((a, b) => a + b, 0),
        culturalScoresAvg: Object.values(culturalScores || {}).reduce((a, b) => a + b, 0) / 4,
        achievementsCount: achievements?.length || 0,
        timeLeft
      });
      
      // Recalculate survival status to verify
      const recalculatedSurvival = calculateSurvivalStatus();
      console.log('Recalculated survival status:', recalculatedSurvival);
      if (recalculatedSurvival !== survivalStatus) {
        console.warn('Survival status mismatch! Current:', survivalStatus, 'Recalculated:', recalculatedSurvival);
      }

    // Safety checks to prevent runtime errors
    if (!stages || !Array.isArray(stages)) {
      console.error('Stages not properly initialized:', stages);
    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        <Header />
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Game Error</h1>
                <p className="text-gray-300 mb-6">There was an issue loading the game results. Please try refreshing the page.</p>
                <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                  </div>
                </div>
              </div>
        </div>
      );
    }

    // Additional safety check for stages array content
    if (stages.length === 0 || !stages[0] || !stages[0].challenges) {
      console.error('Stages array is empty or malformed:', stages);
      return (
        <div className="min-h-screen cyber-grid overflow-hidden">
          <Header />
          <div className="pt-16 relative z-10">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Game Configuration Error</h1>
                <p className="text-gray-300 mb-6">The game configuration is not properly loaded. Please try refreshing the page.</p>
                <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

    // Ensure culturalScores has all required values
    const safeCulturalScores = {
      US: culturalScores?.US || 0,
      UK: culturalScores?.UK || 0,
      AU: culturalScores?.AU || 0,
      CA: culturalScores?.CA || 0
    };

    // Ensure currentStage and currentChallenge are valid
    const safeCurrentStage = currentStage || 1;
    const safeCurrentChallenge = currentChallenge || 0;

    const tier = calculateTier();

    const avgScore = Math.round(Object.values(culturalScores).reduce((a, b) => a + b, 0) / 4);

    
    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Header />

        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header row with Back like other games */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/career-tools/games')}
                  className="mr-4 text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <div className="flex items-center">
                  <Globe className="h-12 w-12 text-green-400 mr-4" />
                  <div>
                    <h1 className="text-4xl font-bold gradient-text">BPOC Cultural</h1>
                    <p className="text-gray-400">The Ultimate Client Survival Arena</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="glass-card border-white/10 mb-6">
                <CardContent className="p-8">
                  <div className="text-6xl mb-4">{tier?.icon || '🏆'}</div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">Arena Complete!</h1>
                  <p className="text-gray-300 mb-6">Great work{playerName ? `, ${playerName}` : ''}! Here's your cultural performance.</p>


                  {/* Tier hidden from UI per request; relying on AI analysis result */}

                  {/* AI Analysis Summary */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">AI Cultural Analysis</h3>
                    {analysisLoading && (
                      <div className="flex flex-col items-center justify-center py-6 gap-3">
                        <PacmanLoader color="#fbbf24" size={28} speedMultiplier={1.1} />
                        <div className="text-gray-300 text-sm">Analyzing cultural responses…</div>

                      </div>
                    )}
                    {!analysisLoading && analysisSummary && (
                      <div className="text-sm text-gray-200 whitespace-pre-wrap">{analysisSummary}</div>
                    )}
                    {!analysisLoading && !analysisSummary && (
                      <div className="text-gray-400 text-sm">Analysis will appear here after your results are saved.</div>
                    )}
                  </div>


                  {/* Detailed Analysis (if available) */}
                  {analysisResult && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Recommendation */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-sm text-gray-300 mb-1">Hire Recommendation</div>
                        <div className="text-xl font-bold text-white">
                          {String(analysisResult.hire_recommendation || '').replace(/_/g, ' ').toUpperCase() || '—'}
                        </div>
                      </div>
                      {/* Writing Score */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-sm text-gray-300 mb-1">Writing Score</div>
                        <div className="text-xl font-bold text-white">{analysisResult?.writing?.score ?? '—'}</div>
                        <div className="text-xs text-gray-400">Style: {analysisResult?.writing?.style || '—'} • Tone: {analysisResult?.writing?.tone || '—'}</div>
                      </div>
                      {/* Per-Region Recommendation */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-sm text-gray-300 mb-1">Per‑Region Recommendation</div>
                      <div className="flex flex-wrap gap-2">
                          {['US','UK','AU','CA'].map((r) => {
                            const val = analysisResult?.per_region_recommendation?.[r]
                            const color = val === 'hire' ? 'bg-green-600/20 text-green-300 border-green-500/30' : val === 'maybe' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' : 'bg-red-600/20 text-red-300 border-red-500/30'
                            return (
                              <span key={r} className={`px-2 py-1 rounded border text-xs ${color}`}>{r}: {String(val || '—').toUpperCase()}</span>
                            )
                          })}
                      </div>
                      </div>
                    </div>
                  )}

                  {analysisResult && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Strengths & Risks */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-white font-semibold mb-2">Strengths</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-200 space-y-1">
                          {(analysisResult.strengths || []).map((s: string, i: number) => (
                            <li key={`s-${i}`}>{s}</li>
                          ))}
                        </ul>
                        <h4 className="text-white font-semibold mt-4 mb-2">Risks</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-200 space-y-1">
                          {(analysisResult.risks || []).map((r: string, i: number) => (
                            <li key={`r-${i}`}>{r}</li>
                          ))}
                        </ul>
                  </div>

                      {/* Writing Analysis */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 overflow-x-auto">
                        <h4 className="text-white font-semibold mb-2">Writing Analysis</h4>
                        <div className="text-xs text-gray-400 mb-2">Style: {analysisResult?.writing?.style || '—'} • Tone: {analysisResult?.writing?.tone || '—'} • Score: {analysisResult?.writing?.score ?? '—'}</div>
                        <ul className="list-disc pl-5 text-sm text-gray-200 space-y-1">
                          {(analysisResult?.writing?.issues || []).map((w: string, i: number) => (
                            <li key={`w-${i}`}>{w}</li>
                          ))}
                        </ul>
                    </div>

                    </div>
                  )}

                </CardContent>
              </Card>

              {/* Actions below card (full width like results card) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-2">
                <Button
                  onClick={() => router.push('/career-tools/games')}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2"/>
                  Back to Main Menu
                </Button>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'My BPOC Cultural Results',
                        text: `Average: ${avgScore}% | Achievements: ${achievements?.length || 0} | Survival: ${survivalStatus}%`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(`BPOC Cultural Results — Average: ${avgScore}% | Achievements: ${achievements?.length || 0} | Survival: ${survivalStatus}%`);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <Share className="w-4 h-4 mr-2"/>
                  Share
                </Button>
                <Button
                  onClick={restartGame}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2"/>
                  Play Again
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
    } catch (error) {
      console.error('Error rendering results page:', error);
      return (
        <div className="min-h-screen cyber-grid overflow-hidden">
          <Header />
          <div className="pt-16 relative z-10">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Unexpected Error</h1>
                <p className="text-gray-300 mb-6">An unexpected error occurred while loading the results. Please try refreshing the page.</p>
                <div className="text-sm text-gray-500 mb-4 font-mono">
                  Error: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
                <Button onClick={() => window.location.reload()}>Refresh Page</Button>
              </div>
          </div>
        </div>
      </div>
    );
    }
  }

  // Main Game Screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <Header />
        
        <div className="pt-16 relative z-10 h-screen">
          <div className="container mx-auto px-4 h-[calc(100vh-140px)]">
            {/* Compact Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={handleBackClick}
                  className="mr-4 text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold gradient-text">BPOC Cultural</h1>
                    <p className="text-sm text-gray-400">The Ultimate Client Survival Arena</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side-by-Side Layout */}
            <div className="flex gap-6 h-[calc(100vh-200px)]">
              {/* Left Sidebar - Progress & Stats */}
              <div className="w-1/3 space-y-4 overflow-hidden">




                {/* Timer & Survival - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card border-white/10">
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                            <Timer className="w-4 h-4" />
                            <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
                          </div>
                          <div className="text-xs text-gray-400">Arena Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{survivalStatus}%</div>
                          <div className="text-xs text-gray-400">Survival</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Progress Bar - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card border-white/10">
                    <CardContent className="p-3">
                      {/* Progress Info - Top Right */}
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-gray-300 text-xs">Stage {currentStage} Challenge {String.fromCharCode(65 + currentChallenge)}</div>
                        <div className="text-white font-bold text-sm">
                          {Math.round(((currentStage - 1) * 4 + currentChallenge) / (stages.length * 4) * 100)}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700 overflow-hidden relative">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full shadow-lg"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentStage - 1) * 4 + currentChallenge) / (stages.length * 4) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Achievements - Compact */}
                {achievements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="glass-card border-white/10">
                      <CardContent className="p-3">
                        <h3 className="text-sm font-bold text-white mb-2">Achievements</h3>
                        <div className="space-y-1">
                          {achievements.slice(0, 3).map((achievement, index) => (
                            <div key={index} className="text-xs text-yellow-400 flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {achievement}
                            </div>
                          ))}
                          {achievements.length > 3 && (
                            <div className="text-xs text-gray-400">+{achievements.length - 3} more</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Right Side - Main Game Content */}
              <div className="w-2/3 overflow-y-auto">
                <motion.div
                  key={`${currentStage}-${currentChallenge}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Challenge header - Compact */}
                  <div className="rounded-xl p-4 text-center border border-white/10 relative" style={{ backgroundColor: '#111315' }}>
                {/* Challenge Info */}
                <div>
                  {(() => {
                    // Safety check to ensure stages and challenges exist
                    if (!stages[currentStage - 1] || !stages[currentStage - 1].challenges || !stages[currentStage - 1].challenges[currentChallenge]) {
                      return (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400 mb-4">Challenge Not Found</div>
                          <p className="text-lg opacity-90 mb-4">The selected challenge could not be loaded. Please try refreshing the page.</p>
                        </div>
                      );
                    }
                    
                    const challenge = stages[currentStage - 1].challenges[currentChallenge];
                    
                    return (
                      <>
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-1">Challenge {currentStage}{String.fromCharCode(65 + currentChallenge)}</div>
                          <h1 className="text-3xl font-bold">{challenge.title}</h1>
                        </div>
                        
                        <p className="text-lg opacity-90 mb-4">{challenge.description}</p>
                        
                        {/* Challenge Scenario */}
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-semibold text-purple-300">Challenge Scenario</span>
                          </div>
                          <p className="text-sm text-gray-200">{challenge.scenario}</p>
                        </div>
                        
                        {/* Challenge Instructions */}
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-semibold text-purple-300">Challenge Instructions</span>
                          </div>
                          <p className="text-sm text-gray-200">{challenge.instructions}</p>
                        </div>
                      </>
                    );
                  })()}
                  
                  {/* Voice Analysis Results Display */}
                  {/* Voice analysis card removed as requested */}
                  
                  {/* Elimination Triggers */}
                  {stages[currentStage - 1].challenges[currentChallenge].eliminationTriggers && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <Skull className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-300">Elimination Triggers</span>
                      </div>
                      <div className="space-y-1">
                        {stages[currentStage - 1].challenges[currentChallenge].eliminationTriggers.map((trigger, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs text-gray-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                            <span>{trigger}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-center gap-4">
                    {stages[currentStage - 1].challenges[currentChallenge].regions.map(region => (
                      <span key={region} className="text-base md:text-lg font-semibold text-gray-200 uppercase tracking-wide">{region}</span>
                    ))}
                  </div>
                </div>
                
                {/* Stage achievements badge */}
                {stageAchievements[currentStage] && stageAchievements[currentStage].length > 0 && (
                  <div className="absolute top-4 right-4 bg-green-600/20 text-green-300 border border-green-500/40 rounded-full px-3 py-1 text-xs">
                    🏅 {stageAchievements[currentStage].length} Achv
                  </div>
                )}
              </div>

              {/* Challenge content */}
              <div className="bg-[#111315] rounded-xl p-8 mb-8 border border-white/10 shadow-lg shadow-black/30">
                {(() => {
                  // Safety check to ensure stages and challenges exist
                  if (!stages[currentStage - 1] || !stages[currentStage - 1].challenges || !stages[currentStage - 1].challenges[currentChallenge]) {
                    return (
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-400 mb-4">Challenge Content Not Available</div>
                        <p className="text-gray-400">The selected challenge content could not be loaded.</p>
                      </div>
                    );
                  }
                  
                  const challenge = stages[currentStage - 1].challenges[currentChallenge];
                  
                  if (challenge.type === 'voice') {
                    return (
                      <div className="text-center">
                        {/* Microphone Troubleshooting Section */}
                        {!canRecord && (
                          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6 text-center">
                            <div className="text-2xl mb-2">🎤</div>
                            <h4 className="text-xl font-bold text-red-300 mb-2">Microphone Not Working</h4>
                            <p className="text-red-200 mb-4">
                              Your microphone is not accessible. This is required for Challenge 2b.
                            </p>
                            <div className="space-y-2 text-sm text-red-300">
                              <div>• Check if your microphone is connected and working</div>
                              <div>• Allow microphone access in your browser settings</div>
                              <div>• Close other applications that might be using the microphone</div>
                              <div>• Try refreshing the page after granting permissions</div>
                            </div>
                            <div className="mt-4">
                              <Button
                                onClick={retryMicrophonePermission}
                                size="lg"
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                              >
                                🔄 Retry Microphone Access
                              </Button>
                              <Button
                                onClick={testMicrophoneRecording}
                                size="lg"
                                variant="outline"
                                className="border-blue-500 text-blue-400 hover:bg-blue-500/20 ml-2"
                              >
                                🎤 Test Microphone
                              </Button>
                              <Button
                                onClick={debugMicrophoneStatus}
                                size="sm"
                                variant="outline"
                                className="border-gray-500 text-gray-400 hover:bg-gray-500/20 ml-2"
                              >
                                🐛 Debug Info
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* Cultural Recording Interface */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          {/* Recording Instructions */}
                          <div className="col-span-full bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Mic className="w-5 h-5 text-blue-400" />
                              <span className="text-sm font-semibold text-blue-300">Recording Instructions for Challenge 2b</span>
                            </div>
                            <div className="text-sm text-blue-200 space-y-1">
                              <div>• Click the microphone button for each region to start recording</div>
                              <div>• Speak your customer service response clearly</div>
                              <div>• Click again to stop recording when finished</div>
                              <div>• Each region requires a different cultural approach</div>
                              <div className="text-yellow-300 mt-2">
                                💡 Note: Challenge 2b focuses on US, UK, and AU regions
                              </div>
                            </div>
                          </div>
                          
                          {(['US', 'UK', 'AU', 'CA'] as const).map((region) => (
                            <div key={region} className={`bg-gradient-to-br ${culturalContexts[region].color} rounded-lg p-6 border border-white/20`}>
                              <div className="text-center mb-4">
                                <div className="text-2xl mb-2">{culturalContexts[region].flag}</div>
                                <div className="text-lg font-bold text-white">{culturalContexts[region].name}</div>
                                <div className="text-sm text-white/80">{culturalContexts[region].style}</div>
                              </div>
                              
                              {/* Sample Script or Customer Complaint */}
                              <div className="bg-black/20 rounded-lg p-4 mb-4 text-left">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm font-semibold text-white/90">
                                    {(() => {
                                      const currentChallengeTitle = stages[currentStage - 1].challenges[currentChallenge].title;
                                      if (currentChallengeTitle === "The Angry Customer Gauntlet") return "😡 Customer Complaint:";
                                      return "📝 Sample Script to Read:";
                                    })()}
                                  </div>
                                  {(() => {
                                    const currentChallengeTitle = stages[currentStage - 1].challenges[currentChallenge].title;
                                    return currentChallengeTitle !== "The Angry Customer Gauntlet";
                                  })() && (
                                    <Button
                                      onClick={() => generateSampleScript(region)}
                                      disabled={isGeneratingScript === region}
                                      size="sm"
                                      variant="outline"
                                      className="border-white/30 text-white/70 hover:bg-white/20 hover:text-white text-xs px-2 py-1 h-6"
                                    >
                                      {isGeneratingScript === region ? (
                                        <Timer className="w-3 h-3 animate-spin mr-1" />
                                      ) : (
                                        <span>🔄</span>
                                      )}
                                      {isGeneratingScript === region ? 'Generating...' : 'Generate'}
                                    </Button>
                                  )}
                                </div>
                                <div className="text-xs text-white/80 leading-relaxed">
                                  {(() => {
                                    const currentChallengeTitle = stages[currentStage - 1].challenges[currentChallenge].title;
                                    
                                    if (currentChallengeTitle === "The Angry Customer Gauntlet") {
                                      // Customer complaints for de-escalation challenge
                                      return region === 'US' ? "Your service is pretty disappointing. I expected way better for what I'm paying." :
                                             region === 'UK' ? "This is absolutely unacceptable. I demand to speak to someone with actual authority who can resolve this properly." :
                                             region === 'AU' ? "This is a complete fucking shambles! You people are bloody useless! I want my money back RIGHT NOW or I'm posting this disaster everywhere!" :
                                             "This is absolutely unacceptable. I demand to speak to someone with actual authority who can resolve this properly.";
                                    } else {
                                      // Default sample scripts for cultural introduction challenges
                                      return generatedScripts[region] || (
                                        region === 'US' ? "Hey team! I'm excited to join this sprint. I'm all about getting things done efficiently and I'm ready to jump in and contribute to our goals. Let's make this project awesome!" :
                                        region === 'UK' ? "Good morning everyone. I'm delighted to be joining your team for this sprint. I'm rather looking forward to contributing to our objectives and I do hope we can achieve excellent results together." :
                                        region === 'AU' ? "G'day everyone! Stoked to be joining the team for this sprint. I'm pretty keen to get stuck in and help us smash our goals. This project's going to be ripper!" :
                                        "Hi there, hope everyone's having a good day. I'm quite excited to be joining your team for this sprint. I'm really looking forward to working together and hopefully we can achieve some great results."
                                      );
                                    }
                                  })()}
                                </div>
                              </div>
                              
                              {/* Recording Button */}
                              <div className="flex justify-center mb-4">
                                <motion.button
                                  onClick={() => handleCulturalRecording(region)}
                                  disabled={!canRecord || isAnalyzingVoice}
                                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                                    isRecording && currentRecordingRegion === region
                                      ? 'bg-red-600 hover:bg-red-700' 
                                      : isAnalyzingVoice && currentRecordingRegion === region
                                      ? 'bg-yellow-600 cursor-wait'
                                      : !canRecord
                                      ? 'bg-gray-500 cursor-not-allowed'
                                      : 'bg-white/20 hover:bg-white/30 border-2 border-white/40'
                                  }`}
                                  whileHover={{ scale: canRecord && !isRecording && !isAnalyzingVoice ? 1.1 : 1 }}
                                  whileTap={{ scale: canRecord && !isRecording && !isAnalyzingVoice ? 0.9 : 1 }}
                                >
                                  {isRecording && currentRecordingRegion === region ? <MicOff /> : 
                                   isAnalyzingVoice && currentRecordingRegion === region ? <Timer className="animate-spin" /> : <Mic />}
                                </motion.button>
                              </div>
                              
                              {/* Recording Status */}
                              <div className="text-sm text-white/80 mb-4">
                                {isRecording && currentRecordingRegion === region ? (
                                  <div className="text-red-200">🔴 Recording... {recordingTime}s</div>
                                ) : isTranscribing[region] ? (
                                  <div className="text-yellow-200 flex items-center justify-center">
                                    <Timer className="w-4 h-4 animate-spin mr-2" />
                                    Transcribing...
                                  </div>
                                ) : culturalTranscripts[region] ? (
                                  <div className="text-green-200">✅ Recorded & Transcribed</div>
                                ) : (
                                  <div>
                                    {(() => {
                                      const currentChallengeTitle = stages[currentStage - 1].challenges[currentChallenge].title;
                                      if (currentChallengeTitle === "The Angry Customer Gauntlet") {
                                        return `Click to record your ${region} customer service response`;
                                      } else {
                                        return `Click to record your ${region} introduction`;
                                      }
                                    })()}
                                  </div>
                                )}
                              </div>
                              
                              {/* Transcription Loading Indicator */}
                              {isTranscribing[region] && (
                                <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 mb-4 text-center">
                                  <div className="flex items-center justify-center text-yellow-200">
                                    <Timer className="w-3 h-3 animate-spin mr-2" />
                                    <span className="text-sm">Transcribing your recording...</span>
                                  </div>
                                  <div className="text-xs text-yellow-300 mt-1">This may take a few seconds</div>
                                </div>
                              )}
                              
                              {/* Transcription Output */}
                              {culturalTranscripts[region] && (
                                <div className="bg-black/30 rounded-lg p-3 text-left">
                                  <div className="text-sm font-semibold text-white/90 mb-2">
                                    {(() => {
                                      const currentChallengeTitle = stages[currentStage - 1].challenges[currentChallenge].title;
                                      if (currentChallengeTitle === "The Angry Customer Gauntlet") {
                                        return "🎤 Your Customer Service Response:";
                                      } else {
                                        return "🎤 Your Response:";
                                      }
                                    })()}
                                  </div>
                                  <div className="text-xs text-white/80 bg-black/20 p-2 rounded border border-white/10">
                                    "{culturalTranscripts[region]}"
                                  </div>
                                </div>
                              )}
                              
                              {/* Cultural Score */}
                              {culturalTranscripts[region] && culturalScores[region as keyof typeof culturalScores] > 0 && (
                                <div className="mt-3 text-center">
                                  <div className="text-sm text-white/80">Cultural Score:</div>
                                  <div className="text-xl font-bold text-white">
                                    {Math.round(culturalScores[region as keyof typeof culturalScores])}%
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Fallback Recording Button */}
                        <div className="text-center mb-4">
                          <Button
                            onClick={startFallbackRecording}
                            disabled={!canRecord || isRecording || isAnalyzingVoice}
                            size="sm"
                            variant="outline"
                            className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                          >
                            🔄 Try Alternative Recording Method
                          </Button>
                        </div>
                        
                        {/* Test Audio Button */}
                        <div className="text-center mb-4">
                          <Button
                            onClick={createTestAudio}
                            size="sm"
                            variant="outline"
                            className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                          >
                            🎵 Create Test Audio
                          </Button>
                        </div>
                        
                        {/* Debug Info */}
                        <div className="text-center text-xs text-gray-500 mt-4">
                          <div className="flex items-center justify-center gap-4 mb-2">
                          <div>Microphone Status: {canRecord ? '✅ Ready' : '❌ Not Ready'}</div>
                            <Button
                              onClick={retryMicrophonePermission}
                              size="sm"
                              variant="outline"
                              className="border-gray-500 text-gray-400 hover:bg-gray-500/20 text-xs px-2 py-1 h-6"
                            >
                              🔄 Retry
                            </Button>
                          </div>
                          <div>Supported formats: {(() => {
                            const formats = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/wav', 'audio/ogg'];
                            return formats.filter(f => MediaRecorder.isTypeSupported(f)).join(', ');
                          })()}</div>
                          {!canRecord && (
                            <div className="text-red-400 mt-2">
                              💡 Tip: Check browser permissions and ensure microphone is connected
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'writing') {
                    return (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {Object.entries(mockChallenges.writing_adaptation).map(([key, value]) => {
                            if (key === 'scenario') return null;
                            return (
                              <div key={key} className={`bg-gradient-to-br ${culturalContexts[key as keyof typeof culturalContexts].color} rounded-lg p-4`}>
                                <div className="font-bold text-sm mb-2 text-white">
                                  {culturalContexts[key as keyof typeof culturalContexts].flag} {culturalContexts[key as keyof typeof culturalContexts].name}
                                </div>
                                <div className="text-xs italic text-white/80">"{value as string}"</div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6">
                          <textarea
                            value={currentResponse}
                            onChange={(e) => setCurrentResponse(e.target.value)}
                            placeholder="Write your cultural adaptation here..."
                            className="w-full h-32 bg-gray-600 rounded p-4 text-white resize-none"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-400">
                              {currentResponse.length} characters
                            </span>
                            <button
                              onClick={handleWritingSubmit}
                              disabled={currentResponse.length < 10}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Submit Response
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'slang') {
                    return (
                      <div>
                        <div className="bg-gray-700 rounded-lg p-6">
                          <textarea
                            value={currentResponse}
                            onChange={(e) => setCurrentResponse(e.target.value)}
                            placeholder="Write your slang decoding responses here..."
                            className="w-full h-32 bg-gray-600 rounded p-4 text-white resize-none"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-400">
                              {currentResponse.length} characters
                            </span>
                            <button
                              onClick={handleWritingSubmit}
                              disabled={currentResponse.length < 10}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Submit Response
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'style_switch') {
                    return (
                      <div>
                        <div className="bg-gray-700 rounded-lg p-6 mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gradient-to-br from-blue-600 to-red-600 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-white">🇺🇸 US Style</div>
                              <div className="text-xs italic text-white/80">Direct, solution-focused, energetic</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-600 to-blue-800 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-white">🇬🇧 UK Style</div>
                              <div className="text-xs italic text-white/80">Diplomatic, structured, professional</div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-600 to-green-600 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-white">🇦🇺 AU Style</div>
                              <div className="text-xs italic text-white/80">Honest, straightforward, casual-professional</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-white">🇨🇦 CA Style</div>
                              <div className="text-xs italic text-white/80">Considerate, collaborative, gently apologetic</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6">
                          <textarea
                            value={currentResponse}
                            onChange={(e) => setCurrentResponse(e.target.value)}
                            placeholder="Write your cultural style adaptations here..."
                            className="w-full h-32 bg-gray-600 rounded p-4 text-white resize-none"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-400">
                              {currentResponse.length} characters
                            </span>
                            <button
                              onClick={handleWritingSubmit}
                              disabled={currentResponse.length < 10}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Submit Response
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'combo') {
                    return (
                      <div>
                        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6 text-center mb-6">
                          <div className="text-6xl mb-4">🌪️</div>
                          <h4 className="text-xl font-bold mb-2">Multi-Cultural Crisis!</h4>
                          <p className="text-yellow-200 mb-4">
                            Handle emergency team coordination across all 4 cultures simultaneously
                          </p>
                          <div className="text-sm text-yellow-300">
                            Complete both tasks below to proceed
                          </div>
                        </div>

                        {/* Voice section */}
                        <div className="bg-gray-800 rounded-lg p-6 mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="font-semibold text-white">Voice Response</div>
                            <div className={`text-sm ${comboVoiceDone ? 'text-green-400' : 'text-gray-400'}`}>
                              {comboVoiceDone ? 'Completed' : 'Required'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-300 mb-4">Record a brief coordination plan addressing all regions.</div>
                          <div className="flex items-center gap-4">
                            <motion.button
                              onClick={handleVoiceRecording}
                              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isRecording ? <MicOff /> : <Mic />}
                            </motion.button>
                            <div className="text-gray-300">
                              {isRecording ? `Recording... ${recordingTime}s` : 'Click to record'}
                            </div>
                          </div>
                        </div>

                        {/* Writing section */}
                        <div className="bg-gray-800 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="font-semibold text-white">Written Update</div>
                            <div className={`text-sm ${comboWriteDone ? 'text-green-400' : 'text-gray-400'}`}>
                              {comboWriteDone ? 'Submitted' : 'Required'}
                            </div>
                          </div>
                          <textarea
                            value={currentResponse}
                            onChange={(e) => setCurrentResponse(e.target.value)}
                            placeholder="Write a short, culturally-aware update for the team..."
                            className="w-full h-28 bg-gray-700 rounded p-3 text-white text-sm"
                          />
                          <div className="text-right mt-3">
                            <Button
                              onClick={handleWritingSubmit}
                              disabled={currentResponse.length < 10}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >Submit</Button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'landmines') {
                    return (
                      <div>
                        <div className="bg-gray-700 rounded-lg p-6">
                          <textarea
                            value={currentResponse}
                            onChange={(e) => setCurrentResponse(e.target.value)}
                            placeholder="Write your responses to navigate these cultural landmines..."
                            className="w-full h-32 bg-gray-600 rounded p-4 text-white resize-none"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-400">
                              {currentResponse.length} characters
                            </span>
                            <button
                              onClick={handleWritingSubmit}
                              disabled={currentResponse.length < 10}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Submit Response
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'boundaries') {
                    return (
                      <div>
                        <div className="bg-gray-700 rounded-lg p-6 mb-6">
                          <div className="space-y-4">
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-yellow-300">🇺🇸 Boundary Test 1 - Personal Information Fishing</div>
                              <div className="text-xs italic text-gray-200">"So where do you live? How much do you guys actually make? I'm curious about the wage difference."</div>
                              <div className="text-xs text-yellow-200 mt-2">Test: Professional deflection while maintaining friendliness</div>
                            </div>
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-yellow-300">🇬🇧 Boundary Test 2 - Inappropriate Relationship Building</div>
                              <div className="text-xs italic text-gray-200">"Perhaps we could discuss this over drinks when I'm in Manila next month? I do enjoy the local nightlife."</div>
                              <div className="text-xs text-yellow-200 mt-2">Test: Professional boundary maintenance with diplomatic grace</div>
                            </div>
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-yellow-300">🇦🇺 Boundary Test 3 - Cultural Stereotyping</div>
                              <div className="text-xs italic text-gray-200">"You Filipinos are all so hardworking and cheap! No wonder everyone outsources there."</div>
                              <div className="text-xs text-yellow-200 mt-2">Test: Address stereotyping professionally without lecturing</div>
                            </div>
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                              <div className="font-bold text-sm mb-2 text-yellow-300">🇨🇦 Boundary Test 4 - Excessive Personal Sharing</div>
                              <div className="text-xs italic text-gray-200">"Sorry, I'm going through a terrible divorce and I just need someone to talk to about my personal problems..."</div>
                              <div className="text-xs text-yellow-200 mt-2">Test: Empathy while maintaining professional focus</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6">
                          <textarea
                            value={currentResponse}
                            onChange={(e) => setCurrentResponse(e.target.value)}
                            placeholder="Write your responses to maintain professional boundaries..."
                            className="w-full h-32 bg-gray-600 rounded p-4 text-white resize-none"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-400">
                              {currentResponse.length} characters
                            </span>
                            <button
                              onClick={handleWritingSubmit}
                              disabled={currentResponse.length < 10}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Submit Response
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'crisis') {
                    return (
                      <div>
                        <div className="bg-gray-700 rounded-lg p-6">
                          <textarea
                            value={currentResponse}
                            onChange={(e) => setCurrentResponse(e.target.value)}
                            placeholder="Write your crisis communication responses..."
                            className="w-full h-32 bg-gray-600 rounded p-4 text-white resize-none"
                          />
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-400">
                              {currentResponse.length} characters
                            </span>
                            <button
                              onClick={handleWritingSubmit}
                              disabled={currentResponse.length < 10}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Submit Response
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (challenge.type === 'ultimate') {
                    return (
                      <div>
                        <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-center mb-6">
                          <div className="text-6xl mb-4">💀</div>
                          <h4 className="text-xl font-bold mb-2">Conference Call Chaos</h4>
                          <p className="text-red-200 mb-4">
                            4-way client call, each with different cultural expectations.
                          </p>
                          <div className="text-sm text-red-300">Round {bossRoundIndex + 1} of 4 • Time left: {bossTimer}s</div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                          <div className="text-4xl mb-3">{stages[currentStage - 1].challenges[currentChallenge].regions[bossRoundIndex] === 'US' ? '🇺🇸' : stages[currentStage - 1].challenges[currentChallenge].regions[bossRoundIndex] === 'UK' ? '🇬🇧' : stages[currentStage - 1].challenges[currentChallenge].regions[bossRoundIndex] === 'AU' ? '🇦🇺' : '🇨🇦'}</div>
                          <div className="text-gray-300 mb-4">Give a concise voice response tailored to this region.</div>
                          <motion.button
                            onClick={handleVoiceRecording}
                            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
                              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {isRecording ? <MicOff /> : <Mic />}
                          </motion.button>
                          <div className="mt-3 text-gray-300">{bossVoiceDone ? 'Recorded ✔' : (isRecording ? `Recording... ${recordingTime}s` : 'Click to record')}</div>

                          {/* Next round button */}
                          <div className="mt-6">
                            <Button
                              disabled={!bossVoiceDone}
                              onClick={() => {
                                // Score boost for current region
                                const region = stages[currentStage - 1].challenges[currentChallenge].regions[bossRoundIndex] as keyof typeof culturalContexts;
                                setCulturalScores(prev => ({ ...prev, [region]: Math.min(100, prev[region] + 5 + Math.random()*5) }));
                                // advance round or finish challenge
                                if (bossRoundIndex < 3) {
                                  setBossRoundIndex(bossRoundIndex + 1);
                                  setBossVoiceDone(false);
                                  setBossTimer(30);
                                } else {
                                  // finished all rounds
                                  addAchievement('🏁 Final Boss Survived');
                                }
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {bossRoundIndex < 3 ? 'Next Round' : 'Rounds Complete'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Default fallback
                  return (
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-400 mb-4">Challenge Type Not Supported</div>
                      <p className="text-gray-500">This challenge type is not yet implemented.</p>
                    </div>
                  );
                })()}
              </div>



                  {/* Achievement toast (global, positioned top-right) */}
                  <AnimatePresence>
                    {toastAchievement && (
                      <motion.div
                        initial={{ opacity: 0, x: 50, y: -10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed top-24 right-6 z-[100000] pointer-events-none"
                      >
                        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg px-4 py-2 shadow-2xl text-white max-w-sm border border-white/10 backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <span>🏆</span>
                            <span className="font-semibold truncate">{toastAchievement}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
      
        {/* Exit Dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent className="glass-card border-white/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Leave BPOC Cultural?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to exit? Your progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                Continue Playing
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmExit}
                className="bg-red-600 hover:bg-red-700"
              >
                Exit Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


      </div>
    </div>
    );
  }

  // Default fallback (should not reach here)
  return null;
};

export default CulturalCommunicationArena;

