"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Users, Target, TrendingUp, Award, FileText, Phone, Clock } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function AdministrativeAssistantPage() {
  const services = [
    {
      icon: <FileText className="w-8 h-8 text-lime-600" />,
      title: "Document Management",
      items: [
        "Document creation & editing",
        "Filing & organization",
        "Data entry & maintenance",
        "Digital archiving"
      ]
    },
    {
      icon: <Phone className="w-8 h-8 text-lime-600" />,
      title: "Communication Management",
      items: [
        "Email management",
        "Phone support",
        "Client communication",
        "Meeting coordination"
      ]
    },
    {
      icon: <Clock className="w-8 h-8 text-lime-600" />,
      title: "Calendar & Scheduling",
      items: [
        "Appointment scheduling",
        "Calendar management",
        "Meeting organization",
        "Travel arrangements"
      ]
    },
    {
      icon: <Target className="w-8 h-8 text-lime-600" />,
      title: "Project Coordination",
      items: [
        "Task management",
        "Project tracking",
        "Team coordination",
        "Progress reporting"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-lime-600" />,
      title: "Business Operations",
      items: [
        "Process optimization",
        "Vendor management",
        "Inventory tracking",
        "Quality assurance"
      ]
    },
    {
      icon: <Award className="w-8 h-8 text-lime-600" />,
      title: "Research & Analysis",
      items: [
        "Market research",
        "Competitor analysis",
        "Data compilation",
        "Report preparation"
      ]
    }
  ]

  return (
    <>
    <SideNav/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-700 px-4 py-2 rounded-full mb-6">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-sm uppercase tracking-wide">ADMINISTRATIVE VIRTUAL ASSISTANT</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Administrative Excellence</span>
            <span className="block">
              That Frees Your{' '}
              <span className="text-lime-600">Focus</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Handle all administrative tasks with dedicated VAs who understand business operations and maintain professional standards at{' '}
            <span className="font-bold">P15,000/month all-inclusive.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Administrative VA Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <Users className="mr-2 h-5 w-5" />
              View Case Studies
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
              Administrative Virtual Assistant Services
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Comprehensive administrative support that handles the details so you can focus on growing your business.
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
          {/* Investment Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Cost Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  P15,000
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Per admin VA/month
                </div>
              </div>

              {/* Time Savings Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                  25hrs
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Weekly time savings
                </div>
              </div>

              {/* Accuracy Metric */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                  95%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Task completion accuracy
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Focus on What Matters Most?
          </h2>
          <p className="text-lg text-white mb-8 max-w-3xl mx-auto">
            Join business owners who've reclaimed 25+ hours per week by delegating administrative tasks to skilled VAs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Start Administrative Partnership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              View Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
