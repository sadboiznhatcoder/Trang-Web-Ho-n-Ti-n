"use client";

// =============================================================================
// FAB Support - Light mode floating action button
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FabSupport() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:bottom-8 lg:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-emerald-600 text-white px-5 py-4">
              <h3 className="font-semibold text-sm">Hỗ trợ khách hàng</h3>
              <p className="text-emerald-100 text-xs mt-0.5">
                Phản hồi trong vòng 5 phút
              </p>
            </div>
            <div className="p-4">
              <div className="bg-muted rounded-xl p-3 mb-3">
                <p className="text-sm text-foreground">
                  Xin chào! Tôi có thể giúp gì cho bạn?
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">CSKH • Vừa xong</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-emerald-400"
                />
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 w-10 p-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-all"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  );
}
