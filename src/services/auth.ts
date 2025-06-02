import { supabase } from './supabase'

export const signOut = async () => {
  return await supabase.auth.signOut()
} 