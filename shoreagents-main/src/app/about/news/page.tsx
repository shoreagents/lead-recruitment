"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Newspaper, Calendar, User, Tag } from 'lucide-react'
import Link from 'next/link'

export default function NewsPage() {
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
              <Newspaper className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Updates</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Stay updated with the latest news, announcements, and insights from ShoreAgents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured News */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">News Image Placeholder</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>December 15, 2024</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>ShoreAgents Team</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ShoreAgents Celebrates 10 Years of Excellence
                </h3>
                <p className="text-gray-600 mb-4">
                  We&apos;re proud to announce our 10th anniversary milestone, marking a decade of delivering 
                  exceptional outsourcing solutions to businesses worldwide.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-lime-600" />
                    <span className="text-sm text-lime-600 font-medium">Company News</span>
                  </div>
                  <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                    Read More
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">News Image Placeholder</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>December 10, 2024</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>ShoreAgents Team</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  New AI-Powered Solutions Launch
                </h3>
                <p className="text-gray-600 mb-4">
                  We&apos;re excited to introduce our latest AI-powered automation solutions designed to 
                  streamline business operations and boost efficiency.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-lime-600" />
                    <span className="text-sm text-lime-600 font-medium">Innovation</span>
                  </div>
                  <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                    Read More
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent News */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Updates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>December 5, 2024</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Team Expansion Announcement
              </h3>
              <p className="text-gray-600 mb-4">
                We&apos;re growing! ShoreAgents welcomes 50 new team members to support our expanding client base.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lime-600 font-medium">Company News</span>
                <Button variant="ghost" size="sm" className="text-lime-600 hover:text-lime-700">
                  Read More
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>November 28, 2024</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Client Success Story: Ballast
              </h3>
              <p className="text-gray-600 mb-4">
                Discover how we helped Ballast scale from 4 to 46 team members in just 18 months.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lime-600 font-medium">Success Stories</span>
                <Button variant="ghost" size="sm" className="text-lime-600 hover:text-lime-700">
                  Read More
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>November 20, 2024</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Industry Recognition Award
              </h3>
              <p className="text-gray-600 mb-4">
                ShoreAgents receives the &quot;Best Outsourcing Partner 2024&quot; award from the Philippine Business Association.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lime-600 font-medium">Awards</span>
                <Button variant="ghost" size="sm" className="text-lime-600 hover:text-lime-700">
                  Read More
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>November 15, 2024</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                New Service Launch: Legal Support
              </h3>
              <p className="text-gray-600 mb-4">
                We&apos;re expanding our services to include comprehensive legal support and administrative assistance.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lime-600 font-medium">Services</span>
                <Button variant="ghost" size="sm" className="text-lime-600 hover:text-lime-700">
                  Read More
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>November 10, 2024</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Community Outreach Program
              </h3>
              <p className="text-gray-600 mb-4">
                ShoreAgents launches a new community outreach program to support local education initiatives.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lime-600 font-medium">Community</span>
                <Button variant="ghost" size="sm" className="text-lime-600 hover:text-lime-700">
                  Read More
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>November 5, 2024</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Technology Partnership Announcement
              </h3>
              <p className="text-gray-600 mb-4">
                ShoreAgents partners with leading technology providers to enhance our digital capabilities.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lime-600 font-medium">Partnerships</span>
                <Button variant="ghost" size="sm" className="text-lime-600 hover:text-lime-700">
                  Read More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-16">
          <div className="bg-lime-600 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-lime-100 mb-6">
              Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex space-x-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <Button className="bg-white text-lime-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* News Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">News Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Company News</h3>
              <p className="text-gray-600 text-sm mb-4">
                Latest updates about ShoreAgents, team changes, and company milestones
              </p>
              <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                View All
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry Insights</h3>
              <p className="text-gray-600 text-sm mb-4">
                Analysis and insights about the outsourcing industry and market trends
              </p>
              <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                View All
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Success Stories</h3>
              <p className="text-gray-600 text-sm mb-4">
                Real stories from our clients about their success with ShoreAgents
              </p>
              <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                View All
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Updates</h3>
              <p className="text-gray-600 text-sm mb-4">
                News about our team, new hires, promotions, and team achievements
              </p>
              <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                View All
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 mb-6">
            Have questions about our news or want to share a story? Contact our communications team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/contact">
              <Button size="lg" className="bg-lime-600 text-white hover:bg-lime-700">
                Contact Us
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
