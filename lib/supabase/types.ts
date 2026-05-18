// ------------------------------------------------------------
// Database types for NSCD MVP
// Mirrors the schema in supabase/migrations/001_initial_schema.sql
//
// When you're ready to use Supabase's auto-generated types,
// run:  npx supabase gen types typescript --project-id <your-id>
// and replace this file with the output.
// ------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
      }
      vocabulary_progress: {
        Row: {
          id: string
          user_id: string
          vocab_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vocab_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vocab_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Convenience row types
export type VocabularyProgressRow =
  Database['public']['Tables']['vocabulary_progress']['Row']

export type UserProfileRow =
  Database['public']['Tables']['user_profiles']['Row']
