"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, FileText, Phone, Users, TrendingUp, RefreshCw, Eye } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function InsuranceSupportPage() {
  const services = [
    {
      icon: <FileText className="w-8 h-8 text-lime-600" />,
      title: "Claims Processing",
      items: [
        "Claims documentation",
        "Initial intake processing",
        "Status updates",
        "File management"
      ]
    },
    {
      icon: <Phone className="w-8 h-8 text-lime-600" />,
      title: "Client Communication",
      items: [
        "Policy inquiries",
        "Customer service calls",
        "Claims follow-up",
        "Renewal reminders"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-lime-600" />,
      title: "Administrative Support",
      items: [
        "Policy administration",
        "Data entry & updates",
        "Document preparation",
        "Compliance tracking"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-lime-600" />,
      title: "Inside Sales Support",
      items: [
        "Lead qualification",
        "Quote preparation",
        "Policy comparisons",
        "Cross-selling support"
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-lime-600" />,
      title: "Underwriting Support",
      items: [
        "Application review",
        "Risk assessment data",
        "Documentation verification",
        "Processing coordination"
      ]
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-lime-600" />,
      title: "Renewal Management",
      items: [
        "Renewal processing",
        "Policy updates",
        "Rate adjustments",
        "Customer retention"
      ]
    }
  ]

  return (
    <>
    <SideNav/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-700 px-4 py-2 rounded-full mb-8">
            <Shield className="w-4 h-4" />
            <span className="font-semibold text-sm uppercase tracking-wide">INSURANCE VIRTUAL ASSISTANT</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="block">Better Homes and Gardens:</span>
            <span className="block">3 Insurance VAs,</span>
            <span className="block">
              <span className="text-lime-600">Perfect Performance</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            So basically, Better Homes and Gardens runs multiple insurance VAs in administrative, calling, and inside sales roles. The thing is, insurance VAs work when they understand both claims and customer service at{' '}
            <span className="font-bold">₱22,000/month all-inclusive.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Insurance VA Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <FileText className="mr-2 h-5 w-5" />
              View Case Study
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Services Header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Insurance Virtual Assistant Services
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Multi-role capability, process expertise, and client communication excellence for comprehensive insurance support.
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-lime-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-lime-600 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Investment Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Insurance Virtual Assistant Investment
            </h2>
          </div>

          {/* Investment Card */}
          <div className="bg-white rounded-xl shadow-lg p-10 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Cost Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  ₱22,000
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Per insurance VA/month
                </div>
              </div>

              {/* Claims Processing Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-3">
                  45%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Faster claims processing
                </div>
              </div>

              {/* Client Satisfaction Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-3">
                  92%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Client satisfaction rate
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
              >
                Calculate Your Investment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-lime-600">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Ready to Scale Your Insurance Operations?
          </h2>
          <p className="text-lg text-white mb-10 max-w-4xl mx-auto">
            Join insurance companies who've streamlined their operations while improving client satisfaction scores.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Start Insurance Partnership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <Eye className="mr-2 h-5 w-5" />
              View Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
