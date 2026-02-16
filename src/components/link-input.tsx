"use client";

// =============================================================================
// LinkInput - Smart link converter with typewriter animation & glow effect
// =============================================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Loader2, Check, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateLink } from "@/actions/generate-link";
import type { GenerateLinkResult } from "@/types";

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
    const [isTyping, setIsTyping] = useState(true);

    // Typewriter effect for placeholder
    useEffect(() => {
        const currentText = PLACEHOLDER_TEXTS[placeholderIndex];
        let charIndex = 0;
        let isDeleting = false;

        const interval = setInterval(() => {
            if (!isDeleting) {
                setDisplayedPlaceholder(currentText.slice(0, charIndex + 1));
                charIndex++;
                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(() => {
                        const delInterval = setInterval(() => {
                            charIndex--;
                            setDisplayedPlaceholder(currentText.slice(0, charIndex));
                            if (charIndex === 0) {
                                clearInterval(delInterval);
                                setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_TEXTS.length);
                            }
                        }, 30);
                        return () => clearInterval(delInterval);
                    }, 2000);
                    clearInterval(interval);
                }
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) handleSubmit();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Input field with glow effect */}
            <div className="relative group">
                {/* Glow background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />

                <div className="relative flex items-center bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="pl-5 text-zinc-400">
                        <Link2 className="w-5 h-5" />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            setResult(null);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={displayedPlaceholder}
                        className="flex-1 bg-transparent text-white placeholder-zinc-500 px-4 py-5 text-lg outline-none"
                        disabled={loading}
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !url.trim()}
                        className="m-2 px-6 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Chuyển đổi"
                        )}
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
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mt-4"
                    >
                        {result.success && result.data ? (
                            <div className="bg-zinc-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Check className="w-5 h-5" />
                                    <span className="font-semibold">Chuyển đổi liên kết thành công!</span>
                                </div>

                                <div className="grid gap-3 text-sm">
                                    <div className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3">
                                        <div>
                                            <span className="text-zinc-400">Nền tảng</span>
                                            <p className="text-white font-medium">{result.data.platform}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-zinc-400">Hoa hồng ước tính</span>
                                            <p className="text-emerald-400 font-bold text-lg">
                                                {result.data.estimated_commission}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-3">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-zinc-400 text-xs">Liên kết rút gọn</span>
                                            <p className="text-cyan-400 font-mono text-sm truncate">
                                                {result.data.short_url}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="shrink-0 border-white/10 hover:bg-white/10"
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
                                <div className="flex items-center gap-2 text-red-400">
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
