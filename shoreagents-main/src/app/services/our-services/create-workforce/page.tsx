"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, Download, Check, Shield, DollarSign, Clock, Zap, Users, Star } from 'lucide-react';
import { SideNav } from '@/components/layout/SideNav';
import { useCurrency } from '@/lib/currencyContext';

export default function CreateWorkforcePage() {
  const router = useRouter();
  const { convertPrice, formatPrice } = useCurrency();

  const handleBookWorkforcePlanning = () => {
    router.push('/gettingstart');
  };

  const handleDownloadWorkforceGuide = () => {
    // Add download functionality here
    console.log('Download workforce guide');
  };

  const handleBuildTeamFirst = () => {
    router.push('/services/our-services/build-a-team');
  };

  const handleStartConservative = () => {
    router.push('/services/our-services/hire-one-agent');
  };

  return (
    <>
      <SideNav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Hero Section */}
        <div className="flex items-center justify-center py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Banner */}
            <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-lg text-sm font-medium text-green-800 mb-8">
              <Building className="w-4 h-4 mr-2" />
              MINIMUM 10 PEOPLE | PRIVATE OFFICE REQUIRED
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create Your{" "}
              <span className="text-lime-600">Filipino Workforce</span>
            </h1>

            {/* Sub-headline */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
              10+ People, Private Office, Unlimited Potential
            </h2>

            {/* Tagline */}
            <p className="text-xl text-gray-700 mb-6">
              When You're Ready to Build Something Big
            </p>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
              At 10+ people, you're not just hiring staff - you're creating a workforce. This requires your own private office space, team management systems, and infrastructure to support serious scale.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleBookWorkforcePlanning}
                variant="default"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                Book Workforce Planning Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={handleDownloadWorkforceGuide}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white"
              >
                Download Workforce Guide
                <Download className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* CEO Story Section */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
              From 14 Salespeople to Supporting Serious Scale
            </h2>
            
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-8 lg:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                When I had 14 salespeople and 400 rentals, I thought that was big. Now we help companies build teams of 50, 100, even more. What I've learned: <strong>scaling requires different thinking.</strong>
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At 1-5 people, you can manage individually. At 10+ people, you need systems, office space, team leaders, and workflows that work without your constant oversight.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>The companies that succeed at scale do three things differently:</strong>
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-700">
                    <strong>They have their own office space</strong> - Teams need to work side by side
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-700">
                    <strong>They rotate staff strategically</strong> - Mix of office, hybrid, and WFH based on role needs
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-700">
                    <strong>They treat it like building a real business</strong> - Not just "hiring VAs"
                  </span>
                </li>
              </ul>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                That's why our workforce model requires minimum 10 people and a private office. Because at this scale, you're not hiring assistants - <strong>you're building a subsidiary of your business.</strong>
              </p>
              
              <div className="text-center text-lime-700 font-medium">
                - Stephen Atcheler, CEO Shore Agents
              </div>
            </div>
          </div>
        </div>

        {/* Office Advantages Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
              Your Private Office Space Advantages
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Unlimited Staff Rotation */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <Users className="w-8 h-8 text-lime-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Unlimited Staff Rotation</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">50 employees can share 25 office seats</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Mix office days with WFH based on role needs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Meeting rooms for team collaboration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Training spaces for onboarding new hires</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Complete Control */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Complete Control</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">YOUR space, YOUR rules, YOUR branding</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Set your own office policies and culture</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Control access and security protocols</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Design workspace layout to fit your needs</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Cost Efficiency at Scale */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Cost Efficiency at Scale</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-700 mb-2">Private Office (100sqm = 25 seats)</p>
                    <p className="text-2xl font-bold text-orange-600">{formatPrice(convertPrice(3765))}/month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 mb-2">25 Dedicated Desks Alternative</p>
                    <p className="text-lg text-gray-500 line-through">{formatPrice(convertPrice(7207))}/month</p>
                  </div>
                  <div className="bg-lime-100 border border-lime-300 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-700 mb-1">Monthly Savings</p>
                    <p className="text-xl font-bold text-lime-600">{formatPrice(convertPrice(3442))} (48%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workforce Structure Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
              Workforce Structure Options
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Departmental Approach */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex items-center mb-6">
                  <Building className="w-8 h-8 text-lime-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Departmental Approach</h3>
                </div>
                <ul className="space-y-3">
                  <li className="text-gray-700">Customer Service Team (8-12 people, mostly office-based)</li>
                  <li className="text-gray-700">Accounting Department (6-10 people, hybrid schedule)</li>
                  <li className="text-gray-700">Marketing Team (5-8 people, flexible WFH/office)</li>
                  <li className="text-gray-700">Development Team (4-6 people, primarily WFH)</li>
                  <li className="text-gray-700">Management Layer (2-3 people, office-based)</li>
                </ul>
              </div>

              {/* Card 2: Shift-Based Operations */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Shift-Based Operations</h3>
                </div>
                <ul className="space-y-3">
                  <li className="text-gray-700">24/7 customer support coverage</li>
                  <li className="text-gray-700">Day shift: Office collaboration (AU/NZ hours)</li>
                  <li className="text-gray-700">Night shift: WFH flexibility (US/UK hours)</li>
                  <li className="text-gray-700">Overlap periods: Office meetings and training</li>
                </ul>
              </div>

              {/* Card 3: Project-Based Teams */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex items-center mb-6">
                  <Zap className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Project-Based Teams</h3>
                </div>
                <ul className="space-y-3">
                  <li className="text-gray-700">Rotating teams for different client projects</li>
                  <li className="text-gray-700">Office space for collaboration periods</li>
                  <li className="text-gray-700">WFH for individual contribution work</li>
                  <li className="text-gray-700">Meeting spaces for client presentations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Real Workforce Examples Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
              Real Workforce Examples
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Card 1: BoxBrownie PropTech */}
              <div className="bg-lime-50 border border-lime-300 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  BoxBrownie PropTech (2 to 16 Team)
                </h3>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Global Reach: 170,000+ customers across 117 countries</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Growth: 2 to 16 team members in 18 months</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Model: Mixed WFH and office for global coverage</span>
                  </li>
                </ul>
                
                <div className="bg-lime-100 border border-lime-300 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 italic mb-2">
                    "The whole outsourcing process at ShoreAgents has been amazing—starting from recruitment to processing, onboarding, HR, and everything in between."
                  </p>
                  <p className="text-gray-700">
                    - <strong>Tash Poole</strong>, Customer Service Manager
                  </p>
                </div>
                
                <p className="text-lime-600 font-semibold">
                  8x team expansion supporting global PropTech operations
                </p>
              </div>

              {/* Card 2: Ballast Property Management */}
              <div className="bg-lime-50 border border-lime-300 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Ballast Property Management (4 to 46 Specialists)
                </h3>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Industry: USA Property Management</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Scaling: From 4 to 46 specialists across departments</span>
                  </li>
                </ul>
                
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-700">• Leasing Department (13 specialists)</li>
                  <li className="text-gray-700">• Communications Team (8 specialists)</li>
                  <li className="text-gray-700">• Financial Operations (8 specialists)</li>
                  <li className="text-gray-700">• Specialized Roles (17 specialists)</li>
                </ul>
                
                <div className="bg-lime-100 border border-lime-300 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 italic mb-2">
                    "We've used multiple Outsourcing companies and ShoreAgents has surpassed our expectations by far."
                  </p>
                  <p className="text-gray-700">
                    - <strong>Kuahiwi Kahapea</strong>, Ballast
                  </p>
                </div>
                
                <p className="text-lime-600 font-semibold">
                  100% migration from previous providers, complete enterprise operation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workforce Investment Examples Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
              Workforce Investment Examples
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: 25-Person Workforce */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">25-Person Workforce</h3>
                <p className="text-gray-700 mb-4">100sqm office space</p>
                
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700">Office lease: {formatPrice(convertPrice(3765))}/month</p>
                  <p className="text-gray-700">Staff costs (25 x {formatPrice(convertPrice(991))}): {formatPrice(convertPrice(24775))}/month</p>
                  <p className="text-gray-700">Setup costs: {formatPrice(convertPrice(13514))} upfront</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-bold text-lime-600">Total Monthly: {formatPrice(convertPrice(28540))}</p>
                  <p className="text-lg font-bold text-blue-600">Total Upfront: {formatPrice(convertPrice(24809))}</p>
                </div>
              </div>

              {/* Card 2: 50-Person Workforce */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">50-Person Workforce</h3>
                <p className="text-gray-700 mb-4">150sqm office space</p>
                
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700">Office lease: {formatPrice(convertPrice(5648))}/month</p>
                  <p className="text-gray-700">Staff costs (50 x {formatPrice(convertPrice(991))}): {formatPrice(convertPrice(49550))}/month</p>
                  <p className="text-gray-700">Setup costs: {formatPrice(convertPrice(27027))} upfront</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-bold text-blue-600">Total Monthly: {formatPrice(convertPrice(55198))}</p>
                  <p className="text-lg font-bold text-blue-600">Total Upfront: {formatPrice(convertPrice(43964))}</p>
                </div>
              </div>

              {/* Card 3: 100-Person Workforce */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">100-Person Workforce</h3>
                <p className="text-gray-700 mb-4">250sqm office space</p>
                
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700">Office lease: {formatPrice(convertPrice(9414))}/month</p>
                  <p className="text-gray-700">Staff costs (100 x {formatPrice(convertPrice(991))}): {formatPrice(convertPrice(99100))}/month</p>
                  <p className="text-gray-700">Setup costs: {formatPrice(convertPrice(54054))} upfront</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-bold text-orange-600">Total Monthly: {formatPrice(convertPrice(108514))}</p>
                  <p className="text-lg font-bold text-orange-600">Total Upfront: {formatPrice(convertPrice(82252))}</p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-gray-600 mt-8">
              *Costs include all staff, benefits, office space, equipment, and management
            </p>
          </div>
        </div>

        {/* Ready to Create Your Workforce Section */}
        <div className="py-16 bg-lime-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
              Ready to Create Your Workforce?
            </h2>
            
            <div className="bg-lime-100 border border-lime-300 rounded-xl p-8 lg:p-12 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                <strong>This isn't for everyone.</strong> Workforce creation requires serious commitment, proper management, and significant investment. But for companies ready to scale, it's the most cost-effective way to build a substantial operation.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* What You Get */}
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What You Get:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Your own private office space in Clark</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Unlimited staff rotation flexibility</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Complete recruitment and HR management</span>
                    </li>
                  </ul>
                </div>
                
                {/* Minimum Requirements */}
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Minimum Requirements:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">10+ employees needed</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">12-month office commitment</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{formatPrice(convertPrice(36036))}+ monthly budget</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                onClick={handleBuildTeamFirst}
                variant="default"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                Build a Team First
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={handleStartConservative}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white"
              >
                Start Conservative
              </Button>
            </div>
            
            {/* Quote */}
            <div className="text-center">
              <p className="text-xl italic text-gray-700 mb-2">
                "At 10+ people, you're not hiring assistants - you're building a subsidiary of your business."
              </p>
              <p className="text-lime-600 font-medium">- Stephen Atcheler</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
