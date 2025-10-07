'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログ出力（本番環境では外部サービスに送信も可）
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">500</h1>
        <h2 className="error-title">エラーが発生しました</h2>
        <p className="error-message">
          申し訳ございません。予期しないエラーが発生しました。
          <br />
          しばらくしてから再度お試しください。
        </p>
        <div className="error-actions">
          <button onClick={reset} className="retry-button">
            再試行
          </button>
          <Link href="/tools/delivery-guide" className="back-button">
            ひとふで案内図に戻る
          </Link>
        </div>
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
          color: #c00;
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

        .error-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .retry-button,
        .back-button {
          display: inline-block;
          padding: 12px 32px;
          background: #333;
          color: white;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
        }

        .retry-button:hover,
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

          .error-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}