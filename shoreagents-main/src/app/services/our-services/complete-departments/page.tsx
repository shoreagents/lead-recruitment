"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, XCircle, Target, Key, Users, Briefcase, Trophy, Users as UsersIcon, Shield, TrendingUp, Building, Star, Globe, Calendar, CreditCard, Heart, Activity, Phone } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'
import { useCurrency } from '@/lib/currencyContext'

export default function CompleteDepartmentsPage() {
  const { convertPrice, formatPrice } = useCurrency()
  
  return (
    <>
      <SideNav />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full">

                         {/* Value Proposition Badge */}
             <div className="flex justify-center mb-4">
               <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-medium">
                 <Key className="w-3 h-3" />
                 Complete Business Transformation Solution
               </div>
             </div>

             {/* Hero Content - Two Column Layout */}
             <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
               {/* Left Column - Title */}
               <div className="text-left">
                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                   <span className="text-blue-600">Shore Agents:</span>
                   <span className="block">The</span>
                   <span className="block text-lime-600">Complete Value Proposition</span>
                   <span className="block">Guide</span>
                 </h1>

                 {/* Subtitle */}
                 <p className="text-lg text-gray-600">
                   Why Smart Companies Choose the Shore Agents Advantage
                 </p>
               </div>

               {/* Right Column - Value Proposition Box */}
               <div className="bg-lime-50 rounded-xl p-6 border border-lime-200 h-fit">
                 <p className="text-base text-gray-800 leading-relaxed">
                   <span className="font-bold text-gray-900">Dear Future Shore Agents Partner,</span>
                   <br /><br />
                   You're about to discover why over <span className="font-bold text-lime-700">500+ companies worldwide</span> trust Shore Agents with their most valuable asset: their people. This isn't just another BPO service - it's a <span className="font-bold text-lime-700">complete business transformation solution</span> that eliminates the headaches of international hiring while delivering exceptional value at every level.
                 </p>
               </div>
             </div>
          </div>
        </section>

                 {/* Comparison Section */}
         <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
           <div className="max-w-6xl mx-auto">
             {/* Section Header */}
             <div className="text-center mb-8">
               <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                 The Shore Agents Difference: Why We're Not Like Everyone Else
               </h2>
             </div>

                         {/* Comparison Grid */}
             <div className="grid lg:grid-cols-2 gap-6">
               {/* Left Column - Most BPO Companies */}
               <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
                 <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                   <XCircle className="w-5 h-5" />
                   Most BPO Companies Give You:
                 </h3>
                 <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Contractors with divided loyalties</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Shared resources working for multiple clients</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Basic compliance (and pray nothing goes wrong)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">&quot;Figure it out yourself&quot; support</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Hidden fees and surprise costs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Office space you pay for but can't control</p>
                  </div>
                </div>
              </div>

                             {/* Right Column - Shore Agents */}
               <div className="bg-white rounded-xl p-6 shadow-lg border border-lime-200">
                 <h3 className="text-xl font-bold text-lime-600 mb-4 flex items-center gap-2">
                   <CheckCircle className="w-5 h-5" />
                   Shore Agents Delivers:
                 </h3>
                 <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Your dedicated employees (exclusively yours)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Complete business ecosystem (we handle everything)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Bulletproof compliance (sleep peacefully at night)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">24/7 partnership support (we've got your back)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Transparent, all-inclusive service (no surprises)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-500 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">Flexible workspace solutions (your business, your way)</p>
                  </div>
                </div>
              </div>
            </div>

                         {/* CTA Section */}
             <div className="text-center mt-8">
               <div className="bg-white rounded-xl p-6 shadow-lg border border-lime-200 max-w-2xl mx-auto">
                 <h3 className="text-xl font-bold text-gray-900 mb-3">
                   Ready to Transform Your Business?
                 </h3>
                 <p className="text-gray-600 mb-4">
                   Join the 500+ companies that have already discovered the Shore Agents advantage.
                 </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
                         </div>
           </div>
         </section>

                   {/* Complete Shore Agents Ecosystem Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  The Complete Shore Agents Ecosystem
                </h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  What You Get: The Full-Service Experience
                </h3>
               
               <p className="text-base text-gray-600 max-w-4xl mx-auto">
                 When you partner with Shore Agents, you're not just hiring staff - you're gaining access to an entire business infrastructure built specifically for international companies. Here's the complete value stack:
               </p>
             </div>

                           {/* Value Stack Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 - Payroll & HR Mastery */}
                <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-lime-100 rounded-lg mb-3">
                    <UsersIcon className="w-5 h-5 text-lime-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Payroll & HR Mastery</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">Complete employment solution with bulletproof compliance</p>
                </div>

                               {/* Card 2 - Health & Wellness */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Health & Wellness</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">Comprehensive iCare HMO coverage and on-site medical support</p>
                </div>

                {/* Card 3 - Talent Acquisition */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mb-3">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Talent Acquisition</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">25,000+ candidate database with AI-powered assessment</p>
                </div>

                {/* Card 4 - World-Class Facilities */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mb-3">
                    <Building className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">World-Class Facilities</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">Enterprise infrastructure in Clark Freeport Zone</p>
                </div>

                {/* Card 5 - Employee Engagement */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Employee Engagement</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">Comfort services and recognition programs</p>
                </div>

                {/* Card 6 - Security & Compliance */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Security & Compliance</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">24/7 security with complete regulatory compliance</p>
                </div>
                           </div>
            </div>
          </section>

                     {/* Payroll & HR Administration Mastery Section */}
           <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
             <div className="max-w-6xl mx-auto">
               {/* Section Header */}
               <div className="text-center mb-8">
                 <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                   Payroll & HR Administration Mastery
                 </h2>
               </div>

               {/* Why This Matters Section */}
               <div className="bg-gray-100 rounded-xl p-6 mb-6">
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Why This Matters:</h3>
                 <p className="text-base text-gray-700 leading-relaxed">
                   Philippine employment law is complex and constantly changing. One mistake can cost you months of headaches and significant penalties.
                 </p>
               </div>

               {/* Two Column Layout */}
               <div className="grid lg:grid-cols-2 gap-6 mb-6">
                                 {/* Direct Employment Model */}
                 <div className="bg-lime-50 rounded-xl p-6 border border-lime-200">
                   <h3 className="text-xl font-bold text-gray-900 mb-4">Direct Employment Model (Huge Advantage)</h3>
                   <div className="space-y-3">
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Your staff are REAL Shore Agents employees - not contractors</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Exclusive dedication - they work only for you during business hours</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Job security - happier, more loyal employees who stay longer</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Professional development - real career paths, not gig work</p>
                     </div>
                   </div>
                 </div>

                 {/* Bulletproof Compliance Management */}
                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                   <h3 className="text-xl font-bold text-gray-900 mb-4">Bulletproof Compliance Management</h3>
                   <div className="space-y-3">
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Philippine Labor Code - full adherence, always up-to-date</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">6-Month Probationary System - proper evaluation with legal protection</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Bi-Monthly Payroll - 15th and 30th, never a delay</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Government Compliance - SSS, PhilHealth, Pag-IBIG, BIR handled automatically</p>
                     </div>
                   </div>
                 </div>
              </div>

                             {/* World-Class Record Keeping */}
               <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                 <h3 className="text-xl font-bold text-gray-900 mb-4">World-Class Record Keeping</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-3">
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Complete 201 Files - every employee properly documented</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">3-Year Record Retention - legal compliance guaranteed</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Leave Administration - Service Incentive Leave tracking</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">DOLE Compliance - ready for any government inspection</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Provincial Wage Compliance - critical for work-from-home staff</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                       <p className="text-sm text-gray-700 leading-relaxed">Direct Bank Deposits - professional UnionBank accounts</p>
                     </div>
                   </div>
                 </div>
                               </div>
              </div>
            </section>

            {/* Comprehensive Health & Wellness Program Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Comprehensive Health & Wellness Program
                  </h2>
                </div>

                {/* Why This Matters Section */}
                <div className="bg-gray-100 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Why This Matters:</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Filipino employees expect quality healthcare. Great benefits = better retention and performance.
                  </p>
                </div>

                {/* iCare HMO Coverage Section */}
                <div className="bg-lime-50 rounded-xl p-6 border border-lime-200 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">iCare HMO Coverage (From Day 1)</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Medical Benefits */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Medical Benefits That Matter:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">₱250,000 Maximum Coverage for employees (₱150,000 for dependents)</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">₱12,000 Annual Medicine Reimbursement – real money for real needs</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Complete Family Coverage – spouse and children included</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">In-Patient Care – full hospital coverage including ICU, surgery, room and board</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Coverage */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Additional Coverage:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Out-Patient Care – doctor visits, lab tests, minor procedures covered</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Emergency Care – both accredited and non-accredited hospitals</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Dental Benefits – annual exams, cleanings, basic procedures, emergencies</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Vision Care – eye exams and basic treatments</p>
                        </div>
                      </div>
                    </div>

                    {/* Preventive & On-Site */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Preventive & On-Site:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Health screenings and wellness programs (6 sessions/year)</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Life Insurance – ₱300,000 principal coverage, ₱30,000 dependent coverage</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Full-Time Nurse – immediate medical assistance available</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">Medical Clinic – on-site healthcare facility</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Value Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The Value:</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Your employees get better healthcare than most local companies provide. Result? Lower turnover, higher satisfaction, and a competitive edge in recruiting top talent.
                  </p>
                </div>
              </div>
            </section>

            {/* Recruitment & Talent Acquisition Excellence Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Recruitment & Talent Acquisition Excellence
                  </h2>
                </div>

                {/* Why This Matters Section */}
                <div className="bg-gray-100 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Why This Matters:</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Finding the right people is the hardest part of scaling internationally. We've perfected the process.
                  </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  {/* Massive Talent Pool */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Massive Talent Pool</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">25,000+ Candidate Database – pre-screened, university graduates only</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Continuous Recruitment – always building the pipeline</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">University Graduate Requirement – quality baseline guaranteed</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">English Proficiency Standards – both written and verbal excellence</p>
                      </div>
                    </div>
                  </div>

                  {/* AI-Powered Assessment System */}
                  <div className="bg-lime-50 rounded-xl p-6 border border-lime-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Assessment System</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Resume Analysis – intelligent parsing and qualification matching</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Typing Tests – speed and accuracy measurement</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">English Proficiency Testing – comprehensive language assessment</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">DISC Personality Profiling – team fit and behavioral analysis</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Stage Quality Process */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">5-Stage Quality Process</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Application Review</h4>
                      <p className="text-xs text-gray-600">Initial qualification screening</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Phone Screening</h4>
                      <p className="text-xs text-gray-600">Communication assessment</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Formal Interviews</h4>
                      <p className="text-xs text-gray-600">Professional evaluation (recorded)</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">4</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">AI Assessment</h4>
                      <p className="text-xs text-gray-600">Skills and personality testing</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">5</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Client Selection</h4>
                      <p className="text-xs text-gray-600">You choose your team</p>
                    </div>
                  </div>
                </div>

                {/* Two Side-by-Side Cards */}
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                  {/* Revolutionary BPOC.AI Integration */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Revolutionary BPOC.AI Integration</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Industry-Leading Platform - 500+ BPO companies using it</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">10,000+ Resumes Built - 85% success rate</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Pre-Screened Candidates - quality pool ready to go</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">White-Label Opportunity - use our platform as your own</p>
                      </div>
                    </div>
                  </div>

                  {/* Guarantees That Matter */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Guarantees That Matter</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">90-Day Replacement Guarantee - free replacement if anyone leaves early</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Client Control - you choose every team member</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">No Shared Resources - your team works exclusively for you</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Bulletproof Verification - NBI clearance, employment history, references</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Value Section */}
                <div className="bg-blue-600 rounded-xl p-6 mt-6">
                  <h3 className="text-xl font-bold text-white mb-2">The Value</h3>
                  <p className="text-white leading-relaxed">
                    You get access to the best Filipino talent without spending months recruiting. We do the hard work, you get the perfect team.
                  </p>
                </div>
              </div>
            </section>

            {/* World-Class Workspace & Facilities Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    World-Class Workspace & Facilities
                  </h2>
                  <p className="text-base text-gray-600 italic">
                    Why This Matters: Your team's environment directly impacts their productivity and your results.
                  </p>
                </div>

                {/* Premium Office Infrastructure Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Premium Office Infrastructure (305-Seat Capacity)</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Location Advantage */}
                    <div className="bg-lime-50 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-3">Location Advantage</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Philexcel Business Park – modern, professional address</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Clark Freeport Zone – special economic zone benefits</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Secure Location – controlled access, professional environment</p>
                        </div>
                      </div>
                    </div>

                    {/* Enterprise Technology */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-3">Enterprise Technology</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">High-Speed Internet – 300 Mbps total bandwidth</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Load-balanced broadband with 3 ISPs</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Enterprise Network – Juniper SRX240-HA routers</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">i5 Computer Workstations – professional-grade equipment</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Environment */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-3">Professional Environment</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">24/7 Building Security – controlled access systems</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Meeting Room Access – client presentations</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Professional Address – impressive business location</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Power Backup Systems – UPS and generator guaranteed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Flexible Workspace Solutions Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Flexible Workspace Solutions
                  </h2>
                </div>

                {/* Service Offering Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Work From Home Card */}
                  <div className="bg-lime-50 rounded-lg p-4 border border-lime-200 shadow-lg">
                    <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-center mb-3">Work From Home</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 text-center">Complete remote infrastructure</p>
                      <p className="text-sm text-gray-700 text-center">Monitoring & productivity tools</p>
                      <p className="text-sm text-gray-700 text-center">Equipment provision included</p>
                    </div>
                  </div>

                  {/* Hybrid Desk Card */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-center mb-3">Hybrid Desk</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 text-center">A-B scheduling system</p>
                      <p className="text-sm text-gray-700 text-center">Shared desk with personal storage</p>
                      <p className="text-sm text-gray-700 text-center">Conflict-free booking system</p>
                    </div>
                  </div>

                  {/* Full Office Seat Card */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-lg">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-center mb-3">Full Office Seat</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 text-center">Dedicated 24/7 workstation</p>
                      <p className="text-sm text-gray-700 text-center">Ergonomic setup included</p>
                      <p className="text-sm text-gray-700 text-center">All office amenities access</p>
                    </div>
                  </div>

                  {/* Private Office Card */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-lg">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-center mb-3">Private Office</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 text-center">Dedicated branded space</p>
                      <p className="text-sm text-gray-700 text-center">Unlimited employee capacity</p>
                      <p className="text-sm text-gray-700 text-center">Complete control & customization</p>
                    </div>
                  </div>
                </div>

                {/* The Value Section */}
                <div className="bg-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Value</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You get enterprise-grade facilities without the enterprise-level investment. Professional environment = professional results.
                  </p>
                </div>
              </div>
            </section>

            {/* Employee Comfort & Engagement Programs Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Employee Comfort & Engagement Programs
                  </h2>
                  <p className="text-base text-gray-600">
                    Why This Matters: Happy employees are productive employees. Our engagement programs are why our staff stay longer and perform better.
                  </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  {/* Daily Comfort Services */}
                  <div className="bg-lime-50 rounded-xl p-6 border border-lime-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Comfort Services</h3>
                    
                    {/* Food & Beverage */}
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Food & Beverage:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">On-Site Cafeteria – subsidized meals keep costs low</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Free Coffee & Tea Stations – throughout the facility</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Clean Drinking Water – hydration stations everywhere</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Healthy Meal Options – nutrition matters for performance</p>
                        </div>
                      </div>
                    </div>

                    {/* Convenience Services */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Convenience Services:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Free Shuttle Service – easy office access for staff</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Comfortable Break Areas – rest and relaxation spaces</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Social Interaction Areas – community building spaces</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recreation & Wellness Programs */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recreation & Wellness Programs</h3>
                    
                    {/* Social Activities */}
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Social Activities:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Monthly Team Activities – games and culturally appropriate fun</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Birthday Celebrations – we never miss important occasions</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Team Building Events – relationship building activities</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Cultural Activities – appropriate for Filipino workforce</p>
                        </div>
                      </div>
                    </div>

                    {/* Recognition Programs */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Recognition Programs:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Employee of the Month – scoring system with prizes</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Achievement Recognition – celebrating excellence</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Work Anniversary Gifts – milestone celebrations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Value Section */}
                <div className="bg-lime-50 rounded-xl p-6 border border-lime-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Value</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your employees get a better work experience than most local companies provide. Result? Lower turnover, higher productivity, and a competitive advantage in the talent market.
                  </p>
                </div>
              </div>
            </section>

            {/* Security & Compliance Operations Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Security & Compliance Operations
                  </h2>
                  <p className="text-base text-gray-600">
                    Why This Matters: Data security and regulatory compliance aren't optional. One breach or violation can destroy your business.
                  </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  {/* Physical Security & Safety */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Physical Security & Safety</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">24/7 Building Security – controlled access systems</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Clark Freeport Zone – secure location benefits</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Equipment Security – complete asset management</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Emergency Procedures – evacuation plans and safety training</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">First Aid Facilities – emergency response protocols</p>
                      </div>
                    </div>
                  </div>

                  {/* Data Security & Technology */}
                  <div className="bg-lime-50 rounded-xl p-6 border border-lime-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Data Security & Technology</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-lime-600 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Information Security Protocols – confidentiality requirements</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-lime-600 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">IT Equipment Management – laptops, desktops, peripherals provided</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-lime-600 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Microsoft OS Platform – professional operating system environment</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-lime-600 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Client Software Integration – support for your specific tools</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-lime-600 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Backup Systems – data protection measures</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Value Section */}
                <div className="bg-blue-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Value</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You get enterprise-level security and compliance without hiring compliance experts. We handle the regulations so you can focus on growth.
                  </p>
                </div>
              </div>
            </section>

            {/* Performance & Management Excellence Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Performance & Management Excellence
                  </h2>
                  <p className="text-base text-gray-600 italic">
                    Why This Matters: Having great people isn't enough – you need systems to help them excel and grow.
                  </p>
                </div>

                {/* Staff Development Framework Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Staff Development Framework</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Structured Management */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Structured Management:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Performance Reviews – Month 1, 3, 5, then annually</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Monthly Pulse Checks – comprehensive one-on-ones</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Complete Employee Assessment – all aspects of experience</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Recorded Conversations – detailed documentation</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">Client Feedback Reports – insights passed directly to you</p>
                        </div>
                      </div>
                    </div>

                    {/* Quality Assurance */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Quality Assurance:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 rounded-full mt-0.5 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">College-Educated Professionals – degree-qualified candidates</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 rounded-full mt-0.5 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">English Proficiency Standards – written and verbal excellence</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 rounded-full mt-0.5 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">Dedicated Model – no freelancers or shared resources</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 rounded-full mt-0.5 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">Client-Specific Assignment – exclusive work for one client</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 rounded-full mt-0.5 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">Performance Monitoring – based on client feedback</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* The Value Section */}
                  <div className="bg-lime-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">The Value:</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Your team gets better management and development than most local companies provide. Result? Higher performance, better retention, and continuous improvement.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Operational Support Services Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Operational Support Services
                  </h2>
                  <p className="text-base text-gray-600">
                    Why This Matters: When problems arise (and they will), you need a partner who can solve them quickly and professionally.
                  </p>
                </div>

                {/* Technology Support and Administrative Services Cards */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  {/* Technology Support */}
                  <div className="bg-lime-50 rounded-xl p-6 border border-lime-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Support</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">24/7 Technical Support - backup equipment ready</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Complete IT Infrastructure - maintenance and monitoring</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Equipment Replacement Guarantee - failures handled immediately</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Software Support - troubleshooting assistance</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Multiple ISP Connections - automatic failover</p>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Services */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Administrative Services</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Complete HR Administration - all employment matters handled</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Government Relations - DOLE, CDC, BIR compliance managed</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Legal Compliance Monitoring - updates and changes handled</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Document Management - proper record retention</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Separation Processing - professional employee transitions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Continuity Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Business Continuity</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Backup Power Systems - UPS and generator protection</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Emergency Contact Procedures - escalation protocols</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Force Majeure Planning - Philippine-specific risk management</p>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Disaster Recovery Procedures - business continuity planning</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Typhoon Preparedness - seasonal risk mitigation</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">Alternative Workspace Options - flexibility during emergencies</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Value Section */}
                <div className="bg-orange-500 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-2">The Value</h3>
                  <p className="text-white leading-relaxed">
                    You get enterprise-level support without building your own support team. We handle the operations so you can focus on strategy.
                  </p>
                </div>
              </div>
            </section>

            {/* The Massive Value Proposition Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    The Massive Value Proposition
                  </h2>
                </div>

                {/* Comparison Cards */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* What It Would Cost to Build This Yourself */}
                  <div className="bg-white rounded-xl p-6 border border-red-200 shadow-lg">
                    <h3 className="text-xl font-bold text-red-600 mb-4">What It Would Cost to Build This Yourself:</h3>
                    
                    {/* Infrastructure Investment */}
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Infrastructure Investment:</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">Office Space: {formatPrice(convertPrice(50000))}+ setup, {formatPrice(convertPrice(20000))}+/month</p>
                        <p className="text-sm text-gray-700">Enterprise Network: {formatPrice(convertPrice(100000))}+ initial</p>
                        <p className="text-sm text-gray-700">Workstations: {formatPrice(convertPrice(3000))}+ per employee</p>
                        <p className="text-sm text-gray-700">Software Licenses: {formatPrice(convertPrice(500))}+/employee/month</p>
                      </div>
                    </div>

                    {/* Human Resources */}
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Human Resources:</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">HR Director: {formatPrice(convertPrice(80000))}+/year</p>
                        <p className="text-sm text-gray-700">Payroll Specialist: {formatPrice(convertPrice(40000))}+/year</p>
                        <p className="text-sm text-gray-700">Compliance Officer: {formatPrice(convertPrice(60000))}+/year</p>
                        <p className="text-sm text-gray-700">IT Support: {formatPrice(convertPrice(45000))}+/year</p>
                      </div>
                    </div>

                    {/* Total Cost Summary */}
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="font-bold text-red-600 text-sm">
                        Total: {formatPrice(convertPrice(500000))}+ initial, {formatPrice(convertPrice(100000))}+/month ongoing
                      </p>
                    </div>
                  </div>

                  {/* Shore Agents All-Inclusive Approach */}
                  <div className="bg-lime-50 rounded-xl p-6 border border-lime-200 shadow-lg">
                    <h3 className="text-xl font-bold text-lime-600 mb-4">Shore Agents All-Inclusive Approach:</h3>
                    
                    {/* Key Benefit */}
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-lime-600 mb-2">60-70% LESS</p>
                      <p className="text-sm text-gray-700">
                        You get everything above for the cost of your staff plus workspace
                      </p>
                    </div>

                    {/* Features/Benefits */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Complete business ecosystem included</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">No vendor management headaches</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Enterprise quality at small business pricing</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">Scale benefits without complexity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Perfect for Companies Who Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-pink-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Perfect for Companies Who:
                  </h2>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Want to scale quickly without operational complexity</p>
                      </div>
                    </div>
                    <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Require enterprise-level infrastructure without enterprise costs</p>
                      </div>
                    </div>
                    <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Prefer partnership over vendor relationships</p>
                      </div>
                    </div>
                    <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Want flexibility to grow and adapt as needs change</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Need reliable, dedicated staff for critical functions</p>
                      </div>
                    </div>
                    <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Value compliance and security in international operations</p>
                      </div>
                    </div>
                    <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Seek predictable costs and transparent pricing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* The Shore Agents Competitive Advantage Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    The Shore Agents Competitive Advantage
                  </h2>
                </div>

                {/* Competitive Advantage Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: Complete Ecosystem */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Complete Ecosystem</h3>
                    <p className="text-lime-600 text-sm mb-3">(Not Just Staff)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Other providers give you people; we give you a complete business solution with everything integrated seamlessly.
                    </p>
                  </div>

                  {/* Card 2: True Partnership */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">True Partnership</h3>
                    <p className="text-lime-600 text-sm mb-3">(Not Just Service)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We're invested in your success with proactive problem-solving and strategic guidance.
                    </p>
                  </div>

                  {/* Card 3: Enterprise Quality */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Enterprise Quality</h3>
                    <p className="text-lime-600 text-sm mb-3">(Small Business Pricing)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Fortune 500 infrastructure accessible to companies of all sizes with scale benefits.
                    </p>
                  </div>

                  {/* Card 4: Philippine Expertise */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Philippine Expertise</h3>
                    <p className="text-lime-600 text-sm mb-3">(International Standards)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Deep local understanding combined with international business practices.
                    </p>
                  </div>

                  {/* Card 5: Proven Track Record */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-sm">5</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Proven Track Record</h3>
                    <p className="text-lime-600 text-sm mb-3">(Real Results)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      500+ companies trust us with industry-leading retention rates and satisfaction scores.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Next Steps Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Your Next Steps
                  </h2>
                  <p className="text-lg text-gray-600">
                    Ready to Transform Your Business?
                  </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-lime-50 rounded-xl p-8 border border-lime-200 shadow-lg">
                  {/* What Happens Next */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">What Happens Next:</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Step 1 */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Phone className="w-5 h-5 text-lime-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Discovery Call</h4>
                        <p className="text-sm text-gray-600">Understand your specific needs and goals</p>
                      </div>

                      {/* Step 2 */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="w-5 h-5 text-lime-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Custom Proposal</h4>
                        <p className="text-sm text-gray-600">Tailored solution for your business</p>
                      </div>

                      {/* Step 3 */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">3</span>
                        </div>
                        <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-5 h-5 text-lime-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Pilot Program</h4>
                        <p className="text-sm text-gray-600">Start small and prove the value</p>
                      </div>

                      {/* Step 4 */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">4</span>
                        </div>
                        <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Trophy className="w-5 h-5 text-lime-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Scale Successfully</h4>
                        <p className="text-sm text-gray-600">Grow your team with confidence</p>
                      </div>
                    </div>
                  </div>

                  {/* Questions to Consider */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Questions to Consider:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg p-4 flex items-start gap-3">
                          <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white font-bold text-sm">?</span>
                          </div>
                          <p className="text-sm text-gray-700">How much are you spending on recruitment and retention?</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 flex items-start gap-3">
                          <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white font-bold text-sm">?</span>
                          </div>
                          <p className="text-sm text-gray-700">How much management time goes to operational issues?</p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg p-4 flex items-start gap-3">
                          <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white font-bold text-sm">?</span>
                          </div>
                          <p className="text-sm text-gray-700">What's the cost of compliance mistakes in your industry?</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 flex items-start gap-3">
                          <div className="w-6 h-6 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white font-bold text-sm">?</span>
                          </div>
                          <p className="text-sm text-gray-700">What could you achieve with 40 hours/week back in your schedule?</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/gettingstart">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Calendar className="mr-2 w-5 h-5" />
                        Book Free Consultation
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                      >
                        <TrendingUp className="mr-2 w-5 h-5" />
                        Calculate Your Savings
                      </Button>
                    </Link>
                    <Link href="/case-studies">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                      >
                        <Star className="mr-2 w-5 h-5" />
                        See Success Stories
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* The Bottom Line Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Card 1 */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-lime-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                    <p className="text-gray-600 font-medium">Companies Trust Shore Agents</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                    <p className="text-gray-600 font-medium">Compliance Guaranteed</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">60-70%</div>
                    <p className="text-gray-600 font-medium">Cost Savings vs DIY</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      The Bottom Line
                    </h2>
                  </div>

                  <div className="max-w-4xl mx-auto space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Shore Agents isn't just another BPO provider - we're your <span className="font-bold text-gray-900">complete offshore business solution</span>. While others give you staff, we give you an entire operational ecosystem that handles everything from finding the right people to keeping them happy, productive, and compliant.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      <span className="font-bold text-lime-600">The result?</span> You get to focus on what you do best - <span className="font-bold text-lime-600">growing your business</span> - while we handle everything else with <span className="font-bold text-lime-600">enterprise-level quality</span> and <span className="font-bold text-lime-600">small-business flexibility</span>.
                    </p>

                    <div className="bg-lime-50 rounded-lg p-6 border border-lime-200">
                      <p className="text-lg text-gray-700 italic text-center">
                        "Ready to see what 500+ companies already know? Shore Agents is the competitive advantage you've been looking for."
                      </p>
                    </div>

                    <p className="text-lg text-gray-700 leading-relaxed text-center">
                      Join the companies who've discovered that Shore Agents isn't just a service provider - we're the partner that makes international scaling simple, successful, and profitable.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                      <Link href="/gettingstart">
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Contact Us Today
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                      <Link href="/about">
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                        >
                          <Star className="mr-2 w-5 h-5" />
                          Discover the Difference
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Call to Action Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-lime-50">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Ready to Transform Your Business Operations?
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Don't spend another day managing operational headaches. Let Shore Agents handle the complexity while you focus on growth.
                </p>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Card 1 */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Free Consultation</h3>
                    <p className="text-sm text-gray-600">No obligation discovery call</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Custom Pricing</h3>
                    <p className="text-sm text-gray-600">Transparent, tailored quotes</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Proven Results</h3>
                    <p className="text-sm text-gray-600">500+ successful partnerships</p>
                  </div>
                </div>

                {/* Main CTA Button */}
                <Link href="/gettingstart">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6"
                  >
                    <Calendar className="mr-2 w-6 h-6" />
                    Book Your Free Consultation
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>

                <p className="text-gray-600">
                  Join 500+ companies who've made the smart choice. Your offshore team is waiting.
                </p>
              </div>
            </section>
          </div>
        </>
      )
    }
