'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft,
  Users,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MessageSquare,
  BookOpen,
  Clock,
  FileText,
  Send,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type JobRole = {
  id: string;
  label: string;
  color: string;
  active?: boolean;
};

type InterviewQuestion = {
  id: string;
  question: string;
  category: string;
  difficulty: string;
};

const jobRoles: JobRole[] = [
  { id: 'custom', label: 'Custom Job Description', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { id: 'software-engineer', label: 'Software Engineer', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'business-analyst', label: 'Business Analyst', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'product-manager', label: 'Product Manager', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'marketing-specialist', label: 'Marketing Specialist', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'customer-service', label: 'Customer Service Representative', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'sales-representative', label: 'Sales Representative', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'hr-specialist', label: 'Human Resources Specialist', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'data-analyst', label: 'Data Analyst', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'ux-designer', label: 'UX/UI Designer', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { id: 'qa-engineer', label: 'QA Engineer', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
];

const sampleQuestions: InterviewQuestion[] = [
  {
    id: '1',
    question: 'How have you successfully utilized data analytics to address a specific business challenge, and what was the outcome?',
    category: 'Technical Skills',
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    question: 'Tell me about a time when you had to handle a difficult customer complaint. How did you resolve it?',
    category: 'Customer Service',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    question: 'Describe your experience with stakeholder management and how you ensure alignment across different teams.',
    category: 'Communication',
    difficulty: 'Advanced'
  }
];

export default function InterviewPrepPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('business-analyst');
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion>(sampleQuestions[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [maxTime] = useState(180); // 3 minutes
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSampleResponse, setShowSampleResponse] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showCustomJobDialog, setShowCustomJobDialog] = useState(false);
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<InterviewQuestion[]>([]);
  const [maxChars] = useState(5000);
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && recordingTime < maxTime) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxTime - 1) {
            setIsRecording(false);
            setHasRecorded(true);
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, recordingTime, maxTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setShowFeedback(false);
    setShowSampleResponse(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    setShowFeedback(true);
  };

  const handleResetRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setHasRecorded(false);
    setShowFeedback(false);
    setShowSampleResponse(false);
  };

  const handleRoleSelect = (roleId: string) => {
    if (roleId === 'custom') {
      setShowCustomInput(true);
      setSelectedRole(roleId);
      return;
    }
    
    setSelectedRole(roleId);
    setShowCustomInput(false);
    // In a real implementation, this would generate new questions based on the role
    if (roleId === 'customer-service') {
      setCurrentQuestion(sampleQuestions[1]);
    } else if (roleId === 'business-analyst') {
      setCurrentQuestion(sampleQuestions[0]);
    } else {
      setCurrentQuestion(sampleQuestions[2]);
    }
    handleResetRecording();
  };

  const generateCustomQuestions = async () => {
    if (!customJobDescription.trim()) return;
    
    setIsGeneratingQuestion(true);
    
    // Simulate AI question generation based on job description
    // In a real implementation, this would call an AI API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedQuestions: InterviewQuestion[] = [
      {
        id: 'custom-1',
        question: `Based on this role, describe a time when you had to handle multiple priorities while maintaining quality standards. How did you approach this challenge?`,
        category: 'Situational',
        difficulty: 'Intermediate'
      },
      {
        id: 'custom-2',
        question: `What specific skills or experiences from your background make you particularly well-suited for this position?`,
        category: 'Role-Specific',
        difficulty: 'Beginner'
      },
      {
        id: 'custom-3',
        question: `Describe how you would approach the key responsibilities mentioned in this job description. What would be your strategy for success?`,
        category: 'Strategic Thinking',
        difficulty: 'Advanced'
      }
    ];
    
    setCustomQuestions(generatedQuestions);
    setCurrentQuestion(generatedQuestions[0]);
    setSelectedRole('custom');
    setIsGeneratingQuestion(false);
    setShowCustomInput(false);
    handleResetRecording();
  };

  const handleCustomJobSubmit = () => {
    if (customJobDescription.trim()) {
      generateCustomQuestions();
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden cyber-grid">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/6 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-500/6 rounded-full blur-2xl animate-pulse delay-500"></div>
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
                onClick={() => router.back()}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <Users className="h-12 w-12 text-blue-400 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Interview Prep</h1>
                  <p className="text-gray-400">Practice with AI-powered interview questions</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Job Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    Turn a job description into interview questions to practice with:
                  </CardTitle>
                </CardHeader>
                                 <CardContent>
                   <div className="flex flex-wrap gap-3 mb-6">
                     {jobRoles.map((role) => (
                       <Button
                         key={role.id}
                         variant={selectedRole === role.id ? "default" : "outline"}
                         onClick={() => handleRoleSelect(role.id)}
                         className={`${
                           selectedRole === role.id 
                             ? 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500' 
                             : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                         } transition-all duration-200`}
                       >
                         {role.label}
                       </Button>
                     ))}
                   </div>
                   
                   {/* Custom Job Description Input */}
                   {showCustomInput && (
                     <div className="space-y-4">
                       <div>
                         <textarea
                           value={customJobDescription}
                           onChange={(e) => setCustomJobDescription(e.target.value.slice(0, maxChars))}
                           placeholder=""
                           className="w-full h-64 bg-white/5 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 resize-none text-sm leading-relaxed"
                           disabled={isGeneratingQuestion}
                         />
                         <div className="flex justify-between items-center mt-2">
                           <span className="text-xs text-gray-400">
                             Paste your job description here for personalized interview questions
                           </span>
                           <span className="text-xs text-gray-400">
                             {maxChars - customJobDescription.length} chars left
                           </span>
                         </div>
                       </div>

                       {customJobDescription.trim() && (
                         <div className="flex justify-center">
                           <Button
                             onClick={generateCustomQuestions}
                             disabled={!customJobDescription.trim() || isGeneratingQuestion}
                             className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3"
                           >
                             {isGeneratingQuestion ? (
                               <>
                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                 Generating Questions...
                               </>
                             ) : (
                               <>
                                 Generate Questions
                                 <ArrowRight className="w-4 h-4 ml-2" />
                               </>
                             )}
                           </Button>
                         </div>
                       )}
                     </div>
                   )}
                 </CardContent>
               </Card>
             </motion.div>

            {/* Interview Question Card */}
            {!showCustomInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card border-white/10">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-white leading-relaxed">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Timer Display */}
                  <div className="text-center">
                    <div className="text-4xl font-mono text-gray-300 mb-2">
                      {formatTime(recordingTime)} / {formatTime(maxTime)}
                    </div>
                  </div>

                  {/* Recording Controls */}
                  <div className="flex justify-center gap-4">
                    {!isRecording && !hasRecorded && (
                      <Button
                        onClick={handleStartRecording}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 text-white border-0 rounded-full w-16 h-16 p-0"
                      >
                        <Mic className="w-6 h-6" />
                      </Button>
                    )}
                    
                    {isRecording && (
                      <Button
                        onClick={handleStopRecording}
                        size="lg"
                        className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-full w-16 h-16 p-0 animate-pulse"
                      >
                        <MicOff className="w-6 h-6" />
                      </Button>
                    )}

                    {hasRecorded && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleResetRecording}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Recording Status */}
                  <div className="text-center">
                    {isRecording && (
                      <p className="text-red-400 animate-pulse">🔴 Recording in progress...</p>
                    )}
                    {hasRecorded && !isRecording && (
                      <p className="text-green-400">✅ Recording completed</p>
                    )}
                    {!isRecording && !hasRecorded && (
                      <p className="text-gray-400">Click the microphone to start recording your answer</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            )}

            {/* Feedback Section */}
            {hasRecorded && !showCustomInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Feedback Card */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <Button
                      variant="ghost"
                      onClick={() => setShowFeedback(!showFeedback)}
                      className="flex items-center justify-between w-full text-left p-0 h-auto"
                    >
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                        Feedback
                      </CardTitle>
                      {showFeedback ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </Button>
                  </CardHeader>
                  {showFeedback && (
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-green-400 font-medium mb-2">Strengths:</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Clear articulation of the problem and approach</li>
                            <li>• Good use of specific examples and metrics</li>
                            <li>• Structured response following STAR method</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-yellow-400 font-medium mb-2">Areas for Improvement:</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Could elaborate more on the business impact</li>
                            <li>• Consider mentioning team collaboration aspects</li>
                            <li>• Add more detail about lessons learned</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Sample Response Card */}
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <Button
                      variant="ghost"
                      onClick={() => setShowSampleResponse(!showSampleResponse)}
                      className="flex items-center justify-between w-full text-left p-0 h-auto"
                    >
                      <CardTitle className="text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        Sample Response
                      </CardTitle>
                      {showSampleResponse ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </Button>
                  </CardHeader>
                  {showSampleResponse && (
                    <CardContent>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        <p className="mb-3">
                          "In my previous role as a business analyst, I faced a challenge where customer retention rates were declining by 15% quarter-over-quarter..."
                        </p>
                        <p className="mb-3">
                          "I utilized SQL and Tableau to analyze customer behavior data across 18 months, identifying that 60% of churning customers had specific pain points in our onboarding process..."
                        </p>
                        <p>
                          "The result was a 23% increase in customer retention and $2.3M in prevented revenue loss over 6 months, demonstrating how data-driven insights can directly impact business outcomes."
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Next Question Button */}
            {hasRecorded && !showCustomInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                                 <Button
                   onClick={() => {
                     let nextQuestion: InterviewQuestion;
                     if (selectedRole === 'custom' && customQuestions.length > 0) {
                       const availableQuestions = customQuestions.filter(q => q.id !== currentQuestion.id);
                       if (availableQuestions.length > 0) {
                         nextQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
                       } else {
                         nextQuestion = customQuestions[Math.floor(Math.random() * customQuestions.length)];
                       }
                     } else {
                       nextQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
                     }
                     setCurrentQuestion(nextQuestion);
                     handleResetRecording();
                   }}
                   className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3"
                 >
                   <Sparkles className="w-4 h-4 mr-2" />
                   Next Question
                 </Button>
              </motion.div>
             )}
           </div>
         </div>
       </div>

     </div>
   );
 } 