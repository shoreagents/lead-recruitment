"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Clock, Star, User, Briefcase } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  position: string
  experience: string
  skills: string[]
  location: string
  salary: string
  rating: number
  availability: string
  image?: string
}

interface MayaTalentSearchFormProps {
  onComplete: (searchData: any) => void
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
  generateMessageId: () => string
  userData?: {
    firstName?: string
    lastName?: string
    company?: string
    industry?: string
  }
}

export const MayaTalentSearchForm = ({
  onComplete,
  setMessages,
  generateMessageId,
  userData
}: MayaTalentSearchFormProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!searchQuery.trim() && !selectedRole && !selectedLevel) return
    
    setIsSubmitting(true)
    
    // Add user message to chat
    const userMessage = {
      id: generateMessageId(),
      role: 'user',
      content: `Looking for talent: ${searchQuery || 'Any role'} ${selectedRole ? `(${selectedRole})` : ''} ${selectedLevel ? `- ${selectedLevel} level` : ''}`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    // Call the completion handler
    onComplete({
      searchQuery,
      selectedRole,
      selectedLevel,
      userData
    })
    
    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-full"
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Find Your Perfect Talent</h3>
          <p className="text-sm text-gray-600">
            {userData?.firstName ? `Hi ${userData.firstName}! ` : ''}Let's find the right talent for your needs
          </p>
        </div>

        <div className="space-y-4">
          {/* Search Query */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of talent are you looking for?
            </label>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Virtual Assistant, Graphic Designer, Project Manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Role (Optional)
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="">Select a role</option>
              <option value="virtual assistant">Virtual Assistant</option>
              <option value="graphic designer">Graphic Designer</option>
              <option value="project manager">Project Manager</option>
              <option value="software developer">Software Developer</option>
              <option value="marketing specialist">Marketing Specialist</option>
              <option value="customer service">Customer Service</option>
              <option value="data entry">Data Entry Specialist</option>
              <option value="accounting">Accounting Specialist</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level (Optional)
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="">Any experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6+ years)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!searchQuery.trim() && !selectedRole && !selectedLevel)}
              className="px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Searching...' : 'Find Talent'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
