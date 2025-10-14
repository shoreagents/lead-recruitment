"use client"

import { MayaTextField } from './MayaTextField'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaPricingCalculatorFormProps {
  currentStep: string
  onStepChange: (step: string | null) => void
  onFormDataChange: (data: any) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  formData: any
}

export const MayaPricingCalculatorForm = ({
  currentStep,
  onStepChange,
  onFormDataChange,
  setMessages,
  generateMessageId,
  formData
}: MayaPricingCalculatorFormProps) => {
  const handleTeamMembersComplete = (value: string) => {
    onFormDataChange({ ...formData, teamMembers: value })
    onStepChange('industry')
  }

  const handleIndustryComplete = (value: string) => {
    onFormDataChange({ ...formData, industry: value })
    onStepChange('role')
  }

  const handleRoleComplete = (value: string) => {
    onFormDataChange({ ...formData, role: value })
    onStepChange(null)
    
    // Add completion message
    const completionMessage: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: `Perfect! I have all your information: ${formData.teamMembers} team member${Number(formData.teamMembers) > 1 ? 's' : ''} for ${value} in the ${formData.industry} industry. Let me calculate your pricing quote! 📊`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, completionMessage])
  }

  if (currentStep === 'teamMembers') {
    return (
      <MayaTextField
        step="teamMembers"
        title="How many team members do you need?"
        description="Enter a number (at least 1)"
        placeholder="Enter number of team members"
        inputType="number"
        validation={(value) => !isNaN(Number(value)) && Number(value) >= 1}
        onComplete={handleTeamMembersComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="industry"
        nextQuestion="What industry are you in?"
      />
    )
  }

  if (currentStep === 'industry') {
    return (
      <MayaTextField
        step="industry"
        title="What industry are you in?"
        description="This helps us provide accurate pricing"
        placeholder="Enter your industry (e.g., Technology, Healthcare, Finance)"
        inputType="text"
        onComplete={handleIndustryComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="role"
        nextQuestion="What role are you looking for?"
      />
    )
  }

  if (currentStep === 'role') {
    return (
      <MayaTextField
        step="role"
        title="What role are you looking for?"
        description="Specify the type of professionals you need"
        placeholder="Enter role (e.g., Senior Developer, Mid-level Designer, Entry-level Analyst)"
        inputType="text"
        onComplete={handleRoleComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
      />
    )
  }

  return null
}
