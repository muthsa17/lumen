// Hand-written to match `supabase gen types typescript`. Regenerate once the Supabase project exists.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          course: string | null
          deadline: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          course?: string | null
          deadline?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          course?: string | null
          deadline?: string | null
          created_at?: string
        }
        Relationships: []
      }
      micro_tasks: {
        Row: {
          id: string
          task_id: string
          user_id: string
          title: string
          planned_date: string
          is_done: boolean
          position: number
        }
        Insert: {
          id?: string
          task_id: string
          user_id?: string
          title: string
          planned_date: string
          is_done?: boolean
          position?: number
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          title?: string
          planned_date?: string
          is_done?: boolean
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: 'micro_tasks_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      energy_checkins: {
        Row: {
          id: string
          user_id: string
          date: string
          level: Database['public']['Enums']['energy_level']
        }
        Insert: {
          id?: string
          user_id?: string
          date: string
          level: Database['public']['Enums']['energy_level']
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          level?: Database['public']['Enums']['energy_level']
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      energy_level: 'high' | 'medium' | 'low'
    }
    CompositeTypes: { [_ in never]: never }
  }
}
