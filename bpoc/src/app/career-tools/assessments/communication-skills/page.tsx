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
  MessageSquare,
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  Target,
  Award,
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

export default function CommunicationSkillsPage() {
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
      type: "Grammar",
      question: "Choose the correct sentence:",
      options: [
        "The customer service team are working hard today.",
        "The customer service team is working hard today.",
        "The customer service team was working hard today.",
        "The customer service team were working hard today."
      ],
      correct: 1,
      explanation: "When referring to a team as a single unit, use the singular verb 'is'."
    },
    {
      type: "Email Writing",
      question: "Which is the most professional way to start an email to a client?",
      options: [
        "Hey there!",
        "Dear Sir/Madam,",
        "Hi!",
        "Good morning, Mr. Johnson,"
      ],
      correct: 3,
      explanation: "Using the client's name with appropriate title is most professional."
    },
    {
      type: "Customer Service",
      question: "A customer is upset about a delayed order. Your best response is:",
      options: [
        "That's not our fault, delays happen sometimes.",
        "I understand your frustration. Let me check the status and find a solution for you.",
        "You should have ordered earlier if you needed it faster.",
        "There's nothing I can do about delays."
      ],
      correct: 1,
      explanation: "Showing empathy and offering to help demonstrates excellent customer service."
    },
    {
      type: "Grammar",
      question: "Identify the correct use of apostrophes:",
      options: [
        "The company's policy states that employee's must sign in.",
        "The companys policy states that employees must sign in.",
        "The company's policy states that employees must sign in.",
        "The companies policy states that employee's must sign in."
      ],
      correct: 2,
      explanation: "Company's (possessive) and employees (plural, not possessive) are correct."
    },
    {
      type: "Vocabulary",
      question: "In a professional context, 'escalate' means:",
      options: [
        "To make something more expensive",
        "To transfer an issue to a higher authority",
        "To increase the volume of your voice",
        "To complicate a simple process"
      ],
      correct: 1,
      explanation: "In customer service, escalate means to transfer an issue to a supervisor or higher authority."
    },
    {
      type: "Email Writing",
      question: "The best way to end a professional email is:",
      options: [
        "Thanks, bye!",
        "Best regards, [Your Name]",
        "See ya later",
        "TTYL"
      ],
      correct: 1,
      explanation: "'Best regards' followed by your name is the most professional closing."
    },
    {
      type: "Customer Service",
      question: "When you don't know the answer to a customer's question, you should:",
      options: [
        "Make up an answer so you don't look incompetent",
        "Transfer them to someone else immediately",
        "Say 'I don't know' and end the call",
        "Acknowledge that you need to research it and offer to follow up"
      ],
      correct: 3,
      explanation: "Honesty combined with a commitment to find the answer shows professionalism."
    },
    {
      type: "Grammar",
      question: "Choose the sentence with correct subject-verb agreement:",
      options: [
        "Either the manager or the employees is responsible.",
        "Either the manager or the employees are responsible.",
        "Either the manager or the employees was responsible.",
        "Either the manager or the employees were responsible."
      ],
      correct: 1,
      explanation: "With 'either...or', the verb agrees with the subject closest to it (employees = are)."
    },
    {
      type: "Vocabulary",
      question: "What does 'proactive' mean in a workplace context?",
      options: [
        "Reacting quickly to problems",
        "Taking action to prevent problems before they occur",
        "Being active all the time",
        "Supporting company activities"
      ],
      correct: 1,
      explanation: "Proactive means taking initiative to prevent issues rather than just reacting to them."
    },
    {
      type: "Customer Service",
      question: "The most important skill in customer service is:",
      options: [
        "Speaking very fast to handle more calls",
        "Active listening and empathy",
        "Knowing all product details by heart",
        "Always agreeing with the customer"
      ],
      correct: 1,
      explanation: "Active listening and empathy help you understand and address customer needs effectively."
    },
    {
      type: "Grammar",
      question: "Which sentence uses commas correctly?",
      options: [
        "The manager, who is from Manila, started last week.",
        "The manager who is from Manila, started last week.",
        "The manager, who is from Manila started last week.",
        "The manager who is from Manila started, last week."
      ],
      correct: 0,
      explanation: "Commas should surround non-essential information ('who is from Manila')."
    },
    {
      type: "Email Writing",
      question: "When writing a follow-up email, the best subject line is:",
      options: [
        "Follow-up",
        "Hi again",
        "Follow-up: Project Status Update - Action Required",
        "Important!!!"
      ],
      correct: 2,
      explanation: "A clear, specific subject line helps recipients understand the email's purpose and urgency."
    },
    {
      type: "Customer Service",
      question: "A customer wants a refund but doesn't have a receipt. You should:",
      options: [
        "Immediately deny the request",
        "Ask for their contact information to verify the purchase in your system",
        "Give them a full refund without questions",
        "Tell them it's impossible without a receipt"
      ],
      correct: 1,
      explanation: "Professional service involves exploring all options to help the customer within company policy."
    },
    {
      type: "Vocabulary",
      question: "In business communication, 'actionable' means:",
      options: [
        "Something that can be sued for",
        "Information that can be acted upon",
        "A dramatic response",
        "An active person"
      ],
      correct: 1,
      explanation: "Actionable information provides clear direction for what steps to take next."
    },
    {
      type: "Grammar",
      question: "Choose the correct pronoun usage:",
      options: [
        "Between you and I, this policy needs changing.",
        "Between you and me, this policy needs changing.",
        "Between yourself and I, this policy needs changing.",
        "Between yourself and myself, this policy needs changing."
      ],
      correct: 1,
      explanation: "After prepositions like 'between', use object pronouns (me, not I)."
    },
    {
      type: "Customer Service",
      question: "When handling multiple customer inquiries, you should:",
      options: [
        "Focus on the easiest ones first",
        "Handle them in the order they arrived",
        "Prioritize based on urgency and customer tier",
        "Deal with VIP customers only"
      ],
      correct: 2,
      explanation: "Effective prioritization considers both urgency and customer importance for optimal service."
    },
    {
      type: "Email Writing",
      question: "When requesting information via email, you should:",
      options: [
        "Use ALL CAPS to show importance",
        "Be specific about what you need and when",
        "Send multiple emails to ensure it's seen",
        "Make the subject line vague to create curiosity"
      ],
      correct: 1,
      explanation: "Clear, specific requests with deadlines help recipients provide better, timely responses."
    },
    {
      type: "Vocabulary",
      question: "What does 'bandwidth' mean in a business context?",
      options: [
        "Internet speed",
        "Available capacity or resources",
        "The width of a computer screen",
        "Radio frequency range"
      ],
      correct: 1,
      explanation: "In business, bandwidth refers to available time, resources, or capacity to take on tasks."
    },
    {
      type: "Grammar",
      question: "Identify the correct use of 'who' vs 'whom':",
      options: [
        "Who should I contact about this issue?",
        "Whom should I contact about this issue?",
        "Who should I contact this issue about?",
        "Whom is handling this project?"
      ],
      correct: 1,
      explanation: "Use 'whom' when it's the object of the sentence (you contact whom = him/her)."
    },
    {
      type: "Customer Service",
      question: "The best way to handle an angry customer is to:",
      options: [
        "Match their energy and speak loudly",
        "Remain calm, listen actively, and acknowledge their concerns",
        "Put them on hold until they calm down",
        "Transfer them immediately to a supervisor"
      ],
      correct: 1,
      explanation: "Staying calm and showing empathy helps de-escalate situations and build trust."
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
    if (score >= 90) return { level: "Excellent", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/30" };
    if (score >= 80) return { level: "Very Good", color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30" };
    if (score >= 70) return { level: "Good", color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30" };
    return { level: "Needs Improvement", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/30" };
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "Grammar": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Email Writing": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Customer Service": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Vocabulary": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
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
                <MessageSquare className="h-12 w-12 text-cyan-400 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Communication Skills Test</h1>
                  <p className="text-gray-400">Test your English proficiency and customer service skills</p>
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
                        <FileText className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</span>
                      </div>
                      <p className="text-xs text-gray-400">Progress</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-purple-400 mr-2" />
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
                      <CardTitle className="text-white">
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
                        let iconClass = 'w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ';
                        
                        // Force the correct answer to be green when submitted
                        if (isSubmitted && isCorrect) {
                          buttonClass += ' bg-green-500 hover:bg-green-600 text-white border-green-500 border-4 !important'; // Add !important for debug
                          iconClass += ' bg-white border-white';
                        } else if (isSubmitted && isSelected && !isCorrect) {
                          // Show wrong selected answer in red
                          buttonClass += ' bg-red-500 hover:bg-red-600 text-white border-red-500';
                          iconClass += ' bg-white border-white';
                        } else if (isSubmitted) {
                          // Other submitted options remain gray
                          buttonClass += ' border-gray-600 text-gray-300';
                          iconClass += ' border-gray-400';
                        } else {
                          if (isSelected) {
                            buttonClass += 'bg-cyan-500 hover:bg-cyan-600 text-white';
                            iconClass += 'bg-white border-white';
                          } else {
                            buttonClass += 'border-gray-600 text-gray-300 hover:bg-gray-800';
                            iconClass += 'border-gray-400';
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
                                  {isSelected && (
                                    <CheckCircle className={`w-4 h-4 ${isSubmitted ? (isCorrect ? 'text-green-500' : 'text-red-500') : 'text-cyan-500'}`} />
                                )}
                              </div>
                              <span className="leading-relaxed">{option}</span>
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
                  <Card className="glass-card border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <CheckCircle className="w-5 h-5 text-cyan-400" />
                        Assessment Results
                    </CardTitle>
                  </CardHeader>
                    <CardContent className="space-y-8">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-cyan-400 mb-3">
                        {score}%
                      </div>
                        <Badge className={`${getScoreLevel().bgColor} ${getScoreLevel().color} ${getScoreLevel().borderColor} text-base px-3 py-1`}>
                        {getScoreLevel().level}
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
                          <div className="text-3xl font-bold text-white mb-1">{questions.length}</div>
                          <div className="text-xs text-gray-400">Total</div>
                      </div>
                      <div className="text-center">
                          <div className="text-3xl font-bold text-cyan-400 mb-1">{Math.round((score / 100) * questions.length)}</div>
                          <div className="text-xs text-gray-400">Grade</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                  <Card className="glass-card border-white/20 shadow-lg shadow-white/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-green-400" />
                      Skills Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                      {["Grammar", "Email Writing", "Customer Service", "Vocabulary"].map((category) => {
                        const categoryQuestions = questions.filter(q => q.type === category);
                        const categoryCorrect = categoryQuestions.filter((q, index) => {
                          const questionIndex = questions.indexOf(q);
                          return answers[questionIndex] === q.correct;
                        }).length;
                        const categoryScore = Math.round((categoryCorrect / categoryQuestions.length) * 100);

                        return (
                            <div key={category} className="text-center space-y-2">
                              <div className="text-2xl font-bold text-cyan-400">{categoryScore}%</div>
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

                {/* Recommendations */}
                <Card className="glass-card border-white/20 shadow-lg shadow-white/10">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <Award className="w-5 h-5 text-yellow-400" />
                      Professional Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {score >= 90 && (
                        <p className="text-green-400 text-base leading-relaxed">
                          Excellent communication skills! You're ready for any BPO role that requires strong English proficiency.
                        </p>
                      )}
                      {score >= 80 && score < 90 && (
                        <p className="text-blue-400 text-base leading-relaxed">
                          Very good communication skills. You have a strong foundation for most BPO positions.
                        </p>
                      )}
                      {score >= 70 && score < 80 && (
                        <p className="text-yellow-400 text-base leading-relaxed">
                          Good communication skills with room for improvement. Consider practicing grammar and customer service scenarios.
                        </p>
                      )}
                      {score < 70 && (
                        <p className="text-red-400 text-base leading-relaxed">
                          Keep practicing! Focus on grammar fundamentals and professional email writing to improve your BPO readiness.
                        </p>
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
                          title: 'My Communication Skills Test Results',
                          text: `I achieved ${score}% on the Communication Skills Test!`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(`My Communication Skills Test Results: ${score}% score!`);
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
            <AlertDialogTitle className="text-white">Leave Communication Skills Test?</AlertDialogTitle>
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