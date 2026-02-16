import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "V Cashback | Hoàn Tiền Mỗi Lần Mua Sắm",
  description:
    "Chuyển đổi bất kỳ liên kết Shopee, Lazada, TikTok Shop hoặc Tiki thành liên kết hoàn tiền. Mua sắm như thường và nhận hoàn tiền lên đến 12%.",
  keywords: [
    "hoàn tiền",
    "tiếp thị liên kết",
    "shopee",
    "lazada",
    "tiktok shop",
    "tiki",
    "vietnam",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
