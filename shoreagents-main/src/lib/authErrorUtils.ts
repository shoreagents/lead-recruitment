/**
 * Authentication Error Utilities
 * Maps Supabase and API errors to user-friendly messages
 */

export interface AuthError {
  code?: string
  message: string
  type: 'login' | 'signup' | 'general'
}

/**
 * Maps Supabase auth error messages to user-friendly messages
 */
export function mapSupabaseAuthError(error: unknown, type: 'login' | 'signup' | 'general' = 'general'): AuthError {
  const errorMessage = (error as { message?: string; error?: string })?.message || (error as { message?: string; error?: string })?.error || 'An unexpected error occurred'
  
  // Common Supabase auth error patterns
  const errorMappings: Record<string, { login: string; signup: string; general: string }> = {
    // Invalid credentials
    'Invalid login credentials': {
      login: 'Invalid email or password. Please check your credentials and try again.',
      signup: 'Invalid email or password. Please check your credentials and try again.',
      general: 'Invalid email or password. Please check your credentials and try again.'
    },
    'invalid_grant': {
      login: 'Invalid email or password. Please check your credentials and try again.',
      signup: 'Invalid email or password. Please check your credentials and try again.',
      general: 'Invalid email or password. Please check your credentials and try again.'
    },
    
    // Email already exists
    'User already registered': {
      login: 'An account with this email already exists. Please sign in instead.',
      signup: 'An account with this email already exists. Please sign in instead.',
      general: 'An account with this email already exists. Please sign in instead.'
    },
    'email_address_not_authorized': {
      login: 'This email address is not authorized to sign in.',
      signup: 'This email address is not authorized to create an account.',
      general: 'This email address is not authorized.'
    },
    
    // Email confirmation
    'email_not_confirmed': {
      login: 'Please check your email and click the confirmation link before signing in.',
      signup: 'Please check your email and click the confirmation link to complete your registration.',
      general: 'Please check your email and click the confirmation link.'
    },
    'signup_disabled': {
      login: 'Account creation is currently disabled.',
      signup: 'Account creation is currently disabled. Please contact support.',
      general: 'Account creation is currently disabled.'
    },
    
    // Password issues
    'password_too_short': {
      login: 'Password is too short. Please use a stronger password.',
      signup: 'Password must be at least 6 characters long.',
      general: 'Password is too short. Please use a stronger password.'
    },
    'weak_password': {
      login: 'Password is too weak. Please use a stronger password.',
      signup: 'Password is too weak. Please use a stronger password with letters, numbers, and symbols.',
      general: 'Password is too weak. Please use a stronger password.'
    },
    
    // Rate limiting
    'too_many_requests': {
      login: 'Too many login attempts. Please wait a few minutes before trying again.',
      signup: 'Too many signup attempts. Please wait a few minutes before trying again.',
      general: 'Too many requests. Please wait a few minutes before trying again.'
    },
    
    // Network/Server issues
    'network_error': {
      login: 'Network error. Please check your internet connection and try again.',
      signup: 'Network error. Please check your internet connection and try again.',
      general: 'Network error. Please check your internet connection and try again.'
    },
    'service_unavailable': {
      login: 'Service temporarily unavailable. Please try again later.',
      signup: 'Service temporarily unavailable. Please try again later.',
      general: 'Service temporarily unavailable. Please try again later.'
    }
  }

  // Check for exact matches first
  for (const [pattern, messages] of Object.entries(errorMappings)) {
    if (errorMessage.toLowerCase().includes(pattern.toLowerCase())) {
      return {
        code: (error as { code?: string })?.code,
        message: messages[type],
        type
      }
    }
  }

  // Check for partial matches
  if (errorMessage.toLowerCase().includes('invalid') && errorMessage.toLowerCase().includes('credentials')) {
    return {
      code: (error as { code?: string })?.code,
      message: type === 'login' 
        ? 'Invalid email or password. Please check your credentials and try again.'
        : 'Invalid email or password. Please check your credentials and try again.',
      type
    }
  }

  if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already')) {
    return {
      code: (error as { code?: string })?.code,
      message: 'An account with this email already exists. Please sign in instead.',
      type: 'signup'
    }
  }

  if (errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('weak')) {
    return {
      code: (error as { code?: string })?.code,
      message: type === 'signup' 
        ? 'Password is too weak. Please use a stronger password with letters, numbers, and symbols.'
        : 'Password is too weak. Please use a stronger password.',
      type
    }
  }

  // Default fallback
  return {
    code: (error as { code?: string })?.code,
    message: type === 'login' 
      ? 'Login failed. Please check your credentials and try again.'
      : type === 'signup'
      ? 'Signup failed. Please try again or contact support if the problem persists.'
      : 'An unexpected error occurred. Please try again.',
    type
  }
}

/**
 * Maps API response errors to user-friendly messages
 */
export function mapApiError(response: unknown, type: 'login' | 'signup' | 'general' = 'general'): AuthError {
  const errorMessage = (response as { error?: string; message?: string })?.error || (response as { error?: string; message?: string })?.message || 'An unexpected error occurred'
  
  // API-specific error mappings
  const apiErrorMappings: Record<string, { login: string; signup: string; general: string }> = {
    'All fields are required': {
      login: 'Please fill in all required fields.',
      signup: 'Please fill in all required fields.',
      general: 'Please fill in all required fields.'
    },
    'Email and password are required': {
      login: 'Please enter both email and password.',
      signup: 'Please enter both email and password.',
      general: 'Please enter both email and password.'
    },
    'Invalid email format': {
      login: 'Please enter a valid email address.',
      signup: 'Please enter a valid email address.',
      general: 'Please enter a valid email address.'
    },
    'Password must be at least 6 characters long': {
      login: 'Password must be at least 6 characters long.',
      signup: 'Password must be at least 6 characters long.',
      general: 'Password must be at least 6 characters long.'
    },
    'An account with this email already exists. Please sign in instead.': {
      login: 'An account with this email already exists. Please sign in instead.',
      signup: 'An account with this email already exists. Please sign in instead.',
      general: 'An account with this email already exists. Please sign in instead.'
    },
    'Failed to validate email. Please try again.': {
      login: 'Unable to verify email. Please try again.',
      signup: 'Unable to verify email. Please try again.',
      general: 'Unable to verify email. Please try again.'
    },
    'Internal server error': {
      login: 'Server error. Please try again later.',
      signup: 'Server error. Please try again later.',
      general: 'Server error. Please try again later.'
    }
  }

  // Check for exact matches
  for (const [pattern, messages] of Object.entries(apiErrorMappings)) {
    if (errorMessage === pattern) {
      return {
        message: messages[type],
        type
      }
    }
  }

  // Fallback to Supabase error mapping
  return mapSupabaseAuthError({ message: errorMessage }, type)
}

/**
 * Gets a user-friendly error message for authentication errors
 */
export function getAuthErrorMessage(error: unknown, type: 'login' | 'signup' | 'general' = 'general'): string {
  if (typeof error === 'string') {
    return mapApiError({ error }, type).message
  }
  
  if ((error as { response?: { data?: unknown } })?.response?.data) {
    return mapApiError((error as { response: { data: unknown } }).response.data, type).message
  }
  
  if ((error as { error?: unknown })?.error) {
    return mapApiError(error, type).message
  }
  
  return mapSupabaseAuthError(error, type).message
}

/**
 * Determines if an error is a credential error (for login forms)
 */
export function isCredentialError(error: unknown): boolean {
  const errorMessage = (error as { message?: string; error?: string })?.message || (error as { message?: string; error?: string })?.error || ''
  const credentialErrors = [
    'invalid login credentials',
    'invalid_grant',
    'invalid email or password',
    'invalid credentials'
  ]
  
  return credentialErrors.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  )
}

/**
 * Determines if an error is an email already exists error (for signup forms)
 */
export function isEmailExistsError(error: unknown): boolean {
  const errorMessage = (error as { message?: string; error?: string })?.message || (error as { message?: string; error?: string })?.error || ''
  const emailExistsErrors = [
    'user already registered',
    'email already exists',
    'account with this email already exists'
  ]
  
  return emailExistsErrors.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  )
}

/**
 * Determines if an error is a password strength error (for signup forms)
 */
export function isPasswordStrengthError(error: unknown): boolean {
  const errorMessage = (error as { message?: string; error?: string })?.message || (error as { message?: string; error?: string })?.error || ''
  const passwordErrors = [
    'password too short',
    'weak password',
    'password must be at least'
  ]
  
  return passwordErrors.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  )
}
