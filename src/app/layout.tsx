import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TopLoader from "@/shared/ui/TopLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Semin's Blog",
  description:
    "경제학과 컴퓨터공학을 공부하고 있습니다. 게임이론과 산업조직론에 관심이 있으며, 비정기적으로 포스트를 업로드할 예정입니다.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TopLoader />
        {children}
      </body>
    </html>
  );
}
