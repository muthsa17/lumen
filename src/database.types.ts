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
          category: string
          priority: string
          notes: string | null
          status: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          course?: string | null
          deadline?: string | null
          created_at?: string
          category?: string
          priority?: string
          notes?: string | null
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          course?: string | null
          deadline?: string | null
          created_at?: string
          category?: string
          priority?: string
          notes?: string | null
          status?: string
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
          minutes: number
          done_at: string | null
        }
        Insert: {
          id?: string
          task_id: string
          user_id?: string
          title: string
          planned_date: string
          is_done?: boolean
          position?: number
          minutes?: number
          done_at?: string | null
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          title?: string
          planned_date?: string
          is_done?: boolean
          position?: number
          minutes?: number
          done_at?: string | null
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
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          micro_task_id: string | null
          started_at: string
          ended_at: string
          minutes: number
        }
        Insert: {
          id?: string
          user_id?: string
          micro_task_id?: string | null
          started_at: string
          ended_at: string
          minutes: number
        }
        Update: {
          id?: string
          user_id?: string
          micro_task_id?: string | null
          started_at?: string
          ended_at?: string
          minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: 'focus_sessions_micro_task_id_fkey'
            columns: ['micro_task_id']
            isOneToOne: false
            referencedRelation: 'micro_tasks'
            referencedColumns: ['id']
          },
        ]
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
