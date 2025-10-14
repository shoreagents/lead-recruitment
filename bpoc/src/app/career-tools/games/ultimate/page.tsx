'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  Crown,
  Play,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight,
  Building2,
  BarChart3,
  Briefcase,
  Flame,
  Sparkles,
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Medal,
  Skull,
  User,
  UserCheck,
  UserCog,
  Settings,
  Laptop,
  Share
} from 'lucide-react';

const BPOC_SCENARIOS = [
  {
    id: 1,
    title: "The Late Start Crisis",
    scene: "Your first day, you arrive 15 minutes late due to traffic",
    visual: "🏢 Office lobby, teammates already working, supervisor looking at clock",
      problem: "Everyone notices you're late. Your supervisor looks concerned.",
      choices: [
        {
        id: 'blame_traffic',
        text: "😅 'Sorry, traffic was crazy! Manila roads are impossible!'",
        impact: { smart: -10, motivated: -5, integrity: -15, business: -8 },
          type: 'NIGHTMARE',
        reaction: "❌ Blame External Factors",
        consequence: "Tests blame external factors, victim mentality"
      },
      {
        id: 'ownership_forward',
        text: "📝 'I apologize for being late. I've adjusted my commute for tomorrow.'",
        impact: { smart: 15, motivated: 12, integrity: 20, business: 15 },
        type: 'PLATINUM',
        reaction: "✅ Ownership & Forward-Thinking",
        consequence: "Tests ownership, forward-thinking"
      },
      {
        id: 'energy_catchup',
        text: "💪 'Sorry for the delay - I'm ready to jump in and catch up!'",
        impact: { smart: 8, motivated: 18, integrity: 12, business: 10 },
          type: 'GOLD',
        reaction: "⚡ Accountability + Energy",
        consequence: "Tests accountability + energy"
      },
      {
        id: 'quiet_slip',
        text: "🤐 Quietly slip to your desk and start working",
        impact: { smart: -8, motivated: -10, integrity: -18, business: -12 },
          type: 'NIGHTMARE',
        reaction: "❌ Conflict Avoidance",
        consequence: "Tests conflict avoidance, poor communication"
        }
      ]
    },
    {
    id: 2,
    title: "The Knowledge Gap Challenge",
    scene: "Assigned to support a cryptocurrency client, but you know nothing about crypto",
    visual: "💻 Computer screen with Bitcoin charts, confused expression options",
    problem: "You need to provide quality support but lack the necessary knowledge.",
    choices: [
      {
        id: 'avoid_learning',
        text: "😰 'I don't know anything about cryptocurrency, I might need different clients'",
        impact: { smart: -15, motivated: -20, integrity: 5, business: -18 },
          type: 'NIGHTMARE',
        reaction: "❌ Avoid Learning",
        consequence: "LAZY + DUMB: Avoid learning, limit growth"
      },
      {
        id: 'proactive_research',
        text: "📚 'I'll research crypto basics tonight and ask smart questions tomorrow'",
        impact: { smart: 20, motivated: 25, integrity: 15, business: 18 },
        type: 'PLATINUM',
        reaction: "🎯 Proactive Learning",
        consequence: "SMART + MOTIVATED: Proactive learning"
      },
      {
        id: 'leverage_others',
        text: "🤝 'Let me find a teammate who knows crypto to help me get started'",
        impact: { smart: 15, motivated: 8, integrity: 12, business: 15 },
        type: 'GOLD',
        reaction: "🧠 Leverage Others",
        consequence: "SMART + LAZY: Leverage others efficiently"
      },
      {
        id: 'overconfident',
        text: "🤔 'I'll figure it out as I go, how hard can it be?'",
        impact: { smart: -12, motivated: 15, integrity: 8, business: -10 },
        type: 'BRONZE',
        reaction: "⚠️ Overconfident",
        consequence: "DUMB + MOTIVATED: Overconfident without preparation"
        }
      ]
    },
    {
    id: 3,
    title: "The Friday 5PM Disaster",
    scene: "Friday 5PM, client's e-commerce site crashes during flash sale",
    visual: "🚨 Error screens, phone ringing, stress indicators, clock ticking",
    problem: "Client's biggest sale of the year. Losing $500/minute. Client sleeping (different timezone). Supervisor left early.",
      choices: [
        {
          id: 'wait_instructions',
        text: "📞 'I'll try to reach the client and wait for instructions'",
        impact: { smart: -12, motivated: 10, integrity: 8, business: -20 },
          type: 'NIGHTMARE',
          reaction: "❌ Hierarchy Paralysis",
        consequence: "DUMB + MOTIVATED: Follow hierarchy while crisis escalates"
      },
      {
        id: 'emergency_protocol',
        text: "🔧 'Emergency protocol: diagnose issue, implement temp fix, document everything, notify all stakeholders'",
        impact: { smart: 25, motivated: 22, integrity: 18, business: 28 },
          type: 'PLATINUM',
        reaction: "🦸 Crisis Management Hero",
        consequence: "SMART + MOTIVATED: Take charge with systematic approach"
      },
      {
        id: 'email_explanation',
        text: "📧 'I'll send an email to client and supervisor explaining the situation'",
        impact: { smart: -10, motivated: -8, integrity: 5, business: -15 },
        type: 'NIGHTMARE',
        reaction: "❌ Cover Without Solving",
        consequence: "DUMB + LAZY: Cover yourself without solving problem"
      },
      {
        id: 'quick_fix_check',
        text: "💻 'Let me check if it's a simple fix I can handle immediately'",
        impact: { smart: 18, motivated: 12, integrity: 12, business: 20 },
          type: 'GOLD',
        reaction: "🔍 Solution-Focused",
        consequence: "SMART + LAZY: Quick solution-focused approach"
        }
      ]
    },
    {
    id: 4,
    title: "The Blame Game Moment",
    scene: "You discover the website crash was caused by an update YOU did yesterday",
    visual: "📊 Error logs showing your username, sinking feeling animation",
    problem: "Client lost $15,000. Supervisor asking for explanation. Teammate suggests blaming 'server issues'. Client relationship strained.",
      choices: [
        {
        id: 'blame_servers',
        text: "🤝 'Server problems caused the outage, very unfortunate timing'",
        impact: { smart: -15, motivated: -8, integrity: -30, business: -20 },
          type: 'NIGHTMARE',
        reaction: "❌ Hide Mistakes",
        consequence: "NIGHTMARE: Hide mistakes, destroy trust"
        },
        {
          id: 'full_ownership',
        text: "📋 'My update caused this. Here's what went wrong and how I'll prevent it'",
        impact: { smart: 20, motivated: 18, integrity: 30, business: 22 },
          type: 'PLATINUM',
        reaction: "🏆 Full Ownership",
        consequence: "GOLD: Full ownership + learning"
      },
      {
        id: 'systems_focus',
        text: "🔍 'The update process needs better testing protocols to prevent this'",
        impact: { smart: 15, motivated: 10, integrity: 12, business: 18 },
        type: 'GOLD',
        reaction: "🛠️ Systems Thinking",
        consequence: "SMART: Deflect to systems without lying"
        },
        {
          id: 'blame_training',
        text: "😰 'I was following the exact procedure I was taught'",
        impact: { smart: -10, motivated: 5, integrity: -15, business: -12 },
        type: 'BRONZE',
        reaction: "⚠️ Blame Training",
        consequence: "DUMB: Blame training without ownership"
      }
    ]
  },
    {
      id: 5,
      title: "The Impossible Customer",
      scene: "Angry customer wants refund for digital product after 6 months",
      visual: "💬 Chat interface with increasingly hostile messages",
      problem: "Customer demanding $500 refund, threatening bad reviews. Policy: 30-day limit. Customer ranting about 'garbage software'.",
      choices: [
        {
          id: 'policy_robot',
          text: "📖 'I understand your frustration, but our policy clearly states 30 days maximum for refunds'",
          impact: { smart: -8, motivated: 5, integrity: 8, business: -15 },
          type: 'BRONZE',
          reaction: "📋 Policy Robot",
          consequence: "DUMB: Policy robot ignoring business impact"
        },
        {
          id: 'empathy_creative',
          text: "🕊️ 'I hear how frustrated you are. Let me explore options to make this right within our guidelines'",
          impact: { smart: 22, motivated: 18, integrity: 20, business: 25 },
          type: 'PLATINUM',
          reaction: "💡 Empathy + Problem-Solving",
          consequence: "SMART: Empathy + creative problem-solving"
        },
        {
          id: 'immediate_refund',
          text: "💸 'Let me approve the refund to resolve this situation immediately'",
          impact: { smart: -5, motivated: -8, integrity: 12, business: -10 },
          type: 'BRONZE',
          reaction: "⚡ Easy Solution",
          consequence: "LAZY: Easy solution without considering precedent"
        },
        {
          id: 'escalate_supervisor',
          text: "📞 'This is escalated beyond my authority, let me get my supervisor'",
          impact: { smart: -12, motivated: -15, integrity: 8, business: -18 },
          type: 'NIGHTMARE',
          reaction: "❌ Avoid Responsibility",
          consequence: "LAZY: Avoid decision-making responsibility"
        }
      ]
    },
    {
      id: 6,
      title: "The Cultural Sensitivity Test",
      scene: "US client makes inappropriate comment about 'cheap Filipino labor'",
      visual: "📹 Video call with client making dismissive gestures",
      problem: "Client says: 'You guys are cheap for a reason. Just get it done, it doesn't have to be perfect - it's not like you're expensive American workers.'",
      choices: [
        {
          id: 'confront_offensive',
          text: "😠 'That's offensive and unprofessional. Filipino workers provide excellent value.'",
          impact: { smart: 12, motivated: 20, integrity: 25, business: -8 },
          type: 'GOLD',
          reaction: "⚡ Stand Up for Values",
          consequence: "MOTIVATED but confrontational - could damage relationship"
        },
        {
          id: 'stay_silent',
          text: "🤐 Stay silent and continue with work discussion",
          impact: { smart: -8, motivated: -15, integrity: -20, business: 5 },
          type: 'NIGHTMARE',
          reaction: "❌ Enable Disrespect",
          consequence: "LAZY: Avoid conflict but enable disrespect"
        },
        {
          id: 'professional_redirect',
          text: "💼 'We focus on delivering quality results regardless of cost differences'",
          impact: { smart: 20, motivated: 15, integrity: 22, business: 25 },
          type: 'PLATINUM',
          reaction: "🎯 Professional Redirect",
          consequence: "SMART: Professional redirect without confrontation"
        },
        {
          id: 'agree_disrespect',
          text: "😅 'Haha yes, we work hard for good prices!'",
          impact: { smart: -15, motivated: -5, integrity: -25, business: -12 },
          type: 'NIGHTMARE',
          reaction: "❌ Agree with Disrespect",
          consequence: "DUMB: Agree with disrespect"
        }
      ]
    },
    {
      id: 7,
      title: "The Recurring Problem Pattern",
      scene: "Third month review - you notice client patterns",
      visual: "📊 Data dashboard showing recurring issues",
      problem: "Client A: Same billing error monthly (2-3 hours to fix). Client B: Weekly password resets. Client C: Confused about project status repeatedly.",
      choices: [
        {
          id: 'continue_manual',
          text: "🔄 'These issues are manageable, I'll continue handling them as they come'",
          impact: { smart: -15, motivated: -12, integrity: 5, business: -18 },
          type: 'NIGHTMARE',
          reaction: "❌ No Pattern Recognition",
          consequence: "DUMB + LAZY: No pattern recognition or improvement thinking"
        },
        {
          id: 'automated_solutions',
          text: "🛠️ 'I'll create automated solutions and documentation to prevent these recurring issues'",
          impact: { smart: 25, motivated: 22, integrity: 18, business: 28 },
          type: 'PLATINUM',
          reaction: "🎯 Systematic Improvement",
          consequence: "SMART + MOTIVATED: Systematic improvement approach"
        },
        {
          id: 'better_instructions',
          text: "📧 'I'll send clients better instructions to reduce these problems'",
          impact: { smart: 15, motivated: 8, integrity: 12, business: 18 },
          type: 'GOLD',
          reaction: "📝 Simple Solution",
          consequence: "SMART + LAZY: Simple solution without full system thinking"
        },
        {
          id: 'training_others',
          text: "👥 'These clients need additional training from their account managers'",
          impact: { smart: -8, motivated: 12, integrity: 8, business: -10 },
          type: 'BRONZE',
          reaction: "⚠️ Pass Responsibility",
          consequence: "DUMB + MOTIVATED: Pass responsibility without solving root cause"
        }
      ]
    },
    {
      id: 8,
      title: "The Business Opportunity Spot",
      scene: "Client mentions struggling with social media engagement",
      visual: "📉 Client's declining social media analytics on screen",
      problem: "Client's Instagram engagement dropped 40%. Considering $3,000/month agency. You notice: no consistent branding, random posting, unanswered comments, wrong target audience.",
      choices: [
        {
          id: 'not_my_expertise',
          text: "🤝 'That's outside my expertise, good luck finding the right agency'",
          impact: { smart: -8, motivated: -15, integrity: 5, business: -20 },
          type: 'BRONZE',
          reaction: "❌ Miss Opportunity",
          consequence: "LAZY: Miss business opportunity"
        },
        {
          id: 'proactive_value',
          text: "💡 'I've noticed some patterns in your social media. Would you like my observations before you hire an agency?'",
          impact: { smart: 22, motivated: 25, integrity: 18, business: 30 },
          type: 'PLATINUM',
          reaction: "🎯 Proactive Value Creation",
          consequence: "SMART + MOTIVATED: Proactive value creation"
        },
        {
          id: 'agencies_know_best',
          text: "📱 'Social media is tricky, agencies probably know best'",
          impact: { smart: -12, motivated: -8, integrity: 8, business: -15 },
          type: 'NIGHTMARE',
          reaction: "❌ No Value-Add",
          consequence: "DUMB: No value-add thinking"
        },
        {
          id: 'expand_role',
          text: "💰 'I could handle social media too if you're interested in expanding my role'",
          impact: { smart: 10, motivated: 18, integrity: 12, business: 8 },
          type: 'GOLD',
          reaction: "⚡ Motivated Overreach",
          consequence: "MOTIVATED but potentially overreaching"
        }
      ]
    },
    {
      id: 9,
      title: "The Team Crisis Decision",
      scene: "Your supervisor is sick, you're temporarily in charge of 5-person team",
      visual: "👥 Team looking to you for guidance, multiple crisis alerts",
      problem: "Simultaneous emergencies: 1) Client payment system down 2) New member deleted files 3) Angry customer needs callback 4) Monthly report due in 2 hours",
      choices: [
        {
          id: 'team_vote',
          text: "🗳️ 'Let's vote on which problem to handle first'",
          impact: { smart: -15, motivated: -10, integrity: 5, business: -18 },
          type: 'NIGHTMARE',
          reaction: "❌ Avoid Leadership",
          consequence: "DUMB: Avoid leadership responsibility"
        },
        {
          id: 'strategic_prioritization',
          text: "📊 'Client payment system first (highest revenue impact), then customer callback, then report, then file recovery'",
          impact: { smart: 28, motivated: 25, integrity: 22, business: 30 },
          type: 'PLATINUM',
          reaction: "🏆 Strategic Leadership",
          consequence: "SMART + MOTIVATED: Strategic prioritization with clear reasoning"
        },
        {
          id: 'call_supervisor',
          text: "📞 'I'll call our supervisor to get direction on priorities'",
          impact: { smart: -10, motivated: -18, integrity: 8, business: -15 },
          type: 'NIGHTMARE',
          reaction: "❌ Avoid Decisions",
          consequence: "LAZY: Avoid making hard decisions"
        },
        {
          id: 'figure_it_out',
          text: "🏃 'Everyone handle what they can, we'll figure it out as we go'",
          impact: { smart: -12, motivated: 15, integrity: 10, business: -20 },
          type: 'BRONZE',
          reaction: "⚠️ No Strategy",
          consequence: "DUMB + MOTIVATED: No strategy under pressure"
        }
      ]
    },
    {
      id: 10,
      title: "The Final Ethics Test",
      scene: "End of your trial month, permanent position decision pending",
      visual: "🏢 Supervisor's office, contract on desk, moral crossroads moment",
      problem: "Supervisor hints that if you 'overlook' questionable client billing practices (charging for uncompleted work), your permanent position is guaranteed. Others seem to know but stay quiet.",
      choices: [
        {
          id: 'compromise_integrity',
          text: "👥 'I want to fit in with the team culture and practices'",
          impact: { smart: -20, motivated: -15, integrity: -30, business: -25 },
          type: 'NIGHTMARE',
          reaction: "❌ Compromise Integrity",
          consequence: "NIGHTMARE: Compromise integrity for job security"
        },
        {
          id: 'professional_standards',
          text: "📝 'I'll focus on delivering quality work according to professional standards'",
          impact: { smart: 25, motivated: 22, integrity: 30, business: 28 },
          type: 'PLATINUM',
          reaction: "🏆 Maintain Integrity",
          consequence: "GOLD: Maintain integrity without being confrontational"
        },
        {
          id: 'report_irregularities',
          text: "🚨 'I need to report these billing irregularities to management'",
          impact: { smart: 15, motivated: 20, integrity: 28, business: 10 },
          type: 'GOLD',
          reaction: "⚖️ Principled Stand",
          consequence: "PRINCIPLED but potentially naive about workplace politics"
        },
        {
          id: 'head_down',
          text: "🤐 'I'll keep my head down and do my assigned tasks only'",
          impact: { smart: -15, motivated: -20, integrity: -18, business: -22 },
          type: 'NIGHTMARE',
          reaction: "❌ Avoid Responsibility",
          consequence: "DUMB + LAZY: Avoid responsibility and moral clarity"
        }
      ]
    }
  ];

export default function BPOCUltimateGame() {
  const router = useRouter();
  const { user } = useAuth();
  const [gameState, setGameState] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    smart: 0,
    motivated: 0,
    integrity: 0,
    business: 0
  });
  const [choices, setChoices] = useState<Array<{scenario: number, choice: any, type: string}>>([]);
  const [playerName, setPlayerName] = useState('Player');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍💼');
  const [showReaction, setShowReaction] = useState('');
  const [showExitDialog, setShowExitDialog] = useState(false);

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const postedRef = useRef(false);
  // Save session once when reaching results screen
  useEffect(() => {
    if (gameState !== 'results') return;
    (async () => {
      try {
        if (postedRef.current) return;
        postedRef.current = true;
        const startedAt = gameStartTime ? new Date(gameStartTime) : new Date(Date.now() - 5 * 60 * 1000);
        const finishedAt = new Date();
        const durationMs = finishedAt.getTime() - (gameStartTime || finishedAt.getTime());
        const platinumChoices = choices.filter(c => c.type === 'PLATINUM').length;
        const goldChoices = choices.filter(c => c.type === 'GOLD').length;
        const bronzeChoices = choices.filter(c => c.type === 'BRONZE').length;
        const nightmareChoices = choices.filter(c => c.type === 'NIGHTMARE').length;
        const token = await (await import('@/lib/auth-helpers')).getSessionToken().catch(() => null);
        await fetch('/api/games/ultimate/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            startedAt,
            finishedAt,
            durationMs,
            smart: scores.smart,
            motivated: scores.motivated,
            integrity: scores.integrity,
            business: scores.business,
            platinumChoices,
            goldChoices,
            bronzeChoices,
            nightmareChoices,
            tier: getPlayerTier().tier,
            tierRecommendation: getPlayerTier().recommendation ?? null,
            clientValue: getPlayerTier().clientValue ?? null,
            teamMorale: Math.round(teamMorale),
            clientTrust: Math.round(clientTrust),
            businessImpact: Math.round(businessImpact),
            crisisPressure: Math.round(crisisPressure),
            keyStrengths: [
              ...(scores.smart >= 120 ? ['Strategic decision-making'] : []),
              ...(scores.motivated >= 120 ? ['High initiative and drive'] : []),
              ...(scores.integrity >= 120 ? ['Strong ethical foundation'] : []),
              ...(scores.business >= 120 ? ['Excellent business sense'] : []),
              ...(platinumChoices >= 4 ? ['Consistent premium choices'] : []),
              ...(choices.filter(c => c.type === 'NIGHTMARE').length <= 1 ? ['Crisis avoidance'] : [])
            ],
            developmentAreas: [
              ...(scores.smart < 90 ? ['Strategic thinking under pressure'] : []),
              ...(scores.motivated < 90 ? ['Proactive leadership initiative'] : []),
              ...(scores.integrity < 90 ? ['Ethical decision-making'] : []),
              ...(scores.business < 90 ? ['Commercial awareness'] : []),
              ...(choices.filter(c => c.type === 'NIGHTMARE').length >= 3 ? ['Crisis management skills'] : []),
              ...(choices.filter(c => c.type === 'BRONZE').length >= 4 ? ['Results-oriented thinking'] : [])
            ],
            playerName,
            avatar: selectedAvatar
          })
        });
      } catch (e) {
        console.error('Failed to save Ultimate session', e);
      }
    })();
  }, [gameState]);
  
  // Real-time feedback system state
  const [teamMorale, setTeamMorale] = useState(0); // 0-100
  const [clientTrust, setClientTrust] = useState(0); // 0-100
  const [businessImpact, setBusinessImpact] = useState(0); // 0-100
  const [crisisPressure, setCrisisPressure] = useState(0); // 0-100
  


  const startGame = () => {
    // Trigger header SignUp dialog if user is not logged in
    if (!user) {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('signup', 'true');
        router.push(`${url.pathname}?${url.searchParams.toString()}`);
        return;
      }
    }
    setGameState('playing');
    setGameStartTime(Date.now());
  };



  const handleChoice = (choice: any) => {
    // Set selected choice
    setSelectedChoice(choice.id);
    
    // Update scores
    setScores(prev => {
      const newScores = {
      smart: Math.max(0, Math.min(100, prev.smart + choice.impact.smart)),
      motivated: Math.max(0, Math.min(100, prev.motivated + choice.impact.motivated)),
      integrity: Math.max(0, Math.min(100, prev.integrity + choice.impact.integrity)),
      business: Math.max(0, Math.min(100, prev.business + choice.impact.business))
      };
      console.log('Previous scores:', prev);
      console.log('Choice impact:', choice.impact);
      console.log('New scores:', newScores);
      return newScores;
    });

    // Real-time feedback system updates
    const updateFeedback = () => {
      // Team Morale updates based on choice type
      if (choice.type === 'PLATINUM') {
        setTeamMorale(prev => Math.min(100, prev + 15));
      } else if (choice.type === 'GOLD') {
        setTeamMorale(prev => Math.min(100, prev + 10));
      } else if (choice.type === 'BRONZE') {
        setTeamMorale(prev => Math.max(0, prev - 5));
      } else if (choice.type === 'NIGHTMARE') {
        setTeamMorale(prev => Math.max(0, prev - 20));
      }
      
      // Client Trust updates based on integrity and business impact
      const trustChange = (choice.impact.integrity + choice.impact.business) / 10;
      setClientTrust(prev => Math.max(0, Math.min(100, prev + trustChange)));
      
      // Business Impact updates based on business score
      const businessChange = choice.impact.business / 5;
      setBusinessImpact(prev => Math.max(0, Math.min(100, prev + businessChange)));
      
      // Crisis Pressure increases with each scenario
      setCrisisPressure(prev => Math.min(100, prev + 10));
    };
    
    updateFeedback();

    // Record choice
    setChoices(prev => [...prev, { scenario: currentQuestion, choice, type: choice.type }]);

    // Show reaction
    setShowReaction(choice.reaction);
    setTimeout(() => setShowReaction(''), 2000);

    // Adaptive difficulty: Determine next scenario based on performance
    const getNextScenario = () => {
      const platinumChoices = choices.filter(c => c.type === 'PLATINUM').length;
      const nightmareChoices = choices.filter(c => c.type === 'NIGHTMARE').length;
      const avgScore = (scores.smart + scores.motivated + scores.integrity + scores.business) / 4;
      
      // If performing well, unlock harder scenarios
      if (platinumChoices >= 3 && nightmareChoices <= 1 && avgScore >= 70) {
        // Continue with challenging scenarios (scenarios 5-10)
        return Math.min(currentQuestion + 1, BPOC_SCENARIOS.length - 1);
      }
      // If struggling, provide remedial scenarios but allow progression
      else if (nightmareChoices >= 2 || avgScore < 50) {
        // Allow progression through all scenarios but focus on basics
        return Math.min(currentQuestion + 1, BPOC_SCENARIOS.length - 1);
      }
      // Normal progression
      else {
        return Math.min(currentQuestion + 1, BPOC_SCENARIOS.length - 1);
      }
    };

    // Move to next question or end game
    if (currentQuestion < BPOC_SCENARIOS.length - 1) {
    setTimeout(() => {
        setCurrentQuestion(getNextScenario());
        setSelectedChoice(null); // Reset selected choice for next question
      }, 2000);
      } else {
      setTimeout(() => {
        setGameState('results');
      }, 2000);
      }
  };

  const getPlayerTier = () => {
    const platinumChoices = choices.filter(c => c.type === 'PLATINUM').length;
    const goldChoices = choices.filter(c => c.type === 'GOLD').length;
    const bronzeChoices = choices.filter(c => c.type === 'BRONZE').length;
    const nightmareChoices = choices.filter(c => c.type === 'NIGHTMARE').length;
    
    // Calculate max potential scores (10 scenarios * max 25 points per scenario = 250 per category)
    const maxSmart = 250;
    const maxMotivated = 250;
    const maxIntegrity = 250;
    const maxBusiness = 250;

    // Calculate percentages
    const smartPercent = (scores.smart / maxSmart) * 100;
    const motivatedPercent = (scores.motivated / maxMotivated) * 100;
    const integrityPercent = (scores.integrity / maxIntegrity) * 100;
    const businessPercent = (scores.business / maxBusiness) * 100;

    // Enhanced feedback system based on 10 scenarios
    const getDetailedFeedback = (tier: string) => {
      const strengthAreas = [];
      const improvementAreas = [];
      
      // Analyze individual scores (out of potential ~250 each with 10 scenarios)
      if (scores.smart >= 140) strengthAreas.push("exceptional strategic thinking");
      else if (scores.smart >= 100) strengthAreas.push("solid analytical skills");
      else if (scores.smart < 70) improvementAreas.push("decision-making under pressure");
      
      if (scores.motivated >= 140) strengthAreas.push("outstanding drive and initiative");
      else if (scores.motivated >= 100) strengthAreas.push("good motivation and energy");
      else if (scores.motivated < 70) improvementAreas.push("proactive leadership and initiative");
      
      if (scores.integrity >= 140) strengthAreas.push("unwavering ethical standards");
      else if (scores.integrity >= 100) strengthAreas.push("strong moral compass");
      else if (scores.integrity < 70) improvementAreas.push("ethical decision-making and transparency");
      
      if (scores.business >= 140) strengthAreas.push("excellent business acumen");
      else if (scores.business >= 100) strengthAreas.push("good commercial awareness");
      else if (scores.business < 70) improvementAreas.push("business strategy and client focus");
      
      // Choice pattern analysis
      if (platinumChoices >= 6) strengthAreas.push("consistent platinum-level choices");
      else if (platinumChoices >= 4) strengthAreas.push("frequent high-quality decisions");
      
      if (nightmareChoices >= 3) improvementAreas.push("avoiding crisis-creating decisions");
      else if (nightmareChoices >= 1) improvementAreas.push("better crisis management");
      
      if (bronzeChoices >= 4) improvementAreas.push("moving from process-focused to results-oriented thinking");
      
      return { strengthAreas, improvementAreas };
    };

    const feedback = getDetailedFeedback('');

    // PLATINUM TIER (Top 5%): "Executive Material"
    if (smartPercent >= 85 && motivatedPercent >= 85 && integrityPercent >= 90 && businessPercent >= 80) {
      return {
        tier: 'EXECUTIVE MATERIAL',
        color: 'text-yellow-400',
        icon: Crown,
        description: `${playerName}, you're in the top 5% of candidates! You think like business owners, not employees. You turn challenges into competitive advantages and clients will fight to keep you. You're ready for fast-track promotion to senior roles with equity/partnership potential.`,
        recommendation: 'Fast-track to senior roles, offer equity/partnership paths',
        clientValue: 'Worth 5x standard rate, will grow client\'s business'
      };
    }
    // GOLD TIER (Top 15%): "Client Champions"
    else if (smartPercent >= 75 && motivatedPercent >= 75 && integrityPercent >= 80 && businessPercent >= 70) {
      return {
        tier: 'CLIENT CHAMPION',
        color: 'text-blue-400',
        icon: Trophy,
        description: `${playerName}, you're in the top 15%! You prevent disasters before they happen and proactively improve client operations. Clients trust you with critical decisions. You're a natural problem-solver and innovator.`,
        recommendation: 'Premium positioning, selective client matching',
        clientValue: 'Worth 3x standard rate, becomes indispensable'
      };
    }
    // SILVER TIER (Top 35%): "Reliable Professionals"
    else if (smartPercent >= 60 && motivatedPercent >= 60 && integrityPercent >= 70 && businessPercent >= 50) {
      return {
        tier: 'RELIABLE PROFESSIONAL',
        color: 'text-green-400',
        icon: Target,
        description: `${playerName}, you're a solid performer who follows through. You complete tasks accurately and on time, handle routine challenges independently, and show steady improvement. You're dependable foundation for any team.`,
        recommendation: 'Standard rate, good for established clients',
        clientValue: 'Market rate, dependable foundation team members'
      };
    }
    // BRONZE TIER (35%): "Supervised Workers"
    else if (smartPercent >= 40 && motivatedPercent >= 50 && integrityPercent >= 60 && businessPercent >= 30) {
      return {
        tier: 'SUPERVISED WORKER',
        color: 'text-orange-400',
        icon: AlertTriangle,
        description: `${playerName}, you can work with close supervision. You need clear instructions and regular check-ins, but you're suitable for routine, well-defined tasks. With proper training and development support, you can grow into higher tiers.`,
        recommendation: 'Budget rate with management support',
        clientValue: 'Cost-effective for simple tasks only'
      };
    }
    // NEW TIER: "Platinum Thinker" - For players with high platinum choices but lower scores
    else if (platinumChoices >= 4 && nightmareChoices <= 2) {
      return {
        tier: 'PLATINUM THINKER',
        color: 'text-purple-400',
        icon: Star,
        description: `${playerName}, you demonstrate exceptional decision-making quality with ${platinumChoices} platinum-level choices! While your scores may need development, your strategic thinking and crisis avoidance show real potential. You have the mindset of a high-performer.`,
        recommendation: 'Development-focused placement with mentorship',
        clientValue: 'High potential, worth investment in training'
      };
    }
    // NIGHTMARE TIER (15%): "DO NOT HIRE"
    else {
      const criticalIssues = [];
      if (nightmareChoices >= 6) criticalIssues.push(`made ${nightmareChoices} crisis-creating decisions`);
      if (smartPercent < 40 || motivatedPercent < 40 || integrityPercent < 50) criticalIssues.push("scored below minimum thresholds in key areas");
      if (platinumChoices === 0) criticalIssues.push("showed no evidence of platinum-level thinking");
      
    return {
        tier: 'DO NOT HIRE',
        color: 'text-red-400',
        icon: Skull,
        description: `${playerName}, this assessment reveals serious concerns: ${criticalIssues.join(", ")}. You may hide mistakes until they become disasters, blame others, and lack business awareness. You could damage client relationships and reputation.`,
        recommendation: 'Immediate rejection regardless of skills',
        clientValue: 'NEGATIVE - protect clients from these candidates'
      };
    }
  };

  const resetGame = () => {
    setGameState('welcome');
    setCurrentQuestion(0);
    setScores({
      smart: 0,
      motivated: 0,
      integrity: 0,
      business: 0
    });
    setChoices([]);
    
    
    
    // Reset real-time feedback system
    setTeamMorale(50);
    setClientTrust(50);
    setBusinessImpact(50);
    setCrisisPressure(0);
  };

  const handleBackClick = () => {
    if (gameState === 'playing' && currentQuestion > 0) {
      setShowExitDialog(true);
    } else {
      router.push('/career-tools/games');
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    router.push('/career-tools/games');
  };

  // Welcome Screen
  if (gameState === 'welcome') {
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
                  className="mr-4 text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <div className="flex items-center">
                  <Crown className="h-12 w-12 text-green-400 mr-4" />
                  <div>
                    <h1 className="text-4xl font-bold gradient-text">BPOC Ultimate</h1>
                    <p className="text-gray-400">The Complete Candidate Revelation</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Welcome Content */}
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
                          Welcome to BPOC Ultimate!
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-lg">
                          The Complete Candidate Revelation
                        </CardDescription>
                      </div>
                    </div>

                  </CardHeader>
                  <CardContent>
                    {/* How to Play Section */}
                    <div className="text-gray-300 space-y-6 text-left max-w-3xl mx-auto">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-red-400" />
                          How to Play
                        </h3>
                        <ul className="space-y-3 text-sm">
                                                     <li className="flex items-start">
                             <span className="text-cyan-400 mr-3 mt-0.5 text-lg">🎯</span>
                             <span>Navigate through 10 critical workplace scenarios</span>
                           </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">⚡</span>
                            <span>Make real-time decisions that reveal your character</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">🏆</span>
                            <span>Each choice impacts your Smart, Motivated, Integrity, and Business scores</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">💎</span>
                            <span>Platinum choices = Executive Material potential</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">⚠️</span>
                            <span>Nightmare choices = Red flags for employers</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-cyan-400 mr-3 mt-0.5 text-lg">🎭</span>
                            <span>Your final tier reveals your true workplace potential</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="h-5 w-5 text-green-400" />
                            <h4 className="text-white font-semibold">Executive Assessment</h4>
                          </div>
                          <p className="text-gray-300 text-sm">Evaluate leadership, decision-making, and business acumen in 10 real scenarios!</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-5 w-5 text-blue-400" />
                            <h4 className="text-white font-semibold">Comprehensive Scoring</h4>
                          </div>
                          <p className="text-gray-300 text-sm">Track your progress across four key dimensions of workplace success!</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                                         <Button
                       onClick={startGame}
                       className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-6 h-14"
                     >
                       <Play className="h-6 w-6 mr-3" />
                       Start the Ultimate Game
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
    const playerTier = getPlayerTier();
    const IconComponent = playerTier.icon;
    
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
                  <Crown className="h-12 w-12 text-green-400 mr-4" />
                  <div>
                    <h1 className="text-4xl font-bold gradient-text">BPOC Ultimate</h1>
                    <p className="text-gray-400">The Complete Candidate Revelation</p>
              </div>
              </div>
            </div>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <Card className="glass-card border-white/10">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Game Complete</h2>
                </div>
                    <div className="flex items-center justify-center mb-6">
                      <div className="text-6xl mr-4">{selectedAvatar}</div>
                      <div>

                        <div className={`text-xl font-bold ${playerTier.color} flex items-center gap-2`}>
                          <IconComponent className="w-6 h-6" />
                          {playerTier.tier}
              </div>
                        <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                          {playerTier.description}
                        </p>
                        {playerTier.recommendation && (
                          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="text-blue-400 font-semibold text-sm mb-1">📋 Recommendation:</div>
                            <div className="text-blue-300 text-sm">{playerTier.recommendation}</div>
                </div>
                        )}
                        {playerTier.clientValue && (
                          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="text-green-400 font-semibold text-sm mb-1">💰 Client Value:</div>
                            <div className="text-green-300 text-sm">{playerTier.clientValue}</div>
              </div>
                        )}
                </div>
              </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Score Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Leadership Competency Analysis</CardTitle>
                    <CardDescription className="text-gray-400">
                      Based on {choices.length} critical business scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'Team Morale', score: Math.round(teamMorale), color: 'green', max: 100 },
                        { name: 'Client Trust', score: Math.round(clientTrust), color: 'blue', max: 100 },
                        { name: 'Business Impact', score: Math.round(businessImpact), color: 'purple', max: 100 },
                        { name: 'Crisis Pressure', score: Math.round(crisisPressure), color: 'orange', max: 100 }
                      ].map((competency, index) => {
                        const percentage = competency.score;
                        const level = percentage >= 85 ? 'Exceptional' : 
                                     percentage >= 70 ? 'Strong' : 
                                     percentage >= 50 ? 'Developing' : 
                                     percentage >= 35 ? 'Emerging' : 'Needs Work';
                        
                        return (
                          <motion.div 
                            key={competency.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <Card className={`bg-black border-${competency.color}-500/30 rounded-xl`}>
                              <CardContent className="p-4 text-center">
                                <div className={`text-3xl font-bold text-${competency.color}-400 mb-2`}>{competency.score}%</div>
                                <div className="text-white text-sm mb-2">{competency.name}</div>
                                <div className="text-gray-400 text-xs mb-3">{level}</div>
                                <div className={`w-full bg-gray-800 rounded-full h-1`}>
                                  <div 
                                    className={`bg-${competency.color}-400 h-1 rounded-full transition-all duration-1000`}
                                    style={{ width: `${percentage}%` }}
                  />
                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
              </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Performance Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {/* Leadership Strengths */}
                <Card className="glass-card border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        scores.smart >= 120 && "Strategic decision-making",
                        scores.motivated >= 120 && "High initiative and drive", 
                        scores.integrity >= 120 && "Strong ethical foundation",
                        scores.business >= 120 && "Excellent business sense",
                        choices.filter(c => c.type === 'PLATINUM').length >= 4 && "Consistent premium choices",
                        choices.filter(c => c.type === 'NIGHTMARE').length <= 1 && "Crisis avoidance"
                      ].filter(Boolean).map((strength, index) => (
                        <div key={index} className="flex items-center gap-2 text-green-300">
                          <Star className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{strength}</span>
            </div>
                      ))}
                      {[
                        scores.smart >= 120,
                        scores.motivated >= 120, 
                        scores.integrity >= 120,
                        scores.business >= 120,
                        choices.filter(c => c.type === 'PLATINUM').length >= 4,
                        choices.filter(c => c.type === 'NIGHTMARE').length <= 1
                      ].filter(Boolean).length === 0 && (
                        <div className="text-gray-400 text-sm">Focus on building strengths in upcoming scenarios</div>
                      )}
              </div>
                  </CardContent>
                </Card>

                {/* Areas for Development */}
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Development Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        scores.smart < 90 && "Strategic thinking under pressure",
                        scores.motivated < 90 && "Proactive leadership initiative", 
                        scores.integrity < 90 && "Ethical decision-making",
                        scores.business < 90 && "Commercial awareness",
                        choices.filter(c => c.type === 'NIGHTMARE').length >= 3 && "Crisis management skills",
                        choices.filter(c => c.type === 'BRONZE').length >= 4 && "Results-oriented thinking"
                      ].filter(Boolean).map((area, index) => (
                        <div key={index} className="flex items-center gap-2 text-orange-300">
                          <Target className="w-4 h-4 text-orange-400" />
                          <span className="text-sm">{area}</span>
            </div>
                      ))}
                      {[
                        scores.smart < 90,
                        scores.motivated < 90, 
                        scores.integrity < 90,
                        scores.business < 90,
                        choices.filter(c => c.type === 'NIGHTMARE').length >= 3,
                        choices.filter(c => c.type === 'BRONZE').length >= 4
                      ].filter(Boolean).length === 0 && (
                        <div className="text-gray-400 text-sm">Strong performance across all competencies</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Decision Pattern */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Your Decision Pattern</CardTitle>
                  </CardHeader>
                  <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {choices.filter(c => c.type === 'PLATINUM').length}
                  </div>
                  <div className="text-sm text-yellow-300">Platinum Choices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    {choices.filter(c => c.type === 'GOLD').length}
                  </div>
                  <div className="text-sm text-yellow-400">Gold Choices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">
                    {choices.filter(c => c.type === 'BRONZE').length}
                  </div>
                  <div className="text-sm text-gray-300">Bronze Choices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {choices.filter(c => c.type === 'NIGHTMARE').length}
                  </div>
                  <div className="text-sm text-red-300">Nightmare Choices</div>
                </div>
              </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="flex gap-4">
                  <Button
                    onClick={() => router.push('/career-tools/games')}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Main Menu
                  </Button>
                  <Button
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: 'My BPOC Ultimate Game Results',
                          text: `I completed the BPOC Ultimate assessment! Smart: ${scores.smart}, Motivated: ${scores.motivated}, Integrity: ${scores.integrity}, Business: ${scores.business}`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(`My BPOC Ultimate Game Results: Smart: ${scores.smart}, Motivated: ${scores.motivated}, Integrity: ${scores.integrity}, Business: ${scores.business}`);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    onClick={resetGame}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </div>
          </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Playing Screen
  const scenario = BPOC_SCENARIOS[currentQuestion];

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <Header />
      
      <div className="pt-16 relative z-10 h-screen">
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
                onClick={handleBackClick}
                className="mr-4 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
                             <div className="flex items-center">
                 <Crown className="h-8 w-8 text-green-400 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold gradient-text">BPOC Ultimate</h1>
                  <p className="text-gray-400 text-sm">The Complete Candidate Revelation</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Game Layout - Side by Side */}
          <div className="flex gap-4 h-[calc(100vh-140px)]">
            {/* Left Side - Progress and Stats */}
            <div className="w-1/3 space-y-4">
              {/* Real-Time Feedback Metrics - Compact */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2"
              >
                <Card className="glass-card border-green-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-xl font-bold text-green-400">{Math.round(teamMorale)}%</div>
                    <div className="text-xs text-green-300">Team Morale</div>
                  </CardContent>
                </Card>
                <Card className="glass-card border-blue-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-xl font-bold text-blue-400">{Math.round(clientTrust)}%</div>
                    <div className="text-xs text-blue-300">Client Trust</div>
                  </CardContent>
                </Card>
                <Card className="glass-card border-purple-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-xl font-bold text-purple-400">{Math.round(businessImpact)}%</div>
                    <div className="text-xs text-purple-300">Business Impact</div>
                  </CardContent>
                </Card>
                <Card className="glass-card border-orange-500/20">
                  <CardContent className="p-3 text-center">
                    <div className="text-xl font-bold text-orange-400">{Math.round(crisisPressure)}%</div>
                    <div className="text-xs text-orange-300">Crisis Pressure</div>
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
                      <div className="text-gray-300 text-sm">Scenario {currentQuestion + 1} of {BPOC_SCENARIOS.length}</div>
                      <div className="text-white font-bold text-lg">
                        {Math.round((currentQuestion / BPOC_SCENARIOS.length) * 100)}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700 overflow-hidden relative">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentQuestion / BPOC_SCENARIOS.length) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              
            </div>

            {/* Right Side - Main Game Content */}
            <div className="w-2/3">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <Card className="glass-card border-white/10 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Scenario Header */}
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold gradient-text mb-2">{scenario.title}</h2>
                      <p className="text-sm text-gray-300">{scenario.visual}</p>
                    </div>

                    {/* Scenario Description */}
                    <div className="mb-2 flex-1">
                      <p className="text-lg text-gray-200 mb-2">{scenario.scene}</p>
                      <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-2">
                        <p className="text-red-100 font-semibold text-sm">{scenario.problem}</p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-center mb-1 text-white">How do you respond?</h3>
                      {scenario.choices.map((choice, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleChoice(choice)}
                          disabled={selectedChoice !== null}
                          className={`w-full glass-card border-white/10 hover:border-blue-500/50 rounded-lg p-3 text-left transition-all ${
                            selectedChoice === choice.id 
                              ? 'bg-gradient-to-r from-green-600 to-green-500 border-green-400 shadow-green-500/25' 
                              : ''
                          }`}
                          whileHover={{ scale: selectedChoice === null ? 1.02 : 1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-base text-white">{choice.text}</div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Reaction Popup */}
      {showReaction && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card border-white/20 shadow-xl">
              <CardContent className="p-6 text-center">
                <p className="text-xl font-semibold text-white">{showReaction}</p>
              </CardContent>
            </Card>
        </motion.div>
        </motion.div>
      )}

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="glass-card border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Leave BPOC Ultimate?</AlertDialogTitle>
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
  );
}