"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Award, TrendingUp, Users, DollarSign, Star } from 'lucide-react'
import Link from 'next/link'

export default function SuccessStoriesPage() {
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
              <Award className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Real results from real clients - discover how we&apos;ve helped businesses achieve their goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Success Stories</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Jack Miller Story */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Award className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Jack Miller</h3>
                  <p className="text-lime-600 font-medium">Real Estate Agency Owner</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Jack Miller&apos;s real estate agency was struggling with administrative overhead and client management. 
                ShoreAgents stepped in to provide comprehensive support, resulting in significant cost savings 
                and improved operational efficiency.
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
                Read Full Story
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>

            {/* Ballast Story */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ballast</h3>
                  <p className="text-lime-600 font-medium">Property Management Company</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Ballast needed to scale their operations rapidly to meet growing demand. ShoreAgents helped 
                them expand from 4 to 46 team members while maintaining quality standards and improving 
                client satisfaction.
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
                Read Full Story
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        </div>

        {/* Industry Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Industry Success Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Finance & Accounting</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Streamlined financial operations for a mid-sized accounting firm, reducing processing time by 70%.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 70% faster processing</div>
                <div>• 99.9% accuracy rate</div>
                <div>• $25K annual savings</div>
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
                Enhanced document management and client communication for a growing law practice.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 50% time savings</div>
                <div>• Improved client satisfaction</div>
                <div>• Enhanced compliance</div>
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
                Boosted lead generation and conversion rates for a digital marketing agency.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 40% increase in leads</div>
                <div>• 25% higher conversion</div>
                <div>• Enhanced brand presence</div>
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
                Improved claims processing and customer service for an insurance company.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Faster claims processing</div>
                <div>• Improved customer satisfaction</div>
                <div>• Enhanced compliance</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <Users className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Healthcare</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Streamlined administrative processes for a healthcare provider network.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Reduced administrative burden</div>
                <div>• Improved patient care</div>
                <div>• Enhanced data security</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-lime-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">E-commerce</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Enhanced customer support and order management for an online retailer.
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• 24/7 customer support</div>
                <div>• Improved order accuracy</div>
                <div>• Increased customer retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Jack Miller</h4>
                  <p className="text-sm text-gray-600">Real Estate Agency Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                &quot;ShoreAgents transformed our operations completely. The cost savings were incredible, 
                but more importantly, the quality of work exceeded our expectations.&quot;
              </p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                &quot;The team at ShoreAgents became an extension of our company. Their dedication and 
                expertise helped us scale our marketing efforts significantly.&quot;
              </p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Operations Manager</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                &quot;Working with ShoreAgents has been a game-changer for our business. Their attention to detail 
                and commitment to quality is outstanding.&quot;
              </p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
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
            <Link href="/about/case-studies">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                View Case Studies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
