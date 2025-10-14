# Supabase User Page Visit Tracking Setup

This document explains how to set up Supabase for tracking user page visits in the ShoreAgents website.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `shoreagents-analytics` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

### 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

### 3. Set Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the SQL

This will create:
- `user_page_visits` table for tracking individual page visits
- Indexes for better query performance
- Views for aggregated analytics

### 5. Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the new tables:
   - `user_page_visits`
   - `page_analytics` (view)
   - `user_visit_analytics` (view)

## How It Works

### Data Collection

The system automatically tracks:
- **User ID**: Anonymous user identifier (stored in localStorage)
- **Page Path**: The URL path of the visited page
- **IP Address**: User's IP address (fetched from ipify.org)
- **Visit Timestamp**: When the page was visited

### Automatic Saving

Data is automatically saved to Supabase:
- Every 30 seconds while the user is active
- When the user leaves the page
- When the user switches tabs (if configured)

### Data Structure

#### user_page_visits Table
```sql
- id: UUID (primary key)
- user_id: TEXT (anonymous user identifier)
- page_path: TEXT (e.g., '/about', '/services/real-estate')
- ip_address: TEXT (user's IP address)
- visit_timestamp: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
```

## Usage in Code

### Basic Usage

The tracking is automatic once set up. The system will:
1. Generate unique user ID
2. Track page visits
3. Save data to Supabase automatically

### Manual Control

You can control the Supabase integration:

```typescript
import { userEngagementTracker } from '@/lib/userEngagementTracker'

// Enable/disable Supabase integration
userEngagementTracker.enableSupabase()
userEngagementTracker.disableSupabase()

// Check if Supabase is enabled
const isEnabled = userEngagementTracker.isSupabaseEnabled()

// Change save interval (default: 30 seconds)
userEngagementTracker.setSupabaseSaveInterval(60000) // 1 minute

// Manually save all page data
const result = await userEngagementTracker.saveAllPageDataToSupabase()
console.log(`Saved ${result.savedCount} pages`)

// End current session
await userEngagementTracker.endSession()
```

### Retrieving Data

```typescript
import { 
  getUserPageVisits, 
  getPageAnalytics,
  getUserVisitAnalytics 
} from '@/lib/userEngagementService'

// Get all page visits for current user
const userVisits = await getUserPageVisits()

// Get aggregated page analytics
const pageAnalytics = await getPageAnalytics()

// Get user visit analytics
const userAnalytics = await getUserVisitAnalytics()
```

## Analytics Views

The system provides two pre-built views for analytics:

### page_analytics
Shows aggregated data per page:
- Total visits
- Unique users
- Unique IP addresses
- First and last visit timestamps

### user_visit_analytics
Shows aggregated data per user:
- Total page visits
- Unique pages visited
- First and last visit timestamps

## Privacy Considerations

- User IDs are anonymous and stored locally
- No personally identifiable information is collected
- Data is stored securely in Supabase
- Row Level Security (RLS) can be enabled for additional privacy

## Troubleshooting

### Common Issues

1. **Environment variables not loaded**
   - Ensure `.env.local` exists and contains correct Supabase credentials
   - Restart your development server after adding environment variables

2. **Database connection errors**
   - Verify your Supabase URL and anon key are correct
   - Check that your Supabase project is active

3. **Tables not created**
   - Run the SQL schema in Supabase SQL Editor
   - Check for any SQL errors in the Supabase logs

4. **Data not saving**
   - Check browser console for errors
   - Verify Supabase integration is enabled
   - Check network tab for failed API calls

### Debug Mode

Enable debug logging:
```typescript
// Check current tracking state
userEngagementTracker.debug()

// Get raw engagement data
const data = userEngagementTracker.getRawData()
console.log('Current engagement data:', data)

// Get all page data
const allData = userEngagementTracker.getAllPageData()
console.log('All page data:', allData)
```

## Security

- The anon key is safe to use in client-side code
- Consider enabling Row Level Security (RLS) for production
- Monitor your Supabase usage and set up billing alerts
- Regularly review and clean up old data

## Next Steps

1. Set up your Supabase project
2. Run the SQL schema
3. Add environment variables
4. Test the integration
5. Monitor the data in your Supabase dashboard
6. Set up analytics dashboards using the provided views
