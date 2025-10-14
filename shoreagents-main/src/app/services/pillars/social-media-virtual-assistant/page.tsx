"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Share2, Crown, Users, Target, BarChart3, TrendingUp, Shield, User } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function SocialMediaVirtualAssistantPage() {
  const socialMediaServices = [
    {
      icon: <Share2 className="w-8 h-8 text-lime-600" />,
      title: "Content Creation",
      features: [
        "Platform-specific content",
        "Visual content design",
        "Video editing",
        "Content calendars"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-lime-600" />,
      title: "Community Management",
      features: [
        "Audience engagement",
        "Comment management",
        "Direct message responses",
        "Community building"
      ]
    },
    {
      icon: <Target className="w-8 h-8 text-lime-600" />,
      title: "Strategy & Planning",
      features: [
        "Social media strategy",
        "Content planning",
        "Hashtag research",
        "Competitor analysis"
      ]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-lime-600" />,
      title: "Analytics & Reporting",
      features: [
        "Performance tracking",
        "Engagement metrics",
        "ROI measurement",
        "Growth analysis"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-lime-600" />,
      title: "Paid Social Management",
      features: [
        "Ad campaign setup",
        "Audience targeting",
        "Budget optimization",
        "A/B testing"
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-lime-600" />,
      title: "Platform Management",
      features: [
        "Multi-platform posting",
        "Profile optimization",
        "Scheduling automation",
        "Cross-platform strategy"
      ]
    }
  ]

  return (
    <>
      <SideNav />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div className="text-center">
                {/* Top Badge */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-lime-100 border border-lime-300 text-gray-700 px-4 py-2 rounded-lg">
                    <Share2 className="w-4 h-4 text-lime-600" />
                    <span className="font-semibold text-sm uppercase tracking-wide">
                      SOCIAL MEDIA VIRTUAL ASSISTANT
                    </span>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="block">Social Media</span>
                  <span className="block">
                    <span className="text-lime-600">Growth</span> That Drives Real Business
                  </span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Build authentic social media presence with dedicated VAs who understand platform algorithms and engagement strategies at <span className="font-bold">$317/month all-inclusive.</span>
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-effect"
                  >
                    Get Social Media VA Support
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 btn-hover-effect"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    View Success Stories
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Virtual Assistant Services Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Social Media Virtual Assistant Services
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Strategic content creation, community management, and performance optimization for authentic social media growth.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialMediaServices.map((service, index) => (
                <div key={index} className="bg-lime-50 rounded-xl shadow-lg p-6 border border-lime-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-lime-100 p-3 rounded-lg">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-700 text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Virtual Assistant Investment Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Social Media Virtual Assistant Investment
              </h2>
            </div>

            {/* Investment Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">$317</div>
                  <p className="text-gray-600">Per social media VA/month</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-lime-600 mb-2">300%</div>
                  <p className="text-gray-600">Average engagement increase</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-lime-600 mb-2">150%</div>
                  <p className="text-gray-600">Follower growth rate</p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-effect"
                >
                  Calculate Your Investment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-lime-600">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Authentic Social Media Presence?
            </h2>
            <p className="text-lg text-lime-100 mb-8">
              Join businesses who've transformed their social media into a powerful lead generation and brand building channel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-effect"
              >
                Start Social Media Growth
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 btn-hover-effect"
              >
                <User className="mr-2 h-5 w-5" />
                View Success Stories
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
