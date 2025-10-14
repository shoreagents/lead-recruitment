'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Header from '@/components/layout/Header'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      <Header />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-12"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Privacy Policy</div>
              <div className="text-sm text-gray-400">Last updated: August 28, 2025</div>
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
            {/* Company Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div><strong className="text-gray-300">Company:</strong> <span className="text-gray-100">ShoreAgents Inc.</span></div>
                    <div><strong className="text-gray-300">Registration:</strong> <span className="text-gray-100">SEC CS201918140 | TIN 010-425-223-00000</span></div>
                    <div><strong className="text-gray-300">Phone:</strong> <span className="text-gray-100">+63 917 702 0676</span></div>
                  </div>
                  <div className="space-y-3">
                    <div><strong className="text-gray-300">Email:</strong> <span className="text-gray-100">careers@shoreagents.com</span></div>
                    <div><strong className="text-gray-300">Website:</strong> <span className="text-gray-100">https://shoreagents.com</span></div>
                    <div><strong className="text-gray-300">Careers Website:</strong> <span className="text-gray-100">https://careers.shoreagents.com</span></div>
                    <div><strong className="text-gray-300">Platform:</strong> <span className="text-gray-100">https://bpoc.io</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div><strong className="text-gray-300">Address:</strong></div>
                  <div className="text-gray-100 mt-1">
                    Business Center 26, Philexcel Business Park, Ma Roxas Highway, Clark Freeport, 2023 Pampanga
                  </div>
                </div>
              </div>
            </div>

            {/* About Our Recruitment Platform */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">About Our Recruitment Platform</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our recruitment platform at <strong className="text-blue-400">bpoc.io</strong> is ShoreAgents Inc.'s internal hiring tool designed to streamline our recruitment process and connect with qualified BPO professionals seeking employment with our company.
              </p>
              <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-200 font-medium">
                  By using this platform, you are applying for potential employment with ShoreAgents Inc.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Personal Information</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Full name, email address, phone number</li>
                <li>Location (city/province in Philippines)</li>
                <li>Resume/CV and work experience</li>
                <li>Educational background and certifications</li>
                <li>Skills, competencies, and professional achievements</li>
                <li>Employment preferences and salary expectations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-4">Assessment Data</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Skills test results and performance scores</li>
                <li>Career assessment outcomes (personality, aptitude)</li>
                <li>Interactive game results and achievements</li>
                <li>AI-powered resume analysis scores</li>
                <li>Typing speed and accuracy metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-4">Platform Activity</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Login times and platform usage</li>
                <li>Assessment completion progress</li>
                <li>Job preferences and search activity</li>
                <li>Communication through the platform</li>
                <li>Profile updates and modifications</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-4">Technical Information</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>IP address and browser information (for security)</li>
                <li>Device type and operating system</li>
                <li>Platform performance data</li>
                <li>Error logs (for technical support)</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">How We Use Your Information</h2>
              
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Primary Purpose - Employment Consideration</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Evaluate your qualifications for ShoreAgents positions</li>
                <li>Match your skills with available job opportunities</li>
                <li>Communicate with you about the recruitment process</li>
                <li>Conduct interviews and assessments</li>
                <li>Make informed hiring decisions</li>
                <li>Process employment offers and onboarding</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-4">Platform Improvement</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Analyze assessment effectiveness (using anonymized data)</li>
                <li>Improve platform functionality and user experience</li>
                <li>Enhance security and prevent unauthorized access</li>
                <li>Provide technical support when needed</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Information Sharing</h2>
              
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Within ShoreAgents</h3>
              <p className="text-gray-300 mb-4">
                Your information is shared only with authorized ShoreAgents personnel involved in:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Recruitment Team: Reviewing applications and coordinating interviews</li>
                <li>Hiring Managers: Evaluating candidates for specific positions</li>
                <li>HR Department: Processing employment documentation</li>
                <li>Senior Management: Making final hiring decisions</li>
                <li>IT Security: Maintaining platform security and data protection</li>
              </ul>

              <h3 className="text-xl font-semibold text-red-400 mb-4">We DO NOT Share With</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Other companies or recruitment agencies</li>
                <li>Marketing companies or advertisers</li>
                <li>Data brokers or information resellers</li>
                <li>Social media platforms (beyond what you choose to share)</li>
                <li>Any unauthorized third parties</li>
              </ul>
            </div>

            {/* Data Security & Protection */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Data Security & Protection</h2>
              
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Technical Safeguards</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>SSL/HTTPS encryption for all data transmission</li>
                <li>Encrypted storage for all personal information</li>
                <li>Multi-factor authentication for platform access</li>
                <li>Regular security monitoring and threat detection</li>
                <li>Secure backup systems with disaster recovery</li>
                <li>Access controls limiting data to authorized personnel only</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-4">Organizational Safeguards</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Staff training on data protection and confidentiality</li>
                <li>Strict data access policies and procedures</li>
                <li>Confidentiality agreements for all employees</li>
                <li>Regular security reviews and policy updates</li>
                <li>Incident response plan for security breaches</li>
                <li>Designated privacy contact for data protection issues</li>
              </ul>
            </div>

            {/* Your Privacy Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Your Privacy Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Access & Control</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Request a copy of all information we have about you</li>
                <li>Correct or update inaccurate information in your profile</li>
                <li>Request deletion of your personal data (subject to legal requirements)</li>
                <li>Restrict how we process your information</li>
                <li>Update your communication preferences</li>
                <li>Ask questions about our data practices</li>
              </ul>

                             <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                 <h4 className="text-lg font-semibold text-gray-200 mb-3">How to Exercise Your Rights</h4>
                 <div className="space-y-2 text-gray-300">
                   <div><strong>Email:</strong> it@shoreagents.com</div>
                   <div><strong>Subject Line:</strong> "Privacy Request - [Your Name]"</div>
                   <div><strong>Response Time:</strong> Within 5 business days</div>
                 </div>
               </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              
                             <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                     <h4 className="font-semibold text-gray-200 mb-2">IT Support & Data Protection</h4>
                     <div className="space-y-1 text-sm text-gray-300">
                       <div><strong>Email:</strong> it@shoreagents.com</div>
                       <div><strong>Attention:</strong> Data Protection Officer (Stephen Philip Atcheler)</div>
                       <div><strong>Response Time:</strong> Within 5 business days</div>
                     </div>
                   </div>
                   
                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                     <h4 className="font-semibold text-gray-200 mb-2">Recruitment Team</h4>
                     <div className="space-y-1 text-sm text-gray-300">
                       <div><strong>Email:</strong> recruitment@shoreagents.com</div>
                       <div><strong>Phone:</strong> +63 917 702 0676</div>
                       <div><strong>Hours:</strong> Monday-Friday, 6am to 3pm (Philippine Time)</div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                     <h4 className="font-semibold text-gray-200 mb-2">Careers Team</h4>
                     <div className="space-y-1 text-sm text-gray-300">
                       <div><strong>Email:</strong> careers@shoreagents.com</div>
                       <div><strong>Phone:</strong> +63 917 702 0676</div>
                       <div><strong>Hours:</strong> Monday-Friday, 6am to 3pm (Philippine Time)</div>
                     </div>
                   </div>
                   
                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                     <h4 className="font-semibold text-gray-200 mb-2">Company Address</h4>
                     <div className="space-y-1 text-sm text-gray-300">
                       <div><strong>ShoreAgents Inc.</strong></div>
                       <div>Business Center 26, Philexcel Business Park</div>
                       <div>Ma Roxas Highway, Clark Freeport, 2023 Pampanga</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* Legal Compliance */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Legal Compliance</h2>
              
              <p className="text-gray-300 mb-4">
                This privacy policy complies with:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                <li>Republic Act 10173 (Data Privacy Act of 2012)</li>
                <li>Labor Code of the Philippines (employment law requirements)</li>
                <li>Anti-Discrimination Laws (equal opportunity employment)</li>
                <li>Corporate regulations (SEC, BIR, and local government requirements)</li>
              </ul>

                             <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                 <h4 className="text-lg font-semibold text-gray-200 mb-3">Regulatory Authority</h4>
                 <div className="space-y-2 text-gray-300">
                   <div><strong>National Privacy Commission (NPC)</strong></div>
                   <div><strong>Website:</strong> https://www.privacy.gov.ph</div>
                   <div><strong>Email:</strong> info@privacy.gov.ph</div>
                   <div><strong>Phone:</strong> (02) 8234-2228</div>
                   <p className="mt-3 text-sm">
                     You have the right to file a complaint with the NPC regarding our data practices.
                   </p>
                 </div>
               </div>
            </div>

            {/* Document Version Information */}
            <div className="text-center py-8 border-t border-gray-700">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-blue-900/50 text-blue-200 text-sm font-medium rounded-full border border-blue-700">Secure</span>
                <span className="px-3 py-1 bg-green-900/50 text-green-200 text-sm font-medium rounded-full border border-green-700">Compliant</span>
                <span className="px-3 py-1 bg-purple-900/50 text-purple-200 text-sm font-medium rounded-full border border-purple-700">Transparent</span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  <strong>Document Version:</strong> 1.0 | <strong>Next Review Date:</strong> February 28, 2026
                </p>
                <p>
                  <strong>Approved By:</strong> Stephen Philip Atcheler, Data Protection Officer
                </p>
                <p>
                  © 2025 ShoreAgents Inc. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
