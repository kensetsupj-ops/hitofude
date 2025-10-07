import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./print.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ひとふで｜迷わず、すぐ形に。",
    template: "ひとふで｜%s"
  },
  description: "ひとふでは、誰でも迷わず「要点をすぐ形に」できる小さなツール群です。案内、チェック、指示、共有まで。余計を足さず、伝わるを最短で。無料・ログイン不要で今すぐ使えます。",
  keywords: "オンラインツール,無料ツール,案内図作成,チェックリスト,指示書,共有ツール,業務効率化,現場管理,イベント運営,ビジネスツール",
  authors: [{ name: "ひとふで" }],
  creator: "ひとふで",
  publisher: "ひとふで",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://hitofude.net'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon.ico' },
    ],
  },
  openGraph: {
    title: "ひとふで｜迷わず、すぐ形に。",
    description: "誰でも迷わず「要点をすぐ形に」できる小さなツール群。案内、チェック、指示、共有まで。無料・ログイン不要で今すぐ使えます。",
    url: "/",
    siteName: "ひとふで",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ひとふで - 迷わず、すぐ形に。',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ひとふで｜迷わず、すぐ形に。",
    description: "誰でも迷わず「要点をすぐ形に」できる小さなツール群。無料・ログイン不要で今すぐ使えます。",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'productivity',
  alternates: {
    canonical: '/',
  },
  applicationName: 'ひとふで',
  referrer: 'origin-when-cross-origin',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 構造化データ（JSON-LD）
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ひとふで',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://hitofude.net',
    description: 'ひとふでは、誰でも迷わず「要点をすぐ形に」できる小さなツール群です。',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hitofude.net'}/tools?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ひとふで',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://hitofude.net',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hitofude.net'}/og-image.png`,
    description: '誰でも迷わず「要点をすぐ形に」できる小さなツール群を提供',
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleAnalytics />
        <MicrosoftClarity />
        {children}
      </body>
    </html>
  );
}