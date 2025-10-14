"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Scale, FileText, Users, Shield, TrendingUp, Calculator } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function LegalTeamsPage() {
  const services = [
    {
      icon: <FileText className="w-8 h-8 text-lime-600" />,
      title: "Document Preparation",
      items: [
        "Contract drafting support",
        "Document formatting",
        "Template creation",
        "Filing assistance"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-lime-600" />,
      title: "Client Communication",
      items: [
        "Initial client intake",
        "Appointment scheduling",
        "Follow-up coordination",
        "Status updates"
      ]
    },
    {
      icon: <Scale className="w-8 h-8 text-lime-600" />,
      title: "Case Management",
      items: [
        "File organization",
        "Deadline tracking",
        "Court calendar management",
        "Document retrieval"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-lime-600" />,
      title: "Research Support",
      items: [
        "Legal research assistance",
        "Case law compilation",
        "Fact verification",
        "Database management"
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-lime-600" />,
      title: "Compliance Support",
      items: [
        "Regulatory compliance",
        "Filing deadlines",
        "Document standards",
        "Process protocols"
      ]
    },
    {
      icon: <Calculator className="w-8 h-8 text-lime-600" />,
      title: "Administrative Tasks",
      items: [
        "Billing & invoicing",
        "Time tracking",
        "Expense management",
        "Report generation"
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
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-lime-100 text-gray-700 px-4 py-2 rounded-full mb-6">
            <Scale className="w-4 h-4" />
            <span className="font-semibold text-sm uppercase tracking-wide">LEGAL VIRTUAL ASSISTANT</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Legal Support Without</span>
            <span className="block">
              <span className="text-lime-600">Legal Liability</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            So basically, legal VAs handle document preparation and administrative support while you maintain all legal responsibility. The thing is, they're perfect for process assistance without crossing professional boundaries at{' '}
            <span className="font-bold">$443/month all-inclusive.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Legal VA Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              View Success Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Services Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Legal Virtual Assistant Services
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Process assistance, document preparation, and administrative support with clear professional boundaries and compliance focus.
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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

      {/* Professional Boundaries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-lime-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Clear Professional Boundaries</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                So basically, legal VAs provide <span className="font-bold">support, not legal advice</span>. They handle document preparation, administrative tasks, and process assistance while you maintain all legal responsibility and client relationships.
              </p>
              <p>
                The thing is, this partnership model works perfectly for <span className="font-bold">multi-jurisdiction considerations</span>. You provide the legal expertise and oversight, while they handle the systematic processes that free up your time for actual legal work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Investment Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Legal Virtual Assistant Investment
            </h2>
          </div>

          {/* Investment Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Cost Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  $443
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Per legal VA/month
                </div>
              </div>

              {/* Billable Hours Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                  40%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  More billable hours
                </div>
              </div>

              {/* Accuracy Rate Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                  95%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Document accuracy rate
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
              >
                Calculate Your Investment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Legal VAs Work Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Upper Section - White Background */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Legal Virtual Assistants Actually Work
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Legal VAs provide essential support while maintaining clear professional boundaries and your legal responsibility.
              </p>
            </div>

            {/* Three Feature Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Professional Boundaries */}
              <div className="text-center">
                <div className="bg-lime-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Professional Boundaries
                </h3>
                <p className="text-gray-700">
                  Legal VAs handle administrative tasks and document preparation while you maintain full legal responsibility and professional control.
                </p>
              </div>

              {/* Cost Efficiency */}
              <div className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Cost Efficiency
                </h3>
                <p className="text-gray-700">
                  Save 60-70% on legal support costs while getting dedicated assistance for document preparation and administrative tasks.
                </p>
              </div>

              {/* Process Enhancement */}
              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Process Enhancement
                </h3>
                <p className="text-gray-700">
                  Streamline legal operations with specialized support for document management, client communication, and compliance tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Lower Section - Lime Green Background */}
          <div className="bg-lime-600 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Focus on Legal Work?
              </h3>
              <p className="text-lg text-lime-100 mb-8 max-w-3xl mx-auto">
                Join legal practices who've increased billable hours while maintaining professional standards and compliance.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Legal Partnership
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="default" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  View Success Stories
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
