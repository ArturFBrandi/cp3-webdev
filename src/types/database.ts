/**
 * Supabase schema types, mirroring supabase/migrations.
 * Regenerate with `npx supabase gen types typescript --project-id edkwyyimugwihabykdpu` when the schema changes.
 */
export interface Database {
  public: {
    Tables: {
      featured_projects: {
        Row: { repo_name: string; position: number; created_at: string }
        Insert: { repo_name: string; position?: number; created_at?: string }
        Update: { repo_name?: string; position?: number; created_at?: string }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          answered: boolean
          answered_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          answered?: boolean
          answered_at?: string | null
          created_at?: string
        }
        Update: {
          answered?: boolean
          answered_at?: string | null
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
