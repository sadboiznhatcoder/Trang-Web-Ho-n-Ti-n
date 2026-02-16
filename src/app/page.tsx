// =============================================================================
// Landing Page - Public hero with animated link input, social proof, features
// =============================================================================

import { LinkInput } from "@/components/link-input";
import { SocialProofTicker } from "@/components/social-proof-ticker";
import { FABSupport } from "@/components/fab-support";
import { LandingFeatures } from "@/components/landing-features";
import { LandingNav } from "@/components/landing-nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="flex flex-col items-center justify-center min-h-[85vh] px-4 pb-20">
          {/* Social proof ticker */}
          <SocialProofTicker />

          {/* Hero content */}
          <div className="text-center mb-10 mt-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Nhận{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Hoàn Tiền
              </span>
              <br />
              Mỗi Lần Mua Sắm
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Chuyển đổi bất kỳ liên kết Shopee, Lazada, TikTok Shop hoặc Tiki
              thành liên kết hoàn tiền. Mua sắm như thường và nhận lại tới{" "}
              <span className="text-emerald-400 font-semibold">12%</span>.
            </p>
          </div>

          {/* Link Input */}
          <LinkInput />

          {/* Platform badges */}
          <div className="flex items-center gap-4 mt-10 flex-wrap justify-center">
            {["Shopee", "Lazada", "TikTok Shop", "Tiki"].map((name) => (
              <div
                key={name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all cursor-default"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Features section */}
        <LandingFeatures />

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-12 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
              <span className="text-zinc-400 text-sm">
                © 2025 V Cashback. Bảo lưu mọi quyền.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">
                Điều khoản dịch vụ
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Liên hệ
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* FAB Support */}
      <FABSupport />
    </div>
  );
}
