"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaTextFieldProps {
  step: string
  title: string
  description: string
  placeholder: string
  inputType?: 'text' | 'email' | 'number' | 'password'
  validation?: (value: string) => boolean
  onComplete: (value: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  nextStep?: string
  nextQuestion?: string
  isOptional?: boolean
}

export const MayaTextField = ({
  step,
  title,
  description,
  placeholder,
  inputType = 'text',
  validation = (value) => value.trim().length > 0,
  onComplete,
  setMessages,
  generateMessageId,
  nextStep,
  nextQuestion,
  isOptional = false
}: MayaTextFieldProps) => {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!validation(value) && !isOptional) return
    
    setIsSubmitting(true)
    
    // Add user message to chat
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: `${title.replace('?', '')}: ${value || (isOptional ? 'Not provided' : value)}`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    // Call the completion handler
    onComplete(value || (isOptional ? 'Not provided' : value))
    
    // Add next question if provided
    if (nextStep && nextQuestion) {
      const nextMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: nextQuestion,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, nextMessage])
    }
    
    setIsSubmitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit()
    }
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
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!validation(value) && !isOptional || isSubmitting}
            className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '...' : '✓'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
