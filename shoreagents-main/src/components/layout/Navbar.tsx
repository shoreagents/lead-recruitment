"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X, Star, ArrowRight } from 'lucide-react'
import { useCurrency, currencies, Currency } from '@/lib/currencyContext'
import { AuthButtons } from '@/components/ui/auth-buttons'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const { selectedCurrency, setSelectedCurrency, isDetectingLocation, detectUserLocation, isAutoDetected, setIsAutoDetected, hasUserSelectedCurrency, setHasUserSelectedCurrency } = useCurrency()
  const pathname = usePathname()
  
  // Check if we're on an employee profile page, user dashboard, or admin dashboard
  const isEmployeePage = pathname?.startsWith('/employee/')
  const isUserDashboard = pathname?.startsWith('/user-dashboard')
  const isAdminDashboard = pathname?.startsWith('/admin-dashboard')

  // Country name mapping for currencies
  const currencyCountryNames: Record<string, string> = {
    USD: 'UNITED STATES',
    AUD: 'AUSTRALIA',
    CAD: 'CANADA',
    GBP: 'UNITED KINGDOM',
    NZD: 'NEW ZEALAND',
    EUR: 'EUROPE',
    PHP: 'PHILIPPINES'
  }

  // Scroll event listener to track scroll state
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  
  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency)
    setHasUserSelectedCurrency(true) // Mark that user has manually selected a currency
    setIsAutoDetected(false) // Clear auto-detection flag when manually selecting
  }

  const handleDetectLocation = async () => {
    await detectUserLocation()
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <nav className={`${isEmployeePage || isUserDashboard || isAdminDashboard ? 'bg-lime-600' : 'bg-white'} sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm' : 'shadow-none'}`}>
      <div className="w-full relative">
        <div className="flex items-center h-16">
          {/* Logo - Absolute left edge */}
          <div className="flex-shrink-0 absolute left-10 z-10">
            <Link href="/" className="flex items-center">
              {/* Mobile Logo */}
              <Image
                src="/ShoreAgents-Logo-Copy.png"
                alt="ShoreAgents Logo"
                width={180}
                height={40}
                className={`h-10 w-auto lg:hidden ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'brightness-0 invert' : ''}`}
              />
              {/* Desktop Logo */}
              <Image
                src="/ShoreAgents-Logo.png"
                alt="ShoreAgents Logo"
                width={180}
                height={40}
                className={`h-10 w-auto hidden lg:block ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'brightness-0 invert' : ''}`}
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered with left margin to account for logo */}
          {!isUserDashboard && !isAdminDashboard && (
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center ml-[180px]">
            {/* Our Services Dropdown */}
            <div className="relative group">
              <div className={`flex items-center space-x-1 px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative cursor-pointer ${isEmployeePage || isAdminDashboard ? (isActive('/services') ? 'text-white' : 'text-white hover:text-gray-200') : (isActive('/services') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600')}`}>
                <span className="relative inline-block">
                  Our Services
                  <span className={`absolute -bottom-1 left-1/2 h-0.5 ${isEmployeePage || isAdminDashboard ? 'bg-white' : 'bg-lime-600'} transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/services') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </span>
                <ChevronDown className="h-4 w-4 -rotate-90 transition-transform duration-200 group-hover:rotate-0" />
              </div>
              
              {/* Our Services Dropdown Content */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-3">
                  {/* Header */}
                  

                  {/* Services and Pillars Cards */}
                  <div className="grid grid-cols-2 gap-2 mb-0">
                    {/* Services Card */}
                  <div className="relative group/services">
                      <div className="px-2 py-2 hover:bg-lime-50 transition-all duration-200 cursor-pointer rounded-lg">
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-lime-700 text-base">Services</h4>
                          <ChevronDown className="w-4 h-4 text-lime-600 -rotate-90 transition-transform duration-200 group-hover/services:rotate-0" />
                        </div>
                    </div>
                    
                      {/* Services Sub-dropdown */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-300">
                      <div className="p-6">
                          <div className="mb-4">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">Services</h4>
                            <p className="text-sm text-gray-600">Our core service offerings</p>
                          </div>
                        
                          {/* Top Cards Section */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {/* Hire One Agent Card */}
                            <Link href="/services/our-services/hire-one-agent" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lime-700 mb-2">Hire One Agent</h4>
                                  <p className="text-sm text-gray-600 mb-3">Perfect for first-time outsourcers</p>
                                  <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                                    Start conservative
                              </div>
                              </div>
                                <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                          
                            {/* Build a Team Card */}
                            <Link href="/services/our-services/build-a-team" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lime-700 mb-2">Build a Team</h4>
                                  <p className="text-sm text-gray-600 mb-3">Scale your business with 3-10 professionals</p>
                                  <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                                    3-10 people
                              </div>
                              </div>
                                <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                          
                            {/* Create a Workforce Card */}
                            <Link href="/services/our-services/create-workforce" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lime-700 mb-2">Create a Workforce</h4>
                                  <p className="text-sm text-gray-600 mb-3">Large operations, 10+ people</p>
                                  <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                                    Private office
                              </div>
                              </div>
                                <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                        </div>

                          {/* Bottom Links Section */}
                          <div className="grid grid-cols-3 gap-8">
                            {/* Column 1 */}
                          <div className="space-y-2">
                              <Link href="/services/our-services/real-estate-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Real Estate Virtual Assistant
                            </Link>
                              <Link href="/services/our-services/property-management-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Property Management Assistant
                            </Link>
                              <Link href="/services/our-services/administrative-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Administrative Assistant
                            </Link>
                              <Link href="/services/our-services/customer-service-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Customer Service Assistant
                            </Link>
                          </div>

                            {/* Column 2 */}
                          <div className="space-y-2">
                              <Link href="/services/our-services/construction-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Construction Team
                            </Link>
                              <Link href="/services/our-services/insurance-support" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Insurance Support
                            </Link>
                              <Link href="/services/our-services/marketing-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Marketing Team
                            </Link>
                              <Link href="/services/our-services/finance-accounting" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Finance & Accounting
                            </Link>
                          </div>

                            {/* Column 3 */}
                          <div className="space-y-2">
                              <Link href="/services/our-services/architecture-teams" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                                Architecture Teams
                            </Link>
                              <Link href="/services/our-services/engineering-support" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Engineering Support
                            </Link>
                              <Link href="/services/our-services/legal-teams" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Legal Teams
                            </Link>
                              <Link href="/services/our-services/complete-departments" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Complete Departments
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Pillars Card */}
                  <div className="relative group/pillars">
                      <div className="px-2 py-2 hover:bg-lime-50 transition-all duration-200 cursor-pointer rounded-lg">
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-lime-700 text-base">Pillars</h4>
                          <ChevronDown className="w-4 h-4 text-lime-600 -rotate-90 transition-transform duration-200 group-hover/pillars:rotate-0" />
                        </div>
                    </div>
                    
                      {/* Pillars Sub-dropdown */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover/pillars:opacity-100 group-hover/pillars:visible transition-all duration-300">
                      <div className="p-6">
                          <div className="mb-4">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">Pillars</h4>
                            <p className="text-sm text-gray-600">37 topical pillars covering all industries and services</p>
                          </div>
                          
                          {/* Top Cards Section */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {/* Outsourcing Services Card */}
                            <Link href="/services/pillars/outsourcing-services" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lime-700 mb-2">Outsourcing Services</h4>
                                  <p className="text-sm text-gray-600 mb-3">Complete business process outsourcing</p>
                                  <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                                    Main Pillar
                              </div>
                              </div>
                                <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                          
                            {/* Virtual Assistants Card */}
                            <Link href="/services/pillars/virtual-assistants" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lime-700 mb-2">Virtual Assistants</h4>
                                  <p className="text-sm text-gray-600 mb-3">Specialized virtual assistant services</p>
                                  <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                                    Specialized
                              </div>
                              </div>
                                <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                          
                            {/* Technical & Digital Card */}
                            <Link href="/services/pillars/technical-digital" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lime-700 mb-2">Technical & Digital</h4>
                                  <p className="text-sm text-gray-600 mb-3">Technical and digital services</p>
                                  <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                                    Technical
                              </div>
                              </div>
                                <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                        </div>

                          {/* Bottom Links Section */}
                          <div className="grid grid-cols-3 gap-8">
                            {/* Column 1 - Outsourcing Services */}
                          <div className="space-y-2">
                              <Link href="/services/pillars/real-estate-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Real Estate Outsourcing
                            </Link>
                              <Link href="/services/pillars/property-management-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Property Management Outsourcing
                            </Link>
                              <Link href="/services/pillars/construction-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Construction Outsourcing
                            </Link>
                              <Link href="/services/pillars/accounting-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Accounting Outsourcing
                            </Link>
                          </div>

                            {/* Column 2 - Virtual Assistants */}
                          <div className="space-y-2">
                              <Link href="/services/pillars/real-estate-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Real Estate Virtual Assistant
                            </Link>
                              <Link href="/services/pillars/seo-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              SEO Virtual Assistant
                            </Link>
                              <Link href="/services/pillars/ai-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              AI Virtual Assistant
                            </Link>
                              <Link href="/services/pillars/social-media-virtual-assistant" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Social Media Virtual Assistant
                            </Link>
                          </div>

                            {/* Column 3 - Technical & Digital */}
                          <div className="space-y-2">
                              <Link href="/services/pillars/architectural-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Architectural Outsourcing
                            </Link>
                              <Link href="/services/pillars/engineering-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Engineering Outsourcing
                            </Link>
                              <Link href="/services/pillars/seo-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              SEO Outsourcing
                            </Link>
                              <Link href="/services/pillars/graphic-design-outsourcing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Graphic Design Outsourcing
                            </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Navigation Items */}
            <Link href="/how-it-works" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isEmployeePage || isAdminDashboard ? (isActive('/how-it-works') ? 'text-white' : 'text-white hover:text-gray-200') : (isActive('/how-it-works') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600')}`}>
              <span className="relative inline-block">
              How it works
                <span className={`absolute -bottom-1 left-1/2 h-0.5 ${isEmployeePage || isAdminDashboard ? 'bg-white' : 'bg-lime-600'} transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/how-it-works') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>
            <Link href="/pricing" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isEmployeePage || isAdminDashboard ? (isActive('/pricing') ? 'text-white' : 'text-white hover:text-gray-200') : (isActive('/pricing') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600')}`}>
              <span className="relative inline-block">
              Pricing
                <span className={`absolute -bottom-1 left-1/2 h-0.5 ${isEmployeePage || isAdminDashboard ? 'bg-white' : 'bg-lime-600'} transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/pricing') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>
            <Link href="/case-studies" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isEmployeePage || isAdminDashboard ? (isActive('/case-studies') ? 'text-white' : 'text-white hover:text-gray-200') : (isActive('/case-studies') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600')}`}>
              <span className="relative inline-block">
              Case Studies
                <span className={`absolute -bottom-1 left-1/2 h-0.5 ${isEmployeePage || isAdminDashboard ? 'bg-white' : 'bg-lime-600'} transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/case-studies') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>
            <Link href="/blogs" className={`px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative group ${isEmployeePage || isAdminDashboard ? (isActive('/blogs') ? 'text-white' : 'text-white hover:text-gray-200') : (isActive('/blogs') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600')}`}>
              <span className="relative inline-block">
              Blogs
                <span className={`absolute -bottom-1 left-1/2 h-0.5 ${isEmployeePage || isAdminDashboard ? 'bg-white' : 'bg-lime-600'} transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/blogs') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>
            {/* About Dropdown */}
            <div className="relative group">
              <div className={`flex items-center space-x-1 px-3 py-2 whitespace-nowrap font-semibold transition-colors duration-200 relative cursor-pointer ${isEmployeePage || isAdminDashboard ? (isActive('/about') ? 'text-white' : 'text-white hover:text-gray-200') : (isActive('/about') ? 'text-lime-600' : 'text-gray-700 hover:text-lime-600')}`}>
                <span className="relative inline-block">
                  About Shore
                  <span className={`absolute -bottom-1 left-1/2 h-0.5 ${isEmployeePage || isAdminDashboard ? 'bg-white' : 'bg-lime-600'} transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </span>
                <ChevronDown className="h-4 w-4 -rotate-90 transition-transform duration-200 group-hover:rotate-0" />
              </div>
              
              {/* About Dropdown Content */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">About Shore</h3>
                    <p className="text-sm text-gray-600">Learn about our company, team, and mission</p>
                    </div>
                    
                  {/* Top Cards Section */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Our Story Card */}
                    <Link href="/about/our-story" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Our Story</h4>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Story
                              </div>
                              </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                          
                    {/* Proven Results Card */}
                    <Link href="/about/proven-results" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Proven Results</h4>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Results
                              </div>
                              </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                          
                    {/* Resources Card */}
                    <Link href="/about/resources" className="bg-lime-50 rounded-lg p-4 hover:bg-lime-100 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lime-700 mb-2">Resources</h4>
                          <div className="inline-flex items-center px-2 py-1 bg-lime-100 rounded text-xs font-medium text-lime-700">
                            Resources
                              </div>
                              </div>
                        <ArrowRight className="w-4 h-4 text-lime-600 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </Link>
                        </div>

                  {/* Bottom Links Section */}
                  <div className="grid grid-cols-3 gap-8">
                    {/* First Column */}
                          <div className="space-y-2">
                      <Link href="/how-it-works" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        How It Works
                            </Link>
                      <Link href="/about/team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Our Team
                          </Link>
                      <Link href="/about/stephen-atcheler" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Stephen Atcheler - CEO
                          </Link>
                      <Link href="/about/find-us-clark" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Find Us in Clark
                          </Link>
                        </div>

                    {/* Second Column */}
                          <div className="space-y-2">
                      <Link href="/case-studies/ballast-4-46-team" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Ballast: 4-46 Team
                            </Link>
                      <Link href="/case-studies/gallery-group-partnership" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Gallery Group Partnership
                          </Link>
                      <Link href="/case-studies/jack-miller-40k-savings" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Jack Miller: $40K Savings
                          </Link>
                      <Link href="/case-studies" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        All Case Studies
                          </Link>
                        </div>

                    {/* Third Column */}
                          <div className="space-y-2">
                      <Link href="/about/complete-service-guide" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Complete Service Guide
                      </Link>
                      <Link href="/blogs" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Blog & Articles
                      </Link>
                      <Link href="/pricing" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                        Pricing Calculator
                      </Link>
                      <Link href="/about/our-agents-demos" className="block text-sm text-gray-700 hover:text-lime-600 transition-colors duration-200">
                              Our Agents Demos
                            </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          )}

        

          {/* Currency Selector and Auth Buttons - Right Edge */}
          <div className="hidden md:flex items-center space-x-4 absolute right-4 top-0 h-16">
            {/* Currency Selector */}
            <div className="relative group">
              <div 
                className={`flex items-center space-x-2 ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white hover:bg-lime-700' : 'text-gray-600 hover:bg-gray-50'} rounded-lg px-3 py-1.5 cursor-pointer transition-all duration-200 w-24`}
                title={isDetectingLocation ? "Detecting your location..." : `Current currency: ${selectedCurrency.code}${isAutoDetected ? ' (Auto-detected)' : hasUserSelectedCurrency ? ' (Manually selected)' : ''}`}
              >
                {isAutoDetected && (
                  <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
                )}
                {hasUserSelectedCurrency && !isAutoDetected && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                {isDetectingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span className="text-sm font-medium text-gray-600">...</span>
                  </>
                ) : (
                  <>
                    <span className={`text-sm font-medium ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white' : 'text-gray-700'}`}>{selectedCurrency.code}</span>
                  </>
                )}
                <ChevronDown className={`h-3 w-3 ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white' : 'text-gray-500'} transition-transform duration-200 group-hover:rotate-180`} />
              </div>
              
              {/* Currency Dropdown */}
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-in-out z-50 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div className="py-2">
                  {/* Auto-detect option */}
                  <div 
                    className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                    onClick={handleDetectLocation}
                  >
                    <div className="w-8 h-4 flex items-center justify-center">
                      <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Auto-detect</span>
                  </div>
                  
                  {/* Currency options */}
                  {currencies.map((currency) => (
                    <div 
                      key={currency.code}
                      className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => handleCurrencySelect(currency)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{currency.code}</span>
                        <span className="text-xs text-gray-500">{currencyCountryNames[currency.code]}</span>
                      </div>
                      {selectedCurrency.code === currency.code && isAutoDetected && (
                        <span className="ml-auto text-xs text-lime-600">Auto</span>
                      )}
                      {selectedCurrency.code === currency.code && hasUserSelectedCurrency && !isAutoDetected && (
                        <span className="ml-auto text-xs text-blue-600">Manual</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <AuthButtons />
          </div>

          
          {/* Absolute positioned currency and burger icons for edge alignment */}
          <div className="lg:hidden absolute right-0 top-0 h-16 flex items-center space-x-2 pr-2">
            {/* Mobile Currency Selector */}
            <div className="relative group">
              <button 
                className={`flex items-center space-x-2 ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white hover:bg-lime-700' : 'text-gray-600 hover:bg-gray-50'} rounded-lg px-3 py-2 transition-all duration-200 focus:outline-none`}
                title={isDetectingLocation ? "Detecting your location..." : `Current currency: ${selectedCurrency.code}${isAutoDetected ? ' (Auto-detected)' : hasUserSelectedCurrency ? ' (Manually selected)' : ''}`}
                onClick={() => {
                  // Toggle dropdown visibility
                  const dropdown = document.querySelector('.currency-dropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('opacity-0');
                    dropdown.classList.toggle('invisible');
                  }
                }}
              >
                {isAutoDetected && (
                  <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
                )}
                {hasUserSelectedCurrency && !isAutoDetected && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                {isDetectingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span className="text-sm font-medium text-gray-600">...</span>
                  </>
                ) : (
                  <>
                    <svg className={`w-4 h-4 ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className={`text-sm font-medium ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white' : 'text-gray-700'}`}>{selectedCurrency.code}</span>
                  </>
                )}
                <ChevronDown className={`h-3 w-3 ${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white' : 'text-gray-500'} transition-transform duration-200 group-hover:rotate-180`} />
              </button>
              
              {/* Currency Dropdown */}
              <div className="currency-dropdown absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-in-out z-50 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div className="p-3">
                  <div className="text-gray-700 font-medium mb-3 text-left">Currency</div>
                  
                  {/* Auto-detect option */}
                  <button 
                    className="w-full flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded transition-colors duration-200 border border-gray-200 text-left mb-2"
                    onClick={handleDetectLocation}
                  >
                    <div className="w-8 h-4 flex items-center justify-center">
                      <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Auto-detect</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {currencies.map((currency) => (
                      <button 
                        key={currency.code}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded transition-colors duration-200 border border-gray-200 text-left w-full"
                        onClick={() => handleCurrencySelect(currency)}
                      >
                        <span className="text-lg font-bold text-gray-600 w-8">{currency.symbol}</span>
                        <span className="text-sm text-gray-700 font-medium">{currency.code}</span>
                        {selectedCurrency.code === currency.code && isAutoDetected && (
                          <span className="ml-auto text-xs text-lime-600">Auto</span>
                        )}
                        {selectedCurrency.code === currency.code && hasUserSelectedCurrency && !isAutoDetected && (
                          <span className="ml-auto text-xs text-blue-600">Manual</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className={`${isEmployeePage || isUserDashboard || isAdminDashboard ? 'text-white hover:bg-lime-700' : 'text-gray-700 hover:bg-lime-50'} transition-colors duration-200`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
                    </div>
                              </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="max-h-[80vh] overflow-y-auto bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                
                {/* Main Navigation Items */}
                <Link href="/how-it-works" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/how-it-works') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
              <span className="relative inline-block">
              How it works
                <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-lime-600 transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/how-it-works') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>
                
                <Link href="/pricing" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/pricing') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
              <span className="relative inline-block">
              Pricing
                <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-lime-600 transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/pricing') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>
                
                <Link href="/case-studies" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/case-studies') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
              <span className="relative inline-block">
              Case Studies
                <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-lime-600 transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/case-studies') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>
                
                <Link href="/blogs" className={`block px-3 py-3 font-semibold relative group border-b border-gray-100 ${isActive('/blogs') ? 'text-lime-600 bg-lime-50' : 'text-gray-700 hover:text-lime-600 hover:bg-gray-50'}`}>
              <span className="relative inline-block">
              Blogs
                <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-lime-600 transition-all duration-300 ease-out transform -translate-x-1/2 ${isActive('/blogs') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
            </Link>

                {/* Services Section */}
                <div className="border-b border-gray-100">
                  <button 
                    onClick={() => toggleSection('services')}
                    className="w-full flex items-center justify-between px-3 py-3 font-semibold text-gray-700 hover:text-lime-600 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>Our Services</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes('services') ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedSections.includes('services') && (
                    <div className="pl-4 space-y-1 pb-3">
                      {/* Our Services */}
                   <div className="mb-3">
                        <div className="text-sm font-semibold text-gray-800 mb-2 px-3 py-1">Our Services</div>
                        <div className="pl-3 space-y-1">
                          <Link href="/services/our-services/hire-one-agent" className="block text-gray-600 hover:text-lime-600 py-2 text-sm font-medium px-3 rounded hover:bg-lime-50">
                         Hire One Agent - Perfect for first-time outsourcers
                       </Link>
                          <Link href="/services/our-services/build-a-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm font-medium px-3 rounded hover:bg-lime-50">
                         Build a Team - Scale your business with 3-10 professionals
                       </Link>
                          <Link href="/services/our-services/create-workforce" className="block text-gray-600 hover:text-lime-600 py-2 text-sm font-medium px-3 rounded hover:bg-lime-50">
                         Create a Workforce - Large operations, 10+ people
                       </Link>
                       
                       {/* Specialized Roles */}
                       <div className="mt-3 pt-2 border-t border-gray-200">
                            <div className="text-xs font-semibold text-gray-700 mb-2 px-3">Specialized Roles:</div>
                            <Link href="/services/our-services/real-estate-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Real Estate Virtual Assistant
                         </Link>
                            <Link href="/services/our-services/property-management-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Property Management Assistant
                         </Link>
                            <Link href="/services/our-services/administrative-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Administrative Assistant
                         </Link>
                            <Link href="/services/our-services/customer-service-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Customer Service Assistant
                         </Link>
                            <Link href="/services/our-services/construction-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Construction Team
                         </Link>
                            <Link href="/services/our-services/insurance-support" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Insurance Support
                         </Link>
                            <Link href="/services/our-services/marketing-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Marketing Team
                         </Link>
                            <Link href="/services/our-services/finance-accounting" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Finance & Accounting
                         </Link>
                            <Link href="/services/our-services/architecture-teams" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Architecture Teams
                         </Link>
                            <Link href="/services/our-services/engineering-support" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Engineering Support
                         </Link>
                            <Link href="/services/our-services/legal-teams" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Legal Teams
                         </Link>
                            <Link href="/services/our-services/complete-departments" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                           Complete Departments
                         </Link>
                       </div>
                     </div>
                   </div>
                      
                      {/* Pillars */}
                   <div>
                        <div className="text-sm font-semibold text-gray-800 mb-2 px-3 py-1">Pillars</div>
                        <div className="pl-3 space-y-1">
                          <Link href="/services/pillars/real-estate-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Real Estate Outsourcing
                       </Link>
                          <Link href="/services/pillars/property-management-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Property Management Outsourcing
                       </Link>
                          <Link href="/services/pillars/construction-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Construction Outsourcing
                       </Link>
                          <Link href="/services/pillars/accounting-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Accounting Outsourcing
                       </Link>
                          <Link href="/services/pillars/real-estate-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Real Estate Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/seo-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         SEO Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/ai-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         AI Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/social-media-virtual-assistant" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Social Media Virtual Assistant
                       </Link>
                          <Link href="/services/pillars/architectural-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Architectural Outsourcing
                       </Link>
                          <Link href="/services/pillars/engineering-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Engineering Outsourcing
                       </Link>
                          <Link href="/services/pillars/seo-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         SEO Outsourcing
                   </Link>
                          <Link href="/services/pillars/graphic-design-outsourcing" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                         Graphic Design Outsourcing
                   </Link>
                     </div>
                   </div>
                 </div>
                  )}
               </div>
               
                {/* About Section */}
                <div className="border-b border-gray-100">
                  <button 
                    onClick={() => toggleSection('about')}
                    className="w-full flex items-center justify-between px-3 py-3 font-semibold text-gray-700 hover:text-lime-600 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>About Shore</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes('about') ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedSections.includes('about') && (
                    <div className="pl-4 space-y-1 pb-3">
                      <Link href="/about/our-story" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Story
               </Link>
                      <Link href="/about/team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Team
               </Link>
                      <Link href="/about/our-mission" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Mission
                      </Link>
                      <Link href="/about/stephen-atcheler" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Stephen Atcheler, CEO
                      </Link>
                      <Link href="/about/leadership-team" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Leadership Team
                      </Link>
                      <Link href="/about/company-values" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Company Values
               </Link>
                      <Link href="/about/culture" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Our Culture
               </Link>
                      <Link href="/about/case-studies" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                 Case Studies
               </Link>
                      <Link href="/about/success-stories" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Success Stories
               </Link>
                      <Link href="/about/client-testimonials" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Client Testimonials
               </Link>
                      <Link href="/about/partnerships" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Partnerships
                      </Link>
                      <Link href="/about/office-location" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Office Location
                      </Link>
                      <Link href="/about/contact-us" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Contact Us
               </Link>
                      <Link href="/about/careers" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        Careers
               </Link>
                      <Link href="/about/news" className="block text-gray-600 hover:text-lime-600 py-2 text-sm px-3 rounded hover:bg-lime-50">
                        News & Updates
               </Link>
                    </div>
                  )}
                </div>

                {/* Side Nav Items - Mobile */}
                <div className="px-3 py-3 space-y-3">
                  <div className="text-gray-700 font-medium mb-3">Quick Actions</div>
                  
                  {/* Philippines Got Talent Button - Mobile */}
                  <button 
                    onClick={() => window.location.href = '/we-got-talent'}
                    className="w-full bg-lime-100 border border-lime-600 rounded-lg px-4 py-3 shadow-[4px_4px_0px_#4d7c0f] flex items-center justify-between opacity-90 hover:opacity-100 transition-all duration-300 hover:bg-lime-200 hover:shadow-[6px_6px_0px_#4d7c0f] hover:scale-105 hover:-translate-y-1 cursor-pointer active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0 active:scale-95"
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-lime-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">
                        <span className="font-normal">PHILIPPINES GOT </span>
                        <span className="font-bold">TALENT!</span>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-lime-600 flex-shrink-0" />
                  </button>
                  
                  {/* Book Consultations Button - Mobile */}
                  <button 
                    onClick={() => window.location.href = '/gettingstart'}
                    className="w-full bg-lime-100 border border-lime-600 rounded-lg px-4 py-3 shadow-[4px_4px_0px_#4d7c0f] flex items-center justify-between opacity-90 hover:opacity-100 transition-all duration-300 hover:bg-lime-200 hover:shadow-[6px_6px_0px_#4d7c0f] hover:scale-105 hover:-translate-y-1 cursor-pointer active:shadow-[2px_2px_0px_#4d7c0f] active:translate-y-0 active:scale-95"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        <span className="font-normal">BOOK </span>
                        <span className="font-bold">CONSULTATIONS!</span>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-lime-600 flex-shrink-0" />
                  </button>
                </div>

                {/* Auth Buttons - Mobile */}
                <div className="px-2 py-3 border-t border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <AuthButtons />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
