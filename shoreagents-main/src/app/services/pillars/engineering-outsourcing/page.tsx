"use client";

import { Button } from "@/components/ui/button";
import { SideNav } from "@/components/layout/SideNav";

export default function EngineeringOutsourcingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-ocean-50">
      <SideNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-6">
                  <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  ENGINEERING OUTSOURCING
                </div>
                
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-lime-600">Engineering Excellence</span>
                  <br />
                  <span className="text-gray-900">Through Systematic Support</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Partner with university-qualified Filipino engineers who bring technical expertise and systematic thinking to your complex projects - at <span className="font-bold">$704/month</span> all-inclusive.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="default" 
                  size="lg"
                  className="text-lg px-8 py-4 font-semibold"
                >
                  Get Engineering Support →
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  View Case Studies
                </Button>
              </div>
            </div>

            {/* Right Side - Trust Content */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-md border border-gray-100">
              <div className="space-y-6">
                {/* Main Content */}
                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Why Engineering Firms Trust Shore Agents
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                    From technical analysis to project management, our engineering professionals integrate seamlessly with your team while maintaining the highest technical standards.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Technical Expertise</h3>
                      <p className="text-sm text-gray-700">University-qualified engineers with deep understanding of engineering principles, calculations, and industry standards.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Systematic Approach</h3>
                      <p className="text-sm text-gray-700">Methodical problem-solving and systematic thinking that ensures thorough analysis and reliable solutions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Quality Assurance</h3>
                      <p className="text-sm text-gray-700">Multi-level review processes ensuring calculations and designs meet your standards and regulatory requirements.</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-lime-50 rounded-lg p-4 border border-lime-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Stephen&apos;s Engineering Journey</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <blockquote className="italic">
                      &quot;Engineering work requires precision and systematic thinking that you just can&apos;t compromise on. When we started working with engineering firms, I realized they needed more than just basic support.&quot;
                    </blockquote>
                    <blockquote className="italic">
                      &quot;So basically, we developed a training program specifically for engineering professionals. These aren&apos;t just VAs who can use CAD - they&apos;re university-qualified engineers who understand complex calculations and design principles.&quot;
                    </blockquote>
                    <blockquote className="italic">
                      &quot;Our engineering clients saw their project efficiency improve by 35% while maintaining the same quality standards. That&apos;s when I knew we had something special.&quot;
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Engineering Support Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Engineering Support Services
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              From design calculations to project coordination, we provide full-spectrum engineering support across multiple disciplines.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {/* Structural Engineering */}
            <div className="bg-lime-50 rounded-lg p-3 lg:p-4 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Structural Engineering</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Comprehensive structural design and analysis services including concrete and steel design, seismic analysis, and foundation engineering.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Building design</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Bridge analysis</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Seismic evaluation</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Foundation systems</span>
                </div>
              </div>
            </div>

            {/* Civil Engineering */}
            <div className="bg-lime-50 rounded-lg p-3 lg:p-4 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Civil Engineering</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Infrastructure development and site engineering including transportation, water resources, and environmental systems.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Site development</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Infrastructure design</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Drainage systems</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Transportation planning</span>
                </div>
              </div>
            </div>

            {/* Mechanical Engineering */}
            <div className="bg-lime-50 rounded-lg p-3 lg:p-4 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Mechanical Engineering</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Mechanical systems design and analysis including HVAC, equipment sizing, and energy optimization.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">HVAC system design</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Mechanical calculations</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Equipment sizing</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Energy analysis</span>
                </div>
              </div>
            </div>

            {/* Electrical Engineering */}
            <div className="bg-lime-50 rounded-lg p-3 lg:p-4 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Electrical Engineering</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Power systems design and electrical infrastructure including lighting, load analysis, and control systems.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Power system design</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Lighting calculations</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Load analysis</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Control systems</span>
                </div>
              </div>
            </div>

            {/* Project Coordination */}
            <div className="bg-lime-50 rounded-lg p-3 lg:p-4 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Project Coordination</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Comprehensive project management and coordination services ensuring quality, compliance, and timely delivery.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Technical documentation</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Quality assurance</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Code compliance</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Progress reporting</span>
                </div>
              </div>
            </div>

            {/* Design Analysis */}
            <div className="bg-lime-50 rounded-lg p-3 lg:p-4 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Design Analysis</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Advanced engineering analysis and optimization including FEA, performance evaluation, and risk assessment.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Engineering calculations</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">FEA analysis</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Performance optimization</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Risk assessment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Specializations Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-lime-50 to-ocean-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Engineering Specializations
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              Our engineers bring specialized expertise across diverse engineering disciplines and industry applications.
            </p>
          </div>

          {/* Specializations Grid */}
          <div className="grid md:grid-cols-2 gap-3 lg:gap-4">
            {/* Structural Engineering */}
            <div className="bg-white rounded-lg p-3 lg:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Structural Engineering</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Comprehensive structural design and analysis services including concrete and steel design, seismic analysis, and foundation engineering.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Building design</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Bridge analysis</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Seismic evaluation</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Foundation systems</span>
                </div>
              </div>
            </div>

            {/* Civil Engineering */}
            <div className="bg-white rounded-lg p-3 lg:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Civil Engineering</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Infrastructure development and site engineering including transportation, water resources, and environmental systems.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Site development</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Transportation</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Water systems</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Environmental</span>
                </div>
              </div>
            </div>

            {/* MEP Engineering */}
            <div className="bg-white rounded-lg p-3 lg:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">MEP Engineering</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Mechanical, electrical, and plumbing systems design including HVAC, power distribution, and building systems integration.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">HVAC design</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Electrical systems</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Plumbing design</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Energy modeling</span>
                </div>
              </div>
            </div>

            {/* Specialized Analysis */}
            <div className="bg-white rounded-lg p-3 lg:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Specialized Analysis</h3>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Advanced engineering analysis including finite element analysis, computational fluid dynamics, and performance optimization.
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">FEA analysis</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">CFD modeling</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Optimization</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-lime-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">Risk analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Engineering Investment Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Professional Engineering Investment
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 lg:p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">$704</div>
                  <div className="text-gray-600 font-medium">Per engineer/month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">3x</div>
                  <div className="text-gray-600 font-medium">Project capacity increase</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">99%</div>
                  <div className="text-gray-600 font-medium">Calculation accuracy</div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg">
                  All-inclusive: Salary, benefits, professional software, workspace, and replacement guarantee
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

      {/* Related Technical Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Related Technical Services
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Architectural Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Architectural Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Professional architectural support for complex building projects and design standards.
                </p>
                <a href="/services/pillars/architectural-outsourcing" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Drafting Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Drafting Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Technical drafting precision with latest CAD tools and professional accuracy.
                </p>
                <a href="/services/our-services" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Estimating Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Estimating Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Accurate project estimation through systematic processes and detailed analysis.
                </p>
                <a href="/services/our-services" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Scale Section */}
      <section className="py-20 bg-lime-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Scale Your Engineering Capacity?
          </h2>
          <p className="text-xl text-white mb-10 leading-relaxed">
            Join engineering firms who&apos;ve tripled their project capacity while maintaining the highest technical standards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
              Calculate Investment →
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
