"use client";

import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import { SideNav } from "@/components/layout/SideNav";

export default function SeoOutsourcingPage() {
  return (
    <div className="min-h-screen">
      <SideNav />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.lime[50]} 0%, ${colors.ocean[50]} 100%)`
          }}
        />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* SEO Tag */}
              <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                SEO OUTSOURCING
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Claude-Powered{" "}
                <span className="text-lime-600">SEO</span>
              </h1>
              
              {/* Subheading */}
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 font-medium">
                When AI Meets Filipino Talent
              </p>
              
              {/* Description */}
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transform your search rankings with dedicated SEO professionals who combine AI tools with human strategy - delivering measurable results at{" "}
                <span className="font-bold text-gray-900">$440/month all-inclusive.</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
                  Get SEO Support →
                </Button>
                <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Case Studies
                </Button>
              </div>
            </div>
            
            {/* Right Column - Trust Section */}
            <div className="lg:pl-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                  Trusted by Leading Brands
                </h3>
                
                {/* Trust Indicators */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">AI-Enhanced Strategy</h4>
                      <p className="text-gray-600 text-sm">Advanced algorithms combined with human expertise</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Measurable Results</h4>
                      <p className="text-gray-600 text-sm">Track your progress with detailed analytics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Dedicated Team</h4>
                      <p className="text-gray-600 text-sm">Experienced Filipino SEO professionals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Businesses Choose Shore Agents for SEO Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Businesses Choose Shore Agents for SEO
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              From DIY SEO disasters to systematic success - our approach combines AI-powered insights with human strategy to deliver actual rankings, not theoretical SEO.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Key Features */}
            <div className="space-y-8">
              {/* Feature 1: AI-Enhanced Strategy */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Enhanced Strategy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Claude-powered content analysis, keyword research, and competitor intelligence delivering data-driven SEO decisions.
                  </p>
                </div>
              </div>
              
              {/* Feature 2: Algorithm Understanding */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Algorithm Understanding</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Deep knowledge of search engine algorithms and ranking factors with systematic approach to optimization.
                  </p>
                </div>
              </div>
              
              {/* Feature 3: Results Focus */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Results Focus</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Measurable improvements in rankings, organic traffic, and lead generation - not just vanity metrics.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Testimonial Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Stephen's SEO Evolution</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  "The thing is, I thought SEO was just stuffing keywords everywhere. Pretty cool how wrong I was! We spent months doing 'SEO' that actually hurt our rankings."
                </p>
                <p>
                  "So basically, after that disaster, we realized we needed people who understood both the technical side and the strategy. That's when we started integrating Uncle Claude for content analysis."
                </p>
                <p>
                  "One client's organic traffic increased 400% in 6 months. Their lead generation costs dropped by 60% because they weren't relying on paid ads anymore."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete SEO Outsourcing Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Complete SEO Outsourcing Services
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              From technical audits to content strategy, we provide comprehensive SEO support that drives actual business results.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Technical SEO */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Technical SEO</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Site speed optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Mobile responsiveness</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Schema markup</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">URL structure</span>
                </li>
              </ul>
            </div>

            {/* Keyword Research */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Keyword Research</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">AI-powered analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Competitor research</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Long-tail opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Search intent mapping</span>
                </li>
              </ul>
            </div>

            {/* Content Strategy */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Content Strategy</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Content planning</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">AI-enhanced writing</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Topic clustering</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Content optimization</span>
                </li>
              </ul>
            </div>

            {/* Link Building */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Link Building</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Authority building</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Guest posting</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Relationship outreach</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Quality link acquisition</span>
                </li>
              </ul>
            </div>

            {/* Local SEO */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Local SEO</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Google Business Profile</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Local citations</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Review management</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Map optimization</span>
                </li>
              </ul>
            </div>

            {/* Analytics & Reporting */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Analytics & Reporting</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Performance tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">ROI measurement</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Monthly reporting</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Strategy optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Uncle Claude Meets SEO Strategy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Uncle Claude Meets SEO Strategy
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              How we combine AI intelligence with human strategy for competitive advantage.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - AI-Powered SEO Services */}
            <div className="space-y-6">
              {/* Card 1: AI-Powered Content Analysis */}
              <div className="bg-lime-50 rounded-lg p-6 border border-lime-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Content Analysis</h3>
                <p className="text-gray-700 leading-relaxed">
                  Claude analyzes top-ranking pages to identify content gaps, semantic relationships, and optimization opportunities.
                </p>
              </div>
              
              {/* Card 2: Intelligent Keyword Research */}
              <div className="bg-lime-50 rounded-lg p-6 border border-lime-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Keyword Research</h3>
                <p className="text-gray-700 leading-relaxed">
                  AI-driven keyword discovery and intent analysis revealing opportunities competitors miss.
                </p>
              </div>
              
              {/* Card 3: Automated Optimization */}
              <div className="bg-lime-50 rounded-lg p-6 border border-lime-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Optimization</h3>
                <p className="text-gray-700 leading-relaxed">
                  Smart title tags, meta descriptions, and content optimization based on real-time algorithm insights.
                </p>
              </div>
            </div>
            
            {/* Right Column - The Claude Advantage */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Claude Advantage</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                <p>
                  While competitors are still doing manual keyword research, our team leverages Claude for deep content analysis and strategy development.
                </p>
                <p>
                  This isn't about replacing human expertise - it's about amplifying it. Our SEO professionals use AI insights to make better strategic decisions faster.
                </p>
              </div>
              
              {/* Testimonial Box */}
              <div className="bg-lime-50 rounded-lg p-6 border border-lime-100">
                <p className="text-gray-700 italic mb-3">
                  "The combination of AI analysis and Filipino talent gives us a competitive edge that traditional SEO agencies can't match."
                </p>
                <p className="text-gray-600 font-medium">- Stephen Atcheler, Shore Agents</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Investment That Pays For Itself Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              SEO Investment That Pays For Itself
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 lg:p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">$440</div>
                  <div className="text-gray-600 font-medium">Per SEO specialist/month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">400%</div>
                  <div className="text-gray-600 font-medium">Average traffic increase</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">60%</div>
                  <div className="text-gray-600 font-medium">Reduction in ad spend</div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg">
                  All-inclusive: Salary, benefits, SEO tools, workspace, and AI platform access
                </p>
              </div>
              
              <div className="text-center">
                <Button className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300">
                  Calculate Your Investment →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Digital Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Related Digital Services
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Content Writing Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Content Writing Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  AI-enhanced content creation that ranks and converts.
                </p>
                <a href="/services/our-services" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Website Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Website Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  SEO-optimized websites built for performance and conversions.
                </p>
                <a href="/services/our-services" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Graphic Design Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Graphic Design Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Visual content that supports your SEO and branding goals.
                </p>
                <a href="/services/our-services" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Dominate Search Rankings Section */}
      <section className="py-20 bg-lime-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Dominate Search Rankings?
          </h2>
          <p className="text-xl text-white mb-10 leading-relaxed">
            Join businesses who've eliminated their dependency on paid ads through systematic SEO success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
              Start SEO Growth →
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              View Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
