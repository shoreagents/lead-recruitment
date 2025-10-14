"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, CheckCircle, Sparkles, Users, Brain, Zap, TrendingUp, FileText, Calculator, Phone, Settings, Star, DollarSign } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function AiVirtualAssistantPage() {
  const plannedServices = [
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: "AI-Powered Content Creation",
      features: [
        "Blog posts and articles with AI assistance",
        "Social media content generation",
        "Email campaigns and newsletters"
      ],
      badgeColor: "bg-lime-500"
    },
    {
      icon: <Calculator className="w-8 h-8 text-white" />,
      title: "Data Analysis & Insights",
      features: [
        "Automated data processing and analysis",
        "Business intelligence reporting",
        "Trend analysis and predictions"
      ],
      badgeColor: "bg-lime-600"
    },
    {
      icon: <Phone className="w-8 h-8 text-white" />,
      title: "AI-Enhanced Customer Support",
      features: [
        "Intelligent response suggestions",
        "Multi-language customer support",
        "Sentiment analysis and escalation"
      ],
      badgeColor: "bg-lime-700"
    },
    {
      icon: <Settings className="w-8 h-8 text-white" />,
      title: "Intelligent Process Automation",
      features: [
        "Workflow optimization with AI",
        "Automated quality control",
        "Intelligent task prioritization"
      ],
      badgeColor: "bg-lime-500"
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "AI Research & Analysis",
      features: [
        "Market research with AI insights",
        "Competitive analysis and monitoring",
        "Industry trend identification"
      ],
      badgeColor: "bg-lime-600"
    },
    {
      icon: <Star className="w-8 h-8 text-white" />,
      title: "AI-Assisted Creative Work",
      features: [
        "AI-generated design concepts",
        "Creative brainstorming with AI",
        "Visual content optimization"
      ],
      badgeColor: "bg-lime-700"
    }
  ]

  return (
    <>
      <SideNav />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Coming Soon Badge Card */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 bg-lime-100 border border-lime-300 text-lime-700 px-6 py-3 rounded-full shadow-sm">
                <Clock className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-wide">
                  Coming Soon - Q2 2025
                </span>
              </div>
            </div>

            {/* Main Hero Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
              <div className="text-center">
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Revolutionary AI-Enhanced Virtual Assistants
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                  We&apos;re developing the most advanced AI-enhanced virtual assistant services combining human intelligence with Uncle Claude&apos;s capabilities. Be the first to experience the future.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-effect"
                  >
                    Get Notified When Available
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 btn-hover-effect"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    See Current VA Success Stories
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* AI + Human Intelligence Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-lime-100 p-3 rounded-lg">
                    <Brain className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">AI + Human Intelligence</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Combining Filipino talent with AI tools like &ldquo;Uncle Claude&rdquo; creates something special - virtual assistants that outperform expensive local hires.
                </p>
              </div>

              {/* Advanced Capabilities Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-lime-100 p-3 rounded-lg">
                    <Sparkles className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Advanced Capabilities</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The most advanced AI-enhanced virtual assistant services with cutting-edge technology and human expertise working seamlessly together.
                </p>
              </div>
            </div>

            {/* Secondary Content Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  AI Virtual Assistants: Human Intelligence + Uncle Claude
                </h2>
                <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
                  Experience the perfect blend of human expertise and artificial intelligence. Our AI virtual assistants are designed to handle complex tasks while maintaining the personal touch that only human professionals can provide.
                </p>
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-lime-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">24/7</h3>
                    <p className="text-gray-600">Availability</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-8 h-8 text-lime-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">AI-Powered</h3>
                    <p className="text-gray-600">Intelligence</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-lime-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Proven</h3>
                    <p className="text-gray-600">Results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Virtual Assistant Services</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                This is the AI Virtual Assistant pillar page. Advanced AI-powered virtual assistants for automated tasks and intelligent business support.
              </p>
            </div>
          </div>
        </section>

        {/* Uncle Claude Meets Filipino Excellence Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Text Content */}
                <div className="lg:col-span-2">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-lime-100 border border-lime-300 text-lime-700 px-4 py-2 rounded-lg mb-6">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold text-sm">Coming Q2 2025</span>
                  </div>

                  {/* Main Title */}
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Uncle Claude Meets Filipino Excellence
                  </h2>
                  
                  {/* Body Paragraphs */}
                  <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                    <p>
                      The thing is, AI alone isn&apos;t the answer - and neither are humans without tools. However, I found that Filipino VAs working with AI creates something exceptional.
                    </p>
                    <p>
                      Our upcoming teams will use &ldquo;Uncle Claude&rdquo; for content creation, data analysis, and complex problem-solving, while applying human intelligence for judgment, relationship building, and creative solutions.
                    </p>
                    <p>
                      It&apos;s pretty cool how this combination will deliver results that pure AI services or traditional VAs simply can&apos;t match. Better outputs, faster turnaround, lower costs.
                    </p>
                  </div>

                  {/* Quote Box */}
                  <div className="mt-8 bg-lime-100 rounded-lg p-6 border border-lime-200">
                    <p className="text-lime-800 font-bold text-lg italic">
                      &ldquo;AI amplifies human intelligence - it doesn&apos;t replace it. The magic happens when skilled people use AI as a superpower.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Right Column - Feature Cards */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-lime-500 p-3 rounded-lg">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">AI + Human</h3>
                        <p className="text-sm text-gray-600">Intelligence Combination</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-lime-600 p-3 rounded-lg">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">5x</h3>
                        <p className="text-sm text-gray-600">Expected Productivity Increase</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-lime-700 p-3 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Superior</h3>
                        <p className="text-sm text-gray-600">Output Quality</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planned AI Virtual Assistant Services Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Planned AI Virtual Assistant Services
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Human intelligence amplified by AI tools. Your future virtual assistants will work with Uncle Claude, ChatGPT, and specialized AI to deliver exceptional results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plannedServices.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${service.badgeColor} p-3 rounded-lg`}>
                      {service.icon}
                    </div>
                    <div className={`${service.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      Coming Soon
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{service.title}</h3>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-700 text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why AI Virtual Assistants Will Actually Work Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why AI Virtual Assistants Will Actually Work
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                It&apos;s pretty cool how the combination of human intelligence, AI tools, and proper systems will create results that neither pure AI nor traditional VAs can match.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-lime-500 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Human + AI Intelligence</h3>
                <p className="text-gray-700">
                  Filipino talent will provide judgment, creativity, and relationship skills while AI handles data processing, analysis, and content generation.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-lime-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5x Productivity</h3>
                <p className="text-gray-700">
                  AI amplification means your virtual assistants will accomplish in hours what traditionally took days or weeks.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-lime-700 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Better ROI</h3>
                <p className="text-gray-700">
                  Get enterprise-level AI capabilities at a fraction of the cost, with human oversight ensuring quality and relevance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-lime-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Be First to Experience AI-Enhanced Virtual Assistants
            </h2>
            <p className="text-lg text-lime-100 mb-8">
              Join our waitlist and be the first to know when AI Virtual Assistants launch in Q2 2025.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-effect"
              >
                Join the Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
               
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 btn-hover-effect"
              >
                See Current VA Services
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
