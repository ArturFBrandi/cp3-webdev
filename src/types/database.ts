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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
