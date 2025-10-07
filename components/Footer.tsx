'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-nav">
        <Link href="/">ホーム</Link>
        <span className="separator">/</span>
        <Link href="/tools">ツール一覧</Link>
        <span className="separator">/</span>
        <Link href="/how-to">使い方</Link>
        <span className="separator">/</span>
        <Link href="/faq">FAQ</Link>
        <span className="separator">/</span>
        <Link href="/cases">活用例</Link>
        <span className="separator">/</span>
        <Link href="/contact">お問い合わせ</Link>
        <span className="separator">/</span>
        <Link href="/privacy">プライバシー</Link>
        <span className="separator">/</span>
        <Link href="/terms">利用規約</Link>
        <span className="separator">/</span>
        <Link href="/sponsors">スポンサー</Link>
      </nav>
      <p className="footer-tagline">迷わず、すぐ形に。ひとふで</p>
      <p className="footer-copyright">© 2025 ひとふで All rights reserved.</p>
      <style jsx>{`
        .site-footer {
          margin-top: 60px;
          padding: 40px 20px 30px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .footer-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 8px 0;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .footer-nav a {
          color: #475569;
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.2s;
        }

        .footer-nav a:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .footer-nav .separator {
          color: #cbd5e1;
          margin: 0 8px;
        }

        .footer-tagline {
          text-align: center;
          font-size: 14px;
          color: #475569;
          margin: 0 0 12px 0;
          font-weight: 500;
        }

        .footer-copyright {
          text-align: center;
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 768px) {
          .site-footer {
            margin-top: 40px;
            padding: 30px 16px 24px;
          }

          .footer-nav {
            font-size: 13px;
            gap: 6px 0;
          }

          .footer-nav .separator {
            margin: 0 6px;
          }

          .footer-copyright {
            font-size: 12px;
          }
        }

        @media print {
          .site-footer {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}