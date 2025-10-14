// Core data types for the BPOC.IO platform

// User and Authentication
export interface Candidate {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  location?: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
}

// Resume related types
export interface Resume {
  id: string
  candidateId: string
  summary?: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: Date
  endDate?: Date
  isCurrentRole: boolean
  description?: string
  achievements: string[]
  skills: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: Date
  endDate: Date
  gpa?: number
  achievements: string[]
}

export interface Skill {
  id: string
  name: string
  proficiencyLevel: number
  isVerified: boolean
  verificationSource?: string
}

// Assessment result types for future use
export interface TypingTestResult {
  wpm: number
  accuracy: number
  completedAt: Date
  certificateUrl?: string
}

export interface PersonalityTestResult {
  type: string
  traits: Array<{
    name: string
    score: number
    description: string
  }>
  roleRecommendations: string[]
  completedAt: Date
} 