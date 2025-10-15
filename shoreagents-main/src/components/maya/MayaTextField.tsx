"use client"

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAIAutocomplete } from '@/hooks/use-ai-autocomplete'

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
  enableAutocomplete?: boolean
  autocompleteContext?: string
  autocompleteType?: 'industry' | 'role' | 'description'
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
  isOptional = false,
  enableAutocomplete = false,
  autocompleteContext = '',
  autocompleteType = 'role'
}: MayaTextFieldProps) => {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  
  const { suggestions, isLoading: isAutocompleteLoading, fetchSuggestions, clearSuggestions } = useAIAutocomplete({
    debounceMs: 300,
    minLength: 2,
    maxSuggestions: 3,
    defaultType: autocompleteType
  })
  
  // Reset value when step changes (for individual role collection)
  useEffect(() => {
    setValue('')
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    clearSuggestions()
  }, [step, clearSuggestions])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    setSelectedSuggestionIndex(-1)
    
    if (enableAutocomplete && newValue.length >= 2) {
      fetchSuggestions(newValue, autocompleteContext)
      setShowSuggestions(true)
    } else {
      clearSuggestions()
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    clearSuggestions()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        e.preventDefault()
        handleSuggestionClick(suggestions[selectedSuggestionIndex].text)
      } else if (!isSubmitting) {
        handleSubmit()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
      clearSuggestions()
    } else if (e.key === 'Tab' && selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedSuggestionIndex].text)
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }, 200)
  }

  const handleFocus = () => {
    if (enableAutocomplete && value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true)
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
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="relative">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type={inputType}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
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
          
          {/* AI Autocomplete Suggestions */}
          {enableAutocomplete && showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-lime-50 text-lime-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{suggestion.text}</span>
                    {isAutocompleteLoading && index === 0 && (
                      <div className="w-4 h-4 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  {suggestion.confidence && (
                    <div className="text-xs text-gray-500 mt-1">
                      Confidence: {Math.round(suggestion.confidence * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
