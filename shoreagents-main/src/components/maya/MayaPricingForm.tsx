"use client"

import { MayaTextField } from './MayaTextField'
import { MayaSummaryCard } from './MayaSummaryCard'
import { MayaPricingSummaryCard } from './MayaPricingSummaryCard'
import { CandidateRecommendation } from '@/lib/bpocPricingService'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useFetchBPOCCandidates } from '@/hooks/useBPOCCandidates'

// Real BPOC candidate recommendation function (same as pricing calculator)
async function fetchBPOCCandidateRecommendations(
  role: string, 
  level: 'entry' | 'mid' | 'senior', 
  industry?: string, 
  memberCount?: number
) {
  try {
    console.log(`🔍 Fetching real BPOC candidates for: ${role} (${level} level) in ${industry} industry`);
    
    const response = await fetch('/api/bpoc-candidates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        level,
        industry
      }),
    });

    if (!response.ok) {
      throw new Error(`BPOC API error: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Found ${result.totalCandidates} real BPOC candidates for ${role}`);
    return result;
  } catch (error) {
    console.error(`❌ BPOC candidate API error for ${role}:`, error);
    throw error;
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'candidates' | 'summary'
  data?: any
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
  // Use custom TanStack Query hook for BPOC candidates
  const fetchCandidatesMutation = useFetchBPOCCandidates()

  // Helper function to capitalize first letter of each word
  const capitalizeName = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
  const handleTeamSizeComplete = (value: string) => {
    onFormDataChange({ ...formData, teamSize: value })
    
    // If team size is 2 or more, ask about role type first
    const teamSize = parseInt(value)
    if (teamSize >= 2) {
      onStepChange('roleType')
    } else {
      // For single member, go to industry first, then individual roles
      onFormDataChange({ ...formData, teamSize: value, currentMember: 1 })
      onStepChange('industry')
    }
  }

  const handleRoleTypeComplete = (value: string) => {
    onFormDataChange({ ...formData, roleType: value })
    onStepChange('industry')
  }

  const handleIndustryComplete = (value: string) => {
    const teamSize = parseInt(formData.teamSize || '1')
    const isSameRole = formData.roleType?.toLowerCase() === 'same'
    
    // For single member, always go to individual roles
    if (teamSize === 1) {
      onFormDataChange({ ...formData, industry: value, currentMember: 1 })
      onStepChange('individualRoles')
    } else if (isSameRole) {
      // Same role for all members - go directly to individual roles (just one member)
      onFormDataChange({ ...formData, industry: value, currentMember: 1 })
      onStepChange('individualRoles')
    } else {
      // Different roles - start collecting individual roles
      onFormDataChange({ ...formData, industry: value, currentMember: 1 })
      onStepChange('individualRoles')
    }
  }


  const handleIndividualRoleComplete = (value: string) => {
    const currentMember = formData.currentMember || 1
    const teamSize = parseInt(formData.teamSize || '1')
    const isSameRole = formData.roleType?.toLowerCase() === 'same'
    
    // Store the role for the current member
    const updatedFormData = {
      ...formData,
      [`member${currentMember}Role`]: value
    }
    
    if (isSameRole) {
      // Same role for all members - copy the role to all members
      const allMembersData = { ...updatedFormData }
      for (let i = 1; i <= teamSize; i++) {
        allMembersData[`member${i}Role`] = value
      }
      onFormDataChange(allMembersData)
      
      // Check team size for experience setup
      if (teamSize === 1) {
        onStepChange('experience')
      } else {
        onStepChange('experienceSetup')
      }
    } else {
      // Different roles - continue with individual collection
      if (currentMember < teamSize) {
        // Move to next member
        onFormDataChange({ ...updatedFormData, currentMember: currentMember + 1 })
        onStepChange('individualRoles')
      } else {
        // All members done, check team size for experience setup
        onFormDataChange(updatedFormData)
        if (teamSize === 1) {
          onStepChange('experience')
        } else {
          onStepChange('experienceSetup')
        }
      }
    }
  }

  const handleExperienceComplete = (value: string) => {
    const teamSize = parseInt(formData.teamSize || '1')
    
    // Check if we're coming from "same experience" flow
    if (formData.experienceSetup === 'yes') {
      // Apply the same experience level to all members
      const updatedFormData = { ...formData, experience: value }
      
      // Set the experience for all members
      for (let i = 1; i <= teamSize; i++) {
        updatedFormData[`member${i}Experience`] = value
      }
      
      onFormDataChange(updatedFormData)
      onStepChange('description')
    } else {
      // Original logic for different experience levels
      onFormDataChange({ ...formData, experience: value })
      
      if (teamSize === 1) {
        // For single team member, go directly to description
        onStepChange('description')
      } else {
        // For multiple team members, ask about same experience level
        onStepChange('experienceSetup')
      }
    }
  }

  const handleDescriptionComplete = (value: string) => {
    onFormDataChange({ ...formData, description: value })
    
    // Check team size - if only 1 member, skip workplace setup question
    const teamSize = parseInt(formData.teamSize || '1')
    if (teamSize === 1) {
      // For single team member, go directly to workplace type selection
      onFormDataChange({ ...formData, description: value, workplaceSetup: 'yes' })
      onStepChange('workplaceType')
    } else {
      // For multiple team members, ask about same setup
      onStepChange('workplaceSetup')
    }
  }

  const handleWorkplaceSetupComplete = (value: string) => {
    console.log('🏢 Workplace Setup Complete:', { value, formData })
    onFormDataChange({ ...formData, workplaceSetup: value })
    if (value.toLowerCase() === 'yes') {
      onStepChange('workplaceType')
    } else {
      // Initialize currentMember to 1 for individual setup
      const individualData = { ...formData, workplaceSetup: value, currentMember: 1 }
      console.log('🔄 Starting individual setup:', individualData)
      onFormDataChange(individualData)
      onStepChange('workplaceIndividual')
    }
  }

  const handleWorkplaceTypeComplete = (value: string) => {
    onFormDataChange({ ...formData, workplaceType: value })
    onStepChange('summary')
  }

  const handleWorkplaceIndividualComplete = (value: string) => {
    const currentMember = formData.currentMember || 1
    const teamSize = parseInt(formData.teamSize || '1')
    
    console.log('🏢 Workplace Individual Complete:', {
      currentMember,
      teamSize,
      value,
      formData
    })
    
    const workplaceData = {
      ...formData,
      [`member${currentMember}Workplace`]: value
    }
    
    // Update the form data with the workplace choice
    onFormDataChange(workplaceData)
    
    if (currentMember < teamSize) {
      // Move to next member
      const nextMemberData = { ...workplaceData, currentMember: currentMember + 1 }
      console.log('🔄 Moving to next member:', nextMemberData)
      onFormDataChange(nextMemberData)
      onStepChange('workplaceIndividual')
    } else {
      // All members done, go to summary
      console.log('✅ All members completed, going to summary')
      onStepChange('summary')
    }
  }

  const handleExperienceSetupComplete = (value: string) => {
    console.log('🎯 Experience Setup Complete:', { value, formData })
    onFormDataChange({ ...formData, experienceSetup: value })
    if (value.toLowerCase() === 'yes') {
      // Go to experience selection step for same experience level
      onStepChange('experience')
    } else {
      // Initialize currentMember to 1 for individual experience setup
      const individualData = { ...formData, experienceSetup: value, currentMember: 1 }
      console.log('🔄 Starting individual experience setup:', individualData)
      onFormDataChange(individualData)
      onStepChange('experienceIndividual')
    }
  }

  const handleExperienceIndividualComplete = (value: string) => {
    const currentMember = formData.currentMember || 1
    const teamSize = parseInt(formData.teamSize || '1')
    
    console.log('🎯 Experience Individual Complete:', {
      currentMember,
      teamSize,
      value,
      formData
    })
    
    const experienceData = {
      ...formData,
      [`member${currentMember}Experience`]: value
    }
    
    // Update the form data with the experience choice
    onFormDataChange(experienceData)
    
    if (currentMember < teamSize) {
      // Move to next member
      const nextMemberData = { ...experienceData, currentMember: currentMember + 1 }
      console.log('🔄 Moving to next member:', nextMemberData)
      onFormDataChange(nextMemberData)
      onStepChange('experienceIndividual')
    } else {
      // All members done, go to description
      console.log('✅ All members completed, going to description')
      onStepChange('description')
    }
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

      // Move to candidate recommendation step
      onStepChange('candidateRecommendation')
      
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


  const handleCandidateRecommendationComplete = (value: string) => {
    // Add user response message to chat
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: value === 'yes' ? 'Yes, show me recommended candidates' : 'No, I\'m good with the quote for now',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    if (value === 'yes') {
      // Show confirmation step first
      onStepChange('candidateConfirmation')
    } else {
      // User doesn't want recommendations, close the form
      onStepChange(null)
      
      // Add Maya's response
      const mayaMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'No problem! You have your personalized quote. Feel free to reach out anytime if you\'d like to see candidate recommendations or have any questions. Good luck with your project! 🚀',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, mayaMessage])
    }
  }

  const handleCandidateConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
      // Add Maya's response
      const mayaMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Perfect! Let me find some talented professionals that match your requirements. Here are my top recommendations for your team: 🎯',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, mayaMessage])
      
      // Get the main role and experience level from form data
      // Extract role from member1Role (first member's role)
      const mainRole = formData.member1Role || formData.roles
      const experienceLevel = formData.experience || 'mid'
      const industry = formData.industry || undefined
      
      console.log('🔍 Candidate fetch data:', { mainRole, experienceLevel, industry, formData })
      
      // Don't fetch candidates if role is not specified
      if (!mainRole || mainRole.trim() === '') {
        console.log('⚠️ No role specified, skipping candidate fetch')
        onStepChange(null)
        return
      }
      
      // Fetch candidates using TanStack Query mutation
      const result = await fetchCandidatesMutation.mutateAsync({
        role: mainRole,
        level: experienceLevel as 'entry' | 'mid' | 'senior',
        industry
      })
      
      // Add candidates as a special message type
      const candidatesMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Recommended Candidates',
        timestamp: new Date(),
        type: 'candidates',
        data: { candidates: result.recommendedCandidates }
      }
      setMessages(prev => [...prev, candidatesMessage])
      
      // Close the form after showing candidates
      onStepChange(null)
    } else {
      // User declined, go back to summary
      const mayaMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'No problem! You can always ask me to show candidates later. Is there anything else you\'d like to know about your quote?',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, mayaMessage])
      onStepChange(null)
    }
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

  if (currentStep === 'industry') {
    return (
      <MayaTextField
        key="industry-step"
        step="industry"
        title="What industry does your business operate in?"
        description="This helps me provide more relevant talent recommendations for your specific industry needs."
        placeholder="e.g., Technology, Healthcare, Finance, Real Estate, Marketing"
        inputType="text"
        onComplete={handleIndustryComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="roles"
        nextQuestion="Great! Now let's specify the roles you need."
        enableAutocomplete={true}
        autocompleteContext="business industries for offshore staffing"
        autocompleteType="industry"
      />
    )
  }


  if (currentStep === 'individualRoles') {
    const currentMember = formData.currentMember || 1
    const teamSize = parseInt(formData.teamSize || '1')
    const isSameRole = formData.roleType?.toLowerCase() === 'same'
    
    return (
      <MayaTextField
        key={`individual-roles-step-member-${currentMember}`}
        step="individualRoles"
        title={isSameRole ? "What role do you need?" : `What role does member ${currentMember} need?`}
        description={isSameRole ? 
          `Please specify the role for all ${teamSize} team members` : 
          `Please specify the role for team member ${currentMember} of ${teamSize}`}
        placeholder="e.g., Software Developer, Marketing Manager, Customer Service Rep"
        inputType="text"
        onComplete={handleIndividualRoleComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="experience"
        nextQuestion="Great! What experience level are you looking for?"
        enableAutocomplete={true}
        autocompleteContext="job roles and positions for offshore staffing"
        autocompleteType="role"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'experienceSetup') {
    return (
      <div key="experience-setup-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  🎯 Experience Level Setup
                </h3>
                <p className="text-xs text-gray-600">
                  Do they have the same experience level?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleExperienceSetupComplete('yes')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Yes, same experience level for all
                </Button>
                <Button
                  onClick={() => handleExperienceSetupComplete('no')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  No, different experience levels needed
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'experienceIndividual') {
    const currentMember = formData.currentMember || 1
    const teamSize = parseInt(formData.teamSize || '1')
    const memberRole = formData[`member${currentMember}Role`] || 'Team Member'
    
    return (
      <div key={`experience-individual-step-member-${currentMember}`} className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  🎯 Experience Level - {memberRole}
                </h3>
                <p className="text-xs text-gray-600">
                  What experience level does the {memberRole} need?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleExperienceIndividualComplete('entry')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Entry Level (0-2 years)
                </Button>
                <Button
                  onClick={() => handleExperienceIndividualComplete('mid')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Mid Level (3-5 years)
                </Button>
                <Button
                  onClick={() => handleExperienceIndividualComplete('senior')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Senior Level (6+ years)
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
      <MayaPricingSummaryCard
        formData={formData}
        onConfirm={handleSummaryConfirm}
        onEdit={handleSummaryEdit}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
      />
    )
  }

  if (currentStep === 'candidateRecommendation') {
    return (
      <div key="candidate-recommendation-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  Would you like to see recommended candidates?
                </h3>
                <p className="text-xs text-gray-600">
                  I can show you talented professionals that match your specific requirements
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleCandidateRecommendationComplete('yes')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Yes, show me recommended candidates
                </Button>
                <Button
                  onClick={() => handleCandidateRecommendationComplete('no')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  No, I'm good with the quote for now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Candidates are now rendered as messages in the chat history, not as a separate step
  // This step has been removed - candidates appear as a special message type
  
  // Return null for showCandidates step since it's now handled in messages
  if (currentStep === 'showCandidates') {
    return null
  }
  if (currentStep === 'candidateConfirmation') {
    return (
      <div key="candidate-confirmation-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  Ready to see your candidates?
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  I'll search our talent database to find the best professionals that match your specific requirements.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleCandidateConfirmation(true)}
                  size="sm"
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                >
                  Yes, Show Candidates
                </Button>
                <Button
                  onClick={() => handleCandidateConfirmation(false)}
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                >
                  Not Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'workplaceSetup') {
    return (
      <div key="workplace-setup-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  🏢 Workplace Setup
                </h3>
                <p className="text-xs text-gray-600">
                  Do they have the same workplace setup?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleWorkplaceSetupComplete('yes')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  Yes, same setup for all
                </Button>
                <Button
                  onClick={() => handleWorkplaceSetupComplete('no')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  No, different setups needed
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'workplaceType') {
    return (
      <div key="workplace-type-step" className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  🏢 Workplace Type
                </h3>
                <p className="text-xs text-gray-600">
                  What type of workplace setup do you need?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleWorkplaceTypeComplete('work-from-home')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  🏠 Work from Home
                </Button>
                <Button
                  onClick={() => handleWorkplaceTypeComplete('hybrid')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  🏢 Hybrid (Home + Office)
                </Button>
                <Button
                  onClick={() => handleWorkplaceTypeComplete('full-office')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  🏢 Full Office
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'workplaceIndividual') {
    const currentMember = formData.currentMember || 1
    const teamSize = parseInt(formData.teamSize || '1')
    const memberRole = formData[`member${currentMember}Role`] || 'Team Member'
    
    return (
      <div key={`workplace-individual-step-member-${currentMember}`} className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          {/* Maya's Message Bubble without Avatar */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  🏢 Workplace Setup - {memberRole}
                </h3>
                <p className="text-xs text-gray-600">
                  What type of workplace setup does the {memberRole} need?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleWorkplaceIndividualComplete('work-from-home')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  🏠 Work from Home
                </Button>
                <Button
                  onClick={() => handleWorkplaceIndividualComplete('hybrid')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  🏢 Hybrid (Home + Office)
                </Button>
                <Button
                  onClick={() => handleWorkplaceIndividualComplete('full-office')}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto justify-start"
                >
                  🏢 Full Office
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      const experienceMap = {
        'entry': 'entry level',
        'mid': 'mid level', 
        'senior': 'senior level',
        'mixed': 'mixed experience levels'
      } as const;
      
      const experienceText = experienceMap[formData.experience as keyof typeof experienceMap] || formData.experience || 'various experience levels';
      
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
        <div>
          <h3 className="font-semibold text-gray-900">Job description?</h3>
          <p className="text-sm text-gray-600">Tell me more about the job requirements or let me generate one for you</p>
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

// Component to render candidates as a message in the chat
export function MayaCandidatesMessage({ candidates }: { candidates: CandidateRecommendation[] }) {
  const capitalizeName = (name: string) => {
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Recommended Candidates
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Here are talented professionals that match your requirements
              </p>
            </div>
            
            {candidates.length > 0 ? (
              <div className="space-y-3">
                {candidates.slice(0, 10).map((candidate) => (
                  <div key={candidate.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="shrink-0">
                        {candidate.avatar && candidate.avatar.trim() !== '' ? (
                          <img 
                            src={candidate.avatar} 
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              console.log('Avatar failed to load for', candidate.name, 'URL:', candidate.avatar);
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                            onLoad={() => {
                              console.log('Avatar loaded successfully for', candidate.name);
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white font-semibold text-sm ${candidate.avatar && candidate.avatar.trim() !== '' ? 'hidden' : ''}`}>
                          {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm text-gray-900">{capitalizeName(candidate.name)}</h4>
                          <p className="text-xs text-gray-600 mb-1">{capitalizeName(candidate.position)}</p>
                          <p className="text-xs text-gray-500">{candidate.experience}</p>
                          {candidate.skills && candidate.skills.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              <span className="font-medium">Skills:</span> {candidate.skills.slice(0, 3).join(', ')}
                              {candidate.skills.length > 3 && ` +${candidate.skills.length - 3} more`}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded whitespace-nowrap">
                              {candidate.isRecommended ? 'Recommended' : 'Available'}
                            </span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              ₱{candidate.expectedSalary.toLocaleString()}/month
                            </span>
                            {candidate.matchScore > 0 && (
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {Math.round(candidate.matchScore)}% match
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <Button size="sm" className="text-xs w-full">
                              View Profile
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs w-full border-lime-500 text-lime-700 hover:bg-lime-50"
                            >
                              Ask for Interview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-2">We don't have matching candidates yet</p>
                <p className="text-xs text-gray-600 mb-4">
                  We're sorry, but we don't currently have candidates that match this specific role in our talent pool. Our database is constantly growing!
                </p>
                <a 
                  href="/we-got-talent" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-medium text-lime-700 hover:text-lime-800 hover:underline"
                >
                  Browse our full talent pool
                  <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
