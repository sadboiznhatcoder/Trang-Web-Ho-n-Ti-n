// =============================================================================
// Login Page - OAuth sign-in with glassmorphism design
// =============================================================================

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px]" />
            </div>

            <LoginForm />
        </div>
    );
}
