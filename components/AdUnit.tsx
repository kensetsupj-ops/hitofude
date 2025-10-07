'use client';

import { useEffect, useRef, useState } from 'react';
import { adControl } from '@/lib/adControl';

interface AdUnitProps {
  id: string;
  size: string[];
  className?: string;
  sticky?: boolean;
  closeable?: boolean;
}

export default function AdUnit({
  id,
  size,
  className = '',
  sticky = false,
  closeable = false
}: AdUnitProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [canShow, setCanShow] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 広告制御リスナー（スティッキー広告用）
  useEffect(() => {
    if (sticky) {
      const unsubscribe = adControl.subscribe((state) => {
        // モバイルスティッキー広告の場合、記事内広告が表示中は非表示
        setCanShow(!state.inArticleVisible);
      });

      adControl.setMobileBottomStickyVisible(true);

      return () => {
        adControl.setMobileBottomStickyVisible(false);
        unsubscribe();
      };
    }
  }, [sticky]);

  // AdBlock検出
  useEffect(() => {
    const checkAdBlock = async () => {
      try {
        // TODO: 実際のAdSenseスクリプト読み込みチェック
        const blocked = false;
        setIsAdBlocked(blocked);
      } catch (error) {
        setIsAdBlocked(true);
      }
    };

    setTimeout(checkAdBlock, 500);
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    setIsVisible(false);
    if (sticky) {
      adControl.setMobileBottomStickyVisible(false);
    }
  };

  const handleAdClick = () => {
    // TODO: 実際の計測サービスに送信
  };

  // スティッキーで制御により非表示の場合
  if (sticky && !canShow) {
    return null;
  }

  if (!isVisible || isClosed) {
    return null;
  }

  const [width, height] = size[0]?.split('x').map(Number) || [0, 0];

  return (
    <div
      ref={containerRef}
      className={`ad-unit-container ${className} ${sticky ? 'sticky-ad' : ''}`}
      style={{
        minWidth: `${width}px`,
        minHeight: `${height}px`,
      }}
    >
      <div className="ad-label" role="contentinfo" aria-label="広告">
        広告
      </div>

      {!isAdBlocked ? (
        <div className="ad-content" onClick={handleAdClick}>
          {/* TODO: 実際のAdSenseコード or プレースホルダ */}
          <div className="ad-placeholder">
            <p>広告エリア</p>
            <p className="ad-size-info">{size[0]}</p>
          </div>
        </div>
      ) : (
        <div className="house-ad">
          <a href="/sponsors" className="house-ad-link">
            <div className="house-ad-content">
              <h3>スポンサー募集中</h3>
              <p>このツールを支援してくださるスポンサーを募集しています</p>
            </div>
          </a>
        </div>
      )}

      {closeable && (
        <button
          className="close-button"
          onClick={handleClose}
          aria-label="広告を閉じる"
        >
          ✕
        </button>
      )}

      <style jsx>{`
        .ad-unit-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 10px auto;
          position: relative;
        }

        .sticky-ad {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          padding: 8px;
          margin: 0;
        }

        .ad-label {
          font-size: 10px;
          color: #999;
          margin-bottom: 4px;
          text-align: center;
          text-transform: uppercase;
        }

        .ad-content,
        .house-ad {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ad-placeholder {
          width: 100%;
          min-height: ${height}px;
          background: #f5f5f5;
          border: 1px dashed #ccc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .ad-placeholder p {
          margin: 4px 0;
        }

        .ad-size-info {
          font-size: 11px;
          color: #bbb;
        }

        .house-ad {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          overflow: hidden;
          min-height: ${height}px;
        }

        .house-ad-link {
          text-decoration: none;
          color: white;
          display: block;
          width: 100%;
          height: 100%;
          padding: 20px;
        }

        .house-ad-content {
          text-align: center;
        }

        .house-ad-content h3 {
          font-size: 18px;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .house-ad-content p {
          font-size: 14px;
          opacity: 0.9;
        }

        .close-button {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          z-index: 10;
        }

        .close-button:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        @media print {
          .ad-unit-container {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .house-ad-content h3 {
            font-size: 16px;
          }

          .house-ad-content p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
