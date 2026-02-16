// =============================================================================
// Supabase Client Configuration
// In MOCK_MODE, we export a null client and use mock data instead.
// =============================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

// Only create a real client when not in mock mode
export const supabase = isMockMode
    ? null
    : createClient(supabaseUrl, supabaseAnonKey);
