"use client";

import { ArrowRight, Building2, Users, TrendingUp, Zap, Shield, Globe, Check } from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";

export default function OutsourcingServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      {/* Hero Section - Full Viewport Height */}
      <section className="h-screen flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block">The Self-Taught</span>
                  <span className="block">Entrepreneur's Guide to</span>
                  <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">
                    Outsourcing
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  From $70/hour contractor struggling with local staff costs to building a 14-salesperson empire. So basically, I learned the hard way what works and what doesn't in outsourcing.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-lime-500 to-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:from-lime-400 hover:to-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2">
                  Get Your Quote
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-sm font-semibold hover:border-lime-600 hover:text-lime-600 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer">
                  See Success Stories
                </button>
              </div>
            </div>

            {/* Right Side - Success Story Card */}
            <div className="bg-lime-50 rounded-2xl p-8 shadow-xl border border-lime-200">
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  From Disaster to Success: My Outsourcing Journey
                </h2>
                
                {/* Story Content */}
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Running a real estate business with 400 rentals, I was hiring local staff at $25-30/hour. It was pretty much terrible.
                  </p>
                  <p>
                    Disasters included roosters crowing during client calls, power outages, and computer theft. Not a good idea.
                  </p>
                  <p>
                    Systematic outsourcing with proper infrastructure changed everything. Now I have a tight operation that actually works with 14 salespeople.
                  </p>
                </div>
                
                {/* Call to Action */}
                <a 
                  href="#" 
                  className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200"
                >
                  Read My Full Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-lime-100">
                    <div className="flex items-center justify-center mb-2">
                      <Building2 className="w-6 h-6 text-lime-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">400+</div>
                    <div className="text-sm text-gray-600">Rental Properties Managed</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-lime-100">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-lime-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">14</div>
                    <div className="text-sm text-gray-600">Salespeople in Team</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-lime-100">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-6 h-6 text-lime-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">69%</div>
                    <div className="text-sm text-gray-600">Average Cost Reduction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Outsourcing Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Outsourcing Actually Works in 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered outsourcing with human intelligence. It's pretty cool how technology amplifies what skilled people can accomplish.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: AI-Enhanced Teams */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-lime-500 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI-Enhanced Teams
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our staff work with 'Uncle Claude' and advanced tools to deliver results that surpass traditional local hires.
              </p>
            </div>

            {/* Card 2: Office Infrastructure */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Office Infrastructure
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clark-based office with redundant internet, backup power, and professional environment. No more grandmother's house disasters.
              </p>
            </div>

            {/* Card 3: Staff Leasing Model */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-lg mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Staff Leasing Model
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We provide staff + infrastructure. YOU handle training and management. Clear boundaries, better results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Outsourcing Solutions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Industry-Specific Outsourcing Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every industry has unique needs. That's why we've built specialized expertise across multiple sectors.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Real Estate Outsourcing */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real Estate Outsourcing
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                From lease renewals to commission calculations - specialized teams for property professionals.
              </p>
              <a href="/services/pillars/outsourcing-services/real-estate-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200 text-sm">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Property Management */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Property Management
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Systematic property management support without the receptionist-inspection disasters.
              </p>
              <a href="/services/pillars/property-management" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200 text-sm">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Construction Outsourcing */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Construction Outsourcing
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Gallery Group multi-year partnership: 'head and shoulders above the rest'.
              </p>
              <a href="/services/pillars/construction-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200 text-sm">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Insurance Outsourcing */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Insurance Outsourcing
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Claims processing, client communication, and administrative support for insurance companies.
              </p>
              <a href="/services/pillars/outsourcing-services/insurance-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200 text-sm">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Mortgage Outsourcing */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mortgage Outsourcing
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                $40K savings with Jack Miller's Gelt Financial - 69% cost reduction on lead follow-up.
              </p>
              <a href="/services/pillars/outsourcing-services/mortgage-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200 text-sm">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Legal Outsourcing */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Legal Outsourcing
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Document processing, contract support, and administrative assistance for legal firms.
              </p>
              <a href="/services/pillars/outsourcing-services/legal-outsourcing" className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200 text-sm">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <a 
              href="#" 
              className="inline-flex items-center text-lime-600 font-semibold hover:text-lime-700 transition-colors duration-200 text-lg"
            >
              View All Outsourcing Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Specialized Professional Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Specialized Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Technical, creative, and financial outsourcing for specialized business needs.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column: Technical & Professional */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical & Professional</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-lime-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Architectural Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-lime-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Drafting Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-lime-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Engineering Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-lime-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Estimating Outsourcing</span>
                </div>
              </div>
            </div>

            {/* Right Column: Digital & Financial */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Digital & Financial</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">SEO Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Graphic Design Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Website Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Content Writing Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-orange-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Accounting Outsourcing</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-orange-600 mr-4 flex-shrink-0" />
                  <span className="text-lg text-gray-700">Bookkeeping Outsourcing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Your Outsourcing Journey? CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Outsourcing Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            From one entrepreneur to another - let's build something that actually works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-lime-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2">
              Get Your Custom Quote
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-lime-600 text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-lime-700 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 cursor-pointer">
              See Success Stories
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
