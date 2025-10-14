"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Settings, BarChart3, Users, Award } from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";

export default function EngineeringSupportPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    return (
    <div className="min-h-screen bg-gray-50 pt-0">
      <SideNav />
      {/* Top Spacer to prevent content bleed */}
      <div className="h-0 w-full"></div>
      
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24 mt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-lime-600" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Engineering Virtual Assistant
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-gray-900">Engineering</span>{" "}
              <span className="text-lime-600">Excellence</span>
              <br />
              <span className="text-gray-900">Through Systematic Support</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Access university-qualified engineering VAs who bring technical accuracy and project understanding to complex engineering challenges at{" "}
              <span className="font-bold text-lime-600">$708/month all-inclusive.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="default" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
              >
                Get Engineering VA Support
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-lime-600 text-lime-600 hover:bg-lime-50 hover:border-lime-700 hover:text-lime-700 shadow-md hover:shadow-lg"
              >
                <Award className="mr-2 w-5 h-5" />
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Engineering Virtual Assistant Services
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              University-qualified engineers providing systematic support across structural, civil, mechanical, and electrical applications.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Structural Engineering */}
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6 mx-auto">
                <Shield className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Structural Engineering</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Structural calculations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Load analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Foundation design</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Steel & concrete design</span>
                </li>
              </ul>
            </div>

            {/* Civil Engineering */}
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6 mx-auto">
                <Settings className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Civil Engineering</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Site development</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Infrastructure planning</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Drainage design</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Transportation systems</span>
                </li>
              </ul>
            </div>

            {/* MEP Engineering */}
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6 mx-auto">
                <Zap className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">MEP Engineering</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">HVAC system design</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Electrical systems</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Plumbing design</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Energy analysis</span>
                </li>
              </ul>
            </div>

            {/* Technical Analysis */}
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6 mx-auto">
                <BarChart3 className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Technical Analysis</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">FEA analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Performance modeling</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Risk assessment</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Quality assurance</span>
                </li>
              </ul>
            </div>

            {/* Project Support */}
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6 mx-auto">
                <Users className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Project Support</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Technical documentation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Code compliance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Progress reporting</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Client communication</span>
                </li>
              </ul>
            </div>

            {/* Design Coordination */}
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6 mx-auto">
                <Award className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Design Coordination</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Multi-discipline coordination</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Drawing review</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Specification writing</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Quality control</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              Engineering Virtual Assistant Investment
            </h2>
          </div>

          {/* Investment Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Cost Metric */}
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">$708</div>
                <div className="text-gray-700">Per engineering VA/month</div>
              </div>
              
              {/* Capacity Metric */}
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">3x</div>
                <div className="text-gray-700">Project capacity increase</div>
              </div>
              
              {/* Accuracy Metric */}
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-lime-600 mb-2">99%</div>
                <div className="text-gray-700">Technical accuracy rate</div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                variant="default" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
              >
                Calculate Your Investment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-lime-600 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Scale Your Engineering Capacity?
              </h2>
              <p className="text-xl text-lime-100 mb-8">
                Join engineering firms who've tripled their project capacity while maintaining technical excellence.
              </p>
            </div>
            
            <div className="lg:flex-shrink-0 space-y-4 lg:space-y-0 lg:space-x-4 lg:flex lg:flex-row">
              <Button 
                variant="default"
                size="lg"
                className="w-full lg:w-auto px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-lime-600 shadow-lg hover:shadow-xl"
              >
                Start Partnership
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="w-full lg:w-auto px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-lime-600 shadow-lg hover:shadow-xl"
              >
                <Users className="mr-2 w-5 h-5" />
                View Success Stories
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
