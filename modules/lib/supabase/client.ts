import type { Database } from "@platform/types/database";
import { supabaseEnvironment } from "./environment";
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const { url, key } = supabaseEnvironment()
  return createBrowserClient<Database>(url, key)
}
