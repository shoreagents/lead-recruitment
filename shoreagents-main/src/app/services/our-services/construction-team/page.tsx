"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Hammer, Building, FileText, Users, TrendingUp, Shield, User } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function ConstructionTeamPage() {
  const services = [
    {
      icon: <Building className="w-8 h-8 text-lime-600" />,
      title: "Project Coordination",
      items: [
        "Project scheduling",
        "Milestone tracking",
        "Progress reporting",
        "Timeline management"
      ]
    },
    {
      icon: <FileText className="w-8 h-8 text-lime-600" />,
      title: "Documentation",
      items: [
        "Project documentation",
        "Permit tracking",
        "Compliance records",
        "Change order management"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-lime-600" />,
      title: "Communication",
      items: [
        "Client updates",
        "Vendor coordination",
        "Subcontractor communication",
        "Meeting coordination"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-lime-600" />,
      title: "Cost Management",
      items: [
        "Budget tracking",
        "Expense monitoring",
        "Invoice processing"
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-lime-600" />,
      title: "Quality Assurance",
      items: [
        "Inspection scheduling",
        "Quality checklists",
        "Safety compliance"
      ]
    },
    {
      icon: <User className="w-8 h-8 text-lime-600" />,
      title: "Administrative Support",
      items: [
        "Permit applications",
        "Scheduling coordination",
        "File management"
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
            <Hammer className="w-4 h-4" />
            <span className="font-semibold text-sm uppercase tracking-wide">CONSTRUCTION VIRTUAL ASSISTANT</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="block">Gallery Group's Multi-Year</span>
            <span className="block">
              Construction{' '}
              <span className="text-lime-600">VA Partnership</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            So basically, Iain Neilson from Gallery Group says we're 'head and shoulders above the rest' after years of construction VA partnership. The thing is, construction VAs work when they understand both project coordination and industry knowledge at{' '}
            <span className="font-bold">P25,000/month all-inclusive.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Construction VA Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              onClick={() => window.location.href = '/services/our-services/construction-team/gallery-group-case-study'}
            >
              <User className="mr-2 h-5 w-5" />
              Gallery Group Case Study
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
              Construction Virtual Assistant Services
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Project coordination, documentation excellence, and guided expertise for comprehensive construction support.
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

      {/* Expertise Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Guided Expertise vs Assumed Knowledge
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              The difference between successful construction VAs and generic support.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-10 shadow-lg">
            <div className="space-y-8 text-gray-700 leading-relaxed">
              <p className="text-lg">
                So basically, the Gallery Group partnership taught us the difference between Filipino construction knowledge and guided expertise. Instead of assuming they know construction processes, we guide them through your specific procedures and standards.
              </p>
              <p className="text-lg">
                The thing is, construction VAs excel at systematic task coordination. They're incredibly detail-oriented with documentation, great at following protocols, and excellent at managing multiple moving parts simultaneously.
              </p>
              <p className="text-lg">
                However, I found that success comes from clear task specificity and guided training. You provide the industry expertise and project specifics, while they handle the systematic coordination and communication. After years with Gallery Group, it's a proven partnership model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {/* Investment Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Construction Virtual Assistant Investment
            </h2>
          </div>

          {/* Investment Card */}
          <div className="bg-white rounded-xl shadow-lg p-10 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Cost Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  ₱25,000
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Per construction VA/month
                </div>
              </div>

              {/* Project Capacity Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-3">
                  50%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  More project capacity
                </div>
              </div>

              {/* Admin Overhead Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-3">
                  25%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Reduced admin overhead
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
            Ready to Build Long-Term Construction Partnerships?
          </h2>
          <p className="text-lg text-white mb-10 max-w-4xl mx-auto">
            Join construction companies like Gallery Group who've built multi-year VA partnerships that enhance project delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-lime-800 hover:bg-white hover:text-lime-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Start Construction Partnership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-lime-800 hover:bg-white hover:text-lime-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <User className="mr-2 h-5 w-5" />
              Gallery Group Case Study
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
