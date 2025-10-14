'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, X, FileText, Image, AlertCircle, Check, Plus, Sparkles, Brain, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PacmanLoader } from 'react-spinners';
import PlatformIcon from '@/components/ui/platform-icon';
import { isValidFileType, categorizeFile, isValidUrl, categorizePortfolioLink, saveToLocalStorage, generateSessionId, fileToBase64, formatFileSize, processResumeFile, ProcessedResume, validateProcessedResume } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionToken } from '@/lib/auth-helpers';
import { toast } from '@/components/ui/toast';
import Header from '@/components/layout/Header';

export default function ResumeBuilderPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Resume processing states
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>([]);
  const [processingStatus, setProcessingStatus] = useState<Record<string, 'processing' | 'completed' | 'error'>>({});
  
  // Processing logs state
  const [processingLogs, setProcessingLogs] = useState<Record<string, string[]>>({});
  const [showProcessingLogs, setShowProcessingLogs] = useState(false);
  
  // AI Analysis states
  const [isAnalyzingWithClaude, setIsAnalyzingWithClaude] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Individual file progress tracking
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const [showExtractedModal, setShowExtractedModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  // Progress modal UX
  const [modalStep, setModalStep] = useState<number>(0);
  const [latestActivity, setLatestActivity] = useState<string>('');
  
  // Loading state for checking saved resumes
  const [isCheckingSavedResume, setIsCheckingSavedResume] = useState(true);
  const [checkpointCheckComplete, setCheckpointCheckComplete] = useState(false);

  // Auto-scroll ref for console output
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (consoleOutputRef.current) {
      const element = consoleOutputRef.current;
      element.scrollTop = element.scrollHeight;
    }
  };

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (showProcessingLogs) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [processingLogs, showProcessingLogs]);

  // Also scroll when latestActivity changes (for real-time updates)
  useEffect(() => {
    if (showProcessingLogs && latestActivity) {
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [latestActivity, showProcessingLogs]);

  // Scroll to bottom when modal opens
  useEffect(() => {
    if (showProcessingLogs) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [showProcessingLogs]);

  // Add custom styles for enhanced console animations
  const consoleStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
    .animate-slideIn { animation: slideIn 0.3s ease-out; }
    .animate-shake { animation: shake 0.5s ease-in-out; }
  `;

  // Reusable sticky footer component for different steps
  const renderStickyFooter = (stepNumber: number, stepTitle: string, stepDescription: string, progressPercentage: number, showButton: boolean = false, buttonText?: string, buttonAction?: () => void) => (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-pink-900/95 backdrop-blur-xl border-t-2 border-purple-400/50 shadow-2xl shadow-purple-500/30"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left side - Progress and Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  🚀 {stepTitle}
                  <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                </h3>
                <p className="text-purple-200 text-sm font-medium">{stepDescription}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden md:flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-200">Progress:</span>
                <span className="text-xs text-green-400 font-bold">{progressPercentage}% Complete</span>
              </div>
              <div className="w-48 bg-purple-700/50 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 1.5, duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-purple-300">
                <span className={stepNumber >= 1 ? "text-green-400" : ""}>
                  {stepNumber >= 1 ? "✅" : "⏳"} Upload
                </span>
                <span className={stepNumber >= 2 ? "text-green-400" : ""}>
                  {stepNumber >= 2 ? "✅" : "⏳"} Analysis
                </span>
                <span className={stepNumber >= 3 ? "text-green-400 font-bold" : ""}>
                  {stepNumber >= 3 ? "✅" : "→"} Build
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Action Button (if provided) */}
          {showButton && buttonText && buttonAction && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              
              <Button 
                className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold px-12 py-6 rounded-2xl shadow-2xl shadow-purple-500/50 border-2 border-purple-300/30 transition-all duration-300 text-lg"
                onClick={buttonAction}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-7 w-7" />
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold leading-tight">{buttonText}</span>
                    <span className="text-sm opacity-90 leading-tight">🤖 AI-powered • 📈 Optimized • 🎯 Job-ready</span>
                  </div>
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-2xl"
                  >
                    →
                  </motion.div>
                </div>
              </Button>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-cyan-400 text-green-900 text-sm font-bold px-3 py-1 rounded-full shadow-xl border-2 border-white/20 animate-bounce">
                NEXT STEP
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile version - simplified layout */}
        <div className="md:hidden mt-4 pt-4 border-t border-purple-400/30">
          <div className="flex items-center justify-center gap-4 text-xs text-purple-200">
            <span className={stepNumber >= 1 ? "text-green-400" : ""}>
              {stepNumber >= 1 ? "✅" : "⏳"} Upload {stepNumber >= 1 ? "Complete" : ""}
            </span>
            <span className={stepNumber >= 2 ? "text-green-400" : ""}>
              {stepNumber >= 2 ? "✅" : "⏳"} Analysis {stepNumber >= 2 ? "Done" : ""}
            </span>
            <span className={stepNumber >= 3 ? "text-green-400 font-bold" : ""}>
              {stepNumber >= 3 ? "✅" : "→"} Ready to Build
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Check checkpoints in priority order: saved_resumes -> resumes_generated -> ai_analysis_results -> resumes_extracted
  useEffect(() => {
    const checkCheckpoints = async () => {
      if (!user?.id) {
        setIsCheckingSavedResume(false);
        setCheckpointCheckComplete(true);
        return;
      }

      try {
        const sessionToken = await getSessionToken();
        if (!sessionToken) {
          setIsCheckingSavedResume(false);
          setCheckpointCheckComplete(true);
          return;
        }

        // 1. Check saved_resumes (highest priority - redirect to resume page)
        const savedResumeRes = await fetch('/api/user/saved-resumes', {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'x-user-id': String(user.id)
          },
          cache: 'no-store'
        });

        const savedResumeText = await savedResumeRes.text();
        let savedResumeData: any = null;
        try { savedResumeData = JSON.parse(savedResumeText); } catch {}

        if (savedResumeRes.ok && savedResumeData?.success && savedResumeData?.hasSavedResume && savedResumeData?.resumeSlug) {
          console.log('✅ User has saved resume, redirecting to:', savedResumeData.resumeSlug);
          router.push(`/resume/${savedResumeData.resumeSlug}`);
          return;
        }

        // 2. Check resumes_generated (redirect to build page with preview)
        const generatedResumeRes = await fetch('/api/user/resumes-generated', {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'x-user-id': String(user.id)
          },
          cache: 'no-store'
        });

        const generatedResumeText = await generatedResumeRes.text();
        let generatedResumeData: any = null;
        try { generatedResumeData = JSON.parse(generatedResumeText); } catch {}

        if (generatedResumeRes.ok && generatedResumeData?.success && generatedResumeData?.hasGeneratedResume) {
          setShowGeneratedModal(true);
          setIsCheckingSavedResume(false);
          setCheckpointCheckComplete(true);
          return;
        }

        // 3. Check ai_analysis_results (redirect to analysis page)
        const analysisRes = await fetch('/api/user/analysis-results', {
          headers: { Authorization: `Bearer ${sessionToken}` },
          cache: 'no-store'
        });

        const analysisText = await analysisRes.text();
        let analysisData: any = null;
        try { analysisData = JSON.parse(analysisText); } catch {}

        if (analysisRes.ok && analysisData?.found) {
          setShowAnalysisModal(true);
          setIsCheckingSavedResume(false);
          setCheckpointCheckComplete(true);
          return;
        }

        // 4. Check resumes_extracted (show modal to continue or start over)
        const extractedRes = await fetch('/api/user/extracted-resume', {
          headers: { Authorization: `Bearer ${sessionToken}` },
          cache: 'no-store'
        });

        const extractedText = await extractedRes.text();
        let extractedData: any = null;
        try { extractedData = JSON.parse(extractedText); } catch {}

        if (extractedRes.ok && extractedData?.hasData) {
          setShowExtractedModal(true);
          setIsCheckingSavedResume(false);
          setCheckpointCheckComplete(true);
          return;
        }

        // No checkpoints found, allow resume builder access
        console.log('ℹ️ No checkpoints found, allowing resume builder access');
        setIsCheckingSavedResume(false);
        setCheckpointCheckComplete(true);
      } catch (error) {
        console.error('Error checking checkpoints:', error);
        setIsCheckingSavedResume(false);
        setCheckpointCheckComplete(true);
      }
    };

    checkCheckpoints();
  }, [user?.id, router]);

  // Trigger header SignUp dialog via URL param when not logged in
  const openSignup = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('signup', 'true');
    // Preserve other params but ensure signup=true
    router.push(`${url.pathname}?${url.searchParams.toString()}`);
  };

  // Redirect users who already have a saved resume
  useEffect(() => {
    // Show deletion notice if coming from a delete action
    try {
      if (sessionStorage.getItem('resumeDeleted') === '1') {
        toast.info('Your resume was deleted. Create a new resume to view your profile again.');
        sessionStorage.removeItem('resumeDeleted');
      }
    } catch {}

  }, [router]);


  // Handle file drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!user) { openSignup(); return; }
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    if (!user) { openSignup(); return; }
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    files.forEach(file => {
      if (!isValidFileType(file)) {
        newErrors.push(`${file.name}: Unsupported file type. Please upload PDF, DOC, DOCX, or image files.`);
      } else if (file.size > 10 * 1024 * 1024) { // 10MB limit
        newErrors.push(`${file.name}: File too large. Maximum size is 10MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(prev => [...prev, ...newErrors]);
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      setErrors(prev => prev.filter(error => !newErrors.includes(error)));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addPortfolioLink = () => {
    if (!user) { openSignup(); return; }
    if (!newLink.trim()) return;

    if (!isValidUrl(newLink)) {
      setErrors(prev => [...prev, 'Please enter a valid URL']);
      return;
    }

    if (portfolioLinks.includes(newLink)) {
      setErrors(prev => [...prev, 'This URL has already been added']);
      return;
    }

    setPortfolioLinks(prev => [...prev, newLink]);
    setNewLink('');
    setErrors(prev => prev.filter(error => !error.includes('URL')));
  };

  const removeLink = (index: number) => {
    setPortfolioLinks(prev => prev.filter((_, i) => i !== index));
  };

  const canContinue = uploadedFiles.length > 0 || portfolioLinks.length > 0;

  // Fetch API keys securely and process file on client
  const processFileWithAPI = async (file: File, log: (message: string) => void) => {
    try {
      log(`🔐 Fetching secure API keys...`);
      
      // Fetch API keys from secure server endpoint
      const keyResponse = await fetch('/api/get-api-key');
      if (!keyResponse.ok) {
        throw new Error('Failed to fetch API keys from server');
      }
      
      const keyResult = await keyResponse.json();
      if (!keyResult.success) {
        throw new Error(keyResult.error || 'API keys not available');
      }
      
      log(`✅ API keys obtained, processing file with CloudConvert + GPT pipeline...`);
      
      // Process file using the updated CloudConvert + GPT pipeline with API keys
      const processedResume = await processResumeFileWithLogs(file, keyResult.openaiApiKey, keyResult.cloudConvertApiKey, (m) => {
        log(m)
        if (m.includes('converted to JPEG format')) {
          log('🔎 Verifying multi-page conversion…')
        }
      });
      
      return processedResume;
      
    } catch (error) {
      log(`❌ Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  // Custom logger to capture processing logs
  const createFileLogger = (fileName: string) => {
    const logs: string[] = [];
    
    const log = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] ${message}`;
      logs.push(logEntry);
      console.log(message); // Still log to console
      setLatestActivity(message);
      
      // Update logs state
      setProcessingLogs(prev => ({
        ...prev,
        [fileName]: [...logs]
      }));
      
      // Auto-scroll console to bottom
      setTimeout(() => {
        const consoleEl = document.querySelector('.console-output-container');
        if (consoleEl) {
          consoleEl.scrollTop = consoleEl.scrollHeight;
        }
      }, 100);
    };
    
    return { log, getLogs: () => logs };
  };

  // Process uploaded files to JSON using OpenAI
  const processUploadedFiles = async () => {
    if (!user) { openSignup(); return; }
    
    if (uploadedFiles.length === 0) return;

    // Clear previous logs and show processing
    setProcessingLogs({});
    setShowProcessingLogs(false);
    setIsAnalyzingWithClaude(true);
    setShowProgressModal(true);
    setModalStep(0);
    setLatestActivity('');
    setAnalysisProgress(0);
    
    // Initialize individual file progress
    const initialFileProgress: Record<string, number> = {};
    uploadedFiles.forEach(file => {
      initialFileProgress[file.name] = 0;
    });
    setFileProgress(initialFileProgress);

    // Intercept console.log to capture all logs and track progress
    const originalConsoleLog = console.log;
    let currentProcessingFile = '';
    
    // Progress mapping based on actual console logs from utils.ts
    const progressMap: Record<string, { progress: number; step: number }> = {
      '🚀 Starting CloudConvert + GPT OCR pipeline': { progress: 5, step: 1 },
      '📋 New Process: File → CloudConvert': { progress: 7, step: 1 },
      '🎯 CloudConvert handles document conversion': { progress: 8, step: 1 },
      '💰 Token tracking initialized': { progress: 10, step: 1 },
      '📤 Step 1: Converting file to JPEG format': { progress: 15, step: 1 },
      '🔍 Determining conversion method': { progress: 18, step: 1 },
      '✅ Step 1 Complete: File converted to JPEG format': { progress: 30, step: 1 },
      '🤖 Step 2: Performing GPT Vision OCR': { progress: 35, step: 2 },
      '✅ Step 2 Complete: Text extracted via GPT OCR': { progress: 55, step: 2 },
      '🧪 DOCX/DOC detected': { progress: 57, step: 2 },
      '📄 Step 3: Creating organized DOCX': { progress: 60, step: 3 },
      '✅ Step 3 Complete: Organized DOCX created': { progress: 70, step: 3 },
      '🔄 Step 4: Converting DOCX content to structured JSON': { progress: 75, step: 3 },
      '✅ Step 4 Complete: JSON extracted from DOCX content': { progress: 85, step: 4 },
      '🏗️ Step 5: Building final resume': { progress: 90, step: 4 },
      '✅ Pipeline Complete: CloudConvert + GPT OCR processing successful': { progress: 95, step: 4 },
      '💰 FINAL SESSION SUMMARY': { progress: 100, step: 4 },
    };
    
    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      originalConsoleLog(...args); // Still log to actual console
      
      // Add to processing logs for current file
      if (currentProcessingFile) {
        setProcessingLogs(prev => {
          const existingLogs = prev[currentProcessingFile] || [];
          return {
            ...prev,
            [currentProcessingFile]: [...existingLogs, message]
          };
        });
        setLatestActivity(message);
        
        // Update progress based on console log patterns
        for (const [pattern, { progress, step }] of Object.entries(progressMap)) {
          if (message.includes(pattern)) {
            setFileProgress(prev => ({ ...prev, [currentProcessingFile]: progress }));
            setAnalysisProgress(progress);
            setModalStep(step);
            
            // Special message at 90%
            if (progress === 90) {
              setTimeout(() => {
                setProcessingLogs(prev => {
                  const existingLogs = prev[currentProcessingFile] || [];
                  return {
                    ...prev,
                    [currentProcessingFile]: [...existingLogs, '⏳ Please wait a minute - This step takes a while as we finalize your data...']
                  };
                });
              }, 500);
            }
            break;
          }
        }
      }
    };

    const processedResults: ProcessedResume[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      currentProcessingFile = file.name; // Track current file
      const { log } = createFileLogger(file.name);
      setProcessingStatus(prev => ({ ...prev, [file.name]: 'processing' }));
      
      try {
        // Process with server-side API (this will handle all the step logging and progress)
        // Progress is automatically tracked by console log interceptor above
        const processedResume = await processFileWithAPI(file, log);
        processedResults.push(processedResume);
        
        setProcessingStatus(prev => ({ ...prev, [file.name]: 'completed' }));
        setFileProgress(prev => ({ ...prev, [file.name]: 100 }));
        
        log(`✅ File ${i + 1}/${uploadedFiles.length} completed`);
        
        // If there are multiple files, ensure overall progress reflects completion
        if (uploadedFiles.length > 1) {
          const overallProgress = ((i + 1) / uploadedFiles.length) * 100;
          setAnalysisProgress(overallProgress);
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${file.name}:`, error);
        const { log } = createFileLogger(file.name);
        log(`❌ Processing failed for: ${file.name}`);
        
        setProcessingStatus(prev => ({ ...prev, [file.name]: 'error' }));
        setFileProgress(prev => ({ ...prev, [file.name]: 0 }));
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setErrors(prev => [...prev, `Failed to process ${file.name}: ${errorMessage}`]);
      }
    }
    
    setProcessedResumes(processedResults);
    
    // Restore original console.log
    console.log = originalConsoleLog;
    
    // Keep modal open to show completion + CTA
    setIsAnalyzingWithClaude(false);
    setAnalysisProgress(100);
  };

  // Process a single resume file - Progress is now tracked automatically via console log interception
  const processResumeFileWithLogs = async (file: File, openaiApiKey: string, cloudConvertApiKey: string, log: (message: string) => void): Promise<ProcessedResume> => {
    // Get session token for database storage
    const sessionToken = await getSessionToken();
    
    try {
      // Call the actual processing function - progress is tracked automatically by console log interceptor
      const result = await processResumeFile(file, openaiApiKey, cloudConvertApiKey, sessionToken ?? undefined);
      
      return result;
    } catch (error) {
      log(`❌ Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const handleContinue = async () => {
    if (!canContinue) return;

    setLoading(true);
    
    try {
      // Generate session ID and save data
      const sessionId = generateSessionId();
      
      // Save uploaded files info
      const fileInfo = uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        category: categorizeFile(file)
      }));

      // Save portfolio links with categorization
      const linkInfo = portfolioLinks.map(link => ({
        url: link,
        type: categorizePortfolioLink(link),
        title: new URL(link).hostname
      }));

      // Convert files to base64 for storage and API processing
      const processedFiles = await Promise.all(
        uploadedFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          data: await fileToBase64(file)
        }))
      );

      // Save to localStorage for persistence
      saveToLocalStorage('bpoc_session_id', sessionId);
      saveToLocalStorage('bpoc_uploaded_files', fileInfo);
      saveToLocalStorage('bpoc_portfolio_links', linkInfo);
      saveToLocalStorage('bpoc_processed_files', processedFiles);
      saveToLocalStorage('bpoc_processed_resumes', processedResumes);

      // Navigate to analysis page
      router.push('/resume-builder/analysis');
      
    } catch (error) {
      console.error('Error saving upload data:', error);
      setErrors(prev => [...prev, 'Failed to save upload data. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5 text-purple-400" />;
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5 text-red-400" />;
    if (file.type.includes('word') || file.type.includes('document')) return <FileText className="h-5 w-5 text-blue-400" />;
    return <FileText className="h-5 w-5 text-cyan-400" />;
  };

  const getFileTypeBadge = (file: File) => {
    const category = categorizeFile(file);
    const colorMap: { [key: string]: string } = {
      'PDF Document': 'bg-red-500/20 text-red-400 border-red-400/30',
      'Word Document': 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      'Image': 'bg-purple-500/20 text-purple-400 border-purple-400/30',
      'Document': 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${colorMap[category] || colorMap['Document']}`}
      >
        {category}
      </Badge>
    );
  };

  const getLinkIcon = (url: string) => {
    const type = categorizePortfolioLink(url);
    return type;
  };

  // Progress is now tracked by actual processing steps, not simulated



  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Default BPOC Header */}
      <Header />
      
      {/* Checkpoint Loading Screen */}
      {!checkpointCheckComplete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40">
          <div className="flex items-center justify-center min-h-screen pb-32">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md mx-4 text-center">
              <div className="flex justify-center mb-4">
                <PacmanLoader 
                  color="#fbbf24" 
                  size={40}
                  margin={4}
                  speedMultiplier={1.2}
                />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">Checking Your Progress</h3>
              <p className="text-gray-300 text-sm">
                We're checking if you have any existing resume data to continue with...
              </p>
            </div>
          </div>
          {renderStickyFooter(
            0, 
            "Step 0: Checking Progress", 
            "Looking for existing resume data to continue your workflow...", 
            0, 
            false
          )}
        </div>
      )}
      
      {/* Main Content - Only show when checkpoint check is complete */}
      {checkpointCheckComplete && (
        <>
          {/* Progress Modal */}
          <Dialog open={showProgressModal} onOpenChange={(open) => {
        // Only allow closing if processing is complete
        if (!open && (isAnalyzingWithClaude || processedResumes.length === 0)) {
          return; // Prevent closing during processing
        }
        setShowProgressModal(open);
      }}>
        <DialogContent 
          showCloseButton={false}
          className="max-w-3xl w-full bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-pink-900/95 border-purple-400/50"
          onInteractOutside={(e) => {
            // Prevent closing during processing
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing during processing
            e.preventDefault();
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-pulse rounded-lg"></div>
          <DialogHeader className="relative">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              Extracting Resume Data…
            </DialogTitle>
            <DialogDescription className="text-purple-200 text-base">
              This usually takes about 2–3 minutes. We'll keep you updated with each step.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4 flex flex-col items-center relative">
            {processedResumes.length === 0 && (
              <>
                <div className="flex justify-center">
                  <PacmanLoader 
                    color="#fbbf24" 
                    size={40}
                    margin={4}
                    speedMultiplier={1.2}
                  />
                </div>
                <div className="max-w-2xl mx-auto space-y-2 w-full">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Progress</span>
                    <span className="text-green-400 font-bold">{Math.round(analysisProgress)}% Complete</span>
                  </div>
                  <div className="w-full bg-purple-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  {/* Activity steps */}
                  <div className="text-left text-sm mt-3 space-y-1">
                    <div className={`flex items-center gap-2 ${modalStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
                      <span>•</span>
                      <span>Converting document (CloudConvert)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${modalStep >= 2 ? 'text-white' : 'text-gray-400'}`}>
                      <span>•</span>
                      <span>Reading pages (GPT Vision / OCR)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${modalStep >= 3 ? 'text-white' : 'text-gray-400'}`}>
                      <span>•</span>
                      <span>Extracting and organizing content</span>
                    </div>
                    <div className={`flex items-center gap-2 ${modalStep >= 4 ? 'text-white' : 'text-gray-400'}`}>
                      <span>•</span>
                      <span>Saving extracted data</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Live Console Output Display */}
                  <div className="mt-4">
                    <style dangerouslySetInnerHTML={{ __html: consoleStyles }} />
                    <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-purple-500/40 rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20 backdrop-blur-sm">
                      {/* Enhanced Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-b border-purple-500/40">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-sm shadow-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-sm shadow-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-sm shadow-green-500/50"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-sm font-bold text-purple-200">Live Console</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-purple-300">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                            <span>Processing</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Console Content */}
                      <div 
                        ref={consoleOutputRef}
                        className="console-output-container p-4 max-h-72 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-800/50"
                        style={{ scrollBehavior: 'smooth' }}
                      >
                        <div className="space-y-1.5 text-left font-mono text-sm">
                          {Object.entries(processingLogs).map(([fileName, logs]) => (
                            <div key={fileName}>
                              {logs.map((log, idx) => {
                                // Parse emoji and message
                                const isError = log.includes('❌');
                                const isSuccess = log.includes('✅');
                                const isWarning = log.includes('⏳');
                                const isInfo = log.includes('🚀') || log.includes('📤') || log.includes('🤖') || log.includes('📝') || log.includes('🔄') || log.includes('📊') || log.includes('🏗️') || log.includes('📖') || log.includes('💰');
                                
                                // Check if this log represents a completed step
                                const isCompletedStep = isSuccess || log.includes('Complete') || log.includes('✅');
                                
                                // Get current progress for this file
                                const currentProgress = fileProgress[fileName] || 0;
                                
                                // Simple completion detection based on common patterns
                                const isCompletedLog = isCompletedStep || 
                                  log.includes('Complete') || 
                                  log.includes('✅') ||
                                  log.includes('saved') ||
                                  log.includes('finished') ||
                                  log.includes('done') ||
                                  (currentProgress >= 90); // High progress indicates completion
                                
                                let textColor = 'text-white'; // Default to white for pending
                                let bgColor = '';
                                
                                if (isError) {
                                  textColor = 'text-red-400';
                                  bgColor = 'bg-red-500/5';
                                } else if (isSuccess || isCompletedLog) {
                                  textColor = 'text-green-400'; // Green for completed
                                  bgColor = 'bg-green-500/5';
                                } else if (isWarning) {
                                  textColor = 'text-yellow-400';
                                  bgColor = 'bg-yellow-500/5';
                                } else if (isInfo) {
                                  textColor = 'text-cyan-400';
                                } else {
                                  textColor = 'text-white'; // White for pending/current logs
                                }
                                
                                // Add animation classes based on log type
                                const animationClass = isCompletedLog ? 'animate-fadeIn' : 
                                                    isError ? 'animate-shake' : 
                                                    'animate-slideIn';
                                
                                // Add timestamp for better UX
                                const timestamp = new Date().toLocaleTimeString();
                                
                                return (
                                  <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ 
                                      duration: 0.3, 
                                      delay: idx * 0.05,
                                      ease: "easeOut"
                                    }}
                                    className={`${textColor} ${bgColor} leading-relaxed py-2 px-3 rounded-lg border-l-2 transition-all duration-300 hover:shadow-md ${
                                      isCompletedLog ? 'border-l-green-400 bg-green-500/10' :
                                      isError ? 'border-l-red-400 bg-red-500/10' :
                                      isWarning ? 'border-l-yellow-400 bg-yellow-500/10' :
                                      'border-l-purple-400 bg-purple-500/5'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="flex-shrink-0 mt-0.5">
                                        {isCompletedLog && <span className="text-green-400">✓</span>}
                                        {isError && <span className="text-red-400">✗</span>}
                                        {isWarning && <span className="text-yellow-400">⚠</span>}
                                        {!isCompletedLog && !isError && !isWarning && (
                                          <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                            {idx === logs.length - 1 && (
                                              <div className="w-0.5 h-3 bg-current animate-pulse"></div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">{log}</span>
                                          <span className="text-xs opacity-60 ml-2 flex-shrink-0">
                                            {timestamp}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ))}
                          {Object.keys(processingLogs).length === 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-center py-8"
                            >
                              <div className="text-center">
                                <div className="w-8 h-8 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                                </div>
                                <div className="text-gray-400 text-sm">Waiting for processing to start...</div>
                                <div className="text-gray-500 text-xs mt-1">Console will show real-time updates here</div>
                              </div>
                            </motion.div>
                          )}
                          
                          {/* Real-time activity indicator */}
                          {latestActivity && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-2 p-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg"
                            >
                              <div className="flex items-center gap-2 text-xs text-purple-300">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                <span className="font-medium">Latest:</span>
                                <span className="text-white">{latestActivity}</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Completion & CTA inside modal when extraction finishes */}
          {processedResumes.length > 0 && !isAnalyzingWithClaude && (
            <div className="mt-6 relative">
              <div className="max-w-sm mx-auto mb-3">
                <div className="border border-green-400/30 bg-green-500/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-green-400 font-bold text-base">Extraction Complete</h3>
                      <p className="text-purple-200 text-sm">Your resume data has been extracted.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-purple-100 text-base font-medium mb-4">Ready for Step 2: Analyze resume data</div>
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Extracted Data
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Modal: Continue from extracted checkpoint */}
      <Dialog open={showExtractedModal} onOpenChange={setShowExtractedModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue your resume?</DialogTitle>
            <DialogDescription>
              We found existing extracted resume data. Continue directly to AI analysis or start over.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium text-sm mb-2">⚠️ Starting over will delete:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Extracted resume data</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowExtractedModal(false); router.push('/resume-builder/analysis') }} className="bg-cyan-600 hover:bg-cyan-700">
              Continue to Analysis
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-gray-300 hover:bg-white/10"
              onClick={async () => {
                try {
                  const token = await getSessionToken();
                  if (token) {
                    // Only clear extracted resume data
                    await fetch('/api/user/extracted-resume', { 
                      method: 'DELETE', 
                      headers: { 
                        Authorization: `Bearer ${token}`,
                        'x-user-id': String(user?.id)
                      } 
                    }).catch(() => {})
                  }
                } catch {}
                setShowExtractedModal(false)
                toast.success('Extracted resume data cleared. You can upload a new resume.')
              }}
            >
              Start Over
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Continue from generated resume checkpoint */}
      <Dialog open={showGeneratedModal} onOpenChange={setShowGeneratedModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue with your generated resume?</DialogTitle>
            <DialogDescription>
              We found an existing generated resume. You can continue building with the existing resume or start over with a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium text-sm mb-2">⚠️ Starting over will delete:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Generated resume data</li>
                <li>• AI analysis results</li>
                <li>• Extracted resume data</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowGeneratedModal(false); router.push('/resume-builder/build') }} className="bg-cyan-600 hover:bg-cyan-700">
              Continue Building Resume
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-gray-300 hover:bg-white/10"
              onClick={async () => {
                try {
                  const token = await getSessionToken();
                  if (token) {
                    // Only clear generated resume, AI analysis, and extracted resume data
                    await fetch('/api/user/resumes-generated', { 
                      method: 'DELETE', 
                      headers: { 
                        Authorization: `Bearer ${token}`,
                        'x-user-id': String(user?.id)
                      } 
                    }).catch(() => {})
                    await fetch('/api/user/analysis-results', { 
                      method: 'DELETE', 
                      headers: { 
                        Authorization: `Bearer ${token}`,
                        'x-user-id': String(user?.id)
                      } 
                    }).catch(() => {})
                    await fetch('/api/user/extracted-resume', { 
                      method: 'DELETE', 
                      headers: { 
                        Authorization: `Bearer ${token}`,
                        'x-user-id': String(user?.id)
                      } 
                    }).catch(() => {})
                  }
                } catch {}
                setShowGeneratedModal(false)
                toast.success('Generated resume, analysis, and extracted data cleared. You can upload a new resume.')
              }}
            >
              Start Over
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Continue from analysis results checkpoint */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue building your resume?</DialogTitle>
            <DialogDescription>
              We found existing AI analysis results. You can continue building your resume with the existing analysis or start over with a new resume.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium text-sm mb-2">⚠️ Starting over will delete:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• AI analysis results</li>
                <li>• Extracted resume data</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowAnalysisModal(false); router.push('/resume-builder/analysis') }} className="bg-cyan-600 hover:bg-cyan-700">
              Continue Building Resume
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-gray-300 hover:bg-white/10"
              onClick={async () => {
                try {
                  const token = await getSessionToken();
                  if (token) {
                    // Only clear AI analysis and extracted resume data
                    await fetch('/api/user/analysis-results', { 
                      method: 'DELETE', 
                      headers: { 
                        Authorization: `Bearer ${token}`,
                        'x-user-id': String(user?.id)
                      } 
                    }).catch(() => {})
                    await fetch('/api/user/extracted-resume', { 
                      method: 'DELETE', 
                      headers: { 
                        Authorization: `Bearer ${token}`,
                        'x-user-id': String(user?.id)
                      } 
                    }).catch(() => {})
                  }
                } catch {}
                setShowAnalysisModal(false)
                toast.success('AI analysis and extracted data cleared. You can upload a new resume.')
              }}
            >
              Start Over
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-cyan-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                AI Powered Resume Builder
              </h1>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Upload your current resume and we’ll use AI to analyze it, extract your data, and generate a new, improved version.
            </p>
          </motion.div>



        {/* Main Upload Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* File Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Upload className="h-5 w-5 text-cyan-400" />
                      Upload Files
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Resume • Certificates • Work Samples
                      <br />
                      <span className="text-cyan-400">PDF, DOC, DOCX, JPG, PNG</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Drop Zone */}
                    <div
                      className={`relative p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
                        dragActive 
                          ? 'border-cyan-400 bg-cyan-400/5' 
                          : 'border-white/20 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                          Drop Files Here
                        </h3>
                        <p className="text-gray-400 mb-4">
                          or click to browse files
                        </p>
                        <Button variant="outline" className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
                          Browse Files
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif"
                        onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                        className="hidden"
                      />
                    </div>



                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-400" />
                          Uploaded Files:
                        </h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center justify-between p-3 glass-card rounded-lg border border-white/10"
                            >
                              <div className="flex items-center gap-3">
                                {getFileIcon(file)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-white font-medium">{file.name}</p>
                                    {getFileTypeBadge(file)}
                                  </div>
                                  <p className="text-gray-400 text-sm">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Portfolio Links Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass-card border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <ExternalLink className="h-5 w-5 text-purple-400" />
                      Portfolio Links
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      <span className="text-purple-400">LinkedIn • GitHub • Personal Website • Portfolio</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Link Input */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        placeholder="https://linkedin.com/in/yourname"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50"
                        onKeyPress={(e) => e.key === 'Enter' && addPortfolioLink()}
                      />
                      <Button onClick={addPortfolioLink} className="bg-purple-500 hover:bg-purple-600 px-3 py-2 h-auto">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Portfolio Links List */}
                    {portfolioLinks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-400" />
                          Portfolio Links:
                        </h4>
                        <div className="space-y-2">
                          {portfolioLinks.map((link, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center justify-between p-3 glass-card rounded-lg border border-white/10"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
                                  <PlatformIcon 
                                    platform={getLinkIcon(link) as any} 
                                    size={16} 
                                    className="text-white"
                                  />
                                </div>
                                <div>
                                  <p className="text-white font-medium">
                                    {new URL(link).hostname}
                                  </p>
                                  <p className="text-gray-400 text-sm truncate max-w-xs">
                                    {link}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLink(index)}
                                className="text-gray-400 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Add Buttons */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-gray-400 text-sm mb-3">Quick add common platforms:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewLink('https://linkedin.com/in/')}
                          className="border-white/20 text-gray-300 hover:bg-white/10"
                        >
                          <PlatformIcon platform="linkedin" size={16} className="mr-2 text-blue-400" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewLink('https://github.com/')}
                          className="border-white/20 text-gray-300 hover:bg-white/10"
                        >
                          <PlatformIcon platform="github" size={16} className="mr-2 text-gray-400" />
                          GitHub
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewLink('https://behance.net/')}
                          className="border-white/20 text-gray-300 hover:bg-white/10"
                        >
                          <PlatformIcon platform="behance" size={16} className="mr-2 text-blue-600" />
                          Behance
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewLink('https://')}
                          className="border-white/20 text-gray-300 hover:bg-white/10"
                        >
                          🌐 Website
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="glass-card border-red-500/30 bg-red-500/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-400 mb-2">Please fix these issues:</h4>
                        <ul className="space-y-1">
                          {errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-300">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Process Files Section */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                      Step 1: Resume Data Extraction
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      We will extract your data to analyze your current resume.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Process Files Button */}
                    <div className="text-center space-y-4">
                      {/* Only show Analyze button if not completed */}
                      {processedResumes.length === 0 && !isAnalyzingWithClaude && (
                        <Button
                          onClick={processUploadedFiles}
                          disabled={uploadedFiles.length === 0 || Object.keys(processingStatus).some(key => processingStatus[key] === 'processing')}
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3 shadow-lg shadow-cyan-500/25"
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                          Begin Resume Extraction
                        </Button>
                      )}
                      
                      {/* Loading moved to modal; inline loader removed */}
                      
                      {/* Processing Logs with Enhanced Progress Bar */}
                      {showProcessingLogs && Object.keys(processingLogs).length > 0 && !isAnalyzingWithClaude && (
                        <div className="max-w-2xl mx-auto">
                          <div className="space-y-4">
                            {Object.entries(processingLogs).map(([fileName, logs]) => (
                              <motion.div 
                                key={fileName} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card border-white/10 rounded-lg p-4 shadow-lg"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-cyan-400" />
                                    <span className="text-white font-medium text-sm">{fileName}</span>
                                  </div>
                                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                    {fileProgress[fileName]}% complete
                                  </Badge>
                                </div>
                                
                                {/* Enhanced Progress Bar */}
                                <div className="mb-3">
                                  <Progress 
                                    value={fileProgress[fileName]} 
                                    className="h-2 bg-white/10"
                                  />
                                </div>
                                
                                {/* Latest Log Message */}
                                <div className="text-sm text-gray-300 font-mono bg-black/20 rounded p-2">
                                  {logs.length > 0 ? logs[logs.length - 1] : 'Processing...'}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Completion Message */}
                      {processedResumes.length > 0 && !isAnalyzingWithClaude && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="max-w-sm mx-auto"
                        >
                          <Card className="glass-card border-green-500/30 bg-green-500/5 p-4">
                            <CardContent className="p-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                  <Check className="h-3 w-3 text-green-400" />
                                </div>
                                <div>
                                  <h3 className="text-green-400 font-medium text-sm">Extraction Complete</h3>
                                  <p className="text-gray-300 text-xs">Your resume data has been extracted.</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {/* Continue to Analysis Button - Only show when analysis is complete */}
                      {processedResumes.length > 0 && !isAnalyzingWithClaude && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center mt-6"
                        >
                          <div className="text-gray-300 text-sm mb-3">Ready for Step 2: Analyze resume data</div>
                          <Button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            size="lg"
                            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                            Analyze Extracted Data
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Continue from checkpoint Section removed; handled via modal */}

            {/* Continue Button */}
            {/* This section is now moved inside the AI-Powered Resume Analysis card */}
            
            {/* Help text for when no files are uploaded */}
            {!canContinue && processedResumes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center pb-32"
              >
                <p className="text-gray-400 text-sm">
                  Please upload at least one file, portfolio links are optional
                </p>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Sticky Footer for Step 1 */}
        {renderStickyFooter(
          1, 
          "Step 1: Upload Files", 
          "Upload your resume and portfolio links to get started with AI analysis", 
          canContinue ? (processedResumes.length > 0 ? 25 : 15) : 0, 
          canContinue && processedResumes.length > 0,
          "Continue to Analysis",
          handleContinue
        )}
      </div>
      </>
      )}

    </div>
  );
} 