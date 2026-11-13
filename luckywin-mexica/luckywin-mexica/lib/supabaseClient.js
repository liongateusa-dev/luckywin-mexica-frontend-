"use client";

import { createClient } from "@supabase/supabase-js";

// Public values only — the anon key is safe to expose in the browser by
// design (Supabase's row-level security, if configured, is what actually
// protects data; this app's protection happens in the backend API layer).
// NEVER put the service_role key here.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client = null;

export function getSupabaseClient() {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
          "Set these in .env.local — see README."
      );
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
