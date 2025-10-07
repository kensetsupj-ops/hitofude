'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  onFeedbackClick?: () => void;
  isToolPage?: boolean;
}

export default function Header({ onFeedbackClick, isToolPage = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleScrollTo = (id: string) => {
    closeMenu();
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

        {/* ハンバーガーボタン（モバイルのみ） */}
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="メニュー">
          <span className="hamburger-icon">☰</span>
        </button>

        {/* デスクトップナビゲーション */}
        <nav className="header-nav desktop-nav">
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

      {/* モバイルメニューオーバーレイ */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <Link href="/" className="mobile-nav-link" onClick={closeMenu}>ホーム</Link>
            <Link href="/tools" className="mobile-nav-link" onClick={closeMenu}>ツール一覧</Link>
            {isToolPage ? (
              <>
                <Link href="#howto" scroll={false} className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('howto'); }}>使い方</Link>
                <Link href="#faq" scroll={false} className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('faq'); }}>FAQ</Link>
                <Link href="#use-cases" scroll={false} className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleScrollTo('use-cases'); }}>活用例</Link>
              </>
            ) : (
              <>
                <Link href="/how-to" className="mobile-nav-link" onClick={closeMenu}>使い方</Link>
                <Link href="/faq" className="mobile-nav-link" onClick={closeMenu}>FAQ</Link>
                <Link href="/cases" className="mobile-nav-link" onClick={closeMenu}>活用例</Link>
              </>
            )}
            <Link href="/contact" className="mobile-nav-link" onClick={closeMenu}>お問い合わせ</Link>
            {onFeedbackClick && (
              <button onClick={() => { closeMenu(); onFeedbackClick(); }} className="mobile-nav-link mobile-feedback-btn">
                フィードバック
              </button>
            )}
          </nav>
        </div>
      )}

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

        /* ハンバーガーボタン */
        .hamburger-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          margin-left: auto;
        }

        .hamburger-icon {
          font-size: 28px;
          color: #000;
          line-height: 1;
        }

        /* モバイルメニューオーバーレイ */
        .mobile-menu-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
        }

        .mobile-menu {
          position: absolute;
          top: 52px;
          right: 0;
          width: 280px;
          max-width: 80vw;
          background: #fff;
          border-left: 2px solid #333;
          border-bottom: 2px solid #333;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-nav-link {
          display: block;
          padding: 14px 16px;
          color: #000;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          border-bottom: 1px solid #e0e0e0;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
        }

        .mobile-nav-link:hover {
          background: #f5f5f5;
        }

        .mobile-nav-link:last-child {
          border-bottom: none;
        }

        .mobile-feedback-btn {
          font-family: inherit;
        }

        @media (max-width: 768px) {
          .header {
            padding: 10px 16px;
          }

          .header-content {
            flex-wrap: nowrap;
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

          /* デスクトップナビを非表示 */
          .desktop-nav {
            display: none !important;
          }

          /* ハンバーガーボタンを表示 */
          .hamburger-btn {
            display: block;
          }

          /* モバイルメニューオーバーレイを表示 */
          .mobile-menu-overlay {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}