import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createAdminClient(serviceRoleKeyOverride?: string) {
  const key = serviceRoleKeyOverride || serviceRoleKey || anonKey;
  if (!supabaseUrl || !key) {
    throw new Error('Supabase yapılandırması eksik');
  }
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isConfigured() {
  return Boolean(supabaseUrl && (serviceRoleKey || anonKey));
}
