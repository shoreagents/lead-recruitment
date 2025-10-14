"use client";

import { Button } from "@/components/ui/button";
import { PricingCalculatorModal } from "@/components/ui/pricing-calculator-modal";
import Link from "next/link";
import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";

export default function BuildATeamPage() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  return (
    <>
    <SideNav />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lime-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Build Your Team Badge */}
          <div className="inline-flex items-center gap-2 bg-lime-100 border border-lime-300 rounded-full px-4 py-2 mb-8">
            <div className="w-5 h-5 bg-lime-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="text-lime-700 font-semibold text-sm uppercase tracking-wide">
              BUILD YOUR TEAM: 2-10 PEOPLE
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your{" "}
            <span className="text-lime-600">Filipino Team</span>
          </h1>

          {/* Sub-headings */}
          <p className="text-2xl font-bold text-gray-900 mb-4">
            Mixed Roles, Maximum Flexibility
          </p>
          <p className="text-xl text-gray-700 mb-6">
            From One Good Hire to a Complete Team.
          </p>

          {/* Description */}
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10">
            Mix and match roles, workspaces, and skill levels to build exactly what YOUR business needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="text-lg px-8 py-4 bg-lime-600 hover:bg-lime-700">
              Book Team Planning Call
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-lime-600 text-lime-600 hover:bg-lime-50"
              onClick={() => setIsPricingModalOpen(true)}
            >
              Calculate Team Costs
            </Button>
          </div>
        </div>
      </section>

      {/* Stephen's Story Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            How I Learned Team Building Through Real Estate
          </h2>
          
          <div className="bg-lime-50 rounded-lg p-8 border border-lime-200">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                My real estate agency ended up with <strong>14 salespeople</strong> and <strong>400 rentals</strong>, but I wasn't the one who built the team of Filipino staff - I was the one making all the mistakes that taught me how teams should actually work.
              </p>
              
              <p>
                Back then, I tried hiring 5 Filipino staff at once with zero strategy. <em>Disaster</em>. Then I tried making my receptionist also do property inspections. <em>Another disaster</em>. The mistake I made? No system for how people should work together.
              </p>
              
              <p>
                In my 2019 book, I called it "<strong>The Real Estate Roundabout</strong>" - you're too busy managing people to do sales, but too busy doing sales to manage people properly.
              </p>
              
              <p>
                Now, through helping clients like Kuahiwi at Ballast scale from <strong>4 to 46 specialists</strong>, or watching BoxBrownie grow their team from 2 to 16 people, I've learned: <strong>Build your team systematically. Each person should make the next hire easier, not harder.</strong>
              </p>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lime-600 italic font-medium">
                - Stephen Atcheler, CEO Shore Agents
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Team Roles Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Core Team Roles (Mix & Match)
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Administrative Core */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Administrative Core</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-lime-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Executive Assistant</h4>
                  <p className="text-sm text-gray-600">Hybrid/Office</p>
                  <p className="text-lime-600 font-semibold">₱54,000-58,000/month</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Bookkeeper/Accountant</h4>
                  <p className="text-sm text-gray-600">WFH/Hybrid</p>
                  <p className="text-blue-600 font-semibold">₱50,000-54,000/month</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Customer Service Rep</h4>
                  <p className="text-sm text-gray-600">WFH/Office</p>
                  <p className="text-orange-600 font-semibold">₱46,000-50,000/month</p>
                </div>
              </div>
            </div>

            {/* Marketing & Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Marketing & Content</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-lime-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Content Writer + Social</h4>
                  <p className="text-sm text-gray-600">WFH</p>
                  <p className="text-lime-600 font-semibold">₱48,000-52,000/month</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Graphic Designer</h4>
                  <p className="text-sm text-gray-600">WFH/Hybrid</p>
                  <p className="text-blue-600 font-semibold">₱52,000-56,000/month</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900">SEO/Marketing Specialist</h4>
                  <p className="text-sm text-gray-600">WFH</p>
                  <p className="text-orange-600 font-semibold">₱54,000-58,000/month</p>
                </div>
              </div>
            </div>

            {/* Sales & Technical */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sales & Technical</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-lime-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Sales Admin/CRM</h4>
                  <p className="text-sm text-gray-600">Office</p>
                  <p className="text-lime-600 font-semibold">₱50,000-54,000/month</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Web Developer</h4>
                  <p className="text-sm text-gray-600">WFH</p>
                  <p className="text-blue-600 font-semibold">₱60,000-75,000/month</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Data Analyst</h4>
                  <p className="text-sm text-gray-600">WFH/Hybrid</p>
                  <p className="text-orange-600 font-semibold">₱55,000-65,000/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Flexibility Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Workspace Flexibility - Mix and Match
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Work From Home */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Work From Home</h3>
              <div className="text-3xl font-bold text-lime-600 mb-2">₱8,000/month</div>
              <p className="text-gray-600 text-sm mb-4">per person</p>
              <div>
                <p className="text-gray-700 font-semibold mb-2">Perfect for:</p>
                <p className="text-gray-600">Content creation, development, bookkeeping, individual tasks</p>
              </div>
            </div>

            {/* Hybrid Access */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hybrid Access</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">₱12,000/month</div>
              <p className="text-gray-600 text-sm mb-4">per person</p>
              <div>
                <p className="text-gray-700 font-semibold mb-2">Perfect for:</p>
                <p className="text-gray-600">Client-facing roles, collaborative work, training periods</p>
              </div>
            </div>

            {/* Dedicated Office */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dedicated Office</h3>
              <div className="text-3xl font-bold text-orange-600 mb-2">₱16,000/month</div>
              <p className="text-gray-600 text-sm mb-4">per person</p>
              <div>
                <p className="text-gray-700 font-semibold mb-2">Perfect for:</p>
                <p className="text-gray-600">Senior roles, team leaders, client meetings, core staff</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Real Client Example: Ballast (4 to 46 Specialists)
          </h2>

          <div className="bg-lime-50 rounded-lg p-8 border border-lime-200">
            <div className="grid md:grid-cols-2 gap-8">
              {/* The Journey */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">The Journey</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Started with:</strong> 4 specialists</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Month 1-2:</strong> Core leasing team (4 people)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Month 3-4:</strong> Communications (8 people)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Month 5-6:</strong> Financial ops (8 people)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Total:</strong> 46 specialists across 4 departments</span>
                  </div>
                </div>
              </div>

              {/* What Made It Work */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What Made It Work</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-700">Clear departmental structure from day one</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-700">Systematic hiring in logical phases</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-700">100% migration from previous providers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-700">Proper onboarding and integration</span>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mt-8 p-4 bg-lime-100 rounded-lg border-l-4 border-lime-400">
                  <blockquote className="text-gray-700 italic">
                    "We've used multiple Outsourcing companies and ShoreAgents has surpassed our expectations by far."
                  </blockquote>
                  <p className="text-gray-900 font-semibold mt-2">- Kuahiwi Kahapea, Ballast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Success vs Failure Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            What Makes Teams Succeed (vs. Fail)
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Successful Teams */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Successful Teams Do This</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Hire roles in logical sequence (foundation first)</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Document processes before adding complexity</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Start with clear individual responsibilities</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Add collaboration gradually as people settle in</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Have one primary manager for the Filipino team</span>
                </div>
              </div>
            </div>

            {/* Failed Teams */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Failed Teams Usually</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Hire everyone at once without clear roles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Expect instant collaboration between new hires</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Don't plan for management overhead</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Change requirements frequently during onboarding</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/services/our-services/hire-one-agent">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">Start with One Agent</h3>
                </div>
                <p className="text-gray-700">Want to test the process first? Start with one person to understand how we work.</p>
              </div>
            </Link>

            <Link href="/services/our-services/create-workforce">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Create a Workforce</h3>
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Thinking bigger than 10 people? Discover how a private office approach can scale to 100+ employees.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Ready to Build Your Team?
          </h2>

          <div className="bg-lime-50 rounded-lg p-8 border border-lime-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Free Team Planning Session</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Map your business needs and bottlenecks</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Recommend optimal hiring sequence</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Plan workspace mix and team structure</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Calculate realistic costs and timeline</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="default" size="lg" className="text-lg px-8 py-4 bg-lime-600 hover:bg-lime-700">
              Book Team Planning Call
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-lime-600 text-lime-600 hover:bg-lime-50">
              Download Team Building Guide
            </Button>
          </div>

          <div className="text-center">
            <blockquote className="text-xl italic text-gray-700 mb-2">
              "Build your team systematically. Each person should make the next hire easier, not harder."
            </blockquote>
            <p className="text-lime-600 italic font-medium">
              - Stephen Atcheler
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Modal */}
      <PricingCalculatorModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
    </div>
    </>
  );
}
