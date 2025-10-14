"use client";

import { 
  Star,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  FileText,
  Phone,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Wrench,
  Square
} from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";

export default function ConstructionOutsourcingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-ocean-50">
      <SideNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Column - Main Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                  <span className="text-gray-900">Gallery Group Success:</span>
                  <br />
                  <span className="text-energy-600">Multi-Year Construction</span>
                  <br />
                  <span className="text-energy-600">Outsourcing Partnership</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl">
                So basically, Iain Neilson from Gallery Group says we're "head and shoulders above the rest." 
                The thing is, construction outsourcing works when you understand both sides of the equation.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="btn-hover-effect bg-gradient-to-r from-lime-500 to-lime-600 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-lg flex items-center justify-center group">
                  Get Construction Quote 
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button className="btn-hover-effect bg-white border-2 border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold text-base hover:border-lime-300 hover:bg-lime-50 transition-all">
                  Gallery Group Case Study
                </button>
              </div>
            </div>

            {/* Right Column - Case Study Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-energy-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-energy-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Gallery Group Construction Partnership
                  </h3>
                </div>

                {/* Card Content */}
                <div className="space-y-4 mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    Iain Neilson from Gallery Group has been working with us for multiple years. His exact words: "head and shoulders above the rest."
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    However, I found that construction outsourcing requires a unique approach. It's not just about finding cheap labor - it's about guided expertise.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The thing is, Filipino teams have incredible technical skills, but they need proper guidance on local building codes, standards, and client expectations.
                  </p>
                </div>

                {/* Quote Box */}
                <div className="bg-energy-50 border-l-4 border-energy-500 p-4 rounded-r-lg mb-6">
                  <p className="text-energy-900 font-medium italic">
                    "Shore Agents are head and shoulders above the rest"
                  </p>
                  <p className="text-energy-600 font-semibold mt-2">
                    - Iain Neilson, Gallery Group Construction
                  </p>
                </div>

                {/* Key Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Multi-Year Metric */}
                  <div className="bg-lime-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-5 h-5 text-lime-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">Multi-Year</div>
                    <div className="text-sm text-gray-600">Partnership Duration</div>
                  </div>

                  {/* Specialized Teams Metric */}
                  <div className="bg-ocean-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-ocean-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">Specialized</div>
                    <div className="text-sm text-gray-600">Construction Teams</div>
                  </div>

                  {/* Proven Results Metric */}
                  <div className="bg-energy-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-energy-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-5 h-5 text-energy-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">Proven</div>
                    <div className="text-sm text-gray-600">Results & Authority</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Construction Tasks Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Construction Tasks Perfect for Outsourcing
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              From our multi-year partnership with Gallery Group, these are the construction tasks where Filipino teams excel with proper guidance and systems.
            </p>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1: Architectural Design Support */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-energy-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-energy-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Architectural Design Support</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-energy-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">CAD drafting and 3D modeling</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-energy-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Technical drawing preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-energy-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Design revision and documentation</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Project Coordination */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-ocean-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-ocean-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Project Coordination</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-ocean-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Subcontractor scheduling and tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-ocean-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Progress reporting and documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-ocean-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Timeline management and updates</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Cost Estimation & Takeoffs */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cost Estimation & Takeoffs</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Quantity takeoffs from plans</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Material cost calculations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Bid preparation and comparison</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Permit & Documentation */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-energy-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-energy-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Permit & Documentation</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-energy-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Permit application preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-energy-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Compliance documentation tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-energy-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Regulatory submission management</span>
                </li>
              </ul>
            </div>

            {/* Card 5: Vendor & Supplier Coordination */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-ocean-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-ocean-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Vendor & Supplier Coordination</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-ocean-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Supplier sourcing and verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-ocean-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Purchase order processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-ocean-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Delivery scheduling and tracking</span>
                </li>
              </ul>
            </div>

            {/* Card 6: Quality Control Support */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Quality Control Support</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Inspection checklist management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Quality documentation and photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Defect tracking and resolution</span>
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
              Construction Outsourcing Success Stories
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Real results from construction companies who've built successful outsourcing partnerships and transformed their operations.
            </p>
          </div>

          {/* Gallery Group Success Story Card */}
          <div className="bg-gradient-to-br from-energy-50 to-energy-100 rounded-xl shadow-lg p-6 lg:p-8 border border-energy-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-energy-600" />
              <h3 className="text-2xl font-bold text-gray-900">Gallery Group Construction</h3>
            </div>
            <div className="text-energy-600 font-semibold mb-4">Multi-Year Partnership Success</div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our multi-year partnership with Gallery Group demonstrates the power of combining Filipino technical expertise with local construction knowledge. Iain Neilson's team has consistently delivered exceptional results through systematic outsourcing.
            </p>
            
            {/* Quote Box */}
            <div className="bg-energy-100 border-l-4 border-energy-500 p-4 rounded-r-lg mb-6">
              <p className="text-energy-900 font-medium italic">
                "Shore Agents are head and shoulders above the rest. The level of technical skill and attention to detail from their teams consistently exceeds our expectations."
              </p>
            </div>

            {/* Key Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-energy-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-energy-600">Multi-Year</div>
                <div className="text-sm text-gray-600">Partnership</div>
              </div>
              <div className="bg-energy-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-energy-600">Premium</div>
                <div className="text-sm text-gray-600">Quality</div>
              </div>
              <div className="bg-energy-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-energy-600">Technical</div>
                <div className="text-sm text-gray-600">Excellence</div>
              </div>
              <div className="bg-energy-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-energy-600">Trusted</div>
                <div className="text-sm text-gray-600">Authority</div>
              </div>
            </div>
          </div>

          {/* Additional Success Stories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Card 1: Construction Project Management */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Construction Project Management</h3>
              <div className="text-ocean-600 font-semibold mb-2">Architectural Design Support</div>
              <div className="text-right mb-4">
                <div className="text-3xl font-bold text-ocean-600">50%</div>
                <div className="text-sm text-gray-600">Time Savings</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Reduced architectural design turnaround times by implementing systematic CAD drafting and 3D modeling processes with dedicated Filipino teams.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> CAD drafting, 3D modeling, technical documentation
              </div>
            </div>

            {/* Card 2: Commercial Building Contractor */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Commercial Building Contractor</h3>
              <div className="text-lime-600 font-semibold mb-2">Cost Estimation Excellence</div>
              <div className="text-right mb-4">
                <div className="text-3xl font-bold text-lime-600">30%</div>
                <div className="text-sm text-gray-600">Cost Reduction</div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Achieved significant cost savings in estimation processes while improving accuracy through systematic quantity takeoffs and bid preparation.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Key Services:</strong> Quantity takeoffs, cost estimation, bid preparation
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <a href="/case-studies" className="inline-flex items-center text-energy-600 hover:text-energy-700 font-semibold text-lg group">
              Read the Complete Gallery Group Case Study 
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Construction Outsourcing Actually Works Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Why Construction Outsourcing Actually Works
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              It's pretty cool how Filipino technical expertise combined with proper guidance creates results that are "head and shoulders above the rest."
            </p>
          </div>

          {/* Three Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Block 1: Technical Excellence */}
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-500 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" strokeWidth={3} fill="currentColor" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Technical Excellence
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Filipino engineers and architects bring world-class technical skills with attention to detail that exceeds local alternatives.
              </p>
            </div>

            {/* Block 2: Cost Efficiency */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg" style={{backgroundColor: '#3B82F6'}}>
                <Square className="w-8 h-8 text-white" strokeWidth={3} fill="currentColor" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Cost Efficiency
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Save 60-70% on technical staff costs while getting specialized construction expertise and dedicated project focus.
              </p>
            </div>

            {/* Block 3: Guided Partnership */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg" style={{backgroundColor: '#F97316'}}>
                <Building2 className="w-8 h-8 text-white" strokeWidth={3} fill="currentColor" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Guided Partnership
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The magic happens with proper guidance. Local knowledge combined with Filipino technical skills creates exceptional results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-lime-50 to-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Ready to Build Your Construction Outsourcing Partnership?
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join Iain Neilson and other successful construction professionals who've discovered the power of strategic outsourcing.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-hover-effect bg-gradient-to-r from-lime-500 to-lime-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg flex items-center justify-center group hover:shadow-xl transition-all">
              Get Your Construction Quote 
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button className="btn-hover-effect bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-lime-300 hover:bg-lime-50 transition-all shadow-lg">
              Gallery Group Case Study
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
