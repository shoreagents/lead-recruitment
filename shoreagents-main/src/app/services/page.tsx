"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Building2, Factory, CheckCircle, Star, Clock, Shield, Zap } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

interface ServiceSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  category: 'main' | 'specialized' | 'pillars'
}

const serviceSections: ServiceSection[] = [
  // Main Services
  {
    id: 'hire-one-agent',
    title: 'Hire One Agent',
    description: 'Perfect for first-time outsourcers. Start conservative with a single dedicated professional.',
    icon: <Users className="w-8 h-8" />,
    features: [
      'Single dedicated professional',
      'Perfect for first-time outsourcers',
      'Low-risk entry point',
      'Flexible hours and tasks',
      'Direct communication',
      'Cost-effective solution'
    ],
    category: 'main'
  },
  {
    id: 'build-a-team',
    title: 'Build a Team',
    description: 'Scale your business with 3-10 professionals working together as a cohesive unit.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      '3-10 professionals',
      'Team collaboration',
      'Diverse skill sets',
      'Scalable operations',
      'Project management',
      'Quality assurance'
    ],
    category: 'main'
  },
  {
    id: 'create-workforce',
    title: 'Create a Workforce',
    description: 'Large operations with 10+ people in a dedicated private office environment.',
    icon: <Factory className="w-8 h-8" />,
    features: [
      '10+ professionals',
      'Private office space',
      'Department structure',
      'Advanced management',
      'Custom infrastructure',
      'Full operational control'
    ],
    category: 'main'
  },
  // Specialized Roles
  {
    id: 'real-estate-virtual-assistant',
    title: 'Real Estate Virtual Assistant',
    description: 'Specialized virtual assistants for real estate professionals and agencies.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Property research and analysis',
      'Client communication management',
      'Listing coordination',
      'Market research',
      'Document preparation',
      'CRM management'
    ],
    category: 'specialized'
  },
  {
    id: 'property-management-assistant',
    title: 'Property Management Assistant',
    description: 'Dedicated support for property management operations and tenant relations.',
    icon: <Shield className="w-8 h-8" />,
    features: [
      'Tenant screening and onboarding',
      'Maintenance coordination',
      'Rent collection',
      'Property inspections',
      'Lease administration',
      'Financial reporting'
    ],
    category: 'specialized'
  },
  {
    id: 'administrative-assistant',
    title: 'Administrative Assistant',
    description: 'Comprehensive administrative support for day-to-day business operations.',
    icon: <CheckCircle className="w-8 h-8" />,
    features: [
      'Email and calendar management',
      'Document preparation',
      'Data entry and organization',
      'Meeting coordination',
      'Travel arrangements',
      'General office support'
    ],
    category: 'specialized'
  },
  {
    id: 'customer-service-assistant',
    title: 'Customer Service Assistant',
    description: 'Professional customer support and relationship management services.',
    icon: <Users className="w-8 h-8" />,
    features: [
      'Customer inquiries handling',
      'Support ticket management',
      'Live chat support',
      'Customer feedback collection',
      'Issue resolution',
      'Customer satisfaction tracking'
    ],
    category: 'specialized'
  },
  {
    id: 'construction-team',
    title: 'Construction Team',
    description: 'Specialized teams for construction project management and coordination.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Project planning and scheduling',
      'Subcontractor coordination',
      'Material procurement',
      'Quality control',
      'Safety compliance',
      'Progress reporting'
    ],
    category: 'specialized'
  },
  {
    id: 'insurance-support',
    title: 'Insurance Support',
    description: 'Comprehensive support for insurance operations and claims processing.',
    icon: <Shield className="w-8 h-8" />,
    features: [
      'Claims processing',
      'Policy administration',
      'Customer support',
      'Documentation review',
      'Compliance monitoring',
      'Risk assessment'
    ],
    category: 'specialized'
  },
  {
    id: 'marketing-team',
    title: 'Marketing Team',
    description: 'Full-service marketing teams for digital and traditional campaigns.',
    icon: <Zap className="w-8 h-8" />,
    features: [
      'Digital marketing campaigns',
      'Content creation',
      'Social media management',
      'SEO optimization',
      'Analytics and reporting',
      'Brand management'
    ],
    category: 'specialized'
  },
  {
    id: 'finance-accounting',
    title: 'Finance & Accounting',
    description: 'Professional financial and accounting services for business operations.',
    icon: <CheckCircle className="w-8 h-8" />,
    features: [
      'Bookkeeping and accounting',
      'Financial reporting',
      'Tax preparation',
      'Payroll processing',
      'Budget planning',
      'Audit support'
    ],
    category: 'specialized'
  },
  {
    id: 'technical-teams',
    title: 'Technical Teams',
    description: 'Specialized technical teams for software development and IT operations.',
    icon: <Zap className="w-8 h-8" />,
    features: [
      'Software development',
      'System administration',
      'Technical support',
      'Quality assurance',
      'DevOps operations',
      'Database management'
    ],
    category: 'specialized'
  },
  {
    id: 'engineering-support',
    title: 'Engineering Support',
    description: 'Engineering teams for technical design and project implementation.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Technical design',
      'CAD modeling',
      'Project documentation',
      'Technical analysis',
      'Quality control',
      'Compliance review'
    ],
    category: 'specialized'
  },
  {
    id: 'legal-teams',
    title: 'Legal Teams',
    description: 'Legal support teams for document review and compliance management.',
    icon: <Shield className="w-8 h-8" />,
    features: [
      'Document review',
      'Legal research',
      'Compliance monitoring',
      'Contract preparation',
      'Case management',
      'Regulatory updates'
    ],
    category: 'specialized'
  },
  {
    id: 'complete-departments',
    title: 'Complete Departments',
    description: 'Full department outsourcing for comprehensive business operations.',
    icon: <Factory className="w-8 h-8" />,
    features: [
      'End-to-end operations',
      'Department leadership',
      'Process optimization',
      'Performance management',
      'Strategic planning',
      'Cross-functional coordination'
    ],
    category: 'specialized'
  }
]

export default function ServicesPage() {
  const [activeSection, setActiveSection] = useState<string>('')
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
      }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const mainServices = serviceSections.filter(s => s.category === 'main')
  const specializedServices = serviceSections.filter(s => s.category === 'specialized')

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-lime-50 via-white to-lime-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-lime-600">Services</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From single agents to complete departments, we provide comprehensive outsourcing solutions 
              tailored to your business needs and growth stage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50 px-8 py-3">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-lime-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lime-300 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Timeline Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Services Overview</h3>
              
              {/* Main Services */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-lime-600 uppercase tracking-wide mb-4">Main Services</h4>
                <div className="space-y-2">
                  {mainServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => scrollToSection(service.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === service.id
                          ? 'bg-lime-100 text-lime-700 border-l-4 border-lime-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-lime-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === service.id ? 'bg-lime-200' : 'bg-gray-100'
                        }`}>
                          {service.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{service.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{service.description.split('.')[0]}.</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialized Services */}
              <div>
                <h4 className="text-sm font-semibold text-lime-600 uppercase tracking-wide mb-4">Specialized Roles</h4>
                <div className="space-y-2">
                  {specializedServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => scrollToSection(service.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === service.id
                          ? 'bg-lime-100 text-lime-700 border-l-4 border-lime-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-lime-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === service.id ? 'bg-lime-200' : 'bg-gray-100'
                        }`}>
                          {service.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{service.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{service.description.split('.')[0]}.</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Service Sections */}
          <div className="flex-1 space-y-16">
            {serviceSections.map((service) => (
              <section
                key={service.id}
                id={service.id}
                ref={(el) => {
                  sectionRefs.current[service.id] = el;
                }}
                className="bg-white rounded-xl shadow-lg p-8 lg:p-12"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 p-4 bg-lime-100 rounded-xl">
                    <div className="text-lime-600">
                      {service.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                      {service.category === 'main' && (
                        <span className="px-3 py-1 bg-lime-100 text-lime-700 text-sm font-medium rounded-full">
                          Main Service
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-8">{service.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                        <ul className="space-y-3">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose This Service?</h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Star className="w-5 h-5 text-lime-600" />
                            <span className="text-gray-700">Proven track record</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-lime-600" />
                            <span className="text-gray-700">24/7 availability</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-lime-600" />
                            <span className="text-gray-700">Secure and confidential</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-lime-600" />
                            <span className="text-gray-700">Fast implementation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <Button className="bg-lime-600 hover:bg-lime-700 text-white">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-lime-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have already scaled their operations with our professional outsourcing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700 px-8 py-3">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
