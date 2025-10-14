"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Facebook, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black/20 backdrop-blur-sm">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-8">
          {/* Left Section - Company Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="text-2xl font-bold gradient-text">BPOC.IO</div>
                <div className="text-sm text-gray-300">Where BPO Careers Begin</div>
              </div>
            </div>
            
                         {/* Company Description */}
             <p className="text-gray-300 leading-relaxed">
               Revolutionizing BPO recruitment with AI-powered tools for Filipino professionals.
             </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <motion.a 
                href="https://www.facebook.com/bpoc.io" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <Facebook className="w-5 h-5 text-white" />
              </motion.a>
              
              <motion.div 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center opacity-60"
                whileHover={{ scale: 1.1 }}
              >
                <Instagram className="w-5 h-5 text-white" />
              </motion.div>
              
              <motion.div 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center opacity-60"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-white font-bold text-sm">𝕏</span>
              </motion.div>
              
              <motion.div 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center opacity-60"
                whileHover={{ scale: 1.1 }}
              >
                <Mail className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>

                                                                                       {/* Right Section - Navigation Links */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="grid grid-cols-3 gap-8"
             >
                                                               {/* Platform Column 1 */}
                 <div className="space-y-4">
                   <h3 className="font-bold text-white text-lg">Platform</h3>
                                                                                                                                                               <div className="space-y-3">
                        {[
                          { href: "/resume-builder", text: "Resume Builder" },
                          { href: "/career-tools/games", text: "Career Games" },
                          { href: "/talent-search", text: "Talent Search" }
                        ].map((link, index) => (
                       <motion.div
                         key={link.href}
                         initial={{ opacity: 0, x: -10 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.2 + index * 0.05 }}
                       >
                         <Link 
                           href={link.href} 
                           className="text-gray-400 hover:text-white transition-all duration-300 text-sm"
                         >
                           {link.text}
                         </Link>
                       </motion.div>
                     ))}
                   </div>
                 </div>

                                                                   {/* Platform Column 2 */}
                   <div className="space-y-4">
                                           <div className="space-y-3">
                        {[
                          { href: "/jobs/job-matching", text: "Job Matching" },
                          { href: "/leaderboards", text: "Leaderboards" }
                        ].map((link, index) => (
                         <motion.div
                           key={link.href}
                           initial={{ opacity: 0, x: -10 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: 0.3 + index * 0.05 }}
                         >
                           <Link 
                             href={link.href} 
                             className="text-gray-400 hover:text-white transition-all duration-300 text-sm"
                           >
                             {link.text}
                           </Link>
                         </motion.div>
                       ))}
                     </div>
                   </div>

                                       {/* Platform Column 3 */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { href: "/about", text: "About" }
                        ].map((link, index) => (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                          >
                            <Link 
                              href={link.href} 
                              className="text-gray-400 hover:text-white transition-all duration-300 text-sm"
                            >
                              {link.text}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
             </motion.div>
        </div>

        {/* Bottom Section - Copyright and Legal Links */}
        <motion.div 
          className="pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} <span className="font-semibold text-white">BPOC.IO</span>. All rights reserved.
            </div>
            
                         {/* Legal Links */}
             <div className="flex items-center space-x-6">
               <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-all duration-300 text-sm">
                 Privacy Policy
               </Link>
               <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-all duration-300 text-sm">
                 Terms and Conditions
               </Link>
             </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}


