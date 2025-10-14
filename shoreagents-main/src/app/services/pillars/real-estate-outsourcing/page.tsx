"use client";

import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currencyContext";
import { SideNav } from "@/components/layout/SideNav";

export default function RealEstateOutsourcingPage() {
  const { convertPrice, formatPrice } = useCurrency();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-ocean-50">
      <SideNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - First Image Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">From 20-Year-Old Contractor</span>
                  <br />
                  <span className="text-gray-900">to </span>
                  <span className="text-lime-600">Real Estate Empire</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
                  So basically, I built my real estate business with 400 rentals and 14 salespeople using outsourcing. The thing is, I learned what actually works in real estate operations - and what doesn't.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="default" 
                  size="lg"
                  className="text-lg px-8 py-4 font-semibold"
                >
                  Get Real Estate Quote →
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Real Estate Success Stories
                </Button>
              </div>
            </div>

            {/* Right Side - Second Image Content */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-md border border-gray-100">
              <div className="space-y-6">
                {/* Main Content */}
                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Real Estate Outsourcing: From the Trenches
                  </h2>
                  
                  <div className="space-y-3 text-gray-700 leading-relaxed text-sm lg:text-base">
                    <p>
                      I started in real estate at 20, literally doing $70/hour contracting work. However, I found that building a proper team through outsourcing was the key to scaling beyond personal limitations.
                    </p>
                    
                    <p>
                      With 400 rental properties and 14 salespeople, I've personally dealt with every real estate process you can imagine: lease renewals, commission calculations, tenant screening, property inspections.
                    </p>
                    
                    <p>
                      The thing is, most real estate professionals are drowning in admin work when they should be closing deals. That's where strategic outsourcing changes everything.
                    </p>
                  </div>
                </div>

                {/* Testimonials */}
                <div className="space-y-3">
                  <div className="bg-lime-50 rounded-lg p-4 border border-lime-100">
                    <blockquote className="italic text-gray-800 text-sm lg:text-base">
                      "Anyone in real estate should reach out to Shore Agents"
                    </blockquote>
                    <cite className="block mt-1 text-gray-600 text-sm font-medium">
                      - Derek Gallimore, Outsource Accelerator
                    </cite>
                  </div>
                  
                  <div className="bg-lime-50 rounded-lg p-4 border border-lime-100">
                    <blockquote className="italic text-gray-800 text-sm lg:text-base">
                      "Should have done this years ago"
                    </blockquote>
                    <cite className="block mt-1 text-gray-600 text-sm font-medium">
                      - Luke Newton, LockedOn PropTech
                    </cite>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-lime-50 rounded-lg p-4 text-center border border-lime-100">
                    <div className="text-2xl lg:text-3xl font-bold text-lime-700 mb-1">400+</div>
                    <div className="text-gray-600 text-sm font-medium">Rental Properties</div>
                  </div>
                  
                  <div className="bg-lime-50 rounded-lg p-4 text-center border border-lime-100">
                    <div className="text-2xl lg:text-3xl font-bold text-lime-700 mb-1">14</div>
                    <div className="text-gray-600 text-sm font-medium">Sales Team Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Outsourcing Success Stories Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              Real Estate Outsourcing Success Stories
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              These aren't made-up testimonials. These are real results from real estate professionals who've transformed their businesses with strategic outsourcing.
            </p>
          </div>

          {/* Success Stories Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Bellarine Property */}
            <div className="bg-lime-50 rounded-xl p-6 shadow-md border border-lime-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Bellarine Property</h3>
                <div className="text-right">
                  <div className="text-lime-600 font-bold text-lg">25% Volume Increase</div>
                  <div className="text-lime-600 text-sm">25% Growth</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Levi Turner's team gained the capacity to handle 25% more transactions by outsourcing lead follow-up and transaction coordination to our specialized real estate team.
              </p>
              <div className="text-sm text-gray-600 font-medium">
                Lead management, transaction coordination, administrative support.
              </div>
            </div>

            {/* LockedOn PropTech */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">LockedOn PropTech</h3>
                  <div className="text-ocean-600 text-sm font-medium">Luke Newton</div>
                </div>
                <div className="text-right">
                  <div className="text-ocean-600 text-lg mb-1">★★★★★</div>
                  <div className="text-gray-600 text-sm">Satisfaction</div>
                </div>
              </div>
              <blockquote className="text-gray-700 mb-4 leading-relaxed italic">
                "Should have done this years ago. The level of support and professionalism exceeded our expectations completely."
              </blockquote>
              <div className="text-sm text-gray-600 font-medium">
                Technical support, property data management, customer service.
              </div>
            </div>

            {/* Reside Real Estate */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Reside Real Estate</h3>
                <div className="text-right">
                  <div className="text-energy-600 font-bold text-lg">Systematic Scaling</div>
                  <div className="text-energy-600 text-sm">3x Efficiency</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Transformed their operations by implementing systematic outsourcing for lead management, transaction coordination, and administrative support.
              </p>
              <div className="text-sm text-gray-600 font-medium">
                Complete back-office support, lead qualification, document management.
              </div>
            </div>

            {/* Property Centre */}
            <div className="bg-lime-50 rounded-xl p-6 shadow-md border border-lime-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Property Centre</h3>
                <div className="text-right">
                  <div className="text-lime-600 font-bold text-lg">Mobile Freedom</div>
                  <div className="text-lime-600 text-sm">100% Remote</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Achieved complete mobile freedom by outsourcing all administrative functions, allowing the principal to focus entirely on client relationships and sales.
              </p>
              <div className="text-sm text-gray-600 font-medium">
                Administrative support, listing management, client communication.
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button 
              variant="link" 
              className="text-lime-600 text-lg font-semibold hover:text-lime-700"
            >
              View All Real Estate Case Studies →
            </Button>
          </div>
        </div>
      </section>

      {/* Why Real Estate Outsourcing Actually Works Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              Why Real Estate Outsourcing Actually Works
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Based on real results from 400+ properties, here's why strategic outsourcing transforms real estate operations.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cost Efficiency */}
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Efficiency</h3>
              <p className="text-gray-700 leading-relaxed">
                Save 60-70% on staff costs while getting specialized real estate expertise. That's more money for marketing and growth.
              </p>
            </div>

            {/* Specialized Training */}
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-ocean-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Specialized Training</h3>
              <p className="text-gray-700 leading-relaxed">
                Our teams are trained specifically in real estate processes, MLS systems, and industry compliance requirements.
              </p>
            </div>

            {/* Scalable Growth */}
            <div className="text-center">
              <div className="w-16 h-16 bg-energy-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-energy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Scalable Growth</h3>
              <p className="text-gray-700 leading-relaxed">
                Add team members without office space, equipment, or HR headaches. Scale up or down based on market conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Outsourcing Investment Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              Real Estate Outsourcing Investment
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Transparent pricing with no hidden fees. You pay exactly what we pay, plus a small management fee.
            </p>
          </div>

          {/* Pricing Tiers Block */}
          <div className="bg-lime-50 rounded-2xl p-8 lg:p-12 shadow-lg border border-lime-100 max-w-4xl mx-auto">
            {/* Pricing Tiers Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Entry Level */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Entry Level</h3>
                <div className="text-lime-600 font-bold text-lg mb-2">
                  {formatPrice(convertPrice(20000))}-{formatPrice(convertPrice(39000))} × 1.43
                </div>
                <p className="text-gray-700 text-sm">
                  Perfect for lead follow-up, data entry
                </p>
              </div>

              {/* Experienced */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Experienced</h3>
                <div className="text-lime-600 font-bold text-lg mb-2">
                  {formatPrice(convertPrice(40000))}-{formatPrice(convertPrice(99000))} × 1.33
                </div>
                <p className="text-gray-700 text-sm">
                  Transaction coordination, listing management
                </p>
              </div>

              {/* Specialist */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Specialist</h3>
                <div className="text-lime-600 font-bold text-lg mb-2">
                  {formatPrice(convertPrice(100000))}+ × 1.25
                </div>
                <p className="text-gray-700 text-sm">
                  Senior coordinators, team leaders
                </p>
              </div>
            </div>

            {/* Includes Line */}
            <div className="text-center border-t border-lime-200 pt-6">
              <p className="text-gray-700 font-medium">
                Includes: Staff salary + Philippine benefits (exact cost) + workspace + infrastructure
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button 
              variant="default" 
              size="lg"
              className="text-lg px-8 py-4 font-semibold"
            >
              Calculate Your Real Estate Team Cost →
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Hero Section */}
      <section className="py-16 lg:py-24 bg-lime-600">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
              Ready to Scale Your Real Estate Business?
            </h2>
            <p className="text-xl lg:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
              From one real estate professional to another - let's build a team that actually works.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="text-lg px-8 py-4 font-semibold bg-white text-lime-600 hover:bg-gray-50"
              >
                Get Your Real Estate Quote →
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="text-lg px-8 py-4 font-semibold bg-white text-lime-600 hover:bg-gray-50"
              >
                See More Success Stories
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
