const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ENV dosyanda olmalı!

// Admin yetkili Supabase istemcisi
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabaseAdmin;
