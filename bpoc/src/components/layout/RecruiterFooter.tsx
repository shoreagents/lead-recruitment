"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, Users, FileText, TrendingUp } from 'lucide-react'

export default function RecruiterFooter() {
  return (
    <footer className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900 border-t-4 border-emerald-400 shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-slate-800/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-blue-400/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-blue-500/5"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 space-y-6"
          >
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Building2 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="text-4xl font-bold text-white drop-shadow-2xl">BPOC Recruiter</div>
                <div className="text-lg text-slate-100 font-semibold">Find Your Next Perfect Hire</div>
              </div>
            </div>
            
            {/* Company Description */}
            <p className="text-slate-200 leading-relaxed max-w-md text-lg font-medium">
              AI-powered recruitment platform connecting top Filipino talent with leading BPO companies. 
              Streamline your hiring process with intelligent matching and comprehensive candidate insights.
            </p>
            
          </motion.div>

          {/* Recruiter Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-bold text-white text-2xl drop-shadow-lg mb-6">Recruiter Tools</h3>
            <div className="space-y-3">
              {[
                { href: "/recruiter/dashboard", text: "Dashboard", icon: TrendingUp },
                { href: "/recruiter/jobs", text: "Job Management", icon: FileText },
                { href: "/recruiter/applicants", text: "Applicants", icon: Users },
                { href: "/recruiter/analytics", text: "Analytics", icon: TrendingUp }
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
                    className="flex items-center space-x-3 text-slate-200 hover:text-white transition-all duration-300 text-lg font-semibold group"
                  >
                    <link.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                    <span>{link.text}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Bottom Section - Copyright and Legal Links */}
        <motion.div 
          className="pt-12 border-t-4 border-slate-500"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-slate-200 text-lg font-semibold">
              © {new Date().getFullYear()} <span className="font-bold text-white text-xl">BPOC.IO</span>. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Link href="/privacy-policy" className="text-slate-200 hover:text-white transition-all duration-300 text-lg font-semibold">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-slate-200 hover:text-white transition-all duration-300 text-lg font-semibold">
                Terms and Conditions
              </Link>
              <Link href="/recruiter/terms" className="text-slate-200 hover:text-white transition-all duration-300 text-lg font-semibold">
                Recruiter Terms
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
