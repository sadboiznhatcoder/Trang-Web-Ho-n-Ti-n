"use client";

// =============================================================================
// Landing Nav - Light mode professional header
// =============================================================================

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            V
          </div>
          <span className="text-lg font-bold text-foreground">
            V <span className="text-emerald-600">Cashback</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl gap-1.5">
              Đăng ký
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
