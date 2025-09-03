// Tipos gerados automaticamente pelo Supabase
// Execute: npm run supabase:gen:types para atualizar

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
      users: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          txid: string
          user_id: string
          amount_cents: number
          status: 'PENDING' | 'PAID' | 'FAILED'
          provider: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          txid: string
          user_id: string
          amount_cents: number
          status?: 'PENDING' | 'PAID' | 'FAILED'
          provider?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          txid?: string
          user_id?: string
          amount_cents?: number
          status?: 'PENDING' | 'PAID' | 'FAILED'
          provider?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
