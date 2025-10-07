import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ひとふで案内図｜搬入経路図・配送ルート・訪問案内を地図で作成',
  description: '搬入経路、配送ルート、訪問案内を地図上に描いて共有。矢印と一言で、誰にでも伝わる案内図が作れます。無料・ログイン不要で今すぐ使えます。',
  keywords: '搬入経路図,配送ルート,案内図作成,地図,PDF,無料ツール,建設,物流,訪問サービス',
  openGraph: {
    title: 'ひとふで案内図｜搬入経路図・配送ルート作成ツール',
    description: '搬入経路、配送ルート、訪問案内を地図上に描いて共有。無料・ログイン不要で今すぐ使えます。',
    url: '/tools/delivery-guide',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ひとふで案内図 - 搬入経路図作成ツール',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ひとふで案内図｜搬入経路図・配送ルート作成ツール',
    description: '搬入経路、配送ルート、訪問案内を地図上に描いて共有。無料・ログイン不要。',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/tools/delivery-guide',
  },
};

export default function DeliveryGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // delivery-guide/page.tsx has its own Header/Footer implementation
  // So we just return children without wrapping layout
  return children;
}
