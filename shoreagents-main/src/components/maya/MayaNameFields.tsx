"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaNameFieldsProps {
  onComplete: (firstName: string, surname: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  nextStep?: string
  nextQuestion?: string
}

export const MayaNameFields = ({
  onComplete,
  setMessages,
  generateMessageId,
  nextStep,
  nextQuestion
}: MayaNameFieldsProps) => {
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!firstName.trim() || !surname.trim()) return
    
    setIsSubmitting(true)
    
    // Add user message to chat
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: `Name: ${firstName} ${surname}`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    
    // Call the completion handler
    onComplete(firstName, surname)
    
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
    if (e.key === 'Enter' && !isSubmitting && firstName.trim() && surname.trim()) {
      handleSubmit()
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
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            M
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">What's your name?</h3>
            <p className="text-sm text-gray-600">Please enter your first name and surname</p>
          </div>
        </div>
        <div className="flex gap-1 w-full">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50"
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!firstName.trim() || !surname.trim() || isSubmitting}
            className="flex-shrink-0 px-3 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isSubmitting ? '...' : '✓'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
