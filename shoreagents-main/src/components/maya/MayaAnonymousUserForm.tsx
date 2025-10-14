"use client"

import { MayaTextField } from './MayaTextField'
import { MayaNameFields } from './MayaNameFields'
import { MayaSummaryCard } from './MayaSummaryCard'
import { getStatusBasedQuestion } from '@/lib/ai-config'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaAnonymousUserFormProps {
  currentStep: string
  onStepChange: (step: string | null) => void
  onFormDataChange: (data: any) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  formData: any
  conversationContext?: { isTalentInquiry?: boolean; conversationHistory?: Message[] }
}

export const MayaAnonymousUserForm = ({
  currentStep,
  onStepChange,
  onFormDataChange,
  setMessages,
  generateMessageId,
  formData,
  conversationContext
}: MayaAnonymousUserFormProps) => {
  const handleNameComplete = (firstName: string, surname: string) => {
    const fullName = `${firstName} ${surname}`.trim()
    onFormDataChange({ ...formData, firstName, surname, name: fullName })
    onStepChange('email')
  }

  const handleEmailComplete = (value: string) => {
    onFormDataChange({ ...formData, email: value })
    onStepChange('company')
  }

  const handleCompanyComplete = (value: string) => {
    onFormDataChange({ ...formData, company: value })
    onStepChange('summary')
  }

  const handleSummaryConfirm = async () => {
    try {
      // Save contact information to database
      const response = await fetch('/api/save-contact-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId || 'anonymous_' + Date.now(), // Generate userId if not provided
          firstName: formData.firstName,
          surname: formData.surname,
          email: formData.email,
          company: formData.company,
          summary: formData.summary
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save contact information');
      }

      const result = await response.json();
      console.log('Contact info saved:', result);

      onStepChange(null)
      
      // Add completion message
      const fullName = formData.firstName && formData.surname ? `${formData.firstName} ${formData.surname}` : formData.name || 'there'
      const completionMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Perfect! I have your information: ${fullName} (${formData.email}) from ${formData.company || 'Not provided'}. Thank you! 🎉`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, completionMessage])
      
      // Add status-based follow-up question after a short delay
      setTimeout(() => {
        const followUpMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: getStatusBasedQuestionForForm(formData),
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, followUpMessage])
      }, 1500)
    } catch (error) {
      console.error('Error saving contact information:', error);
      
      // Still proceed with the form completion even if database save fails
      onStepChange(null)
      
      const fullName = formData.firstName && formData.surname ? `${formData.firstName} ${formData.surname}` : formData.name || 'there'
      const completionMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Perfect! I have your information: ${fullName} (${formData.email}) from ${formData.company || 'Not provided'}. Thank you! 🎉`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, completionMessage])
      
      // Add status-based follow-up question after a short delay
      setTimeout(() => {
        const followUpMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: getStatusBasedQuestionForForm(formData),
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, followUpMessage])
      }, 1500)
    }
  }

  // Function to determine status-based follow-up questions
  const getStatusBasedQuestionForForm = (data: any) => {
    const hasCompany = data.company && data.company.trim() !== ''
    const hasIndustry = data.industry && data.industry.trim() !== ''
    
    // Create a mock userData object for the utility function
    const mockUserData = {
      user: {
        company: data.company || '',
        industry: data.industry || ''
      },
      quotes: [],
      userProfile: {
        recentActivity: []
      }
    }
    
    return getStatusBasedQuestion(mockUserData, conversationContext)
  }

  const handleSummaryEdit = (field: string) => {
    onStepChange(field)
  }

  if (currentStep === 'name') {
    return (
      <MayaNameFields
        key="name-step"
        onComplete={handleNameComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="email"
        nextQuestion={`Okay, great ${formData.firstName || 'there'}! So can I have your email?`}
      />
    )
  }

  if (currentStep === 'email') {
    return (
      <MayaTextField
        key="email-step"
        step="email"
        title="What's your email?"
        description="Please enter a valid email address"
        placeholder="Enter your email"
        inputType="email"
        validation={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
        onComplete={handleEmailComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="company"
        nextQuestion="What company do you work for? (Optional)"
      />
    )
  }

  if (currentStep === 'company') {
    return (
      <MayaTextField
        key="company-step"
        step="company"
        title="What company do you work for?"
        description="This is optional"
        placeholder="Enter company name (optional)"
        inputType="text"
        onComplete={handleCompanyComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        isOptional={true}
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

  return null
}
