"use client";

import Image from "next/image";
import { SideNav } from "@/components/layout/SideNav";
// import { Carousel } from "@/components/ui/carousel"; // Unused
import { useEffect, useState, useCallback, useMemo } from "react";
import { useCurrency } from "@/lib/currencyContext";
// import { EmployeeCard } from "@/components/ui/employee-card"; // Unused
import { ResumeModal } from "@/components/ui/resume-modal";
import { EmployeeCardData, ResumeGenerated } from "@/types/api";
import { getEmployeeCardData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ImagesSlider } from "@/components/ui/images-slider";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { AnimatedTestimonials } from "@/components/ui/shadcn-io/animated-testimonials";
import { FadeInAnimation } from "@/components/ui/fade-in-animation";
import { Shield, Users, CheckCircle, Building2, Monitor, FileText, UserCheck, BarChart3, Headphones, GraduationCap, ClipboardList, Target, Settings, MessageSquare, TrendingUp } from "lucide-react";
import { ContentTracker } from "@/components/ContentTracker";
// import { useEngagementTracking } from "@/lib/useEngagementTracking"; // Removed - using GlobalEngagementTracker

export default function Home() {
  // const [isShoreAgentsWay, setIsShoreAgentsWay] = useState(true); // Unused
  // const { convertPrice, formatPrice } = useCurrency(); // Unused
  // const { recordInteraction } = useEngagementTracking(); // Removed - using GlobalEngagementTracker
  
  // State for top employees
  const [topEmployees, setTopEmployees] = useState<EmployeeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<ResumeGenerated | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const brandLogos = [
    { name: 'Gallery Homes', logo: '/Global Brands/Gallery-Homes.webp' },
    { name: 'BoxBrownie', logo: '/Global Brands/BoxBrownie.webp' },
    { name: 'Ballast', logo: '/Global Brands/Ballast.webp' },
    { name: 'Harcourts', logo: '/Global Brands/Harcourts.webp' },
    { name: 'Compass', logo: '/Global Brands/Compass.webp' },
    { name: 'Arizto', logo: '/Global Brands/Arizto.webp' },
    { name: 'McGrath', logo: '/Global Brands/McGrath.webp' },
    { name: 'Barry Plant', logo: '/Global Brands/BarryPlant.webp' },
    { name: 'Bayleys', logo: '/Global Brands/Bayleys.webp' },
    { name: 'Bellarine', logo: '/Global Brands/Bellarine.webp' },
    { name: 'Charles Lloyd Property Group', logo: '/Global Brands/Charles-Lloyd-Property-Group.webp' },
    { name: 'Crowdcopia', logo: '/Global Brands/Crowdcopia.webp' },
    { name: 'EVES Realty', logo: '/Global Brands/EVES-Realty-Ltd.webp' },
    { name: 'Gateway Property Management', logo: '/Global Brands/Gateway-Property-Management.webp' },
    { name: 'Glide', logo: '/Global Brands/Glide.webp' },
    { name: 'Granite Peak Multifamily', logo: '/Global Brands/Granite-Peak-Multifamily-Logo.webp' },
    { name: 'Legali Law', logo: '/Global Brands/Legali-Law.webp' },
    { name: 'Princeton International Properties', logo: '/Global Brands/Princeton-International-Properties.webp' },
    { name: 'Proofreading LLC', logo: '/Global Brands/Proofreading-LLC.webp' },
    { name: 'Property Partner 365', logo: '/Global Brands/Property-Partner-365.webp' },
    { name: 'PTLA Real Estate Group', logo: '/Global Brands/PTLA-Real-Estate-Group.webp' },
    { name: 'Schultz Realty', logo: '/Global Brands/Schultz-Realty-Ltd-Maungaturoto.webp' },
  ];

  // Office worker images for hero background slider
  const officeImages = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Modern office workspace
    "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80", // Team collaboration
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Professional office environment
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Business meeting
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Office workspace with computers
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Professional team working
  ];

  // 6-Step Process Data for Animated Tooltips with Icons
  const processSteps = [
    {
      id: 1,
      name: "Book a Chat With Us",
      designation: "15-30 Minutes • FREE Consultation",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM4NGNjMTYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNOCAxMmguMDFNMTIgMTJoLjAxTTE2IDEyaC4wMU0yMSAxMmMwIDQuOTc4LTQuNDc3IDktMTAgOXMtMTAtNC4wMjItMTAtOWMwLTQuOTc4IDQuNDc3LTkgMTAtOXMxMCA0LjAyMiAxMCA5eiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K", // Chat/Consultation icon
    },
    {
      id: 2,
      name: "We Find Qualified People",
      designation: "1-2 Weeks • AI-Powered Recruitment",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM4NGNjMTYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNMTcgMjB2LTJhNCA0IDAgMCAwLTQtNEg1YTQgNCAwIDAgMC00IDR2MiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI3IiByPSI0Ii8+CjxwYXRoIGQ9Ik0yMyAyMHYtMmE0IDQgMCAwIDAtMy0zLjg3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE2IDMuMTNhNCA0IDAgMCAxIDAgNy43NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K", // People/Recruitment icon
    },
    {
      id: 3,
      name: "You Interview and Choose",
      designation: "100% YOUR Decision • Video Interviews",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM4NGNjMTYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNMTUgMTBsNCA0LTQgNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNSAxNGg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE1IDEwaDYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUgNmg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkgMTBoNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik05IDZoNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik05IDE0aDYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+Cg==", // Video/Interview icon
    },
    {
      id: 4,
      name: "We Set Up Employment & Equipment",
      designation: "1-2 Weeks • Complete Infrastructure",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM4NGNjMTYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg1YTQgNCAwIDAgMC00IDR2MiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0zIDVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJoLTE0YTIgMiAwIDAgMS0yLTJWNXoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOCAyMWg4IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyIDE3di40IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=", // Computer/Equipment icon
    },
    {
      id: 5,
      name: "They Work For You + We Handle Employment",
      designation: "Ongoing Partnership • Full Support",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM4NGNjMTYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNOSAxMmwyIDIgNC00IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIxIDEyYzAgNC45NzgtNC40NzcgOS0xMCA5cy0xMC00LjAyMi0xMC05YzAtNC45NzggNC40NzctOSAxMC05czEwIDQuMDIyIDEwIDl6IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=", // Support/Partnership icon
    },
    {
      id: 6,
      name: "Expand Your Team",
      designation: "Scale When Ready • Faster Process",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiM4NGNjMTYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNMTMgM2wtMyA5aDlsLTkgMTMgMy05aC05bDktMTN6IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=", // Growth/Scale icon
    },
  ];

  // Testimonials data for animated testimonials component
  const testimonials = [
    {
      quote: "We dive deep into your business needs, challenges, and growth objectives to understand exactly what you need.",
      name: "Initial Consultation",
      designation: "15-30 Minutes • FREE Consultation",
      src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Business consultation meeting
    },
    {
      quote: "Our recruitment system searches 25,000+ candidate database using AI matching to find your perfect fit.",
      name: "AI-Powered Candidate Sourcing",
      designation: "1-2 Weeks • AI-Powered Recruitment",
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // AI/Technology recruitment
    },
    {
      quote: "You interview 2-3 pre-screened candidates via video call. We handle all the tough questions beforehand.",
      name: "Video Interview Process",
      designation: "100% YOUR Decision • Video Interviews",
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Video interview meeting
    },
    {
      quote: "Choose your preferred candidate, we handle contracts, workspace setup, and infrastructure.",
      name: "Selection & Setup",
      designation: "1-2 Weeks • Complete Infrastructure",
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Office setup and equipment
    },
    {
      quote: "You train them your way. We provide the office, tech, and ongoing support structure.",
      name: "Training & Integration",
      designation: "Ongoing Partnership • Full Support",
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Team training and collaboration
    },
    {
      quote: "Add more specialists as you grow. Our proven process makes expansion seamless.",
      name: "Scale Your Team",
      designation: "Scale When Ready • Faster Process",
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Team growth and expansion
    },
  ];


  // Fetch top employees
  const fetchTopEmployees = useCallback(async () => {
    try {
      const data = await getEmployeeCardData();
      // Get top 3 employees (you can modify this logic based on your criteria)
      const top3 = data.slice(0, 3);
      setTopEmployees(top3);
    } catch (error) {
      console.error('Error fetching top employees:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopEmployees();
  }, [fetchTopEmployees]);


  const handleViewDetails = useCallback((employee: EmployeeCardData) => {
    console.log('View details for:', employee.user.name);
  }, []);

  const handleViewResume = useCallback((resume: ResumeGenerated) => {
    setSelectedResume(resume);
    setIsResumeModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ContentTracker 
        contentType="page" 
        contentId="home" 
        contentTitle="ShoreAgents - Professional Filipino Staff Leasing"
        pageSection="main"
      >
        <SideNav />
                      {/* Hero Section - Full Viewport Height */}
            <section className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
              {/* Background Images Slider */}
              <ImagesSlider
                images={officeImages}
                className="absolute inset-0 z-0"
                overlay={true}
                overlayClassName="bg-gradient-to-br from-black/40 via-black/30 to-black/40"
                autoplay={true}
                direction="up"
              >
                <div></div>
              </ImagesSlider>
              
              <div className="max-w-7xl mx-auto text-center relative z-10">
                {/* Badge */}
                <Badge variant="secondary" className="mb-6 bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Trusted by 50+ Global Brands
                </Badge>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                  Philippines Got{" "}
                  <span className="bg-gradient-to-r from-lime-400 via-lime-300 to-lime-400 bg-clip-text text-transparent drop-shadow-lg">
                    TALENT!
                  </span>
                </h1>
                
                <p className="text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                  University-educated, office-based Filipino professionals with transparent pricing. AI-powered recruitment finds perfect matches in 7 days.
                </p>
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                  <Button 
                    size="lg"
                    onClick={() => {
                      window.location.href = '/we-got-talent';
                    }}
                    className="bg-lime-600 hover:bg-lime-700 text-white"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Our Talent Pool
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-white/80 backdrop-blur-sm text-lime-600 border-lime-600 hover:bg-white/90"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Discover Your Perfect Match
                  </Button>
                </div>

                {/* 6-Step Process with Animated Tooltips */}
                <div className="mt-16 mb-16 max-w-6xl mx-auto">
                  <div className="flex justify-center">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                      <AnimatedTooltip items={processSteps} />
              </div>
                  </div>
                </div>

           
              </div>
              
              {/* Fading Overlay at Bottom for Smooth Transition */}
              <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-20"></div>
            </section>

                        {/* Main Content Section */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <FadeInAnimation direction="up" delay={0}>
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-3 bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Our Proven Process
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It{" "}
                <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 transition-all duration-300 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]">Actually Works</span>
              </h2>
              <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto italic">
                &quot;I&apos;ve done all the dumb things, so you don&apos;t have to. Here&apos;s the systematic approach that actually works.&quot;
              </p>
            </div>
          </FadeInAnimation>
          
          {/* Key Features */}
          <FadeInAnimation direction="up" delay={200}>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6">
              <Badge variant="outline" className="bg-lime-50 text-lime-800 border-lime-200 hover:bg-lime-100">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  <span className="font-medium">7 days to hire</span>
                <span className="font-normal text-lime-600"> (not 4 weeks)</span>
              </Badge>
              
              <Badge variant="outline" className="bg-lime-50 text-lime-800 border-lime-200 hover:bg-lime-100">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                  <span className="font-medium">Office-based</span>
                <span className="font-normal text-lime-600"> (not home-based)</span>
              </Badge>
              
              <Badge variant="outline" className="bg-lime-50 text-lime-800 border-lime-200 hover:bg-lime-100">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  <span className="font-medium">Staff leasing</span>
                <span className="font-normal text-lime-600"> (we handle infrastructure)</span>
              </Badge>
            </div>
          </FadeInAnimation>

          {/* Process Steps with Animated Testimonials */}
          <FadeInAnimation direction="up" delay={400}>
            <div className="max-w-6xl mx-auto">
              <AnimatedTestimonials 
                testimonials={testimonials} 
                autoplay={true}
                className="max-w-none"
              />
            </div>
              </FadeInAnimation>
              </div>
            </section>

              {/* Clear Responsibilities Section */}
              <div className="mt-16">
                <Separator className="my-8 bg-lime-200" />
                <FadeInAnimation direction="up" delay={0}>
                  <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      Clear <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Responsibilities</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      We handle the infrastructure, you focus on your business growth.
                    </p>
                  </div>
                </FadeInAnimation>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* What We Handle Card */}
                  <FadeInAnimation direction="up" delay={0}>
                    <Card className="border-lime-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="bg-lime-50 border-b border-lime-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-lime-600" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-gray-900">What We Handle</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Recruitment & candidate screening</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Building2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Office space & infrastructure</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Monitor className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Computers, internet, backup power</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <FileText className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Government compliance & contracts</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <UserCheck className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">HR management & payroll</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <BarChart3 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Performance monitoring systems</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Headphones className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">24/7 IT support & security</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeInAnimation>

                  {/* What You Handle Card */}
                  <FadeInAnimation direction="up" delay={200}>
                    <Card className="border-lime-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="bg-white border-b border-lime-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-lime-600" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-gray-900">What You Handle</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <GraduationCap className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Training your team members</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <ClipboardList className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Daily task assignment & management</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Target className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Quality control & feedback</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Settings className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Business process development</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <MessageSquare className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Team communication & culture</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <BarChart3 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Performance goals & KPIs</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <TrendingUp className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-gray-700">Strategic direction & growth</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeInAnimation>
                </div>
              </div>

              {/* Quote Section */}
              <div className="mt-16 text-center">
                <Separator className="my-8 bg-lime-200" />
                <FadeInAnimation direction="up" delay={0}>
                  <div className="max-w-4xl mx-auto p-8 border-2 border-lime-200 rounded-2xl bg-lime-50 shadow-lg shadow-gray-900/10">
                    <blockquote className="text-lg md:text-xl text-gray-800 italic mb-6 leading-relaxed">
                      &quot;The thing is, most people overcomplicate outsourcing. We&apos;ve simplified it down to what actually works: find good people, give them proper infrastructure, let you train them your way.&quot;
                    </blockquote>
                    <cite className="text-base font-semibold text-gray-900">
                      — Stephen Atcheler, CEO & Founder
                    </cite>
                  </div>
                </FadeInAnimation>
                
                {/* CTA Button */}
                <FadeInAnimation direction="up" delay={200}>
                  <div className="mt-8">
                    <Button 
                      size="lg"
                      className="bg-lime-600 hover:bg-lime-500 text-white px-6 sm:px-8 py-4 rounded-sm font-semibold transition-all duration-300 ease-in-out text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0"
                    >
                      START YOUR PROCESS TODAY
                    </Button>
                  </div>
                </FadeInAnimation>
              </div>

              {/* Brand Logos Section */}
              <div className="mt-20">
                <Separator className="my-8 bg-lime-200" />
                <FadeInAnimation direction="up" delay={0}>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Trusted by <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Global Brands</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Trusted by industry leaders across 5 countries
                    </p>
                  </div>
                </FadeInAnimation>

                {/* Infinite Scroll Container */}
                <FadeInAnimation direction="up" delay={200}>
                  <div className="relative overflow-hidden bg-gray/50 rounded-2xl w-full max-w-7xl mx-auto">
                    <div className="flex animate-scroll">
                      {/* First set of logos */}
                      {brandLogos.map((brand, index) => (
                        <div key={index} className="flex-shrink-0 px-8 py-6 flex items-center justify-center">
                          <div className="w-32 h-16 flex items-center justify-center">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={128}
                              height={64}
                              className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                            />
                          </div>
                        </div>
                      ))}
                      {/* Duplicate set for seamless loop */}
                      {brandLogos.map((brand, index) => (
                        <div key={`duplicate-${index}`} className="flex-shrink-0 px-8 py-6 flex items-center justify-center">
                          <div className="w-32 h-16 flex items-center justify-center">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={128}
                              height={64}
                              className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeInAnimation>
              </div>

              {/* Pricing Transparency Section */}
              
                {/* How Our AI System Works Section */}
               <section className="bg-gray-50 py-16">
                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <FadeInAnimation direction="up" delay={0}>
                       <div className="text-center mb-16">
                         <div className="inline-flex items-center px-4 py-2 bg-lime-600 border border-lime-500 rounded-full text-sm font-medium text-white mb-6">
                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                           </svg>
                           Simple Process
                         </div>
                         
                         <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                           How Our AI System <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">Works</span>
                         </h2>
                         
                         <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                           Four intelligent steps that revolutionize how you find and hire top Filipino talent
                         </p>
                       </div>
                     </FadeInAnimation>

                      {/* Progress Indicator */}
                      <div className="mb-12">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">AI Analysis</span>
                          </div>
                          <div className="w-8 h-0.5 bg-lime-300"></div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">Smart Matching</span>
                          </div>
                          <div className="w-8 h-0.5 bg-lime-300"></div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">Screening</span>
                          </div>
                          <div className="w-8 h-0.5 bg-lime-300"></div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-lime-600 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">Human Review</span>
                          </div>
                        </div>
                        <Progress value={100} className="h-2 bg-lime-100" />
                      </div>

                      {/* Process Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Step 1: AI Analysis */}
                        <FadeInAnimation direction="up" delay={0}>
                          <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              1
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
                          <p className="text-lime-100 mb-4 leading-relaxed">
                            Submit your requirements and our AI analyzes them against our database
                          </p>
                          <p className="text-sm text-lime-200 font-medium">
                            Machine learning identifies the perfect candidate profile for your business
                          </p>
                          {/* Arrow */}
                          <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-lime-200">
                              <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          </div>
                        </FadeInAnimation>

                        {/* Step 2: Smart Matching */}
                        <FadeInAnimation direction="up" delay={150}>
                          <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              2
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Smart Matching</h3>
                          <p className="text-lime-100 mb-4 leading-relaxed">
                            AI ranks and matches candidates based on skills, experience, and cultural fit
                          </p>
                          <p className="text-sm text-lime-200 font-medium">
                            Advanced algorithms consider 200+ factors for optimal matching
                          </p>
                          {/* Arrow */}
                          <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-lime-200">
                              <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          </div>
                        </FadeInAnimation>

                        {/* Step 3: Automated Screening */}
                        <FadeInAnimation direction="up" delay={300}>
                          <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              3
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Automated Screening</h3>
                          <p className="text-lime-100 mb-4 leading-relaxed">
                            AI conducts initial assessments and verifies qualifications
                          </p>
                          <p className="text-sm text-lime-200 font-medium">
                            Comprehensive evaluation including technical skills and English proficiency
                          </p>
                          {/* Arrow */}
                          <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-lime-200">
                              <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          </div>
                        </FadeInAnimation>

                        {/* Step 4: Human Review */}
                        <FadeInAnimation direction="up" delay={450}>
                          <div className="bg-lime-800 rounded-2xl p-6 shadow-lg border border-lime-700 hover:shadow-xl transition-all duration-300 relative group">
                            <div className="absolute -top-2 -right-2">
                              <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                4
                              </div>
                            </div>
                            <div className="w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center mb-6">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Human Review</h3>
                            <p className="text-lime-100 mb-4 leading-relaxed">
                              Our team validates AI recommendations and prepares your shortlist
                            </p>
                            <p className="text-sm text-lime-200 font-medium">
                              Expert recruiters ensure quality and add personal insights
                            </p>
                          </div>
                        </FadeInAnimation>
                      </div>

                     {/* CTA Section */}
                     <FadeInAnimation direction="up" delay={600}>
                       <div className="text-center mt-12">
                         <Button 
                           size="lg"
                           className="bg-lime-600 hover:bg-lime-500 text-white px-6 sm:px-8 py-4 rounded-sm font-semibold transition-all duration-300 ease-in-out text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0"
                         >
                           Start Your AI-Powered Hiring Process
                         </Button>
                       </div>
                     </FadeInAnimation>
                   </div>
               </section>
            
            {/* Modals */}
            {selectedResume && (
              <ResumeModal
                isOpen={isResumeModalOpen}
                onClose={() => {
                  setIsResumeModalOpen(false);
                  setSelectedResume(null);
                }}
                resume={selectedResume}
              />
            )}
            
          </ContentTracker>
        </div>
      );
    }
