import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let publicClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createPublicClient() {
  publicClient ??= createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    }
  );

  return publicClient;
}
