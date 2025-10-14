'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Brain,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Target,
  Zap,
  Share,
  RotateCcw,
  Edit
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DISCPersonalityPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [showExitDialog, setShowExitDialog] = useState(false);

  // All questions shuffled to mix DISC categories
  const questions = [
    {
      category: "Dominance",
      scenario: "When faced with a challenging project deadline, you prefer to:",
      options: [
        { text: "Take immediate control and drive results", type: "D" },
        { text: "Encourage team enthusiasm and creativity", type: "I" },
        { text: "Ensure team stability and steady progress", type: "S" },
        { text: "Create detailed plans and quality checkpoints", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "In team meetings, you typically:",
      options: [
        { text: "Focus on getting decisions made quickly", type: "D" },
        { text: "Share ideas enthusiastically and engage others", type: "I" },
        { text: "Listen carefully and support team consensus", type: "S" },
        { text: "Present data and factual analysis", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "When changes are announced at work, you:",
      options: [
        { text: "Immediately look for opportunities to lead the change", type: "D" },
        { text: "Get excited and help others see the positive aspects", type: "I" },
        { text: "Need time to adjust and prefer gradual implementation", type: "S" },
        { text: "Want to understand all details before proceeding", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "When reviewing work quality, you focus on:",
      options: [
        { text: "Meeting targets and achieving results", type: "D" },
        { text: "Recognizing team efforts and celebrating wins", type: "I" },
        { text: "Ensuring consistency and reliability", type: "S" },
        { text: "Accuracy, precision, and following standards", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "In competitive situations, you:",
      options: [
        { text: "Thrive on the challenge and push to win", type: "D" },
        { text: "Use charm and persuasion to gain advantage", type: "I" },
        { text: "Prefer collaborative approaches over competition", type: "S" },
        { text: "Rely on preparation and systematic methods", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "When networking or meeting new people, you:",
      options: [
        { text: "Focus on what they can do for your goals", type: "D" },
        { text: "Enjoy connecting and building relationships naturally", type: "I" },
        { text: "Take time to warm up but are genuinely interested", type: "S" },
        { text: "Prefer structured interactions with clear purposes", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "Your approach to work-life balance is:",
      options: [
        { text: "Work hard, but results matter more than hours", type: "D" },
        { text: "Balance work with social activities and fun", type: "I" },
        { text: "Maintain steady routines and consistent boundaries", type: "S" },
        { text: "Plan and organize to maximize efficiency", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "When given a complex task, you first:",
      options: [
        { text: "Start working immediately to make progress", type: "D" },
        { text: "Discuss it with others to get different perspectives", type: "I" },
        { text: "Ask clarifying questions about expectations", type: "S" },
        { text: "Break it down into detailed steps and timelines", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "Your leadership style is best described as:",
      options: [
        { text: "Direct and results-focused", type: "D" },
        { text: "Inspirational and people-centered", type: "I" },
        { text: "Supportive and team-oriented", type: "S" },
        { text: "Systematic and quality-focused", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "When persuading others, you rely on:",
      options: [
        { text: "Logical arguments and bottom-line benefits", type: "D" },
        { text: "Enthusiasm, stories, and emotional connection", type: "I" },
        { text: "Building trust and showing genuine concern", type: "S" },
        { text: "Facts, data, and detailed evidence", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "In conflict situations, you prefer to:",
      options: [
        { text: "Address issues directly and decisively", type: "D" },
        { text: "Use humor and positivity to defuse tension", type: "I" },
        { text: "Seek compromise and maintain relationships", type: "S" },
        { text: "Follow proper procedures and remain objective", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "Your workspace organization reflects:",
      options: [
        { text: "Efficiency focused on getting things done", type: "D" },
        { text: "Open and welcoming for interactions", type: "I" },
        { text: "Comfortable and consistent setup", type: "S" },
        { text: "Systematic organization with everything in its place", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "When delegating tasks, you:",
      options: [
        { text: "Give clear expectations and expect results", type: "D" },
        { text: "Explain the vision and inspire commitment", type: "I" },
        { text: "Ensure people are comfortable and supported", type: "S" },
        { text: "Provide detailed instructions and checkpoints", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "Your communication style is typically:",
      options: [
        { text: "Direct and to the point", type: "D" },
        { text: "Animated and engaging", type: "I" },
        { text: "Thoughtful and considerate", type: "S" },
        { text: "Precise and well-structured", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "When learning new skills, you prefer:",
      options: [
        { text: "Jump in and learn by doing", type: "D" },
        { text: "Learn with others in group settings", type: "I" },
        { text: "Take your time and practice until confident", type: "S" },
        { text: "Study thoroughly before attempting", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "Your approach to problem-solving involves:",
      options: [
        { text: "Quick decisions based on experience", type: "D" },
        { text: "Brainstorming with others for creative solutions", type: "I" },
        { text: "Considering impact on all stakeholders", type: "S" },
        { text: "Systematic analysis of all available data", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "In high-pressure situations, you:",
      options: [
        { text: "Take charge and drive toward solutions", type: "D" },
        { text: "Keep spirits up and motivate the team", type: "I" },
        { text: "Remain calm and provide steady support", type: "S" },
        { text: "Focus on maintaining quality standards", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "Your ideal team environment includes:",
      options: [
        { text: "Clear goals and autonomy to achieve them", type: "D" },
        { text: "Open communication and collaborative energy", type: "I" },
        { text: "Supportive relationships and job security", type: "S" },
        { text: "Defined processes and quality standards", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "When giving feedback to colleagues, you:",
      options: [
        { text: "Are direct about what needs to change", type: "D" },
        { text: "Focus on positive reinforcement and encouragement", type: "I" },
        { text: "Are gentle and considerate of their feelings", type: "S" },
        { text: "Provide specific, factual observations", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "Your decision-making process typically involves:",
      options: [
        { text: "Making quick decisions to maintain momentum", type: "D" },
        { text: "Getting input from others and building consensus", type: "I" },
        { text: "Considering long-term stability and team impact", type: "S" },
        { text: "Thoroughly analyzing all options and risks", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "When setting goals, you prefer:",
      options: [
        { text: "Ambitious targets that push boundaries", type: "D" },
        { text: "Inspiring goals that motivate the team", type: "I" },
        { text: "Realistic goals that ensure team success", type: "S" },
        { text: "Specific, measurable, and achievable objectives", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "In social work situations, you:",
      options: [
        { text: "Focus on business objectives", type: "D" },
        { text: "Enjoy building relationships and having fun", type: "I" },
        { text: "Participate but prefer smaller groups", type: "S" },
        { text: "Attend when required but prefer work focus", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "Your approach to routine tasks is:",
      options: [
        { text: "Get them done efficiently to focus on bigger things", type: "D" },
        { text: "Make them more enjoyable through interaction", type: "I" },
        { text: "Maintain consistent quality and reliability", type: "S" },
        { text: "Follow established procedures precisely", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "When reviewing others' work, you focus on:",
      options: [
        { text: "Whether it achieves the intended results", type: "D" },
        { text: "Acknowledging effort and providing encouragement", type: "I" },
        { text: "Being supportive while suggesting improvements", type: "S" },
        { text: "Ensuring accuracy and adherence to standards", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "Your response to criticism is typically:",
      options: [
        { text: "Challenge it if you disagree, accept if it helps results", type: "D" },
        { text: "Appreciate the feedback and discuss it openly", type: "I" },
        { text: "Take it personally but work to improve relationships", type: "S" },
        { text: "Analyze it objectively and make necessary adjustments", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "When presenting ideas, you:",
      options: [
        { text: "Focus on bottom-line benefits and quick wins", type: "D" },
        { text: "Use enthusiasm and storytelling to engage", type: "I" },
        { text: "Emphasize team benefits and collaborative value", type: "S" },
        { text: "Present detailed research and supporting data", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "Your preferred pace of work is:",
      options: [
        { text: "Fast and intense to achieve maximum results", type: "D" },
        { text: "Energetic with variety and social interaction", type: "I" },
        { text: "Steady and consistent with predictable rhythms", type: "S" },
        { text: "Methodical and thorough to ensure quality", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "When starting a new project, you first:",
      options: [
        { text: "Identify key objectives and success metrics", type: "D" },
        { text: "Get everyone excited about the possibilities", type: "I" },
        { text: "Understand team roles and ensure everyone's comfortable", type: "S" },
        { text: "Create detailed project plans and timelines", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "Your attitude toward rules and procedures is:",
      options: [
        { text: "Useful if they help achieve results, otherwise flexible", type: "D" },
        { text: "Important for fairness but shouldn't limit creativity", type: "I" },
        { text: "Valuable for providing structure and stability", type: "S" },
        { text: "Essential for maintaining quality and consistency", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "When motivating team members, you:",
      options: [
        { text: "Set challenging goals and reward achievement", type: "D" },
        { text: "Inspire with vision and recognize contributions publicly", type: "I" },
        { text: "Provide support and show appreciation consistently", type: "S" },
        { text: "Offer clear expectations and opportunities for skill development", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "In times of organizational change, you:",
      options: [
        { text: "See opportunities and push for quick implementation", type: "D" },
        { text: "Help others see the positive aspects and stay optimistic", type: "I" },
        { text: "Focus on helping the team adjust and maintain stability", type: "S" },
        { text: "Want to understand all implications before supporting", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "Your approach to continuous improvement involves:",
      options: [
        { text: "Focusing on changes that drive better results", type: "D" },
        { text: "Encouraging innovation and creative thinking", type: "I" },
        { text: "Making gradual improvements that don't disrupt team harmony", type: "S" },
        { text: "Systematic analysis and measured implementation", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "When faced with obstacles, you:",
      options: [
        { text: "Find alternative paths and push through aggressively", type: "D" },
        { text: "Rally others to overcome challenges together", type: "I" },
        { text: "Patiently work around them without causing disruption", type: "S" },
        { text: "Analyze the situation and develop systematic solutions", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "Your approach to building team spirit includes:",
      options: [
        { text: "Setting clear goals and celebrating victories", type: "D" },
        { text: "Organizing fun activities and encouraging open communication", type: "I" },
        { text: "Creating supportive environment where everyone feels valued", type: "S" },
        { text: "Establishing fair processes and recognizing quality work", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "When working with difficult people, you:",
      options: [
        { text: "Address issues directly to maintain productivity", type: "D" },
        { text: "Try to understand their perspective and find common ground", type: "I" },
        { text: "Remain patient and work to preserve relationships", type: "S" },
        { text: "Maintain professional standards and document interactions", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "Your ideal work recognition would be:",
      options: [
        { text: "Achievement awards for exceeding targets", type: "D" },
        { text: "Public recognition for team collaboration and innovation", type: "I" },
        { text: "Appreciation for reliability and team support", type: "S" },
        { text: "Recognition for accuracy, quality, and expertise", type: "C" }
      ]
    },
    {
      category: "Dominance",
      scenario: "When planning your career development, you focus on:",
      options: [
        { text: "Opportunities for leadership and increased responsibility", type: "D" },
        { text: "Roles that involve people interaction and influence", type: "I" },
        { text: "Positions that offer security and team collaboration", type: "S" },
        { text: "Expertise development and specialized knowledge", type: "C" }
      ]
    },
    {
      category: "Influence",
      scenario: "Your natural energy level at work is:",
      options: [
        { text: "High intensity focused on achieving results", type: "D" },
        { text: "Enthusiastic and engaging with others", type: "I" },
        { text: "Steady and consistent throughout the day", type: "S" },
        { text: "Concentrated and focused on detailed work", type: "C" }
      ]
    },
    {
      category: "Steadiness",
      scenario: "When building relationships with colleagues, you:",
      options: [
        { text: "Focus on mutual benefit and shared objectives", type: "D" },
        { text: "Enjoy getting to know them personally and socially", type: "I" },
        { text: "Build trust slowly through consistent, reliable interactions", type: "S" },
        { text: "Maintain professional relationships based on competence", type: "C" }
      ]
    },
    {
      category: "Conscientiousness",
      scenario: "Your response to tight deadlines is:",
      options: [
        { text: "Push hard and cut non-essential activities", type: "D" },
        { text: "Rally the team and maintain positive energy", type: "I" },
        { text: "Work steadily and ask for help when needed", type: "S" },
        { text: "Plan carefully and prioritize to maintain quality", type: "C" }
      ]
    }
  ];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const newScores = { D: 0, I: 0, S: 0, C: 0 };
    
    answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== undefined) {
        const selectedOption = questions[questionIndex].options[answerIndex];
        newScores[selectedOption.type as keyof typeof newScores]++;
      }
    });

    setScores(newScores);
    setIsFinished(true);
  };

  const getDominantType = () => {
    const maxScore = Math.max(...Object.values(scores));
    return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'D';
  };

  const getTypeDescription = (type: string) => {
    const descriptions = {
      D: {
        title: "Dominance",
        description: "Direct, results-oriented, and decisive. You like to take charge and solve problems quickly.",
        traits: ["Goal-oriented", "Confident", "Competitive", "Fast-paced"],
        roles: ["Team Leader", "Project Manager", "Sales Representative"]
      },
      I: {
        title: "Influence", 
        description: "Enthusiastic, people-oriented, and optimistic. You excel at building relationships and motivating others.",
        traits: ["Outgoing", "Enthusiastic", "Persuasive", "Social"],
        roles: ["Customer Service", "Marketing", "Training Specialist"]
      },
      S: {
        title: "Steadiness",
        description: "Patient, loyal, and supportive. You provide stability and work well in team environments.",
        traits: ["Reliable", "Patient", "Loyal", "Team-oriented"],
        roles: ["Support Specialist", "HR Assistant", "Quality Assurance"]
      },
      C: {
        title: "Conscientiousness",
        description: "Analytical, precise, and systematic. You focus on quality and attention to detail.",
        traits: ["Detail-oriented", "Systematic", "Accurate", "Quality-focused"],
        roles: ["Data Analyst", "Technical Support", "Compliance Officer"]
      }
    };
    return descriptions[type as keyof typeof descriptions];
  };

  const progressPercentage = (answers.filter(answer => answer !== undefined).length / questions.length) * 100;

  // Prevent copy-paste globally during assessment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 's')) {
        e.preventDefault();
      }
      // Prevent F12, Ctrl+Shift+I, Ctrl+U
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Dominance": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Influence": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Steadiness": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Conscientiousness": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
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
                      if (currentQuestion > 0 && !isFinished) {
                        setShowExitDialog(true);
                      } else {
                        router.back();
                      }
                    }}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <Brain className="h-12 w-12 text-cyan-400 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold gradient-text">DISC Personality Assessment</h1>
                  <p className="text-gray-400">Discover your work style and personality type</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {!isFinished ? (
              <>
                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                >
                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{currentQuestion + 1}</span>
                      </div>
                      <p className="text-xs text-gray-400">Current Question</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <BarChart3 className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</span>
                      </div>
                      <p className="text-xs text-gray-400">Progress</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{currentQuestion}</span>
                      </div>
                      <p className="text-xs text-gray-400">Answered</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Brain className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{questions.length - currentQuestion}</span>
                      </div>
                      <p className="text-xs text-gray-400">Remaining</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 max-w-3xl mx-auto"
                >
                  <Card className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Progress</span>
                        <span className="text-sm text-gray-300">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Question */}
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-3xl mx-auto"
                >
                  <Card 
                    className="glass-card border-white/10 mb-6"
                    onCopy={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ userSelect: 'none' }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={getCategoryColor(questions[currentQuestion].category)}>
                          {questions[currentQuestion].category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Question {currentQuestion + 1} of {questions.length}
                        </span>
                      </div>
                      <CardTitle className="text-white">
                        {questions[currentQuestion].scenario}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                              answers[currentQuestion] === index
                                ? 'bg-blue-500/20 border-blue-500/50'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => handleAnswerSelect(index)}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                              answers[currentQuestion] === index
                                ? 'border-blue-400 bg-blue-400'
                                : 'border-gray-400'
                            }`}>
                              {answers[currentQuestion] === index && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <span className={`${answers[currentQuestion] === index ? 'text-blue-300' : 'text-gray-300'}`}>
                                {option.text}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-between"
                >
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === undefined}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </>
            ) : (
              /* Results */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Main Result */}
                <Card className="glass-card border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      Your DISC Personality Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-blue-400 mb-2">
                        {getDominantType()}
                      </div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {getTypeDescription(getDominantType()).title}
                      </div>
                      <p className="text-gray-300 text-lg">
                        {getTypeDescription(getDominantType()).description}
                      </p>
                    </div>

                    {/* Scores Chart */}
                    <div className="grid grid-cols-4 gap-4">
                      {Object.entries(scores).map(([type, score]) => (
                        <div key={type} className="text-center">
                          <div className="text-3xl font-bold text-cyan-400">{score}</div>
                          <div className="text-sm text-gray-400">{type}-Type</div>
                          <div className="mt-2">
                            <Progress 
                              value={(score / questions.length) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Traits & Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-400" />
                        Your Key Traits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getTypeDescription(getDominantType()).traits.map((trait, index) => (
                          <Badge
                            key={index}
                            className="bg-green-500/20 text-green-400 border-green-500/30 mr-2 mb-2"
                          >
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Ideal BPO Roles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getTypeDescription(getDominantType()).roles.map((role, index) => (
                          <Badge
                            key={index}
                            className="bg-purple-500/20 text-purple-400 border-purple-500/30 mr-2 mb-2"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4">
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
                          title: 'My DISC Personality Assessment Results',
                          text: `My DISC type is ${getDominantType()}. Check out my personality assessment results!`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(`My DISC Personality Assessment Results: ${getDominantType()} type. Check out my results!`);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Again
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Exit Assessment Alert Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="glass-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Leave DISC Personality Assessment?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to exit? Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Continue Answering
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.back()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
            >
              Exit Assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 