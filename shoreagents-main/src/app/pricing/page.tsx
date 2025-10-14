"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { PricingCalculatorModal } from "@/components/ui/pricing-calculator-modal";
import { Calculator, Users, Building, Clock, DollarSign, ArrowRight, Star, CheckCircle, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
// import { useEngagementTracking } from "@/lib/useEngagementTracking"; // Removed - using GlobalEngagementTracker
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PricingPage() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  // const { recordInteraction } = useEngagementTracking(); // Removed - using GlobalEngagementTracker


  return (
    <div className="bg-lime-50">
      <SideNav />
      
      {/* Hero Section - Clean Shadcn Design */}
      <section className="min-h-screen py-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <Badge variant="secondary" className="bg-lime-100 text-lime-800 border-lime-300">
                <Zap className="w-4 h-4 mr-2" />
                AI-POWERED QUOTES
              </Badge>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                  Get Your Team{" "}
                  <span className="bg-gradient-to-r from-lime-600 to-lime-400 bg-clip-text text-transparent">
                    Pricing Quote
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  AI-powered role suggestions, industry-specific pricing, and transparent calculations. 
                  Get accurate quotes in 5 simple steps.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-lime-600" />
                  </div>
                  <span className="text-gray-700">AI suggests roles based on your industry</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-lime-600" />
                  </div>
                  <span className="text-gray-700">Industry-specific salary calculations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-lime-600" />
                  </div>
                  <span className="text-gray-700">No hidden fees, transparent pricing</span>
                </div>
              </div>

              <Button 
                size="lg"
                onClick={() => {
                  setIsCalculatorOpen(true);
                }}
                className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 text-lg"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get Quick Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Right Side - Pricing Calculator Image */}
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src="/2292.jpg"
                  alt="Hands using a calculator on a desk with papers and coffee, suggesting financial calculations or data entry"
                  className="w-full h-96 object-cover rounded-xl shadow-lg border border-lime-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border-lime-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-lime-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">4.9/5</h4>
                    <p className="text-sm text-gray-600">Client Rating</p>
                  </CardContent>
                </Card>
                <Card className="border-lime-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-lime-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">500+</h4>
                    <p className="text-sm text-gray-600">Teams Served</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our Pricing Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent, modular pricing that adapts to your specific needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* How It Works */}
            <Card className="border-lime-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-lime-600" />
                  </div>
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Configure Your Team</h4>
                    <p className="text-gray-600">
                      AI suggests roles based on your industry. Set experience levels and team size.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose Workspace</h4>
                    <p className="text-gray-600">
                      Select from Work From Home, Hybrid, or Full Office options.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Instant Pricing</h4>
                    <p className="text-gray-600">
                      See real-time calculations with industry-specific salary rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-lime-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-lime-600" />
                  </div>
                  <span>What's Included</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Staff Management</h4>
                    <p className="text-sm text-gray-600">Complete HR and payroll services</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Building className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Workspace Options</h4>
                    <p className="text-sm text-gray-600">Flexible office and remote solutions</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Benefits Calculation</h4>
                    <p className="text-sm text-gray-600">Government-mandated benefits included</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-lime-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Contract Flexibility</h4>
                    <p className="text-sm text-gray-600">Monthly or long-term commitments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Advantages Section */}
      <section className="py-16 bg-lime-50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Advantages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why choose Shore Agents for your team expansion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600">
                  Smart role suggestions and industry-specific pricing calculations
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent</h3>
                <p className="text-gray-600">
                  No hidden fees, clear pricing structure with industry-specific rates
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scalable</h3>
                <p className="text-gray-600">
                  Start small and scale up with flexible workspace and team options
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Setup</h3>
                <p className="text-gray-600">
                  Get your team up and running in 2-3 weeks with our streamlined process
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-lime-50 to-lime-100 border-lime-200">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get your personalized team pricing quote in just 5 steps. 
                AI-powered suggestions, industry-specific rates, and transparent calculations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => {
                    setIsCalculatorOpen(true);
                  }}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 text-lg"
                >
                  Get Quick Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-lime-600 text-lime-600 hover:bg-lime-50 px-8 py-4 text-lg"
                >
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Calculator Modal */}
      <PricingCalculatorModal 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
    </div>
  );
}
