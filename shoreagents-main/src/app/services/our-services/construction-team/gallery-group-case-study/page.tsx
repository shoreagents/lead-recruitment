"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Star, Award, TrendingUp, CheckCircle, Building, Target, Users, MapPin, Calendar, Quote } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function GalleryGroupCaseStudyPage() {
  const performanceMetrics = [
    {
      icon: <TrendingUp className="w-8 h-8 text-gray-600" />,
      title: "Years",
      subtitle: "Partnership Duration"
    },
    {
      icon: <Star className="w-8 h-8 text-lime-600" />,
      title: "5/5",
      subtitle: "Perfect Rating"
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Authority",
      subtitle: "Industry Recognition"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Multiple",
      subtitle: "Specialists"
    }
  ]

  const specializedServices = [
    {
      icon: <Building className="w-8 h-8 text-gray-600" />,
      title: "Architectural Design Support",
      description: "Technical drawing coordination, design documentation, and architectural project support for Gallery Group's development projects."
    },
    {
      icon: <Target className="w-8 h-8 text-lime-600" />,
      title: "Project Coordination",
      description: "Seamless coordination between teams, contractors, and stakeholders to ensure projects stay on schedule and meet quality standards."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      title: "Quality Assurance",
      description: "Maintaining Gallery Group's high standards through detailed documentation and systematic quality control processes."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Team Integration",
      description: "Perfect integration with Gallery Group's existing processes, earning recognition as \"head and shoulders above the rest.\""
    }
  ]

  const recognitionFeatures = [
    {
      icon: <Star className="w-6 h-6 text-blue-600" />,
      title: "Industry Recognition",
      description: "Featured on Mike's Business Tours as exemplary outsourcing success"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-lime-600" />,
      title: "Superior Performance",
      description: "\"Head and shoulders above the rest\" recognition"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-orange-600" />,
      title: "Proven Excellence",
      description: "Years of consistent 5/5 performance validation"
    }
  ]

  const partnershipStages = [
    {
      number: "1",
      color: "bg-gray-600",
      title: "Discovery & Initial Partnership",
      description: "Found Shore Agents through Mike's Business Tours recognition and began construction support services"
    },
    {
      number: "2",
      color: "bg-lime-600",
      title: "System Development",
      description: "Developed 'a very good system' for architectural design and project coordination support"
    },
    {
      number: "3",
      color: "bg-blue-600",
      title: "Performance Excellence",
      description: "Consistent 5/5 ratings and salary increase recommendations demonstrate exceptional value"
    },
    {
      number: "Now",
      color: "bg-orange-600",
      title: "Long-Term Strategic Partnership",
      description: "Multi-year partnership with Gallery Group 'very happy with ShoreAgents' and ongoing collaboration"
    }
  ]

  return (
    <>
    <SideNav/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Partner Info */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">AU</span>
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-900">Gallery Group</h1>
              </div>
              <p className="text-lg text-gray-600 mb-6">Iain Neilson - Construction & Development</p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  MULTI-YEAR PARTNER
                </span>
                <span className="bg-lime-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  PERFECT 5/5 RATING
                </span>
                <span className="bg-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  CONSTRUCTION EXPERT
                </span>
                <span className="bg-orange-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  MIKE'S BUSINESS TOURS
                </span>
              </div>

              {/* Testimonial */}
              <div className="border-l-4 border-gray-300 pl-6 mb-8">
                <Quote className="w-8 h-8 text-gray-400 mb-4" />
                <blockquote className="text-xl italic text-blue-900 leading-relaxed">
                  "We have been partners with ShoreAgents for years now and have a very good system going. We are very happy with ShoreAgents."
                </blockquote>
              </div>

              {/* Company Info */}
              <div className="flex items-center gap-2 text-gray-600 mb-8">
                <Building className="w-4 h-4" />
                <span>Construction & Development • Queensland, Australia • Architectural Design & Project Coordination</span>
              </div>
            </div>

            {/* Partnership Performance Section */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-8">
                Partnership Performance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-3">
                      {metric.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-1">{metric.title}</h3>
                    <p className="text-gray-600 text-sm">{metric.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* About Gallery Group Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">
            About Gallery Group
          </h2>
          
          <div className="bg-gray-100 rounded-xl p-8 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Gallery Group is a leading <strong>construction and development company</strong> based in Queensland, Australia. Specializing in architectural design and project coordination, they have established themselves as a premium provider in the construction industry with a focus on excellence and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Construction Excellence */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Construction Excellence</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Gallery Group's commitment to construction excellence requires precise project coordination, detailed architectural work, and seamless communication across multiple stakeholders and timelines.
                </p>
                <p>
                  The complexity of construction projects demands reliable support that can handle technical documentation, coordinate between teams, and maintain the high standards that Gallery Group is known for.
                </p>
                <p>
                  Their partnership with Shore Agents has allowed them to maintain these standards while scaling their operations efficiently across multiple projects.
                </p>
              </div>
            </div>

            {/* Multi-Year Partnership Success */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Multi-Year Partnership Success</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The multi-year partnership with Shore Agents demonstrates the sustained value and reliability that Iain and his team have experienced. This isn't a short-term experiment—it's a proven long-term strategy.
                </p>
                <p>
                  Having 'a very good system going' after years of collaboration shows the maturity and refinement of the working relationship, with processes optimized for maximum efficiency.
                </p>
                <p>
                  The consistent 5/5 ratings and salary increase recommendations from Iain reflect the exceptional quality of work delivered by the Shore Agents team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Construction Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">
            Specialized Construction Support
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specializedServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Authority Recognition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 text-center mb-12">
              Industry Authority Recognition
            </h2>
            
            <div className="text-center mb-12">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Mike's Business Tours Discovery</h3>
              <p className="text-lg text-blue-900 leading-relaxed max-w-4xl mx-auto">
                Gallery Group&apos;s partnership with Shore Agents was discovered through <strong>Mike&apos;s Business Tours</strong>, where they were recognized as being <strong>&quot;head and shoulders above the rest&quot;</strong> in the outsourcing space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recognitionFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">{feature.title}</h4>
                  <p className="text-blue-900">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Evolution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">
            Partnership Evolution
          </h2>
          
          <div className="space-y-8">
            {partnershipStages.map((stage, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className={`${stage.color} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                  {stage.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg text-center">
            <blockquote className="text-xl italic text-gray-700 mb-8 leading-relaxed">
              "We have been partners with ShoreAgents for years now and have a very good system going. We are very happy with ShoreAgents."
            </blockquote>
            
            <div className="mb-8">
              <p className="font-bold text-gray-900">Iain Neilson</p>
              <p className="text-gray-600">Gallery Group</p>
              <p className="text-gray-600">Construction & Development • Queensland</p>
              <p className="text-lime-600 font-medium">Perfect 5/5 ratings • Salary increases recommended</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                All Case Studies
              </Button>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Build Your Construction Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
