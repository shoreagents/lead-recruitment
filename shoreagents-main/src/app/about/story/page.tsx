"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Users, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function OurStoryPage() {
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
              <BookOpen className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Discover the journey that led us to become a leading outsourcing partner for businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Story Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Beginning</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  ShoreAgents was founded with a simple yet powerful vision: to connect exceptional talent with businesses 
                  that need them, creating opportunities for growth and success on both sides of the equation.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  What started as a small team in Clark, Philippines has grown into a comprehensive outsourcing partner 
                  serving clients across the globe. Our journey has been marked by continuous innovation, unwavering 
                  commitment to quality, and deep understanding of our clients&apos; evolving needs.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Today, we&apos;re proud to have helped thousands of businesses scale their operations, reduce costs, 
                  and focus on their core competencies while we handle the rest.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Growth Journey</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                    <span className="text-lime-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Foundation (2014-2016)</h3>
                    <p className="text-gray-700">Started with a small team of dedicated professionals, focusing on real estate support services.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                    <span className="text-lime-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expansion (2017-2019)</h3>
                    <p className="text-gray-700">Expanded services to include finance, legal, and marketing support, serving clients across Australia and New Zealand.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                    <span className="text-lime-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation (2020-2022)</h3>
                    <p className="text-gray-700">Introduced AI-powered solutions and digital transformation services, adapting to the changing business landscape.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                    <span className="text-lime-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Leadership (2023-Present)</h3>
                    <p className="text-gray-700">Became a leading outsourcing partner with comprehensive services and global reach.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Our Impact</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-lime-50 rounded-lg">
                  <div className="text-3xl font-bold text-lime-600 mb-2">1000+</div>
                  <div className="text-gray-700">Happy Clients</div>
                </div>
                <div className="text-center p-4 bg-lime-50 rounded-lg">
                  <div className="text-3xl font-bold text-lime-600 mb-2">5000+</div>
                  <div className="text-gray-700">Professionals</div>
                </div>
                <div className="text-center p-4 bg-lime-50 rounded-lg">
                  <div className="text-3xl font-bold text-lime-600 mb-2">10+</div>
                  <div className="text-gray-700">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-lime-50 rounded-lg">
                  <div className="text-3xl font-bold text-lime-600 mb-2">95%</div>
                  <div className="text-gray-700">Client Retention</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/about/team" className="block p-3 rounded-lg hover:bg-lime-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700">Meet Our Team</span>
                  </div>
                </Link>
                <Link href="/about/mission" className="block p-3 rounded-lg hover:bg-lime-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700">Our Mission</span>
                  </div>
                </Link>
                <Link href="/about/case-studies" className="block p-3 rounded-lg hover:bg-lime-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700">Success Stories</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
