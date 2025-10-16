/**
 * Custom TanStack Query hook for BPOC candidate fetching
 * Provides caching, automatic refetching, and optimized data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CandidateRecommendation } from '@/lib/bpocPricingService';

interface FetchCandidatesParams {
  role: string;
  level: 'entry' | 'mid' | 'senior';
  industry?: string;
}

interface CandidateMatchResult {
  role: string;
  level: string;
  recommendedCandidates: CandidateRecommendation[];
  averageSalary: number;
  totalCandidates: number;
}

/**
 * Fetch BPOC candidates from the API
 */
async function fetchBPOCCandidates(params: FetchCandidatesParams): Promise<CandidateMatchResult> {
  console.log('🔍 Fetching BPOC candidates:', params);
  
  const response = await fetch('/api/bpoc-candidates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`BPOC API error: ${response.status}`);
  }

  const result = await response.json();
  console.log(`✅ Found ${result.totalCandidates} BPOC candidates`);
  
  return result;
}

/**
 * Query key factory for consistent cache key generation
 */
export const bpocCandidatesKeys = {
  all: ['bpoc-candidates'] as const,
  lists: () => [...bpocCandidatesKeys.all, 'list'] as const,
  list: (filters: Partial<FetchCandidatesParams>) => [...bpocCandidatesKeys.lists(), filters] as const,
  details: () => [...bpocCandidatesKeys.all, 'detail'] as const,
  detail: (id: string) => [...bpocCandidatesKeys.details(), id] as const,
};

/**
 * Hook to query BPOC candidates (with caching)
 * Use this when you want to fetch candidates on component mount or with dependencies
 */
export function useBPOCCandidates(params: FetchCandidatesParams, enabled: boolean = true) {
  return useQuery({
    queryKey: bpocCandidatesKeys.list(params),
    queryFn: () => fetchBPOCCandidates(params),
    enabled: enabled && !!params.role && !!params.level,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch BPOC candidates on-demand (mutation)
 * Use this when you want to fetch candidates manually (e.g., on button click)
 */
export function useFetchBPOCCandidates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchBPOCCandidates,
    onSuccess: (data, variables) => {
      console.log('✅ BPOC candidates fetched successfully:', data.recommendedCandidates.length);
      
      // Update the query cache with the fetched data
      queryClient.setQueryData(bpocCandidatesKeys.list(variables), data);
      
      // Optionally invalidate related queries to ensure freshness
      queryClient.invalidateQueries({ queryKey: bpocCandidatesKeys.lists() });
    },
    onError: (error) => {
      console.error('❌ Error fetching BPOC candidates:', error);
    },
  });
}

/**
 * Hook to prefetch BPOC candidates (for performance optimization)
 * Use this to preload data before user needs it
 */
export function usePrefetchBPOCCandidates() {
  const queryClient = useQueryClient();

  return (params: FetchCandidatesParams) => {
    queryClient.prefetchQuery({
      queryKey: bpocCandidatesKeys.list(params),
      queryFn: () => fetchBPOCCandidates(params),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Hook to get cached candidate data without fetching
 */
export function useCachedBPOCCandidates(params: FetchCandidatesParams) {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CandidateMatchResult>(bpocCandidatesKeys.list(params));
}

