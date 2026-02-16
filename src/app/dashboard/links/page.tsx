"use client";

// =============================================================================
// Links Page - Light mode link history with data table
// =============================================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinkInput } from "@/components/link-input";
import { MOCK_LINKS } from "@/lib/mock-data";
import { Platform } from "@/types";

const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.SHOPEE]: "bg-orange-50 text-orange-600 border-orange-200",
  [Platform.LAZADA]: "bg-blue-50 text-blue-600 border-blue-200",
  [Platform.TIKTOK]: "bg-pink-50 text-pink-600 border-pink-200",
  [Platform.TIKI]: "bg-cyan-50 text-cyan-600 border-cyan-200",
};

export default function LinksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (shortCode: string, id: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Liên kết của tôi</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý liên kết tiếp thị và theo dõi hiệu suất.
        </p>
      </div>

      {/* Create new link */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-foreground font-semibold mb-4">Tạo liên kết mới</h2>
        <LinkInput />
      </div>

      {/* Links table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-foreground font-semibold">Lịch sử liên kết</h3>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="text-left px-6 py-3 font-medium">Nền tảng</th>
                <th className="text-left px-6 py-3 font-medium">URL gốc</th>
                <th className="text-left px-6 py-3 font-medium">Liên kết ngắn</th>
                <th className="text-center px-6 py-3 font-medium">Lượt click</th>
                <th className="text-left px-6 py-3 font-medium">Ngày tạo</th>
                <th className="text-right px-6 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LINKS.map((link) => (
                <tr key={link.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={PLATFORM_COLORS[link.platform]}>
                      {link.platform}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground text-sm hover:text-foreground truncate max-w-[200px] block"
                    >
                      {link.original_url}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-600 font-mono text-sm">
                      vcash.vn/{link.short_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-foreground">
                      <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{link.click_count.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {new Date(link.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(link.short_code, link.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3 p-4">
          {MOCK_LINKS.map((link) => (
            <div key={link.id} className="bg-muted/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={PLATFORM_COLORS[link.platform]}>
                  {link.platform}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {new Date(link.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className="text-emerald-600 font-mono text-sm">
                vcash.vn/{link.short_code}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MousePointerClick className="w-4 h-4" />
                  {link.click_count} lượt click
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(link.short_code, link.id)}
                >
                  {copiedId === link.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
