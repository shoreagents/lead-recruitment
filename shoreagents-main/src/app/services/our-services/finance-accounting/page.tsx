"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calculator, Crown } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function FinanceAccountingPage() {
  return (
    <>
      <SideNav />
      <div className="min-h-screen bg-lime-50">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tag Button */}
            <div className="inline-flex items-center gap-2 bg-lime-100 text-gray-700 px-6 py-3 rounded-full mb-8 shadow-sm">
              <Calculator className="w-4 h-4" />
              <span className="font-semibold text-sm uppercase tracking-wide">ACCOUNTING VIRTUAL ASSISTANT</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block">Professional</span>
              <span className="block">
                <span className="text-lime-600">Accounting</span>
              </span>
              <span className="block">Without the Overhead</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Access qualified accounting VAs who understand financial management, tax compliance, and reporting at{' '}
              <span className="font-bold">$496/month all-inclusive.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Accounting VA Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                <Crown className="mr-2 h-5 w-5" />
                View Case Studies
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Services Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Accounting Virtual Assistant Services
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Professional qualifications, compliance expertise, and timely reporting for sound financial management.
              </p>
            </div>

            {/* Services Cards - 2x3 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Row 1, Column 1: Financial Reporting */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <Calculator className="w-8 h-8 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Financial Reporting
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Monthly financial statements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">P&L analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Cash flow reports</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Budget vs actual analysis</span>
                  </li>
                </ul>
              </div>

              {/* Row 1, Column 2: Tax Preparation */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Tax Preparation
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Corporate tax returns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Tax planning strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Quarterly estimates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Compliance monitoring</span>
                  </li>
                </ul>
              </div>

              {/* Row 1, Column 3: Accounts Management */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Accounts Management
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Accounts payable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Accounts receivable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Invoice processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Payment scheduling</span>
                  </li>
                </ul>
              </div>

              {/* Row 2, Column 1: Financial Analysis */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Financial Analysis
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Performance metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Profitability analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Cost center analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Variance reporting</span>
                  </li>
                </ul>
              </div>

              {/* Row 2, Column 2: Payroll Processing */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Payroll Processing
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Payroll calculations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Tax withholdings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Benefits administration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Compliance reporting</span>
                  </li>
                </ul>
              </div>

              {/* Row 2, Column 3: Business Advisory */}
              <div className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Business Advisory
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Financial planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Business insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Growth strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Risk assessment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Investment Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Accounting Virtual Assistant Investment
              </h2>
            </div>

            {/* Investment Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Cost Metric */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    $496
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Per accounting VA/month
                  </div>
                </div>

                {/* Savings Metric */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                    $40K
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Average annual savings
                  </div>
                </div>

                {/* Compliance Metric */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Tax compliance rate
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
                >
                  Calculate Your Investment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Green CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Optimize Your Financial Management?
            </h2>
            <p className="text-lg sm:text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
              Join businesses who've streamlined their accounting while saving thousands in taxes and penalties.
            </p>
            
            {/* CTA Links */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Accounting Partnership
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg"
                className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Crown className="mr-2 h-5 w-5" />
                View Success Stories
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
