"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Check, X } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaSummaryCardProps {
  formData: any
  onConfirm: () => void
  onEdit: (field: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
}

export const MayaSummaryCard = ({
  formData,
  onConfirm,
  onEdit,
  setMessages,
  generateMessageId
}: MayaSummaryCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    
    // Add user confirmation message to chat
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: 'Yes, that\'s correct!',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    // Call the confirmation handler
    onConfirm()
    
    setIsSubmitting(false)
  }

  const handleEdit = (field: string) => {
    // Add user edit message to chat
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: `I need to edit my ${field}`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    // Call the edit handler
    onEdit(field)
  }

  const getFieldDisplay = (field: string) => {
    switch (field) {
      case 'name':
        return formData.firstName && formData.surname 
          ? `${formData.firstName} ${formData.surname}`
          : formData.name || 'Not provided'
      case 'email':
        return formData.email || 'Not provided'
      case 'company':
        return formData.company || 'Not provided'
      default:
        return 'Not provided'
    }
  }

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'name':
        return 'Full Name'
      case 'email':
        return 'Email Address'
      case 'company':
        return 'Company'
      default:
        return field
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-full"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            M
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Please review your information</h3>
            <p className="text-sm text-gray-600">Make sure everything looks correct before we continue</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {/* Name Field */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{getFieldLabel('name')}</p>
              <p className="text-sm text-gray-900">{getFieldDisplay('name')}</p>
            </div>
            <button
              onClick={() => handleEdit('name')}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
            >
              <Edit3 size={12} />
              Edit
            </button>
          </div>

          {/* Email Field */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{getFieldLabel('email')}</p>
              <p className="text-sm text-gray-900">{getFieldDisplay('email')}</p>
            </div>
            <button
              onClick={() => handleEdit('email')}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
            >
              <Edit3 size={12} />
              Edit
            </button>
          </div>

          {/* Company Field */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{getFieldLabel('company')}</p>
              <p className="text-sm text-gray-900">{getFieldDisplay('company')}</p>
            </div>
            <button
              onClick={() => handleEdit('company')}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
            >
              <Edit3 size={12} />
              Edit
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Check size={16} />
            {isSubmitting ? 'Confirming...' : 'Yes, that\'s correct!'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
