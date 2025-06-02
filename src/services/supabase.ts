import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { getRedirectURL } from '../utils/auth'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client with URL:', supabaseUrl)
console.log('Current environment:', {
  hostname: window.location.hostname,
  redirectUrl: getRedirectURL('/confirm')
})

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Debug helper
const logAuthState = async (action?: string) => {
  const { data: { session } } = await supabase.auth.getSession()
  const state = {
    action: action || 'check',
    timestamp: new Date().toISOString(),
    environment: window.location.hostname,
    hasSession: !!session,
    accessToken: session?.access_token ? `${session.access_token.slice(0, 10)}...` : 'missing',
    tokenExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'n/a',
    user: session?.user?.email || 'none'
  }
  
  console.log('🔐 Auth State:', state)
  return state
}

// Auth helpers with debug logging
export const signInWithEmail = async (email: string, password: string) => {
  console.log('📧 Attempting sign in:', { email, environment: window.location.hostname })
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  await logAuthState('sign-in')
  return response
}

export const signUpWithEmail = async (email: string, password: string) => {
  console.log('📝 Attempting sign up:', { email, environment: window.location.hostname })
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getRedirectURL('/confirm'),
    }
  })
  await logAuthState('sign-up')
  return response
}

export const signOut = async () => {
  console.log('🚪 Attempting sign out')
  const response = await supabase.auth.signOut()
  await logAuthState('sign-out')
  return response
}

export const getCurrentUser = async () => {
  await logAuthState('get-user')
  const response = await supabase.auth.getUser()
  console.log('👤 Get user response:', {
    success: !!response.data.user,
    user: response.data.user?.email || 'none',
    error: response.error?.message
  })
  return response
}

export const sendPasswordResetEmail = async (email: string) => {
  try {
    console.log('🔑 Sending password reset:', { email, environment: window.location.hostname })
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectURL('/auth?reset=true'),
    })
    await logAuthState('password-reset')
    return response
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Enhanced session listener with debug info
supabase.auth.onAuthStateChange(async (event) => {
  const state = await logAuthState('auth-change')
  console.log('🔄 Auth state changed:', {
    event,
    ...state
  })
}) 