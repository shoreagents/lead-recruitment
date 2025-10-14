'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PacmanLoader } from 'react-spinners';
import { 
  Download, 
  Share2, 
  Eye, 
  Calendar,
  User,
  Building,
  GraduationCap,
  Award,
  Code,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Gamepad2,
  Briefcase,
  FileText,
  Trophy,
  Crown,
  Medal,
  Zap,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Calculator,
  Brain,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Unlock,
  Settings,
  RefreshCw,
  Save,
  Upload,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Heart,
  Bookmark,
  Flag,
  Shield,
  Clock,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Timer,
  StopCircle,
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw as RotateCcwIcon,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  Pen,
  Pencil,
  Eraser,
  Paintbrush,
  Palette,
  Image,
  Video,
  Music,
  File,
  Folder,
  Archive,
  Inbox,
  Outbox,
  Trash,
  Recycle,
  Restore,
  Undo,
  Redo,
  Cut,
  Copy as CopyIcon,
  Paste,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  ClipboardCopy,
  ClipboardPaste,
  ClipboardX,
  ClipboardMinus,
  ClipboardPlus,
  ClipboardEdit,
  ClipboardSearch,
  ClipboardDownload,
  ClipboardUpload,
  ClipboardShare,
  ClipboardHeart,
  ClipboardStar,
  ClipboardFlag,
  ClipboardBookmark,
  ClipboardLock,
  ClipboardUnlock,
  ClipboardSettings,
  ClipboardRefresh,
  ClipboardSave,
  ClipboardUpload as ClipboardUploadIcon,
  ClipboardDownload as ClipboardDownloadIcon,
  ClipboardShare as ClipboardShareIcon,
  ClipboardHeart as ClipboardHeartIcon,
  ClipboardStar as ClipboardStarIcon,
  ClipboardFlag as ClipboardFlagIcon,
  ClipboardBookmark as ClipboardBookmarkIcon,
  ClipboardLock as ClipboardLockIcon,
  ClipboardUnlock as ClipboardUnlockIcon,
  ClipboardSettings as ClipboardSettingsIcon,
  ClipboardRefresh as ClipboardRefreshIcon,
  ClipboardSave as ClipboardSaveIcon,
  ClipboardUpload as ClipboardUploadIcon2,
  ClipboardDownload as ClipboardDownloadIcon2,
  ClipboardShare as ClipboardShareIcon2,
  ClipboardHeart as ClipboardHeartIcon2,
  ClipboardStar as ClipboardStarIcon2,
  ClipboardFlag as ClipboardFlagIcon2,
  ClipboardBookmark as ClipboardBookmarkIcon2,
  ClipboardLock as ClipboardLockIcon2,
  ClipboardUnlock as ClipboardUnlockIcon2,
  ClipboardSettings as ClipboardSettingsIcon2,
  ClipboardRefresh as ClipboardRefreshIcon2,
  ClipboardSave as ClipboardSaveIcon2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/toast';
import { formatNumber, generateInitials } from '@/lib/utils';

interface SavedResume {
  id: string;
  slug: string;
  title: string;
  data: any;
  template: string;
  originalResumeId: string | null;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    location: string;
    position: string;
  };
}

export default function ResumeSlugPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;
  
  const [resume, setResume] = useState<SavedResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('resume');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);


  const [typingStats, setTypingStats] = useState<any | null>(null);
  const [typingLatest, setTypingLatest] = useState<any | null>(null);
  const [discStats, setDiscStats] = useState<any | null>(null);
  const [discLatest, setDiscLatest] = useState<any | null>(null);
  const [ultimateStats, setUltimateStats] = useState<any | null>(null);
  const [ultimateLatest, setUltimateLatest] = useState<any | null>(null);
  const [culturalStats, setCulturalStats] = useState<any | null>(null);
  const [culturalLatest, setCulturalLatest] = useState<any | null>(null);
  const [isGameResultsDropdownOpen, setIsGameResultsDropdownOpen] = useState<boolean>(false);


  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isShareOpen && !target.closest('.share-dropdown') && !target.closest('[data-share-button]')) {
        setIsShareOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareOpen]);

  // Fetch resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/get-saved-resume/${slug}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load resume');
        }
        
        const data = await response.json();
        if (data.success && data.resume) {
          console.log('=== API RESPONSE DEBUG ===');
          console.log('Full API response:', data);
          console.log('Resume object:', data.resume);
          console.log('Resume data:', data.resume.data);
          console.log('Resume template from data.template:', data.resume.template);
          console.log('Resume template from data.data.template:', data.resume.data.template);
          console.log('Template colors:', {
            primary: data.resume.data.template?.primaryColor,
            secondary: data.resume.data.template?.secondaryColor,
            font: data.resume.data.template?.fontFamily
          });
          console.log('User info from API:', data.resume.user);
          console.log('========================');
          setResume(data.resume);
          setIsOwner(user?.id === data.resume.userId);
          
        } else {
          throw new Error('Resume not found');
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        setError(error instanceof Error ? error.message : 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchResume();
    }
  }, [slug, user?.id]);

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resume?.user.fullName} - Resume`,
          text: `Check out ${resume?.user.fullName}'s resume`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  // Copy URL function
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Resume URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL:', error);
      alert('Failed to copy URL. Please try again.');
    }
  };

  // Share resume function
  const shareResume = async (platform?: string) => {
    const url = `${window.location.origin}/resume/${slug}`;
    const title = resume?.title || 'Resume';
    const text = `Check out ${resume?.user.fullName}'s resume`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;

      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;

      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;

      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy the URL
        await copyUrl(url);
        break;

      case 'copy':
        await copyUrl(url);
        break;

      default:
        // Default native sharing
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: text,
              url: url
            });
          } catch (error) {
            console.error('Error sharing:', error);
          }
        } else {
          // Fallback to copying to clipboard
          await copyUrl(url);
        }
    }
    
    // Close share dropdown
    setIsShareOpen(false);
  };

  // Edit resume function
  const editResume = async () => {
    console.log('Edit Resume clicked!', { resume: resume?.data });

    try {
      // Use existing generated resume data from database instead of regenerating
      if (resume?.data?.content) {
        // Set a flag to indicate we're editing an existing resume
        localStorage.setItem('editingExistingResume', 'true');
        localStorage.setItem('resumeData', JSON.stringify(resume.data.content));
        console.log('Existing resume data loaded for editing');
      } else {
        console.error('No resume data found to edit');
        return;
      }
      console.log('Redirecting to resume builder...');
      window.location.href = '/resume-builder/build';
    } catch (e) {
      console.error('Error in editResume:', e);
    }
  };

  // Export to PDF function
  const exportToPDF = async () => {
    console.log('Export PDF clicked!');
    const element = document.getElementById('resume-content');

    if (!element) {
      alert('Resume content not found. Please try again.');
      return;
    }

    setExporting(true);

    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      console.log('Capturing resume content...');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      console.log('Canvas created, generating PDF...');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${resume?.user.fullName || 'Resume'}-Resume.pdf`;
      pdf.save(fileName);

      console.log('PDF saved successfully');

    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error generating PDF. Please try again. Error: ' + (error as Error).message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Futuristic Space Background */}
        <div className="absolute inset-0">
          {/* Nebula Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-cyan-900/20"></div>
          <div className="absolute inset-0 bg-gradient-radial from-blue-900/15 via-transparent to-pink-900/15"></div>
          
          {/* Starfield */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  opacity: 0.3 + Math.random() * 0.7
                }}
              ></div>
            ))}
          </div>
          
          {/* Floating Space Debris */}
          <div className="absolute top-20 left-10 w-3 h-3 bg-cyan-400/40 rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400/50 rounded-full animate-ping"></div>
          <div className="absolute top-60 left-1/4 w-2.5 h-2.5 bg-blue-400/40 rounded-full animate-pulse"></div>
          <div className="absolute top-80 right-1/3 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-bounce"></div>
          <div className="absolute top-32 left-2/3 w-2 h-2 bg-pink-400/50 rounded-full animate-ping"></div>
          <div className="absolute top-72 right-1/6 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-pulse"></div>
          
          {/* Energy Orbs */}
          <div className="absolute top-1/4 left-1/6 w-6 h-6 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full animate-spin opacity-40"></div>
          <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-2/3 left-1/3 w-5 h-5 bg-gradient-to-r from-green-400/35 to-cyan-400/35 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute top-1/2 right-1/6 w-4 h-4 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full animate-spin opacity-40" style={{ animationDirection: 'reverse' }}></div>
          
          {/* Cosmic Grid */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/8 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent"></div>
          
          {/* Wormhole Effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-40 h-40 border border-cyan-400/15 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-400/15 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-400/15 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-pink-400/15 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          </div>
          
          {/* Energy Waves */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-purple-500/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          {/* Pacman Loader */}
          <div className="relative mb-8">
            <div className="flex justify-center">
              <PacmanLoader 
                color="#fbbf24" 
                size={60}
                margin={4}
                speedMultiplier={1.2}
              />
            </div>
            
            {/* Floating energy particles */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-4 -right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          {/* Enhanced Text with Glow Effect */}
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
            Loading Resume...
          </h2>
          <p className="text-gray-400 text-lg">Preparing your professional profile</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Resume</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Resume Not Found</h1>
          <p className="text-gray-400 mb-4">The resume you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <Header />
      
      {/* Main Content */}
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-6 py-8 flex justify-center">
          <div className="max-w-6xl w-full">
            {/* Resume Header with User Info and Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 mb-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* User Info */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {resume.user.avatarUrl ? (
                      <img
                        src={resume.user.avatarUrl}
                        alt={resume.user.fullName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400/30"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                        {generateInitials(resume.user.fullName)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                      {resume.user.fullName}'s Resume
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(resume.viewCount)} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Template: {resume.template || 'Default'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                 {/* Actions */}
                 <div className="flex items-center gap-3">
                   {/* Edit Resume Button - Only show for owner */}
                   {isOwner && (
                     <Button
                       onClick={editResume}
                       variant="outline"
                       className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                     >
                       <Pencil className="h-4 w-4 mr-2" />
                       Edit Resume
                     </Button>
                   )}
                   
                   {/* Share Button with Dropdown */}
                   <div className="relative">
                     <Button
                       onClick={() => setIsShareOpen(!isShareOpen)}
                       variant="outline"
                       className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                       data-share-button
                     >
                       <Share2 className="h-4 w-4 mr-2" />
                       Share
                     </Button>
                     
                     {/* Share Dropdown Menu */}
                     {isShareOpen && (
                       <div className="absolute top-full right-0 mt-2 w-64 bg-black/90 border border-white/20 rounded-lg shadow-xl backdrop-blur-sm z-50 share-dropdown">
                         <div className="p-2 space-y-1">
                           {/* Native Share (if available) */}
                           {typeof navigator !== 'undefined' && 'share' in navigator && (
                             <div
                               onClick={() => shareResume()}
                               className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors text-left cursor-pointer"
                             >
                               <Share2 className="h-4 w-4 text-blue-400" />
                               <span>Share via...</span>
                             </div>
                           )}
                           
                           {/* Facebook */}
                           <div
                             onClick={() => shareResume('facebook')}
                             className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors text-left cursor-pointer"
                           >
                             <Facebook className="h-4 w-4 text-blue-600" />
                             <span>Share on Facebook</span>
                           </div>
                           
                           {/* X (Twitter) */}
                           <div
                             onClick={() => shareResume('twitter')}
                             className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors text-left cursor-pointer"
                           >
                             <Twitter className="h-4 w-4 text-blue-400" />
                             <span>Share on X (Twitter)</span>
                           </div>
                           
                           {/* LinkedIn */}
                           <div
                             onClick={() => shareResume('linkedin')}
                             className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors text-left cursor-pointer"
                           >
                             <Linkedin className="h-4 w-4 text-blue-700" />
                             <span>Share on LinkedIn</span>
                           </div>
                           
                           {/* Instagram */}
                           <div
                             onClick={() => shareResume('instagram')}
                             className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors text-left cursor-pointer"
                           >
                             <Instagram className="h-4 w-4 text-pink-500" />
                             <span>Copy URL for Instagram</span>
                           </div>
                           
                           {/* Copy URL */}
                           <div
                             onClick={() => shareResume('copy')}
                             className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors text-left cursor-pointer"
                           >
                             <Copy className="h-4 w-4 text-green-400" />
                             <span>Copy URL</span>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                   
                   {/* Export PDF Button */}
                   <Button
                     onClick={exportToPDF}
                     disabled={exporting}
                     className="bg-cyan-500 hover:bg-cyan-600 text-white"
                   >
                     {exporting ? (
                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     ) : (
                       <Download className="h-4 w-4 mr-2" />
                     )}
                     {exporting ? 'Exporting...' : 'Export PDF'}
                   </Button>
                 </div>
              </div>

            </motion.div>

            {/* Resume Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8"
            >
              {resume.data ? (
                <div 
                  id="resume-content"
                  className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto text-gray-900 [&_*]:text-gray-900 [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_p]:text-gray-700 [&_li]:text-gray-700 [&_span]:text-gray-700 [&_.text-gray-700]:text-gray-700 [&_.text-gray-600]:text-gray-600 [&_text-gray-500]:text-gray-500 [&_.text-gray-900]:text-gray-900"
                  style={{
                    fontFamily: resume.data.template?.fontFamily || 'Inter, sans-serif',
                    color: '#1f2937'
                  }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                     <h1 
                       className="text-2xl font-bold mb-2 text-gray-900"
                       style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                     >
                       {resume.user.fullName || resume.data.content?.name || resume.data.headerInfo?.name || 'Professional'}
                     </h1>
                     <p 
                       className="text-lg font-semibold mb-4 text-gray-800"
                       style={{ color: resume.data.template?.secondaryColor || '#374151' }}
                     >
                       {resume.user.position || resume.data.content?.bestJobTitle || resume.data.headerInfo?.title || 'Professional'}
                     </p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-gray-600">
                      {/* Email and phone hidden for confidentiality */}
                      {/* {(resume.data.headerInfo?.email || resume.data.content?.email) && (
                        <div className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                          <Mail className="h-4 w-4" />
                          <span className="break-all">{resume.data.headerInfo?.email || resume.data.content?.email}</span>
                        </div>
                      )}
                      {(resume.data.headerInfo?.phone || resume.data.content?.phone) && (
                        <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          <Phone className="h-4 w-4" />
                          <span className="break-all">{resume.data.headerInfo?.phone || resume.data.content?.phone}</span>
                        </div>
                      )} */}
                      {(resume.user.location || resume.data.headerInfo?.location || resume.data.content?.location) && (
                        <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                          <MapPin className="h-4 w-4" />
                          <span className="break-all">{resume.user.location || resume.data.headerInfo?.location || resume.data.content?.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                   {/* Professional Summary */}
                   {resume.data.content?.summary && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Professional Summary
                         </h2>
                       </div>
                       <p 
                         className="text-gray-700 leading-relaxed pl-3 border-l-2"
                         style={{ borderColor: resume.data.template?.secondaryColor || '#d1d5db' }}
                       >{resume.data.content.summary}</p>
                     </div>
                   )}

                   {/* Work Experience */}
                   {resume.data.content?.experience && resume.data.content.experience.length > 0 && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Work Experience
                         </h2>
                       </div>
                       <div className="space-y-4">
                         {resume.data.content.experience.map((exp: any, index: number) => (
                           <div key={index} className="border-l-4 pl-4 transition-all duration-200" style={{ borderColor: resume.data.template?.secondaryColor || '#6b7280' }}>
                             <div className="flex justify-between items-start mb-2">
                               <h3 className="font-semibold text-gray-900">{exp.title || exp.position}</h3>
                               <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{exp.duration}</span>
                             </div>
                             <p className="text-gray-600 mb-2 font-medium">{exp.company}</p>
                             {exp.description && (
                               <p className="text-gray-700 text-sm">{exp.description}</p>
                             )}
                             {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                               <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                 {exp.achievements.map((achievement: string, idx: number) => (
                                   <li key={idx} className="hover:text-gray-900 transition-colors">{achievement}</li>
                                 ))}
                               </ul>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Education */}
                   {resume.data.content?.education && resume.data.content.education.length > 0 && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Education
                         </h2>
                       </div>
                       <div className="space-y-4">
                         {resume.data.content.education.map((edu: any, index: number) => (
                           <div key={index} className="border-l-4 pl-4 transition-all duration-200" style={{ borderColor: resume.data.template?.secondaryColor || '#6b7280' }}>
                             <div className="flex justify-between items-start mb-2">
                               <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                               <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{edu.year}</span>
                             </div>
                             <p className="text-gray-600 mb-2 font-medium">{edu.institution}</p>
                             {edu.major && <p className="text-gray-700 text-sm">Major: {edu.major}</p>}
                             {Array.isArray(edu.highlights) && edu.highlights.length > 0 && (
                               <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                                 {edu.highlights.map((highlight: string, idx: number) => (
                                   <li key={idx} className="hover:text-gray-900 transition-colors">{highlight}</li>
                                 ))}
                               </ul>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Skills */}
                   {resume.data.content?.skills && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Skills
                         </h2>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {resume.data.content.skills.technical && resume.data.content.skills.technical.length > 0 && (
                           <div>
                             <h3 className="font-medium text-gray-900 mb-3">Technical Skills</h3>
                             <div className="flex flex-wrap gap-2">
                               {resume.data.content.skills.technical.map((skill: string, index: number) => (
                                 <Badge 
                                   key={index} 
                                   variant="secondary" 
                                   style={{ backgroundColor: resume.data.template?.secondaryColor || '#6b7280', color: 'white' }}
                                   className="text-xs px-2 py-1"
                                 >
                                   {skill}
                                 </Badge>
                               ))}
                             </div>
                           </div>
                         )}
                         {resume.data.content.skills.soft && resume.data.content.skills.soft.length > 0 && (
                           <div>
                             <h3 className="font-medium text-gray-900 mb-3">Soft Skills</h3>
                             <div className="flex flex-wrap gap-2">
                               {resume.data.content.skills.soft.map((skill: string, index: number) => (
                                 <Badge 
                                   key={index} 
                                   variant="outline" 
                                   className="text-xs px-2 py-1 border-gray-300 text-gray-700"
                                 >
                                   {skill}
                                 </Badge>
                               ))}
                             </div>
                           </div>
                         )}
                         {resume.data.content.skills.languages && resume.data.content.skills.languages.length > 0 && (
                           <div>
                             <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
                             <div className="flex flex-wrap gap-2">
                               {resume.data.content.skills.languages.map((skill: string, index: number) => (
                                 <Badge 
                                   key={index} 
                                   variant="outline" 
                                   className="text-xs px-2 py-1 border-blue-300 text-blue-700"
                                 >
                                   {skill}
                                 </Badge>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                       {/* Fallback for simple skills array */}
                       {!resume.data.content.skills.technical && !resume.data.content.skills.soft && !resume.data.content.skills.languages && Array.isArray(resume.data.content.skills) && (
                         <div className="flex flex-wrap gap-2">
                           {resume.data.content.skills.map((skill: string, index: number) => (
                             <Badge 
                               key={index} 
                               variant="secondary" 
                               style={{ backgroundColor: resume.data.template?.secondaryColor || '#6b7280', color: 'white' }}
                               className="text-xs px-2 py-1"
                             >
                               {skill}
                             </Badge>
                           ))}
                         </div>
                       )}
                     </div>
                   )}

                   {/* Certifications */}
                   {resume.data.content?.certifications && resume.data.content.certifications.length > 0 && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Certifications
                         </h2>
                       </div>
                       <div className="space-y-3">
                         {resume.data.content.certifications.map((cert: string, index: number) => (
                           <div key={index} className="border-l-4 pl-4 transition-all duration-200" style={{ borderColor: resume.data.template?.secondaryColor || '#6b7280' }}>
                             <div className="flex items-center gap-2">
                               <Award className="h-4 w-4 text-emerald-600" />
                               <span className="text-gray-700 font-medium">{cert}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Projects */}
                   {resume.data.content?.projects && resume.data.content.projects.length > 0 && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Projects
                         </h2>
                       </div>
                       <div className="space-y-4">
                         {resume.data.content.projects.map((project: any, index: number) => (
                           <div key={index} className="border-l-4 pl-4 transition-all duration-200" style={{ borderColor: resume.data.template?.secondaryColor || '#6b7280' }}>
                             <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                             {project.description && (
                               <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                             )}
                             {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                               <div className="mb-2">
                                 <div className="flex flex-wrap gap-1">
                                   {project.technologies.map((tech: string, idx: number) => (
                                     <Badge 
                                       key={idx} 
                                       variant="outline" 
                                       className="text-xs px-2 py-1 border-violet-300 text-violet-700"
                                     >
                                       {tech}
                                     </Badge>
                                   ))}
                                 </div>
                               </div>
                             )}
                             {Array.isArray(project.impact) && project.impact.length > 0 && (
                               <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                 {project.impact.map((impact: string, idx: number) => (
                                   <li key={idx} className="hover:text-gray-900 transition-colors">{impact}</li>
                                 ))}
                               </ul>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Achievements */}
                   {resume.data.content?.achievements && resume.data.content.achievements.length > 0 && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Achievements
                         </h2>
                       </div>
                       <div className="space-y-3">
                         {resume.data.content.achievements.map((achievement: string, index: number) => (
                           <div key={index} className="border-l-4 pl-4 transition-all duration-200" style={{ borderColor: resume.data.template?.secondaryColor || '#6b7280' }}>
                             <div className="flex items-center gap-2">
                               <Trophy className="h-4 w-4 text-amber-600" />
                               <span className="text-gray-700">{achievement}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Organizations */}
                   {resume.data.content?.organizations && resume.data.content.organizations.length > 0 && (
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div 
                           className="w-1 h-6 rounded-full"
                           style={{ backgroundColor: resume.data.template?.primaryColor || '#6366f1' }}
                         ></div>
                         <h2 
                           className="text-lg font-semibold text-gray-900"
                           style={{ color: resume.data.template?.primaryColor || '#1f2937' }}
                         >
                           Organizations & Activities
                         </h2>
                       </div>
                       <div className="space-y-4">
                         {resume.data.content.organizations.map((org: any, index: number) => (
                           <div key={index} className="border-l-4 pl-4 hover:border-l-4 hover:border-pink-500 transition-all duration-200" style={{ borderColor: resume.data.template?.secondaryColor || '#6b7280' }}>
                             <div className="flex justify-between items-start mb-2">
                               <h3 className="font-semibold text-gray-900">{org.role || org.title}</h3>
                               <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{org.duration}</span>
                             </div>
                             <p className="text-gray-600 mb-2 font-medium">{org.organization || org.company}</p>
                             {org.description && <p className="text-gray-700 text-sm">{org.description}</p>}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Debug: Show raw data if no structured content found */}
                   {!resume.data.content?.summary && !resume.data.content?.experience && !resume.data.content?.education && !resume.data.content?.skills && !resume.data.content?.certifications && !resume.data.content?.projects && !resume.data.content?.achievements && !resume.data.content?.organizations && !resume.data.content?.name && !resume.data.headerInfo?.name && (
                     <div className="bg-gray-50 p-6 rounded-lg">
                       <p className="text-gray-600 mb-4">
                         No structured content found. Showing raw data:
                       </p>
                       <details>
                         <summary className="text-blue-600 cursor-pointer">Show raw data</summary>
                         <pre className="mt-2 text-xs text-gray-500 overflow-auto">
                           {JSON.stringify(resume.data, null, 2)}
                         </pre>
                       </details>
                     </div>
                   )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No resume content available</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}