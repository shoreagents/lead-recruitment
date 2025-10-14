"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart, Users, Award, TrendingUp, Shield, Star } from 'lucide-react'
import Link from 'next/link'

export default function ValuesPage() {
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Company Values</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                The principles that guide everything we do and shape our culture at ShoreAgents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-lime-100 rounded-xl">
                  <Star className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Excellence</h3>
              </div>
              <p className="text-gray-700 mb-6">
                We strive for excellence in everything we do, from the quality of our services 
                to the relationships we build with our clients and team members.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Delivering exceptional quality in all services</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Continuous improvement and innovation</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Setting high standards and exceeding expectations</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-lime-100 rounded-xl">
                  <Users className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Collaboration</h3>
              </div>
              <p className="text-gray-700 mb-6">
                We believe in the power of teamwork and collaboration, working together 
                to achieve common goals and deliver exceptional results.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Fostering strong partnerships with clients</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Encouraging teamwork across departments</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Sharing knowledge and best practices</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-lime-100 rounded-xl">
                  <Award className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Integrity</h3>
              </div>
              <p className="text-gray-700 mb-6">
                We conduct business with honesty, transparency, and ethical practices, 
                building trust with our clients, partners, and team members.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Maintaining transparency in all dealings</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Upholding ethical business practices</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Building long-term trust relationships</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-lime-100 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Innovation</h3>
              </div>
              <p className="text-gray-700 mb-6">
                We embrace change and continuously seek innovative solutions to meet 
                the evolving needs of our clients and the market.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Embracing new technologies and methods</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Encouraging creative problem-solving</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Adapting to changing market demands</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-lime-100 rounded-xl">
                  <Heart className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Client Focus</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Our clients' success is our success. We are committed to understanding 
                their needs and delivering solutions that exceed their expectations.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Understanding client needs deeply</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Providing personalized solutions</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Building lasting partnerships</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-lime-100 rounded-xl">
                  <Shield className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Growth</h3>
              </div>
              <p className="text-gray-700 mb-6">
                We foster a culture of continuous learning and development, 
                encouraging our team members to grow both personally and professionally.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Supporting professional development</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Encouraging continuous learning</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Providing growth opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values in Action */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Values in Action</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Live Our Values</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Daily Stand-ups</h4>
                      <p className="text-gray-600 text-sm">Regular team meetings to foster collaboration and transparency</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Training Programs</h4>
                      <p className="text-gray-600 text-sm">Continuous learning opportunities for all team members</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Client Feedback</h4>
                      <p className="text-gray-600 text-sm">Regular check-ins to ensure we exceed expectations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Measuring Success</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Client Satisfaction</h4>
                      <p className="text-gray-600 text-sm">95% client retention rate and positive feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Team Growth</h4>
                      <p className="text-gray-600 text-sm">Internal promotions and career advancement opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Innovation Metrics</h4>
                      <p className="text-gray-600 text-sm">New service offerings and process improvements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Values-Driven Team</h2>
          <p className="text-xl text-lime-100 mb-6">
            Ready to work with a company that truly lives its values? Explore career opportunities with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/careers">
              <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
                View Careers
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/about/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
