// =============================================================================
// Authentication Helpers
// Mock auth for development; real Supabase Auth in production.
// =============================================================================

import { type User, UserRole } from "@/types";
import { MOCK_USER, MOCK_ADMIN } from "@/lib/mock-data";

/** Check if we're in mock mode */
const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

/** Simulated session type */
export interface Session {
    user: User;
    isAuthenticated: boolean;
}

/**
 * Get the current session (mock or real).
 * In mock mode, always returns the mock user as logged in.
 */
export function getSession(asAdmin = false): Session {
    if (isMockMode) {
        return {
            user: asAdmin ? MOCK_ADMIN : MOCK_USER,
            isAuthenticated: true,
        };
    }

    // In production, use Supabase auth
    // const { data: { session } } = await supabase.auth.getSession();
    return { user: MOCK_USER, isAuthenticated: true };
}

/** Check if user has admin role */
export function isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
}

/** Check if user has support role */
export function isSupport(user: User): boolean {
    return user.role === UserRole.SUPPORT || user.role === UserRole.ADMIN;
}
