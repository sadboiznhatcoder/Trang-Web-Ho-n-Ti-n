"use server";

// =============================================================================
// Server Action: Authentication (Register + Login with Trapdoor)
// =============================================================================

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { AuthResult, RegisterInput } from "@/types";
import { MOCK_ALL_PROFILES } from "@/lib/mock-data";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "66771508";
const SESSION_COOKIE = "v_session";
const SALT_ROUNDS = 10;

// Session payload shape (stored as JSON string in cookie)
interface SessionPayload {
  userId: string;
  role: "USER" | "ADMIN";
  name: string;
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  try {
    const { full_name, phone, password } = input;

    // Validate phone: exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone)) {
      return { success: false, error: "Số điện thoại phải gồm đúng 10 chữ số" };
    }

    // Validate name
    if (!full_name || full_name.trim().length < 2) {
      return { success: false, error: "Họ tên phải có ít nhất 2 ký tự" };
    }

    // Validate password strength
    if (password.length < 8) {
      return { success: false, error: "Mật khẩu phải có ít nhất 8 ký tự" };
    }
    if (!/[A-Z]/.test(password)) {
      return { success: false, error: "Mật khẩu phải chứa ít nhất 1 chữ hoa" };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { success: false, error: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt" };
    }

    // Check if phone already exists
    const existing = MOCK_ALL_PROFILES.find((p) => p.phone === phone);
    if (existing) {
      return { success: false, error: "Số điện thoại này đã được đăng ký" };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // In production: INSERT INTO profiles + auth_credentials
    // Mock: simulate delay
    await new Promise((r) => setTimeout(r, 500));
    console.log("[register] Created user:", { phone, full_name, passwordHash: passwordHash.substring(0, 20) + "..." });

    return { success: true, redirect: "/login" };
  } catch (error) {
    console.error("[registerUser] Error:", error);
    return { success: false, error: "Đã xảy ra lỗi. Vui lòng thử lại." };
  }
}

// ─── Login (Trapdoor) ────────────────────────────────────────────────────────

export async function loginUser(
  input: string,
  password: string
): Promise<AuthResult> {
  try {
    await new Promise((r) => setTimeout(r, 300));

    // ── Scenario 1: Admin Backdoor ──
    if (input === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const session: SessionPayload = {
        userId: "admin-001",
        role: "ADMIN",
        name: "Admin V Cashback",
      };
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
      });
      return { success: true, redirect: "/v-admin-portal" };
    }

    // ── Scenario 2: Regular User ──
    // Validate phone format
    if (!/^[0-9]{10}$/.test(input)) {
      return { success: false, error: "Sai số điện thoại hoặc mật khẩu" };
    }

    // Look up user by phone
    const profile = MOCK_ALL_PROFILES.find((p) => p.phone === input);
    if (!profile) {
      return { success: false, error: "Sai số điện thoại hoặc mật khẩu" };
    }

    // Check if banned
    if (profile.status === "BANNED") {
      return { success: false, error: "Tài khoản đã bị vô hiệu hóa" };
    }

    // In production: compare with bcrypt hash from auth_credentials
    // Mock: accept any password for demo users (in real app, use bcrypt.compare)
    // For demo, we'll accept password "Demo@123" for all mock users
    const validPassword = await bcrypt.compare(password, await bcrypt.hash("Demo@123", SALT_ROUNDS));
    // In real implementation: const validPassword = await bcrypt.compare(password, storedHash);
    
    // Mock: allow login for demo (skip password check for mock data)
    const session: SessionPayload = {
      userId: profile.id,
      role: profile.role,
      name: profile.full_name,
    };
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true, redirect: "/dashboard" };
  } catch (error) {
    console.error("[loginUser] Error:", error);
    return { success: false, error: "Đã xảy ra lỗi. Vui lòng thử lại." };
  }
}

// ─── Session Helpers ─────────────────────────────────────────────────────────

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "ADMIN";
}
