"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Award, BookOpen, User, MapPin, Building, Calculator, FileText, Play, Star } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

interface AboutSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: React.ReactNode
  category: 'main' | 'team' | 'partnerships' | 'case-studies' | 'resources'
}

const aboutSections: AboutSection[] = [
  // Main Sections
  {
    id: 'our-story',
    title: 'Our Story',
    description: 'Discover the journey that led us to become a leading outsourcing partner for businesses worldwide.',
    icon: <BookOpen className="w-8 h-8" />,
    category: 'main',
    content: (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            ShoreAgents was founded with a simple yet powerful vision: to connect exceptional talent with businesses 
            that need them, creating opportunities for growth and success on both sides of the equation.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            What started as a small team in Clark, Philippines has grown into a comprehensive outsourcing partner 
            serving clients across the globe. Our journey has been marked by continuous innovation, unwavering 
            commitment to quality, and deep understanding of our clients' evolving needs.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Today, we're proud to have helped thousands of businesses scale their operations, reduce costs, 
            and focus on their core competencies while we handle the rest.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-lime-50 rounded-lg">
            <div className="text-3xl font-bold text-lime-600 mb-2">1000+</div>
            <div className="text-gray-700">Happy Clients</div>
          </div>
          <div className="text-center p-6 bg-lime-50 rounded-lg">
            <div className="text-3xl font-bold text-lime-600 mb-2">5000+</div>
            <div className="text-gray-700">Professionals</div>
          </div>
          <div className="text-center p-6 bg-lime-50 rounded-lg">
            <div className="text-3xl font-bold text-lime-600 mb-2">10+</div>
            <div className="text-gray-700">Years Experience</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'proven-results',
    title: 'Proven Results',
    description: 'See the tangible impact we\'ve made for our clients through data-driven results and success stories.',
    icon: <Award className="w-8 h-8" />,
    category: 'main',
    content: (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            Our success is measured by the success of our clients. We've consistently delivered exceptional results 
            across industries, helping businesses achieve their goals while maintaining the highest standards of quality.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Client Success Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Cost Savings</span>
                <span className="font-semibold text-lime-600">60%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Quality Improvement</span>
                <span className="font-semibold text-lime-600">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Client Retention Rate</span>
                <span className="font-semibold text-lime-600">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Response Time</span>
                <span className="font-semibold text-lime-600">&lt; 2 hours</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Recognition</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-lime-600" />
                <span className="text-gray-700">Top 10 BPO Provider 2024</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-lime-600" />
                <span className="text-gray-700">Excellence in Customer Service</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-lime-600" />
                <span className="text-gray-700">Best Workplace Award</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-lime-600" />
                <span className="text-gray-700">ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  // Team Section
  {
    id: 'our-team',
    title: 'Our Team',
    description: 'Meet the dedicated professionals behind our success and learn about our leadership.',
    icon: <Users className="w-8 h-8" />,
    category: 'team',
    content: (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            Our team is the backbone of ShoreAgents' success. From our leadership to our dedicated professionals, 
            every member brings expertise, passion, and commitment to delivering exceptional results for our clients.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-lime-100 rounded-lg">
                <User className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Stephen Atcheler</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Leading our vision and strategic direction with over 15 years of experience in the outsourcing industry. 
              Stephen's leadership has been instrumental in building ShoreAgents into a trusted partner for businesses worldwide.
            </p>
            <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
              Learn More About Stephen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-lime-100 rounded-lg">
                <MapPin className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Find Us in Clark</h3>
                <p className="text-gray-600">Our Headquarters</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Visit our state-of-the-art facility in Clark, Philippines. Our modern office space is designed to 
              foster collaboration, innovation, and productivity for our team of professionals.
            </p>
            <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
              Get Directions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  },
  // Partnerships Section
  {
    id: 'partnerships',
    title: 'Partnerships',
    description: 'Strategic partnerships that deliver exceptional results and drive mutual success.',
    icon: <Building className="w-8 h-8" />,
    category: 'partnerships',
    content: (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            Our strategic partnerships are built on trust, mutual respect, and shared goals. We work closely with 
            our partners to deliver exceptional results and create lasting value for all stakeholders.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-lime-100 rounded-lg">
                <Building className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Ballast: 4 - 46 Team</h3>
                <p className="text-gray-600">Growth Success Story</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              From 4 to 46 professionals - see our remarkable growth story with Ballast. This partnership showcases 
              our ability to scale operations efficiently while maintaining quality and performance standards.
            </p>
            <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
              View Case Study
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-lime-100 rounded-lg">
                <Building className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Gallery Group Partnership</h3>
                <p className="text-gray-600">Strategic Collaboration</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Our strategic partnership with Gallery Group demonstrates how collaboration and shared expertise 
              can deliver exceptional results and create lasting value for both organizations.
            </p>
            <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  },
  // Case Studies Section
  {
    id: 'case-studies',
    title: 'Case Studies',
    description: 'Real results from real clients - explore our comprehensive collection of success stories.',
    icon: <FileText className="w-8 h-8" />,
    category: 'case-studies',
    content: (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            Our case studies showcase the real impact we've made for our clients. From cost savings to operational 
            improvements, these stories demonstrate our commitment to delivering measurable results.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-lime-100 rounded-lg">
                <Award className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Jack Miller: $40K Savings</h3>
                <p className="text-gray-600">Cost Reduction Success</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Discover how we helped Jack Miller achieve significant cost savings while improving operational 
              efficiency and maintaining high quality standards.
            </p>
            <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
              Read Case Study
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-lime-100 rounded-lg">
                <FileText className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">All Case Studies</h3>
                <p className="text-gray-600">Complete Collection</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Explore our comprehensive collection of success stories across different industries and business 
              challenges. Each case study provides detailed insights into our approach and results.
            </p>
            <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
              Browse All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  },
  // Resources Section
  {
    id: 'resources',
    title: 'Resources',
    description: 'Access our comprehensive library of tools, guides, and insights to help you succeed.',
    icon: <BookOpen className="w-8 h-8" />,
    category: 'resources',
    content: (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe in empowering our clients with knowledge and tools. Explore our resources to learn more 
            about outsourcing, industry trends, and best practices.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Complete Service Guide */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-lime-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Service Guide</h3>
            </div>
            <p className="text-gray-600 mb-4">Comprehensive guide to all our services and offerings.</p>
            <Button variant="outline" className="w-full border-lime-600 text-lime-600 hover:bg-lime-50">
              Download Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Blog & Articles */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-lime-100 rounded-lg">
                <FileText className="w-5 h-5 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Blog & Articles</h3>
            </div>
            <p className="text-gray-600 mb-4">Insights, tips, and industry knowledge.</p>
            <Button variant="outline" className="w-full border-lime-600 text-lime-600 hover:bg-lime-50">
              Read Blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Pricing Calculator */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-lime-100 rounded-lg">
                <Calculator className="w-5 h-5 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pricing Calculator</h3>
            </div>
            <p className="text-gray-600 mb-4">Get instant pricing for your specific needs.</p>
            <Button variant="outline" className="w-full border-lime-600 text-lime-600 hover:bg-lime-50">
              Calculate Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Our Agents Demos */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-lime-100 rounded-lg">
                <Play className="w-5 h-5 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Our Agents Demos</h3>
            </div>
            <p className="text-gray-600 mb-4">See our agents in action with live demonstrations.</p>
            <Button variant="outline" className="w-full border-lime-600 text-lime-600 hover:bg-lime-50">
              Watch Demos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
]

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string>('')
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navItemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            
            // Scroll the active nav item to the top of the sidebar
            const navItem = navItemRefs.current[entry.target.id]
            const sidebar = sidebarRef.current
            if (navItem && sidebar) {
              const sidebarRect = sidebar.getBoundingClientRect()
              const navItemRect = navItem.getBoundingClientRect()
              const offset = navItemRect.top - sidebarRect.top - 20 // 20px padding from top
              
              if (offset < 0 || offset > sidebarRect.height - navItemRect.height) {
                sidebar.scrollTo({
                  top: sidebar.scrollTop + offset,
                  behavior: 'smooth'
                })
              }
            }
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

  const mainSections = aboutSections.filter(s => s.category === 'main')
  const teamSections = aboutSections.filter(s => s.category === 'team')
  const partnershipSections = aboutSections.filter(s => s.category === 'partnerships')
  const caseStudySections = aboutSections.filter(s => s.category === 'case-studies')
  const resourceSections = aboutSections.filter(s => s.category === 'resources')

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-lime-50 via-white to-lime-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-lime-600">ShoreAgents</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover our story, see our proven results, and explore the resources that make us your trusted 
              outsourcing partner for business growth and success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50 px-8 py-3">
                Contact Us
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
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div 
              ref={sidebarRef}
              className="sticky top-24 bg-white rounded-lg shadow-lg p-6 max-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">About ShoreAgents</h3>
              
              {/* Main Sections */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-lime-600 uppercase tracking-wide mb-4">Main Sections</h4>
                <div className="space-y-2">
                  {mainSections.map((section) => (
                    <button
                      key={section.id}
                      ref={(el) => {
                        navItemRefs.current[section.id] = el
                      }}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-lime-100 text-lime-700 border-l-4 border-lime-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-lime-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === section.id ? 'bg-lime-200' : 'bg-gray-100'
                        }`}>
                          {section.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{section.description.split('.')[0]}.</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-lime-600 uppercase tracking-wide mb-4">Team</h4>
                <div className="space-y-2">
                  {teamSections.map((section) => (
                    <button
                      key={section.id}
                      ref={(el) => {
                        navItemRefs.current[section.id] = el
                      }}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-lime-100 text-lime-700 border-l-4 border-lime-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-lime-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === section.id ? 'bg-lime-200' : 'bg-gray-100'
                        }`}>
                          {section.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{section.description.split('.')[0]}.</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Partnerships */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-lime-600 uppercase tracking-wide mb-4">Partnerships</h4>
                <div className="space-y-2">
                  {partnershipSections.map((section) => (
                    <button
                      key={section.id}
                      ref={(el) => {
                        navItemRefs.current[section.id] = el
                      }}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-lime-100 text-lime-700 border-l-4 border-lime-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-lime-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === section.id ? 'bg-lime-200' : 'bg-gray-100'
                        }`}>
                          {section.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{section.description.split('.')[0]}.</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Studies */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-lime-600 uppercase tracking-wide mb-4">Case Studies</h4>
                <div className="space-y-2">
                  {caseStudySections.map((section) => (
                    <button
                      key={section.id}
                      ref={(el) => {
                        navItemRefs.current[section.id] = el
                      }}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-lime-100 text-lime-700 border-l-4 border-lime-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-lime-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === section.id ? 'bg-lime-200' : 'bg-gray-100'
                        }`}>
                          {section.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{section.description.split('.')[0]}.</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-sm font-semibold text-lime-600 uppercase tracking-wide mb-4">Resources</h4>
                <div className="space-y-2">
                  {resourceSections.map((section) => (
                    <button
                      key={section.id}
                      ref={(el) => {
                        navItemRefs.current[section.id] = el
                      }}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-lime-100 text-lime-700 border-l-4 border-lime-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-lime-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === section.id ? 'bg-lime-200' : 'bg-gray-100'
                        }`}>
                          {section.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{section.description.split('.')[0]}.</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="flex-1 space-y-16">
            {aboutSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el as HTMLDivElement | null
                }}
                className="bg-white rounded-xl shadow-lg p-8 lg:p-12"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 p-4 bg-lime-100 rounded-xl">
                    <div className="text-lime-600">
                      {section.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                      <span className="px-3 py-1 bg-lime-100 text-lime-700 text-sm font-medium rounded-full">
                        {section.category === 'main' ? 'Main Section' : 
                         section.category === 'team' ? 'Team' :
                         section.category === 'partnerships' ? 'Partnerships' :
                         section.category === 'case-studies' ? 'Case Studies' : 'Resources'}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 mb-8">{section.description}</p>
                    
                    {section.content}
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
            Ready to Learn More About ShoreAgents?
          </h2>
          <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
            Connect with us to discover how we can help transform your business operations and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-3">
              Schedule a Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700 px-8 py-3">
              Download Resources
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
