"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calculator, BookOpen } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function AccountingOutsourcingPage() {
  return (
    <>
      <SideNav />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-lime-100 border border-lime-300 text-gray-700 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Calculator className="w-4 h-4 text-lime-600" />
              <span className="font-semibold text-sm uppercase tracking-wide">ACCOUNTING OUTSOURCING</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">Professional Accounting</span>
              <span className="block">
                Without the{' '}
                <span className="text-lime-600">Overhead</span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access qualified Filipino accountants who understand your business finances, tax compliance, and reporting needs - delivering professional financial management at{' '}
              <span className="font-bold text-lime-600">$493/month all-inclusive.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Accounting Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View Case Studies
              </Button>
            </div>
          </div>
        </section>

        {/* Why Businesses Trust Us Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Businesses Trust Shore Agents for Accounting
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                From financial reporting to tax compliance, our accounting professionals provide the expertise and reliability your business needs for sound financial management.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Key Benefits */}
              <div className="space-y-8">
                {/* Professional Qualifications */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Professional Qualifications
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Certified accountants with strong understanding of accounting principles, tax regulations, and financial reporting standards.
                    </p>
                  </div>
                </div>

                {/* Compliance Expertise */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Compliance Expertise
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Deep knowledge of tax laws and regulations ensuring your business stays compliant and optimizes financial opportunities.
                    </p>
                  </div>
                </div>

                {/* Timely Reporting */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Timely Reporting
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Consistent, accurate financial reporting that helps you make informed business decisions and meet all deadlines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Testimonial Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Stephen's Accounting Reality
                </h3>
                <div className="space-y-6">
                  <blockquote className="text-gray-700 leading-relaxed italic">
                    "The thing is, when you're running multiple businesses, accurate books aren't optional. That disaster with the roosters taught me about unexpected expenses and proper record keeping!"
                  </blockquote>
                  <blockquote className="text-gray-700 leading-relaxed italic">
                    "So basically, we needed accountants who understood both the technical side and the business implications. Our Filipino accounting team prevents those 'surprise' tax bills."
                  </blockquote>
                  <blockquote className="text-gray-700 leading-relaxed italic">
                    "One client saved $40K in the first year just from proper tax planning and expense optimization. Their monthly financial clarity improved decision-making across all departments."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Accounting Services Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Accounting Services
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                From day-to-day bookkeeping to strategic financial analysis, we provide full-spectrum accounting support for businesses of all sizes.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Financial Reporting */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Reporting</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Monthly financial statements
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    P&L analysis
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Cash flow reports
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Budget vs actual analysis
                  </li>
                </ul>
              </div>

              {/* Tax Preparation */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Preparation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Corporate tax returns
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Tax planning strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Quarterly estimates
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Compliance monitoring
                  </li>
                </ul>
              </div>

              {/* Accounts Management */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Accounts Management</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Accounts payable
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Accounts receivable
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Invoice processing
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Payment scheduling
                  </li>
                </ul>
              </div>

              {/* Financial Analysis */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Analysis</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Performance metrics
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Profitability analysis
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Cost center analysis
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Variance reporting
                  </li>
                </ul>
              </div>

              {/* Payroll Processing */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payroll Processing</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Payroll calculations
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Tax withholdings
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Benefits administration
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Compliance reporting
                  </li>
                </ul>
              </div>

              {/* Business Advisory */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Advisory</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Financial planning
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Business insights
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Growth strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">•</span>
                    Risk assessment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Accounting Investment Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Professional Accounting Investment
              </h2>
            </div>

            {/* Investment Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-12">
              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Cost */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    $493
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Per accountant/month
                  </div>
                </div>

                {/* Savings */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                    $40K
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Average annual savings
                  </div>
                </div>

                {/* Compliance */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Tax compliance rate
                  </div>
                </div>
              </div>

              {/* Middle Text */}
              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  All-inclusive: Salary, benefits, accounting software, workspace, and professional oversight
                </p>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Calculate Your Investment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Financial Services Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Related Financial Services
              </h2>
            </div>

            {/* Service Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Bookkeeping Outsourcing */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-lime-200 transition-colors duration-300">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Bookkeeping Outsourcing
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Daily financial record keeping and transaction management.
                </p>
                <a href="/services/pillars/bookkeeping-outsourcing" className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Real Estate Outsourcing */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-lime-200 transition-colors duration-300">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real Estate Outsourcing
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Specialized accounting for real estate transactions and management.
                </p>
                <a href="/services/pillars/real-estate-outsourcing" className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Construction Outsourcing */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-lime-200 transition-colors duration-300">
                  <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Construction Outsourcing
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Project-based accounting and cost management for construction.
                </p>
                <a href="/services/pillars/construction-outsourcing" className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-600">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Optimize Your Financial Management?
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed opacity-95">
              Join businesses who've streamlined their accounting while saving thousands in taxes and penalties.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white hover:border-gray-100"
              >
                Start Accounting Partnership
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="default" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                View Success Stories
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
