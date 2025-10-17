import { useState } from 'react'
import { updateSupabaseDisplayName, getCurrentSupabaseMetadata, testSupabaseUpdate } from '@/lib/update-supabase-display-name'

interface UseSupabaseDisplayNameReturn {
  updateDisplayName: (data: {
    first_name: string
    last_name: string
    full_name: string
    location?: string
    phone?: string
    position?: string
    bio?: string
    company?: string
  }) => Promise<boolean>
  getCurrentMetadata: () => Promise<any>
  testConnection: () => Promise<boolean>
  loading: boolean
  error: string | null
}

/**
 * React hook for managing Supabase display name updates
 */
export function useSupabaseDisplayName(userId: string): UseSupabaseDisplayNameReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDisplayName = async (data: {
    first_name: string
    last_name: string
    full_name: string
    location?: string
    phone?: string
    position?: string
    bio?: string
    company?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Updating Supabase display name via hook...')
      await updateSupabaseDisplayName(userId, data)
      
      console.log('✅ Supabase display name updated successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Failed to update Supabase display name:', errorMessage)
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getCurrentMetadata = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Getting current Supabase metadata...')
      const result = await getCurrentSupabaseMetadata(userId)
      
      console.log('✅ Current metadata retrieved:', result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Failed to get current metadata:', errorMessage)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async (): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🧪 Testing Supabase connection...')
      await testSupabaseUpdate(userId)
      
      console.log('✅ Supabase connection test successful')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Supabase connection test failed:', errorMessage)
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    updateDisplayName,
    getCurrentMetadata,
    testConnection,
    loading,
    error
  }
}

