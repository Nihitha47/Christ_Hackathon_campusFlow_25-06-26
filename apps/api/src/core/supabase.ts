import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv, requireEnv } from "./env";

let client: SupabaseClient | null = null;

function createSupabaseClient(accessToken?: string): SupabaseClient {
  const env = getEnv();
  return createClient(requireEnv(env, "SUPABASE_URL"), requireEnv(env, "SUPABASE_ANON_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      : undefined
  });
}

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

export function getSupabaseClient(): SupabaseClient {
  return createSupabaseClient();
}

export function getSupabaseSessionClient(accessToken: string): SupabaseClient {
  return createSupabaseClient(accessToken);
}