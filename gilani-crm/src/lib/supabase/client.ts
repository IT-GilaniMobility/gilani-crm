import { createClient, SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Get Supabase client singleton with lazy initialization.
 * This prevents build-time errors when env variables are not available.
 */
let supabaseInstance: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate URL format
  const isValidUrl = (url: string | undefined): url is string => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!isValidUrl(supabaseUrl)) {
    throw new Error(
      `Invalid or missing NEXT_PUBLIC_SUPABASE_URL. Got: ${supabaseUrl || "undefined"}. ` +
      "Please set a valid HTTP/HTTPS URL in your environment variables."
    );
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === "") {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Please set your Supabase anonymous key in environment variables."
    );
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseInstance;
}

// Export a getter function instead of the client directly
export const supabase = getSupabaseClient();
