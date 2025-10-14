import { SideNav } from "@/components/layout/SideNav"

export default function TechnicalTeamsPage() {
  return (
    <>
    <SideNav />
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-ocean-50 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #84cc16 2px, #84cc16 4px)',
            backgroundSize: '100% 4px'
          }}></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-900 px-4 py-2 rounded-full mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h6v2H7v-2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">ARCHITECT VIRTUAL ASSISTANT</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              <span className="text-lime-900">Professional</span>
              <br />
              <span className="text-lime-600">Architectural Support</span>
              <br />
              <span className="text-lime-900">For Complex Projects</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-lime-900 leading-relaxed max-w-3xl mx-auto mb-12">
              Scale your technical operations with dedicated VAs who combine technical competency with industry expertise - supporting complex projects from development to deployment at <strong>$620 /month all-inclusive.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
                Get Technical Team Support
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <button className="border-2 border-lime-600 bg-white text-lime-600 hover:bg-lime-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h6v2H7v-2z" clipRule="evenodd" />
                </svg>
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Section */}
            <div>
              <h2 className="text-4xl font-bold text-lime-900 mb-6">Why Technical Firms Choose Shore Agents</h2>
              <p className="text-lg text-lime-900 mb-8">
                Our technical VAs bring professional competency and industry expertise to support your most complex projects with quality assurance and team oversight.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lime-900 mb-2">Technical Competency</h3>
                    <p className="text-lime-900">Advanced technical skills, industry knowledge, and deep understanding of development standards and best practices.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lime-900 mb-2">Project Integration</h3>
                    <p className="text-lime-900">Seamless integration from concept to completion support, understanding the full technical development process.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lime-900 mb-2">Quality Assurance</h3>
                    <p className="text-lime-900">Professional standards maintenance with team oversight ensuring consistent quality across all projects.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Testimonial */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-lime-900 mb-6">Stephen's Technical Team Discovery</h3>
              <div className="space-y-4 text-lime-900">
                <p className="italic">&quot;The thing is, technical work demands precision that goes beyond basic VA skills. We needed people who understood both the technical and creative aspects.&quot;</p>
                <p className="italic">&quot;So basically, we developed specialized training for technical VAs who can handle complex development projects while maintaining professional standards. Pretty cool how they integrate with existing teams!&quot;</p>
                <p className="italic">&quot;Our technical team doubled their project capacity while maintaining code quality. Their clients never knew they were working with remote support.&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-lime-900 mb-4">Technical Team Virtual Assistant Services</h2>
            <p className="text-lg text-lime-900 max-w-3xl mx-auto">
              From development to project coordination, our technical VAs provide comprehensive support for technical practices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Cards */}
            {[
              {
                icon: "🏗️",
                title: "Development Support",
                services: ["Code development", "Testing assistance", "Debugging support", "Version control"]
              },
              {
                icon: "📋",
                title: "Documentation",
                services: ["Technical writing", "API documentation", "User guides", "Process documentation"]
              },
              {
                icon: "🤝",
                title: "Project Coordination",
                services: ["Team communication", "Stakeholder coordination", "Meeting support", "Project scheduling"]
              },
              {
                icon: "🛡️",
                title: "Quality Assurance",
                services: ["Code review", "Testing coordination", "Compliance checks", "Standards enforcement"]
              },
              {
                icon: "📊",
                title: "Analytics Support",
                services: ["Data analysis", "Reporting assistance", "Performance monitoring", "Metrics tracking"]
              },
              {
                icon: "⚙️",
                title: "Administrative Support",
                services: ["Project documentation", "Resource management", "Process optimization", "Team coordination"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-lime-900 mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="text-lime-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-lime-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-lime-900 text-center mb-12">Technical Team Virtual Assistant Investment</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-900 mb-2">$620</div>
                <div className="text-lime-900">Per technical VA/month</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">2x</div>
                <div className="text-lime-900">Project capacity increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lime-600 mb-2">100%</div>
                <div className="text-lime-900">Professional standards maintained</div>
              </div>
            </div>
            
            <div className="text-center text-lime-900 mb-8">
              All-inclusive: Salary, benefits, software licenses, workspace, and professional oversight
            </div>
            
            <div className="text-center">
              <button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center gap-2 mx-auto">
                Calculate Your Investment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-lime-900 text-center mb-12">Related Technical VA Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Engineering Virtual Assistant",
                description: "Engineering excellence through systematic support and technical expertise.",
                href: "/services/our-services/technical-teams/engineering-virtual-assistant"
              },
              {
                icon: "📐",
                title: "Drafting Virtual Assistant",
                description: "Technical drafting precision with latest CAD tools and professional accuracy.",
                href: "/services/our-services/technical-teams/drafting-virtual-assistant"
              },
              {
                icon: "🏠",
                title: "Real Estate Virtual Assistant",
                description: "Comprehensive real estate support from listings to closing coordination.",
                href: "/services/our-services/real-estate-virtual-assistant"
              }
            ].map((service, index) => (
              <div key={index} className="bg-lime-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-lime-900 mb-3">{service.title}</h3>
                <p className="text-lime-900 mb-4">{service.description}</p>
                <a href={service.href} className="text-lime-600 font-semibold hover:text-lime-700 flex items-center gap-1 transition-colors duration-200">
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-lime-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Scale Your Technical Practice?</h2>
          <p className="text-xl text-lime-100 mb-8">
            Join technical firms who've doubled their capacity while maintaining professional development standards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-lime-600 hover:bg-lime-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
              Start Partnership →
            </button>
            
            <button className="text-white hover:text-lime-100 font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h6v2H7v-2z" clipRule="evenodd" />
              </svg>
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
