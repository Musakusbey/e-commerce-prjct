import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL veya Service Role Key Eksik! .env.local dosyanı kontrol et.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabaseAdmin;
  