"use client"

import { useState, useCallback, useRef, useEffect } from 'react'

interface AutocompleteSuggestion {
  text: string
  confidence: number
}

interface UseAIAutocompleteOptions {
  debounceMs?: number
  minLength?: number
  maxSuggestions?: number
  defaultType?: 'industry' | 'role' | 'description'
}

export const useAIAutocomplete = (options: UseAIAutocompleteOptions = {}) => {
  const {
    debounceMs = 300,
    minLength = 2,
    maxSuggestions = 3,
    defaultType = 'role'
  } = options

  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const fetchSuggestions = useCallback(async (input: string, context: string = '') => {
    if (input.length < minLength) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Determine the type based on context or use defaultType
      let type = defaultType
      if (context.includes('industry')) {
        type = 'industry'
      } else if (context.includes('description')) {
        type = 'description'
      }
      

      const response = await fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          user_id: 'maya-field', // Add user_id for Maya fields
          type: type,
          industry: '',
          roleTitle: ''
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('🔍 Autocomplete API response:', data)
      
      if (data.error) {
        console.warn('Autocomplete API error:', data.error)
        setError(data.error)
        setSuggestions([]) // Don't show any suggestions on error
        return
      }
      
      // The API returns an array directly, not wrapped in suggestions
      const suggestionsArray = Array.isArray(data) ? data : (data.suggestions || [])
      console.log('📋 Suggestions array:', suggestionsArray)
      
      if (suggestionsArray.length === 0) {
        console.log('📭 No AI suggestions available')
        setSuggestions([])
        return
      }
      
      // Transform the API response to match the expected format
      const transformedSuggestions = suggestionsArray.map((item: any, index: number) => ({
        text: item.title || item.text || item,
        confidence: item.confidence || (0.9 - (index * 0.1)) // Dynamic confidence based on order
      }))
      
      console.log('✨ Transformed suggestions:', transformedSuggestions)
      setSuggestions(transformedSuggestions)
    } catch (err) {
      console.error('Autocomplete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [minLength, maxSuggestions])

  const debouncedFetchSuggestions = useCallback((input: string, context: string = '') => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(input, context)
    }, debounceMs)
  }, [fetchSuggestions, debounceMs])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions: debouncedFetchSuggestions,
    clearSuggestions
  }
}
