'use client';

import { SideNav } from "@/components/layout/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
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
  BookOpen,
  Star,
  Shield,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import Image from 'next/image';

export default function VirtualAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Blog</span>
            <ArrowRight className="w-4 h-4" />
            <span>Virtual Assistant</span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Real Estate Virtual Assistant</span>
          </nav>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="mb-6">
            <Badge className="bg-lime-600 text-white px-4 py-2 text-lg">
              💰 CRITICAL: 89% of Real Estate Businesses Overpay for Virtual Assistants
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Virtual Real Estate Assistant Pricing: 7 Countries Compared (Save 65% in 2025)
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mb-8">
            Understanding virtual real estate assistant pricing is crucial for cost-effective growth. Smart agencies save 60-78% while getting better quality through strategic partnerships.
          </p>
          
          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center space-x-3">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                alt="Stephen Atcheler"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">Stephen Atcheler</p>
                <p className="text-gray-600">Author</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>July 5, 2024</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Views: 4,221</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mb-12">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop"
              alt="Virtual real estate assistant pricing analysis on laptop with calculator showing cost comparison dashboard"
              width={1200}
              height={600}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Virtual Real Estate Assistant Pricing: Complete 2025 Guide
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Comprehensive pricing analysis, cost comparisons, and strategic guidance for real estate professionals
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center bg-lime-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-lime-600 mb-2">$14,300</div>
                  <p className="text-gray-700">Annual Cost (Philippines)</p>
                </div>
                <div className="text-center bg-red-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">$72,800</div>
                  <p className="text-gray-700">Annual Cost (USA Local)</p>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
                  <p className="text-gray-700">Cost Savings</p>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">160</div>
                  <p className="text-gray-700">Hours per Month</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700">
                Understanding virtual real estate assistant pricing is crucial for making informed decisions about growing your real estate business cost-effectively. With the digital transformation of real estate operations, virtual assistants have become essential team members for agencies worldwide.
              </p>
            </div>

            {/* Pricing Factors */}
            <div className="mb-12">
              <Card className="border-lime-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    What Determines Virtual Real Estate Assistant Pricing?
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Virtual real estate assistant pricing varies significantly based on several key factors. The rates depend heavily on experience level, specialized skill sets, and the complexity of real estate tasks they can handle. However, the most significant factor influencing cost is geographic location.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Countries like the Philippines offer substantially lower labor costs due to favorable economic conditions and lower living expenses compared to developed markets like the USA, Australia, and the UK. This economic advantage has made the Philippines a premier destination for real estate outsourcing services.
                  </p>
                  <div className="bg-lime-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-3">Cost Perspective:</h4>
                    <p className="text-gray-700">
                      The average annual salary for an entry-level virtual assistant in Australia is $60,091 AUD, while the equivalent role in the Philippines costs approximately $21,385 AUD. This means you could potentially hire three skilled team members for the cost of one local employee.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Country Comparison */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Virtual Real Estate Assistant Salary Comparison by Country
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                Let's analyze real estate virtual assistant rates across major markets to help you make an informed decision. The data below reflects comprehensive pricing from the Philippines, including all fees, benefits, and government obligations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Australia (Local)</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">$60,091 AUD</div>
                    <p className="text-gray-600">Annual Salary</p>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-lime-600 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Philippines (Remote)</h4>
                    <div className="text-2xl font-bold text-lime-600 mb-2">$21,385 AUD</div>
                    <p className="text-gray-600">Annual Salary</p>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Canada (Local)</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">$52,000 CAD</div>
                    <p className="text-gray-600">Annual Salary</p>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">USA (Local)</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">$45,000 USD</div>
                    <p className="text-gray-600">Annual Salary</p>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">United Kingdom (Local)</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">£28,000 GBP</div>
                    <p className="text-gray-600">Annual Salary</p>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">New Zealand (Local)</h4>
                    <div className="text-2xl font-bold text-red-600 mb-2">$55,000 NZD</div>
                    <p className="text-gray-600">Annual Salary</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* BPO vs Freelance Comparison */}
            <div className="mb-12">
              <Card className="border-lime-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    BPO Company vs Freelance Virtual Assistants: Complete Cost Analysis
                  </h3>
                  <p className="text-gray-700 mb-6">
                    When evaluating real estate virtual assistant companies, the Philippines consistently emerges as the optimal choice for cost-effectiveness and quality. The global freelance market has created pricing challenges, as freelancers now have access to international clients willing to pay premium rates.
                  </p>
                  <p className="text-gray-700 mb-8">
                    A critical consideration is commitment level. Full-time team members from ShoreAgents dedicate themselves exclusively to your business success. This contrasts sharply with freelancers who often juggle multiple clients simultaneously, potentially compromising focus and availability when you need them most.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-lime-50">
                          <th className="border border-gray-300 p-4 text-left font-bold">Comparison Factor</th>
                          <th className="border border-gray-300 p-4 text-left font-bold text-lime-600">ShoreAgents Virtual Assistants</th>
                          <th className="border border-gray-300 p-4 text-left font-bold text-red-600">Freelance Virtual Assistants</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-4 font-semibold">Monthly Cost</td>
                          <td className="border border-gray-300 p-4 text-lime-600 font-semibold">$1,191 USD</td>
                          <td className="border border-gray-300 p-4 text-red-600 font-semibold">$2,720+ USD</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-4 font-semibold">Commitment Level</td>
                          <td className="border border-gray-300 p-4 text-lime-600">Full-time dedicated</td>
                          <td className="border border-gray-300 p-4 text-red-600">Multiple clients</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-4 font-semibold">Recruitment Process</td>
                          <td className="border border-gray-300 p-4 text-lime-600">Handled by ShoreAgents</td>
                          <td className="border border-gray-300 p-4 text-red-600">Your responsibility</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-4 font-semibold">Infrastructure</td>
                          <td className="border border-gray-300 p-4 text-lime-600">Professional office setup</td>
                          <td className="border border-gray-300 p-4 text-red-600">Home-based (variable)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-4 font-semibold">Backup & Support</td>
                          <td className="border border-gray-300 p-4 text-lime-600">24/7 technical support</td>
                          <td className="border border-gray-300 p-4 text-red-600">Limited or none</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-4 font-semibold">Employee Benefits</td>
                          <td className="border border-gray-300 p-4 text-lime-600">Included in cost</td>
                          <td className="border border-gray-300 p-4 text-red-600">Additional expense</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-4 font-semibold">Quality Assurance</td>
                          <td className="border border-gray-300 p-4 text-lime-600">Ongoing monitoring</td>
                          <td className="border border-gray-300 p-4 text-red-600">Self-managed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Annual Investment Analysis */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Annual Investment Analysis for Virtual Assistant Services
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                For transparent cost comparison, local VAs in the USA typically charge around $35 USD per hour, resulting in estimated monthly costs of $8,400 USD. This excludes recruitment fees, which typically add 10-13% of annual salary costs.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-lime-50">
                      <th className="border border-gray-300 p-4 text-left font-bold">Country/Service</th>
                      <th className="border border-gray-300 p-4 text-left font-bold text-red-600">Local VA Annual Cost</th>
                      <th className="border border-gray-300 p-4 text-left font-bold text-yellow-600">Freelanced Philippines</th>
                      <th className="border border-gray-300 p-4 text-left font-bold text-lime-600">ShoreAgents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-4 font-semibold">United States</td>
                      <td className="border border-gray-300 p-4 text-red-600 font-semibold">$72,800 USD</td>
                      <td className="border border-gray-300 p-4 text-yellow-600 font-semibold">$32,640 USD</td>
                      <td className="border border-gray-300 p-4 text-lime-600 font-semibold">$14,300 USD</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-4 font-semibold">Australia</td>
                      <td className="border border-gray-300 p-4 text-red-600 font-semibold">$60,091 AUD</td>
                      <td className="border border-gray-300 p-4 text-yellow-600 font-semibold">$32,640 AUD</td>
                      <td className="border border-gray-300 p-4 text-lime-600 font-semibold">$21,385 AUD</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-4 font-semibold">Canada</td>
                      <td className="border border-gray-300 p-4 text-red-600 font-semibold">$52,000 CAD</td>
                      <td className="border border-gray-300 p-4 text-yellow-600 font-semibold">$35,880 CAD</td>
                      <td className="border border-gray-300 p-4 text-lime-600 font-semibold">$19,305 CAD</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-4 font-semibold">United Kingdom</td>
                      <td className="border border-gray-300 p-4 text-red-600 font-semibold">£28,000 GBP</td>
                      <td className="border border-gray-300 p-4 text-yellow-600 font-semibold">£26,208 GBP</td>
                      <td className="border border-gray-300 p-4 text-lime-600 font-semibold">£11,440 GBP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Membership Levels */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                ShoreAgents Membership Levels and Volume Discounts
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                For businesses requiring single team member solutions, we accommodate this need with transparent setup fees. We exclusively provide full-time real estate virtual assistants designed to accelerate your business objectives.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-lime-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-lime-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Bronze Membership</h4>
                    <p className="text-gray-600 mb-4">1-5 Team Members</p>
                    <p className="text-lime-600 font-semibold mb-4">Standard Rates Apply</p>
                    <p className="text-gray-700">Perfect for Small Teams</p>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200 border-2 border-lime-400">
                  <CardContent className="p-6 text-center">
                    <div className="bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">Most Popular</div>
                    <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-lime-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Silver Membership</h4>
                    <p className="text-gray-600 mb-4">6-15 Team Members</p>
                    <p className="text-lime-600 font-semibold mb-4">20% Discount</p>
                    <p className="text-gray-700">Growing Businesses</p>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-lime-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Gold Membership</h4>
                    <p className="text-gray-600 mb-4">16+ Team Members</p>
                    <p className="text-lime-600 font-semibold mb-4">30% Discount</p>
                    <p className="text-gray-700">Enterprise Solutions</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-12">
              <Card className="border-lime-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    What's Included in Your Monthly Investment
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Monthly costs vary according to roles and membership tiers. Philippine employment law requires 13th-month compensation, distributed annually in December. We calculate and include prorated portions in your monthly billing for transparency.
                  </p>
                  
                  <div className="bg-lime-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Complete Monthly Package Includes:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>Full-time dedicated virtual assistant (160 hours/month)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>Government benefits and compliance costs</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>Professional office infrastructure</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>Backup power and internet connectivity</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>Ongoing training and development</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>24/7 technical support</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>Quality assurance monitoring</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-lime-600 mr-3" />
                          <span>ShoreAgents membership benefits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions About Virtual Real Estate Assistant Pricing
              </h3>
              
              <div className="space-y-6">
                <Card className="border-lime-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      How much does a virtual real estate assistant cost per month?
                    </h4>
                    <p className="text-gray-700">
                      Virtual real estate assistant pricing varies by location and service model. ShoreAgents provides full-time virtual assistants starting at $1,191 USD per month, including all benefits and infrastructure costs. Local assistants typically cost $3,000-$6,000+ monthly.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      What factors affect virtual assistant pricing?
                    </h4>
                    <p className="text-gray-700">
                      Key factors include geographic location, experience level, specialized skills, full-time vs part-time commitment, and service model (direct hire vs BPO company). Location typically has the most significant impact on virtual real estate assistant pricing.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      Are there setup fees for virtual assistants?
                    </h4>
                    <p className="text-gray-700">
                      ShoreAgents charges a one-time setup fee that covers recruitment, screening, and onboarding processes. This investment ensures you receive a qualified, trained virtual assistant ready to contribute immediately to your business.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      How do volume discounts work?
                    </h4>
                    <p className="text-gray-700">
                      ShoreAgents offers tiered membership with volume discounts: Bronze (1-5 members), Silver (6-15 members, 20% discount), and Gold (16+ members, 30% discount). Larger teams achieve significant per-person cost savings.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-lime-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      What's included in the monthly cost?
                    </h4>
                    <p className="text-gray-700">
                      Monthly costs include your virtual assistant's salary, government benefits, professional office infrastructure, backup systems, ongoing training, quality assurance, and ShoreAgents membership benefits. No hidden fees or surprise charges.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Conclusion */}
            <div className="mb-12">
              <Card className="border-lime-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Making the Right Choice for Your Real Estate Business
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    This comprehensive analysis demonstrates the significant cost differences between local staff, offshore professionals, and freelance alternatives. Understanding these virtual real estate assistant pricing models empowers you to make strategic decisions that align with your real estate business objectives.
                  </p>
                  <p className="text-lg text-gray-700">
                    Virtual real estate assistant pricing offers compelling advantages compared to traditional staffing solutions. The combination of cost savings, professional quality, and dedicated support makes offshore virtual assistants a smart investment for growing real estate businesses.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* CTA Cards */}
              <Card className="border-lime-200">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-12 h-12 text-lime-600 mx-auto mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">🏠 Explore VA Solutions</h4>
                  <Button className="w-full bg-lime-600 hover:bg-lime-700 text-white">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-lime-200">
                <CardContent className="p-6 text-center">
                  <Calculator className="w-12 h-12 text-lime-600 mx-auto mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">💬 Get Pricing Quote</h4>
                  <Button variant="outline" className="w-full border-lime-600 text-lime-600 hover:bg-lime-50">
                    Calculate Cost
                  </Button>
                </CardContent>
              </Card>

              {/* Author Bio */}
              <Card className="border-lime-200">
                <CardContent className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4">About the Author</h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                      alt="Stephen Atcheler"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Stephen Atcheler</p>
                      <p className="text-gray-600 text-sm">Managing Director</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Meet Stephen Atcheler, the Managing Director of a Real Estate Virtual Assistant Company. Stephen has been working in the industry since 2013 and has a wealth of experience in making outsourcing work for real estate businesses.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                      Facebook
                    </Button>
                    <Button size="sm" variant="outline" className="border-lime-600 text-lime-600 hover:bg-lime-50">
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card className="border-lime-200">
                <CardContent className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Related Articles</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Image
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&h=60&fit=crop"
                        alt="Related article"
                        width={80}
                        height={60}
                        className="rounded"
                      />
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-1">
                          What Does a Real Estate Virtual Assistant Do?
                        </h5>
                        <p className="text-gray-600 text-xs">Discover 15+ Essential Tasks that Boost Efficiency</p>
                        <p className="text-gray-500 text-xs">March 9, 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










