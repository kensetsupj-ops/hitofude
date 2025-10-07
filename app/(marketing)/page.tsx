'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': '/#webpage',
    url: '/',
    name: 'ひとふで｜迷わず、すぐ形に。',
    description: 'ひとふでは、誰でも迷わず「要点をすぐ形に」できる小さなツール群です。案内、チェック、指示、共有まで。',
    isPartOf: {
      '@type': 'WebSite',
      '@id': '/#website',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-container">
        {/* Hero Section */}
        <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
          <div className="hero-decoration"></div>
          <h1 className="hero-title">
            ひとふで｜誰でも迷わず作れるオンラインツール
          </h1>
        </section>

        {/* About Section */}
        <section className="section about-section">
          <div className="section-header">
            <h2>ひとふでとは</h2>
            <div className="underline"></div>
          </div>
          <p className="about-text">
            ひとふでは、誰でも迷わず"要点をすぐ形に"できる小さなツール群です。
          </p>
          <p className="about-text">
            案内、チェック、指示、共有まで。余計を足さず、伝わるを最短で。
            無料・ログイン不要で今すぐ使えます。
          </p>
        </section>

        {/* Features Section */}
        <section className="section features-section">
          <div className="section-header">
            <h2>できること</h2>
            <div className="underline"></div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">→</div>
              <h3>案内</h3>
              <p>経路図、訪問ルート、会場案内など、わかりやすい案内をすぐ形に。</p>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="section tools-section">
          <div className="section-header">
            <h2>今使えるツール</h2>
            <div className="underline"></div>
          </div>

          <Link href="/tools/delivery-guide" className="tool-card-link">
            <div className="tool-card">
              <div className="tool-badge">BETA</div>
              <h3>ひとふで案内図</h3>
              <p>
                搬入経路、配送ルート、訪問案内を地図上に描いて共有。
                矢印と一言で、誰にでも伝わる案内図が作れます。
              </p>
              <span className="tool-link">
                案内図を作る →
              </span>
            </div>
          </Link>

          <p className="tools-note">
            その他のツールは準備中です。順次追加していきます。
          </p>
        </section>

        {/* Links Section */}
        <section className="section links-section">
          <div className="section-header">
            <h2>もっと知る</h2>
            <div className="underline"></div>
          </div>
          <ul className="links-list">
            <li>
              <Link href="/tools/delivery-guide/how-to" className="link-item">
                使い方ガイド
              </Link>
            </li>
            <li>
              <Link href="/guides/faq" className="link-item">
                よくある質問
              </Link>
            </li>
            <li>
              <Link href="/guides/cases-construction" className="link-item">
                活用例
              </Link>
            </li>
          </ul>
        </section>

        {/* Changelog Section */}
        <section className="section changelog-section">
          <div className="section-header">
            <h2>更新履歴</h2>
            <div className="underline"></div>
          </div>
          <div className="changelog-list">
            <div className="changelog-item">
              <div className="changelog-date">2025.10.07</div>
              <div className="changelog-content">
                <h3>ひとふで案内図（ベータ版）公開</h3>
                <p>搬入経路・配送ルート・訪問案内を地図上に描いて共有できるツールをリリースしました。</p>
              </div>
            </div>
            <div className="changelog-item">
              <div className="changelog-date">2025.10.07</div>
              <div className="changelog-content">
                <h3>ホームページ開設</h3>
                <p>「ひとふで」公式サイトを開設しました。</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="cta-box">
            <div className="hero-cta">
              <Link href="/tools" className="btn btn-secondary">
                ツール一覧を見る
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 640px;
          margin: 0 auto;
          padding: 80px 20px;
          font-family: system-ui, sans-serif;
          color: #000;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          margin-bottom: 120px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-decoration {
          position: absolute;
          top: -20px;
          left: -20px;
          width: 80px;
          height: 80px;
          border: 2px solid #000;
          border-radius: 50%;
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        .hero-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 24px;
          color: #000;
          position: relative;
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-subtitle {
          font-size: 16px;
          line-height: 1.8;
          color: #333;
          margin-bottom: 48px;
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s backwards;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s backwards;
        }

        /* Buttons */
        .btn {
          display: inline-block;
          padding: 14px 32px;
          text-decoration: none;
          fontSize: 15px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: #000;
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-primary:hover {
          background: #222;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
          background: #fff;
          color: #000;
          border: 2px solid #333;
        }

        .btn-secondary:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .btn-secondary:active {
          transform: translateY(0);
        }

        /* Sections */
        .section {
          margin-bottom: 100px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          margin-bottom: 40px;
          text-align: center;
        }

        .section-header h2 {
          font-size: 28px;
          font-weight: bold;
          color: #000;
          margin-bottom: 16px;
        }

        .underline {
          width: 60px;
          height: 3px;
          background: #000;
          margin: 0 auto;
          position: relative;
        }

        .underline::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: #666;
          animation: expandLine 1.5s ease-out forwards;
        }

        @keyframes expandLine {
          to {
            width: 100%;
          }
        }

        /* About Section */
        .about-text {
          font-size: 15px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 16px;
          padding-left: 20px;
          border-left: 3px solid #000;
          transition: all 0.3s ease;
        }

        .about-text:hover {
          border-left-width: 6px;
          padding-left: 24px;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 24px;
        }

        .feature-card {
          padding: 24px;
          border: 2px solid #ddd;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid #000;
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          border-color: #000;
          transform: translateY(-8px);
          box-shadow: 8px 8px 0 #000;
        }

        .feature-card:hover::before {
          opacity: 0.1;
          transform: scale(1);
        }

        .feature-icon {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #000;
        }

        .feature-card h3 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #000;
        }

        .feature-card p {
          font-size: 14px;
          line-height: 1.6;
          color: #555;
        }

        .coming-soon {
          display: block;
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }

        /* Tool Card */
        .tool-card-link {
          display: block;
          text-decoration: none;
          color: inherit;
          margin-bottom: 24px;
        }

        .tool-card {
          padding: 32px;
          border: 3px solid #000;
          position: relative;
          background: #fff;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 8px 8px 0 #000;
          cursor: pointer;
        }

        :global(.tool-card-link:hover) .tool-card {
          transform: translate(4px, 4px);
          box-shadow: 4px 4px 0 #000;
        }

        .tool-badge {
          position: absolute;
          top: -12px;
          right: 24px;
          background: #000;
          color: #fff;
          padding: 4px 16px;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .tool-card h3 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 16px;
          color: #000;
        }

        .tool-card p {
          font-size: 15px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 24px;
        }

        .tool-link {
          display: inline-block;
          color: #000;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          position: relative;
          transition: all 0.3s ease;
        }

        .tool-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #000;
          transition: width 0.3s ease;
        }

        :global(.tool-card-link:hover) .tool-link {
          transform: translateX(4px);
        }

        :global(.tool-card-link:hover) .tool-link::after {
          width: 100%;
        }

        .tools-note {
          font-size: 14px;
          color: #999;
          text-align: center;
          margin-top: 24px;
        }

        /* Links List */
        .links-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .links-list li {
          margin-bottom: 16px;
          position: relative;
          padding-left: 24px;
        }

        .links-list li::before {
          content: '▶';
          position: absolute;
          left: 0;
          font-size: 12px;
          transition: transform 0.3s ease;
        }

        .links-list li:hover::before {
          transform: translateX(4px);
        }

        .link-item {
          color: #000;
          text-decoration: none;
          font-size: 15px;
          position: relative;
          transition: all 0.3s ease;
        }

        .link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #000;
          transition: width 0.3s ease;
        }

        .link-item:hover {
          color: #000;
        }

        .link-item:hover::after {
          width: 100%;
        }

        /* Changelog Section */
        .changelog-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .changelog-item {
          display: flex;
          gap: 24px;
          padding: 20px;
          border-left: 3px solid #000;
          transition: all 0.3s ease;
        }

        .changelog-item:hover {
          border-left-width: 6px;
          padding-left: 24px;
          background: #f9f9f9;
        }

        .changelog-date {
          font-size: 14px;
          font-weight: bold;
          color: #666;
          white-space: nowrap;
          min-width: 100px;
        }

        .changelog-content {
          flex: 1;
        }

        .changelog-content h3 {
          font-size: 16px;
          font-weight: bold;
          color: #000;
          margin-bottom: 8px;
        }

        .changelog-content p {
          font-size: 14px;
          line-height: 1.8;
          color: #555;
          margin: 0;
        }

        /* CTA Section */
        .cta-section {
          padding-top: 60px;
          border-top: 2px solid #000;
          position: relative;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #666;
          animation: expandCTA 1.5s ease-out forwards;
          animation-delay: 0.5s;
        }

        @keyframes expandCTA {
          to {
            width: 100%;
          }
        }

        .cta-box {
          text-align: center;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 60px 16px;
          }

          .hero-section {
            margin-bottom: 80px;
          }

          .hero-title {
            font-size: 28px;
          }

          .section-header h2 {
            font-size: 24px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .tool-card {
            padding: 24px;
          }

          .changelog-item {
            flex-direction: column;
            gap: 12px;
          }

          .changelog-date {
            min-width: auto;
          }
        }
      `}</style>
    </>
  );
}
