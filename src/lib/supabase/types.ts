export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          created_at: string
          total_races: number
          best_wpm: number
        }
        Insert: {
          id: string
          name: string
          created_at?: string
          total_races?: number
          best_wpm?: number
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          total_races?: number
          best_wpm?: number
        }
        Relationships: []
      }
      rounds: {
        Row: {
          id: string
          sentence: string
          started_at: string
          ends_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          sentence: string
          started_at?: string
          ends_at: string
          is_active?: boolean
        }
        Update: {
          id?: string
          sentence?: string
          started_at?: string
          ends_at?: string
          is_active?: boolean
        }
        Relationships: []
      }
      round_results: {
        Row: {
          id: string
          round_id: string
          player_id: string
          wpm: number
          accuracy: number
          finished_at: string
        }
        Insert: {
          id?: string
          round_id: string
          player_id: string
          wpm?: number
          accuracy?: number
          finished_at?: string
        }
        Update: {
          id?: string
          round_id?: string
          player_id?: string
          wpm?: number
          accuracy?: number
          finished_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Player = Database['public']['Tables']['players']['Row']
export type Round = Database['public']['Tables']['rounds']['Row']
export type RoundResult = Database['public']['Tables']['round_results']['Row']
