'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">ページが見つかりません</h2>
        <p className="error-message">
          お探しのページは存在しないか、移動または削除された可能性があります。
        </p>
        <Link href="/tools/delivery-guide" className="back-button">
          ひとふで案内図に戻る
        </Link>
      </div>

      <style jsx>{`
        .error-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f9f9f9;
          font-family: system-ui, "Noto Sans JP", sans-serif;
          padding: 20px;
        }

        .error-content {
          text-align: center;
          max-width: 500px;
        }

        .error-code {
          font-size: 120px;
          font-weight: bold;
          margin: 0;
          color: #333;
          line-height: 1;
        }

        .error-title {
          font-size: 28px;
          font-weight: bold;
          margin: 20px 0 16px;
          color: #333;
        }

        .error-message {
          font-size: 16px;
          color: #666;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .back-button {
          display: inline-block;
          padding: 12px 32px;
          background: #333;
          color: white;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .error-code {
            font-size: 80px;
          }

          .error-title {
            font-size: 24px;
          }

          .error-message {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}