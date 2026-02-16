"use client";

// =============================================================================
// Homepage - ShopBack-style with Hero, Categories, Flash Deals, Footer
// =============================================================================

import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Smartphone,
  Plane,
  Sparkles,
  ChevronRight,
  Shield,
  Headphones,
  Zap,
  Star,
  TrendingUp,
  Gift,
  ArrowRight,
  BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LandingNav } from "@/components/landing-nav";
import Link from "next/link";

// ─── Category Data ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Thời trang", icon: ShoppingBag, color: "bg-pink-100 text-pink-600", cashback: "12%" },
  { name: "Điện tử", icon: Smartphone, color: "bg-blue-100 text-blue-600", cashback: "8%" },
  { name: "Du lịch", icon: Plane, color: "bg-amber-100 text-amber-600", cashback: "6%" },
  { name: "Làm đẹp", icon: Sparkles, color: "bg-purple-100 text-purple-600", cashback: "15%" },
  { name: "Gia dụng", icon: Gift, color: "bg-teal-100 text-teal-600", cashback: "10%" },
  { name: "Sức khỏe", icon: TrendingUp, color: "bg-red-100 text-red-600", cashback: "7%" },
];

// ─── Flash Deals ─────────────────────────────────────────────────────────────
const FLASH_DEALS = [
  { store: "Shopee", cashback: "Hoàn đến 12%", badge: "HOT", color: "border-orange-200 bg-orange-50", badgeColor: "bg-orange-500", textColor: "text-orange-600" },
  { store: "Lazada", cashback: "Hoàn đến 10%", badge: "SALE", color: "border-blue-200 bg-blue-50", badgeColor: "bg-blue-500", textColor: "text-blue-600" },
  { store: "TikTok Shop", cashback: "Hoàn đến 15%", badge: "MỚI", color: "border-pink-200 bg-pink-50", badgeColor: "bg-pink-500", textColor: "text-pink-600" },
  { store: "Tiki", cashback: "Hoàn đến 8%", badge: "UY TÍN", color: "border-cyan-200 bg-cyan-50", badgeColor: "bg-cyan-500", textColor: "text-cyan-600" },
  { store: "Sendo", cashback: "Hoàn đến 9%", badge: "MỚI", color: "border-red-200 bg-red-50", badgeColor: "bg-red-500", textColor: "text-red-600" },
];

// ─── Stats ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: "50K+", label: "Người dùng" },
  { value: "2M+", label: "Đơn hoàn tiền" },
  { value: "15 Tỷ+", label: "VNĐ đã hoàn" },
  { value: "4.9★", label: "Đánh giá" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-background" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                Nền tảng hoàn tiền #1 Việt Nam
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Mua sắm hoàn tiền{" "}
                <br className="hidden sm:block" />
                lên đến{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent text-5xl md:text-6xl lg:text-7xl font-black">
                    50%
                  </span>
                  <span className="absolute -top-2 -right-4 text-lg">🔥</span>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
                Dán link từ Shopee, Lazada, TikTok Shop hoặc Tiki
                và nhận hoàn tiền mỗi lần mua sắm.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-2 bg-white border-2 border-emerald-200 rounded-2xl p-2 shadow-lg shadow-emerald-500/10 focus-within:border-emerald-400 transition-colors">
                <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
                <Input
                  type="text"
                  placeholder="Dán link Shopee/Lazada/TikTok Shop..."
                  className="flex-1 border-0 shadow-none bg-transparent h-12 text-base focus-visible:ring-0"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-6 font-semibold shrink-0">
                  Tạo link
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Hỗ trợ Shopee, Lazada, TikTok Shop, Tiki và nhiều sàn khác
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-emerald-600">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Category Grid ═══ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Danh mục hoàn tiền</h2>
            <p className="text-muted-foreground text-sm mt-1">Khám phá ưu đãi theo ngành hàng</p>
          </div>
          <Button variant="ghost" className="text-emerald-600 font-medium text-sm gap-1">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{cat.name}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">Hoàn {cat.cashback}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ Flash Deals Carousel ═══ */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Ưu đãi nổi bật</h2>
                <p className="text-muted-foreground text-sm">Hoàn tiền cao nhất hôm nay</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide">
            {FLASH_DEALS.map((deal, i) => (
              <motion.div
                key={deal.store}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`shrink-0 w-[220px] snap-start border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all ${deal.color}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${deal.badgeColor}`}>
                    {deal.badge}
                  </span>
                  <BadgePercent className={`w-5 h-5 ${deal.textColor}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{deal.store}</h3>
                <p className={`text-sm font-semibold ${deal.textColor}`}>{deal.cashback}</p>
                <Button variant="ghost" size="sm" className={`mt-3 text-xs font-medium ${deal.textColor} p-0 h-auto`}>
                  Mua ngay <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Nhận hoàn tiền chỉ trong <span className="text-emerald-600">3 bước</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Cực kỳ đơn giản — không cần thay đổi thói quen mua sắm
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Dán link sản phẩm", desc: "Copy link từ Shopee, Lazada, TikTok Shop hoặc Tiki và dán vào thanh tìm kiếm", icon: Search },
            { step: "2", title: "Mua sắm như thường", desc: "Click link đã chuyển đổi và hoàn tất đơn hàng trên sàn thương mại", icon: ShoppingBag },
            { step: "3", title: "Nhận hoàn tiền", desc: "Tiền hoàn sẽ được cộng vào ví và bạn có thể rút về tài khoản ngân hàng", icon: Gift },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="relative bg-card border border-border rounded-2xl p-6 text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                {item.step}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mt-4 mb-4">
                <item.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mx-6 mb-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-10 md:p-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Bắt đầu tiết kiệm ngay hôm nay
          </h2>
          <p className="text-emerald-100 mb-8 max-w-lg mx-auto">
            Tham gia cùng hơn 50,000 người dùng thông minh đang nhận hoàn tiền mỗi ngày.
          </p>
          <Link href="/register">
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl h-12 px-8 text-base shadow-lg">
              Tạo tài khoản miễn phí
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">V</div>
                <span className="text-lg font-bold text-foreground">V <span className="text-emerald-600">Cashback</span></span>
              </div>
              <p className="text-muted-foreground text-sm">
                Nền tảng hoàn tiền mua sắm trực tuyến hàng đầu Việt Nam.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Sản phẩm</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Hoàn tiền Shopee</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hoàn tiền Lazada</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hoàn tiền TikTok</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hoàn tiền Tiki</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Hướng dẫn sử dụng</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Liên hệ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Pháp lý</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a></li>
              </ul>
            </div>
          </div>

          {/* Trust badges + Copyright */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                Bảo mật SSL
              </div>
              <div className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-emerald-600" />
                Hỗ trợ 24/7
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-emerald-600" />
                4.9/5 đánh giá
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 V Cashback. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
