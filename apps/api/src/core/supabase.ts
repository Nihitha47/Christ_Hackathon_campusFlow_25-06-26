import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv, requireEnv } from "./env";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) {
    return client;
  }

  const env = getEnv();
  client = createClient(requireEnv(env, "SUPABASE_URL"), requireEnv(env, "SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return client;
}