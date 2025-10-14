"use client";

import { 
  AlertTriangle, 
  Building2, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  FileText, 
  Phone, 
  DollarSign, 
  Search, 
  Calculator,
  ArrowRight,
  GraduationCap,
  BarChart3
} from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";

export default function PropertyManagementOutsourcingPage() {
  return (
          <div className="min-h-screen bg-gradient-to-br from-lime-50 to-blue-50">
            <SideNav />
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full">
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
                          {/* Left Column - Main Content */}
              <div className="space-y-8 lg:space-y-10">
                              {/* Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    <span className="text-gray-900">The Receptionist-to-Property-</span>
                    <br />
                    <span className="text-lime-600">Manager Disaster</span>
                    <br />
                    <span className="text-lime-600">(And How to Do It Right)</span>
                  </h1>
                </div>

                              {/* Description */}
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
                  So basically, I learned the hard way that sending a receptionist to do property 
                  inspections was not a good idea. However, I found the right way to scale 
                  property management operations.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="btn-hover-effect bg-gradient-to-r from-lime-500 to-lime-600 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-lg flex items-center justify-center group">
                    Get Property Management Quote 
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <button className="btn-hover-effect bg-white border-2 border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold text-base hover:border-lime-300 hover:bg-lime-50 transition-all">
                    Property Management Success Stories
                  </button>
                </div>
            </div>

                          {/* Right Column - Case Study Card */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      The Receptionist Property Inspection Disaster
                    </h3>
                  </div>

                                  {/* Card Content */}
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      The thing is, when you're managing 400+ rental properties, you need systems that actually work. My biggest mistake? Thinking I could send the receptionist to do property inspections.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      That was not a good idea. No training, no systems, no understanding of what to look for. Pretty much terrible results across the board.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      However, I found that systematic property management outsourcing with properly trained teams changes everything. Now our property management clients handle 3x more properties with better results.
                    </p>
                  </div>

                  {/* Quote Box */}
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-6">
                    <p className="text-orange-900 font-medium italic">
                      "The lesson: Property management isn't just admin work. It requires specialized knowledge and systematic processes."
                    </p>
                  </div>

                                                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Properties Metric */}
                                     <div className="bg-lime-50 rounded-lg p-4 text-center">
                                        <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-5 h-5 text-lime-600" />
                    </div>
                     <div className="text-2xl font-bold text-gray-900">400+</div>
                     <div className="text-sm text-gray-600">Properties Under Management</div>
                   </div>

                                       {/* Volume Increase Metric */}
                                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                     <div className="text-2xl font-bold text-gray-900">3x</div>
                     <div className="text-sm text-gray-600">Property Volume Increase</div>
                   </div>

                    {/* Specialized Teams Metric */}
                                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                     <div className="text-2xl font-bold text-gray-900">Specialized</div>
                     <div className="text-sm text-gray-600">Property Management Teams</div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Management Tasks Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Property Management Tasks That Actually Work for Outsourcing
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              From managing 400+ rentals, these are the specific tasks where Filipino teams excel - with proper training and systems in place.
            </p>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1: Tenant Screening & Applications */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                   <Users className="w-5 h-5 text-lime-600" />
                 </div>
                <h3 className="text-lg font-bold text-gray-900">Tenant Screening & Applications</h3>
              </div>
              <ul className="space-y-3">
                                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Credit checks and background verification</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Employment and income verification</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Reference checks with previous landlords</span>
                 </li>
              </ul>
            </div>

            {/* Card 2: Lease Administration */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Lease Administration</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Lease renewal processing and tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Rent review and increase calculations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Lease documentation and filing</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Maintenance Coordination */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                   <Phone className="w-5 h-5 text-purple-600" />
                 </div>
                <h3 className="text-lg font-bold text-gray-900">Maintenance Coordination</h3>
              </div>
              <ul className="space-y-3">
                                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Tenant maintenance request processing</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Contractor scheduling and follow-up</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Maintenance tracking and reporting</span>
                 </li>
              </ul>
            </div>

            {/* Card 4: Rent Collection & Arrears */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                   <DollarSign className="w-5 h-5 text-blue-600" />
                 </div>
                <h3 className="text-lg font-bold text-gray-900">Rent Collection & Arrears</h3>
              </div>
              <ul className="space-y-3">
                                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Automated rent reminder systems</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Late payment follow-up and documentation</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-600">Payment processing and reconciliation</span>
                 </li>
              </ul>
            </div>

            {/* Card 5: Inspection Coordination */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Inspection Coordination</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Inspection scheduling with tenants</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Report compilation and distribution</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Follow-up action tracking</span>
                </li>
              </ul>
            </div>

            {/* Card 6: Financial Administration */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                   <Calculator className="w-5 h-5 text-purple-600" />
                 </div>
                <h3 className="text-lg font-bold text-gray-900">Financial Administration</h3>
              </div>
              <ul className="space-y-3">
                                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Owner statement preparation</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Expense tracking and categorization</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                   <span className="text-gray-700">Tax documentation compilation</span>
                 </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Property Management Outsourcing Success Stories
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Real results from property management companies who transformed their operations through strategic outsourcing.
            </p>
          </div>

          {/* Success Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Card 1: Ballast Property Management */}
                         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-5 lg:p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ballast Property Management</h3>
              <div className="mb-4">
                                 <div className="text-4xl font-bold text-blue-600 mb-1">1150%</div>
                <div className="text-gray-600">Growth</div>
              </div>
                             <div className="text-blue-600 font-semibold mb-3">4 → 46 Specialists</div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Kuahiwi Kahapea's team went from 4 to 46 specialists and "surpassed expectations by far" by implementing systematic property management outsourcing across all operations.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Tenant management, maintenance coordination, rent collection, owner reporting
              </div>
            </div>

            {/* Card 2: Barry Plant Property Management */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Barry Plant Property Management</h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-lime-600 mb-1">100%</div>
                <div className="text-gray-600">Admin Relief</div>
              </div>
              <div className="text-lime-600 font-semibold mb-3">Full Back-Office Support</div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Transformed their property management operations by outsourcing tenant management, lease administration, and maintenance coordination to dedicated Filipino teams.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Lease management, tenant screening, administrative support
              </div>
            </div>

            {/* Card 3: Harcourts Dapto */}
            <div className="bg-white rounded-xl shadow-lg p-5 lg:p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Harcourts Dapto</h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-purple-600 mb-1">5+</div>
                <div className="text-gray-600">Years</div>
              </div>
                             <div className="text-purple-600 font-semibold mb-3">Long-term Partnership</div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Built a long-term partnership with specialized property management support, focusing on systematic processes and consistent service delivery.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Comprehensive property management support, tenant relations
              </div>
            </div>

            {/* Card 4: Professionals McDowell */}
            <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl shadow-lg p-5 lg:p-6 border border-lime-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Professionals McDowell</h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-lime-600 mb-1">2x</div>
                <div className="text-gray-600">Capacity</div>
              </div>
              <div className="text-lime-600 font-semibold mb-3">Portfolio Growth</div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Doubled their property management capacity by implementing systematic outsourcing for tenant management, maintenance coordination, and administrative tasks.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Tenant management, maintenance tracking, portfolio administration
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
                         <a href="/case-studies" className="inline-flex items-center text-lime-600 hover:text-lime-700 font-semibold text-lg group">
              View All Property Management Case Studies 
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Property Management Outsourcing Actually Works Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Why Property Management Outsourcing Actually Works
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              It's pretty cool how dedicated property management teams with proper training and systems deliver better results than ad-hoc local solutions.
            </p>
          </div>

          {/* Three Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Block 1: Cost Efficiency */}
            <div className="text-center">
                             <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                 <DollarSign className="w-7 h-7 text-white" strokeWidth={2} />
               </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">
                Cost Efficiency
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Save 60-70% on property management staff costs while getting specialized expertise and dedicated focus on your portfolio.
              </p>
            </div>

            {/* Block 2: Specialized Training */}
            <div className="text-center">
              <div className="w-14 h-14 bg-lime-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">
                Specialized Training
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Teams trained specifically in property management processes, tenant relations, and local compliance requirements.
              </p>
            </div>

            {/* Block 3: Scalable Operations */}
      <div className="text-center">
                             <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                 <BarChart3 className="w-7 h-7 text-white" strokeWidth={2} />
               </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">
                Scalable Operations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Handle portfolio growth without hiring headaches. Scale your team up or down based on property acquisition and disposal cycles.
        </p>
      </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
             <section className="py-16 lg:py-24 bg-lime-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
            Ready to Scale Your Property Management Operations?
          </h2>
                     <p className="text-lg lg:text-xl text-lime-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            From one property professional to another - let's build systems that actually work.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <button className="btn-hover-effect bg-white text-lime-600 px-6 py-3 rounded-lg font-semibold text-base shadow-lg flex items-center justify-center group">
              Get Your Property Management Quote 
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            
                         <button className="btn-hover-effect bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-white hover:text-lime-600 transition-all">
              See Success Stories
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
