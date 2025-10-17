# Cache Optimization Guide

## Issues Identified

1. **Excessive TanStack Query Cache**: Too many queries with long staleTime and gcTime
2. **User Authentication Fetching Issues**: Multiple auth state checks causing race conditions
3. **Redundant Refetches**: Window focus and mount triggers causing unnecessary requests
4. **No Cache Cleanup Strategy**: Old queries accumulating in memory

## Solutions Implemented

### 1. Optimized TanStack Query Default Configuration
- Reduced default staleTime to 30 seconds
- Reduced default gcTime to 2 minutes
- Disabled refetchOnWindowFocus globally
- Added max query cache size limit

### 2. Improved Authentication Flow
- Added debouncing to auth state changes
- Implemented single source of truth for user data
- Added proper error boundaries
- Cleared stale user queries on logout

### 3. Smart Cache Invalidation
- Invalidate only relevant queries
- Use specific query keys
- Clear cache on critical actions (logout, profile update)

### 4. Memory Management
- Automatic cache cleanup every 5 minutes
- Remove inactive queries
- Limit total cache size

## Monitoring

Check these in console:
- `window.__REACT_QUERY_DEVTOOLS_GLOBAL_CACHE__` - View current cache
- Look for "Cache cleared" logs every 5 minutes
- Monitor network tab for excessive refetches

## Best Practices Going Forward

1. Always set appropriate staleTime (30s-2m for most data)
2. Set gcTime lower than staleTime (2-5 minutes max)
3. Disable refetchOnWindowFocus unless needed
4. Use query invalidation instead of refetchOnMount
5. Clear cache on logout and major state changes

