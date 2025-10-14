'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  ArrowLeft,
  Play,
  Trophy,
  Users,
  Zap,
  Brain,
  Target,
  Star,
  Award,
  Brain as BrainIcon,
  Users as TeamIcon,
  Target as TargetIcon,
  CheckCircle,
  X,
  BarChart3,
  Share
} from 'lucide-react';

interface AssessmentStats {
  score: number;
  judgment: number;
  culturalFit: number;
  confidence: number;
  outcome: number;
  currentQuestion: number;
  totalQuestions: number;
  streak: number;
  bestStreak: number;
  teamOpinion: number;
  isCompleted: boolean;
  unlockedBadges: string[];
}

interface Scenario {
  id: string;
  title: string;
  scenario: string;
  question: string;
  choices: {
    id: string;
    text: string;
    judgment: number;
    culturalFit: number;
    confidence: number;
    outcome: number;
    teamOpinion: number;
    reaction: string;
    feedback: string;
    color: 'green' | 'blue' | 'red' | 'yellow';
  }[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function WorkplaceJudgmentAssessment() {
  const router = useRouter();
  const [assessmentState, setAssessmentState] = useState<'playing' | 'finished'>('playing');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [hasMadeChoices, setHasMadeChoices] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);
  const [assessmentStats, setAssessmentStats] = useState<AssessmentStats>({
    score: 0,
    judgment: 50,
    culturalFit: 50,
    confidence: 50,
    outcome: 50,
    currentQuestion: 0,
    totalQuestions: 20,
    streak: 0,
    bestStreak: 0,
    teamOpinion: 50,
    isCompleted: false,
    unlockedBadges: []
  });

  const scenarios: Scenario[] = [
    {
      id: 'food-scenario',
      title: 'Can I Take the Food?',
      scenario: `Lunch is provided at work. You notice many leftovers. You're tempted to take some home. Your team lead sees you eyeing it and says, "Big lunch today, huh?"`,
      question: 'What do you do?',
      choices: [
        {
          id: 'ask-politely',
          text: 'Casually ask if it\'s okay to pack some for later.',
          judgment: 8,
          culturalFit: 6,
          confidence: 3,
          outcome: 6,
          teamOpinion: 3,
          reaction: 'Your team lead appreciates your politeness and says, "Of course! Better than wasting it."',
          feedback: 'Good approach! You showed respect and proper workplace etiquette.',
          color: 'blue'
        },
        {
          id: 'sneak-food',
          text: 'Quietly sneak a container of food into your bag.',
          judgment: -12,
          culturalFit: -8,
          confidence: -6,
          outcome: -8,
          teamOpinion: -12,
          reaction: 'Your team lead notices and gives you a disapproving look. Awkward silence follows.',
          feedback: 'This creates trust issues and shows poor judgment in workplace boundaries.',
          color: 'red'
        },
        {
          id: 'tone-deaf',
          text: 'Say, "Yes! Love free lunch!" and walk off.',
          judgment: -6,
          culturalFit: -3,
          confidence: 0,
          outcome: -3,
          teamOpinion: -6,
          reaction: 'Your team lead raises an eyebrow. Others exchange glances.',
          feedback: 'Your response was too casual and didn\'t show proper workplace professionalism.',
          color: 'yellow'
        },
        {
          id: 'wait-offer',
          text: 'Clean up and wait to be offered leftovers.',
          judgment: 12,
          culturalFit: 8,
          confidence: 6,
          outcome: 8,
          teamOpinion: 8,
          reaction: 'Your team lead offers you the leftovers and praises your patience.',
          feedback: 'Excellent judgment! You demonstrated patience and proper workplace etiquette.',
          color: 'green'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'meeting-interruption',
      title: 'Meeting Interruption',
      scenario: `During a client presentation, your colleague is struggling with their section. The client looks confused and your manager is getting nervous.`,
      question: 'How do you handle this situation?',
      choices: [
        {
          id: 'step-in-help',
          text: 'Step in and help your colleague by adding clarifying points.',
          judgment: 10,
          culturalFit: 6,
          confidence: 8,
          outcome: 8,
          teamOpinion: 6,
          reaction: 'Your colleague is grateful, the client understands better, and your manager is impressed.',
          feedback: 'Great teamwork! You showed leadership while supporting your colleague.',
          color: 'green'
        },
        {
          id: 'let-struggle',
          text: 'Let your colleague figure it out on their own.',
          judgment: -10,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -15,
          reaction: 'The presentation continues poorly. Your colleague looks embarrassed.',
          feedback: 'This shows lack of team support and could damage client relationships.',
          color: 'red'
        },
        {
          id: 'take-over',
          text: 'Take over the entire presentation immediately.',
          judgment: 0,
          culturalFit: -5,
          confidence: 10,
          outcome: 5,
          teamOpinion: -10,
          reaction: 'The presentation improves, but your colleague feels undermined.',
          feedback: 'You solved the immediate problem but damaged team relationships.',
          color: 'yellow'
        },
        {
          id: 'whisper-suggestions',
          text: 'Whisper suggestions to your colleague discreetly.',
          judgment: 10,
          culturalFit: 15,
          confidence: 5,
          outcome: 10,
          teamOpinion: 15,
          reaction: 'Your colleague follows your suggestions and the presentation goes smoothly.',
          feedback: 'Perfect balance! You helped without undermining your colleague.',
          color: 'blue'
        }
      ],
      difficulty: 'hard'
    },
    {
      id: 'email-mistake',
      title: 'Email Mistake',
      scenario: `You accidentally sent a confidential email to the wrong person. The recipient hasn't opened it yet, but you're worried about the potential breach.`,
      question: 'What should you do?',
      choices: [
        {
          id: 'ignore-it',
          text: 'Hope they don\'t open it and keep quiet.',
          judgment: -15,
          culturalFit: -10,
          confidence: -5,
          outcome: -20,
          teamOpinion: -15,
          reaction: 'The recipient opens the email and reports it to your manager. You face disciplinary action.',
          feedback: 'This shows poor judgment and lack of accountability.',
          color: 'red'
        },
        {
          id: 'contact-recipient',
          text: 'Contact the recipient immediately and ask them to delete it.',
          judgment: 10,
          culturalFit: 5,
          confidence: 10,
          outcome: 5,
          teamOpinion: 5,
          reaction: 'The recipient is understanding and deletes the email. Crisis averted.',
          feedback: 'Good immediate response, but should also inform your manager.',
          color: 'yellow'
        },
        {
          id: 'notify-manager',
          text: 'Immediately notify your manager and IT department.',
          judgment: 20,
          culturalFit: 15,
          confidence: 15,
          outcome: 20,
          teamOpinion: 20,
          reaction: 'Your manager appreciates your honesty and helps resolve the situation professionally.',
          feedback: 'Excellent judgment! You showed accountability and followed proper protocols.',
          color: 'green'
        },
        {
          id: 'retract-email',
          text: 'Try to retract the email using your email client.',
          judgment: 5,
          culturalFit: 0,
          confidence: 5,
          outcome: 0,
          teamOpinion: 0,
          reaction: 'The retraction doesn\'t work, and you waste valuable time.',
          feedback: 'Good attempt, but should have notified management immediately.',
          color: 'blue'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'colleague-complaint',
      title: 'Colleague Complaint',
      scenario: `A colleague confides in you that they're planning to quit because they're unhappy with the company. They ask you to keep it confidential.`,
      question: 'How do you respond?',
      choices: [
        {
          id: 'keep-secret',
          text: 'Promise to keep it completely confidential and not tell anyone.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'Your colleague quits suddenly, leaving the team unprepared and management surprised.',
          feedback: 'While loyalty is good, sudden departures can hurt the team.',
          color: 'yellow'
        },
        {
          id: 'encourage-stay',
          text: 'Try to convince them to stay and work through their issues.',
          judgment: 10,
          culturalFit: 10,
          confidence: 5,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'Your colleague appreciates your support and decides to address their concerns.',
          feedback: 'Good approach! You showed care for both the colleague and the team.',
          color: 'blue'
        },
        {
          id: 'suggest-hr',
          text: 'Suggest they talk to HR about their concerns before making a decision.',
          judgment: 15,
          culturalFit: 15,
          confidence: 10,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your colleague follows your advice and finds a solution through HR.',
          feedback: 'Excellent guidance! You directed them to the right resources.',
          color: 'green'
        },
        {
          id: 'tell-manager',
          text: 'Tell your manager immediately to prepare for their departure.',
          judgment: -10,
          culturalFit: -15,
          confidence: -10,
          outcome: -15,
          teamOpinion: -20,
          reaction: 'Your colleague feels betrayed and quits immediately.',
          feedback: 'This breaks trust and could damage your relationship.',
          color: 'red'
        }
      ],
      difficulty: 'hard'
    },
    {
      id: 'client-request',
      title: 'Client Request',
      scenario: `A client asks you to complete a task that's outside your scope of work. They're a valuable client, but this request would take significant time.`,
      question: 'What do you do?',
      choices: [
        {
          id: 'do-it',
          text: 'Complete the task to maintain the client relationship.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -10,
          reaction: 'You fall behind on your regular work and your manager is concerned.',
          feedback: 'This sets a bad precedent and affects your core responsibilities.',
          color: 'red'
        },
        {
          id: 'decline-politely',
          text: 'Politely decline and explain it\'s outside your scope.',
          judgment: 10,
          culturalFit: 10,
          confidence: 10,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'The client understands and appreciates your honesty.',
          feedback: 'Good boundary setting! You maintained professionalism.',
          color: 'green'
        },
        {
          id: 'suggest-alternative',
          text: 'Suggest an alternative solution or refer them to the right person.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'The client is grateful for your helpful guidance.',
          feedback: 'Excellent approach! You provided value while staying within scope.',
          color: 'blue'
        },
        {
          id: 'ask-manager',
          text: 'Ask your manager for guidance on how to handle this request.',
          judgment: 5,
          culturalFit: 5,
          confidence: 5,
          outcome: 5,
          teamOpinion: 5,
          reaction: 'Your manager provides guidance on handling similar requests.',
          feedback: 'Good to seek guidance, but you could have been more proactive.',
          color: 'yellow'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'team-conflict',
      title: 'Team Conflict',
      scenario: `Two team members are having a disagreement that's affecting team productivity. They both come to you separately to complain about each other.`,
      question: 'How do you handle this situation?',
      choices: [
        {
          id: 'stay-neutral',
          text: 'Stay neutral and let them work it out themselves.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -10,
          reaction: 'The conflict escalates and affects the entire team\'s performance.',
          feedback: 'Avoiding conflict often makes it worse.',
          color: 'red'
        },
        {
          id: 'mediate-directly',
          text: 'Bring them together and mediate the discussion directly.',
          judgment: 10,
          culturalFit: 10,
          confidence: 10,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'They appreciate your intervention and resolve their differences.',
          feedback: 'Good initiative! You helped facilitate a resolution.',
          color: 'green'
        },
        {
          id: 'involve-hr',
          text: 'Involve HR to handle the conflict professionally.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'HR provides professional mediation and the conflict is resolved properly.',
          feedback: 'Excellent judgment! You used the right resources for conflict resolution.',
          color: 'blue'
        },
        {
          id: 'take-sides',
          text: 'Take sides based on who you think is right.',
          judgment: -15,
          culturalFit: -10,
          confidence: -10,
          outcome: -15,
          teamOpinion: -20,
          reaction: 'The conflict worsens and you lose trust with one team member.',
          feedback: 'Taking sides in conflicts is rarely helpful.',
          color: 'yellow'
        }
      ],
      difficulty: 'hard'
    },
    {
      id: 'deadline-pressure',
      title: 'Deadline Pressure',
      scenario: `Your manager gives you an urgent task with a tight deadline. You're already working on other important projects.`,
      question: 'What do you do?',
      choices: [
        {
          id: 'work-overtime',
          text: 'Work overtime to complete everything without complaining.',
          judgment: 5,
          culturalFit: 5,
          confidence: 5,
          outcome: 5,
          teamOpinion: 5,
          reaction: 'You complete the task but are exhausted and stressed.',
          feedback: 'Good work ethic, but this isn\'t sustainable long-term.',
          color: 'yellow'
        },
        {
          id: 'prioritize-discuss',
          text: 'Discuss priorities with your manager and ask for guidance.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your manager appreciates your communication and helps prioritize.',
          feedback: 'Excellent approach! You showed professionalism and communication skills.',
          color: 'green'
        },
        {
          id: 'delegate-tasks',
          text: 'Ask if you can delegate some of your current tasks to others.',
          judgment: 10,
          culturalFit: 10,
          confidence: 10,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'Your manager helps you redistribute work effectively.',
          feedback: 'Good resource management! You found a practical solution.',
          color: 'blue'
        },
        {
          id: 'refuse-task',
          text: 'Tell your manager you can\'t take on additional work.',
          judgment: -10,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -10,
          reaction: 'Your manager is disappointed and questions your flexibility.',
          feedback: 'This shows poor adaptability and teamwork.',
          color: 'red'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'social-media',
      title: 'Social Media Post',
      scenario: `You see a colleague post something negative about the company on social media. It's not very damaging, but it's unprofessional.`,
      question: 'How do you respond?',
      choices: [
        {
          id: 'ignore-it',
          text: 'Ignore it - it\'s their personal social media account.',
          judgment: 0,
          culturalFit: 0,
          confidence: 0,
          outcome: 0,
          teamOpinion: 0,
          reaction: 'The post remains online and could potentially be seen by clients.',
          feedback: 'While it\'s personal, it could reflect poorly on the company.',
          color: 'yellow'
        },
        {
          id: 'report-hr',
          text: 'Report it to HR immediately.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -5,
          teamOpinion: -10,
          reaction: 'Your colleague is disciplined and resents you for reporting them.',
          feedback: 'This could damage your relationship and create tension.',
          color: 'red'
        },
        {
          id: 'talk-privately',
          text: 'Talk to your colleague privately about the post.',
          judgment: 15,
          culturalFit: 15,
          confidence: 10,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your colleague appreciates your concern and removes the post.',
          feedback: 'Excellent approach! You handled it professionally and privately.',
          color: 'green'
        },
        {
          id: 'comment-publicly',
          text: 'Comment on the post asking them to take it down.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -10,
          teamOpinion: -15,
          reaction: 'Your colleague is embarrassed and the situation becomes public.',
          feedback: 'This makes the situation worse by making it public.',
          color: 'yellow'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'promotion-opportunity',
      title: 'Promotion Opportunity',
      scenario: `A promotion opportunity opens up in your department. You're interested, but so is a colleague who has been with the company longer.`,
      question: 'What do you do?',
      choices: [
        {
          id: 'apply-anyway',
          text: 'Apply for the position and compete fairly.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'You demonstrate confidence and ambition while being respectful.',
          feedback: 'Excellent approach! You showed confidence and professionalism.',
          color: 'green'
        },
        {
          id: 'step-aside',
          text: 'Step aside and let your colleague have the opportunity.',
          judgment: -5,
          culturalFit: -5,
          confidence: -10,
          outcome: -5,
          teamOpinion: -5,
          reaction: 'Your manager questions your ambition and confidence.',
          feedback: 'This shows lack of confidence and could hurt your career.',
          color: 'red'
        },
        {
          id: 'discuss-colleague',
          text: 'Discuss it with your colleague first before applying.',
          judgment: 10,
          culturalFit: 15,
          confidence: 10,
          outcome: 10,
          teamOpinion: 15,
          reaction: 'Your colleague appreciates your transparency and mutual respect.',
          feedback: 'Good communication! You showed respect and transparency.',
          color: 'blue'
        },
        {
          id: 'undermine-colleague',
          text: 'Try to undermine your colleague\'s chances.',
          judgment: -20,
          culturalFit: -15,
          confidence: -10,
          outcome: -15,
          teamOpinion: -20,
          reaction: 'Your actions are discovered and you lose trust with the team.',
          feedback: 'This is unethical and damages team relationships.',
          color: 'red'
        }
      ],
      difficulty: 'hard'
    },
    {
      id: 'client-feedback',
      title: 'Client Feedback',
      scenario: `A client gives you negative feedback about a project you worked on. The feedback is harsh but contains some valid points.`,
      question: 'How do you respond?',
      choices: [
        {
          id: 'defend-work',
          text: 'Defend your work and explain why the feedback is wrong.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -15,
          teamOpinion: -10,
          reaction: 'The client becomes more frustrated and the relationship deteriorates.',
          feedback: 'This shows poor customer service and defensiveness.',
          color: 'red'
        },
        {
          id: 'ignore-feedback',
          text: 'Thank them politely but ignore the feedback.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'The client feels unheard and may not work with you again.',
          feedback: 'This shows lack of professionalism and growth mindset.',
          color: 'yellow'
        },
        {
          id: 'acknowledge-improve',
          text: 'Acknowledge the feedback and ask how you can improve.',
          judgment: 15,
          culturalFit: 15,
          confidence: 10,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'The client appreciates your openness and provides constructive suggestions.',
          feedback: 'Excellent approach! You showed professionalism and growth mindset.',
          color: 'green'
        },
        {
          id: 'blame-others',
          text: 'Blame other team members or external factors.',
          judgment: -15,
          culturalFit: -15,
          confidence: -10,
          outcome: -20,
          teamOpinion: -20,
          reaction: 'The client loses confidence in your team and the project.',
          feedback: 'This shows poor accountability and damages team trust.',
          color: 'red'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'workplace-gossip',
      title: 'Workplace Gossip',
      scenario: `You overhear colleagues gossiping about another team member. They're spreading rumors that could damage that person's reputation.`,
      question: 'What do you do?',
      choices: [
        {
          id: 'join-gossip',
          text: 'Join in the conversation and add your own observations.',
          judgment: -15,
          culturalFit: -15,
          confidence: -10,
          outcome: -20,
          teamOpinion: -20,
          reaction: 'The gossip spreads further and damages team morale.',
          feedback: 'This contributes to a toxic workplace culture.',
          color: 'red'
        },
        {
          id: 'ignore-gossip',
          text: 'Ignore it and walk away without saying anything.',
          judgment: 0,
          culturalFit: 0,
          confidence: 0,
          outcome: 0,
          teamOpinion: 0,
          reaction: 'The gossip continues and affects the targeted colleague.',
          feedback: 'While you didn\'t participate, you didn\'t help stop it either.',
          color: 'yellow'
        },
        {
          id: 'defend-colleague',
          text: 'Defend the colleague and ask them to stop spreading rumors.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your colleagues respect your integrity and the gossip stops.',
          feedback: 'Excellent leadership! You stood up for what\'s right.',
          color: 'green'
        },
        {
          id: 'report-hr',
          text: 'Report the gossip to HR immediately.',
          judgment: 10,
          culturalFit: 10,
          confidence: 10,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'HR addresses the situation but your colleagues may resent you.',
          feedback: 'Good to report, but could have tried addressing it directly first.',
          color: 'blue'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'technology-issue',
      title: 'Technology Issue',
      scenario: `Your computer crashes during an important client presentation. You have a backup plan, but it's not as polished as your original presentation.`,
      question: 'How do you handle this?',
      choices: [
        {
          id: 'panic-blame',
          text: 'Panic and blame IT for the technical issues.',
          judgment: -10,
          culturalFit: -10,
          confidence: -15,
          outcome: -15,
          teamOpinion: -10,
          reaction: 'The client loses confidence in your professionalism.',
          feedback: 'This shows poor problem-solving and unprofessional behavior.',
          color: 'red'
        },
        {
          id: 'apologize-excuse',
          text: 'Apologize profusely and ask to reschedule.',
          judgment: 5,
          culturalFit: 5,
          confidence: 0,
          outcome: 5,
          teamOpinion: 5,
          reaction: 'The client appreciates your honesty but is disappointed.',
          feedback: 'Good to apologize, but should try to adapt and continue.',
          color: 'yellow'
        },
        {
          id: 'adapt-continue',
          text: 'Adapt quickly and continue with your backup plan confidently.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'The client is impressed by your adaptability and professionalism.',
          feedback: 'Excellent problem-solving! You showed resilience and professionalism.',
          color: 'green'
        },
        {
          id: 'fake-it',
          text: 'Try to fake your way through without admitting the technical issue.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'The client notices something is wrong and loses trust.',
          feedback: 'This shows dishonesty and poor judgment.',
          color: 'red'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'work-life-balance',
      title: 'Work-Life Balance',
      scenario: `Your manager expects you to work late regularly, but you have family commitments. Other team members seem to work longer hours.`,
      question: 'What do you do?',
      choices: [
        {
          id: 'work-late',
          text: 'Work late to match your colleagues and avoid conflict.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'Your family life suffers and you become stressed and resentful.',
          feedback: 'This creates an unhealthy work-life balance.',
          color: 'red'
        },
        {
          id: 'discuss-boundaries',
          text: 'Have an honest discussion with your manager about boundaries.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your manager appreciates your communication and finds a solution.',
          feedback: 'Excellent approach! You showed professionalism and self-advocacy.',
          color: 'green'
        },
        {
          id: 'quit-job',
          text: 'Start looking for a new job with better work-life balance.',
          judgment: 5,
          culturalFit: 5,
          confidence: 5,
          outcome: 5,
          teamOpinion: 5,
          reaction: 'You find a better opportunity but leave without trying to resolve the issue.',
          feedback: 'Good to prioritize your needs, but could have tried to address it first.',
          color: 'yellow'
        },
        {
          id: 'complain-colleagues',
          text: 'Complain to your colleagues about the unfair expectations.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -10,
          teamOpinion: -10,
          reaction: 'Your complaints create negativity and don\'t solve the problem.',
          feedback: 'This creates a negative work environment.',
          color: 'red'
        }
      ],
      difficulty: 'hard'
    },
    {
      id: 'client-gift',
      title: 'Client Gift',
      scenario: `A client sends you an expensive gift as a thank you for your work. Your company has a policy about accepting gifts from clients.`,
      question: 'What do you do?',
      choices: [
        {
          id: 'accept-gift',
          text: 'Accept the gift gratefully and keep it.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -15,
          teamOpinion: -10,
          reaction: 'You violate company policy and could face disciplinary action.',
          feedback: 'This shows poor judgment and disregard for company policies.',
          color: 'red'
        },
        {
          id: 'decline-politely',
          text: 'Politely decline and explain the company policy.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'The client understands and respects your professionalism.',
          feedback: 'Excellent judgment! You maintained integrity and professionalism.',
          color: 'green'
        },
        {
          id: 'ask-manager',
          text: 'Ask your manager for guidance on how to handle the gift.',
          judgment: 10,
          culturalFit: 10,
          confidence: 10,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'Your manager provides guidance and you handle it appropriately.',
          feedback: 'Good to seek guidance, but you could have known the policy.',
          color: 'blue'
        },
        {
          id: 'share-team',
          text: 'Accept the gift and share it with the entire team.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'You still violate policy and involve others in the violation.',
          feedback: 'This doesn\'t solve the policy violation issue.',
          color: 'yellow'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'colleague-mistake',
      title: 'Colleague Mistake',
      scenario: `You discover that a colleague made a significant error in their work that could affect a client project. They don't know you've noticed it.`,
      question: 'How do you handle this?',
      choices: [
        {
          id: 'ignore-mistake',
          text: 'Ignore it - it\'s not your responsibility.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -15,
          teamOpinion: -10,
          reaction: 'The error is discovered later and causes problems for the client.',
          feedback: 'This shows poor teamwork and lack of accountability.',
          color: 'red'
        },
        {
          id: 'report-immediately',
          text: 'Report it to your manager immediately.',
          judgment: 10,
          culturalFit: 10,
          confidence: 10,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'The issue is addressed but your colleague may feel betrayed.',
          feedback: 'Good to address the issue, but could have talked to them first.',
          color: 'yellow'
        },
        {
          id: 'talk-privately',
          text: 'Talk to your colleague privately about the error.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your colleague appreciates your help and fixes the error.',
          feedback: 'Excellent approach! You showed teamwork and professionalism.',
          color: 'green'
        },
        {
          id: 'blame-publicly',
          text: 'Point out the error in a team meeting.',
          judgment: -15,
          culturalFit: -15,
          confidence: -10,
          outcome: -20,
          teamOpinion: -20,
          reaction: 'Your colleague is embarrassed and the team atmosphere becomes tense.',
          feedback: 'This creates unnecessary conflict and damages relationships.',
          color: 'red'
        }
      ],
      difficulty: 'hard'
    },
    {
      id: 'remote-work',
      title: 'Remote Work Request',
      scenario: `You want to request working from home one day a week, but your manager has been resistant to remote work in the past.`,
      question: 'How do you approach this?',
      choices: [
        {
          id: 'demand-remote',
          text: 'Tell your manager you need to work from home and that\'s final.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -15,
          teamOpinion: -10,
          reaction: 'Your manager is offended and denies your request.',
          feedback: 'This shows poor communication and lack of respect.',
          color: 'red'
        },
        {
          id: 'propose-benefits',
          text: 'Propose a trial period and explain the benefits to the team.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your manager appreciates your thoughtful approach and agrees to a trial.',
          feedback: 'Excellent approach! You showed professionalism and preparation.',
          color: 'green'
        },
        {
          id: 'ask-colleagues',
          text: 'Ask your colleagues to support your request first.',
          judgment: 5,
          culturalFit: 5,
          confidence: 5,
          outcome: 5,
          teamOpinion: 5,
          reaction: 'Your colleagues support you, but your manager still needs convincing.',
          feedback: 'Good to build support, but should focus on the business case.',
          color: 'yellow'
        },
        {
          id: 'threaten-quit',
          text: 'Threaten to look for another job if the request is denied.',
          judgment: -15,
          culturalFit: -15,
          confidence: -10,
          outcome: -20,
          teamOpinion: -20,
          reaction: 'Your manager feels pressured and may question your commitment.',
          feedback: 'This shows poor judgment and creates unnecessary conflict.',
          color: 'red'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'team-celebration',
      title: 'Team Celebration',
      scenario: `Your team successfully completes a major project. Your manager suggests celebrating with alcohol, but you know some team members don't drink.`,
      question: 'What do you do?',
      choices: [
        {
          id: 'go-along',
          text: 'Go along with the alcohol-focused celebration.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'Some team members feel excluded and uncomfortable.',
          feedback: 'This shows lack of consideration for diverse team needs.',
          color: 'red'
        },
        {
          id: 'suggest-alternative',
          text: 'Suggest an inclusive celebration that accommodates everyone.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Everyone feels included and the celebration is successful.',
          feedback: 'Excellent approach! You showed inclusivity and consideration.',
          color: 'green'
        },
        {
          id: 'skip-celebration',
          text: 'Skip the celebration to avoid the alcohol issue.',
          judgment: 0,
          culturalFit: 0,
          confidence: 0,
          outcome: 0,
          teamOpinion: 0,
          reaction: 'You miss out on team bonding and recognition.',
          feedback: 'This avoids the issue but doesn\'t solve it.',
          color: 'yellow'
        },
        {
          id: 'complain-privately',
          text: 'Complain privately to other team members about the situation.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -10,
          teamOpinion: -10,
          reaction: 'Your complaints create negativity but don\'t solve the problem.',
          feedback: 'This creates a negative atmosphere without addressing the issue.',
          color: 'red'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'career-advice',
      title: 'Career Advice',
      scenario: `A junior colleague asks you for career advice. They're considering leaving the company because they feel stuck in their current role.`,
      question: 'How do you respond?',
      choices: [
        {
          id: 'encourage-leave',
          text: 'Encourage them to leave and find better opportunities elsewhere.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'They leave the company and you lose a valuable team member.',
          feedback: 'This doesn\'t help the company or the colleague\'s long-term growth.',
          color: 'red'
        },
        {
          id: 'discuss-options',
          text: 'Discuss internal opportunities and growth possibilities.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'They explore internal opportunities and find a better role within the company.',
          feedback: 'Excellent guidance! You helped retain talent and support growth.',
          color: 'green'
        },
        {
          id: 'refer-hr',
          text: 'Refer them to HR for career development resources.',
          judgment: 10,
          culturalFit: 10,
          confidence: 10,
          outcome: 10,
          teamOpinion: 10,
          reaction: 'HR provides professional guidance and career development support.',
          feedback: 'Good to refer to experts, but could have provided more direct support.',
          color: 'blue'
        },
        {
          id: 'discourage-change',
          text: 'Discourage them from making any changes and encourage them to stay put.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -10,
          teamOpinion: -10,
          reaction: 'They feel unheard and may leave anyway, but with resentment.',
          feedback: 'This shows lack of support for their career growth.',
          color: 'red'
        }
      ],
      difficulty: 'hard'
    },
    {
      id: 'client-complaint',
      title: 'Client Complaint',
      scenario: `A client complains about the quality of work delivered by your team. The complaint is valid, but you weren't directly involved in the project.`,
      question: 'How do you respond?',
      choices: [
        {
          id: 'deflect-blame',
          text: 'Explain that you weren\'t involved and it\'s not your responsibility.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -15,
          teamOpinion: -10,
          reaction: 'The client feels you don\'t care about their concerns.',
          feedback: 'This shows poor customer service and lack of team ownership.',
          color: 'red'
        },
        {
          id: 'acknowledge-help',
          text: 'Acknowledge the issue and offer to help resolve it.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'The client appreciates your professionalism and the issue gets resolved.',
          feedback: 'Excellent approach! You showed customer focus and teamwork.',
          color: 'green'
        },
        {
          id: 'blame-team',
          text: 'Blame the specific team members who worked on the project.',
          judgment: -15,
          culturalFit: -15,
          confidence: -10,
          outcome: -20,
          teamOpinion: -20,
          reaction: 'The client loses confidence in your entire team.',
          feedback: 'This damages team relationships and client trust.',
          color: 'red'
        },
        {
          id: 'minimize-issue',
          text: 'Minimize the issue and suggest it\'s not as bad as they think.',
          judgment: -5,
          culturalFit: -5,
          confidence: -5,
          outcome: -10,
          teamOpinion: -5,
          reaction: 'The client feels unheard and becomes more frustrated.',
          feedback: 'This shows poor customer service and lack of empathy.',
          color: 'yellow'
        }
      ],
      difficulty: 'medium'
    },
    {
      id: 'workplace-friendship',
      title: 'Workplace Friendship',
      scenario: `You become close friends with a colleague, but they start asking you for favors at work that could compromise your professional judgment.`,
      question: 'How do you handle this?',
      choices: [
        {
          id: 'do-favors',
          text: 'Do the favors to maintain the friendship.',
          judgment: -15,
          culturalFit: -15,
          confidence: -10,
          outcome: -20,
          teamOpinion: -15,
          reaction: 'Your professional integrity is compromised and others notice.',
          feedback: 'This shows poor judgment and could damage your career.',
          color: 'red'
        },
        {
          id: 'set-boundaries',
          text: 'Set clear boundaries while maintaining the friendship.',
          judgment: 15,
          culturalFit: 15,
          confidence: 15,
          outcome: 15,
          teamOpinion: 15,
          reaction: 'Your friend understands and respects your professional boundaries.',
          feedback: 'Excellent approach! You maintained both friendship and professionalism.',
          color: 'green'
        },
        {
          id: 'end-friendship',
          text: 'End the friendship to avoid any conflicts of interest.',
          judgment: 5,
          culturalFit: 5,
          confidence: 5,
          outcome: 5,
          teamOpinion: 5,
          reaction: 'You avoid conflicts but lose a valuable friendship.',
          feedback: 'This is a bit extreme - could have tried setting boundaries first.',
          color: 'yellow'
        },
        {
          id: 'complain-others',
          text: 'Complain to other colleagues about the situation.',
          judgment: -10,
          culturalFit: -10,
          confidence: -5,
          outcome: -10,
          teamOpinion: -10,
          reaction: 'The situation becomes public and creates workplace drama.',
          feedback: 'This creates unnecessary conflict and damages relationships.',
          color: 'red'
        }
      ],
      difficulty: 'hard'
    }
  ];

  // Initialize assessment on component mount
  useEffect(() => {
    if (assessmentState === 'playing' && !currentScenario) {
      const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
      setShuffledScenarios(shuffled);
      setCurrentScenario(shuffled[0]);
      setAssessmentStats(prev => ({
        ...prev,
        currentQuestion: 0,
        totalQuestions: shuffled.length
      }));
    }
  }, [assessmentState, currentScenario]);

  const handleChoice = (choiceId: string) => {
    if (!currentScenario) return;

    const choice = currentScenario.choices.find(c => c.id === choiceId);
    if (!choice) return;

    setUserChoice(choiceId);
    setHasMadeChoices(true);
    
    setAssessmentStats(prev => {
      const newStreak = choice.outcome > 0 ? prev.streak + 1 : 0;
      
      return {
        ...prev,
        judgment: Math.max(0, Math.min(100, prev.judgment + choice.judgment)),
        culturalFit: Math.max(0, Math.min(100, prev.culturalFit + choice.culturalFit)),
        confidence: Math.max(0, Math.min(100, prev.confidence + choice.confidence)),
        outcome: Math.max(0, Math.min(100, prev.outcome + choice.outcome)),
        teamOpinion: Math.max(0, Math.min(100, prev.teamOpinion + choice.teamOpinion)),
        score: prev.score + (choice.judgment + choice.culturalFit + choice.confidence + choice.outcome),
        currentQuestion: prev.currentQuestion + 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        isCompleted: prev.currentQuestion + 1 >= shuffledScenarios.length,
        unlockedBadges: []
      };
    });
  };

  const nextScenario = () => {
    setUserChoice(null);
    
    const nextIndex = assessmentStats.currentQuestion;
    if (nextIndex < shuffledScenarios.length) {
      setCurrentScenario(shuffledScenarios[nextIndex]);
    } else {
      setAssessmentState('finished');
    }
  };

  const finishAssessment = () => {
    setAssessmentState('finished');
  };

  const restartAssessment = () => {
    setAssessmentState('playing');
    setCurrentScenario(null);
    setUserChoice(null);
    setHasMadeChoices(false);
    setAssessmentStats({
      score: 0,
      judgment: 50,
      culturalFit: 50,
      confidence: 50,
      outcome: 50,
      currentQuestion: 0,
      totalQuestions: 20,
      streak: 0,
      bestStreak: 0,
      teamOpinion: 50,
      isCompleted: false,
      unlockedBadges: []
    });
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Master', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (score >= 60) return { level: 'Expert', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    if (score >= 40) return { level: 'Adept', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    return { level: 'Novice', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTeamOpinionFeedback = (score: number) => {
    if (score >= 80) {
      return {
        text: "Highly Trusted",
        description: "Your team sees you as a reliable, supportive colleague who consistently demonstrates excellent judgment and professionalism.",
        color: "text-green-400"
      };
    } else if (score >= 60) {
      return {
        text: "Well Respected",
        description: "Your team appreciates your professional approach and considers you a valuable team member.",
        color: "text-blue-400"
      };
    } else if (score >= 40) {
      return {
        text: "Generally Liked",
        description: "Your team sees you as approachable, though there's room to build stronger professional relationships.",
        color: "text-yellow-400"
      };
    } else if (score >= 20) {
      return {
        text: "Needs Improvement",
        description: "Your team may have concerns about your judgment. Focus on building trust and professional relationships.",
        color: "text-orange-400"
      };
    } else {
      return {
        text: "Trust Issues",
        description: "Your team has significant concerns about your workplace behavior. Consider seeking feedback and improving professional conduct.",
        color: "text-red-400"
      };
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => {
                  if (assessmentState === 'playing' && hasMadeChoices) {
                    setShowExitDialog(true);
                  } else {
                    router.push('/career-tools');
                  }
                }}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <BrainIcon className="h-12 w-12 text-cyan-400 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Workplace Judgment Assessment</h1>
                  <p className="text-gray-400">Advanced scenario-based assessment with team consultation</p>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {assessmentState === 'playing' && currentScenario && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-4xl mx-auto"
              >
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{assessmentStats.currentQuestion + 1}</div>
                        <div className="text-xs text-gray-400">Current Question</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{assessmentStats.streak}</div>
                        <div className="text-xs text-gray-400">Streak</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{Math.round((assessmentStats.currentQuestion / assessmentStats.totalQuestions) * 100)}%</div>
                        <div className="text-xs text-gray-400">Progress</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{assessmentStats.totalQuestions - assessmentStats.currentQuestion - 1}</div>
                        <div className="text-xs text-gray-400">Remaining</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <Card className="glass-card border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">Progress</span>
                        <span className="text-gray-400">{Math.round((assessmentStats.currentQuestion / assessmentStats.totalQuestions) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(assessmentStats.currentQuestion / assessmentStats.totalQuestions) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Question Card */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 rounded-full px-3 py-1">
                        {currentScenario.id.includes('food') || currentScenario.id.includes('client-gift') ? 'Workplace Ethics' :
                         currentScenario.id.includes('meeting') || currentScenario.id.includes('team-conflict') ? 'Team Collaboration' :
                         currentScenario.id.includes('email') || currentScenario.id.includes('social-media') ? 'Professional Communication' :
                         currentScenario.id.includes('colleague') || currentScenario.id.includes('workplace-friendship') ? 'Interpersonal Skills' :
                         currentScenario.id.includes('client') || currentScenario.id.includes('client-feedback') ? 'Client Relations' :
                         currentScenario.id.includes('deadline') || currentScenario.id.includes('technology') ? 'Problem Solving' :
                         currentScenario.id.includes('promotion') || currentScenario.id.includes('career') ? 'Career Development' :
                         currentScenario.id.includes('work-life') || currentScenario.id.includes('team-celebration') ? 'Work-Life Balance' :
                         'Professional Judgment'}
                      </Badge>
                      <span className="text-white font-semibold">
                        Question {assessmentStats.currentQuestion + 1} of {assessmentStats.totalQuestions}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Scenario */}
                    <div 
                      className="bg-white/5 rounded-xl p-6 border border-white/10"
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                    >
                      <h3 className="text-white font-bold text-lg mb-4">Scenario:</h3>
                      <p className="text-gray-300 italic text-lg leading-relaxed">"{currentScenario.scenario}"</p>
                    </div>

                    {/* Question */}
                    <div>
                      <h3 className="text-white font-bold text-xl mb-6">
                        {currentScenario.question}
                      </h3>
                      
                      {/* Answer Choices */}
                      <div className="space-y-3">
                        {currentScenario.choices.map((choice, index) => (
                          <div
                            key={choice.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                              userChoice === choice.id
                                ? 'bg-blue-500/20 border-blue-500/50'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => handleChoice(choice.id)}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                              userChoice === choice.id
                                ? 'border-blue-400 bg-blue-400'
                                : 'border-gray-400'
                            }`}>
                              {userChoice === choice.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <span className={`${userChoice === choice.id ? 'text-blue-300' : 'text-gray-300'}`}>
                                {choice.text}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="outline"
                    disabled={assessmentStats.currentQuestion === 0}
                    className="border-gray-600 text-gray-400 hover:bg-gray-800 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    disabled={!userChoice}
                    onClick={() => {
                      if (userChoice) {
                        if (assessmentStats.currentQuestion + 1 >= shuffledScenarios.length) {
                          setAssessmentState('finished');
                        } else {
                          nextScenario();
                        }
                      }
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white disabled:opacity-50"
                  >
                    {assessmentStats.currentQuestion + 1 >= shuffledScenarios.length ? 'View Results' : 'Next'}
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </motion.div>
            )}

            {assessmentState === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <Trophy className="h-12 w-12 text-yellow-400 mr-4" />
                    <div>
                      <h1 className="text-4xl font-bold gradient-text">Assessment Complete!</h1>
                      <p className="text-gray-400">Here's your advanced performance analysis</p>
                    </div>
                  </div>
                </div>

                {/* Results Card */}
                <Card className="glass-card border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Award className="h-5 w-5 text-yellow-400" />
                      Your Assessment Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                      <h3 className="text-white font-medium mb-2">Overall Performance</h3>
                      <div className={`text-3xl font-bold mb-2 ${getScoreLevel(assessmentStats.score).color}`}>
                        {getScoreLevel(assessmentStats.score).level}
                      </div>
                      <p className="text-gray-400 text-sm">Score: {assessmentStats.score}</p>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-2">Judgment</h4>
                        <div className="text-2xl font-bold text-green-400 mb-2">{assessmentStats.judgment}</div>
                        <Progress value={assessmentStats.judgment} className="h-2" />
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-2">Cultural Fit</h4>
                        <div className="text-2xl font-bold text-blue-400 mb-2">{assessmentStats.culturalFit}</div>
                        <Progress value={assessmentStats.culturalFit} className="h-2" />
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-2">Confidence</h4>
                        <div className="text-2xl font-bold text-purple-400 mb-2">{assessmentStats.confidence}</div>
                        <Progress value={assessmentStats.confidence} className="h-2" />
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-2">Outcome</h4>
                        <div className="text-2xl font-bold text-cyan-400 mb-2">{assessmentStats.outcome}</div>
                        <Progress value={assessmentStats.outcome} className="h-2" />
                      </div>
                    </div>

                    {/* Team Opinion */}
                    <div className="flex justify-center">
                      <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10 w-full max-w-md">
                        <h4 className="text-white font-medium mb-2">Team Opinion</h4>
                        <div className="text-2xl font-bold text-indigo-400 mb-2">{assessmentStats.teamOpinion}</div>
                        <div className={`text-lg font-semibold mb-2 ${getTeamOpinionFeedback(assessmentStats.teamOpinion).color}`}>
                          {getTeamOpinionFeedback(assessmentStats.teamOpinion).text}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {getTeamOpinionFeedback(assessmentStats.teamOpinion).description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => router.push('/career-tools/assessments')}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Main Menu
                  </Button>
                  <Button
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: 'My Workplace Judgment Assessment Results',
                          text: `I achieved ${assessmentStats.score} points with ${getScoreLevel(assessmentStats.score).level} judgment!`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(`My Workplace Judgment Assessment Results: ${assessmentStats.score} points with ${getScoreLevel(assessmentStats.score).level} judgment!`);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={restartAssessment}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Take Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exit Dialog */}
          <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
            <AlertDialogContent className="glass-card border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Leave Workplace Judgment Assessment?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  Are you sure you want to exit? Your progress will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                  Continue Answering
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => router.replace('/career-tools/assessments')}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
                >
                  Exit Assessment
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
} 