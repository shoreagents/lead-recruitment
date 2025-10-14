"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, User, Home, Calculator, Users } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function RealEstateVirtualAssistantPage() {
  const services = [
    {
      icon: <Calculator className="w-8 h-8 text-lime-600" />,
      title: "Transaction Coordination",
      items: [
        "Contract processing",
        "Document management",
        "Closing coordination",
        "Compliance tracking"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-lime-600" />,
      title: "Commission Management",
      items: [
        "Commission calculations",
        "Split management",
        "Payment processing",
        "Financial reporting"
      ]
    },
    {
      icon: <Home className="w-8 h-8 text-lime-600" />,
      title: "Listing Management",
      items: [
        "MLS updates",
        "Property descriptions",
        "Photo coordination",
        "Marketing materials"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <SideNav />
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-lime-100 text-gray-700 px-4 py-2 rounded-full shadow-sm">
              <Home className="w-4 h-4" />
              <span className="font-semibold text-sm uppercase tracking-wide">REAL ESTATE VIRTUAL ASSISTANT</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                <span className="block">14 Salespeople, 400 Rentals:</span>
                <span className="block">
                  The Real Estate{' '}
                  <span className="text-lime-600">VA Blueprint</span>
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              So basically, I built my real estate business using virtual assistants for everything from commission calculations to listing management. The thing is, real estate VAs work when they understand your actual business at{' '}
              <span className="font-bold">$387/month all-inclusive.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                variant="default"
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                Get Real Estate VA Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 text-base font-semibold"
              >
                <User className="mr-2 h-5 w-5" />
                View Success Stories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Services Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real Estate Virtual Assistant Services
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Industry expertise, proven processes, and AI-enhanced support for all your real estate operations.
            </p>
          </div>

          {/* Services Cards - Inline Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex-1"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-lime-600 mr-2 mt-1">•</span>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Investment Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real Estate Virtual Assistant Investment
            </h2>
          </div>

          {/* Investment Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Cost Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  $387
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Per real estate VA/month
                </div>
              </div>

              {/* Transaction Capacity Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                  3x
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Transaction capacity increase
                </div>
              </div>

              {/* Commission Increase Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                  30%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Commission increase
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button 
                variant="default"
                size="lg"
                className="px-8 py-4 text-lg font-semibold w-full md:w-auto"
              >
                Calculate Your Investment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Scale Your Real Estate Business?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join real estate professionals who've tripled their transaction capacity while maintaining quality service.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="outline"
              size="lg"
              className="bg-white text-lime-600 hover:bg-gray-50 border-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl"
            >
              Start Real Estate Partnership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="secondary"
              size="lg"
              className="border-white text-lime-600 hover:bg-white hover:text-lime-600 px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl"
            >
              <User className="mr-2 h-5 w-5" />
              View Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
