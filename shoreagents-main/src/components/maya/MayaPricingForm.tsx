"use client"

import { MayaTextField } from './MayaTextField'
import { MayaSummaryCard } from './MayaSummaryCard'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaPricingFormProps {
  currentStep: string
  onStepChange: (step: string | null) => void
  onFormDataChange: (data: any) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  formData: any
}

export const MayaPricingForm = ({
  currentStep,
  onStepChange,
  onFormDataChange,
  setMessages,
  generateMessageId,
  formData
}: MayaPricingFormProps) => {
  const handleTeamSizeComplete = (value: string) => {
    onFormDataChange({ ...formData, teamSize: value })
    
    // If team size is 2 or more, ask about role type first
    const teamSize = parseInt(value)
    if (teamSize >= 2) {
      onStepChange('roleType')
    } else {
      onStepChange('roles')
    }
  }

  const handleRoleTypeComplete = (value: string) => {
    onFormDataChange({ ...formData, roleType: value })
    onStepChange('roles')
  }

  const handleRolesComplete = (value: string) => {
    onFormDataChange({ ...formData, roles: value })
    onStepChange('experience')
  }

  const handleExperienceComplete = (value: string) => {
    onFormDataChange({ ...formData, experience: value })
    onStepChange('description')
  }

  const handleDescriptionComplete = (value: string) => {
    onFormDataChange({ ...formData, description: value })
    onStepChange('summary')
  }

  const handleSummaryConfirm = async () => {
    try {
      // Save pricing information to database
      const response = await fetch('/api/save-pricing-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId || 'anonymous_' + Date.now(), // Generate userId if not provided
          teamSize: formData.teamSize,
          roleType: formData.roleType,
          roles: formData.roles,
          experience: formData.experience,
          description: formData.description
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save pricing information');
      }

      const result = await response.json();
      console.log('Pricing info saved:', result);

      // Move to workplace setup instead of closing
      onStepChange('workplace')
      
      // Add completion message
      const teamSize = parseInt(formData.teamSize || '1')
      const isSameRole = formData.roleType?.toLowerCase() === 'same'
      const roleDescription = isSameRole 
        ? `${formData.roles} (same role for all ${teamSize} members)`
        : `${formData.roles} (different roles)`
      
      const pricingMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Perfect! I have your team requirements: ${formData.teamSize} team members for ${roleDescription}. ${formData.description ? `Project details: ${formData.description}` : ''} Let me analyze your needs and provide you with a personalized quote! 🎯`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, pricingMessage])
    } catch (error) {
      console.error('Error saving pricing information:', error);
      
      // Still proceed with the form completion even if database save fails
      onStepChange(null)
      
      const teamSize = parseInt(formData.teamSize || '1')
      const isSameRole = formData.roleType?.toLowerCase() === 'same'
      const roleDescription = isSameRole 
        ? `${formData.roles} (same role for all ${teamSize} members)`
        : `${formData.roles} (different roles)`
      
      const pricingMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Perfect! I have your team requirements: ${formData.teamSize} team members for ${roleDescription}. ${formData.description ? `Project details: ${formData.description}` : ''} Let me analyze your needs and provide you with a personalized quote! 🎯`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, pricingMessage])
    }
  }

  const handleSummaryEdit = (field: string) => {
    onStepChange(field)
  }

  if (currentStep === 'teamSize') {
    return (
      <MayaTextField
        key="teamSize-step"
        step="teamSize"
        title="What's your team size?"
        description="How many team members do you need?"
        placeholder="Enter number of team members"
        inputType="text"
        validation={(value) => /^\d+$/.test(value)}
        onComplete={handleTeamSizeComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="roles"
        nextQuestion="Great! What roles do you need for this team?"
      />
    )
  }

  if (currentStep === 'roleType') {
    return (
      <div key="roleType-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  Same role or different roles?
                </h3>
                <p className="text-xs text-gray-600">
                  Do you need the same role for all team members or different roles?
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRoleTypeComplete('same')}
                  variant="default"
                  size="sm"
                  className="text-xs px-3 py-1.5 h-auto"
                >
                  Same Role
                </Button>
                <Button
                  onClick={() => handleRoleTypeComplete('different')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-1.5 h-auto"
                >
                  Different Roles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'roles') {
    const isSameRole = formData.roleType?.toLowerCase() === 'same'
    const teamSize = parseInt(formData.teamSize || '1')
    
    return (
      <MayaTextField
        key="roles-step"
        step="roles"
        title={isSameRole ? "What role do you need?" : "What roles do you need?"}
        description={
          isSameRole 
            ? `Please specify the role for all ${teamSize} team members`
            : "Please specify the different positions you're looking for"
        }
        placeholder={
          isSameRole 
            ? "e.g., Software Developer, Marketing Manager, Customer Service Rep"
            : "e.g., Software Developer, Marketing Manager, Customer Service Rep"
        }
        inputType="text"
        onComplete={handleRolesComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="description"
        nextQuestion="Great! Can you tell me more about the project or specific requirements?"
        enableAutocomplete={true}
        autocompleteContext="job roles and positions for offshore staffing"
      />
    )
  }

  if (currentStep === 'experience') {
    return (
      <div key="experience-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  What experience level do you need?
                </h3>
                <p className="text-xs text-gray-600">
                  Choose the experience level that best fits your requirements
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleExperienceComplete('entry')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Entry Level (0-2 years)
                </Button>
                <Button
                  onClick={() => handleExperienceComplete('mid')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Mid Level (3-5 years)
                </Button>
                <Button
                  onClick={() => handleExperienceComplete('senior')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Senior Level (6+ years)
                </Button>
                <Button
                  onClick={() => handleExperienceComplete('mixed')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Mixed Levels
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'description') {
    return (
      <JobDescriptionStep
        key="description-step"
        onComplete={handleDescriptionComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        formData={formData}
      />
    )
  }

  if (currentStep === 'summary') {
    return (
      <MayaSummaryCard
        formData={formData}
        onConfirm={handleSummaryConfirm}
        onEdit={handleSummaryEdit}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
      />
    )
  }

  if (currentStep === 'workplace') {
    return (
      <div key="workplace-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  🏢 Workplace Setup Complete!
                </h3>
                <p className="text-xs text-gray-600">
                  Your offshore team setup is ready. Here's what we'll provide:
                </p>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="text-lime-600 font-semibold">✓</span>
                  <span><strong>Dedicated Workspace:</strong> Professional office space with high-speed internet</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lime-600 font-semibold">✓</span>
                  <span><strong>Equipment:</strong> Computers, monitors, and all necessary tools</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lime-600 font-semibold">✓</span>
                  <span><strong>Management:</strong> Local team lead and project coordination</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lime-600 font-semibold">✓</span>
                  <span><strong>Communication:</strong> Daily standups and progress reports</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lime-600 font-semibold">✓</span>
                  <span><strong>Quality Assurance:</strong> Regular performance reviews and feedback</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={() => onStepChange(null)}
                  size="sm"
                  className="w-full"
                >
                  Get Started with Your Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Job Description Step Component
interface JobDescriptionStepProps {
  onComplete: (value: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  formData: any
}

const JobDescriptionStep = ({ onComplete, setMessages, generateMessageId, formData }: JobDescriptionStepProps) => {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      // Call AI to generate job description based on form data
      const response = await fetch('/api/generate-job-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamSize: formData.teamSize,
          roleType: formData.roleType,
          roles: formData.roles,
          experience: formData.experience,
          industry: formData.industry,
          budget: formData.budget
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate job description')
      }

      const data = await response.json()
      setDescription(data.description)
    } catch (error) {
      console.error('Error generating job description:', error)
      // Fallback description
      const experienceText = {
        'entry': 'entry level',
        'mid': 'mid level', 
        'senior': 'senior level',
        'mixed': 'mixed experience levels'
      }[formData.experience] || formData.experience || 'various experience levels';
      
      setDescription(`We are looking for ${formData.teamSize} ${formData.roleType === 'same' ? 'team members' : 'professionals'} in ${formData.roles || 'various roles'} with ${experienceText} experience. This is a great opportunity to work with an international team.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Add user message to chat
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: `Job description: ${description || 'Not provided'}`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    // Call the completion handler
    onComplete(description || 'Not provided')
    
    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            M
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Job description?</h3>
            <p className="text-sm text-gray-600">Tell me more about the job requirements or let me generate one for you</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <textarea
              placeholder="Describe the job requirements, skills needed, or specific requirements"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={6}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50 text-sm resize-none overflow-y-auto"
              style={{ minHeight: '120px', maxHeight: '200px' }}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!description.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
