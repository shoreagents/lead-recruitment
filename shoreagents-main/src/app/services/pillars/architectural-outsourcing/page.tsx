"use client";

import { Button } from "@/components/ui/button";
import { SideNav } from "@/components/layout/SideNav";

export default function ArchitecturalOutsourcingPage() {
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  ARCHITECTURAL OUTSOURCING
                </div>
                
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-lime-600">Professional Architectural Support</span>
                  <br />
                  <span className="text-gray-900">Without the Overhead</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Scale your architectural practice with dedicated Filipino professionals who understand complex building projects, design standards, and professional workflows - at <span className="font-bold">$616/month</span> all-inclusive.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="default" 
                  size="lg"
                  className="text-lg px-8 py-4 font-semibold"
                >
                  Get Architectural Support →
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                    Why Architectural Firms Trust Shore Agents
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                    From CAD drafting to project coordination, our architectural professionals integrate seamlessly with your practice while maintaining the highest standards.
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
                      <h3 className="font-semibold text-gray-900">Professional Standards</h3>
                      <p className="text-sm text-gray-700">University-qualified architects and drafters who understand building codes, design principles, and professional workflows.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">CAD Proficiency</h3>
                      <p className="text-sm text-gray-700">Expertise in AutoCAD, Revit, SketchUp, and other essential architectural software for seamless project integration.</p>
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
                      <p className="text-sm text-gray-700">Multi-level review processes ensuring drawings meet your standards and regulatory requirements.</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-lime-50 rounded-lg p-4 border border-lime-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Stephen's Architectural Journey</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <blockquote className="italic">
                      "The thing is, architectural work demands precision that you just can't compromise on. When we started working with construction firms, I realized they needed more than just basic admin support."
                    </blockquote>
                    <blockquote className="italic">
                      "So basically, we developed a training program specifically for architectural professionals. These aren't just VAs who can use CAD - they're university-qualified architects who understand the entire design process."
                    </blockquote>
                    <blockquote className="italic">
                      "Gallery Group saw their project turnaround time improve by 40% while maintaining the same quality standards. That's when I knew we had something special."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Architectural Support Services
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              From concept development to construction documentation, we provide full-spectrum architectural support.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* CAD Drafting & Design */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">CAD Drafting & Design</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  AutoCAD technical drawings
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Revit 3D modeling
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Construction documentation
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Design development
                </li>
              </ul>
            </div>

            {/* Project Coordination */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Project Coordination</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Client communication
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Consultant coordination
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Project scheduling
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Progress reporting
                </li>
              </ul>
            </div>

            {/* Code & Compliance */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Code & Compliance</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Building code research
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Zoning compliance
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Permit documentation
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Regulatory coordination
                </li>
              </ul>
            </div>

            {/* 3D Visualization */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">3D Visualization</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  SketchUp modeling
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Rendering services
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Virtual walkthroughs
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Presentation materials
                </li>
              </ul>
            </div>

            {/* Design Development */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Design Development</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Schematic design support
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Design development docs
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Specification writing
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Material research
                </li>
              </ul>
            </div>

            {/* Quality Control */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Quality Control</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Drawing review & checking
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Coordination between trades
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Red-line incorporation
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Final documentation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Professional Architectural Support Investment
            </h2>
          </div>

          {/* Investment Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 lg:p-12 shadow-md border border-gray-100">
              {/* Metrics */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">$616</div>
                  <div className="text-gray-600">Per architect/month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">40%</div>
                  <div className="text-gray-600">Faster project delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">100%</div>
                  <div className="text-gray-600">Professional standards</div>
                </div>
              </div>

              {/* All-inclusive text */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-700">
                  All-inclusive: Salary, benefits, workspace, management, and replacement guarantee.
                </p>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  variant="default" 
                  size="lg"
                  className="text-lg px-8 py-4 font-semibold"
                >
                  Calculate Your Investment →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Related Outsourcing Services
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Engineering Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Engineering Outsourcing</h3>
                <p className="text-gray-700 mb-4">
                  Professional engineering support for structural, civil, and mechanical projects.
                </p>
                <a href="/services/pillars/engineering-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Drafting Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Drafting Outsourcing</h3>
                <p className="text-gray-700 mb-4">
                  Technical drafting precision with latest CAD tools and professional accuracy.
                </p>
                <a href="/services/pillars/drafting-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Construction Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Construction Outsourcing</h3>
                <p className="text-gray-700 mb-4">
                  Comprehensive construction support from project management to documentation.
                </p>
                <a href="/services/pillars/construction-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors">
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-lime-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
            Ready to Scale Your Architectural Practice?
          </h2>
          <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
            Join architectural firms who've increased their capacity by 300% while maintaining professional standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="text-lg px-8 py-4 font-semibold bg-white text-lime-600 hover:bg-gray-50"
            >
              Calculate Investment →
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 font-semibold border-white text-white hover:bg-white hover:text-lime-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              View Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
