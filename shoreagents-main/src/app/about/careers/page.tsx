"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Award, Heart, TrendingUp, MapPin, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function CareersPage() {
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
              <Users className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Careers</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Join our dynamic team and be part of something amazing. Discover opportunities to grow, 
                learn, and make a difference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Join Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Join ShoreAgents?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Great Culture</h3>
              <p className="text-gray-600 text-sm">
                Work in a supportive, collaborative environment where your ideas matter and growth is encouraged.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Career Growth</h3>
              <p className="text-gray-600 text-sm">
                Continuous learning opportunities, mentorship programs, and clear career progression paths.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Competitive Benefits</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive health coverage, flexible work arrangements, and performance-based rewards.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Global Impact</h3>
              <p className="text-gray-600 text-sm">
                Work with international clients and make a difference in businesses worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Current Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Current Openings</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Senior Account Manager</h3>
                  <p className="text-gray-600 mb-4">
                    Lead client relationships and ensure exceptional service delivery for our key accounts.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Clark, Pampanga</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Competitive Salary</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-lime-600 text-white hover:bg-lime-700">
                  Apply Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Recruitment Specialist</h3>
                  <p className="text-gray-600 mb-4">
                    Find and attract top talent to join our growing team and support our clients&apos; needs.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Clark, Pampanga</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Competitive Salary</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-lime-600 text-white hover:bg-lime-700">
                  Apply Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Virtual Assistant</h3>
                  <p className="text-gray-600 mb-4">
                    Provide administrative support to our clients across various industries and business functions.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Remote / Clark, Pampanga</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Competitive Salary</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-lime-600 text-white hover:bg-lime-700">
                  Apply Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Finance Coordinator</h3>
                  <p className="text-gray-600 mb-4">
                    Manage financial operations and ensure accurate reporting for our organization and clients.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Clark, Pampanga</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Competitive Salary</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-lime-600 text-white hover:bg-lime-700">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health & Wellness</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Comprehensive health insurance</li>
                <li>• Dental and vision coverage</li>
                <li>• Mental health support</li>
                <li>• Wellness programs</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work-Life Balance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Flexible work arrangements</li>
                <li>• Paid time off</li>
                <li>• Remote work options</li>
                <li>• Family-friendly policies</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Development</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Training and certification programs</li>
                <li>• Conference attendance</li>
                <li>• Mentorship opportunities</li>
                <li>• Career advancement paths</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Competitive salary packages</li>
                <li>• Performance bonuses</li>
                <li>• Retirement plans</li>
                <li>• Stock options</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Perks</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Modern office facilities</li>
                <li>• Free coffee and snacks</li>
                <li>• Team events and activities</li>
                <li>• Casual dress code</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Latest tools and software</li>
                <li>• Home office setup support</li>
                <li>• Professional development tools</li>
                <li>• Tech training programs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Application Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply</h3>
                <p className="text-gray-600 text-sm">
                  Submit your application with resume and cover letter
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review</h3>
                <p className="text-gray-600 text-sm">
                  Our team reviews your application within 48 hours
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview</h3>
                <p className="text-gray-600 text-sm">
                  Multiple rounds of interviews with our team
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Offer</h3>
                <p className="text-gray-600 text-sm">
                  Receive your offer and join our amazing team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Team?</h2>
          <p className="text-xl text-lime-100 mb-6">
            Don&apos;t see a position that matches your skills? Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
              Submit General Application
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
            </Button>
            <Link href="/about/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                Contact HR Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
