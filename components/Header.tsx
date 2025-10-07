'use client';

import Link from 'next/link';

interface HeaderProps {
  onFeedbackClick?: () => void;
  isToolPage?: boolean;
}

export default function Header({ onFeedbackClick, isToolPage = false }: HeaderProps) {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 52; // ヘッダーの高さ
      const additionalOffset = 28; // 追加の余白
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - additionalOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="site-title-link">
          <div className="logo-container">
            <img src="/logo.png" alt="" className="logo-image" />
            <h1 className="site-title">
              ひとふで
            </h1>
          </div>
        </Link>
        <span className="site-description">
          迷わず、すぐ形に。
        </span>
        <nav className="header-nav">
          <Link href="/" className="nav-link">ホーム</Link>
          <Link href="/tools" className="nav-link">ツール一覧</Link>
          {isToolPage ? (
            <>
              <Link href="#howto" scroll={false} className="nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('howto'); }}>使い方</Link>
              <Link href="#faq" scroll={false} className="nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('faq'); }}>FAQ</Link>
              <Link href="#use-cases" scroll={false} className="nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('use-cases'); }}>活用例</Link>
            </>
          ) : (
            <>
              <Link href="/how-to" className="nav-link">使い方</Link>
              <Link href="/faq" className="nav-link">FAQ</Link>
              <Link href="/cases" className="nav-link">活用例</Link>
            </>
          )}
          <Link href="/contact" className="nav-link">お問い合わせ</Link>
          {onFeedbackClick && (
            <button onClick={onFeedbackClick} className="nav-link feedback-btn">
              フィードバック
            </button>
          )}
        </nav>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #fff;
          border-bottom: 2px solid #333;
          padding: 12px 24px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .site-title-link {
          text-decoration: none;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-image {
          height: 28px;
          width: auto;
        }

        .site-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0;
          color: #333;
        }

        .site-description {
          font-size: 13px;
          color: #666;
          padding-left: 24px;
          border-left: 1px solid #ccc;
        }

        .header-nav {
          margin-left: auto;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-link {
          font-size: 14px;
          color: #333;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
          transition: color 0.2s;
          font-family: inherit;
        }

        .nav-link:hover {
          color: #0066cc;
        }

        .feedback-btn {
          background: #0066cc;
          color: white;
        }

        .feedback-btn:hover {
          background: #0052a3;
          color: white;
        }

        @media print {
          .header {
            padding: 8px 16px;
            border-bottom: 2px solid #333;
          }

          .logo-image {
            height: 24px;
          }

          .site-title {
            font-size: 18px;
          }

          .site-description {
            font-size: 11px;
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 10px 16px;
          }

          .header-content {
            flex-wrap: wrap;
            gap: 12px;
          }

          .logo-image {
            height: 24px;
          }

          .site-title {
            font-size: 18px;
          }

          .site-description {
            display: none;
          }

          .header-nav {
            width: 100%;
            margin-left: 0;
            justify-content: flex-start;
            gap: 12px;
            padding-top: 8px;
            border-top: 1px solid #e0e0e0;
          }

          .nav-link {
            font-size: 13px;
            padding: 4px 8px;
          }
        }
      `}</style>
    </header>
  );
}