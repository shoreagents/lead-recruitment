"use client";

import { Button } from "@/components/ui/button";
import { PricingCalculatorModal } from "@/components/ui/pricing-calculator-modal";
import { useCurrency } from "@/lib/currencyContext";
import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";

export default function HireOneAgentPage() {
  const [selectedTier, setSelectedTier] = useState("entry");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const { convertPrice, formatPrice } = useCurrency();

  // Pricing data in USD (base currency)
  const pricingData = {
    entry: {
      salary: 25000,
      multiplier: 1.43,
      benefits: 2925 + (25000 * 0.10) + (25000 * 0.025) + (25000 * 0.02), // HMO + SSS + PhilHealth + PagIBIG
      usdPrice: 741
    },
    mid: {
      salary: 40000,
      multiplier: 1.33,
      benefits: 2925 + (40000 * 0.10) + (40000 * 0.025) + (10000 * 0.02), // HMO + SSS + PhilHealth + PagIBIG (capped at 10k)
      usdPrice: 1060
    },
    senior: {
      salary: 100000,
      multiplier: 1.25,
      benefits: 2925 + (35000 * 0.10) + (100000 * 0.025) + (10000 * 0.02), // HMO + SSS (capped at 35k) + PhilHealth + PagIBIG (capped at 10k)
      usdPrice: 2370
    }
  };

  // Get formatted price for display
  const getFormattedPrice = (usdPrice: number) => {
    const convertedPrice = convertPrice(usdPrice);
    return formatPrice(convertedPrice);
  };

  return (
    <>
    <SideNav />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lime-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Start Conservative Badge */}
          <div className="inline-flex items-center gap-2 bg-lime-100 border border-lime-300 rounded-full px-4 py-2 mb-8">
            <div className="w-5 h-5 bg-lime-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lime-700 font-semibold text-sm uppercase tracking-wide">
              Start Conservative
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Hire Your First{" "}
            <span className="text-lime-600">Filipino Agent</span>
          </h1>

          {/* Quote */}
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "Start conservative - that's what I should have done instead of hiring 5 at once!"
          </blockquote>
          <p className="text-lime-600 italic font-medium">
            - Stephen Atcheler, CEO Shore Agents
          </p>

          {/* Description */}
          <p className="text-lg text-gray-700 mt-8 max-w-2xl mx-auto leading-relaxed">
            Perfect for first-time outsourcers and small businesses. Test the waters with one skilled professional before scaling up. No massive commitments, just proven results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button variant="default" size="lg" className="text-lg px-8 py-4">
              Start with One Agent
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-lime-600 text-lime-600 hover:bg-lime-50">
              See Exact Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Transparent Entry-Level Pricing
          </h2>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            {/* Pricing Tiers */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Entry Level */}
              <div 
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTier === "entry" 
                    ? "border-lime-400 bg-lime-50" 
                    : "border-gray-200 hover:border-lime-300"
                }`}
                onClick={() => setSelectedTier("entry")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">Entry Level Agent</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {getFormattedPrice(pricingData.entry.usdPrice)}
                </div>
                <p className="text-gray-600 text-sm">₱{pricingData.entry.salary.toLocaleString()} salary x {pricingData.entry.multiplier} + benefits</p>
              </div>

              {/* Mid Level */}
              <div 
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTier === "mid" 
                    ? "border-lime-400 bg-lime-50" 
                    : "border-gray-200 hover:border-lime-300"
                }`}
                onClick={() => setSelectedTier("mid")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mid-Level Agent</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {getFormattedPrice(pricingData.mid.usdPrice)}
                </div>
                <p className="text-gray-600 text-sm">₱{pricingData.mid.salary.toLocaleString()} salary x {pricingData.mid.multiplier} + benefits</p>
              </div>

              {/* Senior Level */}
              <div 
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTier === "senior" 
                    ? "border-lime-400 bg-lime-50" 
                    : "border-gray-200 hover:border-lime-300"
                }`}
                onClick={() => setSelectedTier("senior")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">Senior Agent</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {getFormattedPrice(pricingData.senior.usdPrice)}
                </div>
                <p className="text-gray-600 text-sm">₱{pricingData.senior.salary.toLocaleString()} salary x {pricingData.senior.multiplier} + benefits</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">No hidden fees</span>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Benefits at exact cost</span>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Office-based professionals</span>
              </div>
            </div>

            {/* CTA Link */}
            <div className="text-center">
              <button 
                onClick={() => setIsPricingModalOpen(true)}
                className="text-lime-600 hover:text-lime-700 font-medium flex items-center gap-2 mx-auto hover:underline cursor-pointer"
              >
                Use our pricing calculator
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            What You Get with One Agent
          </h2>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Office-Based Professional */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Office-Based Professional</h3>
              <p className="text-gray-600">Dedicated workspace in our Clark office with professional infrastructure and security.</p>
            </div>

            {/* Your Timezone */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Your Timezone</h3>
              <p className="text-gray-600">Flexible scheduling to match your business hours, whether you're in Australia, US, or UK.</p>
            </div>

            {/* University Educated */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">University Educated</h3>
              <p className="text-gray-600">English-speaking professionals with relevant qualifications and experience.</p>
            </div>

            {/* No Setup Hassles */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Setup Hassles</h3>
              <p className="text-gray-600">We handle equipment, internet, backup power, and all administrative requirements.</p>
            </div>

            {/* Ongoing Support */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ongoing Support</h3>
              <p className="text-gray-600">Direct access to Stephen and the Shore Agents team for guidance and support.</p>
            </div>

            {/* Transparent Costs */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Costs</h3>
              <p className="text-gray-600">Clear multiplier system with benefits at exact cost. No surprises, no hidden fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Success Stories from One Agent Starts
          </h2>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-lime-100 rounded-lg p-6">
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "Should have done this years ago. My agent has become an integral part of the team."
              </blockquote>
              <p className="font-bold text-gray-900">Luke Newton</p>
              <p className="text-gray-600">LockedOn Real Estate</p>
            </div>

            <div className="bg-lime-100 rounded-lg p-6">
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "She's become part of the family. Best decision we made for our business."
              </blockquote>
              <p className="font-bold text-gray-900">Phil Knight</p>
              <p className="text-gray-600">Real Estate Professional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start with One Agent?
          </h2>
          <p className="text-lg text-gray-700 mb-10">
            Book a free consultation and let's find the perfect professional for your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-lime-500 to-lime-600">
              Book Free Consultation
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-lime-300 text-gray-700 hover:bg-lime-50"
              onClick={() => setIsPricingModalOpen(true)}
            >
              Calculate Exact Costs
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Modal */}
      <PricingCalculatorModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
    </div>
    </>
  );
}
