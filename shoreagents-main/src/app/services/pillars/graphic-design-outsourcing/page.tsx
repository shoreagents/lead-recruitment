"use client";

import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import { SideNav } from "@/components/layout/SideNav";

export default function GraphicDesignOutsourcingPage() {
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
              {/* Graphic Design Tag */}
              <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                GRAPHIC DESIGN OUTSOURCING
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Professional{" "}
                <span className="text-lime-600">Design</span>
                <br />
                That Converts & Captivates
              </h1>
              
              {/* Description */}
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Scale your visual marketing with dedicated Filipino designers who understand both aesthetics and business results - creating impactful designs at{" "}
                <span className="font-bold text-gray-900">$352/month all-inclusive.</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
                  Get Design Support →
                </Button>
                <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  View Portfolio
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Creative Excellence</h4>
                      <p className="text-gray-600 text-sm">Professional designs that capture attention and drive results</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fast Turnaround</h4>
                      <p className="text-gray-600 text-sm">Quick delivery without compromising on quality</p>
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
                      <p className="text-gray-600 text-sm">Experienced Filipino designers committed to your success</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Businesses Choose Shore Agents for Design Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Businesses Choose Shore Agents for Design
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              From brand identity to marketing materials, our designers combine creative excellence with business understanding to deliver visuals that drive results.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Key Features */}
            <div className="space-y-8">
              {/* Feature 1: Creative Excellence */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Creative Excellence</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Highly skilled designers with strong portfolios and deep understanding of design principles, color theory, and brand consistency.
                  </p>
                </div>
              </div>
              
              {/* Feature 2: Business Focus */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Business Focus</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Designs that don't just look good but convert - understanding marketing objectives and audience psychology.
                  </p>
                </div>
              </div>
              
              {/* Feature 3: Fast Turnaround */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Turnaround</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Streamlined design processes and project management ensuring quick delivery without compromising quality.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Testimonial Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Stephen's Design Journey</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  "The thing is, I thought design was just making things pretty. That didn't work when we needed marketing materials that actually converted leads into clients."
                </p>
                <p>
                  "So basically, we learned that great design combines aesthetics with psychology. Our Filipino designers understand both the creative and business sides."
                </p>
                <p>
                  "One client saw their social media engagement increase 250% after we redesigned their content strategy and visual identity. Pretty cool results!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Graphic Design Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Complete Graphic Design Services
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              From brand identity to digital marketing materials, we provide comprehensive design support for all your visual needs.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Brand Identity */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Brand Identity</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Logo design & refinement</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Brand guidelines</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Color palette development</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Typography selection</span>
                </li>
              </ul>
            </div>

            {/* Marketing Materials */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Marketing Materials</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Brochures & flyers</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Business cards</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Presentation templates</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Trade show displays</span>
                </li>
              </ul>
            </div>

            {/* Digital Graphics */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Digital Graphics</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Social media graphics</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Website banners</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Email templates</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Digital advertisements</span>
                </li>
              </ul>
            </div>

            {/* Web Graphics */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Web Graphics</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">UI/UX design elements</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Icon design</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Infographics</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Website graphics</span>
                </li>
              </ul>
            </div>

            {/* Print Design */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Print Design</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Annual reports</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Catalogs & magazines</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Packaging design</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Signage design</span>
                </li>
              </ul>
            </div>

            {/* Brand Applications */}
            <div className="bg-lime-50 rounded-lg p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Brand Applications</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Stationery design</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Vehicle wraps</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Merchandise design</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Environmental graphics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Design Investment Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Professional Design Investment
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 lg:p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">$352</div>
                  <div className="text-gray-600 font-medium">Per designer/month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">250%</div>
                  <div className="text-gray-600 font-medium">Avg. engagement increase</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">48hrs</div>
                  <div className="text-gray-600 font-medium">Average turnaround</div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg">
                  All-inclusive: Salary, benefits, design software, workspace, and project management
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

      {/* Related Creative Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Related Creative Services
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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
                  Beautiful, functional websites that convert visitors into customers.
                </p>
                <a href="/services/our-services" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Content Writing Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Content Writing Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Compelling copy that complements your visual design strategy.
                </p>
                <a href="/services/our-services" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>

            {/* SEO Outsourcing */}
            <div className="bg-lime-50 rounded-xl p-6 lg:p-8 border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">SEO Outsourcing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Visual content optimized for search and user experience.
                </p>
                <a href="/services/pillars/seo-outsourcing" className="text-lime-600 hover:text-lime-700 font-semibold transition-colors duration-300">
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Elevate Your Visual Brand? Section */}
      <section className="py-20 bg-lime-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
            Ready to Elevate Your Visual Brand?
          </h2>
          
          <p className="text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed">
            Join businesses who've transformed their brand presence with professional design that converts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
              Start Design Partnership →
            </Button>
            <Button className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              View Portfolio
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
