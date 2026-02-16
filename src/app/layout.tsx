import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "V Cashback | Mua Sắm Hoàn Tiền Lên Đến 50%",
  description:
    "Nền tảng hoàn tiền hàng đầu Việt Nam. Dán link Shopee, Lazada, TikTok Shop hoặc Tiki và nhận hoàn tiền lên đến 50% mỗi đơn hàng.",
  keywords: [
    "hoàn tiền",
    "cashback",
    "shopee",
    "lazada",
    "tiktok shop",
    "tiki",
    "vietnam",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
