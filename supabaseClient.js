import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL veya Anonim Anahtar Eksik! .env.local dosyanı kontrol et.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);  