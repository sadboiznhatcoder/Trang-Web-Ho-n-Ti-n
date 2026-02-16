// =============================================================================
// Authentication Helpers
// For backwards compatibility. Main auth flows are in actions/auth.ts
// =============================================================================

import { type Profile, UserRole } from "@/types";
import { MOCK_CURRENT_USER, MOCK_ALL_PROFILES } from "@/lib/mock-data";

/** Check if we're in mock mode */
const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

/** Simulated session type */
export interface Session {
  user: Profile;
  isAuthenticated: boolean;
}

/**
 * Get the current session (mock or real).
 */
export function getSessionSync(asAdmin = false): Session {
  const adminProfile = MOCK_ALL_PROFILES.find((p) => p.role === UserRole.ADMIN);
  if (isMockMode) {
    return {
      user: asAdmin && adminProfile ? adminProfile : MOCK_CURRENT_USER,
      isAuthenticated: true,
    };
  }

  return { user: MOCK_CURRENT_USER, isAuthenticated: true };
}

/** Check if user has admin role */
export function isAdmin(user: Profile): boolean {
  return user.role === UserRole.ADMIN;
}
