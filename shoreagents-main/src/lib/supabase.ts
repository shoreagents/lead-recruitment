import { createClient } from './supabase/client'

// Define the UserPageVisit type based on the database schema
export interface UserPageVisit {
  id: string
  user_id: string
  page_path: string
  ip_address?: string
  visit_timestamp: string
  created_at: string
  // New fields
  visit_count: number
  time_spent_seconds: number
  last_visit_timestamp: string
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Supabase features will be disabled.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient()
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null
}
