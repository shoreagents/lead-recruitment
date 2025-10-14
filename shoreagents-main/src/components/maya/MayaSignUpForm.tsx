"use client"

import { MayaTextField } from './MayaTextField'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaSignUpFormProps {
  currentStep: string
  onStepChange: (step: string | null) => void
  onFormDataChange: (data: any) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  formData: any
}

export const MayaSignUpForm = ({
  currentStep,
  onStepChange,
  onFormDataChange,
  setMessages,
  generateMessageId,
  formData
}: MayaSignUpFormProps) => {
  const handleFirstNameComplete = (value: string) => {
    onFormDataChange({ ...formData, firstName: value })
    onStepChange('lastName')
  }

  const handleLastNameComplete = (value: string) => {
    onFormDataChange({ ...formData, lastName: value })
    onStepChange('signupEmail')
  }

  const handleEmailComplete = (value: string) => {
    onFormDataChange({ ...formData, signupEmail: value })
    onStepChange('password')
  }

  const handlePasswordComplete = (value: string) => {
    onFormDataChange({ ...formData, password: value })
    onStepChange(null)
    
    // Add completion message
    const completionMessage: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: `Welcome aboard, ${formData.firstName}! Your account has been created successfully. You can now access all our features! 🎉`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, completionMessage])
  }

  if (currentStep === 'firstName') {
    return (
      <MayaTextField
        step="firstName"
        title="What's your first name?"
        description="Enter your first name"
        placeholder="Enter your first name"
        inputType="text"
        onComplete={handleFirstNameComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="lastName"
        nextQuestion="What's your last name?"
      />
    )
  }

  if (currentStep === 'lastName') {
    return (
      <MayaTextField
        step="lastName"
        title="What's your last name?"
        description="Enter your last name"
        placeholder="Enter your last name"
        inputType="text"
        onComplete={handleLastNameComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="signupEmail"
        nextQuestion="What's your email address?"
      />
    )
  }

  if (currentStep === 'signupEmail') {
    return (
      <MayaTextField
        step="signupEmail"
        title="What's your email address?"
        description="Enter a valid email address"
        placeholder="Enter your email"
        inputType="email"
        validation={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
        onComplete={handleEmailComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="password"
        nextQuestion="Create a secure password"
      />
    )
  }

  if (currentStep === 'password') {
    return (
      <MayaTextField
        step="password"
        title="Create a secure password"
        description="Choose a strong password"
        placeholder="Enter your password"
        inputType="password"
        validation={(value) => value.length >= 6}
        onComplete={handlePasswordComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
      />
    )
  }

  return null
}
