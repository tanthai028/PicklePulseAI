import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  console.log('Attempting sign in with email:', email)
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log('Sign in response:', response)
  return response
}

export const signUpWithEmail = async (email: string, password: string) => {
  console.log('Attempting sign up with email:', email)
  const response = await supabase.auth.signUp({
    email,
    password,
  })
  console.log('Sign up response:', response)
  return response
}

export const signOut = async () => {
  console.log('Attempting sign out')
  const response = await supabase.auth.signOut()
  console.log('Sign out response:', response)
  return response
}

export const getCurrentUser = async () => {
  console.log('Getting current user')
  const response = await supabase.auth.getUser()
  console.log('Get user response:', response)
  return response
}

// Add session listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, 'Session:', session)
}) 