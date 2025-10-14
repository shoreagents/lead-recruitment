"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { Calendar, ArrowRight, DollarSign, Shield, Clock, Crown, Star, Check, Users, Target, Zap, AlertTriangle, Building, ChevronDown, ChevronUp, Calculator } from "lucide-react";

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-lime-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-lime-600 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen ">
      <SideNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-center">
          {/* Left Section - Main Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            {/* Trust Banner */}
            <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-sm text-sm font-medium text-gray-700 mb-6">
              <Crown className="w-4 h-4 mr-2 text-lime-600" />
              500+ COMPANIES TRUST US
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-lime-600">2x Your Business</span> While{" "}
              <span className="text-orange-600">Cutting Costs 60%</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop wasting time on recruitment headaches. Get dedicated Filipino professionals who work exclusively for you - with complete infrastructure, compliance, and support included.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-lime-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Dedicated employees (not freelancers)</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-lime-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Complete compliance & HR handled</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-lime-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Enterprise infrastructure included</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-lime-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">90-day replacement guarantee</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 flex items-center justify-center cursor-pointer">
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              
              <button className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-sm font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 flex items-center justify-center cursor-pointer">
                <DollarSign className="w-5 h-5 mr-2" />
                See Transparent Pricing
              </button>
            </div>

            {/* Footer Features */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-lime-600" />
                Enterprise Security
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-lime-600" />
                24/7 Support
              </div>
              <div className="flex items-center">
                <Crown className="w-4 h-4 mr-2 text-lime-600" />
                5+ Years Experience
              </div>
            </div>
          </div>

          {/* Right Section - Supplementary Content */}
          <div className="w-full lg:w-80 mx-auto lg:mx-0 space-y-6">
            {/* Testimonial */}
            <div className="bg-gray-100 rounded-sm p-6 relative">
              <Star className="w-5 h-5 text-lime-600 absolute top-4 left-4" />
              <blockquote className="text-gray-700 italic mb-4 mt-6">
                &quot;Anyone in real estate should reach out to Shore Agents. They&apos;re the real deal.&quot;
              </blockquote>
              <cite className="text-sm font-semibold text-gray-900">
                — Derek Gallimore, CEO, Outsource Accelerator
              </cite>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-lime-100 rounded-sm p-4 text-center">
                <div className="text-2xl font-bold text-lime-600 mb-1">500+</div>
                <div className="text-sm text-gray-700">Companies Trust Us</div>
              </div>
              <div className="bg-blue-100 rounded-sm p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">60%</div>
                <div className="text-sm text-gray-700">Cost Savings</div>
              </div>
              <div className="bg-orange-100 rounded-sm p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">305</div>
                <div className="text-sm text-gray-700">Seat Capacity</div>
              </div>
              <div className="bg-gray-100 rounded-sm p-4 text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">90</div>
                <div className="text-sm text-gray-700">Day Guarantee</div>
              </div>
            </div>

            {/* Trusted Companies */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Trusted by companies like:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div>Gallery Group</div>
                <div>Ballast</div>
                <div>Gelt Financial</div>
                <div>LockedOn</div>
                <div>Harcourts</div>
                <div>Century 21</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offshore Nightmares Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tired of These{" "}
              <span className="text-lime-600">Offshore Nightmares?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most companies waste months and thousands on failed offshore attempts. Here&apos;s why traditional approaches fail...
            </p>
          </div>

          {/* Nightmares Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Card 1: Freelancers Disappear */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-lime-100 rounded-sm mb-4 mx-auto">
                <Users className="w-6 h-6 text-lime-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Freelancers Disappear</h3>
              <p className="text-gray-600 text-center text-sm">
                Working multiple jobs, unreliable, no commitment to your business success
              </p>
            </div>

            {/* Card 2: Compliance Nightmares */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-lime-100 rounded-sm mb-4 mx-auto">
                <Shield className="w-6 h-6 text-lime-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Compliance Nightmares</h3>
              <p className="text-gray-600 text-center text-sm">
                Philippine labor law violations, government penalties, legal headaches
              </p>
            </div>

            {/* Card 3: Hidden Costs Everywhere */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-lime-100 rounded-sm mb-4 mx-auto">
                <DollarSign className="w-6 h-6 text-lime-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Hidden Costs Everywhere</h3>
              <p className="text-gray-600 text-center text-sm">
                Setup fees, software licenses, equipment, management overhead
              </p>
            </div>

            {/* Card 4: Quality Control Issues */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-lime-100 rounded-sm mb-4 mx-auto">
                <Target className="w-6 h-6 text-lime-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Quality Control Issues</h3>
              <p className="text-gray-600 text-center text-sm">
                No training standards, inconsistent work, communication breakdowns
              </p>
            </div>

            {/* Card 5: Tech Infrastructure Fails */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-lime-100 rounded-sm mb-4 mx-auto">
                <Zap className="w-6 h-6 text-lime-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Tech Infrastructure Fails</h3>
              <p className="text-gray-600 text-center text-sm">
                Internet outages, power failures, equipment problems halt productivity
              </p>
            </div>

            {/* Card 6: Management Overhead */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-lime-100 rounded-sm mb-4 mx-auto">
                <Clock className="w-6 h-6 text-lime-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Management Overhead</h3>
              <p className="text-gray-600 text-center text-sm">
                Spending more time managing offshore than doing actual business
              </p>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sound Familiar? You&apos;re Not Alone.</h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Stephen Atcheler (Shore Agents CEO) made every single one of these mistakes while scaling his 400-property real estate business. The 5-person hiring disaster alone cost him $50,000+ and 6 months of wasted time.
            </p>
          </div>

          {/* Conclusion */}
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-lime-100 rounded-sm">
              <AlertTriangle className="w-5 h-5 text-lime-600 mr-2" />
              <span className="text-lime-600 font-semibold">
                That&apos;s exactly why{" "}
                <span className="underline cursor-pointer hover:text-lime-700">Shore Agents</span> exists
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Shore Agents Complete Solution Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Shore Agents{" "}
              <span className="text-lime-600">Complete Solution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;ve solved every offshore challenge so you don&apos;t have to. Here&apos;s what makes us different...
            </p>
          </div>

          {/* Solution Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Dedicated Employees */}
            <div className="bg-lime-50 rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-lime-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-lime-100 rounded-sm mr-3">
                  <Users className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Dedicated Employees (Not Freelancers)</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Your team works exclusively for you during business hours. Real Shore Agents employees with job security and career development.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Exclusive dedication</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Real employment contracts</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Career development paths</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Higher retention rates</span>
                </div>
              </div>
            </div>

            {/* Card 2: Complete Compliance Management */}
            <div className="bg-lime-50 rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-lime-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-lime-100 rounded-sm mr-3">
                  <Shield className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Complete Compliance Management</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Philippine Labor Code, government relations, payroll, benefits - all handled professionally by our HR team.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Labor law compliance</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Government reporting</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Professional payroll</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Benefits administration</span>
                </div>
              </div>
            </div>

            {/* Card 3: Enterprise Infrastructure Included */}
            <div className="bg-lime-50 rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-lime-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-lime-100 rounded-sm mr-3">
                  <Building className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Enterprise Infrastructure Included</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                305-seat facility in Clark Freeport Zone with enterprise network, backup power, and 24/7 security.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">300 Mbps bandwidth</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Power backup systems</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">24/7 security</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Professional facilities</span>
                </div>
              </div>
            </div>

            {/* Card 4: Transparent All-Inclusive Pricing */}
            <div className="bg-lime-50 rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-lime-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-lime-100 rounded-sm mr-3">
                  <DollarSign className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Transparent All-Inclusive Pricing</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                No hidden fees. Staff salary + workspace + equipment + management all included in one clear price.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">No setup fees</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">All equipment included</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Transparent multipliers</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Benefits at cost</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Results from Real Clients Section */}
          <div className="mt-16">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Real Results from Real Clients
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don&apos;t take our word for it. Here&apos;s what happens when you partner with Shore Agents:
              </p>
            </div>

            {/* Results Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Card 1: Long-term Success */}
              <div className="bg-lime-50 rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center border border-lime-200">
                <div className="text-2xl font-bold text-gray-900 mb-2">Long-term success</div>
                <div className="text-gray-600 mb-4">Multi-year partnership</div>
                <blockquote className="text-gray-700 italic mb-4">
                  &quot;Head and shoulders above the rest&quot;
                </blockquote>
                <div className="font-semibold text-gray-900">Iain Neilson</div>
                <div className="text-gray-600">Gallery Group</div>
              </div>

              {/* Card 2: 1150% Growth */}
              <div className="bg-blue-50 rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center border border-blue-200">
                <div className="text-2xl font-bold text-gray-900 mb-2">1150% growth</div>
                <div className="text-gray-600 mb-4">4 → 46 specialists</div>
                <blockquote className="text-gray-700 italic mb-4">
                  &quot;Surpassed expectations by far&quot;
                </blockquote>
                <div className="font-semibold text-gray-900">Kuahiwi Kahapea</div>
                <div className="text-gray-600">Ballast</div>
              </div>

              {/* Card 3: $40K Saved */}
              <div className="bg-orange-50 rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center border border-orange-200">
                <div className="text-2xl font-bold text-gray-900 mb-2">$40K saved</div>
                <div className="text-gray-600 mb-4">$40K annual savings</div>
                <blockquote className="text-gray-700 italic mb-4">
                  &quot;69% cost reduction achieved&quot;
                </blockquote>
                <div className="font-semibold text-gray-900">Jack Miller</div>
                <div className="text-gray-600">Gelt Financial</div>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="text-center">
              <button className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-sm font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 ease-in-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 flex items-center justify-center cursor-pointer mx-auto">
                See All Case Studies
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing That Makes Sense
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              No hidden fees. No surprises. Just honest pricing for dedicated offshore professionals.
            </p>
            <div className="flex items-center justify-center">
              <Check className="w-5 h-5 text-lime-600 mr-2" />
              <span className="text-lime-600 font-medium">All equipment, benefits, and workspace included</span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1: Entry Level */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Entry Level</h3>
              <div className="text-3xl font-bold text-lime-600 mb-2">1.43x</div>
              <div className="text-gray-600 mb-4">P20,000 - P39,000 base salary</div>
              <p className="text-gray-600 mb-6">
                Perfect for administrative tasks, data entry, basic virtual assistance
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">College graduate</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">English proficient</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Basic training</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">90-day guarantee</span>
                </div>
              </div>
            </div>

            {/* Card 2: Mid Level */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mid Level</h3>
              <div className="text-3xl font-bold text-lime-600 mb-2">1.33x</div>
              <div className="text-gray-600 mb-4">P40,000 - P99,000 base salary</div>
              <p className="text-gray-600 mb-6">
                Ideal for specialized roles, project management, client communication
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">2+ years experience</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Specialized skills</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Advanced training</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Dedicated workspace</span>
                </div>
              </div>
            </div>

            {/* Card 3: Senior Level */}
            <div className="bg-white rounded-sm p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Senior Level</h3>
              <div className="text-3xl font-bold text-lime-600 mb-2">1.25x</div>
              <div className="text-gray-600 mb-4">P100,000+ base salary</div>
              <p className="text-gray-600 mb-6">
                Expert-level professionals for complex tasks and team leadership
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">5+ years experience</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Leadership skills</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Strategic thinking</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-lime-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Mentorship capable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Example Section */}
          <div className="bg-lime-50 rounded-sm p-6 border border-lime-200">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Example: Mid-Level Virtual Assistant</h3>
            
            {/* Data Points Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-lime-600 mb-2">P50,000</div>
                <div className="text-gray-600 text-sm">Base Salary</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lime-600 mb-2">P66,500</div>
                <div className="text-gray-600 text-sm">Total Cost (1.33x)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lime-600 mb-2">$1,164</div>
                <div className="text-gray-600 text-sm">Your Currency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lime-600 mb-2">60%</div>
                <div className="text-gray-600 text-sm">Cost Savings</div>
              </div>
            </div>

            {/* Inclusions */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Includes: Salary + Benefits + Workspace + Equipment + Management + HR + Compliance
              </p>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="inline-flex items-center text-gray-600">
                <span className="text-2xl mr-2">
                Ready to get your custom plan? See the form below</span>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* Contact Form Section */}
<section className="bg-lime-50 py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Section Header */}
           <div className="text-center mb-12">
             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
               Ready to Get Started?
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Let's discuss how Shore Agents can help scale your business. Get your free consultation today.
             </p>
           </div>

           {/* Contact Form */}
           <div className="max-w-2xl mx-auto">
             <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
               {/* Form Header */}
               <div className="flex items-center space-x-3 mb-6">
                 <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                   <Calendar className="w-5 h-5 text-lime-600" />
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold text-gray-900">
                     Get Your Free Consultation
                   </h3>
                   <p className="text-sm text-gray-600">
                     Tell us about your business needs and we'll create a custom plan for you.
                   </p>
                 </div>
               </div>

                               <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); console.log("Form submitted"); }}>
                  {/* Name Fields */}
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last name
                      </label>
                      <input
                        type="text"
                        placeholder="Smith"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Email and Phone Fields */}
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Company and Industry Fields */}
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your Company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Real Estate, Technology, Healthcare"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Current Team Size - Radio Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Current Team Size
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { id: '1-5', label: '1-5' },
                        { id: '6-15', label: '6-15' },
                        { id: '51-100', label: '51-100' },
                        { id: '100+', label: '100+' }
                      ].map((option) => (
                        <label
                          key={option.id}
                          className="group flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all"
                        >
                          <input
                            type="radio"
                            name="teamSize"
                            value={option.id}
                            className="peer sr-only"
                          />
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0 peer-checked:border-lime-500 peer-checked:bg-lime-500">
                            <div className="w-2 h-2 bg-white rounded-full m-0.5 opacity-0 peer-checked:opacity-100" />
                          </div>
                          <span className="text-gray-700 peer-checked:text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Biggest Challenge Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biggest Challenge
                    </label>
                    <textarea 
                      placeholder="What's your biggest operational challenge right now?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  {/* Preferred Call Time - Radio Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Call Time
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {[
                        { id: 'morning', label: 'Morning (9-12PM)' },
                        { id: 'afternoon', label: 'Afternoon (12-4PM)' },
                        { id: 'evening', label: 'Evening (4-7PM)' },
                        { id: 'flexible', label: 'Flexible (Anytime)' }
                      ].map((option) => (
                        <label
                          key={option.id}
                          className="group flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all"
                        >
                          <input
                            type="radio"
                            name="callTime"
                            value={option.id}
                            className="peer sr-only"
                          />
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0 peer-checked:border-lime-500 peer-checked:bg-lime-500">
                            <div className="w-2 h-2 bg-white rounded-full m-0.5 opacity-0 peer-checked:opacity-100" />
                          </div>
                          <span className="text-gray-700 peer-checked:text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                 {/* Submit Button */}
                 <button
                   className="w-full bg-lime-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-lime-700 transition-colors"
                   type="submit"
                 >
                   Get Free Consultation
                 </button>
               </form>

               {/* Trust Indicators */}
               <div className="mt-8 pt-6 border-t border-lime-200">
                 <div className="flex items-center justify-center space-x-6">
                   <div className="flex items-center text-sm text-gray-600">
                     <Shield className="w-4 h-4 mr-2 text-lime-600" />
                     <span>100% Secure</span>
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <Clock className="w-4 h-4 mr-2 text-lime-600" />
                     <span>Response within 24h</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
             {/* FAQ Section */}
       <section className="bg-white py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Section Header */}
           <div className="text-center mb-12">
             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
               Frequently Asked Questions
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Everything you need to know about working with Shore Agents
             </p>
           </div>

           {/* FAQ Items */}
           <div className="max-w-4xl mx-auto space-y-4">
             {[
               {
                 question: "How is this different from hiring freelancers?",
                 answer: "Our team members are real Shore Agents employees who work exclusively for you during business hours. No juggling multiple clients, no disappearing acts, no divided attention. Plus you get enterprise infrastructure, HR support, and compliance handled professionally."
               },
               {
                 question: "What if the person doesn't work out?",
                 answer: "We offer a 90-day replacement guarantee. If anyone leaves or doesn't meet expectations in the first 90 days, we'll find you a replacement at no additional cost. Our retention rate is 94% because we hire and manage properly."
               },
               {
                 question: "How do you handle Philippine compliance and labor law?",
                 answer: "We're experts in Philippine employment law. All employees are properly contracted, benefits are handled, government reporting is done, and we stay current with all regulatory changes. You never have to worry about compliance issues."
               },
               {
                 question: "What about internet outages and power failures?",
                 answer: "Our Clark Freeport Zone facility has enterprise infrastructure with backup power (UPS + generators), multiple ISP connections with automatic failover, and 24/7 monitoring. We maintain 99.9% uptime."
               },
               {
                 question: "How much control do I have over my team?",
                 answer: "Complete control. You handle all training, processes, and day-to-day management. We provide the infrastructure, compliance, and administrative support. Think of us as your offshore HR department, not a traditional BPO."
               },
               {
                 question: "Can I start with just one person?",
                 answer: "Absolutely! Many clients start with one person and scale from there. There's no minimum team size requirement. We've successfully placed everyone from single VAs to teams of 50+."
               },
               {
                 question: "What industries do you work with?",
                 answer: "We specialize in real estate, property management, construction, mortgage, insurance, legal, accounting, and professional services. Our team understands these industries and can find candidates with relevant experience."
               },
               {
                 question: "How long does the setup process take?",
                 answer: "Typically 2-4 weeks from signed agreement to your team member starting work. This includes recruitment, interviews (where you choose the candidates), onboarding, and workspace setup."
               }
             ].map((faq, index) => (
               <FAQItem key={index} question={faq.question} answer={faq.answer} />
             ))}
           </div>
         </div>
       </section>

       {/* Call to Action Section */}
       <section className="bg-lime-600 py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           {/* Main Headline */}
           <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
             Ready to 2x Your Business While Cutting Costs 60%?
           </h2>
           
           {/* Subtitle */}
           <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
             Join 500+ companies who've already made the smart choice. Book your free consultation before our limited setup slots fill up.
           </p>

           {/* Alert Banner */}
           <div className="inline-flex items-center px-6 py-3 bg-lime-500 rounded-lg mb-8">
             <AlertTriangle className="w-5 h-5 text-white mr-2" />
             <span className="text-white font-medium">Only 12 Setup Slots Remaining This Month</span>
             <AlertTriangle className="w-5 h-5 text-white ml-2" />
           </div>

           {/* CTA Buttons */}
           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
             <button className="bg-white text-lime-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
               Book My Free Consultation Now
               <ArrowRight className="w-5 h-5 ml-2" />
             </button>
             
             <button className="bg-lime-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-lime-400 transition-colors flex items-center justify-center">
               <Calculator className="w-5 h-5 mr-2" />
               Calculate My Savings
             </button>
           </div>

           {/* Disclaimer */}
           <p className="text-white text-sm opacity-90">
             Free consultation • No pressure • Custom strategy included
           </p>
         </div>
       </section>

       
    </div>
  );
}


