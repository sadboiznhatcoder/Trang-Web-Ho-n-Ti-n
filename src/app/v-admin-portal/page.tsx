"use client";

// =============================================================================
// Admin Portal Login - Redirect page (login is via /login trapdoor)
// =============================================================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { getSession } from "@/actions/auth";

export default function AdminPortalPage() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const session = await getSession();
      if (session?.role === "ADMIN") {
        router.replace("/v-admin-portal/dashboard");
      } else {
        router.replace("/login");
      }
    };
    check();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
          <Shield className="w-7 h-7 text-zinc-400" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Đang xác thực...</span>
        </div>
      </motion.div>
    </div>
  );
}
