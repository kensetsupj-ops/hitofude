'use client';

import Head from 'next/head';
import { Guide } from '@/lib/types';

interface SEOHeadProps {
  guide: Guide;
}

export default function SEOHead({ guide }: SEOHeadProps) {
  const title = `搬入経路図｜${guide.meta.site || '現場'} ${guide.meta.address || ''} ${guide.meta.date || ''}`.slice(0, 60);
  const description = `${guide.meta.address || ''}の搬入経路図。${guide.meta.date || ''}${guide.meta.time || ''}搬入予定。A4横向き印刷対応。車両制限：高さ${guide.meta.h_limit_mm || '-'}mm、幅${guide.meta.w_limit_m || '-'}m。`.slice(0, 160);

  const url = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "搬入経路図ツール",
    "description": "建設現場への搬入経路を地図上に描画し、A4印刷・PDF出力できるツール",
    "url": url,
    "provider": {
      "@type": "Organization",
      "name": "搬入経路図システム"
    },
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    }
  };

  const placeJsonLd = guide.meta.address ? {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": guide.meta.site || "建設現場",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": guide.meta.address,
      "addressCountry": "JP"
    }
  } : null;

  return (
    <>
      <Head>
        {/* 基本メタタグ */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={url} />

        {/* OGP */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="搬入経路図ツール" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {/* robots */}
        <meta name="robots" content="index,follow" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {placeJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
          />
        )}

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
      </Head>

      <style jsx global>{`
        /* Core Web Vitals最適化 */
        * {
          font-display: swap;
        }

        img {
          height: auto;
          max-width: 100%;
        }

        /* 印刷時の広告非表示 */
        @media print {
          .no-print,
          .ad-unit,
          [data-ad-id] {
            display: none !important;
          }
        }

        /* レイアウトシフト防止 */
        .ad-unit {
          contain: layout;
        }
      `}</style>
    </>
  );
}