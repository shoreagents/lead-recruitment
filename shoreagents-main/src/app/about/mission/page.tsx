"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Target, Eye, Heart, Users, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function OurMissionPage() {
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
              <Target className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                What drives us forward and shapes everything we do at ShoreAgents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Statement */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-lime-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Target className="w-10 h-10 text-lime-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                To empower businesses worldwide by connecting them with exceptional talent, 
                delivering innovative outsourcing solutions that drive growth, efficiency, and success.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-lime-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Eye className="w-10 h-10 text-lime-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                To be the world&apos;s most trusted and innovative outsourcing partner, 
                transforming how businesses operate and succeed in the global marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Heart className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Excellence</h3>
              </div>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from the quality of our services 
                to the relationships we build with our clients and team members.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Users className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Collaboration</h3>
              </div>
              <p className="text-gray-600">
                We believe in the power of teamwork and collaboration, working together 
                to achieve common goals and deliver exceptional results.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Award className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Integrity</h3>
              </div>
              <p className="text-gray-600">
                We conduct business with honesty, transparency, and ethical practices, 
                building trust with our clients, partners, and team members.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Innovation</h3>
              </div>
              <p className="text-gray-600">
                We embrace change and continuously seek innovative solutions to meet 
                the evolving needs of our clients and the market.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Heart className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Client Focus</h3>
              </div>
              <p className="text-gray-600">
                Our clients&apos; success is our success. We are committed to understanding 
                their needs and delivering solutions that exceed their expectations.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Users className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Growth</h3>
              </div>
              <p className="text-gray-600">
                We foster a culture of continuous learning and development, 
                encouraging our team members to grow both personally and professionally.
              </p>
            </div>
          </div>
        </div>

        {/* What Drives Us */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Drives Us Forward</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Client Success</h3>
                <p className="text-gray-700 mb-4">
                  Every decision we make is guided by our commitment to client success. 
                  We measure our own success by the success of our clients.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Proven track record of client satisfaction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Long-term partnerships built on trust</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Measurable results and ROI</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation & Technology</h3>
                <p className="text-gray-700 mb-4">
                  We stay at the forefront of industry trends and technological advancements 
                  to deliver cutting-edge solutions.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">AI-powered automation solutions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Digital transformation expertise</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Continuous process improvement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-16">
          <div className="bg-lime-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-lime-100">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-lime-100">Professionals</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">60%</div>
                <div className="text-lime-100">Average Cost Savings</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-lime-100">Client Retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Partner With Us?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Let&apos;s work together to achieve your business goals and drive success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/contact">
              <Button size="lg" className="bg-lime-600 text-white hover:bg-lime-700">
                Get in Touch
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/about/case-studies">
              <Button size="lg" variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                View Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
