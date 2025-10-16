import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'

// Define the user type based on what the API returns
export interface BPOCUser {
  user_id: string
  first_name: string | null
  last_name: string | null
  full_name: string
  location: string | null
  avatar_url: string | null
  bio: string | null
  position: string | null
  current_position: string | null
  expected_salary: string | null
  work_status: string | null
  work_status_completed: boolean
  user_created_at: string | null
  overall_score: number
  key_strengths: string[]
  improvements: string[]
  recommendations: string[]
  improved_summary: string
  strengths_analysis: any
  candidate_profile: any
  skills_snapshot: string[]
  experience_snapshot: any[]
}

// Query keys for BPOC users
export const bpocUsersKeys = {
  all: ['bpoc-users'] as const,
  lists: () => [...bpocUsersKeys.all, 'list'] as const,
  list: (filters?: any) => [...bpocUsersKeys.lists(), filters] as const,
}

// Function to fetch BPOC users from API route
async function fetchBPOCUsersFromAPI(): Promise<BPOCUser[]> {
  const response = await fetch('/api/bpoc-users', {
    cache: 'no-store'
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error('API returned unsuccessful response')
  }
  
  return result.data
}

// Custom hook to fetch all BPOC users from API
export function useBPOCUsers(
  options?: Omit<UseQueryOptions<BPOCUser[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<BPOCUser[], Error>({
    queryKey: bpocUsersKeys.list(),
    queryFn: async () => {
      try {
        console.log('🔍 Fetching BPOC users from API...')
        const users = await fetchBPOCUsersFromAPI()
        console.log(`✅ Fetched ${users.length} BPOC users from API`)
        return users
      } catch (error) {
        console.error('❌ Error fetching BPOC users:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  })
}

// Custom hook to prefetch BPOC users
export function usePrefetchBPOCUsers() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.prefetchQuery({
      queryKey: bpocUsersKeys.list(),
      queryFn: fetchBPOCUsersFromAPI,
      staleTime: 5 * 60 * 1000,
    })
  }
}

