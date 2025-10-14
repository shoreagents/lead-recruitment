import { useState, useEffect } from 'react'
import { 
  fetchBPOCEmployeeData, 
  getActiveEmployees, 
  getEmployeesByWorkStatus,
  getEmployeesByPosition,
  getEmployeesWithAnalysis,
  getTopPerformingEmployees,
  searchEmployees,
  getEmployeeStatistics,
  type BPOCUser 
} from '@/lib/bpocApiService'

export function useBPOCEmployees() {
  const [employees, setEmployees] = useState<BPOCUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchBPOCEmployeeData()
      setEmployees(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const getActive = async () => {
    try {
      return await getActiveEmployees()
    } catch (err) {
      console.error('Error getting active employees:', err)
      return []
    }
  }

  const getByWorkStatus = async (status: string) => {
    try {
      return await getEmployeesByWorkStatus(status)
    } catch (err) {
      console.error('Error getting employees by work status:', err)
      return []
    }
  }

  const getByPosition = async (position: string) => {
    try {
      return await getEmployeesByPosition(position)
    } catch (err) {
      console.error('Error getting employees by position:', err)
      return []
    }
  }

  const getWithAnalysis = async () => {
    try {
      return await getEmployeesWithAnalysis()
    } catch (err) {
      console.error('Error getting employees with analysis:', err)
      return []
    }
  }

  const getTopPerformers = async (limit: number = 10) => {
    try {
      return await getTopPerformingEmployees(limit)
    } catch (err) {
      console.error('Error getting top performing employees:', err)
      return []
    }
  }

  const search = async (query: string) => {
    try {
      return await searchEmployees(query)
    } catch (err) {
      console.error('Error searching employees:', err)
      return []
    }
  }

  const getStats = async () => {
    try {
      return await getEmployeeStatistics()
    } catch (err) {
      console.error('Error getting employee statistics:', err)
      return null
    }
  }

  return {
    employees,
    loading,
    error,
    loadEmployees,
    getActive,
    getByWorkStatus,
    getByPosition,
    getWithAnalysis,
    getTopPerformers,
    search,
    getStats
  }
}

