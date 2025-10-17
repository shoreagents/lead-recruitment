'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Reduced staleTime to prevent excessive caching
            staleTime: 30 * 1000, // 30 seconds (was 1 minute)
            // Reduced gcTime for faster cache cleanup
            gcTime: 2 * 60 * 1000, // 2 minutes (was 10 minutes)
            // Disable refetchOnWindowFocus to prevent excessive requests
            refetchOnWindowFocus: false,
            // Disable refetchOnMount to prevent redundant fetches
            refetchOnMount: false,
            // Reduce refetch on reconnect
            refetchOnReconnect: false,
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && 'status' in error) {
                const status = (error as Record<string, unknown>).status;
                if (typeof status === 'number' && status >= 400 && status < 500) {
                  return false;
                }
              }
              // Reduce max retries from 3 to 2
              return failureCount < 2;
            },
            // Add retry delay
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 3000),
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  // Periodic cache cleanup to prevent memory bloat
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      
      // Log cache size for monitoring
      console.log('🧹 Cache cleanup: Total queries:', queries.length);
      
      // Remove queries that haven't been used in the last 5 minutes
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      queries.forEach(query => {
        const state = query.state;
        if (state.dataUpdatedAt < fiveMinutesAgo && !query.getObserversCount()) {
          cache.remove(query);
        }
      });
      
      // Clear any queries with errors older than 2 minutes
      const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
      queries.forEach(query => {
        const state = query.state;
        if (state.error && state.errorUpdatedAt < twoMinutesAgo) {
          cache.remove(query);
        }
      });
      
      console.log('✅ Cache cleaned. Remaining queries:', cache.getAll().length);
    }, 5 * 60 * 1000); // Run every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, [queryClient]);

  // Clear auth-related cache on storage events (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && !e.newValue) {
        console.log('🔐 Auth token removed, clearing cache...');
        queryClient.clear();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
