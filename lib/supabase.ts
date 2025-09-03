import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente Supabase para operações do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

// Cliente Supabase para operações do servidor (com service role key)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          txid: string;
          user_id: string;
          amount_cents: number;
          status: 'PENDING' | 'PAID' | 'FAILED';
          provider: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          txid: string;
          user_id: string;
          amount_cents: number;
          status?: 'PENDING' | 'PAID' | 'FAILED';
          provider: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          txid?: string;
          user_id?: string;
          amount_cents?: number;
          status?: 'PENDING' | 'PAID' | 'FAILED';
          provider?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
