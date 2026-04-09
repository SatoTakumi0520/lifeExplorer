import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://life-explorer.vercel.app';

export const metadata: Metadata = {
  title: "Life Explorer",
  description: "誰かのライフスタイルを借りて、まだ知らない自分に出会おう。ルーティン探索・実践アプリ",
  manifest: "/manifest.json",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "Life Explorer",
    description: "誰かのライフスタイルを借りて、まだ知らない自分に出会おう",
    siteName: "Life Explorer",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Explorer",
    description: "誰かのライフスタイルを借りて、まだ知らない自分に出会おう",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Life Explorer",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1917",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="overflow-x-hidden">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden w-full`}
      >
        {children}
      </body>
    </html>
  );
}
