"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Handshake, Users, Award, Building, Globe } from 'lucide-react'
import Link from 'next/link'

export default function PartnershipsPage() {
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
              <Handshake className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Partnerships</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Strategic collaborations that drive innovation and deliver exceptional value to our clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Partnership Overview */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partnership Approach</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                At ShoreAgents, we believe in the power of strategic partnerships to deliver comprehensive 
                solutions and exceptional value to our clients. Our collaborative approach enables us to 
                leverage expertise, resources, and innovation from leading organizations worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Partners */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Strategic Partners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Building className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Gallery Group</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Our strategic partnership with Gallery Group demonstrates how collaboration and shared expertise 
                can deliver exceptional results and create lasting value for both organizations.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Joint service offerings</div>
                <div>• Shared technology platforms</div>
                <div>• Collaborative client solutions</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Award className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Technology Partners</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Collaborating with leading technology providers to enhance our digital capabilities and 
                deliver cutting-edge solutions to our clients.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• AI and automation solutions</div>
                <div>• Cloud infrastructure</div>
                <div>• Security and compliance tools</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Globe className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Global Networks</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Partnering with international organizations to expand our global reach and provide 
                localized solutions for clients worldwide.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• International market access</div>
                <div>• Cultural expertise</div>
                <div>• Regional compliance knowledge</div>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Partnership Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Enhanced Expertise</h3>
              <p className="text-gray-600 text-sm">
                Access to specialized knowledge and skills from our partner organizations
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Collaborative development of cutting-edge solutions and technologies
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600 text-sm">
                Expanded service capabilities across different markets and regions
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Shared Resources</h3>
              <p className="text-gray-600 text-sm">
                Leveraging combined resources for better service delivery and cost efficiency
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Types of Partnerships</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Strategic Alliances</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Long-term Collaborations</h4>
                    <p className="text-gray-600 text-sm">Deep partnerships focused on mutual growth and success</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Joint Ventures</h4>
                    <p className="text-gray-600 text-sm">Shared ownership and risk in new business opportunities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Technology Partnerships</h4>
                    <p className="text-gray-600 text-sm">Integration of complementary technologies and platforms</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Operational Partnerships</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Delivery</h4>
                    <p className="text-gray-600 text-sm">Collaborative service delivery to enhance client experience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Resource Sharing</h4>
                    <p className="text-gray-600 text-sm">Shared infrastructure, tools, and best practices</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Market Expansion</h4>
                    <p className="text-gray-600 text-sm">Joint efforts to enter new markets and serve new clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Process */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Partnership Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery</h3>
                <p className="text-gray-600 text-sm">
                  Identify potential partners and assess alignment of goals and values
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Evaluation</h3>
                <p className="text-gray-600 text-sm">
                  Assess compatibility, capabilities, and potential for mutual benefit
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">
                  Develop partnership terms and establish collaborative frameworks
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-lime-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementation</h3>
                <p className="text-gray-600 text-sm">
                  Execute partnership initiatives and deliver value to clients
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in Partnering?</h2>
          <p className="text-xl text-lime-100 mb-6">
            Let's explore how we can work together to create value for our clients and grow our businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/contact">
              <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
                Discuss Partnership
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/about/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
