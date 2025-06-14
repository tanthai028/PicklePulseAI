export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      health_stats: {
        Row: {
          id: string
          user_id: string
          date: string
          sleep_hours: number
          heart_rate: number
          calories: number
          mood: number
          fatigue: number
          readiness: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          sleep_hours: number
          heart_rate: number
          calories: number
          mood: number
          fatigue: number
          readiness: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          sleep_hours?: number
          heart_rate?: number
          calories?: number
          mood?: number
          fatigue?: number
          readiness?: number
          created_at?: string
        }
      }
      performance_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          rating: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          rating: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          rating?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 