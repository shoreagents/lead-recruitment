import { SideNav } from "@/components/layout/SideNav";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Check } from "lucide-react";

export default function VirtualAssistantsPage() {
  const digitalMarketingServices = [
    {
      title: "AI Virtual Assistant",
      href: "/services/pillars/ai-virtual-assistant"
    },
    {
      title: "SEO Virtual Assistant",
      href: "/services/pillars/seo-virtual-assistant"
    },
    {
      title: "Marketing Virtual Assistant",
      href: "/services/our-services/marketing-team"
    },
    {
      title: "Graphic Design VA",
      href: "/services/pillars/graphic-design-outsourcing"
    },
    {
      title: "Social Media VA",
      href: "/services/pillars/social-media-virtual-assistant"
    },
    {
      title: "Content Writing VA",
      href: "/services/pillars/technical-digital"
    }
  ];

  const technicalAdminServices = [
    {
      title: "Architect Virtual Assistant",
      href: "/services/pillars/architectural-outsourcing"
    },
    {
      title: "Engineering Virtual Assistant",
      href: "/services/pillars/engineering-outsourcing"
    },
    {
      title: "Drafting Virtual Assistant",
      href: "/services/our-services/engineering-support"
    },
    {
      title: "Estimating Virtual Assistant",
      href: "/services/our-services/construction-team"
    },
    {
      title: "Administrative VA",
      href: "/services/our-services/administrative-assistant"
    },
    {
      title: "Accounting Virtual Assistant",
      href: "/services/pillars/accounting-outsourcing"
    },
    {
      title: "Bookkeeping Virtual Assistant",
      href: "/services/our-services/finance-accounting"
    }
  ];

  const industryServices = [
    {
      title: "Real Estate Virtual Assistant",
      description: "Lead follow-up, listing management, transaction coordination for property professionals.",
      icon: <Star className="w-5 h-5 text-lime-600" />,
      href: "/services/our-services/real-estate-virtual-assistant"
    },
    {
      title: "Property Management VA",
      description: "Tenant screening, maintenance coordination, rent collection for property managers.",
      href: "/services/pillars/property-management-outsourcing"
    },
    {
      title: "Construction VA",
      description: "Project coordination, vendor management, documentation for construction companies.",
      href: "/services/our-services/construction-team"
    },
    {
      title: "Insurance VA",
      description: "Claims support, policy administration, customer service for insurance agencies.",
      href: "/services/pillars/insurance-outsourcing"
    },
    {
      title: "Mortgage VA",
      description: "Lead processing, document collection, loan tracking for mortgage companies.",
      href: "/services/pillars/mortgage-outsourcing"
    },
    {
      title: "Legal VA",
      description: "Document preparation, client intake, case management for legal firms.",
      href: "/services/pillars/legal-outsourcing"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Beyond Basic VAs:</span>
            <span className="block">Building Your Offshore</span>
            <span className="block">Business Empire</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            From computer theft disasters to systematic success - so basically, I learned that virtual assistants aren't just task-doers, they're business builders when you do it right.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Find Your Perfect VA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              VA Success Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Container */}
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  From VA Disasters to AI-Powered Teams
                </h2>
                
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p>
                    The thing is, my first attempts at virtual assistants were pretty much terrible. Computer theft, grandmother's house with roosters interrupting calls, power outages killing productivity.
                  </p>
                  
                  <p>
                    However, I found that combining Filipino talent with proper infrastructure and AI tools like "Uncle Claude" created something special - teams that surpass traditional local hires.
                  </p>
                  
                  <p>
                    Now? Ballast went from 4 to 46 specialists and "surpassed expectations by far." That's what happens when you do virtual assistants right.
                  </p>
                </div>

                {/* Testimonial */}
                <div className="mt-8 bg-lime-50 rounded-xl p-6 border border-lime-200">
                  <p className="text-lime-800 italic text-lg mb-2">
                    "Anyone in real estate should reach out to Shore Agents"
                  </p>
                  <p className="text-lime-700 font-medium">
                    - Derek Gallimore, Outsource Accelerator
                  </p>
                </div>
              </div>

              {/* Right Cards */}
              <div className="space-y-6">
                {/* AI + Human Card */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">AI + Human</h3>
                      <p className="text-gray-600">Intelligence Combination</p>
                    </div>
                  </div>
                </div>

                {/* Specialists Card */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">46</h3>
                      <p className="text-gray-600">Specialists at Ballast</p>
                    </div>
                  </div>
                </div>

                {/* Volume Increase Card */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">25%</h3>
                      <p className="text-gray-600">Volume Increase (Bellarine)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Assistants That Actually Work Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Virtual Assistants That Actually Work in 2025
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            It's pretty cool how the combination of Filipino talent, AI tools, and proper infrastructure creates teams that outperform expensive local hires.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI-Enhanced Capabilities Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Enhanced Capabilities</h3>
              <p className="text-gray-700 leading-relaxed">
                Our VAs work with Uncle Claude, ChatGPT, and specialized tools to deliver results that traditional assistants simply can't match.
              </p>
            </div>

            {/* Office-Based Reliability Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-lime-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Office-Based Reliability</h3>
              <p className="text-gray-700 leading-relaxed">
                Clark office with backup power, redundant internet, and professional environment. No more home-based disruptions.
              </p>
            </div>

            {/* Staff Leasing Model Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Staff Leasing Model</h3>
              <p className="text-gray-700 leading-relaxed">
                We provide the talent and infrastructure. You handle training and management. Clear boundaries, better accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Virtual Assistants Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Industry-Specific Virtual Assistants
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Every industry has unique processes. Our VAs are trained in specific sectors to understand your business from day one.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {industryServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  {service.icon && service.icon}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <a 
                  href={service.href}
                  className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium transition-colors duration-200"
                >
                  Learn More
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          {/* View All Services Link */}
          <div className="text-center">
            <a 
              href="/services/our-services"
              className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium text-lg transition-colors duration-200"
            >
              View All Virtual Assistant Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Specialized Virtual Assistant Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Specialized Virtual Assistant Services
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              From AI-powered assistants to technical specialists - find the perfect match for your business needs.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Digital & Marketing VAs */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Digital & Marketing VAs</h3>
              <div className="space-y-4">
                {digitalMarketingServices.map((service, index) => (
                  <a 
                    key={index}
                    href={service.href}
                    className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-lime-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-lg font-medium text-gray-900">{service.title}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Technical & Administrative */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Technical & Administrative</h3>
              <div className="space-y-4">
                {technicalAdminServices.map((service, index) => (
                  <a 
                    key={index}
                    href={service.href}
                    className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-lime-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        index < 4 ? 'bg-lime-100' : 'bg-orange-100'
                      }`}>
                        <Check className={`w-5 h-5 ${
                          index < 4 ? 'text-lime-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <span className="text-lg font-medium text-gray-900">{service.title}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Build Your VA Dream Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-lime-600 to-lime-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Build Your VA Dream Team?
          </h2>
          
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            From one business owner to another - let's create a virtual assistant solution that actually works.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-lime-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white"
            >
              Find Your Perfect VA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="default" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              VA Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
