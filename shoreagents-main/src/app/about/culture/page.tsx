"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Heart, Award, Coffee, Calendar, Globe, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CulturePage() {
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
              <Heart className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Culture</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Discover what makes ShoreAgents a great place to work and grow professionally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Culture Overview */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Workplace Culture</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                At ShoreAgents, we believe that a positive, inclusive culture is the foundation of our success. 
                We foster an environment where every team member feels valued, supported, and empowered to reach their full potential.
              </p>
            </div>
          </div>
        </div>

        {/* Culture Pillars */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Culture Pillars</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Users className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Inclusivity</h3>
              </div>
              <p className="text-gray-600">
                We celebrate diversity and create an inclusive environment where everyone feels welcome, 
                respected, and heard regardless of their background or perspective.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Award className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Excellence</h3>
              </div>
              <p className="text-gray-600">
                We maintain high standards in everything we do, encouraging continuous improvement 
                and celebrating achievements both big and small.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Heart className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Support</h3>
              </div>
              <p className="text-gray-600">
                We support each other&apos;s growth and well-being, offering mentorship, resources, 
                and a helping hand whenever needed.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Zap className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Innovation</h3>
              </div>
              <p className="text-gray-600">
                We encourage creative thinking and new ideas, embracing change and 
                continuously looking for ways to improve and innovate.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Globe className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Global Mindset</h3>
              </div>
              <p className="text-gray-600">
                We embrace cultural diversity and global perspectives, learning from 
                different viewpoints and experiences from around the world.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Coffee className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Work-Life Balance</h3>
              </div>
              <p className="text-gray-600">
                We understand the importance of balance, offering flexible arrangements 
                and encouraging team members to prioritize their well-being.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Life */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">A Day in the Life</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Morning Routine</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lime-600 font-semibold text-sm">9</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Team Stand-up</h4>
                    <p className="text-gray-600 text-sm">Start the day with team updates and goal setting</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lime-600 font-semibold text-sm">10</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Coffee & Collaboration</h4>
                    <p className="text-gray-600 text-sm">Informal discussions and idea sharing over coffee</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lime-600 font-semibold text-sm">11</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Deep Work</h4>
                    <p className="text-gray-600 text-sm">Focused time on client projects and deliverables</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Afternoon Activities</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lime-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Lunch & Learn</h4>
                    <p className="text-gray-600 text-sm">Educational sessions and skill development</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lime-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Client Meetings</h4>
                    <p className="text-gray-600 text-sm">Collaborative sessions with clients and partners</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lime-600 font-semibold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Team Wrap-up</h4>
                    <p className="text-gray-600 text-sm">End-of-day reflections and planning for tomorrow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Activities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Team Activities & Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Monthly Team Lunches</h3>
              <p className="text-gray-600 text-sm">
                Regular team bonding over delicious meals and great conversations
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recognition Programs</h3>
              <p className="text-gray-600 text-sm">
                Celebrating achievements and milestones with awards and recognition
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Building</h3>
              <p className="text-gray-600 text-sm">
                Fun activities and workshops to strengthen team relationships
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Innovation Days</h3>
              <p className="text-gray-600 text-sm">
                Dedicated time for creative projects and new ideas
              </p>
            </div>
          </div>
        </div>

        {/* Work Environment */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Work Environment</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Culture</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Open and collaborative workspace</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Casual dress code and relaxed atmosphere</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Modern facilities and amenities</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Flexible work arrangements</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Remote Work Culture</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Hybrid work model support</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Virtual team activities and events</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Digital collaboration tools</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Regular virtual check-ins and support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Amazing Culture</h2>
          <p className="text-xl text-lime-100 mb-6">
            Ready to be part of a workplace that values you and your growth? Explore career opportunities with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/careers">
              <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
                View Open Positions
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/about/team">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                Meet Our Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
