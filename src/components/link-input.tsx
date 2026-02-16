"use client";

// =============================================================================
// LinkInput - Smart link converter with typewriter animation (Light Mode)
// =============================================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Loader2, Check, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateLink } from "@/actions/generate-link";

interface GenerateLinkResult {
  success: boolean;
  data?: {
    affiliate_url: string;
    short_url: string;
    platform: string;
    estimated_commission: string;
  };
  error?: string;
}

const PLACEHOLDER_TEXTS = [
  "Dán liên kết Shopee của bạn...",
  "Dán liên kết Lazada của bạn...",
  "Dán liên kết TikTok Shop của bạn...",
  "Dán liên kết Tiki của bạn...",
];

export function LinkInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateLinkResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");

  // Typewriter effect
  useEffect(() => {
    const currentText = PLACEHOLDER_TEXTS[placeholderIndex];
    let charIndex = 0;

    const interval = setInterval(() => {
      setDisplayedPlaceholder(currentText.slice(0, charIndex + 1));
      charIndex++;
      if (charIndex === currentText.length) {
        clearInterval(interval);
        setTimeout(() => {
          const delInterval = setInterval(() => {
            charIndex--;
            setDisplayedPlaceholder(currentText.slice(0, charIndex));
            if (charIndex === 0) {
              clearInterval(delInterval);
              setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_TEXTS.length);
            }
          }, 30);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [placeholderIndex]);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setCopied(false);
    const res = await generateLink(url.trim());
    setResult(res);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (result?.data?.short_url) {
      await navigator.clipboard.writeText(result.data.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="flex items-center bg-card border-2 border-border rounded-2xl overflow-hidden focus-within:border-emerald-400 transition-colors shadow-sm">
          <div className="pl-5 text-muted-foreground">
            <Link2 className="w-5 h-5" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
            placeholder={displayedPlaceholder}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground px-4 py-4 text-base outline-none"
            disabled={loading}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !url.trim()}
            className="m-2 px-6 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Chuyển đổi"}
          </Button>
        </div>
      </div>

      {/* Result display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4"
          >
            {result.success && result.data ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Chuyển đổi thành công!</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-emerald-100">
                  <div>
                    <span className="text-xs text-muted-foreground">Nền tảng</span>
                    <p className="text-sm font-medium text-foreground">{result.data.platform}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Hoa hồng ước tính</span>
                    <p className="text-emerald-600 font-bold text-lg">{result.data.estimated_commission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-emerald-100">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground">Liên kết rút gọn</span>
                    <p className="text-emerald-600 font-mono text-sm truncate">{result.data.short_url}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0 rounded-lg">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">{result.error}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
