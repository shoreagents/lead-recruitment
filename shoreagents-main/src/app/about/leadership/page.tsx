"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Award, Building, Users, Mail, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function LeadershipPage() {
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Meet the visionary leaders who guide ShoreAgents towards excellence and innovation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CEO Section */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <div className="w-48 h-48 bg-lime-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User className="w-24 h-24 text-lime-600" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Stephen Atcheler</h2>
                  <p className="text-lime-600 font-semibold text-lg mb-4">Chief Executive Officer</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About Stephen</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Stephen Atcheler is the visionary leader behind ShoreAgents, bringing over 15 years of experience 
                  in business development and outsourcing solutions. His strategic vision has transformed ShoreAgents 
                  from a small startup into a global outsourcing leader.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Under Stephen&apos;s leadership, ShoreAgents has expanded its services across multiple industries, 
                  serving clients in Australia, New Zealand, and beyond. His commitment to innovation and client 
                  success has been the driving force behind the company&apos;s remarkable growth.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-lime-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Achievements</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Led company growth from startup to 5000+ professionals</li>
                      <li>• Established partnerships with 1000+ global clients</li>
                      <li>• Pioneered innovative outsourcing solutions</li>
                    </ul>
                  </div>
                  <div className="bg-lime-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Expertise</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Strategic Business Development</li>
                      <li>• Global Market Expansion</li>
                      <li>• Client Relationship Management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Executive Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-lime-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Charm Salas</h3>
                  <p className="text-lime-600 font-medium mb-3">Chief Operating Officer</p>
                  <p className="text-gray-700 mb-4">
                    Charm oversees all operational aspects of ShoreAgents, ensuring seamless service delivery 
                    and maintaining the highest standards of quality across all departments.
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-lime-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Kath Macenas</h3>
                  <p className="text-lime-600 font-medium mb-3">Head of Success</p>
                  <p className="text-gray-700 mb-4">
                    Kath leads our client success initiatives, ensuring every client achieves their goals 
                    and experiences exceptional value from our partnership.
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Leaders */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Department Leaders</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Building className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Arra Magracia</h3>
                  <p className="text-lime-600 text-sm">Recruitment Team Lead</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Leading our recruitment efforts to find exceptional talent that matches our clients&apos; needs.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Award className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Thirdy Recede</h3>
                  <p className="text-lime-600 text-sm">Account Manager</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Managing key client relationships and ensuring exceptional service delivery.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Users className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Nica Manabat</h3>
                  <p className="text-lime-600 text-sm">HR Officer</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Overseeing human resources and fostering a positive workplace culture.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Building className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Kevin Macabanti</h3>
                  <p className="text-lime-600 text-sm">Systems and Automations</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Driving technological innovation and process automation across the organization.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Award className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Klein Sundiam</h3>
                  <p className="text-lime-600 text-sm">Finance Coordinator</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Managing financial operations and ensuring fiscal responsibility across all departments.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership Philosophy */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Leadership Philosophy</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Servant Leadership</h3>
                <p className="text-gray-700 mb-4">
                  We believe in leading by example and serving our team members, clients, and community. 
                  Our leaders prioritize the growth and well-being of their teams.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Empowering team members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Leading with integrity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Fostering innovation</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Strategic Vision</h3>
                <p className="text-gray-700 mb-4">
                  Our leadership team maintains a clear strategic vision while remaining adaptable 
                  to changing market conditions and client needs.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Long-term planning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Market adaptation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    <span className="text-gray-700">Sustainable growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Connect With Our Leadership</h2>
          <p className="text-xl text-lime-100 mb-6">
            Ready to discuss how our leadership team can help transform your business?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/contact">
              <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
                Schedule a Meeting
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/about/team">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                Meet Our Full Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
