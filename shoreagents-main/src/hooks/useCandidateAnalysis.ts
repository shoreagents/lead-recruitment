/**
 * Custom TanStack Query hook for candidate analysis with Maya AI
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CandidateInfo {
  id: string;
  name: string;
  position: string;
  location: string;
  expectedSalary: string | null;
  overallScore: number | null;
  skills: string[];
  experienceCount: number;
}

interface CandidateAnalysisResponse {
  success: boolean;
  candidate: CandidateInfo;
  analysis: string;
  timestamp: string;
}

interface CandidateListItem {
  id: string;
  name: string;
  position: string;
  location: string;
  overallScore: number;
}

interface CandidateListResponse {
  success: boolean;
  candidates: CandidateListItem[];
  total: number;
}

interface AnalyzeCandidateParams {
  candidateId?: string;
  candidateName?: string;
  question?: string;
}

/**
 * Fetch candidate analysis from API
 */
async function fetchCandidateAnalysis(params: AnalyzeCandidateParams): Promise<CandidateAnalysisResponse> {
  console.log('🔍 Analyzing candidate:', params);
  
  const response = await fetch('/api/analyze-candidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze candidate');
  }

  const result = await response.json();
  console.log('✅ Candidate analysis received');
  
  return result;
}

/**
 * Fetch candidate list for search/autocomplete
 */
async function fetchCandidateList(query?: string, limit: number = 20): Promise<CandidateListResponse> {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  params.append('limit', limit.toString());
  
  const response = await fetch(`/api/analyze-candidate?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch candidate list');
  }

  return await response.json();
}

/**
 * Query key factory for consistent cache key generation
 */
export const candidateAnalysisKeys = {
  all: ['candidate-analysis'] as const,
  lists: () => [...candidateAnalysisKeys.all, 'list'] as const,
  list: (query?: string) => [...candidateAnalysisKeys.lists(), query] as const,
  analyses: () => [...candidateAnalysisKeys.all, 'analysis'] as const,
  analysis: (params: AnalyzeCandidateParams) => [...candidateAnalysisKeys.analyses(), params] as const,
};

/**
 * Hook to query candidate analysis (with caching)
 * Use this when you want to fetch analysis on component mount
 */
export function useCandidateAnalysis(
  params: AnalyzeCandidateParams,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: candidateAnalysisKeys.analysis(params),
    queryFn: () => fetchCandidateAnalysis(params),
    enabled: enabled && (!!params.candidateId || !!params.candidateName),
    staleTime: 10 * 60 * 1000, // Analysis stays fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to analyze candidate on-demand (mutation)
 * Use this when you want to analyze candidates manually
 */
export function useAnalyzeCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchCandidateAnalysis,
    onSuccess: (data, variables) => {
      console.log('✅ Candidate analysis completed:', data.candidate.name);
      
      // Update the query cache with the analysis
      queryClient.setQueryData(candidateAnalysisKeys.analysis(variables), data);
      
      // Invalidate candidate list to refresh if needed
      queryClient.invalidateQueries({ queryKey: candidateAnalysisKeys.lists() });
    },
    onError: (error) => {
      console.error('❌ Error analyzing candidate:', error);
    },
  });
}

/**
 * Hook to search/list candidates
 */
export function useCandidateList(query?: string, limit: number = 20, enabled: boolean = true) {
  return useQuery({
    queryKey: candidateAnalysisKeys.list(query),
    queryFn: () => fetchCandidateList(query, limit),
    enabled,
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to prefetch candidate analysis (for performance)
 */
export function usePrefetchCandidateAnalysis() {
  const queryClient = useQueryClient();

  return (params: AnalyzeCandidateParams) => {
    queryClient.prefetchQuery({
      queryKey: candidateAnalysisKeys.analysis(params),
      queryFn: () => fetchCandidateAnalysis(params),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * Hook to get cached candidate analysis without fetching
 */
export function useCachedCandidateAnalysis(params: AnalyzeCandidateParams) {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CandidateAnalysisResponse>(
    candidateAnalysisKeys.analysis(params)
  );
}

/**
 * Hook to invalidate all candidate analyses (useful after updates)
 */
export function useInvalidateCandidateAnalyses() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: candidateAnalysisKeys.all });
  };
}

