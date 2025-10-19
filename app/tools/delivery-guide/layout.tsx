import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '案内図｜搬入経路・配送ルート・訪問案内の作成ツール【無料】',
  description: '搬入経路、配送ルート、訪問案内を地図上に描いて共有できる無料ツール。建設、物流、配送、訪問サービス、イベント運営など幅広い業種に対応。Google Maps連携、ログイン不要で今すぐ使えます。',
  keywords: '案内図作成,搬入経路図,配送ルート,訪問案内,地図,無料ツール,建設,物流,配送,訪問サービス,イベント運営,Google Maps,ログイン不要,業務効率化',
  openGraph: {
    title: '案内図｜搬入経路・配送ルート・訪問案内の作成ツール【無料】',
    description: '搬入経路、配送ルート、訪問案内を地図上に描いて共有。建設、物流、配送、訪問サービス、イベント運営など幅広く対応。Google Maps連携、ログイン不要。',
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
    title: '案内図｜搬入経路・配送ルート・訪問案内の作成ツール【無料】',
    description: '搬入経路、配送ルート、訪問案内を地図上に描いて共有。建設、物流、配送、訪問サービス、イベント運営など幅広く対応。ログイン不要。',
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
