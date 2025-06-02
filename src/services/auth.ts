import { supabase } from './supabase'
import { exitGuestMode } from './guestMode'

export const signInWithEmail = async (email: string, password: string) => {
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (!result.error) {
    // Exit guest mode when signing in successfully
    exitGuestMode()
  }
  
  return result
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const signUpWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  })
} 