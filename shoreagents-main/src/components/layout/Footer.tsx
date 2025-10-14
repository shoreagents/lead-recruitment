"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Star,
  User,
  Globe,
  Zap,
  ArrowRight
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  
  // Hide footer on employee profile pages and user dashboard
  if (pathname?.startsWith('/employee/') || pathname?.startsWith('/user-dashboard')) {
    return null
  }

  return (
    <footer className="bg-lime-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Company Info - Left Column */}
          <div className="lg:col-span-2">
            {/* Header with Logo and Company Name */}
            <div className="flex items-center mb-6">
              <Image
                src="/ShoreAgents-Logo.png"
                alt="ShoreAgents Logo"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4 mb-2 -mt-4">
              <Link 
                href="https://www.facebook.com/ShoreAgents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <i className="fab fa-facebook-f text-xl"></i>
              </Link>
              <Link 
                href="https://x.com/ShoreAgents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
                aria-label="Follow us on X (Twitter)"
              >
                <i className="fab fa-x-twitter text-xl"></i>
              </Link>
              <Link 
                href="https://www.linkedin.com/company/shoreagents/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <i className="fab fa-linkedin-in text-xl"></i>
              </Link>
              <Link 
                href="https://www.instagram.com/shore_agents/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </Link>
              <Link 
                href="https://www.youtube.com/@shoreagents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
                aria-label="Subscribe to our YouTube channel"
              >
                <i className="fab fa-youtube text-xl"></i>
              </Link>
              <Link 
                href="https://www.pinterest.com/ShoreAgents/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
                aria-label="Follow us on Pinterest"
              >
                <i className="fab fa-pinterest-p text-xl"></i>
              </Link>
              <Link 
                href="https://www.tiktok.com/@shoreagents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
                aria-label="Follow us on TikTok"
              >
                <i className="fab fa-tiktok text-xl"></i>
              </Link>
            </div>

            {/* Company Description */}
            <p className="text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Stephen Atcheler, founder of Shore Agents, brings extensive experience in real estate and business scaling. 
              After successfully scaling an Australian real estate agency, Stephen moved to the Philippines to perfect 
              the outsourcing model and provide exceptional offshore talent solutions.
            </p>

            {/* Trust Indicators */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <User className="h-5 w-5 text-lime-400 mr-3" />
                <span className="text-sm">Derek Gallimore Approved</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Star className="h-5 w-5 text-lime-400 mr-3" />
                <span className="text-sm">5+ Years Philippines Experience</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Globe className="h-5 w-5 text-lime-400 mr-3" />
                <span className="text-sm">Office-Based in Clark</span>
              </div>
            </div>

            {/* Starting Prices Section */}
            
          </div>

          {/* Contact & CTA - Right Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-8">Get In Touch</h3>
            
            {/* Contact Details */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-lime-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Clark Freeport Zone</p>
                  <p className="text-gray-300 text-sm">Angeles City, Pampanga, Philippines</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-lime-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">+63 (0) 917 123 4567</p>
                  <p className="text-gray-300 text-sm">Philippines Local</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-lime-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">hello@shoreagents.com</p>
                  <p className="text-gray-300 text-sm">Quick Response</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-lime-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Mon-Fri: 8AM-6PM PHT</p>
                  <p className="text-gray-300 text-sm">Available in your timezone</p>
                </div>
              </div>
            </div>

            {/* Call-to-Action Buttons */}
            
          </div>
        </div>

        {/* Four Column Footer Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Our Services */}
            <div>
              <h3 className="text-md font-bold text-white mb-4 border-b border-lime-700 pb-2">Our Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services/hire-one-agent" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    One Agent
                  </Link>
                </li>
                <li>
                  <Link href="/services/build-a-team" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Build a Team
                  </Link>
                </li>
                <li>
                  <Link href="/services/create-workforce" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Create a Workforce
                  </Link>
                </li>
                <li>
                  <Link href="/services/real-estate-virtual-assistant" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Real Estate Virtual Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/services/property-management-assistant" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Property Management Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/services/construction-virtual-assistant" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Construction Virtual Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/services/seo-virtual-assistant" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    SEO Virtual Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/services/ai-virtual-assistant" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    AI Virtual Assistant
                  </Link>
                </li>
              </ul>
            </div>

            {/* Main Pillars */}
            <div>
              <h3 className="text-md font-bold text-white mb-4 border-b border-lime-700 pb-2">Main Pillars</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/outsourcing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Outsourcing
                  </Link>
                </li>
                <li>
                  <Link href="/virtual-assistant" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Virtual Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/real-estate-outsourcing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Real Estate Outsourcing
                  </Link>
                </li>
                <li>
                  <Link href="/property-management-outsourcing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Property Management Outsourcing
                  </Link>
                </li>
                <li>
                  <Link href="/construction-outsourcing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Construction Outsourcing
                  </Link>
                </li>
                <li>
                  <Link href="/accounting-outsourcing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Accounting Outsourcing
                  </Link>
                </li>
                <li>
                  <Link href="/seo-outsourcing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    SEO Outsourcing
                  </Link>
                </li>
                <li>
                  <Link href="/architectural-outsourcing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Architectural Outsourcing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-md font-bold text-white mb-4 border-b border-lime-700 pb-2">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/we-got-talent" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Our Company
                  </Link>
                </li>
                <li>
                  <Link href="/about#ceo" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Stephen Atcheler - CEO
                  </Link>
                </li>
                <li>
                  <Link href="/about#location" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Find Us in Clark
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Blog & Articles
                  </Link>
                </li>
                <li>
                  <Link href="/service-guide" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Complete Service Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-md font-bold text-white mb-4 border-b border-lime-700 pb-2">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Pricing Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/sales" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Sales Page
                  </Link>
                </li>
                <li>
                  <Link href="/candidates" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Window Shop - Candidates
                  </Link>
                </li>
                <li>
                  <Link href="/demos" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Our Agents Demos
                  </Link>
                </li>
                <li>
                  <Link href="/service-guide" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Complete Service Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Blog & Articles
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-lime-300 transition-colors duration-200">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-lime-700 bg-lime-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-300">
              <div>© {currentYear} Shore Agents. All rights reserved.</div>
              <div>Professional Filipino Staff Leasing | Clark, Philippines</div>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                href="/sitemap" 
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
              >
                Sitemap
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-300 hover:text-lime-300 transition-colors duration-200"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
