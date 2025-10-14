"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star, Quote, User, Award } from 'lucide-react'
import Link from 'next/link'

export default function TestimonialsPage() {
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
              <Quote className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Hear directly from our clients about their experience working with ShoreAgents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Testimonials</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Jack Miller</h3>
                  <p className="text-lime-600 font-medium">Real Estate Agency Owner</p>
                  <div className="flex items-center space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-6 text-lg">
                "ShoreAgents transformed our operations completely. The cost savings were incredible, 
                but more importantly, the quality of work exceeded our expectations. Their team became 
                an extension of our company, understanding our needs and delivering exceptional results."
              </blockquote>
              <div className="bg-lime-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Key Results:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• $40K annual cost savings</li>
                  <li>• 85% improvement in operational efficiency</li>
                  <li>• Enhanced client satisfaction</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Sarah Johnson</h3>
                  <p className="text-lime-600 font-medium">Marketing Director</p>
                  <div className="flex items-center space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-6 text-lg">
                "The team at ShoreAgents became an extension of our company. Their dedication and 
                expertise helped us scale our marketing efforts significantly. They understand our 
                industry and deliver results that drive real business growth."
              </blockquote>
              <div className="bg-lime-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Key Results:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 40% increase in lead generation</li>
                  <li>• 25% improvement in conversion rates</li>
                  <li>• Enhanced brand presence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Industry Testimonials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Operations Manager</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4 text-sm">
                "Working with ShoreAgents has been a game-changer for our business. Their attention to detail 
                and commitment to quality is outstanding."
              </blockquote>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-600">Finance Director</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4 text-sm">
                "The financial support team from ShoreAgents has streamlined our processes and improved 
                our accuracy significantly."
              </blockquote>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">David Thompson</h4>
                  <p className="text-sm text-gray-600">Legal Practice Manager</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4 text-sm">
                "ShoreAgents' legal support team has enhanced our document management and client 
                communication processes."
              </blockquote>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Lisa Wang</h4>
                  <p className="text-sm text-gray-600">Insurance Claims Manager</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4 text-sm">
                "The claims processing support has improved our efficiency and customer satisfaction 
                dramatically."
              </blockquote>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Robert Kim</h4>
                  <p className="text-sm text-gray-600">E-commerce Manager</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4 text-sm">
                "24/7 customer support has transformed our online business and improved customer retention."
              </blockquote>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Amanda Foster</h4>
                  <p className="text-sm text-gray-600">Healthcare Administrator</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4 text-sm">
                "Administrative support has reduced our workload and allowed us to focus on patient care."
              </blockquote>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rating Summary */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Client Satisfaction Overview</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">4.9/5</div>
                <div className="text-gray-700">Average Rating</div>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-lime-600 fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">95%</div>
                <div className="text-gray-700">Client Retention</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">1000+</div>
                <div className="text-gray-700">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">&lt; 2hrs</div>
                <div className="text-gray-700">Response Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Video Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Video Testimonial Placeholder</p>
                  <p className="text-sm text-gray-500">Client interview video will be embedded here</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Jack Miller - Real Estate</h3>
                <p className="text-gray-600 text-sm">
                  Watch Jack share his experience working with ShoreAgents and the results achieved.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Video Testimonial Placeholder</p>
                  <p className="text-sm text-gray-500">Client interview video will be embedded here</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sarah Johnson - Marketing</h3>
                <p className="text-gray-600 text-sm">
                  Hear Sarah discuss how ShoreAgents helped scale their marketing operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Happy Clients</h2>
          <p className="text-xl text-lime-100 mb-6">
            Ready to experience the same level of service and results? Let's start your success story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/contact">
              <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
                Get Started Today
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
