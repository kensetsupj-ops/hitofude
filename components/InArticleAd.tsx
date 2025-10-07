'use client';

import { useEffect, useRef, useState } from 'react';
import { adControl } from '@/lib/adControl';

interface InArticleAdProps {
  id: string;
  minHeight?: number;
}

export default function InArticleAd({ id, minHeight = 280 }: InArticleAdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [canShow, setCanShow] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 広告制御リスナー（モバイルスティッキーとの同時表示制御）
  useEffect(() => {
    const unsubscribe = adControl.subscribe((state) => {
      setCanShow(adControl.canShowInArticle());
    });

    return unsubscribe;
  }, []);

  // 表示状態の変化を広告制御に通知
  useEffect(() => {
    if (isVisible && canShow) {
      adControl.setInArticleVisible(true);
    } else {
      adControl.setInArticleVisible(false);
    }
  }, [isVisible, canShow]);

  useEffect(() => {
    // セッションストレージで表示済みかチェック
    const sessionKey = `ad-shown-${id}`;
    const alreadyShown = sessionStorage.getItem(sessionKey);

    if (alreadyShown) {
      setHasBeenShown(true);
      return;
    }

    // IntersectionObserver設定（50%可視でロード）
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !hasBeenShown) {
            setIsVisible(true);
            setHasBeenShown(true);
            sessionStorage.setItem(sessionKey, 'true');

            // viewability計測（1秒以上表示）
            setTimeout(() => {
              if (entry.isIntersecting) {
                // TODO: 実際の計測サービス（Plausible等）に送信
              }
            }, 1000);
          }
        });
      },
      {
        threshold: [0.5],
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [id, hasBeenShown]);

  // AdBlock検出
  useEffect(() => {
    if (!isVisible) return;

    const checkAdBlock = async () => {
      // 簡易AdBlock検出（実際の広告スクリプトが読み込まれるか確認）
      try {
        // TODO: 実際のAdSenseスクリプト読み込みチェック
        // 現在はダミー実装
        const blocked = false;
        setIsAdBlocked(blocked);
      } catch (error) {
        setIsAdBlocked(true);
      }
    };

    setTimeout(checkAdBlock, 500);
  }, [isVisible]);

  const handleAdClick = () => {
    // TODO: 実際の計測サービスに送信
  };

  if (hasBeenShown && !isVisible) {
    // セッションで既に表示済みの場合は何も表示しない
    return null;
  }

  // 同時表示制御：モバイルスティッキーが表示中 or 編集モード中は非表示
  const shouldRender = isVisible && canShow;

  return (
    <div
      ref={containerRef}
      className="in-article-ad-container"
      style={{
        minHeight: `${minHeight}px`,
        display: shouldRender ? 'flex' : 'none',
      }}
    >
      <div className="ad-label" role="contentinfo" aria-label="広告">
        広告
      </div>

      {shouldRender && !isAdBlocked && (
        <div className="ad-content" onClick={handleAdClick}>
          {/* TODO: 実際のAdSenseコード or プレースホルダ */}
          <div className="ad-placeholder">
            <p>広告エリア</p>
            <p className="ad-size-info">レスポンシブIn-article広告</p>
          </div>
        </div>
      )}

      {shouldRender && isAdBlocked && (
        <div className="house-ad">
          <a href="/sponsors" className="house-ad-link">
            <div className="house-ad-content">
              <h3>スポンサー募集中</h3>
              <p>このツールを支援してくださるスポンサーを募集しています</p>
            </div>
          </a>
        </div>
      )}

      <style jsx>{`
        .in-article-ad-container {
          width: 100%;
          max-width: 800px;
          margin: 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ad-label {
          font-size: 11px;
          color: #999;
          margin-bottom: 8px;
          text-align: center;
          text-transform: uppercase;
        }

        .ad-content,
        .house-ad {
          width: 100%;
          min-height: ${minHeight}px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ad-placeholder {
          width: 100%;
          height: ${minHeight}px;
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
          font-size: 12px;
          color: #bbb;
        }

        .house-ad {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          overflow: hidden;
        }

        .house-ad-link {
          text-decoration: none;
          color: white;
          display: block;
          width: 100%;
          height: 100%;
          padding: 40px 20px;
        }

        .house-ad-content {
          text-align: center;
        }

        .house-ad-content h3 {
          font-size: 24px;
          margin-bottom: 12px;
          font-weight: bold;
        }

        .house-ad-content p {
          font-size: 16px;
          opacity: 0.9;
        }

        @media print {
          .in-article-ad-container {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .in-article-ad-container {
            margin: 32px auto;
          }

          .house-ad-content h3 {
            font-size: 20px;
          }

          .house-ad-content p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}