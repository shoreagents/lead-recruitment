// User types and interfaces for the application

export enum UserType {
  ANONYMOUS = 'Anonymous',
  REGULAR = 'Regular', 
  ADMIN = 'Admin'
}

export interface User {
  user_id: string
  auth_user_id?: string | null
  user_type: UserType
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone_number?: string | null
  company?: string | null
  country?: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    first_name?: string
    last_name?: string
    phone_number?: string
    company?: string
    country?: string
  }
}

// Helper functions for user type checking
export const isAdmin = (user: User | null): boolean => {
  return user?.user_type === UserType.ADMIN
}

export const isRegular = (user: User | null): boolean => {
  return user?.user_type === UserType.REGULAR
}

export const isAnonymous = (user: User | null): boolean => {
  return user?.user_type === UserType.ANONYMOUS
}

export const isAuthenticated = (user: User | null): boolean => {
  return user?.user_type === UserType.REGULAR || user?.user_type === UserType.ADMIN
}

// Admin email list for automatic admin assignment
export const ADMIN_EMAILS = [
  'admin@shoreagents.com',
  'stephen@shoreagents.com',
  'support@shoreagents.com'
]

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
