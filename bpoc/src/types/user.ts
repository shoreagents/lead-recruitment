export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  location: string
  avatar_url?: string
  phone?: string
  bio?: string
  position?: string
  completed_data?: boolean
  birthday?: string | null
  gender?: string | null
  slug?: string
  created_at: string
  updated_at: string
  admin_level?: 'user' | 'admin'
}

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  location: string
  password: string
  confirmPassword: string
}

export interface UserMetadata {
  first_name: string
  last_name: string
  full_name: string
  location: string
  avatar_url?: string
}

// Simplified Admin types
export interface AdminUser {
  id: string
  email: string
  full_name: string
  admin_level: 'user' | 'admin'
  avatar_url?: string
}

export interface AdminActivityLog {
  id: string
  user_id: string
  action: string
  details?: string
  ip_address?: string
  created_at: string
}

export interface AdminDashboardStats {
  total_users: number
  total_resumes: number
  total_games: number
  total_assessments: number
  recent_activity: AdminActivityLog[]
} 