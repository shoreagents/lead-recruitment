"use client"

import { MayaTextField } from './MayaTextField'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaInterviewRequestFormProps {
  currentStep: string
  onStepChange: (step: string | null) => void
  onFormDataChange: (data: any) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  formData: any
}

export const MayaInterviewRequestForm = ({
  currentStep,
  onStepChange,
  onFormDataChange,
  setMessages,
  generateMessageId,
  formData
}: MayaInterviewRequestFormProps) => {
  const handleCandidateNameComplete = (value: string) => {
    onFormDataChange({ ...formData, candidateName: value })
    onStepChange('position')
  }

  const handlePositionComplete = (value: string) => {
    onFormDataChange({ ...formData, position: value })
    onStepChange('interviewDate')
  }

  const handleInterviewDateComplete = (value: string) => {
    onFormDataChange({ ...formData, interviewDate: value })
    onStepChange(null)
    
    // Add completion message
    const completionMessage: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: `Perfect! I've scheduled an interview for ${formData.candidateName} for the ${formData.position} position on ${value}. I'll send you a confirmation email shortly! 📅`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, completionMessage])
  }

  if (currentStep === 'candidateName') {
    return (
      <MayaTextField
        step="candidateName"
        title="What's the candidate's name?"
        description="Enter the full name of the candidate"
        placeholder="Enter candidate's name"
        inputType="text"
        onComplete={handleCandidateNameComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="position"
        nextQuestion="What position are they applying for?"
      />
    )
  }

  if (currentStep === 'position') {
    return (
      <MayaTextField
        step="position"
        title="What position are they applying for?"
        description="Enter the job title or position"
        placeholder="Enter job position"
        inputType="text"
        onComplete={handlePositionComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="interviewDate"
        nextQuestion="When would you like to schedule the interview?"
      />
    )
  }

  if (currentStep === 'interviewDate') {
    return (
      <MayaTextField
        step="interviewDate"
        title="When would you like to schedule the interview?"
        description="Select your preferred date"
        placeholder="Select interview date"
        inputType="date"
        onComplete={handleInterviewDateComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
      />
    )
  }

  return null
}
