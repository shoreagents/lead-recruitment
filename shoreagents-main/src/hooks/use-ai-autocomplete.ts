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
}

export const useAIAutocomplete = (options: UseAIAutocompleteOptions = {}) => {
  const {
    debounceMs = 300,
    minLength = 2,
    maxSuggestions = 3
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
      const response = await fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          context,
          maxSuggestions
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        console.warn('Autocomplete API error:', data.error)
        setError(data.error)
      }
      
      setSuggestions(data.suggestions || [])
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
