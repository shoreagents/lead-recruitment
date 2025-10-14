'use client';

import { SideNav } from "@/components/layout/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Building2,
  Globe,
  Target,
  Zap,
  Award,
  Phone,
  Calculator,
  BookOpen
} from 'lucide-react';
import Image from 'next/image';

export default function OutsourcingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <Badge className="bg-lime-600 text-white px-4 py-2 text-lg">
              🚨 CRITICAL: Most Outsourcing Fails Because of Broken Models
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Outsourcing: The Ultimate Guide to Building Global Teams in 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            While smart companies use direct employment outsourcing to achieve <strong>60-78% cost savings</strong> with complete control, others get trapped by managed service markups, home-based chaos, and platform freelancer turnover. The difference between success and failure isn't luck—it's systematic approach.
          </p>
          
          {/* Hero Image */}
          <div className="relative mb-12">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop"
              alt="Modern business professionals in strategic meeting with world map overlay showing global outsourcing connections"
              width={1200}
              height={600}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 text-lg">
              Book a Strategy Call
            </Button>
            <Button size="lg" variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50 px-8 py-4 text-lg">
              How It Works
            </Button>
            <Button size="lg" variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50 px-8 py-4 text-lg">
              See Pricing
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Outsourcing: Ultimate 2025 Business Transformation Guide – 4.7★ Rated
            </h2>
            <p className="text-lg text-gray-600">
              From customer frustrations to systematic solutions: How direct employment outsourcing transformed 500+ businesses since 2019
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-yellow-500 mr-2" />
                <span className="text-3xl font-bold text-gray-900">4.7★</span>
              </div>
              <p className="text-gray-600">Rating from 1076+ Reviews</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-lime-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-gray-600">Successful Placements</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">60-78%</span>
              </div>
              <p className="text-gray-600">Cost Savings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">95%</span>
              </div>
              <p className="text-gray-600">Retention Rate</p>
            </div>
          </div>
        </div>

        {/* Founder Story */}
        <div className="mb-16">
          <Card className="border-lime-200">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why I Founded ShoreAgents in 2019: From Customer Frustration to Industry Solution
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  I'm Stephen Atcheler, and I founded ShoreAgents in 2019 after experiencing the customer side of outsourcing for four years. After 20 years in real estate—building and selling my own business Reval—I knew exactly what professional operations required. But every outsourcing provider I tried between 2015-2019 failed to deliver what businesses actually need.
                </p>
                <p className="mb-6">
                  The fundamental problem? Most BPO companies focus on their convenience, not yours. Managed services remove your control. Home-based workers lack professional infrastructure. Platform freelancers have no accountability. I decided to build the outsourcing company I wished existed when I desperately needed it.
                </p>
                <p className="mb-8">
                  Since founding ShoreAgents in 2019, we've completed <strong>500+ successful placements</strong> with a <strong>4.7★ rating from 1076+ verified client reviews</strong>. The direct employment model works because you maintain complete control while we provide professional infrastructure, legal compliance, and systematic support.
                </p>
              </div>
              
              <div className="bg-lime-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Success Metrics Since 2019:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                    <span>4.7★ average rating from 1076+ client reviews</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                    <span>500+ successful specialist placements</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                    <span>95% client retention rate</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                    <span>60-78% cost reduction vs local hiring</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                    <span>2-3 week implementation timeline</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                    <span>Professional office infrastructure (no home-based chaos)</span>
                  </div>
                </div>
              </div>
              
              <Button className="bg-lime-600 hover:bg-lime-700 text-white">
                Book Your Direct Employment Consultation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Real Client Transformations: Ballast & Gallery Group Success Stories
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ballast Story */}
            <Card className="border-lime-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ballast: From 4 Specialists to Complete Enterprise Migration
                </h3>
                <p className="text-gray-700 mb-6">
                  When Ballast approached ShoreAgents, they started conservatively with typical enterprise caution. As a major property management company, they already had outsourcing experience but needed superior solutions. The conversation began with: "We're talking about getting 4 people."
                </p>
                <p className="text-gray-700 mb-6">
                  What happened next validates systematic quality delivery. After implementing those initial 4 specialists, Ballast made a decision that defines enterprise confidence: <strong>they moved their entire operation to ShoreAgents</strong>, scaling to 46 specialists across multiple departments.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="italic text-gray-700 mb-2">
                    "We've used multiple outsourcing companies and ShoreAgents has surpassed our expectations by far. From the quality of candidates we receive to the ongoing support, and everything in between."
                  </p>
                  <p className="font-semibold text-gray-900">- Ballast Property Management, Enterprise Client</p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <h4 className="font-bold text-gray-900">The Growth That Says Everything:</h4>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-lime-600 mr-2" />
                    <span>Started: 4 test specialists</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-lime-600 mr-2" />
                    <span>Result: 46 specialists across complete operation</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-lime-600 mr-2" />
                    <span>Migration: 100% of outsourcing moved to ShoreAgents</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-lime-600 mr-2" />
                    <span>Duration: Multi-year partnership continuing today</span>
                  </div>
                </div>
                
                <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                  Read Complete Ballast Success Story
                </Button>
              </CardContent>
            </Card>

            {/* Gallery Group Story */}
            <Card className="border-lime-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Gallery Group: Multi-Year Partnership Through Mike's Business Tours
                </h3>
                <p className="text-gray-700 mb-6">
                  Mark from Gallery Group discovered ShoreAgents during Mike's Business Tours in the Philippines. As a Queensland construction and development company, they toured multiple BPO facilities looking for specialized talent who understood architectural design, project coordination, and Australian construction standards.
                </p>
                <p className="text-gray-700 mb-6">
                  Tour after tour, nothing impressed them. Then they visited ShoreAgents. <strong>"They were head and shoulders above the rest,"</strong> Gallery Group later reflected. The systematic approach to construction outsourcing and genuine industry expertise stood out immediately.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="italic text-gray-700 mb-2">
                    "We have been partners with ShoreAgents for years now and have a very good system going. We are very happy with ShoreAgents."
                  </p>
                  <p className="font-semibold text-gray-900">- Gallery Group, Queensland Construction & Development</p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <h4 className="font-bold text-gray-900">Recent Performance Excellence:</h4>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-600 mr-2" />
                    <span>Team members earning perfect 5/5 performance scores</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-600 mr-2" />
                    <span>Management recognition: "Outstanding quality work that exceeds expectations"</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-600 mr-2" />
                    <span>Salary increase recommendations for exceptional performance</span>
                  </div>
                </div>
                
                <Button variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                  Read Complete Gallery Group Success Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Direct Employment Model */}
        <div className="mb-16">
          <Card className="border-lime-200">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Revolutionary Direct Employment Outsourcing Model
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                After experiencing every failure mode personally, I designed a system that eliminates traditional outsourcing problems while maximizing benefits. The direct employment model gives you all advantages of direct hiring combined with professional infrastructure and legal simplicity.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How Direct Employment Outsourcing Actually Works</h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">You Hire Directly (Full Control)</h4>
                    <p className="text-gray-700">
                      Choose your specialist from our recruitment process. Interview them directly via video calls, assess cultural fit and technical skills, make the final hiring decision. They become YOUR employee working in OUR professional office environment. You have complete control over who works on your business.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">You Manage Daily Operations (No Middleman)</h4>
                    <p className="text-gray-700">
                      Direct communication via Slack, email, phone, or video calls. You assign tasks, set priorities, manage performance, and handle day-to-day direction. No account managers, no middleman markup, no communication delays. Your business processes, your standards, your timeline, your control.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">We Provide Professional Infrastructure (Enterprise-Grade)</h4>
                    <p className="text-gray-700">
                      Your specialist works in our Business Center 26 facility at Philexcel Business Park, Clark Freeport with enterprise equipment, 24/7 security, backup power systems, and professional HR support. They work in a professional environment while you maintain direct management control.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Legal and Administrative Simplicity (Zero Complications)</h4>
                    <p className="text-gray-700">
                      We handle all Philippines employment law compliance, tax obligations, statutory benefits, and HR administration. You get all benefits of direct employment without legal complications in your country. Simple service agreement, transparent costs, no hidden fees or surprise charges.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-lime-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Scalable Growth Path (From One to Enterprise)</h4>
                    <p className="text-gray-700">
                      Start with one specialist, expand to a complete team, or build an entire offshore workforce. Scale up or down based on business needs without contract penalties or minimum commitments.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Industry Specializations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Industry Specializations: Proven Expertise Across Multiple Sectors
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-4xl mx-auto">
            Direct employment outsourcing works across industries, but success requires specialized knowledge and industry-specific expertise. Our focus areas reflect documented success with verified client transformations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-lime-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="w-8 h-8 text-lime-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Real Estate & Property</h3>
                </div>
                <p className="text-gray-700 mb-4">60% of Business</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Real Estate Outsourcing</li>
                  <li>• Property Management Outsourcing</li>
                  <li>• Transaction Coordination</li>
                  <li>• Listing Management</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-lime-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-lime-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Construction & Professional</h3>
                </div>
                <p className="text-gray-700 mb-4">25% of Business</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Construction Outsourcing</li>
                  <li>• Architectural Outsourcing</li>
                  <li>• Engineering Outsourcing</li>
                  <li>• Project Coordination</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-lime-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 text-lime-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Professional Services</h3>
                </div>
                <p className="text-gray-700 mb-4">15% Expanding</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Legal Outsourcing</li>
                  <li>• Website Outsourcing</li>
                  <li>• SEO Outsourcing</li>
                  <li>• Financial Services</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="mb-16">
          <Card className="border-lime-200">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Complete Cost Analysis: Transparent Pricing with Zero Hidden Fees
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Unlike managed services with hidden markups or platforms with surprise charges, our pricing is completely transparent. Here's exactly what you invest and what's included, based on our current cost calculator (updated June 2025):
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <Card className="border-lime-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Entry Level Specialist</h3>
                    <div className="text-4xl font-bold text-lime-600 mb-4">$879</div>
                    <p className="text-gray-600 mb-4">USD monthly total</p>
                    <p className="text-gray-700 mb-6">All-inclusive pricing covering salary, benefits, facility, and management. Perfect for administrative tasks, basic coordination, and initial testing.</p>
                    <Button className="w-full bg-lime-600 hover:bg-lime-700 text-white">Get Started</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200 border-2 border-lime-400">
                  <CardContent className="p-6 text-center">
                    <div className="bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">Most Popular</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mid-Level Specialist</h3>
                    <div className="text-4xl font-bold text-lime-600 mb-4">$1,161</div>
                    <p className="text-gray-600 mb-4">USD monthly total</p>
                    <p className="text-gray-700 mb-6">Experienced professionals for complex tasks and specialized functions. Ideal for transaction coordination, project management, and technical work.</p>
                    <Button className="w-full bg-lime-600 hover:bg-lime-700 text-white">Most Popular</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Senior Specialist</h3>
                    <div className="text-4xl font-bold text-lime-600 mb-4">$1,443</div>
                    <p className="text-gray-600 mb-4">USD monthly total</p>
                    <p className="text-gray-700 mb-6">Expert-level professionals for leadership roles and complex operations. Perfect for team coordination, advanced technical work, and client interaction.</p>
                    <Button className="w-full bg-lime-600 hover:bg-lime-700 text-white">Scale Up</Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-lime-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included in Your Investment:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Complete Infrastructure:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Complete salary and all statutory benefits</li>
                      <li>• Professional office space with dedicated workstation</li>
                      <li>• Enterprise-grade equipment and dual monitors</li>
                      <li>• High-speed fiber internet with backup connectivity</li>
                      <li>• 24/7 security guards and biometric access</li>
                      <li>• Health insurance coverage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Management & Support Services:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Complete recruitment and screening process</li>
                      <li>• Direct employment relationship setup</li>
                      <li>• Ongoing performance monitoring</li>
                      <li>• Professional development programs</li>
                      <li>• 24/7 technical support</li>
                      <li>• Payroll processing and tax compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions: Direct Employment Outsourcing
          </h2>
          
          <div className="space-y-6">
            <Card className="border-lime-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  How much does outsourcing cost with ShoreAgents compared to other options?
                </h3>
                <p className="text-gray-700">
                  ShoreAgents specialists cost $879-1,443 USD monthly depending on experience level, providing 60-78% cost savings compared to local hiring. This includes complete salary, all statutory benefits, professional office infrastructure, enterprise equipment, and legal compliance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-lime-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  What's the fundamental difference between direct employment and managed services?
                </h3>
                <p className="text-gray-700">
                  Direct Employment (Our Model): You hire and manage your specialist directly—they're your employee working in our professional office. You have complete control over daily tasks, priorities, communication, and performance management. No middleman markup, no account managers, no communication delays.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-lime-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  How quickly can you implement outsourcing solutions?
                </h3>
                <p className="text-gray-700">
                  Standard Implementation: 3-4 weeks from consultation to fully productive team member. Rush Implementation: 2 weeks for urgent business needs. Enterprise Scaling: Multiple specialists implemented simultaneously for large-scale operations. Based on 500+ successful implementations since 2019 with 95% client retention rate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-lime-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business Operations?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join 500+ businesses who discovered that direct employment outsourcing actually works. The systematic approach that convinced Ballast to migrate their complete operation and enabled Gallery Group's multi-year partnership success is available for your business transformation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">$879-1,443</div>
              <p className="opacity-90">USD monthly per specialist</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">60-78%</div>
              <p className="opacity-90">Cost savings vs local hiring</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">2-3 weeks</div>
              <p className="opacity-90">Implementation timeline</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">4.7★</div>
              <p className="opacity-90">Client satisfaction rating</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Book Your Consultation Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-lime-600 px-8 py-4 text-lg">
              Calculate Your Savings
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-lime-600 px-8 py-4 text-lg">
              Learn Our Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}










