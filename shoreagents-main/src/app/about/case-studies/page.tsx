"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Award, TrendingUp, DollarSign, Users, Building, User } from 'lucide-react'
import Link from 'next/link'

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to About
              </Button>
            </Link>
          </div>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 p-4 bg-lime-100 rounded-xl">
              <FileText className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Real results from real clients - explore our comprehensive collection of success stories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Case Studies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Success Stories</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Jack Miller Case Study */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Award className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Jack Miller</h3>
                  <p className="text-lime-600 font-medium">$40K Annual Savings</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Discover how we helped Jack Miller achieve significant cost savings while improving operational 
                efficiency and maintaining high quality standards.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-lime-50 rounded-lg">
                  <div className="text-2xl font-bold text-lime-600">$40K</div>
                  <div className="text-sm text-gray-600">Annual Savings</div>
                </div>
                <div className="text-center p-3 bg-lime-50 rounded-lg">
                  <div className="text-2xl font-bold text-lime-600">85%</div>
                  <div className="text-sm text-gray-600">Efficiency Gain</div>
                </div>
              </div>
              <Button variant="outline" className="w-full border-lime-600 text-lime-600 hover:bg-lime-50">
                Read Full Case Study
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>

            {/* Ballast Case Study */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Building className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ballast</h3>
                  <p className="text-lime-600 font-medium">4 to 46 Team Growth</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                From 4 to 46 professionals - see our remarkable growth story with Ballast. This partnership showcases 
                our ability to scale operations efficiently while maintaining quality and performance standards.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-lime-50 rounded-lg">
                  <div className="text-2xl font-bold text-lime-600">46</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="text-center p-3 bg-lime-50 rounded-lg">
                  <div className="text-2xl font-bold text-lime-600">95%</div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                </div>
              </div>
              <Button variant="outline" className="w-full border-lime-600 text-lime-600 hover:bg-lime-50">
                Read Full Case Study
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        </div>

        {/* Industry Case Studies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Industry Success Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <Building className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Real Estate</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Comprehensive support for real estate agencies, property management, and development companies.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 60% cost reduction</div>
                <div>• 24/7 support coverage</div>
                <div>• Enhanced client satisfaction</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Finance & Accounting</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Streamlined financial operations and accounting support for businesses of all sizes.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 70% faster processing</div>
                <div>• 99.9% accuracy rate</div>
                <div>• Reduced compliance risks</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <Users className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Legal Services</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Comprehensive legal support and administrative assistance for law firms and legal departments.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 50% time savings</div>
                <div>• Enhanced document management</div>
                <div>• Improved client communication</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Marketing & Sales</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Strategic marketing support and sales assistance to drive growth and customer acquisition.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 40% increase in leads</div>
                <div>• Improved conversion rates</div>
                <div>• Enhanced brand presence</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <Building className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Construction</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Comprehensive support for construction companies, project management, and development firms.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Streamlined project coordination</div>
                <div>• Enhanced safety compliance</div>
                <div>• Improved cost management</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <Award className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Insurance</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Specialized support for insurance companies, claims processing, and customer service.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Faster claims processing</div>
                <div>• Improved customer satisfaction</div>
                <div>• Enhanced compliance management</div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Overview */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Impact by the Numbers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">60%</div>
                <div className="text-gray-700">Average Cost Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">85%</div>
                <div className="text-gray-700">Quality Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">95%</div>
                <div className="text-gray-700">Client Retention Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">&lt; 2hrs</div>
                <div className="text-gray-700">Average Response Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Jack Miller</h4>
                  <p className="text-sm text-gray-600">Real Estate Agency Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;ShoreAgents transformed our operations completely. The cost savings were incredible, 
                but more importantly, the quality of work exceeded our expectations.&quot;
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;The team at ShoreAgents became an extension of our company. Their dedication and 
                expertise helped us scale our marketing efforts significantly.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Success Story?</h2>
          <p className="text-xl text-lime-100 mb-6">
            Let&apos;s discuss how we can help you achieve similar results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/contact">
              <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
                Start Your Journey
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/about/success-stories">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                More Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
