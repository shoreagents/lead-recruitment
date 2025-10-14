"use client"

import { MayaTextField } from './MayaTextField'
import { MayaSummaryCard } from './MayaSummaryCard'

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
          description: formData.description
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save pricing information');
      }

      const result = await response.json();
      console.log('Pricing info saved:', result);

      onStepChange(null)
      
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
      <MayaTextField
        key="roleType-step"
        step="roleType"
        title="Same role or different roles?"
        description="Do you need the same role for all team members or different roles?"
        placeholder="Type 'same' for same role or 'different' for different roles"
        inputType="text"
        validation={(value) => /^(same|different)$/i.test(value)}
        onComplete={handleRoleTypeComplete}
        setMessages={setMessages}
        generateMessageId={generateMessageId}
        nextStep="roles"
        nextQuestion="Perfect! Now let me know what specific roles you need."
      />
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

  if (currentStep === 'description') {
    return (
      <MayaTextField
        key="description-step"
        step="description"
        title="Project details?"
        description="Tell me more about your project or specific requirements"
        placeholder="Describe your project, skills needed, or any specific requirements"
        inputType="text"
        onComplete={handleDescriptionComplete}
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
