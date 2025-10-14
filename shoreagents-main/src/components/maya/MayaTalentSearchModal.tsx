"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Filter, MapPin, Clock, Star, User, Briefcase } from 'lucide-react'

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

interface MayaTalentSearchModalProps {
  isOpen: boolean
  onClose: () => void
  userData?: {
    firstName?: string
    lastName?: string
    company?: string
    industry?: string
  }
}

export const MayaTalentSearchModal = ({
  isOpen,
  onClose,
  userData
}: MayaTalentSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])

  // Mock candidate data - in real implementation, this would come from an API
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Maria Santos',
      position: 'Virtual Assistant',
      experience: '3 years',
      skills: ['Customer Service', 'Data Entry', 'Email Management'],
      location: 'Manila, Philippines',
      salary: '$800-1200/month',
      rating: 4.8,
      availability: 'Available Now'
    },
    {
      id: '2',
      name: 'John Rodriguez',
      position: 'Graphic Designer',
      experience: '5 years',
      skills: ['Adobe Creative Suite', 'Logo Design', 'Brand Identity'],
      location: 'Cebu, Philippines',
      salary: '$1000-1500/month',
      rating: 4.9,
      availability: 'Available in 2 weeks'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      position: 'Project Manager',
      experience: '4 years',
      skills: ['Agile', 'Team Leadership', 'Budget Management'],
      location: 'Davao, Philippines',
      salary: '$1200-1800/month',
      rating: 4.7,
      availability: 'Available Now'
    },
    {
      id: '4',
      name: 'Michael Chen',
      position: 'Software Developer',
      experience: '6 years',
      skills: ['React', 'Node.js', 'Python'],
      location: 'Makati, Philippines',
      salary: '$1500-2200/month',
      rating: 4.9,
      availability: 'Available in 1 week'
    },
    {
      id: '5',
      name: 'Lisa Garcia',
      position: 'Marketing Specialist',
      experience: '3 years',
      skills: ['Social Media', 'Content Creation', 'SEO'],
      location: 'Quezon City, Philippines',
      salary: '$900-1300/month',
      rating: 4.6,
      availability: 'Available Now'
    }
  ]

  useEffect(() => {
    if (isOpen) {
      setCandidates(mockCandidates)
      setFilteredCandidates(mockCandidates)
    }
  }, [isOpen])

  useEffect(() => {
    let filtered = candidates

    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedRole) {
      filtered = filtered.filter(candidate =>
        candidate.position.toLowerCase().includes(selectedRole.toLowerCase())
      )
    }

    if (selectedLevel) {
      filtered = filtered.filter(candidate => {
        const experience = parseInt(candidate.experience)
        if (selectedLevel === 'entry' && experience <= 2) return true
        if (selectedLevel === 'mid' && experience >= 3 && experience <= 5) return true
        if (selectedLevel === 'senior' && experience >= 6) return true
        return false
      })
    }

    setFilteredCandidates(filtered)
  }, [searchQuery, selectedRole, selectedLevel, candidates])

  const handleSearch = async () => {
    setIsLoading(true)
    // In real implementation, this would call an API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find Your Perfect Talent</h2>
              <p className="text-gray-600 mt-1">
                {userData?.firstName ? `Hi ${userData.firstName}! ` : ''}Browse our curated talent pool
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, position, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="">All Roles</option>
                <option value="virtual assistant">Virtual Assistant</option>
                <option value="graphic designer">Graphic Designer</option>
                <option value="project manager">Project Manager</option>
                <option value="software developer">Software Developer</option>
                <option value="marketing specialist">Marketing Specialist</option>
              </select>

              {/* Experience Level */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6+ years)</option>
              </select>

              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {filteredCandidates.length} candidates found
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-lime-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{candidate.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase size={16} className="mr-2" />
                      {candidate.experience} experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      {candidate.availability}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-lime-600">{candidate.salary}</span>
                    <button className="px-4 py-2 bg-lime-600 text-white text-sm rounded-lg hover:bg-lime-700 transition-colors">
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCandidates.length === 0 && (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Need help finding the right talent? Contact our team for personalized recommendations.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
