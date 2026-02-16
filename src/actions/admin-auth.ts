"use server";

// =============================================================================
// Server Action: Admin Authentication
// Hardcoded credential check with cookie-based session
// =============================================================================

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "66771508";
const SESSION_COOKIE = "v_admin_session";
const SESSION_VALUE = "authenticated_v_admin_2025";

export async function verifyAdminCredentials(
    username: string,
    password: string
): Promise<{ success: boolean; error?: string }> {
    // Simulate slight delay for security feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8, // 8 hours
        });
        return { success: true };
    }

    return { success: false, error: "Truy cập bị từ chối" };
}

export async function checkAdminSession(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    return session?.value === SESSION_VALUE;
}

export async function logoutAdmin(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    redirect("/v-admin-portal");
}
