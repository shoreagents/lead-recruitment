"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, User, TrendingUp, Calculator, Shield } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function SeoVirtualAssistantPage() {
  return (
    <div className="min-h-screen bg-white">
      <SideNav />
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-lime-100 text-gray-700 px-4 py-2 rounded-full shadow-sm">
              <Search className="w-4 h-4" />
              <span className="font-semibold text-sm uppercase tracking-wide">SEO VIRTUAL ASSISTANT</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                <span className="block">Claude-Powered SEO:</span>
                <span className="block">
                  When AI Meets{' '}
                  <span className="text-lime-600">Filipino Talent</span>
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              So basically, I used to write "every fucking website" myself until I discovered Uncle Claude. Now our SEO VAs create content that actually ranks at{' '}
              <span className="font-bold">$352/month all-inclusive.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                variant="default"
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                Get SEO VA Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 text-base font-semibold"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                View SEO Results
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              SEO Virtual Assistant Investment
            </h2>
            
            {/* Investment Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">$352</div>
                  <div className="text-gray-700">Per SEO VA/month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-lime-600 mb-2">500%</div>
                  <div className="text-gray-700">Average traffic increase</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-lime-600 mb-2">85%</div>
                  <div className="text-gray-700">Reduction in cost per lead</div>
                </div>
              </div>
              
              {/* Calculate Button */}
              <Button 
                variant="default"
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Your Investment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Services Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              SEO Virtual Assistant Services
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Specialized virtual assistants for search engine optimization and digital marketing tasks, powered by Claude AI and Filipino expertise.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Content Creation */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <Search className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Content Creation</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  SEO-optimized blog posts
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Meta descriptions & titles
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Keyword research & analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Content calendar management
                </li>
              </ul>
            </div>

            {/* Technical SEO */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Technical SEO</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Site speed optimization
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Schema markup implementation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  XML sitemap management
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Core Web Vitals monitoring
                </li>
              </ul>
            </div>

            {/* Analytics & Reporting */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Analytics & Reporting</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Google Analytics setup
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Search Console monitoring
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Monthly performance reports
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                  Competitor analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Lime Background */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Dominate Search Results?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join businesses who've eliminated SEO guesswork and built systematic ranking strategies that drive real traffic and conversions.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 text-base font-semibold bg-transparent"
            >
              Start SEO Partnership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 text-base font-semibold bg-transparent"
            >
              <Shield className="mr-2 h-5 w-5" />
              View SEO Results
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
