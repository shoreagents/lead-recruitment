"use client"

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'

export default function TermsAndConditionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center text-gray-400">Loading terms…</div>
        </div>
      </div>
    }>
      <TermsAndConditionsContent />
    </Suspense>
  )
}

function TermsAndConditionsContent() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      <Header />
      
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-12"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Terms and Conditions</div>
              <div className="text-sm text-gray-400">Effective Date: August 28, 2025 | Version 1.0</div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose prose-lg max-w-none prose-invert"
          >
            {/* Platform Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Platform Information</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div><strong className="text-gray-300">Platform:</strong> <span className="text-gray-100">BPOC.IO</span></div>
                    <div><strong className="text-gray-300">Operated By:</strong> <span className="text-gray-100">ShoreAgents Inc.</span></div>
                    <div><strong className="text-gray-300">Registration:</strong> <span className="text-gray-100">SEC CS201918140 | TIN 010-425-223-00000</span></div>
                    <div><strong className="text-gray-300">Phone:</strong> <span className="text-gray-100">+63 917 702 0676</span></div>
                  </div>
                  <div className="space-y-3">
                    <div><strong className="text-gray-300">Email:</strong> <span className="text-gray-100">careers@shoreagents.com</span></div>
                    <div><strong className="text-gray-300">Website:</strong> <span className="text-gray-100">https://shoreagents.com</span></div>
                    <div><strong className="text-gray-300">Careers Website:</strong> <span className="text-gray-100">https://careers.shoreagents.com</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div><strong className="text-gray-300">Address:</strong> <span className="text-gray-100">Business Center 26, Philexcel Business Park, Ma Roxas Highway, Clark Freeport, 2023 Pampanga</span></div>
                </div>
              </div>
            </div>

            {/* About BPOC.IO */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">About BPOC.IO</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-300 mb-4">BPOC.IO is ShoreAgents Inc.'s recruitment and assessment platform designed to:</p>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong className="text-white">Streamline hiring</strong> for positions within ShoreAgents organization</li>
                  <li>• <strong className="text-white">Evaluate candidate qualifications</strong> through AI-powered assessments and interactive tools</li>
                  <li>• <strong className="text-white">Match talent</strong> with appropriate roles in our company</li>
                  <li>• <strong className="text-white">Provide career development</strong> insights and professional growth opportunities</li>
                  <li>• <strong className="text-white">Optimize recruitment efficiency</strong> through automated screening and evaluation</li>
                </ul>
                                 <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                   <p className="text-gray-200 font-semibold">By using BPOC.IO, you are applying for potential employment with ShoreAgents Inc.</p>
                 </div>
              </div>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Acceptance of Terms</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Agreement to Terms</h3>
                  <p className="text-gray-300">By accessing, registering for, or using BPOC.IO, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, along with our Privacy Policy.</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Capacity to Agree</h3>
                  <p className="text-gray-300 mb-3">You represent and warrant that:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• You are <strong className="text-white">18 years of age or older</strong></li>
                    <li>• You have the <strong className="text-white">legal capacity</strong> to enter into this agreement</li>
                    <li>• You are <strong className="text-white">legally eligible for employment</strong> in the Philippines</li>
                    <li>• All information you provide is <strong className="text-white">accurate and complete</strong></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Updates to Terms</h3>
                  <p className="text-gray-300">We reserve the right to modify these Terms of Use at any time. Material changes will be communicated via email and platform notifications with 30 days advance notice.</p>
                </div>
              </div>
            </div>

            {/* User Account & Registration */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">User Account & Registration</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Account Creation</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• You must provide <strong className="text-white">accurate, current, and complete information</strong> during registration</li>
                    <li>• You are responsible for <strong className="text-white">maintaining the confidentiality</strong> of your account credentials</li>
                    <li>• You must <strong className="text-white">promptly update</strong> any changes to your personal or professional information</li>
                    <li>• <strong className="text-white">One account per person</strong> - multiple accounts are not permitted</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Account Security</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• You are <strong className="text-white">solely responsible</strong> for all activities under your account</li>
                    <li>• <strong className="text-white">Immediately notify us</strong> of any unauthorized access or security breaches</li>
                    <li>• We reserve the right to <strong className="text-white">suspend or terminate accounts</strong> that show signs of unauthorized access</li>
                    <li>• <strong className="text-white">Do not share</strong> your login credentials with anyone</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Account Verification</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• We may require <strong className="text-white">identity verification</strong> for certain platform features</li>
                    <li>• <strong className="text-white">False or misleading information</strong> may result in immediate account termination</li>
                    <li>• <strong className="text-white">Professional references</strong> may be contacted as part of the verification process</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Acceptable Use Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Acceptable Use Policy</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Permitted Uses</h3>
                  <p className="text-gray-300 mb-3">You may use BPOC.IO to:</p>
                  <div className="bg-green-600/20 p-4 rounded-lg border border-green-500/30">
                    <ul className="space-y-2 text-green-300">
                      <li>✅ Complete job applications for ShoreAgents positions</li>
                      <li>✅ Take skills assessments and career evaluations honestly</li>
                      <li>✅ Communicate with ShoreAgents recruitment team</li>
                      <li>✅ Access your assessment results and feedback</li>
                      <li>✅ Update your profile and employment preferences</li>
                      <li>✅ Participate in career development activities offered</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Prohibited Activities</h3>
                  <p className="text-gray-300 mb-3">You agree <strong className="text-white">NOT</strong> to:</p>
                  <div className="bg-red-600/20 p-4 rounded-lg border border-red-500/30">
                    <ul className="space-y-2 text-red-300">
                      <li>❌ Provide false, misleading, or incomplete information</li>
                      <li>❌ Create multiple accounts or impersonate others</li>
                      <li>❌ Share your account access with third parties</li>
                      <li>❌ Use automated tools, bots, or scripts for assessments</li>
                      <li>❌ Attempt to hack, disrupt, or compromise platform security</li>
                      <li>❌ Copy, reproduce, or distribute platform content without permission</li>
                      <li>❌ Harass, abuse, or threaten other users or ShoreAgents personnel</li>
                      <li>❌ Use the platform for any purpose other than employment with ShoreAgents</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Consequences of Violations</h3>
                  <p className="text-gray-300 mb-3">Violations may result in:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <strong className="text-white">Immediate account suspension</strong> or termination</li>
                    <li>• <strong className="text-white">Disqualification</strong> from current and future ShoreAgents opportunities</li>
                    <li>• <strong className="text-white">Legal action</strong> for serious violations or damage to our systems</li>
                    <li>• <strong className="text-white">Reporting to authorities</strong> if illegal activity is suspected</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Platform Features & Assessments */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Platform Features & Assessments</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Skills Assessments</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• All assessments must be completed <strong className="text-white">independently and honestly</strong></li>
                    <li>• <strong className="text-white">No assistance</strong> from others, online resources, or automated tools is permitted</li>
                    <li>• Assessment results become part of your <strong className="text-white">employment evaluation</strong></li>
                    <li>• We reserve the right to <strong className="text-white">re-test</strong> if irregularities are detected</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Career Games & Evaluations</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Interactive games are designed to <strong className="text-white">assess job-relevant skills</strong></li>
                    <li>• Your performance data will be <strong className="text-white">analyzed using AI technology</strong></li>
                    <li>• Game results contribute to your <strong className="text-white">overall candidate scoring</strong></li>
                    <li>• <strong className="text-white">Fair play</strong> is required - cheating will result in disqualification</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">AI-Powered Analysis</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Your resume and responses may be <strong className="text-white">analyzed by artificial intelligence</strong></li>
                    <li>• AI insights are used to <strong className="text-white">match your skills</strong> with suitable positions</li>
                    <li>• <strong className="text-white">Assessment scores</strong> are generated through automated evaluation</li>
                    <li>• AI recommendations supplement but <strong className="text-white">do not replace</strong> human hiring decisions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Employment Relationship */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Employment Relationship</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">No Guarantee of Employment</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Platform use <strong className="text-white">does not guarantee</strong> job interviews or employment offers</li>
                    <li>• All hiring decisions are <strong className="text-white">at ShoreAgents' sole discretion</strong></li>
                    <li>• Employment offers are subject to <strong className="text-white">additional requirements</strong> (background checks, references, etc.)</li>
                    <li>• We reserve the right to <strong className="text-white">modify or cancel</strong> job openings at any time</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">At-Will Employment</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Any employment relationship will be <strong className="text-white">at-will</strong>, meaning either party may terminate at any time</li>
                    <li>• Platform use does <strong className="text-white">not create any employment contract</strong> or guarantee of continued employment</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Equal Opportunity</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• ShoreAgents is an <strong className="text-white">equal opportunity employer</strong></li>
                    <li>• We do not discriminate based on race, religion, gender, age, disability, or other protected characteristics</li>
                    <li>• All candidates are evaluated based on <strong className="text-white">qualifications and merit</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Platform Support</h3>
                    <div className="space-y-3 text-gray-300">
                      <div>
                        <div><strong>Recruitment Team</strong></div>
                        <div>recruitment@shoreagents.com</div>
                      </div>
                      <div>
                        <div><strong>Careers Team</strong></div>
                        <div>careers@shoreagents.com</div>
                      </div>
                      <div>
                        <div><strong>IT Support</strong></div>
                        <div>it@shoreagents.com</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Business Information</h3>
                    <div className="space-y-2 text-gray-300">
                      <div><strong>Phone:</strong> +63 917 702 0676</div>
                      <div><strong>Business Hours:</strong> Monday-Friday, 6am to 3pm (Philippine Time)</div>
                      <div><strong>SEC Registration:</strong> CS201918140</div>
                      <div><strong>TIN:</strong> 010-425-223-00000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                         {/* Acknowledgment & Agreement */}
             <div className="mb-12">
               <h2 className="text-2xl font-bold text-white mb-6">Acknowledgment & Agreement</h2>
               <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                 <p className="text-gray-300 mb-4 font-semibold">By using BPOC.IO, you acknowledge that:</p>
                 <ul className="space-y-2 text-gray-300">
                   <li>1. You have <strong className="text-white">read and understood</strong> these Terms of Use in their entirety</li>
                   <li>2. You <strong className="text-white">agree to be bound</strong> by all terms and conditions stated herein</li>
                   <li>3. You understand this is a <strong className="text-white">recruitment platform for ShoreAgents employment</strong></li>
                   <li>4. You will <strong className="text-white">comply with all acceptable use policies</strong> and platform rules</li>
                   <li>5. You <strong className="text-white">consent to data collection and processing</strong> as outlined in our Privacy Policy</li>
                   <li>6. You meet all <strong className="text-white">age and legal eligibility requirements</strong></li>
                   <li>7. You will provide <strong className="text-white">accurate and truthful information</strong> at all times</li>
                   <li>8. You understand <strong className="text-white">platform use does not guarantee employment</strong></li>
                 </ul>
                 <div className="mt-4 pt-4 border-t border-gray-700">
                   <p className="text-gray-300 font-semibold">Your continued use of BPOC.IO constitutes ongoing acceptance of these Terms of Use.</p>
                 </div>
               </div>
             </div>

            {/* Document Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Document Information</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div><strong className="text-gray-300">Document Title:</strong> <span className="text-gray-100">BPOC.IO Terms of Use</span></div>
                    <div><strong className="text-gray-300">Version:</strong> <span className="text-gray-100">1.0</span></div>
                    <div><strong className="text-gray-300">Effective Date:</strong> <span className="text-gray-100">August 28, 2025</span></div>
                  </div>
                  <div className="space-y-3">
                    <div><strong className="text-gray-300">Last Modified:</strong> <span className="text-gray-100">August 28, 2025</span></div>
                    <div><strong className="text-gray-300">Next Review Date:</strong> <span className="text-gray-100">February 28, 2026</span></div>
                    <div><strong className="text-gray-300">Approved By:</strong> <span className="text-gray-100">Stephen Philip Atcheler, Managing Director</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-8 border-t border-gray-700">
              <p className="text-gray-400 italic mb-2">These Terms of Use are binding and enforceable. By using BPOC.IO, you accept all terms and conditions outlined above.</p>
              <p className="text-gray-500 font-semibold">© 2025 ShoreAgents Inc. All rights reserved.</p>
              
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
