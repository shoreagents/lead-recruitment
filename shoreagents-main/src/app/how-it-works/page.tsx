"use client";

import { SideNav } from "@/components/layout/SideNav";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      
      {/* Main Content Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-lime-100 border border-lime-300 rounded-full text-sm font-medium text-gray-700 mb-6">
              <svg className="w-4 h-4 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              THE COMPLETE IDIOTS GUIDE
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              SHORE AGENTS - HOW IT WORKS{" "}
              <span className="bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 bg-clip-text text-transparent">(COMPLETE GUIDE)</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              What We <span className="text-lime-600 font-bold">ACTUALLY</span> Do vs. What <span className="text-lime-600 font-bold">YOU</span> Do
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Claude God's HONEST, No-Bullshit Explanation of our 6-step process - what we handle, what you handle, and why it works.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <button 
              onClick={() => window.location.href = '/gettingstart'}
              className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-lg hover:shadow-xl cursor-pointer flex items-center"
            >
              Start Your Process Today
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button onClick={() => window.location.href = '/pricing'}  className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-sm font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 ease-in-out text-lg shadow-lg hover:shadow-xl cursor-pointer">
              See Pricing Calculator
            </button>
          </div>
        </div>
      </section>

      {/* New Process Steps Section */}
      <section className="bg-lime-600 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              THE <span className="text-lime-200">6-STEP</span> PROCESS (REAL VERSION)
            </h2>
            <p className="text-xl text-lime-100 max-w-3xl mx-auto">
              Simple, transparent, and effective - here&apos;s exactly how we help you find the perfect team members.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Book a Chat With Us</h3>
                  <p className="text-lime-600 font-medium text-base">15-30 Minutes</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What Happens:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• You call us or book online</li>
                    <li>• We ask you simple questions:</li>
                    <li>• What kind of work do you need done?</li>
                    <li>• How many people do you want?</li>
                    <li>• What&apos;s your budget?</li>
                    <li>• Do you want them in office or working from home?</li>
                    <li>• When do you want to start?</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What You Need to Prepare:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Job description (basic is fine)</li>
                    <li>• Budget range per person</li>
                    <li>• Timeline (when you want them to start)</li>
                    <li>• Any special requirements</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">What WE Do:</h5>
                    <p className="text-gray-600 text-sm">Listen and understand your needs</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">What YOU Do:</h5>
                    <p className="text-gray-600 text-sm">Tell us what you want</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⏱️</span>
                    <span className="text-gray-600">15-30 minutes</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">💰</span>
                    <span className="text-gray-600 font-semibold">FREE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">We Find Qualified People</h3>
                  <p className="text-lime-600 font-medium text-base">1-2 Weeks</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What WE Do Behind the Scenes:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Search our database of 25,000+ candidates</li>
                    <li>• Post on job sites, Facebook, LinkedIn</li>
                    <li>• Call potential candidates</li>
                    <li>• Send targeted emails</li>
                    <li>• Use AI to filter and match candidates</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">Our Screening Process:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Resume Check: Verify education and experience is real</li>
                    <li>• Phone Call: Test their English and basic communication</li>
                    <li>• Formal Interview: Professional interview process</li>
                    <li>• AI Testing: Typing speed, English proficiency, logic, personality</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What YOU Get:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• 3-5 qualified candidates who meet your basic requirements</li>
                    <li>• Their resumes and test scores</li>
                    <li>• Video interviews you can review</li>
                    <li>• Our recommendation on who&apos;s most suitable</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What We DON&apos;T Do:</h4>
                  <p className="text-gray-600 text-sm">Train them on YOUR business, industry, or processes</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⏱️</span>
                    <span className="text-gray-600">1-2 weeks</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">💰</span>
                    <span className="text-gray-600 font-semibold">FREE (included in setup)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">You Interview and Choose</h3>
                  <p className="text-lime-600 font-medium text-base">100% YOUR Decision</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What Happens:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• We schedule interviews between you and the candidates</li>
                    <li>• YOU interview them via video call, phone, or in-person</li>
                    <li>• YOU ask questions about YOUR business needs</li>
                    <li>• YOU decide who fits your requirements</li>
                    <li>• YOU pick who you want to hire</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What WE Help With:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Scheduling interviews at convenient times</li>
                    <li>• Setting up video calls if needed</li>
                    <li>• Being available if technical issues arise</li>
                    <li>• Answering questions about candidates&apos; backgrounds</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What We DON&apos;T Do:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Make hiring decisions for you</li>
                    <li>• Know if they&apos;re right for YOUR specific business</li>
                    <li>• Understand YOUR industry better than you do</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What YOU Do:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Interview candidates yourself</li>
                    <li>• Ask YOUR business-specific questions</li>
                    <li>• Test their knowledge of YOUR industry</li>
                    <li>• Make the final hiring decision</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⏱️</span>
                    <span className="text-gray-600">30-60 minutes per candidate</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">🎯</span>
                    <span className="text-gray-600 font-semibold">Your Choice</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">We Set Up Employment & Equipment</h3>
                  <p className="text-lime-600 font-medium text-base">1-2 Weeks</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What WE Handle 100%:</h4>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm mb-1">Equipment & Infrastructure:</h5>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Computer/Laptop: Brand new, basic business setup</li>
                      <li>• Monitor: Professional dual screen setup</li>
                      <li>• Keyboard & Mouse: Professional equipment</li>
                      <li>• Headset: For calls and meetings</li>
                      <li>• UPS Backup: Power backup during outages</li>
                      <li>• Internet: High-speed fiber + backup connection</li>
                      <li>• Basic Software: Windows, Office, browsers</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <h5 className="font-semibold text-gray-900 text-sm mb-1">Legal & Employment:</h5>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Employment contracts and legal paperwork</li>
                      <li>• Health insurance enrollment (starts Day 1)</li>
                      <li>• Government registrations (taxes, social security)</li>
                      <li>• Payroll system setup</li>
                      <li>• Shore Agents policy orientation</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What We DON&apos;T Do:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Train them on YOUR software/systems</li>
                    <li>• Teach them YOUR business processes</li>
                    <li>• Set up YOUR company-specific tools</li>
                    <li>• Explain YOUR industry or procedures</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What YOU Must Do:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Give them access to YOUR systems</li>
                    <li>• Train them on YOUR processes</li>
                    <li>• Teach them YOUR business procedures</li>
                    <li>• Show them how YOU want work done</li>
                    <li>• Provide YOUR company-specific training</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⏱️</span>
                    <span className="text-gray-600">1-2 weeks for our setup</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">🎯</span>
                    <span className="text-gray-600 font-semibold">Your Training Time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">5</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">They Work For You + We Handle Employment Stuff</h3>
                  <p className="text-lime-600 font-medium text-base">Ongoing Partnership</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What THEY Do (Working FOR YOU):</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Work the schedule YOU set</li>
                    <li>• Complete tasks YOU assign</li>
                    <li>• Attend YOUR meetings</li>
                    <li>• Report to YOU on progress</li>
                    <li>• Communicate directly with YOU and YOUR team</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What WE Handle (Employment Logistics):</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Payroll: Pay them every 2 weeks, handle all taxes</li>
                    <li>• HR Issues: Process sick leave, vacation requests</li>
                    <li>• IT Support: Fix computers, internet, equipment problems</li>
                    <li>• Benefits: Manage health insurance and government compliance</li>
                    <li>• Basic Check-ins: "Are you showing up? Any equipment issues?"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What We DON&apos;T Do:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Manage their daily work (that&apos;s YOUR job as their boss)</li>
                    <li>• Train them on YOUR business processes</li>
                    <li>• Supervise their job performance</li>
                    <li>• Know if they&apos;re doing good work for YOU</li>
                    <li>• Handle YOUR business-specific issues</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What YOU Do (You&apos;re Their ACTUAL Boss):</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Assign their daily tasks and projects</li>
                    <li>• Train them on YOUR business procedures</li>
                    <li>• Manage their work performance</li>
                    <li>• Give them feedback on quality</li>
                    <li>• Handle YOUR business-specific problems</li>
                    <li>• Decide if they&apos;re meeting YOUR standards</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">💬</span>
                    <span className="text-gray-600">With YOU: Daily work communication</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">📞</span>
                    <span className="text-gray-600 font-semibold">With Us: Only employment/equipment issues</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <span className="text-2xl font-bold text-white">6</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Expand Your Team (When You&apos;re Ready)</h3>
                  <p className="text-lime-600 font-medium text-base">Scale When Ready</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">When You Want More People:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Call us: "I need more people for [specific role]"</li>
                    <li>• We repeat steps 2-5 for new positions</li>
                    <li>• Faster Process: 1-2 weeks (we know your style now)</li>
                    <li>• YOU Integrate: New people into YOUR team and processes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What We Provide:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• More qualified candidates</li>
                    <li>• Same equipment and setup process</li>
                    <li>• Same employment management</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-base mb-2">What YOU Handle:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Training new people on YOUR business</li>
                    <li>• Managing larger team workflow</li>
                    <li>• YOUR company culture and procedures</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">⚡</span>
                    <span className="text-gray-600">Faster Process</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-lime-600 mr-1">👥</span>
                    <span className="text-gray-600 font-semibold">Scale Your Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What If Something Goes Wrong Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What If Something Goes Wrong?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employment Issues - WE Handle */}
            <div className="bg-lime-50 rounded-xl p-8 border border-lime-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Employment Issues (WE Handle)</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">"They&apos;re not showing up to work"</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">We investigate and take action</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">We handle disciplinary process</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">We find replacement if needed</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">"Equipment/Internet problems"</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">24/7 IT support from us</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">We fix or replace equipment</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">We handle technical issues</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">"They quit unexpectedly"</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">90-day replacement guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">We start recruitment immediately</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Usually replaced within 2 weeks</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Work Performance Issues - YOU Handle */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-600 rounded-lg mr-4 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Work Performance Issues (YOU Handle)</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">"They don&apos;t understand my business"</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">NOT our problem - YOU need to train them</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">YOU provide business-specific training</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">YOU explain your processes and procedures</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">"Their work quality isn&apos;t good enough"</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">NOT our job to manage - YOU are their boss</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">YOU give performance feedback</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Call us only if you want a replacement</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">"They&apos;re not following my procedures"</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">WE don&apos;t know your procedures - YOU manage this</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">YOU supervise their work</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">YOU enforce your business rules</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Real Division of Responsibility Section */}
      <section className="bg-lime-600 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Real Division of Responsibility
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Box: Shore Agents = Employment Provider */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-lg mr-4 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Shore Agents = Employment Provider</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">We Provide:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The People: Qualified, English-speaking professionals</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The Infrastructure: Office space, equipment, internet</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The Employment: Contracts, payroll, benefits, HR</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The Support: IT help, equipment fixes, replacements</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">We DON&apos;T Provide:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Business management</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Daily supervision</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Industry training</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Quality control of YOUR work</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Box: YOU = The Actual Boss */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-ocean-500 rounded-lg mr-4 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">YOU = The Actual Boss</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">You Provide:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The Direction: What work needs to be done</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The Training: How YOUR business works</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The Management: Daily supervision and feedback</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">The Standards: What quality you expect</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-3">You DON&apos;T Provide:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Office space or equipment</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Employment contracts or payroll</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">IT support or technical issues</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-700">Government compliance or benefits</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Summary Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Summary
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Think of it like leasing a car:
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 bg-lime-600 rounded-full mr-4 mt-1 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">We provide the car</h4>
                    <p className="text-gray-600 text-sm">(person + equipment + office)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 bg-lime-600 rounded-full mr-4 mt-1 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">We handle maintenance</h4>
                    <p className="text-gray-600 text-sm">(IT support, payroll, employment issues)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 bg-ocean-500 rounded-full mr-4 mt-1 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">You drive it</h4>
                    <p className="text-gray-600 text-sm">(manage their daily work)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 bg-ocean-500 rounded-full mr-4 mt-1 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">You decide where to go</h4>
                    <p className="text-gray-600 text-sm">(what work they do for your business)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-lime-50 rounded-xl border border-lime-200">
              <p className="text-center text-gray-700 font-medium">
                The person works <span className="font-bold text-gray-900">FOR YOU</span>, but they&apos;re employed <span className="font-bold text-gray-900">BY US</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Work Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes This Work
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-lime-50 rounded-xl p-8 border border-lime-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Why Clients Love This:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">You get the talent without employment hassles</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Lower costs than local hiring</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Fast setup - weeks not months</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Risk protection - we handle employment issues</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-lime-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Easy scaling - add people as you grow</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Why It Actually Works:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Clear boundaries - everyone knows their role</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">You stay in control - it&apos;s still YOUR business</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Shared responsibility - we handle what we&apos;re good at</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-ocean-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Proven system - tested with hundreds of clients</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-lime-50 rounded-2xl p-12 border border-lime-200 shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Start?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-full mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Book a consultation</h3>
                  <p className="text-gray-600 text-sm">15-30 minutes to discuss your needs</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-full mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">We find candidates</h3>
                  <p className="text-gray-600 text-sm">1-2 weeks of recruitment</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-full mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">You interview and choose</h3>
                  <p className="text-gray-600 text-sm">Your decision completely</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-lime-600 rounded-full mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">We set everything up</h3>
                  <p className="text-gray-600 text-sm">1-2 weeks for equipment and employment</p>
                </div>
              </div>

              <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                They start working for <span className="font-bold text-gray-900">YOU</span> - With our support structure
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <button 
                  onClick={() => window.location.href = '/gettingstart'}
                  className="bg-lime-600 text-white px-8 py-4 rounded-sm font-semibold hover:bg-lime-500 transition-all duration-300 ease-in-out text-lg shadow-lg hover:shadow-xl cursor-pointer flex items-center"
                >
                  Start Your Process Today
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => {
                    window.location.href = '/pricing';
                    // Add a small delay to ensure the page loads before triggering the modal
                    setTimeout(() => {
                      const event = new CustomEvent('openPricingCalculator');
                      window.dispatchEvent(event);
                    }, 500);
                  }}
                  className="bg-white text-lime-600 border-2 border-lime-600 px-8 py-4 rounded-sm font-semibold hover:bg-lime-600 hover:text-white transition-all duration-300 ease-in-out text-lg shadow-lg hover:shadow-xl cursor-pointer"
                >
                  See Pricing Calculator
                </button>
              </div>

              <p className="text-lg text-gray-600 mt-6">
                Questions? Let&apos;s talk!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
