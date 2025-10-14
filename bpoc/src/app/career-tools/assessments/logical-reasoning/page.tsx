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
  PuzzleIcon,
  CheckCircle,
  ArrowRight,
  Brain,
  Target,
  Award,
  Lightbulb,
  Share,
  RotateCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function shuffleOptions(question: any) {
  const options = [...question.options];
  const correctOption = options[question.correct];
  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const newCorrect = options.indexOf(correctOption);
  return { ...question, options, correct: newCorrect };
}

export default function LogicalReasoningPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

  const questions = [
    {
      type: "Pattern Recognition",
      question: "What comes next in this sequence: 2, 4, 8, 16, ?",
      options: ["24", "32", "20", "18"],
      correct: 1,
      explanation: "Each number is doubled (2×2=4, 4×2=8, 8×2=16, 16×2=32)"
    },
    {
      type: "Logic Puzzle",
      question: "All BPO agents are computer literate. Sarah is a BPO agent. Therefore:",
      options: [
        "Sarah might be computer literate",
        "Sarah is definitely computer literate", 
        "Sarah is not computer literate",
        "We cannot determine if Sarah is computer literate"
      ],
      correct: 1,
      explanation: "This is a valid logical deduction. If all BPO agents are computer literate and Sarah is a BPO agent, then Sarah must be computer literate."
    },
    {
      type: "Number Series",
      question: "Find the missing number: 3, 7, 15, 31, ?",
      options: ["47", "63", "55", "71"],
      correct: 1,
      explanation: "Pattern: (3×2+1=7), (7×2+1=15), (15×2+1=31), (31×2+1=63)"
    },
    {
      type: "Logic Puzzle",
      question: "If it takes 5 agents 5 minutes to process 5 calls, how long would it take 100 agents to process 100 calls?",
      options: ["100 minutes", "20 minutes", "5 minutes", "10 minutes"],
      correct: 2,
      explanation: "Each agent processes 1 call in 5 minutes, so 100 agents can process 100 calls in 5 minutes."
    },
    {
      type: "Pattern Recognition", 
      question: "Which pattern completes the sequence: ○△□, △□○, □○△, ?",
      options: ["○△□", "△○□", "□△○", "○□△"],
      correct: 0,
      explanation: "The sequence rotates the three symbols. After □○△, the next rotation brings us back to ○△□."
    },
    {
      type: "Logic Deduction",
      question: "In a call center, if every customer service call lasts exactly 6 minutes and there are no breaks between calls, how many calls can one agent handle in 2 hours?",
      options: ["15 calls", "20 calls", "25 calls", "30 calls"],
      correct: 1,
      explanation: "2 hours = 120 minutes. 120 ÷ 6 = 20 calls per agent."
    },
    {
      type: "Number Series",
      question: "Complete the series: 1, 1, 2, 3, 5, 8, ?",
      options: ["11", "13", "15", "10"],
      correct: 1,
      explanation: "This is the Fibonacci sequence where each number is the sum of the two preceding ones (5+8=13)."
    },
    {
      type: "Logic Puzzle",
      question: "If some programmers are analysts, and all analysts are problem solvers, which statement must be true?",
      options: [
        "All programmers are problem solvers",
        "Some programmers are problem solvers", 
        "No programmers are problem solvers",
        "All problem solvers are programmers"
      ],
      correct: 1,
      explanation: "Since some programmers are analysts, and all analysts are problem solvers, then some programmers must be problem solvers."
    },
    {
      type: "Pattern Recognition",
      question: "What's the next number in the sequence: 1, 4, 9, 16, 25, ?",
      options: ["30", "35", "36", "49"],
      correct: 2,
      explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36"
    },
    {
      type: "Logic Deduction", 
      question: "A team processes 240 tickets in 8 hours. If they work at the same rate, how many tickets can they process in 5 hours?",
      options: ["120 tickets", "150 tickets", "180 tickets", "200 tickets"],
      correct: 1,
      explanation: "Rate: 240 tickets ÷ 8 hours = 30 tickets/hour. In 5 hours: 30 × 5 = 150 tickets."
    },
    {
      type: "Pattern Recognition",
      question: "What comes next: A1, C3, E5, G7, ?",
      options: ["I9", "H8", "I8", "J10"],
      correct: 0,
      explanation: "Letters skip one (A, C, E, G, I) and numbers increase by 2 (1, 3, 5, 7, 9)."
    },
    {
      type: "Logic Puzzle",
      question: "If all cats are animals, and some animals are pets, which must be true?",
      options: [
        "All cats are pets",
        "Some cats are pets", 
        "Some cats might be pets",
        "No cats are pets"
      ],
      correct: 2,
      explanation: "We cannot definitively conclude cats are pets, but it's possible since cats are animals and some animals are pets."
    },
    {
      type: "Number Series",
      question: "Find the pattern: 2, 6, 12, 20, 30, ?",
      options: ["38", "40", "42", "44"],
      correct: 2,
      explanation: "Differences between consecutive terms: 4, 6, 8, 10, 12. Next term: 30 + 12 = 42."
    },
    {
      type: "Logic Deduction",
      question: "Three agents can handle 90 calls in 3 hours. How many agents are needed to handle 150 calls in 2 hours?",
      options: ["4 agents", "5 agents", "6 agents", "7 agents"],
      correct: 1,
      explanation: "Rate: 90 calls ÷ (3 agents × 3 hours) = 10 calls per agent per hour. For 150 calls in 2 hours: 150 ÷ (2 × 10) = 7.5, so 5 agents needed."
    },
    {
      type: "Pattern Recognition",
      question: "Complete the sequence: 1, 3, 6, 10, 15, ?",
      options: ["18", "20", "21", "24"],
      correct: 2,
      explanation: "These are triangular numbers: 1, 1+2=3, 3+3=6, 6+4=10, 10+5=15, 15+6=21."
    },
    {
      type: "Logic Puzzle", 
      question: "In a call center, Agent A takes twice as long as Agent B to resolve a ticket. If Agent B takes 4 minutes, how long for both to resolve 3 tickets working together?",
      options: ["6 minutes", "8 minutes", "9 minutes", "12 minutes"],
      correct: 1,
      explanation: "Agent A: 8 min/ticket, Agent B: 4 min/ticket. Combined rate: 1/8 + 1/4 = 3/8 tickets/min. For 3 tickets: 3 ÷ (3/8) = 8 minutes."
    },
    {
      type: "Number Series",
      question: "What's the next term: 100, 50, 25, 12.5, ?",
      options: ["6", "6.25", "5", "7.5"],
      correct: 1,
      explanation: "Each term is divided by 2: 100÷2=50, 50÷2=25, 25÷2=12.5, 12.5÷2=6.25."
    },
    {
      type: "Logic Deduction",
      question: "If every email response takes 2 minutes to write and 30 seconds to send, how many complete email responses can be sent in 1 hour?",
      options: ["20", "24", "30", "40"],
      correct: 1,
      explanation: "Total time per email: 2 min + 0.5 min = 2.5 min. In 60 minutes: 60 ÷ 2.5 = 24 complete emails."
    },
    {
      type: "Pattern Recognition",
      question: "Find the next in sequence: Z, Y, X, W, V, ?",
      options: ["U", "T", "S", "R"],
      correct: 0,
      explanation: "The alphabet is being traversed backwards: Z, Y, X, W, V, U."
    },
    {
      type: "Logic Puzzle",
      question: "If it's true that 'No efficient workers are lazy' and 'Some BPO agents are efficient workers', what can we conclude?",
      options: [
        "All BPO agents are efficient",
        "Some BPO agents are not lazy",
        "All BPO agents are lazy", 
        "No BPO agents are lazy"
      ],
      correct: 1,
      explanation: "Since some BPO agents are efficient workers and no efficient workers are lazy, then some BPO agents are not lazy."
    }
  ];

  // Shuffle questions on component mount
  useEffect(() => {
    const shuffled = [...questions]
      .map(q => shuffleOptions(q))
      .sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
    
    // Mark this question as submitted
    const newSubmittedAnswers = [...submittedAnswers];
    newSubmittedAnswers[currentQuestion] = true;
    setSubmittedAnswers(newSubmittedAnswers);
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
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === shuffledQuestions[index].correct) {
        correctAnswers++;
      }
    });
    setScore(Math.round((correctAnswers / questions.length) * 100));
    setIsFinished(true);
  };

  const getScoreLevel = () => {
    if (score >= 90) return { level: "Exceptional", color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" };
    if (score >= 80) return { level: "Strong", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/30" };
    if (score >= 70) return { level: "Good", color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30" };
    if (score >= 60) return { level: "Average", color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30" };
    return { level: "Developing", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/30" };
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "Pattern Recognition": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Logic Puzzle": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Number Series": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Logic Deduction": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const progressPercentage = shuffledQuestions.length > 0 ? (answers.filter(answer => answer !== undefined).length / shuffledQuestions.length) * 100 : 0;

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
                <PuzzleIcon className="h-12 w-12 text-cyan-400 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Logical Reasoning Test</h1>
                  <p className="text-gray-400">Evaluate your problem-solving and analytical thinking</p>
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
                        <Award className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="text-2xl font-bold text-white">
                          {answers.filter((answer, index) => answer === shuffledQuestions[index]?.correct).length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Correct</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Brain className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</span>
                      </div>
                      <p className="text-xs text-gray-400">Progress</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Lightbulb className="w-5 h-5 text-purple-400 mr-2" />
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
                        <Badge className={getQuestionTypeColor(shuffledQuestions[currentQuestion]?.type || '')}>
                          {shuffledQuestions[currentQuestion]?.type || ''}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Question {currentQuestion + 1} of {shuffledQuestions.length}
                        </span>
                      </div>
                      <CardTitle className="text-white text-lg">
                        {shuffledQuestions[currentQuestion]?.question || ''}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {shuffledQuestions[currentQuestion]?.options.map((option: string, index: number) => {
                        const isSelected = answers[currentQuestion] === index;
                        const isSubmitted = submittedAnswers[currentQuestion];
                        const correctAnswerIndex = shuffledQuestions[currentQuestion]?.correct;
                        const isCorrect = correctAnswerIndex === index;
                        

                        
                        let buttonClass = 'w-full text-left p-4 h-auto justify-start ';
                        let iconClass = 'w-6 h-6 rounded border-2 mr-3 flex-shrink-0 flex items-center justify-center font-bold text-sm ';
                        
                        // Force the correct answer to be green when submitted
                        if (isSubmitted && isCorrect) {
                          buttonClass += ' bg-green-500 hover:bg-green-600 text-white border-green-500 border-4 !important'; // Add !important for debug
                          iconClass += ' bg-white border-white text-green-500';
                        } else if (isSubmitted && isSelected && !isCorrect) {
                          // Show wrong selected answer in red
                          buttonClass += ' bg-red-500 hover:bg-red-600 text-white border-red-500';
                          iconClass += ' bg-white border-white text-red-500';
                        } else if (isSubmitted) {
                          // Other submitted options remain gray
                          buttonClass += ' border-gray-600 text-gray-300';
                          iconClass += ' border-gray-400 text-gray-400';
                        } else {
                          if (isSelected) {
                            buttonClass += 'bg-orange-500 hover:bg-orange-600 text-white';
                            iconClass += 'bg-white border-white text-orange-500';
                          } else {
                            buttonClass += 'border-gray-600 text-gray-300 hover:bg-gray-800';
                            iconClass += 'border-gray-400 text-gray-400';
                          }
                        }
                        
                        return (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              className={buttonClass}
                              onClick={() => handleAnswerSelect(index)}
                              disabled={isSubmitted}
                              style={isSubmitted && isCorrect ? { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' } : {}}
                            >
                              <div className="flex items-center">
                                <div className={iconClass}>
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <span className="leading-relaxed font-mono">{option}</span>
                              </div>
                            </Button>
                          </motion.div>
                        );
                      })}
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
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
                  >
                    {currentQuestion === shuffledQuestions.length - 1 ? 'Complete' : 'Next'}
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
                {/* Results and Skills Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Result */}
                  <Card className="glass-card border-white/10 shadow-lg shadow-white/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        Assessment Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-orange-400 mb-3">
                          {score}%
                        </div>
                        <Badge className={`${getScoreLevel().bgColor} ${getScoreLevel().color} ${getScoreLevel().borderColor} text-base px-3 py-1`}>
                          {getScoreLevel().level} Reasoning
                        </Badge>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-1">{answers.filter((answer, index) => answer === shuffledQuestions[index]?.correct).length}</div>
                          <div className="text-xs text-gray-400">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-1">{shuffledQuestions.length - answers.filter((answer, index) => answer === shuffledQuestions[index]?.correct).length}</div>
                          <div className="text-xs text-gray-400">Incorrect</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-1">{shuffledQuestions.length}</div>
                          <div className="text-xs text-gray-400">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-400 mb-1">{Math.round((score / 100) * shuffledQuestions.length)}</div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Breakdown */}
                  <Card className="glass-card border-white/20 shadow-lg shadow-white/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        <Brain className="w-5 h-5 text-cyan-400" />
                        Skills Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        {["Pattern Recognition", "Logic Puzzle", "Number Series", "Logic Deduction"].map((category) => {
                          const categoryQuestions = shuffledQuestions.filter(q => q.type === category);
                          const categoryCorrect = categoryQuestions.filter((q, index) => {
                            const questionIndex = shuffledQuestions.indexOf(q);
                            return answers[questionIndex] === q.correct;
                          }).length;
                          const categoryScore = categoryQuestions.length > 0 ? Math.round((categoryCorrect / categoryQuestions.length) * 100) : 0;

                          return (
                            <div key={category} className="text-center space-y-2">
                              <div className="text-2xl font-bold text-orange-400">{categoryScore}%</div>
                              <div className="text-xs text-gray-400">{category}</div>
                              <Badge className={`${getQuestionTypeColor(category)} text-xs px-2 py-1`} variant="outline">
                                {categoryCorrect}/{categoryQuestions.length}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* BPO Role Suitability */}
                <Card className="glass-card border-white/20 shadow-lg shadow-white/10">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-cyan-400" />
                      BPO Role Suitability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {score >= 90 && (
                        <div className="text-purple-400">
                          <p className="font-semibold text-base">Exceptional Analytical Skills</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Perfect for: Technical Support, Data Analysis, Process Improvement roles</p>
                        </div>
                      )}
                      {score >= 80 && score < 90 && (
                        <div className="text-green-400">
                          <p className="font-semibold text-base">Strong Problem-Solving Abilities</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Suitable for: Team Lead, Quality Assurance, Complex Customer Issues</p>
                        </div>
                      )}
                      {score >= 70 && score < 80 && (
                        <div className="text-blue-400">
                          <p className="font-semibold text-base">Good Logical Thinking</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Ideal for: Customer Service, Sales Support, Administrative roles</p>
                        </div>
                      )}
                      {score >= 60 && score < 70 && (
                        <div className="text-yellow-400">
                          <p className="font-semibold text-base">Average Reasoning Skills</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Consider: Entry-level positions with training and development opportunities</p>
                        </div>
                      )}
                      {score < 60 && (
                        <div className="text-red-400">
                          <p className="font-semibold text-base">Developing Logical Skills</p>
                          <p className="text-sm text-gray-300 leading-relaxed">Recommendation: Practice logical reasoning exercises and consider skills training</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

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
                          title: 'My Logical Reasoning Test Results',
                          text: `I achieved ${score}% on the Logical Reasoning Test!`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(`My Logical Reasoning Test Results: ${score}% score!`);
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
            <AlertDialogTitle className="text-white">Leave Logical Reasoning Test?</AlertDialogTitle>
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