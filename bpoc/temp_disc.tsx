'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  ArrowLeft,
  Brain,
  Play,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight,
  Upload
} from 'lucide-react';

const DISC_SCENARIOS = [
  // D - Dominance (5 scenarios)
  {
    id: 1,
    category: 'D',
    title: 'Leadership Under Pressure',
    description: 'Your manager just announced a HUGE project with an impossible deadline. The whole team looks overwhelmed and panicked. What is your superhero move?',
    visual: 'conference-room',
    options: [
      { id: 'A', text: 'Challenge accepted! I will take point and get this organized!', disc: 'D', reaction: 'Bold leader energy!' },
      { id: 'B', text: 'Team huddle! We are stronger together - let us break this down!', disc: 'I', reaction: 'Team spirit activated!' },
      { id: 'C', text: 'Let me review the requirements and create a realistic timeline.', disc: 'S', reaction: 'Steady approach chosen!' },
      { id: 'D', text: 'I need to analyze the scope and identify potential roadblocks first.', disc: 'C', reaction: 'Strategic thinking engaged!' }
    ]
  },
  {
    id: 2,
    category: 'D',
    title: 'Decision-Making Authority',
    description: 'A critical client decision needs to be made immediately. Your team is looking to you for direction. How do you handle this moment of truth?',
    visual: 'decision-making',
    options: [
      { id: 'A', text: 'I will make the call now and take full responsibility for the outcome!', disc: 'D', reaction: 'Decisive leader mode!' },
      { id: 'B', text: 'Let me gather input from the team and build consensus!', disc: 'I', reaction: 'Collaborative decision maker!' },
      { id: 'C', text: 'I will carefully consider all options before making a decision.', disc: 'S', reaction: 'Thoughtful approach chosen!' },
      { id: 'D', text: 'I need to analyze all the data and risks before deciding.', disc: 'C', reaction: 'Analytical decision process!' }
    ]
  },
  {
    id: 3,
    category: 'D',
    title: 'Risk-Taking Moments',
    description: 'Your company is considering a bold new strategy that could revolutionize the business. What is your stance on this high-risk opportunity?',
    visual: 'risk-assessment',
    options: [
      { id: 'A', text: 'Let us go for it! High risk means high reward - I am all in!', disc: 'D', reaction: 'Risk taker extraordinaire!' },
      { id: 'B', text: 'This could be amazing! Let me rally the team behind this vision!', disc: 'I', reaction: 'Visionary motivator!' },
      { id: 'C', text: 'I will support this if we have a solid backup plan in place.', disc: 'S', reaction: 'Cautious supporter!' },
      { id: 'D', text: 'I need to thoroughly evaluate all potential outcomes first.', disc: 'C', reaction: 'Risk analyst mode!' }
    ]
  },
  {
    id: 4,
    category: 'D',
    title: 'Control vs Delegation',
    description: 'Your team is struggling with a complex project. You have the expertise to take control, but you also want to develop their skills. What do you do?',
    visual: 'team-leadership',
    options: [
      { id: 'A', text: 'I will take charge and show them how it is done - we need results now!', disc: 'D', reaction: 'Take charge leader!' },
      { id: 'B', text: 'Let me inspire them and guide them through this challenge!', disc: 'I', reaction: 'Inspirational mentor!' },
      { id: 'C', text: 'I will support them step by step and help them learn.', disc: 'S', reaction: 'Patient teacher!' },
      { id: 'D', text: 'I will create a detailed plan and monitor their progress closely.', disc: 'C', reaction: 'Structured supervisor!' }
    ]
  },
  {
    id: 5,
    category: 'D',
    title: 'Power Dynamics Situations',
    description: 'You discover that a colleague has been undermining your work to senior management. How do you handle this power play?',
    visual: 'power-struggle',
    options: [
      { id: 'A', text: 'I will confront them directly and establish my position clearly!', disc: 'D', reaction: 'Direct confrontation mode!' },
      { id: 'B', text: 'Let me address this diplomatically and turn them into an ally!', disc: 'I', reaction: 'Diplomatic negotiator!' },
      { id: 'C', text: 'I will document everything and handle this through proper channels.', disc: 'S', reaction: 'Process follower!' },
      { id: 'D', text: 'I need to gather evidence and present a comprehensive case.', disc: 'C', reaction: 'Evidence-based approach!' }
    ]
  },
  // I - Influence (5 scenarios)
  {
    id: 6,
    category: 'I',
    title: 'Social Interaction Preferences',
    description: 'Company networking event with potential new clients and partners. You walk into a room full of strangers. What is your natural approach?',
    visual: 'office-mixer',
    options: [
      { id: 'A', text: 'Time to identify the key decision makers and make connections.', disc: 'D', reaction: 'Strategic networker mode!' },
      { id: 'B', text: 'This is exciting! Let me introduce myself to everyone!', disc: 'I', reaction: 'Social butterfly power!' },
      { id: 'C', text: 'I will find a few people to have meaningful conversations with.', disc: 'S', reaction: 'Meaningful connector activated!' },
      { id: 'D', text: 'Let me observe the room dynamics and plan my approach.', disc: 'C', reaction: 'Observational strategist!' }
    ]
  },
  {
    id: 7,
    category: 'I',
    title: 'Communication Style Choices',
    description: 'You need to present a new idea to your team. The concept is complex but exciting. How do you approach this communication challenge?',
    visual: 'presentation',
    options: [
      { id: 'A', text: 'I will deliver a powerful, direct presentation that commands attention!', disc: 'D', reaction: 'Commanding presenter!' },
      { id: 'B', text: 'I will make this fun and engaging - let me tell a story that inspires!', disc: 'I', reaction: 'Inspirational storyteller!' },
      { id: 'C', text: 'I will explain this step by step and answer all questions patiently.', disc: 'S', reaction: 'Patient educator!' },
      { id: 'D', text: 'I will provide detailed documentation and clear logical structure.', disc: 'C', reaction: 'Structured communicator!' }
    ]
  },
  {
    id: 8,
    category: 'I',
    title: 'Team Motivation Moments',
    description: 'Your team is feeling demotivated after a project setback. Morale is low and productivity is suffering. How do you boost their spirits?',
    visual: 'team-motivation',
    options: [
      { id: 'A', text: 'I will set clear goals and push them to exceed expectations!', disc: 'D', reaction: 'Goal-driven motivator!' },
      { id: 'B', text: 'Let me organize a team celebration and remind them of our successes!', disc: 'I', reaction: 'Team cheerleader!' },
      { id: 'C', text: 'I will listen to their concerns and provide steady support.', disc: 'S', reaction: 'Supportive listener!' },
      { id: 'D', text: 'I will analyze the root causes and implement systematic improvements.', disc: 'C', reaction: 'Systematic problem solver!' }
    ]
  },
  {
    id: 9,
    category: 'I',
    title: 'Persuasion Opportunities',
    description: 'You need to convince senior management to approve your innovative project proposal. The budget is significant. How do you make your case?',
    visual: 'persuasion',
    options: [
      { id: 'A', text: 'I will present the facts and demand immediate approval based on ROI!', disc: 'D', reaction: 'Direct demander!' },
      { id: 'B', text: 'Let me share the exciting vision and get them excited about the possibilities!', disc: 'I', reaction: 'Visionary persuader!' },
      { id: 'C', text: 'I will build trust gradually and show them the long-term benefits.', disc: 'S', reaction: 'Trust builder!' },
      { id: 'D', text: 'I will provide comprehensive data and detailed risk analysis.', disc: 'C', reaction: 'Data-driven presenter!' }
    ]
  },
  {
    id: 10,
    category: 'I',
    title: 'Public Presentation Scenarios',
    description: 'You have been asked to give a keynote speech at a major industry conference. The audience includes competitors and potential clients. How do you prepare?',
    visual: 'keynote-speech',
    options: [
      { id: 'A', text: 'I will deliver a powerful, memorable speech that establishes our dominance!', disc: 'D', reaction: 'Dominant speaker!' },
      { id: 'B', text: 'I will create an engaging, entertaining presentation that connects with everyone!', disc: 'I', reaction: 'Engaging entertainer!' },
      { id: 'C', text: 'I will focus on being authentic and building genuine connections.', disc: 'S', reaction: 'Authentic connector!' },
      { id: 'D', text: 'I will ensure every detail is perfect and every fact is verified.', disc: 'C', reaction: 'Precision presenter!' }
    ]
  },
  // S - Steadiness (5 scenarios)
  {
    id: 11,
    category: 'S',
    title: 'Change vs Stability Preferences',
    description: 'Your company is implementing a major system overhaul. New software, new processes, everything is changing at once. Your honest reaction?',
    visual: 'office-renovation',
    options: [
      { id: 'A', text: 'Finally! This will streamline everything and boost efficiency!', disc: 'D', reaction: 'Change champion mode!' },
      { id: 'B', text: 'Let me help everyone adapt and make this transition smooth!', disc: 'I', reaction: 'Change facilitator power!' },
      { id: 'C', text: 'I will support the team and ensure we follow the new procedures carefully.', disc: 'S', reaction: 'Steady support activated!' },
      { id: 'D', text: 'I need to understand the new system thoroughly before implementing.', disc: 'C', reaction: 'Careful analysis mode!' }
    ]
  },
  {
    id: 12,
    category: 'S',
    title: 'Conflict Resolution Approaches',
    description: 'Two team members are having a heated disagreement that is affecting team productivity. How do you handle this conflict?',
    visual: 'conflict-resolution',
    options: [
      { id: 'A', text: 'I will step in and make a decision to resolve this immediately!', disc: 'D', reaction: 'Decisive mediator!' },
      { id: 'B', text: 'Let me facilitate a discussion and help them find common ground!', disc: 'I', reaction: 'Harmony facilitator!' },
      { id: 'C', text: 'I will listen to both sides and help them work through this together.', disc: 'S', reaction: 'Patient mediator!' },
      { id: 'D', text: 'I will analyze the situation and create a structured resolution process.', disc: 'C', reaction: 'Process-oriented resolver!' }
    ]
  },
  {
    id: 13,
    category: 'S',
    title: 'Work Pace Consistency',
    description: 'Your team is under pressure to deliver results quickly, but you know rushing could compromise quality. How do you balance speed and thoroughness?',
    visual: 'work-pace',
    options: [
      { id: 'A', text: 'We need to push hard and fast - speed is everything right now!', disc: 'D', reaction: 'Speed demon!' },
      { id: 'B', text: 'Let me motivate the team to work efficiently while maintaining enthusiasm!', disc: 'I', reaction: 'Efficiency motivator!' },
      { id: 'C', text: 'I will maintain our steady pace and ensure we do not sacrifice quality.', disc: 'S', reaction: 'Steady pace keeper!' },
      { id: 'D', text: 'I will create a detailed timeline that balances speed and accuracy.', disc: 'C', reaction: 'Balanced planner!' }
    ]
  },
  {
    id: 14,
    category: 'S',
    title: 'Team Support Situations',
    description: 'A colleague is struggling with a personal issue that is affecting their work performance. How do you respond to their need for support?',
    visual: 'team-support',
    options: [
      { id: 'A', text: 'I will help them focus on work and push through this challenge!', disc: 'D', reaction: 'Focus driver!' },
      { id: 'B', text: 'Let me cheer them up and help them see the positive side!', disc: 'I', reaction: 'Positive encourager!' },
      { id: 'C', text: 'I will listen and provide steady emotional support during this time.', disc: 'S', reaction: 'Emotional supporter!' },
      { id: 'D', text: 'I will help them create a structured plan to manage their situation.', disc: 'C', reaction: 'Structured helper!' }
    ]
  },
  {
    id: 15,
    category: 'S',
    title: 'Routine vs Variety Choices',
    description: 'Your manager offers you a choice: continue with your current stable role or take on a new, more dynamic position with unknown challenges. What do you choose?',
    visual: 'career-choice',
    options: [
      { id: 'A', text: 'I will take the new role - I thrive on challenges and variety!', disc: 'D', reaction: 'Challenge seeker!' },
      { id: 'B', text: 'I will embrace the new opportunity and make it exciting for everyone!', disc: 'I', reaction: 'Opportunity embracer!' },
      { id: 'C', text: 'I will carefully consider the stability of my current role first.', disc: 'S', reaction: 'Stability seeker!' },
      { id: 'D', text: 'I will analyze both options thoroughly before making a decision.', disc: 'C', reaction: 'Careful analyzer!' }
    ]
  },
  // C - Compliance (5 scenarios)
  {
    id: 16,
    category: 'C',
    title: 'Detail vs Big Picture Focus',
    description: 'You are reviewing a major project proposal. Your team wants to focus on the big picture and exciting outcomes. What is your priority?',
    visual: 'project-review',
    options: [
      { id: 'A', text: 'I will focus on the strategic impact and bold outcomes!', disc: 'D', reaction: 'Strategic visionary!' },
      { id: 'B', text: 'Let me highlight the exciting possibilities and benefits!', disc: 'I', reaction: 'Possibility promoter!' },
      { id: 'C', text: 'I will ensure we have a solid foundation and reliable approach.', disc: 'S', reaction: 'Foundation builder!' },
      { id: 'D', text: 'I will examine every detail and ensure accuracy throughout.', disc: 'C', reaction: 'Detail master!' }
    ]
  },
  {
    id: 17,
    category: 'C',
    title: 'Quality vs Speed Decisions',
    description: 'A major quality issue has been discovered in your team\'s work. Multiple errors found, client is upset. How do you handle this?',
    visual: 'quality-check',
    options: [
      { id: 'A', text: 'I will take immediate action to fix this and prevent future issues!', disc: 'D', reaction: 'Crisis resolution mode!' },
      { id: 'B', text: 'Let me gather the team and we will solve this together!', disc: 'I', reaction: 'Team problem solver!' },
      { id: 'C', text: 'I will carefully review our processes and implement better checks.', disc: 'S', reaction: 'Process improvement mode!' },
      { id: 'D', text: 'I need to analyze the root cause and create a comprehensive solution.', disc: 'C', reaction: 'Analytical problem solver!' }
    ]
  },
  {
    id: 18,
    category: 'C',
    title: 'Rule Following vs Flexibility',
    description: 'A client requests a modification that goes against company policy but could lead to significant business. How do you handle this ethical dilemma?',
    visual: 'ethical-dilemma',
    options: [
      { id: 'A', text: 'I will find a way to make this work - business results matter most!', disc: 'D', reaction: 'Results-driven solver!' },
      { id: 'B', text: 'Let me negotiate a creative solution that satisfies everyone!', disc: 'I', reaction: 'Creative negotiator!' },
      { id: 'C', text: 'I will follow the rules but help find an acceptable alternative.', disc: 'S', reaction: 'Rule follower!' },
      { id: 'D', text: 'I will consult the policy guidelines and ensure full compliance.', disc: 'C', reaction: 'Policy enforcer!' }
    ]
  },
  {
    id: 19,
    category: 'C',
    title: 'Analysis vs Action Preferences',
    description: 'Your team is ready to launch a new product, but you have concerns about potential risks. How do you balance thorough analysis with timely action?',
    visual: 'product-launch',
    options: [
      { id: 'A', text: 'Let us launch now and fix any issues as they arise!', disc: 'D', reaction: 'Action-first leader!' },
      { id: 'B', text: 'Let me build excitement and confidence in the team for launch!', disc: 'I', reaction: 'Confidence builder!' },
      { id: 'C', text: 'I will ensure we have proper safeguards in place before launching.', disc: 'S', reaction: 'Safety-first approach!' },
      { id: 'D', text: 'I need to conduct a thorough risk assessment before proceeding.', disc: 'C', reaction: 'Risk assessor!' }
    ]
  },
  {
    id: 20,
    category: 'C',
    title: 'Structure vs Creativity Choices',
    description: 'Your team is brainstorming a creative solution to a complex problem. How do you contribute to this creative process?',
    visual: 'brainstorming',
    options: [
      { id: 'A', text: 'I will push for bold, innovative ideas that break the mold!', disc: 'D', reaction: 'Bold innovator!' },
      { id: 'B', text: 'Let me inspire the team with exciting possibilities and energy!', disc: 'I', reaction: 'Creative energizer!' },
      { id: 'C', text: 'I will help build on existing ideas and create practical solutions.', disc: 'S', reaction: 'Practical builder!' },
      { id: 'D', text: 'I will ensure we have a structured approach to evaluate all ideas.', disc: 'C', reaction: 'Structured evaluator!' }
    ]
  }
];

export default function DISCPersonalityGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    scores: { D: 0, I: 0, S: 0, C: 0 },
    gameStarted: false,
    gameCompleted: false,
    xpPoints: 0,
    badges: [] as string[],
    currentFloor: 'lobby',
    totalXP: 0,
    achievements: [] as string[],
    streak: 0,
    combo: 0,
    lastAnswer: ''
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [discResult, setDiscResult] = useState<any>(null);
  const [showReaction, setShowReaction] = useState<string | null>(null);
  const [encouragingMessage, setEncouragingMessage] = useState<string>('');
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  const currentScenario = DISC_SCENARIOS[gameState.currentQuestion];

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  };

  const handleOptionSelect = (optionId: string, disc: string, reaction: string) => {
    setSelectedOption(optionId);
    setShowReaction(reaction);
    
    // Set encouraging message based on DISC type
    const encouragingMessages = {
      'D': 'Natural leader spotted! âš¡',
      'I': 'People person detected! ðŸŒŸ',
      'S': 'Steady and reliable! ðŸ›¡ï¸',
      'C': 'Precision master! ðŸŽ¯'
    };
    setEncouragingMessage(encouragingMessages[disc as keyof typeof encouragingMessages]);
    
    // Enhanced XP and reward system with streak and combo
    let xpGain = Math.floor(Math.random() * 15) + 10; // Base 10-25 XP
    const newBadges = [...gameState.badges];
    const newAchievements = [...gameState.achievements];
    
    // Streak and combo system
    let newStreak = gameState.streak;
    let newCombo = gameState.combo;
    
    if (disc === gameState.lastAnswer) {
      newStreak += 1;
      newCombo += 1;
      xpGain += Math.floor(newStreak * 5); // Bonus XP for streaks
    } else {
      newStreak = 1;
      newCombo = 0;
    }
    
    // Award badges based on current question and DISC type
    let newAchievement = null;
    if (gameState.currentQuestion === 0 && disc === 'D') {
      if (!newBadges.includes('Quick Decider')) {
        newBadges.push('Quick Decider');
        newAchievements.push('Quick Decider');
        newAchievement = 'Quick Decider';
      }
    }
    if (gameState.currentQuestion === 1 && disc === 'I') {
      if (!newBadges.includes('Social Butterfly')) {
        newBadges.push('Social Butterfly');
        newAchievements.push('Social Butterfly');
        newAchievement = 'Social Butterfly';
      }
    }
    if (gameState.currentQuestion === 2 && disc === 'S') {
      if (!newBadges.includes('Steady Eddie')) {
        newBadges.push('Steady Eddie');
        newAchievements.push('Steady Eddie');
        newAchievement = 'Steady Eddie';
      }
    }
    if (gameState.currentQuestion === 3 && disc === 'C') {
      if (!newBadges.includes('Detail Master')) {
        newBadges.push('Detail Master');
        newAchievements.push('Detail Master');
        newAchievement = 'Detail Master';
      }
    }
    
    // Streak achievements
    if (newStreak === 3 && !newBadges.includes('Streak Master')) {
      newBadges.push('Streak Master');
      newAchievements.push('Streak Master');
      newAchievement = 'Streak Master';
    }
    if (newStreak === 5 && !newBadges.includes('Fire Starter')) {
      newBadges.push('Fire Starter');
      newAchievements.push('Fire Starter');
      newAchievement = 'Fire Starter';
    }
    
    // Show achievement notification
    if (newAchievement) {
      setShowAchievement(newAchievement);
      setTimeout(() => setShowAchievement(null), 3000);
    }
    
    // Determine current floor based on DISC type
    const floorMap = {
      'D': 'action-central',
      'I': 'people-hub', 
      'S': 'harmony-zone',
      'C': 'precision-palace'
    };
    
    setTimeout(() => {
      const newScores = { ...gameState.scores };
      newScores[disc as keyof typeof newScores] += 1;
      
      if (gameState.currentQuestion < DISC_SCENARIOS.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          scores: newScores,
          xpPoints: prev.xpPoints + xpGain,
          totalXP: prev.totalXP + xpGain,
          badges: newBadges,
          achievements: newAchievements,
          currentFloor: floorMap[disc as keyof typeof floorMap],
          streak: newStreak,
          combo: newCombo,
          lastAnswer: disc
        }));
        setSelectedOption(null);
        setShowReaction(null);
      } else {
        setGameState(prev => ({
          ...prev,
          gameCompleted: true,
          scores: newScores,
          xpPoints: prev.xpPoints + xpGain,
          totalXP: prev.totalXP + xpGain,
          badges: newBadges,
          achievements: newAchievements,
          currentFloor: 'rooftop',
          streak: newStreak,
          combo: newCombo,
          lastAnswer: disc
        }));
        calculateResults(newScores);
      }
    }, 1500);
  };

  const calculateResults = (scores: { D: number; I: number; S: number; C: number }) => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = {
      D: Math.round((scores.D / total) * 100),
      I: Math.round((scores.I / total) * 100),
      S: Math.round((scores.S / total) * 100),
      C: Math.round((scores.C / total) * 100)
    };

    const sorted = Object.entries(percentages).sort(([,a], [,b]) => b - a);
    const primaryType = sorted[0][0] as 'D' | 'I' | 'S' | 'C';

    const results = {
      primaryType,
      scores: percentages,
      confidence: Math.min(95, 70 + (Math.max(...Object.values(percentages)) - Math.min(...Object.values(percentages))))
    };

    setDiscResult(results);
    setShowResults(true);
  };

  const resetGame = () => {
    setGameState({
      currentQuestion: 0,
      scores: { D: 0, I: 0, S: 0, C: 0 },
      gameStarted: false,
      gameCompleted: false,
      xpPoints: 0,
      badges: [],
      currentFloor: 'lobby',
      totalXP: 0,
      achievements: [],
      streak: 0,
      combo: 0,
      lastAnswer: ''
    });
    setSelectedOption(null);
    setShowResults(false);
    setDiscResult(null);
    setShowReaction(null);
  };

  const handleBackClick = () => {
    if (gameState.currentQuestion > 0 || Object.values(gameState.scores).some(score => score > 0)) {
      setShowExitDialog(true);
    } else {
      router.push('/career-tools/games');
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    router.push('/career-tools/games');
  };

  // Results view
  if (showResults && discResult) {
    const personality = {
      D: {
        title: "The Action Hero",
        icon: "âš¡",
        description: "You turn challenges into victories and get things done when everyone else is still planning!",
        traits: ["Natural Leader", "Results-Focused", "Decisive", "Direct"],
        bpoRoles: ["Team Lead", "Operations Manager", "Escalation Specialist", "Performance Coach"],
        color: "text-red-400"
      },
      I: {
        title: "The Connection Champion",
        icon: "ðŸŒŸ",
        description: "You transform every interaction into a positive experience and turn strangers into loyal fans!",
        traits: ["People-Oriented", "Enthusiastic", "Persuasive", "Optimistic"],
        bpoRoles: ["Customer Service Lead", "Sales Manager", "Training Specialist", "Client Relations"],
        color: "text-yellow-400"
      },
      S: {
        title: "The Stability Superhero",
        icon: "ðŸ›¡ï¸",
        description: "You keep everything running smoothly and provide the steady foundation that teams depend on!",
        traits: ["Reliable", "Patient", "Team-Oriented", "Consistent"],
        bpoRoles: ["Quality Assurance", "Operations Coordinator", "Process Analyst", "Support Specialist"],
        color: "text-green-400"
      },
      C: {
        title: "The Precision Pro",
        icon: "ðŸŽ¯",
        description: "You spot what others miss and ensure everything meets the highest standards of excellence!",
        traits: ["Detail-Oriented", "Analytical", "Quality-Focused", "Systematic"],
        bpoRoles: ["Quality Manager", "Data Analyst", "Compliance Specialist", "Documentation Lead"],
        color: "text-blue-400"
      }
    };

    const personalityType = personality[discResult.primaryType as keyof typeof personality];

    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Header />
        
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
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
                  <Brain className="h-12 w-12 text-green-400 mr-4" />
                  <div>
                    <h1 className="text-4xl font-bold gradient-text">DISC Personality Game</h1>
                    <p className="text-gray-400">Master workplace dynamics with interactive personality scenarios</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-4xl">ðŸ†</div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Challenge Complete!
                  </h1>
                </div>
                <p className="text-gray-400 text-lg">Here's how you performed</p>
              </motion.div>

              {/* Main Results Card */}
              <motion.div 
                className="bg-black rounded-xl p-8 mb-8 border border-gray-800 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center mb-6">
                  <div className="text-2xl mr-3">ðŸ†</div>
                  <h2 className="text-2xl font-bold text-white">Your Results</h2>
                </div>
                
                {/* Overall Performance */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Overall Performance</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {discResult.primaryType === 'D' ? 'EXCELLENT' : 
                       discResult.primaryType === 'I' ? 'OUTSTANDING' : 
                       discResult.primaryType === 'S' ? 'GREAT' : 'EXCEPTIONAL'}
                    </div>
                    <div className="text-xl text-gray-300">
                      Score: {Math.max(...Object.values(discResult.scores).map(Number))}
                    </div>
                  </div>
                </div>

                {/* Personality Type Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Personality Type</h3>
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{personalityType.icon}</div>
                      <h4 className="text-2xl font-bold text-white mb-2">{personalityType.title}</h4>
                      <p className="text-gray-300">{personalityType.description}</p>
                    </div>
                  </div>
                </div>

                {/* Individual Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(discResult.scores).map(([type, score]) => (
                    <div key={type} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-purple-400 mb-1">{String(score)}</div>
                        <div className="text-sm text-gray-400 font-medium">{type}-Type</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(Number(score) / Math.max(...Object.values(discResult.scores).map(Number))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Achievement Badges */}
                {gameState.achievements.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">ðŸ† Achievements Unlocked</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {gameState.achievements.map((achievement, index) => (
                        <div key={index} className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-3 text-center border border-yellow-400 shadow-lg">
                          <div className="text-sm font-bold text-white">{achievement}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => router.push('/career-tools/games')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg w-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Main Menu
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={resetGame}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Take Again
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Header />
        
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
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
                  <Brain className="h-12 w-12 text-green-400 mr-4" />
                  <div>
                    <h1 className="text-4xl font-bold gradient-text">DISC Personality Game</h1>
                    <p className="text-gray-400">Master workplace dynamics with interactive personality scenarios</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mr-4">
                      <Brain className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold gradient-text mb-2">
                        Welcome to DISC Personality Game!
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-lg">
                        Master workplace dynamics with interactive personality scenarios
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="text-gray-300 space-y-6 text-left max-w-3xl mx-auto">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-400" />
                        How to Play
                      </h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-3 mt-0.5 text-lg">âš¡</span>
                          <span>Answer workplace scenarios based on your natural instincts</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-3 mt-0.5 text-lg">ðŸŽ¯</span>
                          <span>Each choice reveals your DISC personality preferences</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-yellow-400 mr-3 mt-0.5 text-lg">ðŸ¢</span>
                          <span>Progress through different floors of the office building</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-3 mt-0.5 text-lg">ðŸŒŸ</span>
                          <span>Earn XP points and unlock achievement badges</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-3 mt-0.5 text-lg">ðŸ“Š</span>
                          <span>Discover your primary DISC type and workplace superpower</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-400 mr-3 mt-0.5 text-lg">ðŸ’¼</span>
                          <span>Get personalized BPO role recommendations</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-400 mr-3 mt-0.5 text-lg">ðŸ†</span>
                          <span>Complete all scenarios to unlock your full personality profile</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-400 text-lg">ðŸ¢</span>
                          <h4 className="text-white font-semibold">Office Building Progression</h4>
                        </div>
                        <p className="text-gray-300 text-sm">Climb through different floors representing each DISC personality type!</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-400 text-lg">ðŸŽ¯</span>
                          <h4 className="text-white font-semibold">Workplace Superpowers</h4>
                        </div>
                        <p className="text-gray-300 text-sm">Discover your unique strengths and ideal BPO career paths!</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-6 h-14"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Challenge!
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Game interface
  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Header />
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleBackClick}
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
                  <Brain className="h-12 w-12 text-green-400 mr-4" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">DISC Personality Game</h1>
                  <p className="text-gray-400">Master workplace dynamics with interactive personality scenarios</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* XP and Achievements Bar - Move to top for better visibility */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border-white/10 rounded-xl p-4 mb-6 shadow-xl max-w-4xl mx-auto"
          >
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl px-8 py-4 shadow-lg border border-green-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">âš¡</span>
                    <span className="text-white font-bold text-xl">XP: {gameState.totalXP}</span>
                  </div>
                </motion.div>
                
                {gameState.streak > 1 && (
                  <motion.div 
                    className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl px-8 py-4 shadow-lg border border-red-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">ðŸ”¥</span>
                      <span className="text-white font-bold text-xl">Streak: {gameState.streak}</span>
                    </div>
                  </motion.div>
                )}
                
                {gameState.combo > 2 && (
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl px-8 py-4 shadow-lg border border-purple-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">ðŸ’«</span>
                      <span className="text-white font-bold text-xl">Combo: {gameState.combo}</span>
                    </div>
                  </motion.div>
                )}
                
                {gameState.achievements.length > 0 && (
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl px-8 py-4 shadow-lg border border-yellow-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">ðŸ†</span>
                      <span className="text-white font-bold text-xl">{gameState.achievements.length} Achievements</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

          {/* Main Game Content Area */}
          <div className="max-w-4xl mx-auto">
            {/* Game Progress and Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card border-white/10 rounded-xl p-4 mb-6 shadow-xl"
            >
              {/* Progress Header */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <motion.h2 
                    className="text-3xl font-bold gradient-text"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Workplace Hero Assessment
                  </motion.h2>
                  <span className="text-gray-400 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
                    Question {gameState.currentQuestion + 1} of {DISC_SCENARIOS.length}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-700 overflow-hidden relative">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `${(gameState.currentQuestion / DISC_SCENARIOS.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  {/* Progress Milestones */}
                  {[25, 50, 75, 100].map((milestone) => (
                    <div
                      key={milestone}
                      className="absolute top-0 w-1 h-4 bg-white/30 rounded-full"
                      style={{ left: `${milestone}%` }}
                    />
                  ))}
                </div>
              </div>

            </motion.div>



            {/* Scenario Card - More prominent and spacious */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card border-white/10 rounded-xl p-6 mb-6 shadow-xl"
            >
              <div className="text-center">
                <motion.div 
                  className="glass-card border-white/10 rounded-2xl p-6 mb-6 shadow-xl bg-white/5"
                  whileHover={{ scale: 1.02 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 40px rgba(59, 130, 246, 0.5)",
                      "0 0 20px rgba(59, 130, 246, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.div 
                    className="text-6xl mb-4"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentScenario.category === 'D' ? 'âš¡' : 
                     currentScenario.category === 'I' ? 'ðŸŒŸ' : 
                     currentScenario.category === 'S' ? 'ðŸ›¡ï¸' : 'ðŸŽ¯'}
                  </motion.div>
                  <p className="text-gray-300 text-lg font-medium uppercase tracking-wide">{currentScenario.visual}</p>
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {currentScenario.title}
                </motion.h3>
                <motion.p 
                  className="text-xl leading-relaxed text-gray-200 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {currentScenario.description}
                </motion.p>
              </div>
            </motion.div>

            {/* Options Card - More spacious layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card border-white/10 rounded-xl p-6 mb-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">Choose Your Response</h3>
              <div className="space-y-4 md:space-y-6">
                {currentScenario.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id, option.disc, option.reaction)}
                    disabled={selectedOption !== null}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`w-full glass-card border-white/10 hover:border-white/20 rounded-xl p-4 md:p-6 text-left transition-all duration-300 hover:scale-[1.02] shadow-xl ${
                      selectedOption === option.id 
                        ? 'bg-gradient-to-r from-green-600 to-green-500 border-green-400 shadow-green-500/25 scale-105' 
                        : 'hover:shadow-2xl'
                    }`}
                    whileHover={{ 
                      y: selectedOption === null ? -5 : 0
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className={`w-14 h-14 rounded-full flex items-center justify-center mr-6 transition-all duration-300 ${
                          selectedOption === option.id 
                            ? 'bg-green-500 shadow-lg scale-110' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        animate={selectedOption === option.id ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 360]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-white font-bold text-xl">{option.id}</span>
                      </motion.div>
                      <span className="text-white text-xl font-medium">{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

            </motion.div>

            {/* Score Display Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card border-white/10 rounded-xl p-6 mb-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">Your Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(gameState.scores).map(([type, score], index) => (
                  <motion.div 
                    key={type} 
                    className="glass-card border-white/10 rounded-xl p-4 text-center shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div 
                      className="text-4xl font-bold text-white mb-2"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {score}
                    </motion.div>
                    <div className="text-gray-300 text-lg font-medium mb-3">{type}-Type</div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / Math.max(...Object.values(gameState.scores))) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    {/* Level Indicator */}
                    <motion.div 
                      className="mt-3 text-xs text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      Level {Math.floor(score / 5) + 1}
                    </motion.div>
                  </motion.div>
                ))}
              </div>


            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Reaction Animation Overlay */}
      {showReaction && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {/* Particle Effects */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1,
                scale: 0
              }}
              animate={{
                x: Math.cos(i * 45 * Math.PI / 180) * 150,
                y: Math.sin(i * 45 * Math.PI / 180) * 150,
                opacity: 0,
                scale: 1
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}
          
          {/* Main Reaction Display */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 1, repeat: 2 }}
            >
              {showReaction}
            </motion.div>
            
            {encouragingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-black/80 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20"
              >
                <p className="text-2xl font-bold text-white">{encouragingMessage}</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <motion.div
          className="fixed top-20 right-6 z-50"
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="glass-card border-yellow-400/50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-xl shadow-xl border">
            <div className="flex items-center gap-3">
              <span className="text-3xl">ðŸ†</span>
              <div>
                <p className="text-yellow-400 font-bold">Achievement Unlocked!</p>
                <p className="text-white text-sm">{showAchievement}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-black border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Assessment?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Your progress will be lost if you leave now. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Stay
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit} className="bg-red-600 hover:bg-red-700">
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
