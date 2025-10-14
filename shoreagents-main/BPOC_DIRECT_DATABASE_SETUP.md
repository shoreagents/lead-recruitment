# BPOC Direct Database Connection Setup

## 🎉 What Was Changed

The ShoreAgents website now connects **directly** to the BPOC database instead of calling the external API. This makes the `/we-got-talent` page much faster!

### Before (External API):
```
ShoreAgents → fetch('https://www.bpoc.io/api/public/user-data') → BPOC API → Database
```

### After (Direct Connection):
```
ShoreAgents → fetch('/api/bpoc-candidates') → BPOC Database (direct query)
```

---

## 📁 Files Created/Modified

### ✅ New Files Created:
1. **`src/lib/bpoc-database.ts`**
   - Connection pool manager for BPOC database
   - Singleton pattern for efficient connection reuse
   - Error handling and connection testing utilities

### ✅ Modified Files:
1. **`src/app/api/bpoc-candidates/route.ts`**
   - Added `GET` endpoint for fetching all candidates
   - Queries `v_user_complete_data` view directly
   - Returns same data structure as external API

2. **`src/hooks/use-api.ts`** (line 395-398)
   - Changed from external API to local API
   - `https://www.bpoc.io/api/public/user-data` → `/api/bpoc-candidates`

3. **`env.example`**
   - Added `BPOC_DATABASE_URL` documentation

4. **`package.json`**
   - Added `@types/pg` for TypeScript support (already had `pg`)

---

## 🔧 Setup Instructions

### Step 1: Add BPOC Database URL to Environment

**Create or edit: `shoreagents-main/.env.local`**

```env
# ShoreAgents Database (for leads, quotes, etc.)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# BPOC Database (for candidate data) - NEW!
BPOC_DATABASE_URL="postgresql://postgres:YOUR_BPOC_PASSWORD@db.YOUR_BPOC_PROJECT.supabase.co:5432/postgres"
```

**Where to get the BPOC_DATABASE_URL:**
1. Go to your BPOC project in Supabase dashboard
2. Settings → Database
3. Copy the "Connection string" (not the pooling one)
4. Use port `5432` (direct connection)

### Step 2: Restart Development Server

```bash
cd shoreagents-main
npm run dev
```

### Step 3: Test the Connection

Visit: `http://localhost:3000/we-got-talent`

**Check console logs for:**
```
✅ BPOC database connection pool created
🔍 Fetching candidates directly from BPOC database...
✅ Fetched [X] candidates from BPOC database
```

---

## 🧪 Testing the Connection

### Test API Endpoint Directly

```bash
# Test the new GET endpoint
curl http://localhost:3000/api/bpoc-candidates
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "...",
      "full_name": "John Doe",
      "position": "Web Developer",
      "overall_score": 85,
      ...
    }
  ],
  "total": 150,
  "source": "direct-database",
  "timestamp": "2025-10-14T..."
}
```

### Test in Browser

1. Open: `http://localhost:3000/we-got-talent`
2. Open DevTools (F12) → Network tab
3. Look for request to `/api/bpoc-candidates`
4. Should see 200 OK status
5. Response should have `"source": "direct-database"`

---

## 🔍 How It Works

### Connection Pool (`src/lib/bpoc-database.ts`)

```typescript
import { getBPOCPool } from '@/lib/bpoc-database';

const pool = getBPOCPool(); // Reuses same connection pool
const result = await pool.query('SELECT * FROM users');
```

**Features:**
- ✅ Singleton pattern (one pool for entire app)
- ✅ Max 10 concurrent connections
- ✅ Auto-reconnect on connection loss
- ✅ SSL enabled for Supabase
- ✅ Proper error handling

### API Route (`src/app/api/bpoc-candidates/route.ts`)

**GET `/api/bpoc-candidates`** - Fetch all candidates
- Queries `v_user_complete_data` view
- Orders by score and creation date
- Limits to 200 candidates
- Returns same format as external API

**POST `/api/bpoc-candidates`** - Get recommendations for role
- Already existed
- Used by pricing calculator
- Still uses external API (will migrate later)

### React Hook (`src/hooks/use-api.ts`)

```typescript
export const useEmployeeCardData = () => {
  return useQuery({
    queryKey: ['employee-card-data'],
    queryFn: fetchEmployeeCardData, // Now uses /api/bpoc-candidates
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
```

---

## ⚡ Benefits

### 1. **Faster Performance**
- No external HTTP call overhead
- No network latency to bpoc.io
- Direct database query

### 2. **Better Development Experience**
- Works offline (as long as database is accessible)
- Don't need BPOC API running
- Easier debugging

### 3. **More Control**
- Can customize queries
- Add more fields if needed
- Better error handling

### 4. **Cost Savings**
- No Vercel bandwidth for external API calls
- Fewer hops in the request chain

---

## 🔒 Security Considerations

### ✅ What's Protected:
- `BPOC_DATABASE_URL` is server-side only (not exposed to browser)
- Only used in API routes (Next.js server)
- Connection uses SSL/TLS encryption

### ⚠️ Best Practices:
1. **Read-Only Access**: Consider creating a read-only database user for ShoreAgents
2. **Environment Variables**: Never commit `.env.local` to git
3. **Query Limits**: API route limits to 200 candidates
4. **Same View**: Uses `v_user_complete_data` which already filters sensitive data

### 🔐 Optional: Create Read-Only User

**Run in BPOC database:**
```sql
-- Create read-only user
CREATE USER shoreagents_readonly WITH PASSWORD 'secure_password_here';

-- Grant permissions
GRANT CONNECT ON DATABASE postgres TO shoreagents_readonly;
GRANT USAGE ON SCHEMA public TO shoreagents_readonly;
GRANT SELECT ON public.v_user_complete_data TO shoreagents_readonly;

-- Test connection
-- Use this in BPOC_DATABASE_URL instead
```

---

## 🐛 Troubleshooting

### Error: "BPOC_DATABASE_URL is not set"

**Fix:** Add the environment variable to `.env.local`

```env
BPOC_DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"
```

### Error: "Connection refused"

**Possible causes:**
1. Wrong database URL
2. Database is paused in Supabase
3. Firewall blocking connection
4. Wrong password

**Fix:** 
1. Check Supabase dashboard - is project active?
2. Verify connection string is correct
3. Try connecting with a database client (DBeaver, pgAdmin)

### Error: "relation v_user_complete_data does not exist"

**Fix:** Make sure the view exists in BPOC database. Run the view creation SQL in BPOC project.

### Slow Queries

**Fix:** Add indexes to the view's underlying tables:
```sql
CREATE INDEX idx_users_overall_score ON users(overall_score DESC);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

---

## 🚀 Deployment to Production

### Vercel Environment Variables

Add to your Vercel project settings:

```
BPOC_DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

**Steps:**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add `BPOC_DATABASE_URL`
5. Select all environments (Production, Preview, Development)
6. Save
7. Redeploy

### Connection Pool Limits

For production, you may want to increase the pool size:

**Edit `src/lib/bpoc-database.ts`:**
```typescript
bpocPool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 20, // Increased from 10 for production
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## 📊 Monitoring

### Check Connection Pool Status

Add this endpoint for monitoring (optional):

**`src/app/api/bpoc-health/route.ts`:**
```typescript
import { NextResponse } from 'next/server';
import { getBPOCPool, testBPOCConnection } from '@/lib/bpoc-database';

export async function GET() {
  const pool = getBPOCPool();
  const isConnected = await testBPOCConnection();
  
  return NextResponse.json({
    connected: isConnected,
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  });
}
```

Visit: `http://localhost:3000/api/bpoc-health`

---

## 🔄 Rollback (If Needed)

To revert back to external API:

**Edit `src/hooks/use-api.ts` line 398:**
```typescript
// Change from:
const response = await fetch('/api/bpoc-candidates');

// Back to:
const response = await fetch('https://www.bpoc.io/api/public/user-data');
```

Then restart the dev server. Everything else can stay (doesn't hurt to have the connection pool code).

---

## ✅ Success Checklist

- [ ] Added `BPOC_DATABASE_URL` to `.env.local`
- [ ] Restarted development server
- [ ] Visited `/we-got-talent` - page loads
- [ ] Checked console - no database errors
- [ ] Network tab shows `/api/bpoc-candidates` request
- [ ] Response has `"source": "direct-database"`
- [ ] Candidate cards display correctly

---

## 📝 Notes

- Both databases remain independent
- ShoreAgents only **reads** from BPOC database
- All writes still go through BPOC API
- This setup works for both local development and production
- The connection is secure (SSL/TLS encrypted)

---

## 🎯 Next Steps (Optional Improvements)

1. **Caching**: Add Redis for query caching
2. **Read Replicas**: Use Supabase read replicas for scaling
3. **GraphQL**: Consider using Hasura for more flexible queries
4. **Real-time**: Add Supabase realtime subscriptions for live updates

---

**Questions or Issues?**
Check the server logs for detailed error messages. The connection pool provides helpful debugging information.

