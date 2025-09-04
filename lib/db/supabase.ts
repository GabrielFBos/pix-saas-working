// lib/db/supabase.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
