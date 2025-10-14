"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Users, FileText, Phone, DollarSign, Home, Calculator, TrendingUp } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function PropertyManagementAssistantPage() {
  const services = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Tenant Screening & Relations",
      items: [
        "Application processing and verification",
        "Credit and background checks coordination",
        "Tenant communication and support"
      ]
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "Lease Management",
      items: [
        "Lease preparation and processing",
        "Renewal tracking and management",
        "Documentation and compliance tracking"
      ]
    },
    {
      icon: <Phone className="w-8 h-8 text-orange-600" />,
      title: "Maintenance Coordination",
      items: [
        "Work order processing and tracking",
        "Contractor scheduling and follow-up",
        "Maintenance cost tracking and reporting"
      ]
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: "Rent Collection & Arrears",
      items: [
        "Rent collection tracking and follow-up",
        "Late payment processing and notices",
        "Payment reconciliation and reporting"
      ]
    },
    {
      icon: <Home className="w-8 h-8 text-green-600" />,
      title: "Inspection Management",
      items: [
        "Inspection scheduling with tenants",
        "Report compilation and distribution",
        "Follow-up action coordination"
      ]
    },
    {
      icon: <Calculator className="w-8 h-8 text-orange-600" />,
      title: "Financial Administration",
      items: [
        "Owner statement preparation",
        "Expense tracking and categorization",
        "Portfolio performance reporting"
      ]
    }
  ]

  return (
    <>
    <SideNav/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-6">
            <span className="hover:text-lime-600 cursor-pointer">Homepage</span>
            <span className="mx-2">›</span>
            <span className="hover:text-lime-600 cursor-pointer">Virtual Assistants</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Property Management Virtual Assistant</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Property Management</span>
            <span className="block">
              <span className="text-lime-600">Virtual Assistants</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            So basically, I learned from managing 400+ rentals that property management VAs aren't just admin support - they're specialized team members who understand tenant relations and property operations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Property Management VA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Property Management Success Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Property Management VAs: From 400+ Rental Experience
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  The thing is, managing 400+ rental properties taught me that property management virtual assistants need specialized training, not just general admin skills. However, I found that when you train VAs specifically in tenant screening, lease administration, and maintenance coordination, they become invaluable team members. Ballast Property Management went from 4 to 46 specialists and "surpassed expectations by far" using this systematic approach to property management VAs.
                </p>
              </div>

              {/* Right Content */}
              <div className="space-y-6">
                {/* Testimonial */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    "Surpassed expectations by far"
                  </p>
                  <p className="text-gray-600">
                    - Kuahiwi Kahapea, Ballast Property Management
                  </p>
                </div>

                {/* Performance Metric */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">1150%</div>
                      <div className="text-gray-600">Team Growth (4→46)</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">400+</div>
                    <div className="text-sm text-gray-600">Properties Managed</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">46</div>
                    <div className="text-sm text-gray-600">Ballast Specialists</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Services Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Property Management Virtual Assistant Services
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Specialized virtual assistants trained specifically in property management operations, tenant relations, and portfolio administration.
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
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
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Success Stories Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Property Management VA Success Stories
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Real results from property management companies who've transformed their operations with specialized virtual assistants.
            </p>
          </div>

          {/* Success Stories Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ballast Property Management */}
            <div className="bg-blue-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Ballast Property Management</h3>
                <div className="text-right">
                  <div className="text-sm text-gray-600">4 → 46 Virtual Assistant Specialists</div>
                  <div className="text-2xl font-bold text-blue-600">1150% Growth</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Kuahiwi Kahapea built a team of 46 specialized property management VAs that 'surpassed expectations by far' through systematic training and clear processes.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Tenant management, lease administration, maintenance coordination, owner reporting.
              </div>
            </div>

            {/* Barry Plant Property Management */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Barry Plant Property Management</h3>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Administrative Excellence</div>
                  <div className="text-2xl font-bold text-green-600">100% Admin Relief</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Transformed property management operations by implementing specialized VAs for tenant screening, lease processing, and maintenance coordination.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Tenant screening, lease management, administrative support.
              </div>
            </div>

            {/* Harcourts Dapto */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Harcourts Dapto</h3>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Long-term VA Partnership</div>
                  <div className="text-2xl font-bold text-orange-600">5+ Years</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Built a sustainable long-term partnership with property management VAs, focusing on consistent service delivery and systematic processes.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Portfolio management, tenant relations, maintenance tracking.
              </div>
            </div>

            {/* Professionals McDowell */}
            <div className="bg-green-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Professionals McDowell</h3>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Portfolio Expansion</div>
                  <div className="text-2xl font-bold text-green-600">2x Capacity</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Doubled property management capacity through strategic deployment of specialized VAs for tenant management and administrative functions.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Tenant management, portfolio administration, reporting.
              </div>
            </div>
          </div>

          {/* CTA Link */}
          <div className="text-center mt-12">
            <a 
              href="/case-studies" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-300"
            >
              View All Property Management Case Studies
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Property Management VAs Work Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Upper Section - White Background */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Property Management Virtual Assistants Actually Work
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                It's pretty cool how specialized property management VAs with proper training deliver better results than general administrative support.
              </p>
            </div>

            {/* Three Feature Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Property Management Expertise */}
              <div className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Property Management Expertise
                </h3>
                <p className="text-gray-700">
                  VAs trained specifically in property management processes, tenant relations, and portfolio administration deliver superior results.
                </p>
              </div>

              {/* Cost Efficiency */}
              <div className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Cost Efficiency
                </h3>
                <p className="text-gray-700">
                  Save 60-70% on property management staff costs while getting dedicated focus on your portfolio and tenant satisfaction.
                </p>
              </div>

              {/* Scalable Growth */}
              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Scalable Growth
                </h3>
                <p className="text-gray-700">
                  Scale your property management capacity without office space or HR headaches. Perfect for portfolio expansion and growth.
                </p>
              </div>
            </div>
          </div>

          {/* Lower Section - Blue Background */}
          <div className="bg-blue-600 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Build Your Property Management VA Team?
              </h3>
              <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
                From managing 400+ properties to helping others scale - let's build a team that actually works.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Your Property Management VA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  See Success Stories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Engine Badge */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-sm font-medium">Recommendations Engine</span>
          <span className="bg-lime-500 text-white text-xs px-2 py-1 rounded-full font-medium">Live</span>
        </div>
      </div>
    </div>
    </>
  )
}
