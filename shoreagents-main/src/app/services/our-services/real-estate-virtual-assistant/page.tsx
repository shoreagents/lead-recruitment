"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Calculator, Users, Home } from 'lucide-react'
import { SideNav } from '@/components/layout/SideNav'

export default function RealEstateVirtualAssistantPage() {
  const services = [
    {
      icon: <Calculator className="w-8 h-8 text-lime-600" />,
      title: "Transaction Coordination",
      items: [
        "Contract processing",
        "Document management",
        "Closing coordination",
        "Compliance tracking"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-lime-600" />,
      title: "Commission Management",
      items: [
        "Commission calculations",
        "Split management",
        "Payment processing",
        "Financial reporting"
      ]
    },
    {
      icon: <Home className="w-8 h-8 text-lime-600" />,
      title: "Listing Management",
      items: [
        "MLS updates",
        "Property descriptions",
        "Photo coordination",
        "Marketing materials"
      ]
    }
  ]

  return (
    <>
    <SideNav/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-lime-100 text-gray-700 px-4 py-2 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-semibold text-sm uppercase tracking-wide">REAL ESTATE VIRTUAL ASSISTANT</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">14 Salespeople, 400 Rentals:</span>
            <span className="block">
              The Real Estate{' '}
              <span className="text-lime-600">VA Blueprint</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            So basically, I built my real estate business using virtual assistants for everything from commission calculations to listing management. The thing is, real estate VAs work when they understand your actual business at{' '}
            <span className="font-bold">$385/month all-inclusive.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Real Estate VA Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-lime-500 text-lime-600 hover:bg-lime-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              View Success Stories
            </Button>
          </div>
        </div>
      </section>

             {/* Services Section */}
       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
         <div className="max-w-6xl mx-auto">
           {/* Services Header */}
           <div className="text-center mb-16">
             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
               Real Estate Virtual Assistant Services
             </h2>
             <p className="text-lg text-gray-700 max-w-3xl mx-auto">
               Industry expertise, proven processes, and AI-enhanced support for all your real estate operations.
             </p>
           </div>

           {/* Services Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {services.map((service, index) => (
               <div 
                 key={index}
                 className="bg-lime-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
               >
                 <div className="flex items-center mb-4">
                   <div className="mr-3">
                     {service.icon}
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">
                     {service.title}
                   </h3>
                 </div>
                 <ul className="space-y-2">
                   {service.items.map((item, itemIndex) => (
                     <li key={itemIndex} className="flex items-start">
                       <span className="text-lime-600 mr-2 mt-1">•</span>
                       <span className="text-gray-700">{item}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* Investment Section */}
       <section className="py-20 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto">
           {/* Investment Header */}
           <div className="text-center mb-12">
             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
               Real Estate Virtual Assistant Investment
             </h2>
           </div>

           {/* Investment Card */}
           <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
               {/* Cost Metric */}
               <div className="text-center">
                 <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                   $385
                 </div>
                 <div className="text-gray-600 text-sm md:text-base">
                   Per real estate VA/month
                 </div>
               </div>

               {/* Transaction Capacity Metric */}
               <div className="text-center">
                 <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                   3x
                 </div>
                 <div className="text-gray-600 text-sm md:text-base">
                   Transaction capacity increase
                 </div>
               </div>

               {/* Commission Increase Metric */}
               <div className="text-center">
                 <div className="text-4xl md:text-5xl font-bold text-lime-600 mb-2">
                   30%
                 </div>
                 <div className="text-gray-600 text-sm md:text-base">
                   Commission increase
                 </div>
               </div>
             </div>

             {/* CTA Button */}
             <div className="text-center">
               <Button 
                 size="lg" 
                 className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
               >
                 Calculate Your Investment
                 <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
             </div>
           </div>
         </div>
       </section>

       {/* Recommendations Engine Badge */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-sm font-medium">Recommendations Engine</span>
          <span className="bg-lime-500 text-white text-xs px-2 py-1 rounded-full font-medium">Live</span>
        </div>
      </div>
    </div>
    </>
  )
}
