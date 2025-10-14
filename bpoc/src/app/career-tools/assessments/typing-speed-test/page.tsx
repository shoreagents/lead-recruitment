'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
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
  Keyboard,
  Clock,
  Target,
  Zap,
  PlayCircle,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Trophy,
  Star,
  Share,
  Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'difficult';

export default function TypingSpeedTestPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>('easy');
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const [allTestsCompleted, setAllTestsCompleted] = useState(false);
  const [finalResults, setFinalResults] = useState<{
    totalWpm: number;
    totalAccuracy: number;
    testsPassed: number;
    totalTests: number;
  } | null>(null);
  const [showDifficultySelection, setShowDifficultySelection] = useState(true);
  const [showLevelResults, setShowLevelResults] = useState(false);
  const [levelResults, setLevelResults] = useState<{
    level: string;
    wpm: number;
    accuracy: number;
    passed: boolean;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const levelData = {
    easy: {
      title: 'Easy Level',
      description: 'Simple words and basic sentences',
      color: 'green',
      icon: '🟢',
      minWpm: 30,
      minAccuracy: 90,
      tests: [
        {
          name: 'Customer Service Basics',
          text: "Working in a call center is a good job. Many people like to help customers. You can learn new skills every day. The work is fun and easy. You will talk to nice people from around the world. Customer service is very important. Always be kind and helpful. Listen to what customers say. Try to solve their problems quickly. Take your time to understand them. Good communication skills are needed. Practice typing fast and clear. Be patient with every customer. Work well with your team members. Keep learning and growing."
        },
        {
          name: 'Basic Office Tasks',
          text: "Office work is simple when you know the basics. You will use a computer every day. Type emails to your team and clients. Answer phone calls with a smile. Keep your desk clean and organized. Follow company rules at all times. Be on time for work and meetings. Help your coworkers when they need it. Learn new software programs quickly. Save your work files in the right folders. Check your schedule every morning. Ask questions when you are not sure. Practice makes you better at your job."
        }
      ]
    },
    medium: {
      title: 'Medium Level',
      description: 'Professional vocabulary and complex sentences',
      color: 'yellow',
      icon: '🟡',
      minWpm: 40,
      minAccuracy: 93,
      tests: [
        {
          name: 'BPO Operations',
          text: "The Business Process Outsourcing industry requires excellent communication skills and technical proficiency. Customer service representatives must demonstrate patience, empathy, and problem-solving abilities while maintaining professional standards. Successful agents utilize various software applications including CRM systems, ticketing platforms, and knowledge management databases. Quality assurance metrics, performance indicators, and client satisfaction scores determine promotional opportunities. Training programs focus on product knowledge, troubleshooting procedures, and effective communication strategies to ensure optimal customer experiences."
        },
        {
          name: 'Professional Communication',
          text: "Effective workplace communication involves active listening, clear articulation, and professional etiquette. Representatives handle diverse customer inquiries, technical support requests, and escalation procedures while maintaining composure under pressure. Documentation requirements include detailed case notes, resolution summaries, and follow-up actions. Performance metrics evaluate response times, accuracy rates, and customer satisfaction scores. Continuous improvement initiatives focus on skill development, process optimization, and service excellence standards."
        }
      ]
    },
    hard: {
      title: 'Hard Level',
      description: 'Technical terms, special characters, and complex syntax',
      color: 'orange',
      icon: '🟠',
      minWpm: 50,
      minAccuracy: 95,
      tests: [
        {
          name: 'Advanced BPO Systems',
          text: "Advanced BPO operations necessitate comprehensive understanding of multi-tiered escalation protocols, SLA compliance metrics (≥99.5%), and sophisticated CRM integrations. Agents must adeptly navigate complex troubleshooting scenarios involving: API configurations, database queries, encrypted authentication systems, and cross-platform compatibility issues. The convergence of artificial intelligence, machine learning algorithms, and predictive analytics requires exceptional adaptability. Performance benchmarks include: resolution rates >85%, first-call resolution 70%, customer satisfaction ≥4.8/5.0, and adherence to quality assurance standards."
        },
        {
          name: 'Technical Documentation',
          text: "Technical support specialists utilize advanced diagnostic tools, system monitoring dashboards, and incident management platforms. Root cause analysis (RCA) procedures involve: log file examination, network connectivity testing, and application performance monitoring. Key performance indicators (KPIs) include: Mean Time to Resolution (MTTR) <4 hours, First Contact Resolution (FCR) >80%, and Net Promoter Score (NPS) ≥70. Compliance frameworks require adherence to ISO 27001, SOC 2 Type II, and GDPR regulations while maintaining 24/7 operational availability."
        }
      ]
    },
    difficult: {
      title: 'Difficult Level',
      description: 'Programming syntax, advanced symbols, and complex formatting',
      color: 'red',
      icon: '🔴',
      minWpm: 60,
      minAccuracy: 97,
      tests: [
        {
          name: 'Enterprise Architecture',
          text: "Enterprise-grade BPO architectures utilize microservices frameworks: {\"apiVersion\": \"v1\", \"metadata\": {\"namespace\": \"prod\"}, \"spec\": {\"replicas\": 3}}. Advanced implementations require OAuth2.0 authentication, RESTful APIs, and SQL queries: SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.status = 'ACTIVE' && p.tier >= 'PREMIUM'; Predictive analytics leverage machine learning models (Random Forest, SVM, Neural Networks) with hyperparameters: α=0.001, β₁=0.9, β₂=0.999, ε=1e-8. Performance monitoring utilizes Kubernetes clusters, Docker containers, and CI/CD pipelines for seamless deployment automation."
        },
        {
          name: 'Database Operations',
          text: "Complex database operations require proficiency in advanced SQL syntax: CREATE PROCEDURE GetCustomerMetrics(@startDate DATETIME, @endDate DATETIME) AS BEGIN SELECT c.customer_id, c.name, COUNT(t.ticket_id) AS total_tickets, AVG(t.resolution_time) AS avg_resolution FROM customers c INNER JOIN tickets t ON c.customer_id = t.customer_id WHERE t.created_date BETWEEN @startDate AND @endDate GROUP BY c.customer_id, c.name HAVING COUNT(t.ticket_id) > 5 ORDER BY avg_resolution DESC; END; Implementation involves connection pooling, transaction management, and data encryption using AES-256 algorithms."
        }
      ]
    }
  };

  const currentLevelData = levelData[currentLevel];
  const currentTest = currentLevelData.tests[currentTestIndex];
  const words = currentTest.text.split(' ');

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30',
        icon: 'text-cyan-400',
        button: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
      },
      yellow: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        icon: 'text-cyan-400',
        button: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
      },
      orange: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        icon: 'text-cyan-400',
        button: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
      },
      red: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/30',
        icon: 'text-cyan-400',
        button: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const colors = getColorClasses(currentLevelData.color);

  const difficulties = [
    {
      id: 'easy',
      title: 'Easy',
      stars: 1,
      wordType: 'Common Words',
      speed: '30+ WPM',
      requirement: 'Basic typing skills',
      timeLimit: '30 seconds'
    },
    {
      id: 'medium',
      title: 'Medium',
      stars: 2,
      wordType: 'Business Terms',
      speed: '40+ WPM',
      requirement: 'Professional typing',
      timeLimit: '30 seconds'
    },
    {
      id: 'hard',
      title: 'Hard',
      stars: 3,
      wordType: 'Technical Terms',
      speed: '50+ WPM',
      requirement: 'Advanced typing',
      timeLimit: '30 seconds'
    },
    {
      id: 'difficult',
      title: 'Expert',
      stars: 4,
      wordType: 'Programming Code',
      speed: '60+ WPM',
      requirement: 'Expert typing',
      timeLimit: '30 seconds'
    }
  ];

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setCurrentLevel(difficulty);
    setCurrentTestIndex(0);
    setShowDifficultySelection(false);
    resetTest();
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      calculateStats();
    }
  }, [userInput]);

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

  const startTest = () => {
    setIsActive(true);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  const resetTest = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(30);
    setUserInput('');
    setCurrentWordIndex(0);
    setCorrectChars(0);
    setTotalChars(0);
    setWpm(0);
    setAccuracy(0);
  };

  const handleFinish = () => {
    setIsActive(false);
    
    // Mark test as completed if passed
    if (wpm >= currentLevelData.minWpm && accuracy >= currentLevelData.minAccuracy) {
      const testKey = `${currentLevel}-${currentTestIndex}`;
      if (!completedTests.includes(testKey)) {
        setCompletedTests([...completedTests, testKey]);
      }
    }

    // Check if this is the last test in the current level
    const isLastTestInLevel = currentTestIndex === currentLevelData.tests.length - 1;
    
    if (isLastTestInLevel) {
      // Show level results
      setLevelResults({
        level: currentLevelData.title,
        wpm: wpm,
        accuracy: accuracy,
        passed: wpm >= currentLevelData.minWpm && accuracy >= currentLevelData.minAccuracy
      });
      setShowLevelResults(true);
    } else {
      // Move to next test in same level after a short delay
      setTimeout(() => {
        handleNextTest();
      }, 1000);
    }
  };

  const calculateStats = () => {
    const inputWords = userInput.trim().split(' ');
    let correct = 0;
    let total = userInput.length;

    inputWords.forEach((word, index) => {
      if (index < words.length && word === words[index]) {
        correct += word.length + 1; // +1 for space
      }
    });

    setCorrectChars(correct);
    setTotalChars(total);
    setAccuracy(total > 0 ? Math.round((correct / total) * 100) : 100);

    const timeElapsed = 30 - timeLeft; // Changed from 60 to 30
    const wordsTyped = inputWords.length - 1; // -1 because last word might be incomplete
    setWpm(timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0);
  };

  const getWordColor = (wordIndex: number, word: string) => {
    const inputWords = userInput.trim().split(' ');
    if (wordIndex >= inputWords.length) return 'text-gray-400';
    if (inputWords[wordIndex] === word) return 'text-green-400';
    if (inputWords[wordIndex] !== word && inputWords[wordIndex]) return 'text-red-400';
    return 'text-gray-400';
  };

  const handleNextTest = () => {
    // Move to next test in current level
    if (currentTestIndex < currentLevelData.tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      resetTest();
    }
  };

  const handleContinueToNextLevel = () => {
    const levels: DifficultyLevel[] = ['easy', 'medium', 'hard', 'difficult'];
    const currentLevelIndex = levels.indexOf(currentLevel);
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevel(levels[currentLevelIndex + 1]);
      setCurrentTestIndex(0);
      resetTest();
      setShowLevelResults(false);
    }
  };

  const handleBackToDifficultySelection = () => {
    setShowLevelResults(false);
    setShowDifficultySelection(true);
    resetTest();
  };



  const isTestPassed = wpm >= currentLevelData.minWpm && accuracy >= currentLevelData.minAccuracy;
  const hasNextTest = currentTestIndex < currentLevelData.tests.length - 1 || 
                     (currentLevel !== 'difficult' || currentTestIndex < 1);

  // Calculate typing progress based on words typed vs total words
  const wordsTyped = userInput.trim().split(' ').filter(word => word.length > 0).length;
  const totalWords = words.length;
  const typingProgress = totalWords > 0 ? Math.min((wordsTyped / totalWords) * 100, 100) : 0;

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
                      if (isActive) {
                        setShowExitDialog(true);
                      } else if (!showDifficultySelection) {
                        // If we're in the test but not active, go back to difficulty selection
                        setShowDifficultySelection(true);
                        resetTest();
                      } else {
                        // If we're on difficulty selection, go back to previous page
                        router.back();
                      }
                    }}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <Keyboard className={`h-12 w-12 ${colors.icon} mr-4`} />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold gradient-text">Typing Speed Test</h1>
                    <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                      {currentLevelData.title}
                    </Badge>
                  </div>
                  <p className="text-gray-400">{currentLevelData.description}</p>
                </div>
              </div>
            </div>
          </motion.div>



          <div className="max-w-4xl mx-auto space-y-6">
            {/* Difficulty Selection */}
            {showDifficultySelection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Select Your Typing Level</h2>
                  <p className="text-gray-400">Choose a difficulty level to test your typing speed and accuracy</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {difficulties.map((difficulty, index) => (
                    <motion.div
                      key={difficulty.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (index * 0.1) }}
                      className="group"
                    >
                      <Card 
                        className="glass-card border-white/10 hover:border-white/20 h-full transition-all duration-300 group-hover:scale-105 relative overflow-hidden cursor-pointer"
                        onClick={() => handleDifficultySelect(difficulty.id as DifficultyLevel)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <CardTitle className="text-xl text-white font-bold">
                              {difficulty.title}
                            </CardTitle>
                            <div className="flex gap-1">
                              {[...Array(difficulty.stars)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Word Type:</span>
                              <span className="text-purple-400 font-medium">{difficulty.wordType}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Test Duration:</span>
                              <span className="text-blue-400 font-medium">{difficulty.timeLimit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Target WPM:</span>
                              <span className="text-yellow-400 font-medium">{difficulty.speed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Skill Level:</span>
                              <span className="text-green-400 font-medium">{difficulty.requirement}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <Button 
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                            onClick={() => handleDifficultySelect(difficulty.id as DifficultyLevel)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Typing Test
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button
                    onClick={() => router.push('/career-tools/assessments')}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Menu
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Level Results */}
            {showLevelResults && levelResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
                  <p className="text-gray-400">Here are your results for the {levelResults.level}</p>
                </div>

                <Card className="glass-card border-white/10 max-w-4xl mx-auto">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-white text-center flex items-center justify-center gap-3 text-2xl">
                      {levelResults.passed ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <Target className="w-8 h-8 text-orange-400" />
                      )}
                      {levelResults.level} Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-cyan-400 mb-2">{levelResults.wpm}</div>
                        <div className="text-lg text-gray-400 mb-3">Words Per Minute</div>
                        <Badge className={`text-sm px-4 py-2 ${levelResults.wpm >= currentLevelData.minWpm ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                          {levelResults.wpm >= currentLevelData.minWpm ? 'Target Met' : 'Below Target'}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-green-400 mb-2">{levelResults.accuracy}%</div>
                        <div className="text-lg text-gray-400 mb-3">Accuracy</div>
                        <Badge className={`text-sm px-4 py-2 ${levelResults.accuracy >= currentLevelData.minAccuracy ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                          {levelResults.accuracy >= currentLevelData.minAccuracy ? 'Target Met' : 'Below Target'}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                      <p className="text-lg text-center text-gray-300">
                        <strong>Status:</strong> {levelResults.passed ? 'Level Passed! 🎉' : 'Level Failed - Keep practicing!'}
                      </p>
                      <p className="text-sm text-gray-400 text-center mt-2">
                        Target: {currentLevelData.minWpm}+ WPM, {currentLevelData.minAccuracy}%+ accuracy
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-6 max-w-4xl mx-auto">
                  <Button
                    onClick={handleBackToDifficultySelection}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 text-lg font-medium"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Back to Main Menu
                  </Button>
                  <Button
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: 'My Typing Speed Test Results',
                          text: `I achieved ${levelResults.wpm} WPM with ${levelResults.accuracy}% accuracy on ${levelResults.level}!`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(`My Typing Speed Test Results: ${levelResults.wpm} WPM with ${levelResults.accuracy}% accuracy on ${levelResults.level}!`);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg font-medium"
                  >
                    <Share className="w-5 h-5 mr-3" />
                    Share
                  </Button>
                  <Button
                    onClick={() => {
                      setShowLevelResults(false);
                      resetTest();
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-4 text-lg font-medium"
                  >
                    <Play className="w-5 h-5 mr-3" />
                    Take Again
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Main Test Content */}
            {!showDifficultySelection && !showLevelResults && (
              <>
                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{timeLeft}s</span>
                      </div>
                      <p className="text-xs text-gray-400">Time Left</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="text-2xl font-bold text-white">
                          {wpm === 0 && !isActive ? '--' : wpm}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">WPM</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-2xl font-bold text-white">
                          {accuracy === 0 && !isActive ? '--' : `${accuracy}%`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Accuracy</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 text-center">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Keyboard className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-2xl font-bold text-white">{totalChars}</span>
                      </div>
                      <p className="text-xs text-gray-400">Characters</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Progress</span>
                        <span className="text-sm text-gray-300">{Math.round(typingProgress)}%</span>
                      </div>
                      <Progress value={typingProgress} className="h-2" />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Test Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                          {currentLevelData.title}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Test {currentTestIndex + 1} of {currentLevelData.tests.length}
                        </span>
                      </div>
                      <CardTitle className={`text-white flex items-center gap-2`}>
                        <Target className={`w-5 h-5 ${colors.icon}`} />
                        {currentTest.name} - {currentLevelData.title}
                      </CardTitle>
                      {currentLevel === 'difficult' && (
                        <CardDescription className="text-yellow-400 text-sm">
                          ⚠️ Expert Level: Contains programming syntax, special symbols, and advanced formatting
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div 
                        className={`bg-gray-900/50 rounded-lg p-6 text-lg leading-relaxed ${
                          currentLevel === 'hard' || currentLevel === 'difficult' ? 'font-mono' : ''
                        } ${currentLevel === 'difficult' ? 'border border-red-500/20 text-base' : ''}`}
                        onCopy={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ userSelect: 'none' }}
                      >
                        {words.map((word, index) => (
                          <span
                            key={index}
                            className={`${getWordColor(index, word)} transition-colors duration-200`}
                          >
                            {word}{index < words.length - 1 ? ' ' : ''}
                          </span>
                        ))}
                      </div>

                      <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={!isActive || isFinished}
                        placeholder={isActive ? "Start typing..." : "Click start to begin"}
                        className={`w-full bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 resize-none ${
                          currentLevel === 'hard' || currentLevel === 'difficult' ? 'font-mono text-sm h-40' : 'h-32'
                        }`}
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                          // Prevent common copy/paste shortcuts
                          if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
                            e.preventDefault();
                          }
                        }}
                      />

                      <div className="flex gap-4">
                        {!isActive && !isFinished && (
                          <Button
                            onClick={startTest}
                            className={`bg-gradient-to-r ${colors.button} text-white`}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {currentLevel === 'difficult' ? 'Start Expert Test' : 'Start Test'}
                          </Button>
                        )}

                        <Button
                          onClick={resetTest}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Results */}
                {isFinished && allTestsCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className={`glass-card ${colors.border}`}>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <CheckCircle className={`w-5 h-5 ${colors.icon}`} />
                          All Tests Completed!
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${colors.text}`}>{finalResults?.totalWpm || 0}</div>
                            <div className="text-sm text-gray-400">Average WPM</div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Completed
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-cyan-400">{finalResults?.totalAccuracy || 0}%</div>
                            <div className="text-sm text-gray-400">Average Accuracy</div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Excellent
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                          <p className="text-sm text-gray-300 text-center">
                            <strong>Final Results:</strong> {finalResults?.testsPassed || 0} of {finalResults?.totalTests || 8} tests passed
                          </p>
                          <p className="text-xs text-gray-400 text-center mt-1">
                            🎉 You've completed all typing speed tests!
                          </p>
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
                                  title: 'My Typing Speed Test Results',
                                  text: `I achieved ${finalResults?.totalWpm || 0} WPM with ${finalResults?.totalAccuracy || 0}% accuracy across all tests!`,
                                  url: window.location.href
                                });
                              } else {
                                // Fallback: copy to clipboard
                                navigator.clipboard.writeText(`My Typing Speed Test Results: ${finalResults?.totalWpm || 0} WPM with ${finalResults?.totalAccuracy || 0}% accuracy across all tests!`);
                              }
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          >
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button
                            onClick={resetTest}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Take Again
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Exit Assessment Alert Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="glass-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Leave Typing Speed Test?</AlertDialogTitle>
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