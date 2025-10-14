'use client'

import { motion } from 'framer-motion'
import { Wrench, Construction } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminLayout from '@/components/layout/AdminLayout'

export default function AssessmentsPage() {
  return (
    <AdminLayout 
      title="Assessment Management" 
      description="Manage and monitor assessment performance and analytics"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-white/10">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Construction className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Under Development
              </CardTitle>
              <p className="text-gray-300 text-lg">
                The Assessment Management admin page is currently being developed.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white/5 rounded-lg p-8 border border-white/10">
                <Wrench className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Coming Soon
                </h3>
                <p className="text-gray-400 mb-6 text-lg">
                  Our team is working hard to create a comprehensive assessment management system for administrators.
                </p>
                
                {/* Assessment Types List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-gray-300">Typing Speed Test</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-gray-300">DISC Personality Assessment</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-gray-300">Communication Skills Test</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-gray-300">Logical Reasoning Test</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-gray-300">Workplace Judgment Assessment</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
} 